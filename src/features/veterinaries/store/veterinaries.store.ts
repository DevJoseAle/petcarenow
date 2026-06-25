import { create } from 'zustand';

interface VeterinariesStoreState {
  savedVeterinaryIds: string[];
  toggleSavedVeterinary: (id: string) => void;
  isSavedVeterinary: (id: string) => boolean;
}

export const useVeterinariesStore =
  create<VeterinariesStoreState>((set, get) => ({
    savedVeterinaryIds: [],
    toggleSavedVeterinary: (id) =>
      set((state) => ({
        savedVeterinaryIds:
          state.savedVeterinaryIds.includes(id)
            ? state.savedVeterinaryIds.filter(
                (item) => item !== id
              )
            : [...state.savedVeterinaryIds, id],
      })),
    isSavedVeterinary: (id) =>
      get().savedVeterinaryIds.includes(id),
  }));
