import React from 'react';

const Loader = ({ size = 16 }) => {
  return (
    <div className="flex flex-col justify-center items-center py-16 space-y-4">
      <div
        className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200"
        style={{
          width: `${size * 4}px`,
          height: `${size * 4}px`,
        }}
      ></div>
      <p className="text-teal-600 font-medium text-lg">
        Render is loading, please wait...
      </p>
    </div>
  );
};

export default Loader;
