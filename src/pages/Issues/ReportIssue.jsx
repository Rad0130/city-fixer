import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';
import useRole from '../../Hooks/useRole';
import Swal from 'sweetalert2';

const CATEGORIES = [
  'Road & Pavement', 'Pothole', 'Water Supply', 'Water Logging',
  'Drainage & Sewage', 'Electricity & Lighting', 'Street Lighting',
  'Waste & Sanitation', 'Garbage Collection', 'Parks & Green Spaces',
  'Public Transport', 'Traffic & Signals', 'Bridge & Overpass',
  'Building & Construction', 'Illegal Construction', 'Footpath & Sidewalk',
  'Noise Pollution', 'Air Pollution', 'Flooding', 'Tree Hazard',
  'Vandalism', 'Public Property Damage', 'Gas Leak', 'Fire Hazard',
  'School & Education Facility', 'Hospital & Health Facility',
  'Market & Public Space', 'Other',
];

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '12px', padding: '0.75rem 1rem',
  color: '#e2e8f0', fontSize: '0.9rem', outline: 'none',
  width: '100%', boxSizing: 'border-box',
  fontFamily: "'DM Sans', sans-serif",
};
const labelStyle = {
  color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.08em',
  display: 'block', marginBottom: '0.4rem',
};
const fieldWrap = { display: 'flex', flexDirection: 'column', gap: '0.35rem' };

const ReportIssue = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = useRole();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '', description: '', category: '', location: '', priority: 'Normal',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      Swal.fire({ title: 'Invalid file', text: 'Please select an image file (JPG, PNG, WEBP, GIF)', icon: 'warning', background: '#0d1117', color: '#fff' });
      return;
    }
    // Validate size (max 10MB for imgbb)
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({ title: 'File too large', text: 'Image must be smaller than 10MB', icon: 'warning', background: '#0d1117', color: '#fff' });
      return;
    }

    setImageFile(file);
    // Create local preview URL
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadToImgbb = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Host}`;
    setUploadProgress('Uploading image...');
    const res = await fetch(url, { method: 'POST', body: formData });
    const data = await res.json();
    if (!data.success) throw new Error('Image upload failed');
    setUploadProgress('');
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) { Swal.fire({ title: 'Title is required', icon: 'warning', background: '#0d1117', color: '#fff' }); return; }
    if (!form.category) { Swal.fire({ title: 'Please select a category', icon: 'warning', background: '#0d1117', color: '#fff' }); return; }
    if (!form.location.trim()) { Swal.fire({ title: 'Location is required', icon: 'warning', background: '#0d1117', color: '#fff' }); return; }

    setSubmitting(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadToImgbb(imageFile);
        setUploading(false);
      }

      await axiosSecure.post('/issues', {
        ...form,
        image: imageUrl,
        reportedBy: user.email,
        status: 'Pending',
        upvotes: 0,
        upvotedBy: [],
      });

      Swal.fire({
        title: '🎉 Issue Reported!',
        text: 'Your issue has been submitted successfully.',
        icon: 'success', background: '#0d1117', color: '#fff', confirmButtonColor: '#6366f1',
      });
      navigate('/dashboard/myissues');
    } catch (err) {
      setUploading(false);
      setUploadProgress('');
      const msg = err?.response?.data?.message || err?.message || 'Failed to report issue';
      Swal.fire({ title: 'Error', text: msg, icon: 'error', background: '#0d1117', color: '#fff' });
    } finally {
      setSubmitting(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isLoading = submitting || uploading;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 50%, #0f0a2e 100%)',
      fontFamily: "'DM Sans', sans-serif",
      paddingTop: '5rem', paddingBottom: '4rem',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>📝 Report an Issue</h1>
          <p style={{ color: '#64748b', marginTop: '0.3rem', fontSize: '0.9rem' }}>
            {isPremium ? '⭐ Premium — unlimited reports' : 'Free plan — limited to 3 reports. Upgrade for unlimited.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', padding: '2rem',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}>

          {/* Title */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Issue Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Large pothole on Main Street" style={inputStyle} />
          </div>

          {/* Category */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Category *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer', background: 'rgba(13,17,30,0.8)' }}>
              <option value="" style={{ background: '#0d1117' }}>— Select a category —</option>
              {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0d1117' }}>{c}</option>)}
            </select>
          </div>

          {/* Location */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Location *</label>
            <input value={form.location} onChange={e => set('location', e.target.value)}
              placeholder="e.g. Mirpur 10, Dhaka" style={inputStyle} />
          </div>

          {/* Priority */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Priority</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['Normal', 'High'].map(p => (
                <button key={p} type="button" onClick={() => set('priority', p)} style={{
                  flex: 1, padding: '0.65rem 1rem', borderRadius: '10px',
                  border: `2px solid ${form.priority === p ? (p === 'High' ? 'rgba(239,68,68,0.5)' : 'rgba(99,102,241,0.5)') : 'rgba(255,255,255,0.08)'}`,
                  background: form.priority === p ? (p === 'High' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)') : 'rgba(255,255,255,0.03)',
                  color: form.priority === p ? (p === 'High' ? '#f87171' : '#818cf8') : '#64748b',
                  fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {p === 'High' ? '🔴 High' : '🟡 Normal'}
                </button>
              ))}
            </div>
            <p style={{ color: '#475569', fontSize: '0.75rem', margin: '0.3rem 0 0' }}>
              Mark as High only for immediate danger or severe disruption.
            </p>
          </div>

          {/* Description */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Describe the issue in detail — what, where, how severe..."
              rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
          </div>

          {/* ── IMAGE UPLOAD (imgbb) ── */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Photo of the Issue</label>

            {/* Upload area — hidden when image selected */}
            {!imagePreview && (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(99,102,241,0.35)',
                  borderRadius: '14px',
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(99,102,241,0.04)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; e.currentTarget.style.background = 'rgba(99,102,241,0.04)'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼️</div>
                <p style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.9rem', margin: '0 0 0.25rem' }}>
                  Click to upload a photo
                </p>
                <p style={{ color: '#475569', fontSize: '0.78rem', margin: 0 }}>
                  JPG, PNG, WEBP, GIF — max 10MB
                </p>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {/* Preview */}
            {imagePreview && (
              <div style={{ position: 'relative' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.3)', display: 'block' }}
                />
                {/* File name + size info */}
                {imageFile && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                      📎 {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={removeImage}
                      style={{ background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)', borderRadius: 8, padding: '0.25rem 0.7rem', color: '#f472b6', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
                {/* Change button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ marginTop: '0.4rem', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, padding: '0.35rem 0.9rem', color: '#818cf8', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
                >
                  📷 Change Photo
                </button>
              </div>
            )}

            {/* Upload progress indicator */}
            {uploadProgress && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22d3ee', fontSize: '0.82rem', marginTop: '0.35rem' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(6,182,212,0.3)', borderTop: '2px solid #22d3ee', animation: 'spin 0.8s linear infinite' }} />
                {uploadProgress}
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: isLoading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', borderRadius: '12px', padding: '0.9rem',
              color: '#fff', fontWeight: 700, fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: isLoading ? 'none' : '0 0 25px rgba(99,102,241,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', animation: 'spin 0.8s linear infinite' }} />
                {uploading ? 'Uploading image...' : 'Submitting...'}
              </>
            ) : (
              '📝 Submit Issue Report'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;