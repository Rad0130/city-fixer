import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../Hooks/useAxios';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
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
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '12px', padding: '0.75rem 1rem',
  color: '#e2e8f0', fontSize: '0.9rem', outline: 'none',
  width: '100%', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
};
const labelStyle = {
  color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem',
};
const fieldWrap = { display: 'flex', flexDirection: 'column', gap: '0.35rem' };

const EditIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axios = useAxios();
  const axiosSecure = useAxiosSecure();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ title: '', description: '', category: '', location: '', priority: 'Normal', image: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: issue, isLoading } = useQuery({
    queryKey: ['issue-edit', id],
    queryFn: async () => {
      const res = await axios.get(`/issues/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (issue) {
      setForm({
        title: issue.title || '',
        description: issue.description || '',
        category: issue.category || '',
        location: issue.location || '',
        priority: issue.priority === 'High' ? 'High' : 'Normal',
        image: issue.image || '',
      });
      setImagePreview(issue.image || '');
    }
  }, [issue]);

  const setFormField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({ title: 'Invalid file', text: 'Please select an image file', icon: 'warning', background: '#0d1117', color: '#fff' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({ title: 'File too large', text: 'Image must be smaller than 10MB', icon: 'warning', background: '#0d1117', color: '#fff' });
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

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormField('image', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { Swal.fire({ title: 'Title is required', icon: 'warning', background: '#0d1117', color: '#fff' }); return; }
    if (!form.category) { Swal.fire({ title: 'Please select a category', icon: 'warning', background: '#0d1117', color: '#fff' }); return; }

    setSubmitting(true);
    try {
      let imageUrl = form.image;
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadToImgbb(imageFile);
        setUploading(false);
      }

      await axiosSecure.patch(`/issues/${id}`, {
        ...form,
        image: imageUrl,
      });
      Swal.fire({ title: 'Issue updated!', icon: 'success', timer: 1500, showConfirmButton: false, background: '#0d1117', color: '#fff' });
      navigate(`/details/${id}`);
    } catch (err) {
      Swal.fire({ title: err?.response?.data?.message || 'Failed to update', icon: 'error', background: '#0d1117', color: '#fff' });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  if (isLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a1a' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  const isLoadingForm = submitting || uploading;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 50%, #0f0a2e 100%)', fontFamily: "'DM Sans', sans-serif", paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 1.25rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem', padding: 0, marginBottom: '0.75rem', fontFamily: "'DM Sans', sans-serif" }}>
            ← Back
          </button>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>✏️ Edit Issue</h1>
          {issue?.trackingId && (
            <span style={{ display: 'inline-block', marginTop: '0.4rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '6px', padding: '0.2rem 0.7rem', color: '#818cf8', fontSize: '0.75rem', fontFamily: 'monospace' }}>
              🔖 {issue.trackingId}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div style={fieldWrap}>
            <label style={labelStyle}>Issue Title *</label>
            <input value={form.title} onChange={e => setFormField('title', e.target.value)} style={inputStyle} required />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Category *</label>
            <select value={form.category} onChange={e => setFormField('category', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} required>
              <option value="">— Select a category —</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Location *</label>
            <input value={form.location} onChange={e => setFormField('location', e.target.value)} style={inputStyle} required />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Priority</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['Normal', 'High'].map(p => (
                <button key={p} type="button" onClick={() => setFormField('priority', p)} style={{
                  flex: 1, padding: '0.65rem 1rem', borderRadius: '10px',
                  border: `2px solid ${form.priority === p ? (p === 'High' ? 'rgba(239,68,68,0.5)' : 'rgba(99,102,241,0.5)') : 'rgba(255,255,255,0.08)'}`,
                  background: form.priority === p ? (p === 'High' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)') : 'rgba(255,255,255,0.03)',
                  color: form.priority === p ? (p === 'High' ? '#f87171' : '#818cf8') : '#64748b',
                  fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                }}>
                  {p === 'High' ? '🔴 High' : '🟡 Normal'}
                </button>
              ))}
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={e => setFormField('description', e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
          </div>

          {/* Image Upload Section */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Issue Photo</label>

            {!imagePreview ? (
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
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼️</div>
                <p style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.9rem', margin: '0 0 0.25rem' }}>Click to upload a photo</p>
                <p style={{ color: '#475569', fontSize: '0.78rem', margin: 0 }}>JPG, PNG, WEBP, GIF — max 10MB</p>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.3)' }} />
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{ background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)', borderRadius: 8, padding: '0.25rem 0.7rem', color: '#f472b6', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    ✕ Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, padding: '0.25rem 0.7rem', color: '#818cf8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    📷 Change
                  </button>
                </div>
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            
            {uploading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22d3ee', fontSize: '0.82rem', marginTop: '0.35rem' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(6,182,212,0.3)', borderTop: '2px solid #22d3ee', animation: 'spin 0.8s linear infinite' }} />
                Uploading image...
              </div>
            )}
          </div>

          <button type="submit" disabled={isLoadingForm} style={{
            background: isLoadingForm ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '12px', padding: '0.85rem',
            color: '#fff', fontWeight: 700, fontSize: '1rem',
            cursor: isLoadingForm ? 'not-allowed' : 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            opacity: isLoadingForm ? 0.7 : 1,
          }}>
            {isLoadingForm ? (
              <>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', animation: 'spin 0.8s linear infinite' }} />
                {uploading ? 'Uploading image...' : 'Saving...'}
              </>
            ) : '💾 Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditIssue;