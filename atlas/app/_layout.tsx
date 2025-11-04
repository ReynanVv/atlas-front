import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="select-profile" options={{ headerShown: false }} />
        <Stack.Screen name="select-profile-login" options={{ headerShown: false }} />
        <Stack.Screen name="register-aluno" options={{ headerShown: false }} />
        <Stack.Screen name="register-personal" options={{ headerShown: false }} />
        <Stack.Screen name="aluno" options={{ headerShown: false }} />
        <Stack.Screen name="personal" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* esconder header do modal para remover título e botão de voltar */}
        <Stack.Screen
          name="login"
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
