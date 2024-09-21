import Image from 'next/image';
import React from 'react';

const SplashScreen = () => {
  return (
    <div className="splash-screen relative flex flex-col h-screen w-screen justify-center items-center bg-gradient-to-br from-primary via-secondary to-tertiary text-white animate-bg-gradient">
      <Image src="/logo-white.svg" alt="MindmInt Logo" width={200} height={100} className="mb-6 animate-bounce" />
      <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      <p className="text-lg absolute bottom-10">Play to Unlock your Cognitive Potential</p>
    </div>
  );
};

export default SplashScreen;