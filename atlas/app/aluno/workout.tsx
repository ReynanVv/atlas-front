import React from 'react';
import { StyleSheet, ScrollView , Pressable } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';

export const options = { headerShown: true };

export default function WorkoutScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Detalhes do Treino</ThemedText>

        <ThemedText style={{ marginTop: 12 }}>
          Aqui você pode mostrar os exercícios, séries, repetições e instruções do treino.
        </ThemedText>

        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText type="defaultSemiBold">Voltar</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  backButton: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#00000011',
  },
});
