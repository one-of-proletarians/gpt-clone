import { ArrowDown } from "lucide-react";
import { FC, useRef } from "react";
import { CSSTransition } from "react-transition-group";

interface ScrollButtonProps {
  hidden: boolean;
  onClick: () => void;
}
export const ScrollButton: FC<ScrollButtonProps> = ({ hidden, onClick }) => {
  const ref = useRef<HTMLButtonElement>(null);
  // if (hidden) return null;
  return (
    <CSSTransition
      in={!hidden}
      nodeRef={ref}
      timeout={400}
      classNames="button"
      unmountOnExit
    >
      <button
        ref={ref}
        tabIndex={-1}
        onClick={onClick}
        className="absolute right-1/2 top-[-4rem] translate-x-[21px] cursor-pointer rounded-full bg-primary/80 p-2 text-white hover:bg-primary dark:bg-slate-50/80 dark:text-black dark:hover:bg-slate-50"
      >
        <ArrowDown />
      </button>
    </CSSTransition>
  );
};
