import { create } from "zustand";

interface ShareState {
  open: boolean;
  setShareOpen: (share: boolean) => void;
  openShareDialog: () => void;
  closeShareDialog: () => void;
}

export const useShare = create<ShareState>()((set) => ({
  open: false,
  setShareOpen: (share) => set({ open: share }),
  openShareDialog: () => set({ open: true }),
  closeShareDialog: () => set({ open: false }),
}));
