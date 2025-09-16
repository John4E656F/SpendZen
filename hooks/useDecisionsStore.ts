// src/hooks/useDecisionsStore.ts
import { create } from 'zustand';
import type { DecisionData } from '@/types/decision';

interface DecisionsStore {
  recentDecisions: DecisionData[];
  setRecentDecisions: (decisions: DecisionData[]) => void;
  addDecision: (decision: DecisionData) => void;
  clearDecisions: () => void;
}

export const useDecisionsStore = create<DecisionsStore>((set) => ({
  recentDecisions: [],
  setRecentDecisions: (decisions) => set({ recentDecisions: decisions }),
  addDecision: (decision) => set((state) => ({ recentDecisions: [...state.recentDecisions, decision] })),
  clearDecisions: () => set({ recentDecisions: [] }),
}));
