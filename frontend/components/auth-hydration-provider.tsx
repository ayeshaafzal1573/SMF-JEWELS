"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/useAuthStore"

export function AuthHydrationProvider({ children }: { children: React.ReactNode }) {
  const setToken = useAuthStore((state) => state.setToken)

  useEffect(() => {
    const token = localStorage.getItem("smf_jwt_token")
    if (token) {
      setToken(token)
    }
  }, [])

  return <>{children}</>
}
