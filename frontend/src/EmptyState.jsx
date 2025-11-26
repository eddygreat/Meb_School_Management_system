import React from 'react';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

const EmptyState = ({ title, message }) => {
  return (
    <div className="text-center p-12 border-2 border-dashed rounded-lg bg-gray-50">
      <DocumentMagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;