// components/AppBar.tsx
import React from 'react';
import { FaCoins } from 'react-icons/fa';

interface AppBarProps {
  userData: {
    username?: string;
  } | null;
  points: number;
}

const AppBar: React.FC<AppBarProps> = ({ userData, points }) => {
  return (
    <div className="bg-primary text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Jsample</h1>
      {userData && (
        <div className="flex items-center">
          <span className="mr-2">@{userData.username || 'N/A'}</span>
          <span className="bg-secondary px-2 py-1 rounded flex items-center">
            <FaCoins className="mr-1 text-yellow-400" /> {points}
          </span>
        </div>
      )}
    </div>
  );
};

export default AppBar;