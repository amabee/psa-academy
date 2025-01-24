"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/onboard-navbar";
import UserProvider, { useUser } from "./providers/UserProvider";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function LayoutContent({ children }) {
  const { user, loading } = useUser();

  useEffect(() => {
    const handleLocalStorageClear = () => {
      const clearCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("clear-user-data="));

      if (clearCookie) {
        localStorage.removeItem("user");
        document.cookie =
          "clear-user-data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    };

    handleLocalStorageClear();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500`}
      >
        {loading ? null : !user && <Navbar />}
        {children}
      </body>
    </html>
  );
}

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  );
}
