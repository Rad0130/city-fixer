import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import Loading from './components/Loading';
import { glassCard, statusBadge } from './components/styles';

const StaffOverview = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ['staff-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/dashboard/staff-stats');
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  const cards = [
    { label: 'Total Assigned', value: stats.assigned || 0, color: '#818cf8', bg: 'rgba(129,140,248,0.1)', icon: '📋' },
    { label: 'In Progress', value: stats.inProgress || 0, color: '#22d3ee', bg: 'rgba(34,211,238,0.1)', icon: '⚙️' },
    { label: 'Resolved', value: stats.resolved || 0, color: '#34d399', bg: 'rgba(52,211,153,0.1)', icon: '✅' },
    { label: 'Pending', value: stats.pending || 0, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', icon: '⏳' },
    { label: '⭐ Rating', value: stats.avgRating ? `${stats.avgRating.toFixed(1)}★` : 'No ratings', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', icon: '⭐' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome */}
      <div style={{ ...glassCard, background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', color: '#fff', fontWeight: 700, flexShrink: 0,
            overflow: 'hidden',
          }}>
            {user?.photoURL
              ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (user?.displayName || user?.email)?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ color: '#f1f5f9', fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
              Welcome back, {user?.displayName?.split(' ')[0] || 'Staff'} 👋
            </h1>
            <p style={{ color: '#64748b', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
              Staff Member &nbsp;•&nbsp; {user?.email}
            </p>
          </div>
        </div>
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
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
        <Link to="/staff/issues" style={{ ...glassCard, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🔧</span>
          <div>
            <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' }}>Assigned Issues</div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>View your work queue</div>
          </div>
        </Link>
        <Link to="/staff/profile" style={{ ...glassCard, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '1.5rem' }}>👤</span>
          <div>
            <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' }}>My Profile</div>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Update your info</div>
          </div>
        </Link>
      </div>

      {/* Recent Assigned */}
      {(stats.recentIssues || []).length > 0 && (
        <div style={glassCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#e2e8f0', margin: 0, fontWeight: 700 }}>Recent Assignments</h3>
            <Link to="/staff/issues" style={{ color: '#818cf8', fontSize: '0.85rem', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(stats.recentIssues || []).map(issue => (
              <Link key={issue._id} to={`/details/${issue._id}`} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.7rem 0.85rem', background: 'rgba(255,255,255,0.03)',
                borderRadius: '10px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.875rem' }}>{issue.title}</span>
                <span style={statusBadge(issue.status)}>{issue.status}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffOverview;