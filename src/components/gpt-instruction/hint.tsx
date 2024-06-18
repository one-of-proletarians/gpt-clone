import { cn } from "@/lib/utils";
import { FC } from "react";

interface HintProps {
  show: boolean;
  title: string;
  list: string[];
}

export const Hint: FC<HintProps> = ({ show, title, list }) => {
  return (
    <div
      className={cn(
        { hidden: !show },
        "absolute right-[-410px] top-0 w-[400px] rounded-lg bg-sidebar p-4 pl-7",
      )}
    >
      <h4 className="pb-4">{title}</h4>
      <ul className="list-disc">
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
