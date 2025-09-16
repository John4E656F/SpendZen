// src/hooks/useSavingsStore.ts
import { create } from 'zustand';
import type { SavingsData } from '@/types/';

interface SavingsStore extends SavingsData {
  setTotalSavings: (amount: number) => void;
  clearSavings: () => void;
}

export const useSavingsStore = create<SavingsStore>((set) => ({
  totalSavings: 0,
  setTotalSavings: (amount) => set({ totalSavings: amount }),
  clearSavings: () => set({ totalSavings: 0 }),
}));
