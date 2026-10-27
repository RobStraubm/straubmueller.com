// Constat in seven seconds, in Levelwork's own words: the week a role is designed to be, the same week
// as it is lived, and the gap between them as a finding. The blocks are an illustration, not client data.
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ActWord, Labels, type Act } from '../parts';
import { fonts, palettes, progress, SIZE, stepped, type Theme, POSTER_VIEW } from '../style';

export const CONSTAT_FRAMES = 210;

export const CONSTAT_ACTS: Act[] = [
  { word: 'EXPECTED', from: 0, to: 64 },
  { word: 'ACTUAL', from: 64, to: 132 },
  { word: 'FINDING', from: 132, to: Infinity },
];

type Kind = 'core' | 'coord' | 'admin' | 'extra' | 'overhead';
type Span = [number, number];

/** Hours of a working week, as designed (from) and as lived four weeks later (to). */
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

const GRID = { x: 116, y: 300, col: 124, hour: 60 };
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const LEGEND: [Kind, string][] = [
  ['core', 'CORE WORK'],
  ['coord', 'COORDINATION'],
  ['admin', 'ADMIN'],
  ['extra', 'EXTRA TASKS'],
  ['overhead', 'OVERHEAD'],
];

const top = (hour: number) => GRID.y + (hour - 9) * GRID.hour;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Constat = ({ theme }: { theme: Theme }) => {
  const f = useCurrentFrame();
  const c = palettes[theme];

  const paint = (kind: Kind) =>
    ({
      core: { fill: c.ink },
      coord: { fill: 'none', stroke: c.ink, strokeWidth: 3 },
      admin: { fill: 'url(#hatch)' },
      extra: { fill: c.signal },
      overhead: { fill: c.mute },
    })[kind];

  const legendOpacity = progress(f, 40, 50) * (1 - progress(f, 132, 140));
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };

  return (
    <AbsoluteFill style={{ backgroundColor: c.ground }}>
      <svg width={SIZE.width} height={SIZE.height} viewBox={POSTER_VIEW}>
        <defs>
          <pattern id="hatch" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={10} height={10} fill={c.ground} />
            <line x1={0} y1={0} x2={0} y2={10} stroke={c.ink} strokeWidth={4} />
          </pattern>
        </defs>

        <Labels frame={f} project="Constat" acts={CONSTAT_ACTS} palette={c} />
        <ActWord frame={f} acts={CONSTAT_ACTS} palette={c} />

        {/* The empty week: hours and days, drawn first. */}
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={GRID.x}
            x2={GRID.x + 5 * GRID.col}
            y1={top(9 + i)}
            y2={top(9 + i)}
            stroke={c.hair}
            strokeWidth={2}
            opacity={stepped(progress(f, 4 + i, 6 + i), 1)}
          />
        ))}
        {[9, 11, 13, 15, 17].map((hour, i) => (
          <text
            key={hour}
            x={64}
            y={top(hour) + 7}
            fontSize={18}
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
            y={GRID.y - 16}
            fontSize={18}
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
        {blocks
          .filter((b) => b.kind === 'core' && b.from && (!b.to || b.to[1] - b.to[0] < b.from[1] - b.from[0]))
          .map((b, i) => {
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

        {/* Legend for the first two acts, the sentence for the last. */}
        <g opacity={legendOpacity}>
          {LEGEND.map(([kind, label], i) => {
            const x = 64 + (i % 3) * 230;
            const y = 836 + Math.floor(i / 3) * 44;
            return (
              <g key={kind}>
                <rect x={x} y={y - 18} width={22} height={22} {...paint(kind)} />
                <text x={x + 34} y={y} fontSize={18} style={mono}>
                  {label}
                </text>
              </g>
            );
          })}
        </g>
        <g>
          <defs>
            <clipPath id="finding-mask">
              <rect x={0} y={808} width={800} height={150} />
            </clipPath>
          </defs>
          <g clipPath="url(#finding-mask)">
            {['A deviation is not a verdict.', 'It’s a finding.'].map((line, i) => {
              const rise = progress(f, 146 + i * 8, 162 + i * 8);
              return (
                <text
                  key={line}
                  x={64}
                  y={860 + i * 56 + (1 - rise) * 160}
                  fontSize={44}
                  style={{
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    letterSpacing: -1,
                    fill: i === 1 ? c.signal : c.ink,
                  }}
                >
                  {line}
                </text>
              );
            })}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
