import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import Loading from './components/Loading';
import { glassCard, selectStyle, successBtn, pageBtn, statusBadge, inputStyle } from './components/styles';

const STATUS_OPTIONS = ['In Progress', 'Resolved', 'Closed'];

const AssignedIssues = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ['assigned-issues', user?.email, filterStatus],
    enabled: !!user?.email,
    queryFn: async () => {
      const params = new URLSearchParams({ assignedTo: user.email });
      if (filterStatus) params.append('status', filterStatus);
      const res = await axiosSecure.get(`/issues?${params}`);
      return res.data;
    },
  });

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await axiosSecure.patch(`/issues/${id}/status`, { status: newStatus });
      queryClient.invalidateQueries(['assigned-issues']);
    } catch {
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = issues.filter(i =>
    !search || i.title?.toLowerCase().includes(search.toLowerCase()) || i.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <Loading />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Assigned Issues</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>
          {issues.length} issue{issues.length !== 1 ? 's' : ''} assigned to you
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search issues..."
          style={{ ...inputStyle, marginBottom: 0, maxWidth: 280 }}
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ ...selectStyle, marginBottom: 0, maxWidth: 180 }}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Issue List */}
      {filtered.length === 0 ? (
        <div style={{ ...glassCard, textAlign: 'center', padding: '3rem', color: '#475569' }}>
          No issues found
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filtered.map(issue => (
            <div key={issue._id} style={{ ...glassCard, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '1rem' }}>{issue.title}</div>
                  <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                    📍 {issue.location || 'N/A'} &nbsp;•&nbsp;
                    🗓️ {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'N/A'} &nbsp;•&nbsp;
                    👤 {issue.reportedBy || 'Unknown'}
                  </div>
                </div>
                <span style={statusBadge(issue.status)}>{issue.status}</span>
              </div>

              {issue.description && (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                  {issue.description.length > 120 ? issue.description.slice(0, 120) + '…' : issue.description}
                </p>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                <Link to={`/details/${issue._id}`} style={{
                  ...pageBtn, textDecoration: 'none', fontSize: '0.8rem',
                }}>
                  👁️ View Details
                </Link>

                {issue.status !== 'In Progress' && issue.status !== 'Resolved' && issue.status !== 'Closed' && (
                  <button
                    onClick={() => handleStatusChange(issue._id, 'In Progress')}
                    disabled={updating === issue._id}
                    style={{
                      background: 'rgba(34,211,238,0.12)',
                      border: '1px solid rgba(34,211,238,0.3)',
                      borderRadius: '8px', padding: '0.45rem 1rem',
                      color: '#22d3ee', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                      opacity: updating === issue._id ? 0.5 : 1,
                    }}
                  >
                    ⚙️ Start Working
                  </button>
                )}

                {issue.status !== 'Resolved' && issue.status !== 'Closed' && (
                  <button
                    onClick={() => handleStatusChange(issue._id, 'Resolved')}
                    disabled={updating === issue._id}
                    style={{ ...successBtn, opacity: updating === issue._id ? 0.5 : 1 }}
                  >
                    ✅ Mark Resolved
                  </button>
                )}

                {issue.status === 'Resolved' && (
                  <button
                    onClick={() => handleStatusChange(issue._id, 'Closed')}
                    disabled={updating === issue._id}
                    style={{
                      background: 'rgba(148,163,184,0.1)',
                      border: '1px solid rgba(148,163,184,0.3)',
                      borderRadius: '8px', padding: '0.45rem 1rem',
                      color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                      opacity: updating === issue._id ? 0.5 : 1,
                    }}
                  >
                    🔒 Close
                  </button>
                )}

                {updating === issue._id && (
                  <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Updating...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedIssues;