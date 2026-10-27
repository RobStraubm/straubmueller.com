// SayFit as the opening of its case page (version J): the film's three acts across the whole width, with no
// ground of its own. The page sets the title and the summary as real text in the same 1600 × 900 box; the title
// speaks: the voice runs out of it across the top, and on the right the sentence is typed out under it and a
// first LLM step takes the foods out. In act 2 the sentence moves aside and one food is searched with three
// queries in the database beside it; in act 3 the search steps back, the share of confident matches is set under
// the summary in the title's type, and the two bars are added under the search. Words and numbers are the film's.
import { useCurrentFrame } from 'remotion';
import type { Palette } from '../style';
import { fonts, progress, stepped } from '../style';
import { seeded } from '../random';

const random = seeded(2603);

/** Where the title ends and the middle of its letters: the voice leaves the title there. */
const MOUTH = { x: 488, y: 124 };
const VOICE = Array.from({ length: 84 }, (_, i) => 0.15 + 0.85 * random() * Math.abs(Math.sin(i * 0.55 + 0.4)));
const VOICE_PITCH = 13;

/** The example sentence from the slides and the foods the first LLM step takes out of it, as in the film.
 * Each food lands in a box (y in act 1) and moves up into a column for the search (top in act 2). */
const SENTENCE = { x: 720, baselines: [330, 388], size: 40, lines: ['a bowl of ramen with pork belly', 'and a soft-boiled egg'] };
const CHAR = SENTENCE.size * 0.615; // Fragment Mono's advance, measured on the stage
const TYPED = SENTENCE.lines[0].length + 1 + SENTENCE.lines[1].length;
const ITEMS = [
  { name: 'RAMEN NOODLES', line: 0, from: 10, to: 15, y: 470, top: 316, w: 300 },
  { name: 'PORK BELLY', line: 0, from: 21, to: 31, y: 546, top: 388, w: 240 },
  { name: 'SOFT-BOILED EGG', line: 1, from: 6, to: 21, y: 622, top: 460, w: 336 },
];
const BOX_H = 58;
const PORK = ITEMS[1];

/** In act 2 the sentence shrinks towards the voice, scaled about its left edge. */
const ASIDE = { scale: 0.6, y0: 330, y1: 240 };

/** The database as a field of dots beside the column, three queries for one food, the 20 candidates they pool. */
const FIELD = { x: 1124, y: 316, cols: 21, rows: 14, pitch: 22 };
const DOTS = Array.from({ length: FIELD.cols * FIELD.rows }, (_, k) => ({
  col: k % FIELD.cols,
  x: FIELD.x + (k % FIELD.cols) * FIELD.pitch,
  y: FIELD.y + Math.floor(k / FIELD.cols) * FIELD.pitch,
}));
const FROM = { x: SENTENCE.x + PORK.w, y: PORK.top + BOX_H / 2 };
const QUERIES = [
  { x: FIELD.x + 6 * FIELD.pitch, y: FIELD.y + 1 * FIELD.pitch },
  { x: FIELD.x + 11 * FIELD.pitch, y: FIELD.y + 6 * FIELD.pitch },
  { x: FIELD.x + 7 * FIELD.pitch, y: FIELD.y + 11 * FIELD.pitch },
];
const CANDIDATES = DOTS.map((dot) => ({
  ...dot,
  score: Math.min(...QUERIES.map((q) => Math.hypot(dot.x - q.x, dot.y - q.y))) + random() * 12,
}))
  .sort((a, b) => a.score - b.score)
  .slice(0, 20);
const PICK = CANDIDATES.filter((dot) => !QUERIES.some((q) => q.x === dot.x && q.y === dot.y)).sort(
  (a, b) => Math.hypot(a.x - QUERIES[1].x, a.y - QUERIES[1].y) - Math.hypot(b.x - QUERIES[1].x, b.y - QUERIES[1].y),
)[0];

/** Confident matches without and with the LLM steps, 29 test cases in 11 runs (slides 9 and 10): the share
 * under the summary, the two bars under the search. */
const RESULT = { before: 12, after: 71, x: SENTENCE.x, width: 760 };

const linear = (frame: number, from: number, to: number) => Math.min(1, Math.max(0, (frame - from) / (to - from)));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const drawn = (frame: number, start: number, length: number, span = 12) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress(frame, start, start + span)),
});

export const SayFitStage = ({ palette: c }: { palette: Palette }) => {
  const f = useCurrentFrame();
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
    <svg viewBox="0 0 1600 900" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <g opacity={back}>
        {/* The voice leaves the title and runs across the top; from act 2 on it is quieter. */}
        <g opacity={lerp(1, 0.55, move)} transform={`translate(0 ${MOUTH.y}) scale(1 ${lerp(1, 0.5, move)}) translate(0 ${-MOUTH.y})`}>
          {VOICE.map((level, i) => {
            if (f < 4 + i * 0.14) return null;
            const h = Math.max(2, level * 56);
            return <rect key={i} x={MOUTH.x + i * VOICE_PITCH} y={MOUTH.y - h} width={6} height={h * 2} fill={c.ink} />;
          })}
        </g>

        {/* The typed sentence, full size in act 1, small under the voice from act 2 on. */}
        <g
          opacity={lerp(1, 0.55, move)}
          transform={`translate(${SENTENCE.x} ${lerp(ASIDE.y0, ASIDE.y1, move)}) scale(${scale}) translate(${-SENTENCE.x} ${-ASIDE.y0})`}
        >
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
          {/* A block cursor rides along while the sentence is typed. */}
          {f < 44 && typed < TYPED && Math.floor(f / 6) % 2 === 0 && (
            <rect
              x={SENTENCE.x + (typed > SENTENCE.lines[0].length ? typed - SENTENCE.lines[0].length - 1 : typed) * CHAR}
              y={SENTENCE.baselines[typed > SENTENCE.lines[0].length ? 1 : 0] - 32}
              width={CHAR - 2}
              height={40}
              fill={c.ink}
            />
          )}
          {ITEMS.map((food, i) => {
            const x0 = SENTENCE.x + food.from * CHAR;
            const x1 = SENTENCE.x + food.to * CHAR;
            const y = SENTENCE.baselines[food.line] + 12;
            return (
              <line key={food.name} x1={x0} x2={x1} y1={y} y2={y} stroke={c.signal} strokeWidth={3} style={drawn(f, 40 + i * 2, x1 - x0, 6)} />
            );
          })}
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
                x={lerp(SENTENCE.x + food.from * CHAR, SENTENCE.x + 22, lift)}
                y={lerp(SENTENCE.baselines[food.line], food.y + 40, lift)}
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
                x={SENTENCE.x}
                y={y}
                width={food.w}
                height={BOX_H}
                fill="none"
                stroke={pork && matched ? c.signal : c.ink}
                strokeWidth={pork && matched ? 3 : 2}
              />
              <text x={SENTENCE.x + 22} y={y + 40} fontSize={30} style={item}>
                {food.name}
              </text>
            </g>
          );
        })}

        {/* Act 2 on: the database beside the column, three queries for one food, 20 pooled candidates. */}
        <g opacity={progress(f, 66, 70)}>
          {DOTS.map((dot, k) =>
            f >= 70 + dot.col * 0.6 ? <circle key={k} cx={dot.x} cy={dot.y} r={2.6} fill={c.mute} /> : null,
          )}
          {QUERIES.map((q, i) => {
            const length = Math.hypot(q.x - FROM.x, q.y - FROM.y);
            const lx = lerp(FROM.x, q.x, 0.58);
            const ly = lerp(FROM.y, q.y, 0.58);
            return (
              <g key={i}>
                <line x1={FROM.x} y1={FROM.y} x2={q.x} y2={q.y} stroke={c.ink} strokeWidth={2.5} style={drawn(f, 84 + i * 2, length, 12)} />
                <circle cx={q.x} cy={q.y} r={7} fill="none" stroke={c.ink} strokeWidth={2} opacity={stepped(progress(f, 96 + i * 2, 97 + i * 2), 1)} />
                <g opacity={progress(f, 90 + i * 2, 96 + i * 2)}>
                  <rect x={lx - 50} y={ly - 15} width={100} height={30} fill={c.ground} />
                  <text x={lx} y={ly + 7} fontSize={19} textAnchor="middle" style={{ ...mono, fill: c.ink }}>
                    {`QUERY ${i + 1}`}
                  </text>
                </g>
              </g>
            );
          })}
          {CANDIDATES.map((dot, k) => (f >= 100 + k * 0.7 ? <circle key={k} cx={dot.x} cy={dot.y} r={7} fill={c.ink} /> : null))}
        </g>
      </g>
      {/* The pick stays at full strength when the search steps back: it is what the test counts. */}
      {matched && <circle cx={PICK.x} cy={PICK.y} r={13} fill={c.signal} />}

      {/* Left column under the summary: what each act means. */}
      <text x={0} y={520} fontSize={19} opacity={progress(f, 52, 58) * (1 - progress(f, 64, 70))} style={mono}>
        AN LLM SEPARATES THE ITEMS
      </text>
      <g opacity={legend}>
        <g opacity={progress(f, 74, 80)}>
          <circle cx={10} cy={513} r={3} fill={c.mute} />
          <text x={36} y={520} fontSize={19} style={mono}>
            1.88 M FOOD ENTRIES · USDA + OPEN FOOD FACTS
          </text>
        </g>
        <g opacity={progress(f, 100, 106)}>
          <circle cx={10} cy={561} r={7} fill={c.ink} />
          <text x={36} y={568} fontSize={19} style={mono}>
            TOP 20 CANDIDATES, POOLED FROM 3 QUERIES
          </text>
        </g>
        <g opacity={progress(f, 114, 120)}>
          <circle cx={10} cy={609} r={10} fill={c.signal} />
          <text x={36} y={616} fontSize={19} style={mono}>
            A SECOND LLM STEP PICKS ONE, ESTIMATES THE GRAMS
          </text>
        </g>
      </g>

      {/* Act 3, under the summary in the title's type: the share of confident matches. */}
      <text x={0} y={520} fontSize={19} opacity={progress(f, 140, 146)} style={{ ...mono, fill: c.ink }}>
        CONFIDENT MATCHES
      </text>
      <text
        x={-6}
        y={712}
        fontSize={176}
        opacity={progress(f, 144, 150)}
        style={{ fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -9.7, fill: c.ink, fontVariantNumeric: 'tabular-nums' }}
      >
        {`${share} %`}
      </text>
      <text x={0} y={772} fontSize={19} opacity={progress(f, 148, 154)} style={mono}>
        29 TEST CASES · 11 RUNS
      </text>

      {/* Act 3, added under the search: the two bars, without and with the LLM steps. */}
      <text x={RESULT.x} y={668} fontSize={19} opacity={progress(f, 142, 146)} style={mono}>
        WITHOUT LLM
      </text>
      <rect x={RESULT.x} y={682} width={(RESULT.width * RESULT.before * progress(f, 144, 152)) / 100} height={30} fill={c.mute} />
      <text
        x={RESULT.x + (RESULT.width * RESULT.before) / 100 + 14}
        y={704}
        fontSize={19}
        opacity={progress(f, 150, 154)}
        style={{ ...mono, fill: c.ink }}
      >
        {`${RESULT.before} %`}
      </text>
      <text x={RESULT.x} y={748} fontSize={19} opacity={progress(f, 152, 156)} style={mono}>
        WITH LLM
      </text>
      {f >= 154 && (
        <>
          <rect x={RESULT.x} y={762} width={(RESULT.width * share) / 100} height={30} fill={c.signal} />
          <text
            x={RESULT.x + (RESULT.width * share) / 100 + 14}
            y={784}
            fontSize={19}
            style={{ ...mono, fill: c.ink, fontVariantNumeric: 'tabular-nums' }}
          >
            {`${share} %`}
          </text>
        </>
      )}
    </svg>
  );
};
