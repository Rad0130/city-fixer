import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import Loading from './components/Loading';
import { glassCard, selectStyle, inputStyle, statusBadge, pageBtn, dangerBtn } from './components/styles';

const MyIssues = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ['myIssues', user?.email, filterStatus],
    enabled: !!user?.email,
    queryFn: async () => {
      const params = new URLSearchParams({ reportedBy: user.email });
      if (filterStatus) params.append('status', filterStatus);
      const res = await axiosSecure.get(`/issues?${params}`);
      return res.data;
    },
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this issue?')) return;
    await axiosSecure.delete(`/issues/${id}`);
    queryClient.invalidateQueries(['myIssues']);
  };

  const filtered = issues.filter(i =>
    !search || i.title?.toLowerCase().includes(search.toLowerCase()) || i.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <Loading />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>My Issues</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            {issues.length} issue{issues.length !== 1 ? 's' : ''} reported
          </p>
        </div>
        <Link to="/reportIssue" style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none', borderRadius: '10px',
          padding: '0.6rem 1.2rem', color: '#fff',
          fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
        }}>
          + Report New Issue
        </Link>
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
          <option value="Rejected">Rejected</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ ...glassCard, textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
          <div style={{ color: '#475569', marginBottom: '1rem' }}>No issues found</div>
          <Link to="/reportIssue" style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px', padding: '0.6rem 1.4rem',
            color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem',
          }}>
            Report Your First Issue
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filtered.map(issue => (
            <div key={issue._id} style={{ ...glassCard, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '1rem' }}>{issue.title}</div>
                  <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                    📍 {issue.location || 'N/A'} &nbsp;•&nbsp;
                    🗓️ {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                  {issue.assignedTo && (
                    <div style={{ color: '#818cf8', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                      🛠️ Assigned to: {issue.assignedTo}
                    </div>
                  )}
                </div>
                <span style={statusBadge(issue.status)}>{issue.status}</span>
              </div>

              {issue.description && (
                <p style={{ color: '#94a3b8', fontSize: '0.83rem', margin: 0, lineHeight: 1.5 }}>
                  {issue.description.length > 100 ? issue.description.slice(0, 100) + '…' : issue.description}
                </p>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', flexWrap: 'wrap' }}>
                <Link to={`/details/${issue._id}`} style={{ ...pageBtn, textDecoration: 'none', fontSize: '0.8rem' }}>
                  👁️ View
                </Link>
                {(issue.status === 'Pending' || issue.status === 'Rejected') && (
                  <Link to={`/editissue/${issue._id}`} style={{
                    background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '8px', padding: '0.4rem 0.85rem',
                    color: '#818cf8', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none',
                  }}>
                    ✏️ Edit
                  </Link>
                )}
                {issue.status === 'Pending' && (
                  <button onClick={() => handleDelete(issue._id)} style={{ ...dangerBtn, fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyIssues;