export type SymptomCheckerStep =
  | 'intro'
  | 'pet_selection'
  | 'symptom_selection'
  | 'questionnaire'
  | 'result';

export type SymptomPriority =
  | 'emergency'
  | 'urgent'
  | 'consult'
  | 'monitor';

export type SymptomCode =
  | 'vomiting'
  | 'diarrhea'
  | 'breathing_difficulty'
  | 'bleeding'
  | 'hazardous_ingestion'
  | 'urination_difficulty';

export type SymptomQuestionAnswerType =
  | 'boolean_unknown'
  | 'enum_yes_no_unknown'
  | 'enum_yes_no_not_tried_unknown'
  | 'enum_yes_no_unsure'
  | 'enum_1_2_3_4plus_unknown'
  | 'enum_1_2_3_4plus_continuous_unknown'
  | 'enum_recent_same_day_more_than_day_unknown'
  | 'enum_none_red_black_tarry_unsure'
  | 'enum_normal_less_active_very_weak_unknown'
  | 'enum_normal_drops_none_unknown'
  | 'multi_boolean_unknown'
  | 'enum_external_nose_mouth_urine_stool_multiple_unknown'
  | 'enum_medication_chemical_pesticide_rodenticide_plant_food_object_unknown'
  | 'enum_male_female_unknown';

export interface SymptomCatalogItem {
  code: SymptomCode;
  title: string;
  shortDescription: string;
  speciesSupported: Array<'dog' | 'cat'>;
  cautionLabel: string;
}

export interface SymptomQuestionDefinition {
  code: string;
  symptomCode: SymptomCode;
  text: string;
  answerType: SymptomQuestionAnswerType;
  isCritical: boolean;
}

export interface SymptomQuestionOption {
  value: string;
  label: string;
}

export interface SymptomQuestionAnswer {
  questionCode: string;
  questionText: string;
  value: string;
  label: string;
}

export interface SymptomEvaluationResult {
  priority: SymptomPriority;
  title: string;
  summary: string;
  actionLabel: string;
  escalationSignals: string[];
  stopFlow: boolean;
  triggeredRules: string[];
}

export type SymptomCheckerEvaluationSource =
  | 'local';

export type SymptomCheckerEvaluationSyncStatus =
  | 'pending'
  | 'synced';

export interface SymptomCheckerEvaluationRecord {
  id: string;
  ownerId: string;
  completedAt: string;
  petId: string | null;
  petName: string | null;
  petType: string | null;
  symptomCode: SymptomCode;
  symptomLabel: string;
  answers: SymptomQuestionAnswer[];
  result: SymptomEvaluationResult;
  source: SymptomCheckerEvaluationSource;
  syncStatus: SymptomCheckerEvaluationSyncStatus;
}

export interface SaveSymptomCheckerEvaluationInput {
  ownerId: string;
  petId: string | null;
  petName: string | null;
  petType: string | null;
  symptomCode: SymptomCode;
  symptomLabel: string;
  answers: SymptomQuestionAnswer[];
  result: SymptomEvaluationResult;
}

export interface CreateSymptomCheckerEvaluationPayload {
  owner_id: string;
  evaluated_at: string;
  pet_id: string | null;
  pet_name: string | null;
  pet_type: string | null;
  symptom_code: SymptomCode;
  symptom_label: string;
  answers: SymptomQuestionAnswer[];
  result_priority: SymptomPriority;
  result_title: string;
  result_summary: string;
  result_action_label: string;
  escalation_signals: string[];
  triggered_rules: string[];
  source: SymptomCheckerEvaluationSource;
}

export interface SymptomCheckerStoreState {
  currentStep: SymptomCheckerStep;
  selectedPetId: string | null;
  selectedSymptomCode: SymptomCode | null;
  generalError: string;
  answers: SymptomQuestionAnswer[];
  currentQuestionIndex: number;
  result: SymptomEvaluationResult | null;
  setCurrentStep: (
    step: SymptomCheckerStep
  ) => void;
  setSelectedPetId: (
    petId: string | null
  ) => void;
  setSelectedSymptomCode: (
    code: SymptomCode | null
  ) => void;
  setGeneralError: (error: string) => void;
  setAnswers: (
    answers: SymptomQuestionAnswer[]
  ) => void;
  setCurrentQuestionIndex: (
    index: number
  ) => void;
  setResult: (
    result: SymptomEvaluationResult | null
  ) => void;
  reset: () => void;
}
