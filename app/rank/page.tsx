"use client";
import PageHeader from "@/components/PageHeader";
import { useUser } from "@/context/UserContext";
import { UserData } from "@/libs/types";
import { useEffect, useState } from "react";
import { FaMedal } from "react-icons/fa";
import { GiTwoCoins } from "react-icons/gi";

const RankPage = () => {
  const { userData } = useUser();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/users", {
          method: "POST",
        });
        if (response.ok) {
          const data = await response.json();
          const sortedUsers = data.users.sort(
            (a: UserData, b: UserData) => b.points - a.points
          );
          setUsers(sortedUsers);
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
  }, []);

  if (loading || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHeader title="Leaderboard" description="Check out the top performers" />
      <div className="leaderboard mt-4 mb-8">
        {/* <h1 className="text-2xl font-bold mb-4">Leaderboard</h1> */}
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
              <span>
                {user.first_name} {user.last_name}
              </span>
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
