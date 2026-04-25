import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from './components/Loading';
import { glassCard, dangerBtn, successBtn } from './components/styles';
import UserProfileModal from '../../../components/UserProfileModal/UserProfileModal';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AdminStaffRequests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('pending'); // pending | approved | rejected
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['staff-requests', tab],
    queryFn: async () => {
      const res = await axiosSecure.get(`/staff-requests?status=${tab}`);
      return res.data;
    },
  });

  const handleAction = async (id, action, email, name) => {
    const label = action === 'approve' ? 'Approve' : 'Reject';
    
    // Show confirmation dialog
    const result = await Swal.fire({
      title: `${label} Staff Request`,
      html: `Are you sure you want to <strong>${action}</strong> the staff request from <strong>${name || email}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: action === 'approve' ? '#34d399' : '#f87171',
      cancelButtonColor: '#374151',
      confirmButtonText: action === 'approve' ? 'Yes, Approve' : 'Yes, Reject',
      cancelButtonText: 'Cancel',
      background: '#0d1117',
      color: '#fff',
    });

    if (!result.isConfirmed) return;

    // Show loading toast
    toast.loading(action === 'approve' ? 'Approving request...' : 'Rejecting request...', {
      id: 'staff-action-loading',
    });

    try {
      await axiosSecure.patch(`/staff-requests/${id}`, { action });
      
      // Dismiss loading toast
      toast.dismiss('staff-action-loading');
      
      // Show success message
      Swal.fire({
        title: action === 'approve' ? 'Staff Member Added!' : 'Request Rejected',
        text: action === 'approve' 
          ? `${name || email} is now a staff member and can start handling issues.`
          : `The staff request from ${name || email} has been rejected.`,
        icon: 'success',
        background: '#0d1117',
        color: '#fff',
        confirmButtonColor: '#6366f1',
        timer: 2000,
        timerProgressBar: true,
      });
      
      toast.success(action === 'approve' ? `✅ ${email} is now staff!` : `Request rejected`);
      queryClient.invalidateQueries(['staff-requests']);
      queryClient.invalidateQueries(['staff-list']);
      queryClient.invalidateQueries(['citizens']);
    } catch (err) {
      // Dismiss loading toast
      toast.dismiss('staff-action-loading');
      
      // Show error message
      Swal.fire({
        title: 'Error',
        text: err?.response?.data?.message || `Failed to ${action} request`,
        icon: 'error',
        background: '#0d1117',
        color: '#fff',
        confirmButtonColor: '#6366f1',
      });
      
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const handleViewProfile = (user) => {
    // Create a user object from the request data
    const userForModal = {
      email: user.email,
      name: user.name,
      photo: user.photo,
      role: 'citizen', // They're still citizens until approved
      isPremium: false,
      isEmailVerified: false,
      isBlocked: false,
      createdAt: user.createdAt,
    };
    setSelectedUser(userForModal);
    setPendingAction(null);
  };

  const handleApproveFromProfile = async (user) => {
    // Find the request ID for this user
    const request = requests.find(r => r.email === user.email && r.status === 'pending');
    if (request) {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Approve Staff Request',
        html: `Are you sure you want to approve <strong>${user.name || user.email}</strong>'s request to become a staff member?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#34d399',
        cancelButtonColor: '#374151',
        confirmButtonText: 'Yes, Approve',
        cancelButtonText: 'Cancel',
        background: '#0d1117',
        color: '#fff',
      });

      if (!result.isConfirmed) return;

      setPendingAction('approve');
      
      // Show loading toast
      toast.loading('Approving staff request...', { id: 'profile-approve-loading' });
      
      try {
        await axiosSecure.patch(`/staff-requests/${request._id}`, { action: 'approve' });
        
        // Dismiss loading toast
        toast.dismiss('profile-approve-loading');
        
        // Show success message
        Swal.fire({
          title: 'Staff Member Added!',
          text: `${user.name || user.email} is now a staff member and can start handling issues.`,
          icon: 'success',
          background: '#0d1117',
          color: '#fff',
          confirmButtonColor: '#6366f1',
          timer: 2000,
          timerProgressBar: true,
        });
        
        toast.success(`✅ ${user.email} is now staff!`);
        queryClient.invalidateQueries(['staff-requests']);
        queryClient.invalidateQueries(['staff-list']);
        queryClient.invalidateQueries(['citizens']);
        setSelectedUser(null);
      } catch (err) {
        // Dismiss loading toast
        toast.dismiss('profile-approve-loading');
        
        // Show error message
        Swal.fire({
          title: 'Error',
          text: err?.response?.data?.message || 'Failed to approve request',
          icon: 'error',
          background: '#0d1117',
          color: '#fff',
          confirmButtonColor: '#6366f1',
        });
        
        toast.error(err?.response?.data?.message || 'Failed to approve');
      } finally {
        setPendingAction(null);
      }
    }
  };

  const handleRejectFromProfile = async (user) => {
    const request = requests.find(r => r.email === user.email && r.status === 'pending');
    if (request) {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Reject Staff Request',
        html: `Are you sure you want to reject <strong>${user.name || user.email}</strong>'s request to become a staff member?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f87171',
        cancelButtonColor: '#374151',
        confirmButtonText: 'Yes, Reject',
        cancelButtonText: 'Cancel',
        background: '#0d1117',
        color: '#fff',
      });

      if (!result.isConfirmed) return;

      setPendingAction('reject');
      
      // Show loading toast
      toast.loading('Rejecting staff request...', { id: 'profile-reject-loading' });
      
      try {
        await axiosSecure.patch(`/staff-requests/${request._id}`, { action: 'reject' });
        
        // Dismiss loading toast
        toast.dismiss('profile-reject-loading');
        
        // Show success message
        Swal.fire({
          title: 'Request Rejected',
          text: `The staff request from ${user.name || user.email} has been rejected.`,
          icon: 'success',
          background: '#0d1117',
          color: '#fff',
          confirmButtonColor: '#6366f1',
          timer: 2000,
          timerProgressBar: true,
        });
        
        toast.success(`Request from ${user.email} rejected`);
        queryClient.invalidateQueries(['staff-requests']);
        queryClient.invalidateQueries(['staff-list']);
        queryClient.invalidateQueries(['citizens']);
        setSelectedUser(null);
      } catch (err) {
        // Dismiss loading toast
        toast.dismiss('profile-reject-loading');
        
        // Show error message
        Swal.fire({
          title: 'Error',
          text: err?.response?.data?.message || 'Failed to reject request',
          icon: 'error',
          background: '#0d1117',
          color: '#fff',
          confirmButtonColor: '#6366f1',
        });
        
        toast.error(err?.response?.data?.message || 'Failed to reject');
      } finally {
        setPendingAction(null);
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Staff Requests</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>
          Citizens requesting to become staff members
        </p>
      </div>

      {/* Info banner */}
      <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
        <p style={{ color: '#94a3b8', fontSize: '0.83rem', margin: 0 }}>
          Click <strong style={{ color: '#818cf8' }}>"View Profile"</strong> to see user details before approving or rejecting.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['pending', 'approved', 'rejected'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '0.5rem 1.1rem', borderRadius: '10px',
              background: tab === t ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
              border: tab === t ? 'none' : '1px solid rgba(255,255,255,0.1)',
              color: tab === t ? '#fff' : '#94a3b8',
              fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {t} ({requests.length})
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <div style={{ ...glassCard, textAlign: 'center', padding: '3rem', color: '#475569' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
            {tab === 'pending' ? '📬' : tab === 'approved' ? '✅' : '❌'}
          </div>
          No {tab} requests
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {requests.map(req => (
            <div 
              key={req._id} 
              style={{ 
                ...glassCard, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                flexWrap: 'wrap', 
                gap: '1rem', 
                padding: '1rem 1.25rem',
                transition: 'all 0.2s',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 2, minWidth: 200 }}>
                <div 
                  style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '1.2rem', 
                    color: '#fff', 
                    fontWeight: 700, 
                    flexShrink: 0, 
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleViewProfile(req)}
                  title="Click to view full profile"
                >
                  {req.photo ? (
                    <img src={req.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    (req.name || req.email || '?')[0]?.toUpperCase()
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.95rem' }}>
                      {req.name || 'Citizen'}
                    </div>
                    {tab === 'pending' && (
                      <button
                        onClick={() => handleViewProfile(req)}
                        style={{
                          background: 'rgba(99,102,241,0.12)',
                          border: '1px solid rgba(99,102,241,0.3)',
                          borderRadius: '6px',
                          padding: '0.2rem 0.6rem',
                          color: '#818cf8',
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        👁️ View Profile
                      </button>
                    )}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{req.email}</div>
                  {req.reason && (
                    <div style={{ 
                      color: '#94a3b8', 
                      fontSize: '0.8rem', 
                      marginTop: '0.25rem', 
                      maxWidth: 360,
                      background: 'rgba(255,255,255,0.03)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      borderLeft: '2px solid #818cf8',
                    }}>
                      💬 "{req.reason.length > 100 ? req.reason.substring(0, 100) + '...' : req.reason}"
                    </div>
                  )}
                  <div style={{ color: '#475569', fontSize: '0.7rem', marginTop: '0.15rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>🗓️ Submitted: {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}</span>
                    {req.resolvedAt && (
                      <span>✅ Resolved: {new Date(req.resolvedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Status badge for non-pending */}
                {tab !== 'pending' && (
                  <span style={{
                    background: tab === 'approved' ? 'rgba(52,211,153,0.12)' : 'rgba(244,114,182,0.12)',
                    border: `1px solid ${tab === 'approved' ? 'rgba(52,211,153,0.3)' : 'rgba(244,114,182,0.3)'}`,
                    color: tab === 'approved' ? '#34d399' : '#f472b6',
                    borderRadius: '8px', padding: '0.4rem 0.85rem',
                    fontWeight: 700, fontSize: '0.78rem',
                  }}>
                    {tab === 'approved' ? '✅ Approved' : '❌ Rejected'}
                  </span>
                )}

                {/* Action buttons for pending */}
                {tab === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleAction(req._id, 'approve', req.email, req.name)}
                      style={{ ...successBtn, fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleAction(req._id, 'reject', req.email, req.name)}
                      style={{ ...dangerBtn, fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Profile Modal with Action Buttons */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          customActions={
            tab === 'pending' ? (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', width: '100%' }}>
                <button
                  onClick={() => handleApproveFromProfile(selectedUser)}
                  disabled={pendingAction === 'approve'}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.7rem',
                    color: '#fff',
                    cursor: pendingAction === 'approve' ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    opacity: pendingAction === 'approve' ? 0.6 : 1,
                  }}
                >
                  {pendingAction === 'approve' ? 'Approving...' : '✅ Approve Request'}
                </button>
                <button
                  onClick={() => handleRejectFromProfile(selectedUser)}
                  disabled={pendingAction === 'reject'}
                  style={{
                    flex: 1,
                    background: 'rgba(239,68,68,0.85)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.7rem',
                    color: '#fff',
                    cursor: pendingAction === 'reject' ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    opacity: pendingAction === 'reject' ? 0.6 : 1,
                  }}
                >
                  {pendingAction === 'reject' ? 'Rejecting...' : '✕ Reject Request'}
                </button>
              </div>
            ) : null
          }
        />
      )}
    </div>
  );
};

export default AdminStaffRequests;