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

// Compress and resize image to base64 data URL
const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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
    let imageUrl = '';
    
    // Compress and convert image to base64 if provided
    if (item.image && item.image instanceof File) {
      imageUrl = await compressImage(item.image);
    }

    const { image, ...itemData } = item;
    const newItem = {
      ...itemData,
      ...(imageUrl ? { imageUrl } : {}),
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
