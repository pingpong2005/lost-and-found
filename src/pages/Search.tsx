import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import ItemCard from '@/components/ItemCard';
import { Item } from '@/types';
import { api } from '@/services/api';

export default function Search() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, items]);

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Search the Portal</h2>
        <p className="text-muted">Find items by title, location, or category.</p>
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {query && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">
            {results.length} {results.length === 1 ? 'Result' : 'Results'} for "{query}"
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
              <p className="text-muted">No items found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-20">
          <p className="text-muted italic">Start typing to see results...</p>
        </div>
      )}
    </div>
  );
}
