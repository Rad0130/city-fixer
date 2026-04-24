import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from './components/Loading';
import { glassCard, statusBadge} from './components/styles';

const AdminOverview = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/dashboard/admin-stats');
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  const cards = [
    { label: 'Total Issues', value: stats.total || 0, color: '#818cf8', icon: '📋', bg: 'rgba(129,140,248,0.1)' },
    { label: 'Pending', value: stats.pending || 0, color: '#fbbf24', icon: '⏳', bg: 'rgba(251,191,36,0.1)' },
    { label: 'In Progress', value: stats.inProgress || 0, color: '#22d3ee', icon: '⚙️', bg: 'rgba(34,211,238,0.1)' },
    { label: 'Resolved', value: stats.resolved || 0, color: '#34d399', icon: '✅', bg: 'rgba(52,211,153,0.1)' },
    { label: 'Rejected', value: stats.rejected || 0, color: '#f472b6', icon: '❌', bg: 'rgba(244,114,182,0.1)' },
    { label: 'Total Revenue', value: `৳${stats.totalPaymentAmount || 0}`, color: '#fb923c', icon: '💰', bg: 'rgba(251,146,60,0.1)' },
  ];

  const quickLinks = [
    { to: '/admin/issues', label: 'All Issues', icon: '🔧', desc: 'View & manage issues' },
    { to: '/admin/users', label: 'Manage Users', icon: '👥', desc: 'Citizens list' },
    { to: '/admin/staff', label: 'Manage Staff', icon: '🛠️', desc: 'Staff & assignments' },
    { to: '/admin/payments', label: 'Payments', icon: '💳', desc: 'Revenue overview' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
          Admin Overview
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>
          City-Fixer control panel — all systems
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {cards.map(c => (
          <div key={c.label} style={{
            ...glassCard,
            background: c.bg,
            border: `1px solid ${c.color}22`,
            textAlign: 'center',
            padding: '1.25rem 1rem',
          }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{c.icon}</div>
            <div style={{ color: c.color, fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>{c.value}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.4rem', fontWeight: 500 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h3 style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {quickLinks.map(q => (
            <Link key={q.to} to={q.to} style={{
              ...glassCard,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '1rem 1.25rem',
              transition: 'border-color 0.2s, background 0.2s',
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

      {/* Latest Issues */}
      <div style={glassCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: '#e2e8f0', margin: 0, fontWeight: 700 }}>Latest Issues</h3>
          <Link to="/admin/issues" style={{ color: '#818cf8', fontSize: '0.85rem', textDecoration: 'none' }}>View all →</Link>
        </div>
        {(stats.latestIssues || []).length === 0 ? (
          <p style={{ color: '#475569', textAlign: 'center', padding: '1rem 0' }}>No issues yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {(stats.latestIssues || []).map(issue => (
              <Link key={issue._id} to={`/details/${issue._id}`} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '10px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div>
                  <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' }}>{issue.title}</div>
                  <div style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.15rem' }}>{issue.location || 'No location'}</div>
                </div>
                <span style={statusBadge(issue.status)}>{issue.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;