import React, {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';

type SceneInfo = {lead: number; dur: number};

const SceneContext = createContext<SceneInfo>({lead: 0, dur: 0});

/**
 * Cada cena começa um pouco antes do corte por causa da transição de entrada.
 * `lead` é esse adiantamento: dentro da cena, f = 0 é o frame exato do corte.
 */
export const SceneClock: React.FC<SceneInfo & {children: React.ReactNode}> = ({
  lead,
  dur,
  children,
}) => <SceneContext.Provider value={{lead, dur}}>{children}</SceneContext.Provider>;

export const useScene = () => {
  const frame = useCurrentFrame();
  const {lead, dur} = useContext(SceneContext);
  return {f: frame - lead, dur};
};
