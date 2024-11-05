import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./build.css";
import Script from "next/script";
import ClientWrapper from "@/components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindmInt",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen bg-dark text-white">
          <ClientWrapper>{children}</ClientWrapper>

          {/* <NavBar /> */}
        </div>
      </body>
    </html>
  );
}
