import React from 'react';

export default function Spinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-12 h-12 rounded-full animate-spin border-4 border-dashed border-[#0052cc] border-t-transparent"></div>
    </div>
  );
}