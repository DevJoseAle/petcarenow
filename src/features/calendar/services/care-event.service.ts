import type {
  CareEvent,
  CreateCareEventInput,
} from '../types/care-event.types';

let careEventsMock: CareEvent[] = [
  {
    id: 'care-1',
    pet_id: 'mock-pet',
    owner_id: 'mock-owner',
    event_type: 'deworming',
    title: 'Antiparasitario',
    description: 'Dosis trimestral',
    starts_at: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    ends_at: null,
    status: 'scheduled',
    reminder_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'care-2',
    pet_id: 'mock-pet',
    owner_id: 'mock-owner',
    event_type: 'consultation',
    title: 'Control veterinario',
    description: 'Chequeo general',
    starts_at: '',
    ends_at: null,
    status: 'scheduled',
    reminder_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'care-3',
    pet_id: 'mock-pet',
    owner_id: 'mock-owner',
    event_type: 'vaccine',
    title: 'Vacuna anual',
    description: 'Refuerzo anual',
    starts_at: new Date(
      Date.now() + 10 * 24 * 60 * 60 * 1000
    ).toISOString(),
    ends_at: null,
    status: 'scheduled',
    reminder_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const createMockId = () =>
  `event-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

const matchOwnerOrFallback = (
  event: CareEvent,
  ownerId: string
) =>
  event.owner_id === ownerId ||
  event.owner_id === 'mock-owner';

const matchPetOrFallback = (
  event: CareEvent,
  petId: string
) =>
  event.pet_id === petId ||
  event.pet_id === 'mock-pet';

export const listCareEvents = async (
  ownerId: string
) => {
  return careEventsMock
    .filter((event) =>
      matchOwnerOrFallback(event, ownerId)
    )
    .sort((left, right) =>
      left.starts_at.localeCompare(right.starts_at)
    );
};

export const listUpcomingCareEventsByPet = async (
  ownerId: string,
  petId: string
) => {
  return careEventsMock
    .filter((event) =>
      matchOwnerOrFallback(event, ownerId)
    )
    .filter((event) =>
      matchPetOrFallback(event, petId)
    )
    .filter((event) => event.status === 'scheduled')
    .sort((left, right) =>
      left.starts_at.localeCompare(right.starts_at)
    );
};

export const listVaccinesByPet = async (
  ownerId: string,
  petId: string
) => {
  return careEventsMock.filter(
    (event) =>
      matchOwnerOrFallback(event, ownerId) &&
      matchPetOrFallback(event, petId) &&
      event.event_type === 'vaccine'
  );
};

export const createCareEvent = async (
  input: CreateCareEventInput
) => {
  const now = new Date().toISOString();
  const nextEvent: CareEvent = {
    id: createMockId(),
    pet_id: input.pet_id,
    owner_id: input.owner_id,
    event_type: input.event_type,
    title: input.title,
    description: input.description ?? null,
    starts_at: input.starts_at,
    ends_at: input.ends_at ?? null,
    status: 'scheduled',
    reminder_at: input.reminder_at ?? null,
    created_at: now,
    updated_at: now,
  };

  careEventsMock = [nextEvent, ...careEventsMock];

  return nextEvent;
};

export const __resetCareEventsMock = () => {
  careEventsMock = [];
};
