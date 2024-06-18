import * as React from "react";

import { cn } from "@/lib/utils";
import { TextareaAutosizeProps } from "react-textarea-autosize";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    Omit<TextareaAutosizeProps, "style"> {
  as?: React.ElementType;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ as: Component = "textarea", className, ...props }, ref) => {
    return (
      <Component
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
