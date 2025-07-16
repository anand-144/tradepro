import React from 'react';
import { Link } from 'react-router-dom';
import SplitText from '../animations/SplitText';
import RippleGrid from '../animations/RippleGrid';

const Home = () => {
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-6 py-20 flex items-center justify-center overflow-hidden">

      {/* --- Ripple Grid Background --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <RippleGrid
          enableRainbow={true}
          gridColor={"#191970"}
          rippleIntensity={0.05}
          gridSize={30}
          gridThickness={11}
          fadeDistance={0.40}
          vignetteStrength={1.5}
          glowIntensity={1.15}
          opacity={0.5}
          gridRotation={0}
          mouseInteraction={true}
          mouseInteractionRadius={10}
        />
      </div>

      {/* --- Hero Content --- */}
      <div className="relative z-20 text-center max-w-2xl">
        <span className="text-xs uppercase bg-blue-500 text-white px-3 py-1 rounded-full inline-block mb-4">
          🔒 Secure & Fast
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Trade Stocks Seamlessly <br /> with{' '}
          <SplitText
            text="StockSim"
            className="text-5xl font-extrabold text-white inline-block"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </h1>

        <p className="text-gray-300 text-sm md:text-base mb-6">
          Simulate trades, manage your virtual portfolio, and learn stock market strategies — all in one platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-md text-white text-sm font-semibold"
          >
            Get Started
          </Link>
          <Link
            to="/dashboard"
            className="bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-md text-sm text-white"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
