import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Link, NavLink, useNavigate } from 'react-router';
import useAuth from '../Hooks/useAuth';
import useRole from '../Hooks/useRole';

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { isAdmin, isStaff, roleLoading } = useRole();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check scroll position for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const getDashboardPath = () => {
    if (isAdmin) return '/admin';
    if (isStaff) return '/staff';
    return '/dashboard';
  };

  const handleLogOut = () => {
    logOut()
      .then(() => navigate('/login'))
      .catch((error) => console.log(error.message));
    setIsMobileMenuOpen(false);
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#818cf8' : 'rgba(255,255,255,0.7)',
    fontWeight: isActive ? 700 : 500,
    fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
    letterSpacing: '0.02em',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: 8,
    background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
    display: 'block',
    width: '100%',
    textAlign: 'center',
  });

  const links = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/allissues', label: 'All Issues', icon: '📋' },
    { to: '/aboutus', label: 'About Us', icon: 'ℹ️' },
    { to: '/howitworks', label: 'How It Works', icon: '⚙️' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: isScrolled 
        ? 'rgba(10,10,26,0.95)' 
        : 'rgba(10,10,26,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${isScrolled ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.07)'}`,
      padding: '0 clamp(0.75rem, 4vw, 2rem)',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'clamp(56px, 8vh, 70px)',
      }}>
        
        {/* Logo */}
        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'clamp(0.5rem, 2vw, 0.75rem)', 
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div style={{
            width: 'clamp(32px, 6vw, 40px)',
            height: 'clamp(32px, 6vw, 40px)',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99,102,241,0.5)',
            overflow: 'hidden',
          }}>
            <img src={logo} alt="CityFix" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(1rem, 5vw, 1.3rem)',
            background: 'linear-gradient(135deg, #fff 40%, #a5b4fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: isMobile && !isMobileMenuOpen ? 'none' : 'inline',
          }}>
            CityFix
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <ul style={{ 
            listStyle: 'none', 
            margin: 0, 
            padding: 0, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'clamp(0.25rem, 1.5vw, 0.75rem)',
            flex: 1,
            justifyContent: 'center',
          }}>
            {links.map(link => (
              <li key={link.to}>
                <NavLink to={link.to} style={navLinkStyle}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}

        {/* Right Section: Auth & Mobile Menu */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(0.5rem, 2vw, 1rem)',
        }}>
          
          {/* User Avatar / Auth Buttons */}
          {user ? (
            <div className="dropdown dropdown-end" style={{ position: 'relative' }}>
              <div 
                tabIndex={0} 
                role="button" 
                style={{
                  width: 'clamp(36px, 6vw, 42px)',
                  height: 'clamp(36px, 6vw, 42px)',
                  borderRadius: '50%',
                  border: '2px solid rgba(99,102,241,0.6)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(99,102,241,0.3)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=6366f1&color=fff`} 
                  alt={user.displayName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <ul tabIndex="-1" className="dropdown-content" style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'rgba(13,17,30,0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: '0.75rem',
                width: 'clamp(220px, 50vw, 260px)',
                marginTop: '0.5rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                listStyle: 'none',
                zIndex: 10000,
              }}>
                {/* User info */}
                <li style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '0.5rem' }}>
                  <div style={{ 
                    color: '#fff', 
                    fontWeight: 600, 
                    fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {user.displayName || 'User'}
                  </div>
                  <div style={{ 
                    color: 'rgba(255,255,255,0.4)', 
                    fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)', 
                    marginTop: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {user.email}
                  </div>
                  {!roleLoading && (
                    <div style={{
                      display: 'inline-block',
                      marginTop: '0.4rem',
                      background: isAdmin ? 'rgba(244,114,182,0.15)' : isStaff ? 'rgba(52,211,153,0.15)' : 'rgba(129,140,248,0.15)',
                      border: `1px solid ${isAdmin ? 'rgba(244,114,182,0.3)' : isStaff ? 'rgba(52,211,153,0.3)' : 'rgba(129,140,248,0.3)'}`,
                      borderRadius: 999,
                      padding: '0.15rem 0.6rem',
                      color: isAdmin ? '#f472b6' : isStaff ? '#34d399' : '#818cf8',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}>
                      {isAdmin ? '🛡️ Admin' : isStaff ? '🔧 Staff' : '👤 Citizen'}
                    </div>
                  )}
                </li>

                {/* Dashboard link */}
                <li style={{ marginBottom: '0.25rem' }}>
                  <Link 
                    to={getDashboardPath()} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 8,
                      color: 'rgba(255,255,255,0.75)',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>📊</span> Dashboard
                  </Link>
                </li>

                {/* Report issue (citizens only) */}
                {!isAdmin && !isStaff && (
                  <li style={{ marginBottom: '0.25rem' }}>
                    <Link 
                      to="/reportIssue" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 8,
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span>🚩</span> Report Issue
                    </Link>
                  </li>
                )}

                {/* Logout */}
                <li style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.5rem' }}>
                  <button 
                    onClick={handleLogOut} 
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 8,
                      background: 'rgba(236,72,153,0.15)',
                      border: '1px solid rgba(236,72,153,0.3)',
                      color: '#f472b6',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: "'DM Sans',sans-serif",
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(236,72,153,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(236,72,153,0.15)'}
                  >
                    <span>↩</span> Log Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link 
                to="/login" 
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: 'clamp(0.8rem, 3vw, 0.875rem)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  fontSize: 'clamp(0.8rem, 3vw, 0.875rem)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 0 20px rgba(99,102,241,0.4)',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu Button */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-container"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="rgba(255,255,255,0.9)"
                style={{ transform: isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="mobile-menu-container"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(13,17,30,0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: '1rem',
            animation: 'slideDown 0.3s ease',
            maxHeight: 'calc(100vh - 70px)',
            overflowY: 'auto',
          }}
        >
          <ul style={{ 
            listStyle: 'none', 
            margin: 0, 
            padding: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.5rem',
          }}>
            {links.map(link => (
              <li key={link.to}>
                <NavLink 
                  to={link.to} 
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 12,
                    background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                    color: isActive ? '#818cf8' : 'rgba(255,255,255,0.7)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  })}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 640px) {
          .dropdown-content {
            width: calc(100vw - 2rem) !important;
            right: -1rem !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;