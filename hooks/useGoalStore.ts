import { create } from 'zustand';
import type { GoalData } from '@/types/goal';

interface GoalStoreState {
  goals: GoalData[];
  setGoals: (goals: GoalData[]) => void;
  addGoal: (goal: GoalData) => void;
  clearGoals: () => void;
}

export const useGoalStore = create<GoalStoreState>((set) => ({
  goals: [],
  setGoals: (goals) => set({ goals }),
  addGoal: (goal) =>
    set((state) => {
      const exists = state.goals.find((g) => g._id === goal._id);
      if (exists) {
        // Replace existing goal
        return { goals: state.goals.map((g) => (g._id === goal._id ? goal : g)) };
      } else {
        // Add new goal
        return { goals: [...state.goals, goal] };
      }
    }),
  clearGoals: () => set({ goals: [] }),
}));
