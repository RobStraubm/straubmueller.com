// Saunter in seven seconds: the walking pad's remote, which keeps no record of a walk; the Mac app built
// instead, with shortcuts, live data and every walk saved to Apple Health; and the goal it sets: once around
// Lake Constance. One stage: the remote becomes the app's panel, and nothing leaves until the end.
// The walk is a real session (0.71 km in 21 minutes at 2.0 km/h); the trail on the lake shows the idea of
// the journey, not Robert's position on it.
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ActWord, Labels, type Act } from '../parts';
import { fonts, palettes, progress, SIZE, stepped, type Theme, POSTER_VIEW } from '../style';

export const SAUNTER_FRAMES = 210;

export const SAUNTER_ACTS: Act[] = [
  { word: 'REMOTE', from: 0, to: 64 },
  { word: 'APP', from: 64, to: 136 },
  { word: 'LAKE', from: 136, to: Infinity },
];

/** Belt speed: started on the remote, raised in 0.5 km/h steps, ended from the Mac with ⌃⌥⌘ E. */
export const PRESSES = [8, 18, 28, 38];
export const END = 110;
export const speedAt = (frame: number) => (frame >= END ? 0 : PRESSES.filter((at) => frame >= at).length * 0.5);
export const pressed = (frame: number, at: number) => frame >= at && frame < at + 5;

/** The tracked walk counts up while the app runs the pad. */
export const WALK = { from: 86, to: END, km: 0.71, min: 21 };

export const CHIPS = [
  { keys: '⌃⌥⌘ SPACE', does: 'START' },
  { keys: '⌃⌥⌘ ↑', does: '+0.5 KM/H' },
  { keys: '⌃⌥⌘ E', does: 'END + HEALTH' },
];

/** Lake Constance (Obersee and Überlinger See) from shore towns, starting in Konstanz and going clockwise. */
export const LAKE: [number, number][] = [
  [62, 106], [76, 92], [71, 79], [62, 72], [40, 59], [36, 46], [0, 13], [13, 0], [31, 13], [58, 33],
  [71, 46], [89, 66], [107, 86], [129, 92], [151, 99], [200, 112], [226, 145], [253, 152], [289, 178],
  [320, 211], [289, 224], [262, 218], [204, 224], [178, 198], [155, 165], [115, 145], [89, 125],
  [67, 112], [62, 106],
];
export const lakeLength = LAKE.slice(1).reduce((sum, [x, y], i) => sum + Math.hypot(x - LAKE[i][0], y - LAKE[i][1]), 0);
const LAKE_AT = { x: 80, y: 470 };

/** The point a given share of the way around the lake. */
export const alongLake = (share: number) => {
  let left = share * lakeLength;
  for (let i = 1; i < LAKE.length; i++) {
    const [x0, y0] = LAKE[i - 1];
    const [x1, y1] = LAKE[i];
    const step = Math.hypot(x1 - x0, y1 - y0);
    if (left <= step) return [x0 + ((x1 - x0) * left) / step, y0 + ((y1 - y0) * left) / step];
    left -= step;
  }
  return LAKE[LAKE.length - 1];
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** A value through the acts: remote to app while t12 runs, app to lake while t23 runs. */
const three = (a: number, b: number, c: number, t12: number, t23: number) => lerp(lerp(a, b, t12), c, t23);

const drawn = (frame: number, start: number, length: number, span = 12) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress(frame, start, start + span)),
});

/** Remote (act 1) and app panel (acts 2 and 3) are the same outline, on the right, so it opens in place. */
const BODY = [
  { x: 554, y: 300, w: 150, h: 290, r: 18 },
  { x: 420, y: 304, w: 316, h: 224, r: 8 },
];

/** The list of walks: empty beside the remote, under the panel once the app records. */
const LIST = [
  { x: 64, y: 500, end: 470 },
  { x: 420, y: 568, end: 736 },
];

export const Saunter = ({ theme }: { theme: Theme }) => {
  const f = useCurrentFrame();
  const c = palettes[theme];
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };
  const sans = { fontFamily: fonts.sans, fill: c.ink };
  const onSignal = theme === 'light' ? c.ground : c.ink;

  const t12 = progress(f, 64, 86);
  // The remote opens into the panel in place. The speed shrinks first, then glides across above the
  // buttons and drops in between them, so nothing crosses on the way.
  const tButtons = progress(f, 64, 80);
  const tShrink = progress(f, 64, 72);
  const tGlideX = progress(f, 68, 82);
  const tGlideY = progress(f, 80, 90);
  const t23 = progress(f, 136, 156);
  // In the last act the app steps back so the lake can lead; it stays readable.
  const back = 1 - 0.45 * t23;

  const speed = speedAt(f);
  let belt = 0;
  for (let i = 0; i < f; i++) belt += speedAt(i) * 2.4;

  const walked = progress(f, WALK.from, WALK.to);
  const km = WALK.km * walked;
  const minutes = WALK.min * walked;
  const clock = `${String(Math.floor(minutes)).padStart(2, '0')}:${String(Math.floor((minutes % 1) * 60)).padStart(2, '0')}`;

  const body = {
    x: lerp(BODY[0].x, BODY[1].x, tButtons),
    y: lerp(BODY[0].y, BODY[1].y, tButtons),
    w: lerp(BODY[0].w, BODY[1].w, tButtons),
    h: lerp(BODY[0].h, BODY[1].h, tButtons),
    r: lerp(BODY[0].r, BODY[1].r, tButtons),
  };
  const list = {
    x: lerp(LIST[0].x, LIST[1].x, t12),
    y: lerp(LIST[0].y, LIST[1].y, t12),
    end: lerp(LIST[0].end, LIST[1].end, t12),
  };

  // Remote buttons become the panel's controls.
  // On the remote + and − sit on top and START at the bottom; in the panel − 2.0 + is one row above START.
  const start = {
    x: lerp(603, 444, tButtons),
    y: lerp(502, 482, tButtons),
    w: lerp(52, 268, tButtons),
    h: lerp(52, 32, tButtons),
    r: lerp(26, 4, tButtons),
  };
  const plus = { x: lerp(629, 690, tButtons), y: lerp(360, 452, tButtons), r: lerp(26, 18, tButtons) };
  const minus = { x: lerp(629, 466, tButtons), y: lerp(444, 452, tButtons), r: lerp(26, 18, tButtons) };
  const speedSize = lerp(84, 28, tShrink);
  const plusDown = PRESSES.slice(1).some((at) => pressed(f, at));
  const startDown = pressed(f, PRESSES[0]);

  const rowEntry = '21 MIN · 0.71 KM';
  const typed = Math.round(rowEntry.length * progress(f, END + 2, END + 12));
  const ring = progress(f, 118, 132);
  const ringRed = f < 140;

  const captions = [
    { lines: ['THE REMOTE: PRESS, PRESS, PRESS.', 'NO RECORD OF THE WALK.'], show: 1 - progress(f, 62, 68) },
    {
      lines: ['A MAC APP INSTEAD: SHORTCUTS, LIVE DATA,', 'EVERY WALK IN APPLE HEALTH.'],
      show: progress(f, 80, 88) * (1 - progress(f, 134, 140)),
    },
  ];

  const share = 0.17 * progress(f, 152, 198);
  const trail = Array.from({ length: 30 }, (_, k) => alongLake((share * k) / 29));
  const [dotX, dotY] = alongLake(share);

  return (
    <AbsoluteFill style={{ backgroundColor: c.ground }}>
      <svg width={SIZE.width} height={SIZE.height} viewBox={POSTER_VIEW}>
        <Labels frame={f} project="Saunter" acts={SAUNTER_ACTS} palette={c} />
        <ActWord frame={f} acts={SAUNTER_ACTS} palette={c} />

        {/* The Mac's menu bar, where the app lives from act 2 on. */}
        <g opacity={progress(f, 70, 78) * back}>
          <line x1={64} y1={288} x2={736} y2={288} stroke={c.hair} strokeWidth={2} style={drawn(f, 70, 672, 14)} />
          <text x={64} y={276} fontSize={15} style={mono}>
            MENU BAR
          </text>
          <g transform="translate(598 262)">
            <circle cx={6} cy={2} r={3.5} fill={c.ink} />
            <path d="M6 6 L5 15 M5 10 L10 13 M5 10 L1 12 M5 15 L9 21 M5 15 L1 21" stroke={c.ink} strokeWidth={2} strokeLinecap="round" fill="none" />
          </g>
          <text
            x={736}
            y={276}
            fontSize={16}
            textAnchor="end"
            style={{ ...mono, fill: c.ink, fontVariantNumeric: 'tabular-nums' }}
          >
            {`${speed.toFixed(1)} · ${clock}`}
          </text>
        </g>

        {/* Shortcuts that work anywhere on the Mac. */}
        <g opacity={back}>
          {CHIPS.map((chip, i) => {
            const shown = stepped(progress(f, 86 + i * 6, 90 + i * 6), 1);
            if (!shown) return null;
            const y = 316 + i * 48;
            const red = i === 2 && pressed(f, END - 2);
            return (
              <g key={chip.keys}>
                <rect x={64} y={y} width={252} height={36} fill={red ? c.signal : 'none'} stroke={c.ink} strokeWidth={2} />
                <text x={78} y={y + 24} fontSize={16} style={{ ...mono, fill: red ? onSignal : c.ink, letterSpacing: 0.5 }}>
                  {chip.keys}
                </text>
                <text x={302} y={y + 24} fontSize={16} textAnchor="end" style={{ ...mono, fill: red ? onSignal : c.mute, letterSpacing: 0.5 }}>
                  {chip.does}
                </text>
              </g>
            );
          })}
        </g>

        {/* The remote, then the app panel: one outline. */}
        <g opacity={back}>
          <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.r} fill="none" stroke={c.ink} strokeWidth={2.5} />

          {/* Distance and time, recorded only once the app runs the pad. */}
          <g opacity={progress(f, 84, 92)}>
            <text x={444} y={362} fontSize={50} style={{ ...sans, fontWeight: 800, letterSpacing: -2, fontVariantNumeric: 'tabular-nums' }}>
              {km.toFixed(2)}
              <tspan dx={12}>KM</tspan>
            </text>
            <text x={444} y={392} fontSize={18} style={{ ...mono, fill: c.ink, fontVariantNumeric: 'tabular-nums' }}>
              {`${String(Math.floor(minutes)).padStart(2, '0')} MIN`}
            </text>
            <line x1={444} y1={410} x2={712} y2={410} stroke={c.hair} strokeWidth={2} />
          </g>

          <text
            x={lerp(64, 662, tGlideX)}
            y={lerp(330, 392, tGlideX)}
            fontSize={lerp(18, 15, tGlideX)}
            style={mono}
          >
            SPEED
          </text>
          <text
            x={lerp(270, 578, tGlideX)}
            y={lerp(420, 461, tGlideY)}
            fontSize={speedSize}
            textAnchor="middle"
            style={{ ...sans, fontWeight: 800, letterSpacing: -speedSize * 0.045, fontVariantNumeric: 'tabular-nums' }}
          >
            {(f < END ? speed : 2).toFixed(1)}
            <tspan dx={speedSize * 0.22}>KM/H</tspan>
          </text>

          <rect
            x={start.x}
            y={start.y}
            width={start.w}
            height={start.h}
            rx={start.r}
            fill={startDown ? c.signal : c.ground}
            stroke={c.ink}
            strokeWidth={2}
          />
          <text
            x={start.x + start.w / 2}
            y={lerp(start.y + start.h + 22, start.y + 21, tButtons)}
            fontSize={15}
            textAnchor="middle"
            style={{ ...mono, fill: c.ink }}
          >
            START · STOP
          </text>

          {[
            { at: plus, glyph: '+', down: plusDown },
            { at: minus, glyph: '−', down: false },
          ].map(({ at, glyph, down }) => (
            <g key={glyph}>
              <circle cx={at.x} cy={at.y} r={at.r} fill={down ? c.signal : c.ground} stroke={c.ink} strokeWidth={2} />
              <text
                x={at.x}
                y={at.y + at.r * 0.42}
                fontSize={at.r * 1.3}
                textAnchor="middle"
                style={{ ...sans, fontWeight: 600, fill: down ? onSignal : c.ink }}
              >
                {glyph}
              </text>
            </g>
          ))}
        </g>

        {/* Walks: nothing beside the remote, the first entry once the app has tracked one. */}
        <g opacity={back}>
          <text x={list.x} y={list.y} fontSize={18} style={mono}>
            WALKS
          </text>
          <text x={736} y={list.y} fontSize={15} textAnchor="end" opacity={progress(f, 116, 122)} style={{ ...mono, fill: c.ink }}>
            → APPLE HEALTH
          </text>
          {[0, 1, 2].map((i) => {
            const y = list.y + 36 + i * 32;
            const entry = i === 0 && typed > 0;
            return (
              <g key={i}>
                <text x={list.x} y={y} fontSize={17} style={{ ...mono, fill: entry ? c.ink : c.mute }}>
                  {entry ? rowEntry.slice(0, typed) : '—'}
                </text>
                <line x1={list.x} y1={y + 12} x2={list.end} y2={y + 12} stroke={c.hair} strokeWidth={2} />
              </g>
            );
          })}
          {ring > 0 && (
            <g>
              <circle cx={714} cy={list.y + 30} r={13} fill="none" stroke={c.hair} strokeWidth={5} />
              <circle
                cx={714}
                cy={list.y + 30}
                r={13}
                fill="none"
                stroke={ringRed ? c.signal : c.ink}
                strokeWidth={5}
                strokeLinecap="round"
                transform={`rotate(-90 714 ${list.y + 30})`}
                strokeDasharray={2 * Math.PI * 13}
                strokeDashoffset={2 * Math.PI * 13 * (1 - ring)}
              />
            </g>
          )}
        </g>

        {/* Act 3: the goal the app sets, once around Lake Constance from Konstanz. */}
        {f >= 138 && (
          <g transform={`translate(${LAKE_AT.x} ${LAKE_AT.y})`}>
            <polyline
              points={LAKE.map(([x, y]) => `${x},${y}`).join(' ')}
              fill="none"
              stroke={c.ink}
              strokeWidth={2.5}
              strokeLinejoin="round"
              style={drawn(f, 138, lakeLength, 26)}
            />
            {share > 0 && (
              <>
                <polyline
                  points={trail.map(([x, y]) => `${x},${y}`).join(' ')}
                  fill="none"
                  stroke={c.signal}
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx={dotX} cy={dotY} r={10} fill={c.signal} />
              </>
            )}
            <circle cx={LAKE[0][0]} cy={LAKE[0][1]} r={5} fill={c.ink} opacity={progress(f, 146, 150)} />
            <g opacity={progress(f, 150, 158)}>
              {['GOAL:', 'ONCE AROUND', 'LAKE CONSTANCE'].map((line, i) => (
                <text key={line} x={172} y={26 + i * 22} fontSize={16} style={{ ...mono, fill: i === 0 ? c.mute : c.ink }}>
                  {line}
                </text>
              ))}
            </g>
          </g>
        )}

        {/* The walking pad, side view, all film long; its belt runs at the speed set. */}
        <g>
          <rect x={104} y={728} width={592} height={40} rx={20} fill="none" stroke={c.ink} strokeWidth={2.5} />
          <circle cx={124} cy={748} r={11} fill="none" stroke={c.ink} strokeWidth={2} />
          <circle cx={676} cy={748} r={11} fill="none" stroke={c.ink} strokeWidth={2} />
          <line
            x1={146}
            y1={736}
            x2={654}
            y2={736}
            stroke={c.mute}
            strokeWidth={3}
            strokeDasharray="14 12"
            strokeDashoffset={belt}
          />
          <line x1={140} y1={768} x2={130} y2={782} stroke={c.ink} strokeWidth={2.5} />
          <line x1={660} y1={768} x2={670} y2={782} stroke={c.ink} strokeWidth={2.5} />
          <text x={104} y={812} fontSize={15} style={mono}>
            WALKING PAD
          </text>
        </g>

        {/* Captions for the first two acts, the line the app is named for at the end. */}
        {captions.map((caption, k) =>
          caption.show > 0 ? (
            <g key={k} opacity={caption.show}>
              {caption.lines.map((line, i) => (
                <text key={line} x={64} y={880 + i * 28} fontSize={18} style={mono}>
                  {line}
                </text>
              ))}
            </g>
          ) : null,
        )}
        <g>
          <defs>
            <clipPath id="saunter-close">
              <rect x={0} y={858} width={800} height={100} />
            </clipPath>
          </defs>
          <g clipPath="url(#saunter-close)">
            <text
              x={64}
              y={918 + (1 - progress(f, 156, 172)) * 110}
              fontSize={46}
              style={{ ...sans, fontWeight: 600, letterSpacing: -1 }}
            >
              Walk while you <tspan fill={c.signal}>work.</tspan>
            </text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
