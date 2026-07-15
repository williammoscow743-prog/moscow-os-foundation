import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type ThemeContextValue = { theme: Theme; setTheme: (t: Theme) => void; resolved: "light" | "dark" };

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = "moscow-os-theme";

function applyTheme(theme: Theme): "light" | "dark" {
  const root = document.documentElement;
  const resolved: "light" | "dark" =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  root.classList.toggle("dark", resolved === "dark");
  return resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "dark";
    setThemeState(stored);
    setResolved(applyTheme(stored));

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if ((localStorage.getItem(STORAGE_KEY) as Theme | null) === "system") {
        setResolved(applyTheme("system"));
      }
    };
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  const setTheme = (t: Theme) => {
    localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
    setResolved(applyTheme(t));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolved }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
