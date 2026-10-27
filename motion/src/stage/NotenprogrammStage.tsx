// Notenprogramm as the opening of its case page (version J): the film's three acts across the whole width, with
// no frame and no ground of its own. The page sets the title and the summary as real text in the same
// 1600 × 900 box; the title heads the choir director's PDF, whose page hangs under it on the left. Under the
// summary, on the right, the transcription is written out on a second page, as in the app's open folder: two
// readers sweep the PDF, only
// the uncertain notes of my voice get brackets on both pages and are confirmed one by one. In the last act the
// question under the transcription turns into the export: MusicXML, and a practice MP3 with every voice equally loud.
// The score is drawn as shapes, no real piece; the notes are the film's (same seed).
import { useCurrentFrame } from 'remotion';
import { seeded } from '../random';
import type { Palette } from '../style';
import { fonts, progress, stepped } from '../style';

/** Two pages side by side under the title: the PDF on the left, the transcription on the right. */
const PAGE = { y: 384, w: 740, h: 280 };
const LEFT = 0;
const RIGHT = 860;
const STAFF = { top: 410, step: 64, gap: 8, x0: 32, x1: 708 };
const VOICES = ['SOPRANO', 'ALTO', 'TENOR', 'BASS'];
const MINE = 2;
const NOTES = 8;
// Drawn in the film's order, so the stage shows the same notes and the same levels as the film.
const random = seeded(18);
/** Height of each note on its staff, in half line steps from the top line. */
const PITCH = VOICES.map(() => Array.from({ length: NOTES }, () => Math.floor(random() * 8)));
/** The notes of my voice the two readers disagree on. */
const UNSURE = [2, 5, 6];
const CONFIRM = [112, 120, 128];

const LANES = [
  { voice: 'TENOR', instrument: 'HARMONICA', mine: true },
  { voice: 'SOPRANO', instrument: 'FLUTE' },
  { voice: 'ALTO', instrument: 'CLARINET' },
  { voice: 'BASS', instrument: 'HORN' },
];
const LANE = { x: 1100, y: 746, h: 22, step: 30, w: 500 };
const levels = Array.from({ length: 54 }, () => 0.45 + random() * 0.55);

/** The row under the transcription: first the question, then the two files of the export. */
const ROW = { y: PAGE.y + PAGE.h + 22, h: 42 };
const NOTE = STAFF.gap / 7; // the film's staves are 7 px apart; heads and stems grow with them

const staffTop = (voice: number) => STAFF.top + voice * STAFF.step;
const noteX = (page: number, i: number) => page + STAFF.x0 + 44 + i * ((STAFF.x1 - STAFF.x0 - 88) / (NOTES - 1));
const noteY = (voice: number, i: number) => staffTop(voice) + 4 * STAFF.gap - (PITCH[voice][i] * STAFF.gap) / 2;
const barX = (page: number) => (noteX(page, 3) + noteX(page, 4)) / 2;

const drawn = (frame: number, start: number, length: number, span = 10) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress(frame, start, start + span)),
});

export const NotenprogrammStage = ({ palette: c }: { palette: Palette }) => {
  const f = useCurrentFrame();
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };

  // Act 3 steps the pages back so the export can take the front.
  const back = 1 - 0.55 * progress(f, 136, 156);
  const scans = [
    { name: 'AUDIVERIS', at: progress(f, 66, 94), y: PAGE.y - 14 },
    { name: 'HOMR', at: progress(f, 72, 100), y: PAGE.y + PAGE.h + 26 },
  ];
  const marker = stepped(progress(f, 98, 104), 3);
  const asking = CONFIRM.findIndex((at) => f >= at - 8 && f < at);
  const caption =
    f < 64
      ? 'THE CHOIR DIRECTOR’S PDF'
      : f < 136
        ? 'TWO READERS · ONLY THE UNCERTAIN NOTES OF MY VOICE'
        : 'ALL VOICES EQUALLY LOUD · BUILT IN 9 DAYS';
  const captionKey = f < 64 ? 0 : f < 136 ? 1 : 2;
  const captionIn = progress(f, [10, 70, 142][captionKey], [18, 78, 150][captionKey]);

  const page = (x: number, start: number) => (
    <rect
      x={x}
      y={PAGE.y}
      width={PAGE.w}
      height={PAGE.h}
      fill="none"
      stroke={c.ink}
      strokeWidth={2}
      style={drawn(f, start, 2 * (PAGE.w + PAGE.h), 14)}
    />
  );

  // Five lines per voice that draw themselves left to right, a bar line in the middle and at the end.
  const staff = (x: number, voice: number, start: number) => {
    const top = staffTop(voice);
    const length = STAFF.x1 - STAFF.x0;
    const bars = stepped(progress(f, start + 6, start + 8), 1);
    return (
      <g key={`${x}-${voice}`}>
        {Array.from({ length: 5 }, (_, k) => (
          <line
            key={k}
            x1={x + STAFF.x0}
            x2={x + STAFF.x1}
            y1={top + k * STAFF.gap}
            y2={top + k * STAFF.gap}
            stroke={c.hair}
            strokeWidth={1.5}
            style={drawn(f, start, length, 8)}
          />
        ))}
        {[x + STAFF.x0, barX(x), x + STAFF.x1].map((bx) => (
          <line key={bx} x1={bx} x2={bx} y1={top} y2={top + 4 * STAFF.gap} stroke={c.hair} strokeWidth={1.5} opacity={bars} />
        ))}
      </g>
    );
  };

  const head = (x: number, y: number, fill: string, key: string) => (
    <g key={key}>
      <ellipse cx={x} cy={y} rx={6.5 * NOTE} ry={4.6 * NOTE} transform={`rotate(-20 ${x} ${y})`} fill={fill} />
      <line x1={x + 6 * NOTE} y1={y} x2={x + 6 * NOTE} y2={y - 24 * NOTE} stroke={fill} strokeWidth={1.8} />
    </g>
  );

  const bracket = (x: number, y: number, color: string, key: string) => {
    const [top, bottom] = [y - 30 * NOTE, y + 9 * NOTE];
    return (
      <g key={key} stroke={color} strokeWidth={2.4} fill="none">
        <polyline points={`${x - 10},${top} ${x - 15},${top} ${x - 15},${bottom} ${x - 10},${bottom}`} />
        <polyline points={`${x + 17},${top} ${x + 22},${top} ${x + 22},${bottom} ${x + 17},${bottom}`} />
      </g>
    );
  };

  return (
    <svg viewBox="0 0 1600 900" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <g opacity={back}>
        {/* Act 1: the PDF under the page title, page and staves first, then the notes voice by voice. */}
        {page(LEFT, 2)}
        {VOICES.map((_, v) => staff(LEFT, v, 10 + v * 3))}
        {VOICES.map((_, v) =>
          PITCH[v].map((_, i) => {
            const shown = stepped(progress(f, 22 + v * 6 + i, 24 + v * 6 + i), 1);
            return shown ? head(noteX(LEFT, i), noteY(v, i), c.ink, `pdf-${v}-${i}`) : null;
          }),
        )}
        <text x={LEFT} y={PAGE.y - 14} fontSize={18} opacity={progress(f, 6, 12) * (1 - progress(f, 64, 70))} style={mono}>
          CHORUS.PDF · 4 VOICES
        </text>

        {/* Act 2: what the readers make of it, written out on the second page. */}
        {page(RIGHT, 66)}
        {VOICES.map((_, v) => staff(RIGHT, v, 74 + v * 3))}
        <rect
          x={RIGHT + STAFF.x0 - 8}
          y={staffTop(MINE) - 11}
          width={(STAFF.x1 - STAFF.x0 + 16) * marker}
          height={4 * STAFF.gap + 22}
          fill={c.hair}
        />
        {/* The marker's key at the far end of the label row, clear of the checks and the question. */}
        <g opacity={marker}>
          <rect x={1600 - 132} y={PAGE.y - 30} width={22} height={18} fill={c.hair} />
          <text x={1600} y={PAGE.y - 14} fontSize={18} textAnchor="end" style={{ ...mono, fill: c.ink }}>
            MY VOICE
          </text>
        </g>
        {VOICES.map((_, v) =>
          PITCH[v].map((_, i) => {
            const shown = stepped(progress(f, 80 + v * 4 + i, 82 + v * 4 + i), 1);
            if (!shown) return null;
            const pending = v === MINE && UNSURE.includes(i) && f < CONFIRM[UNSURE.indexOf(i)];
            const color = v === MINE ? c.ink : c.mute;
            return head(noteX(RIGHT, i), noteY(v, i), pending ? c.mute : color, `tr-${v}-${i}`);
          }),
        )}

        {/* Only the uncertain notes of my voice get brackets, on both pages, and are confirmed one by one. */}
        {UNSURE.map((i, k) => {
          const open = f >= 104 && f < CONFIRM[k];
          if (!open) return null;
          const color = k === asking ? c.signal : c.mute;
          return (
            <g key={`b-${i}`}>
              {bracket(noteX(LEFT, i), noteY(MINE, i), color, 'l')}
              {bracket(noteX(RIGHT, i), noteY(MINE, i), color, 'r')}
            </g>
          );
        })}
        {UNSURE.map((i, k) =>
          f >= CONFIRM[k] ? (
            <polyline
              key={`ok-${i}`}
              points={`${noteX(RIGHT, i) - 7},${staffTop(MINE) - 22} ${noteX(RIGHT, i)},${staffTop(MINE) - 15} ${noteX(RIGHT, i) + 12},${staffTop(MINE) - 31}`}
              fill="none"
              stroke={c.ink}
              strokeWidth={2.4}
              style={drawn(f, CONFIRM[k], 32, 3)}
            />
          ) : null,
        )}

        {scans.map((scan) => {
          if (scan.at <= 0 || scan.at >= 1) return null;
          const x = LEFT + PAGE.w * scan.at;
          return (
            <g key={scan.name}>
              <line x1={x} x2={x} y1={PAGE.y} y2={PAGE.y + PAGE.h} stroke={c.signal} strokeWidth={2} />
              <text x={x + 8} y={scan.y} fontSize={18} style={{ ...mono, fill: c.ink }}>
                {scan.name}
              </text>
            </g>
          );
        })}
        <text x={RIGHT} y={PAGE.y - 14} fontSize={18} opacity={progress(f, 96, 102)} style={mono}>
          AUDIVERIS + HOMR
        </text>
      </g>

      {/* The question, as the app asks it under the transcription, until the last bracket is gone. */}
      <g opacity={progress(f, 104, 108) * (1 - progress(f, 130, 136))}>
        <rect
          x={RIGHT}
          y={ROW.y}
          width={236}
          height={ROW.h}
          fill={asking >= 0 && f >= CONFIRM[asking] - 3 ? c.signal : c.ink}
        />
        <text x={RIGHT + 18} y={ROW.y + 28} fontSize={19} style={{ fontFamily: fonts.mono, fill: c.ground, letterSpacing: 0.5 }}>
          YES, THAT’S RIGHT ↵
        </text>
      </g>

      {/* Act 3: in the question's place the export, MusicXML and a practice MP3 with every voice equally loud. */}
      <g opacity={progress(f, 140, 150)}>
        {['MUSICXML', 'PRACTICE MP3'].map((label, k) => (
          <g key={label}>
            <rect x={RIGHT + k * 196} y={ROW.y} width={180} height={ROW.h} fill="none" stroke={c.ink} strokeWidth={2} />
            <text x={RIGHT + k * 196 + 16} y={ROW.y + 28} fontSize={18} style={{ ...mono, fill: c.ink }}>
              {label}
            </text>
          </g>
        ))}
      </g>
      {LANES.map((lane, k) => {
        const shown = stepped(progress(f, 146 + k * 3, 150 + k * 3), 1);
        if (!shown) return null;
        const y = LANE.y + k * LANE.step;
        const color = lane.mine ? c.signal : c.ink;
        const played = 0.3 + 0.7 * progress(f, 156, 204);
        return (
          <g key={lane.voice}>
            <text x={RIGHT} y={y + 16} fontSize={17} style={{ ...mono, fill: lane.mine ? c.ink : c.mute }}>
              {`${lane.voice} · ${lane.instrument}`}
            </text>
            {levels.map((level, i) => {
              const x = LANE.x + i * (LANE.w / levels.length);
              const h = LANE.h * level;
              return (
                <rect
                  key={i}
                  x={x}
                  y={y + (LANE.h - h) / 2}
                  width={4.5}
                  height={h}
                  fill={color}
                  opacity={i / levels.length < played ? 1 : 0.25}
                />
              );
            })}
          </g>
        );
      })}

      {/* Under the title, what each act means: the title heads the PDF, then the check, then the result. */}
      <text x={0} y={296} fontSize={21} opacity={captionIn} style={mono}>
        {caption}
      </text>

      {/* Left, under the PDF: the line the film closes on. */}
      <defs>
        <clipPath id="noten-stage-closing">
          <rect x={0} y={724} width={800} height={96} />
        </clipPath>
      </defs>
      <g clipPath="url(#noten-stage-closing)">
        <text
          x={-2}
          y={796 + (1 - progress(f, 166, 182)) * 96}
          fontSize={64}
          style={{ fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -2, fill: c.ink }}
        >
          Check, <tspan fill={c.signal}>don’t retype.</tspan>
        </text>
      </g>
    </svg>
  );
};
