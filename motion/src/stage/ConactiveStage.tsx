// Conactive as the opening of its case page (version J): the film's three acts across the whole width, with no
// ground of its own. The page sets the title and the summary as real text in the same 1600 × 900 box. The title
// stands on the front edge of a desk that runs across the stage: the workplace the thesis is about. In act 1 a
// screen stands on that desk with every channel piled on it; in act 2 it steps back, smaller and quieter, the
// day's appointments fall out of its calendar as conblocks into the connote, and a concup next to the title says
// "open for a chat"; in act 3 the drawing answers the question in the summary, the screen labelled with the half
// the thesis turned down and the desk with the half it proposed, and the prize is set above the title in the
// title's type. Words, times and rooms are the film's; the windows and the calendar are an illustration.
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import type { Palette } from '../style';
import { fonts, progress, stepped } from '../style';
import {
  BADGES,
  BLOCKS,
  cupBody,
  cupHandle,
  cupRim,
  grooves,
  MONITOR,
  TITLE_BAR,
  WINDOWS,
} from '../conactive/Conactive';

/** The desk: the title stands on its front edge, the screen at its back. The back edge starts where the title ends. */
const DESK = { front: 796, back: 690, backFrom: 790 };

/** The film's screen hangs from the middle of its stand foot, at (400, 644) in the film. On the stage it stands
 * at the back of the desk, large in act 1, then smaller and further right. */
const FOOT = { x: 400, y: 644 };
const BIG = { scale: 1.25, x: 1190 };
const SMALL = { scale: 0.75, x: 1330 };
const SHRINK = { from: 70, to: 92 };
const FALL = { from: 94, to: 110 };

/** The connote in a light oblique view, like the line drawing: a tray on the desk with a channel for the blocks
 * along its back edge and the notes area in front. (x, y) is the front left corner on the desk. */
const CONNOTE = { x: 1030, y: 784, w: 420, h: 26, dx: 130, dy: 90 };
const CHANNEL = { from: 0.64, to: 0.95, inset: 0.03 };
const NOTES = { from: 0.08, to: 0.56, inset: 0.05 };
/** Where a block sits in the channel (share of the depth), how deep it is and how high. */
const BLOCK = { at: 0.68, depth: 0.22, height: 34 };
/** Along the channel the blocks are as long as their meetings: the film's tray widths, 132 and 200. */
const BLOCK_X = [18, 166];

/** The concup stands between the title and the connote: the film's drawing, a little larger, on the desk. Its
 * light ring is the rim, as in the line drawing; the film's halo would not fit beside the title. */
const CUP = { x: 850, y: 792, scale: 1.3, centre: 190, bottom: 560 };
const RIM = { cx: 190, cy: 380, rx: 70, ry: 16 };
/** Slots of the speaker on the cup's body, in the film's coordinates. */
const SPEAKER = [0, 1, 2, 3].map((k) => ({ x: 150 + k * 10, h: [30, 46, 38, 24][k] }));

type Point = [number, number];
type Box = { x: number; y: number; w: number; h: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const drawn = (frame: number, start: number, length: number, span = 12) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress(frame, start, start + span)),
});
/** For paths drawn with pathLength 1. */
const traced = (frame: number, start: number, span = 12) => ({
  strokeDasharray: 1,
  strokeDashoffset: 1 - progress(frame, start, start + span),
});
/** A face of a solid: its outline draws itself, and it only hides what is behind it once it is drawn. */
const face = (frame: number, start: number, span = 12) => ({
  pathLength: 1,
  fillOpacity: progress(frame, start, start + span),
  style: traced(frame, start, span),
});

/** A point on the connote's top face: `along` in units from the left edge, `depth` 0 (front) to 1 (back). */
const onTray = (along: number, depth: number): Point => [
  CONNOTE.x + along + depth * CONNOTE.dx,
  CONNOTE.y - CONNOTE.h - depth * CONNOTE.dy,
];
const poly = (points: Point[]) => points.map((p) => p.join(' ')).join(' L ');
/** A parallelogram on the top face, from `a` to `b` along and `d0` to `d1` in depth. */
const patch = (a: number, b: number, d0: number, d1: number) =>
  `M ${poly([onTray(a, d0), onTray(b, d0), onTray(b, d1), onTray(a, d1)])} Z`;

export const ConactiveStage = ({ palette: c }: { palette: Palette }) => {
  const f = useCurrentFrame();
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };

  // The screen keeps its foot on the back edge of the desk while it shrinks and moves right.
  const shrink = progress(f, SHRINK.from, SHRINK.to);
  const s = lerp(BIG.scale, SMALL.scale, shrink);
  const tx = lerp(BIG.x, SMALL.x, shrink) - FOOT.x * s;
  const ty = DESK.back - FOOT.y * s;
  const onScreen = (b: Box): Box => ({ x: b.x * s + tx, y: b.y * s + ty, w: b.w * s, h: b.h * s });
  // Quieter once the objects are there, quieter still when the question is answered.
  const dim = 1 - 0.5 * progress(f, 108, 120) - 0.2 * progress(f, 138, 150);

  // The appointments fall out of the screen like objects, accelerating, and stop hard in the channel.
  const fall = interpolate(f, [FALL.from, FALL.to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.quad),
  });
  const landed = f >= FALL.to;

  const ringColour = f < 140 ? c.signal : c.ink;
  const answer = progress(f, 142, 152);

  const { x: fx, y: fy } = CONNOTE;
  const blockFront = (k: number): Box => {
    const [x, y] = onTray(BLOCK_X[k], BLOCK.at);
    return { x, y: y - BLOCK.height, w: BLOCKS[k].tray.w, h: BLOCK.height };
  };

  return (
    <svg viewBox="0 0 1600 900" width="100%" height="100%" overflow="visible" aria-hidden="true">
      {/* The desk: its front edge under the title, its back edge behind the objects. */}
      <line x1={0} y1={DESK.front} x2={1600} y2={DESK.front} stroke={c.ink} strokeWidth={2} style={drawn(f, 0, 1600, 14)} />
      <line
        x1={DESK.backFrom}
        y1={DESK.back}
        x2={1600}
        y2={DESK.back}
        stroke={c.hair}
        strokeWidth={2}
        style={drawn(f, 6, 1600 - DESK.backFrom, 12)}
      />

      {/* The screen with every channel on it. It stays the whole film: smaller and quieter from act 2. */}
      <g transform={`translate(${tx} ${ty}) scale(${s})`} opacity={dim}>
        <rect
          x={MONITOR.x}
          y={MONITOR.y}
          width={MONITOR.w}
          height={MONITOR.h}
          fill="none"
          stroke={c.ink}
          strokeWidth={3 / s}
          pathLength={1}
          style={traced(f, 2, 14)}
        />
        <path
          d="M 400 604 L 400 644 M 316 644 L 484 644"
          fill="none"
          stroke={c.ink}
          strokeWidth={3 / s}
          pathLength={1}
          style={traced(f, 10, 8)}
        />

        {WINDOWS.map((w, i) => {
          if (!stepped(progress(f, w.at, w.at + 2), 1) || f >= w.close + 6) return null;
          // Closing, the body folds up into the title bar, which then goes too.
          const height = w.h - (w.h - TITLE_BAR) * progress(f, w.close, w.close + 5);
          return (
            <g key={w.name}>
              <defs>
                <clipPath id={`conactive-stage-window-${i}`}>
                  <rect x={w.x} y={w.y} width={w.w} height={height} />
                </clipPath>
              </defs>
              <rect x={w.x} y={w.y} width={w.w} height={height} fill={c.ground} stroke={c.ink} strokeWidth={2} />
              <line x1={w.x} x2={w.x + w.w} y1={w.y + TITLE_BAR} y2={w.y + TITLE_BAR} stroke={c.ink} strokeWidth={2} />
              <text x={w.x + 12} y={w.y + 22} fontSize={16} opacity={1 - shrink} style={{ ...mono, fill: c.ink }}>
                {w.name}
              </text>
              <g clipPath={`url(#conactive-stage-window-${i})`}>
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

      {/* The connote on the desk, in front of the screen's foot: tray, the channel along its back, the notes area. */}
      <g fill={c.ground} stroke={c.ink} strokeWidth={3} strokeLinejoin="round">
        <path
          d={`M ${poly([[fx, fy], [fx + CONNOTE.w, fy], onTray(CONNOTE.w, 0), onTray(0, 0)])} Z`}
          {...face(f, 80, 10)}
        />
        <path
          d={`M ${poly([[fx + CONNOTE.w, fy], [fx + CONNOTE.w + CONNOTE.dx, fy - CONNOTE.dy], onTray(CONNOTE.w, 1), onTray(CONNOTE.w, 0)])} Z`}
          {...face(f, 82, 10)}
        />
        <path d={patch(0, CONNOTE.w, 0, 1)} {...face(f, 82, 12)} />
        <path
          d={patch(CONNOTE.w * CHANNEL.inset, CONNOTE.w * (1 - CHANNEL.inset), CHANNEL.from, CHANNEL.to)}
          fill="none"
          strokeWidth={2}
          pathLength={1}
          style={traced(f, 86, 10)}
        />
        <path
          d={patch(CONNOTE.w * NOTES.inset, CONNOTE.w * (1 - NOTES.inset), NOTES.from, NOTES.to)}
          fill="none"
          stroke={c.hair}
          strokeWidth={2}
          pathLength={1}
          style={traced(f, 88, 10)}
        />
        {/* Handwriting in the notes area, as straight strokes. */}
        {[0.2, 0.32, 0.44].map((depth, i) => {
          const [x0, y0] = onTray(CONNOTE.w * 0.1, depth);
          const length = [230, 190, 150][i];
          return (
            <line key={depth} x1={x0} y1={y0} x2={x0 + length} y2={y0} stroke={c.hair} strokeWidth={2} style={drawn(f, 92 + i * 2, length, 6)} />
          );
        })}
      </g>

      {/* The appointments: on the screen's calendar first, moving with it; then conblocks in the channel, as long
          as their meetings, with time and room printed on them. */}
      {BLOCKS.map((b, k) => {
        if (!stepped(progress(f, 27, 29), 1)) return null;
        const from = onScreen(b.calendar);
        const to = blockFront(k);
        const box = {
          x: lerp(from.x, to.x, fall),
          y: lerp(from.y, to.y, fall),
          w: lerp(from.w, to.w, fall),
          h: lerp(from.h, to.h, fall),
        };
        // While it falls the block gains its depth, from a flat entry to a body.
        const dx = BLOCK.depth * CONNOTE.dx * fall;
        const dy = BLOCK.depth * CONNOTE.dy * fall;
        const size = landed ? 18 : Math.max(14, 16 * lerp(s, 1, fall));
        return (
          <g key={b.time}>
            {fall > 0 && (
              <path
                d={`M ${poly([
                  [box.x, box.y],
                  [box.x + dx, box.y - dy],
                  [box.x + box.w + dx, box.y - dy],
                  [box.x + box.w + dx, box.y + box.h - dy],
                  [box.x + box.w, box.y + box.h],
                  [box.x + box.w, box.y],
                ])} Z`}
                fill={c.ground}
                stroke={c.ink}
                strokeWidth={2}
                strokeLinejoin="round"
              />
            )}
            <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={c.ink} />
            <text
              x={box.x + 9}
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

      {/* The concup, and its light ring: the rim lights up red and sends out its signal, "open for a chat". */}
      <g transform={`translate(${CUP.x} ${CUP.y}) scale(${CUP.scale}) translate(${-CUP.centre} ${-CUP.bottom})`}>
        <g fill={c.ground} stroke={c.ink} strokeWidth={3} strokeLinejoin="round">
          <path d={cupBody} {...face(f, 100, 10)} />
          <path d={cupHandle} fill="none" pathLength={1} style={traced(f, 106, 6)} />
          {grooves.map((d, i) => (
            <path key={d} d={d} fill="none" stroke={c.hair} strokeWidth={2} pathLength={1} style={traced(f, 106 + i * 2, 6)} />
          ))}
          <path d={cupRim} {...face(f, 100, 10)} />
        </g>
        {SPEAKER.map((slot, k) => (
          <line
            key={slot.x}
            x1={slot.x}
            x2={slot.x}
            y1={470 - slot.h / 2}
            y2={470 + slot.h / 2}
            stroke={c.mute}
            strokeWidth={4}
            opacity={stepped(progress(f, 108 + k, 109 + k), 1)}
          />
        ))}
        <ellipse cx={RIM.cx} cy={RIM.cy} rx={RIM.rx} ry={RIM.ry} fill="none" stroke={ringColour} strokeWidth={5} opacity={stepped(progress(f, 112, 113), 1)} />
        {[114, 122, 130].map((start) => {
          const t = progress(f, start, start + 12);
          if (t <= 0 || t >= 1 || f >= 138) return null;
          return (
            <ellipse
              key={start}
              cx={RIM.cx}
              cy={RIM.cy - t * 18}
              rx={RIM.rx + t * 56}
              ry={RIM.ry + t * 14}
              fill="none"
              stroke={c.signal}
              strokeWidth={3}
              opacity={1 - t}
            />
          );
        })}
      </g>

      {/* Under the desk: what each object is, as in the line drawings. */}
      <g opacity={progress(f, 112, 120)}>
        <text x={CUP.x - 90} y={836} fontSize={19} style={{ ...mono, fill: c.ink }}>
          CONCUP
        </text>
        <text x={CUP.x - 90} y={864} fontSize={19} style={mono}>
          OPEN FOR A CHAT
        </text>
        <text x={CONNOTE.x} y={836} fontSize={19} style={{ ...mono, fill: c.ink }}>
          CONNOTE + CONBLOCKS
        </text>
        <text x={CONNOTE.x} y={864} fontSize={19} style={mono}>
          A BLOCK PER APPOINTMENT
        </text>
      </g>

      {/* Left column above the title: what each act means. */}
      <g opacity={progress(f, 20, 28) * (1 - progress(f, 62, 68))}>
        <text x={0} y={560} fontSize={19} style={{ ...mono, fill: c.ink }}>
          EVERY CHANNEL ON ONE SCREEN
        </text>
        <text x={0} y={592} fontSize={19} opacity={progress(f, 30, 38)} style={mono}>
          FROM FIVE EXPERT INTERVIEWS
        </text>
      </g>
      <g opacity={progress(f, 100, 108) * (1 - progress(f, 134, 140))}>
        <text x={0} y={560} fontSize={19} style={{ ...mono, fill: c.ink }}>
          SCENARIO 2045
        </text>
        <text x={0} y={592} fontSize={19} style={mono}>
          EACH KIND OF COMMUNICATION GETS ITS OWN OBJECT
        </text>
      </g>

      {/* Act 3: the question in the summary, answered by the drawing. The objects carry the half the thesis
          proposed, in red, on the part of the desk they stand on; the screen keeps its place, quieter. */}
      <g opacity={answer}>
        <text x={CUP.x - 90} y={384} fontSize={19} style={{ ...mono, fill: c.signal }}>
          TECHNOLOGY MOVED
        </text>
        <text x={CUP.x - 90} y={410} fontSize={19} style={{ ...mono, fill: c.signal }}>
          INTO THE WORKPLACE
        </text>
        <text x={SMALL.x - FOOT.x * SMALL.scale + MONITOR.x * SMALL.scale} y={384} fontSize={19} style={mono}>
          INSTEAD OF THE WORKPLACE
        </text>
        <text x={SMALL.x - FOOT.x * SMALL.scale + MONITOR.x * SMALL.scale} y={410} fontSize={19} style={mono}>
          INTO THE COMPUTER
        </text>
      </g>
      <line
        x1={CUP.x - 90}
        y1={DESK.front}
        x2={CUP.x - 90 + (CONNOTE.x + CONNOTE.w - CUP.x + 90) * answer}
        y2={DESK.front}
        stroke={c.signal}
        strokeWidth={4}
      />

      {/* Act 3, above the title in its type: the prize. */}
      <text x={0} y={440} fontSize={19} opacity={progress(f, 146, 152)} style={{ ...mono, fill: c.ink }}>
        KONSTANZER DESIGNPREIS · SUMMER SEMESTER 2022
      </text>
      <text
        x={-5}
        y={560}
        fontSize={128}
        opacity={progress(f, 150, 158)}
        style={{ fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -6, fill: c.ink }}
      >
        1st prize
      </text>
      <text x={0} y={606} fontSize={19} opacity={progress(f, 154, 160)} style={mono}>
        MASTER’S THESIS
      </text>
    </svg>
  );
};
