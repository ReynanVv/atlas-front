import { Stack, useRouter } from 'expo-router';
import React from 'react';

export default function AlunoIndex() {
  const router = useRouter();
  // Redireciona para /aluno/home
  React.useEffect(() => {
    // cast temporário para evitar erro de tipagem até o TS reconhecer a rota
    router.replace(({ pathname: '/aluno/home' } as unknown) as any);
  }, [router]);

  return <Stack.Screen name="home" options={{ headerShown: false }} />;
}
