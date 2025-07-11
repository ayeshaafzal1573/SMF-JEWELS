"use client";

import { UserOnly } from "@/components/user-only";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserOnly>
   
      {children}
    </UserOnly>
  );
}
