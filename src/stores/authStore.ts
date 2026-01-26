import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfileDto } from "@/types/api";

interface AuthState {
  token: string | null;
  user: UserProfileDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UserProfileDto) => void;
  logout: () => void;
  setUser: (user: UserProfileDto) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
      setUser: (user) =>
        set({
          user,
        }),
      setLoading: (isLoading) =>
        set({
          isLoading,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

