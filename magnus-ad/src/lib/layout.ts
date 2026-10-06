import {useVideoConfig} from 'remotion';

export type Layout = ReturnType<typeof useLayout>;

/**
 * Mesmo código para 1080x1920 e 1920x1080: as cenas leem daqui se estão no vertical.
 * No vertical, as margens de cima e de baixo protegem a área coberta pela interface
 * do Reels/TikTok (perfil, legenda e botões).
 */
export const useLayout = () => {
  const {width, height} = useVideoConfig();
  const vertical = height > width;
  return {
    W: width,
    H: height,
    vertical,
    padX: vertical ? 96 : 120,
    safeTop: vertical ? 240 : 96,
    safeBottom: vertical ? 420 : 96,
  };
};
