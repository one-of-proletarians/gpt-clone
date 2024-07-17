import { useStopScrollPropagation } from "@/hooks/useStopScrollPropagation";
import { memo, PropsWithChildren } from "react";

type SpanProps = React.HTMLAttributes<HTMLSpanElement> & PropsWithChildren;

export const Span = memo<SpanProps>((props) => {
  const spanRef = useStopScrollPropagation<HTMLSpanElement>();

  if (!(props.className === "katex-display")) {
    return <span {...props} />;
  }

  return <span ref={spanRef} {...props} />;
});
