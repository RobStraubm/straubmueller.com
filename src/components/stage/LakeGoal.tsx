// Saunter, friction log: why the weekly lap of Lake Constance failed as a goal (version J). Drawn as the reader
// scrolls past it: the lap the goal asked for each week, the 1.26 km actually walked that week, and the goal
// that replaced it, a weekly streak of walking days. Figures from the case text; the lake is the film's outline.
import type { Palette } from '../../../motion/src/style';
import { fonts } from '../../../motion/src/style';
import { alongLake, LAKE } from '../../../motion/src/saunter/Saunter';

const LAP_KM = 204;
const WALKED_KM = 1.26;
const SCALE = 1.1;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (share: number, from: number, to: number) => clamp((share - from) / (to - from));
const trail = (to: number) =>
  Array.from({ length: 60 }, (_, k) => alongLake((to * k) / 59))
    .map(([x, y]) => `${x},${y}`)
    .join(' ');

export const LakeGoal = ({ palette: c, share }: { palette: Palette; share: number }) => {
  const lap = span(share, 0.05, 0.4);
  const week = span(share, 0.42, 0.55);
  const now = span(share, 0.68, 0.82);
  const mono = { fontFamily: fonts.mono, fontSize: 15, letterSpacing: 0.5, whiteSpace: 'pre' };
  const [dotX, dotY] = alongLake((WALKED_KM / LAP_KM) * week);
  const lines: [string, string, number][] = [
    ['GOAL', `${LAP_KM} KM A WEEK`, 1 - now * 0.6],
    ['FRIDAY', '67.6 KM A DAY TO GO', week * (1 - now * 0.6)],
    ['WALKED', `${WALKED_KM} KM THAT WEEK`, week * (1 - now * 0.6)],
  ];

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" aria-hidden="true">
      <g transform={`translate(20 20) scale(${SCALE})`}>
        <polyline
          points={LAKE.map(([x, y]) => `${x},${y}`).join(' ')}
          fill="none"
          stroke={c.hair}
          strokeWidth={2 / SCALE}
          strokeLinejoin="round"
        />
        {lap > 0 && (
          <polyline
            points={trail(lap)}
            fill="none"
            stroke={c.signal}
            strokeWidth={3 / SCALE}
            strokeDasharray={`${6 / SCALE} ${5 / SCALE}`}
            strokeLinejoin="round"
            opacity={1 - now * 0.75}
          />
        )}
        <circle cx={LAKE[0][0]} cy={LAKE[0][1]} r={4 / SCALE} fill={c.ink} />
        {week > 0 && <circle cx={dotX} cy={dotY} r={7 / SCALE} fill={c.ink} />}
      </g>

      {lines.map(([term, value, opacity], i) => (
        <text key={term} x={20} y={300 + i * 24} opacity={opacity} style={{ ...mono, fill: i === 0 ? c.signal : c.ink }}>
          <tspan fill={c.mute}>{term.padEnd(8)}</tspan>
          {value}
        </text>
      ))}

      {/* The goal that stayed: as many walking days as office days, minus one cheat day. */}
      <g opacity={now} transform={`translate(${20 + (1 - now) * 12} 0)`}>
        {[0, 1, 2].map((day) => (
          <rect
            key={day}
            x={210 + day * 46}
            y={14}
            width={36}
            height={36}
            fill={day < 2 ? c.ink : 'none'}
            stroke={c.ink}
            strokeWidth={2}
          />
        ))}
        <text x={210} y={74} style={{ ...mono, fill: c.ink }}>
          NOW: 2 OF 3 DAYS
        </text>
        <text x={210} y={96} style={{ ...mono, fill: c.mute }}>
          WEEKLY STREAK
        </text>
      </g>
    </svg>
  );
};
