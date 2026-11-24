import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StarRating } from '../components/StarRating';
import {
  Calendar, MapPin, Shield, CheckCircle, Clock, AlertCircle,
  Share2, Heart, ArrowLeft, ChevronRight, Check, X, Info,
  DollarSign, Truck, RefreshCw, Send, UserCheck, ShieldCheck
} from 'lucide-react';

export default function ItemDetailPage({ item: propItem, onRentRequest, onToggleItemAvailability }) {
  const { selectedItem, navigate, wishlist, toggleWishlist, addToast, user } = useApp();
  const item = propItem || selectedItem;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupNote, setPickupNote] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // If item is null, return to browse
  if (!item) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Item not found</h2>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('browse')}>
          Back to Browse
        </button>
      </div>
    );
  }

  const isWished = wishlist.includes(item.id);

  // Calculate rental duration and price breakdown
  const rentalCalculation = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { error: 'End date must be after start date', days: 0 };
    if (item.minDays && diffDays < item.minDays) {
      return { error: `Minimum rental period is ${item.minDays} day(s)`, days: diffDays };
    }
    if (item.maxDays && diffDays > item.maxDays) {
      return { error: `Maximum rental period is ${item.maxDays} days`, days: diffDays };
    }

    const subtotal = diffDays * item.price;
    const serviceFee = Math.round(subtotal * 0.10); // 10% platform fee
    const deposit = item.deposit || 0;
    const totalDue = subtotal + serviceFee + deposit;

    return {
      days: diffDays,
      subtotal,
      serviceFee,
      deposit,
      totalDue,
      error: null
    };
  }, [startDate, endDate, item]);

  const handleOpenRentalModal = () => {
    if (!startDate || !endDate) {
      addToast('Please select rental start and end dates first.', 'warning');
      return;
    }
    if (rentalCalculation?.error) {
      addToast(rentalCalculation.error, 'error');
      return;
    }
    setShowRequestModal(true);
  };

  const handleConfirmRequest = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setRequestSuccess(true);
      if (onRentRequest) {
        onRentRequest({
          itemId: item.id,
          item: item,
          startDate,
          endDate,
          totalDays: rentalCalculation.days,
          totalCost: rentalCalculation.subtotal + rentalCalculation.serviceFee,
          deposit: rentalCalculation.deposit,
          notes: pickupNote,
          status: 'pending',
          renterId: user.id,
          renterName: user.name,
          renterAvatar: user.avatar,
        });
      }
      addToast('Rental request sent to owner for approval!', 'success');
    }, 900);
  };

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Top Breadcrumb Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate('browse')}
            className="btn btn-ghost btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ArrowLeft size={16} /> Back to Browse
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                addToast('Link copied to clipboard!', 'info');
              }}
            >
              <Share2 size={15} /> Share
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => toggleWishlist(item.id)}
            >
              <Heart size={15} fill={isWished ? 'var(--error)' : 'none'} color={isWished ? 'var(--error)' : 'currentColor'} />
              {isWished ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 32, alignItems: 'start' }}>
          {/* LEFT: Images & Details */}
          <div>
            {/* Gallery */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ position: 'relative', width: '100%', height: 420, background: '#0f172a' }}>
                <img
                  src={item.images[activeImageIndex] || item.images[0]}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }}
                />
                {!item.available && (
                  <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: 13, backdropFilter: 'blur(4px)' }}>
                    Currently Rented Out
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: 12, backdropFilter: 'blur(4px)' }}>
                  {activeImageIndex + 1} / {item.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {item.images.length > 1 && (
                <div style={{ display: 'flex', gap: 12, padding: 16, overflowX: 'auto', borderTop: '1px solid var(--gray-100)' }}>
                  {item.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      style={{
                        width: 76,
                        height: 56,
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden',
                        border: activeImageIndex === idx ? '2px solid var(--primary)' : '2px solid transparent',
                        padding: 0,
                        cursor: 'pointer',
                        flexShrink: 0,
                        opacity: activeImageIndex === idx ? 1 : 0.7,
                        transition: 'var(--transition)'
                      }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Key Meta */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 28, marginTop: 24, border: '1px solid var(--gray-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span className="badge badge-primary">{item.category}</span>
                <span className={`badge ${item.available ? 'badge-success' : 'badge-error'}`}>
                  {item.available ? 'Available Now' : 'Not Available'}
                </span>
                <span className="badge badge-gray">Min. {item.minDays || 1} day</span>
                <span className="badge badge-gray">Max. {item.maxDays || 30} days</span>
              </div>

              <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.25 }}>
                {item.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <StarRating rating={item.rating} size={15} showValue />
                  <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>({item.reviews} reviews)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gray-600)', fontSize: 14 }}>
                  <MapPin size={16} color="var(--primary)" />
                  {item.location}
                </div>
              </div>

              <div className="divider" />

              {/* Description */}
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>
                  About this item
                </h3>
                <p style={{ color: 'var(--gray-600)', fontSize: 15, lineHeight: 1.7 }}>
                  {item.description}
                </p>
              </div>

              {/* Specs & Features */}
              {item.specs && Object.keys(item.specs).length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 12 }}>
                    Specifications & Details
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    {Object.entries(item.specs).map(([key, val]) => (
                      <div key={key} style={{ background: 'var(--gray-50)', padding: '12px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
                        <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'capitalize' }}>{key}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', marginTop: 2 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {item.tags.map(tag => (
                    <span key={tag} style={{ background: 'var(--gray-100)', color: 'var(--gray-700)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 500 }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Owner Profile Card */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 24, marginTop: 24, border: '1px solid var(--gray-200)' }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 16 }}>
                Meet the Owner
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img
                    src={item.owner.avatar}
                    alt={item.owner.name}
                    style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-100)' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--gray-900)' }}>{item.owner.name}</span>
                      {item.owner.verified && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: 'var(--success-light)', color: '#047857', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700 }}>
                          <ShieldCheck size={12} /> Verified
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 13, color: 'var(--gray-600)' }}>
                      <StarRating rating={item.owner.rating} size={13} showValue />
                      <span>· {item.owner.reviews} owner reviews</span>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => addToast(`Chat with ${item.owner.name} opened. Response time: < 1 hr`, 'info')}
                >
                  Message Owner
                </button>
              </div>

              <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--primary-50)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Shield size={20} color="var(--primary)" />
                <div style={{ fontSize: 13, color: 'var(--gray-700)' }}>
                  <strong>RentMate Protection:</strong> Security deposit is held in escrow and released only after both parties confirm return in agreed condition.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Rental Request & Availability Booking Box */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 28, border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-lg)' }}>
              {/* Pricing Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--primary)' }}>₹{item.price.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: 15, color: 'var(--gray-500)', fontWeight: 500 }}>/{item.unit}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                    Security deposit: ₹{item.deposit.toLocaleString('en-IN')} (refundable)
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <StarRating rating={item.rating} size={14} showValue />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{item.reviews} reviews</div>
                </div>
              </div>

              {/* Availability Status */}
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius)', background: item.available ? 'var(--success-light)' : 'var(--error-light)', color: item.available ? '#065f46' : '#991b1b', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                {item.available ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>{item.available ? 'Item is currently available to rent' : 'Currently booked by another user'}</span>
              </div>

              {/* Date Selection - Check Availability */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="var(--primary)" /> Start Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="var(--primary)" /> End Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={endDate}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Calculation Preview */}
              {rentalCalculation && (
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--gray-200)' }}>
                  {rentalCalculation.error ? (
                    <div style={{ color: 'var(--error)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                      <AlertCircle size={15} /> {rentalCalculation.error}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-600)' }}>
                        <span>₹{item.price.toLocaleString('en-IN')} × {rentalCalculation.days} {rentalCalculation.days === 1 ? 'day' : 'days'}</span>
                        <span style={{ fontWeight: 600 }}>₹{rentalCalculation.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-600)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          Service fee (10%) <Info size={13} color="var(--gray-400)" />
                        </span>
                        <span>₹{rentalCalculation.serviceFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-600)' }}>
                        <span>Refundable deposit</span>
                        <span>₹{rentalCalculation.deposit.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="divider" style={{ margin: '8px 0' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 17, color: 'var(--gray-900)' }}>
                        <span>Estimated Total</span>
                        <span style={{ color: 'var(--primary)' }}>₹{rentalCalculation.totalDue.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div style={{ marginTop: 24 }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: 16 }}
                  disabled={!item.available}
                  onClick={handleOpenRentalModal}
                >
                  <Send size={16} /> Request Rental
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-400)', marginTop: 10 }}>
                  You won't be charged until the owner approves your request
                </p>
              </div>

              {/* Highlights & Guarantees */}
              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--gray-100)', paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--gray-600)' }}>
                  <ShieldCheck size={18} color="var(--success)" />
                  <span>Item verified and protected by RentMate Shield</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--gray-600)' }}>
                  <RefreshCw size={18} color="var(--info)" />
                  <span>Free cancellation up to 24h before pickup</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--gray-600)' }}>
                  <Truck size={18} color="var(--accent)" />
                  <span>Local pickup or flexible return tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RENTAL REQUEST MODAL */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setShowRequestModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520, padding: 28 }}>
            {!requestSuccess ? (
              <form onSubmit={handleConfirmRequest}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)' }}>
                    Confirm Rental Request
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Summary Box */}
                <div style={{ display: 'flex', gap: 14, background: 'var(--gray-50)', padding: 14, borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', marginBottom: 20 }}>
                  <img src={item.images[0]} alt="" style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>{item.title}</h4>
                    <div style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 2 }}>
                      Owner: {item.owner.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginTop: 4 }}>
                      {startDate} to {endDate} ({rentalCalculation?.days} days)
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, marginBottom: 20, background: 'white', padding: '12px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-600)' }}>
                    <span>Rental cost ({rentalCalculation?.days} days):</span>
                    <span>₹{rentalCalculation?.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-600)' }}>
                    <span>Service fee (10%):</span>
                    <span>₹{rentalCalculation?.serviceFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-600)' }}>
                    <span>Refundable Deposit:</span>
                    <span>₹{rentalCalculation?.deposit.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="divider" style={{ margin: '6px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
                    <span>Total Authorization:</span>
                    <span style={{ color: 'var(--primary)' }}>₹{rentalCalculation?.totalDue.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Message to Owner */}
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label">Message / Note to Owner</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Introduce yourself, specify expected pickup time or ask questions..."
                    value={pickupNote}
                    onChange={(e) => setPickupNote(e.target.value)}
                    rows={3}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ flex: 1 }}
                    onClick={() => setShowRequestModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 2 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending Request...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={36} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 8 }}>
                  Request Sent Successfully!
                </h3>
                <p style={{ color: 'var(--gray-600)', fontSize: 14, lineHeight: 1.6, maxWidth: 380, margin: '0 auto 24px' }}>
                  We've notified <strong>{item.owner.name}</strong>. You will receive an update once the owner reviews and approves your rental request.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowRequestModal(false);
                      setRequestSuccess(false);
                      navigate('browse');
                    }}
                  >
                    Browse More Items
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setShowRequestModal(false);
                      setRequestSuccess(false);
                      navigate('dashboard');
                    }}
                  >
                    View Rental Status
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
