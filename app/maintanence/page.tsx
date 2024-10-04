"use client";

import Image from "next/image";

const MaintanencePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary via-secondary to-tertiary">
      <Image
        src="/logo-white.svg"
        alt="MindmInt Logo"
        width={200}
        height={100}
        className="flex animate-bounce"
      />

      <div className="text-center p-8 m-8 text-dark flex flex-col glassmorphic rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Under Maintenance</h1>
        <p className="text-lg">
          The app will be down until maintenance is complete. We
          apologize for any inconvenience caused.
        </p>
      </div>
      <p className="absolute bottom-10 text-lg">
        Play to Unlock your Cognitive Potential
      </p>
    </div>
  );
};

export default MaintanencePage;
