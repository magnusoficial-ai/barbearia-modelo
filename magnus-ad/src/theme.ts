import {bodyFont, displayFont} from './fonts';

/**
 * Design tokens. Use só estes valores nos componentes.
 * Contraste sobre ink (#0D0D0D): paper 18,1:1 · soft 10,9:1 · dim 5,8:1 · accent 10,9:1.
 * mute e line são só decorativos (bordas, trilhas, grade), nunca texto.
 */
export const color = {
  ink: '#0D0D0D',
  surface: '#151515',
  surface2: '#1C1C1C',
  surface3: '#242424',
  line: '#2A2A2A',
  lineStrong: '#3A3A3A',
  mute: '#555555',
  dim: '#8C8C8C',
  soft: '#BDBDBD',
  paper: '#F5F5F5',
  // acento único: só em números positivos
  accent: '#3DDC84',
} as const;

export const font = {
  display: displayFont,
  body: bodyFont,
} as const;

// escala tipográfica em px (quadro de 1080 no menor lado)
export const type = {
  hero: 112,
  h1: 96,
  h2: 84,
  h3: 64,
  h4: 48,
  lead: 36,
  body: 30,
  small: 27,
  label: 24,
} as const;

// espaçamento: múltiplos de 8
export const space = (n: number) => n * 8;

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  pill: 999,
} as const;

export const shadow = {
  card: '0 24px 64px rgba(0,0,0,0.55)',
  float: '0 32px 96px rgba(0,0,0,0.7)',
} as const;

export const eyebrow = {
  fontFamily: font.display,
  fontSize: type.label,
  fontWeight: 600,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
} as const;
