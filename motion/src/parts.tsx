// Pieces every film shares in the poster style (version F): a row of small labels and one giant word
// per act that rises out of a mask, the way the reference sites set their headlines.
import { fonts, progress, type Palette } from './style';

/** `to` is Infinity for the last act: its word stays, like the result it names. */
export type Act = { word: string; from: number; to: number };

/** The row of small labels (project name, act counter) is switched off since 26 Oct 2026: on the site a bar
 * of three steps under the film does this job, and the row cost room in a small frame. The films still pass
 * their props, so the row can come back in one place. */
export const Labels = (_props: { frame: number; project: string; acts: Act[]; palette: Palette; until?: number }) => null;

/** The word of the current act, set huge, entering from below and leaving upwards.
 * The size fits the longest word of the film, so every act of one film uses the same size. */
export const ActWord = ({
  frame,
  acts,
  palette,
  y = 214,
  size = 150,
}: {
  frame: number;
  acts: Act[];
  palette: Palette;
  y?: number;
  size?: number;
}) => {
  const longest = Math.max(...acts.map((act) => act.word.length));
  size = Math.min(size, Math.floor(690 / (0.68 * longest)));
  return (
  <g>
    <defs>
      <clipPath id="act-word-mask">
        <rect x={0} y={y - size * 0.82} width={800} height={size * 0.98} />
      </clipPath>
    </defs>
    <g clipPath="url(#act-word-mask)">
      {/* Repaint the whole band every frame: as a word moves, Chrome leaves a 1 px trail where a glyph
          reaches past the text box (the bar of a final T), and a band that changes each frame clears it. */}
      <rect
        x={0}
        y={y - size * 0.82}
        width={800}
        height={size * 0.98}
        fill={palette.ground}
        fillOpacity={frame % 2 ? 1 : 0.999}
      />
      {acts.map((act) => {
        const enter = progress(frame, act.from, act.from + 12);
        const leave = Number.isFinite(act.to) ? progress(frame, act.to - 8, act.to) : 0;
        if (frame < act.from || frame > act.to) return null;
        const shift = (1 - enter) * size - leave * size;
        return (
          <text
            key={act.word}
            x={56}
            y={y + shift}
            fontSize={size}
            style={{ fontFamily: fonts.sans, fontWeight: 800, letterSpacing: -size * 0.045, fill: palette.ink }}
          >
            {act.word}
          </text>
        );
      })}
    </g>
  </g>
  );
};
