// Tealucent in seven seconds, on one stage that keeps transforming: the whole design rests on one colour
// in a few steps (teal + translucent); those steps become the booking rows, translucent over a month that
// stays readable; and the rows become the office, where a team sorts itself into office booking, remote work
// and holiday. Token names and booking labels are from the Figma file; the steps are drawn between the house
// ground and ink, and the month, the team and the desk icon are an illustration.
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { ActWord, Labels, type Act } from '../parts';
import { seeded } from '../random';
import { fonts, palettes, progress, SIZE, stepped, type Palette, type Theme, POSTER_VIEW } from '../style';

export const TEALUCENT_FRAMES = 210;

export const TEALUCENT_ACTS: Act[] = [
  { word: 'COLOUR', from: 0, to: 64 },
  { word: 'LAYERS', from: 64, to: 136 },
  { word: 'OFFICE', from: 136, to: Infinity },
];

export type Rect = { x: number; y: number; w: number; h: number };
type Icon = 'desks' | 'plane' | 'wave';

/** The real global tokens. The three solid steps become the three booking types; the translucent one, their surface. */
export const STEPS = [
  { token: 'teal_85', share: 0.85 },
  { token: 'teal_75', share: 0.75 },
  { token: 'teal_20', share: 0.2 },
];
export const TRANS = { token: 'trans_20G50', share: 0.2 };

/** Booking types from the file, in the order of the steps above. */
export const TYPES: { label: string; icon: Icon; people: number }[] = [
  { label: 'office booking', icon: 'desks', people: 8 },
  { label: 'remote work', icon: 'plane', people: 6 },
  { label: 'holiday', icon: 'wave', people: 4 },
];

/** Mix two #rrggbb colours: 0 gives a, 1 gives b. */
export const mix = (a: string, b: string, t: number) => {
  const channel = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  const rgb = [0, 1, 2].map((i) => Math.round(channel(a, i) + (channel(b, i) - channel(a, i)) * t));
  return `rgb(${rgb.join(',')})`;
};
/** A step of the one colour, between the ground (0) and the ink (1). */
export const step = (c: Palette, share: number) => mix(c.ground, c.ink, share);
/** Marks on a step: light steps carry ink, strong steps the ground. */
export const on = (c: Palette, share: number) => (share >= 0.5 ? c.ground : c.ink);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const between = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});
/** Transformations between acts are calm: eased at both ends. */
const calm = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

/** Material "flight takeoff", the icon of the remote-work row, on a 24-unit grid. */
const PLANE =
  'M2.5 19h19v2h-19zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 1.82 3.16.77 1.33 1.6-.43 5.31-1.42 4.35-1.16L21 11.49c.81-.23 1.28-1.05 1.07-1.85z';

export const RowIcon = ({ kind, r, color }: { kind: Icon; r: Rect; color: string }) => {
  const s = r.w;
  if (kind === 'plane') {
    return <path d={PLANE} transform={`translate(${r.x + s * 0.2} ${r.y + s * 0.2}) scale(${(s * 0.6) / 24})`} fill={color} />;
  }
  if (kind === 'desks') {
    const cell = s * 0.2;
    return (
      <g fill={color}>
        {[0, 1].map((col) =>
          [0, 1].map((row) => (
            <rect key={`${col}${row}`} x={r.x + s * 0.27 + col * cell * 1.3} y={r.y + s * 0.27 + row * cell * 1.3} width={cell} height={cell} />
          )),
        )}
      </g>
    );
  }
  const cx = r.x + s / 2;
  const cy = r.y + s / 2;
  const w = s * 0.56;
  const wave = (dy: number) =>
    `M ${cx - w / 2} ${cy + dy} q ${w / 8} ${-s * 0.1} ${w / 4} 0 t ${w / 4} 0 t ${w / 4} 0 t ${w / 4} 0`;
  return (
    <g fill="none" stroke={color} strokeWidth={s * 0.06} strokeLinecap="round">
      <path d={wave(-s * 0.08)} />
      <path d={wave(s * 0.12)} />
    </g>
  );
};

// Act 1: one swatch, split into the three steps and the translucent one.
const SWATCH = { y: 300, h: 280 };
const columnAt = (i: number, split: number): Rect => ({
  x: lerp(64 + i * 168, 64 + i * 174, split),
  y: SWATCH.y,
  w: lerp(168, 150, split),
  h: SWATCH.h,
});

// Act 2: the steps as booking rows over a month.
const GRID = { x: 64, y: 304, col: 96, row: 56 };
export const TODAY = 18;
/** The rows lie exactly on weeks 1, 3 and 5, so the dates in the corners stay clear of their text. */
const ROW_Y = [304, 416, 528];
const square2 = (k: number): Rect => ({ x: 104, y: ROW_Y[k], w: 56, h: 56 });
const body2 = (k: number): Rect => ({ x: 160, y: ROW_Y[k], w: 536, h: 56 });
/** Fragment Mono advances 0.6 em, so right-aligned text can still move with a start anchor. */
const endAt = (end: number, text: string, size: number) => end - text.length * size * 0.6;

// Act 3: the rows as the three groups, standing on the month as the office.
const groupX = (k: number) => 64 + k * 232;
const square3 = (k: number): Rect => ({ x: groupX(k) + 12, y: 316, w: 48, h: 48 });
const body3 = (k: number): Rect => ({ x: groupX(k), y: 304, w: 208, h: 280 });

/** The red frame: around the four steps, then on today, then around today's office. */
const RED_BOX: Rect = { x: 54, y: 290, w: 692, h: 300 };
const RED_TODAY: Rect = { x: GRID.x + (TODAY % 7) * GRID.col + 3, y: GRID.y + Math.floor(TODAY / 7) * GRID.row + 3, w: 90, h: 50 };
const RED_OFFICE: Rect = { x: 54, y: 294, w: 692, h: 300 };

const TEAM = (() => {
  const random = seeded(19);
  const people = TYPES.flatMap((type, k) => Array.from({ length: type.people }, () => k));
  for (let i = people.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [people[i], people[j]] = [people[j], people[i]];
  }
  const seat = [0, 0, 0];
  return people.map((k, i) => {
    const n = seat[k]++;
    return {
      k,
      from: { x: 82 + i * 37.4, y: 646 },
      to: { x: groupX(k) + 104 + ((n % 3) - 1) * 56, y: 470 + Math.floor(n / 3) * 48 },
    };
  });
})();

export const Tealucent = ({ theme }: { theme: Theme }) => {
  const f = useCurrentFrame();
  const c = palettes[theme];
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };
  const ink = { fontFamily: fonts.mono, fill: c.ink };

  // Act 1: the swatch comes in like a print out of a slot, then splits and clicks into its steps.
  const printed = stepped(progress(f, 3, 10), 5);
  const split = progress(f, 18, 30);
  const stepIn = (i: number) => stepped(progress(f, 22 + i * 3, 30 + i * 3), 3);
  // Act 3: the month steps back so the people read first.
  const office = calm(f, 140, 158);

  const redDrawn = progress(f, 40, 52);
  const red = between(between(RED_BOX, RED_TODAY, calm(f, 84, 104)), RED_OFFICE, calm(f, 138, 160));
  const redPerimeter = 2 * (RED_BOX.w + RED_BOX.h);

  return (
    <AbsoluteFill style={{ backgroundColor: c.ground }}>
      <svg width={SIZE.width} height={SIZE.height} viewBox={POSTER_VIEW}>
        <defs>
          <pattern id="tealucent-hatch" width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1={0} y1={0} x2={0} y2={12} stroke={c.ink} strokeWidth={3} />
          </pattern>
          <clipPath id="tealucent-print">
            <rect x={0} y={SWATCH.y} width={800} height={f >= 10 ? 1000 : SWATCH.h * printed} />
          </clipPath>
          <clipPath id="tealucent-sentence">
            <rect x={0} y={664} width={800} height={130} />
          </clipPath>
        </defs>

        <Labels frame={f} project="Tealucent" acts={TEALUCENT_ACTS} palette={c} />
        <ActWord frame={f} acts={TEALUCENT_ACTS} palette={c} />

        {/* The month the rows sit on (act 2); in act 3 it stays as the office floor, quieter. */}
        <g opacity={1 - office * 0.45}>
          {Array.from({ length: 8 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={GRID.x + i * GRID.col}
              x2={GRID.x + i * GRID.col}
              y1={GRID.y}
              y2={GRID.y + 5 * GRID.row * progress(f, 70 + i, 80 + i)}
              stroke={c.hair}
              strokeWidth={2}
            />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <line
              key={`h${i}`}
              x1={GRID.x}
              x2={GRID.x + 7 * GRID.col * progress(f, 70 + i, 80 + i)}
              y1={GRID.y + i * GRID.row}
              y2={GRID.y + i * GRID.row}
              stroke={c.hair}
              strokeWidth={2}
            />
          ))}
          {Array.from({ length: 35 }, (_, k) => {
            const row = Math.floor(k / 7);
            const next = k >= 31;
            const color = k === TODAY ? mix(c.signal, c.mute, office) : next ? c.hair : c.mute;
            return (
              <text
                key={k}
                x={GRID.x + (k % 7) * GRID.col + 8}
                y={GRID.y + row * GRID.row + 19}
                fontSize={15}
                opacity={stepped(progress(f, 76 + row * 2, 78 + row * 2), 1) * (1 - office * 0.5)}
                style={{ fontFamily: fonts.mono, fill: color }}
              >
                {String(next ? k - 30 : k + 1).padStart(2, '0')}
              </text>
            );
          })}
        </g>

        {/* The red frame holds the four steps together (act 1), shrinks onto today (act 2), then steps back. */}
        <rect
          x={red.x}
          y={red.y}
          width={red.w}
          height={red.h}
          fill="none"
          stroke={mix(c.signal, c.mute, office)}
          strokeWidth={3}
          strokeDasharray={redDrawn < 1 ? redPerimeter : undefined}
          strokeDashoffset={redDrawn < 1 ? redPerimeter * (1 - redDrawn) : undefined}
          opacity={redDrawn > 0 ? 1 : 0}
        />

        {/* The translucent step: one column in act 1, the surface of the three rows in act 2, the three groups in act 3. */}
        <g clipPath="url(#tealucent-print)">
          {TYPES.map((type, k) => {
            // Whole pixels, so the three thirds read as one column until they part.
            const top = Math.round(SWATCH.y + (k * SWATCH.h) / 3);
            const third: Rect = { ...columnAt(3, split), y: top, h: Math.round(SWATCH.y + ((k + 1) * SWATCH.h) / 3) - top };
            const r = between(between(third, body2(k), calm(f, 66 + k * 3, 88 + k * 3)), body3(k), calm(f, 136 + k * 3, 158 + k * 3));
            const see = stepIn(3);
            const hatch = see * (1 - calm(f, 66, 80));
            const edge = calm(f, 70, 86);
            return (
              <g key={type.label}>
                {hatch > 0 && <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="url(#tealucent-hatch)" opacity={hatch * 0.5} />}
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  fill={step(c, lerp(1, TRANS.share, see))}
                  fillOpacity={1 - see * 0.45}
                  stroke={c.ink}
                  strokeWidth={2}
                  strokeOpacity={edge}
                />
              </g>
            );
          })}

          {/* The three solid steps: columns in act 1, the icon squares of the rows, the heads of the groups. */}
          {STEPS.map((s, k) => {
            const r = between(between(columnAt(k, split), square2(k), calm(f, 64 + k * 3, 86 + k * 3)), square3(k), calm(f, 138 + k * 3, 158 + k * 3));
            const share = lerp(1, s.share, stepIn(k));
            const icon = stepped(progress(f, 84 + k * 2, 88 + k * 2), 1);
            return (
              <g key={s.token}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={step(c, share)} />
                {icon > 0 && (
                  <g opacity={icon}>
                    <RowIcon kind={TYPES[k].icon} r={r} color={on(c, s.share)} />
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Token names travel with their steps: under the columns, inside the rows, in the group heads. */}
        {[...STEPS, TRANS].map((s, i) => {
          const start = { x: 64 + i * 174, y: SWATCH.y + SWATCH.h + 38 };
          const row = i < 3 ? { x: endAt(684, s.token, 18), y: ROW_Y[i] + 42 } : { x: endAt(696, s.token, 18), y: 612 };
          const head = i < 3 ? { x: groupX(i) + 12, y: 420 } : row;
          const t2 = calm(f, 70 + i * 2, 90 + i * 2);
          const t3 = calm(f, 140 + i * 2, 160 + i * 2);
          return (
            <text
              key={s.token}
              x={lerp(lerp(start.x, row.x, t2), head.x, t3)}
              y={lerp(lerp(start.y, row.y, t2), head.y, t3)}
              fontSize={lerp(lerp(20, 18, t2), 16, t3)}
              opacity={stepped(progress(f, 32 + i * 2, 34 + i * 2), 1)}
              style={{ ...ink, fill: i < 3 ? mix(c.ink, c.mute, t3) : c.ink }}
            >
              {s.token}
            </text>
          );
        })}

        {/* Booking labels from the file: in the rows, then as the heads of the groups. */}
        {TYPES.map((type, k) => {
          const t3 = calm(f, 140 + k * 3, 160 + k * 3);
          return (
            <text
              key={type.label}
              x={lerp(180, groupX(k) + 12, t3)}
              y={lerp(ROW_Y[k] + 42, 396, t3)}
              fontSize={lerp(26, 20, t3)}
              opacity={stepped(progress(f, 86 + k * 2, 90 + k * 2), 1)}
              style={ink}
            >
              {type.label}
            </text>
          );
        })}

        {/* Act 3: the team sorts itself into the groups; who is where reads at a glance. */}
        {TEAM.map((person, i) => {
          const appear = stepped(progress(f, 156, 160), 3);
          if (!appear) return null;
          const start = 162 + i * 0.8;
          const move = calm(f, start, start + 16);
          const arrived = f >= start + 16;
          return (
            <circle
              key={i}
              cx={lerp(person.from.x, person.to.x, move)}
              cy={lerp(person.from.y, person.to.y, move)}
              r={14}
              opacity={appear}
              fill={arrived ? step(c, STEPS[person.k].share) : c.ground}
              stroke={c.ink}
              strokeWidth={2.5}
            />
          );
        })}

        <g clipPath="url(#tealucent-sentence)">
          {[
            [
              <tspan key="a" style={{ fill: c.signal }}>
                Transparency
              </tspan>,
              ' about what is',
            ],
            ['going on in the office.'],
          ].map((line, i) => {
            const rise = progress(f, 176 + i * 8, 192 + i * 8);
            return (
              <text
                key={i}
                x={64}
                y={716 + i * 56 + (1 - rise) * 140}
                fontSize={44}
                style={{ fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -1, fill: c.ink }}
              >
                {line}
              </text>
            );
          })}
        </g>

        {/* One caption line, changing with the acts. */}
        <text x={64} y={860} fontSize={20} opacity={progress(f, 44, 52) * (1 - progress(f, 62, 68))} style={mono}>
          THE WHOLE DESIGN: ONE COLOUR (TEAL), IN STEPS
        </text>
        <text x={64} y={860} fontSize={20} opacity={progress(f, 100, 108) * (1 - progress(f, 132, 138))} style={mono}>
          TRANSLUCENT ROWS KEEP THE STRUCTURE VISIBLE
        </text>
        <text x={64} y={860} fontSize={18} opacity={progress(f, 196, 204)} style={mono}>
          FOR GOCONUT’S OFFICE MANAGEMENT TOOL
        </text>
      </svg>
    </AbsoluteFill>
  );
};
