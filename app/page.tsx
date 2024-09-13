"use client";

import MemoryGameComponent from '@/components/MemoryGameComponent';
import Popup from '@/components/Popup';
import WelcomePopup from '@/components/WelcomePopup';
import { useUser } from '@/context/UserContext';
import { rewardPoints } from '@/libs/constants';
import { useRef } from 'react';

const Home = () => {
  const { userData, setUserData, showPopup, setShowPopup, showWelcomePopup, setShowWelcomePopup, setShowPointsUpdatePopup } = useUser();
  const memoryGameRef = useRef<{ startGame: () => void }>(null);
 
  const handleStartGame = () => {
    setShowPopup(false);
    memoryGameRef.current?.startGame();
  };

  const handleWelcomeSubmit = async (referralCode: string) => {
    if (!userData) {
      console.error("User data is not available");
      return;
    }

    try {
      const response = await fetch("/api/users/referrals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.id,
          referralCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.referee);
        setShowPointsUpdatePopup({
          message: `You were referred by ${data.referrer.first_name}`,
          points: rewardPoints.referFriend,
          buttonText: "Close",
          onClose: () => setShowPointsUpdatePopup(null),
          positive: true,
        });
        console.log("Referral processed successfully:", data);
      } else {
        console.error("Failed to process referral");
      }
    } catch (error) {
      console.error("Error processing referral:", error);
    }
  };

  return (
    <div>
      {userData ? (
        <MemoryGameComponent ref={memoryGameRef} userData={userData} setUserData={setUserData} />
      ) : (
        <div>Loading...</div>
      )}
      {showPopup && <Popup onClose={() => setShowPopup(false)} onStart={handleStartGame} />}
      {showWelcomePopup && <WelcomePopup onSubmit={handleWelcomeSubmit} onClose={() => setShowWelcomePopup(false)} />}
    </div>
  );
};

export default Home;