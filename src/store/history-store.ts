import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useInstruction } from "./instructions-store";
import { uid } from "@/lib/utils";

export interface HistoryItem {
  title: string;
  model: ChatCompletionCreateParamsBase["model"];
  messages: ChatCompletionMessageParam[];
  date: Date;
  hasCustomInstructions: boolean;
  tokenCount?: number;
}

interface HistoryStore {
  chats: Record<string, HistoryItem>;
  clear(): void;
  addItem(model: ChatCompletionCreateParamsBase["model"]): string;
  addMessage(message: ChatCompletionMessageParam, uid: string): void;
  addChat(chat: HistoryItem, uid: string): void;
  updateMessage(
    message: ChatCompletionMessageParam["content"],
    uid: string,
    index?: number,
  ): void;
  setChatModel(model: string, uid: string): void;
  setTitle(title: string, uid: string): void;
  getChat(uid: string): HistoryItem;
  remove(uid: string): void;
  popMessage(uid: string): void;
  setTokenCount(uid: string, count: number): void;
}

export const useHistoryChat = create<HistoryStore>()(
  persist(
    immer((set, get) => ({
      chats: {},

      clear: () => set({ chats: {} }),

      addItem: (model) => {
        const id = uid();

        const _ = useInstruction.getState();

        const instructions: ChatCompletionMessageParam[] = _.includeForNewChat
          ? ([
              _.gptInstruction.trim()
                ? {
                    role: "system",
                    content: "Instructions for you: " + _.gptInstruction,
                  }
                : null,
              _.userInstruction.trim()
                ? {
                    role: "system",
                    content: "user information: " + _.userInstruction,
                  }
                : null,
            ].filter(Boolean) as ChatCompletionMessageParam[])
          : [];

        set((store) => {
          store.chats = {
            [id]: {
              model,
              hasCustomInstructions: _.includeForNewChat,
              title: `Chat ${Object.keys(store.chats).length + 1}`,
              messages: [
                {
                  role: "system",
                  content:
                    "Respond using markdown. Use $$math$$ for block mathematical expressions and $inline math$ for inline math expressions. Do not use this format to style or format functions [].",
                },
                ...instructions,
              ],
              date: new Date(),
            },
            ...store.chats,
          };
        });

        return id;
      },

      setTokenCount: (uid, count) =>
        set((store) => {
          store.chats[uid].tokenCount = count;
        }),

      setChatModel: (model, uid) =>
        set((store) => {
          store.chats[uid].model = model;
        }),

      setTitle: (title, uid) =>
        set((store) => {
          store.chats[uid].title = title;
        }),

      remove: (uid) =>
        set((store) => {
          delete store.chats[uid];
        }),

      addMessage: (message, uid) =>
        set((store) => {
          store.chats[uid].messages.push(message);
        }),

      updateMessage: (message, uid, index) => {
        set((store) => {
          setMessage(store, uid, message, index);
        });
      },

      popMessage(uid) {
        set((store) => {
          setMessage(store, uid, "");
        });
      },

      getChat(uid) {
        return get().chats[uid];
      },

      addChat(chat, uid) {
        set((store) => {
          store.chats = {
            [uid]: chat,
            ...store.chats,
          };
        });
      },
    })),
    { name: "history", version: 4 },
  ),
);

function setMessage(
  store: HistoryStore,
  uid: string,
  message: ChatCompletionMessageParam["content"],
  index?: number,
) {
  const messages = store.chats[uid]?.messages;
  const length = messages?.length;
  if (messages && length > 0) {
    messages[index ?? length - 1].content = message;
  }
}
