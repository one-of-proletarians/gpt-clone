import { createContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

const root = window.document.documentElement;

const darkThemePreference = window.matchMedia("(prefers-color-scheme: dark)");

const handleThemeChange = (event: MediaQueryListEvent) => {
  const newTheme = event.matches ? "dark" : "light";

  root.classList.remove("light", "dark");
  root.classList.add(newTheme);
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = darkThemePreference.matches ? "dark" : "light";

      root.classList.add(systemTheme);
      return darkThemePreference.addEventListener("change", handleThemeChange);
    }

    darkThemePreference.removeEventListener("change", handleThemeChange);
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
