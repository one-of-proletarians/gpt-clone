import { useParams } from "@tanstack/react-router";

export const useChatId = () => {
  return useParams({
    strict: false,
    select: (params: { chatId: string }) => params.chatId,
  });
};
