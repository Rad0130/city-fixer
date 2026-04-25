// src/pages/Forget/ForgetPassword.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../Firebase/firebase.config';
import Swal from 'sweetalert2';

const ForgetPassword = () => {
  const emailref = useRef();
  const location = useLocation();
  const email = location.state?.email || '';
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailref.current) emailref.current.value = email;
  }, [email]);

  const handleResetPassword = () => {
    const emailVal = emailref.current?.value?.trim();

    if (!emailVal) {
      Swal.fire({
        title: 'Email required',
        text: 'Please enter your email address.',
        icon: 'warning',
        background: '#0d1117',
        color: '#fff',
        confirmButtonColor: '#6366f1',
      });
      return;
    }

    setLoading(true);

    // ── FIX: Do NOT use handleCodeInApp: true with continueUrl to your app.
    // Firebase sends the reset link to the user's email pointing to its own
    // hosted page where the password is reset.  After reset, the user is
    // redirected to the continueUrl you provide.
    // If you want a fully custom reset page, you must use a custom email
    // action handler URL, which requires a paid Firebase plan or self-hosting.
    // The simplest reliable approach: let Firebase handle the reset page and
    // redirect back to /login when done.
    const actionCodeSettings = {
      // After Firebase resets the password, redirect the user back to your app.
      // Change this URL to your production domain before deploying.
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,  // Let Firebase host the password-change page
    };

    sendPasswordResetEmail(auth, emailVal, actionCodeSettings)
      .then(() => {
        Swal.fire({
          title: '📧 Reset Link Sent!',
          html: `A password reset email has been sent to<br/><strong style="color:#22d3ee">${emailVal}</strong><br/><br/>Check your inbox (and spam folder) and follow the link to reset your password.`,
          icon: 'success',
          background: '#0d1117',
          color: '#fff',
          confirmButtonColor: '#6366f1',
          confirmButtonText: 'Open Gmail',
          showCancelButton: true,
          cancelButtonText: 'Done',
          cancelButtonColor: '#374151',
        }).then((result) => {
          if (result.isConfirmed) {
            window.open('https://mail.google.com', '_blank');
          }
        });
      })
      .catch((error) => {
        console.error('Password reset error:', error.code, error.message);

        const messages = {
          'auth/user-not-found': 'No account found with this email address.',
          'auth/invalid-email': 'That doesn\'t look like a valid email address.',
          'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
          'auth/network-request-failed': 'Network error. Check your internet connection.',
        };

        Swal.fire({
          title: 'Failed to Send',
          text: messages[error.code] || `An error occurred: ${error.message}`,
          icon: 'error',
          background: '#0d1117',
          color: '#fff',
          confirmButtonColor: '#6366f1',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', fontFamily: "'DM Sans', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60vw', height: '60vw', maxWidth: 700, background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', maxWidth: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 460 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              margin: '0 auto 1rem',
              boxShadow: '0 0 40px rgba(99,102,241,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem',
            }}>🏙️</div>
          </Link>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '2rem',
            background: 'linear-gradient(135deg, #fff 40%, #22d3ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: '0.5rem',
          }}>
            Reset Password
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            Enter your email and we'll send a reset link
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24, padding: '2.5rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        }}>

          {/* Info box */}
          <div style={{
            background: 'rgba(34,211,238,0.06)',
            border: '1px solid rgba(34,211,238,0.2)',
            borderRadius: 12, padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>ℹ️</span>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
              We'll send you a secure link via email. Click it to set a new password — no account needed.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.03em' }}>
              Email address
            </label>
            <input
              type="email"
              ref={emailref}
              placeholder="you@example.com"
              onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
              style={{
                width: '100%', padding: '0.85rem 1rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, color: '#fff', fontSize: '0.9rem',
                outline: 'none', fontFamily: "'DM Sans',sans-serif",
                boxSizing: 'border-box', transition: 'border 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <button
            onClick={handleResetPassword}
            disabled={loading}
            type="button"
            style={{
              width: '100%', padding: '0.9rem',
              background: loading ? 'rgba(6,182,212,0.4)' : 'linear-gradient(135deg, #06b6d4, #6366f1)',
              border: 'none', borderRadius: 12,
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 0 25px rgba(6,182,212,0.35)',
              transition: 'all 0.2s', fontFamily: "'DM Sans',sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Sending...
              </>
            ) : (
              '📧 Send Reset Link'
            )}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
            Remember it?{' '}
            <Link to="/login" style={{ color: '#22d3ee', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ForgetPassword;