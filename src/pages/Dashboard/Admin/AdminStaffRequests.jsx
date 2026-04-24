import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from './components/Loading';
import { glassCard, dangerBtn, successBtn } from './components/styles';
import toast from 'react-hot-toast';

const AdminStaffRequests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('pending'); // pending | approved | rejected

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['staff-requests', tab],
    queryFn: async () => {
      const res = await axiosSecure.get(`/staff-requests?status=${tab}`);
      return res.data;
    },
  });

  const handleAction = async (id, action, email) => {
    const label = action === 'approve' ? 'Approve' : 'Reject';
    if (!window.confirm(`${label} staff request from ${email}?`)) return;
    try {
      await axiosSecure.patch(`/staff-requests/${id}`, { action });
      toast.success(action === 'approve' ? `✅ ${email} is now staff!` : `Request rejected`);
      queryClient.invalidateQueries(['staff-requests']);
      queryClient.invalidateQueries(['staff-list']);
      queryClient.invalidateQueries(['citizens']);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
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
            {t}
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
            <div key={req._id} style={{ ...glassCard, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#fff', fontWeight: 700, flexShrink: 0, overflow: 'hidden' }}>
                  {req.photo ? <img src={req.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (req.name || req.email || '?')[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.95rem' }}>{req.name || 'Citizen'}</div>
                  <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{req.email}</div>
                  {req.reason && (
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem', maxWidth: 360 }}>
                      💬 "{req.reason}"
                    </div>
                  )}
                  <div style={{ color: '#475569', fontSize: '0.72rem', marginTop: '0.15rem' }}>
                    🗓️ {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
                  <>
                    <button
                      onClick={() => handleAction(req._id, 'approve', req.email)}
                      style={{ ...successBtn, fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleAction(req._id, 'reject', req.email)}
                      style={{ ...dangerBtn, fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                    >
                      ✕ Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminStaffRequests;