"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHome, FaDollarSign, FaTrophy, FaUser } from 'react-icons/fa';

const NavBar = () => {
  const [currentPage, setCurrentPage] = useState<string>('');

  useEffect(() => {
    // Set the current page based on the window location pathname
    setCurrentPage(window.location.pathname);
  }, []);

  return (
    <nav className="navbar fixed bottom-0 w-full">
      <div className="bg-dark border-t-2 text-white p-4 flex justify-around">
        <Link href="/">
          <button
            onClick={() => setCurrentPage('/')}
            className={`flex flex-col items-center ${currentPage === '/' ? 'text-primary' : ''}`}
          >
            <FaHome size={24} />
            <span>Home</span>
          </button>
        </Link>
        <Link href="/earn">
          <button
            onClick={() => setCurrentPage('/earn')}
            className={`flex flex-col items-center ${currentPage === '/earn' ? 'text-primary' : ''}`}
          >
            <FaDollarSign size={24} />
            <span>Earn</span>
          </button>
        </Link>
        <Link href="/rank">
          <button
            onClick={() => setCurrentPage('/leaderboard')}
            className={`flex flex-col items-center ${currentPage === '/leaderboard' ? 'text-primary' : ''}`}
          >
            <FaTrophy size={24} />
            <span>Rank</span>
          </button>
        </Link>
        <Link href="/profile">
          <button
            onClick={() => setCurrentPage('/profile')}
            className={`flex flex-col items-center ${currentPage === '/profile' ? 'text-primary' : ''}`}
          >
            <FaUser size={24} />
            <span>Profile</span>
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;