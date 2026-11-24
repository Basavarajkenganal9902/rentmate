import { Heart, MapPin, Star, Shield, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ItemCard({ item, layout = 'grid' }) {
  const { navigate, wishlist, toggleWishlist } = useApp();
  const isWished = wishlist.includes(item.id);

  if (layout === 'list') {
    return (
      <div className="card" style={listStyles.card} onClick={() => navigate('item-detail', item)}>
        <div style={listStyles.imageWrap}>
          <img src={item.images[0]} alt={item.title} style={listStyles.image} loading="lazy" />
          {!item.available && <div style={styles.unavailableBanner}>Unavailable</div>}
        </div>
        <div style={listStyles.body}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <span className="badge badge-primary" style={{ marginBottom: 8, display: 'inline-flex' }}>
                {item.category}
              </span>
              <h3 style={styles.title}>{item.title}</h3>
              <p style={styles.desc}>{item.description.slice(0, 120)}...</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={styles.price}>₹{item.price.toLocaleString('en-IN')}<span style={styles.unit}>/{item.unit}</span></div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                Deposit: ₹{item.deposit.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={styles.meta}><Star size={13} fill="#f59e0b" color="#f59e0b" />{item.rating} ({item.reviews})</div>
            <div style={styles.meta}><MapPin size={13} color="var(--gray-400)" />{item.location}</div>
            {item.owner.verified && <div style={styles.meta}><Shield size={13} color="var(--success)" />Verified Owner</div>}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); toggleWishlist(item.id); }}>
                <Heart size={14} fill={isWished ? 'var(--error)' : 'none'} color={isWished ? 'var(--error)' : 'currentColor'} />
              </button>
              <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate('item-detail', item); }}>
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={styles.card} onClick={() => navigate('item-detail', item)}>
      {/* Image */}
      <div style={styles.imageWrap}>
        <img src={item.images[0]} alt={item.title} style={styles.image} loading="lazy" />
        {!item.available && <div style={styles.unavailableBanner}>Unavailable</div>}
        {item.featured && <div style={styles.featuredBadge}>⭐ Featured</div>}
        <button
          style={{ ...styles.wishlistBtn, ...(isWished ? styles.wishlistBtnActive : {}) }}
          onClick={e => { e.stopPropagation(); toggleWishlist(item.id); }}
          aria-label="Add to wishlist"
        >
          <Heart size={16} fill={isWished ? 'white' : 'none'} color="white" />
        </button>
        <div style={styles.categoryTag}>{item.category}</div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <div style={styles.ownerRow}>
          <img src={item.owner.avatar} alt={item.owner.name} style={styles.ownerAvatar} />
          <div>
            <div style={styles.ownerName}>{item.owner.name}</div>
            <div style={styles.ownerMeta}>
              <Star size={11} fill="#f59e0b" color="#f59e0b" />
              {item.owner.rating} · {item.owner.reviews} reviews
              {item.owner.verified && <Shield size={11} color="var(--success)" />}
            </div>
          </div>
        </div>

        <h3 style={styles.title}>{item.title}</h3>

        <div style={styles.locationRow}>
          <MapPin size={12} color="var(--gray-400)" />
          <span style={styles.locationText}>{item.location}</span>
        </div>

        <div style={styles.footer}>
          <div>
            <span style={styles.price}>₹{item.price.toLocaleString('en-IN')}</span>
            <span style={styles.unit}>/{item.unit}</span>
          </div>
          <div style={styles.ratingRow}>
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span style={styles.ratingText}>{item.rating}</span>
            <span style={styles.reviewCount}>({item.reviews})</span>
          </div>
        </div>

        <div style={styles.availRow}>
          <div style={{ ...styles.availDot, background: item.available ? 'var(--success)' : 'var(--error)' }} />
          <span style={{ fontSize: 12, color: item.available ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
            {item.available ? 'Available Now' : 'Unavailable'}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gray-400)', fontSize: 12 }}>
            <Clock size={11} /> {item.minDays}–{item.maxDays} days
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    cursor: 'pointer',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    transition: 'var(--transition)',
  },
  imageWrap: {
    position: 'relative',
    paddingBottom: '66%',
    overflow: 'hidden',
    background: 'var(--gray-100)',
  },
  image: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  unavailableBanner: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: '0.05em',
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 'var(--radius-full)',
    boxShadow: 'var(--shadow-md)',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(4px)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition)',
  },
  wishlistBtnActive: {
    background: 'var(--error)',
  },
  categoryTag: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(4px)',
    color: 'var(--primary)',
    fontSize: 11,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
    textTransform: 'capitalize',
  },
  body: {
    padding: '14px 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  ownerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  ownerAvatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid var(--gray-200)',
  },
  ownerName: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--gray-700)',
    lineHeight: 1.3,
  },
  ownerMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 11,
    color: 'var(--gray-500)',
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--gray-900)',
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: 'var(--gray-500)',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 10,
    borderTop: '1px solid var(--gray-100)',
  },
  price: {
    fontSize: 20,
    fontWeight: 800,
    color: 'var(--primary)',
  },
  unit: {
    fontSize: 13,
    fontWeight: 400,
    color: 'var(--gray-500)',
    marginLeft: 2,
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--gray-800)',
  },
  reviewCount: {
    fontSize: 12,
    color: 'var(--gray-500)',
  },
  availRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  availDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    flexShrink: 0,
  },
  desc: {
    fontSize: 13,
    color: 'var(--gray-500)',
    lineHeight: 1.5,
    marginTop: 4,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    color: 'var(--gray-600)',
  },
};

const listStyles = {
  card: {
    display: 'flex',
    gap: 0,
    cursor: 'pointer',
    overflow: 'hidden',
  },
  imageWrap: {
    position: 'relative',
    width: 220,
    flexShrink: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  body: {
    flex: 1,
    padding: '20px 24px',
  },
};
