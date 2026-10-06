import {CheckCheck, ChevronLeft, Clock3, Mic} from 'lucide-react';
import React from 'react';
import {Badge} from '../../components/Badge';
import {Phone, phoneMetrics} from '../../components/Devices';
import {Stage} from '../../components/Atmosphere';
import {products} from '../../content';
import {clamp01, enter, pop, soft} from '../../lib/anim';
import {useLayout} from '../../lib/layout';
import {useScene} from '../../lib/scene';
import {color, font} from '../../theme';
import {ProductHeader, productRegions, TextColumn} from './ProductHeader';

const demo = products.atende.demo;

// quando cada mensagem aparece (frames a partir do corte)
const T = {msg: [4, 28, 46], typing: [12, 28], confirm: 58, badge: 62};

const Bubble: React.FC<{
  side: 'left' | 'right';
  p: number;
  u: number;
  children: React.ReactNode;
}> = ({side, p, u, children}) => {
  const mine = side === 'right';
  return (
    <div
      style={{
        alignSelf: mine ? 'flex-end' : 'flex-start',
        maxWidth: '82%',
        padding: `${2.6 * u}px ${3.8 * u}px ${2.2 * u}px`,
        borderRadius: `${5 * u}px ${5 * u}px ${mine ? 1.2 * u : 5 * u}px ${mine ? 5 * u : 1.2 * u}px`,
        background: mine ? color.paper : color.surface3,
        color: mine ? color.ink : color.paper,
        fontFamily: font.body,
        fontSize: 5.6 * u,
        lineHeight: 1.3,
        opacity: p,
        transform: `translateY(${(1 - p) * 4 * u}px) scale(${0.94 + 0.06 * p})`,
        transformOrigin: mine ? 'bottom right' : 'bottom left',
        filter: p < 0.999 ? `blur(${(1 - p) * 6}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

const Time: React.FC<{u: number; dark?: boolean}> = ({u, dark}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.8 * u,
      marginLeft: 2 * u,
      fontSize: 3.6 * u,
      color: dark ? '#5A5A5A' : color.dim,
      verticalAlign: 'baseline',
      whiteSpace: 'nowrap',
    }}
  >
    {demo.time}
    {dark ? <CheckCheck size={4.2 * u} color="#5A5A5A" strokeWidth={2} /> : null}
  </span>
);

const Chat: React.FC<{width: number; top: number; f: number}> = ({width, top, f}) => {
  const u = width / 100;
  const typingOn = f >= T.typing[0] && f < T.typing[1];
  const typingP = soft(f, T.typing[0], 8);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, bottom: 0, display: 'flex', flexDirection: 'column'}}>
      {/* cabeçalho da conversa */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 3 * u,
          padding: `${2 * u}px ${4 * u}px ${3 * u}px ${2 * u}px`,
          borderBottom: `1px solid ${color.line}`,
        }}
      >
        <ChevronLeft size={7 * u} color={color.soft} strokeWidth={2} />
        <div
          style={{
            width: 11 * u,
            height: 11 * u,
            borderRadius: 99,
            background: color.surface3,
            display: 'grid',
            placeItems: 'center',
            fontFamily: font.display,
            fontWeight: 600,
            fontSize: 4.2 * u,
            color: color.paper,
          }}
        >
          {demo.initials}
        </div>
        <div>
          <div style={{fontFamily: font.body, fontWeight: 600, fontSize: 5 * u, color: color.paper}}>{demo.business}</div>
          <div style={{fontFamily: font.body, fontSize: 3.8 * u, color: color.dim}}>{demo.status}</div>
        </div>
      </div>

      {/* mensagens */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2.6 * u, padding: `${5 * u}px ${4 * u}px`}}>
        <div
          style={{
            alignSelf: 'center',
            fontFamily: font.body,
            fontSize: 3.6 * u,
            color: color.dim,
            background: color.surface2,
            borderRadius: 99,
            padding: `${1 * u}px ${3 * u}px`,
            marginBottom: 2 * u,
          }}
        >
          Hoje
        </div>
        {f >= T.msg[0] ? (
          <Bubble side="left" p={soft(f, T.msg[0], 12)} u={u}>
            {demo.messages[0].text}
            <Time u={u} />
          </Bubble>
        ) : null}
        {typingOn ? (
          <div
            style={{
              alignSelf: 'flex-end',
              display: 'flex',
              gap: 1.4 * u,
              padding: `${3.4 * u}px ${4.4 * u}px`,
              borderRadius: 99,
              background: color.surface2,
              opacity: typingP,
            }}
          >
            {[0, 1, 2].map((i) => {
              const wave = 0.35 + 0.65 * clamp01(Math.sin(((f - T.typing[0]) / 10) * Math.PI * 2 - i * 0.9));
              return <div key={i} style={{width: 1.8 * u, height: 1.8 * u, borderRadius: 99, background: color.soft, opacity: wave}} />;
            })}
          </div>
        ) : null}
        {f >= T.msg[1] ? (
          <Bubble side="right" p={soft(f, T.msg[1], 12)} u={u}>
            <div style={{fontSize: 3.4 * u, fontWeight: 600, letterSpacing: '0.04em', color: '#5A5A5A', marginBottom: 0.6 * u}}>
              {demo.aiLabel.toUpperCase()}
            </div>
            {demo.messages[1].text}
            <Time u={u} dark />
          </Bubble>
        ) : null}
        {f >= T.msg[2] ? (
          <Bubble side="left" p={soft(f, T.msg[2], 12)} u={u}>
            {demo.messages[2].text}
            <Time u={u} />
          </Bubble>
        ) : null}
        {f >= T.confirm ? (
          <div
            style={{
              alignSelf: 'center',
              marginTop: 2 * u,
              display: 'flex',
              alignItems: 'center',
              gap: 2 * u,
              padding: `${2.2 * u}px ${4 * u}px`,
              borderRadius: 99,
              boxShadow: `inset 0 0 0 1.5px ${color.lineStrong}`,
              fontFamily: font.body,
              fontWeight: 600,
              fontSize: 4.4 * u,
              color: color.paper,
              opacity: soft(f, T.confirm, 10),
              transform: `scale(${0.9 + 0.1 * pop(f, T.confirm)})`,
            }}
          >
            <CheckCheck size={5.4 * u} color={color.paper} strokeWidth={2} />
            {demo.confirmation}
          </div>
        ) : null}
      </div>

      {/* barra de digitação */}
      <div style={{display: 'flex', alignItems: 'center', gap: 3 * u, padding: `${3 * u}px ${4 * u}px ${7 * u}px`}}>
        <div
          style={{
            flex: 1,
            height: 10 * u,
            borderRadius: 99,
            background: color.surface2,
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${4 * u}px`,
            fontFamily: font.body,
            fontSize: 4 * u,
            color: color.dim,
          }}
        >
          Mensagem
        </div>
        <div style={{width: 10 * u, height: 10 * u, borderRadius: 99, background: color.surface3, display: 'grid', placeItems: 'center'}}>
          <Mic size={5 * u} color={color.soft} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};

export const AtendeScene: React.FC = () => {
  const {f} = useScene();
  const L = useLayout();
  const R = productRegions(L, 'left');
  const phoneW = L.vertical ? 448 : 420;
  const pm = phoneMetrics(phoneW);
  const phone = L.vertical
    ? {x: L.W - L.padX - phoneW + 24, y: 596}
    : {x: R.stage.x + (R.stage.w - phoneW) / 2, y: (L.H - pm.height) / 2};
  const phoneIn = soft(f, -10, 22);
  const badge = <Badge text={products.atende.badge} icon={Clock3} p={pop(f, T.badge)} />;

  return (
    <Stage>
      <TextColumn L={L} side="left">
        <ProductHeader k="atende" L={L}>
          {!L.vertical ? <div style={{marginTop: 56}}>{badge}</div> : null}
        </ProductHeader>
      </TextColumn>
      <div
        style={{
          position: 'absolute',
          left: phone.x,
          top: phone.y,
          opacity: phoneIn,
          transform: `translateY(${(1 - phoneIn) * 80}px)`,
        }}
      >
        <Phone width={phoneW} time={demo.time}>
          <Chat width={pm.screenW} top={pm.statusH} f={f} />
        </Phone>
      </div>
      {L.vertical ? (
        <div style={{position: 'absolute', left: L.padX, top: 660}}>
          {/* responde o 23:47 da abertura: agora alguém atende de madrugada */}
          <div
            style={{
              fontFamily: font.display,
              fontWeight: 300,
              fontSize: 132,
              lineHeight: 1,
              letterSpacing: '-0.045em',
              color: color.dim,
              fontVariantNumeric: 'tabular-nums',
              ...enter(soft(f, 0, 18), 16, 10),
            }}
          >
            {demo.time}
          </div>
          <div style={{marginTop: 420}}>{badge}</div>
        </div>
      ) : null}
    </Stage>
  );
};
