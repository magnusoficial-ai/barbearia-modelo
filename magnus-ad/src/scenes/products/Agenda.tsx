import {Bell, CalendarCheck, Check, RefreshCw} from 'lucide-react';
import React from 'react';
import {Stage} from '../../components/Atmosphere';
import {products} from '../../content';
import {enter, mix, pop, prog, soft} from '../../lib/anim';
import {useLayout} from '../../lib/layout';
import {useScene} from '../../lib/scene';
import {color, font, radius, shadow, type} from '../../theme';
import {ProductHeader, productRegions, TextColumn} from './ProductHeader';

const demo = products.agenda.demo;

// cada horário começa a ser "digitado" 11 frames depois do anterior
const ROW_START = [2, 13, 24, 35];
const CHARS_PER_FRAME = 1.8;
const RESCHEDULE = 54;
const REMINDER = 64;

const Chip: React.FC<{label: string; strong?: boolean; p: number}> = ({label, strong, p}) => {
  const Icon = strong ? RefreshCw : Check;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px 8px 12px',
        borderRadius: radius.pill,
        boxShadow: `inset 0 0 0 1.5px ${strong ? color.paper : color.lineStrong}`,
        fontFamily: font.body,
        fontWeight: 500,
        fontSize: type.label,
        color: strong ? color.paper : color.soft,
        whiteSpace: 'nowrap',
        opacity: p,
        transform: `scale(${0.85 + 0.15 * p})`,
      }}
    >
      <Icon size={22} color={strong ? color.paper : color.soft} strokeWidth={2} />
      {label}
    </div>
  );
};

const Row: React.FC<{i: number; f: number; compact: boolean}> = ({i, f, compact}) => {
  const slot = demo.slots[i];
  const start = ROW_START[i];
  const typed = Math.max(0, Math.floor((f - start) * CHARS_PER_FRAME));
  const text = slot.text.slice(0, typed);
  const doneAt = start + Math.ceil(slot.text.length / CHARS_PER_FRAME);
  const typing = typed > 0 && typed < slot.text.length;
  const caretOn = typing || (f >= start && f < doneAt + 6 && Math.floor(f / 4) % 2 === 0);
  const rowIn = soft(f, start - 3, 12);

  const hasNewTime = 'newTime' in slot;
  const moved = hasNewTime ? prog(f, RESCHEDULE, 12) : 0;
  const chipLabel = hasNewTime && f >= RESCHEDULE ? slot.status : demo.slots[0].status;
  const chipP = hasNewTime && f >= RESCHEDULE ? pop(f, RESCHEDULE + 2) : soft(f, doneAt + 1, 10);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        height: compact ? 116 : 128,
        borderTop: `1px solid ${color.line}`,
        ...enter(rowIn, 12, 6),
      }}
    >
      <div style={{position: 'relative', width: 128, height: 52, overflow: 'hidden', flexShrink: 0}}>
        {[slot.time, hasNewTime ? (slot as {newTime: string}).newTime : null].map((t, k) =>
          t ? (
            <div
              key={k}
              style={{
                position: 'absolute',
                inset: 0,
                fontFamily: font.display,
                fontWeight: 500,
                fontSize: 44,
                lineHeight: '52px',
                letterSpacing: '-0.02em',
                color: hasNewTime && k === 0 ? color.dim : color.paper,
                fontVariantNumeric: 'tabular-nums',
                transform: `translateY(${(k === 0 ? -moved : 1 - moved) * 52}px)`,
                opacity: k === 0 ? 1 - moved : moved,
              }}
            >
              {t}
            </div>
          ) : null,
        )}
      </div>
      <div style={{flex: 1, fontFamily: font.body, fontSize: type.body, color: color.paper, whiteSpace: 'nowrap'}}>
        {text}
        <span style={{display: 'inline-block', width: 3, height: 34, marginLeft: 4, background: color.paper, verticalAlign: 'middle', opacity: caretOn ? 1 : 0}} />
      </div>
      {f >= doneAt ? <Chip label={chipLabel} strong={hasNewTime && f >= RESCHEDULE} p={chipP} /> : null}
    </div>
  );
};

export const AgendaScene: React.FC = () => {
  const {f} = useScene();
  const L = useLayout();
  const R = productRegions(L, 'right');
  const card = L.vertical
    ? {x: L.padX, y: 616, w: L.W - L.padX * 2}
    : {x: R.stage.x + 20, y: 170, w: 900};
  const cardIn = soft(f, -10, 22);
  const reminderP = pop(f, REMINDER);

  return (
    <Stage>
      <TextColumn L={L} side="right">
        <ProductHeader k="agenda" L={L} />
      </TextColumn>
      <div
        style={{
          position: 'absolute',
          left: card.x,
          top: card.y,
          width: card.w,
          borderRadius: radius.xl,
          background: color.surface,
          boxShadow: `inset 0 0 0 1px ${color.line}, ${shadow.float}`,
          padding: '36px 40px 24px',
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 60}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24}}>
          <div style={{width: 64, height: 64, borderRadius: radius.md, background: color.surface3, display: 'grid', placeItems: 'center'}}>
            <CalendarCheck size={34} color={color.paper} strokeWidth={1.75} />
          </div>
          <div>
            <div style={{fontFamily: font.display, fontWeight: 600, fontSize: 36, color: color.paper, letterSpacing: '-0.02em'}}>
              {demo.business}
            </div>
            <div style={{fontFamily: font.body, fontSize: type.label, color: color.dim}}>{demo.day}</div>
          </div>
        </div>
        {demo.slots.map((_, i) => (
          <Row key={i} i={i} f={f} compact={!L.vertical} />
        ))}
      </div>

      {/* lembrete da véspera */}
      <div
        style={{
          position: 'absolute',
          left: L.vertical ? card.x + 72 : card.x - 60,
          top: L.vertical ? 1330 : 800,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '20px 32px 20px 20px',
          borderRadius: radius.xl,
          background: color.paper,
          color: color.ink,
          boxShadow: shadow.float,
          opacity: Math.min(1, reminderP * 3),
          transform: `translateY(${mix(40, 0, reminderP)}px) scale(${0.9 + 0.1 * reminderP})`,
          transformOrigin: 'left center',
        }}
      >
        <div style={{width: 64, height: 64, borderRadius: radius.pill, background: color.ink, display: 'grid', placeItems: 'center'}}>
          <Bell size={30} color={color.paper} strokeWidth={2} />
        </div>
        <div>
          <div style={{fontFamily: font.display, fontWeight: 600, fontSize: 30, letterSpacing: '-0.01em'}}>{demo.reminderTitle}</div>
          <div style={{fontFamily: font.body, fontSize: type.small, color: '#3A3A3A'}}>{demo.reminderText}</div>
        </div>
      </div>
    </Stage>
  );
};
