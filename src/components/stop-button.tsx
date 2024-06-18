import { memo } from "react";
import { Button, ButtonProps } from "./ui/button";

export const StopButton = memo<ButtonProps>((props) => (
  <Button
    type="button"
    size={"icon"}
    className="absolute bottom-[16px] right-3 rounded-full"
    {...props}
  >
    <div className="h-3.5 w-3.5 rounded bg-white dark:bg-primary-foreground" />
  </Button>
));
