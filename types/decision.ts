export interface DecisionData {
  _id?: string;
  userId: string;
  itemId: string;
  listedPrice: number;
  discountedPrice: number;
  discountAmount: number;
  finalPrice: number;
  decision: 'considered' | 'buy' | 'skip';
  isGift: boolean;
  reason?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}
