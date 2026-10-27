// Conactive in seven seconds: Robert's master's thesis, a speculative office system for 2045, on one stage
// that stays in view. Every channel on one screen; then the screen moves aside and shrinks, its windows close,
// and the day's appointments fall out of it as conblocks into the connote, next to a concup that says "open for
// a chat"; then the prize and the question the thesis asked, with all of it still there. Times and rooms are the
// ones printed on the prototype blocks; the windows and the calendar around them are an illustration.
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { ActWord, Labels, type Act } from '../parts';
import { fonts, palettes, progress, SIZE, stepped, type Theme, POSTER_VIEW } from '../style';

export const CONACTIVE_FRAMES = 210;

export const CONACTIVE_ACTS: Act[] = [
  { word: 'SCREEN', from: 0, to: 64 },
  { word: 'OBJECTS', from: 64, to: 136 },
  { word: '1ST PRIZE', from: 136, to: Infinity },
];

export const MONITOR = { x: 112, y: 286, w: 576, h: 318 };
const MONITOR_LENGTH = 2 * (MONITOR.w + MONITOR.h);
/** In act 2 the screen moves to the top right at a little over half its size, out of the objects' way. */
const SMALL = { scale: 0.55, x: 419 };
const SHRINK = { from: 70, to: 92 };

/** Four channels piled on one screen, the calendar on top. They close one by one in act 2, the calendar last. */
export const WINDOWS = [
  { name: 'MAIL', x: 144, y: 316, w: 300, h: 200, at: 10, close: 66 },
  { name: 'CHAT', x: 470, y: 316, w: 186, h: 150, at: 15, close: 71 },
  { name: 'VIDEO CALL', x: 196, y: 398, w: 260, h: 176, at: 20, close: 76 },
  { name: 'CALENDAR', x: 470, y: 380, w: 186, h: 200, at: 25, close: 110 },
];
export const TITLE_BAR = 32;

/** Notifications pile up faster and faster, and go out again last in, first out. */
export const BADGES: [number, number, number][] = [
  [428, 333, 30], [640, 332, 34], [440, 414, 37], [640, 396, 40], [160, 368, 42], [318, 452, 44],
  [606, 367, 46], [434, 518, 48], [170, 440, 50], [652, 520, 52], [210, 520, 54], [560, 370, 56],
  [484, 548, 58],
];

type Box = { x: number; y: number; w: number; h: number };

/** The two appointments: calendar entries on the screen, then conblocks in the connote. */
export const BLOCKS: { time: string; room: string; calendar: Box; tray: Box }[] = [
  { time: '08:00', room: 'L204', calendar: { x: 506, y: 426, w: 140, h: 32 }, tray: { x: 360, y: 539, w: 132, h: 40 } },
  { time: '10:15', room: 'H122', calendar: { x: 506, y: 505, w: 140, h: 50 }, tray: { x: 500, y: 539, w: 200, h: 40 } },
];
const FALL = { from: 94, to: 110 };

const TRAY = { x: 340, y: 520, w: 396, h: 180 };
const CHANNEL = { x: 354, y: 534, w: 368, h: 50 };
const WELL = { x: 354, y: 596, w: 368, h: 90 };
export const CUP = { cx: 190, rim: 380, bottom: 548, ring: 124 };
export const RING_CENTRE = 462;

export const QUESTION = ['What if technology moved', 'into the workplace,', 'instead of the workplace', 'into the computer?'];
const QUESTION_Y = 800;

const perimeter = (b: Box) => 2 * (b.w + b.h);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const drawn = (frame: number, start: number, length: number, span = 12) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress(frame, start, start + span)),
});

/** The cup from the side: rim, tapered body with the layered grooves of the prototype, angular handle. */
export const cupBody = `M 120 ${CUP.rim} L 130 ${CUP.bottom} A 60 12 0 0 0 250 ${CUP.bottom} L 260 ${CUP.rim}`;
export const cupRim = `M 120 ${CUP.rim} A 70 16 0 1 0 260 ${CUP.rim} A 70 16 0 1 0 120 ${CUP.rim}`;
export const cupHandle = 'M 258 404 L 292 410 L 300 452 L 286 498 L 251 504';
export const grooves = [420, 460, 500].map((y) => {
  const inset = (10 * (y - CUP.rim)) / (CUP.bottom - CUP.rim);
  return `M ${120 + inset} ${y} A ${70 - inset} 12 0 0 0 ${260 - inset} ${y}`;
});

export const Conactive = ({ theme }: { theme: Theme }) => {
  const f = useCurrentFrame();
  const c = palettes[theme];
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };

  // The screen keeps its top edge and glides right while it shrinks; afterwards it only dims.
  const shrink = progress(f, SHRINK.from, SHRINK.to);
  const s = lerp(1, SMALL.scale, shrink);
  const tx = lerp(MONITOR.x, SMALL.x, shrink) - MONITOR.x * s;
  const ty = MONITOR.y - MONITOR.y * s;
  const onScreen = (b: Box): Box => ({ x: b.x * s + tx, y: b.y * s + ty, w: b.w * s, h: b.h * s });
  const dim = 1 - 0.55 * progress(f, 108, 120);

  // The appointments fall out of the screen like objects, accelerating, and stop hard in the connote.
  const fall = interpolate(f, [FALL.from, FALL.to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.quad),
  });
  const landed = f >= FALL.to;

  const legend = progress(f, 112, 120) * (1 - progress(f, 132, 138));
  const ringColour = f < 140 ? c.signal : c.ink;

  return (
    <AbsoluteFill style={{ backgroundColor: c.ground }}>
      <svg width={SIZE.width} height={SIZE.height} viewBox={POSTER_VIEW}>
        <Labels frame={f} project="Conactive" acts={CONACTIVE_ACTS} palette={c} />
        <ActWord frame={f} acts={CONACTIVE_ACTS} palette={c} />

        {/* The screen with every channel on it. It stays the whole film: smaller, aside and quieter from act 2. */}
        <g transform={`translate(${tx} ${ty}) scale(${s})`} opacity={dim}>
          <rect
            x={MONITOR.x}
            y={MONITOR.y}
            width={MONITOR.w}
            height={MONITOR.h}
            fill="none"
            stroke={c.ink}
            strokeWidth={3}
            vectorEffect="non-scaling-stroke"
            style={drawn(f, 2, MONITOR_LENGTH, 14)}
          />
          <path
            d="M 400 604 L 400 644 M 316 644 L 484 644"
            fill="none"
            stroke={c.ink}
            strokeWidth={3}
            vectorEffect="non-scaling-stroke"
            style={drawn(f, 10, 208, 8)}
          />

          {WINDOWS.map((w, i) => {
            if (!stepped(progress(f, w.at, w.at + 2), 1) || f >= w.close + 6) return null;
            // Closing, the body folds up into the title bar, which then goes too.
            const height = w.h - (w.h - TITLE_BAR) * progress(f, w.close, w.close + 5);
            return (
              <g key={w.name}>
                <defs>
                  <clipPath id={`conactive-window-${i}`}>
                    <rect x={w.x} y={w.y} width={w.w} height={height} />
                  </clipPath>
                </defs>
                <rect x={w.x} y={w.y} width={w.w} height={height} fill={c.ground} stroke={c.ink} strokeWidth={2} />
                <line x1={w.x} x2={w.x + w.w} y1={w.y + TITLE_BAR} y2={w.y + TITLE_BAR} stroke={c.ink} strokeWidth={2} />
                <text x={w.x + 12} y={w.y + 22} fontSize={16} opacity={1 - shrink} style={{ ...mono, fill: c.ink }}>
                  {w.name}
                </text>
                <g clipPath={`url(#conactive-window-${i})`}>
                  {w.name === 'MAIL' &&
                    [368, 396, 424, 452, 480].map((y, k) => (
                      <rect key={y} x={w.x + 26} y={y - 6} width={[220, 180, 240, 160, 200][k]} height={10} fill={c.mute} />
                    ))}
                  {w.name === 'CHAT' && (
                    <>
                      <rect x={w.x + 14} y={w.y + 44} width={110} height={18} fill={c.mute} />
                      <rect x={w.x + 62} y={w.y + 72} width={110} height={18} fill="none" stroke={c.mute} strokeWidth={2} />
                    </>
                  )}
                  {w.name === 'VIDEO CALL' &&
                    [0, 1, 2, 3].map((k) => {
                      const x = w.x + 14 + (k % 2) * 120;
                      const y = w.y + 44 + Math.floor(k / 2) * 64;
                      return (
                        <g key={k}>
                          <rect x={x} y={y} width={112} height={58} fill="none" stroke={c.mute} strokeWidth={2} />
                          <circle cx={x + 56} cy={y + 24} r={11} fill={c.mute} />
                          <path d={`M ${x + 34} ${y + 58} A 22 16 0 0 1 ${x + 78} ${y + 58}`} fill={c.mute} />
                        </g>
                      );
                    })}
                  {w.name === 'CALENDAR' &&
                    ['08', '09', '10', '11', '12'].map((hour, k) => (
                      <g key={hour}>
                        <line x1={w.x + 34} x2={w.x + w.w - 8} y1={424 + k * 36} y2={424 + k * 36} stroke={c.hair} strokeWidth={2} />
                        {k % 2 === 0 && (
                          <text x={w.x + 8} y={430 + k * 36} fontSize={15} opacity={1 - shrink} style={mono}>
                            {hour}
                          </text>
                        )}
                      </g>
                    ))}
                </g>
              </g>
            );
          })}

          {BADGES.map(([x, y, at], k) =>
            stepped(progress(f, at, at + 1), 1) && f < 64 + (BADGES.length - 1 - k) ? (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={9} fill={c.signal} />
            ) : null,
          )}
        </g>

        <text x={64} y={860} fontSize={20} opacity={progress(f, 20, 28) * (1 - progress(f, 62, 68))} style={mono}>
          EVERY CHANNEL ON ONE SCREEN
        </text>

        {/* The connote, the notebook the conblocks travel in, below the screen they fall from. */}
        <g>
          <rect x={TRAY.x} y={TRAY.y} width={TRAY.w} height={TRAY.h} fill="none" stroke={c.ink} strokeWidth={3} style={drawn(f, 80, perimeter(TRAY), 12)} />
          <rect x={CHANNEL.x} y={CHANNEL.y} width={CHANNEL.w} height={CHANNEL.h} fill="none" stroke={c.ink} strokeWidth={2} style={drawn(f, 84, perimeter(CHANNEL), 10)} />
          <rect x={WELL.x} y={WELL.y} width={WELL.w} height={WELL.h} fill="none" stroke={c.hair} strokeWidth={2} style={drawn(f, 86, perimeter(WELL), 10)} />
          {[620, 642, 664].map((y, i) => (
            <line key={y} x1={370} x2={[600, 560, 520][i]} y1={y} y2={y} stroke={c.hair} strokeWidth={2} style={drawn(f, 92 + i * 2, 230, 6)} />
          ))}
          <text x={WELL.x + WELL.w - 14} y={WELL.y + WELL.h - 14} fontSize={18} textAnchor="end" opacity={progress(f, 94, 100)} style={mono}>
            CONNOTE
          </text>
        </g>

        {/* The appointments: on the screen first, moving with it; then conblocks whose length is the meeting's. */}
        {BLOCKS.map((b) => {
          if (!stepped(progress(f, 27, 29), 1)) return null;
          const from = onScreen(b.calendar);
          const box = {
            x: lerp(from.x, b.tray.x, fall),
            y: lerp(from.y, b.tray.y, fall),
            w: lerp(from.w, b.tray.w, fall),
            h: lerp(from.h, b.tray.h, fall),
          };
          const size = landed ? 18 : Math.max(15, 16 * lerp(s, 1, fall));
          return (
            <g key={b.time}>
              <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={c.ink} />
              <text
                x={box.x + 8}
                y={box.y + box.h / 2 + size * 0.36}
                fontSize={size}
                xmlSpace="preserve"
                style={{ fontFamily: fonts.mono, fill: c.ground }}
              >
                {landed ? `${b.time} ${b.room}` : b.time}
              </text>
            </g>
          );
        })}

        <text x={64} y={300} fontSize={20} opacity={progress(f, 100, 108)} style={mono}>
          SCENARIO 2045
        </text>

        {/* The concup, and the ring that tells colleagues it is open for a chat. */}
        <g fill="none" stroke={c.ink} strokeWidth={3} strokeLinejoin="round">
          <path d={cupRim} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - progress(f, 100, 110) }} />
          <path d={cupBody} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - progress(f, 102, 112) }} />
          <path d={cupHandle} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - progress(f, 106, 112) }} />
          {grooves.map((d, i) => (
            <path key={d} d={d} stroke={c.hair} strokeWidth={2} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - progress(f, 106 + i * 2, 112 + i * 2) }} />
          ))}
        </g>
        <circle
          cx={CUP.cx}
          cy={RING_CENTRE}
          r={CUP.ring}
          fill="none"
          stroke={ringColour}
          strokeWidth={4}
          style={drawn(f, 112, 2 * Math.PI * CUP.ring, 10)}
        />
        {[122, 130].map((start) => {
          const t = progress(f, start, start + 12);
          if (t <= 0 || t >= 1 || f >= 136) return null;
          return <circle key={start} cx={CUP.cx} cy={RING_CENTRE} r={CUP.ring + t * 30} fill="none" stroke={c.signal} strokeWidth={3} opacity={1 - t} />;
        })}

        {/* Legend for act 2: a block and the ring, as in the drawing above. */}
        <g opacity={legend}>
          <rect x={64} y={818} width={40} height={22} fill={c.ink} />
          <text x={122} y={836} fontSize={19} style={mono}>
            CONBLOCKS · THE DAY’S APPOINTMENTS
          </text>
          <circle cx={84} cy={869} r={11} fill="none" stroke={c.signal} strokeWidth={4} />
          <text x={122} y={876} fontSize={19} style={mono}>
            CONCUP · OPEN FOR A CHAT
          </text>
        </g>

        {/* Act 3: the prize, and the question the thesis asked, under everything it led to. */}
        <text x={64} y={746} fontSize={20} opacity={progress(f, 140, 148)} style={{ ...mono, fill: c.ink }}>
          KONSTANZ DESIGN AWARD 2022 · MASTER’S THESIS
        </text>
        <g>
          <defs>
            <clipPath id="question-mask">
              <rect x={0} y={762} width={800} height={200} />
            </clipPath>
          </defs>
          <g clipPath="url(#question-mask)">
            {QUESTION.map((line, i) => {
              const rise = progress(f, 146 + i * 7, 162 + i * 7);
              return (
                <text
                  key={line}
                  x={64}
                  y={QUESTION_Y + i * 48 + (1 - rise) * 220}
                  fontSize={40}
                  style={{ fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -0.8, fill: i === 1 ? c.signal : c.ink }}
                >
                  {line}
                </text>
              );
            })}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
