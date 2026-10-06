import React from 'react';
import {color, font, shadow} from '../theme';

/** Medidas internas do celular para posicionar o conteúdo da tela. */
export const phoneMetrics = (width: number) => {
  const height = Math.round(width * 2.05);
  const bezel = Math.round(width * 0.032);
  const screenW = width - bezel * 2;
  const screenH = height - bezel * 2;
  const statusH = Math.round(width * 0.13);
  return {height, bezel, screenW, screenH, statusH, radius: width * 0.15};
};

type PhoneProps = {
  width: number;
  time?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

/** Celular escuro, borda fina, no estilo do brand board. */
export const Phone: React.FC<PhoneProps> = ({width, time = '9:41', children, style}) => {
  const m = phoneMetrics(width);
  const u = width / 100;
  return (
    <div
      style={{
        width,
        height: m.height,
        borderRadius: m.radius,
        background: '#181818',
        padding: m.bezel,
        boxShadow: `inset 0 0 0 1.5px ${color.lineStrong}, inset 0 0 0 ${m.bezel * 0.6}px #111, ${shadow.float}`,
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          width: m.screenW,
          height: m.screenH,
          borderRadius: m.radius - m.bezel,
          background: '#0F0F0F',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* barra de status */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: m.statusH,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${9 * u}px`,
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: font.display,
              fontWeight: 600,
              fontSize: 4.6 * u,
              color: color.paper,
              letterSpacing: '0.01em',
            }}
          >
            {time}
          </span>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 2.6 * u,
              width: 28 * u,
              height: 8 * u,
              marginLeft: -14 * u,
              borderRadius: 999,
              background: '#000',
            }}
          />
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 0.8 * u}}>
            {[0.45, 0.65, 0.85, 1].map((h, i) => (
              <div
                key={i}
                style={{width: 0.9 * u, height: 2.8 * u * h, borderRadius: 1, background: color.paper}}
              />
            ))}
            <div
              style={{
                marginLeft: 1.6 * u,
                width: 6 * u,
                height: 2.9 * u,
                borderRadius: 0.8 * u,
                border: `${0.3 * u}px solid ${color.soft}`,
                padding: 0.35 * u,
              }}
            >
              <div style={{width: '72%', height: '100%', borderRadius: 0.4 * u, background: color.paper}} />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

/** Medidas internas do notebook. */
export const laptopMetrics = (width: number) => {
  const screenH = Math.round(width * 0.625);
  const bezel = Math.round(width * 0.02);
  return {screenH, bezel, innerW: width - bezel * 2, innerH: screenH - bezel * 2};
};

type LaptopProps = {width: number; children?: React.ReactNode; style?: React.CSSProperties};

/** Notebook escuro com base fina. */
export const Laptop: React.FC<LaptopProps> = ({width, children, style}) => {
  const m = laptopMetrics(width);
  const baseH = Math.round(width * 0.024);
  return (
    <div style={{width, position: 'relative', ...style}}>
      <div
        style={{
          width,
          height: m.screenH,
          borderRadius: `${width * 0.024}px ${width * 0.024}px ${width * 0.008}px ${width * 0.008}px`,
          background: '#181818',
          padding: m.bezel,
          boxShadow: `inset 0 0 0 1.5px ${color.lineStrong}, ${shadow.float}`,
        }}
      >
        <div
          style={{
            width: m.innerW,
            height: m.innerH,
            borderRadius: width * 0.006,
            background: '#0F0F0F',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {children}
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          width: width * 1.12,
          height: baseH,
          marginLeft: -width * 0.06,
          borderRadius: `0 0 ${baseH * 1.4}px ${baseH * 1.4}px`,
          background: 'linear-gradient(180deg, #2E2E2E 0%, #1B1B1B 60%, #121212 100%)',
          boxShadow: `inset 0 1px 0 ${color.mute}, ${shadow.card}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: width * 0.16,
            height: baseH * 0.42,
            marginLeft: -width * 0.08,
            borderRadius: `0 0 ${baseH}px ${baseH}px`,
            background: '#141414',
          }}
        />
      </div>
    </div>
  );
};

/** Barra do navegador (bolinhas + endereço). */
export const BrowserBar: React.FC<{width: number; url: string}> = ({width, url}) => {
  const u = width / 100;
  return (
    <div
      style={{
        height: 4.6 * u,
        display: 'flex',
        alignItems: 'center',
        gap: 0.9 * u,
        padding: `0 ${1.6 * u}px`,
        borderBottom: `1px solid ${color.line}`,
        background: '#121212',
      }}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} style={{width: 1.1 * u, height: 1.1 * u, borderRadius: 99, background: color.lineStrong}} />
      ))}
      <div
        style={{
          marginLeft: 2 * u,
          flex: 1,
          maxWidth: 40 * u,
          height: 2.6 * u,
          borderRadius: 99,
          background: color.surface2,
          display: 'flex',
          alignItems: 'center',
          padding: `0 ${1.4 * u}px`,
          fontFamily: font.body,
          fontSize: 1.35 * u,
          color: color.dim,
        }}
      >
        {url}
      </div>
    </div>
  );
};
