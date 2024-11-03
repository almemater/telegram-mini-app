"use client";
import { useUser } from "@/context/UserContext";
import { UserData, MemoryGameRecord, PointsData } from "@/libs/types";
import { useEffect, useState } from "react";
import { BestGameRecordTypes } from "@/libs/constants";
import {
  FaUser,
  FaLanguage,
  FaCrown,
  FaStar,
  FaClock,
  FaSyncAlt,
  FaTrophy,
} from "react-icons/fa";
import PageHeader from "@/components/headers/PageHeader";
import CognitiveAssessment from "@/components/CognitiveAssessment";
import { FaRepeat } from "react-icons/fa6";

const ProfilePage = () => {
  const { userData } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [recentGame, setRecentGame] = useState<MemoryGameRecord | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userData) {
        console.error("User data is not available");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch("/api/points", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userData.id }),
        });
        if (response.ok) {
          const data = await response.json();
          setUserRank(data.userRank);
        } else {
          console.error("Error fetching users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userData]);

  useEffect(() => {
    const fetchRecentGame = async () => {
      try {
        const response = await fetch("/api/memoryGames/getGameRecord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData?.id,
            type: BestGameRecordTypes.RECENT,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setRecentGame(data.gameRecord);
        } else {
          console.error("Error fetching recent game record");
        }
      } catch (error) {
        console.error("Error fetching recent game record:", error);
      }
    };

    if (userData) {
      fetchRecentGame();
    }
  }, [userData]);

  if (loading || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHeader title="Profile" description={`@${userData.username}`} />
      <div className=" mx-auto p-4">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-4xl font-bold ">
            {userData.first_name} {userData.last_name}
          </h1>
          <p className="text-gray-600">Rank: #{userRank || "..."}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-secondary rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            <p className="text-lg mb-2 flex items-center">
              <FaUser className="mr-2" /> <strong>Name:</strong>
              {userData.first_name}
            </p>
            <p className="text-lg mb-2 flex items-center">
              <FaLanguage className="mr-2" /> <strong>Language:</strong>{" "}
              {userData.language_code}
            </p>
            <p className="text-lg mb-2 flex items-center">
              <FaCrown className="mr-2" /> <strong>Premium User:</strong>{" "}
              {userData.is_premium ? "Yes" : "No"}
            </p>
          </div>
          {recentGame && (
            <div className="relative p-4 bg-secondary text-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                Last Gameplay
              </h3>
              <p
                className={`absolute top-2 right-2 px-2 text-md mb-2 flex items-center bg-black bg-opacity-20 font-secondary tracking-wider rounded ${
                  recentGame.isWin ? "text-green-500" : "text-secondary"
                }`}
              >
                {recentGame.isWin ? "WON" : "LOST"}
              </p>
              <div className="flex  items-center gap-3">
                <p className="text-md mb-2 flex items-center">
                  <FaStar className="mr-1 text-primary" /> {recentGame.score}
                </p>
                <p className="text-md mb-2 flex items-center">
                  <FaClock className="mr-1" /> {recentGame.timeTaken}
                </p>
                <p className="text-md mb-2 flex items-center">
                  <FaRepeat className="mr-1" /> {recentGame.flips}
                </p>
              </div>
            </div>
          )}
          {/* <div className="p-4 bg-secondary rounded-lg">
            
            <CognitiveAssessment />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
