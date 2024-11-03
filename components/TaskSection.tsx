import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import MindmintCoin from "@/components/MindmintCoin";
import { tasks, walletConnectTask } from "@/libs/constants";
import { Task } from "@/libs/types";
import { useUser } from "@/context/UserContext";

const TaskSection = () => {
  const { userData, setUserData, setPointsData, setShowPointsUpdatePopup } =
    useUser();

  if (!userData) {
    return <div>Loading...</div>;
  }

  const wallet = useTonWallet();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);

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

  return (
    <>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 flex justify-between items-center">
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
    </>
  );
};

export default TaskSection;
