import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import {
  Upload, Plus, Trash2, ArrowLeft, CheckCircle, AlertCircle,
  DollarSign, MapPin, Tag, Shield, HelpCircle, Image as ImageIcon
} from 'lucide-react';

export default function ListItemPage({ onAddItem }) {
  const { navigate, addToast, user } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('cameras');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('day');
  const [deposit, setDeposit] = useState('');
  const [minDays, setMinDays] = useState('1');
  const [maxDays, setMaxDays] = useState('14');
  const [location, setLocation] = useState(user.location || 'San Francisco, CA');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80'
  ]);
  const [tags, setTags] = useState('electronic, modern, high quality');
  const [specs, setSpecs] = useState([
    { key: 'Brand', value: 'Sony' },
    { key: 'Condition', value: 'Excellent' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    setImages(prev => [...prev, imageUrl.trim()]);
    setImageUrl('');
    addToast('Photo added to gallery', 'success');
  };

  const handleRemoveImage = (index) => {
    if (images.length === 1) {
      addToast('At least one photo is required', 'warning');
      return;
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSpec = () => {
    setSpecs(prev => [...prev, { key: '', value: '' }]);
  };

  const handleUpdateSpec = (index, field, value) => {
    setSpecs(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const handleRemoveSpec = (index) => {
    setSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      addToast('Please enter an item title', 'error');
      return;
    }
    if (!price || Number(price) <= 0) {
      addToast('Please enter a valid price', 'error');
      return;
    }
    if (images.length === 0) {
      addToast('Please provide at least one photo', 'error');
      return;
    }

    setIsSubmitting(true);

    const specObj = {};
    specs.forEach(s => {
      if (s.key.trim() && s.value.trim()) {
        specObj[s.key.trim()] = s.value.trim();
      }
    });

    const parsedTags = tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);

    const newItem = {
      id: Date.now(),
      title,
      category,
      price: Number(price),
      unit,
      deposit: Number(deposit) || 100,
      minDays: Number(minDays) || 1,
      maxDays: Number(maxDays) || 30,
      description,
      location,
      images,
      tags: parsedTags,
      specs: specObj,
      owner: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        rating: 5.0,
        reviews: 1,
        verified: true
      },
      rating: 5.0,
      reviews: 0,
      available: true,
      featured: false,
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      setIsSubmitting(false);
      if (onAddItem) onAddItem(newItem);
      addToast('Item listed successfully! It is now live for rent.', 'success');
      navigate('dashboard');
    }, 800);
  };

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh', padding: '36px 0 80px' }}>
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Header Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <button onClick={() => navigate('dashboard')} className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
            Listings are covered by RentMate Security Escrow
          </span>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 36, border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ marginBottom: 28 }}>
            <span className="badge badge-primary" style={{ marginBottom: 8 }}>Owner Hub</span>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-900)' }}>
              List an Item for Rent
            </h1>
            <p style={{ color: 'var(--gray-500)', fontSize: 15, marginTop: 4 }}>
              Monetize your idle equipment. Set your price, rental terms, and deposit.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Title & Category */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Item Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sony A7IV Mirrorless Camera Kit"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing & Deposit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Rental Price (₹) *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="1499"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                    min="1"
                  />
                  <select
                    className="form-select"
                    style={{ width: 110 }}
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                  >
                    <option value="day">/ day</option>
                    <option value="week">/ week</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Security Deposit (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="5000"
                  value={deposit}
                  onChange={e => setDeposit(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Min / Max Days</label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Min"
                    value={minDays}
                    onChange={e => setMinDays(e.target.value)}
                    min="1"
                    style={{ textAlign: 'center' }}
                  />
                  <span style={{ color: 'var(--gray-400)' }}>–</span>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Max"
                    value={maxDays}
                    onChange={e => setMaxDays(e.target.value)}
                    min="1"
                    style={{ textAlign: 'center' }}
                  />
                </div>
              </div>
            </div>

            {/* Location & Tags */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Pickup & Handover Location</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. San Francisco, CA (or neighborhood)"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                  <MapPin size={16} color="var(--gray-400)" style={{ position: 'absolute', right: 12, top: 12 }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Search Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 4k, canon, tripod, studio"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Describe your item, what accessories are included, care instructions, and any special usage rules..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Image Gallery Manager */}
            <div className="form-group">
              <label className="form-label">Item Photos</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input
                  type="url"
                  className="form-input"
                  placeholder="Paste image URL (e.g. Unsplash or direct image link)"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                />
                <button type="button" className="btn btn-secondary" onClick={handleAddImageUrl}>
                  <Plus size={16} /> Add Image
                </button>
              </div>

              {/* Sample Quick Images */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>Quick Presets:</span>
                {[
                  { label: 'Camera', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80' },
                  { label: 'Drone', url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80' },
                  { label: 'Power Tools', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80' },
                  { label: 'Mountain Bike', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' }
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 11, padding: '3px 8px' }}
                    onClick={() => setImages(prev => [...prev, p.url])}
                  >
                    + {p.label}
                  </button>
                ))}
              </div>

              {/* Photo Preview Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', height: 110, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--gray-200)' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        background: 'rgba(239, 68, 68, 0.85)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                    {i === 0 && (
                      <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Key-Value */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Specifications & Features</label>
                <button type="button" className="btn btn-ghost btn-sm" onClick={handleAddSpec}>
                  <Plus size={14} /> Add Specification
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {specs.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Resolution / Brand"
                      value={s.key}
                      onChange={e => handleUpdateSpec(idx, 'key', e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 4K 60fps / Sony"
                      value={s.value}
                      onChange={e => handleUpdateSpec(idx, 'value', e.target.value)}
                      style={{ flex: 1.5 }}
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleRemoveSpec(idx)}
                      style={{ color: 'var(--error)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="divider" />

            {/* Submit & Cancel */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('dashboard')}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
                style={{ minWidth: 200 }}
              >
                {isSubmitting ? 'Publishing Item...' : 'Publish Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
