import {linearTiming, TransitionSeries} from '@remotion/transitions';
import React from 'react';
import {AbsoluteFill} from 'remotion';
// TRILHA (1/2): descomente este import quando colocar o arquivo em public/audio/
// import {Audio, staticFile} from 'remotion';
import {Grain, Vignette} from './components/Atmosphere';
import {sec} from './lib/anim';
import {useLayout, type Layout} from './lib/layout';
import {SceneClock} from './lib/scene';
import {Closing} from './scenes/Closing';
import {CubeScene, cubeGeometry} from './scenes/CubeScene';
import {NichesScene} from './scenes/Niches';
import {Opening} from './scenes/Opening';
import {AgendaScene} from './scenes/products/Agenda';
import {AtendeScene} from './scenes/products/Atende';
import {FlowScene} from './scenes/products/Flow';
import {PulseScene} from './scenes/products/Pulse';
import {SitesScene} from './scenes/products/Sites';
import {VozScene} from './scenes/products/Voz';
import {color} from './theme';
import {lineWipe, portal, type AnyPresentation} from './transitions';

export type Cut = 'full' | 'short';

type Entry = {
  key: string;
  /** frame do corte (quando a cena fica 100% na tela), sempre num tempo forte */
  cut: number;
  /** transição que termina exatamente no corte */
  transition?: AnyPresentation;
  node: React.ReactNode;
};

const TRANSITION = 12; // 0,4s

export const DURATION = {full: sec(40), short: sec(15)};

const wipe = (L: Layout, direction: 'from-right' | 'from-left' | 'from-bottom') =>
  lineWipe({direction, width: L.W, height: L.H});

// Roteiro de 40s. Cortes nos segundos inteiros = tempos 1 e 3 do compasso a 120 BPM.
const fullPlan = (L: Layout): Entry[] => [
  {key: 'abertura', cut: 0, node: <Opening />},
  {key: 'cubo', cut: sec(7), node: <CubeScene />},
  {
    key: 'sites',
    cut: sec(11),
    transition: portal({...cubeGeometry(L), width: L.W, height: L.H}),
    node: <SitesScene />,
  },
  {key: 'atende', cut: sec(14), transition: wipe(L, 'from-right'), node: <AtendeScene />},
  {key: 'agenda', cut: sec(17), transition: wipe(L, 'from-left'), node: <AgendaScene />},
  {key: 'flow', cut: sec(20), transition: wipe(L, 'from-bottom'), node: <FlowScene />},
  {key: 'pulse', cut: sec(22), transition: wipe(L, 'from-right'), node: <PulseScene />},
  {key: 'voz', cut: sec(25), transition: wipe(L, 'from-left'), node: <VozScene />},
  {key: 'nichos', cut: sec(28), transition: wipe(L, 'from-bottom'), node: <NichesScene />},
  {key: 'fechamento', cut: sec(34), node: <Closing />},
];

// Corte de 15s: cenas 1, 2, Atende, Pulse e 6.
const shortPlan = (L: Layout): Entry[] => [
  {key: 'abertura', cut: 0, node: <Opening short />},
  {key: 'atende', cut: sec(5), node: <AtendeScene />},
  {key: 'pulse', cut: sec(8), transition: wipe(L, 'from-right'), node: <PulseScene />},
  {key: 'fechamento', cut: sec(11), transition: wipe(L, 'from-left'), node: <Closing short />},
];

export const MagnusAd: React.FC<{cut: Cut}> = ({cut}) => {
  const L = useLayout();
  const plan = cut === 'full' ? fullPlan(L) : shortPlan(L);
  const total = DURATION[cut];

  return (
    <AbsoluteFill style={{backgroundColor: color.ink}}>
      <TransitionSeries>
        {plan.map((e, i) => {
          const next = i + 1 < plan.length ? plan[i + 1].cut : total;
          const lead = e.transition ? TRANSITION : 0;
          return (
            <React.Fragment key={e.key}>
              {e.transition ? (
                <TransitionSeries.Transition
                  presentation={e.transition}
                  timing={linearTiming({durationInFrames: TRANSITION})}
                />
              ) : null}
              <TransitionSeries.Sequence durationInFrames={next - e.cut + lead} name={e.key}>
                <SceneClock lead={lead} dur={next - e.cut}>
                  {e.node}
                </SceneClock>
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      <Vignette />
      <Grain />
      {/* TRILHA (2/2): descomente a linha abaixo. Arquivo esperado: public/audio/trilha.mp3 */}
      {/* <Audio src={staticFile('audio/trilha.mp3')} volume={0.9} /> */}
    </AbsoluteFill>
  );
};
