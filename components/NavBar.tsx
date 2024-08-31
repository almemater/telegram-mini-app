// components/NavBar.tsx
import React from "react";
import { FaHome, FaTasks, FaUser } from "react-icons/fa";

interface NavBarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({
  currentPage,
  setCurrentPage,
  className,
}) => {
  return (
    <nav className={`navbar ${className}`}>
      <div className="bg-dark border-t-2 text-white p-4 flex justify-around">
        <button
          onClick={() => setCurrentPage("home")}
          className={`flex flex-col items-center ${
            currentPage === "home" ? "text-primary" : ""
          }`}
        >
          <FaHome size={24} />
          <span>Home</span>
        </button>
        <button
          onClick={() => setCurrentPage("tasks")}
          className={`flex flex-col items-center ${
            currentPage === "tasks" ? "text-primary" : ""
          }`}
        >
          <FaTasks size={24} />
          <span>Tasks</span>
        </button>
        <button
          onClick={() => setCurrentPage("profile")}
          className={`flex flex-col items-center ${
            currentPage === "profile" ? "text-primary" : ""
          }`}
        >
          <FaUser size={24} />
          <span>Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
