import { ArrowUp } from "lucide-react";
import { forwardRef, memo } from "react";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";

export const SendButton = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => (
    <Button
      size={"icon"}
      className={cn("absolute bottom-[16px] right-3 rounded-full", className)}
      ref={ref}
      {...props}
    >
      <ArrowUp />
    </Button>
  )),
);
