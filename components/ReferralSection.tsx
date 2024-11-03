import { useState, useEffect } from "react";
import { FaShareAlt } from "react-icons/fa";
import { IoCopy } from "react-icons/io5";
import MindmintCoin from "@/components/MindmintCoin";
import WebApp from "@twa-dev/sdk";
import { rewardPoints } from "@/libs/constants";
import { useUser } from "@/context/UserContext";

const ReferralSection = () => {
  const { userData } = useUser();

  if (!userData) {
    return <div>Loading...</div>;
  }
  
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copyButtonText, setCopyButtonText] = useState<string>("Copy");
  const [referredUsers, setReferredUsers] = useState<
    { id: string; first_name: string; username: string }[]
  >([]);

  useEffect(() => {
    const fetchReferralCode = async () => {
      try {
        const response = await fetch(
          `/api/users/referrals/getReferralCode?userId=${userData.id}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.referralCode) {
            setReferralCode(data.referralCode);
          }
        } else {
          console.error("Failed to fetch referral code");
        }
      } catch (error) {
        console.error("Error fetching referral code:", error);
      }
    };

    fetchReferralCode();
  }, [userData.id]);

  useEffect(() => {
    const fetchReferredUsers = async () => {
      try {
        const response = await fetch(
          `/api/users/referrals?userId=${userData.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setReferredUsers(data.referredUsers);
        } else {
          console.error("Failed to fetch referred users");
        }
      } catch (error) {
        console.error("Error fetching referred users:", error);
      }
    };

    fetchReferredUsers();
  }, [userData.id]);

  const generateShareDetails = (referralCode: string | null) => {
    const baseUri = "http://t.me/AMMindMintbot/Mindmint";
    const shareText = referralCode
      ? `I'm inviting you to use MindmInt! \n\nIf the link didn't work automatically, use my referral code ${referralCode} while onboarding.`
      : "I'm inviting you to use MindmInt!";
    const shareUri = referralCode
      ? `${baseUri}?startapp=${referralCode}`
      : baseUri;

    return { shareText, shareUri };
  };

  const handleShare = () => {
    const { shareText, shareUri } = generateShareDetails(referralCode);

    if (typeof window !== "undefined") {
      WebApp.ready();
      WebApp.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(
          shareUri
        )}&text=${encodeURIComponent(shareText)}`
      );
    }
  };

  const handleCopy = () => {
    const { shareText, shareUri } = generateShareDetails(referralCode);
    const inviteText = referralCode
      ? `${shareText} Join here: ${shareUri}`
      : shareText;

    navigator.clipboard
      .writeText(inviteText)
      .then(() => {
        setCopyButtonText("Copied!");
        setTimeout(() => setCopyButtonText("Copy"), 2000);
      })
      .catch((error) => {
        console.error("Error copying text:", error);
      });
  };

  return (
    <>
      <h1 className="text-3xl tracking-wider font-bold mb-4">Refer a friend</h1>
      <div className="glassmorphic p-4 text-white">
        <p className="text-lg font-semibold">
          <span>Invite your friends and earn </span>
          <span className="inline-flex justify-center items-center">
            {rewardPoints.referFriend} <MindmintCoin className="ml-2" />
          </span>
        </p>
        {referralCode ? (
          <div>
            <p className="mt-2">
              Your referral code: <strong>{referralCode}</strong>
            </p>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleShare}
                className="px-4 py-2 btn-primary text-white flex items-center"
              >
                Share <FaShareAlt className="mx-2" />
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 btn-secondary rounded flex items-center"
              >
                {copyButtonText} <IoCopy className="mx-2" />
              </button>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      <h1 className="text-2xl tracking-wider font-semibold my-4">
        Referred Users
      </h1>
      <div className="text-light">
        {referredUsers.length > 0 ? (
          <ol className="list-decimal list-inside">
            {referredUsers.map((user) => (
              <li key={user.id} className="mb-2">
                {user.first_name} (@{user.username})
              </li>
            ))}
          </ol>
        ) : (
          <p>No users have joined through your referral yet.</p>
        )}
      </div>
    </>
  );
};

export default ReferralSection;
