// app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext'; // Ajusta os caminhos
import { ThemeProvider, useAppTheme } from "@/hooks/use-theme-context"; // Ajusta os caminhos

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}