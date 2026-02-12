import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { AlertCircle, MapPin, Mail, MessageSquare, Tag } from 'lucide-react'; // Optional: install lucide-react
import { useNavigate } from 'react-router';
import useAuth from '../../Hooks/useAuth';

const ReportIssue = () => {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading,setloading]=useState(false);
    const navigate=useNavigate();
    const {user}=useAuth();

    const onSubmit = async (data) => {
        // Formatting the data to match your JSON structure
        setloading(true);
        const reportData = {
            ...data,
            status: "In Progress",
            upvotes: 0,
            createdAt: new Date().toISOString(),
            priorityOrder: data.priority === "High" ? 1 : 2
        };

        try {
            const res = await axiosSecure.post('/issues', reportData);
            setloading(false);
            console.log("Report submitted successfully", res.data);
            navigate('/allissues');

            // Add a toast notification here!
        } catch (err) {
            console.error("Error submitting report", err);
            setloading(false);
        }
    };
    if(loading){
        return <div className='flex justify-center items-center min-h-screen'>
            <span className="loading loading-spinner text-primary"></span>
        </div>
    }
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 mt-15">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header Section */}
                <div className="bg-linear-to-r from-indigo-600 to-blue-500 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <AlertCircle className="w-6 h-6" /> Report a Traffic Issue
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">Help us make Dhaka's roads safer for everyone.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    
                    {/* Title Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Title</label>
                        <div className="relative">
                            <input 
                                {...register("title", { required: "Title is required" })}
                                placeholder="e.g., Flickering Traffic Light"
                                className={`w-full pl-4 pr-4 py-3 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-500 outline-none transition`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Category
                            </label>
                            <select 
                                {...register("category")}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
                            >
                                <option value="Traffic">Traffic</option>
                                <option value="Road Damage">Road Damage</option>
                                <option value="Drainage">Drainage</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level</label>
                            <select 
                                {...register("priority")}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Location
                        </label>
                        <input 
                            {...register("location", { required: "Location is required" })}
                            placeholder="e.g., Banglamotor, Dhaka"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>

                    {/* Reported By (Email) */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Your Email
                        </label>
                        <input 
                            {...register("reportedBy", { required: "Email is required" })}
                            type="email"
                            defaultValue={user.email}
                            disabled
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Description
                        </label>
                        <textarea 
                            {...register("description")}
                            rows="4"
                            placeholder="Describe the issue in detail..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        ></textarea>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                        <input 
                            {...register("image")}
                            placeholder="https://i.postimg.cc/..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 cursor-pointer"
                    >
                        Submit Report
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportIssue;