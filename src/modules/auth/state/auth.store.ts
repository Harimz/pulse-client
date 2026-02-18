import { create } from "zustand";

type AuthStatus = "idle" | "pending" | "ready";

type AuthState = {
  accessToken?: string | null;
  setAccessToken: (t: string | null) => void;
  status: AuthStatus;
  setStatus: (s: AuthStatus) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (t) => set({ accessToken: t }),
  setStatus: (s) => set({ status: s }),
  status: "idle",
}));
