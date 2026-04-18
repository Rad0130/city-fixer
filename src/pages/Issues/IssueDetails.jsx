import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import useAxios from '../../Hooks/useAxios';
import { Calendar, Tag, AlertCircle, Clock, User, ArrowLeft, Trash2, Edit3, Zap, MapPin, ThumbsUp, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const IssueDetails = () => {
  const { id } = useParams();
  const axios = useAxios();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: issues, isLoading, error, refetch } = useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      const res = await axios.get(`/issues?_id=${id}`);
      return res.data;
    },
  });

  const issue = issues && issues.length > 0 ? issues[0] : null;

  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`/issues/${id}`),
    onSuccess: () => {
      Swal.fire('Deleted!', 'The issue has been removed.', 'success');
      navigate('/allissues');
    },
  });

  const handlePayment = async () => {
    Swal.fire({
      title: 'Boost this issue for 100tk?',
      text: "This moves your issue to the top of the admin queue!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Pay & Boost',
      background: '#0d1117',
      color: '#fff',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const paymentInfo = { title: issue.title, issueID: issue._id, email: issue.reportedBy };
        const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
        window.location.href = res.data.url;
      }
    });
  };

  useEffect(() => {
    if (!issue) return;
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('sessionID');
    const updatedPriority = async () => {
      if (paymentStatus === 'success') {
        Swal.fire({ title: 'Payment Successful!', text: 'Your issue has been boosted to High priority.', icon: 'success', background: '#0d1117', color: '#fff' });
        await axiosSecure.patch(`/issues/${issue._id}`, { priority: 'High' });
        const paymentInformation = {
          transactionId: sessionId, issueId: issue._id, IssueName: issue.title,
          amount: 100, currency: 'BDT', paidBy: user.displayName,
        };
        await axiosSecure.post('payments', paymentInformation);
        setSearchParams({}, { replace: true });
        await refetch();
      }
      if (paymentStatus === 'cancel') {
        Swal.fire({ title: 'Payment Cancelled', icon: 'info', background: '#0d1117', color: '#fff' });
        setSearchParams({}, { replace: true });
      }
    };
    updatedPriority();
  }, [axiosSecure, issue, searchParams, setSearchParams, refetch, user?.displayName]);

  if (isLoading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading issue details...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error || !issue) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)',
      flexDirection: 'column', gap: '1rem',
    }}>
      <div style={{ fontSize: '4rem' }}>🔍</div>
      <h2 style={{ color: '#fff', fontFamily: "'Syne',sans-serif", fontWeight: 800 }}>Issue Not Found</h2>
      <button onClick={() => navigate('/allissues')} style={btnStyle('#6366f1')}>Back to All Issues</button>
    </div>
  );

  const statusColors = {
    'Resolved': { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
    'In Progress': { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
    'Open': { color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.3)' },
  };
  const sc = statusColors[issue.status] || statusColors['Open'];
  const isHigh = issue.priority === 'High';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)',
      fontFamily: "'DM Sans', sans-serif",
      paddingTop: '5rem', paddingBottom: '4rem',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '40vw', height: '40vw', maxWidth: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '30vw', height: '30vw', maxWidth: 400, background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem clamp(1rem,4vw,2rem)', position: 'relative', zIndex: 1 }}>

        {/* ── TOP BAR ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => navigate(-1)} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, padding: '0.6rem 1.2rem',
            color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans',sans-serif",
          }}>
            <ArrowLeft size={16} /> Back
          </button>

          {user?.email === issue.reportedBy && (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Link to={`/editissue/${id}`} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 10, padding: '0.6rem 1.2rem',
                color: '#818cf8', fontSize: '0.875rem', fontWeight: 600,
                textDecoration: 'none', transition: 'all 0.2s',
              }}>
                <Edit3 size={15} /> Edit
              </Link>
              <button onClick={() => {
                Swal.fire({
                  title: 'Delete this issue?', text: "This action cannot be undone.",
                  icon: 'warning', showCancelButton: true,
                  confirmButtonColor: '#ec4899', cancelButtonColor: '#374151',
                  confirmButtonText: 'Yes, delete', background: '#0d1117', color: '#fff',
                }).then(r => { if (r.isConfirmed) deleteMutation.mutate(); });
              }} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.3)',
                borderRadius: 10, padding: '0.6rem 1.2rem',
                color: '#f472b6', fontSize: '0.875rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans',sans-serif",
              }}>
                <Trash2 size={15} /> Delete
              </button>
            </div>
          )}
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Main Content ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="lg:col-span-2">

            {/* Header card */}
            <div style={glassCard}>
              {/* Status + Priority + Upvotes */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span style={{
                    background: sc.bg, border: `1px solid ${sc.border}`,
                    borderRadius: 999, padding: '0.3rem 0.9rem',
                    color: sc.color, fontSize: '0.8rem', fontWeight: 700,
                  }}>● {issue.status}</span>
                  <span style={{
                    background: isHigh ? 'rgba(244,114,182,0.12)' : 'rgba(251,146,60,0.1)',
                    border: `1px solid ${isHigh ? 'rgba(244,114,182,0.3)' : 'rgba(251,146,60,0.3)'}`,
                    borderRadius: 999, padding: '0.3rem 0.9rem',
                    color: isHigh ? '#f472b6' : '#fb923c', fontSize: '0.8rem', fontWeight: 700,
                  }}>{issue.priority} Priority</span>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                  borderRadius: 999, padding: '0.4rem 1rem',
                }}>
                  <ThumbsUp size={16} color="#818cf8" />
                  <span style={{ fontWeight: 700, color: '#818cf8', fontSize: '1rem' }}>{issue.upvotes || 0}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>upvotes</span>
                </div>
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 800,
                fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: '#fff',
                lineHeight: 1.2, marginBottom: '0.75rem',
              }}>{issue.title}</h1>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem' }}>
                <MapPin size={16} color="#ec4899" />
                <span style={{ fontSize: '0.95rem' }}>{issue.location}</span>
              </div>

              {/* Image */}
              {issue.image && (
                <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <img
                    src={issue.image}
                    alt={issue.title}
                    style={{ width: '100%', maxHeight: 460, objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found'; }}
                  />
                </div>
              )}
            </div>

            {/* Description card */}
            <div style={glassCard}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#fff', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#818cf8' }}>📝</span> Description
              </h3>
              <div style={{
                background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '1.2rem',
              }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
                  {issue.description || 'No detailed description provided for this issue.'}
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            {/* Details card */}
            <div style={glassCard}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#fff', fontSize: '1rem', marginBottom: '1.2rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                Issue Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: <Tag size={16} />, label: 'Category', value: issue.category, accent: '#818cf8' },
                  { icon: <User size={16} />, label: 'Reported By', value: issue.reportedBy || 'Anonymous', accent: '#34d399' },
                  { icon: <Calendar size={16} />, label: 'Reported Date', value: issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A', accent: '#f472b6' },
                  { icon: <Clock size={16} />, label: 'Last Updated', value: issue.updatedAt ? new Date(issue.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A', accent: '#22d3ee' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                      background: `${item.accent}15`, border: `1px solid ${item.accent}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: item.accent,
                    }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{item.label}</div>
                      <div style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-all' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Boost button */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                  onClick={handlePayment}
                  disabled={isHigh}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.85rem', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem',
                    cursor: isHigh ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                    // border: 'none', fontFamily: "'DM Sans',sans-serif",
                    background: isHigh
                      ? 'rgba(52,211,153,0.12)'
                      : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: isHigh ? '#34d399' : '#fff',
                    boxShadow: isHigh ? 'none' : '0 0 25px rgba(99,102,241,0.4)',
                    border: isHigh ? '1px solid rgba(52,211,153,0.3)' : 'none',
                  }}
                >
                  <Zap size={17} fill={isHigh ? 'currentColor' : 'none'} />
                  {isHigh ? '✓ Already Boosted to High' : 'Boost Priority — 100৳'}
                </button>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '0.6rem', lineHeight: 1.5 }}>
                  Boosting moves this issue to the top of the admin queue.
                </p>
              </div>
            </div>

            {/* Alert card */}
            <div style={{
              ...glassCard,
              borderColor: 'rgba(6,182,212,0.25)',
              background: 'rgba(6,182,212,0.05)',
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <AlertCircle size={20} color="#22d3ee" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ color: '#22d3ee', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>Need urgent help?</h4>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    Contact city council support if this issue poses immediate danger.
                  </p>
                  <button style={{
                    background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)',
                    borderRadius: 8, padding: '0.4rem 0.9rem',
                    color: '#22d3ee', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'DM Sans',sans-serif",
                  }}>
                    Contact Support
                  </button>
                </div>
              </div>
            </div>

            {/* Community card */}
            <div style={glassCard}>
              <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '0.9rem' }}>
                Community Actions
              </h4>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button style={{
                  flex: 1, padding: '0.6rem', borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
                }}>Share Issue</button>
                <button style={{
                  flex: 1, padding: '0.6rem', borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                  border: '1px solid rgba(99,102,241,0.3)',
                  color: '#a5b4fc', fontSize: '0.8rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
                }}>Follow Updates</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const glassCard = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  padding: '1.75rem',
  backdropFilter: 'blur(12px)',
};

const btnStyle = (color) => ({
  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
  border: 'none', borderRadius: 12,
  padding: '0.75rem 1.8rem',
  color: '#fff', fontWeight: 700, fontSize: '0.9rem',
  cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
});

export default IssueDetails;