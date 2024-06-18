import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MenuState {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleMenu: () => void;
}

export const useMenuState = create<MenuState>()(
  persist(
    (set) => ({
      open: false,
      setOpen: (open: boolean) => set({ open }),
      toggleMenu: () => set((state) => ({ open: !state.open })),
    }),
    { name: "menu-state" },
  ),
);
