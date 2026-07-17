import {
  getQuestionsForSymptom,
  getSupportedSymptoms,
  getSymptomByCode,
} from '../services/symptom-checker-catalog.service';

describe(
  'symptom-checker-catalog.service',
  () => {
    test('returns the supported symptom catalog', () => {
      const symptoms = getSupportedSymptoms();

      expect(
        symptoms.map((symptom) => symptom.code)
      ).toEqual([
        'vomiting',
        'diarrhea',
        'breathing_difficulty',
        'bleeding',
        'hazardous_ingestion',
        'urination_difficulty',
      ]);
    });

    test('returns a symptom by code', () => {
      expect(
        getSymptomByCode('bleeding')
      ).toEqual(
        expect.objectContaining({
          code: 'bleeding',
          title: 'Sangrado',
        })
      );
    });

    test('returns questions for one symptom only', () => {
      const questions =
        getQuestionsForSymptom('vomiting');

      expect(questions).not.toHaveLength(0);
      expect(
        questions.every(
          (question) =>
            question.symptomCode === 'vomiting'
        )
      ).toBe(true);
    });
  }
);
