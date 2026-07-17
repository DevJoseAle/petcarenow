import {
  evaluateSymptomFlow,
  getQuestionOptions,
} from '../services/symptom-checker-engine.service';

describe('symptom-checker-engine.service', () => {
  test('returns mapped options for a supported answer type', () => {
    expect(
      getQuestionOptions('enum_yes_no_unsure')
    ).toEqual([
      { value: 'yes', label: 'Sí' },
      { value: 'no', label: 'No' },
      {
        value: 'unsure',
        label: 'No estoy seguro/a',
      },
    ]);
  });

  test('evaluates vomiting with blood as emergency', () => {
    const result = evaluateSymptomFlow({
      symptomCode: 'vomiting',
      pet: null,
      answers: [
        {
          questionCode: 'VOM_COUNT',
          questionText:
            '¿Cuántas veces ha vomitado desde que comenzó?',
          value: '2',
          label: '2 veces',
        },
        {
          questionCode: 'VOM_KEEP_WATER',
          questionText:
            '¿Puede tomar agua sin volver a vomitar?',
          value: 'yes',
          label: 'Sí',
        },
        {
          questionCode: 'VOM_BLOOD',
          questionText:
            '¿Ves sangre roja o material oscuro en el vómito?',
          value: 'yes',
          label: 'Sí',
        },
      ],
    });

    expect(result).toMatchObject({
      priority: 'emergency',
      stopFlow: true,
      triggeredRules: ['VOM_003'],
    });
  });

  test('evaluates urinary difficulty in male pet as emergency', () => {
    const result = evaluateSymptomFlow({
      symptomCode: 'urination_difficulty',
      pet: {
        id: 'pet-1',
        owner_id: 'user-1',
        name: 'Luna',
        pet_type: 'cat',
        gender: 'male',
        breed: null,
        birth_date: null,
        age_years: null,
        weight_kg: null,
        photo_url: null,
        allergies: [],
        medical_conditions: [],
        is_active: true,
        created_at: null,
        updated_at: null,
      },
      answers: [
        {
          questionCode: 'URI_TRYING_REPEATEDLY',
          questionText:
            '¿Intenta orinar una y otra vez?',
          value: 'yes',
          label: 'Sí',
        },
        {
          questionCode: 'URI_OUTPUT',
          questionText:
            'Cuando lo intenta, ¿sale normal, salen gotas o no sale nada?',
          value: 'none',
          label: 'No sale nada',
        },
        {
          questionCode: 'URI_SEX_CONFIRM',
          questionText: '¿Es macho?',
          value: 'male',
          label: 'Sí, macho',
        },
      ],
    });

    expect(result).toMatchObject({
      priority: 'emergency',
      stopFlow: true,
      triggeredRules: ['URI_001'],
    });
  });
});
