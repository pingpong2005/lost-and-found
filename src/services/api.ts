import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '@/firebase';
import { Item, ItemFormData } from '@/types';

const itemsCollection = collection(db, 'items');

export const api = {
  getItems: async () => {
    const q = query(itemsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Item[];
  },
  
  getItem: async (id: string) => {
    const docRef = doc(db, 'items', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) throw new Error('Item not found');
    return { id: snapshot.id, ...snapshot.data() } as Item;
  },
  
  addItem: async (item: ItemFormData | any) => {
    const newItem = {
      ...item,
      uid: auth.currentUser?.uid || 'anonymous',
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(itemsCollection, newItem);
    const snapshot = await getDoc(docRef);
    return { id: docRef.id, ...snapshot.data() } as Item;
  },
  
  updateItem: async (id: string, item: Partial<Item>) => {
    const docRef = doc(db, 'items', id);
    await updateDoc(docRef, item);
    const snapshot = await getDoc(docRef);
    return { id: snapshot.id, ...snapshot.data() } as Item;
  },
  
  deleteItem: async (id: string) => {
    const docRef = doc(db, 'items', id);
    await deleteDoc(docRef);
  }
};
