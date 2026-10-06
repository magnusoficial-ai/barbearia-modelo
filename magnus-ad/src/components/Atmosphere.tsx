import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {useSvgId} from '../lib/svg-id';
import {color} from '../theme';

/** Grão de filme sutil (opacity 0.04), trocando a cada 2 frames. */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const id = useSvgId('grain');
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.04}}>
      <svg width={width} height={height}>
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={Math.floor(frame / 2) % 97}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={width} height={height} filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Vinheta leve nas bordas. */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background:
        'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)',
    }}
  />
);

type DotGridProps = {
  gap?: number;
  radius?: number;
  fill?: string;
  /** 0→1: a grade se abre a partir do centro */
  reveal?: number;
  cx?: number;
  cy?: number;
  opacity?: number;
};

/** Grade de pontos do brand board, com máscara radial. */
export const DotGrid: React.FC<DotGridProps> = ({
  gap = 40,
  radius = 1.6,
  fill = color.lineStrong,
  reveal = 1,
  cx,
  cy,
  opacity = 1,
}) => {
  const {width, height} = useVideoConfig();
  const pid = useSvgId('dots');
  const gid = useSvgId('dotsfade');
  const mid = useSvgId('dotsmask');
  const x = cx ?? width / 2;
  const y = cy ?? height / 2;
  const r = Math.max(width, height) * 0.75 * reveal;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <svg width={width} height={height}>
        <defs>
          <pattern id={pid} width={gap} height={gap} patternUnits="userSpaceOnUse">
            <circle cx={gap / 2} cy={gap / 2} r={radius} fill={fill} />
          </pattern>
          <radialGradient id={gid} cx={x} cy={y} r={Math.max(r, 1)} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.7" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id={mid}>
            <rect width={width} height={height} fill={`url(#${gid})`} />
          </mask>
        </defs>
        <rect width={width} height={height} fill={`url(#${pid})`} mask={`url(#${mid})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Fundo preto de cada cena (opaco, para os wipes revelarem direito). */
export const Stage: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
  children,
  style,
}) => (
  <AbsoluteFill style={{backgroundColor: color.ink, overflow: 'hidden', ...style}}>
    {children}
  </AbsoluteFill>
);
