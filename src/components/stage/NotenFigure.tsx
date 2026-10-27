// Colla parte (formerly Notenprogramm), check don't retype: what the app asks instead of a check of every bar (version J). Drawn as
// the reader scrolls past it: the eight voices of Schumann's "An die Sterne" as lanes of 83 bars, every bar
// ticked in as if checked by hand; then the bars step back and only the open questions stay, a few per voice,
// and 22 in the one voice whose whole line was read an octave off. Figures from the case text; where the
// questions sit in each lane is drawn, not measured.
import type { Palette } from '../../../motion/src/style';
import { fonts } from '../../../motion/src/style';

const BARS = 83;
const LANE = { x0: 80, x1: 1160, top: 100, step: 40 };
const BAR = (LANE.x1 - LANE.x0) / BARS;
/** Bars of the open questions in each voice; the sixth voice is the one read an octave off. */
const QUESTIONS = [[12, 57], [31], [8, 40, 71], [66], [22, 49], [], [15, 36, 78], [53]];
const OFF = { voice: 5, from: 40, to: 68, count: 22, rise: 12 };

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (share: number, from: number, to: number) => clamp((share - from) / (to - from));
const barX = (bar: number) => LANE.x0 + bar * BAR;
const laneY = (voice: number) => LANE.top + voice * LANE.step;

/** The lane as a line; the voice read an octave off steps up for the stretch of its wrong line. */
const lanePoints = (voice: number) => {
  const y = laneY(voice);
  if (voice !== OFF.voice) return `${LANE.x0},${y} ${LANE.x1},${y}`;
  const [a, b, up] = [barX(OFF.from), barX(OFF.to), y - OFF.rise];
  return `${LANE.x0},${y} ${a},${y} ${a},${up} ${b},${up} ${b},${y} ${LANE.x1},${y}`;
};

/** Bar lines up to the given count, as one path. */
const ticks = (voice: number, count: number) => {
  const y = laneY(voice);
  return Array.from({ length: count }, (_, b) => `M${barX(b + 1)} ${y - 7}v14`).join('');
};

/** Square brackets around a note, the app's mark for a question. */
const bracket = (x: number, y: number, key: string) => (
  <path key={key} d={`M${x - 2} ${y - 8}h-3v16h3M${x + 2} ${y - 8}h3v16h-3`} />
);

export const NotenFigure = ({ palette: c, share, narrow = false }: { palette: Palette; share: number; narrow?: boolean }) => {
  if (narrow) return <NotenNarrow palette={c} share={share} />;
  const mono = { fontFamily: fonts.mono, fontSize: 17, letterSpacing: 1, whiteSpace: 'pre' };
  const big = { fontFamily: fonts.sans, fontSize: 120, fontWeight: 600, letterSpacing: -2 };
  const asked = share >= 0.42;
  const result = span(share, 0.68, 0.8);

  return (
    <svg viewBox="0 0 1200 580" width="100%" height="100%" aria-hidden="true">
      <text x={40} y={44} style={{ ...mono, fill: c.mute }}>
        AN DIE STERNE · 83 BARS · 8 VOICES
      </text>
      <text x={LANE.x1} y={44} textAnchor="end" style={{ ...mono, fill: asked ? c.signal : c.ink }}>
        {asked ? 'OPEN QUESTIONS' : 'A CHECK OF EVERY BAR'}
      </text>

      {/* The eight voices draw themselves, then every bar is ticked in, one hard step per bar. */}
      {QUESTIONS.map((_, v) => {
        const line = span(share, 0.04 + v * 0.02, 0.2 + v * 0.02);
        const done = Math.floor(span(share, 0.1 + v * 0.02, 0.36 + v * 0.02) * BARS);
        const wrong = asked && v === OFF.voice;
        return (
          <g key={v}>
            <text x={40} y={laneY(v) + 6} style={{ ...mono, fill: wrong ? c.signal : c.mute }}>
              {v + 1}
            </text>
            <path d={ticks(v, done)} stroke={asked ? c.hair : c.ink} strokeWidth={1} />
            <polyline
              points={lanePoints(v)}
              fill="none"
              stroke={wrong ? c.signal : asked ? c.mute : c.ink}
              strokeWidth={2}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - line}
            />
          </g>
        );
      })}

      {/* Only the questions stay, voice by voice; 22 along the line that was read an octave off. */}
      <g stroke={c.signal} strokeWidth={2} fill="none">
        {QUESTIONS.map((bars, v) =>
          share >= 0.44 + v * 0.02
            ? bars.map((bar) => bracket(barX(bar + 0.5), laneY(v), `${v}-${bar}`))
            : null,
        )}
        {share >= 0.44 + OFF.voice * 0.02 &&
          Array.from({ length: OFF.count }, (_, k) => {
            const x = barX(OFF.from) + ((k + 0.5) * (barX(OFF.to) - barX(OFF.from))) / OFF.count;
            return bracket(x, laneY(OFF.voice) - OFF.rise, `off-${k}`);
          })}
      </g>

      {/* What it comes to: one to three answers for most voices, not a check of every bar. */}
      <line x1={40} y1={440} x2={LANE.x1} y2={440} stroke={c.hair} strokeWidth={1} opacity={result} />
      <g opacity={result} transform={`translate(0 ${(1 - result) * 16})`}>
        <text x={34} y={556} style={{ ...big, fill: c.ink }}>
          1–3
        </text>
        <text x={290} y={516} style={{ ...mono, fill: c.ink }}>
          MOST VOICES
        </text>
        <text x={290} y={542} style={{ ...mono, fill: c.mute }}>
          NOT A CHECK OF EVERY BAR
        </text>
        <text x={654} y={556} style={{ ...big, fill: c.signal }}>
          22
        </text>
        <text x={830} y={516} style={{ ...mono, fill: c.ink }}>
          ONE VOICE
        </text>
        <text x={830} y={542} style={{ ...mono, fill: c.mute }}>
          A WHOLE LINE AN OCTAVE OFF
        </text>
      </g>
    </svg>
  );
};

/** Narrow version (phones): the same eight lanes across the full width, taller; the two results stacked below. */
const NL = { x0: 44, x1: 600, top: 162, step: 52, rise: 14 };
const NBAR = (NL.x1 - NL.x0) / BARS;
const nBarX = (bar: number) => NL.x0 + bar * NBAR;
const nLaneY = (voice: number) => NL.top + voice * NL.step;

const nLanePoints = (voice: number) => {
  const y = nLaneY(voice);
  if (voice !== OFF.voice) return `${NL.x0},${y} ${NL.x1},${y}`;
  const [a, b, up] = [nBarX(OFF.from), nBarX(OFF.to), y - NL.rise];
  return `${NL.x0},${y} ${a},${y} ${a},${up} ${b},${up} ${b},${y} ${NL.x1},${y}`;
};

const nTicks = (voice: number, count: number) => {
  const y = nLaneY(voice);
  return Array.from({ length: count }, (_, b) => `M${nBarX(b + 1)} ${y - 9}v18`).join('');
};

/** The question mark, slimmer: 22 of them have to fit along the wrong line. */
const nBracket = (x: number, y: number, key: string) => (
  <path key={key} d={`M${x - 1} ${y - 10}h-2.5v20h2.5M${x + 1} ${y - 10}h2.5v20h-2.5`} />
);

const NotenNarrow = ({ palette: c, share }: { palette: Palette; share: number }) => {
  const mono = { fontFamily: fonts.mono, fontSize: 22, letterSpacing: 0.5, whiteSpace: 'pre' };
  const big = { fontFamily: fonts.sans, fontSize: 150, fontWeight: 600, letterSpacing: -3 };
  const asked = share >= 0.42;
  const result = span(share, 0.68, 0.8);

  return (
    <svg viewBox="0 0 600 900" width="100%" height="100%" aria-hidden="true">
      <text x={0} y={30} style={{ ...mono, fill: c.mute }}>
        AN DIE STERNE
      </text>
      <text x={0} y={60} style={{ ...mono, fill: c.mute }}>
        83 BARS · 8 VOICES
      </text>
      <text x={0} y={104} style={{ ...mono, fill: asked ? c.signal : c.ink }}>
        {asked ? 'OPEN QUESTIONS' : 'A CHECK OF EVERY BAR'}
      </text>

      {/* The eight voices draw themselves, then every bar is ticked in, one hard step per bar. */}
      {QUESTIONS.map((_, v) => {
        const line = span(share, 0.04 + v * 0.02, 0.2 + v * 0.02);
        const done = Math.floor(span(share, 0.1 + v * 0.02, 0.36 + v * 0.02) * BARS);
        const wrong = asked && v === OFF.voice;
        return (
          <g key={v}>
            <text x={0} y={nLaneY(v) + 8} style={{ ...mono, fill: wrong ? c.signal : c.mute }}>
              {v + 1}
            </text>
            <path d={nTicks(v, done)} stroke={asked ? c.hair : c.ink} strokeWidth={1} />
            <polyline
              points={nLanePoints(v)}
              fill="none"
              stroke={wrong ? c.signal : asked ? c.mute : c.ink}
              strokeWidth={2}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - line}
            />
          </g>
        );
      })}

      {/* Only the questions stay, voice by voice; 22 along the line that was read an octave off. */}
      <g stroke={c.signal} strokeWidth={2} fill="none">
        {QUESTIONS.map((bars, v) =>
          share >= 0.44 + v * 0.02 ? bars.map((bar) => nBracket(nBarX(bar + 0.5), nLaneY(v), `${v}-${bar}`)) : null,
        )}
        {share >= 0.44 + OFF.voice * 0.02 &&
          Array.from({ length: OFF.count }, (_, k) => {
            const x = nBarX(OFF.from) + ((k + 0.5) * (nBarX(OFF.to) - nBarX(OFF.from))) / OFF.count;
            return nBracket(x, nLaneY(OFF.voice) - NL.rise, `off-${k}`);
          })}
      </g>

      {/* What it comes to, stacked: one to three answers for most voices, 22 in one. */}
      <line x1={0} y1={584} x2={600} y2={584} stroke={c.hair} strokeWidth={1} opacity={result} />
      <g opacity={result} transform={`translate(0 ${(1 - result) * 16})`}>
        <text x={0} y={722} style={{ ...big, fill: c.ink }}>
          1–3
        </text>
        <text x={300} y={668} style={{ ...mono, fill: c.ink }}>
          MOST VOICES
        </text>
        <text x={300} y={696} style={{ ...mono, fill: c.mute }}>
          NOT A CHECK
        </text>
        <text x={300} y={722} style={{ ...mono, fill: c.mute }}>
          OF EVERY BAR
        </text>
        <text x={0} y={878} style={{ ...big, fill: c.signal }}>
          22
        </text>
        <text x={300} y={824} style={{ ...mono, fill: c.ink }}>
          ONE VOICE
        </text>
        <text x={300} y={852} style={{ ...mono, fill: c.mute }}>
          A WHOLE LINE
        </text>
        <text x={300} y={878} style={{ ...mono, fill: c.mute }}>
          AN OCTAVE OFF
        </text>
      </g>
    </svg>
  );
};
