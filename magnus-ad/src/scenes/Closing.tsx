import {ArrowRight} from 'lucide-react';
import React from 'react';
import {Wordmark} from '../brand/Logo';
import {polyline, Trace} from '../components/Circuit';
import {Stage} from '../components/Atmosphere';
import {brand} from '../content';
import {BEAT, EASE_IN_OUT, EASE_OUT, enter, mix, prog, soft} from '../lib/anim';
import {useLayout} from '../lib/layout';
import {useScene} from '../lib/scene';
import {color, font, radius, type} from '../theme';

// CENA 6. No corte de 15s tudo acontece mais rápido.
const FULL = {wipe: 14, words: 2 * BEAT, stagger: BEAT, button: 8 * BEAT, handle: 9 * BEAT};
const SHORT = {wipe: 12, words: 10, stagger: 8, button: 75, handle: 83};

export const Closing: React.FC<{short?: boolean}> = ({short = false}) => {
  const {f} = useScene();
  const L = useLayout();
  const T = short ? SHORT : FULL;

  const logoW = L.vertical ? 760 : 880;
  const logoY = L.vertical ? 640 : 250;
  const logoX = (L.W - logoW) / 2;
  const wipe = prog(f, 0, T.wipe, EASE_IN_OUT);
  const settle = prog(f, 0, 36, EASE_OUT);

  const words = brand.slogan.split(' ');
  const sloganY = L.vertical ? 840 : 440;
  const buttonY = L.vertical ? 1130 : 620;
  const handleY = L.vertical ? 1270 : 770;

  const btnIn = soft(f, T.button, 16);
  const fill = prog(f, T.button + 6, 14, EASE_IN_OUT);
  const btnW = 560;
  const btnH = 104;
  const btnX = (L.W - btnW) / 2;
  const lineP = prog(f, T.button, 22, EASE_IN_OUT);
  const lineY = buttonY + btnH / 2;

  const Button: React.FC<{filled: boolean}> = ({filled}) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: radius.pill,
        background: filled ? color.paper : 'transparent',
        boxShadow: filled ? undefined : `inset 0 0 0 2px ${color.paper}`,
        color: filled ? color.ink : color.paper,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        fontFamily: font.display,
        fontWeight: 600,
        fontSize: 38,
        letterSpacing: '-0.01em',
        clipPath: filled ? `inset(0 ${(1 - fill) * 100}% 0 0 round ${btnH / 2}px)` : undefined,
      }}
    >
      {brand.cta}
      <ArrowRight size={36} color={filled ? color.ink : color.paper} strokeWidth={2.2} />
    </div>
  );

  return (
    <Stage>
      {/* logo revelado por uma linha */}
      <div
        style={{
          position: 'absolute',
          left: logoX,
          top: logoY,
          transform: `scale(${mix(1.04, 1, settle)})`,
          clipPath: `inset(-20px ${(1 - wipe) * 100}% -20px -20px)`,
        }}
      >
        <Wordmark width={logoW} />
      </div>
      {wipe > 0 && wipe < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: logoX + logoW * wipe - 1,
            top: logoY - 60,
            width: 2,
            height: logoW * 0.127 + 120,
            background: color.paper,
          }}
        />
      ) : null}

      {/* slogan palavra por palavra */}
      <div
        style={{
          position: 'absolute',
          left: L.padX,
          right: L.padX,
          top: sloganY,
          textAlign: 'center',
          fontFamily: font.display,
          fontSize: L.vertical ? 76 : 72,
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          color: color.paper,
        }}
      >
        {words.map((w, i) => {
          const p = soft(f, T.words + i * T.stagger, 16);
          const strong = i >= 4;
          return (
            <React.Fragment key={i}>
              {L.vertical && i === 4 ? <br /> : null}
              <span
                style={{
                  display: 'inline-block',
                  fontWeight: strong ? 600 : 400,
                  color: strong ? color.paper : color.soft,
                  ...enter(p, 18, 10),
                }}
              >
                {w}
              </span>{' '}
            </React.Fragment>
          );
        })}
      </div>

      {/* trilhas ligando o botão às bordas */}
      <svg width={L.W} height={L.H} style={{position: 'absolute', inset: 0}}>
        <Trace
          d={polyline([
            [btnX - 24, lineY],
            [btnX - 120, lineY],
            [btnX - 180, lineY - 60],
            [-20, lineY - 60],
          ])}
          head={lineP}
          stroke={color.lineStrong}
          width={2}
          nodes={[0]}
        />
        <Trace
          d={polyline([
            [btnX + btnW + 24, lineY],
            [btnX + btnW + 120, lineY],
            [btnX + btnW + 180, lineY + 60],
            [L.W + 20, lineY + 60],
          ])}
          head={lineP}
          stroke={color.lineStrong}
          width={2}
          nodes={[0]}
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: btnX,
          top: buttonY,
          width: btnW,
          height: btnH,
          ...enter(btnIn, 20, 8),
        }}
      >
        <Button filled={false} />
        <Button filled />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: handleY,
          textAlign: 'center',
          fontFamily: font.body,
          fontWeight: 500,
          fontSize: type.lead,
          color: color.soft,
          letterSpacing: '0.01em',
          ...enter(soft(f, T.handle, 16), 14, 6),
        }}
      >
        {brand.handle}
      </div>
    </Stage>
  );
};
