// src/pages/Dashboard/Citizen/CitizenMyPayments.jsx

import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from './components/Loading';
import { glassCard, pageBtn } from './components/styles';
import { useState } from 'react';

const CitizenMyPayments = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(0);

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['my-payments', page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/my?limit=10&skip=${page * 10}`);
      return res.data;
    },
  });

  const uniquePayments=[];

  payments.forEach(payment => {
    if (!uniquePayments.some(p => p.transactionId === payment.transactionId)) {
      uniquePayments.push(payment);
    }
  });

  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (isLoading) return <Loading />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>My Payments</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>Your payment history</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        <div style={{ ...glassCard, textAlign: 'center', background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)' }}>
          <div style={{ color: '#fb923c', fontSize: '1.6rem', fontWeight: 800 }}>৳{total.toFixed(0)}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.3rem' }}>Total Paid</div>
        </div>
        <div style={{ ...glassCard, textAlign: 'center', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div style={{ color: '#818cf8', fontSize: '1.6rem', fontWeight: 800 }}>{payments.length}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.3rem' }}>Transactions</div>
        </div>
      </div>

      {payments.length === 0 ? (
        <div style={{ ...glassCard, textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💳</div>
          <div style={{ color: '#475569' }}>No payments yet</div>
        </div>
      ) : (
        <div style={glassCard}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 80px 100px', gap: '0.5rem', padding: '0.4rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.25rem' }}>
            {['Transaction ID', 'Purpose', 'Amount', 'Date'].map(h => (
              <div key={h} style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
            ))}
          </div>
          {payments.map((p, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 80px 100px', gap: '0.5rem', padding: '0.65rem 0.75rem', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderRadius: '8px', alignItems: 'center' }}>
              <div style={{ color: '#64748b', fontSize: '0.74rem', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.transactionId || p._id || '—'}
              </div>
              <div>
                <span style={{
                  display: 'inline-block', padding: '0.2rem 0.55rem', borderRadius: '6px',
                  fontSize: '0.72rem', fontWeight: 600,
                  background: p.type === 'premium' ? 'rgba(251,146,60,0.12)' : 'rgba(99,102,241,0.12)',
                  color: p.type === 'premium' ? '#fb923c' : '#818cf8',
                }}>
                  {p.purpose || p.type || 'Boost'}
                </span>
              </div>
              <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>৳{p.amount}</div>
              <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={pageBtn}>← Prev</button>
        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Page {page + 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={payments.length < 10} style={pageBtn}>Next →</button>
      </div>
    </div>
  );
};

export default CitizenMyPayments;