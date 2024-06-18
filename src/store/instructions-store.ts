import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useHistoryChat } from "./history-store";
import { getChatId } from "@/lib/utils";

interface InstructionStore {
  userInstruction: string;
  gptInstruction: string;
  includeForNewChat: boolean;
  setIncludeForNewChat: (include: boolean) => void;
  setUserInstruction: (instruction: string) => void;
  setGptInstruction: (instruction: string) => void;
}

export const maxInstructionLength = Number(
  import.meta.env.VITE_INSTRUCTION_MAX_LENGTH,
);

export const useInstruction = create<InstructionStore>()(
  persist(
    (set) => ({
      userInstruction: "",
      gptInstruction: "",

      includeForNewChat: false,

      setIncludeForNewChat(include) {
        set({ includeForNewChat: include });
      },

      setUserInstruction: (instruction) => {
        instruction = instruction.trimStart();
        const { length } = instruction;

        if (length <= maxInstructionLength) {
          set({ userInstruction: instruction });
        }
      },
      setGptInstruction: (instruction) => {
        instruction = instruction.trimStart();
        const { length } = instruction;

        if (length <= maxInstructionLength) {
          set({ gptInstruction: instruction });
        }
      },
    }),
    { name: "instructions", version: 1 },
  ),
);

export function shouldCreateTitle(): boolean {
  const chatId = getChatId()!;
  return !useHistoryChat.getState().chats[chatId]?.tokenCount ?? 0;
}
