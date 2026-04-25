import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';
import useRole from '../../Hooks/useRole';
import toast from 'react-hot-toast';

const statusConfig = {
  'Open':        { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
  'Pending':     { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)' },
  'In Progress': { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.3)' },
  'Resolved':    { color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.3)' },
  'Rejected':    { color: '#f472b6', bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.3)' },
  'Closed':      { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
};

const priorityConfig = {
  'High':   { color: '#f472b6', bg: 'rgba(244,114,182,0.15)', border: 'rgba(244,114,182,0.35)' },
  'Normal': { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.2)' },
};

const IssueCard = ({ issue }) => {
  const { title, status, priority, category, _id, location, upvotes, upvotedBy, image, reportedBy } = issue;
  const axiosSecure = useAxiosSecure(); // FIX: use authenticated axios
  const { user } = useAuth();
  const { isCitizen } = useRole();
  const navigate = useNavigate();

  const alreadyVoted = Array.isArray(upvotedBy) && user && upvotedBy.includes(user.email);
  const [votes, setVotes] = useState(upvotes || 0);
  const [voted, setVoted] = useState(alreadyVoted);
  const [voting, setVoting] = useState(false);

  const sc = statusConfig[status] || statusConfig['Pending'];
  const pc = priorityConfig[priority] || priorityConfig['Normal'];

  const handleVotes = async () => {
    if (!user) { navigate('/login'); return; }
    if (!isCitizen) {
      toast.error('Only citizens can upvote issues', { position: 'top-center' });
      return;
    }
    if (user.email === reportedBy) {
      toast.error('You cannot upvote your own issue', { position: 'top-center' });
      return;
    }
    if (voted) {
      toast.error('You have already upvoted this issue', { position: 'top-center' });
      return;
    }
    if (voting) return;

    setVoting(true);
    try {
      await axiosSecure.patch(`/issues/${_id}/upvote`);
      setVotes(v => v + 1);
      setVoted(true);
      toast.success('Upvoted! 👍', { position: 'top-center' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to upvote';
      const status = err?.response?.status;
      if (status === 409) {
        setVoted(true); // already voted — sync state
        toast.error('You have already upvoted this issue', { position: 'top-center' });
      } else if (status === 403) {
        toast.error(msg, { position: 'top-center' });
      } else {
        toast.error(msg, { position: 'top-center' });
      }
    } finally {
      setVoting(false);
    }
  };

  return (
    <div
      style={{
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
          onError={e => { e.target.src = 'https://placehold.co/400x200?text=No+Image'; }}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(10,10,26,0.8), transparent)' }} />
        {/* Priority badge */}
        <div style={{
          position: 'absolute', top: '0.6rem', right: '0.6rem',
          background: pc.bg, border: `1px solid ${pc.border}`,
          borderRadius: 999, padding: '0.2rem 0.6rem',
          color: pc.color, fontSize: '0.7rem', fontWeight: 700,
          backdropFilter: 'blur(8px)',
        }}>
          {priority === 'High' ? '🔴 High' : '🟡 Normal'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem 1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: sc.color, boxShadow: `0 0 8px ${sc.color}` }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', color: sc.color, textTransform: 'uppercase' }}>
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
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90%' }}>
              {location}
            </span>
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0.2rem 0' }} />

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={handleVotes}
            disabled={voting || voted}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: voted ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
              border: `1px solid ${voted ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.25)'}`,
              borderRadius: 8, padding: '0.4rem 0.7rem',
              color: voted ? '#818cf8' : '#a5b4fc', fontSize: '0.82rem', fontWeight: 600,
              cursor: voted ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <svg width="14" height="14" fill={voted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
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
    </div>
  );
};

export default IssueCard;