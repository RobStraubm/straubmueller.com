// Flowculate as the opening of its case page (version J): the film's three acts across the whole width.
// The page sets the title and the summary as real text in the same 1600 × 900 box. Left, under them, the
// numbers are typed; each one lights up when it becomes its wall in the plan on the right, so the eye can
// follow the conversion. Scrolling is the clock of the simulation: the crowd walks out as the page moves and
// walks back in when it moves up. In the last act the app grows around the plan and the page title becomes
// its logo: a rule under it, the address on the right, the tabs above the plan, the live count on the left.
import { useCurrentFrame } from 'remotion';
import type { Palette } from '../style';
import { fonts, progress, stepped } from '../style';
import { arrows, crowd, halftone, remainingAt, T } from '../flowculate/Flowculate';
import { doors, FIRST_MOVE, LAST_FRAME, PILLAR, pillars, rows, walls } from '../flowculate/plan';

export const FLOWCULATE_STAGE_FRAMES = LAST_FRAME + 1;

const S = 36; // px per metre on the stage; the film uses 32
const px = (m: number) => m * S;
const PLAN_AT = { x: 820, y: 320 };
const ROWS_AT = { x: 0, y: 452, step: 30 };

const line = (frame: number, start: number, length: number) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress(frame, start, start + 10)),
});

const rowText = (i: number) => rows[i].label.padEnd(8) + rows[i].values.map((v) => v.padStart(7)).join('');

/** When row i turns into the plan: walls first, then the exits with their doors, then people and speed. */
const fadeAt = (i: number) => (i < 10 ? T.convert + i * 3 : T.people + (i - 10) * 4);

/** Where in the plan row i ends up, for the line that links the number to its wall or door. */
const targetOf = (i: number): [number, number] | null => {
  if (i < walls.length) return [walls[i][0], walls[i][1]];
  const door = doors[i - walls.length];
  if (door && i < walls.length + 2) {
    const [[ax, ay], [bx, by]] = door.hinges;
    return [(ax + bx) / 2, (ay + by) / 2];
  }
  return null;
};

/** With `pages`, the app's chrome is there from the start and the tab follows the frame: Plan while the walls
 * stand, Scenario once the people are placed, Simulation once they walk (the case text, "one page per step"). */
const PAGE_AT = [0, T.people, FIRST_MOVE];

export const FlowculateStage = ({
  palette: c,
  pages = false,
  view = '0 0 1600 900',
}: {
  palette: Palette;
  pages?: boolean;
  /** A crop of the stage, for showing only the app around the plan. */
  view?: string;
}) => {
  const f = useCurrentFrame();
  const left = remainingAt(f);
  const mono = { fontFamily: fonts.mono, fill: c.ink };
  const app = (from: number, to: number) => (pages ? 1 : stepped(progress(f, T.app + from, T.app + to), 1));
  const page = pages ? PAGE_AT.filter((at) => f >= at).length - 1 : 2;
  const tabX = [PLAN_AT.x, 918, 1072];
  const tabW = [62, 128, 150];

  return (
    // As a crop (`pages`) nothing may reach past the frame: the stage's own title rule, address and counter
    // would otherwise run over the case text around the figure.
    <svg viewBox={view} width="100%" height="100%" overflow={pages ? 'hidden' : 'visible'} aria-hidden="true">
      {/* Act 1: the input, typed row by row, the way it had to be entered before the app. */}
      {rows.map((_, i) => {
        const text = rowText(i);
        const typed = Math.round(text.length * progress(f, T.type + i * 2, T.type + i * 2 + 6));
        const opacity = 1 - progress(f, fadeAt(i), fadeAt(i) + 8);
        if (typed === 0 || opacity === 0) return null;
        const live = f >= fadeAt(i) - 2;
        const y = ROWS_AT.y + i * ROWS_AT.step;
        const target = targetOf(i);
        return (
          <g key={i}>
            <text x={ROWS_AT.x} y={y} fontSize={21} opacity={opacity} style={{ ...mono, fill: live ? c.signal : c.ink, whiteSpace: 'pre' }}>
              {text.slice(0, typed)}
            </text>
            {live && target && (
              <line
                x1={470}
                y1={y - 7}
                x2={PLAN_AT.x + px(target[0])}
                y2={PLAN_AT.y + px(target[1])}
                stroke={c.signal}
                strokeWidth={1.5}
                opacity={opacity}
              />
            )}
          </g>
        );
      })}

      {(() => {
        // A block cursor rides along while typing and keeps blinking until the numbers turn into walls.
        const typing = rows.findIndex((_, i) => progress(f, T.type + i * 2, T.type + i * 2 + 6) < 1);
        const row = typing === -1 ? rows.length - 1 : typing;
        const typed = Math.round(rowText(row).length * progress(f, T.type + row * 2, T.type + row * 2 + 6));
        const blinkOn = typing !== -1 || Math.floor(f / 8) % 2 === 0;
        if (f >= T.convert || !blinkOn) return null;
        return <rect x={ROWS_AT.x + typed * 12.6} y={ROWS_AT.y + row * ROWS_AT.step - 17} width={11} height={21} fill={c.ink} />;
      })()}

      {/* Act 2: the same numbers as a plan. */}
      <g transform={`translate(${PLAN_AT.x} ${PLAN_AT.y})`}>
        {arrows.map((a, i) => {
          const shown = stepped(progress(f, T.convert + 26 + a.row * 1.5, T.convert + 30 + a.row * 1.5), 1);
          const fade = 1 - 0.45 * progress(f, T.app, T.app + 20);
          if (!shown) return null;
          return (
            <g
              key={i}
              transform={`translate(${px(a.x)} ${px(a.y)}) rotate(${(a.angle * 180) / Math.PI})`}
              stroke={c.mute}
              strokeWidth={1.6}
              fill="none"
              opacity={0.55 * fade}
            >
              <path d="M -9 0 L 9 0 M 4 -4.5 L 9 0 L 4 4.5" />
            </g>
          );
        })}

        {pillars.map((p, i) => (
          <rect
            key={i}
            x={px(p.x - PILLAR / 2)}
            y={px(p.y - PILLAR / 2)}
            width={px(PILLAR)}
            height={px(PILLAR)}
            fill={c.ink}
            opacity={stepped(progress(f, 56 + i * 2, 60 + i * 2), 1)}
          />
        ))}

        {walls.map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={px(x1)}
            y1={px(y1)}
            x2={px(x2)}
            y2={px(y2)}
            stroke={c.ink}
            strokeWidth={3.4}
            strokeLinecap="square"
            style={line(f, T.convert + i * 3, Math.hypot(px(x2 - x1), px(y2 - y1)))}
          />
        ))}

        {doors.map((door, i) => {
          const start = [58, 61, 55][i];
          const [dx, dy] = door.dir;
          return door.hinges.map(([hx, hy], j) => {
            const other = door.hinges[1 - j];
            const mid = [(hx + other[0]) / 2, (hy + other[1]) / 2];
            const leafEnd = [hx + dx, hy + dy];
            const sweep = (dx !== 0 ? hy < other[1] : hx > other[0]) ? 1 : 0;
            const d = `M ${px(hx)} ${px(hy)} L ${px(leafEnd[0])} ${px(leafEnd[1])} A ${S} ${S} 0 0 ${sweep} ${px(mid[0])} ${px(mid[1])}`;
            return <path key={`${i}-${j}`} d={d} stroke={c.ink} strokeWidth={1.6} fill="none" style={line(f, start, 100)} />;
          });
        })}

        {halftone(f).map((dot, i) => (
          <circle key={i} cx={px(dot.x)} cy={px(dot.y)} r={(dot.r * S) / 32} fill={c.signal} />
        ))}

        {crowd[f].map((p, i) => {
          const appear = stepped(progress(f, T.people + (i % 12), T.people + (i % 12) + 3), 3);
          const out = p.gone === null ? 1 : 1 - progress(f, p.gone, p.gone + 6);
          if (!appear || !out) return null;
          return <circle key={i} cx={px(p.x)} cy={px(p.y)} r={6.2 * appear} fill={c.ink} opacity={out} />;
        })}
      </g>

      {/* Act 3: the program around the simulation. The page title is its logo now. */}
      {!pages && <line x1={0} y1={214} x2={1600} y2={214} stroke={c.ink} strokeWidth={2} style={line(f, T.app + 2, 1600)} />}
      {!pages && (
        <text x={1600} y={176} fontSize={26} textAnchor="end" style={{ ...mono, fill: c.mute }}>
          {'flowculate.eu'.slice(0, Math.round(13 * progress(f, T.app + 10, T.app + 22)))}
        </text>
      )}
      {['Plan', 'Scenario', 'Simulation'].map((tab, i) => (
        <text
          key={tab}
          x={tabX[i]}
          y={280}
          fontSize={30}
          opacity={app(12 + i * 3, 14 + i * 3)}
          style={{ fontFamily: fonts.sans, fontWeight: i === page ? 600 : 400, fill: i === page ? c.ink : c.mute }}
        >
          {tab}
        </text>
      ))}
      {pages ? (
        <line x1={tabX[page]} y1={294} x2={tabX[page] + tabW[page]} y2={294} stroke={c.ink} strokeWidth={3} />
      ) : (
        <line x1={1072} y1={294} x2={1222} y2={294} stroke={c.ink} strokeWidth={3} style={line(f, T.app + 20, 150)} />
      )}

      <g opacity={pages ? 0 : app(20, 24)}>
        <text x={0} y={470} fontSize={22} letterSpacing={0.4} style={{ ...mono, fill: c.mute }}>
          PERSONS IN ROOM
        </text>
        <text
          x={-6}
          y={712}
          fontSize={250}
          style={{ fontFamily: fonts.display, fontWeight: 300, fontStretch: '62.5%', fontVariantNumeric: 'tabular-nums', fill: c.ink }}
        >
          {String(left).padStart(2, '0')}
        </text>
        <line x1={300} y1={708} x2={740} y2={708} stroke={c.hair} strokeWidth={2} />
        <line x1={300} y1={508} x2={300} y2={708} stroke={c.hair} strokeWidth={2} />
        <polyline
          points={Array.from({ length: Math.max(0, f - FIRST_MOVE + 1) }, (_, k) => {
            const at = FIRST_MOVE + k;
            const x = 300 + ((at - FIRST_MOVE) / (LAST_FRAME - FIRST_MOVE)) * 440;
            const y = 708 - (remainingAt(at) / 48) * 200;
            return `${x},${y}`;
          }).join(' ')}
          stroke={c.ink}
          strokeWidth={2.5}
          fill="none"
        />
        <circle
          cx={300 + ((Math.max(f, FIRST_MOVE) - FIRST_MOVE) / (LAST_FRAME - FIRST_MOVE)) * 440}
          cy={708 - (left / 48) * 200}
          r={7}
          fill={c.signal}
        />
        <text x={740} y={740} fontSize={17} textAnchor="end" style={{ ...mono, fill: c.mute }}>
          TIME →
        </text>
      </g>
    </svg>
  );
};
