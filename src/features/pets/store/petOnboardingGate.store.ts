import { create } from 'zustand';
import { hasRegisteredPets } from '../services/pet.service';
import { logger } from '@/core/utils/debug';

interface PetOnboardingGateState {
  hasPets: boolean;
  isHydrating: boolean;
  generalError: string;
  hydratePetStatus: (ownerId: string) => Promise<void>;
  markHasPets: () => void;
  reset: () => void;
}

export const usePetOnboardingGateStore =
  create<PetOnboardingGateState>((set) => ({
    hasPets: false,
    isHydrating: true,
    generalError: '',
    hydratePetStatus: async (ownerId) => {
      logger.debug('PetOnboardingGateStore hydratePetStatus called', { ownerId });
      set({
        isHydrating: true,
        generalError: '',
      });

      try {
        const hasPets =
          await hasRegisteredPets(ownerId);

        logger.debug('PetOnboardingGateStore hydratePetStatus result', { hasPets });

        set({
          hasPets,
          isHydrating: false,
          generalError: '',
        });
      } catch (error) {
        logger.error('PetOnboardingGateStore hydratePetStatus error', error instanceof Error ? error.message : error);
        set({
          hasPets: false,
          isHydrating: false,
          generalError:
            error instanceof Error
              ? error.message
              : 'No pudimos validar las mascotas del usuario.',
        });
      }
    },
    markHasPets: () => {
      logger.debug('PetOnboardingGateStore markHasPets called');
      set({
        hasPets: true,
        isHydrating: false,
        generalError: '',
      });
    },
    reset: () => {
      logger.debug('PetOnboardingGateStore reset called');
      set({
        hasPets: false,
        isHydrating: true,
        generalError: '',
      });
    },
  }));
