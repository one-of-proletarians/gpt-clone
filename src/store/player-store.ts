import { create } from "zustand";

interface PlayerState {
  text: string;
  visible: boolean;
  isLoading: boolean;
  setText: (text: string) => void;
  setVisible: (visible: boolean) => void;
  setIsLoading: (isPlaying: boolean) => void;
}

export const usePlayer = create<PlayerState>()((set) => ({
  text: "",
  visible: false,
  isLoading: false,
  setText: (text) => set({ text }),
  setVisible: (visible) => set({ visible }),
  setIsLoading: (isPlaying) => set({ isLoading: isPlaying }),
}));
