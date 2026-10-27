// src/hooks/use-theme-context.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { lightTheme, darkTheme, ThemeType } from '../constants/theme';

interface ThemeContextData {
  theme: ThemeType;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}