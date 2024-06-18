import { memo, useEffect } from "react";

interface TitleProps {
  children: string;
}

export const Title = memo<TitleProps>(({ children }) => {
  useEffect(() => {
    document.title = children;
  }, [children]);
  return null;
});
