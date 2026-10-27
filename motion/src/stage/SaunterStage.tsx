// Saunter as the opening of its case page (version J): the same three acts as the film, laid out across the
// whole width with no frame and no ground of its own. The page sets the title and the summary as real text in
// the same 1600 × 900 box; the drawing leaves room for them and builds around them. The title stands on the
// walking pad, which runs the full width and turns at the belt speed the remote and then the app set.
// Scrolling moves the frame; the belt keeps running in real time (`belt`, from the page) while the pad is on.
import { useCurrentFrame } from 'remotion';
import type { Palette } from '../style';
import { fonts, progress, stepped } from '../style';
import { alongLake, CHIPS, END, LAKE, lakeLength, PRESSES, pressed, speedAt, WALK } from '../saunter/Saunter';

export const STAGE = { width: 1600, height: 900 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const drawn = (frame: number, start: number, length: number, span = 12) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress(frame, start, start + span)),
});

/** Remote (act 1) and app window (acts 2 and 3): one outline that opens in place. */
const BODY = [
  { x: 1200, y: 150, w: 210, h: 440, r: 26 },
  { x: 880, y: 120, w: 700, h: 420, r: 10 },
];

/** The list of walks: empty beside the remote, under the window once the app records. */
const LIST = [
  { x: 1200, y: 626, end: 1580 },
  { x: 880, y: 600, end: 1580 },
];

const PAD = { x: 0, y: 772, w: 1600, h: 44 };
const LAKE_SCALE = 1.15;

export const SaunterStage = ({ palette: c, belt = 0 }: { palette: Palette; belt?: number }) => {
  const f = useCurrentFrame();
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };
  const sans = { fontFamily: fonts.sans, fill: c.ink };
  const onSignal = c.ground;

  const t12 = progress(f, 64, 86);
  const tButtons = progress(f, 64, 80);
  const tShrink = progress(f, 64, 72);
  const tGlideX = progress(f, 68, 82);
  const tGlideY = progress(f, 80, 90);
  const t23 = progress(f, 136, 156);

  const speed = speedAt(f);
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

  // On the remote + and − sit on top and START below; in the app − 2.0 + is one row above START · STOP.
  const controls = 1 - t23;
  const start = {
    x: lerp(1270, 912, tButtons),
    y: lerp(450, 476, tButtons),
    w: lerp(70, 636, tButtons),
    h: lerp(70, 40, tButtons),
    r: lerp(35, 4, tButtons),
  };
  const plus = { x: lerp(1305, 1520, tButtons), y: lerp(240, 420, tButtons), r: lerp(36, 24, tButtons) };
  const minus = { x: lerp(1305, 940, tButtons), y: lerp(356, 420, tButtons), r: lerp(36, 24, tButtons) };
  const speedSize = lerp(112, 44, tShrink);
  const plusDown = PRESSES.slice(1).some((at) => pressed(f, at));
  const startDown = pressed(f, PRESSES[0]);

  const rowEntry = '21 MIN · 0.71 KM';
  const typed = Math.round(rowEntry.length * progress(f, END + 2, END + 12));
  const ring = progress(f, 118, 132);

  const captions = [
    { lines: ['THE REMOTE: PRESS, PRESS, PRESS.', 'NO RECORD OF THE WALK.'], show: 1 - progress(f, 62, 68) },
    {
      lines: ['A MAC APP INSTEAD: SHORTCUTS,', 'LIVE DATA, EVERY WALK IN APPLE HEALTH.'],
      show: progress(f, 80, 88) * (1 - progress(f, 134, 140)),
    },
  ];

  const share = 0.17 * progress(f, 152, 198);
  const trail = Array.from({ length: 30 }, (_, k) => alongLake((share * k) / 29));
  const [dotX, dotY] = alongLake(share);
  const lakeAt = { x: body.x + 322, y: body.y + 148 };

  return (
    <svg viewBox={`0 0 ${STAGE.width} ${STAGE.height}`} width="100%" height="100%" overflow="visible" aria-hidden="true">
      {/* The Mac's menu bar along the top of the page, where the app lives from act 2 on. */}
      <g opacity={progress(f, 70, 78)}>
        <line x1={0} y1={64} x2={1600} y2={64} stroke={c.hair} strokeWidth={2} style={drawn(f, 70, 1600, 14)} />
        <g transform="translate(1318 22)">
          <circle cx={7} cy={3} r={4.5} fill={c.ink} />
          <path
            d="M7 8 L6 19 M6 13 L12 17 M6 13 L1 15 M6 19 L11 27 M6 19 L1 27"
            stroke={c.ink}
            strokeWidth={2.4}
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <text x={1600} y={46} fontSize={22} textAnchor="end" style={{ ...mono, fill: c.ink, fontVariantNumeric: 'tabular-nums' }}>
          {`${speed.toFixed(1)} KM/H · ${clock}`}
        </text>
      </g>

      {/* Left column under the summary: what each act means. */}
      {captions.map((caption, k) =>
        caption.show > 0 ? (
          <g key={k} opacity={caption.show}>
            {caption.lines.map((line, i) => (
              <text key={line} x={0} y={330 + i * 32} fontSize={21} style={mono}>
                {line}
              </text>
            ))}
          </g>
        ) : null,
      )}

      {/* Shortcuts that work anywhere on the Mac. */}
      <g opacity={1 - t23}>
        {CHIPS.map((chip, i) => {
          const shown = stepped(progress(f, 86 + i * 6, 90 + i * 6), 1);
          if (!shown) return null;
          const y = 404 + i * 52;
          const red = i === 2 && pressed(f, END - 2);
          return (
            <g key={chip.keys}>
              <rect x={0} y={y} width={360} height={42} fill={red ? c.signal : 'none'} stroke={c.ink} strokeWidth={2} />
              <text x={16} y={y + 28} fontSize={19} style={{ ...mono, fill: red ? onSignal : c.ink, letterSpacing: 0.5 }}>
                {chip.keys}
              </text>
              <text x={344} y={y + 28} fontSize={19} textAnchor="end" style={{ ...mono, fill: red ? onSignal : c.mute, letterSpacing: 0.5 }}>
                {chip.does}
              </text>
            </g>
          );
        })}
      </g>

      {/* Act 3, left: the line the app is named for, and the goal it sets. */}
      <g opacity={progress(f, 150, 166)}>
        <text x={0} y={394} fontSize={58} style={{ ...sans, fontWeight: 600, letterSpacing: -1.5 }}>
          Walk while you <tspan fill={c.signal}>work.</tspan>
        </text>
        {['GOAL: ONCE AROUND LAKE CONSTANCE,', 'FROM KONSTANZ, ONE WALK AT A TIME.'].map((line, i) => (
          <text key={line} x={0} y={450 + i * 32} fontSize={21} style={mono}>
            {line}
          </text>
        ))}
      </g>

      {/* The remote, then the app window: one outline. */}
      <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.r} fill="none" stroke={c.ink} strokeWidth={2.5} />

      {/* Distance and time, recorded only once the app runs the pad. They stay for the last act. */}
      <g opacity={progress(f, 84, 92)}>
        <text x={912} y={226} fontSize={76} style={{ ...sans, fontWeight: 800, letterSpacing: -3, fontVariantNumeric: 'tabular-nums' }}>
          {km.toFixed(2)}
          <tspan dx={16}>KM</tspan>
        </text>
        <text x={912} y={268} fontSize={22} style={{ ...mono, fill: c.ink, fontVariantNumeric: 'tabular-nums' }}>
          {`${String(Math.floor(minutes)).padStart(2, '0')} MIN`}
        </text>
        <line x1={912} y1={300} x2={lerp(1548, 1180, t23)} y2={300} stroke={c.hair} strokeWidth={2} />
      </g>

      <g opacity={controls}>
        <text
          x={lerp(660, 912, tGlideX)}
          y={lerp(250, 372, tGlideX)}
          fontSize={lerp(22, 17, tGlideX)}
          style={mono}
        >
          SPEED
        </text>
        <text
          x={lerp(860, 1230, tGlideX)}
          y={lerp(372, 436, tGlideY)}
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
          y={lerp(start.y + start.h + 30, start.y + 27, tButtons)}
          fontSize={18}
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

      {/* Act 3, in the window: the journey view of the app, around Lake Constance from Konstanz. */}
      {f >= 138 && (
        <g transform={`translate(${lakeAt.x} ${lakeAt.y}) scale(${LAKE_SCALE})`}>
          <polyline
            points={LAKE.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none"
            stroke={c.ink}
            strokeWidth={2.5 / LAKE_SCALE}
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
        </g>
      )}
      <g opacity={progress(f, 146, 156)}>
        <text x={912} y={364} fontSize={17} style={mono}>
          JOURNEY
        </text>
        {['KONSTANZ →', 'ONCE AROUND', 'THE LAKE'].map((line, i) => (
          <text key={line} x={912} y={412 + i * 28} fontSize={19} style={{ ...mono, fill: c.ink }}>
            {line}
          </text>
        ))}
      </g>

      {/* Walks: nothing beside the remote, the first entry once the app has tracked one. */}
      <g>
        <text x={list.x} y={list.y} fontSize={21} style={mono}>
          WALKS
        </text>
        <text x={list.end} y={list.y} fontSize={18} textAnchor="end" opacity={progress(f, 116, 122)} style={{ ...mono, fill: c.ink }}>
          → APPLE HEALTH
        </text>
        {[0, 1, 2].map((i) => {
          const y = list.y + 40 + i * 34;
          const entry = i === 0 && typed > 0;
          return (
            <g key={i}>
              <text x={list.x} y={y} fontSize={19} style={{ ...mono, fill: entry ? c.ink : c.mute }}>
                {entry ? rowEntry.slice(0, typed) : '—'}
              </text>
              <line x1={list.x} y1={y + 13} x2={list.end} y2={y + 13} stroke={c.hair} strokeWidth={2} />
            </g>
          );
        })}
        {ring > 0 && (
          <g>
            <circle cx={list.end - 16} cy={list.y + 33} r={14} fill="none" stroke={c.hair} strokeWidth={5} />
            <circle
              cx={list.end - 16}
              cy={list.y + 33}
              r={14}
              fill="none"
              stroke={f < 140 ? c.signal : c.ink}
              strokeWidth={5}
              strokeLinecap="round"
              transform={`rotate(-90 ${list.end - 16} ${list.y + 33})`}
              strokeDasharray={2 * Math.PI * 14}
              strokeDashoffset={2 * Math.PI * 14 * (1 - ring)}
            />
          </g>
        )}
      </g>

      {/* The walking pad, side view, the full width of the page; the title stands on it. */}
      <g>
        <rect x={PAD.x + 2} y={PAD.y} width={PAD.w - 4} height={PAD.h} rx={PAD.h / 2} fill="none" stroke={c.ink} strokeWidth={2.5} />
        <circle cx={PAD.x + 24} cy={PAD.y + PAD.h / 2} r={12} fill="none" stroke={c.ink} strokeWidth={2} />
        <circle cx={PAD.x + PAD.w - 24} cy={PAD.y + PAD.h / 2} r={12} fill="none" stroke={c.ink} strokeWidth={2} />
        <line
          x1={PAD.x + 48}
          y1={PAD.y + 9}
          x2={PAD.x + PAD.w - 48}
          y2={PAD.y + 9}
          stroke={c.mute}
          strokeWidth={3}
          strokeDasharray="16 14"
          strokeDashoffset={belt}
        />
        <line x1={40} y1={PAD.y + PAD.h} x2={28} y2={PAD.y + PAD.h + 16} stroke={c.ink} strokeWidth={2.5} />
        <line x1={1560} y1={PAD.y + PAD.h} x2={1572} y2={PAD.y + PAD.h + 16} stroke={c.ink} strokeWidth={2.5} />
        <text x={1600} y={PAD.y + PAD.h + 46} fontSize={18} textAnchor="end" style={mono}>
          {`WALKING PAD · ${(f < END ? speed : 0).toFixed(1)} KM/H`}
        </text>
      </g>
    </svg>
  );
};
