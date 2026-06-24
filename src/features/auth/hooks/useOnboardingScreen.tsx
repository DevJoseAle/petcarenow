import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'expo-router';
import type {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useOnboardingStore } from '../store/onboarding.store';

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 'health',
    title: 'Cuida la salud de tu mascota',
    description:
      'Registra vacunas, síntomas y recordatorios importantes.',
  },
  {
    id: 'emergency',
    title: 'Emergencias más rápidas',
    description:
      'Encuentra clínicas y ten acceso rápido a información importante.',
  },
  {
    id: 'family',
    title: 'Comparte el cuidado',
    description:
      'Mantén a tus cercanos alineados con la salud de tu mascota.',
  },
];

export const useOnboardingScreen = (
  width: number
) => {
  const router = useRouter();
  const listRef = useRef<FlatList>(null);
  const isOnboarded = useOnboardingStore(
    (state) => state.isOnboarded
  );
  const completeOnboarding =
    useOnboardingStore(
      (state) => state.completeOnboarding
    );
  const [currentIndex, setCurrentIndex] =
    useState(0);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    if (isOnboarded) {
      router.replace('/(auth)/login');
    }
  }, [isOnboarded, router]);

  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );

    setCurrentIndex(index);
  };

  const goToNextSlide = async () => {
    if (isSubmitting) {
      return;
    }

    const isLastSlide =
      currentIndex === slides.length - 1;

    if (isLastSlide) {
      setIsSubmitting(true);
      await completeOnboarding();
      router.replace('/(auth)/login');
      return;
    }

    const nextIndex = currentIndex + 1;

    listRef.current?.scrollToIndex({
      animated: true,
      index: nextIndex,
    });
    setCurrentIndex(nextIndex);
  };

  return {
    listRef,
    slides,
    currentIndex,
    isLastSlide:
      currentIndex === slides.length - 1,
    isSubmitting,
    handleScrollEnd,
    goToNextSlide,
  };
};
