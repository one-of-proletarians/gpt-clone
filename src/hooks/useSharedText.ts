import { useEffect, useState } from "react";
// import { URLSearchParams } from "url";
// const ITEM = "shared_target--text";

// export const useSharedText = (remove = false) => {
//   const [text, setText] = useState("");

//   useEffect(() => {
//     const sharedText = localStorage.getItem(ITEM);
//     if (sharedText) {
//       setText(sharedText);
//       if (remove) {
//         localStorage.removeItem(ITEM);
//       }
//     }
//   }, [remove]);

//   return text;
// };

export const useSharedText = () => {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pText = params.get("text");
    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState(null, "", newUrl);

    if (pText?.trim()?.length) setText(pText);
  }, []);

  return text;
};
