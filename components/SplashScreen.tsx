import Image from 'next/image';
import React from 'react';

const SplashScreen = () => {
  return (
    <div className="splash-screen relative flex flex-col h-screen w-screen justify-center items-center gradientbg text-white animate-bg-gradient bg-[length:200%_200%]">
      <Image src="/logo-white.svg" alt="MindmInt Logo" width={200} height={100} className="mb-6 animate-bounce" />
      <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      <p className="text-lg absolute bottom-10">Play to Unlock your Cognitive Potential</p>
    </div>
  );
};

export default SplashScreen;