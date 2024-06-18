import { Tooltip } from "@/components/tooltip";
import { useMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { ComponentProps, FC } from "react";

type ButtonProps = ComponentProps<"button"> & {
  label: string;
};

export const OptionButton: FC<ButtonProps> = ({
  label,
  className,
  ...props
}) => {
  const isMobile = useMobile();
  return (
    <Tooltip label={label} side="bottom" delayDuration={1000}>
      <button
        tabIndex={isMobile ? -1 : 0}
        className={cn(
          "flex items-center gap-1.5 text-clip rounded-md p-1 text-xs text-muted-foreground transition hover:text-inherit disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </Tooltip>
  );
};
