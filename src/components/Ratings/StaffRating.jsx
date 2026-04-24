// /home/shafiur/City-Fixer/src/components/Ratings/StaffRating.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAxios from '../../Hooks/useAxios';
import useAuth from '../../Hooks/useAuth';

const StarIcon = ({ filled, onClick, onHover, size = 24 }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? '#f59e0b' : 'none'}
    stroke={filled ? '#f59e0b' : 'rgba(245,158,11,0.4)'}
    strokeWidth="1.5"
    style={{ cursor: 'pointer', transition: 'all 0.15s' }}
    onClick={onClick}
    onMouseEnter={onHover}
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

// Reusable static display of average rating
export const RatingDisplay = ({ avgRating = 0, count = 0, size = 16 }) => {
  const rounded = Math.round(avgRating * 2) / 2;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= rounded ? '#f59e0b' : 'none'}
          stroke={i <= rounded ? '#f59e0b' : 'rgba(245,158,11,0.3)'}
          strokeWidth="1.5"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
      <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: size * 0.85 }}>
        {avgRating > 0 ? avgRating.toFixed(1) : '—'}
      </span>
      {count > 0 && (
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: size * 0.75 }}>
          ({count} {count === 1 ? 'rating' : 'ratings'})
        </span>
      )}
    </div>
  );
};

const StaffRating = ({ staffEmail, issueId, onRated }) => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxios();
  const { user } = useAuth();
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check if already rated this issue
  const { data: ratingsData } = useQuery({
    queryKey: ['ratings', staffEmail],
    queryFn: async () => {
      const res = await axiosPublic.get(`/ratings/${staffEmail}`);
      return res.data;
    },
  });

  const alreadyRated = ratingsData?.ratings?.some(
    r => r.issueId?.toString() === issueId && r.ratedBy === user?.email
  );

  const handleSubmit = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      await axiosSecure.post('/ratings', {
        staffEmail,
        issueId,
        rating: selected,
        feedback: feedback.trim(),
      });
      setSubmitted(true);
      onRated?.();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  if (alreadyRated || submitted) {
    return (
      <div style={{
        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: '12px', padding: '1rem', textAlign: 'center',
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>⭐</div>
        <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>Thank you for your rating!</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
          Your feedback helps improve our service.
        </div>
      </div>
    );
  }

  return (
    <div>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: '1rem', lineHeight: 1.5 }}>
        How was your experience with the staff who resolved your issue?
      </p>

      {/* Star selector */}
      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.75rem' }}
        onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map(i => (
          <StarIcon
            key={i}
            size={28}
            filled={i <= (hovered || selected)}
            onClick={() => setSelected(i)}
            onHover={() => setHovered(i)}
          />
        ))}
        {selected > 0 && (
          <span style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700, marginLeft: '0.5rem', alignSelf: 'center' }}>
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][selected]}
          </span>
        )}
      </div>

      {/* Feedback textarea */}
      <textarea
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        placeholder="Leave optional feedback about the staff's work..."
        rows={2}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '10px', padding: '0.65rem 0.9rem',
          color: '#e2e8f0', fontSize: '0.85rem',
          outline: 'none', resize: 'vertical', lineHeight: 1.5,
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: '0.75rem',
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={!selected || submitting}
        style={{
          width: '100%',
          background: selected && !submitting
            ? 'linear-gradient(135deg, #f59e0b, #fb923c)'
            : 'rgba(245,158,11,0.2)',
          border: 'none', borderRadius: '10px',
          padding: '0.65rem', color: '#fff',
          fontWeight: 700, fontSize: '0.875rem',
          cursor: selected && !submitting ? 'pointer' : 'not-allowed',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {submitting ? 'Submitting...' : '⭐ Submit Rating'}
      </button>
    </div>
  );
};

export default StaffRating;