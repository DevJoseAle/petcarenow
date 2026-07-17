import { act, renderHook } from '@testing-library/react-native';
import { useSymptomCheckerFlow } from '../hooks/useSymptomCheckerFlow';
import { useSymptomCheckerStore } from '../store/symptom-checker.store';

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockHydratePets = jest.fn();
const mockHydrateSubscription = jest.fn();
const mockGetUsage = jest.fn();
const mockRecordClosedEvaluation = jest.fn();
const mockSaveEvaluation = jest.fn();
const mockPetStoreState = {
  pets: [
    {
      id: 'pet-1',
      name: 'Luna',
      pet_type: 'dog',
    },
  ],
  activePetId: 'pet-1',
  isHydrating: false,
  generalError: '',
  hydratePets: mockHydratePets,
};
const mockSubscriptionStoreState = {
  isPremium: false,
  isHydrating: false,
  hydrate: mockHydrateSubscription,
};

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
    replace: mockReplace,
  }),
}));

jest.mock('@/features/auth/store/auth.store', () => ({
  useAuthStore: (
    selector: (state: {
      user: { id: string } | null;
    }) => unknown
  ) =>
    selector({
      user: { id: 'user-1' },
    }),
}));

jest.mock('@/features/pets/store/pet.store', () => ({
  usePetStore: (
    selector?: (state: {
      pets: Array<{
        id: string;
        name: string;
        pet_type: string;
      }>;
      activePetId: string | null;
      isHydrating: boolean;
      generalError: string;
      hydratePets: typeof mockHydratePets;
    }) => unknown
  ) =>
    selector
      ? selector(mockPetStoreState)
      : mockPetStoreState,
}));

jest.mock(
  '@/features/subscriptions/store/subscription.store',
  () => ({
    useSubscriptionStore: (
      selector?: (state: {
        isPremium: boolean;
        isHydrating: boolean;
        hydrate: typeof mockHydrateSubscription;
      }) => unknown
    ) =>
      selector
        ? selector(mockSubscriptionStoreState)
        : mockSubscriptionStoreState,
  })
);

jest.mock(
  '../services/symptom-checker-usage.service',
  () => ({
    getSymptomCheckerUsage: () => mockGetUsage(),
    recordClosedEvaluation: () =>
      mockRecordClosedEvaluation(),
    getUsageAllowance: ({
      isPremium,
      completedEvaluations,
    }: {
      isPremium: boolean;
      completedEvaluations: number;
    }) => {
      if (isPremium) {
        return {
          limit: null,
          remaining: null,
          isBlocked: false,
        };
      }

      const limit = 3;
      const remaining = Math.max(
        0,
        limit - completedEvaluations
      );

      return {
        limit,
        remaining,
        isBlocked: remaining <= 0,
      };
    },
  })
);

jest.mock(
  '../services/symptom-checker-history.service',
  () => ({
    saveSymptomCheckerEvaluation: (
      ...args: unknown[]
    ) => mockSaveEvaluation(...args),
  })
);

describe('useSymptomCheckerFlow', () => {
  const renderFlowHook = async () => {
    const rendered = renderHook(() =>
      useSymptomCheckerFlow()
    );

    await act(async () => {
      await Promise.resolve();
    });

    return rendered;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPetStoreState.pets = [
      {
        id: 'pet-1',
        name: 'Luna',
        pet_type: 'dog',
      },
    ];
    mockPetStoreState.activePetId = 'pet-1';
    mockPetStoreState.isHydrating = false;
    mockPetStoreState.generalError = '';
    mockSubscriptionStoreState.isPremium = false;
    mockSubscriptionStoreState.isHydrating = false;
    mockGetUsage.mockResolvedValue({
      monthKey: '2026-07',
      completedEvaluations: 0,
      updatedAt: null,
    });
    mockRecordClosedEvaluation.mockResolvedValue({
      monthKey: '2026-07',
      completedEvaluations: 1,
      updatedAt: '2026-07-17T12:00:00.000Z',
    });
    mockSaveEvaluation.mockResolvedValue({
      id: 'evaluation-1',
    });
    useSymptomCheckerStore.getState().reset();
  });

  test('advances from intro to pet selection to symptom selection', async () => {
    const { result } = await renderFlowHook();

    expect(result.current.currentStep).toBe(
      'intro'
    );

    act(() => {
      result.current.handleContinue();
    });

    expect(result.current.currentStep).toBe(
      'pet_selection'
    );

    act(() => {
      result.current.handleContinue();
    });

    expect(result.current.currentStep).toBe(
      'symptom_selection'
    );
    expect(mockPush).toHaveBeenCalledWith(
      '/symptom-checker-chat'
    );
  });

  test('selects pet and opens the conversation screen', async () => {
    useSymptomCheckerStore
      .getState()
      .setCurrentStep('pet_selection');

    const { result } = await renderFlowHook();

    act(() => {
      result.current.selectPetAndContinue('pet-1');
    });

    expect(result.current.selectedPetId).toBe(
      'pet-1'
    );
    expect(result.current.currentStep).toBe(
      'symptom_selection'
    );
    expect(mockPush).toHaveBeenCalledWith(
      '/symptom-checker-chat'
    );
  });

  test('blocks pet step when nothing is selected', async () => {
    mockPetStoreState.activePetId = null;
    useSymptomCheckerStore
      .getState()
      .setCurrentStep('pet_selection');
    useSymptomCheckerStore
      .getState()
      .setSelectedPetId(null);

    const { result } = await renderFlowHook();

    act(() => {
      result.current.selectPet('pet-1');
      useSymptomCheckerStore
        .getState()
        .setSelectedPetId(null);
      result.current.handleContinue();
    });

    expect(result.current.currentStep).toBe(
      'pet_selection'
    );
    expect(result.current.generalError).toBe(
      'Selecciona una mascota para continuar.'
    );
  });

  test('goes back and resets from intro', async () => {
    const { result } = await renderFlowHook();

    act(() => {
      result.current.handleBack();
    });

    expect(mockBack).toHaveBeenCalled();
    expect(
      useSymptomCheckerStore.getState()
    ).toMatchObject({
      currentStep: 'intro',
      selectedPetId: 'pet-1',
      selectedSymptomCode: null,
    });
  });

  test('goes back from conversation to pet selection', async () => {
    useSymptomCheckerStore
      .getState()
      .setCurrentStep('symptom_selection');

    const { result } = await renderFlowHook();

    act(() => {
      result.current.goBackFromConversation();
    });

    expect(result.current.currentStep).toBe(
      'pet_selection'
    );
    expect(mockBack).toHaveBeenCalled();
  });

  test('starts questionnaire and finishes with a result', async () => {
    useSymptomCheckerStore
      .getState()
      .setCurrentStep('symptom_selection');
    useSymptomCheckerStore
      .getState()
      .setSelectedPetId('pet-1');

    const { result } = await renderFlowHook();

    act(() => {
      result.current.selectSymptomAndStart(
        'vomiting'
      );
    });

    expect(result.current.currentStep).toBe(
      'questionnaire'
    );
    expect(result.current.currentQuestion?.code).toBe(
      'VOM_COUNT'
    );

    act(() => {
      result.current.answerCurrentQuestion({
        questionCode: 'VOM_COUNT',
        questionText:
          '¿Cuántas veces ha vomitado desde que comenzó?',
        value: '4plus',
        label: '4 o más',
      });
    });

    act(() => {
      result.current.answerCurrentQuestion({
        questionCode: 'VOM_KEEP_WATER',
        questionText:
          '¿Puede tomar agua sin volver a vomitar?',
        value: 'no',
        label: 'No',
      });
    });

    expect(result.current.currentStep).toBe(
      'questionnaire'
    );

    act(() => {
      result.current.answerCurrentQuestion({
        questionCode: 'VOM_BLOOD',
        questionText:
          '¿Ves sangre roja o material oscuro en el vómito?',
        value: 'no',
        label: 'No',
      });
    });

    expect(result.current.currentStep).toBe(
      'result'
    );
    expect(result.current.result).toMatchObject({
      priority: 'urgent',
      triggeredRules: ['VOM_001'],
    });
  });

  test('blocks free usage when monthly limit is reached', async () => {
    mockGetUsage.mockResolvedValue({
      monthKey: '2026-07',
      completedEvaluations: 3,
      updatedAt: '2026-07-17T12:00:00.000Z',
    });

    const { result } = await renderFlowHook();

    act(() => {
      result.current.handleContinue();
    });

    expect(result.current.currentStep).toBe(
      'intro'
    );
    expect(result.current.generalError).toContain(
      'límite mensual'
    );
  });

  test('blocks restartConversation when monthly limit is reached', async () => {
    mockGetUsage.mockResolvedValue({
      monthKey: '2026-07',
      completedEvaluations: 3,
      updatedAt: '2026-07-17T12:00:00.000Z',
    });
    useSymptomCheckerStore
      .getState()
      .setCurrentStep('result');

    const { result } = await renderFlowHook();

    act(() => {
      result.current.restartConversation();
    });

    expect(result.current.currentStep).toBe(
      'result'
    );
    expect(result.current.generalError).toContain(
      'límite mensual'
    );
  });

  test('persists evaluation history before closing the flow', async () => {
    useSymptomCheckerStore
      .getState()
      .setCurrentStep('result');
    useSymptomCheckerStore
      .getState()
      .setSelectedPetId('pet-1');
    useSymptomCheckerStore
      .getState()
      .setSelectedSymptomCode('vomiting');
    useSymptomCheckerStore.getState().setAnswers([
      {
        questionCode: 'VOM_COUNT',
        questionText:
          '¿Cuántas veces ha vomitado desde que comenzó?',
        value: '2',
        label: '2 veces',
      },
    ]);
    useSymptomCheckerStore.getState().setResult({
      priority: 'consult',
      title: 'Consulta recomendada',
      summary:
        'Conviene revisar a tu mascota con una veterinaria.',
      actionLabel:
        'Agenda una consulta si el cuadro continúa.',
      escalationSignals: ['Vómitos repetidos'],
      stopFlow: false,
      triggeredRules: ['VOM_003'],
    });

    const { result } = await renderFlowHook();

    await act(async () => {
      await result.current.closeEvaluation();
    });

    expect(mockSaveEvaluation).toHaveBeenCalledWith({
      ownerId: 'user-1',
      petId: 'pet-1',
      petName: 'Luna',
      petType: 'dog',
      symptomCode: 'vomiting',
      symptomLabel: 'Vómitos',
      answers: [
        {
          questionCode: 'VOM_COUNT',
          questionText:
            '¿Cuántas veces ha vomitado desde que comenzó?',
          value: '2',
          label: '2 veces',
        },
      ],
      result: {
        priority: 'consult',
        title: 'Consulta recomendada',
        summary:
          'Conviene revisar a tu mascota con una veterinaria.',
        actionLabel:
          'Agenda una consulta si el cuadro continúa.',
        escalationSignals: ['Vómitos repetidos'],
        stopFlow: false,
        triggeredRules: ['VOM_003'],
      },
    });
    expect(
      mockRecordClosedEvaluation
    ).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith(
      '/(app)/(tabs)'
    );
  });
});
