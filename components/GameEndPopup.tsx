import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface GameEndPopupProps {
  isWin: boolean;
  finalScore: number;
  onClose: () => void;
}

const GameEndPopup: React.FC<GameEndPopupProps> = ({ isWin, finalScore, onClose }) => {
  const { width, height } = useWindowSize();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {isWin && <Confetti width={width} height={height} />}
      <div className="bg-white text-black p-4 rounded-lg w-4/5 max-w-md">
        <h2 className="text-xl font-bold mb-2">{isWin ? 'Congratulations!' : "Time's up!"}</h2>
        <p className="mb-4">
          {isWin ? 'You won the game!' : "Game over."} <br />
          Final Score: {finalScore} points
        </p>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
            onClick={onClose}
          >
            {isWin ? 'Yaay!' : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameEndPopup;