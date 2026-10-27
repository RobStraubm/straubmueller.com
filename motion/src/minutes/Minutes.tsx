// AI meeting minutes in seven seconds, on one stage that never empties: a council meeting is recorded,
// the recording folds into a timeline at the top while each speaker's turn unfolds into a transcript row,
// unsure passages are replayed on that timeline and confirmed, and the rows become the minutes: verbatim,
// summarised or left out. Sound, speakers and text are drawn as shapes: an illustration, not a real meeting.
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ActWord, Labels, type Act } from '../parts';
import { seeded } from '../random';
import { fonts, palettes, progress, SIZE, stepped, type Theme, POSTER_VIEW } from '../style';

export const MINUTES_FRAMES = 210;

export const MINUTES_ACTS: Act[] = [
  { word: 'AUDIO', from: 0, to: 64 },
  { word: 'REVIEW', from: 64, to: 136 },
  { word: 'MINUTES', from: 136, to: Infinity },
];

type Speaker = 'A' | 'B' | 'C';

/** The recording runs from frame 6 to 50: three speakers, one turn each, with a short pause between. */
const REC = { from: 6, to: 50 };
const TURNS: { speaker: Speaker; from: number; to: number }[] = [
  { speaker: 'A', from: 0, to: 0.35 },
  { speaker: 'B', from: 0.38, to: 0.69 },
  { speaker: 'C', from: 0.72, to: 1 },
];

/** The waveform as recorded (act 1) and folded into the timeline at the top (acts 2 and 3). */
const WAVE = { x: 64, width: 672, y: 432, height: 92, pitch: 8 };
const TIMELINE = { y: 300, amp: 0.22 };
const STRIP = { from: { y: 572, h: 36 }, to: { y: 322, h: 10 } };
const BAR_COUNT = WAVE.width / WAVE.pitch;
const random = seeded(2026);

/** Loudness per bar: speech within a turn, near silence in the pauses. */
const LEVELS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const t = (i + 0.5) / BAR_COUNT;
  const speaking = TURNS.some((turn) => t >= turn.from && t < turn.to);
  return speaking ? 0.2 + 0.8 * random() * (0.5 + 0.5 * Math.abs(Math.sin(i * 0.8))) : 0.05;
});

/** Transcript text as bars: words of random length, set as a ragged line. */
const TEXT = { x: 112, line: 30, bar: 14 };
type Word = { x: number; w: number };
const words = (width: number) => {
  const line: Word[] = [];
  for (let x = TEXT.x; ; ) {
    const w = Math.round(26 + random() * 74);
    if (x + w > TEXT.x + width) return line;
    line.push({ x, w });
    x += w + 12;
  }
};
const lineEnd = (line: Word[]) => (line.length ? line[line.length - 1].x + line[line.length - 1].w : TEXT.x);

/** One row per turn: the flagged word (line, word), when it is confirmed, and what goes into the minutes. */
const ROWS: { speaker: Speaker; y: number; lines: Word[][]; flag: [number, number]; confirm: number; choice: number }[] = [
  { speaker: 'A', y: 372, lines: [620, 596, 410].map((w) => words(w)), flag: [1, 2], confirm: 100, choice: 0 },
  { speaker: 'B', y: 512, lines: [608, 620, 352].map((w) => words(w)), flag: [0, 3], confirm: 112, choice: 1 },
  { speaker: 'C', y: 652, lines: [596, 470].map((w) => words(w)), flag: [1, 1], confirm: 124, choice: 2 },
];
const ROW_TOP = ROWS[0].y;
const FLAGGED_AT = 88;
/** A turn unfolds from the timeline into its row over these frames. */
const UNFOLD = (r: number) => ({ from: 74 + r * 6, to: 88 + r * 6 });
/** The flagged passage is replayed on the timeline just before it is confirmed. */
const REPLAY = 8;
const CHOSEN_AT = [144, 150, 156];

/** Verbatim, indirect or left out, right-aligned on each speaker line (19 px mono with 1 px tracking). */
const CHOICES = (() => {
  const names = ['VERBATIM', 'INDIRECT', 'OMIT'];
  const widths = names.map((name) => name.length * (19 * 0.6 + 1) + 18);
  let x = 736 - widths.reduce((sum, w) => sum + w, 0) - 8 * (names.length - 1);
  return names.map((name, i) => {
    const box = { name, x, w: widths[i] };
    x += widths[i] + 8;
    return box;
  });
})();

/** The rows settle into the page at this scale, under the timeline; the speaker lines stay at 15 px. */
const PAGE = { x: 90, y: 356, w: 620, h: 420, inner: 122, scale: 0.84, top: 474 };
const MORE = [556, 516, 300];

const linear = (frame: number, from: number, to: number) => Math.min(1, Math.max(0, (frame - from) / (to - from)));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** The recording stands for a whole council meeting, run as a time-lapse: two hours and ten minutes. */
const MEETING_SECONDS = 2 * 3600 + 10 * 60;
const pad = (n: number) => String(n).padStart(2, '0');
const timecode = (seconds: number) =>
  `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`;
const drawn = (frame: number, start: number, length: number, span = 12) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress(frame, start, start + span)),
});

/** Where on the timeline a flagged word sits: its share of the row's text, inside the speaker's turn. */
const replayX = (r: number) => {
  const row = ROWS[r];
  const turn = TURNS[r];
  const before = row.lines.slice(0, row.flag[0]).reduce((sum, line) => sum + line.length, 0) + row.flag[1];
  const total = row.lines.reduce((sum, line) => sum + line.length, 0);
  return WAVE.x + WAVE.width * lerp(turn.from, turn.to, (before + 0.5) / total);
};

export const Minutes = ({ theme }: { theme: Theme }) => {
  const f = useCurrentFrame();
  const c = palettes[theme];
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };
  const onSignal = theme === 'light' ? c.ground : c.ink;

  const paint = (speaker: Speaker) =>
    ({
      A: { fill: c.ink },
      B: { fill: 'none', stroke: c.ink, strokeWidth: 3 },
      C: { fill: 'url(#minutes-hatch)' },
    })[speaker];

  const head = WAVE.x + WAVE.width * linear(f, REC.from, REC.to);
  const recording = f >= REC.from && f < REC.to;
  const recorded = Math.round(MEETING_SECONDS * linear(f, REC.from, REC.to));

  // Act 2 folds the recording into a timeline; act 3 lets it step back behind the minutes.
  const fold = progress(f, 64, 84);
  const waveY = lerp(WAVE.y, TIMELINE.y, fold);
  const waveAmp = lerp(1, TIMELINE.amp, fold);
  const stripY = lerp(STRIP.from.y, STRIP.to.y, fold);
  const stripH = lerp(STRIP.from.h, STRIP.to.h, fold);
  const recY = lerp(302, 262, fold);
  const behind = 1 - 0.55 * progress(f, 136, 150);

  const legend = progress(f, 90, 96) * (1 - progress(f, 132, 138));
  const tags = progress(f, 138, 144) * (1 - progress(f, 168, 174));
  const marks = 1 - progress(f, 168, 174);
  const summary = progress(f, 152, 164);
  const strike = progress(f, 158, 166);
  const settle = progress(f, 170, 188);
  const scale = 1 - (1 - PAGE.scale) * settle;
  const shiftX = (PAGE.inner - PAGE.scale * 64) * settle;
  const shiftY = (PAGE.top - PAGE.scale * ROW_TOP) * settle;

  return (
    <AbsoluteFill style={{ backgroundColor: c.ground }}>
      <svg width={SIZE.width} height={SIZE.height} viewBox={POSTER_VIEW}>
        <defs>
          <pattern id="minutes-hatch" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={10} height={10} fill={c.ground} />
            <line x1={0} y1={0} x2={0} y2={10} stroke={c.ink} strokeWidth={4} />
          </pattern>
        </defs>

        <Labels frame={f} project="AI meeting minutes" acts={MINUTES_ACTS} palette={c} />
        <ActWord frame={f} acts={MINUTES_ACTS} palette={c} />

        {/* The recording: drawn in act 1, folded into the timeline in act 2, kept dim behind the minutes in act 3. */}
        <g opacity={behind}>
          <circle cx={74} cy={recY} r={9} fill={f < REC.to ? c.signal : c.mute} opacity={!recording || Math.floor(f / 8) % 2 === 0 ? 1 : 0} />
          <text x={94} y={recY + 7} fontSize={20} style={{ ...mono, fill: c.ink }}>
            REC
          </text>
          <text
            x={736}
            y={recY + 7}
            fontSize={20}
            textAnchor="end"
            style={{ ...mono, fill: c.ink, fontVariantNumeric: 'tabular-nums' }}
          >
            {timecode(recorded)}
          </text>
          {LEVELS.map((level, i) => {
            const x = WAVE.x + i * WAVE.pitch;
            if (x >= head) return null;
            const h = Math.max(1, level * WAVE.height * waveAmp);
            return <rect key={i} x={x} y={waveY - h} width={4} height={h * 2} fill={c.ink} />;
          })}
          {recording && <line x1={head} x2={head} y1={WAVE.y - 106} y2={WAVE.y + 106} stroke={c.signal} strokeWidth={2} />}
          {TURNS.map((turn) => {
            const x0 = WAVE.x + turn.from * WAVE.width;
            const x1 = Math.min(head, WAVE.x + turn.to * WAVE.width);
            if (x1 <= x0) return null;
            const inset = turn.speaker === 'B' ? 1.5 : 0;
            return (
              <rect
                key={turn.speaker}
                x={x0 + inset}
                y={stripY + inset}
                width={Math.max(0, x1 - x0 - 2 * inset)}
                height={Math.max(0, stripH - 2 * inset)}
                {...paint(turn.speaker)}
              />
            );
          })}
          {/* Replaying a flagged passage: the playhead jumps into that speaker's turn on the timeline. */}
          {ROWS.map((row, r) => {
            const t = linear(f, row.confirm - REPLAY, row.confirm);
            if (t <= 0 || t >= 1) return null;
            const x = replayX(r) + 14 * t;
            return <line key={row.speaker} x1={x} x2={x} y1={TIMELINE.y - 26} y2={STRIP.to.y + 16} stroke={c.signal} strokeWidth={3} />;
          })}
        </g>
        <text x={64} y={880} fontSize={20} opacity={progress(f, 16, 24) * (1 - progress(f, 60, 66))} style={mono}>
          RECORDING A COUNCIL MEETING
        </text>

        {/* Each turn's speaker label travels from the strip to its row, where the transcript unfolds. */}
        <g transform={`translate(${shiftX} ${shiftY}) scale(${scale})`}>
          {ROWS.map((row, r) => {
            const turn = TURNS[r];
            const x0 = WAVE.x + turn.from * WAVE.width;
            const unfold = progress(f, UNFOLD(r).from, UNFOLD(r).to);
            const arrived = f >= UNFOLD(r).to;
            const chosen = f >= CHOSEN_AT[r];
            const omitted = row.choice === 2 && chosen;
            const gone = row.choice === 2 ? 1 - progress(f, 166, 172) : 1;
            const flagY = row.y + 40 + row.flag[0] * TEXT.line + TEXT.bar / 2;
            // A passage is flagged once its line has been written out, never before the row is there.
            const flagFrom = Math.max(FLAGGED_AT, UNFOLD(r).to + 2 + row.flag[0] * 3);
            const inset = row.speaker === 'B' ? 1.5 : 0;
            // Before the fold the label sits under its strip segment; it then follows the strip and moves to the row.
            const labelX = lerp(x0, 94, unfold);
            const labelY = lerp(lerp(640, STRIP.to.y + 40, fold), row.y + 17, unfold);
            const squareX = lerp(x0, 64, unfold);
            const squareY = lerp(stripY, row.y + 1, unfold);
            if (head <= x0 && f < REC.to) return null;
            return (
              <g key={row.speaker} opacity={gone}>
                {unfold > 0 && (
                  <rect
                    x={squareX + inset}
                    y={squareY + inset}
                    width={18 - 2 * inset}
                    height={18 - 2 * inset}
                    {...paint(row.speaker)}
                  />
                )}
                <text x={labelX} y={labelY} fontSize={18} style={{ ...mono, fill: arrived ? c.ink : c.mute }}>
                  {`SPEAKER ${row.speaker}`}
                </text>
                <text
                  x={212}
                  y={row.y + 17}
                  fontSize={18}
                  opacity={progress(f, UNFOLD(r).to - 2, UNFOLD(r).to + 4)}
                  style={{ ...mono, fontVariantNumeric: 'tabular-nums' }}
                >
                  {timecode(Math.round(turn.from * MEETING_SECONDS))}
                </text>

                <g opacity={tags}>
                  {CHOICES.map((choice, j) => {
                    const on = chosen && j === row.choice;
                    return (
                      <g key={choice.name}>
                        {on && <rect x={choice.x} y={row.y - 5} width={choice.w} height={29} fill={c.signal} />}
                        <text x={choice.x + 9} y={row.y + 17} fontSize={19} style={{ ...mono, fill: on ? onSignal : c.mute }}>
                          {choice.name}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {row.lines.map((line, k) => {
                  const y = row.y + 40 + k * TEXT.line;
                  const start = UNFOLD(r).to - 4 + k * 3;
                  const reveal = TEXT.x + 640 * linear(f, start, start + 10);
                  // The indirect turn keeps half its first line as a summary, dropping whole words from the end.
                  const keep = row.choice === 1 ? (k === 0 ? 0.5 : 0) : 1;
                  const cut = TEXT.x + (lineEnd(line) - TEXT.x) * (1 - (1 - keep) * summary);
                  return (
                    <g key={k}>
                      {line.map((word, i) => {
                        const w = Math.min(word.w, reveal - word.x);
                        if (w <= 0 || word.x + word.w > cut + 0.5) return null;
                        const flagged = row.flag[0] === k && row.flag[1] === i && f >= flagFrom && f < row.confirm;
                        return (
                          <rect
                            key={i}
                            x={word.x}
                            y={y}
                            width={w}
                            height={TEXT.bar}
                            fill={flagged ? c.signal : omitted ? c.mute : c.ink}
                          />
                        );
                      })}
                      {omitted && strike > 0 && (
                        <line
                          x1={TEXT.x - 8}
                          x2={TEXT.x - 8 + (lineEnd(line) + 16 - TEXT.x) * strike}
                          y1={y + TEXT.bar / 2}
                          y2={y + TEXT.bar / 2}
                          stroke={c.signal}
                          strokeWidth={4}
                        />
                      )}
                    </g>
                  );
                })}

                {/* Flagged: play the original audio. Confirmed: a check. */}
                <g opacity={marks}>
                  {f >= flagFrom && f < row.confirm && (
                    <polygon points={`66,${flagY - 9} 84,${flagY} 66,${flagY + 9}`} fill={c.signal} />
                  )}
                  {f >= row.confirm && (
                    <polyline
                      points={`64,${flagY} 72,${flagY + 8} 88,${flagY - 9}`}
                      fill="none"
                      stroke={c.ink}
                      strokeWidth={3}
                    />
                  )}
                </g>
              </g>
            );
          })}
        </g>

        <g opacity={legend}>
          <rect x={64} y={840} width={30} height={14} fill={c.signal} />
          <text x={108} y={854} fontSize={18} style={mono}>
            UNCERTAIN PASSAGE
          </text>
          <polygon points="420,838 436,847 420,856" fill={c.signal} />
          <text x={452} y={854} fontSize={18} style={mono}>
            PLAYS THE ORIGINAL AUDIO
          </text>
          <polyline points="66,890 74,898 90,881" fill="none" stroke={c.ink} strokeWidth={3} />
          <text x={108} y={898} fontSize={18} style={mono}>
            CONFIRMED BY A PERSON
          </text>
        </g>

        {/* Act 3: the page the turns settle into, under the timeline they came from. */}
        <g>
          <rect
            x={PAGE.x}
            y={PAGE.y}
            width={PAGE.w}
            height={PAGE.h}
            fill="none"
            stroke={c.ink}
            strokeWidth={2}
            opacity={f >= 172 ? 1 : 0}
            style={drawn(f, 172, 2 * (PAGE.w + PAGE.h), 18)}
          />
          <rect x={PAGE.inner} y={PAGE.y + 28} width={260} height={24} fill={c.ink} opacity={stepped(progress(f, 182, 184), 1)} />
          <rect x={PAGE.inner} y={PAGE.y + 64} width={170} height={12} fill={c.mute} opacity={stepped(progress(f, 184, 186), 1)} />
          <line
            x1={PAGE.inner}
            x2={PAGE.x + PAGE.w - 32}
            y1={PAGE.y + 94}
            y2={PAGE.y + 94}
            stroke={c.hair}
            strokeWidth={2}
            opacity={stepped(progress(f, 185, 187), 1)}
          />
          {MORE.map((w, i) => (
            <rect
              key={i}
              x={PAGE.inner}
              y={668 + i * 26}
              width={w}
              height={12}
              fill={c.hair}
              opacity={stepped(progress(f, 186 + i * 2, 188 + i * 2), 1)}
            />
          ))}
          <text
            x={PAGE.x + PAGE.w}
            y={PAGE.y + PAGE.h + 36}
            fontSize={18}
            textAnchor="end"
            opacity={progress(f, 188, 196)}
            style={mono}
          >
            EXPORT · WORD / PDF
          </text>
          <text x={64} y={900} fontSize={20} opacity={progress(f, 190, 198)} style={mono}>
            IN PILOT AT A DISTRICT ADMINISTRATION
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
