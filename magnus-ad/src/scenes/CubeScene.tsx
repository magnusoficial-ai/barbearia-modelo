import React, {useMemo} from 'react';
import {AbsoluteFill, spring} from 'remotion';
import {circuitRoute, polyline, Trace, type Pt} from '../components/Circuit';
import {Cube, type FaceContent} from '../components/Cube';
import {DotGrid, Stage} from '../components/Atmosphere';
import {RevealText} from '../components/RevealText';
import {productOrder, products, system} from '../content';
import {BEAT, EASE_IN_OUT, FPS, mix, prog, soft} from '../lib/anim';
import {useLayout, type Layout} from '../lib/layout';
import {useScene} from '../lib/scene';
import {color, font, type} from '../theme';

/** Posição e tamanho do cubo; a transição para Sites parte da face da frente. */
export const cubeGeometry = (L: Layout) =>
  L.vertical ? {cx: L.W / 2, cy: 800, size: 500} : {cx: 1320, cy: 540, size: 420};

// estados do giro: começa no M, passa pelos 6 produtos (um por tempo) e volta ao M
const STATES: FaceContent[] = [
  {kind: 'logo'},
  ...productOrder.map((k) => ({kind: 'product' as const, index: products[k].index, name: products[k].name})),
  {kind: 'logo'},
];
const STEPS = STATES.length - 1; // 7 quartos de volta

const stepSpring = (f: number, at: number) =>
  spring({frame: f - at, fps: FPS, config: {damping: 18, stiffness: 180, mass: 0.8}});

export const CubeScene: React.FC = () => {
  const {f} = useScene();
  const L = useLayout();
  const g = cubeGeometry(L);

  // entrada: surge do escuro
  const enterP = soft(f, 0, 22);

  // um quarto de volta por tempo (7,5s → 10,5s), começando 5 frames antes do tempo
  let turns = 0;
  for (let k = 1; k <= STEPS; k++) turns += stepSpring(f, k * BEAT - 5);
  // giro lento contínuo por baixo dos passos, que zera quando o cubo volta ao M
  const drift = 16 * (1 - prog(f, 0, STEPS * BEAT, EASE_IN_OUT));
  const ry = drift - 90 * turns;
  const rx = mix(-24, -14, prog(f, 0, 90, EASE_IN_OUT)) + 8 * prog(f, 96, 20, EASE_IN_OUT);

  // qual conteúdo cada face lateral mostra: troca quando a face está de costas
  const s = -ry / 90;
  const faces = [0, 1, 2, 3].map((k) => (s < k + 2 ? STATES[k] : STATES[k + 4]));

  const traces = useMemo(() => buildTraces(L, g), [L.W, L.H]);

  const text = L.vertical
    ? {left: L.padX, top: 1268, width: L.W - L.padX * 2}
    : {left: L.padX, top: 404, width: 700};

  return (
    <Stage>
      <DotGrid reveal={prog(f, 0, 30)} cx={g.cx} cy={g.cy} opacity={0.7} />
      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
        {traces.map((t, i) => (
          <React.Fragment key={i}>
            <Trace d={t.d} head={prog(f, 6 + i * 3, 26, EASE_IN_OUT)} nodes={[1]} width={2} />
            {/* pulso de dados correndo pela trilha */}
            <Trace
              d={t.d}
              head={prog(f, t.pulseAt, 22, EASE_IN_OUT) + 0.12}
              tail={prog(f, t.pulseAt, 22, EASE_IN_OUT)}
              stroke={color.paper}
              width={2.5}
              opacity={f < t.pulseAt || f > t.pulseAt + 22 ? 0 : 0.9}
            />
          </React.Fragment>
        ))}
      </svg>

      {/* luz no chão */}
      <div
        style={{
          position: 'absolute',
          left: g.cx - g.size,
          top: g.cy + g.size * 0.62,
          width: g.size * 2,
          height: g.size * 0.36,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(245,245,245,0.10) 0%, rgba(245,245,245,0) 70%)',
          opacity: enterP,
        }}
      />

      <AbsoluteFill style={{perspective: 1900, perspectiveOrigin: `${g.cx}px ${g.cy - g.size * 0.2}px`}}>
        <div
          style={{
            position: 'absolute',
            left: g.cx - g.size / 2,
            top: g.cy - g.size / 2,
            transformStyle: 'preserve-3d',
            transform: `translateY(${(1 - enterP) * 40}px) scale(${mix(0.82, 1, enterP)})`,
            opacity: enterP,
            filter: enterP < 0.999 ? `blur(${(1 - enterP) * 14}px)` : undefined,
          }}
        >
          <Cube size={g.size} rx={rx} ry={ry} faces={faces} />
        </div>
      </AbsoluteFill>

      <div style={{position: 'absolute', ...text}}>
        <RevealText
          text={system.title}
          start={2 * BEAT}
          stagger={5}
          style={{
            fontFamily: font.display,
            fontWeight: 500,
            fontSize: type.h1,
            lineHeight: 1.02,
            letterSpacing: '-0.035em',
            color: color.paper,
          }}
        />
        <RevealText
          text={system.subtitle}
          start={4 * BEAT}
          stagger={4}
          style={{
            marginTop: 16,
            fontFamily: font.display,
            fontWeight: 400,
            fontSize: L.vertical ? 52 : type.h4,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: color.soft,
          }}
        />
      </div>
    </Stage>
  );
};

/** Trilhas de circuito saindo das arestas do cubo até perto das bordas da tela. */
const buildTraces = (L: Layout, g: {cx: number; cy: number; size: number}) => {
  const h = g.size * 0.62;
  const out = L.vertical ? 300 : 420;
  const routes: [Pt, Pt, 'h' | 'v'][] = [
    [[g.cx - h, g.cy - h * 0.4], [g.cx - h - out, g.cy - h * 0.4 - 140], 'h'],
    [[g.cx - h, g.cy + h * 0.35], [g.cx - h - out * 0.8, g.cy + h * 0.35 + 120], 'h'],
    [[g.cx + h, g.cy - h * 0.5], [g.cx + h + out, g.cy - h * 0.5 - 100], 'h'],
    [[g.cx + h, g.cy + h * 0.3], [g.cx + h + out * 0.9, g.cy + h * 0.3 + 160], 'h'],
    [[g.cx - h * 0.3, g.cy - h], [g.cx - h * 0.3 - 120, g.cy - h - (L.vertical ? 260 : 200)], 'v'],
    [[g.cx + h * 0.4, g.cy - h], [g.cx + h * 0.4 + 140, g.cy - h - (L.vertical ? 220 : 160)], 'v'],
  ];
  return routes
    .filter(([, b]) => (L.vertical ? true : b[0] > 780)) // no horizontal, o texto ocupa a esquerda
    .map(([a, b, axis], i) => ({d: polyline(circuitRoute(a, b, axis)), pulseAt: 40 + i * 9}));
};
