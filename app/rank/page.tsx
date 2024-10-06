"use client";
import MindmintCoin from "@/components/MindmintCoin";
import RankPageHeader from "@/components/RankPageHeader";
import { useUser } from "@/context/UserContext";
import { BestGameRecordTypes } from "@/libs/constants";
import { PointsData } from "@/libs/types";
import { useEffect, useState } from "react";
import { FaMedal } from "react-icons/fa";

const RankPage = () => {
  const { userData, pointsData } = useUser();
  const [users, setUsers] = useState<PointsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bestGameScore, setBestGameScore] = useState<number>(0);
  const [bestGameScoreLoading, setBestGameScoreLoading] = useState<boolean>(true);

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
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.pointsdata);
        } else {
          console.error("Error fetching users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBestGameScore = async () => {
      if (!userData) {
        console.error("User data is not available");
        return;
      }
      setBestGameScoreLoading(true);
      try {
        const response = await fetch("/api/memoryGames/getGameRecord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userData.id, type: BestGameRecordTypes.HIGHSCORE }),
        });
        if (response.ok) {
          const data = await response.json();
          setBestGameScore(data.gameRecord.score);
        } else {
          console.error("Error fetching best game score");
        }
      } catch (error) {
        console.error("Error fetching best game score:", error);
      } finally {
        setBestGameScoreLoading(false);
      }
    };

    fetchUsers();
    fetchBestGameScore();
  }, [userData]);

  if (!userData || !pointsData || loading) {
    return <div>Loading...</div>;
  }

  const userRank = users.findIndex((user) => user.username === pointsData.username) + 1;

  return (
    <>
      <RankPageHeader
        points={pointsData.points}
        rank={userRank}
        // bestGameScore={bestGameScoreLoading ? "..." : bestGameScore}
      />
      <div className="leaderboard mt-4 mb-8">
        <ul>
          {users.map((user, index) => (
            <li
              key={index}
              className={`flex justify-center items-center mb-2 ${
                user.username === userData.username
                  ? "font-extrabold text-primary"
                  : ""
              }`}
            >
              {index === 0 && <FaMedal className="text-yellow-500 mr-2" />}
              {index === 1 && <FaMedal className="text-gray-500 mr-2" />}
              {index === 2 && <FaMedal className="text-orange-500 mr-2" />}
              {index > 2 && <span className="mr-2">{index + 1}.</span>}
              <span>{user.full_name}</span>
              <span className="ml-auto flex gap-1 justify-center items-center">
                {user.points} 
                <MindmintCoin />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default RankPage;