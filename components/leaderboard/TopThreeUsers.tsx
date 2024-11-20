"use client";
import React from "react";
import { FaMedal } from "react-icons/fa";
import MindmintCoin from "@/components/MindmintCoin";
import { formatName } from "@/libs/generators";

interface TopThreeUsersProps {
  users: any[];
  section: "overall" | "daily";
}

const TopThreeUsers: React.FC<TopThreeUsersProps> = ({ users, section }) => {
  const heights = ["h-20", "h-24", "h-16"]; // Heights for silver, gold, and bronze steps

  const getPoints = (user: any) => {
    return section === "overall" ? user.points : user.daily_points;
  };

  return (
    <div className="flex justify-center text-sm items-end mt-8">
      {/* Silver User */}
      <div className="flex flex-col items-center">
        <div className="profile-circle glow-silver">
          {users[1].full_name.slice(0, 2).toUpperCase()}
        </div>
        <div className="mt-2 text-center flex flex-col justify-center items-center">
          <span className="block font-semibold">
            {formatName(users[1].full_name)}
          </span>
          <span className="text-sm bg-zinc-500 py-1 px-2 rounded flex w-fit items-center justify-evenly gap-1">
            <MindmintCoin /> <span>{getPoints(users[1])} </span>
          </span>
        </div>
        <div className={`step ${heights[0]}`}>
          <div className="flex items-center justify-center">
            2
          </div>
        </div>
      </div>

      {/* Gold User */}
      <div className="flex flex-col items-center">
        <div className="profile-circle glow-gold">
          {users[0].full_name.slice(0, 2).toUpperCase()}
        </div>
        <div className="mt-2 text-center flex flex-col justify-center items-center">
          <span className="block font-semibold">
            {formatName(users[0].full_name)}
          </span>
          <span className="text-sm bg-zinc-500 py-1 px-2 rounded flex w-fit items-center justify-evenly gap-1">
            <MindmintCoin /> <span>{getPoints(users[0])} </span>
          </span>
        </div>
        <div className={`step ${heights[1]}`}>
          <div className="flex items-center justify-center">
            1
          </div>
        </div>
      </div>

      {/* Bronze User */}
      <div className="flex flex-col items-center">
        <div className="profile-circle glow-bronze">
          {users[2].full_name.slice(0, 2).toUpperCase()}
        </div>
        <div className="mt-2 text-center flex flex-col justify-center items-center">
          <span className="block font-semibold">
            {formatName(users[2].full_name)}
          </span>
          <span className="text-sm bg-zinc-500 py-1 px-2 rounded flex w-fit items-center justify-evenly gap-1">
            <MindmintCoin /> <span>{getPoints(users[2])} </span>
          </span>
        </div>
        <div className={`step ${heights[2]}`}>
          <div className="flex items-center justify-center">
            3
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopThreeUsers;