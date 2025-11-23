import React from "react";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { StyleSheet } from "react-native";

export default function PlanoPlaceholder() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Plano (placeholder)</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 } });
