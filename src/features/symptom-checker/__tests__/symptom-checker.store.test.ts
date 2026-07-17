import { useSymptomCheckerStore } from '../store/symptom-checker.store';

describe('symptom-checker.store', () => {
  beforeEach(() => {
    useSymptomCheckerStore.getState().reset();
  });

  test('starts with the initial flow state', () => {
    expect(
      useSymptomCheckerStore.getState()
    ).toMatchObject({
      currentStep: 'intro',
      selectedPetId: null,
      selectedSymptomCode: null,
      generalError: '',
      answers: [],
      currentQuestionIndex: 0,
      result: null,
    });
  });

  test('mutates and resets the flow state', () => {
    useSymptomCheckerStore
      .getState()
      .setCurrentStep('symptom_selection');
    useSymptomCheckerStore
      .getState()
      .setSelectedPetId('pet-1');
    useSymptomCheckerStore
      .getState()
      .setSelectedSymptomCode('vomiting');
    useSymptomCheckerStore
      .getState()
      .setGeneralError('Error');
    useSymptomCheckerStore.getState().setAnswers([
      {
        questionCode: 'VOM_COUNT',
        questionText:
          '¿Cuántas veces ha vomitado desde que comenzó?',
        value: '2',
        label: '2 veces',
      },
    ]);
    useSymptomCheckerStore
      .getState()
      .setCurrentQuestionIndex(1);
    useSymptomCheckerStore.getState().setResult({
      priority: 'urgent',
      title: 'Consulta veterinaria prioritaria',
      summary: 'Resumen',
      actionLabel: 'Acción',
      escalationSignals: ['Signal'],
      stopFlow: false,
      triggeredRules: ['VOM_001'],
    });

    expect(
      useSymptomCheckerStore.getState()
    ).toMatchObject({
      currentStep: 'symptom_selection',
      selectedPetId: 'pet-1',
      selectedSymptomCode: 'vomiting',
      generalError: 'Error',
      answers: [
        {
          questionCode: 'VOM_COUNT',
          questionText:
            '¿Cuántas veces ha vomitado desde que comenzó?',
          value: '2',
          label: '2 veces',
        },
      ],
      currentQuestionIndex: 1,
      result: {
        priority: 'urgent',
        title: 'Consulta veterinaria prioritaria',
        summary: 'Resumen',
        actionLabel: 'Acción',
        escalationSignals: ['Signal'],
        stopFlow: false,
        triggeredRules: ['VOM_001'],
      },
    });

    useSymptomCheckerStore.getState().reset();

    expect(
      useSymptomCheckerStore.getState()
    ).toMatchObject({
      currentStep: 'intro',
      selectedPetId: null,
      selectedSymptomCode: null,
      generalError: '',
      answers: [],
      currentQuestionIndex: 0,
      result: null,
    });
  });
});
