import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {EASE_IN_OUT, mix} from '../lib/anim';
import {color} from '../theme';

/* ------------------------------------------------------------------ */
/* Wipe de linha: uma linha de circuito varre a tela e revela a cena.  */
/* ------------------------------------------------------------------ */

type LineWipeProps = {
  direction: 'from-right' | 'from-left' | 'from-bottom';
  width: number;
  height: number;
};

const LineWipe: React.FC<TransitionPresentationComponentProps<LineWipeProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: {direction, width, height},
}) => {
  const p = EASE_IN_OUT(presentationProgress);
  const horizontal = direction !== 'from-bottom';
  const shift = 48;

  if (presentationDirection === 'exiting') {
    // a cena que sai desliza um pouco no sentido da linha
    const d = direction === 'from-right' ? -1 : 1;
    const t = horizontal ? `translateX(${d * shift * p}px)` : `translateY(${-shift * p}px)`;
    return <AbsoluteFill style={{transform: t}}>{children}</AbsoluteFill>;
  }

  // posição da linha
  const pos = horizontal
    ? direction === 'from-right'
      ? width * (1 - p)
      : width * p
    : height * (1 - p);
  const clip = horizontal
    ? direction === 'from-right'
      ? `inset(0 0 0 ${pos}px)`
      : `inset(0 ${width - pos}px 0 0)`
    : `inset(${pos}px 0 0 0)`;
  const enterShift = (1 - p) * shift * (direction === 'from-left' ? -1 : 1);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: clip}}>
        <AbsoluteFill style={{transform: horizontal ? `translateX(${enterShift}px)` : `translateY(${enterShift}px)`}}>
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
      {p > 0 && p < 1 ? (
        <svg width={width} height={height} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
          {horizontal ? (
            <>
              <line x1={pos} x2={pos} y1={0} y2={height} stroke={color.paper} strokeWidth={2} />
              {[0.22, 0.5, 0.78].map((k) => (
                <circle key={k} cx={pos} cy={height * k} r={k === 0.5 ? 9 : 6} fill={color.ink} stroke={color.paper} strokeWidth={2} />
              ))}
            </>
          ) : (
            <>
              <line x1={0} x2={width} y1={pos} y2={pos} stroke={color.paper} strokeWidth={2} />
              {[0.2, 0.5, 0.8].map((k) => (
                <circle key={k} cx={width * k} cy={pos} r={k === 0.5 ? 9 : 6} fill={color.ink} stroke={color.paper} strokeWidth={2} />
              ))}
            </>
          )}
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

// tipo comum para guardar transições diferentes na mesma lista
export type AnyPresentation = TransitionPresentation<Record<string, unknown>>;

export const lineWipe = (props: LineWipeProps): AnyPresentation =>
  ({component: LineWipe, props}) as TransitionPresentation<LineWipeProps> as unknown as AnyPresentation;

/* ------------------------------------------------------------------ */
/* Portal: a câmera mergulha na face do cubo e a próxima cena abre.    */
/* ------------------------------------------------------------------ */

const WINDOW_EASE = Easing.bezier(0.3, 0, 0.15, 1);

type PortalProps = {cx: number; cy: number; size: number; width: number; height: number};

const Portal: React.FC<TransitionPresentationComponentProps<PortalProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: {cx, cy, size, width, height},
}) => {
  const p = EASE_IN_OUT(presentationProgress);
  const zoomTo = Math.max(width, height) / size;

  if (presentationDirection === 'exiting') {
    return (
      <AbsoluteFill
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          transform: `scale(${mix(1, zoomTo * 1.4, p)})`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  // janela centrada na face, crescendo um pouco mais rápido que o zoom da câmera,
  // até cobrir a tela; o branco da face aparece só por um instante
  const pw = WINDOW_EASE(presentationProgress);
  const cover = (2 * Math.max(cx, width - cx, cy, height - cy) * 1.05) / (size * 0.9);
  const side = size * 0.9 * mix(1, cover, pw);
  const x0 = Math.max(0, cx - side / 2);
  const y0 = Math.max(0, cy - side / 2);
  const x1 = Math.min(width, cx + side / 2);
  const y1 = Math.min(height, cy + side / 2);
  const s = mix(0.6, 1, pw);
  const r = mix(size * 0.04, 0, pw);
  return (
    <AbsoluteFill
      style={{
        clipPath: `inset(${y0}px ${width - x1}px ${height - y1}px ${x0}px round ${r}px)`,
        opacity: Math.min(1, pw * 5),
      }}
    >
      <AbsoluteFill
        style={{
          transformOrigin: `${width / 2}px ${height / 2}px`,
          transform: `translate(${mix(cx - width / 2, 0, pw)}px, ${mix(cy - height / 2, 0, pw)}px) scale(${s})`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const portal = (props: PortalProps): AnyPresentation =>
  ({component: Portal, props}) as TransitionPresentation<PortalProps> as unknown as AnyPresentation;
