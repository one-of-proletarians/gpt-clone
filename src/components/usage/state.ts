import { create } from "zustand";

interface UsageState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useBadgeDialogState = create<UsageState>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));
