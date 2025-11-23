import React from "react";
import { View, StyleSheet, FlatList, Pressable, Image } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";

// Mock de personais trainers para exibição
const PERSONAL_TRAINERS = [
  {
    id: "p1",
    name: "João Silva",
    avatar: require("@/assets/images/logo-atlas.jpg"),
  },
  {
    id: "p2",
    name: "Mariana Costa",
    avatar: require("@/assets/images/partial-react-logo.png"),
  },
  {
    id: "p3",
    name: "Pedro Oliveira",
    avatar: require("@/assets/images/react-logo.png"),
  },
];

export default function EscolherPersonal() {
  const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Meus Personais
      </ThemedText>

      <View style={styles.centerBox}>
        <FlatList
          data={PERSONAL_TRAINERS}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.listCenter}
          numColumns={1}
          renderItem={({ item }) => (
            <Pressable
              style={styles.trainerCard}
              onPress={() => {
                // usa objeto para satisfazer tipagens do expo-router
                router.push({
                  pathname: "/aluno/personal/[id]",
                  params: { id: item.id },
                } as any);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Abrir perfil de ${item.name}`}
            >
              <Image source={item.avatar} style={styles.avatar} />
              <View style={styles.nameBlock}>
                <ThemedText type="defaultSemiBold" style={styles.trainerName}>
                  {item.name}
                </ThemedText>
                {/* aqui você pode adicionar mais informações como cargo, cidade, etc */}
              </View>
            </Pressable>
          )}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 70 },
  title: { textAlign: "center", marginBottom: 18 },
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  listCenter: { justifyContent: "center", alignItems: "center" },
  trainerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    minWidth: 260,
    backgroundColor: "#00000006",
  },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12 },
  nameBlock: { flex: 1, justifyContent: "center" },
  trainerName: { fontSize: 16 },
});
