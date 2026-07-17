import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SymptomCheckerUsageSnapshot {
  monthKey: string;
  completedEvaluations: number;
  updatedAt: string | null;
}

export interface SymptomCheckerUsageAllowance {
  limit: number | null;
  remaining: number | null;
  isBlocked: boolean;
}

const USAGE_STORAGE_PREFIX =
  'pcn:symptom-checker:usage';
export const FREE_MONTHLY_EVALUATION_LIMIT = 3;

const getCurrentMonthKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(
    2,
    '0'
  );

  return `${year}-${month}`;
};

const getStorageKey = (monthKey: string) =>
  `${USAGE_STORAGE_PREFIX}:${monthKey}`;

const mapUsageError = (action: 'load' | 'record') =>
  new Error(
    action === 'load'
      ? 'No pudimos cargar el uso del Symptom Checker.'
      : 'No pudimos registrar el cierre de la evaluación.'
  );

const sanitizeUsageSnapshot = (
  value: unknown,
  monthKey: string
): SymptomCheckerUsageSnapshot => {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return {
      monthKey,
      completedEvaluations: 0,
      updatedAt: null,
    };
  }

  const candidate =
    value as Partial<SymptomCheckerUsageSnapshot>;

  return {
    monthKey,
    completedEvaluations:
      typeof candidate.completedEvaluations ===
        'number' &&
      candidate.completedEvaluations >= 0
        ? candidate.completedEvaluations
        : 0,
    updatedAt:
      typeof candidate.updatedAt === 'string'
        ? candidate.updatedAt
        : null,
  };
};

export const getSymptomCheckerUsage =
  async (): Promise<SymptomCheckerUsageSnapshot> => {
    const monthKey = getCurrentMonthKey();

    try {
      const rawValue = await AsyncStorage.getItem(
        getStorageKey(monthKey)
      );

      if (!rawValue) {
        return {
          monthKey,
          completedEvaluations: 0,
          updatedAt: null,
        };
      }

      return sanitizeUsageSnapshot(
        JSON.parse(rawValue),
        monthKey
      );
    } catch {
      throw mapUsageError('load');
    }
  };

export const recordClosedEvaluation =
  async (): Promise<SymptomCheckerUsageSnapshot> => {
    try {
      const currentUsage =
        await getSymptomCheckerUsage();
      const nextUsage: SymptomCheckerUsageSnapshot = {
        ...currentUsage,
        completedEvaluations:
          currentUsage.completedEvaluations + 1,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        getStorageKey(nextUsage.monthKey),
        JSON.stringify(nextUsage)
      );

      return nextUsage;
    } catch {
      throw mapUsageError('record');
    }
  };

export const getUsageAllowance = ({
  isPremium,
  completedEvaluations,
}: {
  isPremium: boolean;
  completedEvaluations: number;
}): SymptomCheckerUsageAllowance => {
  if (isPremium) {
    return {
      limit: null,
      remaining: null,
      isBlocked: false,
    };
  }

  const remaining = Math.max(
    0,
    FREE_MONTHLY_EVALUATION_LIMIT -
      completedEvaluations
  );

  return {
    limit: FREE_MONTHLY_EVALUATION_LIMIT,
    remaining,
    isBlocked: remaining <= 0,
  };
};
