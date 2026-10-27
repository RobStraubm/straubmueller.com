// SayFit in seven seconds, on one stage that never empties: a spoken meal is typed out and a first LLM step
// takes its foods out of the sentence; the sentence moves aside and one food is searched with several
// queries among 1.88 million entries, where one match is picked; then the search steps back and the test
// result is added below it. The sentence and the numbers are from the team's slides; the dot field stands
// for the database, its layout is an illustration.
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ActWord, Labels, type Act } from '../parts';
import { seeded } from '../random';
import { fonts, palettes, progress, SIZE, stepped, type Theme, POSTER_VIEW } from '../style';

export const SAYFIT_FRAMES = 210;

export const SAYFIT_ACTS: Act[] = [
  { word: 'SAY', from: 0, to: 64 },
  { word: 'MATCH', from: 64, to: 136 },
  { word: 'TEST', from: 136, to: Infinity },
];

const random = seeded(2603);

/** The example sentence from the slides, in two lines, and the foods the first LLM step takes out of it.
 * Each food lands in a box (y in act 1) and moves up into a column for the search (top in act 2). */
const SENTENCE = { x: 64, baselines: [404, 452], size: 30, lines: ['a bowl of ramen with pork belly', 'and a soft-boiled egg'] };
const CHAR = SENTENCE.size * 0.6;
const TYPED = SENTENCE.lines[0].length + 1 + SENTENCE.lines[1].length;
const ITEMS = [
  { name: 'RAMEN NOODLES', line: 0, from: 10, to: 15, y: 520, top: 404, w: 284 },
  { name: 'PORK BELLY', line: 0, from: 21, to: 31, y: 590, top: 472, w: 228 },
  { name: 'SOFT-BOILED EGG', line: 1, from: 6, to: 21, y: 660, top: 540, w: 318 },
];
const BOX_H = 56;
const PORK = ITEMS[1];

/** In act 2 the sentence and its voice shrink into the top left corner (scale about these origins). */
const ASIDE = { scale: 0.6, sentence: { y0: 374, y1: 326 }, voice: { y0: 312, y1: 292 } };

const VOICE = Array.from({ length: 40 }, (_, i) => 0.15 + 0.85 * random() * Math.abs(Math.sin(i * 0.55 + 0.4)));

/** The database as a field of dots, the three queries for one food, and the 20 candidates they pool. */
const FIELD = { x: 528, y: 396, cols: 14, rows: 17, pitch: 16 };
const DOTS = Array.from({ length: FIELD.cols * FIELD.rows }, (_, k) => ({
  col: k % FIELD.cols,
  x: FIELD.x + (k % FIELD.cols) * FIELD.pitch,
  y: FIELD.y + Math.floor(k / FIELD.cols) * FIELD.pitch,
}));
const FROM = { x: 64 + PORK.w, y: PORK.top + BOX_H / 2 };
const QUERIES = [
  { x: FIELD.x + 4 * FIELD.pitch, y: FIELD.y + 2 * FIELD.pitch },
  { x: FIELD.x + 8 * FIELD.pitch, y: FIELD.y + 8 * FIELD.pitch },
  { x: FIELD.x + 5 * FIELD.pitch, y: FIELD.y + 14 * FIELD.pitch },
];
const CANDIDATES = DOTS.map((dot) => ({
  ...dot,
  score: Math.min(...QUERIES.map((q) => Math.hypot(dot.x - q.x, dot.y - q.y))) + random() * 9,
}))
  .sort((a, b) => a.score - b.score)
  .slice(0, 20);
const PICK = CANDIDATES.filter((dot) => !QUERIES.some((q) => q.x === dot.x && q.y === dot.y)).sort(
  (a, b) => Math.hypot(a.x - QUERIES[1].x, a.y - QUERIES[1].y) - Math.hypot(b.x - QUERIES[1].x, b.y - QUERIES[1].y),
)[0];

/** Confident matches without and with the LLM steps, across 29 test cases in 11 runs (slides 9 and 10),
 * added under the search in act 3: the share as a number, and two bars. */
const RESULT = { before: 12, after: 71, x: 400, width: 336 };

const linear = (frame: number, from: number, to: number) => Math.min(1, Math.max(0, (frame - from) / (to - from)));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const drawn = (frame: number, start: number, length: number, span = 12) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress(frame, start, start + span)),
});
/** Scale a group by `s` about the left margin, moving its reference line from y0 to y. */
const aside = (s: number, y0: number, y: number) => `translate(64 ${y}) scale(${s}) translate(-64 ${-y0})`;

export const SayFit = ({ theme }: { theme: Theme }) => {
  const f = useCurrentFrame();
  const c = palettes[theme];
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };
  const item = { fontFamily: fonts.sans, fontWeight: 700, letterSpacing: -0.5, fill: c.ink };

  const typed = Math.round(TYPED * linear(f, 16, 40));
  // Act 2 moves the sentence aside and the foods into a column; act 3 lets the whole search step back.
  const move = progress(f, 64, 84);
  const scale = lerp(1, ASIDE.scale, move);
  const back = 1 - 0.62 * progress(f, 136, 150);
  const matched = f >= 118;

  const rise = progress(f, 156, 186);
  const share = Math.round(lerp(RESULT.before, RESULT.after, rise));
  const legend = 1 - progress(f, 132, 140);

  return (
    <AbsoluteFill style={{ backgroundColor: c.ground }}>
      <svg width={SIZE.width} height={SIZE.height} viewBox={POSTER_VIEW}>
        <Labels frame={f} project="SayFit" acts={SAYFIT_ACTS} palette={c} />
        <ActWord frame={f} acts={SAYFIT_ACTS} palette={c} />

        <g opacity={back}>
          {/* The voice and the typed sentence: full size in act 1, in the corner from act 2 on. */}
          <g opacity={lerp(1, 0.55, move)}>
            <g transform={aside(scale, ASIDE.voice.y0, lerp(ASIDE.voice.y0, ASIDE.voice.y1, move))}>
              {VOICE.map((level, i) => {
                if (f < 4 + i * 0.3) return null;
                const h = Math.max(2, level * 30);
                return <rect key={i} x={64 + i * 8} y={312 - h} width={4} height={h * 2} fill={c.ink} />;
              })}
            </g>
            <g transform={aside(scale, ASIDE.sentence.y0, lerp(ASIDE.sentence.y0, ASIDE.sentence.y1, move))}>
              {SENTENCE.lines.map((line, k) => {
                const shown = k === 0 ? typed : typed - SENTENCE.lines[0].length - 1;
                return (
                  <text
                    key={k}
                    x={SENTENCE.x}
                    y={SENTENCE.baselines[k]}
                    fontSize={SENTENCE.size}
                    xmlSpace="preserve"
                    style={{ fontFamily: fonts.mono, fill: c.ink }}
                  >
                    {line.slice(0, Math.max(0, shown))}
                  </text>
                );
              })}
              {ITEMS.map((food, i) => {
                const x0 = SENTENCE.x + food.from * CHAR;
                const x1 = SENTENCE.x + food.to * CHAR;
                const y = SENTENCE.baselines[food.line] + 10;
                return (
                  <line
                    key={food.name}
                    x1={x0}
                    x2={x1}
                    y1={y}
                    y2={y}
                    stroke={c.signal}
                    strokeWidth={3}
                    style={drawn(f, 40 + i * 2, x1 - x0, 6)}
                  />
                );
              })}
            </g>
          </g>

          {/* The foods: each phrase lifts out of the sentence into its box, then the boxes form a column. */}
          {ITEMS.map((food, i) => {
            const lift = progress(f, 46 + i * 3, 54 + i * 3);
            const landed = stepped(progress(f, 54 + i * 3, 55 + i * 3), 1);
            if (!lift) return null;
            if (!landed)
              return (
                <text
                  key={food.name}
                  x={lerp(SENTENCE.x + food.from * CHAR, 84, lift)}
                  y={lerp(SENTENCE.baselines[food.line], food.y + 38, lift)}
                  fontSize={SENTENCE.size}
                  style={{ fontFamily: fonts.mono, fill: c.signal }}
                >
                  {SENTENCE.lines[food.line].slice(food.from, food.to)}
                </text>
              );
            const y = lerp(food.y, food.top, move);
            const pork = food === PORK;
            return (
              <g key={food.name} opacity={pork ? 1 : lerp(1, 0.4, move)}>
                <rect
                  x={64}
                  y={y}
                  width={food.w}
                  height={BOX_H}
                  fill="none"
                  stroke={pork && matched ? c.signal : c.ink}
                  strokeWidth={pork && matched ? 3 : 2}
                />
                <text x={84} y={y + 38} fontSize={28} style={item}>
                  {food.name}
                </text>
              </g>
            );
          })}

          {/* Act 2 on: the database, three queries for one food, 20 pooled candidates. */}
          <g opacity={progress(f, 66, 70)}>
            {DOTS.map((dot, k) =>
              f >= 70 + dot.col * 0.9 ? <circle key={k} cx={dot.x} cy={dot.y} r={2.2} fill={c.mute} /> : null,
            )}
            {QUERIES.map((q, i) => {
              const length = Math.hypot(q.x - FROM.x, q.y - FROM.y);
              const at = 0.5;
              const lx = lerp(FROM.x, q.x, at);
              const ly = lerp(FROM.y, q.y, at);
              return (
                <g key={i}>
                  <line x1={FROM.x} y1={FROM.y} x2={q.x} y2={q.y} stroke={c.ink} strokeWidth={2.5} style={drawn(f, 84 + i * 2, length, 12)} />
                  <circle cx={q.x} cy={q.y} r={5} fill="none" stroke={c.ink} strokeWidth={2} opacity={stepped(progress(f, 96 + i * 2, 97 + i * 2), 1)} />
                  <g opacity={progress(f, 90 + i * 2, 96 + i * 2)}>
                    <rect x={lx - 42} y={ly - 13} width={84} height={26} fill={c.ground} />
                    <text x={lx} y={ly + 6} fontSize={17} textAnchor="middle" style={{ ...mono, fill: c.ink }}>
                      {`QUERY ${i + 1}`}
                    </text>
                  </g>
                </g>
              );
            })}
            {CANDIDATES.map((dot, k) =>
              f >= 100 + k * 0.7 ? <circle key={k} cx={dot.x} cy={dot.y} r={5.5} fill={c.ink} /> : null,
            )}
          </g>
        </g>
        {/* The pick stays at full strength when the search steps back: it is what the test counts. */}
        {matched && <circle cx={PICK.x} cy={PICK.y} r={10} fill={c.signal} />}

        <text x={64} y={880} fontSize={20} opacity={progress(f, 52, 58) * (1 - progress(f, 60, 66))} style={mono}>
          AN LLM SEPARATES THE ITEMS
        </text>
        <g opacity={legend}>
          <g opacity={progress(f, 74, 80)}>
            <circle cx={74} cy={830} r={3} fill={c.mute} />
            <text x={96} y={836} fontSize={18} style={mono}>
              1.88 M FOOD ENTRIES · USDA + OPEN FOOD FACTS
            </text>
          </g>
          <g opacity={progress(f, 100, 106)}>
            <circle cx={74} cy={870} r={5.5} fill={c.ink} />
            <text x={96} y={876} fontSize={18} style={mono}>
              TOP 20 CANDIDATES, POOLED FROM 3 QUERIES
            </text>
          </g>
          <g opacity={progress(f, 114, 120)}>
            <circle cx={74} cy={910} r={8} fill={c.signal} />
            <text x={96} y={916} fontSize={18} style={mono}>
              A SECOND LLM STEP PICKS ONE, ESTIMATES THE GRAMS
            </text>
          </g>
        </g>

        {/* Act 3, added under the search: the share of confident matches, without and with the LLM steps. */}
        <g>
          <text x={64} y={712} fontSize={20} opacity={progress(f, 140, 146)} style={{ ...mono, fill: c.ink }}>
            CONFIDENT MATCHES
          </text>
          <text
            x={56}
            y={836}
            fontSize={120}
            opacity={progress(f, 144, 150)}
            style={{
              fontFamily: fonts.sans,
              fontWeight: 800,
              letterSpacing: -5,
              fill: c.ink,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {`${share} %`}
          </text>

          <text x={RESULT.x} y={742} fontSize={18} opacity={progress(f, 142, 146)} style={mono}>
            WITHOUT LLM
          </text>
          <rect
            x={RESULT.x}
            y={752}
            width={(RESULT.width * RESULT.before * progress(f, 144, 152)) / 100}
            height={24}
            fill={c.mute}
          />
          <text
            x={RESULT.x + (RESULT.width * RESULT.before) / 100 + 12}
            y={771}
            fontSize={18}
            opacity={progress(f, 150, 154)}
            style={{ ...mono, fill: c.ink }}
          >
            {`${RESULT.before} %`}
          </text>

          <text x={RESULT.x} y={806} fontSize={18} opacity={progress(f, 152, 156)} style={mono}>
            WITH LLM
          </text>
          {f >= 154 && (
            <>
              <rect x={RESULT.x} y={816} width={(RESULT.width * share) / 100} height={24} fill={c.signal} />
              <text
                x={RESULT.x + (RESULT.width * share) / 100 + 12}
                y={835}
                fontSize={18}
                style={{ ...mono, fill: c.ink, fontVariantNumeric: 'tabular-nums' }}
              >
                {`${share} %`}
              </text>
            </>
          )}

          <text x={64} y={900} fontSize={20} opacity={progress(f, 148, 154)} style={mono}>
            29 TEST CASES · 11 RUNS
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
