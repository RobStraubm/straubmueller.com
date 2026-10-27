// Tealucent as the opening of its case page (version J): the film's three acts across the whole width, with no
// ground of its own. The page sets the title and the summary as real text in the same 1600 × 900 box. The title
// spells out its own name: under "Teal" a solid bar, under "lucent" a translucent one, overlapping at the shared
// "l", where the solid bar shows through the translucent one. That pair is the key to everything on the right:
// one swatch splits into the three steps of the teal and the translucent one (COLOUR); the steps become booking
// rows over a month, translucent so the dates stay readable (LAYERS); the rows become the office, where the team
// sorts itself into office booking, remote work and holiday (OFFICE). Left, under the summary, the column says
// what each act means, and in the last act the film's sentence. Token names and booking labels are the film's
// (from the Figma file); the steps are drawn between the house ground and ink, and the month, the team and the
// icons are an illustration, as in the film.
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import type { Palette } from '../style';
import { fonts, progress, stepped } from '../style';
import { seeded } from '../random';
import { mix, on, RowIcon, step, STEPS, TODAY, TRANS, TYPES, type Rect } from '../tealucent/Tealucent';

/** Where the letters of the title sit, measured on the stage: "Teal" ends with its "l", "lucent" starts with it. */
const NAME = { teal: [0, 309], lucent: [269, 739], y: 206, h: 12 };

/** The month on the right; in act 1 the swatch fills the same field. */
const GRID = { x: 800, y: 214, col: 112, row: 92 };
const WIDTH = 7 * GRID.col;
const HEIGHT = 5 * GRID.row;
/** The left column under the summary. */
const CAPTION_Y = 540;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const between = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});
/** Transformations between acts are calm: eased at both ends, as in the film. */
const calm = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
/** Fragment Mono advances 0.6 em, so right-aligned text can still move with a start anchor. */
const endAt = (end: number, text: string, size: number) => end - text.length * size * 0.6;

// Act 1: one swatch over the whole field, split into four columns.
const COLUMN_GAP = 16;
const columnAt = (i: number, split: number): Rect => {
  const w = lerp(WIDTH / 4, (WIDTH - 3 * COLUMN_GAP) / 4, split);
  return { x: GRID.x + i * (w + COLUMN_GAP * split), y: GRID.y, w, h: HEIGHT };
};

// Act 2: the steps as booking rows on weeks 1, 3 and 5. The square sits inside the first day, clear of its date;
// the body runs from the second day on, so the dates in the corners stay clear of the label.
const ROW_Y = [0, 2, 4].map((week) => GRID.y + week * GRID.row);
const square2 = (k: number): Rect => ({ x: GRID.x + 36, y: ROW_Y[k] + 8, w: 76, h: 76 });
const body2 = (k: number): Rect => ({ x: GRID.x + GRID.col, y: ROW_Y[k], w: WIDTH - GRID.col - 16, h: GRID.row });
const LABEL_SIZE = 30;
const TOKEN_SIZE = 20;

// Act 3: the rows as the three groups, standing on the month as the office.
const GROUP = { pitch: 272, w: 240 };
const groupX = (k: number) => GRID.x + k * GROUP.pitch;
const square3 = (k: number): Rect => ({ x: groupX(k) + 16, y: GRID.y + 16, w: 64, h: 64 });
const body3 = (k: number): Rect => ({ x: groupX(k), y: GRID.y, w: GROUP.w, h: HEIGHT });

/** The red frame: around the four steps, then on today, then around today's office. */
const RED_BOX: Rect = { x: GRID.x - 12, y: GRID.y - 12, w: WIDTH + 24, h: HEIGHT + 24 };
const RED_TODAY: Rect = {
  x: GRID.x + (TODAY % 7) * GRID.col + 3,
  y: GRID.y + Math.floor(TODAY / 7) * GRID.row + 3,
  w: GRID.col - 6,
  h: GRID.row - 6,
};
const RED_OFFICE: Rect = { x: GRID.x - 12, y: GRID.y - 12, w: 2 * GROUP.pitch + GROUP.w + 24, h: HEIGHT + 24 };

/** The film's team, shuffled with the same seed, so the same people end up in the same groups; they wait in a
 * row under the month and walk into their group. */
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
      from: { x: GRID.x + 22 + i * ((WIDTH - 44) / 17), y: GRID.y + HEIGHT + 82 },
      to: { x: groupX(k) + GROUP.w / 2 + ((n % 3) - 1) * 68, y: GRID.y + 206 + Math.floor(n / 3) * 68 },
    };
  });
})();

export const TealucentStage = ({ palette: c }: { palette: Palette }) => {
  const f = useCurrentFrame();
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };
  const ink = { fontFamily: fonts.mono, fill: c.ink };

  // Act 1: the name first, then the swatch comes in like a print out of a slot, splits and clicks into its steps.
  const teal = progress(f, 0, 10);
  const lucent = progress(f, 5, 15);
  const printed = stepped(progress(f, 10, 18), 5);
  const split = progress(f, 20, 32);
  const stepIn = (i: number) => stepped(progress(f, 24 + i * 3, 32 + i * 3), 3);
  // Act 3: the month steps back so the people read first.
  const office = calm(f, 140, 158);

  const redDrawn = progress(f, 40, 52);
  const red = between(between(RED_BOX, RED_TODAY, calm(f, 84, 104)), RED_OFFICE, calm(f, 138, 160));
  const redPerimeter = 2 * (RED_BOX.w + RED_BOX.h);

  // The film's caption lines, broken for the column.
  const captions = [
    { lines: ['THE WHOLE DESIGN:', 'ONE COLOUR (TEAL), IN STEPS'], show: progress(f, 44, 52) * (1 - progress(f, 62, 68)) },
    { lines: ['TRANSLUCENT ROWS KEEP', 'THE STRUCTURE VISIBLE'], show: progress(f, 100, 108) * (1 - progress(f, 132, 138)) },
    { lines: ['FOR GOCONUT’S OFFICE', 'MANAGEMENT TOOL'], show: progress(f, 196, 204) },
  ];

  return (
    <svg viewBox="0 0 1600 900" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <defs>
        <pattern id="tealucent-stage-hatch" width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={12} stroke={c.ink} strokeWidth={3} />
        </pattern>
        <clipPath id="tealucent-stage-print">
          <rect x={0} y={GRID.y} width={1600} height={f >= 18 ? 900 : HEIGHT * printed} />
        </clipPath>
        <clipPath id="tealucent-stage-sentence">
          <rect x={0} y={CAPTION_Y + 52} width={790} height={170} />
        </clipPath>
      </defs>

      {/* The name under the title: teal solid, translucent see-through, overlapping at the "l" they share. */}
      <rect x={NAME.teal[0]} y={NAME.y} width={(NAME.teal[1] - NAME.teal[0]) * teal} height={NAME.h} fill={c.ink} />
      {lucent > 0 && (
        <rect
          x={NAME.lucent[0]}
          y={NAME.y}
          width={(NAME.lucent[1] - NAME.lucent[0]) * lucent}
          height={NAME.h}
          fill={step(c, TRANS.share)}
          fillOpacity={0.55}
          stroke={c.ink}
          strokeWidth={1.5}
        />
      )}
      <text x={NAME.teal[0]} y={NAME.y + 42} fontSize={19} opacity={stepped(progress(f, 8, 10), 1)} style={mono}>
        TEAL
      </text>
      <text x={NAME.lucent[0]} y={NAME.y + 42} fontSize={19} opacity={stepped(progress(f, 13, 15), 1)} style={mono}>
        TRANSLUCENT
      </text>

      {/* The month the rows sit on (act 2); in act 3 it stays as the office floor, quieter. */}
      <g opacity={1 - office * 0.45}>
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={GRID.x + i * GRID.col}
            x2={GRID.x + i * GRID.col}
            y1={GRID.y}
            y2={GRID.y + HEIGHT * progress(f, 70 + i, 80 + i)}
            stroke={c.hair}
            strokeWidth={2}
          />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={GRID.x}
            x2={GRID.x + WIDTH * progress(f, 70 + i, 80 + i)}
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
              x={GRID.x + (k % 7) * GRID.col + 10}
              y={GRID.y + row * GRID.row + 26}
              fontSize={18}
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
      <g clipPath="url(#tealucent-stage-print)">
        {TYPES.map((type, k) => {
          // Whole units, so the three thirds read as one column until they part.
          const top = Math.round(GRID.y + (k * HEIGHT) / 3);
          const third: Rect = { ...columnAt(3, split), y: top, h: Math.round(GRID.y + ((k + 1) * HEIGHT) / 3) - top };
          const r = between(between(third, body2(k), calm(f, 66 + k * 3, 88 + k * 3)), body3(k), calm(f, 136 + k * 3, 158 + k * 3));
          const see = stepIn(3);
          const hatch = see * (1 - calm(f, 66, 80));
          const edge = calm(f, 70, 86);
          return (
            <g key={type.label}>
              {hatch > 0 && <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="url(#tealucent-stage-hatch)" opacity={hatch * 0.5} />}
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
        const start = { x: columnAt(i, 1).x, y: GRID.y + HEIGHT + 40 };
        const row =
          i < 3
            ? { x: endAt(GRID.x + WIDTH - 40, s.token, TOKEN_SIZE), y: ROW_Y[i] + 58 }
            : { x: endAt(GRID.x + WIDTH, s.token, TOKEN_SIZE), y: GRID.y + HEIGHT + 40 };
        const head = i < 3 ? { x: groupX(i) + 16, y: GRID.y + 150 } : row;
        const t2 = calm(f, 70 + i * 2, 90 + i * 2);
        const t3 = calm(f, 140 + i * 2, 160 + i * 2);
        return (
          <text
            key={s.token}
            x={lerp(lerp(start.x, row.x, t2), head.x, t3)}
            y={lerp(lerp(start.y, row.y, t2), head.y, t3)}
            fontSize={lerp(lerp(22, TOKEN_SIZE, t2), 19, t3)}
            opacity={stepped(progress(f, 34 + i * 2, 36 + i * 2), 1)}
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
            x={lerp(GRID.x + GRID.col + 22, groupX(k) + 16, t3)}
            y={lerp(ROW_Y[k] + 58, GRID.y + 120, t3)}
            fontSize={lerp(LABEL_SIZE, 24, t3)}
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
            r={20}
            opacity={appear}
            fill={arrived ? step(c, STEPS[person.k].share) : c.ground}
            stroke={c.ink}
            strokeWidth={3}
          />
        );
      })}

      {/* Left column under the summary: what each act means. */}
      {captions.map((caption, k) =>
        caption.show > 0 ? (
          <g key={k} opacity={caption.show}>
            {caption.lines.map((text, i) => (
              <text key={text} x={0} y={CAPTION_Y + i * 30} fontSize={20} style={mono}>
                {text}
              </text>
            ))}
          </g>
        ) : null,
      )}

      {/* Act 3: the film's sentence rises under the caption, its first word in red. */}
      <g clipPath="url(#tealucent-stage-sentence)">
        {[
          [
            <tspan key="a" style={{ fill: c.signal }}>
              Transparency
            </tspan>,
            ' about what is',
          ],
          ['going on in the office.'],
        ].map((words, i) => {
          const rise = progress(f, 176 + i * 8, 192 + i * 8);
          return (
            <text
              key={i}
              x={0}
              y={CAPTION_Y + 120 + i * 66 + (1 - rise) * 170}
              fontSize={56}
              style={{ fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -1.5, fill: c.ink }}
            >
              {words}
            </text>
          );
        })}
      </g>
    </svg>
  );
};
