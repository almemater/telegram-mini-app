"use client";
import { createContext, useContext, ReactNode } from "react";
import { useInitializeUser } from "@/hooks/useInitializeUser";
import { PointsUpdatePopupProps, UserData, PointsData } from "@/libs/types";

interface UserContextType {
  userData: UserData | null;
  setUserData: (user: UserData | null) => void;
  pointsData: PointsData | null;
  setPointsData: (point: PointsData | null) => void;
  showPopup: boolean;
  setShowPopup: (show: boolean) => void;
  showWelcomePopup: boolean;
  setShowWelcomePopup: (show: boolean) => void;
  showPointsUpdatePopup: PointsUpdatePopupProps | null;
  setShowPointsUpdatePopup: (popup: PointsUpdatePopupProps | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const {
    userData,
    setUserData,
    pointsData,
    setPointsData,
    showPopup,
    setShowPopup,
    showWelcomePopup,
    setShowWelcomePopup,
    showPointsUpdatePopup,
    setShowPointsUpdatePopup,
    loading,
  } = useInitializeUser();

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        pointsData,
        setPointsData,
        showPopup,
        setShowPopup,
        showWelcomePopup,
        setShowWelcomePopup,
        showPointsUpdatePopup,
        setShowPointsUpdatePopup,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
