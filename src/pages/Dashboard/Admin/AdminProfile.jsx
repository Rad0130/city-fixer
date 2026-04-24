// /home/shafiur/City-Fixer/src/pages/Dashboard/Admin/AdminProfile.jsx
import { useState, useRef } from 'react';
import useAuth from '../../../Hooks/useAuth';
import { glassCard, inputStyle, labelStyle, primaryBtn } from './components/styles';

const AdminProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.photoURL || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('Image must be under 10MB'); return; }
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
    if (!data.success) throw new Error('Upload failed');
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
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setUploading(false);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const currentPhoto = imagePreview || user?.photoURL || '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 560 }}>
      <div>
        <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Admin Profile</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.9rem' }}>Manage your account details</p>
      </div>

      {/* Avatar + Info */}
      <div style={{ ...glassCard, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', color: '#fff', fontWeight: 700,
            border: '3px solid rgba(99,102,241,0.4)', overflow: 'hidden',
          }}>
            {currentPhoto
              ? <img src={currentPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (user?.displayName || user?.email)?.[0]?.toUpperCase()}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 26, height: 26, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: '2px solid #0a0a1a', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem',
            }}
            title="Change photo"
          >📷</button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
        <div>
          <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '1.1rem' }}>{user?.displayName || 'Admin'}</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{user?.email}</div>
          {imageFile && <div style={{ color: '#818cf8', fontSize: '0.72rem', marginTop: '0.25rem' }}>📎 {imageFile.name} — save to apply</div>}
          <span style={{ display: 'inline-block', marginTop: '0.4rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '6px', padding: '0.2rem 0.7rem', fontSize: '0.7rem', fontWeight: 700 }}>
            🔑 ADMIN
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
            background: 'rgba(99,102,241,0.06)', border: '1px dashed rgba(99,102,241,0.35)',
            borderRadius: '12px', padding: '0.85rem 1rem',
            cursor: 'pointer', marginBottom: '1rem',
          }}
        >
          {currentPhoto
            ? <img src={currentPhoto} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            : <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📷</div>}
          <div>
            <div style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.85rem' }}>{imageFile ? imageFile.name : 'Click to upload photo'}</div>
            <div style={{ color: '#475569', fontSize: '0.72rem' }}>{imageFile ? `${(imageFile.size / 1024).toFixed(0)} KB` : 'JPG, PNG, WEBP — max 10MB'}</div>
          </div>
        </div>

        <label style={labelStyle}>Email Address</label>
        <input value={user?.email || ''} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />

        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={handleSave} disabled={saving || uploading} style={{ ...primaryBtn, opacity: (saving || uploading) ? 0.6 : 1 }}>
            {uploading ? '⬆️ Uploading...' : saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && <span style={{ color: '#34d399', fontSize: '0.85rem' }}>✅ Profile updated!</span>}
        </div>
      </div>

      {/* Security Info */}
      <div style={glassCard}>
        <h3 style={{ color: '#e2e8f0', margin: '0 0 1rem', fontWeight: 700 }}>Account Security</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[
            { label: 'Email Verified', desc: 'Your email address is verified', value: user?.emailVerified ? '✅' : '⚠️' },
            { label: 'Role', desc: 'Full administrative access', value: 'ADMIN', color: '#818cf8' },
            { label: 'Last Sign In', desc: user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600 }}>{item.label}</div>
                <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{item.desc}</div>
              </div>
              {item.value && <span style={{ color: item.color || '#94a3b8', fontWeight: 700 }}>{item.value}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;