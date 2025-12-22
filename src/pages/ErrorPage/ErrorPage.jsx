import React from 'react';
import { Link } from 'react-router';

const ErrorPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
            <div className="text-center">
                {/* 404 Title/Code */}
                <h1 className="text-9xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    404
                </h1>
                
                {/* Error Message */}
                <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">
                    Page Not Found
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Oops! The URL you requested seems to be incorrect or the page has been moved.
                    Don't worry, we'll help you get back on track.
                </p>
                
                {/* Go Back Home Button */}
                <Link 
                    to="/" 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                    <svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
                        ></path>
                    </svg>
                    Go Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;