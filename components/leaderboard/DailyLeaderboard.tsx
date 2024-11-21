import React, { useEffect, useState } from "react";
import MindmintCoin from "@/components/MindmintCoin";
import { formatName } from "@/libs/generators";
import { PointsData } from "@/libs/types";
import TopThreeUsers from "@/components/leaderboard/TopThreeUsers";
import { useUser } from "@/context/UserContext";

interface DailyLeaderboardProps {}

const DailyLeaderboard: React.FC<DailyLeaderboardProps> = () => {
  const { userData } = useUser();
  const [users, setUsers] = useState<PointsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userDailyRank, setUserDailyRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsersAndRank = async () => {
      if (!userData) {
        console.error("User data is not available");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch("/api/points/dailyPoints", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userData.id }),
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.pointsdata);
          setUserDailyRank(data.userDailyRank);
        } else {
          console.error("Error fetching users and rank");
        }
      } catch (error) {
        console.error("Error fetching users and rank:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndRank();
  }, [userData]);

  if (!userData || loading) {
    return <div>Loading...</div>;
  }

  const topThreeUsers = users.slice(0, 3);

  return (
    <>
      {topThreeUsers.length > 2 && <TopThreeUsers users={topThreeUsers} section="daily" />}
      {users && (
        <div className="leaderboard   ">
          <table className="min-w-full bg-white text-black rounded-t-lg outline-1 outline-white outline">
            <thead className=" ">
              <tr>
                <th className="py-2">Rank</th>
                <th className="py-2">User</th>
                <th className="py-2">Daily Points</th>
              </tr>
            </thead>
            <tbody className="">
              {users.map((user, index) => (
                <React.Fragment key={index}>
                  <tr
                    className={`text-center bg-black border-b text-white  ${
                      user.id === userData.id
                        ? "font-extrabold text-primary"
                        : ""
                    }`}
                  >
                    <td className="py-2 text-zinc-600">{index + 1}</td>
                    <td className="py-2">{formatName(user.full_name)}</td>
                    <td className="py-2 flex justify-center items-center gap-1">
                      {user.daily_points} <MindmintCoin />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {users.length >= 50 && (
            <div className="text-tertiary-100 mt-2">
              <span>and more...</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DailyLeaderboard;