import { getBackendUrl } from '../index';
import { useGoalStore } from '@/hooks';
import type { GoalData } from '@/types';

export async function saveGoalToDb(goalPayload: {
  goalName: string;
  goalAmount: string;
  selectedCategories: string[];
  userId: string;
}): Promise<GoalData> {
  const url = `${getBackendUrl()}/goal/save`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Failed to save goal: ' + errorText);
    }

    const respJson = await response.json();
    const goal: GoalData = respJson.goal;

    // Add or update goal in Zustand
    useGoalStore.getState().addGoal(goal);

    return goal;
  } catch (error) {
    console.error('Error saving goal:', error);
    throw error;
  }
}
