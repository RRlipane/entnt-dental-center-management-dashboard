
import React from 'react';

interface Props {
 
  fullPage?: boolean;
}


const LoadingSpinner: React.FC<Props> = ({ fullPage = false }) => (
  <div
    role="status"
    aria-label="Loading"
    className={`flex items-center justify-center ${
      fullPage ? 'fixed inset-0 bg-white/70 z-50' : ''
    }`}
  >
    <svg
      className="h-8 w-8 animate-spin text-indigo-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8h4l-3 3 3 3h-4a12 12 0 1012-12 12 12 0 00-12 12z"
      />
    </svg>
  </div>
);

export default LoadingSpinner;
