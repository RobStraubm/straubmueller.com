// Levelwork, what I made: how the mark is built and what it says (version J). Drawn as the reader scrolls past it:
// the square frame draws itself (the role as designed), the bar grows inside it (the role as lived) and breaks out
// on the right in the brand's orange (the part nobody wrote down); then the construction gives way to the lockup
// and to the sizes the mark was tested at. Geometry, wordmark outlines and the accent are taken from the logo files
// in the Levelwork repository (brand/logo/Levelwork-lockup-colour.svg); the meaning and the tests are from
// brand/guidelines.md, "How the mark is built" and "Why the mark looks this way". Frame, bar and wordmark take the
// page's ink, so the mark reads on both grounds as the brand's Ink and Cream versions do.
import type { Palette } from '../../../motion/src/style';
import { fonts } from '../../../motion/src/style';

/** Levelwork's accent. The only element of the mark in colour, so it keeps the brand's own value here. */
const ACCENT = '#FF4D00';

/** The mark on its 100 × 100 grid: a 52-unit frame with a 7-unit stroke, a 16-unit bar that runs 40 units to the
 * frame's right edge and 22 beyond it. */
const FRAME = { x: 16, y: 24, size: 52, stroke: 7 };
const BAR = { x: 28, y: 42, inside: 40, outside: 22, height: 16 };

/** The lockup file's own units: the mark is scaled by 8.26 and lifted by 63, the wordmark glyphs stand on a
 * 700-unit cap height from x = 1120. Its visible extent runs from the frame's outer edge to the end of the K. */
const LOCKUP = { markScale: 8.26, markLift: 63, left: (FRAME.x - FRAME.stroke / 2) * 8.26, right: 7050, height: 700 };
const WORDMARK = [
  { x: 0, d: 'M80 0V700H164V76H518V0Z' },
  { x: 601, d: 'M80 0V700H511V624H164V390H483V314H164V76H516V0Z' },
  { x: 1219, d: 'M236 0 25 700H112L303 51H316L507 700H594L383 0Z' },
  { x: 1893, d: 'M80 0V700H511V624H164V390H483V314H164V76H516V0Z' },
  { x: 2511, d: 'M80 0V700H164V76H518V0Z' },
  { x: 3112, d: 'M151 0 37 700H121L220 54H234L363 700H513L641 54H655L754 700H838L724 0H574L445 650H431L302 0Z' },
  {
    x: 4042,
    d: 'M334 -14Q209 -14 134.5 58.5Q60 131 60 270V430Q60 569 134.5 641.5Q209 714 334 714Q460 714 534.5 641.5Q609 569 609 430V270Q609 131 534.5 58.5Q460 -14 334 -14ZM334 61Q425 61 475.0 115.5Q525 170 525 267V433Q525 530 475.0 584.5Q425 639 334 639Q244 639 194.0 584.5Q144 530 144 433V267Q144 170 194.0 115.5Q244 61 334 61Z',
  },
  {
    x: 4766,
    d: 'M80 0V700H363Q428 700 477.5 677.5Q527 655 555.0 613.5Q583 572 583 514V503Q583 434 550.0 394.0Q517 354 472 340V326Q508 325 531.5 302.5Q555 280 555 235V0H472V225Q472 255 455.5 271.0Q439 287 406 287H164V0ZM164 363H355Q424 363 461.5 396.5Q499 430 499 490V497Q499 557 462.0 590.5Q425 624 355 624H164Z',
  },
  { x: 5452, d: 'M80 0V700H164V395H178L474 700H586L245 354L598 0H483L178 311H164V0Z' },
];
/** The sizes the mark was tested at (brand/guidelines.md); the last one again in a single colour. */
const TESTS = [48, 32, 16];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (share: number, from: number, to: number) => clamp((share - from) / (to - from));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** The mark in its own units, built up to the given stage. `frame`, `bar` and `out` run from 0 to 1. */
const Mark = ({ ink, frame = 1, bar = 1, out = 1, accent = ACCENT }: { ink: string; frame?: number; bar?: number; out?: number; accent?: string }) => (
  <g>
    <path
      d={`M${FRAME.x} ${FRAME.y}H${FRAME.x + FRAME.size}V${FRAME.y + FRAME.size}H${FRAME.x}Z`}
      fill="none"
      stroke={ink}
      strokeWidth={FRAME.stroke}
      strokeLinejoin="miter"
      pathLength={1}
      strokeDasharray={frame < 1 ? 1 : undefined}
      strokeDashoffset={frame < 1 ? 1 - frame : undefined}
    />
    <rect x={BAR.x} y={BAR.y} width={BAR.inside * bar} height={BAR.height} fill={ink} />
    <rect x={BAR.x + BAR.inside} y={BAR.y} width={BAR.outside * out} height={BAR.height} fill={accent} />
  </g>
);

/** The wordmark in lockup units, standing on y = 0 with its caps up to y = -700. */
const Wordmark = ({ ink }: { ink: string }) => (
  <g transform={`translate(1120 0) scale(1 -1)`} fill={ink}>
    {WORDMARK.map((glyph) => (
      <path key={glyph.x} transform={`translate(${glyph.x} 0)`} d={glyph.d} />
    ))}
  </g>
);

/** A dimension line in mark units: a hairline with end ticks and its value. */
const Dim = ({ x1, y1, x2, y2, label, c, size, show, side = 'above' }: { x1: number; y1: number; x2: number; y2: number; label: string; c: Palette; size: number; show: number; side?: 'above' | 'right' }) => {
  const vertical = x1 === x2;
  const tick = 1.6;
  return (
    <g opacity={show}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.mute} strokeWidth={0.25} />
      {vertical ? (
        <>
          <line x1={x1 - tick} y1={y1} x2={x1 + tick} y2={y1} stroke={c.mute} strokeWidth={0.25} />
          <line x1={x1 - tick} y1={y2} x2={x1 + tick} y2={y2} stroke={c.mute} strokeWidth={0.25} />
        </>
      ) : (
        <>
          <line x1={x1} y1={y1 - tick} x2={x1} y2={y1 + tick} stroke={c.mute} strokeWidth={0.25} />
          <line x1={x2} y1={y2 - tick} x2={x2} y2={y2 + tick} stroke={c.mute} strokeWidth={0.25} />
        </>
      )}
      <text
        x={side === 'right' ? x1 + 2.6 : (x1 + x2) / 2}
        y={side === 'right' ? (y1 + y2) / 2 + size * 0.35 : y1 - 2}
        textAnchor={side === 'right' ? 'start' : 'middle'}
        style={{ fontFamily: fonts.mono, fontSize: size, fill: c.mute }}
      >
        {label}
      </text>
    </g>
  );
};

/** The 100 × 100 construction grid in mark units, every 10 units, with the frame's dimensions. */
const Construction = ({ c, share, label }: { c: Palette; share: number; label: number }) => {
  const lines = Array.from({ length: 11 }, (_, k) => k * 10);
  return (
    <g>
      <g opacity={span(share, 0, 0.06) * 0.9}>
        {lines.map((v) => (
          <g key={v}>
            <line x1={v} y1={0} x2={v} y2={100} stroke={c.hair} strokeWidth={0.2} />
            <line x1={0} y1={v} x2={100} y2={v} stroke={c.hair} strokeWidth={0.2} />
          </g>
        ))}
      </g>
      <Dim x1={FRAME.x} y1={FRAME.y - 8} x2={FRAME.x + FRAME.size} y2={FRAME.y - 8} label="52" c={c} size={label} show={span(share, 0.16, 0.22)} />
      <Dim x1={BAR.x} y1={BAR.y + BAR.height + 13} x2={BAR.x + BAR.inside} y2={BAR.y + BAR.height + 13} label="40" c={c} size={label} show={span(share, 0.38, 0.44)} />
      <Dim x1={BAR.x + BAR.inside} y1={BAR.y - 8} x2={BAR.x + BAR.inside + BAR.outside} y2={BAR.y - 8} label="22" c={c} size={label} show={span(share, 0.54, 0.6)} />
      <Dim x1={BAR.x + BAR.inside + BAR.outside + 4} y1={BAR.y} x2={BAR.x + BAR.inside + BAR.outside + 4} y2={BAR.y + BAR.height} label="16" c={c} size={label} side="right" show={span(share, 0.38, 0.44)} />
    </g>
  );
};

/** What each part means, in the order it is drawn. */
const MEANINGS = [
  { from: 0.06, key: 'FRAME', line: 'The role as designed.', note: ['The profile, the job description,', 'the box on the chart.'] },
  { from: 0.3, key: 'BAR', line: 'The role as lived.', note: ['It starts inside the frame.'] },
  { from: 0.5, key: 'BEYOND THE FRAME', line: 'The part nobody wrote down.', note: ['The only element in colour.'] },
];

interface Layout {
  view: [number, number];
  /** Where the 100-unit construction grid stands, and how large. */
  grid: { x: number; y: number; scale: number };
  /** Where the lockup stands: left edge, cap line and visible width. */
  lockup: { x: number; y: number; width: number };
  meanings: { x: number; y: number; step: number; size: number; note: number; label: number };
  tests: { x: number; y: number; gap: number; scale: number; label: number };
  /** Size of the dimension labels, in mark units. */
  dims: number;
}

const WIDE: Layout = {
  view: [1200, 520],
  grid: { x: 40, y: 20, scale: 4.7 },
  lockup: { x: 100, y: 120, width: 1000 },
  meanings: { x: 610, y: 96, step: 150, size: 34, note: 16, label: 15 },
  tests: { x: 100, y: 382, gap: 64, scale: 1.25, label: 15 },
  dims: 3.4,
};

const NARROW: Layout = {
  view: [600, 960],
  grid: { x: 60, y: 10, scale: 4.6 },
  lockup: { x: 40, y: 340, width: 520 },
  meanings: { x: 40, y: 520, step: 150, size: 32, note: 22, label: 22 },
  tests: { x: 40, y: 508, gap: 50, scale: 1.3, label: 22 },
  dims: 5,
};

export const LevelworkMark = ({ palette: c, share, narrow = false }: { palette: Palette; share: number; narrow?: boolean }) => {
  const L = narrow ? NARROW : WIDE;
  const [w, h] = L.view;

  const frame = span(share, 0.04, 0.24);
  const bar = span(share, 0.28, 0.44);
  const out = span(share, 0.48, 0.6);
  const leave = 1 - span(share, 0.62, 0.7);
  const move = ease(span(share, 0.64, 0.8));
  const word = ease(span(share, 0.76, 0.88));
  const tests = span(share, 0.86, 0.96);

  // The mark travels from the construction grid into its place in the lockup.
  const unit = L.lockup.width / (LOCKUP.right - LOCKUP.left);
  const lockX = L.lockup.x - LOCKUP.left * unit;
  const lockY = L.lockup.y + LOCKUP.height * unit;
  const markScale = mix(L.grid.scale, LOCKUP.markScale * unit, move);
  const markX = mix(L.grid.x, lockX, move);
  const markY = mix(L.grid.y, L.lockup.y - LOCKUP.markLift * unit, move);

  const m = L.meanings;
  const mono = (size: number, fill: string) => ({ fontFamily: fonts.mono, fontSize: size, letterSpacing: 1, fill });
  const clip = `lw-mark-word-${narrow ? 'n' : 'w'}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <rect x={0} y={0} width={w * word} height={h} />
        </clipPath>
      </defs>

      {/* The construction, on its grid. */}
      <g opacity={leave} transform={`translate(${L.grid.x} ${L.grid.y}) scale(${L.grid.scale})`}>
        <Construction c={c} share={share} label={L.dims} />
      </g>

      {/* What each part means. */}
      <g opacity={leave}>
        {MEANINGS.map((item, k) => {
          const show = span(share, item.from, item.from + 0.06);
          const y = m.y + k * m.step;
          return (
            <g key={item.key} opacity={show} transform={`translate(${(1 - show) * 12} 0)`}>
              {k === 2 && <rect x={m.x} y={y - m.label + 1} width={m.label * 1.6} height={m.label * 0.75} fill={ACCENT} />}
              <text x={m.x + (k === 2 ? m.label * 2.3 : 0)} y={y} style={mono(m.label, c.mute)}>{item.key}</text>
              <text x={m.x} y={y + m.size * 1.3} style={{ fontFamily: fonts.sans, fontSize: m.size, fontWeight: 500, letterSpacing: -0.6, fill: c.ink }}>
                {item.line}
              </text>
              {item.note.map((line, n) => (
                <text key={line} x={m.x} y={y + m.size * 1.3 + m.note * 1.7 + n * m.note * 1.4} style={mono(m.note, c.mute)}>
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </g>

      {/* The mark itself, from the grid into the lockup. */}
      <g transform={`translate(${markX} ${markY}) scale(${markScale})`}>
        <Mark ink={c.ink} frame={frame} bar={bar} out={out} />
      </g>

      {/* The wordmark, written out from the left as the mark settles. */}
      <g clip-path={`url(#${clip})`} opacity={word}>
        <g transform={`translate(${lockX} ${lockY}) scale(${unit})`}>
          <Wordmark ink={c.ink} />
        </g>
      </g>

      {/* Chosen from four candidates and tested at 48, 32 and 16 pixels and in one colour. */}
      <g opacity={tests}>
        <line x1={L.tests.x} y1={L.tests.y - 34} x2={w - L.tests.x} y2={L.tests.y - 34} stroke={c.hair} strokeWidth={1} />
        {(() => {
          const t = L.tests;
          let x = t.x;
          const marks = [...TESTS.map((size) => ({ size, mono: false })), { size: 48, mono: true }];
          return marks.map(({ size, mono: single }) => {
            const s = (size * t.scale) / 100;
            const label = single ? '1 COLOUR' : `${size} PX`;
            const node = (
              <g key={`${size}-${single}`}>
                <g transform={`translate(${x} ${t.y + (48 - size) * t.scale * 0.795}) scale(${s})`}>
                  <Mark ink={c.ink} accent={single ? c.ink : ACCENT} />
                </g>
                <text x={x + 12.5 * s} y={t.y + 48 * t.scale + t.label * 1.9} style={mono(t.label, c.mute)}>
                  {label}
                </text>
              </g>
            );
            x += Math.max(size * t.scale * 0.9, label.length * 0.62 * t.label) + t.gap;
            return node;
          });
        })()}
        {narrow ? (
          <g>
            <text x={L.tests.x} y={L.tests.y + 174} style={mono(22, c.ink)}>CHOSEN FROM FOUR CANDIDATES</text>
            <text x={L.tests.x} y={L.tests.y + 206} style={mono(22, c.mute)}>DECIDING TESTS: 16 PX, 1 COLOUR</text>
          </g>
        ) : (
          <g>
            <text x={w - L.tests.x} y={L.tests.y + 18} textAnchor="end" style={mono(15, c.ink)}>CHOSEN FROM FOUR CANDIDATES</text>
            <text x={w - L.tests.x} y={L.tests.y + 44} textAnchor="end" style={mono(15, c.mute)}>THE DECIDING TESTS: 16 PX, ONE COLOUR</text>
          </g>
        )}
      </g>
    </svg>
  );
};
