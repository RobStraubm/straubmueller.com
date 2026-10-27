// Notenprogramm in seven seconds, on one stage that stays in view: the choir director's PDF, two readers that
// transcribe it independently, only the uncertain notes of my voice put in brackets and confirmed one by one,
// then the export: MusicXML and a practice MP3 in which every voice is equally loud.
// The score is drawn as shapes (no real piece); the readers, brackets, instruments and figures are the app's.
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ActWord, Labels, type Act } from '../parts';
import { seeded } from '../random';
import { fonts, palettes, progress, SIZE, stepped, type Theme, POSTER_VIEW } from '../style';

export const NOTENPROGRAMM_FRAMES = 210;

export const NOTENPROGRAMM_ACTS: Act[] = [
  { word: 'PDF', from: 0, to: 64 },
  { word: 'CHECK', from: 64, to: 136 },
  { word: 'PRACTICE', from: 136, to: Infinity },
];

/** Two pages side by side: the PDF on the left, the transcription on the right. */
const PAGE = { y: 296, w: 316, h: 300 };
const LEFT = 64;
const RIGHT = 420;
const STAFF = { top: 344, step: 62, gap: 7, x0: 28, x1: 296 };
const VOICES = ['SOPRANO', 'ALTO', 'TENOR', 'BASS'];
const MINE = 2;
const NOTES = 8;
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
const LANE = { x: 300, y: 672, h: 22, step: 30, w: 436 };
const levels = Array.from({ length: 54 }, () => 0.45 + random() * 0.55);

const staffTop = (voice: number) => STAFF.top + voice * STAFF.step;
const noteX = (page: number, i: number) => page + STAFF.x0 + 24 + i * ((STAFF.x1 - STAFF.x0 - 40) / (NOTES - 1));
const noteY = (voice: number, i: number) => staffTop(voice) + 4 * STAFF.gap - (PITCH[voice][i] * STAFF.gap) / 2;

export const Notenprogramm = ({ theme }: { theme: Theme }) => {
  const f = useCurrentFrame();
  const c = palettes[theme];
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

  const page = (x: number, drawn: number) => {
    const length = 2 * (PAGE.w + PAGE.h);
    return (
      <rect
        x={x}
        y={PAGE.y}
        width={PAGE.w}
        height={PAGE.h}
        fill="none"
        stroke={c.ink}
        strokeWidth={2}
        style={{ strokeDasharray: length, strokeDashoffset: length * (1 - drawn) }}
      />
    );
  };

  const staff = (x: number, voice: number, shown: number) => (
    <g key={`${x}-${voice}`} opacity={shown}>
      {Array.from({ length: 5 }, (_, k) => (
        <line
          key={k}
          x1={x + STAFF.x0}
          x2={x + STAFF.x1}
          y1={staffTop(voice) + k * STAFF.gap}
          y2={staffTop(voice) + k * STAFF.gap}
          stroke={c.hair}
          strokeWidth={1.5}
        />
      ))}
    </g>
  );

  const head = (x: number, y: number, fill: string, key: string, scale = 1) => (
    <g key={key}>
      <ellipse cx={x} cy={y} rx={6.5 * scale} ry={4.6 * scale} transform={`rotate(-20 ${x} ${y})`} fill={fill} />
      <line x1={x + 6 * scale} y1={y} x2={x + 6 * scale} y2={y - 24} stroke={fill} strokeWidth={1.8} />
    </g>
  );

  const bracket = (x: number, y: number, color: string, key: string) => (
    <g key={key} stroke={color} strokeWidth={2.4} fill="none">
      <polyline points={`${x - 9},${y - 30} ${x - 13},${y - 30} ${x - 13},${y + 9} ${x - 9},${y + 9}`} />
      <polyline points={`${x + 15},${y - 30} ${x + 19},${y - 30} ${x + 19},${y + 9} ${x + 15},${y + 9}`} />
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: c.ground }}>
      <svg width={SIZE.width} height={SIZE.height} viewBox={POSTER_VIEW}>
        <Labels frame={f} project="Notenprogramm" acts={NOTENPROGRAMM_ACTS} palette={c} />
        <ActWord frame={f} acts={NOTENPROGRAMM_ACTS} palette={c} />

        <g opacity={back}>
          {/* The PDF, page and staves first, then the notes voice by voice. */}
          {page(LEFT, progress(f, 2, 16))}
          <rect x={LEFT + STAFF.x0} y={PAGE.y + 16} width={120} height={8} fill={c.mute} opacity={progress(f, 10, 16)} />
          {VOICES.map((_, v) => staff(LEFT, v, stepped(progress(f, 12 + v * 3, 16 + v * 3), 1)))}
          {VOICES.map((_, v) =>
            PITCH[v].map((_, i) => {
              const shown = stepped(progress(f, 22 + v * 6 + i, 24 + v * 6 + i), 1);
              return shown ? head(noteX(LEFT, i), noteY(v, i), c.ink, `pdf-${v}-${i}`) : null;
            }),
          )}
          <text x={LEFT} y={PAGE.y - 14} fontSize={16} opacity={progress(f, 6, 12) * (1 - progress(f, 64, 70))} style={mono}>
            CHORUS.PDF · 4 VOICES
          </text>

          {/* The transcription: what the readers make of it, written out on the second page. */}
          {page(RIGHT, progress(f, 66, 80))}
          {VOICES.map((_, v) => staff(RIGHT, v, stepped(progress(f, 74 + v * 3, 78 + v * 3), 1)))}
          <rect
            x={RIGHT + STAFF.x0 - 6}
            y={staffTop(MINE) - 9}
            width={(STAFF.x1 - STAFF.x0 + 12) * marker}
            height={4 * STAFF.gap + 18}
            fill={c.hair}
          />
          {/* The marker's key sits under the question, so it never covers a check or the button. */}
          <g opacity={marker}>
            <rect x={RIGHT} y={PAGE.y + PAGE.h + 74} width={20} height={16} fill={c.hair} />
            <text x={RIGHT + 30} y={PAGE.y + PAGE.h + 88} fontSize={15} style={{ ...mono, fill: c.ink }}>
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
                points={`${noteX(RIGHT, i) - 6},${staffTop(MINE) - 22} ${noteX(RIGHT, i)},${staffTop(MINE) - 16} ${noteX(RIGHT, i) + 10},${staffTop(MINE) - 30}`}
                fill="none"
                stroke={c.ink}
                strokeWidth={2.4}
              />
            ) : null,
          )}

          {scans.map((scan) => {
            if (scan.at <= 0 || scan.at >= 1) return null;
            const x = LEFT + PAGE.w * scan.at;
            return (
              <g key={scan.name}>
                <line x1={x} x2={x} y1={PAGE.y} y2={PAGE.y + PAGE.h} stroke={c.signal} strokeWidth={2} />
                <text x={x + 6} y={scan.y} fontSize={16} style={{ ...mono, fill: c.ink }}>
                  {scan.name}
                </text>
              </g>
            );
          })}
          <text x={RIGHT} y={PAGE.y - 14} fontSize={16} opacity={progress(f, 96, 102)} style={mono}>
            AUDIVERIS + HOMR
          </text>
        </g>

        {/* The question, as the app asks it, until the last bracket is gone. */}
        <g opacity={progress(f, 104, 108) * (1 - progress(f, 130, 136))}>
          <rect
            x={RIGHT}
            y={PAGE.y + PAGE.h + 18}
            width={210}
            height={40}
            fill={asking >= 0 && f >= CONFIRM[asking] - 3 ? c.signal : c.ink}
          />
          <text
            x={RIGHT + 16}
            y={PAGE.y + PAGE.h + 44}
            fontSize={17}
            style={{ fontFamily: fonts.mono, fill: c.ground, letterSpacing: 0.5 }}
          >
            YES, THAT’S RIGHT ↵
          </text>
        </g>

        {/* Act 3: the export, MusicXML and a practice MP3 with every voice equally loud. */}
        <g opacity={progress(f, 140, 150)}>
          {['MUSICXML', 'PRACTICE MP3'].map((label, k) => (
            <g key={label}>
              <rect x={64 + k * 170} y={632} width={156} height={34} fill="none" stroke={c.ink} strokeWidth={2} />
              <text x={64 + k * 170 + 12} y={655} fontSize={16} style={{ ...mono, fill: c.ink }}>
                {label}
              </text>
            </g>
          ))}
        </g>
        {LANES.map((lane, k) => {
          const shown = stepped(progress(f, 146 + k * 3, 150 + k * 3), 1);
          if (!shown) return null;
          const y = LANE.y + 20 + k * LANE.step;
          const color = lane.mine ? c.signal : c.ink;
          const head = 0.3 + 0.7 * progress(f, 156, 204);
          return (
            <g key={lane.voice}>
              <text x={64} y={y + 15} fontSize={15} style={{ ...mono, fill: lane.mine ? c.ink : c.mute }}>
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
                    width={4}
                    height={h}
                    fill={color}
                    opacity={i / levels.length < head ? 1 : 0.25}
                  />
                );
              })}
            </g>
          );
        })}

        <text x={64} y={840} fontSize={18} opacity={captionIn} style={mono}>
          {caption}
        </text>
        <g>
          <defs>
            <clipPath id="noten-closing">
              <rect x={0} y={860} width={800} height={110} />
            </clipPath>
          </defs>
          <g clipPath="url(#noten-closing)">
            <text
              x={64}
              y={922 + (1 - progress(f, 166, 182)) * 110}
              fontSize={44}
              style={{ fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -1, fill: c.ink }}
            >
              Check, <tspan fill={c.signal}>don’t retype.</tspan>
            </text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
