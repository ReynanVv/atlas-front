import { Link } from "expo-router";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Pressable,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function ModalScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const text = useThemeColor({}, "text");
  const textMuted = useThemeColor({}, "textMuted");
  const surface = useThemeColor({}, "surface");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  // TODO: replace these placeholders with real data from your auth/user service
  let ehAluno = true;
  let ehPersonal = false;

  const router = useRouter();

  function handleLogin() {
    // Normally you'd authenticate here and fetch the user's roles.
    // Based on the roles, navigate to the correct screen.
    if (ehAluno && ehPersonal) {
      // User has both roles — show the selector screen
      router.replace(({ pathname: '/select-profile-login' } as unknown) as any);
    } else if (ehPersonal) {
      // Only personal/trainer
      router.replace(({ pathname: '/personal/home' } as unknown) as any);
    } else if (ehAluno) {
      // Only aluno/student
      router.replace(({ pathname: '/aluno/personais' } as unknown) as any);
    } else {
      // No role assigned — keep on login and optionally show an error
      console.warn('Usuário sem perfil associado');
    }
  }

  function handleGoogleSignIn() {
    // Placeholder: implementar fluxo de autenticação com Google
    console.log("Entrar com Google");
  }

  return (
    <ThemedView style={styles.container}>
      <Pressable style={styles.pressable} onPress={() => Keyboard.dismiss()}>
        <ThemedText type="title">Login</ThemedText>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={[
            styles.input,
            { backgroundColor: surface, borderColor: border, color: text },
          ]}
          placeholderTextColor={textMuted}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          secureTextEntry
          style={[
            styles.input,
            { backgroundColor: surface, borderColor: border, color: text },
          ]}
          placeholderTextColor={textMuted}
        />

        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.loginButton, { backgroundColor: tint }]}
          activeOpacity={0.8}
        >
          <ThemedText type="defaultSemiBold">Entrar</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGoogleSignIn}
          style={[
            styles.googleButton,
            { borderColor: border, backgroundColor: surface },
          ]}
          activeOpacity={0.8}
        >
          <View style={styles.googleContent}>
            <Image
              source={{
                uri: "https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw",
              }}
              style={styles.googleIcon}
            />
            <ThemedText type="defaultSemiBold">Entrar com Google</ThemedText>
          </View>
        </TouchableOpacity>

        <Link href="/" dismissTo style={styles.link}>
          <ThemedText type="link" style={{ fontWeight: "700" }}>
            Já tenho uma conta
          </ThemedText>
        </Link>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    color: "#000",
  },
  loginButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#0a84ff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  googleButton: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    backgroundColor: "#fff",
  },
  googleContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  pressable: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
