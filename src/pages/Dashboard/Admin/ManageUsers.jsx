import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from './components/Loading';
import { glassCard, inputStyle, dangerBtn, pageBtn } from './components/styles';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [filterSearch, setFilterSearch] = useState('');
  const [page, setPage] = useState(0);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['citizens', page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/citizens?limit=20&skip=${page * 20}`);
      return res.data;
    },
  });

  const handleVerify = async (email, name, currentlyVerified) => {
    const action = currentlyVerified ? 'Remove verification from' : 'Verify email for';
    if (!window.confirm(`${action} ${name || email}?`)) return;
    try {
      await axiosSecure.patch(`/users/${email}/verify`, { isEmailVerified: !currentlyVerified });
      toast.success(currentlyVerified ? 'Verification removed' : `${name || email} verified ✅`);
      queryClient.invalidateQueries(['citizens']);
      
      // Also refresh the current user's data if it's the logged-in user
      // const { data: currentUser } = await axiosSecure.get('/users/me');
      // // You might want to update the user context here if needed
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };
  

  const handleBan = async (email, name) => {
    if (!window.confirm(`Ban ${name || email}?`)) return;
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
    try {
      await axiosSecure.patch(`/users/${email}/block`, { isBlocked: false });
      toast.success(`${name || email} unbanned`);
      queryClient.invalidateQueries(['citizens']);
    } catch {
      toast.error('Failed to unban');
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
          To promote a citizen to staff, approve their request from the <strong style={{ color: '#818cf8' }}>Staff Requests</strong> tab. Citizens must apply to become staff.
        </p>
      </div>

      <input value={filterSearch} onChange={e => setFilterSearch(e.target.value)} placeholder="🔍  Search by name or email..." style={{ ...inputStyle, marginBottom: 0, maxWidth: 360 }} />

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
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{u.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {u.isPremium && (
                  <span style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.3)', color: '#fb923c', borderRadius: '6px', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 700 }}>⭐ PREMIUM</span>
                )}
                <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '6px', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 600 }}>
                  {u.issueCount || 0} issues
                </span>
                <button
                  onClick={() => handleVerify(u.email, u.name, u.isEmailVerified)}
                  style={{ background: u.isEmailVerified ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${u.isEmailVerified ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.12)'}`, borderRadius: '8px', padding: '0.4rem 0.85rem', color: u.isEmailVerified ? '#34d399' : '#94a3b8', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  {u.isEmailVerified ? '✅ Verified' : 'Verify Email'}
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
    </div>
  );
};

export default ManageUsers;