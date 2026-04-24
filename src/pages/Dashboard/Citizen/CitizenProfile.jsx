// /home/shafiur/City-Fixer/src/pages/Dashboard/Citizen/CitizenProfile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useRole from '../../../Hooks/useRole';
import { glassCard, inputStyle, labelStyle, primaryBtn } from './components/styles';
import Swal from 'sweetalert2';

const PLANS = [
  {
    key: 'weekly', label: 'Weekly', price: 150, period: '/ week',
    tag: null, desc: 'Try premium for a week',
    features: ['Unlimited reports', 'Priority support'],
    color: '#22d3ee', bg: 'rgba(34,211,238,0.06)', border: 'rgba(34,211,238,0.2)',
  },
  {
    key: 'monthly', label: 'Monthly', price: 500, period: '/ month',
    tag: 'Most Popular', desc: 'Best for regular users',
    features: ['Unlimited reports', 'Priority support', 'Early features'],
    color: '#818cf8', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.35)',
  },
  {
    key: 'yearly', label: 'Yearly', price: 4500, period: '/ year',
    tag: 'Save 25%', desc: '৳375/mo — best deal',
    features: ['Unlimited reports', 'Priority support', 'Early features', 'Profile badge'],
    color: '#fb923c', bg: 'rgba(251,146,60,0.06)', border: 'rgba(251,146,60,0.25)',
  },
];

const CitizenProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isPremium, refetch: refetchRole } = useRole();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [upgradingPlan, setUpgradingPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [staffReason, setStaffReason] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [myRequest, setMyRequest] = useState(null);

  // Image upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.photoURL || '');
  const [uploading, setUploading] = useState(false);
  
  const [isEmailVerified, setIsEmailVerified] = useState(user?.emailVerified || false);

  // Add this useEffect to refresh user data when component mounts or when verification might change
  useEffect(() => {
    const refreshUserData = async () => {
      try {
        const { data } = await axiosSecure.get('/users/me');
        setIsEmailVerified(data.isEmailVerified || false);
      } catch (err) {
        console.error('Failed to refresh user data:', err);
      }
    };
    
    refreshUserData();
  }, []);

  useEffect(() => {
    axiosSecure.get('/staff-requests/my')
      .then(res => setMyRequest(res.data))
      .catch(() => setMyRequest(null));
  }, []);

  // ── Handle Stripe redirect ─────────────────────────────────────────────
  // ── Handle Stripe redirect ─────────────────────────────────────────────
  // Add a ref to track if payment has been processed
  const paymentProcessedRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('payment');
    const sessionID = params.get('sessionID');

    const processPremiumPayment = async () => {
      // Prevent double processing
      if (paymentProcessedRef.current) {
        console.log('Payment already processed, skipping...');
        return;
      }
      
      if (paymentStatus === 'success' && sessionID) {
        paymentProcessedRef.current = true;
        
        // Show processing indicator
        Swal.fire({
          title: 'Verifying Payment...',
          text: 'Please wait while we activate your premium membership',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          background: '#0d1117',
          color: '#fff',
          backdrop: 'rgba(0,0,0,0.8)',
        });

        try {
          const response = await axiosSecure.post('/users/upgrade-premium', { sessionId: sessionID });
          
          console.log('Payment response:', response.data);
          
          if (response.data && response.data.success === true) {
            // Close loading
            Swal.close();
            
            // Show success message
            await Swal.fire({
              title: '⭐ Premium Activated!',
              text: 'You now have unlimited reports and priority support.',
              icon: 'success',
              background: '#0d1117',
              color: '#fff',
              confirmButtonColor: '#6366f1',
              confirmButtonText: 'Continue',
              timer: 2000,
              timerProgressBar: true,
            });
            
            // Clear the URL parameters to prevent re-processing on reload
            window.history.replaceState({}, '', window.location.pathname);
            
            // Reload the page to reflect premium status everywhere
            window.location.reload();
          } else {
            throw new Error(response.data?.message || 'Verification failed');
          }
        } catch (err) {
          console.error('Premium activation error:', err);
          paymentProcessedRef.current = false;
          
          Swal.fire({
            title: 'Payment Verification Failed',
            text: err?.response?.data?.message || err?.message || 'Could not verify payment. Please contact support if you were charged.',
            icon: 'error',
            background: '#0d1117',
            color: '#fff',
            confirmButtonColor: '#6366f1',
          });
          window.history.replaceState({}, '', window.location.pathname);
        }
      } else if (paymentStatus === 'cancel') {
        if (paymentProcessedRef.current) return;
        paymentProcessedRef.current = true;
        
        Swal.fire({
          title: 'Payment Cancelled',
          text: 'Your premium upgrade was cancelled. You can try again anytime.',
          icon: 'info',
          timer: 3000,
          showConfirmButton: false,
          background: '#0d1117',
          color: '#fff',
        });
        window.history.replaceState({}, '', window.location.pathname);
        setTimeout(() => {
          paymentProcessedRef.current = false;
        }, 1000);
      }
    };

    if (paymentStatus === 'success' && sessionID) {
      processPremiumPayment();
    } else if (paymentStatus === 'cancel') {
      processPremiumPayment();
    }
  }, [location.search, axiosSecure]);

  // ── Image file handling ────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      Swal.fire({ title: 'Invalid file', text: 'Please select an image file', icon: 'warning', background: '#0d1117', color: '#fff' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({ title: 'File too large', text: 'Image must be under 10MB', icon: 'warning', background: '#0d1117', color: '#fff' });
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadToImgbb = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Host}`;
    const res = await fetch(url, { method: 'POST', body: formData });
    const data = await res.json();
    if (!data.success) throw new Error('Image upload failed');
    return data.data.url;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let photoURL = user?.photoURL || '';

      if (imageFile) {
        setUploading(true);
        photoURL = await uploadToImgbb(imageFile);
        setUploading(false);
        setImageFile(null);
      }

      await updateUserProfile({ displayName: name, photoURL });
      await axiosSecure.post('/users', { email: user.email, name, photo: photoURL });
      setSaved(true);
      Swal.fire({ title: 'Profile updated!', icon: 'success', timer: 1500, showConfirmButton: false, background: '#0d1117', color: '#fff' });
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setUploading(false);
      Swal.fire({ title: 'Failed to update profile', text: err?.message || '', icon: 'error', background: '#0d1117', color: '#fff' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async (planKey) => {
  setUpgradingPlan(planKey);
  try {
    const res = await axiosSecure.post('/create-checkout-session', {
      type: 'premium',
      plan: planKey,
      email: user.email,
      successUrl: `${window.location.origin}/dashboard/profile?payment=success&sessionID={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/dashboard/profile?payment=cancel`,
    });
    
    if (res.data.url) {
      window.location.href = res.data.url;
    } else {
      throw new Error('No checkout URL received');
    }
  } catch (err) {
    console.error('Checkout error:', err);
    Swal.fire({
      title: 'Failed to start checkout',
      text: err?.response?.data?.message || 'Please try again later',
      icon: 'error',
      background: '#0d1117',
      color: '#fff',
      confirmButtonColor: '#6366f1',
    });
    setUpgradingPlan(null);
  }
};

  const handleStaffRequest = async () => {
    if (!staffReason.trim()) {
      Swal.fire({ title: 'Please add a reason', icon: 'warning', background: '#0d1117', color: '#fff' });
      return;
    }
    setSubmittingRequest(true);
    try {
      await axiosSecure.post('/staff-requests', { reason: staffReason });
      Swal.fire({ title: 'Request submitted!', text: 'The admin will review your application.', icon: 'success', background: '#0d1117', color: '#fff' });
      setStaffReason('');
      const res = await axiosSecure.get('/staff-requests/my');
      setMyRequest(res.data);
    } catch (err) {
      Swal.fire({ title: err?.response?.data?.message || 'Failed to submit', icon: 'error', background: '#0d1117', color: '#fff' });
    } finally {
      setSubmittingRequest(false);
    }
  };

  const currentPhoto = imagePreview || user?.photoURL || '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 600 }}>
      <div>
        <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>My Profile</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>Manage your account details</p>
      </div>

      {/* Avatar Card */}
      <div style={{ ...glassCard, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', color: '#fff', fontWeight: 700,
            border: `3px solid ${isPremium ? 'rgba(251,146,60,0.5)' : 'rgba(99,102,241,0.4)'}`,
            overflow: 'hidden',
          }}>
            {currentPhoto
              ? <img src={currentPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (user?.displayName || user?.email)?.[0]?.toUpperCase()}
          </div>
          {/* Image upload overlay button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 26, height: 26, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: '2px solid #0a0a1a',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem',
            }}
            title="Change profile photo"
          >
            📷
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
        <div>
          <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '1.1rem' }}>{user?.displayName || 'Citizen'}</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{user?.email}</div>
          {imageFile && (
            <div style={{ color: '#818cf8', fontSize: '0.72rem', marginTop: '0.3rem' }}>
              📎 {imageFile.name} — <span style={{ color: '#64748b' }}>Save to apply</span>
            </div>
          )}
          <span style={{
            display: 'inline-block', marginTop: '0.4rem',
            background: isPremium ? 'rgba(251,146,60,0.12)' : 'rgba(99,102,241,0.1)',
            border: `1px solid ${isPremium ? 'rgba(251,146,60,0.3)' : 'rgba(99,102,241,0.2)'}`,
            color: isPremium ? '#fb923c' : '#818cf8',
            borderRadius: '6px', padding: '0.2rem 0.7rem', fontSize: '0.7rem', fontWeight: 700,
          }}>
            {isPremium ? '⭐ PREMIUM' : '👤 FREE PLAN'}
          </span>
        </div>
      </div>

      {/* Edit Form */}
      <div style={glassCard}>
        <h3 style={{ color: '#e2e8f0', margin: '0 0 1.25rem', fontWeight: 700 }}>Edit Details</h3>

        <label style={labelStyle}>Display Name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={inputStyle} />

        <label style={labelStyle}>Profile Photo</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.85rem',
            background: 'rgba(99,102,241,0.06)',
            border: '1px dashed rgba(99,102,241,0.35)',
            borderRadius: '12px', padding: '0.85rem 1rem',
            cursor: 'pointer', marginBottom: '1rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'; e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; }}
        >
          {currentPhoto ? (
            <img src={currentPhoto} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
              📷
            </div>
          )}
          <div>
            <div style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.85rem' }}>
              {imageFile ? imageFile.name : 'Click to upload photo'}
            </div>
            <div style={{ color: '#475569', fontSize: '0.72rem' }}>
              {imageFile ? `${(imageFile.size / 1024).toFixed(0)} KB — ready to upload` : 'JPG, PNG, WEBP — max 10MB'}
            </div>
          </div>
          {imageFile && (
            <button
              onClick={e => { e.stopPropagation(); setImageFile(null); setImagePreview(user?.photoURL || ''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              style={{ marginLeft: 'auto', background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)', borderRadius: 8, padding: '0.2rem 0.6rem', color: '#f472b6', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
            >
              ✕
            </button>
          )}
        </div>

        <label style={labelStyle}>Email Address</label>
        <input value={user?.email || ''} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />

        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={handleSave} disabled={saving || uploading} style={{ ...primaryBtn, opacity: (saving || uploading) ? 0.6 : 1 }}>
            {uploading ? '⬆️ Uploading...' : saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && <span style={{ color: '#34d399', fontSize: '0.85rem' }}>✅ Saved!</span>}
        </div>
      </div>

      {/* Account Info */}
      <div style={glassCard}>
        <h3 style={{ color: '#e2e8f0', margin: '0 0 1rem', fontWeight: 700 }}>Account Info</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[
            { 
              label: 'Email Verified', 
              desc: 'Account verification status', 
              value: isEmailVerified ? '✅ Verified' : '⚠️ Not Verified', 
              color: isEmailVerified ? '#34d399' : '#f87171' 
            },
            { label: 'Plan', desc: isPremium ? 'Unlimited reports' : 'Up to 3 free reports', value: isPremium ? '⭐ Premium' : 'Free', color: isPremium ? '#fb923c' : '#94a3b8' },
            { label: 'Member Since', desc: user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A' },
            { label: 'Last Sign In', desc: user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600 }}>{item.label}</div>
                <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{item.desc}</div>
              </div>
              {item.value && <span style={{ color: item.color || '#94a3b8', fontWeight: 700, fontSize: '0.85rem' }}>{item.value}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Premium Plan Cards */}
      {!isPremium && (
        <div style={glassCard}>
          <h3 style={{ color: '#fb923c', margin: '0 0 0.4rem', fontWeight: 700 }}>⭐ Upgrade to Premium</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 1.5rem' }}>
            Choose a plan and unlock unlimited issue reporting.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
            {PLANS.map(plan => {
              const isSelected = selectedPlan === plan.key;
              return (
                <div key={plan.key} onClick={() => setSelectedPlan(plan.key)} style={{
                  background: isSelected ? plan.bg : 'rgba(255,255,255,0.02)',
                  border: `2px solid ${isSelected ? plan.color : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: '14px', padding: '1.1rem', cursor: 'pointer', position: 'relative',
                }}>
                  {plan.tag && (
                    <div style={{ position: 'absolute', top: -10, right: 10, background: plan.color, color: '#fff', borderRadius: 999, padding: '0.15rem 0.65rem', fontSize: '0.65rem', fontWeight: 800 }}>
                      {plan.tag}
                    </div>
                  )}
                  <div style={{ color: plan.color, fontWeight: 800, fontSize: '1rem', marginBottom: '0.25rem' }}>{plan.label}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1.5rem' }}>৳{plan.price}</span>
                    <span style={{ color: '#64748b', fontSize: '0.78rem' }}>{plan.period}</span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem' }}>{plan.desc}</div>
                  {plan.features.map(f => (
                    <div key={f} style={{ color: plan.color, fontSize: '0.73rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>✓</span> {f}
                    </div>
                  ))}
                  {isSelected && (
                    <div style={{ marginTop: '0.6rem', textAlign: 'center', background: plan.color, color: '#fff', borderRadius: 6, padding: '0.25rem', fontSize: '0.72rem', fontWeight: 700 }}>Selected</div>
                  )}
                </div>
              );
            })}
          </div>
          <button
            onClick={() => handleUpgrade(selectedPlan)}
            disabled={!!upgradingPlan}
            style={{ width: '100%', background: 'linear-gradient(135deg, #f59e0b, #fb923c)', border: 'none', borderRadius: '12px', padding: '0.8rem', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', opacity: upgradingPlan ? 0.6 : 1 }}
          >
            {upgradingPlan ? 'Redirecting to payment...' : `⭐ Upgrade — ৳${PLANS.find(p => p.key === selectedPlan)?.price} ${PLANS.find(p => p.key === selectedPlan)?.period}`}
          </button>
          <p style={{ color: '#475569', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.6rem' }}>
            Secure payment via Stripe. No auto-renewal.
          </p>
        </div>
      )}

      {isPremium && (
        <div style={{ ...glassCard, background: 'linear-gradient(135deg, rgba(251,146,60,0.08), rgba(251,191,36,0.04))', border: '1px solid rgba(251,146,60,0.25)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
          <div style={{ color: '#fb923c', fontWeight: 700, fontSize: '1.1rem' }}>You are a Premium Member!</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.3rem' }}>Enjoy unlimited reports and priority support.</div>
        </div>
      )}

      {/* Staff Request */}
      <div style={glassCard}>
        <h3 style={{ color: '#34d399', margin: '0 0 0.5rem', fontWeight: 700 }}>🛠️ Become Staff</h3>
        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 1rem' }}>
          Submit a request to the admin to become a staff member. Staff can update issue statuses.
        </p>
        {myRequest ? (
          <div style={{
            padding: '0.85rem 1rem', borderRadius: '10px',
            background: myRequest.status === 'approved' ? 'rgba(52,211,153,0.08)' : myRequest.status === 'rejected' ? 'rgba(244,114,182,0.08)' : 'rgba(251,191,36,0.08)',
            border: `1px solid ${myRequest.status === 'approved' ? 'rgba(52,211,153,0.25)' : myRequest.status === 'rejected' ? 'rgba(244,114,182,0.25)' : 'rgba(251,191,36,0.25)'}`,
          }}>
            <div style={{ color: myRequest.status === 'approved' ? '#34d399' : myRequest.status === 'rejected' ? '#f472b6' : '#fbbf24', fontWeight: 700, fontSize: '0.9rem' }}>
              {myRequest.status === 'approved' ? '✅ Request Approved — You are now staff!' : myRequest.status === 'rejected' ? '❌ Request Rejected' : '⏳ Request Pending Review'}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.25rem' }}>
              Submitted: {myRequest.createdAt ? new Date(myRequest.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        ) : (
          <>
            <label style={labelStyle}>Why do you want to be staff?</label>
            <textarea
              value={staffReason}
              onChange={e => setStaffReason(e.target.value)}
              placeholder="Describe your motivation, experience, or availability..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, marginBottom: '0.75rem' }}
            />
            <button
              onClick={handleStaffRequest}
              disabled={submittingRequest}
              style={{
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem',
                color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                cursor: 'pointer', opacity: submittingRequest ? 0.6 : 1,
              }}
            >
              {submittingRequest ? 'Submitting...' : '🛠️ Submit Request'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CitizenProfile;