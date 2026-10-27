// Constat as the opening of the Levelwork case page (version J): the film's three acts across the whole width.
// The page sets the title and the summary as real text in the same 1600 × 900 box. The title stands on the
// first line of the week: the rule under it runs on as the 09:00 line of the calendar on the right, so the
// company's name heads the week it makes visible. Left, under the summary, the column says what each act
// means: the legend while the week is designed and then lived, the sentence of the finding in the last act.
// The blocks are the film's illustration, not client data.
import { useCurrentFrame } from 'remotion';
import type { Palette } from '../style';
import { fonts, progress, stepped } from '../style';
import { CONSTAT_FRAMES } from '../constat/Constat';

export const CONSTAT_STAGE_FRAMES = CONSTAT_FRAMES;

type Kind = 'core' | 'coord' | 'admin' | 'extra' | 'overhead';
type Span = [number, number];

/** The film's week, hour by hour: as designed (from) and as lived four weeks later (to). A copy of `blocks` in
 * Constat.tsx, which does not export it; the two have to stay the same. */
const blocks: { day: number; kind: Kind; from: Span | null; to: Span | null }[] = [
  { day: 0, kind: 'core', from: [9, 12], to: [9, 10.5] },
  { day: 0, kind: 'extra', from: null, to: [10.5, 12] },
  { day: 0, kind: 'coord', from: [13, 14], to: [13, 15] },
  { day: 0, kind: 'core', from: [14, 16], to: null },
  { day: 0, kind: 'overhead', from: null, to: [15, 16] },
  { day: 0, kind: 'admin', from: [16, 17], to: [16, 17] },
  { day: 1, kind: 'core', from: [9, 12], to: [10, 11.5] },
  { day: 1, kind: 'coord', from: [16, 17], to: [9, 10] },
  { day: 1, kind: 'extra', from: null, to: [11.5, 12] },
  { day: 1, kind: 'extra', from: null, to: [13, 14.5] },
  { day: 1, kind: 'core', from: [13, 16], to: [14.5, 16] },
  { day: 1, kind: 'overhead', from: null, to: [16, 17] },
  { day: 2, kind: 'coord', from: [9, 10], to: [9, 10.5] },
  { day: 2, kind: 'core', from: [10, 12], to: [10.5, 12] },
  { day: 2, kind: 'core', from: [13, 15], to: null },
  { day: 2, kind: 'overhead', from: null, to: [13, 14] },
  { day: 2, kind: 'extra', from: null, to: [14, 15.5] },
  { day: 2, kind: 'admin', from: [15, 16], to: [15.5, 16.5] },
  { day: 3, kind: 'extra', from: null, to: [9, 10] },
  { day: 3, kind: 'core', from: [9, 12], to: [10, 12] },
  { day: 3, kind: 'coord', from: [13, 14], to: [13, 15] },
  { day: 3, kind: 'core', from: [14, 17], to: [15, 16] },
  { day: 3, kind: 'overhead', from: null, to: [16, 17] },
  { day: 4, kind: 'core', from: [9, 11], to: [9, 10] },
  { day: 4, kind: 'coord', from: [11, 12], to: [10, 12] },
  { day: 4, kind: 'extra', from: null, to: [13, 14] },
  { day: 4, kind: 'admin', from: [13, 14], to: [14, 15] },
  { day: 4, kind: 'core', from: [14, 16], to: null },
  { day: 4, kind: 'overhead', from: null, to: [15, 16] },
];

/** The week fills the right side; its 09:00 line is the rule the title stands on. */
const GRID = { x: 940, y: 214, col: 132, hour: 72 };
const RULE_END = 868;
const HOUR_X = 884;
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const LEGEND: [Kind, string][] = [
  ['core', 'CORE WORK'],
  ['coord', 'COORDINATION'],
  ['admin', 'ADMIN'],
  ['extra', 'EXTRA TASKS'],
  ['overhead', 'OVERHEAD'],
];
const LEGEND_AT = { y: 646, col: 240, row: 44 };
const CAPTION_Y = 502;

const top = (hour: number) => GRID.y + (hour - 9) * GRID.hour;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const line = (frame: number, start: number, length: number, span = 10) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress(frame, start, start + span)),
});

/** Core work that the lived week cut short or dropped: in the last act it is outlined where it was designed. */
const ghosts = blocks.filter((b) => b.kind === 'core' && b.from && (!b.to || b.to[1] - b.to[0] < b.from[1] - b.from[0]));

export const ConstatStage = ({ palette: c }: { palette: Palette }) => {
  const f = useCurrentFrame();
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };

  const paint = (kind: Kind) =>
    ({
      core: { fill: c.ink },
      coord: { fill: 'none', stroke: c.ink, strokeWidth: 3 },
      admin: { fill: 'url(#constat-stage-hatch)' },
      extra: { fill: c.signal },
      overhead: { fill: c.mute },
    })[kind];

  const legendOpacity = progress(f, 40, 50) * (1 - progress(f, 132, 140));

  // Words from the case page: the role as designed comes from the manager, the role as lived from the person.
  const captions = [
    { lines: ['THE ROLE AS DESIGNED,', 'FROM THE MANAGER.'], show: progress(f, 22, 30) * (1 - progress(f, 64, 70)) },
    {
      lines: ['THE ROLE AS LIVED, FROM ONE', 'CONVERSATION WITH THE PERSON.'],
      show: progress(f, 94, 102) * (1 - progress(f, 132, 138)),
    },
  ];

  return (
    <svg viewBox="0 0 1600 900" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <defs>
        <pattern id="constat-stage-hatch" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={10} height={10} fill={c.ground} />
          <line x1={0} y1={0} x2={0} y2={10} stroke={c.ink} strokeWidth={4} />
        </pattern>
      </defs>

      {/* The rule under the title, then the 09:00 line of the week it runs into. */}
      <line x1={0} y1={GRID.y} x2={RULE_END} y2={GRID.y} stroke={c.ink} strokeWidth={2} style={line(f, 0, RULE_END, 12)} />
      <line
        x1={GRID.x}
        y1={GRID.y}
        x2={GRID.x + 5 * GRID.col}
        y2={GRID.y}
        stroke={c.ink}
        strokeWidth={2}
        style={line(f, 10, 5 * GRID.col, 8)}
      />

      {/* The empty week: hours and days, drawn first. */}
      {Array.from({ length: 8 }, (_, i) => (
        <line
          key={`h${i}`}
          x1={GRID.x}
          x2={GRID.x + 5 * GRID.col}
          y1={top(10 + i)}
          y2={top(10 + i)}
          stroke={c.hair}
          strokeWidth={2}
          style={line(f, 12 + i, 5 * GRID.col, 8)}
        />
      ))}
      {[9, 11, 13, 15, 17].map((hour, i) => (
        <text
          key={hour}
          x={HOUR_X}
          y={top(hour) + 7}
          fontSize={20}
          opacity={stepped(progress(f, 8 + i * 2, 10 + i * 2), 1)}
          style={mono}
        >
          {String(hour).padStart(2, '0')}
        </text>
      ))}
      {DAYS.map((day, i) => (
        <text
          key={day}
          x={GRID.x + i * GRID.col + GRID.col / 2}
          y={GRID.y - 18}
          fontSize={20}
          textAnchor="middle"
          opacity={stepped(progress(f, 10 + i * 2, 12 + i * 2), 1)}
          style={mono}
        >
          {day}
        </text>
      ))}

      {/* The week: designed first, then pulled into how it is lived. */}
      {blocks.map((b, i) => {
        const pop = stepped(progress(f, 18 + b.day * 5, 24 + b.day * 5), 3);
        const move = progress(f, 70 + b.day * 4, 92 + b.day * 4);
        const arrive = stepped(progress(f, 84 + b.day * 4, 90 + b.day * 4), 3);
        let span: Span;
        let scale = 1;
        if (b.from && b.to) {
          span = [lerp(b.from[0], b.to[0], move), lerp(b.from[1], b.to[1], move)];
          scale = pop;
        } else if (b.from) {
          span = b.from;
          scale = pop * (1 - move);
        } else if (b.to) {
          span = b.to;
          scale = arrive;
        } else return null;
        if (scale <= 0) return null;
        const height = ((span[1] - span[0]) * GRID.hour - 6) * scale;
        return (
          <rect
            key={i}
            x={GRID.x + b.day * GRID.col + 8}
            y={top(span[0]) + 3}
            width={GRID.col - 16}
            height={Math.max(0, height)}
            {...paint(b.kind)}
          />
        );
      })}

      {/* Act 3: where the role as designed used to be, outlined in red. */}
      {ghosts.map((b, i) => {
        const shown = stepped(progress(f, 138 + i * 2, 140 + i * 2), 1);
        if (!shown || !b.from) return null;
        return (
          <rect
            key={`ghost${i}`}
            x={GRID.x + b.day * GRID.col + 4}
            y={top(b.from[0]) + 2}
            width={GRID.col - 8}
            height={(b.from[1] - b.from[0]) * GRID.hour - 4}
            fill="none"
            stroke={c.signal}
            strokeWidth={3}
            strokeDasharray="10 7"
          />
        );
      })}

      {/* Left column under the summary: what each act means. */}
      {captions.map((caption, k) =>
        caption.show > 0 ? (
          <g key={k} opacity={caption.show}>
            {caption.lines.map((text, i) => (
              <text key={text} x={0} y={CAPTION_Y + i * 32} fontSize={21} style={mono}>
                {text}
              </text>
            ))}
          </g>
        ) : null,
      )}
      <g opacity={progress(f, 140, 148)}>
        <rect x={0} y={CAPTION_Y - 19} width={22} height={22} fill="none" stroke={c.signal} strokeWidth={3} strokeDasharray="6 4" />
        <text x={36} y={CAPTION_Y} fontSize={21} style={mono}>
          CORE WORK AS DESIGNED
        </text>
      </g>

      {/* Legend for the first two acts, the sentence for the last. */}
      <g opacity={legendOpacity}>
        {LEGEND.map(([kind, label], i) => {
          const x = (i % 3) * LEGEND_AT.col;
          const y = LEGEND_AT.y + Math.floor(i / 3) * LEGEND_AT.row;
          return (
            <g key={kind}>
              <rect x={x} y={y - 18} width={22} height={22} {...paint(kind)} />
              <text x={x + 34} y={y} fontSize={19} style={mono}>
                {label}
              </text>
            </g>
          );
        })}
      </g>
      <defs>
        <clipPath id="constat-stage-finding">
          <rect x={0} y={592} width={RULE_END} height={150} />
        </clipPath>
      </defs>
      <g clipPath="url(#constat-stage-finding)">
        {['A deviation is not a verdict.', 'It’s a finding.'].map((text, i) => {
          const rise = progress(f, 146 + i * 8, 162 + i * 8);
          return (
            <text
              key={text}
              x={0}
              y={646 + i * 72 + (1 - rise) * 160}
              fontSize={56}
              style={{ fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -1.5, fill: i === 1 ? c.signal : c.ink }}
            >
              {text}
            </text>
          );
        })}
      </g>
    </svg>
  );
};
