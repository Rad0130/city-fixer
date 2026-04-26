import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from './components/Loading';
import { glassCard, pageBtn } from './components/styles';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AdminPayments = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Check screen size for responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments', page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?limit=20&skip=${page * 20}`);
      return res.data;
    },
  });

  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Function to copy transaction ID
  const copyToClipboard = (text, label) => {
    if (text && text !== '—') {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ color: '#f1f5f9', fontSize: 'clamp(1.5rem, 5vw, 1.75rem)', fontWeight: 700, margin: 0 }}>Payments</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>Revenue & transaction history</p>
      </div>

      {/* Summary Cards - Responsive Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
        gap: '1rem' 
      }}>
        <div style={{ ...glassCard, textAlign: 'center', background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)' }}>
          <div style={{ color: '#fb923c', fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', fontWeight: 800 }}>৳{total.toFixed(0)}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.3rem' }}>Revenue</div>
        </div>
        <div style={{ ...glassCard, textAlign: 'center', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <div style={{ color: '#34d399', fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', fontWeight: 800 }}>{payments.length}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.3rem' }}>Transactions</div>
        </div>
        <div style={{ ...glassCard, textAlign: 'center', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div style={{ color: '#818cf8', fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', fontWeight: 800 }}>
            ৳{payments.length ? Math.round(total / payments.length) : 0}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.3rem' }}>Average</div>
        </div>
      </div>

      {/* Payments List - Responsive Cards for Mobile, Table for Desktop */}
      {payments.length === 0 ? (
        <div style={{ ...glassCard, textAlign: 'center', padding: '3rem', color: '#475569' }}>
          No payments yet
        </div>
      ) : isMobile ? (
        // ========== MOBILE VIEW - Card Layout ==========
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {payments.map((p, i) => (
            <div 
              key={i} 
              style={{ 
                ...glassCard, 
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: selectedPayment === i ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.08)',
              }}
              onClick={() => setSelectedPayment(selectedPayment === i ? null : i)}
            >
              {/* Header: Avatar, Name, Amount */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', color: '#fff', fontWeight: 700, overflow: 'hidden',
                }}>
                  {p.userPhoto
                    ? <img src={p.userPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (p.userName || p.email || '?')[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' }}>
                    {p.userName || 'Unknown User'}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem' }}>
                    {p.email || p.paidByEmail || '—'}
                  </div>
                </div>
                <div style={{ color: '#34d399', fontWeight: 700, fontSize: '1.1rem' }}>৳{p.amount}</div>
              </div>
              
              {/* Transaction ID - Always Visible (Truncated) */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.5rem 0',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600 }}>🔗 Transaction ID:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    color: '#94a3b8', 
                    fontSize: '0.7rem', 
                    fontFamily: 'monospace',
                    maxWidth: '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {p.transactionId ? p.transactionId.substring(0, 16) + '...' : (p._id?.toString().substring(0, 16) + '...' || '—')}
                  </span>
                  {(p.transactionId || p._id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(p.transactionId || p._id?.toString(), 'Transaction ID');
                      }}
                      style={{
                        background: 'rgba(99,102,241,0.15)',
                        border: '1px solid rgba(99,102,241,0.3)',
                        borderRadius: '4px',
                        padding: '0.2rem 0.4rem',
                        color: '#818cf8',
                        fontSize: '0.65rem',
                        cursor: 'pointer',
                      }}
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>
              
              {/* Row 2: Purpose and Date */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{
                  display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '6px',
                  fontSize: '0.7rem', fontWeight: 600,
                  background: p.type === 'premium' ? 'rgba(251,146,60,0.12)' : 'rgba(99,102,241,0.12)',
                  color: p.type === 'premium' ? '#fb923c' : '#818cf8',
                }}>
                  {p.purpose || p.type || 'Boost'}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
                  📅 {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                </span>
              </div>
              
              {/* Expand/Collapse Indicator */}
              <div style={{ 
                textAlign: 'center', 
                paddingTop: '0.5rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                color: '#64748b',
                fontSize: '0.7rem',
              }}>
                {selectedPayment === i ? '▲ Tap to collapse' : '▼ Tap for more details'}
              </div>
              
              {/* Expanded details - Full Transaction ID and more info */}
              {selectedPayment === i && (
                <div style={{ 
                  marginTop: '0.75rem', 
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  padding: '0.75rem'
                }}>
                  {/* Full Transaction ID */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ color: '#818cf8', fontSize: '0.7rem', fontWeight: 600 }}>🔗 Full Transaction ID:</span>
                      {(p.transactionId || p._id) && (
                        <button
                          onClick={() => copyToClipboard(p.transactionId || p._id?.toString(), 'Transaction ID')}
                          style={{
                            background: 'rgba(99,102,241,0.15)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            borderRadius: '6px',
                            padding: '0.2rem 0.6rem',
                            color: '#818cf8',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                          }}
                        >
                          📋 Copy
                        </button>
                      )}
                    </div>
                    <div style={{ 
                      color: '#94a3b8', 
                      fontSize: '0.7rem', 
                      fontFamily: 'monospace', 
                      wordBreak: 'break-all',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      marginTop: '0.3rem',
                    }}>
                      {p.transactionId || p._id?.toString() || '—'}
                    </div>
                  </div>
                  
                  {/* Additional Details */}
                  {p.purpose && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: '#64748b', fontSize: '0.7rem' }}>📝 Purpose:</span>
                      <div style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>{p.purpose}</div>
                    </div>
                  )}
                  
                  {/* Stripe Session ID if available */}
                  {p.stripeSessionId && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <span style={{ color: '#64748b', fontSize: '0.7rem' }}>💳 Session ID:</span>
                        <button
                          onClick={() => copyToClipboard(p.stripeSessionId, 'Session ID')}
                          style={{
                            background: 'rgba(99,102,241,0.15)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            borderRadius: '4px',
                            padding: '0.2rem 0.4rem',
                            color: '#818cf8',
                            fontSize: '0.65rem',
                            cursor: 'pointer',
                          }}
                        >
                          Copy
                        </button>
                      </div>
                      <div style={{ 
                        color: '#94a3b8', 
                        fontSize: '0.65rem', 
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                        background: 'rgba(0,0,0,0.2)',
                        padding: '0.4rem',
                        borderRadius: '4px',
                      }}>
                        {p.stripeSessionId}
                      </div>
                    </div>
                  )}
                  
                  {/* User Email (if not shown elsewhere) */}
                  {p.email && p.email !== (p.userName || '') && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: '#64748b', fontSize: '0.7rem' }}>📧 User Email:</span>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{p.email}</div>
                    </div>
                  )}
                  
                  {/* Timestamp with time */}
                  {p.createdAt && (
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.7rem' }}>🕐 Full Date & Time:</span>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                        {new Date(p.createdAt).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // ========== DESKTOP VIEW - Table Layout ==========
        <div style={{ ...glassCard, overflowX: 'auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.8fr 1fr 90px 100px',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '0.25rem',
            minWidth: '650px',
          }}>
            {['User', 'Transaction ID', 'Purpose', 'Amount', 'Date'].map(h => (
              <div key={h} style={{ color: '#64748b', fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
            ))}
          </div>

          {payments.map((p, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.8fr 1fr 90px 100px',
              gap: '0.5rem',
              padding: '0.7rem 0.75rem',
              borderRadius: '8px',
              background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
              alignItems: 'center',
              minWidth: '650px',
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

              {/* Transaction ID with copy button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                <div style={{ 
                  color: '#64748b', 
                  fontSize: '0.75rem', 
                  fontFamily: 'monospace', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}>
                  {p.transactionId || p._id?.toString() || '—'}
                </div>
                {(p.transactionId || p._id) && (
                  <button
                    onClick={() => copyToClipboard(p.transactionId || p._id?.toString(), 'Transaction ID')}
                    style={{
                      background: 'rgba(99,102,241,0.15)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      borderRadius: '4px',
                      padding: '0.2rem 0.4rem',
                      color: '#818cf8',
                      fontSize: '0.65rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    title="Copy Transaction ID"
                  >
                    Copy
                  </button>
                )}
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
      )}

      {/* Pagination - Responsive */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        <button 
          onClick={() => setPage(p => Math.max(0, p - 1))} 
          disabled={page === 0} 
          style={{ ...pageBtn, minWidth: '80px' }}
        >
          ← Prev
        </button>
        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Page {page + 1}</span>
        <button 
          onClick={() => setPage(p => p + 1)} 
          disabled={payments.length < 20} 
          style={{ ...pageBtn, minWidth: '80px' }}
        >
          Next →
        </button>
      </div>

      {/* Mobile Hint */}
      {isMobile && payments.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '0.5rem',
          marginTop: '0.5rem',
        }}>
          <span style={{ 
            background: 'rgba(99,102,241,0.1)', 
            padding: '0.3rem 0.8rem', 
            borderRadius: '20px',
            color: '#64748b',
            fontSize: '0.7rem',
          }}>
            💡 Tap on a payment to see full transaction details
          </span>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;