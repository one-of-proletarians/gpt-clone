import { useStopScrollPropagation } from "@/hooks/useStopScrollPropagation";
import { FC } from "react";

export const Pre: FC = (props) => {
  const preRef = useStopScrollPropagation<HTMLPreElement>();

  return <pre className="relative p-0" ref={preRef} {...props} />;
};
