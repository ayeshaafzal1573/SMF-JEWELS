import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

type User = {
  id: string;
  email: string;
  role: "admin" | "user";
};

type AuthState = {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,
      setToken: (token) => {
        try {
          const decoded = jwtDecode(token) as any;
          set({
            token,
            user: { id: decoded.id, email: decoded.email, role: decoded.role },
            hydrated: true,
          });
        } catch (err) {
          console.error("Invalid token");
          set({ token: null, user: null, hydrated: true });
        }
      },
      logout: () => set({ token: null, user: null, hydrated: true }),
    }),
    {
      name: "smf_auth",
      onRehydrateStorage: () => (state) => {
        state.hydrated = true; // Mark hydrated after rehydration
      },
    }
  )
);
export const useIsAdmin = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role === "admin";
};  