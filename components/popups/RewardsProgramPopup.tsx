import React from "react";
import { FaTimes } from "react-icons/fa";
import MindmintCoin from "../MindmintCoin";

interface RewardsProgramPopupProps {
  onClose: () => void;
}

const RewardsProgramPopup: React.FC<RewardsProgramPopupProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 m-4 flex items-center justify-center z-50">
      <div className="glassmorphic-tertiary p-6 rounded-lg shadow-lg text-white relative max-w-lg mx-auto  ">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-xl flex items-center justify-center w-full gap-2 font-bold mb-2 text-center">
          <MindmintCoin /> Rewards for Early Adopters <MindmintCoin />
        </h2>
        <div className="overflow-y-scroll animate-fadeIn max-h-[60vh]">
          <p className="text-md mb-2 text-center font-bold">
            Win Up to $500 USDT or TON Equivalent! 💸🎉
          </p>
          <div>
            <h3 className="text-lg font-semibold mb-2 tracking-wider">
              1. Referral Reward Program 
            </h3>
            <ul className="text-left text-sm list-disc list-inside mb-4 space-y-2 ">
              <li>Every 10 Referrals: 💰 $0.50 USDT</li>
              <li>Every 100 Referrals: 💵 $7 USDT</li>
              <li>Every 1000 Referrals: 💸 $100 USDT</li>
            </ul>
            <div className="text-xs text-zinc-300 ">
              <p className="mb-1">Satisfy the Following Conditions:</p>
              <ul className="text-left list-inside mb-4">
                <li>🎮 Played at least 1 game.</li>
                <li>✅ Complete all tasks.</li>
                <li>🔗 Connected their wallet.</li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 tracking-wider">
              2. Weekly Leaderboard Rewards 
            </h3>
            <ul className="text-left text-sm list-none list-inside mb-4 space-y-2">
              <li>🏅 Top Performer (Most Games Played): $10 USDT</li>
              <li>🏅 Top Scorer (Highest Score): $10 USDT</li>
            </ul>
            <p className="text-xs text-zinc-300 mb-4">
              Send your Top score screenshot in group with Time and Date Stamp
            </p>
          </div>
          <p className="text-sm mb-4 text-center">
            Join the fun, refer friends, play games, win up to $500 USDT!🎯 Don't forget, you’re already minting our ecosystem token!💡
          </p>
          <div className="font-mono text-xs text-center font-semibold mb-4">
          The Reward Program starts every Saturday at 12:00 AM UTC
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-secondary text-white px-4 py-2 rounded mt-6 w-full hover:bg-primary transition-colors"
        >
          Lets Play!
        </button>
      </div>
    </div>
  );
};

export default RewardsProgramPopup;
