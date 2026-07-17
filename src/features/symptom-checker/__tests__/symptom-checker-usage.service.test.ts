import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FREE_MONTHLY_EVALUATION_LIMIT,
  getSymptomCheckerUsage,
  getUsageAllowance,
  recordClosedEvaluation,
} from '../services/symptom-checker-usage.service';

describe('symptom-checker-usage.service', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test('returns zero usage when month has no records yet', async () => {
    const result = await getSymptomCheckerUsage();

    expect(result).toMatchObject({
      completedEvaluations: 0,
      updatedAt: null,
    });
    expect(result.monthKey).toMatch(/^\d{4}-\d{2}$/);
  });

  test('increments usage when an evaluation is closed', async () => {
    const first = await recordClosedEvaluation();
    const second = await recordClosedEvaluation();

    expect(first.completedEvaluations).toBe(1);
    expect(second.completedEvaluations).toBe(2);
    expect(second.updatedAt).not.toBeNull();
  });

  test('calculates free plan allowance correctly', () => {
    expect(
      getUsageAllowance({
        isPremium: false,
        completedEvaluations:
          FREE_MONTHLY_EVALUATION_LIMIT,
      })
    ).toEqual({
      limit: FREE_MONTHLY_EVALUATION_LIMIT,
      remaining: 0,
      isBlocked: true,
    });
  });
});
