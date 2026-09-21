import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Calendar, User, Phone, Tag, Info, X, ImagePlus, LogIn } from 'lucide-react';
import { ItemType } from '@/types';
import { api } from '@/services/api';
import { auth, loginWithGoogle } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function AddItem() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('Submitting form data:', formData);
      await api.addItem({
        ...formData,
        image: imageFile,
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
      {!user ? (
        <div className="text-center space-y-6 py-12 card">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn size={40} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Sign in Required</h2>
          <p className="text-muted">You must be logged in to report a lost or found item. This helps us prevent spam and ensures items can be returned safely.</p>
          <button 
            onClick={loginWithGoogle} 
            className="btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2 max-w-sm mx-auto"
          >
            <LogIn size={20} />
            Sign in with Google
          </button>
        </div>
      ) : (
        <>
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
          {/* Photo Upload */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <Camera size={12} /> Photo (optional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <ImagePlus size={22} className="text-muted" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload a photo</p>
                  <p className="text-xs text-muted mt-0.5">JPG, PNG up to 5MB</p>
                </div>
              </button>
            )}
          </div>

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
              {loading ? (imageFile ? 'Uploading photo & submitting...' : 'Submitting...') : 'Post Report'}
            </button>
          </div>
        </div>
      </form>
        </>
      )}
    </div>
  );
}

