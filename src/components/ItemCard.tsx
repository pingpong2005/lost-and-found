import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag } from 'lucide-react';
import { Item } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card group cursor-pointer overflow-hidden flex flex-col h-full"
    >
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
    </motion.div>
  );
};

export default ItemCard;
