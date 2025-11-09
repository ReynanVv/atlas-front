import React from 'react';
import { Stack } from 'expo-router';

export default function AlunoLayout() {
  return (
    <Stack>
      {/* app/aluno/index.tsx */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* app/aluno/personais.tsx */}
      <Stack.Screen name="personais" options={{ headerShown: false }} />
      {/* app/aluno/workout.tsx */}
      <Stack.Screen name="workout" options={{ headerShown: false, title: 'Treino' }} />
      <Stack.Screen name="personal/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
