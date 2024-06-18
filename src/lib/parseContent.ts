import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

interface ParseContentResult {
  image: string | null;
  text: string;
}
export const parseContent = (
  content: ChatCompletionMessageParam["content"],
): ParseContentResult => {
  if (!content) return { image: null, text: "" };

  if (typeof content === "string") {
    return { image: null, text: content };
  }

  let text = "";
  let image: string | null = null;

  content.forEach((item) => {
    if (item.type === "text") {
      text = item.text;
    } else if (item.type === "image_url") {
      image = item.image_url.url;
    }
  });

  return { image, text };
};
