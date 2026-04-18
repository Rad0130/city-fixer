import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import useAxios from '../../Hooks/useAxios';
import useAuth from '../../Hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';

const statusConfig = {
  'Open':        { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
  'In Progress': { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)' },
  'Resolved':    { color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.3)' },
};

const priorityConfig = {
  'High':   { color: '#f472b6', bg: 'rgba(244,114,182,0.15)', border: 'rgba(244,114,182,0.35)' },
  'Normal': { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.2)' },
  'Medium': { color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.3)'  },
  'Low':    { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.2)' },
};

const IssueCard = ({ issue }) => {
  const { title, status, priority, category, _id, location, upvotes, image, reportedBy } = issue;
  const axios = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [votes, setVotes] = useState(upvotes);
  const [voting, setVoting] = useState(false);

  const sc = statusConfig[status]   || statusConfig['Open'];
  const pc = priorityConfig[priority] || priorityConfig['Normal'];

  const handleVotes = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.email === reportedBy) { toast('You cannot upvote your own issue'); return; }
    if (voting) return;
    try {
      setVoting(true);
      await axios.patch(`/issues/${_id}/upvote`, { email: user.email });
      setVotes(prev => prev + 1);
    } catch (err) {
      if (err.response?.status === 409) toast('You already upvoted this issue');
    } finally {
      setVoting(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20,
      overflow: 'hidden',
      backdropFilter: 'blur(12px)',
      transition: 'all 0.3s',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.border = '1px solid rgba(99,102,241,0.35)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top accent line */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #6366f1, #ec4899, #22d3ee)' }} />

      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 170 }}>
        <img
          src={image}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        {/* Overlay gradient */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(to top, rgba(10,10,26,0.8), transparent)',
        }} />
        {/* Priority badge on image */}
        <div style={{
          position: 'absolute', top: '0.6rem', right: '0.6rem',
          background: pc.bg, border: `1px solid ${pc.border}`,
          borderRadius: 999, padding: '0.2rem 0.6rem',
          color: pc.color, fontSize: '0.7rem', fontWeight: 700,
          backdropFilter: 'blur(8px)',
        }}>
          {priority}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem 1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: sc.color, boxShadow: `0 0 8px ${sc.color}` }} />
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em',
            color: sc.color, textTransform: 'uppercase',
          }}>
            {status}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700, fontSize: '0.95rem',
          color: '#fff', lineHeight: 1.35,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
          margin: 0,
        }}>
          {title}
        </h3>

        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem' }}>📂</span>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>{category}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem' }}>📍</span>
            <span style={{
              color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90%',
            }}>{location}</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.2rem 0' }} />

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={handleVotes}
            disabled={voting}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 8, padding: '0.4rem 0.7rem',
              color: '#a5b4fc', fontSize: '0.82rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {votes}
          </button>

          <Link
            to={`/details/${_id}`}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: '0.8rem', fontWeight: 700,
              padding: '0.4rem 0.9rem', borderRadius: 8,
              textDecoration: 'none', transition: 'all 0.2s',
              boxShadow: '0 0 15px rgba(99,102,241,0.3)',
            }}
          >
            View →
          </Link>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default IssueCard;