import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import {
  PointsUpdatePopupProps,
  PointsData,
  TGUserData,
  UserData,
  sampleUserData,
} from "@/libs/types";
import { premiumUserTask, rewardPoints } from "@/libs/constants";

export const useInitializeUser = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showPointsUpdatePopup, setShowPointsUpdatePopup] =
    useState<PointsUpdatePopupProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // New loading state

  useEffect(() => {
    const initializeUser = async () => {
      let user: TGUserData;
      let referralCode: string | null = null;

      if (process.env.NEXT_PUBLIC_DEVELOPMENT === "true") {
        user = sampleUserData as TGUserData;
      } else if (typeof window !== "undefined" && WebApp.initDataUnsafe.user) {
        await WebApp.ready();
        user = WebApp.initDataUnsafe.user as TGUserData;
        referralCode = WebApp.initDataUnsafe.start_param || null;
      } else {
        console.error("User data is not available");
        setLoading(false); // Set loading to false
        return;
      }

      try {
        const response = await fetch(
          `/api/users/getUser?userid=${user.id}`
        );
        if (response.ok) {
          const userData = await response.json();
          setUserData(userData.user);
          setPointsData(userData.pointsdata);
          // setShowPopup(true);
        } else {
          const createUserResponse = await fetch("/api/users/createUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              username: user.username,
              language_code: user.language_code,
              is_premium: user.is_premium,
              points: 0,
              completedTasks: [],
            }),
          });

          if (createUserResponse.ok) {
            const newUser = await createUserResponse.json();
            setUserData(newUser.user);
            setPointsData(newUser.pointsdata);

            if (user.is_premium) {
              const task = premiumUserTask;

              try {
                const response = await fetch("/api/points/updatePoints", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: user.id,
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
            }

            if (referralCode) {
              await handleReferral(referralCode, newUser.user.id);
            } 
          } else {
            console.error("Error creating user");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    const handleReferral = async (referralCode: string, userId: string) => {
      try {
        const response = await fetch("/api/users/referrals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            referralCode,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.referee);
          setShowPointsUpdatePopup({
            message: `You were referred by ${data.referrer.full_name}`,
            points: rewardPoints.referFriend,
            buttonText: "Close",
            onClose: () => setShowPointsUpdatePopup(null),
            positive: true,
          });
          console.log("Referral processed successfully:", data);
        } else {
          console.error("Failed to process referral");
        }
      } catch (error) {
        console.error("Error processing referral:", error);
      }
    };

    initializeUser();
  }, []);

  return {
    userData,
    setUserData,
    pointsData,
    setPointsData,
    showPopup,
    setShowPopup,
    showPointsUpdatePopup,
    setShowPointsUpdatePopup,
    loading
  };
};
