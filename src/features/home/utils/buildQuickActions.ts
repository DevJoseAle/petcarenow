import type { HomeQuickAction } from '../hooks/useHomeScreen';

interface QuickActionHandlers {
    navigateToRecordEntry: (type?: string) => void;
  navigateToEventEntry: () => void;
  navigateToAddPet: () => void;
}

export const buildQuickActions = ({
  navigateToRecordEntry,
  navigateToEventEntry,
  navigateToAddPet,
}: QuickActionHandlers): HomeQuickAction[] => [
  {
    id: 'weight',
    label: 'Peso',
    description: 'Registra el último control de peso.',
    iconName: 'barbell-outline',
    onPress: () => navigateToRecordEntry('weight'),
  },
  {
    id: 'symptom',
    label: 'Síntoma',
    description: 'Anota cambios o señales importantes.',
    iconName: 'pulse-outline',
    onPress: () => navigateToRecordEntry('symptom'),
  },
  {
    id: 'medication',
    label: 'Medicación',
    description: 'Guarda una dosis o tratamiento.',
    iconName: 'medkit-outline',
    onPress: () => navigateToRecordEntry('medication'),
  },
  {
    id: 'note',
    label: 'Nota',
    description: 'Escribe una observación rápida.',
    iconName: 'document-text-outline',
    onPress: () => navigateToRecordEntry('note'),
  },
  {
    id: 'care',
    label: 'Programar cuidado',
    description: 'Crea un recordatorio o evento.',
    iconName: 'calendar-outline',
    onPress: navigateToEventEntry,
  },
  {
    id: 'pet',
    label: 'Agregar mascota',
    description: 'Suma otra mascota a tu perfil.',
    iconName: 'paw-outline',
    onPress: navigateToAddPet,
  },
];
