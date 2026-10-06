import {loadFont as loadSpaceGrotesk} from '@remotion/google-fonts/SpaceGrotesk';
import {loadFont as loadPlex} from '@remotion/google-fonts/IBMPlexSans';

export const displayFont = loadSpaceGrotesk('normal', {
  weights: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'latin-ext'],
}).fontFamily;

export const bodyFont = loadPlex('normal', {
  weights: ['400', '500', '600'],
  subsets: ['latin', 'latin-ext'],
}).fontFamily;
