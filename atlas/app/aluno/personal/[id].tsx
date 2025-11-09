import React, { useRef, useState } from 'react';
import { View, StyleSheet, FlatList, Image, Pressable, Dimensions } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const options = { headerShown: true };

const ITEM_WIDTH = Dimensions.get('window').width - 32;

// mock de treinos por personal id
const MOCK_TREINOS: Record<string, Array<{ id: string; title: string; date: string }>> = {
  p1: [
    { id: 't1', title: 'Treino A - Força', date: '2025-10-01' },
    { id: 't2', title: 'Treino B - Resistência', date: '2025-10-08' },
  ],
  p2: [{ id: 't3', title: 'Treino C - Mobilidade', date: '2025-09-20' }],
  p3: [
    { id: 't4', title: 'Treino D - Hipertrofia', date: '2025-08-15' },
    { id: 't5', title: 'Treino E - Core', date: '2025-08-22' },
  ],
};

export default function PersonalTreinos() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = (params?.id as string) || 'p1';

  const treinos = MOCK_TREINOS[id] ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<FlatList<any> | null>(null);

  function goTo(index: number) {
    if (!treinos || treinos.length === 0) return;
    const safe = Math.max(0, Math.min(index, treinos.length - 1));
    setCurrentIndex(safe);
    listRef.current?.scrollToIndex?.({ index: safe, animated: true } as any);
  }

  return (
    <ThemedView style={[styles.container, { paddingBottom: 100 }]}>
      {/* Barra de progresso */}
      <View style={styles.progressRow}>
        <View style={styles.progressLeft}>
          <View style={styles.progressBadge}>
            <ThemedText>1</ThemedText>
          </View>
        </View>
        <View style={styles.progressBarWrap}>
          <View style={styles.progressBar} />
        </View>
      </View>

      {/* Hero com imagem e título */}
      <View style={styles.hero}>
        <Image source={require('@/assets/images/new-logo-atlas.png')} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroOverlay} />
        <View style={styles.heroTextWrap}>
          <ThemedText type="subtitle">TREINO DE HOJE</ThemedText>
          <ThemedText type="title">Dia de recuperação</ThemedText>
        </View>

        {/* controles de navegação sobre o hero */}
        <Pressable style={[styles.navButton, styles.navLeft]} onPress={() => goTo(currentIndex - 1)} accessibilityLabel="Anterior">
          <ThemedText>{'<'}</ThemedText>
        </Pressable>
        <Pressable style={[styles.navButton, styles.navRight]} onPress={() => goTo(currentIndex + 1)} accessibilityLabel="Próximo">
          <ThemedText>{'>'}</ThemedText>
        </Pressable>

        {/* indicadores (dots) */}
        <View style={styles.dotsWrap}>
          {treinos.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex ? styles.dotActive : null]} />
          ))}
        </View>
      </View>

      {/* Indicadores */}
      <View style={styles.indicatorsRow}>
        <View style={styles.indicator}>
          <ThemedText>0 min</ThemedText>
          <ThemedText type="subtitle">Duração</ThemedText>
        </View>
        <View style={styles.indicator}>
          <ThemedText>0</ThemedText>
          <ThemedText type="subtitle">Exercícios</ThemedText>
        </View>
        <View style={styles.indicator}>
          <ThemedText>0</ThemedText>
          <ThemedText type="subtitle">Pontos</ThemedText>
        </View>
      </View>

      {/* Sua semana - lista de dias com cards (carrossel horizontal) */}
      <ThemedText type="title" style={styles.sectionTitle}>
        Sua semana
      </ThemedText>

      <FlatList
        ref={(r) => (listRef.current = r)}
        data={treinos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.weekCard, styles.weekCardHorizontal]}>
            <View style={styles.weekContent}>
              <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.thumb} />
              <View style={styles.weekText}>
                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                <ThemedText type="subtitle">{item.date}</ThemedText>
              </View>
            </View>
          </View>
        )}
        onMomentumScrollEnd={(ev) => {
          const offsetX = ev.nativeEvent.contentOffset.x;
          const width = ev.nativeEvent.layoutMeasurement.width;
          const idx = Math.round(offsetX / width);
          setCurrentIndex(idx);
        }}
      />

      {/* Barra de tabs embutida (simples) */}
      <View style={styles.embeddedTabs} pointerEvents="box-none">
        <View style={[styles.materialBar, { backgroundColor: Colors[useColorScheme() ?? 'light'].background }] }>
          <Pressable style={styles.materialTab} onPress={() => router.push('/aluno/workout')}>
            <IconSymbol name="house.fill" size={22} color={Colors[useColorScheme() ?? 'light'].tint} />
            <ThemedText type="subtitle">Feed</ThemedText>
          </Pressable>
          <Pressable style={styles.materialTab} onPress={() => router.push('/explore')}>
            <IconSymbol name="paperplane.fill" size={22} color={Colors[useColorScheme() ?? 'light'].tint} />
            <ThemedText type="subtitle">Treinos</ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#130f14' },
  progressRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 6, paddingHorizontal: 6 },
  progressLeft: { width: 36, alignItems: 'center', justifyContent: 'center' },
  progressBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff1', alignItems: 'center', justifyContent: 'center' },
  progressBarWrap: { flex: 1, height: 8, justifyContent: 'center' },
  progressBar: { height: 8, backgroundColor: '#5b0f22', borderRadius: 8 },
  hero: { height: 180, marginTop: 12, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, backgroundColor: 'rgba(0,0,0,0.35)' },
  heroTextWrap: { position: 'absolute', left: 16, bottom: 16 },
  indicatorsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 6 },
  indicator: { alignItems: 'center', flex: 1 },
  sectionTitle: { marginTop: 14, marginBottom: 8 },
  list: { paddingBottom: 24 },
  weekCard: { flexDirection: 'row', backgroundColor: '#2b2428', borderRadius: 12, padding: 12, marginBottom: 10, alignItems: 'center' },
  weekCardHorizontal: { width: ITEM_WIDTH, marginRight: 16, marginBottom: 0 },
  weekContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  thumb: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
  weekText: { flex: 1 },
  navButton: { position: 'absolute', top: '40%', width: 36, height: 36, borderRadius: 18, backgroundColor: '#ffffff22', alignItems: 'center', justifyContent: 'center' },
  navLeft: { left: 12 },
  navRight: { right: 12 },
  dotsWrap: { position: 'absolute', bottom: 8, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ffffff66', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#ff4c6b' },
  embeddedTabs: { position: 'absolute', left: 12, right: 12, bottom: 14 },
  materialBar: { flexDirection: 'row', borderRadius: 12, paddingVertical: 8, justifyContent: 'space-around', elevation: 6 },
  materialTab: { alignItems: 'center', justifyContent: 'center' },
});

