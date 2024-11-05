"use client";
import MemoryGameComponent from "@/components/MemoryGameComponent";
import PageHeader from "@/components/headers/PageHeader";
import Popup from "@/components/popups/Popup";
import { useUser } from "@/context/UserContext";
import { useRef } from "react";

const Home = () => {
  const {
    userData,
    showPopup,
    setShowPopup,
  } = useUser();
  const memoryGameRef = useRef<{ startGame: () => void }>(null);

  const handleStartGame = () => {
    setShowPopup(false);
    memoryGameRef.current?.startGame();
  };

  return (
    <>
      <PageHeader title="Home" description="Unlock Cognitive Potential" />
      <div className="mb-8 mt-4">
        {userData ? (
          <MemoryGameComponent
            ref={memoryGameRef}
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
      {showPopup && (
        <Popup onClose={() => setShowPopup(false)} onStart={handleStartGame} />
      )}
    </>
  );
};

export default Home;
