import { create } from 'zustand';
import type { SymptomCheckerStoreState } from '../types/symptom-checker.types';

const getInitialState = () => ({
  currentStep: 'intro' as const,
  selectedPetId: null,
  selectedSymptomCode: null,
  generalError: '',
  answers: [],
  currentQuestionIndex: 0,
  result: null,
});

export const useSymptomCheckerStore =
  create<SymptomCheckerStoreState>((set) => ({
    ...getInitialState(),
    setCurrentStep: (step) =>
      set({ currentStep: step }),
    setSelectedPetId: (selectedPetId) =>
      set({ selectedPetId }),
    setSelectedSymptomCode: (
      selectedSymptomCode
    ) => set({ selectedSymptomCode }),
    setGeneralError: (generalError) =>
      set({ generalError }),
    setAnswers: (answers) => set({ answers }),
    setCurrentQuestionIndex: (
      currentQuestionIndex
    ) => set({ currentQuestionIndex }),
    setResult: (result) => set({ result }),
    reset: () => set(getInitialState()),
  }));
