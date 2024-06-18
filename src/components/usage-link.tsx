import { ExternalLinkIcon } from "lucide-react";
import { memo } from "react";

interface UsageLinkProps {
  tabIndex?: number;
}

export const UsageLink = memo<UsageLinkProps>(({ tabIndex }) => (
  <a
    target="_blank"
    href="https://platform.openai.com/settings/organization/billing/overview"
    className="ml-3 hidden text-sm text-gray-400 underline hover:text-gray-300 md:inline-flex"
    tabIndex={tabIndex}
  >
    OpenAI Billing
    <ExternalLinkIcon className="ml-1 h-3 w-3" />
  </a>
));
