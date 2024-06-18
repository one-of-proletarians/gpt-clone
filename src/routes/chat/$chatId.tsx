import { ChatPage } from "@/pages/chat";
import { useHistoryChat } from "@/store/history-store";
import { checkApiKey } from "@/store/key-store";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/$chatId")({
  beforeLoad: ({ params }) => {
    checkApiKey();

    const { chatId } = params;
    const ids = Object.keys(useHistoryChat.getState().chats);

    if (!ids.includes(chatId)) {
      throw notFound();
    }
  },

  component: ChatPage,
});
