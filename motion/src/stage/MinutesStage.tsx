// AI meeting minutes as the opening of its case page (version J): the film's three acts across the whole width.
// The page sets the title and the summary as real text in the same 1600 × 900 box. The title heads the
// recording: REC and the running time of the meeting stand beside it, set large, while the waveform is recorded
// under the summary along the whole width. The recording then flattens into the timeline at the foot of the
// stage and each speaker's turn unfolds into a transcript row on the right; replaying an unsure passage moves
// the playhead and sets the large time to that moment. In the last act each row takes its choice and the rows
// settle into the page of minutes, which takes the place of the time. Shapes stand for sound and text.
import { useCurrentFrame } from 'remotion';
import type { Palette } from '../style';
import { fonts, progress, stepped } from '../style';
import { seeded } from '../random';

type Speaker = 'A' | 'B' | 'C';

/** Same timing as the film: the recording runs from frame 6 to 50, three speakers with a short pause between. */
const REC = { from: 6, to: 50 };
const TURNS: { speaker: Speaker; from: number; to: number }[] = [
  { speaker: 'A', from: 0, to: 0.35 },
  { speaker: 'B', from: 0.38, to: 0.69 },
  { speaker: 'C', from: 0.72, to: 1 },
];
/** The recording stands for a whole council meeting, run as a time-lapse: two hours and ten minutes. */
const MEETING_SECONDS = 2 * 3600 + 10 * 60;

/** The waveform runs the whole width under the summary (act 1) and flattens into the timeline at the foot. */
const WAVE = { x: 0, width: 1600, y: 620, height: 84, pitch: 8 };
const TIMELINE = { y: 766, amp: 0.22 };
const STRIP = { from: { y: 736, h: 32 }, to: { y: 790, h: 10 } };
/** The running time, large, top right beside the title. */
const TIME = { x: 1600, y: 262, size: 210 };
const BAR_COUNT = WAVE.width / WAVE.pitch;
const random = seeded(2026);

/** Loudness per bar: speech within a turn, near silence in the pauses. */
const LEVELS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const t = (i + 0.5) / BAR_COUNT;
  const speaking = TURNS.some((turn) => t >= turn.from && t < turn.to);
  return speaking ? 0.2 + 0.8 * random() * (0.5 + 0.5 * Math.abs(Math.sin(i * 0.8))) : 0.05;
});

/** Transcript rows in the right half: speaker square, label and time on the first line, text as bars below. */
const ROW_X = 880;
const TEXT = { x: 928, width: 672, line: 30, bar: 14 };
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
  { speaker: 'A', y: 340, lines: [640, 616, 424].map((w) => words(w)), flag: [1, 2], confirm: 100, choice: 0 },
  { speaker: 'B', y: 480, lines: [628, 640, 364].map((w) => words(w)), flag: [0, 3], confirm: 112, choice: 1 },
  { speaker: 'C', y: 620, lines: [616, 486].map((w) => words(w)), flag: [1, 1], confirm: 124, choice: 2 },
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
  let x = 1600 - widths.reduce((sum, w) => sum + w, 0) - 8 * (names.length - 1);
  return names.map((name, i) => {
    const box = { name, x, w: widths[i] };
    x += widths[i] + 8;
    return box;
  });
})();

/** The page of minutes takes the place of the time; the rows settle into it at this scale, under its head. */
const PAGE = { x: 944, y: 120, w: 656, h: 570, inner: 984, scale: 0.8, top: 262 };
const MORE = [520, 480, 280];

const linear = (frame: number, from: number, to: number) => Math.min(1, Math.max(0, (frame - from) / (to - from)));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
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

export const MinutesStage = ({ palette: c }: { palette: Palette }) => {
  const f = useCurrentFrame();
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };
  const onSignal = c.ground;

  const paint = (speaker: Speaker) =>
    ({
      A: { fill: c.ink },
      B: { fill: 'none', stroke: c.ink, strokeWidth: 3 },
      C: { fill: 'url(#minutes-stage-hatch)' },
    })[speaker];

  const head = WAVE.x + WAVE.width * linear(f, REC.from, REC.to);
  const recording = f >= REC.from && f < REC.to;
  const recorded = Math.round(MEETING_SECONDS * linear(f, REC.from, REC.to));

  // Act 2 flattens the recording into the timeline; act 3 lets it step back and the page take the time's place.
  const fold = progress(f, 64, 84);
  const waveY = lerp(WAVE.y, TIMELINE.y, fold);
  const waveAmp = lerp(1, TIMELINE.amp, fold);
  const stripY = lerp(STRIP.from.y, STRIP.to.y, fold);
  const stripH = lerp(STRIP.from.h, STRIP.to.h, fold);
  const behind = 1 - 0.55 * progress(f, 136, 150);
  const clock = 1 - progress(f, 156, 166);

  // While a flagged passage plays, the playhead jumps into its turn and the large time shows that moment.
  const replay = ROWS.map((row, r) => ({ r, t: linear(f, row.confirm - REPLAY, row.confirm) })).find(({ t }) => t > 0 && t < 1);
  const playhead = replay ? replayX(replay.r) + 14 * replay.t : null;
  const shownTime = playhead === null ? recorded : Math.round(MEETING_SECONDS * ((playhead - WAVE.x) / WAVE.width));

  const legend = progress(f, 90, 96) * (1 - progress(f, 132, 138));
  const tags = progress(f, 138, 144) * (1 - progress(f, 168, 174));
  const marks = 1 - progress(f, 168, 174);
  const summary = progress(f, 152, 164);
  const strike = progress(f, 158, 166);
  const settle = progress(f, 170, 188);
  const scale = 1 - (1 - PAGE.scale) * settle;
  const shiftX = (PAGE.inner - PAGE.scale * ROW_X) * settle;
  const shiftY = (PAGE.top - PAGE.scale * ROW_TOP) * settle;

  return (
    <svg viewBox="0 0 1600 900" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <defs>
        <pattern id="minutes-stage-hatch" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={10} stroke={c.ink} strokeWidth={4} />
        </pattern>
      </defs>

      {/* Beside the title: REC and the running time of the meeting. Replays set it to the passage they play. */}
      <g opacity={clock * behind}>
        <circle
          cx={1600 - 62}
          cy={TIME.y - 190}
          r={9}
          fill={f < REC.to ? c.signal : c.mute}
          opacity={!recording || Math.floor(f / 8) % 2 === 0 ? 1 : 0}
        />
        <text x={1600} y={TIME.y - 183} fontSize={20} textAnchor="end" style={{ ...mono, fill: c.ink }}>
          REC
        </text>
        <text
          x={TIME.x}
          y={TIME.y}
          fontSize={TIME.size}
          textAnchor="end"
          style={{
            fontFamily: fonts.display,
            fontWeight: 300,
            fontStretch: '62.5%',
            fontVariantNumeric: 'tabular-nums',
            fill: playhead === null ? c.ink : c.signal,
          }}
        >
          {timecode(shownTime)}
        </text>
      </g>
      <text
        x={1600}
        y={TIME.y + 50}
        fontSize={20}
        textAnchor="end"
        opacity={progress(f, 16, 24) * (1 - progress(f, 60, 66))}
        style={mono}
      >
        RECORDING A COUNCIL MEETING
      </text>

      {/* The recording: drawn across the width in act 1, flattened into the timeline in act 2, dim in act 3. */}
      <g opacity={behind}>
        {LEVELS.map((level, i) => {
          const x = WAVE.x + i * WAVE.pitch;
          if (x >= head) return null;
          const h = Math.max(1, level * WAVE.height * waveAmp);
          return <rect key={i} x={x} y={waveY - h} width={4} height={h * 2} fill={c.ink} />;
        })}
        {recording && <line x1={head} x2={head} y1={WAVE.y - 100} y2={WAVE.y + 100} stroke={c.signal} strokeWidth={2} />}
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
        {playhead !== null && (
          <line x1={playhead} x2={playhead} y1={TIMELINE.y - 26} y2={STRIP.to.y + 16} stroke={c.signal} strokeWidth={3} />
        )}
      </g>

      {/* Each turn's speaker label travels from under its strip to its row, where the transcript unfolds. */}
      <g transform={`translate(${shiftX} ${shiftY}) scale(${scale})`}>
        {ROWS.map((row, r) => {
          const turn = TURNS[r];
          const x0 = WAVE.x + turn.from * WAVE.width;
          const unfold = progress(f, UNFOLD(r).from, UNFOLD(r).to);
          // Sideways faster than up: speaker A's label passes under the summary, not through it.
          const across = progress(f, UNFOLD(r).from, UNFOLD(r).from + 8);
          const arrived = f >= UNFOLD(r).to;
          const chosen = f >= CHOSEN_AT[r];
          const omitted = row.choice === 2 && chosen;
          const gone = row.choice === 2 ? 1 - progress(f, 166, 172) : 1;
          const flagY = row.y + 40 + row.flag[0] * TEXT.line + TEXT.bar / 2;
          // A passage is flagged once its line has been written out, never before the row is there.
          const flagFrom = Math.max(FLAGGED_AT, UNFOLD(r).to + 2 + row.flag[0] * 3);
          const inset = row.speaker === 'B' ? 1.5 : 0;
          const labelX = lerp(x0, ROW_X + 30, across);
          // Before the fold the label sits under its strip segment; it then follows the strip and moves to the row.
          const labelY = lerp(stripY + stripH + 30, row.y + 17, unfold);
          const squareX = lerp(x0, ROW_X, across);
          const squareY = lerp(stripY, row.y + 1, unfold);
          if (head <= x0 && f < REC.to) return null;
          return (
            <g key={row.speaker} opacity={gone}>
              {unfold > 0 && (
                <rect x={squareX + inset} y={squareY + inset} width={18 - 2 * inset} height={18 - 2 * inset} {...paint(row.speaker)} />
              )}
              <text x={labelX} y={labelY} fontSize={18} style={{ ...mono, fill: arrived ? c.ink : c.mute }}>
                {`SPEAKER ${row.speaker}`}
              </text>
              <text
                x={ROW_X + 148}
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
                const reveal = TEXT.x + TEXT.width * linear(f, start, start + 10);
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
                        <rect key={i} x={word.x} y={y} width={w} height={TEXT.bar} fill={flagged ? c.signal : omitted ? c.mute : c.ink} />
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
                  <polygon points={`${ROW_X + 2},${flagY - 9} ${ROW_X + 20},${flagY} ${ROW_X + 2},${flagY + 9}`} fill={c.signal} />
                )}
                {f >= row.confirm && (
                  <polyline
                    points={`${ROW_X},${flagY} ${ROW_X + 8},${flagY + 8} ${ROW_X + 24},${flagY - 9}`}
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

      {/* Left column under the summary: what the marks in act 2 mean, then where the editor is in use. */}
      <g opacity={legend}>
        <rect x={0} y={586} width={30} height={14} fill={c.signal} />
        <text x={46} y={600} fontSize={18} style={mono}>
          UNCERTAIN PASSAGE
        </text>
        <polygon points="7,630 23,639 7,648" fill={c.signal} />
        <text x={46} y={646} fontSize={18} style={mono}>
          PLAYS THE ORIGINAL AUDIO
        </text>
        <polyline points="2,684 10,692 26,675" fill="none" stroke={c.ink} strokeWidth={3} />
        <text x={46} y={692} fontSize={18} style={mono}>
          CONFIRMED BY A PERSON
        </text>
      </g>
      <text x={0} y={600} fontSize={20} opacity={progress(f, 190, 198)} style={mono}>
        IN PILOT AT A DISTRICT ADMINISTRATION
      </text>

      {/* Act 3: the page the turns settle into, where the time stood. It closes with the lines to sign. */}
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
        <rect x={PAGE.inner} y={PAGE.y + 36} width={260} height={24} fill={c.ink} opacity={stepped(progress(f, 182, 184), 1)} />
        <rect x={PAGE.inner} y={PAGE.y + 72} width={170} height={12} fill={c.mute} opacity={stepped(progress(f, 184, 186), 1)} />
        <line
          x1={PAGE.inner}
          x2={PAGE.x + PAGE.w - 40}
          y1={PAGE.y + 106}
          y2={PAGE.y + 106}
          stroke={c.hair}
          strokeWidth={2}
          opacity={stepped(progress(f, 185, 187), 1)}
        />
        {MORE.map((w, i) => (
          <rect
            key={i}
            x={PAGE.inner}
            y={456 + i * 26}
            width={w}
            height={12}
            fill={c.hair}
            opacity={stepped(progress(f, 186 + i * 2, 188 + i * 2), 1)}
          />
        ))}
        {[PAGE.inner, PAGE.x + PAGE.w - 40 - 220].map((x, i) => (
          <line
            key={x}
            x1={x}
            x2={x + 220}
            y1={PAGE.y + PAGE.h - 48}
            y2={PAGE.y + PAGE.h - 48}
            stroke={c.ink}
            strokeWidth={2}
            opacity={f >= 190 + i * 3 ? 1 : 0}
            style={drawn(f, 190 + i * 3, 220, 8)}
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
      </g>
    </svg>
  );
};
