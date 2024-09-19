"use client";
import { useUser } from "@/context/UserContext";
import React, { useEffect } from "react";
import { FaCoins } from "react-icons/fa";
import PointsUpdatePopup from "./PointsUpdatePopup";
import Image from "next/image";

const AppBar = () => {
  const { userData, showPointsUpdatePopup } = useUser();

  useEffect(() => {
    console.log("Show Points Update Popup: ", showPointsUpdatePopup);
  }, [userData, showPointsUpdatePopup]);

  return (
    <>
      <div className="z-10 bg-gradient-to-br from-primary via-secondary to-tertiary text-white px-4 pt-4 pb-14 flex justify-between items-center">
        <Image src="/logo-white.svg" alt="MindmInt Logo" width={100} height={40} />
        {userData && (
          <div className="flex items-center glassmorphic p-2 rounded-lg">
            <span className="flex items-center">
              <FaCoins className="mr-1 text-yellow-400" /> {userData.points}
            </span>
            <span className="mx-2">|</span>
            <span className="">@{userData.username || "N/A"}</span>
          </div>
        )}
      </div>
      {showPointsUpdatePopup && (
        <PointsUpdatePopup {...showPointsUpdatePopup} />
      )}
    </>
  );
};

export default AppBar;