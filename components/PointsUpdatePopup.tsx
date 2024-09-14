import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface PointsUpdatePopupProps {
  message: string;
  points: number;
  buttonText: string;
  onClose: () => void;
  positive?: boolean;
}

const PointsUpdatePopup: React.FC<PointsUpdatePopupProps> = ({
  message,
  points,
  buttonText,
  onClose,
  positive = false,
}) => {
  const { width, height } = useWindowSize();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {positive && <Confetti width={width} height={height} />}
      <div className="bg-white text-black p-4 rounded-lg w-4/5 max-w-md">
        <h2 className="text-xl font-bold mb-2">{message}</h2>
        <p className="mb-4">
          You have earned {points} points
        </p>
        <div className="flex justify-end">
          <button
            className={`py-2 px-4 rounded ${positive ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-700'} text-white`}
            onClick={onClose}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointsUpdatePopup;