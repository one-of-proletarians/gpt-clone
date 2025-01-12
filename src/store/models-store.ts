import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { getModels } from "@/lib/openai";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";
import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ModelsState {
  model: ChatCompletionCreateParamsBase["model"];
  models: Array<ChatCompletionCreateParamsBase["model"]>;
  init: () => void;
  setModel: (model: string) => void;
}

const store = create<ModelsState>()(
  persist(
    (set) => ({
      model: "gpt-4o",
      models: [],

      setModel: (model) => set({ model }),
      init: () => {
        getModels().then((models) => set({ models }));
      },
    }),
    {
      name: "models",
      version: 2,
    },
  ),
);

export const useModel = () => {
  const { model, models, setModel, init: initModels } = store();
  useNetworkStatus({ online: initModels });
  useEffect(initModels, [initModels]);
  return { model, models, setModel };
};

useModel.getState = () => store.getState();
