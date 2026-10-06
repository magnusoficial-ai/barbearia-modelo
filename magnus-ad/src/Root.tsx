import React from 'react';
import {Composition} from 'remotion';
import {DURATION, MagnusAd} from './MagnusAd';

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
    {/* Reels, TikTok, Status */}
    <Composition
      id="MagnusAd-Vertical"
      component={MagnusAd}
      durationInFrames={DURATION.full}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{cut: 'full' as const}}
    />
    {/* YouTube, site */}
    <Composition
      id="MagnusAd-Horizontal"
      component={MagnusAd}
      durationInFrames={DURATION.full}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{cut: 'full' as const}}
    />
    {/* corte curto: cenas 1, 2, Atende + Pulse e 6 */}
    <Composition
      id="MagnusAd-15s"
      component={MagnusAd}
      durationInFrames={DURATION.short}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{cut: 'short' as const}}
    />
  </>
);
