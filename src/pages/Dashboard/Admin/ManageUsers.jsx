import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from './components/Loading';
import { glassCard, inputStyle, dangerBtn, pageBtn } from './components/styles';
import UserProfileModal from '../../../components/UserProfileModal/UserProfileModal';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [filterSearch, setFilterSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [verifyingEmail, setVerifyingEmail] = useState(null); // Track which email is being verified

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['citizens', page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/citizens?limit=20&skip=${page * 20}`);
      return res.data;
    },
  });

  const handleVerify = async (email, name, currentlyVerified) => {
    const actionText = currentlyVerified ? 'Remove Verification' : 'Verify Email';
    const confirmText = currentlyVerified 
      ? `Are you sure you want to remove email verification from ${name || email}?`
      : `Are you sure you want to verify ${name || email}'s email address?`;
    
    // Show confirmation dialog
    const result = await Swal.fire({
      title: actionText,
      text: confirmText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: currentlyVerified ? '#f87171' : '#34d399',
      cancelButtonColor: '#374151',
      confirmButtonText: currentlyVerified ? 'Yes, Remove' : 'Yes, Verify',
      cancelButtonText: 'Cancel',
      background: '#0d1117',
      color: '#fff',
    });

    if (!result.isConfirmed) return;
    
    // Set loading state for this specific user
    setVerifyingEmail(email);
    
    // Show loading toast
    toast.loading(currentlyVerified ? 'Removing verification...' : 'Verifying email...', {
      id: 'verify-loading',
    });
    
    try {
      await axiosSecure.patch(`/users/${email}/verify`, { isEmailVerified: !currentlyVerified });
      
      // Dismiss loading toast
      toast.dismiss('verify-loading');
      
      // Show success message
      Swal.fire({
        title: currentlyVerified ? 'Verification Removed' : 'Email Verified!',
        text: currentlyVerified 
          ? `${name || email}'s email is no longer verified`
          : `${name || email}'s email has been verified successfully`,
        icon: 'success',
        background: '#0d1117',
        color: '#fff',
        confirmButtonColor: '#6366f1',
        timer: 2000,
        timerProgressBar: true,
      });
      
      toast.success(currentlyVerified ? 'Verification removed' : `${name || email} verified ✅`);
      queryClient.invalidateQueries(['citizens']);
    } catch (err) {
      // Dismiss loading toast
      toast.dismiss('verify-loading');
      
      // Show error message
      Swal.fire({
        title: 'Error',
        text: err?.response?.data?.message || 'Failed to update verification status',
        icon: 'error',
        background: '#0d1117',
        color: '#fff',
        confirmButtonColor: '#6366f1',
      });
      
      toast.error(err?.response?.data?.message || 'Failed');
    } finally {
      setVerifyingEmail(null); // Clear loading state
    }
  };

  const handleBan = async (email, name) => {
    const result = await Swal.fire({
      title: 'Ban User',
      text: `Are you sure you want to ban ${name || email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f87171',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, Ban',
      cancelButtonText: 'Cancel',
      background: '#0d1117',
      color: '#fff',
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch('/users/ban', { email });
      toast.success(`${name || email} banned`);
      queryClient.invalidateQueries(['citizens']);
    } catch (err) {
      console.log(err);
      toast.error('Failed to ban');
    }
  };

  const handleUnban = async (email, name) => {
    const result = await Swal.fire({
      title: 'Unban User',
      text: `Are you sure you want to unban ${name || email}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#34d399',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, Unban',
      cancelButtonText: 'Cancel',
      background: '#0d1117',
      color: '#fff',
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch(`/users/${email}/block`, { isBlocked: false });
      toast.success(`${name || email} unbanned`);
      queryClient.invalidateQueries(['citizens']);
    } catch {
      toast.error('Failed to unban');
    }
  };

  const handlePromoteToStaff = async (user) => {
    const result = await Swal.fire({
      title: 'Promote to Staff',
      text: `Are you sure you want to promote ${user.name || user.email} to staff?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#34d399',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, Promote',
      cancelButtonText: 'Cancel',
      background: '#0d1117',
      color: '#fff',
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch('/users/role', { email: user.email, role: 'staff' });
      toast.success(`${user.name || user.email} is now a staff member!`);
      queryClient.invalidateQueries(['citizens']);
      queryClient.invalidateQueries(['staff-list']);
    } catch (err) {
      console.log(err);
      toast.error('Failed to promote user');
    }
  };

  const filtered = users.filter(u =>
    !filterSearch || (u.name || u.email || '').toLowerCase().includes(filterSearch.toLowerCase())
  );

  if (isLoading) return <Loading />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Manage Users</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>{users.length} registered citizens</p>
      </div>

      {/* Info banner */}
      <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
        <p style={{ color: '#94a3b8', fontSize: '0.83rem', margin: 0 }}>
          Click <strong style={{ color: '#818cf8' }}>"View Profile"</strong> to see full user details and promote to staff.
        </p>
      </div>

      <input 
        value={filterSearch} 
        onChange={e => setFilterSearch(e.target.value)} 
        placeholder="🔍  Search by name or email..." 
        style={{ ...inputStyle, marginBottom: 0, maxWidth: 360 }} 
      />

      {filtered.length === 0 ? (
        <div style={{ ...glassCard, textAlign: 'center', padding: '3rem', color: '#475569' }}>No users found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filtered.map(u => (
            <div key={u.email} style={{ ...glassCard, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', padding: '0.9rem 1.25rem', opacity: u.isBlocked ? 0.6 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#fff', fontWeight: 700, flexShrink: 0, overflow: 'hidden' }}>
                  {u.photo ? <img src={u.photo} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} /> : (u.name || u.email || '?')[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {u.name || 'Citizen'}
                    {u.isBlocked && <span style={{ color: '#f87171', fontSize: '0.72rem' }}>🚫 Banned</span>}
                    {u.isEmailVerified && <span style={{ color: '#34d399', fontSize: '0.72rem' }}>✅ Verified</span>}
                    {u.isPremium && <span style={{ color: '#fb923c', fontSize: '0.72rem' }}>⭐ Premium</span>}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{u.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '6px', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 600 }}>
                  {u.issueCount || 0} issues
                </span>
                <button
                  onClick={() => setSelectedUser(u)}
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
                  onClick={() => handleVerify(u.email, u.name, u.isEmailVerified)}
                  disabled={verifyingEmail === u.email}
                  style={{ 
                    background: u.isEmailVerified ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)', 
                    border: `1px solid ${u.isEmailVerified ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.12)'}`, 
                    borderRadius: '8px', 
                    padding: '0.4rem 0.85rem', 
                    color: u.isEmailVerified ? '#34d399' : '#94a3b8', 
                    fontWeight: 600, 
                    fontSize: '0.78rem', 
                    cursor: verifyingEmail === u.email ? 'wait' : 'pointer',
                    opacity: verifyingEmail === u.email ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  {verifyingEmail === u.email ? (
                    <>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid currentColor',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite',
                      }} />
                      {u.isEmailVerified ? 'Removing...' : 'Verifying...'}
                    </>
                  ) : (
                    u.isEmailVerified ? '✅ Verified' : 'Verify Email'
                  )}
                </button>
                {u.isBlocked ? (
                  <button onClick={() => handleUnban(u.email, u.name)} style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '8px', padding: '0.4rem 0.85rem', color: '#34d399', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
                    Unban
                  </button>
                ) : (
                  <button onClick={() => handleBan(u.email, u.name)} style={{ ...dangerBtn, fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}>Ban</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={pageBtn}>← Prev</button>
        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Page {page + 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={users.length < 20} style={pageBtn}>Next →</button>
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onPromoteToStaff={handlePromoteToStaff}
        />
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;