import { Settings } from "@/pages/settings";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/settings")({
  component: Settings,
});
