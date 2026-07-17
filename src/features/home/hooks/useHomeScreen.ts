import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePetOnboardingGateStore } from '@/features/pets/store/petOnboardingGate.store';
import { usePetStore } from '@/features/pets/store/pet.store';
import { listUpcomingCareEventsByPet } from '@/features/calendar/services/care-event.service';
import type { CareEvent } from '@/features/calendar/types/care-event.types';
import { listVeterinaries } from '@/features/veterinaries/services/veterinary.service';
import { buildQuickActions } from '../utils/buildQuickActions';

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return '¡Hola';
  }

  if (hour < 20) {
    return '¡Buenas tardes';
  }

  return '¡Buenas noches';
};

const formatLongDate = () =>
  new Intl.DateTimeFormat('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

const calculateAgeLabel = (
  birthDate: string | null,
  ageYears: number | null
) => {
  if (ageYears !== null) {
    return `${ageYears} años`;
  }

  if (!birthDate) {
    return 'Edad pendiente';
  }

  const birth = new Date(birthDate);

  if (Number.isNaN(birth.getTime())) {
    return 'Edad pendiente';
  }

  const today = new Date();
  let age =
    today.getFullYear() - birth.getFullYear();
  const monthDifference =
    today.getMonth() - birth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birth.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? `${age} años` : 'Edad pendiente';
};

const calculateWeightLabel = (
  weightKg: number | null
) =>
  weightKg !== null
    ? `${weightKg} kg`
    : 'Peso pendiente';

const calculateProfileProgress = ({
  birth_date,
  weight_kg,
  breed,
  allergies,
  medical_conditions,
}: {
  birth_date: string | null;
  weight_kg: number | null;
  breed: string | null;
  allergies: string[];
  medical_conditions: string[];
}) => {
  const checks = [
    Boolean(birth_date),
    weight_kg !== null,
    Boolean(breed),
    allergies.length > 0,
    medical_conditions.length > 0,
  ];

  const completed =
    checks.filter(Boolean).length;

  return Math.max(
    20,
    Math.round((completed / checks.length) * 100)
  );
};

export interface HomeQuickAction {
  id: string;
  label: string;
  description: string;
  iconName:
    | 'barbell-outline'
    | 'pulse-outline'
    | 'medkit-outline'
    | 'document-text-outline'
    | 'calendar-outline'
    | 'paw-outline';
  onPress: () => void;
}

export const useHomeScreen = () => {
  const router = useRouter();
  const clearSession = useAuthStore(
    (state) => state.clearSession
  );
  const user = useAuthStore((state) => state.user);
  const resetPetGate =
    usePetOnboardingGateStore(
      (state) => state.reset
    );
  const {
    pets,
    activePetId,
    isHydrating: isPetsHydrating,
    generalError: petsError,
    hydratePets,
    selectPet,
  } = usePetStore();
  const [isLoggingOut, setIsLoggingOut] =
    useState(false);
  const [logoutError, setLogoutError] =
    useState('');
  const [careEvents, setCareEvents] = useState<
    CareEvent[]
  >([]);
  const [
    isCareEventsHydrating,
    setIsCareEventsHydrating,
  ] = useState(false);
  const [careEventsError, setCareEventsError] =
    useState('');
  const [
    isEmergencyHydrating,
    setIsEmergencyHydrating,
  ] = useState(false);
  const [emergencyError, setEmergencyError] =
    useState('');
  const activePet =
    pets.find((pet) => pet.id === activePetId) ??
    pets[0] ??
    null;

  useEffect(() => {
    if (user?.id) {
      hydratePets(user.id);
    }
  }, [hydratePets, user?.id]);

  const hydrateUpcomingCare = async () => {
    if (!user?.id || !activePet?.id) {
      setCareEvents([]);
      return;
    }

    setIsCareEventsHydrating(true);
    setCareEventsError('');

    try {
      const nextEvents =
        await listUpcomingCareEventsByPet(
          user.id,
          activePet.id
        );
      setCareEvents(nextEvents);
    } catch (error) {
      setCareEventsError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar los próximos cuidados.'
      );
    } finally {
      setIsCareEventsHydrating(false);
    }
  };

  const hydrateEmergency = async () => {
    setIsEmergencyHydrating(true);
    setEmergencyError('');

    try {
      await listVeterinaries();
    } catch (error) {
      setEmergencyError(
        error instanceof Error
          ? error.message
          : 'No pudimos cargar las veterinarias.'
      );
    } finally {
      setIsEmergencyHydrating(false);
    }
  };

  useEffect(() => {
    hydrateUpcomingCare();
  }, [activePet?.id, user?.id]);

  useEffect(() => {
    hydrateEmergency();
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    setLogoutError('');

    try {
      await clearSession();
      resetPetGate();
      router.replace('/(auth)/login');
    } catch {
      setLogoutError(
        'No pudimos cerrar tu sesión. Inténtalo nuevamente.'
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navigateToPets = () => {
    router.push('/pets');
  };

  const navigateToCareProfile = () => {
    router.push('/care-profile');
  };

  const navigateToCalendar = () => {
    router.push('/calendar');
  };

  const navigateToVeterinariesList = () => {
    router.push('/veterinaries');
  };

  const navigateToVeterinariesMap = () => {
    router.push('/veterinaries?mode=map');
  };

  const navigateToSymptomChecker = () => {
    router.push('/symptom-checker');
  };

  const navigateToRecordEntry = (
    type?: string
  ) => {
    router.push(
      type
        ? `/record-entry?type=${type}`
        : '/record-entry'
    );
  };

  const navigateToEventEntry = () => {
    router.push('/event-entry');
  };

  const navigateToAddPet = () => {
    router.push('/pet-detail?mode=create');
  };

  const openEmergencyMenu = () => {
    Alert.alert(
      'Emergencia',
      '¿Cómo quieres buscar ayuda?',
      [
        {
          text: 'Ver mapa',
          onPress: navigateToVeterinariesMap,
        },
        {
          text: 'Ver listado',
          onPress: navigateToVeterinariesList,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const quickActions = useMemo<HomeQuickAction[]>(
    () =>
      buildQuickActions({
        navigateToRecordEntry,
        navigateToEventEntry,
        navigateToAddPet,
      }),
    []
  );

  const selectNextPet = () => {
    if (pets.length <= 1 || !activePetId) {
      navigateToPets();
      return;
    }

    const currentIndex = pets.findIndex(
      (pet) => pet.id === activePetId
    );
    const nextPet =
      pets[(currentIndex + 1) % pets.length];

    if (nextPet) {
      selectPet(nextPet.id);
    }
  };

  return {
    greeting: `${getGreeting()}, ${
      user?.email?.split('@')[0] ?? 'Usuario'
    }!`,
    currentDateLabel: formatLongDate(),
    userEmail: user?.email ?? '',
    activePet,
    pets,
    canSwitchPets: pets.length > 1,
    activePetAgeLabel: activePet
      ? calculateAgeLabel(
          activePet.birth_date,
          activePet.age_years
        )
      : '',
    activePetWeightLabel: activePet
      ? calculateWeightLabel(activePet.weight_kg)
      : '',
    profileProgress: activePet
      ? calculateProfileProgress(activePet)
      : 0,
    quickActions,
    careEvents,
    isPetsHydrating,
    petsError,
    isCareEventsHydrating,
    careEventsError,
    isEmergencyHydrating,
    emergencyError,
    isLoggingOut,
    logoutError,
    handleLogout,
    retryPets: () =>
      user?.id ? hydratePets(user.id) : Promise.resolve(),
    retryCareEvents: hydrateUpcomingCare,
    retryEmergency: hydrateEmergency,
    navigateToPets,
    navigateToCareProfile,
    navigateToCalendar,
    navigateToSymptomChecker,
    navigateToVeterinariesList,
    navigateToRecordEntry,
    navigateToEventEntry,
    navigateToAddPet,
    openEmergencyMenu,
    selectNextPet,
  };
};
