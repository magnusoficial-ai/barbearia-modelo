import React from 'react';
import {M_SYMBOL} from '../brand/logo-paths';
import {useSvgId} from '../lib/svg-id';
import {font} from '../theme';

export type FaceContent = {kind: 'logo'} | {kind: 'product'; index: string; name: string};

type Vec = [number, number, number];

const rad = (d: number) => (d * Math.PI) / 180;

// mesma ordem de rotação do CSS "rotateX(rx) rotateY(ry)": primeiro Y, depois X
const rotate = ([x, y, z]: Vec, rx: number, ry: number): Vec => {
  const cy = Math.cos(rad(ry));
  const sy = Math.sin(rad(ry));
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cx = Math.cos(rad(rx));
  const sx = Math.sin(rad(rx));
  return [x1, y * cx - z1 * sx, y * sx + z1 * cx];
};

// luz vindo de cima, à esquerda, um pouco à frente (coordenadas CSS: y para baixo)
const LIGHT: Vec = [-0.45, -0.65, 0.62];
const LIGHT_LEN = Math.hypot(...LIGHT);

const shade = (normal: Vec, rx: number, ry: number) => {
  const n = rotate(normal, rx, ry);
  const d = (n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]) / LIGHT_LEN;
  return Math.min(1, 0.66 + 0.4 * Math.max(0, d));
};

/** Gravação em baixo-relevo: sombra interna em cima/esquerda, luz embaixo/direita. */
const DebossFilter: React.FC<{id: string}> = ({id}) => (
  <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
    <feComponentTransfer in="SourceAlpha" result="inv">
      <feFuncA type="table" tableValues="1 0" />
    </feComponentTransfer>
    <feOffset in="inv" dx="0.7" dy="0.9" result="invOff" />
    <feGaussianBlur in="invOff" stdDeviation="0.55" result="invBlur" />
    <feComposite in="invBlur" in2="SourceAlpha" operator="in" result="shadowShape" />
    <feFlood floodColor="#000" floodOpacity="0.6" result="shadowColor" />
    <feComposite in="shadowColor" in2="shadowShape" operator="in" result="innerShadow" />
    <feOffset in="inv" dx="-0.5" dy="-0.6" result="invOff2" />
    <feGaussianBlur in="invOff2" stdDeviation="0.35" result="invBlur2" />
    <feComposite in="invBlur2" in2="SourceAlpha" operator="in" result="hlShape" />
    <feFlood floodColor="#fff" floodOpacity="0.95" result="hlColor" />
    <feComposite in="hlColor" in2="hlShape" operator="in" result="innerHl" />
    <feMerge>
      <feMergeNode in="SourceGraphic" />
      <feMergeNode in="innerShadow" />
      <feMergeNode in="innerHl" />
    </feMerge>
  </filter>
);

const Engraving: React.FC<{content: FaceContent | null}> = ({content}) => {
  const id = useSvgId('deboss');
  if (!content) return null;
  const fill = 'rgba(0,0,0,0.13)';
  const mW = content.kind === 'logo' ? 62 : 13;
  const mH = (mW * M_SYMBOL.h) / M_SYMBOL.w;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
      <defs>
        <DebossFilter id={id} />
      </defs>
      <g filter={`url(#${id})`}>
        {content.kind === 'logo' ? (
          <path
            d={M_SYMBOL.d}
            fillRule="evenodd"
            fill={fill}
            transform={`translate(${50 - mW / 2} ${50 - mH / 2}) scale(${mW / M_SYMBOL.w})`}
          />
        ) : (
          <>
            <path
              d={M_SYMBOL.d}
              fillRule="evenodd"
              fill={fill}
              transform={`translate(${91 - mW} 9) scale(${mW / M_SYMBOL.w})`}
            />
            <text
              x={9}
              y={16}
              fontFamily={font.display}
              fontWeight={500}
              fontSize={6}
              letterSpacing={0.3}
              fill={fill}
            >
              {content.index}
            </text>
            <text
              x={8}
              y={89}
              fontFamily={font.display}
              fontWeight={600}
              fontSize={content.name.length > 5 ? 19 : 21}
              letterSpacing={-0.6}
              fill={fill}
            >
              {content.name}
            </text>
          </>
        )}
      </g>
    </svg>
  );
};

type CubeProps = {
  size: number;
  rx: number;
  ry: number;
  /** conteúdo das 4 faces laterais: frente, direita, trás, esquerda */
  faces: (FaceContent | null)[];
};

const BASE = '#EDEDED';

/** Cubo branco fosco em CSS 3D, com luz calculada por face. */
export const Cube: React.FC<CubeProps> = ({size: S, rx, ry, faces}) => {
  const h = S / 2;
  const defs: {normal: Vec; transform: string; content: FaceContent | null}[] = [
    {normal: [0, 0, 1], transform: `translateZ(${h}px)`, content: faces[0]},
    {normal: [1, 0, 0], transform: `rotateY(90deg) translateZ(${h}px)`, content: faces[1]},
    {normal: [0, 0, -1], transform: `rotateY(180deg) translateZ(${h}px)`, content: faces[2]},
    {normal: [-1, 0, 0], transform: `rotateY(-90deg) translateZ(${h}px)`, content: faces[3]},
    {normal: [0, -1, 0], transform: `rotateX(90deg) translateZ(${h}px)`, content: null},
    {normal: [0, 1, 0], transform: `rotateX(-90deg) translateZ(${h}px)`, content: null},
  ];
  return (
    <div
      style={{
        width: S,
        height: S,
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
      }}
    >
      {defs.map((face, i) => {
        const n = rotate(face.normal, rx, ry);
        if (n[2] <= 0.001) return null;
        const light = shade(face.normal, rx, ry);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              transform: face.transform,
              backfaceVisibility: 'hidden',
              outline: '1px solid transparent',
              background: `linear-gradient(155deg, #F7F7F7 0%, ${BASE} 55%, #DDDDDD 100%)`,
              overflow: 'hidden',
            }}
          >
            <Engraving content={face.content} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `rgba(13,13,13,${(1 - light).toFixed(3)})`,
                boxShadow: 'inset 0 0 18px rgba(0,0,0,0.07)',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
