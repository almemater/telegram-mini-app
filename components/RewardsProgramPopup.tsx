import React from "react";
import { FaTimes } from "react-icons/fa";
import MindmintCoin from "./MindmintCoin";

interface RewardsProgramPopupProps {
  onClose: () => void;
}

const RewardsProgramPopup: React.FC<RewardsProgramPopupProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 m-4 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-black relative max-w-lg mx-auto animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl flex items-center justify-center w-full gap-2 font-bold mb-4 text-center"><MindmintCoin /> Rewards for Early Adopters <MindmintCoin /></h2>
        <div>
          <p className="text-md mb-4 text-center">
            We appreciate your efforts and want to reward you! Here's what you
            can win every week:
          </p>
          <ul className="text-left text-md list-decimal list-inside mb-4 space-y-2">
            <li>
              Highest Score of the Week - 10 USDT or equivalent
            </li>
            <li>
              Most Plays of the Week - 10 USDT or equivalent
            </li>
            <li>
              Top Referrals of the Week - 10 USDT or equivalent
              Coin
            </li>
          </ul>
          <p className="text-sm text-center ">
            All scores will be calculated from Sunday 12:00 AM UTC to Saturday
            11:59 PM UTC.
          </p>
        </div>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-6 w-full hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RewardsProgramPopup;