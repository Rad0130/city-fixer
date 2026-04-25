// src/pages/Dashboard/Admin/AdminPayments.jsx

import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from './components/Loading';
import { glassCard, pageBtn } from './components/styles';
import { useState } from 'react';

const AdminPayments = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(0);

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments', page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?limit=20&skip=${page * 20}`);
      return res.data;
    },
  });

  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (isLoading) return <Loading />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Payments</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>Revenue & transaction history</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        <div style={{ ...glassCard, textAlign: 'center', background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)' }}>
          <div style={{ color: '#fb923c', fontSize: '1.6rem', fontWeight: 800 }}>৳{total.toFixed(0)}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.3rem' }}>Revenue (this page)</div>
        </div>
        <div style={{ ...glassCard, textAlign: 'center', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <div style={{ color: '#34d399', fontSize: '1.6rem', fontWeight: 800 }}>{payments.length}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.3rem' }}>Transactions</div>
        </div>
        <div style={{ ...glassCard, textAlign: 'center', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div style={{ color: '#818cf8', fontSize: '1.6rem', fontWeight: 800 }}>
            ৳{payments.length ? Math.round(total / payments.length) : 0}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.3rem' }}>Avg. Transaction</div>
        </div>
      </div>

      {/* Table */}
      <div style={glassCard}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 90px 100px',
          gap: '0.5rem', padding: '0.5rem 0.75rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.25rem',
        }}>
          {['User', 'Transaction ID', 'Purpose', 'Amount', 'Date'].map(h => (
            <div key={h} style={{ color: '#64748b', fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
          ))}
        </div>

        {payments.length === 0 ? (
          <div style={{ color: '#475569', textAlign: 'center', padding: '2rem 0' }}>No payments yet</div>
        ) : payments.map((p, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 90px 100px',
            gap: '0.5rem', padding: '0.7rem 0.75rem', borderRadius: '8px',
            background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
            alignItems: 'center',
          }}>
            {/* User with avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', color: '#fff', fontWeight: 700, overflow: 'hidden',
              }}>
                {p.userPhoto
                  ? <img src={p.userPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (p.userName || p.email || '?')[0]?.toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.userName || 'Unknown User'}
                </div>
                <div style={{ color: '#475569', fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.email || p.paidByEmail || '—'}
                </div>
              </div>
            </div>

            <div style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.transactionId || p._id?.toString() || '—'}
            </div>

            <div>
              <span style={{
                display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '6px',
                fontSize: '0.72rem', fontWeight: 600,
                background: p.type === 'premium' ? 'rgba(251,146,60,0.12)' : 'rgba(99,102,241,0.12)',
                color: p.type === 'premium' ? '#fb923c' : '#818cf8',
                border: `1px solid ${p.type === 'premium' ? 'rgba(251,146,60,0.25)' : 'rgba(99,102,241,0.25)'}`,
              }}>
                {p.purpose || p.type || 'Boost'}
              </span>
            </div>

            <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>৳{p.amount}</div>

            <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
              {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={pageBtn}>← Prev</button>
        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Page {page + 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={payments.length < 20} style={pageBtn}>Next →</button>
      </div>
    </div>
  );
};

export default AdminPayments;