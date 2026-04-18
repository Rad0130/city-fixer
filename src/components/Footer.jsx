import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(5,5,15,0.9)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: 200,
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '4rem clamp(1rem,4vw,3rem) 2rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                boxShadow: '0 0 20px rgba(99,102,241,0.4)',
              }} />
              <span style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #fff 40%, #a5b4fc)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>CityFix</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: 1.75, maxWidth: 240 }}>
              Empowering citizens to build better cities through collaborative issue reporting and resolution.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.2rem' }}>
              {['𝕏', 'in', 'f', '📧'].map((s, i) => (
                <div key={i} style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>{s}</div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '1.2rem', letterSpacing: '0.05em' }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[['/', 'Home'], ['/reportIssue', 'Report an Issue'], ['/allissues', 'Browse Issues'], ['/howitworks', 'How It Works'], ['/aboutus', 'About Us']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: '#6366f1' }}>›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '1.2rem', letterSpacing: '0.05em' }}>
              Categories
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Road & Transport', 'Sanitation', 'Water Supply', 'Public Safety', 'Drainage'].map((cat) => (
                <li key={cat}>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: '#ec4899' }}>›</span> {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '1.2rem', letterSpacing: '0.05em' }}>
              Contact Us
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { icon: '✉', label: 'support@cityfix.com', color: '#818cf8' },
                { icon: '📞', label: '+1 (555) 123-4567', color: '#34d399' },
                { icon: '📍', label: '123 City Hall, Your City', color: '#f472b6' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', flexShrink: 0,
                  }}>{item.icon}</div>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '1.5rem',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.82rem' }}>
            © 2024 CityFix. All rights reserved. Built for better cities.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'FAQ'].map((item) => (
              <a key={item} href="#" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.82rem', textDecoration: 'none' }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;