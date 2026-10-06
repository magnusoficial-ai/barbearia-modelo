import React from 'react';
import {RevealText} from '../../components/RevealText';
import {products, type ProductKey} from '../../content';
import {enter, soft} from '../../lib/anim';
import type {Layout} from '../../lib/layout';
import {useScene} from '../../lib/scene';
import {color, eyebrow, font} from '../../theme';

export type Box = {x: number; y: number; w: number; h: number};

/**
 * Onde fica o texto e onde fica o mockup.
 * Vertical: texto em cima, mockup embaixo. Horizontal: lado a lado, alternando o lado.
 */
export const productRegions = (L: Layout, mockupSide: 'left' | 'right') => {
  if (L.vertical) {
    return {
      text: {x: L.padX, y: 252, w: L.W - L.padX * 2, h: 320},
      stage: {x: 0, y: 600, w: L.W, h: 900},
    };
  }
  return mockupSide === 'right'
    ? {text: {x: L.padX, y: 0, w: 660, h: L.H}, stage: {x: 860, y: 90, w: 960, h: 900}}
    : {text: {x: 1140, y: 0, w: 660, h: L.H}, stage: {x: 100, y: 90, w: 960, h: 900}};
};

type Props = {
  k: ProductKey;
  L: Layout;
  start?: number;
  /** conteúdo extra embaixo do título (selo no horizontal) */
  children?: React.ReactNode;
};

/** Rótulo "01 — MAGNUS SITES" + título curto que entra por palavra. */
export const ProductHeader: React.FC<Props> = ({k, L, start = 0, children}) => {
  const {f} = useScene();
  const pr = products[k];
  const p = soft(f, start - 6, 16);
  const R = productRegions(L, 'right');
  const box = L.vertical ? R.text : {...R.text, w: 660};
  return (
    <div
      style={{
        width: box.w,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          ...eyebrow,
          ...enter(p, 12, 6),
        }}
      >
        <span style={{color: color.dim}}>{pr.index}</span>
        <span style={{width: 48 * p, height: 2, background: color.lineStrong}} />
        <span style={{color: color.paper}}>MAGNUS {pr.name}</span>
      </div>
      <RevealText
        text={pr.headline}
        start={start}
        stagger={3}
        style={{
          marginTop: 24,
          fontFamily: font.display,
          fontWeight: 500,
          fontSize: L.vertical ? 80 : 76,
          lineHeight: 1.04,
          letterSpacing: '-0.035em',
          color: color.paper,
        }}
      />
      {children}
    </div>
  );
};

/** Coluna de texto posicionada conforme o formato. */
export const TextColumn: React.FC<{L: Layout; side: 'left' | 'right'; children: React.ReactNode}> = ({
  L,
  side,
  children,
}) => {
  const R = productRegions(L, side);
  if (L.vertical) {
    return <div style={{position: 'absolute', left: R.text.x, top: R.text.y, width: R.text.w}}>{children}</div>;
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: R.text.x,
        top: 0,
        width: R.text.w,
        height: L.H,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
};
