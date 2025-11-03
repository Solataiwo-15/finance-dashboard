// src/components/session-provider.tsx
"use client";

import { account } from "@/lib/appwrite";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAppStore();

  useEffect(() => {
    // This effect runs once when the app loads
    const checkSession = async () => {
      try {
        const currentUser = await account.get(); // Check for a logged-in user
        setUser(currentUser); // If found, update our store
      } catch (error) {
        setUser(null); // If not found, ensure user is set to null
      }
    };

    checkSession();
  }, [setUser]); // The effect depends on the setUser function

  return <>{children}</>; // Render the rest of the application
}
