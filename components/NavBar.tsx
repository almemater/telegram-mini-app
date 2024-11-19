"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ReactSVG } from 'react-svg';

const NavBar = () => {
  const [currentPage, setCurrentPage] = useState<string>('');

  useEffect(() => {
    // Set the current page based on the window location pathname
    setCurrentPage(window.location.pathname);
  }, []);

  return (
    <nav className="navbar fixed bottom-0 w-full">
      <div className="bg-[#272b2e] text-white p-4 flex justify-around">
        <Link href="/">
          <button
            onClick={() => setCurrentPage('/')}
            className={`flex flex-col pt-1 items-center ${currentPage === '/' ? 'text-white' : 'text-[#5A5E61]'}`}
          >
            <ReactSVG
              src="/imgs/nav-icons/Home.svg"
              className={`w-6 h-6 ${currentPage === '/' ? 'fill-white' : 'fill-[#5A5E61]'}`}
            />
            <span>Home</span>
          </button>
        </Link>
        <Link href="/earn">
          <button
            onClick={() => setCurrentPage('/earn')}
            className={`flex flex-col pt-1 items-center ${currentPage === '/earn' ? 'text-white' : 'text-[#5A5E61]'}`}
          >
            <ReactSVG
              src="/imgs/nav-icons/Task.svg"
              className={`w-6 h-6 ${currentPage === '/earn' ? 'fill-white' : 'fill-[#5A5E61]'}`}
            />
            <span>Earn</span>
          </button>
        </Link>
        <Link href="/rank">
          <button
            onClick={() => setCurrentPage('/rank')}
            className={`flex flex-col pt-1 items-center ${currentPage === '/rank' ? 'text-white' : 'text-[#5A5E61]'}`}
          >
            <ReactSVG
              src="/imgs/nav-icons/Leaderboard.svg"
              className={`w-6 h-6 ${currentPage === '/rank' ? 'fill-white' : 'fill-[#5A5E61]'}`}
            />
            <span>Rank</span>
          </button>
        </Link>
        <Link href="/profile">
          <button
            onClick={() => setCurrentPage('/profile')}
            className={`flex flex-col pt-1 items-center ${currentPage === '/profile' ? 'text-white' : 'text-[#5A5E61]'}`}
          >
            <ReactSVG
              src="/imgs/nav-icons/Profile.svg"
              className={`w-6 h-6 ${currentPage === '/profile' ? 'fill-white' : 'fill-[#5A5E61]'}`}
            />
            <span>Profile</span>
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;