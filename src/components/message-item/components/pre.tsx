import { FC, useEffect, useRef } from "react";

const handler = (e: TouchEvent | MouseEvent) => e.stopPropagation();
export const Pre: FC = (props) => {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;

    if (!pre) return;

    pre.addEventListener("touchmove", handler);
    pre.addEventListener("mousemove", handler);

    return () => {
      pre.removeEventListener("touchmove", handler);
      pre.removeEventListener("mousemove", handler);
    };
  }, [preRef]);

  return <pre className="relative p-0" ref={preRef} {...props} />;
};
