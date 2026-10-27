// Flowculate in six seconds: numbers typed by hand become a plan, people walk out through the doors,
// and the program grows around the simulation, one page per function. Acts: Numbers, Plan, Web app.
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ActWord, Labels, type Act } from '../parts';
import { fonts, palettes, progress, SIZE, stepped, type Theme } from '../style';
import { doors, FIRST_MOVE, LAST_FRAME, PILLAR, pillars, PLAN, rows, SCALE, simulate, targetFor, walls } from './plan';

export const FLOWCULATE_FRAMES = LAST_FRAME + 1;

/** Seconds where each act starts, for the caption on the site. */
export const ACTS = [
  { at: 0, label: 'Numbers' },
  { at: 34 / 30, label: 'Plan' },
  { at: 100 / 30, label: 'Web app' },
];

export const crowd = simulate();

/** A gentler crop than the other poster films: the plan and the app header reach further to the edges. */
const APP_VIEW = '24 40 752 940';

const X0 = 64;
const Y_DRAW = 262;
const Y_APP = 222;
export const T = { type: 2, convert: 34, people: 62, app: 100 };

const px = (m: number) => m * SCALE;

export const arrows: { x: number; y: number; angle: number; row: number }[] = [];
for (let row = 0, gy = 0.75; gy < PLAN.h; gy += 1.5, row++) {
  for (let gx = 0.75; gx < PLAN.w; gx += 1.5) {
    if (Math.abs(gx - 14) < 0.5) continue;
    if (pillars.some((p) => Math.abs(p.x - gx) < 0.9 && Math.abs(p.y - gy) < 0.9)) continue;
    const t = targetFor(gx, gy);
    arrows.push({ x: gx, y: gy, angle: Math.atan2(t.y - gy, t.x - gx), row });
  }
}

export const remainingAt = (f: number) => crowd[Math.min(f, LAST_FRAME)].filter((p) => p.gone === null).length;

/** Crowd density on a fine grid, printed as halftone dots: red only where people pile up. */
export const halftone = (f: number) => {
  const here = crowd[f].filter((p) => p.gone === null);
  const dots: { x: number; y: number; r: number }[] = [];
  if (f <= FIRST_MOVE) return dots;
  const step = 0.3;
  const twoSigma2 = 2 * 0.5 * 0.5;
  for (let y = step / 2; y < PLAN.h; y += step) {
    for (let x = step / 2; x < PLAN.w; x += step) {
      let density = 0;
      for (const p of here) {
        const dx = p.x - x;
        const dy = p.y - y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 2.25) density += Math.exp(-d2 / twoSigma2);
      }
      const r = Math.min(4.4, (density - 1.25) * 3.2);
      if (r > 0.4) dots.push({ x, y, r });
    }
  }
  return dots;
};

const line = (frame: number, start: number, length: number) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress(frame, start, start + 10)),
});

/** Giant act words for the poster style; the app chrome takes over the top for the last act. */
const POSTER_ACTS: Act[] = [
  { word: 'NUMBERS', from: 0, to: 34 },
  { word: 'PLAN', from: 34, to: 100 },
];

export const Flowculate = ({ theme, titles = false }: { theme: Theme; titles?: boolean }) => {
  const f = useCurrentFrame();
  const c = palettes[theme];
  const planY = Y_DRAW + (Y_APP - Y_DRAW) * progress(f, T.app, T.app + 18);
  const left = remainingAt(f);
  const mono = { fontFamily: fonts.mono, fill: c.ink };

  return (
    <AbsoluteFill style={{ backgroundColor: c.ground }}>
      <svg width={SIZE.width} height={SIZE.height} viewBox={titles ? APP_VIEW : `0 0 ${SIZE.width} ${SIZE.height}`}>
        {titles && (
          <>
            <Labels frame={f} project="Flowculate" acts={[...POSTER_ACTS, { word: 'APP', from: 100, to: Infinity }]} palette={c} until={T.app} />
            <ActWord frame={f} acts={POSTER_ACTS} palette={c} />
          </>
        )}

        {/* Act 1: the input, typed row by row, the way it had to be entered before the app. */}
        {rows.map((row, i) => {
          const text = row.label.padEnd(8) + row.values.map((v) => v.padStart(7)).join('');
          const typed = Math.round(text.length * progress(f, T.type + i * 2, T.type + i * 2 + 6));
          const fadeAt = i < 10 ? T.convert + i * 3 : T.people + (i - 10) * 4;
          const opacity = 1 - progress(f, fadeAt, fadeAt + 8);
          if (typed === 0 || opacity === 0) return null;
          return (
            <text
              key={i}
              x={X0}
              y={Y_DRAW + 30 + i * 39}
              fontSize={25}
              opacity={opacity}
              xmlSpace="preserve"
              style={mono}
            >
              {text.slice(0, typed)}
            </text>
          );
        })}

        {(() => {
          // A block cursor rides along while typing and keeps blinking until the numbers turn into walls.
          const typing = rows.findIndex(
            (_, i) => progress(f, T.type + i * 2, T.type + i * 2 + 6) < 1,
          );
          const row = typing === -1 ? rows.length - 1 : typing;
          const text = rows[row].label.padEnd(8) + rows[row].values.map((v) => v.padStart(7)).join('');
          const typed = Math.round(text.length * progress(f, T.type + row * 2, T.type + row * 2 + 6));
          const blinkOn = typing !== -1 || Math.floor(f / 8) % 2 === 0;
          if (f >= T.convert || !blinkOn) return null;
          return (
            <rect x={X0 + typed * 15} y={Y_DRAW + 30 + row * 39 - 20} width={13} height={25} fill={c.ink} />
          );
        })()}

        {/* Act 2: the same numbers as a plan. */}
        <g transform={`translate(${X0} ${planY})`}>
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
                <path d="M -8 0 L 8 0 M 3 -4 L 8 0 L 3 4" />
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

          {walls.map(([x1, y1, x2, y2], i) => {
            const length = Math.hypot(px(x2 - x1), px(y2 - y1));
            return (
              <line
                key={i}
                x1={px(x1)}
                y1={px(y1)}
                x2={px(x2)}
                y2={px(y2)}
                stroke={c.ink}
                strokeWidth={3}
                strokeLinecap="square"
                style={line(f, T.convert + i * 3, length)}
              />
            );
          })}

          {doors.map((door, i) => {
            const start = [58, 61, 55][i];
            const [dx, dy] = door.dir;
            return door.hinges.map(([hx, hy], j) => {
              const other = door.hinges[1 - j];
              const mid = [(hx + other[0]) / 2, (hy + other[1]) / 2];
              const leafEnd = [hx + dx, hy + dy];
              const sweep = (dx !== 0 ? hy < other[1] : hx > other[0]) ? 1 : 0;
              const d = `M ${px(hx)} ${px(hy)} L ${px(leafEnd[0])} ${px(leafEnd[1])} A ${SCALE} ${SCALE} 0 0 ${sweep} ${px(mid[0])} ${px(mid[1])}`;
              return (
                <path
                  key={`${i}-${j}`}
                  d={d}
                  stroke={c.ink}
                  strokeWidth={1.5}
                  fill="none"
                  style={line(f, start, 90)}
                />
              );
            });
          })}

          {halftone(f).map((dot, i) => (
            <circle key={i} cx={px(dot.x)} cy={px(dot.y)} r={dot.r} fill={c.signal} />
          ))}

          {crowd[f].map((p, i) => {
            const appear = stepped(progress(f, T.people + (i % 12), T.people + (i % 12) + 3), 3);
            const out = p.gone === null ? 1 : 1 - progress(f, p.gone, p.gone + 6);
            if (!appear || !out) return null;
            return <circle key={i} cx={px(p.x)} cy={px(p.y)} r={5.5 * appear} fill={c.ink} opacity={out} />;
          })}
        </g>

        {/* Act 3: the program around the simulation, one page per function. */}
        <text
          x={X0}
          y={102}
          fontSize={46}
          style={{ fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -0.6, fill: c.ink }}
        >
          {'flowculate'.slice(0, Math.round(10 * progress(f, T.app + 4, T.app + 12)))}
        </text>
        <text x={549} y={98} fontSize={24} style={{ ...mono, fill: c.mute }}>
          {'flowculate.eu'.slice(0, Math.round(13 * progress(f, T.app + 10, T.app + 22)))}
        </text>
        <line
          x1={X0}
          y1={130}
          x2={736}
          y2={130}
          stroke={c.ink}
          strokeWidth={2}
          style={line(f, T.app + 2, 672)}
        />
        {['Plan', 'Scenario', 'Simulation'].map((tab, i) => (
          <text
            key={tab}
            x={[X0, 154, 300][i]}
            y={182}
            fontSize={30}
            opacity={stepped(progress(f, T.app + 12 + i * 3, T.app + 14 + i * 3), 1)}
            style={{ fontFamily: fonts.sans, fontWeight: i === 2 ? 600 : 400, fill: i === 2 ? c.ink : c.mute }}
          >
            {tab}
          </text>
        ))}
        <line
          x1={300}
          y1={198}
          x2={450}
          y2={198}
          stroke={c.ink}
          strokeWidth={3}
          style={line(f, T.app + 20, 150)}
        />

        <line
          x1={X0}
          y1={756}
          x2={736}
          y2={756}
          stroke={c.ink}
          strokeWidth={2}
          style={line(f, T.app + 16, 672)}
        />
        <g opacity={stepped(progress(f, T.app + 20, T.app + 24), 1)}>
          <text x={X0} y={800} fontSize={22} letterSpacing={0.4} style={{ ...mono, fill: c.mute }}>
            PERSONS IN ROOM
          </text>
          <text
            x={X0 - 4}
            y={940}
            fontSize={160}
            style={{
              fontFamily: fonts.display,
              fontWeight: 300,
              fontStretch: '62.5%',
              fontVariantNumeric: 'tabular-nums',
              fill: c.ink,
            }}
          >
            {String(left).padStart(2, '0')}
          </text>
          <line x1={330} y1={936} x2={736} y2={936} stroke={c.hair} strokeWidth={2} />
          <line x1={330} y1={786} x2={330} y2={936} stroke={c.hair} strokeWidth={2} />
          <polyline
            points={Array.from({ length: Math.max(0, f - FIRST_MOVE + 1) }, (_, k) => {
              const at = FIRST_MOVE + k;
              const x = 330 + ((at - FIRST_MOVE) / (LAST_FRAME - FIRST_MOVE)) * 406;
              const y = 936 - (remainingAt(at) / 48) * 150;
              return `${x},${y}`;
            }).join(' ')}
            stroke={c.ink}
            strokeWidth={2.5}
            fill="none"
          />
          <circle
            cx={330 + ((Math.max(f, FIRST_MOVE) - FIRST_MOVE) / (LAST_FRAME - FIRST_MOVE)) * 406}
            cy={936 - (left / 48) * 150}
            r={6}
            fill={c.signal}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
