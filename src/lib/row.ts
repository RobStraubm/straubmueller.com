import type { ImageMetadata } from 'astro';

/** Columns for a row of figures in proportion to their images' aspect ratios, so every image in the row stands
 * at the same height and none is cropped. Set as `--row` on a .c-pair, .c-split or .c-trio (CaseLayout). */
export const row = (...images: ImageMetadata[]) =>
  `--row: ${images.map((image) => `${(image.width / image.height).toFixed(3)}fr`).join(' ')}`;
