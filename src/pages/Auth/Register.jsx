import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm, useWatch } from 'react-hook-form';
import useAuth from '../../Hooks/useAuth';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const { createUser, googleLogin, updateUserProfile } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // FIX: Use useWatch instead of watch to avoid React Compiler warning
  const password = useWatch({ control, name: 'password', defaultValue: '' });
  const confirmPassword = useWatch({ control, name: 'confirmPassword', defaultValue: '' });

  // Password strength calculation
  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (pass) => {
    const strength = calculatePasswordStrength(pass);
    if (pass.length === 0) return '';
    if (strength <= 2) return 'Weak';
    if (strength === 3) return 'Fair';
    if (strength === 4) return 'Good';
    return 'Strong';
  };

  const getPasswordStrengthColor = (pass) => {
    const strength = calculatePasswordStrength(pass);
    if (pass.length === 0) return '#64748b';
    if (strength <= 2) return '#f87171';
    if (strength === 3) return '#fbbf24';
    if (strength === 4) return '#34d399';
    return '#22d3ee';
  };

  // Password validation rules
  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Password must contain at least one special character';
    return true;
  };

  const validateConfirmPassword = (value) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return true;
  };

  const handleRegister = async (data) => {
    setLoading(true);
    setError('');
    
    Swal.fire({
      title: 'Creating Account...',
      text: 'Please wait while we set up your account',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#0d1117',
      color: '#fff',
    });
    
    const profileImage = data.photo[0];
    
    try {
      const result = await createUser(data.email, data.password);
      console.log(result);
      
      const formData = new FormData();
      formData.append('image', profileImage);
      const Image_url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Host}`;
      const res = await axios.post(Image_url, formData);
      
      await updateUserProfile({ displayName: data.name, photoURL: res.data.data.url });
      
      Swal.close();
      
      Swal.fire({
        title: 'Welcome to CityFix! 🎉',
        html: `Account created successfully!<br/><br/>
               <strong>${data.name}</strong>, you're now part of the CityFix community.<br/><br/>
               Start reporting issues and making a difference in your community!`,
        icon: 'success',
        background: '#0d1117',
        color: '#fff',
        confirmButtonColor: '#6366f1',
        confirmButtonText: 'Start Exploring',
        timer: 3000,
        timerProgressBar: true,
      }).then(() => {
        navigate(location.state?.from?.pathname || '/');
      });
      
    } catch (err) {
      Swal.close();
      setError(err.message);
      setLoading(false);
      
      Swal.fire({
        title: 'Registration Failed',
        text: err.message.replace('Firebase: ', '').replace(/\(.*\)/, '').trim(),
        icon: 'error',
        background: '#0d1117',
        color: '#fff',
        confirmButtonColor: '#6366f1',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    Swal.fire({
      title: 'Google Sign Up...',
      text: 'Please wait while we connect to Google',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#0d1117',
      color: '#fff',
    });
    
    try {
      const result = await googleLogin();
      console.log(result);
      Swal.close();
      
      Swal.fire({
        title: 'Welcome to CityFix! 🎉',
        text: 'Successfully signed up with Google! Start reporting issues and making a difference.',
        icon: 'success',
        background: '#0d1117',
        color: '#fff',
        confirmButtonColor: '#6366f1',
        confirmButtonText: 'Continue',
        timer: 2500,
        timerProgressBar: true,
      }).then(() => {
        navigate(location.state?.from?.pathname || '/');
      });
      
    } catch (err) {
      Swal.close();
      setError(err.message);
      setLoading(false);
      
      Swal.fire({
        title: 'Google Sign Up Failed',
        text: err.message,
        icon: 'error',
        background: '#0d1117',
        color: '#fff',
        confirmButtonColor: '#6366f1',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const passwordStrength = calculatePasswordStrength(password);
  const strengthText = getPasswordStrengthText(password);
  const strengthColor = getPasswordStrengthColor(password);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', fontFamily: "'DM Sans', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '55vw', height: '55vw', maxWidth: 700, background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '50vw', height: '50vw', maxWidth: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
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

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24, padding: '2.5rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        }}>
          {error && !loading && (
            <div style={{
              background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)',
              borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem',
              color: '#f472b6', fontSize: '0.85rem',
            }}>
              ⚠️ {error.replace('Firebase: ', '').replace(/\(.*\)/, '').trim()}
            </div>
          )}

          <form onSubmit={handleSubmit(handleRegister)} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" {...register('name', { required: true })} placeholder="Your full name" style={inputStyle(errors.name)} disabled={loading} />
              {errors.name && <p style={errMsg}>Name is required</p>}
            </div>

            <div>
              <label style={labelStyle}>Profile Photo</label>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px dashed ${errors.photo ? 'rgba(236,72,153,0.5)' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 10, padding: '0.75rem 1rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                opacity: loading ? 0.6 : 1,
              }}>
                <span style={{ fontSize: '1.2rem' }}>📷</span>
                <input
                  type="file"
                  {...register('photo', { required: true })}
                  style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', flex: 1, background: 'transparent', border: 'none', outline: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
                  disabled={loading}
                />
              </div>
              {errors.photo && <p style={errMsg}>Photo is required</p>}
            </div>

            <div>
              <label style={labelStyle}>Email address</label>
              <input type="email" {...register('email', { required: true })} placeholder="you@example.com" style={inputStyle(errors.email)} disabled={loading} />
              {errors.email && <p style={errMsg}>Email is required</p>}
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    validate: validatePassword
                  })}
                  placeholder="Create a strong password"
                  style={inputStyle(errors.password)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '1rem',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              
              {password && !loading && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ 
                    height: '4px', 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: '2px',
                    overflow: 'hidden',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ 
                      width: `${(passwordStrength / 5) * 100}%`, 
                      height: '100%', 
                      background: strengthColor,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ color: strengthColor, fontSize: '0.75rem', fontWeight: 600 }}>
                      Password Strength: {strengthText}
                    </span>
                    {passwordStrength === 5 && (
                      <span style={{ color: '#34d399', fontSize: '0.7rem' }}>✓ Strong password!</span>
                    )}
                  </div>
                </div>
              )}
              
              {!loading && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
                    Password requirements:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: password?.length >= 8 ? '#34d399' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                        {password?.length >= 8 ? '✓' : '○'}
                      </span>
                      <span style={{ color: password?.length >= 8 ? '#34d399' : 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                        At least 8 characters {password?.length >= 8 ? `(${password.length}/8+)` : `(${password.length || 0}/8)`}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: /[A-Z]/.test(password) ? '#34d399' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                        {/[A-Z]/.test(password) ? '✓' : '○'}
                      </span>
                      <span style={{ color: /[A-Z]/.test(password) ? '#34d399' : 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                        Contains uppercase letter (A-Z)
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: /[a-z]/.test(password) ? '#34d399' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                        {/[a-z]/.test(password) ? '✓' : '○'}
                      </span>
                      <span style={{ color: /[a-z]/.test(password) ? '#34d399' : 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                        Contains lowercase letter (a-z)
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: /[0-9]/.test(password) ? '#34d399' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                        {/[0-9]/.test(password) ? '✓' : '○'}
                      </span>
                      <span style={{ color: /[0-9]/.test(password) ? '#34d399' : 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                        Contains number (0-9)
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? '#34d399' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                        {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '○'}
                      </span>
                      <span style={{ color: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? '#34d399' : 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                        Contains special character (!@#$%^&* etc.)
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {errors.password && !loading && (
                <p style={errMsg}>{errors.password.message}</p>
              )}
            </div>

            <div>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: validateConfirmPassword
                  })}
                  placeholder="Confirm your password"
                  style={inputStyle(errors.confirmPassword)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '1rem',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  disabled={loading}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {!loading && confirmPassword && password && confirmPassword === password && (
                <div style={{ marginTop: '0.35rem', fontSize: '0.7rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  ✓ Passwords match!
                </div>
              )}
              {!loading && confirmPassword && password && confirmPassword !== password && (
                <div style={{ marginTop: '0.35rem', fontSize: '0.7rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  ✗ Passwords do not match
                </div>
              )}
              {errors.confirmPassword && !loading && (
                <p style={errMsg}>{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem',
                background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', borderRadius: 12,
                color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 30px rgba(99,102,241,0.4)',
                transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
                fontFamily: "'DM Sans',sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid #fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            style={{
              width: '100%', padding: '0.85rem',
              background: loading ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12,
              color: '#fff', fontWeight: 600, fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              fontFamily: "'DM Sans',sans-serif",
              opacity: loading ? 0.5 : 1,
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

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const labelStyle = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.03em' };
const inputStyle = (hasError) => ({
  width: '100%', padding: '0.8rem 2.5rem 0.8rem 1rem',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${hasError ? 'rgba(236,72,153,0.5)' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: 10, color: '#fff', fontSize: '0.9rem',
  outline: 'none', fontFamily: "'DM Sans',sans-serif", boxSizing: 'border-box',
});
const errMsg = { color: '#f472b6', fontSize: '0.78rem', marginTop: '0.35rem', margin: '0.35rem 0 0' };

export default Register;