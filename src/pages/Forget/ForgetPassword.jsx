import React, { useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../Firebase/firebase.config';

const ForgetPassword = () => {
  const emailref = useRef();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(() => {
    if (emailref.current) emailref.current.value = email;
  }, [email]);

  const handleResetPassword = () => {
    const emailVal = emailref.current.value;
    sendPasswordResetEmail(auth, emailVal)
      .then(() => window.open('https://mail.google.com', '_blank'))
      .catch(() => alert('Error sending reset email. Please try again.'));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', fontFamily: "'DM Sans', sans-serif", position: 'relative',
    }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60vw', height: '60vw', maxWidth: 700, background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
            margin: '0 auto 1.2rem',
            boxShadow: '0 0 40px rgba(6,182,212,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
          }}>🔐</div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.9rem',
            background: 'linear-gradient(135deg, #fff 40%, #22d3ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: '0.4rem',
          }}>Reset Password</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            Enter your email and we'll send a reset link.
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24, padding: '2.5rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        }}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Email address
            </label>
            <input
              type="email"
              ref={emailref}
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '0.85rem 1rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, color: '#fff', fontSize: '0.9rem',
                outline: 'none', fontFamily: "'DM Sans',sans-serif", boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            onClick={handleResetPassword}
            type="button"
            style={{
              width: '100%', padding: '0.9rem',
              background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
              border: 'none', borderRadius: 12,
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer', boxShadow: '0 0 25px rgba(6,182,212,0.35)',
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            📧 Send Reset Link
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
            Remember it?{' '}
            <Link to="/login" style={{ color: '#22d3ee', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;