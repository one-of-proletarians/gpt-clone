import { create } from "zustand";

interface CurrentPostState {
  currentChatId: string;
  setCurrentChatId: (chatId: string) => void;
}

export const useCurrentChatId = create<CurrentPostState>()((set) => ({
  currentChatId: "",
  setCurrentChatId: (currentChatId: string) => set({ currentChatId }),
}));
