import React from 'react';
import {color} from '../theme';
import {ICON, M_SYMBOL, WORDMARK} from './logo-paths';

type LogoProps = {width: number; fill?: string; style?: React.CSSProperties};

/** Logotipo "MAGNUS" vetorizado a partir do arquivo oficial. */
export const Wordmark: React.FC<LogoProps> = ({width, fill = color.paper, style}) => (
  <svg
    viewBox={`0 0 ${WORDMARK.w} ${WORDMARK.h}`}
    width={width}
    height={(width * WORDMARK.h) / WORDMARK.w}
    style={{display: 'block', overflow: 'visible', ...style}}
  >
    <path d={WORDMARK.d} fill={fill} fillRule="evenodd" />
  </svg>
);

/** Ícone de app: quadrado arredondado com o M vazado. */
export const AppIcon: React.FC<LogoProps> = ({width, fill = color.paper, style}) => (
  <svg
    viewBox={`0 0 ${ICON.w} ${ICON.h}`}
    width={width}
    height={(width * ICON.h) / ICON.w}
    style={{display: 'block', ...style}}
  >
    <path d={ICON.d} fill={fill} fillRule="evenodd" />
  </svg>
);

/** Só o símbolo M. */
export const MSymbol: React.FC<LogoProps> = ({width, fill = color.paper, style}) => (
  <svg
    viewBox={`0 0 ${M_SYMBOL.w} ${M_SYMBOL.h}`}
    width={width}
    height={(width * M_SYMBOL.h) / M_SYMBOL.w}
    style={{display: 'block', overflow: 'visible', ...style}}
  >
    <path d={M_SYMBOL.d} fill={fill} fillRule="evenodd" />
  </svg>
);

/** Pontos da linha central do M (coordenadas do símbolo), na ordem do traço. */
export const M_CENTERLINE: [number, number][] = M_SYMBOL.centerline
  .slice(1)
  .split('L')
  .map((pair) => {
    const [x, y] = pair.trim().split(' ').map(Number);
    return [x, y] as [number, number];
  });
