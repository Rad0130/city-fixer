import React from 'react';
import { Link } from 'react-router';

const ErrorPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: "'DM Sans', sans-serif",
      position: 'relative', overflow: 'hidden', textAlign: 'center',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '60vw', height: '60vw', maxWidth: 700, background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 520 }}>
        {/* 404 */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 'clamp(7rem, 20vw, 12rem)', lineHeight: 1,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(236,72,153,0.2) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            userSelect: 'none',
            filter: 'drop-shadow(0 0 60px rgba(99,102,241,0.3))',
          }}>404</div>
          {/* Glitch lines */}
          <div style={{
            position: 'absolute', top: '40%', left: 0, right: 0,
            height: 2, background: 'linear-gradient(90deg, transparent, #6366f1, #ec4899, transparent)',
            opacity: 0.6,
          }} />
        </div>

        <h2 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          color: '#fff', marginBottom: '1rem',
        }}>
          Page Not Found
        </h2>

        <p style={{
          color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', lineHeight: 1.75,
          marginBottom: '2.5rem', maxWidth: 380, margin: '0 auto 2.5rem',
        }}>
          Oops! The URL you requested seems to be incorrect or the page has been moved. Let's get you back on track.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', fontWeight: 700, fontSize: '0.95rem',
            padding: '0.85rem 2rem', borderRadius: 12, textDecoration: 'none',
            boxShadow: '0 0 30px rgba(99,102,241,0.45)',
          }}>
            🏠 Go Home
          </Link>
          <Link to="/allissues" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.75)', fontWeight: 600, fontSize: '0.95rem',
            padding: '0.85rem 2rem', borderRadius: 12, textDecoration: 'none',
          }}>
            Browse Issues
          </Link>
        </div>

        {/* Fun decoration */}
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i === 2 ? '#6366f1' : 'rgba(255,255,255,0.15)',
              boxShadow: i === 2 ? '0 0 12px #6366f1' : 'none',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;