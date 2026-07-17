import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetStore } from '@/features/pets/store/pet.store';
import { useSubscriptionStore } from '@/features/subscriptions/store/subscription.store';
import {
  evaluateSymptomFlow,
  getQuestionFlowForSymptom,
  getQuestionOptions,
  shouldStopFlowAfterAnswer,
} from '../services/symptom-checker-engine.service';
import {
  getSupportedSymptoms,
  getSymptomByCode,
} from '../services/symptom-checker-catalog.service';
import {
  getSymptomCheckerUsage,
  getUsageAllowance,
  recordClosedEvaluation,
  type SymptomCheckerUsageSnapshot,
} from '../services/symptom-checker-usage.service';
import { saveSymptomCheckerEvaluation } from '../services/symptom-checker-history.service';
import { useSymptomCheckerStore } from '../store/symptom-checker.store';
import type {
  SymptomCode,
  SymptomQuestionAnswer,
} from '../types/symptom-checker.types';

export const useSymptomCheckerFlow = () => {
  const router = useRouter();
  const userId = useAuthStore(
    (state) => state.user?.id ?? null
  );
  const {
    isPremium,
    isHydrating: isSubscriptionHydrating,
    hydrate: hydrateSubscription,
  } = useSubscriptionStore();
  const {
    pets,
    activePetId,
    isHydrating: isPetsHydrating,
    generalError: petsError,
    hydratePets,
  } = usePetStore();
  const {
    currentStep,
    selectedPetId,
    selectedSymptomCode,
    generalError,
    answers,
    currentQuestionIndex,
    result,
    setCurrentStep,
    setSelectedPetId,
    setSelectedSymptomCode,
    setGeneralError,
    setAnswers,
    setCurrentQuestionIndex,
    setResult,
    reset,
  } = useSymptomCheckerStore();
  const [usageSnapshot, setUsageSnapshot] =
    useState<SymptomCheckerUsageSnapshot | null>(
      null
    );
  const [isUsageHydrating, setIsUsageHydrating] =
    useState(false);
  const [usageError, setUsageError] = useState('');

  useEffect(() => {
    if (userId) {
      void hydratePets(userId);
      void hydrateSubscription(userId);
    }
  }, [
    hydratePets,
    hydrateSubscription,
    userId,
  ]);

  useEffect(() => {
    let isMounted = true;

    const hydrateUsage = async () => {
      setIsUsageHydrating(true);
      setUsageError('');

      try {
        const usage = await getSymptomCheckerUsage();

        if (isMounted) {
          setUsageSnapshot(usage);
        }
      } catch (error) {
        if (isMounted) {
          setUsageError(
            error instanceof Error
              ? error.message
              : 'No pudimos cargar el uso del Symptom Checker.'
          );
        }
      } finally {
        if (isMounted) {
          setIsUsageHydrating(false);
        }
      }
    };

    void hydrateUsage();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (
      !selectedPetId &&
      activePetId &&
      pets.some((pet) => pet.id === activePetId)
    ) {
      setSelectedPetId(activePetId);
    }
  }, [
    activePetId,
    pets,
    selectedPetId,
    setSelectedPetId,
  ]);

  const symptoms = useMemo(
    () => getSupportedSymptoms(),
    []
  );
  const selectedSymptom =
    selectedSymptomCode
      ? getSymptomByCode(selectedSymptomCode)
      : null;
  const selectedPet =
    pets.find((pet) => pet.id === selectedPetId) ??
    null;
  const questions = selectedSymptomCode
    ? getQuestionFlowForSymptom(selectedSymptomCode)
    : [];
  const currentQuestion =
    questions[currentQuestionIndex] ?? null;
  const usageAllowance = getUsageAllowance({
    isPremium,
    completedEvaluations:
      usageSnapshot?.completedEvaluations ?? 0,
  });

  const resetConversationState = () => {
    setSelectedSymptomCode(null);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setResult(null);
  };

  const canContinue =
    currentStep === 'intro'
      ? !usageAllowance.isBlocked
      : currentStep === 'pet_selection'
        ? Boolean(selectedPetId) &&
          !usageAllowance.isBlocked
        : false;

  const handleContinue = () => {
    setGeneralError('');

    if (usageAllowance.isBlocked) {
      setGeneralError(
        'Tu plan gratuito ya alcanzó el límite mensual de chequeos. Activa Premium para seguir usando Symptom Checker.'
      );
      return;
    }

    if (currentStep === 'intro') {
      setCurrentStep('pet_selection');
      return;
    }

    if (currentStep === 'pet_selection') {
      if (!selectedPetId) {
        setGeneralError(
          'Selecciona una mascota para continuar.'
        );
        return;
      }

      resetConversationState();
      setCurrentStep('symptom_selection');
      router.push('/symptom-checker-chat');
    }
  };

  const handleBack = () => {
    setGeneralError('');

    if (currentStep === 'intro') {
      reset();
      router.back();
      return;
    }

    if (currentStep === 'pet_selection') {
      setCurrentStep('intro');
    }
  };

  const selectSymptomAndStart = (
    code: SymptomCode
  ) => {
    if (usageAllowance.isBlocked) {
      setGeneralError(
        'Tu plan gratuito ya alcanzó el límite mensual de chequeos. Activa Premium para seguir usando Symptom Checker.'
      );
      return;
    }

    setGeneralError('');
    setSelectedSymptomCode(code);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setResult(null);
    setCurrentStep('questionnaire');
  };

  const answerCurrentQuestion = (
    nextAnswer: SymptomQuestionAnswer
  ) => {
    if (!selectedSymptomCode || !currentQuestion) {
      return;
    }

    const nextAnswers = [
      ...answers,
      nextAnswer,
    ];

    setAnswers(nextAnswers);

    const earlyStop = shouldStopFlowAfterAnswer({
      symptomCode: selectedSymptomCode,
      answers: nextAnswers,
      currentQuestion,
      pet: selectedPet,
    });

    if (earlyStop) {
      setResult(earlyStop);
      setCurrentStep('result');
      return;
    }

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
      const finalResult = evaluateSymptomFlow({
        symptomCode: selectedSymptomCode,
        answers: nextAnswers,
        pet: selectedPet,
      });

      setResult(finalResult);
      setCurrentQuestionIndex(nextIndex);
      setCurrentStep('result');
      return;
    }

    setCurrentQuestionIndex(nextIndex);
  };

  const restartConversation = () => {
    if (usageAllowance.isBlocked) {
      setGeneralError(
        'Tu plan gratuito ya alcanzó el límite mensual de chequeos. Activa Premium para seguir usando Symptom Checker.'
      );
      return;
    }

    setGeneralError('');
    resetConversationState();
    setCurrentStep('symptom_selection');
  };

  return {
    currentStep,
    pets,
    selectedPet,
    selectedPetId,
    selectedSymptom,
    selectedSymptomCode,
    symptoms,
    questions,
    currentQuestion,
    currentQuestionIndex,
    currentQuestionOptions: currentQuestion
      ? getQuestionOptions(currentQuestion.answerType)
      : [],
    answers,
    result,
    usageSnapshot,
    usageAllowance,
    isUsageHydrating,
    usageError,
    isSubscriptionHydrating,
    isPremium,
    isPetsHydrating,
    petsError,
    generalError,
    hasPets: pets.length > 0,
    selectPet: (petId: string) => {
      setGeneralError('');
      setSelectedPetId(petId);
    },
    selectPetAndContinue: (petId: string) => {
      if (usageAllowance.isBlocked) {
        setGeneralError(
          'Tu plan gratuito ya alcanzó el límite mensual de chequeos. Activa Premium para seguir usando Symptom Checker.'
        );
        return;
      }

      setGeneralError('');
      setSelectedPetId(petId);
      resetConversationState();
      setCurrentStep('symptom_selection');
      router.push('/symptom-checker-chat');
    },
    selectSymptom: (code: SymptomCode) => {
      setGeneralError('');
      setSelectedSymptomCode(code);
    },
    selectSymptomAndStart,
    answerCurrentQuestion,
    goBackFromConversation: () => {
      setGeneralError('');
      resetConversationState();
      setCurrentStep('pet_selection');
      router.back();
    },
    restartConversation,
    closeEvaluation: async () => {
      setGeneralError('');

      try {
        if (
          userId &&
          selectedSymptomCode &&
          selectedSymptom &&
          result
        ) {
          await saveSymptomCheckerEvaluation({
            ownerId: userId,
            petId: selectedPet?.id ?? null,
            petName: selectedPet?.name ?? null,
            petType: selectedPet?.pet_type ?? null,
            symptomCode: selectedSymptomCode,
            symptomLabel: selectedSymptom.title,
            answers,
            result,
          });
        }

        const nextUsage =
          await recordClosedEvaluation();
        setUsageSnapshot(nextUsage);
        reset();
        router.replace('/(app)/(tabs)');
      } catch (error) {
        setGeneralError(
          error instanceof Error
            ? error.message
            : 'No pudimos cerrar la evaluación.'
        );
      }
    },
    openVeterinariesMap: () =>
      router.push('/veterinaries?mode=map'),
    openVeterinariesList: () =>
      router.push('/veterinaries'),
    openSubscription: () =>
      router.push('/subscription'),
    openHistory: () =>
      router.push('/symptom-checker-history'),
    retryPets: () =>
      userId ? hydratePets(userId) : Promise.resolve(),
    retryUsage: async () => {
      setIsUsageHydrating(true);
      setUsageError('');

      try {
        const usage = await getSymptomCheckerUsage();
        setUsageSnapshot(usage);
      } catch (error) {
        setUsageError(
          error instanceof Error
            ? error.message
            : 'No pudimos cargar el uso del Symptom Checker.'
        );
      } finally {
        setIsUsageHydrating(false);
      }
    },
    resetFlow: () => {
      reset();
    },
    handleBack,
    handleContinue,
    canContinue,
    goToCreatePet: () =>
      router.push('/pet-detail?mode=create'),
  };
};
