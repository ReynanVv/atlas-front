import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';

const SAMPLE_WORKOUT = {
  name: 'Treino do Dia',
  trainer: 'João Silva',
  duration: '45 min',
  intensity: 'Média',
  exercises: [
    { id: '1', name: 'Agachamento', sets: '4x8', rest: '90s' },
    { id: '2', name: 'Supino', sets: '4x6', rest: '120s' },
    { id: '3', name: 'Remada', sets: '3x10', rest: '90s' },
  ],
};

export default function AlunoHome() {
  const router = useRouter();

  function openWorkout() {
    // placeholder: abrir detalhes do treino
    router.push(({ pathname: '/aluno/workout' } as unknown) as any);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{SAMPLE_WORKOUT.name}</ThemedText>

      <ThemedView style={styles.metaRow}>
        <ThemedText>{SAMPLE_WORKOUT.trainer}</ThemedText>
        <ThemedText> • </ThemedText>
        <ThemedText>{SAMPLE_WORKOUT.duration}</ThemedText>
        <ThemedText> • </ThemedText>
        <ThemedText>{SAMPLE_WORKOUT.intensity}</ThemedText>
      </ThemedView>

      <FlatList
        data={SAMPLE_WORKOUT.exercises}
        keyExtractor={(i) => i.id}
        style={styles.list}
        renderItem={({ item }) => (
          <Pressable onPress={openWorkout} style={styles.item}>
            <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
            <ThemedText>{item.sets} • Desc: {item.rest}</ThemedText>
          </Pressable>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  metaRow: { flexDirection: 'row', gap: 6, marginTop: 8, marginBottom: 12 },
  list: { marginTop: 8 },
  item: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#00000011',
  },
});
