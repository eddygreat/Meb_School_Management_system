import React from 'react';

export default function Card({ title, extra, children }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">{title}</h2>
        {extra && <div className="text-sm">{extra}</div>}
      </div>
      <div className="text-sm text-gray-500 mt-1">{children || "Stub module"}</div>
    </div>
  );
}