// ─── ReportIssue.jsx ──────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { AlertCircle, MapPin, Mail, MessageSquare, Tag } from 'lucide-react';
import { useNavigate } from 'react-router';
import useAuth from '../../Hooks/useAuth';
import Swal from 'sweetalert2';

const ReportIssue = () => {
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const imageFile = data.image[0];
      const formData = new FormData();
      formData.append('image', imageFile);
      const image_url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Host}`;
      const imageRes = await fetch(image_url, { method: 'POST', body: formData });
      const imageData = await imageRes.json();
      if (!imageData.success) throw new Error('Image upload failed');
      const reportData = {
        title: data.title, category: data.category, priority: data.priority,
        location: data.location, reportedBy: user.email, description: data.description,
        image: imageData.data.display_url, status: 'In Progress', upvotes: 0, upvotedBy: [], createdAt: new Date(),
      };
      await axiosSecure.post('/issues', reportData);
      Swal.fire({ icon: 'success', title: 'Issue Reported!', timer: 1500, showConfirmButton: false, background: '#0d1117', color: '#fff' });
      navigate('/allissues');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: 'Something went wrong!', background: '#0d1117', color: '#fff' });
      console.log(error);
    } finally { setLoading(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans',sans-serif" }}>Uploading your report...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)',
      paddingTop: '5.5rem', paddingBottom: '4rem',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
    }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '45vw', height: '45vw', maxWidth: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40vw', height: '40vw', maxWidth: 500, background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2))',
            border: '1px solid rgba(99,102,241,0.35)',
            borderRadius: 999, padding: '0.35rem 1.2rem', marginBottom: '1rem',
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: '#a5b4fc', textTransform: 'uppercase' }}>✦ Submit Report</span>
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.5rem)',
            background: 'linear-gradient(135deg, #fff 30%, #a5b4fc 60%, #22d3ee 90%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: '0.5rem',
          }}>Report an Issue</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem' }}>Help us make your city better — every report counts.</p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 24, overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        }}>
          {/* Form header strip */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(6,182,212,0.2))',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '1.2rem 2rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <AlertCircle size={20} color="#a5b4fc" />
            <div>
              <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: 0, fontFamily: "'Syne',sans-serif" }}>Issue Details</h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', margin: 0 }}>Fill in all fields accurately for faster resolution</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
            {/* Title */}
            <div>
              <label style={labelStyle}>Issue Title</label>
              <input {...register('title', { required: 'Title is required' })} placeholder="e.g., Broken streetlight near school" style={inputStyle(errors.title)} />
              {errors.title && <p style={errMsg}>{errors.title.message}</p>}
            </div>

            {/* Category + Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Tag size={13} color="#818cf8" /> Category
                </label>
                <select {...register('category')} style={selectStyle}>
                  <option value="Traffic">Traffic</option>
                  <option value="Road Damage">Road Damage</option>
                  <option value="Drainage">Drainage</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Priority Level</label>
                <select {...register('priority')} style={selectStyle}>
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟠 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={13} color="#f472b6" /> Location
              </label>
              <input {...register('location', { required: 'Location is required' })} placeholder="e.g., Mirpur 10, Dhaka" style={inputStyle(errors.location)} />
              {errors.location && <p style={errMsg}>{errors.location.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={13} color="#34d399" /> Your Email
              </label>
              <input type="email" defaultValue={user.email} disabled style={{ ...inputStyle(false), opacity: 0.5, cursor: 'not-allowed' }} />
            </div>

            {/* Description */}
            <div>
              <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MessageSquare size={13} color="#22d3ee" /> Description
              </label>
              <textarea {...register('description')} rows="4" placeholder="Describe the issue in detail — what happened, how severe it is..." style={{ ...inputStyle(false), resize: 'vertical', minHeight: 110 }} />
            </div>

            {/* Image */}
            <div>
              <label style={labelStyle}>Upload Photo</label>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px dashed ${errors.image ? 'rgba(236,72,153,0.5)' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 12, padding: '1.2rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}>
                <span style={{ fontSize: '1.5rem' }}>🖼️</span>
                <div>
                  <input type="file" {...register('image', { required: 'Image is required' })} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer' }} />
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', margin: '0.3rem 0 0' }}>JPG, PNG, WEBP accepted</p>
                </div>
              </div>
              {errors.image && <p style={errMsg}>{errors.image.message}</p>}
            </div>

            {/* Submit */}
            <button type="submit" style={{
              width: '100%', padding: '1rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', borderRadius: 14,
              color: '#fff', fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', boxShadow: '0 0 30px rgba(99,102,241,0.45)',
              transition: 'all 0.2s', fontFamily: "'DM Sans',sans-serif",
            }}>
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' };
const inputStyle = (hasError) => ({
  width: '100%', padding: '0.8rem 1rem',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${hasError ? 'rgba(236,72,153,0.5)' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: 10, color: '#fff', fontSize: '0.9rem',
  outline: 'none', fontFamily: "'DM Sans',sans-serif", boxSizing: 'border-box',
});
const selectStyle = {
  width: '100%', padding: '0.8rem 1rem',
  background: 'rgba(13,17,30,0.8)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: '#fff', fontSize: '0.9rem',
  outline: 'none', fontFamily: "'DM Sans',sans-serif", cursor: 'pointer',
};
const errMsg = { color: '#f472b6', fontSize: '0.78rem', marginTop: '0.35rem' };

export default ReportIssue;