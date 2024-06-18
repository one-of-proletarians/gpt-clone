import { redirect } from "@tanstack/react-router";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface APIKeyState {
  apiKey: string;
  setApiKey: (key: string, save?: boolean) => void;
  clearApiKey: () => void;
}

export const useAPIKey = create<APIKeyState>()(
  persist(
    (set) => ({
      apiKey: "",
      setApiKey: (apiKey) => set({ apiKey }),
      clearApiKey: () => set({ apiKey: "" }),
    }),
    { name: "key" },
  ),
);

export const checkApiKey = () => {
  const { apiKey } = useAPIKey.getState();
  if (!apiKey.length) throw redirect({ to: "/" });
};
