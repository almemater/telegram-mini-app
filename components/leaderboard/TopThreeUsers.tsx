"use client";
import React from "react";
import { FaMedal } from "react-icons/fa";
import MindmintCoin from "@/components/MindmintCoin";
import { formatName } from "@/libs/generators";

interface TopThreeUsersProps {
  users: any[];
}

const TopThreeUsers: React.FC<TopThreeUsersProps> = ({ users }) => {
  const heights = ["h-20", "h-24", "h-16"]; // Heights for silver, gold, and bronze steps

  return (
    <div className="flex justify-center text-sm items-end mt-8">
      {/* Silver User */}
      <div className="flex flex-col items-center mx-2">
        <div className="profile-circle glow-silver">
          {users[1].full_name.slice(0, 2).toUpperCase()}
        </div>
        <div className="mt-2 text-center">
          <span className="block font-semibold">
            {formatName(users[1].full_name)}
          </span>
          <span className="text-sm flex items-center justify-center gap-1">
            {users[1].points} <MindmintCoin />
          </span>
        </div>
        <div className={`step ${heights[0]} text-gray-500`}>
          <div className="flex items-center justify-center">
            <FaMedal className="mr-2" />
            Silver
          </div>
        </div>
      </div>

      {/* Gold User */}
      <div className="flex flex-col items-center mx-2">
        <div className="profile-circle glow-gold">
          {users[0].full_name.slice(0, 2).toUpperCase()}
        </div>
        <div className="mt-2 text-center">
          <span className="block font-semibold">
            {formatName(users[0].full_name)}
          </span>
          <span className="text-sm flex items-center justify-center gap-1">
            {users[0].points} <MindmintCoin />
          </span>
        </div>
        <div className={`step ${heights[1]} text-yellow-500`}>
          <div className="flex items-center justify-center">
            <FaMedal className="mr-2" />
            Gold
          </div>
        </div>
      </div>

      {/* Bronze User */}
      <div className="flex flex-col items-center mx-2">
        <div className="profile-circle glow-bronze">
          {users[2].full_name.slice(0, 2).toUpperCase()}
        </div>
        <div className="mt-2 text-center">
          <span className="block font-semibold">
            {formatName(users[2].full_name)}
          </span>
          <span className="text-sm flex items-center justify-center gap-1">
            {users[2].points} <MindmintCoin />
          </span>
        </div>
        <div className={`step ${heights[2]} text-orange-500`}>
          <div className="flex items-center justify-center">
            <FaMedal className="mr-2" />
            Bronze
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopThreeUsers;