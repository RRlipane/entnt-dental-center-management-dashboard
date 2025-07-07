// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ExclamationTriangleIcon,   
  HomeIcon,
  MapIcon,                   
} from '@heroicons/react/24/outline';

import { useTheme } from '../context/ThemeContext';

const NotFound: React.FC = () => {
  const { theme } = useTheme();           
  const dark = theme === 'dark';

  /* quick‑link helper */
  const links = [
    { to: '/about',    label: 'About Us'   },
    { to: '/contact',  label: 'Contact'    },
    { to: '/services', label: 'Services'   },
    { to: '/blog',     label: 'Blog'       },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex flex-col items-center justify-center p-4
        ${dark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
    >
      <div className="w-full max-w-md text-center">
        {/* animated warning icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="inline-block mb-6"
        >
          <ExclamationTriangleIcon className="h-16 w-16 mx-auto text-yellow-500" />
        </motion.div>

        <h1 className="text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className={`text-lg mb-8 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* main actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 rounded-lg font-medium
                       text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            <HomeIcon className="mr-2 h-5 w-5" />
            Back to Home
          </Link>

          <Link
            to="/explore"
            className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition
              ${dark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
          >
            <MapIcon className="mr-2 h-5 w-5" />
            Explore Content
          </Link>
        </div>

        {/* popular pages */}
        <div className={`mt-12 p-4 rounded-lg ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h3 className="font-medium mb-2">Popular Pages</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1 text-sm rounded-md transition
                  ${dark
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-white hover:bg-gray-200'}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;
