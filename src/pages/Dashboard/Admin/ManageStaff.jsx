import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from './components/Loading';
import { glassCard, inputStyle, selectStyle, primaryBtn, dangerBtn, labelStyle } from './components/styles';
import { RatingDisplay } from '../../../components/Ratings/StaffRating';
import UserProfileModal from '../../../components/UserProfileModal/UserProfileModal';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageStaff = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [assignModal, setAssignModal] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const [selectedStaffUser, setSelectedStaffUser] = useState(null);

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff-list'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users/staff');
      return res.data;
    },
  });

  const { data: pendingIssues = [] } = useQuery({
    queryKey: ['unassigned-issues'],
    queryFn: async () => {
      const res = await axiosSecure.get('/issues?status=Pending&limit=100');
      return res.data;
    },
    enabled: !!assignModal,
  });

  const handleAssignIssue = async () => {
    if (!selectedIssue || !assignModal) return;
    setAssigning(true);
    try {
      await axiosSecure.patch(`/issues/${selectedIssue}/assign`, {
        assignedTo: assignModal.email,
        staffName: assignModal.name || assignModal.email,
      });
      queryClient.invalidateQueries(['unassigned-issues']);
      queryClient.invalidateQueries(['staff-list']);
      queryClient.invalidateQueries(['admin-issues']);
      toast.success(`Issue assigned to ${assignModal.name || assignModal.email}`);
      setAssignModal(null);
      setSelectedIssue('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to assign issue');
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveStaff = async (email, name) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Remove Staff Member',
      html: `Are you sure you want to remove <strong>${name || email}</strong> from staff?<br/><br/>They will become a regular citizen and will no longer have staff privileges.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f87171',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'Cancel',
      background: '#0d1117',
      color: '#fff',
    });

    if (!result.isConfirmed) return;

    // Show loading toast
    toast.loading('Removing staff member...', { id: 'remove-staff-loading' });

    try {
      await axiosSecure.patch('/users/role', { email, role: 'citizen' });
      
      // Dismiss loading toast
      toast.dismiss('remove-staff-loading');
      
      // Show success message
      Swal.fire({
        title: 'Staff Member Removed',
        text: `${name || email} has been removed from staff and is now a citizen.`,
        icon: 'success',
        background: '#0d1117',
        color: '#fff',
        confirmButtonColor: '#6366f1',
        timer: 2000,
        timerProgressBar: true,
      });
      
      toast.success(`${name || email} removed from staff`);
      queryClient.invalidateQueries(['staff-list']);
    } catch (err) {
      // Dismiss loading toast
      toast.dismiss('remove-staff-loading');
      
      console.log(err);
      
      // Show error message
      Swal.fire({
        title: 'Error',
        text: err?.response?.data?.message || 'Failed to remove staff member',
        icon: 'error',
        background: '#0d1117',
        color: '#fff',
        confirmButtonColor: '#6366f1',
      });
      
      toast.error('Failed to remove staff');
    }
  };

  const filtered = staff.filter(s =>
    !filterSearch ||
    (s.name || s.email || '').toLowerCase().includes(filterSearch.toLowerCase())
  );

  if (isLoading) return <Loading />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Manage Staff</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>
          {staff.length} staff member{staff.length !== 1 ? 's' : ''}
        </p>
      </div>

      <input
        value={filterSearch}
        onChange={e => setFilterSearch(e.target.value)}
        placeholder="🔍  Search staff by name or email..."
        style={{ ...inputStyle, marginBottom: 0, maxWidth: 360 }}
      />

      {filtered.length === 0 ? (
        <div style={{ ...glassCard, textAlign: 'center', padding: '3rem', color: '#475569' }}>
          No staff found. Promote a citizen to staff from Staff Requests.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filtered.map(s => (
            <div key={s.email} style={{ ...glassCard, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', flexShrink: 0, overflow: 'hidden',
                }}>
                  {s.photo
                    ? <img src={s.photo} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                    : (s.name || s.email || '?')[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.name || 'Staff Member'}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.email}</div>
                </div>
                <span style={{
                  background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)',
                  color: '#34d399', borderRadius: '6px', padding: '0.2rem 0.6rem',
                  fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                }}>STAFF</span>
              </div>

              {/* Rating display */}
              {(s.ratingCount || 0) > 0 && (
                <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, padding: '0.5rem 0.75rem' }}>
                  <RatingDisplay avgRating={s.avgRating || 0} count={s.ratingCount || 0} size={14} />
                </div>
              )}

              {/* Stats */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[
                  { label: 'Assigned', value: s.assignedCount || 0, color: '#818cf8' },
                  { label: 'Resolved', value: s.resolvedCount || 0, color: '#34d399' },
                  { label: 'In Progress', value: s.inProgressCount || 0, color: '#22d3ee' },
                ].map(stat => (
                  <div key={stat.label} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.5rem', textAlign: 'center' }}>
                    <div style={{ color: stat.color, fontWeight: 700 }}>{stat.value}</div>
                    <div style={{ color: '#64748b', fontSize: '0.68rem' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { setAssignModal(s); setSelectedIssue(''); }}
                  style={{ ...primaryBtn, flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                >
                  🛠️ Assign Issue
                </button>
                <button
                  onClick={() => setSelectedStaffUser(s)}
                  style={{
                    background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '8px',
                    padding: '0.4rem 0.85rem',
                    color: '#818cf8',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  👁️ View Profile
                </button>
                <button
                  onClick={() => handleRemoveStaff(s.email, s.name)}
                  style={{ ...dangerBtn, fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Issue Modal */}
      {assignModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}
          onClick={() => setAssignModal(null)}
        >
          <div
            style={{ ...glassCard, width: '100%', maxWidth: 460, background: '#0f172a', border: '1px solid rgba(99,102,241,0.3)' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ color: '#e2e8f0', margin: '0 0 0.4rem' }}>Assign Issue to Staff</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1.25rem' }}>
              Assigning to: <strong style={{ color: '#818cf8' }}>{assignModal.name || assignModal.email}</strong>
            </p>

            <label style={labelStyle}>SELECT PENDING ISSUE</label>
            <select
              value={selectedIssue}
              onChange={e => setSelectedIssue(e.target.value)}
              style={{ ...selectStyle, marginBottom: '1.5rem' }}
            >
              <option value="">— Choose a pending issue —</option>
              {pendingIssues.map(issue => (
                <option key={issue._id} value={issue._id}>
                  [{issue.trackingId || 'N/A'}] {issue.title} — {issue.location || 'No location'}
                </option>
              ))}
            </select>

            {pendingIssues.length === 0 && (
              <p style={{ color: '#64748b', fontSize: '0.83rem', marginBottom: '1rem' }}>
                No pending issues available to assign.
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setAssignModal(null)} style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', padding: '0.6rem 1.2rem',
                color: '#94a3b8', cursor: 'pointer',
              }}>
                Cancel
              </button>
              <button
                onClick={handleAssignIssue}
                disabled={!selectedIssue || assigning}
                style={{ ...primaryBtn, opacity: (!selectedIssue || assigning) ? 0.5 : 1 }}
              >
                {assigning ? 'Assigning...' : '✅ Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Profile Modal */}
      {selectedStaffUser && (
        <UserProfileModal
          user={selectedStaffUser}
          onClose={() => setSelectedStaffUser(null)}
        />
      )}
    </div>
  );
};

export default ManageStaff;