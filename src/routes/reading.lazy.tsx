import { Reading } from "@/pages/reading";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/reading")({
  component: Reading,
});
