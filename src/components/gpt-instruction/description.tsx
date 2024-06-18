import { FC } from "react";

export const Description: FC<{ children: string }> = ({ children }) => (
  <p className="text-token-text-primary pb-3 pt-2 text-sm text-white/60">
    {children}
  </p>
);
