import { Mic } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { formatTime } from "@/lib/utils";
import { useKeyPress } from "@/hooks/useKeyPress";

interface RecordDialogProps {
  onStop: () => void;
}

const Counter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCounter((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  });

  return formatTime(counter);
};

export const RecordDialog: FC<RecordDialogProps> = ({ onStop }) => {
  const { t } = useTranslation();

  useKeyPress("Enter", onStop);

  return (
    <Dialog open={true}>
      <DialogContent className="sm:h-64 sm:w-64" tabIndex={-1}>
        <DialogHeader className="justify-between">
          <DialogTitle
            className="pb-2 text-center text-3xl"
            style={{ fontFamily: "Space Mono, monospace" }}
          >
            <div className="flex items-center justify-center p-7">
              <Mic className="h-12 w-12 animate-pulse text-destructive" />
            </div>

            <Counter />
          </DialogTitle>
          <Button variant="destructive" tabIndex={-1} onClick={onStop}>
            {t("record.stop")}
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
