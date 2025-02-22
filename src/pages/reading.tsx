import { useSearch } from "@tanstack/react-router";
import { FC } from "react";

export const Reading: FC = () => {
  const description = useSearch({
    from: "/reading",
    select(search: { description: string }) {
      return search.description as string;
    },
  });
  return (
    <div className="p-5">
      <h1 className="pb-10">Reading page</h1>

      <p>{description}</p>
    </div>
  );
};
