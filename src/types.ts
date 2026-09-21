export type ItemType = 'lost' | 'found';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  type: ItemType;
  location: string;
  date: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
  imageUrl?: string;
  uid?: string;
}

export interface ItemFormData {
  title: string;
  description: string;
  category: string;
  type: ItemType;
  location: string;
  date: string;
  contactName: string;
  contactPhone: string;
  image?: File;
}
