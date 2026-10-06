import {noise2D} from '@remotion/noise';
import {AudioLines, PhoneCall} from 'lucide-react';
import React from 'react';
import {AppIcon} from '../../brand/Logo';
import {Stage} from '../../components/Atmosphere';
import {products} from '../../content';
import {enter, soft} from '../../lib/anim';
import {useLayout} from '../../lib/layout';
import {useScene} from '../../lib/scene';
import {color, eyebrow, font, radius, shadow, type} from '../../theme';
import {ProductHeader, productRegions, TextColumn} from './ProductHeader';

const demo = products.voz.demo;
const WORDS = demo.speech.split(' ');
const SPEECH_START = 8;
const WORD_GAP = 12;
const BARS = 44;

/** Envelope de fala: um pico suave por palavra. */
const speechEnvelope = (f: number) => {
  let e = 0;
  WORDS.forEach((w, i) => {
    const t = f - (SPEECH_START + i * WORD_GAP);
    const len = 6 + w.length * 1.1;
    if (t > -2 && t < len + 3) e = Math.max(e, Math.sin(Math.max(0, Math.min(1, (t + 2) / (len + 5))) * Math.PI));
  });
  return e;
};

const Waveform: React.FC<{f: number; width: number; height: number}> = ({f, width, height}) => {
  const env = speechEnvelope(f);
  const barW = Math.round((width / BARS) * 0.42);
  return (
    <div style={{width, height, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      {Array.from({length: BARS}).map((_, i) => {
        const center = 1 - Math.abs(i - (BARS - 1) / 2) / (BARS / 2);
        const n = Math.abs(noise2D('voz', i * 0.18, f * 0.16));
        const idle = 0.05 + 0.03 * Math.abs(Math.sin(f / 9 + i * 0.5));
        const h = Math.max(idle, env * (0.25 + 0.75 * n) * (0.35 + 0.65 * center));
        return (
          <div
            key={i}
            style={{
              width: barW,
              height: Math.max(barW, h * height),
              borderRadius: 99,
              background: color.paper,
              opacity: 0.35 + 0.65 * Math.min(1, h * 2),
            }}
          />
        );
      })}
    </div>
  );
};

export const VozScene: React.FC = () => {
  const {f} = useScene();
  const L = useLayout();
  const R = productRegions(L, 'right');
  const area = L.vertical
    ? {x: L.padX, y: 620, w: L.W - L.padX * 2}
    : {x: R.stage.x + 20, y: 200, w: 900};
  const cardIn = soft(f, -10, 22);
  const seconds = 3 + Math.floor(Math.max(0, f) / 30);

  return (
    <Stage>
      <TextColumn L={L} side="right">
        <ProductHeader k="voz" L={L} />
      </TextColumn>

      <div style={{position: 'absolute', left: area.x, top: area.y, width: area.w}}>
        {/* cartão da chamada */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            padding: 32,
            borderRadius: radius.xl,
            background: color.surface,
            boxShadow: `inset 0 0 0 1px ${color.line}, ${shadow.card}`,
            ...enter(cardIn, 40, 8),
          }}
        >
          <AppIcon width={104} fill={color.paper} />
          <div style={{flex: 1}}>
            <div style={{fontFamily: font.display, fontWeight: 600, fontSize: 40, letterSpacing: '-0.02em', color: color.paper}}>
              {demo.business}
            </div>
            <div style={{fontFamily: font.body, fontSize: type.small, color: color.dim, marginTop: 4}}>
              {demo.status} · 00:{String(seconds).padStart(2, '0')}
            </div>
          </div>
          <div style={{width: 80, height: 80, borderRadius: 99, background: color.surface3, display: 'grid', placeItems: 'center'}}>
            <PhoneCall size={36} color={color.paper} strokeWidth={1.8} />
          </div>
        </div>

        {/* onda sonora */}
        <div style={{marginTop: L.vertical ? 72 : 56, ...enter(soft(f, 0, 16), 20, 6)}}>
          <Waveform f={f} width={area.w} height={L.vertical ? 260 : 200} />
        </div>

        {/* legenda falada */}
        <div style={{marginTop: L.vertical ? 64 : 48}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, ...eyebrow, color: color.dim, ...enter(soft(f, 4, 14), 10, 4)}}>
            <AudioLines size={26} color={color.dim} strokeWidth={2} />
            {demo.agent}
          </div>
          <div
            style={{
              marginTop: 20,
              fontFamily: font.display,
              fontWeight: 500,
              fontSize: L.vertical ? 60 : 56,
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
              color: color.paper,
              textWrap: 'balance',
            }}
          >
            {WORDS.map((w, i) => {
              const p = soft(f, SPEECH_START + i * WORD_GAP - 2, 12);
              return (
                <React.Fragment key={i}>
                  <span style={{display: 'inline-block', ...enter(p, 14, 8)}}>{w}</span>{' '}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </Stage>
  );
};
