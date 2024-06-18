import { useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const storedValue = localStorage.getItem(key);

  if (storedValue) initialValue = JSON.parse(storedValue) as T;

  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};
