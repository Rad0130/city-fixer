import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import useAuth from '../../Hooks/useAuth';
import axios from 'axios';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser, googleLogin, updateUserProfile } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRegister = async (data) => {
    setLoading(true); setError('');
    const profileImage = data.photo[0];
    try {
      const result = await createUser(data.email, data.password);
      console.log(result);
      navigate(location.state || '/');
      const formData = new FormData();
      formData.append('image', profileImage);
      const Image_url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Host}`;
      const res = await axios.post(Image_url, formData);
      await updateUserProfile({ displayName: data.name, photoURL: res.data.data.url });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    googleLogin()
      .then(() => navigate(location.state || '/'))
      .catch(err => setError(err.message));
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
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '55vw', height: '55vw', maxWidth: 700, background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '50vw', height: '50vw', maxWidth: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            margin: '0 auto 1rem',
            boxShadow: '0 0 40px rgba(236,72,153,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
          }}>🏙️</div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '2rem',
            background: 'linear-gradient(135deg, #fff 40%, #f9a8d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: '0.4rem',
          }}>Create account</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            Join CityFix and start making a difference
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
          {error && (
            <div style={{
              background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)',
              borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem',
              color: '#f472b6', fontSize: '0.85rem',
            }}>
              ⚠️ {error.replace('Firebase: ', '').replace(/\(.*\)/, '').trim()}
            </div>
          )}

          <form onSubmit={handleSubmit(handleRegister)} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" {...register('name', { required: true })} placeholder="Your full name" style={inputStyle(errors.name)} />
              {errors.name && <p style={errMsg}>Name is required</p>}
            </div>

            {/* Photo */}
            <div>
              <label style={labelStyle}>Profile Photo</label>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px dashed ${errors.photo ? 'rgba(236,72,153,0.5)' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 10, padding: '0.75rem 1rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}>
                <span style={{ fontSize: '1.2rem' }}>📷</span>
                <input
                  type="file"
                  {...register('photo', { required: true })}
                  style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', flex: 1, background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer' }}
                />
              </div>
              {errors.photo && <p style={errMsg}>Photo is required</p>}
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email address</label>
              <input type="email" {...register('email', { required: true })} placeholder="you@example.com" style={inputStyle(errors.email)} />
              {errors.email && <p style={errMsg}>Email is required</p>}
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" {...register('password', { required: true, minLength: 6 })} placeholder="At least 6 characters" style={inputStyle(errors.password)} />
              {errors.password?.type === 'required' && <p style={errMsg}>Password is required</p>}
              {errors.password?.type === 'minLength' && <p style={errMsg}>Password must be at least 6 characters</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', borderRadius: 12,
                color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 30px rgba(99,102,241,0.4)',
                transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            style={{
              width: '100%', padding: '0.85rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12,
              color: '#fff', fontWeight: 600, fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
              <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
              <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
              <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
            </svg>
            Sign up with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link state={location.state} to="/login" style={{ color: '#818cf8', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.03em' };
const inputStyle = (hasError) => ({
  width: '100%', padding: '0.8rem 1rem',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${hasError ? 'rgba(236,72,153,0.5)' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: 10, color: '#fff', fontSize: '0.9rem',
  outline: 'none', fontFamily: "'DM Sans',sans-serif", boxSizing: 'border-box',
});
const errMsg = { color: '#f472b6', fontSize: '0.78rem', marginTop: '0.35rem', margin: '0.35rem 0 0' };

export default Register;