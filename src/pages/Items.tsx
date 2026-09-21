import React, { useState, useEffect } from 'react';
import ItemCard from '@/components/ItemCard';
import { Item, ItemType } from '@/types';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';
import { AnimatePresence } from 'motion/react';

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ItemType | 'all'>('all');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await api.getItems();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleRemove = async (id: string) => {
    await api.deleteItem(id);
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">All Reported Items</h2>
          <p className="text-muted text-sm">Browse through all lost and found reports.</p>
        </div>

        <div className="flex bg-white p-1 rounded-full shadow-sm border border-gray-100">
          {(['all', 'lost', 'found'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "px-6 py-1.5 rounded-full text-sm font-medium transition-all capitalize",
                filter === t ? "bg-primary text-white shadow-md" : "text-muted hover:text-primary"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-64 animate-pulse bg-gray-100" />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} onRemove={handleRemove} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
          <p className="text-muted">No items found matching your filter.</p>
        </div>
      )}
    </div>
  );
}
