"use client";
import { useUser } from "@/context/UserContext";
import React, { useEffect } from "react";
import { FaCoins } from "react-icons/fa";
import PointsUpdatePopup from "./PointsUpdatePopup";

const AppBar = () => {
  const { userData, showPointsUpdatePopup } = useUser();

  useEffect(() => {
    console.log("Show Points Update Popup: ", showPointsUpdatePopup);
  }, [userData, showPointsUpdatePopup]);


  return (
    <>
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">MindmInt</h1>
        {userData && (
          <div className="flex items-center">
            <span className="mr-2">@{userData.username || "N/A"}</span>
            <span className="bg-secondary px-2 py-1 rounded flex items-center">
              <FaCoins className="mr-1 text-yellow-400" /> {userData.points}
            </span>
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
