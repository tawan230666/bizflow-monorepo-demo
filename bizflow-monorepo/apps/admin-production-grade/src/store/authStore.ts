import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => {
        // เก็บใน sessionStorage แทน localStorage
        sessionStorage.setItem("admin_token", token);
        sessionStorage.setItem("admin_user", JSON.stringify(user));
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        sessionStorage.removeItem("admin_token");
        sessionStorage.removeItem("admin_user");
        sessionStorage.removeItem("bizflow-admin-auth");
        // เผื่อมีค้างใน localStorage จาก version เก่า
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "bizflow-admin-auth",
      storage: createJSONStorage(() => sessionStorage), // 👈 sessionStorage
    }
  )
);
