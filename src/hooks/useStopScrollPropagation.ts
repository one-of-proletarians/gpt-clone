import { useEffect, useRef } from "react";
const handleStopPropagation = (e: TouchEvent | MouseEvent) =>
  e.stopPropagation();

export const useStopScrollPropagation = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || element.clientWidth === element.scrollWidth) return;

    element.addEventListener("touchmove", handleStopPropagation);
    element.addEventListener("mousemove", handleStopPropagation);

    return () => {
      element.removeEventListener("touchmove", handleStopPropagation);
      element.removeEventListener("mousemove", handleStopPropagation);
    };
  }, [ref]);

  return ref;
};
