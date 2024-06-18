import { Share } from "@/pages/share";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/share/$id")({
  component: Share,
});
