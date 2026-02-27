import { createContext, useEffect, useState, ReactNode } from "react";

interface ThemeContextType {
  themeMode: string;
  setThemeMode: (mode: string) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState("lightMode");

  useEffect(() => {
    const prevMode = localStorage.getItem("themeMode");
    if (prevMode) {
      setDarkTheme(prevMode);
    }
  }, []);

  const setDarkTheme = (themeMode: string) => {
    setThemeMode(themeMode);
    document.body.classList.add(themeMode);
    localStorage.setItem("themeMode", themeMode);
    if (themeMode === "darkMode") {
      document.body.classList.remove("lightMode");
    } else {
      document.body.classList.remove("darkMode");
    }
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode: setDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
