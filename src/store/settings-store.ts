import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ClearItems {
  history: boolean;
  cache: boolean;
}

interface SettingsState {
  clearAtLogout: ClearItems;
  scrollWhenResponding: boolean;

  setClearAtLogout: (clear: Partial<ClearItems>) => void;
  setScrollWhenResponding: (scroll: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      clearAtLogout: {
        history: true,
        cache: true,
      },

      scrollWhenResponding: true,

      setScrollWhenResponding: (scroll) =>
        set({ scrollWhenResponding: scroll }),

      setClearAtLogout: (clear) =>
        set((store) => ({
          clearAtLogout: Object.assign(store.clearAtLogout, clear),
        })),
    }),
    { name: "settings" },
  ),
);
