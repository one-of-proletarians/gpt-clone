import { ChatPage } from "@/pages/chat";
import { checkApiKey } from "@/store/key-store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/")({
  beforeLoad: checkApiKey,

  component: ChatPage,
});
