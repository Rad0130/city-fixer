// src/pages/Issues/IssueDetails.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../Hooks/useAxios';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';
import useRole from '../../Hooks/useRole';
import {
  Calendar, Tag, AlertCircle, Clock, User,
  ArrowLeft, Trash2, Edit3, Zap, MapPin, ThumbsUp,
  Image as ImageIcon, CheckCircle, XCircle, Loader,
} from 'lucide-react';
import Swal from 'sweetalert2';

// ── Status & Priority config ───────────────────────────────────────────────────
const statusCfg = {
  'Pending':     { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)',  icon: '⏳' },
  'In Progress': { color: '#22d3ee', bg: 'rgba(6,182,212,0.12)',   border: 'rgba(6,182,212,0.3)',   icon: '⚙️' },
  'Resolved':    { color: '#34d399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.3)',  icon: '✅' },
  'Closed':      { color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.3)', icon: '🔒' },
  'Rejected':    { color: '#f472b6', bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.3)', icon: '❌' },
};

const priorityCfg = {
  'High':   { color: '#f472b6', bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.3)' },
  'Medium': { color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.3)' },
  'Low':    { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.2)' },
};

const timelineRoleColor = {
  admin:   '#f472b6',
  staff:   '#34d399',
  citizen: '#818cf8',
};

// ─────────────────────────────────────────────────────────────────────────────
const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isAdmin, isStaff, isCitizen } = useRole();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // ── Fetch issue ──
  const { data: issues, isLoading, error, refetch } = useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/issues?_id=${id}`);
      return res.data;
    },
  });
  const issue = issues?.[0] || null;

  // ── Fetch assigned staff info ──
  const { data: staffInfo } = useQuery({
    queryKey: ['staffInfo', issue?.assignedTo],
    enabled: !!issue?.assignedTo,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${issue.assignedTo}`);
      return res.data;
    },
  });
  console.log(staffInfo);

  // ── Delete mutation ──
  const deleteMutation = useMutation({
    mutationFn: () => axiosSecure.delete(`/issues/${id}`),
    onSuccess: () => {
      Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Issue removed.', background: '#0d1117', color: '#fff' });
      navigate('/allissues');
    },
  });

  // ── Boost payment ──
  const handlePayment = async () => {
    const result = await Swal.fire({
      title: 'Boost this issue for 100৳?',
      text: 'This moves your issue to the top of the admin queue!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Pay & Boost',
      background: '#0d1117',
      color: '#fff',
    });
    if (result.isConfirmed) {
      const res = await axiosSecure.post('/create-checkout-session', {
        title: issue.title,
        issueID: issue._id,
        email: issue.reportedBy,
        amount: 100,
      });
      window.location.href = res.data.url;
    }
  };

  // ── Handle post-payment redirect ──
  useEffect(() => {
    if (!issue) return;
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('sessionID');

    const handlePostPayment = async () => {
      if (paymentStatus === 'success') {
        Swal.fire({ title: 'Boosted!', text: 'Priority set to High.', icon: 'success', background: '#0d1117', color: '#fff' });
        await axiosSecure.patch(`/issues/${issue._id}`, { priority: 'High' });
        await axiosSecure.post('/payments', {
          transactionId: sessionId,
          issueId: issue._id,
          IssueName: issue.title,
          amount: 100,
          currency: 'BDT',
          paidBy: user.displayName,
          paidByEmail: user.email,
        });
        setSearchParams({}, { replace: true });
        refetch();
        queryClient.invalidateQueries(['issue', id]);
      }
      if (paymentStatus === 'cancel') {
        Swal.fire({ title: 'Cancelled', icon: 'info', background: '#0d1117', color: '#fff' });
        setSearchParams({}, { replace: true });
      }
    };
    handlePostPayment();
  }, [searchParams, issue, refetch, queryClient, id, axiosSecure, user, setSearchParams]);

  // ── Loading / Error states ──
  if (isLoading) return <LoadingScreen text="Loading issue details..." />;
  if (error || !issue) return (
    <div style={centerFlex}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
        <h2 style={{ color: '#fff', fontFamily: "'Syne',sans-serif", fontWeight: 800, marginBottom: '1rem' }}>Issue Not Found</h2>
        <button onClick={() => navigate('/allissues')} style={primaryBtn}>Back to All Issues</button>
      </div>
    </div>
  );

  const sc = statusCfg[issue.status] || statusCfg['Pending'];
  const pc = priorityCfg[issue.priority] || priorityCfg['Low'];
  const isOwner = user?.email === issue.reportedBy;
  const isHigh = issue.priority === 'High';
  const isPending = issue.status === 'Pending';
  const timeline = issue.timeline || [];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)',
      fontFamily: "'DM Sans', sans-serif",
      paddingTop: '5rem', paddingBottom: '4rem',
    }}>
      {/* BG orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '40vw', height: '40vw', maxWidth: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '30vw', height: '30vw', maxWidth: 400, background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem clamp(1rem,4vw,2rem)', position: 'relative', zIndex: 1 }}>

        {/* ── TOP ACTION BAR ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => navigate(-1)} style={ghostBtn}>
            <ArrowLeft size={16} /> Back
          </button>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {/* Owner: Edit (only if pending) */}
            {isOwner && isPending && (
              <Link to={`/editissue/${id}`} style={outlineBtn('#818cf8')}>
                <Edit3 size={15} /> Edit
              </Link>
            )}
            {/* Owner or Admin: Delete */}
            {(isOwner || isAdmin) && (
              <div className='flex gap-2'>
                <button onClick={() => {
                Swal.fire({
                  title: 'Delete this issue?', text: "This action cannot be undone.",
                  icon: 'warning', showCancelButton: true,
                  confirmButtonColor: '#ec4899', cancelButtonColor: '#374151',
                  confirmButtonText: 'Yes, delete', background: '#0d1117', color: '#fff',
                }).then(r => { if (r.isConfirmed) deleteMutation.mutate(); });
              }} style={outlineBtn('#f472b6')}>
                <Trash2 size={15} /> Delete
              </button>
              <Link to={`/editissue/${id}`} style={outlineBtn('#818cf8')}>
                <Edit3 size={15} /> Edit
              </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Main content (2/3) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="lg:col-span-2">

            {/* Header card */}
            <div style={glassCard}>
              {/* Badges row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 999, padding: '0.3rem 0.9rem', color: sc.color, fontSize: '0.8rem', fontWeight: 700 }}>
                    {sc.icon} {issue.status}
                  </span>
                  <span style={{ background: pc.bg, border: `1px solid ${pc.border}`, borderRadius: 999, padding: '0.3rem 0.9rem', color: pc.color, fontSize: '0.8rem', fontWeight: 700 }}>
                    {isHigh ? '⚡' : '📌'} {issue.priority} Priority
                  </span>
                  {issue.trackingId && (
                    <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '0.3rem 0.9rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: 600 }}>
                      🆔 {issue.trackingId}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 999, padding: '0.4rem 1rem' }}>
                  <ThumbsUp size={16} color="#818cf8" />
                  <span style={{ fontWeight: 700, color: '#818cf8', fontSize: '1rem' }}>{issue.upvotes || 0}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>upvotes</span>
                </div>
              </div>

              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: '#fff', lineHeight: 1.2, marginBottom: '0.75rem' }}>
                {issue.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem' }}>
                <MapPin size={16} color="#ec4899" />
                <span style={{ fontSize: '0.95rem' }}>{issue.location}</span>
              </div>

              {/* Image */}
              {issue.image && (
                <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '0.5rem' }}>
                  <img src={issue.image} alt={issue.title} style={{ width: '100%', maxHeight: 460, objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found'; }} />
                </div>
              )}
            </div>

            {/* Description */}
            <div style={glassCard}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#fff', fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#818cf8' }}>📝</span> Description
              </h3>
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.2rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '0.95rem', margin: 0 }}>
                  {issue.description || 'No detailed description provided.'}
                </p>
              </div>
            </div>

            {/* ── TIMELINE SECTION ── */}
            <div style={glassCard}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#22d3ee' }}>📋</span> Issue Timeline
                <span style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 999, padding: '0.15rem 0.6rem', color: '#22d3ee', fontSize: '0.72rem', fontWeight: 700 }}>
                  Read-only audit trail
                </span>
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginBottom: '1.8rem' }}>
                Latest updates appear first. Entries cannot be edited or deleted.
              </p>

              {timeline.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
                  No timeline entries yet.
                </div>
              ) : (
                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                  {/* Vertical line */}
                  <div style={{
                    position: 'absolute', left: 9, top: 8, bottom: 8, width: 2,
                    background: 'linear-gradient(to bottom, rgba(99,102,241,0.6), rgba(6,182,212,0.3), rgba(255,255,255,0.05))',
                    borderRadius: 99,
                  }} />

                  {/* Entries: latest first */}
                  {[...timeline].reverse().map((entry, i) => {
                    const sc2 = statusCfg[entry.status] || statusCfg['Pending'];
                    const roleColor = timelineRoleColor[entry.role] || '#818cf8';
                    return (
                      <div key={i} style={{ position: 'relative', marginBottom: i < timeline.length - 1 ? '1.4rem' : 0 }}>
                        {/* Dot */}
                        <div style={{
                          position: 'absolute', left: -27, top: 4,
                          width: 18, height: 18, borderRadius: '50%',
                          background: sc2.color,
                          border: '3px solid rgba(10,10,26,0.9)',
                          boxShadow: `0 0 12px ${sc2.color}80`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.55rem',
                        }} />

                        <div style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 14, padding: '1rem 1.2rem',
                        }}>
                          {/* Top row */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                            <span style={{ background: sc2.bg, border: `1px solid ${sc2.border}`, borderRadius: 999, padding: '0.15rem 0.6rem', color: sc2.color, fontSize: '0.72rem', fontWeight: 700 }}>
                              {sc2.icon} {entry.status}
                            </span>
                            <span style={{ background: `${roleColor}15`, border: `1px solid ${roleColor}30`, borderRadius: 999, padding: '0.15rem 0.6rem', color: roleColor, fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize' }}>
                              {entry.role}
                            </span>
                          </div>

                          {/* Message */}
                          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', margin: '0.3rem 0', lineHeight: 1.5 }}>
                            {entry.message}
                          </p>

                          {/* Footer */}
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              👤 {entry.updatedBy}
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              🕐 {entry.timestamp ? new Date(entry.timestamp).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Sidebar (1/3) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            {/* Issue Details */}
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
                    <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: `${item.accent}15`, border: `1px solid ${item.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.accent }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{item.label}</div>
                      <div style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-all' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Boost button — only for citizens who own this issue and not already high */}
              {isCitizen && isOwner && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <button
                    onClick={handlePayment}
                    disabled={isHigh}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      padding: '0.85rem', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem',
                      cursor: isHigh ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                      border: isHigh ? '1px solid rgba(52,211,153,0.3)' : 'none',
                      background: isHigh ? 'rgba(52,211,153,0.1)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: isHigh ? '#34d399' : '#fff',
                      boxShadow: isHigh ? 'none' : '0 0 25px rgba(99,102,241,0.4)',
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    <Zap size={17} fill={isHigh ? 'currentColor' : 'none'} />
                    {isHigh ? '✓ Already Boosted to High' : 'Boost Priority — 100৳'}
                  </button>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '0.6rem', lineHeight: 1.5 }}>
                    Boosting moves this issue to the top of the admin queue.
                  </p>
                </div>
              )}
            </div>

            {/* ── Assigned Staff Card ── */}
            {issue.assignedTo && (
              <div style={{ ...glassCard, borderColor: 'rgba(52,211,153,0.2)', background: 'rgba(52,211,153,0.04)' }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#34d399', fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🔧 Assigned Staff
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    🔧
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{issue.assignedStaffName || 'Staff Member'}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{issue.assignedTo}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Admin: Status changer ── */}
            {isAdmin && (
              <div style={glassCard}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f472b6', fontSize: '0.95rem', marginBottom: '1rem' }}>
                  🛡️ Admin Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {['Pending', 'In Progress', 'Resolved', 'Closed', 'Rejected'].map(s => (
                    <button
                      key={s}
                      disabled={issue.status === s}
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: `Set status to "${s}"?`,
                          showCancelButton: true, confirmButtonColor: '#6366f1',
                          cancelButtonColor: '#374151', background: '#0d1117', color: '#fff',
                        });
                        if (result.isConfirmed) {
                          await axiosSecure.patch(`/issues/${id}/status`, { status: s, message: `Status set to ${s} by admin` });
                          refetch();
                        }
                      }}
                      style={{
                        padding: '0.55rem 0.9rem', borderRadius: 9,
                        background: issue.status === s ? (statusCfg[s]?.bg || 'rgba(99,102,241,0.1)') : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${issue.status === s ? (statusCfg[s]?.border || 'rgba(99,102,241,0.3)') : 'rgba(255,255,255,0.08)'}`,
                        color: issue.status === s ? (statusCfg[s]?.color || '#818cf8') : 'rgba(255,255,255,0.55)',
                        fontSize: '0.82rem', fontWeight: issue.status === s ? 700 : 500,
                        cursor: issue.status === s ? 'not-allowed' : 'pointer',
                        textAlign: 'left', fontFamily: "'DM Sans',sans-serif",
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                      }}
                    >
                      {statusCfg[s]?.icon} {s}
                      {issue.status === s && <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>Current</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Staff: Status changer ── */}
            {isStaff && issue.assignedTo === user?.email && (
              <div style={glassCard}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#34d399', fontSize: '0.95rem', marginBottom: '1rem' }}>
                  🔧 Update Status
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {staffStatusFlow(issue.status).map(s => (
                    <button
                      key={s}
                      onClick={async () => {
                        const { value: message } = await Swal.fire({
                          title: `Update to "${s}"`,
                          input: 'textarea', inputLabel: 'Add a note (optional)',
                          inputPlaceholder: 'Describe what was done...',
                          showCancelButton: true, confirmButtonColor: '#6366f1',
                          cancelButtonColor: '#374151', background: '#0d1117', color: '#fff',
                        });
                        if (message !== undefined) {
                          await axiosSecure.patch(`/issues/${id}/status`, {
                            status: s, message: message || `Status updated to ${s} by staff`,
                          });
                          refetch();
                        }
                      }}
                      style={{
                        padding: '0.6rem 0.9rem', borderRadius: 9,
                        background: `${statusCfg[s]?.bg || 'rgba(52,211,153,0.1)'}`,
                        border: `1px solid ${statusCfg[s]?.border || 'rgba(52,211,153,0.3)'}`,
                        color: statusCfg[s]?.color || '#34d399',
                        fontSize: '0.85rem', fontWeight: 700,
                        cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                      }}
                    >
                      {statusCfg[s]?.icon} Move to: {s}
                    </button>
                  ))}
                  {staffStatusFlow(issue.status).length === 0 && (
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No further status updates available.</p>
                  )}
                </div>
              </div>
            )}

            {/* Alert card */}
            <div style={{ ...glassCard, borderColor: 'rgba(6,182,212,0.2)', background: 'rgba(6,182,212,0.04)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <AlertCircle size={20} color="#22d3ee" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ color: '#22d3ee', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Need urgent help?</h4>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    Contact city council support if this issue poses immediate danger.
                  </p>
                  <button style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 8, padding: '0.4rem 0.9rem', color: '#22d3ee', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                    Contact Support
                  </button>
                </div>
              </div>
            </div>

            {/* Community actions */}
            <div style={glassCard}>
              <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '0.9rem' }}>Community Actions</h4>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button style={{ flex: 1, padding: '0.6rem', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                  Share
                </button>
                <button style={{ flex: 1, padding: '0.6rem', borderRadius: 10, background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Staff status flow: what status can staff set based on current ──────────────
const staffStatusFlow = (currentStatus) => {
  const flows = {
    'Pending':     ['In Progress'],
    'In Progress': ['Resolved'],
    'Resolved':    ['Closed'],
    'Closed':      [],
    'Rejected':    [],
  };
  return flows[currentStatus] || [];
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const glassCard = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20, padding: '1.75rem',
  backdropFilter: 'blur(12px)',
};

const ghostBtn = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, padding: '0.6rem 1.2rem',
  color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 600,
  cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
};

const outlineBtn = (color) => ({
  display: 'flex', alignItems: 'center', gap: '0.4rem',
  background: `${color}15`, border: `1px solid ${color}40`,
  borderRadius: 10, padding: '0.6rem 1.2rem',
  color: color, fontSize: '0.875rem', fontWeight: 600,
  textDecoration: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
});

const primaryBtn = {
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  border: 'none', borderRadius: 12, padding: '0.75rem 1.8rem',
  color: '#fff', fontWeight: 700, fontSize: '0.9rem',
  cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
};

const centerFlex = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)',
};

const LoadingScreen = ({ text }) => (
  <div style={centerFlex}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
      <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans',sans-serif" }}>{text}</p>
    </div>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

export default IssueDetails;