"use client";

import { account } from "@/lib/appwrite";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAppStore();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };

    checkSession();
  }, [setUser]);

  return <>{children}</>;
}
