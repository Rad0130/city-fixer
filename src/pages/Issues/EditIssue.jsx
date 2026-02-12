import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../Hooks/useAxios';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const EditIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axios = useAxios();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue } = useForm();

  // 🔹 Fetch existing issue
  const { data: issues, isLoading } = useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      const res = await axios.get(`/issues?_id=${id}`);
      return res.data;
    }
  });

  const issue = issues?.[0];

  // 🔹 Prefill form
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

      // 🔹 If new image selected
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
        showConfirmButton: false
      });

      navigate(`/details/${id}`);

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Edit Issue</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <input
          {...register("title")}
          className="input input-bordered w-full"
          placeholder="Issue Title"
        />

        <select {...register("category")} className="select select-bordered w-full">
          <option value="Traffic">Traffic</option>
          <option value="Road Damage">Road Damage</option>
          <option value="Drainage">Drainage</option>
        </select>

        <select {...register("priority")} className="select select-bordered w-full">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <input
          {...register("location")}
          className="input input-bordered w-full"
          placeholder="Location"
        />

        <textarea
          {...register("description")}
          className="textarea textarea-bordered w-full"
          rows="4"
        />

        {/* Current Image Preview */}
        {issue?.image && (
          <div>
            <p className="text-sm mb-2">Current Image:</p>
            <img src={issue.image} alt="issue" className="rounded-lg max-h-60" />
          </div>
        )}

        {/* New Image Upload */}
        <input
          type="file"
          {...register("image")}
          className="file-input file-input-bordered w-full"
        />

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Issue"}
        </button>
      </form>
    </div>
  );
};

export default EditIssue;
