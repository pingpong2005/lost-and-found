import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, Trash2, CheckCircle, X } from 'lucide-react';
import { Item } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface ItemCardProps {
  item: Item;
  onRemove?: (id: string) => Promise<void>;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onRemove }) => {
  const [user] = useAuthState(auth);
  const [showConfirm, setShowConfirm] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const [error, setError] = useState('');

  const handleConfirmRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onRemove) return;
    setRemoving(true);
    setError('');
    try {
      await onRemove(item.id);
    } catch (err: any) {
      console.error('Error removing item:', err);
      const msg = err?.code === 'permission-denied' || err?.message?.includes('permission')
        ? 'Only the person who posted this item can remove it.'
        : 'Failed to remove item. Please try again.';
      setError(msg);
      setRemoving(false);
    }
  };

  const handleCancelRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      whileHover={{ y: -4 }}
      className="card group cursor-pointer overflow-hidden flex flex-col h-full relative"
    >
      {/* Confirmation overlay */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm rounded-[24px] flex flex-col items-center justify-center gap-4 p-6"
        >
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm">Mark as Recovered?</p>
            <p className="text-muted text-xs mt-1">This will remove the item from the list permanently.</p>
            {error && (
              <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>
            )}
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={handleCancelRemove}
              disabled={removing}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              onClick={handleConfirmRemove}
              disabled={removing}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {removing ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle size={14} />
                  Remove
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      <Link to={`/items/${item.id}`} className="flex-1 flex flex-col">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-4">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Tag size={32} />
            </div>
          )}
          <div className={cn(
            "absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
            item.type === 'lost' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
          )}>
            {item.type}
          </div>

        </div>

        <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-primary/80 transition-colors">
          {item.title}
        </h3>
        
        <p className="text-muted text-sm line-clamp-2 mb-4 flex-1">
          {item.description}
        </p>

        <div className="space-y-2 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-muted">
            <MapPin size={14} />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Calendar size={14} />
            <span>{new Date(item.date).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
      
      {/* Explicit Remove Button at the bottom */}
      {user && user.uid === item.uid && onRemove && (
        <div className="px-4 pb-4 mt-auto pt-2">
          <button
            onClick={handleRemoveClick}
            className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            <Trash2 size={16} />
            Remove Item
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ItemCard;
