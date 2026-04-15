import React, { useState, useEffect } from 'react';
import ItemCard from '@/components/ItemCard';
import { Item } from '@/types';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';

export default function Home() {
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await api.getItems();
        setRecentItems(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 py-12">
        <h2 className="text-5xl font-light tracking-tight">Help your community <br/><span className="font-semibold">reconnect with their items.</span></h2>
        <p className="text-muted max-w-xl mx-auto">Report lost items or post things you've found to help them find their way back home.</p>
        <div className="flex justify-center gap-4 pt-4">
          <Link to="/add" className="btn-primary">Report an Item</Link>
          <Link to="/items" className="px-6 py-2 rounded-full border border-gray-200 hover:bg-white transition-colors">Browse All</Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Recently Reported</h3>
          <Link to="/items" className="text-sm font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card h-64 animate-pulse bg-gray-100" />
            ))
          ) : (
            recentItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
