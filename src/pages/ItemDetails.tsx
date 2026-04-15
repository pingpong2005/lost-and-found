import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, User, Phone, Tag, ArrowLeft, Share2, Trash2, Edit3 } from 'lucide-react';
import { Item } from '@/types';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [item, setItem] = useState<Item | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        const data = await api.getItem(id);
        setItem(data);
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await api.deleteItem(id);
      navigate('/items');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const isOwner = user && item && (item.uid === user.uid);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!item) return <div className="text-center py-20">Item not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="aspect-square rounded-[40px] overflow-hidden bg-gray-100 shadow-xl">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Tag size={64} />
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            <button className="flex-1 py-3 rounded-2xl border border-gray-200 flex items-center justify-center gap-2 hover:bg-white transition-colors">
              <Share2 size={18} /> Share
            </button>
            {isOwner && (
              <>
                <button 
                  onClick={handleDelete}
                  className="p-3 rounded-2xl border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <button className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Edit3 size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className={cn(
              "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm",
              item.type === 'lost' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            )}>
              {item.type}
            </div>
            <h2 className="text-4xl font-bold tracking-tight">{item.title}</h2>
            <p className="text-muted leading-relaxed text-lg">
              {item.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Location</p>
              <div className="flex items-center gap-2 font-medium">
                <MapPin size={16} className="text-primary" />
                {item.location}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Date</p>
              <div className="flex items-center gap-2 font-medium">
                <Calendar size={16} className="text-primary" />
                {new Date(item.date).toLocaleDateString()}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Category</p>
              <div className="flex items-center gap-2 font-medium">
                <Tag size={16} className="text-primary" />
                {item.category}
              </div>
            </div>
          </div>

          <div className="p-8 bg-white rounded-[32px] shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest">Contact Person</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <User size={20} className="text-muted" />
                </div>
                <div>
                  <p className="font-semibold">{item.contactName}</p>
                  <p className="text-xs text-muted">Reporter</p>
                </div>
              </div>
              <a 
                href={`tel:${item.contactPhone}`}
                className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-white rounded-2xl font-bold hover:opacity-90 transition-opacity"
              >
                <Phone size={20} />
                {item.contactPhone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
