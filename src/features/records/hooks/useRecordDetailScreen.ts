import { useEffect, useState } from 'react';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { Alert } from 'react-native';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  deletePetRecord,
  getPetRecordById,
} from '../services/record.service';
import type { PetRecord } from '../types/record.types';

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Fecha no disponible';
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const useRecordDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    recordId?: string;
  }>();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const [record, setRecord] = useState<PetRecord | null>(
    null
  );
  const [isHydrating, setIsHydrating] =
    useState(false);
  const [isDeleting, setIsDeleting] =
    useState(false);
  const [generalError, setGeneralError] =
    useState('');

  const hydrateRecord = async () => {
    if (!userId || !params.recordId) {
      setGeneralError(
        'No encontramos el registro solicitado.'
      );
      return;
    }

    setIsHydrating(true);
    setGeneralError('');

    try {
      const nextRecord = await getPetRecordById(
        userId,
        params.recordId
      );

      if (!nextRecord) {
        setGeneralError(
          'No encontramos el registro solicitado.'
        );
        setRecord(null);
        return;
      }

      setRecord(nextRecord);
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar el registro.'
      );
    } finally {
      setIsHydrating(false);
    }
  };

  useEffect(() => {
    void hydrateRecord();
  }, [params.recordId, userId]);

  const handleDelete = () => {
    if (!userId || !record) {
      return;
    }

    Alert.alert(
      'Eliminar registro',
      '¿Seguro que quieres eliminar este registro?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            setGeneralError('');

            try {
              await deletePetRecord(userId, record.id);
              router.back();
            } catch (error) {
              setGeneralError(
                error instanceof Error
                  ? error.message
                  : 'No pudimos eliminar el registro.'
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return {
    record,
    isHydrating,
    isDeleting,
    generalError,
    recordedAtLabel: record
      ? formatDateTime(record.recorded_at)
      : '',
    retry: hydrateRecord,
    handleBack: () => router.back(),
    goToEdit: () =>
      record
        ? router.push(
            `/record-entry?recordId=${record.id}`
          )
        : undefined,
    handleDelete,
  };
};
