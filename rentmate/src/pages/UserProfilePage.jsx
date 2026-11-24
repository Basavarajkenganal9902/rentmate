import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StarRating } from '../components/StarRating';
import {
  ShieldCheck, User, Mail, MapPin, Calendar, CheckCircle,
  Award, Star, Package, Clock, Shield
} from 'lucide-react';

export default function UserProfilePage() {
  const { user, navigate, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh', padding: '36px 0 80px' }}>
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Profile Card Header */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 32, border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-100)' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)' }}>{user.name}</h1>
                <span className="badge badge-success">
                  <ShieldCheck size={14} /> ID Verified
                </span>
                <span className="badge badge-primary">
                  <Award size={14} /> Top Rated Renter
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8, color: 'var(--gray-600)', fontSize: 14, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={15} color="var(--primary)" /> {user.location}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={15} color="var(--gray-400)" /> Joined {user.memberSince}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <StarRating rating={user.rating} size={14} showValue />
                  ({user.reviews} reviews)
                </span>
              </div>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => addToast('Profile edit modal opened', 'info')}
            >
              Edit Profile
            </button>
          </div>

          <div className="divider" />

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'center' }}>
            <div style={{ background: 'var(--gray-50)', padding: 14, borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{user.totalRentals}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>Total Rentals</div>
            </div>
            <div style={{ background: 'var(--gray-50)', padding: 14, borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)' }}>{user.totalListings}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>Active Listings</div>
            </div>
            <div style={{ background: 'var(--gray-50)', padding: 14, borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>100%</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>On-Time Return</div>
            </div>
            <div style={{ background: 'var(--gray-50)', padding: 14, borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--secondary-dark)' }}>₹0</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>Damage Claims</div>
            </div>
          </div>
        </div>

        {/* Verification & Trust Badges */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 28, border: '1px solid var(--gray-200)', marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 16 }}>
            Verified Credentials & Security
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--gray-50)', padding: 14, borderRadius: 'var(--radius)' }}>
              <CheckCircle size={22} color="var(--success)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Government ID</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Verified on file</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--gray-50)', padding: 14, borderRadius: 'var(--radius)' }}>
              <CheckCircle size={22} color="var(--success)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Email Confirmed</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{user.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--gray-50)', padding: 14, borderRadius: 'var(--radius)' }}>
              <CheckCircle size={22} color="var(--success)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Escrow Payment</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Stripe Verified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews from Owners */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 28, border: '1px solid var(--gray-200)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 16 }}>
            Community Reviews ({user.reviews})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                name: 'Arjun Rao',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
                rating: 5,
                date: '2 weeks ago',
                comment: 'Basavaraj took wonderful care of my Sony A7III kit and returned it before time in pristine condition. Clear communication and super smooth handover!'
              },
              {
                name: 'Kavya Raman',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80',
                rating: 5,
                date: 'Last month',
                comment: 'Rented the Trek MTB from Basavaraj for a weekend Nandi Hills ride. Bike was freshly tuned, clean, and he even included helmet and lock. Highly recommend renting from him!'
              },
              {
                name: 'Siddharth Nair',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
                rating: 5,
                date: 'Last month',
                comment: 'Rented the PS5 Slim with 2 controllers for a gaming night with friends. Everything was in mint condition with all top games ready. 5 stars!'
              }
            ].map((rev, i) => (
              <div key={i} style={{ paddingBottom: 16, borderBottom: i < 2 ? '1px solid var(--gray-100)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={rev.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{rev.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{rev.date}</div>
                    </div>
                  </div>
                  <StarRating rating={rev.rating} size={13} />
                </div>
                <p style={{ fontSize: 14, color: 'var(--gray-600)', marginTop: 8, lineHeight: 1.5 }}>
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
