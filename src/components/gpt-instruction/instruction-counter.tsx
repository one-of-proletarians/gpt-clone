import { FC } from "react";
import { useTranslation } from "react-i18next";
import { maxInstructionLength } from "@/store/instructions-store";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface InstructionCounterProps {
  counter: number;
  showHint: boolean;
  hasFocus: boolean;
  onToggle: () => void;
}

export const InstructionCounter: FC<InstructionCounterProps> = (p) => {
  const { t } = useTranslation();
  return (
    <div className="text-token-text-tertiary text-white-600 flex items-center justify-between p-1 text-xs">
      <span>
        {p.counter} / {maxInstructionLength}
      </span>

      <button
        tabIndex={-1}
        onClick={p.onToggle}
        className={cn(
          "inline-flex select-none items-center gap-1 duration-300",
          {
            "opacity-0": !p.hasFocus,
          },
        )}
      >
        {p.showHint ? (
          <>
            {t("instruction.hideHints")}
            <EyeOff className="h-3 w-3" />
          </>
        ) : (
          <>
            {t("instruction.showHints")}
            <Eye className="h-3 w-3" />
          </>
        )}
      </button>
    </div>
  );
};
