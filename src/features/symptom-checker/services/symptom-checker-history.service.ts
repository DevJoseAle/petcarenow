import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  CreateSymptomCheckerEvaluationPayload,
  SaveSymptomCheckerEvaluationInput,
  SymptomCheckerEvaluationRecord,
  SymptomEvaluationResult,
  SymptomQuestionAnswer,
} from '../types/symptom-checker.types';

const HISTORY_STORAGE_KEY =
  'pcn:symptom-checker:history';

const mapHistoryError = (
  action: 'load' | 'save'
) =>
  new Error(
    action === 'load'
      ? 'No pudimos cargar el historial del Symptom Checker.'
      : 'No pudimos guardar la evaluación del Symptom Checker.'
  );

const createHistoryId = () =>
  `sce_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;

const sanitizeAnswers = (
  value: unknown
): SymptomQuestionAnswer[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (
        typeof item !== 'object' ||
        item === null
      ) {
        return null;
      }

      const candidate =
        item as Partial<SymptomQuestionAnswer>;

      if (
        typeof candidate.questionCode !==
          'string' ||
        typeof candidate.questionText !==
          'string' ||
        typeof candidate.value !== 'string' ||
        typeof candidate.label !== 'string'
      ) {
        return null;
      }

      return {
        questionCode: candidate.questionCode,
        questionText: candidate.questionText,
        value: candidate.value,
        label: candidate.label,
      };
    })
    .filter(
      (
        item
      ): item is SymptomQuestionAnswer =>
        item !== null
    );
};

const sanitizeResult = (
  value: unknown
): SymptomEvaluationResult | null => {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return null;
  }

  const candidate =
    value as Partial<SymptomEvaluationResult>;

  if (
    typeof candidate.priority !== 'string' ||
    typeof candidate.title !== 'string' ||
    typeof candidate.summary !== 'string' ||
    typeof candidate.actionLabel !== 'string' ||
    !Array.isArray(candidate.escalationSignals) ||
    typeof candidate.stopFlow !== 'boolean' ||
    !Array.isArray(candidate.triggeredRules)
  ) {
    return null;
  }

  return {
    priority: candidate.priority,
    title: candidate.title,
    summary: candidate.summary,
    actionLabel: candidate.actionLabel,
    escalationSignals:
      candidate.escalationSignals.filter(
        (item): item is string =>
          typeof item === 'string'
      ),
    stopFlow: candidate.stopFlow,
    triggeredRules:
      candidate.triggeredRules.filter(
        (item): item is string =>
          typeof item === 'string'
      ),
  };
};

const sanitizeHistoryRecord = (
  value: unknown
): SymptomCheckerEvaluationRecord | null => {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return null;
  }

  const candidate =
    value as Partial<SymptomCheckerEvaluationRecord>;
  const result = sanitizeResult(candidate.result);

  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.ownerId !== 'string' ||
    typeof candidate.completedAt !== 'string' ||
    typeof candidate.symptomCode !== 'string' ||
    typeof candidate.symptomLabel !== 'string' ||
    !result
  ) {
    return null;
  }

  return {
    id: candidate.id,
    ownerId: candidate.ownerId,
    completedAt: candidate.completedAt,
    petId:
      typeof candidate.petId === 'string'
        ? candidate.petId
        : null,
    petName:
      typeof candidate.petName === 'string'
        ? candidate.petName
        : null,
    petType:
      typeof candidate.petType === 'string'
        ? candidate.petType
        : null,
    symptomCode: candidate.symptomCode,
    symptomLabel: candidate.symptomLabel,
    answers: sanitizeAnswers(candidate.answers),
    result,
    source:
      candidate.source === 'local'
        ? 'local'
        : 'local',
    syncStatus:
      candidate.syncStatus === 'synced'
        ? 'synced'
        : 'pending',
  };
};

const loadHistoryRecords = async () => {
  try {
    const rawValue =
      await AsyncStorage.getItem(
        HISTORY_STORAGE_KEY
      );

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map(sanitizeHistoryRecord)
      .filter(
        (
          record
        ): record is SymptomCheckerEvaluationRecord =>
          record !== null
      );
  } catch {
    throw mapHistoryError('load');
  }
};

const persistHistoryRecords = async (
  records: SymptomCheckerEvaluationRecord[]
) => {
  await AsyncStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify(records)
  );
};

export const listSymptomCheckerEvaluations =
  async (
    ownerId: string
  ): Promise<SymptomCheckerEvaluationRecord[]> => {
    const records = await loadHistoryRecords();

    return records
      .filter((record) => record.ownerId === ownerId)
      .sort((left, right) =>
        right.completedAt.localeCompare(
          left.completedAt
        )
      );
  };

export const saveSymptomCheckerEvaluation =
  async (
    input: SaveSymptomCheckerEvaluationInput
  ): Promise<SymptomCheckerEvaluationRecord> => {
    try {
      const records = await loadHistoryRecords();
      const nextRecord: SymptomCheckerEvaluationRecord =
        {
          id: createHistoryId(),
          ownerId: input.ownerId,
          completedAt: new Date().toISOString(),
          petId: input.petId,
          petName: input.petName,
          petType: input.petType,
          symptomCode: input.symptomCode,
          symptomLabel: input.symptomLabel,
          answers: input.answers,
          result: input.result,
          source: 'local',
          syncStatus: 'pending',
        };

      await persistHistoryRecords([
        nextRecord,
        ...records,
      ]);

      return nextRecord;
    } catch {
      throw mapHistoryError('save');
    }
  };

export const buildSymptomCheckerEvaluationPayload =
  (
    record: SymptomCheckerEvaluationRecord
  ): CreateSymptomCheckerEvaluationPayload => ({
    owner_id: record.ownerId,
    evaluated_at: record.completedAt,
    pet_id: record.petId,
    pet_name: record.petName,
    pet_type: record.petType,
    symptom_code: record.symptomCode,
    symptom_label: record.symptomLabel,
    answers: record.answers,
    result_priority: record.result.priority,
    result_title: record.result.title,
    result_summary: record.result.summary,
    result_action_label:
      record.result.actionLabel,
    escalation_signals:
      record.result.escalationSignals,
    triggered_rules:
      record.result.triggeredRules,
    source: record.source,
  });
