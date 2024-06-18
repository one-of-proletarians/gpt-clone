import { ExternalLink } from "lucide-react";
import { FC } from "react";

export const A: FC<{ children?: React.ReactNode }> = ({
  children,
  ...props
}) => (
  <a
    target="_blank"
    className="inline-flex items-center text-blue-400"
    {...props}
  >
    {children}
    <ExternalLink className="ml-1 h-2.5 w-2.5" />
  </a>
);
