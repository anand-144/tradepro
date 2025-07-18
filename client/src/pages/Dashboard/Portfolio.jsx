import React from 'react';
import MegaMenu from '../../components/MegaMenu';

const Portfolio = () => {
  return (
    <div>
      <MegaMenu />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Portfolio</h2>
        {/* portfolio content here */}
      </div>
    </div>
  );
};

export default Portfolio;
