import React, { useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type Props = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeContext = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContext>({
  theme: "light",
  setTheme: () => null,
});

export const ThemeProvider = ({
  children,
  defaultTheme = "light",
  storageKey = "vite-ui-theme",
}: Props) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be inside a ThemeProvider");
  }

  return context as ThemeContext;
};
