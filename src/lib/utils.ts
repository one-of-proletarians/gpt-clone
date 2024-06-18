import { type ClassValue, clsx } from "clsx";
import {
  ChatCompletionContentPart,
  CompletionUsage,
} from "openai/resources/index.mjs";
import { twMerge } from "tailwind-merge";
import { pricing } from "../components/usage/tabs/price/pricing";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringToHash(string: string) {
  return string.split("").reduce((hash: number, char: string) => {
    return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
  }, 0);
}

export function blobToString(blob: Blob) {
  const reader = new FileReader();
  reader.readAsDataURL(blob);

  return new Promise((resolve) => {
    reader.onloadend = () => resolve(reader.result);
  });
}

export const uid = () => Math.random().toString(36).substring(2, 15);

export const fileExt = (fileName: string) =>
  fileName.split(".").pop() as string;
export const fileSizeIsLessOrEqualTo = (size: number | bigint, file: File) =>
  file.size <= size;

export const formatFileSize = Intl.NumberFormat("en-US", {
  unit: "byte",
  notation: "compact",
}).format;

export const createChatMessage = (
  editImage: boolean,
  imageURL: string | null,
  text: string,
): ChatCompletionContentPart[] =>
  editImage && imageURL
    ? [
        { type: "image_url", image_url: { url: imageURL! } },
        { type: "text", text },
      ]
    : [{ type: "text", text }];

export const checkMacOS = () => /macintosh|mac os x/i.test(navigator.userAgent);

export const getAudioDuration = async (file: File) => {
  const audioContext = new AudioContext();
  const buffer = await file.arrayBuffer();
  const decode = await audioContext.decodeAudioData(buffer);

  return decode.duration;
};

export const getChatId = () => {
  const path = window.location.pathname;
  const regex = /^\/chat\/([a-zA-Z0-9]+)$/;
  return path.match(regex)?.[1];
};

export const formatTime = (counter: number) => {
  const seconds = `${counter % 60}`.padStart(2, "0");
  const minutes = `${Math.floor(counter / 60)}`.padStart(2, "0");
  const hours = `${Math.floor(counter / 3600)}`.padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

// *****
const titleModel = import.meta.env.VITE_TITLE_MODEL;
const convertPrice = (model: string) => ({
  inputPrice: pricing[model].input / 1_000_000,
  outputPrice: pricing[model].output / 1_000_000,
});

const titlePrices = convertPrice(titleModel);

export const calculateUsageCost = (
  usage: CompletionUsage,
  titleUsage: CompletionUsage,
  model: string,
) => {
  try {
    const { inputPrice, outputPrice } = convertPrice(model);

    const inCost = inputPrice * (usage?.prompt_tokens ?? 0);
    const ouCost = outputPrice * (usage?.completion_tokens ?? 0);

    const titleInCost =
      titlePrices.inputPrice * (titleUsage?.prompt_tokens ?? 0);
    const titleOutCost =
      titlePrices.outputPrice * (titleUsage?.completion_tokens ?? 0);

    return inCost + ouCost + titleInCost + titleOutCost;
  } catch (e) {
    return 0;
  }
};
