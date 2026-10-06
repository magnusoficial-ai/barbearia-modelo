import {getLength, getPointAtLength} from '@remotion/paths';
import React, {useMemo} from 'react';
import {clamp01} from '../lib/anim';
import {color} from '../theme';

export type Pt = [number, number];

/** Path de polilinha a partir de pontos. */
export const polyline = (pts: Pt[]) =>
  pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');

/**
 * Liga dois pontos no estilo trilha de circuito: reto e depois 45°.
 * `firstAxis` define se o primeiro trecho é horizontal ou vertical.
 */
export const circuitRoute = (a: Pt, b: Pt, firstAxis: 'h' | 'v' = 'h'): Pt[] => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (firstAxis === 'h') {
    const diag = Math.min(Math.abs(dx), Math.abs(dy));
    const mid: Pt = [b[0] - Math.sign(dx) * diag, a[1]];
    return [a, mid, [mid[0] + Math.sign(dx) * diag, a[1] + Math.sign(dy) * diag], b];
  }
  const diag = Math.min(Math.abs(dx), Math.abs(dy));
  const mid: Pt = [a[0], b[1] - Math.sign(dy) * diag];
  return [a, mid, [a[0] + Math.sign(dx) * diag, mid[1] + Math.sign(dy) * diag], b];
};

type TraceProps = {
  d: string;
  /** até onde a linha já foi desenhada (0→1) */
  head: number;
  /** de onde a linha começa a aparecer (0→1); suba para recolher a cauda */
  tail?: number;
  stroke?: string;
  width?: number;
  /** nós circulares ao longo da trilha, em fração do comprimento */
  nodes?: number[];
  nodeRadius?: number;
  /** ponto luminoso na ponta enquanto desenha */
  spark?: boolean;
  opacity?: number;
};

/** Trilha de circuito desenhada por stroke-dashoffset, com nós vazados. */
export const Trace: React.FC<TraceProps> = ({
  d,
  head,
  tail = 0,
  stroke = color.lineStrong,
  width = 2,
  nodes = [],
  nodeRadius = 7,
  spark = false,
  opacity = 1,
}) => {
  const len = useMemo(() => getLength(d), [d]);
  const h = clamp01(head);
  const t = clamp01(Math.min(tail, h));
  const visible = Math.max(0, (h - t) * len);
  const headPt = h > 0 && h < 1 ? getPointAtLength(d, h * len) : null;
  return (
    <g opacity={opacity}>
      {visible > 0.5 ? (
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${visible} ${len * 2 + 10}`}
        strokeDashoffset={-t * len}
      />
      ) : null}
      {nodes.map((at, i) => {
        if (h < at || t > at) return null;
        const p = getPointAtLength(d, at * len);
        if (!p) return null;
        const s = clamp01((h - at) * 12);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={nodeRadius * (0.4 + 0.6 * s)}
            fill={color.ink}
            stroke={stroke}
            strokeWidth={width}
          />
        );
      })}
      {spark && headPt ? (
        <>
          <circle cx={headPt.x} cy={headPt.y} r={14} fill={color.paper} opacity={0.12} />
          <circle cx={headPt.x} cy={headPt.y} r={5} fill={color.paper} />
        </>
      ) : null}
    </g>
  );
};
