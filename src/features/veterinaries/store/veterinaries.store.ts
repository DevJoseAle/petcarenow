import { create } from 'zustand';

interface VeterinariesStoreState {
  savedVeterinaryIds: string[];
  setSavedVeterinaryIds: (ids: string[]) => void;
  markSavedVeterinary: (id: string) => void;
  unmarkSavedVeterinary: (id: string) => void;
  isSavedVeterinary: (id: string) => boolean;
}

export const useVeterinariesStore =
  create<VeterinariesStoreState>((set, get) => ({
    savedVeterinaryIds: [],
    setSavedVeterinaryIds: (ids) =>
      set({
        savedVeterinaryIds: ids,
      }),
    markSavedVeterinary: (id) =>
      set((state) => ({
        savedVeterinaryIds:
          state.savedVeterinaryIds.includes(id)
            ? state.savedVeterinaryIds
            : [...state.savedVeterinaryIds, id],
      })),
    unmarkSavedVeterinary: (id) =>
      set((state) => ({
        savedVeterinaryIds:
          state.savedVeterinaryIds.filter(
            (item) => item !== id
          ),
      })),
    isSavedVeterinary: (id) =>
      get().savedVeterinaryIds.includes(id),
  }));
