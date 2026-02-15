export type DateRangeFilter = { gte?: Date; lte?: Date };

export const extractFirstString = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    return value[0];
  }
  return undefined;
};

export const parseNumberParam = (value: unknown): number | undefined => {
  const strValue = extractFirstString(value);
  if (!strValue?.trim()) return undefined;
  const n = Number(strValue);
  return Number.isNaN(n) ? undefined : n;
};

export const buildDateRangeFilter = (startValue?: unknown, endValue?: unknown): DateRangeFilter | undefined => {
  const filter: DateRangeFilter = {};
  const start = extractFirstString(startValue);
  if (start) {
    const d = new Date(start);
    if (!Number.isNaN(d.getTime())) filter.gte = d;
  }
  const end = extractFirstString(endValue);
  if (end) {
    const d = new Date(end);
    if (!Number.isNaN(d.getTime())) filter.lte = d;
  }
  return Object.keys(filter).length > 0 ? filter : undefined;
};

export interface AppliedWorkoutFilters {
  type?: string;
  status?: string;
  minRating?: number;
  maxRating?: number;
}

export const applyWorkoutFilters = (
  where: Record<string, unknown>,
  query: Record<string, unknown>
): AppliedWorkoutFilters => {
  const applied: AppliedWorkoutFilters = {};
  const typeVal = extractFirstString(query.type);
  if (typeVal) {
    where.type = typeVal;
    applied.type = typeVal;
  }
  const statusVal = extractFirstString(query.status);
  if (statusVal) {
    where.status = statusVal;
    applied.status = statusVal;
  }
  const minR = parseNumberParam(query.minRating);
  const maxR = parseNumberParam(query.maxRating);
  const ratingFilter: { gte?: number; lte?: number } = {};
  if (minR !== undefined) {
    ratingFilter.gte = minR;
    applied.minRating = minR;
  }
  if (maxR !== undefined) {
    ratingFilter.lte = maxR;
    applied.maxRating = maxR;
  }
  if (Object.keys(ratingFilter).length > 0) where.rating = ratingFilter;
  return applied;
};

export interface AppliedNutritionFilters {
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

const buildRange = (min?: number, max?: number) => {
  const range: { gte?: number; lte?: number } = {};
  if (min !== undefined) range.gte = min;
  if (max !== undefined) range.lte = max;
  return Object.keys(range).length > 0 ? range : undefined;
};

export const applyNutritionFilters = (
  where: Record<string, unknown>,
  query: Record<string, unknown>
): AppliedNutritionFilters => {
  const applied: AppliedNutritionFilters = {};
  const mealType = extractFirstString(query.mealType);
  if (mealType) {
    where.mealType = mealType;
    applied.mealType = mealType;
  }
  const macroFilter: Record<string, { gte?: number; lte?: number }> = {};
  const minCal = parseNumberParam(query.minCalories);
  const maxCal = parseNumberParam(query.maxCalories);
  const minPro = parseNumberParam(query.minProtein);
  const maxPro = parseNumberParam(query.maxProtein);
  const minCarb = parseNumberParam(query.minCarbs);
  const maxCarb = parseNumberParam(query.maxCarbs);
  const minFat = parseNumberParam(query.minFat);
  const maxFat = parseNumberParam(query.maxFat);

  const calRange = buildRange(minCal, maxCal);
  if (calRange) {
    macroFilter.calories = calRange;
    if (minCal !== undefined) applied.minCalories = minCal;
    if (maxCal !== undefined) applied.maxCalories = maxCal;
  }
  const proRange = buildRange(minPro, maxPro);
  if (proRange) {
    macroFilter.protein = proRange;
    if (minPro !== undefined) applied.minProtein = minPro;
    if (maxPro !== undefined) applied.maxProtein = maxPro;
  }
  const carbRange = buildRange(minCarb, maxCarb);
  if (carbRange) {
    macroFilter.carbs = carbRange;
    if (minCarb !== undefined) applied.minCarbs = minCarb;
    if (maxCarb !== undefined) applied.maxCarbs = maxCarb;
  }
  const fatRange = buildRange(minFat, maxFat);
  if (fatRange) {
    macroFilter.fat = fatRange;
    if (minFat !== undefined) applied.minFat = minFat;
    if (maxFat !== undefined) applied.maxFat = maxFat;
  }
  if (Object.keys(macroFilter).length > 0) {
    where.items = { some: macroFilter };
  }
  return applied;
};

export const formatDate = (value?: Date) =>
  value ? value.toLocaleDateString('uk-UA', { year: 'numeric', month: '2-digit', day: '2-digit' }) : undefined;

export const buildWorkoutFilterDescription = (
  base: AppliedWorkoutFilters,
  dateRange: { start?: Date; end?: Date }
) => {
  const seg: string[] = [];
  if (dateRange.start) seg.push(`з ${formatDate(dateRange.start)}`);
  if (dateRange.end) seg.push(`до ${formatDate(dateRange.end)}`);
  if (base.type) seg.push(`тип: ${base.type}`);
  if (base.status) seg.push(`статус: ${base.status}`);
  if (base.minRating !== undefined) seg.push(`мін. оцінка >= ${base.minRating}`);
  if (base.maxRating !== undefined) seg.push(`макс. оцінка <= ${base.maxRating}`);
  return seg.join(', ');
};

export const buildNutritionFilterDescription = (
  base: AppliedNutritionFilters,
  dateRange: { start?: Date; end?: Date }
) => {
  const seg: string[] = [];
  if (dateRange.start) seg.push(`з ${formatDate(dateRange.start)}`);
  if (dateRange.end) seg.push(`до ${formatDate(dateRange.end)}`);
  if (base.mealType) seg.push(`тип прийому: ${base.mealType}`);
  const add = (label: string, min?: number, max?: number) => {
    if (min !== undefined && max !== undefined) seg.push(`${label}: ${min}-${max}`);
    else if (min !== undefined) seg.push(`${label} >= ${min}`);
    else if (max !== undefined) seg.push(`${label} <= ${max}`);
  };
  add('калорії', base.minCalories, base.maxCalories);
  add('білки', base.minProtein, base.maxProtein);
  add('вуглеводи', base.minCarbs, base.maxCarbs);
  add('жири', base.minFat, base.maxFat);
  return seg.join(', ');
};
