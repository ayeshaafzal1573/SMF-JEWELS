"use client"

import Loading from "@/app/loading";
import { useAuthStore } from "@/stores/useAuthStore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function UserOnly({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return; // Wait for Zustand to load persisted state

    if (!user) {
      router.push("/auth/login");
    } else if (user.role !== "user") {
      router.push("/");
    } else {
      setLoading(false); // ✅ Set loading false if user is valid
    }
  }, [user, hydrated]);

  if (loading || !hydrated) {
    return 
    <Loading/ >
  }

  return <>{children}</>;
}
