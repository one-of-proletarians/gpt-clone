import { getChatId } from "@/lib/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Item {
  chatId?: string;
  duration: number;
  createdAt: Date;
}

interface ItemWithoutChatId extends Omit<Item, "chatId"> {}

interface ObjectItem extends Record<string, ItemWithoutChatId> {}

interface WhisperUsageState {
  items: Item[];
  addOrUpdate: (duration: number) => void;
  extractDataWithChatId: () => ObjectItem;
  extractEntriesWithChatId: () => [string, ItemWithoutChatId][];
  getTotalDuration: () => number;
  clear: () => void;
}

export const useWhisperUsage = create<WhisperUsageState>()(
  immer(
    persist(
      (set) => ({
        items: [],

        extractDataWithChatId() {
          const object: ObjectItem = {};

          for (const item of this.items) {
            if (!item.chatId) continue;

            object[item.chatId] = {
              duration: item.duration,
              createdAt: item.createdAt,
            };
          }

          return object;
        },

        getTotalDuration() {
          return this.items.reduce((acc, item) => acc + item.duration, 0);
        },

        extractEntriesWithChatId() {
          return Object.entries(this.extractDataWithChatId());
        },

        addOrUpdate(duration) {
          set((state) => {
            const chatId = getChatId();
            const index = state.items.findIndex(
              (item) => item.chatId === chatId,
            );

            if (chatId && index !== -1) {
              state.items[index].duration += duration;
            } else {
              state.items.push({
                chatId,
                duration,
                createdAt: new Date(),
              });
            }
          });
        },

        clear() {
          set((state) => {
            state.items = [];
          });
        },
      }),
      { name: "whisper-usage" },
    ),
  ),
);
