export { default as MapWrapper } from './MapWrapper';
export { default as MapPreview } from './MapPreviewWrapper';
export { default as MapPreviewWrapper } from './MapPreviewWrapper';

import dynamic from 'next/dynamic';

export const StationMap = dynamic(
  () => import('./StationMap').then(mod => ({ default: mod.default })),
  { ssr: false }
);
