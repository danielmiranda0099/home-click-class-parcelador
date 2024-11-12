"use client";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";

export function useUserSession() {
  const { user_session, setUserSession } = useUserStore();

  useEffect(() => {
    if (!user_session) {
      setUserSession();
    }
  }, []);

  return user_session;
}
