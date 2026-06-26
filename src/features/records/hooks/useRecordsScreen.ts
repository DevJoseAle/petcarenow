import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useFocusEffect,
  useRouter,
} from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetStore } from '@/features/pets/store/pet.store';
import { listPetRecords } from '../services/record.service';
import type {
  PetRecord,
  PetRecordType,
} from '../types/record.types';

export const useRecordsScreen = () => {
  const router = useRouter();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const {
    pets,
    activePetId,
    isHydrating: isPetsHydrating,
    hydratePets,
  } = usePetStore();
  const activePet =
    pets.find((pet) => pet.id === activePetId) ??
    pets[0] ??
    null;
  const [records, setRecords] = useState<PetRecord[]>(
    []
  );
  const [selectedType, setSelectedType] = useState<
    PetRecordType | 'all'
  >('all');
  const [isHydrating, setIsHydrating] =
    useState(false);
  const [isRefreshing, setIsRefreshing] =
    useState(false);
  const [generalError, setGeneralError] =
    useState('');

  const hydrateRecords = async (
    options?: { refresh?: boolean }
  ) => {
    if (!userId) {
      setRecords([]);
      return;
    }

    if (options?.refresh) {
      setIsRefreshing(true);
    } else {
      setIsHydrating(true);
    }
    setGeneralError('');

    try {
      const nextRecords = await listPetRecords(userId);
      setRecords(nextRecords);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar los registros.'
      );
    } finally {
      if (options?.refresh) {
        setIsRefreshing(false);
      } else {
        setIsHydrating(false);
      }
    }
  };

  useEffect(() => {
    if (userId && pets.length === 0 && !isPetsHydrating) {
      void hydratePets(userId);
    }
  }, [
    hydratePets,
    isPetsHydrating,
    pets.length,
    userId,
  ]);

  useFocusEffect(
    useCallback(() => {
      void hydrateRecords();
    }, [userId])
  );

  const filteredRecords = useMemo(() => {
    const petScopedRecords = activePet?.id
      ? records.filter(
          (record) => record.pet_id === activePet.id
        )
      : records;

    if (selectedType === 'all') {
      return petScopedRecords;
    }

    return petScopedRecords.filter(
      (record) => record.record_type === selectedType
    );
  }, [activePet?.id, records, selectedType]);

  return {
    activePet,
    records: filteredRecords,
    selectedType,
    setSelectedType,
    isHydrating: isPetsHydrating || isHydrating,
    isRefreshing,
    generalError,
    retry: hydrateRecords,
    refresh: () =>
      hydrateRecords({ refresh: true }),
    goToRecordEntry: (type?: PetRecordType) =>
      router.push(
        type
          ? `/record-entry?type=${type}`
          : '/record-entry'
      ),
    goToRecordDetail: (recordId: string) =>
      router.push(
        `/record-detail?recordId=${recordId}`
      ),
  };
};
