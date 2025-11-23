import React from "react";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { StyleSheet } from "react-native";

export default function TreinosPlaceholder() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Treinos (placeholder)</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 } });
