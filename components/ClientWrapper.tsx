"use client";

import { ReactNode } from "react";
import { UserProvider } from "@/context/UserContext";
import AppBar from "./AppBar";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const ClientWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <TonConnectUIProvider manifestUrl="https://jsample.vercel.app/tonconnect-manifest.json">
        <AppBar />
        <main className="flex-grow p-4 pb-16 overflow-y-auto">{children}</main>
        {/* <NavBar /> */}
      </TonConnectUIProvider>
    </UserProvider>
  );
};

export default ClientWrapper;
