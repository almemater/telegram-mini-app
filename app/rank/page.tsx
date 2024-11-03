"use client";
import MindmintCoin from "@/components/MindmintCoin";
import RankPageHeader from "@/components/headers/RankPageHeader";
import { useUser } from "@/context/UserContext";
import { BestGameRecordTypes } from "@/libs/constants";
import { formatName } from "@/libs/generators";
import { PointsData } from "@/libs/types";
import { useEffect, useState } from "react";
import TopThreeUsers from "@/components/leaderboard/TopThreeUsers";

const RankPage = () => {
  const { userData, pointsData } = useUser();
  const [users, setUsers] = useState<PointsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bestGameScore, setBestGameScore] = useState<number>(0);
  const [bestGameScoreLoading, setBestGameScoreLoading] =
    useState<boolean>(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsersAndRank = async () => {
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
          setUsers(data.pointsdata);
          setUserRank(data.userRank);
        } else {
          console.error("Error fetching users and rank");
        }
      } catch (error) {
        console.error("Error fetching users and rank:", error);
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
          body: JSON.stringify({
            userId: userData.id,
            type: BestGameRecordTypes.HIGHSCORE,
          }),
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

    fetchUsersAndRank();
    fetchBestGameScore();
  }, [userData]);

  if (!userData || !pointsData || loading) {
    return <div>Loading...</div>;
  }

  const topThreeUsers = users.slice(0, 3);
  const otherUsers = users.slice(3);

  return (
    <>
      <RankPageHeader
        points={pointsData.points}
        rank={userRank || "..."}
        // bestGameScore={bestGameScoreLoading ? "..." : bestGameScore}
      />
      <TopThreeUsers users={topThreeUsers} />
      <div className="leaderboard mb-4">
        <table className="min-w-full bg-white text-black rounded-t-lg">
          <thead className=" ">
            <tr>
              <th className="py-2">Rank</th>
              <th className="py-2">User</th>
              <th className="py-2">Points</th>
            </tr>
          </thead>
          <tbody className="">
            {users.map((user, index) => (
              <>
                <tr
                  key={index}
                  className={`text-center bg-black text-white  ${
                    user.username === userData.username
                      ? "font-extrabold text-primary"
                      : ""
                  }`}
                >
                  <td className="py-2 text-zinc-600">{index + 1}</td>
                  <td className="py-2">{formatName(user.full_name)}</td>
                  <td className="py-2 flex justify-center items-center gap-1">
                    {user.points} <MindmintCoin />
                  </td>
                </tr>
                <div className="border-b "/>
              </>
            ))}
          </tbody>
        </table>
        {users.length >= 50 && (
          <div className="text-tertiary-100 mt-2">
            <span>and more...</span>
          </div>
        )}
      </div>
    </>
  );
};

export default RankPage;
