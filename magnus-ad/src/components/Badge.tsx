import type {LucideIcon} from 'lucide-react';
import React from 'react';
import {clamp01} from '../lib/anim';
import {color, font, radius, shadow} from '../theme';

type Props = {
  text: string;
  icon: LucideIcon;
  /** progresso da mola de entrada */
  p: number;
  style?: React.CSSProperties;
};

/** Selo invertido (claro sobre o preto): o destaque de cada produto. */
export const Badge: React.FC<Props> = ({text, icon: Icon, p, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 16,
      padding: '12px 32px 12px 12px',
      borderRadius: radius.pill,
      background: color.paper,
      color: color.ink,
      fontFamily: font.display,
      fontWeight: 600,
      fontSize: 36,
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap',
      boxShadow: shadow.float,
      opacity: clamp01(p * 3),
      transform: `scale(${0.82 + 0.18 * p}) rotate(${-2 - (1 - p) * 8}deg)`,
      transformOrigin: 'left center',
      ...style,
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: radius.pill,
        background: color.ink,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Icon size={28} color={color.paper} strokeWidth={2} />
    </div>
    {text}
  </div>
);
