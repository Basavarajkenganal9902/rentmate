import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StarRating } from '../components/StarRating';
import {
  Package, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw,
  Truck, ArrowRight, ShieldCheck, ChevronRight, Check, X,
  Calendar, FileText, QrCode, DollarSign, Filter, Search
} from 'lucide-react';

export default function DashboardPage({
  rentals,
  incomingRequests,
  myListings,
  onApproveRequest,
  onRejectRequest,
  onUpdateReturnStatus,
  onToggleListingAvailability
}) {
  const { navigate, addToast, user } = useApp();

  const [activeTab, setActiveTab] = useState('rentals'); // 'rentals' | 'approvals' | 'listings' | 'tracking'
  const [selectedRentalForTracking, setSelectedRentalForTracking] = useState(null);
  const [returnStepNotes, setReturnStepNotes] = useState('');
  const [rentalFilter, setRentalFilter] = useState('all'); // 'all' | 'active' | 'pending' | 'completed'

  // Filtered rentals
  const filteredRentals = rentals.filter(r => {
    if (rentalFilter === 'all') return true;
    return r.status === rentalFilter;
  });

  // Calculate quick owner stats
  const pendingRequestsCount = incomingRequests.filter(r => r.status === 'pending').length;
  const activeRentalsCount = rentals.filter(r => r.status === 'active').length;

  const handleReturnProcess = (rentalId, nextStatus) => {
    if (onUpdateReturnStatus) {
      onUpdateReturnStatus(rentalId, nextStatus, returnStepNotes);
    }
    addToast(`Return status updated to: ${nextStatus.toUpperCase()}`, 'success');
    setReturnStepNotes('');
  };

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh', padding: '36px 0 80px' }}>
      <div className="container">
        {/* User Profile Summary Header */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 28, border: '1px solid var(--gray-200)', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-100)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--gray-900)' }}>{user.name}</h1>
                <span className="badge badge-success" style={{ gap: 4 }}>
                  <ShieldCheck size={13} /> Verified Member
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4, color: 'var(--gray-500)', fontSize: 13, flexWrap: 'wrap' }}>
                <span>{user.location}</span>
                <span>•</span>
                <span>Member since {user.memberSince}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <StarRating rating={user.rating} size={13} showValue />
                  ({user.reviews} reviews)
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" onClick={() => navigate('profile')}>
              Edit Profile
            </button>
            <button className="btn btn-primary" onClick={() => navigate('list-item')}>
              + List New Item
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 8, borderBottom: '2px solid var(--gray-200)', marginBottom: 28, overflowX: 'auto' }}>
          {[
            { id: 'rentals', label: 'My Rental History', count: rentals.length, icon: Clock },
            { id: 'approvals', label: 'Owner Approvals', count: pendingRequestsCount, highlight: pendingRequestsCount > 0, icon: AlertCircle },
            { id: 'listings', label: 'My Listings', count: myListings.length, icon: Package },
            { id: 'tracking', label: 'Return Tracking Hub', icon: Truck },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 15,
                  color: isActive ? 'var(--primary)' : 'var(--gray-600)',
                  borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  marginBottom: -2,
                  transition: 'var(--transition)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={17} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    style={{
                      background: tab.highlight ? 'var(--error)' : isActive ? 'var(--primary-100)' : 'var(--gray-200)',
                      color: tab.highlight ? 'white' : isActive ? 'var(--primary-dark)' : 'var(--gray-700)',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: RENTAL HISTORY & MY BORROWED ITEMS */}
        {/* ======================================================== */}
        {activeTab === 'rentals' && (
          <div>
            {/* Status Filter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {['all', 'active', 'pending', 'completed'].map(f => (
                  <button
                    key={f}
                    onClick={() => setRentalFilter(f)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--gray-300)',
                      background: rentalFilter === f ? 'var(--gray-800)' : 'white',
                      color: rentalFilter === f ? 'white' : 'var(--gray-700)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                Showing {filteredRentals.length} bookings
              </div>
            </div>

            {filteredRentals.length === 0 ? (
              <div className="empty-state card" style={{ padding: 60 }}>
                <Clock size={48} />
                <h3>No rental bookings in this filter</h3>
                <p>Browse our catalog and rent top-tier items from local owners.</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('browse')}>
                  Browse Items Now
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filteredRentals.map(rental => {
                  const isPending = rental.status === 'pending';
                  const isActive = rental.status === 'active';
                  const isCompleted = rental.status === 'completed';

                  return (
                    <div key={rental.id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <img
                            src={rental.item.images[0]}
                            alt={rental.item.title}
                            style={{ width: 100, height: 90, borderRadius: 'var(--radius)', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span className={`badge ${
                                isPending ? 'badge-warning' :
                                isActive ? 'badge-primary' : 'badge-success'
                              }`}>
                                {rental.status.toUpperCase()}
                              </span>
                              <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>ID: #{rental.id}</span>
                            </div>
                            <h3
                              style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)', cursor: 'pointer' }}
                              onClick={() => navigate('item-detail', rental.item)}
                            >
                              {rental.item.title}
                            </h3>
                            <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
                              Owner: <strong>{rental.item.owner.name}</strong> • Location: {rental.item.location}
                            </div>
                          </div>
                        </div>

                        {/* Financial and dates */}
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>
                            ₹{rental.totalCost.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>
                            {rental.startDate} → {rental.endDate} ({rental.totalDays} days)
                          </div>
                          {rental.returnTrackingCode && (
                            <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 4, fontFamily: 'monospace' }}>
                              Track Code: <strong>{rental.returnTrackingCode}</strong>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Return Tracker Preview / Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--gray-50)', padding: '12px 16px', borderRadius: 'var(--radius)', flexWrap: 'wrap', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Truck size={18} color="var(--primary)" />
                          <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>
                            {isPending && 'Awaiting owner approval for booking dates.'}
                            {isActive && 'Item in use. Return handover scheduled at end of period.'}
                            {isCompleted && 'Item returned and inspected. Security deposit refunded.'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          {isActive && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setSelectedRentalForTracking(rental);
                                setActiveTab('tracking');
                              }}
                            >
                              <Truck size={14} /> Open Return Tracking
                            </button>
                          )}
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => navigate('item-detail', rental.item)}
                          >
                            View Item
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: OWNER APPROVALS & REQUEST MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'approvals' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)' }}>
                Incoming Rental Requests
              </h2>
              <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>
                Review, approve or reject requests for your items listed on RentMate.
              </p>
            </div>

            {incomingRequests.length === 0 ? (
              <div className="empty-state card" style={{ padding: 60 }}>
                <CheckCircle size={48} />
                <h3>No incoming requests at this time</h3>
                <p>When renters request to book your items, they will appear here for your approval.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {incomingRequests.map(req => {
                  const isPending = req.status === 'pending';
                  const isApproved = req.status === 'approved';
                  const isRejected = req.status === 'rejected';

                  return (
                    <div key={req.id} className="card" style={{ padding: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                        {/* Item and Renter */}
                        <div style={{ display: 'flex', gap: 16 }}>
                          <img
                            src={req.item.images[0]}
                            alt={req.item.title}
                            style={{ width: 90, height: 80, borderRadius: 'var(--radius)', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span className={`badge ${
                                isPending ? 'badge-warning' :
                                isApproved ? 'badge-success' : 'badge-error'
                              }`}>
                                {req.status.toUpperCase()}
                              </span>
                              <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>Requested on {req.createdAt}</span>
                            </div>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--gray-900)' }}>
                              {req.item.title}
                            </h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                              <img
                                src={req.renterAvatar || 'https://i.pravatar.cc/80?img=9'}
                                alt=""
                                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>
                                Renter: {req.renterName}
                              </span>
                              <span className="badge badge-gray" style={{ fontSize: 11 }}>Verified ID</span>
                            </div>
                          </div>
                        </div>

                        {/* Rental Dates & Payout */}
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--success)' }}>
                            +₹{req.totalCost.toLocaleString('en-IN')} payout
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 2 }}>
                            {req.startDate} → {req.endDate} ({req.totalDays} days)
                          </div>
                        </div>
                      </div>

                      {/* Renter Note */}
                      {req.notes && (
                        <div style={{ marginTop: 14, background: 'var(--gray-50)', padding: '10px 14px', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--gray-700)', borderLeft: '3px solid var(--primary)' }}>
                          <strong>Renter's note:</strong> "{req.notes}"
                        </div>
                      )}

                      {/* Owner Action Buttons */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18, borderTop: '1px solid var(--gray-100)', paddingTop: 14 }}>
                        {isPending ? (
                          <>
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ color: 'var(--error)' }}
                              onClick={() => {
                                if (onRejectRequest) onRejectRequest(req.id);
                                addToast('Rental request rejected.', 'info');
                              }}
                            >
                              <X size={15} /> Reject
                            </button>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => {
                                if (onApproveRequest) onApproveRequest(req.id);
                                addToast('Rental request approved! Renter notified.', 'success');
                              }}
                            >
                              <Check size={15} /> Approve Rental
                            </button>
                          </>
                        ) : (
                          <div style={{ fontSize: 13, color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle size={15} color="var(--success)" />
                            <span>Decision logged: <strong>{req.status}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MY LISTINGS (OWNER INVENTORY) */}
        {/* ======================================================== */}
        {activeTab === 'listings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)' }}>
                  Your Listed Items ({myListings.length})
                </h2>
                <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>
                  Manage rental availability, pricing and edit item details.
                </p>
              </div>

              <button className="btn btn-primary" onClick={() => navigate('list-item')}>
                + Add Another Item
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {myListings.map(item => (
                <div key={item.id} className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: 160 }}>
                    <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                      <span className={`badge ${item.available ? 'badge-success' : 'badge-error'}`}>
                        {item.available ? 'Live' : 'Unavailable'}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      {item.category}
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', marginTop: 4, lineHeight: 1.3 }}>
                      {item.title}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>
                        ₹{item.price.toLocaleString('en-IN')} / {item.unit}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>Deposit: ₹{item.deposit.toLocaleString('en-IN')}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 16, borderTop: '1px solid var(--gray-100)', paddingTop: 12 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ flex: 1, fontSize: 12 }}
                        onClick={() => {
                          if (onToggleListingAvailability) onToggleListingAvailability(item.id);
                          addToast(`Item marked as ${item.available ? 'unavailable' : 'available'}`, 'info');
                        }}
                      >
                        {item.available ? 'Pause Renting' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1, fontSize: 12 }}
                        onClick={() => navigate('item-detail', item)}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: RETURN TRACKING HUB */}
        {/* ======================================================== */}
        {activeTab === 'tracking' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)' }}>
                Return Tracking & Escrow Release
              </h2>
              <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>
                Track active rental returns step-by-step: Scheduled, In Handover, Inspected, and Deposit Refunded.
              </p>
            </div>

            {/* Select rental to inspect */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 24, alignItems: 'start' }}>
              {/* Left List of rentals with tracking */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-700)' }}>Active & Recent Rentals</h3>
                {rentals.map(rental => {
                  const isSelected = (selectedRentalForTracking?.id || rentals[0]?.id) === rental.id;
                  return (
                    <div
                      key={rental.id}
                      onClick={() => setSelectedRentalForTracking(rental)}
                      style={{
                        background: 'white',
                        padding: 16,
                        borderRadius: 'var(--radius)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-900)' }}>{rental.item.title}</span>
                        <span className={`badge ${rental.status === 'active' ? 'badge-primary' : 'badge-success'}`}>
                          {rental.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 6 }}>
                        Track ID: {rental.returnTrackingCode || 'RM-PENDING'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: Detailed Return Stepper */}
              {(() => {
                const activeTrack = selectedRentalForTracking || rentals[0];
                if (!activeTrack) {
                  return <div>No active rentals to track.</div>;
                }

                // Status mapping for progress
                const steps = [
                  { id: 'booked', label: 'Booked & Picked Up', desc: 'Item successfully handed over to renter.' },
                  { id: 'scheduled', label: 'Return Scheduled', desc: 'Handover date and location locked in.' },
                  { id: 'in_transit', label: 'Return Handover / In Transit', desc: 'Renter is meeting owner for return inspection.' },
                  { id: 'inspected', label: 'Condition Verified', desc: 'Owner inspects item for damage or missing parts.' },
                  { id: 'completed', label: 'Completed & Deposit Released', desc: 'Escrow released back to renter.' }
                ];

                const currentStepIndex = activeTrack.status === 'completed' ? 4 : 2;

                return (
                  <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 28, border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                      <div>
                        <span className="badge badge-info" style={{ marginBottom: 6 }}>Live Tracking</span>
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)' }}>
                          {activeTrack.item.title}
                        </h3>
                        <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>
                          Return Code: <strong>{activeTrack.returnTrackingCode || 'RM-TRACK-2026-X'}</strong>
                        </div>
                      </div>

                      <div style={{ background: 'var(--gray-100)', padding: 10, borderRadius: 'var(--radius)', textAlign: 'center' }}>
                        <QrCode size={40} color="var(--gray-700)" />
                        <div style={{ fontSize: 10, color: 'var(--gray-500)', marginTop: 4 }}>Scan on Handover</div>
                      </div>
                    </div>

                    {/* Progress Steps */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, margin: '24px 0', position: 'relative' }}>
                      {steps.map((st, idx) => {
                        const isDone = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                          <div key={st.id} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                            <div style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: isDone ? 'var(--primary)' : 'var(--gray-200)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: 13,
                              flexShrink: 0
                            }}>
                              {isDone ? <Check size={16} /> : idx + 1}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 15, color: isDone ? 'var(--gray-900)' : 'var(--gray-400)' }}>
                                {st.label} {isCurrent && <span className="badge badge-warning" style={{ fontSize: 11, marginLeft: 6 }}>Active Stage</span>}
                              </div>
                              <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>
                                {st.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Return Action Buttons */}
                    <div style={{ background: 'var(--gray-50)', padding: 18, borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 8 }}>
                        Update Return Status (Owner / Renter Verification)
                      </h4>
                      <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 14 }}>
                        Once the item is inspected and confirmed in original shape, release the security deposit.
                      </p>

                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleReturnProcess(activeTrack.id, 'in_transit')}
                        >
                          <Truck size={14} /> Mark Handover Started
                        </button>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleReturnProcess(activeTrack.id, 'completed')}
                        >
                          <CheckCircle size={14} /> Confirm Inspection & Refund Deposit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
