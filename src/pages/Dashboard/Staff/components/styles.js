export const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '1.5rem',
  backdropFilter: 'blur(12px)',
  color: '#e2e8f0',
};

export const inputStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  padding: '0.6rem 1rem',
  color: '#e2e8f0',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
  marginBottom: '0.75rem',
  boxSizing: 'border-box',
};

export const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
};

export const labelStyle = {
  color: '#94a3b8',
  fontSize: '0.8rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  display: 'block',
  marginBottom: '0.4rem',
};

export const primaryBtn = {
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  border: 'none',
  borderRadius: '10px',
  padding: '0.6rem 1.4rem',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.875rem',
  cursor: 'pointer',
};

export const dangerBtn = {
  background: 'rgba(239,68,68,0.15)',
  border: '1px solid rgba(239,68,68,0.3)',
  borderRadius: '8px',
  padding: '0.45rem 1rem',
  color: '#f87171',
  fontWeight: 600,
  fontSize: '0.8rem',
  cursor: 'pointer',
};

export const successBtn = {
  background: 'rgba(52,211,153,0.15)',
  border: '1px solid rgba(52,211,153,0.3)',
  borderRadius: '8px',
  padding: '0.45rem 1rem',
  color: '#34d399',
  fontWeight: 600,
  fontSize: '0.8rem',
  cursor: 'pointer',
};

export const pageBtn = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  padding: '0.4rem 0.9rem',
  color: '#cbd5e1',
  cursor: 'pointer',
  fontSize: '0.85rem',
};

export const statusColors = {
  Pending: '#fbbf24',
  'In Progress': '#22d3ee',
  Resolved: '#34d399',
  Rejected: '#f472b6',
  Closed: '#94a3b8',
  Open: '#818cf8',
};

export const statusBadge = (status) => ({
  display: 'inline-block',
  padding: '0.25rem 0.75rem',
  borderRadius: '999px',
  fontSize: '0.75rem',
  fontWeight: 700,
  background: `${statusColors[status] || '#94a3b8'}22`,
  color: statusColors[status] || '#94a3b8',
  border: `1px solid ${statusColors[status] || '#94a3b8'}44`,
});