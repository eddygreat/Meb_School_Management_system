import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftOnRectangleIcon, FaceSmileIcon } from '@heroicons/react/24/solid';
import apiClient from '../api/apiClient';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Call Register API
      await apiClient.post('/auth/register', {
        email,
        password,
        role,
        full_name: email.split('@')[0]
      });

      // 2. Auto-login after successful registration
      const loginResponse = await apiClient.post('/auth/login', {
        email: email,
        password: password,
      });

      if (loginResponse.data.access_token) {
        login(loginResponse.data.access_token); // Update context with token
        setIsSignedUp(true);
      } else {
        setIsSignedUp(true);
      }

    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {user && !isSignedUp && (
          <div className="text-center">
            <p className="text-sm text-gray-600">You are already logged in.</p>
            <Link
              to={`/${user.role}/dashboard`}
              className="mt-2 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
              Return to Dashboard
            </Link>
          </div>
        )}

        {!isSignedUp ? (
          <>
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create a new account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  sign in to your existing account
                </Link>
              </p>
            </div>

            <form className="mt-8 space-y-6 bg-white p-8 shadow-lg rounded-lg" onSubmit={handleSubmit}>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}

              <div className="rounded-md shadow-sm -space-y-px">
                <div className="mb-4">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="parent">Parent</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <input
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <input
                    name="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center bg-white p-8 shadow-lg rounded-lg">
            <h3 className="text-2xl font-bold text-green-600 mb-4">Signup Successful!</h3>
            <p className="text-gray-600 mb-6">Your account has been created and you are now logged in.</p>

            <div className="space-y-4">
              <Link
                to="/face-enroll"
                className="flex items-center justify-center w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 shadow-md transition-all transform hover:scale-105"
              >
                <FaceSmileIcon className="h-6 w-6 mr-2" />
                Set up Face ID Now
              </Link>

              <Link
                to={`/${role}/dashboard`}
                className="inline-block w-full py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Skip for now (Go to Dashboard)
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;