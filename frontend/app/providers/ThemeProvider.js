"use client";

import { ThemeProvider } from "next-themes";

export function LocalThemeProvider({ children }) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
