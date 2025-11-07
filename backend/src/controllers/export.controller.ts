import { AuthRequest } from '../types';
import { Response } from 'express';
import { prisma } from '../lib/prisma';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { handleControllerError } from '../utils/apiResponse';
import { buildWorkoutSummary, buildNutritionSummary } from '../services/exportSummary';

type DateRangeFilter = { gte?: Date; lte?: Date };

const extractFirstString = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    const candidate = value[0];
    if (typeof candidate === 'string') {
      return candidate;
    }
  }

  return undefined;
};

const parseNumberParam = (value: unknown): number | undefined => {
  const strValue = extractFirstString(value);
  if (!strValue?.trim()) {
    return undefined;
  }

  const numericValue = Number(strValue);
  if (Number.isNaN(numericValue)) {
    return undefined;
  }

  return numericValue;
};

const buildDateRangeFilter = (startValue?: unknown, endValue?: unknown): DateRangeFilter | undefined => {
  const filter: DateRangeFilter = {};

  const startDateValue = extractFirstString(startValue);
  if (startDateValue) {
    const startDate = new Date(startDateValue);
    if (!Number.isNaN(startDate.getTime())) {
      filter.gte = startDate;
    }
  }

  const endDateValue = extractFirstString(endValue);
  if (endDateValue) {
    const endDate = new Date(endDateValue);
    if (!Number.isNaN(endDate.getTime())) {
      filter.lte = endDate;
    }
  }

  return Object.keys(filter).length > 0 ? filter : undefined;
};

interface AppliedWorkoutFilters {
  type?: string;
  status?: string;
  minRating?: number;
  maxRating?: number;
}

const applyWorkoutFilters = (
  where: Record<string, unknown>,
  query: Record<string, unknown>
): AppliedWorkoutFilters => {
  const applied: AppliedWorkoutFilters = {};

  const typeValue = extractFirstString(query.type);
  if (typeValue) {
    where.type = typeValue;
    applied.type = typeValue;
  }

  const statusValue = extractFirstString(query.status);
  if (statusValue) {
    where.status = statusValue;
    applied.status = statusValue;
  }

  const ratingFilter: { gte?: number; lte?: number } = {};
  const minRatingValue = parseNumberParam(query.minRating);
  const maxRatingValue = parseNumberParam(query.maxRating);

  if (minRatingValue !== undefined) {
    ratingFilter.gte = minRatingValue;
    applied.minRating = minRatingValue;
  }

  if (maxRatingValue !== undefined) {
    ratingFilter.lte = maxRatingValue;
    applied.maxRating = maxRatingValue;
  }

  if (Object.keys(ratingFilter).length > 0) {
    where.rating = ratingFilter;
  }

  return applied;
};

interface AppliedNutritionFilters {
  mealType?: string;
  minCalories?: number;
  maxCalories?: number;
  minProtein?: number;
  maxProtein?: number;
  minCarbs?: number;
  maxCarbs?: number;
  minFat?: number;
  maxFat?: number;
}

const applyNutritionFilters = (
  where: Record<string, unknown>,
  query: Record<string, unknown>
): AppliedNutritionFilters => {
  const applied: AppliedNutritionFilters = {};

  const mealTypeValue = extractFirstString(query.mealType);
  if (mealTypeValue) {
    where.mealType = mealTypeValue;
    applied.mealType = mealTypeValue;
  }

  const macroFilter: Record<string, { gte?: number; lte?: number }> = {};
  const minCaloriesValue = parseNumberParam(query.minCalories);
  const maxCaloriesValue = parseNumberParam(query.maxCalories);
  const minProteinValue = parseNumberParam(query.minProtein);
  const maxProteinValue = parseNumberParam(query.maxProtein);
  const minCarbsValue = parseNumberParam(query.minCarbs);
  const maxCarbsValue = parseNumberParam(query.maxCarbs);
  const minFatValue = parseNumberParam(query.minFat);
  const maxFatValue = parseNumberParam(query.maxFat);

  const buildRange = (min?: number, max?: number) => {
    const range: { gte?: number; lte?: number } = {};
    if (min !== undefined) range.gte = min;
    if (max !== undefined) range.lte = max;
    return Object.keys(range).length > 0 ? range : undefined;
  };

  const caloriesRange = buildRange(minCaloriesValue, maxCaloriesValue);
  if (caloriesRange) {
    macroFilter.calories = caloriesRange;
    if (minCaloriesValue !== undefined) applied.minCalories = minCaloriesValue;
    if (maxCaloriesValue !== undefined) applied.maxCalories = maxCaloriesValue;
  }

  const proteinRange = buildRange(minProteinValue, maxProteinValue);
  if (proteinRange) {
    macroFilter.protein = proteinRange;
    if (minProteinValue !== undefined) applied.minProtein = minProteinValue;
    if (maxProteinValue !== undefined) applied.maxProtein = maxProteinValue;
  }

  const carbsRange = buildRange(minCarbsValue, maxCarbsValue);
  if (carbsRange) {
    macroFilter.carbs = carbsRange;
    if (minCarbsValue !== undefined) applied.minCarbs = minCarbsValue;
    if (maxCarbsValue !== undefined) applied.maxCarbs = maxCarbsValue;
  }

  const fatRange = buildRange(minFatValue, maxFatValue);
  if (fatRange) {
    macroFilter.fat = fatRange;
    if (minFatValue !== undefined) applied.minFat = minFatValue;
    if (maxFatValue !== undefined) applied.maxFat = maxFatValue;
  }

  if (Object.keys(macroFilter).length > 0) {
    where.items = {
      some: macroFilter,
    };
  }

  return applied;
};

const formatDate = (value?: Date) =>
  value ? value.toLocaleDateString('uk-UA', { year: 'numeric', month: '2-digit', day: '2-digit' }) : undefined;

const buildWorkoutFilterDescription = (
  baseFilters: AppliedWorkoutFilters,
  dateRange: { start?: Date; end?: Date }
) => {
  const segments: string[] = [];

  if (dateRange.start) {
    segments.push(`з ${formatDate(dateRange.start)}`);
  }

  if (dateRange.end) {
    segments.push(`до ${formatDate(dateRange.end)}`);
  }

  if (baseFilters.type) {
    segments.push(`тип: ${baseFilters.type}`);
  }

  if (baseFilters.status) {
    segments.push(`статус: ${baseFilters.status}`);
  }

  if (baseFilters.minRating !== undefined) {
    segments.push(`мін. оцінка ≥ ${baseFilters.minRating}`);
  }

  if (baseFilters.maxRating !== undefined) {
    segments.push(`макс. оцінка ≤ ${baseFilters.maxRating}`);
  }

  return segments.join(', ');
};

const buildNutritionFilterDescription = (
  baseFilters: AppliedNutritionFilters,
  dateRange: { start?: Date; end?: Date }
) => {
  const segments: string[] = [];

  if (dateRange.start) {
    segments.push(`з ${formatDate(dateRange.start)}`);
  }

  if (dateRange.end) {
    segments.push(`до ${formatDate(dateRange.end)}`);
  }

  if (baseFilters.mealType) {
    segments.push(`тип прийому: ${baseFilters.mealType}`);
  }

  const addMacro = (label: string, min?: number, max?: number) => {
    if (min !== undefined && max !== undefined) {
      segments.push(`${label}: ${min}-${max}`);
    } else if (min !== undefined) {
      segments.push(`${label} ≥ ${min}`);
    } else if (max !== undefined) {
      segments.push(`${label} ≤ ${max}`);
    }
  };

  addMacro('калорії', baseFilters.minCalories, baseFilters.maxCalories);
  addMacro('білки', baseFilters.minProtein, baseFilters.maxProtein);
  addMacro('вуглеводи', baseFilters.minCarbs, baseFilters.maxCarbs);
  addMacro('жири', baseFilters.minFat, baseFilters.maxFat);

  return segments.join(', ');
};

// Експорт тренувань у Excel
export const exportWorkoutsExcel = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate, ...restQuery } = req.query;

    const where: Record<string, unknown> = { userId };
    const dateRangeFilter = buildDateRangeFilter(startDate, endDate);
    if (dateRangeFilter) {
      where.date = dateRangeFilter;
    }
    const appliedFilters = applyWorkoutFilters(where, restQuery);

    const workouts = await prisma.workout.findMany({
      where,
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    const summary = buildWorkoutSummary(
      workouts.map(workout => ({
        date: new Date(workout.date),
        duration: workout.duration,
        rating: workout.rating,
        exercises: workout.exercises,
      }))
    );
    const filterDescription = buildWorkoutFilterDescription(appliedFilters, summary.dateRange);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Тренування');

    // Заголовки
    worksheet.columns = [
      { header: 'Дата', key: 'date', width: 15 },
      { header: 'Тип', key: 'type', width: 15 },
      { header: 'Тривалість (хв)', key: 'duration', width: 15 },
      { header: 'Оцінка', key: 'rating', width: 10 },
      { header: 'Кількість вправ', key: 'exercisesCount', width: 15 },
      { header: 'Нотатки', key: 'notes', width: 30 }
    ];

    // Дані
    workouts.forEach(workout => {
      worksheet.addRow({
        date: new Date(workout.date).toLocaleDateString('uk-UA'),
        type: workout.type || '-',
        duration: workout.duration || '-',
        rating: workout.rating || '-',
        exercisesCount: workout.exercises.length,
        notes: workout.notes || '-'
      });
    });

    // Стилізація заголовків
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD4AF37' }
    };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=trenuvannya_${new Date().toISOString().split('T')[0]}.xlsx`);

    const summarySheet = workbook.addWorksheet('Підсумки');
    summarySheet.columns = [
      { header: 'Метрика', key: 'metric', width: 32 },
      { header: 'Значення', key: 'value', width: 30 }
    ];
    summarySheet.addRow({ metric: 'Кількість тренувань', value: summary.totalWorkouts });
    summarySheet.addRow({ metric: 'Сумарна тривалість (хв)', value: summary.totalDuration });
    summarySheet.addRow({ metric: 'Середня тривалість (хв)', value: summary.averageDuration.toFixed(1) });
    summarySheet.addRow({ metric: 'Загальна кількість вправ', value: summary.totalExercises });
    summarySheet.addRow({ metric: 'Середня оцінка', value: summary.averageRating.toFixed(2) });
    summarySheet.addRow({
      metric: 'Період',
      value:
        summary.dateRange.start && summary.dateRange.end
          ? `${formatDate(summary.dateRange.start)} — ${formatDate(summary.dateRange.end)}`
          : 'Н/д'
    });
    summarySheet.addRow({
      metric: 'Застосовані фільтри',
      value: filterDescription || 'Не застосовувались'
    });
    summarySheet.getRow(1).font = { bold: true };

    await workbook.xlsx.write(res);
    res.end();
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'ExportController',
      operation: 'exportWorkoutsExcel',
      errorTitle: 'Помилка експорту тренувань',
      userMessage: 'Не вдалося сформувати Excel-файл тренувань.',
    });
  }
};

// Експорт тренувань у PDF
export const exportWorkoutsPDF = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate, ...restQuery } = req.query;

    const where: Record<string, unknown> = { userId };
    const dateRangeFilter = buildDateRangeFilter(startDate, endDate);
    if (dateRangeFilter) {
      where.date = dateRangeFilter;
    }
    const appliedFilters = applyWorkoutFilters(where, restQuery);

    const workouts = await prisma.workout.findMany({
      where,
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    const summary = buildWorkoutSummary(
      workouts.map(workout => ({
        date: new Date(workout.date),
        duration: workout.duration,
        rating: workout.rating,
        exercises: workout.exercises,
      }))
    );
    const filterDescription = buildWorkoutFilterDescription(appliedFilters, summary.dateRange);

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=trenuvannya_${new Date().toISOString().split('T')[0]}.pdf`);

    doc.pipe(res);

    // Заголовок
    doc.fontSize(20).text('Звіт про тренування', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Кількість тренувань: ${summary.totalWorkouts}`);
    doc.text(`Сумарна тривалість: ${summary.totalDuration} хв`);
    doc.text(`Середня тривалість: ${summary.averageDuration.toFixed(1)} хв`);
    doc.text(`Загальна кількість вправ: ${summary.totalExercises}`);
    doc.text(`Середня оцінка: ${summary.averageRating.toFixed(2)}`);

    if (summary.dateRange.start && summary.dateRange.end) {
      doc.text(
        `Період: ${formatDate(summary.dateRange.start)} — ${formatDate(summary.dateRange.end)}`
      );
    }

    if (filterDescription) {
      doc.text(`Фільтри: ${filterDescription}`);
    }

    doc.moveDown();

    if (startDate || endDate) {
      doc.fontSize(12).text(
        `Період: ${startDate ? new Date(startDate as string).toLocaleDateString('uk-UA') : 'з початку'} - ${endDate ? new Date(endDate as string).toLocaleDateString('uk-UA') : 'до сьогодні'}`,
        { align: 'center' }
      );
      doc.moveDown();
    }

    // Тренування
    workouts.forEach((workout, index) => {
      if (index > 0) doc.moveDown(2);

      doc.fontSize(16).text(
        `Тренування ${new Date(workout.date).toLocaleDateString('uk-UA')}`,
        { underline: true }
      );
      doc.moveDown(0.5);

      if (workout.type) {
        doc.fontSize(12).text(`Тип: ${workout.type}`);
      }
      if (workout.duration) {
        doc.fontSize(12).text(`Тривалість: ${workout.duration} хвилин`);
      }
      if (workout.rating) {
        doc.fontSize(12).text(`Оцінка: ${workout.rating}/5`);
      }

      doc.moveDown(0.5);
      doc.fontSize(14).text('Вправи:', { underline: true });
      doc.moveDown(0.3);

      workout.exercises.forEach((ex, idx) => {
        const exerciseName = ex.exercise?.name || ex.customName || 'Вправа';
        let exerciseText = `${idx + 1}. ${exerciseName}`;
        
        if (ex.sets && ex.reps) {
          exerciseText += ` - ${ex.sets}x${ex.reps}`;
        }
        if (ex.weight) {
          exerciseText += ` @ ${ex.weight}кг`;
        }

        doc.fontSize(11).text(exerciseText);
      });

      if (workout.notes) {
        doc.moveDown(0.5);
        doc.fontSize(12);
        doc.font('Helvetica-Oblique');
        doc.text(`Нотатки: ${workout.notes}`);
        doc.font('Helvetica');
      }
    });

    doc.end();
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'ExportController',
      operation: 'exportWorkoutsPDF',
      errorTitle: 'Помилка експорту тренувань',
      userMessage: 'Не вдалося сформувати PDF зі звітом тренувань.',
    });
  }
};

// Експорт харчування у Excel
export const exportNutritionExcel = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate, ...restQuery } = req.query;

    const where: Record<string, unknown> = { userId };
    const dateRangeFilter = buildDateRangeFilter(startDate, endDate);
    if (dateRangeFilter) {
      where.date = dateRangeFilter;
    }
    const appliedFilters = applyNutritionFilters(where, restQuery);

    const logs = await prisma.nutritionLog.findMany({
      where,
      include: {
        items: true
      },
      orderBy: { date: 'desc' }
    });

    const summary = buildNutritionSummary(
      logs.map(log => ({
        date: new Date(log.date),
        mealType: log.mealType,
        items: log.items.map(item => ({
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
        })),
      }))
    );
    const filterDescription = buildNutritionFilterDescription(appliedFilters, summary.dateRange);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Харчування');

    worksheet.columns = [
      { header: 'Дата', key: 'date', width: 15 },
      { header: 'Тип прийому', key: 'mealType', width: 15 },
      { header: 'Продукт', key: 'item', width: 25 },
      { header: 'Кількість (г)', key: 'amount', width: 15 },
      { header: 'Калорії', key: 'calories', width: 12 },
      { header: 'Білки (г)', key: 'protein', width: 12 },
      { header: 'Вуглеводи (г)', key: 'carbs', width: 12 },
      { header: 'Жири (г)', key: 'fat', width: 12 }
    ];

    logs.forEach(log => {
      log.items.forEach(item => {
        worksheet.addRow({
          date: new Date(log.date).toLocaleDateString('uk-UA'),
          mealType: log.mealType,
          item: item.nameUk || item.name,
          amount: item.amount,
          calories: item.calories.toFixed(1),
          protein: item.protein.toFixed(1),
          carbs: item.carbs.toFixed(1),
          fat: item.fat.toFixed(1)
        });
      });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD4AF37' }
    };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=kharchuvannya_${new Date().toISOString().split('T')[0]}.xlsx`);

    const summarySheet = workbook.addWorksheet('Підсумки');
    summarySheet.columns = [
      { header: 'Метрика', key: 'metric', width: 32 },
      { header: 'Значення', key: 'value', width: 30 }
    ];
    summarySheet.addRow({ metric: 'Кількість записів', value: summary.totalLogs });
    summarySheet.addRow({ metric: 'Сумарні калорії', value: summary.totalCalories.toFixed(1) });
    summarySheet.addRow({ metric: 'Середні калорії на запис', value: summary.averageCaloriesPerLog.toFixed(1) });
    summarySheet.addRow({ metric: 'Середні калорії на день', value: summary.averageCaloriesPerDay.toFixed(1) });
    summarySheet.addRow({ metric: 'Сумарні білки (г)', value: summary.totalProtein.toFixed(1) });
    summarySheet.addRow({ metric: 'Сумарні вуглеводи (г)', value: summary.totalCarbs.toFixed(1) });
    summarySheet.addRow({ metric: 'Сумарні жири (г)', value: summary.totalFat.toFixed(1) });
    summarySheet.addRow({
      metric: 'Період',
      value:
        summary.dateRange.start && summary.dateRange.end
          ? `${formatDate(summary.dateRange.start)} — ${formatDate(summary.dateRange.end)}`
          : 'Н/д'
    });
    summarySheet.addRow({
      metric: 'Розподіл за типами',
      value: Object.entries(summary.mealTypeDistribution)
        .map(([mealType, count]) => `${mealType}: ${count}`)
        .join(', ') || 'Н/д'
    });
    summarySheet.addRow({
      metric: 'Застосовані фільтри',
      value: filterDescription || 'Не застосовувались'
    });
    summarySheet.getRow(1).font = { bold: true };

    await workbook.xlsx.write(res);
    res.end();
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'ExportController',
      operation: 'exportNutritionExcel',
      errorTitle: 'Помилка експорту харчування',
      userMessage: 'Не вдалося сформувати Excel-файл харчування.',
    });
  }
};

// Експорт харчування у PDF
export const exportNutritionPDF = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate, ...restQuery } = req.query;

    const where: Record<string, unknown> = { userId };
    const dateRangeFilter = buildDateRangeFilter(startDate, endDate);
    if (dateRangeFilter) {
      where.date = dateRangeFilter;
    }
    const appliedFilters = applyNutritionFilters(where, restQuery);

    const logs = await prisma.nutritionLog.findMany({
      where,
      include: {
        items: true
      },
      orderBy: { date: 'desc' }
    });

    const summary = buildNutritionSummary(
      logs.map(log => ({
        date: new Date(log.date),
        mealType: log.mealType,
        items: log.items.map(item => ({
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
        })),
      }))
    );
    const filterDescription = buildNutritionFilterDescription(appliedFilters, summary.dateRange);

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=kharchuvannya_${new Date().toISOString().split('T')[0]}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('Звіт про харчування', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Кількість записів: ${summary.totalLogs}`);
    doc.text(`Сумарні калорії: ${summary.totalCalories.toFixed(1)} ккал`);
    doc.text(`Сумарні білки: ${summary.totalProtein.toFixed(1)} г`);
    doc.text(`Сумарні вуглеводи: ${summary.totalCarbs.toFixed(1)} г`);
    doc.text(`Сумарні жири: ${summary.totalFat.toFixed(1)} г`);
    doc.text(`Середні калорії на запис: ${summary.averageCaloriesPerLog.toFixed(1)} ккал`);
    doc.text(`Середні калорії на день: ${summary.averageCaloriesPerDay.toFixed(1)} ккал`);

    if (summary.dateRange.start && summary.dateRange.end) {
      doc.text(
        `Період: ${formatDate(summary.dateRange.start)} — ${formatDate(summary.dateRange.end)}`
      );
    }

    if (filterDescription) {
      doc.text(`Фільтри: ${filterDescription}`);
    }

    doc.moveDown();

    if (startDate || endDate) {
      doc.fontSize(12).text(
        `Період: ${startDate ? new Date(startDate as string).toLocaleDateString('uk-UA') : 'з початку'} - ${endDate ? new Date(endDate as string).toLocaleDateString('uk-UA') : 'до сьогодні'}`,
        { align: 'center' }
      );
      doc.moveDown();
    }

    // Групуємо по датах
    const logsByDate: Record<string, typeof logs> = {};
    logs.forEach(log => {
      const dateKey = new Date(log.date).toLocaleDateString('uk-UA');
      if (!logsByDate[dateKey]) {
        logsByDate[dateKey] = [];
      }
      logsByDate[dateKey].push(log);
    });

    Object.keys(logsByDate).forEach((dateKey, index) => {
      if (index > 0) doc.moveDown(2);

      doc.fontSize(16).text(dateKey, { underline: true });
      doc.moveDown(0.5);

      const dayLogs = logsByDate[dateKey];
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;

      dayLogs.forEach(log => {
        log.items.forEach(item => {
          totalCalories += item.calories;
          totalProtein += item.protein;
          totalCarbs += item.carbs;
          totalFat += item.fat;

          doc.fontSize(12).text(`${log.mealType}: ${item.nameUk || item.name}`);
          doc.fontSize(10).text(
            `  ${item.amount}г | ${item.calories.toFixed(1)} ккал | Б: ${item.protein.toFixed(1)}г | В: ${item.carbs.toFixed(1)}г | Ж: ${item.fat.toFixed(1)}г`,
            { indent: 20 }
          );
        });
      });

      doc.moveDown(0.5);
      doc.fontSize(14).text('День:', { underline: true });
      doc.fontSize(12).text(
        `Всього: ${totalCalories.toFixed(1)} ккал | Білки: ${totalProtein.toFixed(1)}г | Вуглеводи: ${totalCarbs.toFixed(1)}г | Жири: ${totalFat.toFixed(1)}г`
      );
    });

    doc.end();
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'ExportController',
      operation: 'exportNutritionPDF',
      errorTitle: 'Помилка експорту харчування',
      userMessage: 'Не вдалося сформувати PDF зі звітом харчування.',
    });
  }
};

