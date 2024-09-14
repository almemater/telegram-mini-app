"use client";
import { createContext, useContext, ReactNode } from "react";
import { useInitializeUser } from "@/hooks/useInitializeUser";
import { PointsUpdatePopupProps, UserData } from "@/libs/types";

interface UserContextType {
  userData: UserData | null;
  setUserData: (user: UserData | null) => void;
  showPopup: boolean;
  setShowPopup: (show: boolean) => void;
  showWelcomePopup: boolean;
  setShowWelcomePopup: (show: boolean) => void;
  showPointsUpdatePopup: PointsUpdatePopupProps | null;
  setShowPointsUpdatePopup: (popup: PointsUpdatePopupProps | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const {
    userData,
    setUserData,
    showPopup,
    setShowPopup,
    showWelcomePopup,
    setShowWelcomePopup,
    showPointsUpdatePopup,
    setShowPointsUpdatePopup,
  } = useInitializeUser();

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        showPopup,
        setShowPopup,
        showWelcomePopup,
        setShowWelcomePopup,
        showPointsUpdatePopup,
        setShowPointsUpdatePopup,
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
