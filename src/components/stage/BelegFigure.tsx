// Stub, several receipts on one scan (version J): how the glass is cut, drawn as the reader scrolls past.
// Four receipts and a speck of dust lie on the glass, seen as the app's mask (where print is darker than the
// paper). First the columns: wherever the mask is empty for 10 mm across, the glass is cut. Then, inside each
// column, the rows, cut at 30 mm. What is smaller than 15 × 10 mm is dropped, and every box gets 5 mm of margin.
// The thresholds are find_regions() in stub/regions.py; the receipts and their places are invented.
import type { Palette } from '../../../motion/src/style';
import { fonts } from '../../../motion/src/style';
import { mix } from '../../../motion/src/tealucent/Tealucent';
import { seeded } from '../../../motion/src/random';

/** The glass in mm, lying on its side: 300 × 216. Receipts and the speck as [x0, y0, x1, y1] in mm. */
const GLASS = { w: 300, h: 216 };
const RECEIPTS = [
  [15, 20, 75, 190],
  [100, 15, 170, 85],
  [100, 125, 170, 200],
  [195, 30, 280, 150],
];
const SPECK = [238, 191, 242, 194];
/** Columns and their row cuts, as the two passes find them. */
const COLUMNS = [
  { x0: 15, x1: 75, rows: [] as number[] },
  { x0: 100, x1: 170, rows: [105] },
  { x0: 195, x1: 280, rows: [170] },
];
const COLUMN_CUTS = [87.5, 182.5];
const MARGIN = 5;

const random = seeded(1027);
/** Printed lines on each receipt, as bars: inset from the left, length, line pitch in mm. */
const PRINT = RECEIPTS.map(([x0, y0, x1, y1]) => {
  const lines: { x: number; y: number; w: number }[] = [];
  for (let y = y0 + 8; y < y1 - 6; y += 6 + Math.floor(random() * 3)) {
    if (random() < 0.18) continue;
    const w = (x1 - x0 - 12) * (0.35 + random() * 0.65);
    lines.push({ x: x0 + 6, y, w });
  }
  return lines;
});

const STEPS = [
  { at: 0.04, text: 'THE MASK: PRINT DARKER THAN THE PAPER' },
  { at: 0.24, text: 'COLUMNS: CUT WHERE 10 MM ARE EMPTY' },
  { at: 0.46, text: 'ROWS: CUT WHERE 30 MM ARE EMPTY' },
  { at: 0.66, text: 'SPECKS UNDER 15 × 10 MM DROPPED' },
  { at: 0.82, text: '4 RECEIPTS, 5 MM MARGIN EACH' },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (share: number, from: number, to: number) => clamp((share - from) / (to - from));
/** Fade in: nothing pops, it comes up over a short stretch of scroll (Robert, 27 Oct 2026). */
const FADE = 0.04;
const fade = (share: number, from: number) => span(share, from, from + FADE);

export const BelegFigure = ({ palette: c, share, narrow = false }: { palette: Palette; share: number; narrow?: boolean }) => {
  const k = 2.4; // px per mm
  const ox = 40;
  const oy = 20;
  const X = (mm: number) => ox + mm * k;
  const Y = (mm: number) => oy + mm * k;
  const W = GLASS.w * k;
  const H = GLASS.h * k;
  const mono = { fontFamily: fonts.mono, letterSpacing: 1 };
  const labelSize = narrow ? 24 : 14;

  const appear = span(share, 0.02, 0.18);
  const columns = span(share, 0.24, 0.4);
  const rows = span(share, 0.46, 0.6);
  const dropped = span(share, 0.66, 0.74);
  const boxes = span(share, 0.82, 0.92);

  /** Column profile under the glass: ink where any row of that column has print. */
  const profile = RECEIPTS.map(([x0, , x1]) => [x0, x1]).concat([[SPECK[0], SPECK[2]]]);

  return (
    <svg viewBox={narrow ? '0 0 800 1000' : '0 0 1200 640'} width="100%" height="100%" aria-hidden="true">
      <rect x={ox} y={oy} width={W} height={H} fill="none" stroke={c.hair} strokeWidth={2} />

      {/* The mask: receipts as the app sees them, the speck too. */}
      <g opacity={appear}>
        {RECEIPTS.map(([x0, y0, x1, y1], i) => (
          <g key={i} opacity={boxes ? 1 - 0.4 * boxes : 1}>
            <rect x={X(x0)} y={Y(y0)} width={(x1 - x0) * k} height={(y1 - y0) * k} fill="none" stroke={c.hair} strokeWidth={1.5} />
            {PRINT[i].map((line, j) => (
              <rect key={j} x={X(line.x)} y={Y(line.y)} width={line.w * k} height={2.2 * k * 0.6} fill={c.ink} />
            ))}
          </g>
        ))}
        <rect
          x={X(SPECK[0])}
          y={Y(SPECK[1])}
          width={(SPECK[2] - SPECK[0]) * k}
          height={(SPECK[3] - SPECK[1]) * k}
          fill={c.ink}
          opacity={1 - 0.7 * dropped}
        />
        {dropped > 0 && (
          <circle cx={X(240)} cy={Y(192.5)} r={16 * dropped} fill="none" stroke={c.signal} strokeWidth={2.5} />
        )}
      </g>

      {/* Pass 1: the column profile under the glass, its wide gaps and the cuts through the glass. */}
      <g opacity={fade(share, 0.24)}>
        <rect x={ox} y={oy + H + 22} width={W} height={10} fill={c.hair} />
        {profile.map(([x0, x1], i) => (
          <rect key={i} x={X(x0)} y={oy + H + 22} width={(x1 - x0) * k * columns} height={10} fill={c.ink} />
        ))}
        {COLUMN_CUTS.map((x, i) => (
          <line
            key={i}
            x1={X(x)}
            x2={X(x)}
            y1={oy + H + 40}
            y2={oy + H + 40 - (H + 40) * columns}
            stroke={c.signal}
            strokeWidth={3}
            strokeDasharray="10 8"
          />
        ))}
      </g>

      {/* Pass 2: inside each column, the row cuts. */}
      {COLUMNS.map((col, i) =>
        col.rows.map((y) => (
          <line
            key={`${i}-${y}`}
            x1={X(col.x0 - 6)}
            x2={X(col.x0 - 6) + (col.x1 - col.x0 + 12) * k * rows}
            y1={Y(y)}
            y2={Y(y)}
            stroke={c.signal}
            strokeWidth={3}
            strokeDasharray="10 8"
            opacity={fade(share, 0.46)}
          />
        )),
      )}

      {/* The result: a box per receipt with its margin, numbered in reading order. */}
      {RECEIPTS.map(([x0, y0, x1, y1], i) => {
        // Each box fades in over a quarter of the boxes' stretch, from the point where it used to switch on.
        const on = clamp((boxes - ((i + 1) / RECEIPTS.length - 0.2)) / 0.25);
        if (on <= 0) return null;
        const bx = X(x0 - MARGIN);
        const by = Y(y0 - MARGIN);
        return (
          <g key={i} opacity={on}>
            <rect x={bx} y={by} width={(x1 - x0 + 2 * MARGIN) * k} height={(y1 - y0 + 2 * MARGIN) * k} fill="none" stroke={c.signal} strokeWidth={3} />
            <rect x={bx} y={by} width={28} height={28} fill={c.signal} />
            <text x={bx + 14} y={by + 20} fontSize={18} textAnchor="middle" style={{ ...mono, fill: c.ground }}>
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* The steps as a list beside (or under) the glass; the current one in ink, the done ones muted. */}
      {STEPS.map((step, i) => {
        const x = narrow ? ox : 812;
        const y = narrow ? oy + H + 110 + i * 64 : 60 + i * 56;
        // A step fades in when it starts and hands the mark over to the next one as that one fades in.
        const shown = fade(share, step.at);
        const current = shown * (i === STEPS.length - 1 ? 1 : 1 - fade(share, STEPS[i + 1].at));
        if (shown <= 0) return null;
        return (
          <g key={step.text} opacity={shown}>
            {current > 0 && <rect x={x} y={y - labelSize * 0.8} width={6} height={labelSize} fill={c.signal} opacity={current} />}
            <text x={x + 18} y={y} fontSize={narrow ? labelSize : 14} style={{ ...mono, letterSpacing: narrow ? 1 : 0.4, fill: mix(c.mute, c.ink, current) }}>
              {step.text}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
