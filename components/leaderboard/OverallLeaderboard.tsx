import React, { useEffect, useState } from "react";
import MindmintCoin from "@/components/MindmintCoin";
import { formatName } from "@/libs/generators";
import { PointsData } from "@/libs/types";
import TopThreeUsers from "@/components/leaderboard/TopThreeUsers";
import { useUser } from "@/context/UserContext";

interface OverallLeaderboardProps {}

const OverallLeaderboard: React.FC<OverallLeaderboardProps> = () => {
  const { userData } = useUser();
  const [users, setUsers] = useState<PointsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

    fetchUsersAndRank();
  }, [userData]);

  if (!userData || loading) {
    return <div>Loading...</div>;
  }

  const topThreeUsers = users.slice(0, 3);

  return (
    <>
      {topThreeUsers.length > 2 && <TopThreeUsers users={topThreeUsers} />}
      {users && (
        <div className="leaderboard mb-4 absolute w-screen left-0">
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
                <React.Fragment key={index}>
                  <tr
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
                  <div className="border-b " />
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

export default OverallLeaderboard;