import { Star } from 'lucide-react';

export function StarRating({ rating, size = 14, showValue = false }) {
  return (
    <div className="stars" style={{ alignItems: 'center', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          color={i <= Math.round(rating) ? '#f59e0b' : 'var(--gray-300)'}
          strokeWidth={1.5}
        />
      ))}
      {showValue && (
        <span style={{ fontSize: size, fontWeight: 600, color: 'var(--gray-700)', marginLeft: 2 }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
