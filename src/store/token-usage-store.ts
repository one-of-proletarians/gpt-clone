import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";
import { CompletionUsage } from "openai/resources/index.mjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useCurrentChatId } from "./current_chat_id-store";
import { useModel } from "./models-store";

export type Usage = CompletionUsage;

type Item = {
  usage: Usage;
  titleUsage: Usage;
  model: ChatCompletionCreateParamsBase["model"] | string;
  tts: number;
  ttsHD: number;
  createdAt: Date;
  updatedAt: Date | null;
};

type Items = Record<string, Item>;

interface TokenUsageState {
  items: Items;
  setTokenUsage: (usage: Usage) => void;
  setTitleUsage: (titleUsage: Usage) => void;
  setTTSUsage: (key: TTSKey, nUsage: number) => void;
  clear: () => void;
}

type RestUsage = { titleUsage?: Usage; usage?: Usage };
type Key = keyof RestUsage;
type TTSKey = "tts" | "ttsHD";

const createEmptyUsage = () => ({
  prompt_tokens: 0,
  completion_tokens: 0,
  total_tokens: 0,
});

const createItem = (rest: RestUsage): Item => ({
  titleUsage: createEmptyUsage(),
  usage: createEmptyUsage(),
  model: useModel.getState().model,
  tts: 0,
  ttsHD: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...rest,
});

const updateItem = (item: Item, nUsage: Usage, key: Key) => ({
  ...item,
  [key]: {
    prompt_tokens: item[key].prompt_tokens + nUsage.prompt_tokens,
    completion_tokens: item[key].completion_tokens + nUsage.completion_tokens,
    total_tokens: item[key].total_tokens + nUsage.total_tokens,
  },
  updatedAt: new Date(),
});

const updateAudioUsage = (item: Item, nUsage: number, key: TTSKey) => ({
  ...item,
  [key]: (item?.[key] ?? 0) + nUsage,
  updatedAt: new Date(),
});

function getUidAndItem(get: () => TokenUsageState): [string, Item] {
  const uid = useCurrentChatId.getState().currentChatId;
  const item = get().items[uid];
  return [uid, item];
}

export const useTokenUsage = create<TokenUsageState>()(
  immer(
    persist(
      (set, get) => ({
        items: {},

        setTitleUsage: (titleUsage) => {
          const [uid, item] = getUidAndItem(get);

          set((state) => {
            if (item) {
              state.items[uid] = updateItem(item, titleUsage, "titleUsage");
            } else {
              state.items[uid] = createItem({ titleUsage });
            }
          });
        },
        setTokenUsage: (usage) => {
          const [uid, item] = getUidAndItem(get);

          set((state) => {
            if (item) {
              state.items[uid] = updateItem(item, usage, "usage");
            } else {
              state.items[uid] = createItem({ usage });
            }
          });
        },

        setTTSUsage: (key, nUsage) => {
          const uid = location.pathname.split("/").at(-1) as string;
          const item = get().items[uid];

          set((state) => {
            state.items[uid] = updateAudioUsage(item, nUsage, key);
          });
        },

        clear: () => set({ items: {} }),
      }),
      { name: "token-usage" },
    ),
  ),
);
