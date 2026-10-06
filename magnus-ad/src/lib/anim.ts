import {Easing, interpolate, spring} from 'remotion';

export const FPS = 30;
// 120 BPM: 1 tempo = 0,5s = 15 frames; 1 compasso = 2s
export const BEAT = 15;
export const sec = (s: number) => Math.round(s * FPS);

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.55, 0, 1, 0.45);

/** 0→1 entre start e start+dur, com easing e travado nas pontas. */
export const prog = (f: number, start: number, dur: number, easing = EASE_OUT) =>
  interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Mola sem quique, para entradas de texto e blocos. */
export const soft = (f: number, start: number, dur = 18) =>
  spring({frame: f - start, fps: FPS, config: {damping: 200}, durationInFrames: dur});

/** Mola com um leve passo além do alvo, para selos e objetos. */
export const pop = (f: number, start: number) =>
  spring({frame: f - start, fps: FPS, config: {damping: 15, stiffness: 160, mass: 0.7}});

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Estilo de entrada padrão: desfoque→nítido, sobe 16px, opacidade. */
export const enter = (p: number, distance = 16, blur = 10) => ({
  opacity: p,
  transform: `translateY(${(1 - p) * distance}px)`,
  filter: p < 0.999 ? `blur(${(1 - p) * blur}px)` : undefined,
});

/** Formata número no padrão brasileiro (1.248 / 4,7). */
export const formatBR = (value: number, decimals = 0) => {
  const fixed = value.toFixed(decimals);
  const [int, dec] = fixed.split('.');
  const withDots = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return dec ? `${withDots},${dec}` : withDots;
};
