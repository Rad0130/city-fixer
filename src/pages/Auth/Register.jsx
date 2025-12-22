import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import Navbar from '../../components/Navbar';
import { useForm } from 'react-hook-form';
import useAuth from '../../Hooks/useAuth';
import axios from 'axios';

const Register = () => {
    const {register, handleSubmit, formState:{errors}}=useForm();
    const {createUser, googleLogin, updateUserProfile}=useAuth();
    const [error,setError]=useState('');
    const navigate=useNavigate();
    const location=useLocation();

    const handleRegister=data=>{
        console.log(data);
        const profileImage=data.photo[0];
        createUser(data.email, data.password)
        .then(result=>{
            const user=result.user;
            console.log(user);
            navigate(location.state || '/');
            const formData=new FormData();
            formData.append('image', profileImage);
            const Image_url=`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Host}`;
            axios.post(Image_url, formData)
            .then(res=>{
                console.log('after Upload',res.data.data.url);
                const updatedProfile={
                    displayName:data.name,
                    photoURL:res.data.data.url
                }
                updateUserProfile(updatedProfile)
                .then(res=>{
                    console.log(res.user);
                })
                .catch(err=>{
                    console.log(err);
                })
            })
            .catch(err=>{
                console.log(err);
            })
        })
        .catch(error=>{
            console.log(error.message);
            setError(error.message);
        })

    }
    const handleGoogleSignIn=()=>{
        googleLogin().
        then(result=>{
            console.log(result.user);
            navigate(location.state || '/');
        })
        .catch(error=>{
            console.log(error.message);
            setError(error.message);
        })
    }
    return (
        <div>
            <Navbar></Navbar>
            <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Register Now!</h1>
            <p className="py-6">
                Let's build a safer community together. Join us today and start reporting issues in your area to help make a difference!
            </p>
            </div>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
                <form onSubmit={handleSubmit(handleRegister)}>
                    <fieldset className="fieldset">
                        {
                            error && <p className='text-red-500'>{error}</p>
                        }
                    <label className="label">Name</label>
                    <input type="text" {...register('name',{
                        required:true,
                    })} className="input" placeholder="Write Your Name" />
                    {
                        errors.name?.type==='required' && <p className='text-red-500'>Name is required</p>
                    }
                    {/* photo upload field */}
                    <label className='label'>Photo</label>
                    <input type="file" {...register('photo', {
                        required:true
                    })} className="file-input" placeholder='Uplaod Your Photo'/>
                    {
                        errors.photo?.type==='required' && <p className='text-red-500'>Photo is required</p>
                    }
                    {/* email pass field */}
                    <label className="label">Email</label>
                    <input type="email" {...register('email',{
                        required:true,
                    })} className="input" placeholder="Email" />
                    {
                        errors.email?.type==='required' && <p className='text-red-500'>Email is required</p>
                    }
                    <label className="label">Password</label>
                    <input type="password" {...register('password',{
                        required:true,
                        minLength:6
                    })} className="input" placeholder="Password" />
                    {
                        errors.password?.type==='required' && <p className='text-red-500'>Password is required</p>
                    }
                    {
                        errors.password?.type==='minLength' && <p className='text-red-500'>Password must be 6 characters</p>
                    }
                    <button className="btn btn-neutral mt-4">Register</button>
                    <div>Already have an account? <Link state={location.state} className='text-blue-500' to='/login'>Login</Link></div>
                    <button onClick={handleGoogleSignIn} type='button' className="btn bg-white text-black border-[#e5e5e5]">
                    <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                    SignUp with Google
                    </button>
                    </fieldset>
                </form>
            </div>
            </div>
        </div>
        </div>
        </div>
    );
};

export default Register;