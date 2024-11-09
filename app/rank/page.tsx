"use client";
import RankPageHeader2 from "@/components/headers/RankPageHeader2";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import OverallLeaderboard from "@/components/leaderboard/OverallLeaderboard";
import DailyLeaderboard from "@/components/leaderboard/DailyLeaderboard";
import { BestGameRecordTypes } from "@/libs/constants";

const RankPage = () => {
  const { userData, pointsData } = useUser();
  const [bestGameScore, setBestGameScore] = useState<number>(0);
  const [bestGameScoreLoading, setBestGameScoreLoading] =
    useState<boolean>(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<"overall" | "daily">(
    "overall"
  );

  const handleToggle = (section: "overall" | "daily") => {
    setActiveSection(section);
  };

  useEffect(() => {
    const fetchBestGameScore = async () => {
      if (!userData) {
        console.error("User data is not available");
        return;
      }
      setBestGameScoreLoading(true);
      try {
        const response = await fetch("/api/memoryGames/getGameRecord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData.id,
            type: BestGameRecordTypes.HIGHSCORE,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setBestGameScore(data.gameRecord.score);
        } else {
          console.error("Error fetching best game score");
        }
      } catch (error) {
        console.error("Error fetching best game score:", error);
      } finally {
        setBestGameScoreLoading(false);
      }
    };

    fetchBestGameScore();
  }, [userData]);

  if (!userData || !pointsData || bestGameScoreLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <RankPageHeader2 onToggle={handleToggle} />

      {activeSection === "overall" && <OverallLeaderboard />}
      {activeSection === "daily" && <DailyLeaderboard />}
    </>
  );
};

export default RankPage;