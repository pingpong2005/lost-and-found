import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Calendar, User, Phone, Tag, Info } from 'lucide-react';
import { ItemType } from '@/types';
import { api } from '@/services/api';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function AddItem() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'lost' as ItemType,
    location: '',
    date: new Date().toISOString().split('T')[0],
    contactName: '',
    contactPhone: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('Submitting form data:', formData);
      await api.addItem({
        ...formData,
        uid: user?.uid || 'anonymous'
      });
      navigate('/items');
    } catch (err: any) {
      console.error('Error adding item:', err);
      const errorMessage = err.response?.data?.details || err.response?.data?.message || err.message || 'Failed to post report. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Report an Item</h2>
        <p className="text-muted">Fill in the details to help others find their items.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 rounded-2xl">
          {(['lost', 'found'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: t }))}
              className={`py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                formData.type === t 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-muted hover:text-primary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <Tag size={12} /> Title
            </label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Blue Leather Wallet"
              className="input-field"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <Info size={12} /> Description
            </label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide as much detail as possible..."
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                <MapPin size={12} /> Location
              </label>
              <input
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where was it lost/found?"
                className="input-field"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                <Calendar size={12} /> Date
              </label>
              <input
                required
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <Tag size={12} /> Category
            </label>
            <select
              required
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field appearance-none bg-white"
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Personal Effects">Personal Effects</option>
              <option value="Pets">Pets</option>
              <option value="Keys">Keys</option>
              <option value="Documents">Documents</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                  <User size={12} /> Name
                </label>
                <input
                  required
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="input-field"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                  <Phone size={12} /> Phone
                </label>
                <input
                  required
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg font-semibold shadow-lg shadow-primary/20"
            >
              {loading ? 'Submitting...' : 'Post Report'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
