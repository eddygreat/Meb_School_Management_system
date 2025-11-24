import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">School Management System</h1>
          <nav>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2">
              Login
            </Link>
            <Link to="/signup" className="ml-2 bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          Streamlining Education, Empowering Minds
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
          Our School Management System provides a seamless, all-in-one platform to connect administrators, teachers, students, and parents. Manage everything from admissions to alumni with ease.
        </p>
        <Link to="/signup" className="bg-green-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-green-600 transition-colors">
          Get Started for Free
        </Link>
      </main>

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-sm font-bold uppercase text-blue-600 tracking-widest">Core Features</h3>
            <h4 className="text-3xl font-bold mt-2">What Our Application Offers</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Feature 1 */}
            <div className="p-8 border border-gray-200 rounded-lg shadow-lg text-center">
              <h5 className="text-xl font-semibold mb-3">Centralized Management</h5>
              <p className="text-gray-600">
                Oversee student enrollment, track attendance, and manage course schedules from a single, intuitive dashboard.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-gray-200 rounded-lg shadow-lg text-center">
              <h5 className="text-xl font-semibold mb-3">Enhanced Communication</h5>
              <p className="text-gray-600">
                Foster a collaborative environment with built-in messaging, announcement boards, and event calendars for the entire school community.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-gray-200 rounded-lg shadow-lg text-center">
              <h5 className="text-xl font-semibold mb-3">Academic Tracking</h5>
              <p className="text-gray-600">
                Empower teachers and students with tools for grade management, assignment submissions, and real-time performance analytics.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} School Management System. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;