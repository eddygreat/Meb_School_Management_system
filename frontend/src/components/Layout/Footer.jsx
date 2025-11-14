import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
        <p className="text-center text-base text-gray-500">
          &copy; {currentYear} School Management System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
