import React from "react";
import MindmintCoin from "./MindmintCoin";
import { PiRankingDuotone } from "react-icons/pi";

interface RankPageHeaderProps {
    points: number;
  rank: number;
//   bestGameScore: number | string;
}

const RankPageHeader: React.FC<RankPageHeaderProps> = ({
  rank,
  points,
}) => {
  return (
    <div className="relative z-20 -mt-14 flex gap-2 justify-evenly items-center glassmorphic">
        <div className=" justify-center items-center flex flex-col p-4 rounded-lg text-center">
          <h1 className="text-4xl font-bold capitalize "># {rank}</h1>
          <p className="text-lg text-gray-400">rank</p>
        </div>
        {/* Need a vertical line */}
        <div className="border-x border-gray-300 h-12"></div>
        <div className="justify-center items-center flex flex-col p-4 rounded-lg text-center">
          <h1 className="text-4xl font-bold capitalize flex items-center justify-center">
            <span>{points}</span>
            <MindmintCoin className="ml-1 self-center"/>
          </h1>
          <p className="text-lg text-gray-400 mr-2">coins</p>
        </div>
      </div>
  );
};

export default RankPageHeader;
