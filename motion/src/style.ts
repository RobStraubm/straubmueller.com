// House style for every project film: the site's paper, ink and one red, its three typefaces,
// lines that draw themselves, and hard steps instead of springs. Each film ends on the result and holds.
import { continueRender, delayRender, Easing, interpolate, staticFile } from 'remotion';

export const SIZE = { width: 800, height: 1000 };
export const FPS = 30;

/** The poster films leave out the outer margin and the label row: the frame on the site is small, so the
 * drawing fills it. Same 4:5 shape as SIZE, scaled up by 800/720. */
export const POSTER_VIEW = '40 80 720 900';

export type Theme = 'light' | 'dark';

/** Same values as the site tokens; the ground is the site's --soft, the colour of the preview frame. */
export const palettes = {
  light: { ground: '#e4e6e1', ink: '#121413', mute: '#5d615c', hair: '#c7cac3', signal: '#e5361b' },
  dark: { ground: '#1b1e1c', ink: '#e7e8e3', mute: '#9a9e97', hair: '#3a3f3b', signal: '#ff6a4d' },
};

export type Palette = (typeof palettes)['light'];

export const fonts = {
  display: 'Noto Serif Display',
  sans: 'Schibsted Grotesk',
  mono: 'Fragment Mono',
};

const faces = [
  new FontFace(fonts.display, `url(${staticFile('fonts/noto-serif-display-latin-wdth-normal.woff2')})`, {
    weight: '100 900',
    stretch: '62.5% 100%',
  }),
  new FontFace(fonts.sans, `url(${staticFile('fonts/schibsted-grotesk-latin-wght-normal.woff2')})`, {
    weight: '400 900',
  }),
  new FontFace(fonts.mono, `url(${staticFile('fonts/fragment-mono-latin-400-normal.woff2')})`),
];

const waitForFonts = delayRender('Loading the site fonts');
Promise.all(faces.map((face) => face.load())).then((loaded) => {
  loaded.forEach((face) => document.fonts.add(face));
  continueRender(waitForFonts);
});

/** 0 to 1 between two frames, eased out and clamped. */
export const progress = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

/** Snap a 0..1 value to hard steps, for things that should click into place. */
export const stepped = (value: number, steps: number) => Math.floor(value * steps) / steps;
