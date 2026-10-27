import type { ImageMetadata } from 'astro';

/** The widths to render an image at, always up to the source's own width: a case image shown at 1000 px on a
 * 2× screen needs about 2000 px, and a list that stopped at 1600 left a 2000 px source looking soft. Widths
 * larger than the source are dropped; the source width itself is the largest. */
export const full = (widths: number[], src: ImageMetadata) =>
  [...new Set([...widths.filter((w) => w < src.width), src.width])].sort((a, b) => a - b);
