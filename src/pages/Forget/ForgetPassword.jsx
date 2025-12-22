import React, { useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { useLocation } from 'react-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../Firebase/firebase.config';

const ForgetPassword = () => {
    const emailref=useRef();
    const location=useLocation();
    const email=location.state?.email || '';

    useEffect(()=>{
        if(emailref.current){
            emailref.current.value=email;
        }
    },[email]);

    const handleResetPassword=()=>{
        const email=emailref.current.value;
        sendPasswordResetEmail(auth, email)
        .then(()=>{
            window.open("https://mail.google.com", "_blank")
        })
        .catch((error)=>{
            console.error('Error sending password reset email:', error);
            alert('Error sending password reset email. Please try again.');
        });
    }

    
    return (
        <div>
            <div className='px-0 md:px-30 mb-50'>
                <Navbar></Navbar>
            </div>
            <div className="hero">
        <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
                <form>
                    <fieldset className="fieldset">
                        <h1 className='font-bold text-3xl text-center'>Reset You Password</h1>
                    <label className="label">Email</label>
                    <input type="email" className="input" ref={emailref} placeholder="Email" />
                    <button onClick={handleResetPassword} type='button' className="btn bg-linear-to-r from-cyan-500 to-blue-500 mt-4 text-white cursor-pointer">Reset Password</button>
                    </fieldset>
                </form>
            </div>
            </div>
        </div>
        </div>
        </div>
    );
};

export default ForgetPassword;