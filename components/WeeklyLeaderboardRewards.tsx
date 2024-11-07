import { useState } from "react";
import { useUser } from "@/context/UserContext";

const WeeklyLeaderboardRewards = () => {
  const { userData } = useUser();
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [eligibilityMessage, setEligibilityMessage] = useState<string>("");

  if (!userData) {
    return <div>Loading...</div>;
  }

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch("/api/points/weeklyMetrics");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      const data = await response.json();
      checkEligibility(data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  const checkEligibility = (leaderboardData: any) => {
    const { topPerformer, topScorer } = leaderboardData;
    let message = "You are not eligible for any rewards.";

    if (topPerformer && topPerformer.id === userData.id && topScorer && topScorer.id === userData.id) {
      message = "Woah! You are both Top Performer and Top Scorer of the week and eligible for $20 USDT!";
    } else if (topPerformer && topPerformer.id === userData.id) {
      message = "You are the Top Performer (Most Games Played) and eligible for $10 USDT!";
    } else if (topScorer && topScorer.id === userData.id) {
      message = "You are the Top Scorer (Highest Score) and eligible for $10 USDT!";
    }

    setEligibilityMessage(message);
    setIsEligible(
      (topPerformer && topPerformer.id === userData.id) ||
      (topScorer && topScorer.id === userData.id)
    );
  };

  const handleCheckLeaderboard = () => {
    fetchLeaderboardData();
  };

  return (
    <div className="glassmorphic p-4 text-white mb-4">
      <h3 className="text-lg font-semibold mb-2 tracking-wider">
        Weekly Leaderboard Rewards
      </h3>
      <ul className="text-left text-sm list-none list-inside mb-4 space-y-2">
        <li>🏅 Top Performer (Most Games Played): $10 USDT</li>
        <li>🏅 Top Scorer (Highest Score): $10 USDT</li>
      </ul>
      <button className="btn-primary" onClick={handleCheckLeaderboard}>
        Check Leaderboard
      </button>
      {eligibilityMessage && (
        <div className="mt-4">
          <p>{eligibilityMessage}</p>
        </div>
      )}
    </div>
  );
};

export default WeeklyLeaderboardRewards;