import { fileExt } from "@/lib/utils";
import { useEffect } from "react";

const extensions = ["png", "jpg", "jpeg"];

export const usePasteEvent = (cb: (event: File) => void) => {
  useEffect(() => {
    const handler = (event: ClipboardEvent) => {
      if (!event.clipboardData) return;

      for (const item of event.clipboardData.items) {
        if (item.kind === "file") {
          const blob = item.getAsFile();
          const ext = fileExt(blob!.name);

          if (extensions.includes(ext)) {
            return cb(blob!);
          }
        }
      }
    };

    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, [cb]);
};
