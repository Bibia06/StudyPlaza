// src/app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

// Importe o seu ThemeProvider customizado que criamos na pasta hooks
import { ThemeProvider, useAppTheme } from "@/hooks/use-theme-context";

// Componente interno para conseguir ler o tema atual e estilizar a StatusBar
function RootLayoutNav() {
  const { isDarkMode } = useAppTheme();

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        {/* Adicione outras telas aqui se precisar */}
      </Stack>
      {/* A StatusBar muda para light ou dark de acordo com o seu tema */}
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </>
  );
}

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}