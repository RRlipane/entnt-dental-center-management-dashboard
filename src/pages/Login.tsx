// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login }   = useAuth();
  const navigate     = useNavigate();

  const [form,  setForm]  = useState({ email: '', password: '' });
  const [errMsg, setErr]  = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  /* ------------ input change ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errMsg) setErr('');
  };

  /* ------------ submit ---------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const error = await login(form.email, form.password); // ↔ returns string | null
    if (!error) {
      toast.success('Login successful');
      navigate('/dashboard', { replace: true });
    } else {
      setErr(error);
      toast.error(error);
    }
    setLoading(false);
  };

  /* ------------ UI -------------------------- */
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <header className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or&nbsp;
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </header>

        {errMsg && (
          <div className="rounded-md bg-red-50 p-4 text-red-800">{errMsg}</div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* email --------------------------------------------------- */}
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3
                         placeholder-gray-400 focus:border-indigo-500 focus:outline-none
                         focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* password ----------------------------------------------- */}
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="current-password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-10
                         placeholder-gray-400 focus:border-indigo-500 focus:outline-none
                         focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              aria-label={showPwd ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPwd ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* remember / forgot ------------------------------------- */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-900">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </Link>
          </div>

          {/* submit ------------------------------------------------- */}
          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-md bg-indigo-600
                       py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                       disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <svg
                className="h-5 w-5 animate-spin"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
