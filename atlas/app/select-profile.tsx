import React from 'react';
import { SafeAreaView, View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Gradients } from '@/constants/theme';

export const options = {
  headerShown: false,
};

const SelectProfile: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Escolha seu perfil
        </ThemedText>

        <View style={styles.optionsRow}>
          <Pressable
            onPress={() => router.push(({ pathname: '/register-personal' } as unknown) as any)}
            style={({ pressed }) => [
              styles.card,
              pressed ? styles.cardPressed : undefined,
            ]}
          >
            <LinearGradient
              colors={[Gradients.primary[0], Gradients.primary[1]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.iconWrap}
            >
              <IconSymbol name="person.crop.circle.fill" size={48} color={Colors.dark.surface} />
            </LinearGradient>
            <ThemedText type="defaultSemiBold" style={styles.cardLabel}>
              Personal
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => router.push('/register-aluno')}
            style={({ pressed }) => [
              styles.card,
              pressed ? styles.cardPressed : undefined,
            ]}
          >
            <LinearGradient
              colors={[Gradients.primary[0], Gradients.primary[1]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.iconWrap}
            >
              <IconSymbol name="graduationcap.fill" size={48} color={Colors.dark.surface} />
            </LinearGradient>
            <ThemedText type="defaultSemiBold" style={styles.cardLabel}>
              Aluno
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  title: {
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
  },
  card: {
    width: 140,
    height: 160,
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    textAlign: 'center',
  },
});

export default SelectProfile;
