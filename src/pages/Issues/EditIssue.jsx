import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../Hooks/useAxios';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { AlertCircle, MapPin, MessageSquare, Tag } from 'lucide-react';

const EditIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axios = useAxios();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue } = useForm();

  const { data: issues, isLoading } = useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      const res = await axios.get(`/issues?_id=${id}`);
      return res.data;
    }
  });

  const issue = issues?.[0];

  useEffect(() => {
    if (issue) {
      setValue("title", issue.title);
      setValue("category", issue.category);
      setValue("priority", issue.priority);
      setValue("location", issue.location);
      setValue("description", issue.description);
    }
  }, [issue, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      let imageLink = issue.image;

      if (data.image?.length > 0) {
        const formData = new FormData();
        formData.append("image", data.image[0]);

        const image_url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Host}`;

        const res = await fetch(image_url, {
          method: "POST",
          body: formData
        });

        const imageData = await res.json();
        imageLink = imageData.data.display_url;
      }

      const updatedData = {
        title: data.title,
        category: data.category,
        priority: data.priority,
        location: data.location,
        description: data.description,
        image: imageLink
      };

      await axiosSecure.patch(`/issues/${id}`, updatedData);

      Swal.fire({
        icon: "success",
        title: "Issue Updated Successfully",
        timer: 1500,
        showConfirmButton: false,
        background: '#0d1117',
        color: '#fff'
      });

      navigate(`/details/${id}`);

    } catch (error) {
      Swal.fire("Error", "Update failed", "error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return (
    <div style={loaderStyle}>
      <div style={spinnerStyle} />
      <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading issue...</p>
    </div>
  );

  return (
    <div style={pageStyle}>
      {/* Background Effects */}
      <div style={bgWrapper}>
        <div style={bgCircle1} />
        <div style={bgCircle2} />
        <div style={gridBg} />
      </div>

      <div style={container}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={titleStyle}>Edit Issue</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>
            Update your issue details
          </p>
        </div>

        {/* Card */}
        <div style={cardStyle}>
          <div style={cardHeader}>
            <AlertCircle size={20} color="#a5b4fc" />
            <h2 style={{ color: '#fff' }}>Edit Details</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>

            <input {...register("title")} placeholder="Title" style={inputStyle()} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <select {...register("category")} style={selectStyle}>
                <option>Traffic</option>
                <option>Road Damage</option>
                <option>Drainage</option>
              </select>

              <select {...register("priority")} style={selectStyle}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <input {...register("location")} placeholder="Location" style={inputStyle()} />

            <textarea {...register("description")} rows="4" style={inputStyle()} />

            {/* Image Preview */}
            {issue?.image && (
              <img src={issue.image} style={{ borderRadius: 12, maxHeight: 200 }} />
            )}

            <input type="file" {...register("image")} style={{ color: '#fff' }} />

            <button style={btnStyle} disabled={loading}>
              {loading ? "Updating..." : "Update Issue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* Styles */
const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg,#0a0a1a,#0d1b3e,#0f0a2e)',
  paddingTop: '5rem'
};

const container = { maxWidth: 600, margin: '0 auto', padding: '1rem', position: 'relative', zIndex: 1 };

const titleStyle = {
  fontSize: '2rem',
  fontWeight: 800,
  background: 'linear-gradient(135deg,#fff,#a5b4fc,#22d3ee)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const cardStyle = {
  background: 'rgba(255,255,255,0.05)',
  borderRadius: 20,
  backdropFilter: 'blur(20px)',
  padding: '2rem'
};

const cardHeader = { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };

const inputStyle = () => ({
  padding: '0.8rem',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.05)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.1)'
});

const selectStyle = inputStyle();

const btnStyle = {
  padding: '1rem',
  borderRadius: 12,
  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
  color: '#fff',
  border: 'none',
  fontWeight: 700,
  cursor: 'pointer'
};

const loaderStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
};

const spinnerStyle = {
  width: 50,
  height: 50,
  borderRadius: '50%',
  border: '3px solid rgba(255,255,255,0.2)',
  borderTop: '3px solid #6366f1',
  animation: 'spin 1s linear infinite'
};

const bgWrapper = { position: 'fixed', inset: 0 };
const bgCircle1 = { position: 'absolute', top: 0, right: 0, width: 300, height: 300, background: 'rgba(99,102,241,0.2)', borderRadius: '50%' };
const bgCircle2 = { position: 'absolute', bottom: 0, left: 0, width: 300, height: 300, background: 'rgba(6,182,212,0.2)', borderRadius: '50%' };
const gridBg = { position: 'absolute', inset: 0 };

export default EditIssue;