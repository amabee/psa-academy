import { create } from "zustand";

export const useAppStore = create((set) => ({
  isLoading: true,
  isRedirecting: false,
  isError: false,
  isGenerating: false,
  isCreating: false,

  setStates: (states) => set(states),

  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsRedirecting: (redirecting) => set({ isRedirecting: redirecting }),
  setIsError: (error) => set({ isError: error }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setIsCreating: (creating) => set({ isCreating: creating }),

  reset: () =>
    set({
      isLoading: false,
      isRedirecting: false,
      isError: false,
      isGenerating: false,
      isCreating: false,
    }),
}));

