import React, { useState } from "react";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Keyboard,
  Pressable,
} from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Link, useRouter } from "expo-router";

export default function RegisterAluno() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const text = useThemeColor({}, "text");
  const textMuted = useThemeColor({}, "textMuted");
  const surface = useThemeColor({}, "surface");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");
  const router = useRouter();

  function handleRegister() {
    console.log("Cadastrar aluno", { name, email });
    router.replace({ pathname: "/aluno/home" } as unknown as any);
  }

  function handleGoogleSignIn() {
    console.log("Entrar com Google (registro)");
  }

  return (
    <ThemedView style={styles.container}>
      <Pressable style={styles.pressable} onPress={() => Keyboard.dismiss()}>
        <ThemedText type="title">Cadastro - Aluno</ThemedText>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nome"
          style={[
            styles.input,
            { backgroundColor: surface, borderColor: border, color: text },
          ]}
          placeholderTextColor={textMuted}
        />

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
          onPress={handleRegister}
          style={[styles.registerButton, { backgroundColor: tint }]}
          activeOpacity={0.9}
        >
          <ThemedText type="defaultSemiBold">Criar conta</ThemedText>
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
        <Link href="/login" dismissTo style={styles.link}>
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
  },
  registerButton: {
    width: "100%",
    height: 48,
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
  },
  googleContent: { flexDirection: "row", alignItems: "center", gap: 8 },
  googleIcon: { width: 20, height: 20, borderRadius: 4 },
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
