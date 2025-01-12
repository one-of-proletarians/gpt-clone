import { FC, memo } from "react";
import { Button } from "./ui/button";
import { useModel } from "@/store/models-store";

export const Welcome: FC = memo(() => {
  const { model, setModel } = useModel();
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex w-48  flex-col gap-0">
        <Button
          className="rounded-[0px] rounded-t py-10"
          variant={"gpt-4o" === model ? "default" : "outline"}
          onClick={() => setModel("gpt-4o")}
        >
          gpt-4o
        </Button>

        <Button
          className="rounded-[0px] rounded-b py-10"
          variant={"gpt-4o-mini" === model ? "default" : "outline"}
          onClick={() => setModel("gpt-4o-mini")}
        >
          gpt-4o-mini
        </Button>
      </div>
    </div>
  );
});

Welcome.displayName = "Welcome";
