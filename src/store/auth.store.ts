import { create } from "zustand";
import { env } from "@/lib/env";

interface AuthState {
  accessToken: string | null;
}

export const useAuthStore = create<AuthState>(() => ({
  accessToken: env.accessToken,
}));
