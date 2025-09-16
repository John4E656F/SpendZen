export interface GoalData {
  _id?: string;
  userId: string;
  goalName: string;
  currentAmount: number;
  goalAmount: number;
  status: 'active' | 'completed' | 'abandoned';
  selectedCategories: string[];
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}
