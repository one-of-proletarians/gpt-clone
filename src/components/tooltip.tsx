import {
  Tooltip as Original,
  TooltipContentProps,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { FC } from "react";
import { TooltipContent } from "./ui/tooltip";
import { useMobile } from "@/hooks/useMobile";

interface TooltipProps extends TooltipContentProps {
  children: React.ReactNode;
  label: React.ReactNode;
  delayDuration?: number;
}
export const Tooltip: FC<TooltipProps> = ({
  children,
  label,
  delayDuration = 400,
  ...props
}) => {
  const isMobile = useMobile();

  if (isMobile) return <>{children}</>;

  return (
    <TooltipProvider delayDuration={delayDuration} disableHoverableContent>
      <Original>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent {...props}>{label}</TooltipContent>
      </Original>
    </TooltipProvider>
  );
};
