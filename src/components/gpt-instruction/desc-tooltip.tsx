import { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Info } from "lucide-react";

export const DescTooltip: FC = () => {
  const { t } = useTranslation();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3 w-3" />
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p>
            <a
              href={import.meta.env.VITE_INSTRUCTION_INSTRUCTION_URL}
              target="_blank"
              className="underline"
            >
              {t("instruction.tooltip.link")}
            </a>
            {t("instruction.tooltip.text")}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
