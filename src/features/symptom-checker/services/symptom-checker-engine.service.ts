import type { Pet } from '@/features/pets/types/pet.types';
import type {
  SymptomCode,
  SymptomEvaluationResult,
  SymptomPriority,
  SymptomQuestionAnswer,
  SymptomQuestionAnswerType,
  SymptomQuestionDefinition,
  SymptomQuestionOption,
} from '../types/symptom-checker.types';
import {
  getQuestionsForSymptom,
  getSymptomByCode,
} from './symptom-checker-catalog.service';

const answerOptionsMap: Record<
  SymptomQuestionAnswerType,
  SymptomQuestionOption[]
> = {
  boolean_unknown: [
    { value: 'yes', label: 'Sí' },
    { value: 'no', label: 'No' },
    { value: 'unknown', label: 'No lo sé' },
  ],
  enum_yes_no_unknown: [
    { value: 'yes', label: 'Sí' },
    { value: 'no', label: 'No' },
    { value: 'unknown', label: 'No lo sé' },
  ],
  enum_yes_no_not_tried_unknown: [
    { value: 'yes', label: 'Sí' },
    { value: 'no', label: 'No' },
    { value: 'not_tried', label: 'No lo he probado' },
    { value: 'unknown', label: 'No lo sé' },
  ],
  enum_yes_no_unsure: [
    { value: 'yes', label: 'Sí' },
    { value: 'no', label: 'No' },
    { value: 'unsure', label: 'No estoy seguro/a' },
  ],
  enum_1_2_3_4plus_unknown: [
    { value: '1', label: '1 vez' },
    { value: '2', label: '2 veces' },
    { value: '3', label: '3 veces' },
    { value: '4plus', label: '4 o más' },
    { value: 'unknown', label: 'No lo sé' },
  ],
  enum_1_2_3_4plus_continuous_unknown: [
    { value: '1', label: '1 vez' },
    { value: '2', label: '2 veces' },
    { value: '3', label: '3 veces' },
    { value: '4plus', label: '4 o más' },
    { value: 'continuous', label: 'Muy seguido / continuo' },
    { value: 'unknown', label: 'No lo sé' },
  ],
  enum_recent_same_day_more_than_day_unknown: [
    { value: 'recent', label: 'Hace poco' },
    { value: 'same_day', label: 'Hoy mismo' },
    { value: 'more_than_day', label: 'Hace más de un día' },
    { value: 'unknown', label: 'No lo sé' },
  ],
  enum_none_red_black_tarry_unsure: [
    { value: 'none', label: 'No' },
    { value: 'red', label: 'Sangre roja' },
    { value: 'black_tarry', label: 'Negra / tipo alquitrán' },
    { value: 'unsure', label: 'No estoy seguro/a' },
  ],
  enum_normal_less_active_very_weak_unknown: [
    { value: 'normal', label: 'Normal' },
    { value: 'less_active', label: 'Menos activo/a' },
    { value: 'very_weak', label: 'Muy débil' },
    { value: 'unknown', label: 'No lo sé' },
  ],
  enum_normal_drops_none_unknown: [
    { value: 'normal', label: 'Sale normal' },
    { value: 'drops', label: 'Salen gotas' },
    { value: 'none', label: 'No sale nada' },
    { value: 'unknown', label: 'No lo sé' },
  ],
  multi_boolean_unknown: [
    { value: 'yes', label: 'Sí' },
    { value: 'no', label: 'No' },
    { value: 'unknown', label: 'No lo sé' },
  ],
  enum_external_nose_mouth_urine_stool_multiple_unknown: [
    { value: 'external', label: 'Herida externa' },
    { value: 'nose', label: 'Nariz' },
    { value: 'mouth', label: 'Boca' },
    { value: 'urine', label: 'Orina' },
    { value: 'stool', label: 'Heces' },
    { value: 'multiple', label: 'Más de un sitio' },
    { value: 'unknown', label: 'No lo sé' },
  ],
  enum_medication_chemical_pesticide_rodenticide_plant_food_object_unknown: [
    { value: 'medication', label: 'Medicamento' },
    { value: 'chemical', label: 'Químico / limpieza' },
    { value: 'pesticide', label: 'Pesticida' },
    { value: 'rodenticide', label: 'Veneno para roedores' },
    { value: 'plant', label: 'Planta' },
    { value: 'food', label: 'Comida peligrosa' },
    { value: 'object', label: 'Objeto / cuerpo extraño' },
    { value: 'unknown', label: 'No lo sé' },
  ],
  enum_male_female_unknown: [
    { value: 'male', label: 'Sí, macho' },
    { value: 'female', label: 'No, hembra' },
    { value: 'unknown', label: 'No lo sé' },
  ],
};

const priorityOrder: Record<
  SymptomPriority,
  number
> = {
  monitor: 0,
  consult: 1,
  urgent: 2,
  emergency: 3,
};

const buildResult = ({
  priority,
  triggeredRules,
  stopFlow,
}: {
  priority: SymptomPriority;
  triggeredRules: string[];
  stopFlow: boolean;
}): SymptomEvaluationResult => {
  if (priority === 'emergency') {
    return {
      priority,
      title: 'Atención veterinaria inmediata',
      summary:
        'Detectamos una combinación de señales que conviene tratar como emergencia hasta que una veterinaria la evalúe.',
      actionLabel:
        'Busca atención inmediata y abre veterinarias cercanas.',
      escalationSignals: [
        'Si aparece colapso, debilidad marcada o empeora en minutos.',
        'Si deja de responder o la respiración se ve más difícil.',
      ],
      stopFlow,
      triggeredRules,
    };
  }

  if (priority === 'urgent') {
    return {
      priority,
      title: 'Consulta veterinaria prioritaria',
      summary:
        'Por la combinación de respuestas, te recomendamos evaluación veterinaria hoy o dentro de las próximas horas.',
      actionLabel:
        'Mantén vigilancia cercana y busca atención prioritaria.',
      escalationSignals: [
        'Si no mejora pronto o aparecen nuevas señales graves.',
        'Si deja de beber, se debilita o el síntoma aumenta.',
      ],
      stopFlow,
      triggeredRules,
    };
  }

  if (priority === 'consult') {
    return {
      priority,
      title: 'Consulta veterinaria recomendada',
      summary:
        'El cuadro parece estable por ahora, pero conviene revisión veterinaria programada.',
      actionLabel:
        'Agenda una consulta y observa si aparece alguna señal de alerta.',
      escalationSignals: [
        'Si el síntoma se repite o dura más de lo esperado.',
        'Si aparece sangre, debilidad o dolor marcado.',
      ],
      stopFlow,
      triggeredRules,
    };
  }

  return {
    priority,
    title: 'Observación con seguimiento',
    summary:
      'Por ahora no vemos una bandera roja clara en este flujo, pero conviene observar de cerca y reevaluar si cambia.',
    actionLabel:
      'Monitorea de cerca y busca ayuda si empeora o se repite.',
    escalationSignals: [
      'Si se repite varias veces en poco tiempo.',
      'Si tu mascota se ve más decaída o deja de tolerar agua.',
    ],
    stopFlow,
    triggeredRules,
  };
};

const getAnswerValue = (
  answers: SymptomQuestionAnswer[],
  questionCode: string
) =>
  answers.find(
    (answer) => answer.questionCode === questionCode
  )?.value ?? null;

export const getQuestionOptions = (
  answerType: SymptomQuestionAnswerType
) => answerOptionsMap[answerType] ?? [];

export const getQuestionFlowForSymptom = (
  symptomCode: SymptomCode
) => getQuestionsForSymptom(symptomCode);

const evaluateVomiting = (
  answers: SymptomQuestionAnswer[]
) => {
  const count = getAnswerValue(answers, 'VOM_COUNT');
  const keepWater = getAnswerValue(
    answers,
    'VOM_KEEP_WATER'
  );
  const blood = getAnswerValue(answers, 'VOM_BLOOD');
  const unproductiveRetching = getAnswerValue(
    answers,
    'VOM_UNPRODUCTIVE_RECHING'
  );

  if (blood === 'yes' || blood === 'unsure') {
    return {
      priority: 'emergency' as const,
      triggeredRules: ['VOM_003'],
      stopFlow: true,
    };
  }

  if (unproductiveRetching === 'yes') {
    return {
      priority: 'emergency' as const,
      triggeredRules: ['VOM_002'],
      stopFlow: true,
    };
  }

  if (
    ['no', 'unknown', 'not_tried'].includes(
      keepWater ?? ''
    ) &&
    ['3', '4plus'].includes(count ?? '')
  ) {
    return {
      priority: 'urgent' as const,
      triggeredRules: ['VOM_001'],
      stopFlow: false,
    };
  }

  if (
    keepWater === 'yes' &&
    ['1', '2'].includes(count ?? '')
  ) {
    return {
      priority: 'monitor' as const,
      triggeredRules: ['VOM_006'],
      stopFlow: false,
    };
  }

  return {
    priority: 'consult' as const,
    triggeredRules: ['VOM_007'],
    stopFlow: false,
  };
};

const evaluateDiarrhea = (
  answers: SymptomQuestionAnswer[]
) => {
  const count = getAnswerValue(answers, 'DIA_COUNT');
  const blood = getAnswerValue(answers, 'DIA_BLOOD');
  const keepWater = getAnswerValue(
    answers,
    'DIA_KEEP_WATER'
  );

  if (
    blood === 'black_tarry' ||
    blood === 'unsure'
  ) {
    return {
      priority: 'emergency' as const,
      triggeredRules: ['DIA_001'],
      stopFlow: true,
    };
  }

  if (
    ['no', 'unknown'].includes(keepWater ?? '') &&
    ['4plus', 'continuous'].includes(count ?? '')
  ) {
    return {
      priority: 'urgent' as const,
      triggeredRules: ['DIA_003'],
      stopFlow: false,
    };
  }

  if (
    blood === 'none' &&
    keepWater === 'yes' &&
    ['1', '2'].includes(count ?? '')
  ) {
    return {
      priority: 'monitor' as const,
      triggeredRules: ['DIA_006'],
      stopFlow: false,
    };
  }

  return {
    priority: 'consult' as const,
    triggeredRules: ['DIA_007'],
    stopFlow: false,
  };
};

const evaluateBreathingDifficulty = (
  answers: SymptomQuestionAnswer[]
) => {
  const activeNow = getAnswerValue(
    answers,
    'RESP_ACTIVE_NOW'
  );
  const openMouthCat = getAnswerValue(
    answers,
    'RESP_OPEN_MOUTH_CAT'
  );
  const markedEffort = getAnswerValue(
    answers,
    'RESP_MARKED_EFFORT'
  );

  if (
    ['yes', 'unsure'].includes(activeNow ?? '') ||
    openMouthCat === 'yes' ||
    markedEffort === 'yes' ||
    markedEffort === 'unknown'
  ) {
    return {
      priority: 'emergency' as const,
      triggeredRules: ['RESP_001'],
      stopFlow: true,
    };
  }

  return {
    priority: 'urgent' as const,
    triggeredRules: ['RESP_006'],
    stopFlow: false,
  };
};

const evaluateBleeding = (
  answers: SymptomQuestionAnswer[]
) => {
  const activeNow = getAnswerValue(
    answers,
    'BLD_ACTIVE_NOW'
  );
  const amount = getAnswerValue(answers, 'BLD_AMOUNT');
  const trauma = getAnswerValue(answers, 'BLD_TRAUMA');

  if (
    activeNow === 'yes' ||
    amount === 'yes' ||
    amount === 'unknown' ||
    activeNow === 'unknown' ||
    trauma === 'yes'
  ) {
    return {
      priority: 'emergency' as const,
      triggeredRules: ['BLD_001'],
      stopFlow: true,
    };
  }

  return {
    priority: 'urgent' as const,
    triggeredRules: ['BLD_005'],
    stopFlow: false,
  };
};

const evaluateHazardousIngestion = (
  answers: SymptomQuestionAnswer[]
) => {
  const substanceType = getAnswerValue(
    answers,
    'ING_SUBSTANCE_TYPE'
  );
  const signsNow = getAnswerValue(
    answers,
    'ING_SIGNS_NOW'
  );

  if (
    signsNow === 'yes' ||
    [
      'medication',
      'chemical',
      'pesticide',
      'rodenticide',
      'object',
      'unknown',
    ].includes(substanceType ?? '')
  ) {
    return {
      priority: 'emergency' as const,
      triggeredRules: ['ING_001'],
      stopFlow: true,
    };
  }

  return {
    priority: 'urgent' as const,
    triggeredRules: ['ING_006'],
    stopFlow: false,
  };
};

const evaluateUrinationDifficulty = ({
  answers,
  pet,
}: {
  answers: SymptomQuestionAnswer[];
  pet: Pet | null;
}) => {
  const repeated = getAnswerValue(
    answers,
    'URI_TRYING_REPEATEDLY'
  );
  const output = getAnswerValue(answers, 'URI_OUTPUT');
  const sex = getAnswerValue(
    answers,
    'URI_SEX_CONFIRM'
  );

  const isMalePet =
    sex === 'male' ||
    pet?.gender === 'male';

  if (
    ['yes', 'unknown'].includes(repeated ?? '') &&
    ['drops', 'none', 'unknown'].includes(
      output ?? ''
    )
  ) {
    return {
      priority: 'emergency' as const,
      triggeredRules: isMalePet
        ? ['URI_001']
        : ['URI_002'],
      stopFlow: true,
    };
  }

  if (output === 'normal') {
    return {
      priority: 'urgent' as const,
      triggeredRules: ['URI_005'],
      stopFlow: false,
    };
  }

  return {
    priority: 'consult' as const,
    triggeredRules: ['URI_007'],
    stopFlow: false,
  };
};

export const evaluateSymptomFlow = ({
  symptomCode,
  answers,
  pet,
}: {
  symptomCode: SymptomCode;
  answers: SymptomQuestionAnswer[];
  pet: Pet | null;
}): SymptomEvaluationResult => {
  const symptom = getSymptomByCode(symptomCode);

  if (!symptom) {
    return buildResult({
      priority: 'consult',
      triggeredRules: ['CATALOG_FALLBACK'],
      stopFlow: false,
    });
  }

  const baseEvaluation =
    symptomCode === 'vomiting'
      ? evaluateVomiting(answers)
      : symptomCode === 'diarrhea'
        ? evaluateDiarrhea(answers)
        : symptomCode ===
            'breathing_difficulty'
          ? evaluateBreathingDifficulty(answers)
          : symptomCode === 'bleeding'
            ? evaluateBleeding(answers)
            : symptomCode ===
                'hazardous_ingestion'
              ? evaluateHazardousIngestion(answers)
              : evaluateUrinationDifficulty({
                  answers,
                  pet,
                });

  return buildResult(baseEvaluation);
};

export const shouldStopFlowAfterAnswer = ({
  symptomCode,
  answers,
  currentQuestion,
  pet,
}: {
  symptomCode: SymptomCode;
  answers: SymptomQuestionAnswer[];
  currentQuestion: SymptomQuestionDefinition;
  pet: Pet | null;
}) => {
  if (!currentQuestion.isCritical) {
    return null;
  }

  const result = evaluateSymptomFlow({
    symptomCode,
    answers,
    pet,
  });

  return result.stopFlow ? result : null;
};

export const getNextPriority = (
  current: SymptomPriority,
  incoming: SymptomPriority
) =>
  priorityOrder[incoming] > priorityOrder[current]
    ? incoming
    : current;
