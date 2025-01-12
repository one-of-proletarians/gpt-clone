import { useAPIKey } from "@/store/key-store";
import OpenAI from "openai";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";
import { useRef, useState } from "react";

import { errorStyle } from "@/components/ui/sonner";
import i18n from "@/localization";
import { useTokenUsage } from "@/store/token-usage-store";
import { APIError } from "openai/error.mjs";
import { toast } from "sonner";
import { useHistoryChat } from "@/store/history-store";
import { useCurrentChatId } from "@/store/current_chat_id-store";

const apiKey = useAPIKey.getState().apiKey;

export const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

useAPIKey.subscribe((state) => (openai.apiKey = state.apiKey));

export const createChatTitle = (message: string): Promise<string> =>
  new Promise((resolve) => {
    openai.chat.completions
      .create({
        model: import.meta.env.VITE_TITLE_MODEL,
        max_tokens: 8,
        messages: [
          {
            role: "system",
            content:
              "you are a very useful assistant for creating short titles",
          },
          {
            role: "system",
            content: "not using markdown",
          },
          {
            role: "user",
            content: import.meta.env.VITE_CREATE_TITLE_PROMPT + " " + message,
          },
        ],
      })
      .then((res) => {
        if (res.usage) useTokenUsage.getState().setTitleUsage(res.usage);

        resolve(
          res.choices[0].message?.content?.replace(
            /^['"]|['"]$/g,
            "",
          ) as string,
        );
      })
      .catch(handleAPIError);
  });

export const getModels = () => Promise.resolve(["gpt-4o", "gpt-4o-mini"]);

interface UseOpenAiParams {
  model: ChatCompletionCreateParamsBase["model"];
  messages: ChatCompletionCreateParamsBase["messages"];
}

export const useOpenAI = () => {
  const [response, setResponse] = useState("");
  const [isStreamLoading, setIsStreamLoading] = useState(false);
  const controller = useRef<AbortController | null>(null);

  const send = async ({ messages, model }: UseOpenAiParams) => {
    setIsStreamLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model,
        messages,
        stream: true,
        stream_options: { include_usage: true },
      });

      controller.current = response.controller;

      for await (const chunk of response) {
        setResponse((prev) => prev + (chunk.choices[0]?.delta?.content || ""));

        if (chunk.usage) {
          const chatId = useCurrentChatId.getState().currentChatId;
          useTokenUsage.getState().setTokenUsage(chunk.usage);
          useHistoryChat
            .getState()
            .setTokenCount(chatId, chunk.usage.total_tokens);
        }
      }
    } catch (e) {
      handleAPIError(e);
    } finally {
      setIsStreamLoading(false);
      setTimeout(() => setResponse(""));
    }
  };

  return {
    send,
    response,
    controller,
    isStreamLoading,
  };
};
export const transcribeAudio = async (file: File): Promise<string | void> =>
  openai.audio.transcriptions
    .create({
      file,
      model: "whisper-1",
      response_format: "text",
    })
    .then((res) => (res as unknown as string).trim())
    .catch(handleAPIError);

export const handleAPIError = (error: unknown) => {
  if (error instanceof APIError) {
    toast.error(i18n.t(`errors.${error.type ?? "default"}`), errorStyle);
  }
};
