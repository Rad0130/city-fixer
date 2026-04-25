import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import useRole from '../../../Hooks/useRole';
import Loading from './components/Loading';
import { glassCard, statusBadge } from './components/styles';

const CitizenOverview = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isPremium } = useRole();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ['citizen-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/dashboard/citizen-stats');
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  const cards = [
    { label: 'Total Reported', value: stats.total || 0, color: '#818cf8', bg: 'rgba(129,140,248,0.1)', icon: '📋' },
    { label: 'Pending', value: stats.pending || 0, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', icon: '⏳' },
    { label: 'In Progress', value: stats.inProgress || 0, color: '#22d3ee', bg: 'rgba(34,211,238,0.1)', icon: '⚙️' },
    { label: 'Resolved', value: stats.resolved || 0, color: '#34d399', bg: 'rgba(52,211,153,0.1)', icon: '✅' },
    { label: 'Payments', value: stats.totalPayments || 0, color: '#f472b6', bg: 'rgba(244,114,182,0.1)', icon: '💳' },
  ];

  const freeUsed = Math.min(stats.total || 0, 3);
  const freePercent = (freeUsed / 3) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome */}
      <div style={{ ...glassCard, background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', color: '#fff', fontWeight: 700, flexShrink: 0, overflow: 'hidden',
          }}>
            {user?.photoURL
              ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (user?.displayName || user?.email)?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: '#f1f5f9', fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
              Welcome back, {user?.displayName?.split(' ')[0] || 'Citizen'} 👋
            </h1>
            <p style={{ color: '#64748b', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
              {isPremium ? '⭐ Premium Member' : `Free Plan — ${freeUsed}/3 reports used`}
            </p>
          </div>
          {!isPremium && (
            <Link to="/dashboard/profile" style={{
              background: 'linear-gradient(135deg, #f59e0b, #fb923c)',
              border: 'none', borderRadius: '10px',
              padding: '0.5rem 1.1rem', color: '#fff', fontWeight: 700,
              fontSize: '0.8rem', textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              ⭐ Go Premium
            </Link>
          )}
        </div>

        {/* Free usage bar */}
        {!isPremium && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem' }}>
              <span>Free report usage</span>
              <span>{freeUsed}/3</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${freePercent}%`,
                background: freePercent >= 100 ? '#f87171' : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                borderRadius: '999px', transition: 'width 0.4s',
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        {cards.map(c => (
          <div key={c.label} style={{
            ...glassCard, textAlign: 'center', background: c.bg,
            border: `1px solid ${c.color}22`, padding: '1.25rem 1rem',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{c.icon}</div>
            <div style={{ color: c.color, fontSize: '1.75rem', fontWeight: 800, lineHeight: 1 }}>{c.value}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.4rem', fontWeight: 500 }}>{c.label}</div>
          </div>
        ))}
        {isPremium && (
          <div style={{ ...glassCard, textAlign: 'center', background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🚀</div>
            <div style={{ color: '#fb923c', fontSize: '1rem', fontWeight: 800, lineHeight: 1 }}>Premium Priority</div>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '0.4rem' }}>Your issues get faster attention</div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div>
        <h3 style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
          {[
            { to: '/reportIssue', icon: '📝', label: 'Report Issue', desc: 'Submit a new issue' },
            { to: '/dashboard/myissues', icon: '📋', label: 'My Issues', desc: 'Track your reports' },
            { to: '/dashboard/mypayments', icon: '💳', label: 'Payments', desc: 'View transactions' },
            { to: '/dashboard/profile', icon: '👤', label: 'Profile', desc: 'Update your info' },
          ].map(q => (
            <Link key={q.to} to={q.to} style={{
              ...glassCard, textDecoration: 'none', display: 'flex',
              alignItems: 'center', gap: '0.85rem', padding: '1rem 1.25rem',
            }}>
              <span style={{ fontSize: '1.5rem' }}>{q.icon}</span>
              <div>
                <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' }}>{q.label}</div>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{q.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Issues */}
      {(stats.recentIssues || []).length > 0 && (
        <div style={glassCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#e2e8f0', margin: 0, fontWeight: 700 }}>Recent Reports</h3>
            <Link to="/dashboard/myissues" style={{ color: '#818cf8', fontSize: '0.85rem', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(stats.recentIssues || []).map(issue => (
              <Link key={issue._id} to={`/details/${issue._id}`} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.7rem 0.85rem', background: 'rgba(255,255,255,0.03)',
                borderRadius: '10px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div>
                  <div style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.875rem' }}>{issue.title}</div>
                  <div style={{ color: '#475569', fontSize: '0.73rem' }}>{issue.location || 'No location'}</div>
                </div>
                <span style={statusBadge(issue.status)}>{issue.status}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenOverview;