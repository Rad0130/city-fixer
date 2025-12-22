import React from 'react';
import { Link } from 'react-router';

const NoIssuesFound = ({ 
  title = "No Issues Found", 
  message = "We couldn't find any issues matching your criteria.",
  showResetButton = true,
  showReportButton = true,
  filtersApplied = false 
}) => {
  const handleResetFilters = () => {
    // This function should be passed from parent or use context
    window.location.reload(); // Simple reload for demo
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Illustration/Icon */}
        <div className="mb-8">
          <div className="relative w-40 h-40 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full animate-pulse"></div>
            <div className="absolute inset-6 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full"></div>
            <svg 
              className="absolute inset-8 w-24 h-24 text-gray-600"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-8 text-lg">
          {message}
          {filtersApplied && (
            <span className="block mt-2 text-sm text-gray-500">
              Try adjusting your filters or search terms.
            </span>
          )}
        </p>

        {/* Stats/Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-blue-800">Issues Found</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <div className="text-2xl font-bold text-green-600">✓</div>
            <div className="text-sm text-green-800">Clean City</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">+</div>
            <div className="text-sm text-purple-800">Be First Reporter</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {showResetButton && (
            <button
              onClick={handleResetFilters}
              className="btn btn-outline btn-primary px-8 py-3 rounded-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset All Filters
            </button>
          )}
          
          {showReportButton && (
            <Link
              to="/report-issue"
              className="btn btn-primary px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Report New Issue
            </Link>
          )}
        </div>

        {/* Tips */}
        <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Search Tips
          </h3>
          <ul className="text-left text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Try different keywords or spelling
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Clear some filters to broaden results
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Check if you're in the right location/category
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Be the first to report an issue in your area
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NoIssuesFound;