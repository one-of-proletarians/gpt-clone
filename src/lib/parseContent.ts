import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

interface ParseContentResult {
  images: string[];
  text: string;
}
export const parseContent = (
  content: ChatCompletionMessageParam["content"],
): ParseContentResult => {
  if (!content) return { images: [], text: "" };

  if (typeof content === "string") {
    return { images: [], text: content };
  }

  let text = "";
  const images: Array<string> = [];

  content.forEach((item) => {
    if (item.type === "text") {
      text = item.text;
    } else if (item.type === "image_url") {
      images.push(item.image_url.url);
    }
  });

  return { images, text };
};
