import {useId} from 'react';

/** id seguro para usar em url(#...) dentro de SVG. */
export const useSvgId = (prefix: string) => `${prefix}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
