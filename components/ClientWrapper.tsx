"use client";
import { useEffect, useState } from "react";
import { ReactNode } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import AppBar from "./AppBar";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import SplashScreen from "./SplashScreen"; // Import SplashScreen
import NavBar from "./NavBar";

const ClientWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <InnerClientWrapper>{children}</InnerClientWrapper>
    </UserProvider>
  );
};

const InnerClientWrapper = ({ children }: { children: ReactNode }) => {
  const { loading } = useUser();
  const [minimumLoadingTime, setMinimumLoadingTime] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumLoadingTime(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <TonConnectUIProvider manifestUrl="https://mindmint.almemater.com/tonconnect-manifest.json">
      {loading || minimumLoadingTime ? (
        <SplashScreen /> // Show SplashScreen while loading or minimum loading time has not passed
      ) : (
        <>
          <AppBar />
          <main className="flex-grow p-4 pb-16">{children}</main>
          <NavBar />
        </>
      )}
    </TonConnectUIProvider>
  );
};

export default ClientWrapper;