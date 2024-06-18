import { FC } from "react";
import { Logo } from "./logo";

export const Fallback: FC = () => (
  <div className="flex h-full w-full items-center justify-center">
    <Logo className="h-8 w-8 animate-spin" />
  </div>
);
