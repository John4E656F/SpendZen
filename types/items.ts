export interface ItemData {
  _id?: string;
  userId: string;
  itemName: string;
  itemPrice: number;
  itemCategory: string;
  purchaseDate: string; // ISO date string
  note?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}
