import React, { useState, useEffect } from 'react';
import { Link, Outlet, NavLink, useNavigate } from 'react-router';
import useAuth from '../Hooks/useAuth';

const navItems = [
  { to: '/admin', label: 'Overview', icon: '📊', end: true },
  { to: '/admin/issues', label: 'All Issues', icon: '🔧' },
  { to: '/admin/users', label: 'Manage Users', icon: '👥' },
  { to: '/admin/staff', label: 'Manage Staff', icon: '🛠️' },
  { to: '/admin/staff-requests', label: 'Staff Requests', icon: '📬' },
  { to: '/admin/payments', label: 'Payments', icon: '💳' },
  { to: '/admin/profile', label: 'Profile', icon: '👤' },
];

const AdminDashboardLayout = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // Auto-open sidebar on desktop
      } else {
        setSidebarOpen(false); // Auto-close sidebar on mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await logOut(); navigate('/login'); } finally { setLoggingOut(false); }
  };

  // Sidebar styles based on device
  const sidebarStyles = {
    position: isMobile ? 'fixed' : 'sticky',
    top: 0,
    left: 0,
    bottom: 0,
    width: 260,
    background: '#0d1120',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: '100vh',
    overflowY: 'auto',
    zIndex: 1000,
    transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
    transition: 'transform 0.3s ease-in-out',
    boxShadow: isMobile && sidebarOpen ? '0 0 20px rgba(0,0,0,0.5)' : 'none',
  };

  // Overlay for mobile
  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 999,
    display: isMobile && sidebarOpen ? 'block' : 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080c18', fontFamily: 'system-ui, sans-serif' }}>

      {/* Mobile Overlay */}
      <div onClick={() => setSidebarOpen(false)} style={overlayStyles} />

      {/* Sidebar */}
      <aside style={sidebarStyles}>

        {/* Mobile Close Button */}
        {isMobile && sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              width: 32,
              height: 32,
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
            }}
          >
            ✕
          </button>
        )}

        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🏙️</div>
            <span style={{ color: '#e2e8f0', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>
              CityFix <span style={{ color: '#818cf8' }}>Admin</span>
            </span>
          </Link>
        </div>

        {/* User */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', color: '#fff', fontWeight: 700, flexShrink: 0, overflow: 'hidden' }}>
              {user?.photoURL ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user?.displayName || user?.email)?.[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.displayName || 'Admin'}</div>
              <div style={{ color: '#475569', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
          </div>
          <div style={{ marginTop: '0.6rem' }}>
            <span style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '6px', padding: '0.2rem 0.65rem', fontSize: '0.68rem', fontWeight: 700, display: 'inline-block' }}>
              🔑 ADMIN
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '0.75rem', flex: 1 }}>
          <div style={{ color: '#374151', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.5rem', marginBottom: '0.4rem' }}>Navigation</div>
          {navItems.map(item => (
            <NavLink
              key={item.to} 
              to={item.to} 
              end={item.end}
              onClick={() => isMobile && setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.7rem',
                padding: '0.65rem 0.85rem', borderRadius: '10px', marginBottom: '0.2rem',
                textDecoration: 'none', fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#818cf8' : '#94a3b8',
                background: isActive ? 'rgba(129,140,248,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(129,140,248,0.2)' : '1px solid transparent',
                transition: 'all 0.15s',
              })}
            >
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout} disabled={loggingOut} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.65rem 0.85rem', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', opacity: loggingOut ? 0.6 : 1 }}>
            <span>🚪</span>{loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%' }}>
        {/* Header - Now with Mobile Menu Button */}
        <header style={{ 
          background: 'rgba(13,17,32,0.8)', 
          borderBottom: '1px solid rgba(255,255,255,0.06)', 
          padding: '0.85rem 1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          backdropFilter: 'blur(12px)', 
          position: 'sticky', 
          top: 0, 
          zIndex: 10,
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              display: isMobile ? 'flex' : 'none',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '1.2rem',
            }}
          >
            ☰
          </button>
          
          <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.95rem' }}>Admin Dashboard</div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
            <Link to="/allissues" style={{ color: '#64748b', fontSize: '0.82rem', textDecoration: 'none' }}>Public View</Link>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#fff', fontWeight: 700, overflow: 'hidden', flexShrink: 0 }}>
              {user?.photoURL ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user?.displayName || user?.email)?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <main style={{ 
          flex: 1, 
          padding: 'clamp(1rem, 3vw, 2rem)', 
          overflowY: 'auto',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <Outlet />
        </main>
      </div>

      {/* Global styles for responsive design */}
      <style>{`
        @media (max-width: 768px) {
          body {
            overflow-x: hidden;
          }
        }
        
        /* Better scrollbar for sidebar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardLayout;