import {
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { listSymptomCheckerEvaluations } from '../services/symptom-checker-history.service';
import type { SymptomCheckerEvaluationRecord } from '../types/symptom-checker.types';

export const useSymptomCheckerHistoryScreen = () => {
  const router = useRouter();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const [records, setRecords] = useState<
    SymptomCheckerEvaluationRecord[]
  >([]);
  const [isHydrating, setIsHydrating] =
    useState(false);
  const [error, setError] = useState('');

  const hydrateHistory = async () => {
    if (!userId) {
      setRecords([]);
      setError('');
      return;
    }

    setIsHydrating(true);
    setError('');

    try {
      const nextRecords =
        await listSymptomCheckerEvaluations(
          userId
        );
      setRecords(nextRecords);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : 'No pudimos cargar el historial del Symptom Checker.'
      );
    } finally {
      setIsHydrating(false);
    }
  };

  useEffect(() => {
    void hydrateHistory();
  }, [userId]);

  return {
    records,
    isHydrating,
    error,
    hasRecords: records.length > 0,
    retry: hydrateHistory,
    handleBack: () => router.back(),
  };
};
