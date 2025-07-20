import React from 'react';

const Loader = ({ size = 16 }) => {
  return (
    <div className="flex justify-center items-center py-16">
      <div
        className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200"
        style={{
          width: `${size * 4}px`,
          height: `${size * 4}px`,
        }}
      ></div>
    </div>
  );
};

export default Loader;
