import { FC, memo } from "react";
import { Logo } from "./logo";

export const Welcome: FC = memo(() => (
  <div className="flex flex-1 flex-col items-center justify-center">
    <Logo className="h-10 w-10 sm:h-12 sm:w-12" />
  </div>
));

Welcome.displayName = "Welcome";
