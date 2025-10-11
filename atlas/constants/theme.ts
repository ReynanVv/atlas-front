// theme.ts
import { Platform } from 'react-native';

const brand = {
  orange: '#FF7A1A',       // primária (texto/ícones de destaque)
  orangeDark: '#FF4D00',   // fim do degradê / estados ativos
  orangeSoft: '#FF8A3D',   // início do degradê
  black: '#111213',        // fundo principal
  surface: '#1A1A1A',      // cartões/inputs
  white: '#FFFFFF',
  text: '#ECEDEE',         // texto padrão no dark
  textMuted: '#9BA1A6',    // texto secundário no dark
  textDark: '#11181C',     // texto padrão no light
  textDarkMuted: '#687076' // texto secundário no light
};

export const Gradients = {
  primary: [brand.orangeSoft, brand.orangeDark] as const, // para botões/cta
};

export const Colors = {
  light: {
    text: brand.textDark,
    textMuted: brand.textDarkMuted,
    background: '#FFFFFF',
    surface: '#F5F6F7',
    tint: brand.orange,            // cor de destaque (links/ícones ativos)
    icon: brand.textDarkMuted,
    tabIconDefault: brand.textDarkMuted,
    tabIconSelected: brand.orange,
    border: '#E6E8EB',
  },
  dark: {
    text: brand.text,
    textMuted: brand.textMuted,
    background: brand.black,
    surface: brand.surface,
    tint: brand.orange,            // destaque laranja no dark
    icon: brand.textMuted,
    tabIconDefault: brand.textMuted,
    tabIconSelected: brand.orange,
    border: '#232629',
  },
};

// (mantém seu bloco Fonts como está)
export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
