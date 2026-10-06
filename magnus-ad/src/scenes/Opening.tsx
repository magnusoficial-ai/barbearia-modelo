import {getLength} from '@remotion/paths';
import {MessageCircle} from 'lucide-react';
import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {M_CENTERLINE} from '../brand/Logo';
import {M_SYMBOL} from '../brand/logo-paths';
import {Wordmark} from '../brand/Logo';
import {polyline, Trace, type Pt} from '../components/Circuit';
import {RevealText} from '../components/RevealText';
import {Stage} from '../components/Atmosphere';
import {problem} from '../content';
import {EASE_IN, EASE_IN_OUT, EASE_OUT, enter, mix, prog, soft} from '../lib/anim';
import {useLayout, type Layout} from '../lib/layout';
import {useScene} from '../lib/scene';
import {useSvgId} from '../lib/svg-id';
import {color, eyebrow, font, radius, type} from '../theme';

/**
 * CENAS 1 e 2 juntas, porque a linha da cena 2 apaga o conteúdo da cena 1.
 * Tempos em frames a partir do início do vídeo (30fps, 1 tempo = 15 frames).
 */
const FULL = {
  notifs: [12, 27, 42, 57],
  headline: 72,
  stagger: 6,
  line: 120, // 4,0s: a linha entra
  lineDur: 12,
  draw: 127,
  drawEnd: 172, // 5,7s: M completo
  retract: 160,
  retractEnd: 178,
  logo: 180, // 6,0s: corte seco para o logo
  zoom: 198,
  end: 210, // 7,0s
};

const SHORT = {
  notifs: [6, 18, 30],
  headline: 45,
  stagger: 5,
  line: 90,
  lineDur: 10,
  draw: 96,
  drawEnd: 123,
  retract: 116,
  retractEnd: 129,
  logo: 135,
  zoom: 141,
  end: 150,
};

const CARD_H = 144;
const CARD_GAP = 16;
const BUS_DROP = 110;

const geometry = (L: Layout) => {
  const mW = L.vertical ? 600 : 560;
  const s = mW / M_SYMBOL.w;
  const mH = M_SYMBOL.h * s;
  const cx = L.W / 2;
  const cy = L.vertical ? 900 : 520;
  const mx = cx - mW / 2;
  const my = cy - mH / 2;
  const pts: Pt[] = M_CENTERLINE.map(([x, y]) => [mx + x * s, my + y * s]);
  const foot = pts[0];
  const busY = foot[1] + BUS_DROP;
  const branch: Pt = [foot[0] - BUS_DROP, busY];
  const busD = polyline([
    [-40, busY],
    [L.W + 40, busY],
  ]);
  const drawD = polyline([branch, ...pts]);
  return {s, mx, my, mW, mH, busY, branch, busD, drawD, branchLen: BUS_DROP * Math.SQRT2};
};

const Notification: React.FC<{from: string; text: string; width: number; style: React.CSSProperties}> = ({
  from,
  text,
  width,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width,
      height: CARD_H,
      borderRadius: radius.xl,
      background: color.surface,
      boxShadow: `inset 0 0 0 1px ${color.line}`,
      padding: '24px 28px',
      display: 'flex',
      gap: 24,
      alignItems: 'center',
      ...style,
    }}
  >
    <div
      style={{
        width: 72,
        height: 72,
        flexShrink: 0,
        borderRadius: radius.md + 4,
        background: color.surface3,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <MessageCircle size={38} color={color.paper} strokeWidth={1.75} />
    </div>
    <div style={{flex: 1, minWidth: 0}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: font.body,
          fontSize: 22,
          color: color.dim,
          letterSpacing: '0.04em',
        }}
      >
        <span style={{textTransform: 'uppercase', fontWeight: 600}}>{problem.appName}</span>
        <span>{problem.justNow}</span>
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: font.body,
          fontWeight: 600,
          fontSize: type.small + 1,
          color: color.paper,
          lineHeight: 1.25,
        }}
      >
        {from}
      </div>
      <div
        style={{
          fontFamily: font.body,
          fontSize: type.small + 1,
          color: color.soft,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {text}
      </div>
    </div>
  </div>
);

const Problem: React.FC<{T: typeof FULL; L: Layout}> = ({T, L}) => {
  const {f} = useScene();
  const notifs = problem.notifications.slice(0, T.notifs.length);
  const arrived = T.notifs.filter((a) => f >= a).length;
  const lastArrival = arrived > 0 ? T.notifs[arrived - 1] : 0;

  const col = L.vertical
    ? {x: L.padX, eyebrowY: 252, clockY: 296, clockSize: 232, countY: 548, stackX: L.padX, stackY: 640, stackW: L.W - L.padX * 2, headY: 1300}
    : {x: L.padX, eyebrowY: 200, clockY: 240, clockSize: 220, countY: 482, stackX: 1040, stackY: 244, stackW: 760, headY: 720};

  const clockIn = soft(f, 0, 16);
  const colonOn = f % 30 < 15;
  const push = interpolate(f, [0, T.line], [1, 1.05], {
    extrapolateRight: 'clamp',
    easing: EASE_IN_OUT,
  });

  return (
    <AbsoluteFill style={{transform: `scale(${push})`}}>
      <div style={{position: 'absolute', left: col.x, top: col.eyebrowY, ...eyebrow, color: color.dim, ...enter(soft(f, 4))}}>
        {problem.closedLabel}
      </div>
      <div
        style={{
          position: 'absolute',
          left: col.x - col.clockSize * 0.04,
          top: col.clockY,
          fontFamily: font.display,
          fontWeight: 300,
          fontSize: col.clockSize,
          lineHeight: 1,
          letterSpacing: '-0.045em',
          color: color.paper,
          fontVariantNumeric: 'tabular-nums',
          ...enter(clockIn, 20, 16),
        }}
      >
        {problem.clock.slice(0, 2)}
        <span style={{opacity: colonOn ? 1 : 0.22}}>:</span>
        {problem.clock.slice(3)}
      </div>
      {arrived > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: col.x,
            top: col.countY,
            fontFamily: font.body,
            fontSize: type.body,
            color: color.soft,
            display: 'flex',
            gap: 10,
          }}
        >
          <span
            key={arrived}
            style={{
              display: 'inline-block',
              fontFamily: font.display,
              fontWeight: 600,
              color: color.paper,
              ...enter(soft(f, lastArrival, 10), 12, 6),
            }}
          >
            {arrived}
          </span>
          <span>{arrived === 1 ? problem.unreadSingular : problem.unreadPlural}</span>
        </div>
      ) : null}

      <div style={{position: 'absolute', left: col.stackX, top: col.stackY, width: col.stackW}}>
        {notifs.map((n, i) => {
          const p = soft(f, T.notifs[i], 14);
          if (p <= 0) return null;
          let shift = 0;
          for (let j = i + 1; j < notifs.length; j++) shift += soft(f, T.notifs[j], 14) * (CARD_H + CARD_GAP);
          return (
            <Notification
              key={i}
              from={n.from}
              text={n.text}
              width={col.stackW}
              style={{
                opacity: p,
                transform: `translateY(${shift - (1 - p) * 28}px) scale(${0.96 + 0.04 * p})`,
                filter: p < 0.999 ? `blur(${(1 - p) * 10}px)` : undefined,
                zIndex: 10 + i,
              }}
            />
          );
        })}
      </div>

      <RevealText
        text={problem.headline}
        start={T.headline}
        stagger={T.stagger}
        style={{
          position: 'absolute',
          left: col.x,
          top: col.headY,
          fontFamily: font.display,
          fontWeight: 500,
          fontSize: type.h1,
          lineHeight: 1.02,
          letterSpacing: '-0.035em',
          color: color.paper,
        }}
      />
    </AbsoluteFill>
  );
};

export const Opening: React.FC<{short?: boolean}> = ({short = false}) => {
  const {f} = useScene();
  const L = useLayout();
  const T = short ? SHORT : FULL;
  const g = useMemo(() => geometry(L), [L.W, L.H]);
  const maskId = useSvgId('mmask');
  const lenM = useMemo(() => getLength(M_SYMBOL.centerline), []);
  const lenDraw = useMemo(() => getLength(g.drawD), [g.drawD]);

  // CENA 2a: linha atravessa a tela
  const busHead = prog(f, T.line, T.lineDur, Easing.bezier(0.5, 0, 0.2, 1));
  const busX = -40 + (L.W + 80) * busHead;
  const branchFrac = (g.branch[0] + 40) / (L.W + 80);
  const retract = prog(f, T.retract, T.retractEnd - T.retract, EASE_IN_OUT);
  const busTail = mix(0, branchFrac, retract);
  const busHeadVisible = mix(busHead, branchFrac, retract);

  // CENA 2b: ramo a 45° e o M em traço contínuo
  const drawP = prog(f, T.draw, T.drawEnd - T.draw, Easing.bezier(0.45, 0, 0.25, 1));
  const drawn = drawP * lenDraw;
  const drawnM = Math.max(0, drawn - g.branchLen) / g.s;
  const drawTail = mix(0, g.branchLen / lenDraw, retract);

  const showLogo = f >= T.logo;
  const settle = prog(f, T.logo, 20, EASE_OUT);
  const zoom = prog(f, T.zoom, T.end - T.zoom, EASE_IN);

  if (showLogo) {
    const logoW = L.vertical ? 840 : 1040;
    return (
      <Stage>
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${mix(1.03, 1, settle) * mix(1, 18, zoom)})`,
            filter: zoom > 0 ? `blur(${zoom * 8}px)` : undefined,
          }}
        >
          <Wordmark width={logoW} />
        </AbsoluteFill>
      </Stage>
    );
  }

  return (
    <Stage>
      <AbsoluteFill style={{clipPath: f >= T.line ? `inset(0 0 0 ${Math.max(0, busX)}px)` : undefined}}>
        <Problem T={T} L={L} />
      </AbsoluteFill>

      {busHead > 0 && busHead < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: busX - 1,
            top: 0,
            width: 2,
            height: L.H,
            background: `linear-gradient(180deg, rgba(245,245,245,0) 0%, rgba(245,245,245,0.35) 50%, rgba(245,245,245,0) 100%)`,
          }}
        />
      ) : null}

      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x={-200} y={-200} width={M_SYMBOL.w + 400} height={M_SYMBOL.h + 400}>
            <path d={M_SYMBOL.d} fill="#fff" fillRule="evenodd" />
          </mask>
        </defs>
        {f >= T.line ? (
          <Trace
            d={g.busD}
            head={busHeadVisible}
            tail={busTail}
            stroke={color.paper}
            width={3}
            nodes={[0.08, 0.3, 0.62, 0.88]}
            nodeRadius={8}
            spark
          />
        ) : null}
        <g transform={`translate(${g.mx} ${g.my}) scale(${g.s})`}>
          {drawnM > 0.5 ? (
          <path
            d={M_SYMBOL.centerline}
            fill="none"
            stroke={color.paper}
            strokeWidth={M_SYMBOL.stroke * 1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${drawnM} ${lenM * 2}`}
            mask={`url(#${maskId})`}
          />
          ) : null}
        </g>
        {f >= T.draw ? (
          <Trace
            d={g.drawD}
            head={drawP}
            tail={drawTail}
            stroke={color.paper}
            width={3}
            nodes={[0]}
            nodeRadius={8}
            spark
          />
        ) : null}
      </svg>
    </Stage>
  );
};

export const OPENING_FRAMES = {full: FULL.end, short: SHORT.end};
