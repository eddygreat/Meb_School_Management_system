import React from 'react';

export default function Input({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="block text-sm">{label}</label>
      <input type={type} className="border p-2 rounded w-full" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}