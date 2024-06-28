import { useMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "./tooltip";

interface ToggleMenuProps {
  className?: string;
  open: boolean;
  onToggle: (state: boolean) => void;
}

export const ToggleMenu = memo<ToggleMenuProps>(
  ({ className, onToggle, open, ...props }) => {
    const { t } = useTranslation();
    const isMobile = useMobile();

    if (isMobile) return null;

    return (
      <Tooltip
        side="right"
        label={open ? t("chat.close") : t("chat.open")}
        delayDuration={1000}
      >
        <div
          onClick={() => onToggle(!open)}
          className={cn([
            "group absolute right-[-32px] top-1/2 flex h-[72px] w-8 -translate-y-1/2 cursor-pointer items-center justify-center",
            className,
          ])}
          {...props}
        >
          <div className="flex h-6 w-6 flex-col items-center">
            <div
              className={cn("close-button translate-y-[2px]", {
                "group-hover:rotate-[16deg]": open,
                "group-hover:rotate-none rotate-[-16deg]": !open,
              })}
            />

            <div
              className={cn("close-button translate-y-[-2px]", {
                "group-hover:rotate-[-16deg]": open,
                "group-hover:rotate-none rotate-[16deg]": !open,
              })}
            />
          </div>
        </div>
      </Tooltip>
    );
  },
);
