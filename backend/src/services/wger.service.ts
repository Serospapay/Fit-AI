import axios from 'axios';
import logger from '../lib/logger';

const WGER_BASE_URL = 'https://wger.de/api/v2';
const PAGE_SIZE = 100;

interface WgerExerciseInfo {
  id: number;
  uuid: string;
  category: {
    id: number;
    name: string;
  };
  muscles: Array<{
    id: number;
    name: string;
    name_en: string;
  }>;
  muscles_secondary: Array<{
    id: number;
    name: string;
    name_en: string;
  }>;
  equipment: Array<{
    id: number;
    name: string;
  }>;
  translations: Array<{
    name: string;
    description: string;
    language: number;
  }>;
  images: Array<{
    id: number;
    image: string;
  }>;
  videos: Array<{
    id: number;
    video: string;
  }>;
}

interface MappedExercise {
  name: string;
  nameUk: string;
  description: string;
  descriptionUk: string;
  type: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  location: string;
  goal: string;
  instructions: string;
  instructionsUk: string;
  tips: string;
  tipsUk: string;
  warnings: string;
  warningsUk: string;
  imageUrl: string | null;
  videoUrl: string | null;
  caloriesPerMin: number | null;
}

// Category to type mapping
const categoryToType: { [key: string]: string } = {
  'Arms': 'strength',
  'Back': 'strength',
  'Calves': 'strength',
  'Chest': 'strength',
  'Legs': 'strength',
  'Shoulders': 'strength',
  'Abs': 'strength',
  'Biceps': 'strength',
  'Triceps': 'strength',
  'Cardio': 'cardio',
  'Plyometrics': 'cardio',
  'Strongman': 'strength',
  'Olympic Weightlifting': 'strength',
  'Cardiovascular': 'cardio',
  'Waist': 'strength',
  'Full Body': 'strength',
  'Upper Arms': 'strength',
  'Forearms': 'strength',
  'Upper Legs': 'strength',
  'Lower Legs': 'strength',
  'Neck': 'strength',
  'Lower Back': 'strength'
};

// Muscle to goal mapping
const muscleToGoal: { [key: string]: string } = {
  'Cardio': 'endurance',
  'Full body': 'maintain',
  'Upper body': 'gain_muscle',
  'Lower body': 'gain_muscle',
  'Core': 'definition'
};

// Equipment to location mapping
const equipmentToLocation: { [key: string]: string } = {
  'none (bodyweight exercise)': 'home',
  'Barbell': 'gym',
  'Dumbbell': 'gym',
  'Dumbbells': 'gym',
  'Kettlebell': 'gym',
  'Machine': 'gym',
  'Smith machine': 'gym',
  'Cable': 'gym',
  'Other': 'gym',
  'Medicine ball': 'gym',
  'Bench': 'gym',
  'Pull-up bar': 'gym',
  'Resistance Band': 'home'
};

// Simple Ukrainian translation dictionary
const ukrainianTranslations: { [key: string]: string } = {
  'Chest': 'Груди',
  'Back': 'Спина',
  'Legs': 'Ноги',
  'Shoulders': 'Плечі',
  'Arms': 'Руки',
  'Abs': 'Прес',
  'Biceps': 'Біцепси',
  'Triceps': 'Тріцепси',
  'Calves': 'Ікри',
  'Forearms': 'Передпліччя',
  'Cardio': 'Кардіо',
  'Full Body': 'Все тіло',
  'Upper Arms': 'Верхні руки',
  'Lower Legs': 'Нижні ноги',
  'Upper Legs': 'Верхні ноги',
  'Neck': 'Шия',
  'Lower Back': 'Нижня спина',
  'Waist': 'Талія'
};

// Extract main muscle group
function extractMainMuscleGroup(muscles: any[], secondary: any[]): string {
  const allMuscles = [...muscles, ...secondary];
  if (allMuscles.length === 0) return 'full_body';
  
  // Map to our schema
  const muscleMap: { [key: string]: string } = {
    'Pectoralis major': 'chest',
    'Anterior deltoid': 'shoulders',
    'Latissimus dorsi': 'back',
    'Trapezius': 'back',
    'Rectus abdominis': 'core',
    'Biceps brachii': 'arms',
    'Triceps brachii': 'arms',
    'Quadriceps femoris': 'legs',
    'Hamstrings': 'legs',
    'Gastrocnemius': 'legs',
    'Gluteus maximus': 'legs'
  };

  const muscleName = allMuscles[0].name_en || allMuscles[0].name;
  return muscleMap[muscleName] || 'full_body';
}

// Map equipment
function mapEquipment(eq: string): string {
  const eqMap: { [key: string]: string } = {
    'none (bodyweight exercise)': 'bodyweight',
    'Barbell': 'barbell',
    'Dumbbells': 'dumbbells',
    'Kettlebell': 'kettlebell',
    'Machine': 'machine',
    'Smith machine': 'machine',
    'Cable': 'machine',
    'Other': 'bodyweight',
    'Medicine ball': 'bodyweight',
    'Bench': 'bodyweight',
    'Pull-up bar': 'bodyweight',
    'Resistance Band': 'resistance_band'
  };
  return eqMap[eq] || 'bodyweight';
}

// Estimate calories based on type and category
function estimateCaloriesPerMin(type: string, category: string): number {
  if (type === 'cardio') return 10;
  if (category.includes('Body') || category.includes('Full')) return 8;
  return 6;
}

// Simple HTML to text conversion
function htmlToText(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Fetch all exercises from Wger
export async function fetchAllExercisesFromWger(): Promise<WgerExerciseInfo[]> {
  const allExercises: WgerExerciseInfo[] = [];
  let offset = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      logger.info(`Fetching Wger exercises, offset: ${offset}`);
      
      const response = await axios.get(`${WGER_BASE_URL}/exerciseinfo/`, {
        params: {
          limit: PAGE_SIZE,
          offset: offset
        },
        timeout: 10000
      });

      const data = response.data as any;
      allExercises.push(...data.results);

      hasMore = data.next !== null;
      offset += PAGE_SIZE;

      // Add delay to respect rate limits
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    logger.info(`Total exercises fetched from Wger: ${allExercises.length}`);
    return allExercises;
  } catch (error: any) {
    logger.error('Error fetching from Wger:', error.message);
    throw error;
  }
}

// Map Wger exercise to our database schema
export function mapWgerToOurSchema(wgerEx: WgerExerciseInfo): MappedExercise {
  // Get English translation (usually first or language_id=2)
  const englishTranslation = wgerEx.translations.find(t => t.language === 2) 
    || wgerEx.translations[0];

  const description = englishTranslation?.description || '';
  const categoryName = wgerEx.category.name;
  const type = categoryToType[categoryName] || 'strength';
  const muscleGroup = extractMainMuscleGroup(wgerEx.muscles, wgerEx.muscles_secondary);
  const equipment = wgerEx.equipment[0]?.name || 'none';
  const equipmentMapped = mapEquipment(equipment);
  const location = equipmentToLocation[equipment] || 'home';
  const goal = muscleToGoal[muscleGroup] || 'maintain';

  // Get image (if exists)
  const imageUrl = wgerEx.images.length > 0 
    ? `https://wger.de${wgerEx.images[0].image}` 
    : null;

  // Get video (if exists)
  const videoUrl = wgerEx.videos.length > 0 
    ? wgerEx.videos[0].video 
    : null;

  const name = englishTranslation?.name || 'Unknown Exercise';
  const nameUk = ukrainianTranslations[categoryName] 
    ? `${ukrainianTranslations[categoryName]}: ${name}`
    : name;

  const descriptionText = htmlToText(description);
  const descriptionUk = descriptionText;

  // Extract instructions from description
  const instructions = descriptionText.split(/\.(?=\s*[A-Z])/)[0] || descriptionText.substring(0, 200);
  const instructionsUk = instructions;

  // Simple tips extraction
  const tips = 'Слідкуйте за технікою виконання.';
  const tipsUk = 'Слідкуйте за технікою виконання.';

  // Simple warnings
  const warnings = 'При незручностях або болі зупиніть вправу.';
  const warningsUk = 'При незручностях або болі зупиніть вправу.';

  const caloriesPerMin = estimateCaloriesPerMin(type, categoryName);

  return {
    name,
    nameUk,
    description: descriptionText || 'No description available',
    descriptionUk,
    type,
    muscleGroup,
    equipment: equipmentMapped,
    difficulty: 'intermediate', // Default
    location,
    goal,
    instructions: instructions || 'Standard exercise form',
    instructionsUk,
    tips,
    tipsUk,
    warnings,
    warningsUk,
    imageUrl,
    videoUrl,
    caloriesPerMin
  };
}

