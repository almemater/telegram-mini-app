"use client";

import { useUser } from "@/context/UserContext";
import { tasks, walletConnectTask } from "@/libs/constants";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { FaCopy, FaShareAlt } from "react-icons/fa";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { Task } from "@/libs/types";

const EarnPage = () => {
  const { userData, setUserData, setShowPointsUpdatePopup } = useUser();

  if (!userData) {
    return <div>Loading...</div>;
  }

  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copyButtonText, setCopyButtonText] = useState<string>("Copy");
  const [referredUsers, setReferredUsers] = useState<
    { id: string; first_name: string; username: string }[]
  >([]);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
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
          // const newPoints = userData.points + task.points;
          // const newCompletedTasks = [...userData.completedTasks, task.id];

          try {
            const response = await fetch("/api/users/updatePoints", {
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
      }

      if (typeof window !== "undefined") {
        window.open(task.link, "_blank");
      }

      setTimeout(async () => {
        // const newPoints = userData.points + task.points;
        // const newCompletedTasks = [...userData.completedTasks, task.id];

        try {
          const response = await fetch("/api/users/updatePoints", {
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

  const handleShare = () => {
    if (referralCode) {
      const shareText = `I'm inviting you to use MindmInt! Use my referral code ${referralCode} while onboarding.`;
      if (typeof window !== "undefined") {
        WebApp.ready();
        WebApp.openTelegramLink(
          `https://t.me/share/url?url=https://t.me/jsamplebot&text=${encodeURIComponent(
            shareText
          )}`
        );
      }
    }
  };

  const handleCopy = () => {
    if (referralCode) {
      const inviteText = `I'm inviting you to use MindmInt! Use my referral code ${referralCode} while onboarding. Join here: https://t.me/jsamplebot`;
      navigator.clipboard
        .writeText(inviteText)
        .then(() => {
          setCopyButtonText("Copied!");
          setTimeout(() => setCopyButtonText("Copy"), 2000);
        })
        .catch((error) => {
          console.error("Error copying text:", error);
        });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Earn with Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 flex justify-between items-center">
            <span>{task.name}</span>
            <button
              onClick={() => handleTaskCompletion(task)}
              disabled={userData.completedTasks.includes(task.id)}
              className={`ml-4 px-4 py-2 rounded ${
                userData.completedTasks.includes(task.id)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-700"
              }`}
            >
              {userData.completedTasks.includes(task.id)
                ? "Completed"
                : task.btn}
            </button>
          </li>
        ))}
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

      <h1 className="text-2xl font-bold mb-4">Refer a friend</h1>
      <div className="bg-yellow-100 p-4 rounded text-black">
        <p className="text-lg font-semibold">
          Invite your friends and earn rewards!
        </p>
        {referralCode ? (
          <div>
            <p className="mt-2">
              Your referral code: <strong>{referralCode}</strong>
            </p>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 flex items-center"
              >
                Share <FaShareAlt className="mx-2" />
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center"
              >
                {copyButtonText} <FaCopy className="mx-2" />
              </button>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      <h1 className="text-xl font-semibold my-4">Referred Users</h1>
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
  );
};

export default EarnPage;
