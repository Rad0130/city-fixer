const Loading = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    flexDirection: 'column',
    gap: '1rem',
  }}>
    <div style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: '3px solid rgba(99,102,241,0.2)',
      borderTopColor: '#6366f1',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Loading...</span>
  </div>
);

export default Loading;