import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from './components/Loading';
import { glassCard, inputStyle, selectStyle, statusBadge, primaryBtn, dangerBtn, successBtn, pageBtn, labelStyle } from './components/styles';
import toast from 'react-hot-toast';

const AdminAllIssues = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [assignModal, setAssignModal] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Debounce search to avoid too many API calls
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearch(value);
    const timeoutId = setTimeout(() => setDebouncedSearch(value), 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ['admin-issues', page, debouncedSearch, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: 10, skip: page * 10 });
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (filterStatus) params.append('status', filterStatus);
      const res = await axiosSecure.get(`/issues?${params}`);
      return res.data;
    },
  });

  const { data: staffList = [] } = useQuery({
    queryKey: ['staff-list'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users/staff');
      return res.data;
    },
  });

  const handleAssign = async () => {
    if (!selectedStaff || !assignModal) return;
    setAssigning(true);
    try {
      await axiosSecure.patch(`/issues/${assignModal._id}/assign`, {
        assignedTo: selectedStaff,
      });
      queryClient.invalidateQueries(['admin-issues']);
      queryClient.invalidateQueries(['staff-list']);
      const staffMember = staffList.find(s => s.email === selectedStaff);
      toast.success(`Assigned to ${staffMember?.name || selectedStaff}`);
      setAssignModal(null);
      setSelectedStaff('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to assign staff');
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axiosSecure.patch(`/issues/${id}/status`, { status });
      queryClient.invalidateQueries(['admin-issues']);
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      console.log(err)
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await axiosSecure.delete(`/issues/${id}`);
      queryClient.invalidateQueries(['admin-issues']);
      toast.success('Issue deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>All Issues</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>
          {issues.length} issue{issues.length !== 1 ? 's' : ''} on this page
        </p>
      </div>

      {/* Premium Info Banner */}
      <div style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)', borderRadius: '12px', padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.2rem' }}>⭐</span>
        <p style={{ color: '#94a3b8', fontSize: '0.83rem', margin: 0 }}>
          <strong style={{ color: '#fb923c' }}>Premium Users'</strong> issues are automatically boosted to <strong style={{ color: '#fb923c' }}>High Priority</strong> and go directly to <strong style={{ color: '#fb923c' }}>In Progress</strong> status.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={handleSearchChange}
          placeholder="🔍  Search by title or location..."
          style={{ ...inputStyle, marginBottom: 0, maxWidth: 320 }}
        />
        <select
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(0); }}
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

      {/* Issue List */}
      {issues.length === 0 ? (
        <div style={{ ...glassCard, textAlign: 'center', padding: '3rem', color: '#475569' }}>No issues found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {issues.map(issue => (
            <div key={issue._id} style={{
              ...glassCard,
              display: 'flex', flexWrap: 'wrap', gap: '1rem',
              alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem',
              borderLeft: issue.reporterIsPremium ? '3px solid #fb923c' : '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {issue.trackingId && (
                    <span style={{ color: '#64748b', fontSize: '0.72rem', fontFamily: 'monospace' }}>{issue.trackingId}</span>
                  )}
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{issue.title}</span>
                  <span style={statusBadge(issue.status)}>{issue.status}</span>
                  {issue.reporterIsPremium && (
                    <span style={{ 
                      background: 'rgba(251,146,60,0.15)', 
                      border: '1px solid rgba(251,146,60,0.4)', 
                      color: '#fb923c', 
                      borderRadius: '6px', 
                      padding: '0.2rem 0.6rem', 
                      fontSize: '0.65rem', 
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                    }}>
                      ⭐ PREMIUM
                    </span>
                  )}
                  {issue.priority === 'High' && (
                    <span style={{ 
                      background: 'rgba(239,68,68,0.12)', 
                      border: '1px solid rgba(239,68,68,0.3)', 
                      color: '#f87171', 
                      borderRadius: '6px', 
                      padding: '0.2rem 0.6rem', 
                      fontSize: '0.65rem', 
                      fontWeight: 700 
                    }}>
                      🔥 HIGH PRIORITY
                    </span>
                  )}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.3rem' }}>
                  📍 {issue.location || 'N/A'} &nbsp;•&nbsp;
                  🗓️ {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'N/A'} &nbsp;•&nbsp;
                  👤 {issue.reportedBy || 'Unknown'}
                  {issue.reporterIsPremium && <span style={{ color: '#fb923c', marginLeft: '0.5rem' }}>⭐ Premium User</span>}
                </div>
                {issue.assignedTo && (
                  <div style={{ color: '#818cf8', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                    🛠️ Assigned: {issue.assignedStaffName || issue.assignedTo}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to={`/details/${issue._id}`} style={{ ...pageBtn, textDecoration: 'none', fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}>
                  View
                </Link>
                <button
                  onClick={() => { setAssignModal(issue); setSelectedStaff(issue.assignedTo || ''); }}
                  style={{
                    background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)',
                    borderRadius: '8px', padding: '0.4rem 0.85rem',
                    color: '#818cf8', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
                  }}
                >
                  🛠️ {issue.assignedTo ? 'Reassign' : 'Assign Staff'}
                </button>
                {issue.status !== 'Resolved' && (
                  <button onClick={() => handleStatusChange(issue._id, 'Resolved')} style={{ ...successBtn, fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}>
                    ✅ Resolve
                  </button>
                )}
                {issue.status !== 'Rejected' && (
                  <button onClick={() => handleStatusChange(issue._id, 'Rejected')} style={{ ...dangerBtn, fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}>
                    ✕ Reject
                  </button>
                )}
                <button onClick={() => handleDelete(issue._id, issue.title)} style={{ ...dangerBtn, fontSize: '0.78rem', padding: '0.4rem 0.7rem' }}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={pageBtn}>← Prev</button>
        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Page {page + 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={issues.length < 10} style={pageBtn}>Next →</button>
      </div>

      {/* Assign Staff Modal */}
      {assignModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}
          onClick={() => setAssignModal(null)}
        >
          <div
            style={{ ...glassCard, width: '100%', maxWidth: 440, background: '#111827', border: '1px solid rgba(99,102,241,0.3)' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ color: '#e2e8f0', margin: '0 0 0.5rem' }}>Assign Staff</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 0.25rem' }}>
              Issue: <strong style={{ color: '#94a3b8' }}>{assignModal.title}</strong>
            </p>
            {assignModal.trackingId && (
              <p style={{ color: '#475569', fontSize: '0.78rem', fontFamily: 'monospace', margin: '0 0 1.25rem' }}>
                {assignModal.trackingId}
              </p>
            )}
            {assignModal.reporterIsPremium && (
              <p style={{ color: '#fb923c', fontSize: '0.78rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                ⭐ This issue is from a Premium user - High Priority
              </p>
            )}

            <label style={labelStyle}>SELECT STAFF MEMBER</label>
            <select
              value={selectedStaff}
              onChange={e => setSelectedStaff(e.target.value)}
              style={{ ...selectStyle, marginBottom: '1.25rem' }}
            >
              <option value="">— Choose staff —</option>
              {staffList.map(s => (
                <option key={s.email} value={s.email}>
                  {s.name || s.email} ({s.assignedCount || 0} assigned)
                </option>
              ))}
            </select>

            {staffList.length === 0 && (
              <p style={{ color: '#64748b', fontSize: '0.83rem', marginBottom: '1rem' }}>
                No staff available. Promote a citizen to staff first.
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setAssignModal(null)} style={{ ...pageBtn }}>Cancel</button>
              <button
                onClick={handleAssign}
                disabled={!selectedStaff || assigning}
                style={{ ...primaryBtn, opacity: (!selectedStaff || assigning) ? 0.5 : 1 }}
              >
                {assigning ? 'Assigning...' : 'Assign Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllIssues;