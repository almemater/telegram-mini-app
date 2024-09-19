import React from 'react';

interface PopupProps {
  onClose: () => void;
  onStart: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose, onStart }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black p-4 rounded-lg w-4/5 max-w-md">
        <h2 className="text-2xl tracking-wide font-bold mb-2">Welcome to the Memory Game!</h2>
        <p className="mb-4">
          Match all the pairs of cryptocurrency icons to win the game. You have 60 seconds to match all pairs. Good luck!
        </p>
        <div className="flex justify-end">
          <button
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded mr-2"
            onClick={onStart}
          >
            Start Game
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;