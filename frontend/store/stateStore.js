import { create } from "zustand";

export const useLoadingStore = create((set) => ({
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

export const useRedirectionStore = create((set) => ({
  isRedirecting: false,
  setIsRedirecting: (redirecting) => set({ isRedirecting: redirecting }),
}));

export const useErrorStore = create((set) => ({
  isError: false,
  setIsError: (error) => set({ isError: error }),
}));
