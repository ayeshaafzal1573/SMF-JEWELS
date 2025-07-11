"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return; // Wait until hydrated

    if (!user) {
      router.push("/auth/login");
    } else if (user.role !== "admin") {
      router.push("/");
    }
  }, [user, hydrated]);

  if (!hydrated) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading auth...</div>;
  }

  return <>{children}</>;
}
