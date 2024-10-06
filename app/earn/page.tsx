"use client";
import { useUser } from "@/context/UserContext";
import { rewardPoints, tasks, walletConnectTask } from "@/libs/constants";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { FaArrowRight, FaShareAlt } from "react-icons/fa";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { Task } from "@/libs/types";
import PageHeader from "@/components/PageHeader";
import { IoCopy } from "react-icons/io5";
import RewardsProgramPopup from "@/components/RewardsProgramPopup"; // Assuming you have a Modal component
import Image from "next/image";
import MindmintCoin from "@/components/MindmintCoin";

const EarnPage = () => {
  const {
    userData,
    setUserData,
    pointsData,
    setPointsData,
    setShowPointsUpdatePopup,
  } = useUser();

  if (!userData) {
    return <div>Loading...</div>;
  }

  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copyButtonText, setCopyButtonText] = useState<string>("Copy");
  const [referredUsers, setReferredUsers] = useState<
    { id: string; first_name: string; username: string }[]
  >([]);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility
  const wallet = useTonWallet();

  const handleTaskCompletion = async (task: Task) => {
    if (!userData) {
      console.error("User data is not available");
      return;
    }

    if (!userData.completedTasks.includes(task.id)) {
      if (task.id === 100) {
        // Special handling for wallet connection task
        setTimeout(async () => {
          try {
            const response = await fetch("/api/points/updatePoints", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: userData.id,
                points: task.points,
                task: task.id,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to update user data");
            }

            const updatedUser = await response.json();
            setUserData(updatedUser.user);
            setPointsData(updatedUser.pointsdata);

            setShowPointsUpdatePopup({
              message: "Congratulations! Your wallet has been connected.",
              points: task.points,
              buttonText: "Yaay",
              onClose: () => setShowPointsUpdatePopup(null),
              positive: true,
            });
          } catch (error) {
            console.error("Error updating user data:", error);
          }
        }, 3000); // 3 seconds delay
      } else {
        if (typeof window !== "undefined") {
          window.open(task.link, "_blank");
        }

        setTimeout(async () => {
          try {
            const response = await fetch("/api/points/updatePoints", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: userData.id,
                points: task.points,
                task: task.id,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to update user data");
            }

            const updatedUser = await response.json();
            setUserData(updatedUser.user);
            setPointsData(updatedUser.pointsdata);

            setShowPointsUpdatePopup({
              message: "Task Completed!",
              points: task.points,
              buttonText: "Close",
              onClose: () => setShowPointsUpdatePopup(null),
              positive: true,
            });
          } catch (error) {
            console.error("Error updating user data:", error);
          }
        }, 3000); // 3 seconds delay
      }
    }
  };

  useEffect(() => {
    const isConnected = wallet !== null;
    setIsWalletConnected(isConnected);

    if (isConnected) {
      handleTaskCompletion(walletConnectTask);
    }
  }, [wallet]);

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
      <PageHeader title="Earn" description="Claim points for tasks" />
      <div className="px-4 mb-8 mt-4">
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className="mb-2 flex justify-between items-center"
            >
              <span className="w-2/3">{task.name}</span>
              <button
                onClick={() => handleTaskCompletion(task)}
                disabled={userData.completedTasks.includes(task.id)}
                className={`px-4 py-2 rounded ${
                  userData.completedTasks.includes(task.id)
                    ? "bg-gradient-to-b from-gray-200 to-gray-400 shadow-md cursor-not-allowed"
                    : "btn-primary"
                }`}
              >
                {userData.completedTasks.includes(task.id) ? (
                  "Completed"
                ) : (
                  <div className="flex items-center justify-center">
                    <MindmintCoin className="mr-2" />
                    {task.points} <FaArrowRight className="ml-2" />
                  </div>
                )}
              </button>
            </li>
          ))}
          <li
            id="ton-connect-list-item"
            className="mb-2 flex justify-between items-center"
          >
            <span>Your Weekly Rewards</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              <div className="flex items-center justify-center">View</div>
            </button>
          </li>
          <li
            id="ton-connect-list-item"
            className="mb-2 flex justify-between items-center"
          >
            <span>Connect TON Wallet</span>
            <TonConnectButton />
          </li>
        </ul>

        <div className="my-4 border border-gray-300" />

        <div className="mb-2 flex justify-between items-center">
          <span>Wallet Status:</span>
          <span>{isWalletConnected ? "Connected" : "Not Connected"}</span>
        </div>

        <div className="my-4 border border-gray-300" />

        {/* Reward Program Button */}
        {/* <div >
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full justify-center py-2 btn-primary text-white flex items-center"
          >
            Reward Program
          </button>
        </div>
        
        <div className="my-4 border border-gray-300" /> */}

        <h1 className="text-3xl tracking-wider font-bold mb-4">
          Refer a friend
        </h1>
        <div className="glassmorphic p-4  text-white ">
          <p className="text-lg font-semibold">
            <span>Invite your friends and earn </span>
            <span className="inline-flex justify-center items-center ">
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
      </div>
      {/* Reward Program Modal */}
      {isModalOpen && (
        <RewardsProgramPopup onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default EarnPage;
