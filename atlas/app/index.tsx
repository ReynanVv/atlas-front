// app/(auth)/welcome.tsx  (ou substitua seu LoginScreen.tsx)
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  StatusBar,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const ORANGE_START = '#FF8A3D';
const ORANGE_END = '#FF4D00';
const BG = '#111213';
const SURFACE = '#1A1A1A';
const TEXT = '#ECEDEE';
const TEXT_MUTED = '#9BA1A6';

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Top bar com logo e ícones fictícios */}
        <Image
          source={require('../assets/images/new-logo-atlas.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Headline */}
        <View style={styles.hero}>
          <Text style={styles.headWhite}>Sustente sua força</Text>
          <Text style={styles.headOrange}>Supere seus limites</Text>
          <Text style={styles.subBrand}>Inova Inc.</Text>
        </View>

        {/* CTA area (cards arredondados com degradê) */}
        <View style={styles.ctaCard}>
          <Pressable
            onPress={() => router.push('/select-profile')}
            style={{ borderRadius: 28, overflow: 'hidden' }}
          >
            <LinearGradient
              colors={[ORANGE_START, ORANGE_END]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryLabel}>Inscreva-se gratuitamente</Text>
            </LinearGradient>
          </Pressable>

          {/* divisor OU */}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          {/* Botão secundário */}
          <Pressable
            onPress={() => router.push('/login')}
            style={styles.secondaryBtn}
          >
            <Text style={styles.secondaryLabel}>Entrar</Text>
          </Pressable>

          {/* Esqueci a senha */}
          <Pressable
            onPress={() => router.push('/(tabs)/home')}
            style={{ marginTop: 16 }}
          >
            <Text style={styles.link}>Esqueci a senha</Text>
          </Pressable>
        </View>

        {/* Rodapé com site */}
        <Pressable onPress={() => Linking.openURL('https://www.atlasmail.com')}>
          <Text style={styles.footer}>www.atlasmail.com</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 24,
    paddingTop: 8,
    justifyContent: 'space-between',
  },

  /* LOGO */
  logo: {
    width: 220,
    height: 164,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginLeft: -60
  },

  /* HEADLINE */
  hero: { marginTop: 8 },
  headWhite: {
    color: TEXT,
    fontSize: 38,
    fontWeight: '800',
    lineHeight: 44,
  },
  headOrange: {
    color: ORANGE_END,
    fontSize: 38,
    fontWeight: '800',
    lineHeight: 44,
    marginTop: 6,
  },
  subBrand: {
    color: TEXT_MUTED,
    marginTop: 20,
    fontWeight: '600',
  },

  /* CTA CARD */
  ctaCard: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
    marginHorizontal: -24, // encosta nas bordas como no mock
  },
  primaryBtn: {
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryLabel: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '800',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    paddingHorizontal: 6,
 gap: 10,
  },
  divider: { flex: 1, height: 1, backgroundColor: '#ffffff33' },
  dividerText: { color: TEXT, fontWeight: '700' },

  secondaryBtn: {
    backgroundColor: BG,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryLabel: { color: TEXT, fontSize: 18, fontWeight: '800' },

  link: {
    color: TEXT,
    textAlign: 'center',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  footer: {
    color: TEXT,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.9,
  },
});

export default WelcomeScreen;
