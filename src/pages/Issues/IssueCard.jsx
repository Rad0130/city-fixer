import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import useAxios from '../../Hooks/useAxios';
import useAuth from '../../Hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';

const IssueCard = ({issue}) => {
    const {title,status,priority,category,_id,location,upvotes,image,reportedBy}=issue;
    const axios=useAxios();
    const {user}=useAuth();
    const navigate=useNavigate();

    const [votes,setVotes]=useState(upvotes);

    const handleVotes = async () => {
    if (!user) {
        navigate('/login');
        return;
    }

    if(user.email===reportedBy){
        toast("You can not update your own issue");
        return
    }

    try {
        await axios.patch(`/issues/${_id}/upvote`, {
        email: user.email
        });

        setVotes(prev => prev + 1);
    } catch (err) {
        if (err.response?.status === 409) {
        toast("You already upvoted it");
        }
    }
    };
    return (
        <div class="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:-translate-y-1">
  
        <div class="absolute top-0 left-0 h-2 w-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div class="flex justify-between items-start mb-4">
            <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span class="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                {status}
            </span>
            </div>
            
            <span class="bg-linear-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {priority}
            </span>
        </div>
        
        <div class="mb-4 overflow-hidden rounded-xl">
            <img 
            src={image} 
            alt={title}
            class="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-500"
            />
        </div>
        
        <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
            {title}
        </h3>

        <div class="mb-4 space-y-2">
            <div class="flex items-center text-gray-600">
            <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span class="font-medium">{category}</span>
            </div>
            
            <div class="flex items-center text-gray-600">
            <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="font-medium">{location}</span>
            </div>
        </div>
        
        <div class="border-t border-gray-200 my-4"></div>
        
        <div class="flex items-center justify-between">
            <button onClick={handleVotes} class="group flex items-center space-x-2 bg-linear-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer">
            <svg class="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {/* <span class="font-bold text-gray-800">{votes}</span> */}
            <span class="text-sm text-gray-600">{votes}</span>
            </button>
            <ToastContainer />
            
            <Link to={`/details/${_id}`} class="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
            View Details
            </Link>
        </div>
        </div>
    );
};

export default IssueCard;