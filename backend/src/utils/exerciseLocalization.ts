const EXERCISE_NAME_MAP: Record<string, string> = {
  'bent-over row': 'Тяга в нахилі',
  'lat pulldown': 'Тяга верхнього блоку',
  'squats': 'Присідання',
  'barbell squat': 'Присідання зі штангою',
  'dumbbell flyes': 'Розведення гантелей',
  'dumbbell fly': 'Розведення гантелей',
  'bench press': 'Жим лежачи',
  'deadlift': 'Станова тяга',
  'romanian deadlift': 'Румунська тяга',
  'push up': 'Віджимання від підлоги',
  'push-up': 'Віджимання від підлоги',
  'pull up': 'Підтягування',
  'pull-up': 'Підтягування',
  'barbell row': 'Тяга штанги в нахилі',
  'overhead press': 'Жим сидячи/стоячи',
  'shoulder press': 'Жим сидячи/стоячи',
  'bicep curl': 'Підйоми на біцепс',
  'tricep extension': 'Розгинання рук на блоці',
  plank: 'Планка',
  crunches: 'Скручування',
  running: 'Біг',
  cycling: 'Їзда на велосипеді',
  yoga: 'Йога',
};

export function localizeExerciseName(name?: string | null): string {
  if (!name) return 'Вправа';
  if (/[А-Яа-яІіЇїЄєҐґ]/.test(name)) return name;

  const normalized = name.trim().toLowerCase();
  return EXERCISE_NAME_MAP[normalized] ?? name;
}

