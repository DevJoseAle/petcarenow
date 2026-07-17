import type {
  SymptomCatalogItem,
  SymptomCode,
  SymptomQuestionDefinition,
} from '../types/symptom-checker.types';

const symptomCatalog: SymptomCatalogItem[] = [
  {
    code: 'vomiting',
    title: 'Vómitos',
    shortDescription:
      'Expulsión activa del contenido o arcadas repetidas.',
    speciesSupported: ['dog', 'cat'],
    cautionLabel:
      'Revisaremos repetición, agua, sangre y estado general.',
  },
  {
    code: 'diarrhea',
    title: 'Diarrea',
    shortDescription:
      'Deposiciones más blandas o líquidas de lo habitual.',
    speciesSupported: ['dog', 'cat'],
    cautionLabel:
      'Buscaremos sangre, pérdida de líquidos y cambios de estado.',
  },
  {
    code: 'breathing_difficulty',
    title: 'Dificultad respiratoria',
    shortDescription:
      'Mayor esfuerzo para respirar o respiración anormal.',
    speciesSupported: ['dog', 'cat'],
    cautionLabel:
      'Este síntoma se trata con criterio muy conservador.',
  },
  {
    code: 'bleeding',
    title: 'Sangrado',
    shortDescription:
      'Sangrado externo o visible en vómito, heces u orina.',
    speciesSupported: ['dog', 'cat'],
    cautionLabel:
      'Nos centraremos en cantidad, localización y trauma asociado.',
  },
  {
    code: 'hazardous_ingestion',
    title:
      'Posible intoxicación o ingestión peligrosa',
    shortDescription:
      'Contacto o ingestión de tóxicos, medicamentos o cuerpos extraños.',
    speciesSupported: ['dog', 'cat'],
    cautionLabel:
      'La prioridad aquí es rapidez, no detalle.',
  },
  {
    code: 'urination_difficulty',
    title:
      'Dificultad o incapacidad para orinar',
    shortDescription:
      'Esfuerzo, dolor o poca producción al intentar orinar.',
    speciesSupported: ['dog', 'cat'],
    cautionLabel:
      'En gatos machos este flujo debe ser especialmente conservador.',
  },
];

const questionCatalog: SymptomQuestionDefinition[] =
  [
    {
      code: 'VOM_COUNT',
      symptomCode: 'vomiting',
      text: '¿Cuántas veces ha vomitado desde que comenzó?',
      answerType: 'enum_1_2_3_4plus_unknown',
      isCritical: false,
    },
    {
      code: 'VOM_KEEP_WATER',
      symptomCode: 'vomiting',
      text: '¿Puede tomar agua sin volver a vomitar?',
      answerType: 'enum_yes_no_not_tried_unknown',
      isCritical: true,
    },
    {
      code: 'VOM_BLOOD',
      symptomCode: 'vomiting',
      text: '¿Ves sangre roja o material oscuro en el vómito?',
      answerType: 'enum_yes_no_unsure',
      isCritical: true,
    },
    {
      code: 'DIA_COUNT',
      symptomCode: 'diarrhea',
      text: '¿Cuántas deposiciones anormales ha tenido desde que comenzó?',
      answerType:
        'enum_1_2_3_4plus_continuous_unknown',
      isCritical: false,
    },
    {
      code: 'DIA_BLOOD',
      symptomCode: 'diarrhea',
      text: '¿Ves sangre roja o heces negras tipo alquitrán?',
      answerType:
        'enum_none_red_black_tarry_unsure',
      isCritical: true,
    },
    {
      code: 'DIA_KEEP_WATER',
      symptomCode: 'diarrhea',
      text: '¿Puede beber y mantener el agua?',
      answerType: 'enum_yes_no_unknown',
      isCritical: true,
    },
    {
      code: 'RESP_ACTIVE_NOW',
      symptomCode: 'breathing_difficulty',
      text: '¿Le cuesta respirar ahora mismo?',
      answerType: 'enum_yes_no_unsure',
      isCritical: true,
    },
    {
      code: 'RESP_OPEN_MOUTH_CAT',
      symptomCode: 'breathing_difficulty',
      text: 'Si es gato, ¿respira con la boca abierta?',
      answerType: 'boolean_unknown',
      isCritical: true,
    },
    {
      code: 'RESP_MARKED_EFFORT',
      symptomCode: 'breathing_difficulty',
      text: '¿Respira con mucho esfuerzo o con el cuello estirado?',
      answerType: 'boolean_unknown',
      isCritical: true,
    },
    {
      code: 'BLD_ACTIVE_NOW',
      symptomCode: 'bleeding',
      text: '¿Sigue sangrando ahora mismo?',
      answerType: 'boolean_unknown',
      isCritical: true,
    },
    {
      code: 'BLD_AMOUNT',
      symptomCode: 'bleeding',
      text: '¿La sangre es más que unas pocas gotas o vetas?',
      answerType: 'enum_yes_no_unknown',
      isCritical: true,
    },
    {
      code: 'BLD_TRAUMA',
      symptomCode: 'bleeding',
      text: '¿Ocurrió después de un golpe, caída o accidente?',
      answerType: 'boolean_unknown',
      isCritical: true,
    },
    {
      code: 'ING_SUBSTANCE_TYPE',
      symptomCode: 'hazardous_ingestion',
      text: '¿Qué pudo ingerir?',
      answerType:
        'enum_medication_chemical_pesticide_rodenticide_plant_food_object_unknown',
      isCritical: true,
    },
    {
      code: 'ING_SIGNS_NOW',
      symptomCode: 'hazardous_ingestion',
      text: '¿Tiene temblores, convulsiones, mucha debilidad o dificultad para respirar?',
      answerType: 'multi_boolean_unknown',
      isCritical: true,
    },
    {
      code: 'URI_TRYING_REPEATEDLY',
      symptomCode: 'urination_difficulty',
      text: '¿Intenta orinar una y otra vez?',
      answerType: 'boolean_unknown',
      isCritical: true,
    },
    {
      code: 'URI_OUTPUT',
      symptomCode: 'urination_difficulty',
      text: 'Cuando lo intenta, ¿sale normal, salen gotas o no sale nada?',
      answerType: 'enum_normal_drops_none_unknown',
      isCritical: true,
    },
    {
      code: 'URI_SEX_CONFIRM',
      symptomCode: 'urination_difficulty',
      text: '¿Es macho?',
      answerType: 'enum_male_female_unknown',
      isCritical: true,
    },
  ];

export const getSupportedSymptoms = () =>
  symptomCatalog;

export const getSymptomByCode = (
  code: SymptomCode
) =>
  symptomCatalog.find(
    (symptom) => symptom.code === code
  ) ?? null;

export const getQuestionsForSymptom = (
  symptomCode: SymptomCode
) =>
  questionCatalog.filter(
    (question) =>
      question.symptomCode === symptomCode
  );
