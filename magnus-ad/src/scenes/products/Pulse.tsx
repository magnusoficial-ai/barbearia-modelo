import {getLength} from '@remotion/paths';
import {ArrowUpRight} from 'lucide-react';
import React, {useMemo} from 'react';
import {Stage} from '../../components/Atmosphere';
import {products} from '../../content';
import {EASE_IN_OUT, EASE_OUT, formatBR, pop, prog, soft} from '../../lib/anim';
import {useLayout} from '../../lib/layout';
import {useScene} from '../../lib/scene';
import {useSvgId} from '../../lib/svg-id';
import {color, eyebrow, font, radius, shadow, type} from '../../theme';
import {ProductHeader, productRegions, TextColumn} from './ProductHeader';

const pr = products.pulse;

// forma da curva (crescente, com pequenas oscilações); só desenho, não são dados
const CURVE = [10, 16, 13, 22, 27, 25, 36, 44, 41, 57, 70, 88];

const T = {draw: 4, drawEnd: 52, growth: 52, roi: 28, roiEnd: 64};

const Card: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
  <div
    style={{
      position: 'absolute',
      borderRadius: radius.xl,
      background: color.surface,
      boxShadow: `inset 0 0 0 1px ${color.line}, ${shadow.card}`,
      padding: 40,
      ...style,
    }}
  >
    {children}
  </div>
);

const Chart: React.FC<{w: number; h: number; p: number}> = ({w, h, p}) => {
  const gid = useSvgId('area');
  const cid = useSvgId('clip');
  const pts = CURVE.map((v, i) => [(i / (CURVE.length - 1)) * w, h - (v / 100) * h] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  const len = useMemo(() => getLength(line), [line]);
  const last = pts[pts.length - 1];
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color.paper} stopOpacity="0.16" />
          <stop offset="1" stopColor={color.paper} stopOpacity="0" />
        </linearGradient>
        <clipPath id={cid}>
          <rect x={0} y={-20} width={w * p} height={h + 40} />
        </clipPath>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={0} x2={w} y1={h * g} y2={h * g} stroke={color.line} strokeWidth={1} strokeDasharray="4 8" />
      ))}
      <path d={area} fill={`url(#${gid})`} clipPath={`url(#${cid})`} />
      <path
        d={line}
        fill="none"
        stroke={color.paper}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${len * p} ${len * 2}`}
      />
      {p > 0.98 ? (
        <>
          <circle cx={last[0]} cy={last[1]} r={16} fill={color.paper} opacity={0.15} />
          <circle cx={last[0]} cy={last[1]} r={7} fill={color.paper} />
        </>
      ) : null}
    </svg>
  );
};

export const PulseScene: React.FC = () => {
  const {f} = useScene();
  const L = useLayout();
  const R = productRegions(L, 'left');
  const drawP = prog(f, T.draw, T.drawEnd - T.draw, EASE_IN_OUT);
  const leads = Math.round(pr.leads * prog(f, T.draw, T.drawEnd - T.draw, EASE_OUT));
  const roi = pr.roi * prog(f, T.roi, T.roiEnd - T.roi, EASE_OUT);
  const growthP = pop(f, T.growth);
  const cardIn = soft(f, -10, 22);
  const roiIn = soft(f, 4, 20);
  const liveOn = 0.4 + 0.6 * Math.abs(Math.cos((f / 30) * Math.PI));

  const main = L.vertical
    ? {x: L.padX, y: 600, w: L.W - L.padX * 2, h: 560}
    : {x: R.stage.x + 20, y: 140, w: 920, h: 560};
  const second = L.vertical
    ? {x: L.padX, y: 1188, w: L.W - L.padX * 2, h: 200}
    : {x: R.stage.x + 20, y: 728, w: 920, h: 200};
  const chartW = main.w - 80;
  const chartH = main.h - 300;

  const disclaimer = (
    <div style={{fontFamily: font.body, fontSize: type.label, color: color.dim}}>{pr.disclaimer}</div>
  );

  return (
    <Stage>
      <TextColumn L={L} side="left">
        <ProductHeader k="pulse" L={L}>
          {!L.vertical ? <div style={{marginTop: 48}}>{disclaimer}</div> : null}
        </ProductHeader>
      </TextColumn>

      <Card
        style={{
          left: main.x,
          top: main.y,
          width: main.w,
          height: main.h,
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 60}px)`,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{...eyebrow, color: color.dim}}>{pr.leadsLabel}</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: font.body, fontSize: type.label, color: color.soft}}>
            <div style={{width: 12, height: 12, borderRadius: 99, background: color.paper, opacity: liveOn}} />
            {pr.live}
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 12}}>
          <div
            style={{
              fontFamily: font.display,
              fontWeight: 500,
              fontSize: 128,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: color.paper,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatBR(leads)}
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: font.display,
              fontWeight: 600,
              fontSize: 44,
              color: color.accent,
              opacity: Math.min(1, growthP * 2),
              transform: `translateY(${(1 - growthP) * 16}px)`,
            }}
          >
            <ArrowUpRight size={44} color={color.accent} strokeWidth={2.4} />
            {pr.growth}
          </div>
        </div>
        <div style={{position: 'absolute', left: 40, bottom: 40}}>
          <Chart w={chartW} h={chartH} p={drawP} />
        </div>
      </Card>

      <Card
        style={{
          left: second.x,
          top: second.y,
          width: second.w,
          height: second.h,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: roiIn,
          transform: `translateY(${(1 - roiIn) * 60}px)`,
        }}
      >
        <div style={{...eyebrow, color: color.dim, maxWidth: 420, lineHeight: 1.4}}>{pr.roiLabel}</div>
        <div
          style={{
            fontFamily: font.display,
            fontWeight: 500,
            fontSize: 104,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: color.paper,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatBR(roi, 1)}x
        </div>
      </Card>

      {L.vertical ? <div style={{position: 'absolute', left: L.padX, top: 1420}}>{disclaimer}</div> : null}
    </Stage>
  );
};
