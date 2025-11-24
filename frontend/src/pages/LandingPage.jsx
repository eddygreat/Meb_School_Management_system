import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">EduPortal</h1>
          <nav>
            <Link to="/login" className="px-4 py-2 text-lg font-semibold text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link
              to="/signup"
              className="ml-4 px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="text-center py-20 px-6 bg-white">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">The Future of School Management</span>
          <span className="block text-blue-600">Starts Here.</span>
        </h2>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          A seamless, integrated platform for administrators, teachers, students, and parents. Manage everything from attendance to analytics in one place.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              to="/signup"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link
              to="/login"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
            >
              Log In
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            A Solution for Everyone
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold text-blue-600 mb-2">For Admins</h4>
              <p className="text-gray-600">Centralize user management, timetables, invoicing, and school-wide analytics.</p>
            </div>
            {/* Feature Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold text-blue-600 mb-2">For Teachers</h4>
              <p className="text-gray-600">Manage curriculum, enter grades, take attendance, and communicate with parents.</p>
            </div>
            {/* Feature Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold text-blue-600 mb-2">For Students</h4>
              <p className="text-gray-600">Access timetables, view assignments, check grades, and manage check-ins.</p>
            </div>
            {/* Feature Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold text-blue-600 mb-2">For Parents</h4>
              <p className="text-gray-600">Stay informed with access to invoices, messages, and your child's academic progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} EduPortal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;