import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { glassCard } from '../../pages/Dashboard/Admin/components/styles';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const UserProfileModal = ({ user: userData, onClose }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        // Use the new endpoint to get user by email
        const res = await axiosSecure.get(`/users/by-email/${encodeURIComponent(userData.email)}`);
        setUserDetails(res.data);
      } catch (err) {
        console.error('Failed to fetch user details:', err);
        // Fallback to the passed userData if API fails
        setUserDetails(userData);
      } finally {
        setLoading(false);
      }
    };
    
    if (userData?.email) {
      fetchUserDetails();
    }
  }, [userData.email, axiosSecure]);

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return { color: '#f472b6', bg: 'rgba(244,114,182,0.12)', label: '👑 ADMIN' };
      case 'staff': return { color: '#34d399', bg: 'rgba(52,211,153,0.12)', label: '🛠️ STAFF' };
      default: return { color: '#818cf8', bg: 'rgba(129,140,248,0.12)', label: '👤 CITIZEN' };
    }
  };

  const displayData = userDetails || userData;
  const roleInfo = getRoleBadge(displayData?.role || 'citizen');

  if (!displayData) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...glassCard,
          maxWidth: 500,
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0f172a',
          border: '1px solid rgba(99,102,241,0.3)',
          padding: 0,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))',
            borderRadius: '20px 20px 0 0',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: '#f1f5f9', margin: 0, fontSize: '1.3rem' }}>User Profile</h2>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                width: 32,
                height: 32,
                cursor: 'pointer',
                color: '#fff',
                fontSize: '1.2rem',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
            <p style={{ color: '#64748b', marginTop: '1rem' }}>Loading profile...</p>
          </div>
        ) : (
          <div style={{ padding: '1.5rem' }}>
            {/* Avatar and Basic Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: '#fff',
                  fontWeight: 700,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {displayData.photo ? (
                  <img src={displayData.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (displayData.name || displayData.email || '?')[0]?.toUpperCase()
                )}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <h3 style={{ color: '#e2e8f0', margin: 0, fontSize: '1.2rem' }}>{displayData.name || 'User'}</h3>
                  <span
                    style={{
                      background: roleInfo.bg,
                      border: `1px solid ${roleInfo.color}40`,
                      color: roleInfo.color,
                      borderRadius: '6px',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    {roleInfo.label}
                  </span>
                  {displayData.isPremium && (
                    <span
                      style={{
                        background: 'rgba(251,146,60,0.12)',
                        border: '1px solid rgba(251,146,60,0.3)',
                        color: '#fb923c',
                        borderRadius: '6px',
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      ⭐ PREMIUM
                    </span>
                  )}
                  {displayData.isBlocked && (
                    <span
                      style={{
                        background: 'rgba(239,68,68,0.12)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        color: '#f87171',
                        borderRadius: '6px',
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      🚫 BANNED
                    </span>
                  )}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{displayData.email}</div>
                {displayData.phone && <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.2rem' }}>📞 {displayData.phone}</div>}
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ color: '#818cf8', fontWeight: 700, fontSize: '1.2rem' }}>{displayData.issueCount || 0}</div>
                <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Issues Reported</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ color: '#34d399', fontWeight: 700, fontSize: '1.2rem' }}>{displayData.resolvedCount || 0}</div>
                <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Issues Resolved</div>
              </div>
            </div>

            {/* Account Details */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Account Details
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Email Verified</span>
                  <span style={{ color: displayData.isEmailVerified ? '#34d399' : '#f87171', fontSize: '0.8rem', fontWeight: 600 }}>
                    {displayData.isEmailVerified ? '✅ Yes' : '⚠️ No'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Account Status</span>
                  <span style={{ color: displayData.isBlocked ? '#f87171' : '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>
                    {displayData.isBlocked ? '🚫 Banned' : '✅ Active'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Member Since</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                    {displayData.createdAt ? new Date(displayData.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                {displayData.premiumSince && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Premium Since</span>
                    <span style={{ color: '#fb923c', fontSize: '0.8rem', fontWeight: 600 }}>
                      {new Date(displayData.premiumSince).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {displayData.premiumPlan && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Premium Plan</span>
                    <span style={{ color: '#fb923c', fontSize: '0.8rem', fontWeight: 600 }}>
                      {displayData.premiumPlan.charAt(0).toUpperCase() + displayData.premiumPlan.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserProfileModal;