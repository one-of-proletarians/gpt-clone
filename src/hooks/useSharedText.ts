import { useEffect, useState } from "react";
const ITEM = "shared_target--text";

export const useSharedText = (remove = false) => {
  const [text, setText] = useState("");

  useEffect(() => {
    const sharedText = localStorage.getItem(ITEM);
    if (sharedText) {
      setText(sharedText);
      if (remove) {
        localStorage.removeItem(ITEM);
      }
    }
  }, [remove]);

  return text;
};
