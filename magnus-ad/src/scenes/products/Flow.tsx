import React, {useMemo} from 'react';
import {circuitRoute, polyline, Trace, type Pt} from '../../components/Circuit';
import {icons} from '../../components/icons';
import {DotGrid, Stage} from '../../components/Atmosphere';
import {products} from '../../content';
import {EASE_IN_OUT, enter, mix, prog, soft} from '../../lib/anim';
import {useLayout, type Layout} from '../../lib/layout';
import {useScene} from '../../lib/scene';
import {color, font, radius, type} from '../../theme';
import {ProductHeader} from './ProductHeader';

const steps = products.flow.steps;
const NODE = 168;

// um nó acende a cada 12 frames, para o CRM ficar aceso antes do wipe
const ACTIVATE = [0, 12, 24, 36];

const nodePositions = (L: Layout): Pt[] =>
  L.vertical
    ? [
        [300, 690],
        [780, 900],
        [300, 1110],
        [780, 1320],
      ]
    : [
        [330, 560],
        [760, 700],
        [1190, 560],
        [1620, 700],
      ];

export const FlowScene: React.FC = () => {
  const {f} = useScene();
  const L = useLayout();
  const pos = nodePositions(L);
  const links = useMemo(
    () => pos.slice(0, -1).map((a, i) => polyline(circuitRoute(a, pos[i + 1], 'h'))),
    [L.W, L.H],
  );

  return (
    <Stage>
      <DotGrid opacity={0.5} reveal={prog(f, -10, 30)} />
      <div
        style={{
          position: 'absolute',
          left: L.padX,
          top: L.vertical ? 252 : 150,
        }}
      >
        <ProductHeader k="flow" L={L} />
      </div>

      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
        {links.map((d, i) => {
          const p = prog(f, ACTIVATE[i] + 1, 11, EASE_IN_OUT);
          return (
            <React.Fragment key={i}>
              <Trace d={d} head={1} stroke={color.line} width={2} />
              <Trace d={d} head={p} stroke={color.paper} width={3} spark />
            </React.Fragment>
          );
        })}
      </svg>

      {steps.map((s, i) => {
        const Icon = icons[s.icon];
        const on = soft(f, ACTIVATE[i], 10);
        const appear = soft(f, -10 + i * 3, 16);
        const [x, y] = pos[i];
        return (
          <div
            key={s.label}
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
                borderRadius: radius.xxl,
                background: on > 0.5 ? color.paper : color.surface,
                boxShadow: `inset 0 0 0 2px ${on > 0.5 ? color.paper : color.lineStrong}, 0 0 ${mix(0, 80, on)}px rgba(245,245,245,${0.18 * on})`,
                display: 'grid',
                placeItems: 'center',
                transform: `scale(${1 + 0.06 * Math.sin(Math.min(on, 1) * Math.PI)})`,
              }}
            >
              <Icon size={72} color={on > 0.5 ? color.ink : color.soft} strokeWidth={1.6} />
            </div>
            <div
              style={{
                marginTop: 20,
                fontFamily: font.display,
                fontWeight: 600,
                fontSize: 34,
                color: on > 0.5 ? color.paper : color.soft,
                whiteSpace: 'nowrap',
              }}
            >
              {s.label}
            </div>
            <div style={{fontFamily: font.body, fontSize: type.label, color: color.dim, whiteSpace: 'nowrap', opacity: on}}>
              {s.detail}
            </div>
          </div>
        );
      })}
    </Stage>
  );
};
