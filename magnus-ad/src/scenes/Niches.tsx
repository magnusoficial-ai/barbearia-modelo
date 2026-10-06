import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {circuitRoute, polyline, Trace, type Pt} from '../components/Circuit';
import {icons} from '../components/icons';
import {DotGrid, Stage} from '../components/Atmosphere';
import {RevealText} from '../components/RevealText';
import {niches} from '../content';
import {BEAT, EASE_IN, EASE_IN_OUT, enter, mix, prog, soft} from '../lib/anim';
import {useLayout, type Layout} from '../lib/layout';
import {useScene} from '../lib/scene';
import {color, font, type} from '../theme';

const NODE = 150;

// ordem do caminho da trilha: um nicho acende por tempo, de 28,5s a 31,0s
const nodePositions = (L: Layout): Pt[] =>
  L.vertical
    ? [
        [290, 640],
        [790, 740],
        [290, 920],
        [790, 1020],
        [290, 1200],
        [790, 1300],
      ]
    : [
        [960, 330],
        [1290, 400],
        [1620, 330],
        [1620, 680],
        [1290, 750],
        [960, 680],
      ];

const routeAxis = (L: Layout, i: number): 'h' | 'v' => (L.vertical ? 'h' : i === 2 ? 'v' : 'h');

export const NichesScene: React.FC = () => {
  const {f, dur} = useScene();
  const L = useLayout();
  const pos = nodePositions(L);
  const links = useMemo(
    () => pos.slice(0, -1).map((a, i) => polyline(circuitRoute(a, pos[i + 1], routeAxis(L, i)))),
    [L.W, L.H],
  );
  const activate = (i: number) => BEAT + i * BEAT;

  // saída: câmera recua e uma máscara circular fecha no preto
  const pull = prog(f, dur - 30, 30, EASE_IN_OUT);
  const iris = prog(f, dur - 15, 15, EASE_IN);
  const irisR = mix(Math.hypot(L.W, L.H) / 2 + 40, 0, iris);

  return (
    <Stage>
      <AbsoluteFill
        style={{
          transform: `scale(${mix(1, 0.92, pull)})`,
          clipPath: iris > 0 ? `circle(${irisR}px at 50% 50%)` : undefined,
        }}
      >
        <DotGrid reveal={prog(f, -10, 34)} opacity={0.6} />
        <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
          {links.map((d, i) => (
            <React.Fragment key={i}>
              <Trace d={d} head={prog(f, -6 + i * 2, 24, EASE_IN_OUT)} stroke={color.line} width={2} />
              <Trace d={d} head={prog(f, activate(i) + 1, BEAT - 1, EASE_IN_OUT)} stroke={color.paper} width={3} spark />
            </React.Fragment>
          ))}
        </svg>

        {niches.items.map((n, i) => {
          const Icon = icons[n.icon];
          const [x, y] = pos[i];
          const appear = soft(f, -8 + i * 2, 16);
          const on = soft(f, activate(i), 10);
          return (
            <div
              key={n.label}
              style={{
                position: 'absolute',
                left: x - NODE / 2,
                top: y - NODE / 2,
                width: NODE,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                ...enter(appear, 20, 8),
              }}
            >
              <div
                style={{
                  width: NODE,
                  height: NODE,
                  borderRadius: 999,
                  background: color.surface,
                  boxShadow: `inset 0 0 0 2px ${on > 0.5 ? color.paper : color.lineStrong}, 0 0 ${mix(0, 70, on)}px rgba(245,245,245,${0.14 * on})`,
                  display: 'grid',
                  placeItems: 'center',
                  transform: `scale(${1 + 0.07 * Math.sin(Math.min(on, 1) * Math.PI)})`,
                }}
              >
                <Icon size={64} color={on > 0.5 ? color.paper : color.dim} strokeWidth={1.5} />
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontFamily: font.display,
                  fontWeight: 600,
                  fontSize: 30,
                  color: on > 0.5 ? color.paper : color.dim,
                  whiteSpace: 'nowrap',
                }}
              >
                {n.label}
              </div>
            </div>
          );
        })}

        <RevealText
          text={niches.headline}
          start={6 * BEAT}
          stagger={6}
          style={{
            position: 'absolute',
            left: L.padX,
            top: L.vertical ? 252 : 400,
            width: L.vertical ? L.W - L.padX * 2 : 720,
            fontFamily: font.display,
            fontWeight: 500,
            fontSize: L.vertical ? type.h2 : 80,
            lineHeight: 1.04,
            letterSpacing: '-0.035em',
            color: color.paper,
          }}
        />
      </AbsoluteFill>
    </Stage>
  );
};
