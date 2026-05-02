import React from 'react';
import logo from '../assets/logo.png';
import { Link, NavLink, useNavigate } from 'react-router';
import useAuth from '../Hooks/useAuth';
import useRole from '../Hooks/useRole';
import NotificationBell from './Notifications/NotificationBell';

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { isAdmin, isStaff, roleLoading } = useRole();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (isAdmin) return '/admin';
    if (isStaff) return '/staff';
    return '/dashboard';
  };

  const handleLogOut = () => {
    logOut()
      .then(() => navigate('/login'))
      .catch((error) => console.log(error.message));
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#818cf8' : 'rgba(255,255,255,0.65)',
    fontWeight: isActive ? 700 : 500,
    fontSize: '0.9rem',
    letterSpacing: '0.02em',
    textDecoration: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: 8,
    background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  });

  const links = (
    <>
      <li><NavLink to="/" style={navLinkStyle}>Home</NavLink></li>
      <li><NavLink to="/allissues" style={navLinkStyle}>All Issues</NavLink></li>
      <li><NavLink to="/aboutus" style={navLinkStyle}>About Us</NavLink></li>
      <li><NavLink to="/howitworks" style={navLinkStyle}>How It Works</NavLink></li>
    </>
  );

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: 'rgba(10,10,26,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '0 clamp(1rem, 4vw, 4rem)',
    }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99,102,241,0.5)',
            overflow: 'hidden',
          }}>
            <img src={logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800, fontSize: '1.2rem',
            background: 'linear-gradient(135deg, #fff 40%, #a5b4fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            CityFix
          </span>
        </Link>

        {/* Desktop Links */}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} className="hidden lg:flex items-center gap-2">
          {links}
        </ul>

        {/* Right: Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              {/* Notification Bell */}
              <NotificationBell />
              
              <div className="dropdown dropdown-end" style={{ position: 'relative' }}>
                <div tabIndex={0} role="button" style={{
                  width: 40, height: 40, borderRadius: '50%',
                  border: '2px solid rgba(99,102,241,0.6)',
                  overflow: 'hidden', cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(99,102,241,0.3)',
                }}>
                  <img src={user.photoURL} alt={user.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <ul tabIndex="-1" className="dropdown-content" style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  background: 'rgba(13,17,30,0.97)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16, padding: '0.75rem',
                  width: 240, marginTop: '0.5rem',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  listStyle: 'none', zIndex: 9999,
                }}>
                  {/* User info */}
                  <li style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '0.5rem' }}>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{user.displayName}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: 2 }}>{user.email}</div>
                    {/* Role badge */}
                    {!roleLoading && (
                      <div style={{
                        display: 'inline-block', marginTop: '0.4rem',
                        background: isAdmin ? 'rgba(244,114,182,0.15)' : isStaff ? 'rgba(52,211,153,0.15)' : 'rgba(129,140,248,0.15)',
                        border: `1px solid ${isAdmin ? 'rgba(244,114,182,0.3)' : isStaff ? 'rgba(52,211,153,0.3)' : 'rgba(129,140,248,0.3)'}`,
                        borderRadius: 999, padding: '0.15rem 0.6rem',
                        color: isAdmin ? '#f472b6' : isStaff ? '#34d399' : '#818cf8',
                        fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                      }}>
                      {isAdmin ? '🛡️ Admin' : isStaff ? '🔧 Staff' : '👤 Citizen'}
                    </div>
                    )}
                  </li>

                  {/* Dashboard link */}
                  <li style={{ marginBottom: '0.25rem' }}>
                    <Link to={getDashboardPath()} style={{
                      display: 'block', padding: '0.5rem 0.75rem', borderRadius: 8,
                      color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}>
                      📊 Dashboard
                    </Link>
                  </li>

                  {/* Report issue (citizens only) */}
                  {!isAdmin && !isStaff && (
                    <li style={{ marginBottom: '0.25rem' }}>
                      <Link to="/reportIssue" style={{
                        display: 'block', padding: '0.5rem 0.75rem', borderRadius: 8,
                        color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem',
                        textDecoration: 'none',
                      }}>
                        🚩 Report Issue
                      </Link>
                    </li>
                  )}

                  {/* Logout */}
                  <li style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.5rem' }}>
                    <button onClick={handleLogOut} style={{
                      width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8,
                      background: 'rgba(236,72,153,0.15)',
                      border: '1px solid rgba(236,72,153,0.3)',
                      color: '#f472b6', fontSize: '0.875rem', fontWeight: 600,
                      cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans',sans-serif",
                    }}>
                      ↩ Log Out
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" style={{
                padding: '0.5rem 1.2rem', borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 600,
                textDecoration: 'none',
              }}>Login</Link>
              <Link to="/register" style={{
                padding: '0.5rem 1.2rem', borderRadius: 999,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', fontSize: '0.875rem', fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 0 20px rgba(99,102,241,0.4)',
              }}>Register</Link>
            </div>
          )}

          {/* Mobile hamburger - Fixed positioning */}
          <div className="dropdown lg:hidden" style={{ position: 'relative' }}>
            <div tabIndex={0} role="button" style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.7)">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex="-1" className="dropdown-content" style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              background: 'rgba(13,17,30,0.97)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
              padding: '0.75rem',
              width: 'max-content',
              minWidth: '180px',
              marginTop: '0.5rem',
              listStyle: 'none',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              zIndex: 9999,
            }}>
              {/* Mobile menu items */}
              <li style={{ marginBottom: '0.25rem' }}>
                <NavLink to="/" style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 8,
                  color: isActive ? '#818cf8' : 'rgba(255,255,255,0.75)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                })}>🏠 Home</NavLink>
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <NavLink to="/allissues" style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 8,
                  color: isActive ? '#818cf8' : 'rgba(255,255,255,0.75)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                })}>📋 All Issues</NavLink>
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <NavLink to="/aboutus" style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 8,
                  color: isActive ? '#818cf8' : 'rgba(255,255,255,0.75)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                })}>ℹ️ About Us</NavLink>
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <NavLink to="/howitworks" style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 8,
                  color: isActive ? '#818cf8' : 'rgba(255,255,255,0.75)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                })}>⚙️ How It Works</NavLink>
              </li>
              {!user && (
                <>
                  <li style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.5rem' }}>
                    <Link to="/login" style={{
                      display: 'block',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 8,
                      color: 'rgba(255,255,255,0.75)',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}>🔐 Login</Link>
                  </li>
                  <li>
                    <Link to="/register" style={{
                      display: 'block',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      textAlign: 'center',
                    }}>✨ Register</Link>
                  </li>
                </>
              )}
              {user && (
                <>
                  <li style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.5rem' }}>
                    <Link to={getDashboardPath()} style={{
                      display: 'block',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 8,
                      color: 'rgba(255,255,255,0.75)',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}>📊 Dashboard</Link>
                  </li>
                  {!isAdmin && !isStaff && (
                    <li>
                      <Link to="/reportIssue" style={{
                        display: 'block',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 8,
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                      }}>🚩 Report Issue</Link>
                    </li>
                  )}
                  <li style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.5rem' }}>
                    <button onClick={handleLogOut} style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 8,
                      background: 'rgba(236,72,153,0.15)',
                      border: '1px solid rgba(236,72,153,0.3)',
                      color: '#f472b6',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontFamily: "'DM Sans',sans-serif",
                    }}>
                      ↩ Log Out
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;