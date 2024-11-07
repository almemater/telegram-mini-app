"use client";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import RewardEligibilityPopup from "./popups/RewardEligibilityPopup";

const ReferralRewards = () => {
  const { userData } = useUser();

  if (!userData) {
    return <div>Loading...</div>;
  }

  const [eligibilityMessage, setEligibilityMessage] = useState<string>("");
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] =
    useState<boolean>(false);
  const [referredUsers, setReferredUsers] = useState<
    { id: string; first_name: string; username: string }[]
  >([]);

  const fetchReferralData = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/referrals?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch referral data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching referral data:", error);
      return null;
    }
  };

  const checkEligibility = (referrals: any[]) => {
    const referralCount = referrals.length;
    let eligibilityMessage = "You are not eligible for any rewards.";

    if (referralCount >= 1000) {
      eligibilityMessage = "You are eligible for 💸 $100 USDT!";
    } else if (referralCount >= 100) {
      eligibilityMessage = "You are eligible for 💵 $7 USDT!";
    } else if (referralCount >= 10) {
      eligibilityMessage = "You are eligible for 💰 $0.50 USDT!";
    }

    return eligibilityMessage;
  };

  const handleCheckEligibility = async () => {
    const referralData = await fetchReferralData(userData.id.toString());
    if (referralData) {
      const message = checkEligibility(referralData.referredUsers);
      setEligibilityMessage(message);
      setReferredUsers(referralData.referredUsers);
      setIsEligibilityModalOpen(true);
    }
  };

  return (
    <>
      <div className="glassmorphic p-4 text-white mb-4">
        <h3 className="text-lg font-semibold mb-2 tracking-wider">
          Refer Rewards
        </h3>
        <ul className="text-left text-sm list-disc list-inside mb-4 space-y-2">
          <li>Every 10 Referrals: 💰 $0.50 USDT</li>
          <li>Every 100 Referrals: 💵 $7 USDT</li>
          <li>Every 1000 Referrals: 💸 $100 USDT</li>
        </ul>
        <button className="btn-primary" onClick={handleCheckEligibility}>
          Check Eligibility
        </button>
      </div>

      {isEligibilityModalOpen && (
        <RewardEligibilityPopup
          onClose={() => setIsEligibilityModalOpen(false)}
          eligibilityMessage={eligibilityMessage}
          referrals={referredUsers}
        />
      )}
    </>
  );
};

export default ReferralRewards;
