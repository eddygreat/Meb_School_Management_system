import React from 'react';

const Input = ({ label, value, onChange, ...props }) => (
  <label className="block">
    <span className="text-sm text-gray-700">{label}</span>
    <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
           value={value} onChange={(e) => onChange(e.target.value)} {...props} />
  </label>
);

export default Input;