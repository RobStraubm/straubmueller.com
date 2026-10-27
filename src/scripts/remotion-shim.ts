// The few Remotion functions the films in motion/src use, for drawing them live in the browser (version J).
// astro.config.mjs points the import 'remotion' here, so a scene that the case page drives from the scroll
// position is the same code that motion/render.mjs renders to video. The frame comes from FrameContext.
import { createContext, createElement, type ComponentChildren } from 'preact';
import { useContext } from 'preact/hooks';
import displayFont from '@fontsource-variable/noto-serif-display/files/noto-serif-display-latin-wdth-normal.woff2?url';
import sansFont from '@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2?url';
import monoFont from '@fontsource/fragment-mono/files/fragment-mono-latin-400-normal.woff2?url';

export const FrameContext = createContext({ frame: 0, width: 800, height: 1000 });

export const useCurrentFrame = () => useContext(FrameContext).frame;

export const useVideoConfig = () => {
  const { width, height } = useContext(FrameContext);
  return { width, height, fps: 30, durationInFrames: Infinity, id: 'stage' };
};

export const AbsoluteFill = ({ style, children }: { style?: Record<string, string | number>; children?: ComponentChildren }) =>
  createElement('div', { style: { position: 'absolute', inset: 0, ...style } }, children);

/** motion/src/style.ts loads the site fonts by file name; on the site the same files come from Fontsource,
 * so the browser fetches each font once. */
const files: Record<string, string> = {
  'fonts/noto-serif-display-latin-wdth-normal.woff2': displayFont,
  'fonts/schibsted-grotesk-latin-wght-normal.woff2': sansFont,
  'fonts/fragment-mono-latin-400-normal.woff2': monoFont,
};
export const staticFile = (path: string) => files[path] ?? `/${path}`;

export const delayRender = (_label?: string) => 0;
export const continueRender = (_handle: number) => {};

type Ease = (t: number) => number;

const bezier = (x1: number, y1: number, x2: number, y2: number): Ease => {
  const at = (a: number, b: number, t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (x) => {
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (at(x1, x2, mid) < x) lo = mid;
      else hi = mid;
    }
    return at(y1, y2, (lo + hi) / 2);
  };
};

export const Easing = {
  linear: (t: number) => t,
  quad: (t: number) => t * t,
  cubic: (t: number) => t * t * t,
  bezier,
  in: (ease: Ease) => ease,
  out: (ease: Ease) => (t: number) => 1 - ease(1 - t),
  inOut: (ease: Ease) => (t: number) => (t < 0.5 ? ease(t * 2) / 2 : 1 - ease((1 - t) * 2) / 2),
};

type Extrapolate = 'clamp' | 'extend' | 'identity';

/** Piecewise linear mapping with optional easing per segment, like Remotion's interpolate. */
export const interpolate = (
  input: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
  options: { easing?: Ease; extrapolateLeft?: Extrapolate; extrapolateRight?: Extrapolate } = {},
) => {
  const { easing = Easing.linear, extrapolateLeft = 'extend', extrapolateRight = 'extend' } = options;
  const last = inputRange.length - 1;
  if (input < inputRange[0] && extrapolateLeft === 'clamp') return outputRange[0];
  if (input > inputRange[last] && extrapolateRight === 'clamp') return outputRange[last];
  let i = 1;
  while (i < last && input > inputRange[i]) i++;
  const [a, b] = [inputRange[i - 1], inputRange[i]];
  const t = b === a ? 0 : (input - a) / (b - a);
  const eased = t >= 0 && t <= 1 ? easing(t) : t;
  return outputRange[i - 1] + (outputRange[i] - outputRange[i - 1]) * eased;
};

// Only used by motion/src/Root.tsx, which the site never loads.
export const Composition = () => null;
export const Still = () => null;
export const registerRoot = () => {};
