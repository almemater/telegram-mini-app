"use client";
import { useUser } from "@/context/UserContext";
import React, { useEffect, useState } from "react";
import PointsUpdatePopup from "./popups/PointsUpdatePopup";
import Image from "next/image";
import { GiTwoCoins } from "react-icons/gi";
import MindmintCoin from "./MindmintCoin";
import { PointsUpdatePopupProps } from "@/libs/types";

const AppBar = () => {
  const { userData, pointsData, showPointsUpdatePopup } = useUser();
  // const [showDebugPopup, setShowDebugPopup] = useState(true);

  useEffect(() => {
    console.log("Show Points Update Popup: ", showPointsUpdatePopup);
  }, [userData, pointsData, showPointsUpdatePopup]);

  // const samplePopupData: PointsUpdatePopupProps = {
  //   message: "Congratulations!",
  //   points: 100,
  //   buttonText: "Close",
  //   onClose: () => setShowDebugPopup(false),
  //   positive: true,
  // };

  return (
    <>
      <div className="z-10 gradientbg text-white px-4 pt-4 pb-14 flex justify-between items-center">
        <Image src="/logo-white.svg" alt="MindmInt Logo" width={100} height={40} />
        {userData && pointsData && (
          <div className="flex items-center glassmorphic p-2 rounded-lg">
            <span className="flex items-center">
              <MindmintCoin className="mr-1" /> {pointsData.points}
            </span>
            <span className="mx-2">|</span>
            <span className="">@{userData.username || "N/A"}</span>
          </div>
        )}
      </div>
      {showPointsUpdatePopup && (
        <PointsUpdatePopup {...showPointsUpdatePopup} />
      )}
      {/* {showDebugPopup && (
        <PointsUpdatePopup {...samplePopupData} />
      )} */}
    </>
  );
};

export default AppBar;