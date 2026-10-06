import {CalendarCheck} from 'lucide-react';
import React from 'react';
import {Badge} from '../../components/Badge';
import {BrowserBar, Laptop, laptopMetrics, Phone, phoneMetrics} from '../../components/Devices';
import {Stage} from '../../components/Atmosphere';
import {products} from '../../content';
import {enter, pop, soft} from '../../lib/anim';
import {useLayout} from '../../lib/layout';
import {useScene} from '../../lib/scene';
import {color, font} from '../../theme';
import {ProductHeader, productRegions, TextColumn} from './ProductHeader';

const demo = products.sites.demo;

// o site se monta bloco a bloco, um bloco a cada meio tempo
const BLOCKS = [0, 7, 14, 21, 28, 35];

const Block: React.FC<{p: number; u: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({
  p,
  u,
  style,
  children,
}) => <div style={{position: 'absolute', ...enter(p, 3 * u, 0.8 * u), ...style}}>{children}</div>;

/** Ilustração de prédio, só com formas cinza. */
const Building: React.FC<{w: number; h: number}> = ({w, h}) => {
  const cols = 4;
  const rows = 6;
  const bw = w * 0.36;
  const bh = h * 0.78;
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        borderRadius: w * 0.04,
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #2A2A2A 0%, #181818 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: w * 0.16,
          bottom: 0,
          width: bw,
          height: bh,
          background: '#202020',
          boxShadow: `inset 0 0 0 1px ${color.lineStrong}`,
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: w * 0.018,
          padding: w * 0.03,
        }}
      >
        {Array.from({length: cols * rows}).map((_, i) => (
          <div key={i} style={{background: [3, 6, 13, 18, 20].includes(i) ? '#BDBDBD' : '#2E2E2E', borderRadius: 1}} />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: w * 0.56,
          bottom: 0,
          width: w * 0.28,
          height: bh * 0.62,
          background: '#1C1C1C',
          boxShadow: `inset 0 0 0 1px ${color.line}`,
        }}
      />
    </div>
  );
};

const SiteDesktop: React.FC<{width: number; f: number}> = ({width, f}) => {
  const u = width / 100;
  const b = BLOCKS.map((t) => soft(f, t, 14));
  return (
    <div style={{position: 'relative', width: '100%', height: '100%', fontFamily: font.body}}>
      <BrowserBar width={width} url={demo.url} />
      <Block p={b[0]} u={u} style={{left: 5 * u, right: 5 * u, top: 6.6 * u, height: 4 * u, display: 'flex', alignItems: 'center', gap: 3 * u}}>
        <span style={{fontFamily: font.display, fontWeight: 700, fontSize: 2 * u, color: color.paper, letterSpacing: '-0.02em'}}>
          {demo.business}
        </span>
        <div style={{flex: 1}} />
        {demo.nav.map((n) => (
          <span key={n} style={{fontSize: 1.45 * u, color: color.dim}}>
            {n}
          </span>
        ))}
        <span
          style={{
            fontSize: 1.35 * u,
            fontWeight: 600,
            color: color.ink,
            background: color.paper,
            borderRadius: 99,
            padding: `${0.7 * u}px ${1.6 * u}px`,
          }}
        >
          {demo.heroCta}
        </span>
      </Block>
      <Block p={b[1]} u={u} style={{left: 5 * u, top: 17 * u, width: 44 * u}}>
        <div style={{fontFamily: font.display, fontWeight: 600, fontSize: 4.6 * u, lineHeight: 1.04, letterSpacing: '-0.035em', color: color.paper}}>
          {demo.heroTitle}
        </div>
      </Block>
      <Block p={b[2]} u={u} style={{left: 5 * u, top: 30.5 * u, width: 40 * u}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 1 * u}}>
          <div style={{width: '92%', height: 1.1 * u, borderRadius: 99, background: color.surface3}} />
          <div style={{width: '70%', height: 1.1 * u, borderRadius: 99, background: color.surface3}} />
        </div>
        <div
          style={{
            marginTop: 2.6 * u,
            display: 'inline-block',
            fontSize: 1.5 * u,
            fontWeight: 600,
            color: color.ink,
            background: color.paper,
            borderRadius: 99,
            padding: `${1 * u}px ${2.4 * u}px`,
          }}
        >
          {demo.heroCta}
        </div>
      </Block>
      <Block p={b[3]} u={u} style={{left: 53 * u, top: 15 * u}}>
        <Building w={42 * u} h={27 * u} />
      </Block>
      {demo.cards.map((c, i) => (
        <Block key={c} p={b[Math.min(4 + Math.floor(i / 2), 5)]} u={u} style={{left: (5 + i * 30.7) * u, top: 46 * u, width: 28.6 * u}}>
          <div style={{height: 7 * u, borderRadius: 0.8 * u, background: `linear-gradient(160deg, #262626, #181818)`, boxShadow: `inset 0 0 0 1px ${color.line}`}} />
          <div style={{marginTop: 1 * u, fontSize: 1.45 * u, color: color.soft}}>{c}</div>
        </Block>
      ))}
    </div>
  );
};

const SiteMobile: React.FC<{width: number; top: number; f: number}> = ({width, top, f}) => {
  const u = width / 100;
  const b = BLOCKS.map((t) => soft(f, t + 4, 14));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top, bottom: 0, fontFamily: font.body}}>
      <Block p={b[0]} u={u} style={{left: 7 * u, right: 7 * u, top: 3 * u, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <span style={{fontFamily: font.display, fontWeight: 700, fontSize: 6.4 * u, color: color.paper}}>{demo.business}</span>
        <div style={{display: 'flex', flexDirection: 'column', gap: 1.4 * u}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 6 * u, height: 0.8 * u, background: color.soft, borderRadius: 2}} />
          ))}
        </div>
      </Block>
      <Block p={b[1]} u={u} style={{left: 7 * u, right: 7 * u, top: 16 * u}}>
        <div style={{fontFamily: font.display, fontWeight: 600, fontSize: 10 * u, lineHeight: 1.05, letterSpacing: '-0.03em', color: color.paper}}>
          {demo.heroTitle}
        </div>
      </Block>
      <Block p={b[2]} u={u} style={{left: 7 * u, top: 57 * u}}>
        <div style={{fontSize: 4.6 * u, fontWeight: 600, color: color.ink, background: color.paper, borderRadius: 99, padding: `${2.4 * u}px ${5 * u}px`}}>
          {demo.heroCta}
        </div>
      </Block>
      <Block p={b[3]} u={u} style={{left: 7 * u, top: 74 * u}}>
        <Building w={86 * u} h={52 * u} />
      </Block>
      <Block p={b[4]} u={u} style={{left: 7 * u, right: 7 * u, top: 132 * u}}>
        <div style={{fontSize: 4.4 * u, color: color.soft}}>{demo.cards[0]}</div>
      </Block>
    </div>
  );
};

export const SitesScene: React.FC = () => {
  const {f} = useScene();
  const L = useLayout();
  const R = productRegions(L, 'right');
  const laptopW = L.vertical ? 900 : 860;
  const lm = laptopMetrics(laptopW);
  const laptop = L.vertical ? {x: (L.W - laptopW) / 2 - 24, y: 648} : {x: R.stage.x + 10, y: 210};
  const phoneW = L.vertical ? 240 : 232;
  const pm = phoneMetrics(phoneW);
  const phone = L.vertical ? {x: L.W - L.padX - phoneW + 40, y: 990} : {x: R.stage.x + R.stage.w - phoneW + 10, y: 490};

  const devIn = soft(f, -10, 22);
  const phoneIn = soft(f, 2, 20);
  const badgeP = pop(f, 45);

  const badge = <Badge text={products.sites.badge} icon={CalendarCheck} p={badgeP} />;

  return (
    <Stage>
      <TextColumn L={L} side="right">
        <ProductHeader k="sites" L={L}>
          {!L.vertical ? <div style={{marginTop: 56}}>{badge}</div> : null}
        </ProductHeader>
      </TextColumn>
      <div
        style={{
          position: 'absolute',
          left: laptop.x,
          top: laptop.y,
          opacity: devIn,
          transform: `translateY(${(1 - devIn) * 60}px) scale(${0.96 + 0.04 * devIn})`,
        }}
      >
        <Laptop width={laptopW}>
          <SiteDesktop width={lm.innerW} f={f} />
        </Laptop>
      </div>
      <div
        style={{
          position: 'absolute',
          left: phone.x,
          top: phone.y,
          opacity: phoneIn,
          transform: `translateY(${(1 - phoneIn) * 80}px)`,
        }}
      >
        <Phone width={phoneW}>
          <SiteMobile width={pm.screenW} top={pm.statusH} f={f} />
        </Phone>
      </div>
      {L.vertical ? <div style={{position: 'absolute', left: L.padX, top: 1316}}>{badge}</div> : null}
    </Stage>
  );
};
