"use client";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import EarnPageHeader from "@/components/headers/EarnPageHeader";
import RewardsProgramPopup from "@/components/popups/RewardsProgramPopup";
import { ImInfo } from "react-icons/im";
import TaskSection from "@/components/TaskSection";
import ReferralSection from "@/components/ReferralSection";
import ReferralRewards from "@/components/ReferralRewards";
import WeeklyLeaderboardRewards from "@/components/WeeklyLeaderboardRewards";
import Image from "next/image";

const EarnPage = () => {
  const { userData } = useUser();

  if (!userData) {
    return <div>Loading...</div>;
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility
  const [activeSection, setActiveSection] = useState<"tasks" | "rewards">(
    "tasks"
  );

  const handleToggle = (section: "tasks" | "rewards") => {
    setActiveSection(section);
  };

  return (
    <>
      <EarnPageHeader onToggle={handleToggle} />
      <div className="px-4 mb-8 mt-4">
        {activeSection === "tasks" && (
          <>
            <TaskSection />
            <ReferralSection />
          </>
        )}

        {activeSection === "rewards" && (
          <>
            <div className="mb-2 flex justify-center text-xs text-zinc-500 gap-2 items-center">
              <ImInfo />
              <span>Your Weekly Rewards -</span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="py-1 underline text-primary"
              >
                <div className="flex items-center justify-center">View</div>
              </button>
            </div>

            <div className="glassmorphic rounded-md shadow-xs p-4 text-white mb-4">
              <h3 className="text-lg font-semibold mb-2 tracking-wider">
                Cognitive Assessment
              </h3>
              {/* // SBT Image is in /imgs/SBT/GensisNFT.webp */}
              <Image
                src="/imgs/SBT/GensisNFT.webp"
                alt="SBT"
                width={200}
                height={200}
                className="mb-4 w-full rounded"
              />

              <button className="btn-primary w-full py-2 mt-2">Mint SBT</button>
            </div>

            <ReferralRewards />
            <WeeklyLeaderboardRewards />
          </>
        )}
      </div>
      {/* Reward Program Modal */}
      {isModalOpen && (
        <RewardsProgramPopup onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default EarnPage;