import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignedUp, setIsSignedUp] = useState(false);
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Simulate a successful signup
    console.log('Signing up with:', { email, password });
    setIsSignedUp(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {user && (
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
        {isSignedUp ? (
          <div className="text-center bg-white p-8 shadow-lg rounded-lg">
            <h3 className="text-2xl font-bold text-green-600">Signup Successful!</h3>
            <p className="mt-2 text-gray-600">You can now proceed to log in.</p>
            <Link to="/login" className="mt-4 inline-block w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Go to Login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6 bg-white p-8 shadow-lg rounded-lg" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div><input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Email address" /></div>
              <div><input name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Password" /></div>
              <div><input name="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Confirm Password" /></div>
            </div>
            <div><button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Create Account</button></div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;