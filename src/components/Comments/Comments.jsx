// /home/shafiur/City-Fixer/src/components/Comments/Comments.jsx
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAxios from '../../Hooks/useAxios';
import useAuth from '../../Hooks/useAuth';
import useRole from '../../Hooks/useRole';

const roleColor = {
  admin: '#f472b6',
  staff: '#34d399',
  citizen: '#818cf8',
};

const Comments = ({ issueId }) => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxios();
  const { user } = useAuth();
  const { role } = useRole();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', issueId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/comments/${issueId}`);
      return res.data;
    },
  });

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      await axiosSecure.post('/comments', { issueId, text: text.trim() });
      setText('');
      queryClient.invalidateQueries(['comments', issueId]);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axiosSecure.delete(`/comments/${commentId}`);
      queryClient.invalidateQueries(['comments', issueId]);
    } catch {
      alert('Failed to delete comment');
    }
  };

  return (
    <div>
      <h3 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#fff',
        fontSize: '1.05rem', marginBottom: '1.25rem',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
      }}>
        <span style={{ color: '#f59e0b' }}>💬</span> Comments
        <span style={{
          background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 999, padding: '0.15rem 0.6rem',
          color: '#f59e0b', fontSize: '0.72rem', fontWeight: 700,
        }}>
          {comments.length}
        </span>
      </h3>

      {/* Input */}
      {user ? (
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', color: '#fff', fontWeight: 700, overflow: 'hidden',
          }}>
            {user.photoURL
              ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (user.displayName || user.email)?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              placeholder="Add a comment... (Enter to submit, Shift+Enter for new line)"
              rows={2}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px', padding: '0.75rem 1rem',
                color: '#e2e8f0', fontSize: '0.875rem',
                outline: 'none', resize: 'vertical', lineHeight: 1.6,
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                onClick={handleSubmit}
                disabled={!text.trim() || submitting}
                style={{
                  background: text.trim() && !submitting
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'rgba(99,102,241,0.3)',
                  border: 'none', borderRadius: '10px',
                  padding: '0.5rem 1.25rem',
                  color: '#fff', fontWeight: 600, fontSize: '0.85rem',
                  cursor: text.trim() && !submitting ? 'pointer' : 'not-allowed',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem',
          color: '#818cf8', fontSize: '0.875rem', textAlign: 'center',
        }}>
          Please log in to leave a comment.
        </div>
      )}

      {/* Comments list */}
      {isLoading ? (
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {comments.map(comment => {
            const rc = roleColor[comment.role] || '#818cf8';
            const isOwner = user?.email === comment.userId;
            const isAdminUser = role === 'admin';
            return (
              <div key={comment._id} style={{
                display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${rc}40, ${rc}20)`,
                  border: `1px solid ${rc}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', color: rc, fontWeight: 700, overflow: 'hidden',
                }}>
                  {comment.userPhoto
                    ? <img src={comment.userPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (comment.userName || '?')[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                    <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem' }}>
                      {comment.userName || 'Anonymous'}
                    </span>
                    <span style={{
                      background: `${rc}15`, border: `1px solid ${rc}30`,
                      borderRadius: 999, padding: '0.1rem 0.5rem',
                      color: rc, fontSize: '0.65rem', fontWeight: 700, textTransform: 'capitalize',
                    }}>
                      {comment.role}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem' }}>
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleString('en-US', {
                            month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })
                        : ''}
                    </span>
                    {(isOwner || isAdminUser) && (
                      <button
                        onClick={() => handleDelete(comment._id)}
                        style={{
                          marginLeft: 'auto', background: 'none', border: 'none',
                          color: 'rgba(244,114,182,0.5)', fontSize: '0.75rem',
                          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                          padding: '0.1rem 0.4rem',
                        }}
                        title="Delete comment"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p style={{
                    color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem',
                    lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}>
                    {comment.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Comments;