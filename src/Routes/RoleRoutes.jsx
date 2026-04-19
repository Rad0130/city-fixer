import React from 'react';
import { Navigate } from 'react-router';
import useRole from '../Hooks/useRole';
import useAuth from '../Hooks/useAuth';

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { isAdmin, roleLoading } = useRole();

  if (loading || roleLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
};

// src/Routes/StaffRoute.jsx
export const StaffRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { isStaff, roleLoading } = useRole();

  if (loading || roleLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (!isStaff) return <Navigate to="/" />;
  return children;
};

// src/Routes/AdminOrStaffRoute.jsx
export const AdminOrStaffRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { isAdmin, isStaff, roleLoading } = useRole();

  if (loading || roleLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin && !isStaff) return <Navigate to="/" />;
  return children;
};

const LoadingScreen = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        border: '3px solid rgba(99,102,241,0.2)',
        borderTop: '3px solid #6366f1',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 1rem',
      }} />
      <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans',sans-serif" }}>Verifying access...</p>
    </div>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);