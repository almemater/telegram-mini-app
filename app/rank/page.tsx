"use client";
import PageHeader from "@/components/PageHeader";
import { useUser } from "@/context/UserContext";
import { PointsData } from "@/libs/types";
import { useEffect, useState } from "react";
import { FaMedal } from "react-icons/fa";
import { GiTwoCoins } from "react-icons/gi";

const RankPage = () => {
  const { userData, pointsData } = useUser();
  const [users, setUsers] = useState<PointsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userData) {
        console.error("User data is not available");
        return;
      };
      setLoading(true);
      try {
        const response = await fetch("/api/points");
        if (response.ok) {
          const data = await response.json();
          setUsers(data.pointsdata);

          // Calculate the user's rank
          // const sortedUsers = data.pointsdata.sort((a: PointsData, b: PointsData) => b.points - a.points);
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

  if (!userData || !pointsData || loading) {
    return <div>Loading...</div>;
  }

  const userRank = users.findIndex((user) => user.username === pointsData.username) + 1;

  return (
    <>
      <PageHeader
        title="Leaderboard"
        description={`Your rank: ${userRank}`}
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
              <span className="ml-auto">
                {user.points} <GiTwoCoins className="inline text-yellow-400" />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default RankPage;