// SayFit, how we tested it: the June prompts, shorter and stricter (version J). Drawn as the reader scrolls
// past it: the old prompt of each LLM step as a bar of its length in words, then the bar runs back to the new
// length and leaves the old one as a trace, then what took the place of the prose. Words and numbers are the
// case text's (from the capstone 2 deck); the stage at the top already shows the search and the 12 → 71 %.
import type { Palette } from '../../../motion/src/style';
import { fonts } from '../../../motion/src/style';
import { mix } from '../../../motion/src/tealucent/Tealucent';

/** Prompt length in words, old and new, per LLM step. */
const PROMPTS = [
  { name: 'EXTRACTOR', old: 520, now: 310 },
  { name: 'RERANKER', old: 680, now: 220 },
];
const BAR = { x: 300, perWord: 1.25, row: 170, top: 24 };
const STRUCTURE = ['OUTPUT SCHEMA', 'POSITIVE EXAMPLES', 'NEGATIVE EXAMPLES', 'HARD EXCLUSION RULES', 'CONFIDENCE SCORE'];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (share: number, from: number, to: number) => clamp((share - from) / (to - from));
/** Fade in: nothing pops, it comes up over a short stretch of scroll (Robert, 27 Oct 2026). */
const FADE = 0.04;
const fade = (share: number, from: number) => span(share, from, from + FADE);

export const SayFitFigure = ({ palette: c, share, narrow = false }: { palette: Palette; share: number; narrow?: boolean }) => {
  if (narrow) return <SayFitNarrow palette={c} share={share} />;
  const mono = { fontFamily: fonts.mono, fontSize: 17, letterSpacing: 1, fill: c.mute };
  const rule = span(share, 0.62, 0.7);

  return (
    <svg viewBox="0 0 1200 480" width="100%" height="100%" aria-hidden="true">
      {PROMPTS.map((prompt, i) => {
        const t = BAR.top + i * BAR.row;
        const y = t + 72;
        const draw = span(share, 0.04 + i * 0.08, 0.26 + i * 0.08);
        const shown = fade(share, 0.04 + i * 0.08);
        // The cut runs down smoothly, the word count with it; the old length fades in as a trace.
        const cut = span(share, 0.36 + i * 0.06, 0.52 + i * 0.06);
        const trace = fade(share, 0.36 + i * 0.06);
        const words = Math.round(prompt.old - (prompt.old - prompt.now) * cut);
        const end = BAR.x + prompt.old * BAR.perWord;
        return (
          <g key={prompt.name}>
            <text x={40} y={t + 16} {...mono} opacity={shown}>
              {prompt.name}
            </text>
            <text
              x={36}
              y={t + 104}
              fontSize={88}
              opacity={shown}
              style={{ fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -3, fill: c.ink, fontVariantNumeric: 'tabular-nums' }}
            >
              {words}
            </text>
            <text x={212} y={t + 104} {...mono} opacity={shown}>
              WORDS
            </text>

            {/* The old length stays as a trace once the cut has begun. */}
            {trace > 0 && (
              <g opacity={trace}>
                <line x1={BAR.x} y1={y} x2={end} y2={y} stroke={c.hair} strokeWidth={2} />
                <line x1={end} y1={y - 12} x2={end} y2={y + 12} stroke={c.hair} strokeWidth={2} />
                <text x={end} y={y - 22} textAnchor="end" {...mono}>
                  {`OLD ${prompt.old}`}
                </text>
              </g>
            )}
            {draw > 0 && (
              <line
                x1={BAR.x}
                y1={y}
                x2={BAR.x + words * BAR.perWord * draw}
                y2={y}
                stroke={mix(c.ink, c.signal, trace)}
                strokeWidth={10}
              />
            )}
          </g>
        );
      })}

      {/* What took the place of the prose, the same for both prompts. */}
      <line x1={40} y1={372} x2={40 + 1120 * rule} y2={372} stroke={c.hair} strokeWidth={1} />
      <text x={40} y={416} {...mono} opacity={rule}>
        INSTEAD OF MORE PROSE
      </text>
      {STRUCTURE.map((part, k) => {
        const on = fade(share, 0.7 + k * 0.04);
        const x = BAR.x + (k % 3) * 290;
        const y = 416 + Math.floor(k / 3) * 40;
        return (
          <g key={part} opacity={on}>
            <rect x={x} y={y - 12} width={12} height={12} fill={c.ink} />
            <text x={x + 24} y={y} {...mono} fill={c.ink}>
              {part}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** The narrow version (phones): the same story stacked for portrait, 600 x 860, labels large enough to read. */
const NARROW = { x: 40, perWord: 0.75, row: 250, top: 20 };

const SayFitNarrow = ({ palette: c, share }: { palette: Palette; share: number }) => {
  const mono = { fontFamily: fonts.mono, fontSize: 24, letterSpacing: 1, fill: c.mute };
  const rule = span(share, 0.62, 0.7);

  return (
    <svg viewBox="0 0 600 860" width="100%" height="100%" aria-hidden="true">
      {PROMPTS.map((prompt, i) => {
        const t = NARROW.top + i * NARROW.row;
        const y = t + 206;
        const draw = span(share, 0.04 + i * 0.08, 0.26 + i * 0.08);
        const shown = fade(share, 0.04 + i * 0.08);
        // The cut runs down smoothly, the word count with it; the old length fades in as a trace.
        const cut = span(share, 0.36 + i * 0.06, 0.52 + i * 0.06);
        const trace = fade(share, 0.36 + i * 0.06);
        const words = Math.round(prompt.old - (prompt.old - prompt.now) * cut);
        const end = NARROW.x + prompt.old * NARROW.perWord;
        return (
          <g key={prompt.name}>
            <text x={NARROW.x} y={t + 24} {...mono} opacity={shown}>
              {prompt.name}
            </text>
            <text
              x={NARROW.x - 5}
              y={t + 146}
              fontSize={124}
              opacity={shown}
              style={{ fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -4, fill: c.ink, fontVariantNumeric: 'tabular-nums' }}
            >
              {words}
            </text>
            <text x={NARROW.x + 236} y={t + 146} {...mono} opacity={shown}>
              WORDS
            </text>

            {/* The old length stays as a trace once the cut has begun. */}
            {trace > 0 && (
              <g opacity={trace}>
                <line x1={NARROW.x} y1={y} x2={end} y2={y} stroke={c.hair} strokeWidth={2} />
                <line x1={end} y1={y - 14} x2={end} y2={y + 14} stroke={c.hair} strokeWidth={2} />
                <text x={end} y={y - 26} textAnchor="end" {...mono}>
                  {`OLD ${prompt.old}`}
                </text>
              </g>
            )}
            {draw > 0 && (
              <line
                x1={NARROW.x}
                y1={y}
                x2={NARROW.x + words * NARROW.perWord * draw}
                y2={y}
                stroke={mix(c.ink, c.signal, trace)}
                strokeWidth={14}
              />
            )}
          </g>
        );
      })}

      {/* What took the place of the prose, one part per line. */}
      <line x1={40} y1={536} x2={40 + 520 * rule} y2={536} stroke={c.hair} strokeWidth={1} />
      <text x={40} y={584} {...mono} opacity={rule}>
        INSTEAD OF MORE PROSE
      </text>
      {STRUCTURE.map((part, k) => {
        const on = fade(share, 0.7 + k * 0.04);
        const y = 644 + k * 46;
        return (
          <g key={part} opacity={on}>
            <rect x={40} y={y - 17} width={17} height={17} fill={c.ink} />
            <text x={74} y={y} {...mono} fill={c.ink}>
              {part}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
