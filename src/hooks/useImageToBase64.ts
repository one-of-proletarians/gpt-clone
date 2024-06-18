import { useEffect, useState } from "react";

export const useImageToBase64 = (file?: File | null) => {
  const [base64, setBase64] = useState<string>();

  useEffect(() => {
    if (!file) {
      setBase64(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) setBase64(e.target.result as string);
    };
    reader.readAsDataURL(file);

    return () => {
      reader.onload = null; // Cleanup
    };
  }, [file]);

  return base64;
};
