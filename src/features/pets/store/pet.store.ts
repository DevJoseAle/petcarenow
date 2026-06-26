import { create } from 'zustand';
import type { Pet } from '../types/pet.types';
import { getUserPets } from '../services/pet.service';

interface PetStoreState {
  pets: Pet[];
  activePetId: string | null;
  isHydrating: boolean;
  generalError: string;
  hydratePets: (ownerId: string) => Promise<void>;
  refreshPets: (ownerId: string) => Promise<void>;
  selectPet: (petId: string) => void;
  upsertPet: (pet: Pet) => void;
  removePet: (petId: string) => void;
  reset: () => void;
}

const pickNextActivePetId = (
  pets: Pet[],
  activePetId: string | null
) => {
  if (pets.length === 0) {
    return null;
  }

  if (
    activePetId &&
    pets.some((pet) => pet.id === activePetId)
  ) {
    return activePetId;
  }

  return pets[0]?.id ?? null;
};

export const usePetStore = create<PetStoreState>(
  (set, get) => ({
    pets: [],
    activePetId: null,
    isHydrating: false,
    generalError: '',
    hydratePets: async (ownerId) => {
      set({
        isHydrating: true,
        generalError: '',
      });

      try {
        const pets = await getUserPets(ownerId);

        set((state) => ({
          pets,
          activePetId: pickNextActivePetId(
            pets,
            state.activePetId
          ),
          isHydrating: false,
          generalError: '',
        }));
      } catch (error) {
        set({
          pets: [],
          activePetId: null,
          isHydrating: false,
          generalError:
            error instanceof Error
              ? error.message
              : 'No pudimos cargar las mascotas.',
        });
      }
    },
    refreshPets: async (ownerId) => {
      await get().hydratePets(ownerId);
    },
    selectPet: (petId) =>
      set((state) => ({
        activePetId: state.pets.some(
          (pet) => pet.id === petId
        )
          ? petId
          : state.activePetId,
      })),
    upsertPet: (pet) =>
      set((state) => {
        const alreadyExists = state.pets.some(
          (item) => item.id === pet.id
        );
        const pets = alreadyExists
          ? state.pets.map((item) =>
              item.id === pet.id ? pet : item
            )
          : [...state.pets, pet];

        return {
          pets,
          activePetId: pickNextActivePetId(
            pets,
            pet.id
          ),
        };
      }),
    removePet: (petId) =>
      set((state) => {
        const pets = state.pets.filter(
          (pet) => pet.id !== petId
        );

        return {
          pets,
          activePetId: pickNextActivePetId(
            pets,
            state.activePetId === petId
              ? null
              : state.activePetId
          ),
        };
      }),
    reset: () =>
      set({
        pets: [],
        activePetId: null,
        isHydrating: false,
        generalError: '',
      }),
  })
);
