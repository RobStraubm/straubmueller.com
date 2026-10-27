// Stayin' Alive, what I did: one iPad that carried the whole exhibition (version J). Drawn as the reader scrolls
// past it: the Turm zur Katz as a section, four floors, one department of the fictional research institute on
// each. The visitor's iPad comes in at the entrance and climbs the stairs floor by floor; each floor it reaches
// lights up and says in one mono line what the iPad does there. On the ground floor the institute measures its
// visitors, so from there on the iPad carries the visitor's own data point (the one red), and each floor the
// visitor leaves adds their time on it, between the fastest and the slowest visitor.
// The tower is a schematic section, not the real façade or floor plan; the stations are pictograms and the
// times are illustrative, not measured. Floors, departments and what the iPad did are the case text's.
import type { Palette } from '../../../motion/src/style';
import { fonts } from '../../../motion/src/style';

type Floor = {
  level: string;
  name: string;
  /** What the iPad does on this floor, in one line; the narrow version breaks it in two. */
  does: string;
  doesNarrow: [string, string];
  /** What the floor holds, under the line, in the wide version only. */
  detail: string;
};

/** Ground floor first. */
const FLOORS: Floor[] = [
  {
    level: 'GROUND FLOOR · A',
    name: 'Data collection',
    does: 'MEASURES THE VISITOR',
    doesNarrow: ['MEASURES THE VISITOR:', 'TIME ON EACH FLOOR'],
    detail: 'TIME ON EACH FLOOR · RISK CONTACTS',
  },
  {
    level: 'FIRST FLOOR · B',
    name: 'Research',
    does: 'SHOWS FIVE DISEASES IN AR ON A BODY MODEL',
    doesNarrow: ['FIVE DISEASES IN AR', 'ON A BODY MODEL'],
    detail: 'PLAGUE · CHOLERA · SPANISH FLU · MALARIA · COVID',
  },
  {
    level: 'SECOND FLOOR · C',
    name: 'Management',
    does: 'RUNS THE SIMULATION, LAID INTO A TABLE MAP',
    doesNarrow: ['RUNS THE SIMULATION:', 'DECREES AND R VALUE'],
    detail: 'DECREE ON WORK, SCHOOLS, HOSPITALS · R VALUE',
  },
  {
    level: 'THIRD FLOOR · D',
    name: 'Real-world lab',
    does: 'ASKS FOR AN ANSWER IN YOUR OWN WORDS',
    doesNarrow: ['ASKS FOR AN ANSWER', 'IN YOUR OWN WORDS'],
    detail: 'DIVIDE? DOUBT? ISOLATE? STAND TOGETHER?',
  },
];

/** When the iPad reaches each floor, as a share of the scroll; it leaves 0.13 later and climbs till the next. */
const REACH = [0.1, 0.34, 0.58, 0.82];
const STAY = 0.13;
/** The visitor's time on each floor between the fastest (0) and the slowest (1) visitor. Illustrative. */
const TIMES = [0.58, 0.36, 0.74, 0.47];
const ENTRANCE = 'EVERY VISITOR GOT AN IPAD AT THE ENTRANCE';

/** Everything that differs between the wide and the narrow version. */
type Layout = {
  view: [number, number];
  tower: { x0: number; x1: number; slabs: number[]; ceiling: number; apex: number; door: number };
  stair: [number, number];
  /** Where the iPad stands on a floor (its bottom centre), and its size. */
  spot: number;
  ipad: { w: number; h: number };
  /** The visiting-time scale of each floor: from x0 to x1, at slab − rise. */
  scale: { x0: number; x1: number; rise: number };
  mono: number;
  /** Left edge of the floor labels (wide only). */
  labels?: number;
};

const WIDE: Layout = {
  view: [1200, 560],
  tower: { x0: 40, x1: 340, slabs: [492, 388, 284, 180], ceiling: 76, apex: 34, door: 58 },
  stair: [262, 330],
  spot: 228,
  ipad: { w: 30, h: 42 },
  scale: { x0: 916, x1: 1176, rise: 52 },
  mono: 18,
  labels: 380,
};

const NARROW: Layout = {
  view: [600, 1000],
  tower: { x0: 20, x1: 580, slabs: [904, 714, 524, 334], ceiling: 144, apex: 100, door: 76 },
  stair: [486, 566],
  spot: 438,
  ipad: { w: 36, h: 50 },
  scale: { x0: 44, x1: 380, rise: 16 },
  mono: 22,
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (share: number, from: number, to: number) => clamp((share - from) / (to - from));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A point a share t along a polyline, by length. */
const along = (points: [number, number][], t: number): [number, number] => {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  let rest = clamp(t) * lengths.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lengths.length; i++) {
    if (rest <= lengths[i] || i === lengths.length - 1) {
      const k = lengths[i] ? Math.min(1, rest / lengths[i]) : 1;
      return [lerp(points[i][0], points[i + 1][0], k), lerp(points[i][1], points[i + 1][1], k)];
    }
    rest -= lengths[i];
  }
  return points[points.length - 1];
};

/** Floor k's flight of stairs: a switchback, so it runs right to left on even floors and back on odd ones. */
const flight = (L: Layout, k: number) => {
  const [a, b] = L.stair;
  const from: [number, number] = [k % 2 ? a : b, L.tower.slabs[k]];
  const to: [number, number] = [k % 2 ? b : a, L.tower.slabs[k + 1] ?? L.tower.ceiling];
  return { from, to };
};

/** Where the iPad stands at a given share: just inside the door, then on each floor or on the stairs between. */
const ipadAt = (L: Layout, share: number): [number, number] => {
  const { slabs, x0 } = L.tower;
  if (share < REACH[0]) {
    return along([[x0 + L.ipad.w, slabs[0]], [L.spot, slabs[0]]], span(share, 0.02, REACH[0]));
  }
  for (let k = 0; k < REACH.length - 1; k++) {
    if (share < REACH[k + 1]) {
      const { from, to } = flight(L, k);
      return along([[L.spot, slabs[k]], from, to, [L.spot, slabs[k + 1]]], span(share, REACH[k] + STAY, REACH[k + 1]));
    }
  }
  return [L.spot, slabs[slabs.length - 1]];
};

/** Small pictograms of what stands on each floor, drawn from the slab up (wide version only). */
const Station = ({ k, slab, stroke }: { k: number; slab: number; stroke: string }) => {
  const line = { fill: 'none', stroke, strokeWidth: 2, strokeLinejoin: 'round' as const };
  if (k === 0) {
    // The counter with places for the iPads, and two monitors of the database.
    return (
      <g>
        <rect x={62} y={slab - 28} width={120} height={28} {...line} />
        {[78, 100, 122].map((x) => (
          <line key={x} x1={x} x2={x + 14} y1={slab - 28} y2={slab - 28} stroke={stroke} strokeWidth={5} />
        ))}
        <rect x={146} y={slab - 54} width={34} height={20} {...line} />
        <rect x={104} y={slab - 62} width={34} height={20} {...line} />
      </g>
    );
  }
  if (k === 1) {
    // The body model on its plinth, with the corner marks of the AR view around it.
    return (
      <g>
        <circle cx={120} cy={slab - 58} r={7} {...line} />
        <rect x={109} y={slab - 48} width={22} height={32} rx={8} {...line} />
        <rect x={100} y={slab - 16} width={40} height={16} {...line} />
        {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([dx, dy]) => (
          <path
            key={`${dx}${dy}`}
            d={`M ${120 + dx * 40} ${slab - 38 + dy * 28} h ${-dx * 12} M ${120 + dx * 40} ${slab - 38 + dy * 28} v ${-dy * 12}`}
            {...line}
          />
        ))}
      </g>
    );
  }
  if (k === 2) {
    // The simulation table: a city map of blocks on a table top.
    return (
      <g>
        <line x1={62} x2={186} y1={slab - 30} y2={slab - 30} stroke={stroke} strokeWidth={4} />
        <line x1={72} x2={72} y1={slab - 30} y2={slab} {...line} />
        <line x1={176} x2={176} y1={slab - 30} y2={slab} {...line} />
        {[10, 18, 8, 24, 14, 20, 12].map((h, i) => (
          <rect key={i} x={68 + i * 16} y={slab - 32 - h} width={11} height={h} fill={stroke} />
        ))}
      </g>
    );
  }
  // Four cut-out figures, one question each.
  return (
    <g>
      {[44, 52, 40, 48].map((h, i) => (
        <g key={i}>
          <circle cx={74 + i * 32} cy={slab - h - 8} r={7} {...line} />
          <rect x={66 + i * 32} y={slab - h} width={16} height={h} {...line} />
        </g>
      ))}
    </g>
  );
};

export const StayinFigure = ({ palette: c, share, narrow }: { palette: Palette; share: number; narrow: boolean }) => {
  const L = narrow ? NARROW : WIDE;
  const { x0, x1, slabs, ceiling, apex, door } = L.tower;
  const mono = { fontFamily: fonts.mono, letterSpacing: 0.5, whiteSpace: 'pre' };
  const reached = (k: number) => share >= REACH[k];
  const left = (k: number) => share >= (k === REACH.length - 1 ? 0.95 : REACH[k] + STAY);
  const top = (k: number) => slabs[k + 1] ?? ceiling;
  const [ix, iy] = ipadAt(L, share);
  const measured = share >= REACH[0] + 0.04;
  const roofLit = reached(REACH.length - 1);

  return (
    <svg viewBox={`0 0 ${L.view[0]} ${L.view[1]}`} width="100%" height="100%" aria-hidden="true">
      {/* The key of the red: the visitor's own time on each floor. Wide: over its column; narrow: over the tower. */}
      <g opacity={measured ? 1 : 0.0001}>
        <circle cx={L.scale.x0 + 6} cy={narrow ? 26 : 34} r={6} fill={c.signal} />
        <text x={L.scale.x0 + 20} y={narrow ? 34 : 40} fontSize={narrow ? 22 : 17} style={{ ...mono, fill: c.ink }}>
          YOUR TIME ON EACH FLOOR
        </text>
        <text x={L.scale.x0} y={narrow ? 70 : 66} fontSize={L.mono - 1} style={{ ...mono, fill: c.mute }}>
          FASTEST
        </text>
        <text x={L.scale.x1} y={narrow ? 70 : 66} fontSize={L.mono - 1} textAnchor="end" style={{ ...mono, fill: c.mute }}>
          SLOWEST
        </text>
      </g>

      {/* Ground, and the floor lines carried on as the rows of the labels (wide). */}
      <line x1={0} x2={L.view[0]} y1={slabs[0]} y2={slabs[0]} stroke={c.ink} strokeWidth={2} />
      {!narrow &&
        [...slabs.slice(1), ceiling].map((y) => (
          <line key={y} x1={x1 + 16} x2={L.view[0]} y1={y} y2={y} stroke={c.hair} strokeWidth={1.5} />
        ))}

      {/* The tower: each floor lights up, walls, stairs and ceiling, when the iPad reaches it. */}
      {FLOORS.map((floor, k) => {
        const lit = reached(k);
        const stroke = lit ? c.ink : c.hair;
        const y0 = top(k);
        const y1 = slabs[k];
        const { from, to } = flight(L, k);
        const steps = 8;
        const stair = `M ${from[0]} ${from[1]} ${Array.from(
          { length: steps },
          (_, i) => `V ${from[1] + ((to[1] - from[1]) * (i + 1)) / steps} H ${from[0] + ((to[0] - from[0]) * (i + 1)) / steps}`,
        ).join(' ')}`;
        return (
          <g key={floor.level}>
            <line x1={x0} x2={x0} y1={y0} y2={k === 0 ? y1 - door : y1} stroke={stroke} strokeWidth={lit ? 3 : 2} />
            <line x1={x1} x2={x1} y1={y0} y2={y1} stroke={stroke} strokeWidth={lit ? 3 : 2} />
            <line x1={x0} x2={x1} y1={y0} y2={y0} stroke={stroke} strokeWidth={lit ? 3 : 2} />
            {k < FLOORS.length - 1 && <path d={stair} fill="none" stroke={reached(k + 1) ? c.ink : c.hair} strokeWidth={1.5} />}
            {!narrow && <Station k={k} slab={y1} stroke={stroke} />}
          </g>
        );
      })}
      {/* A plain roof over the section. */}
      <path d={`M ${x0 - 12} ${ceiling} L ${(x0 + x1) / 2} ${apex} L ${x1 + 12} ${ceiling}`} fill="none" stroke={roofLit ? c.ink : c.hair} strokeWidth={roofLit ? 3 : 2} strokeLinejoin="round" />

      {/* The labels of each floor: the department always, what the iPad does from the moment it gets there. */}
      {FLOORS.map((floor, k) => {
        const lit = reached(k);
        const slab = slabs[k];
        const typing = span(share, REACH[k], REACH[k] + 0.07);
        const type = (text: string, offset = 0) =>
          text.slice(0, Math.max(0, Math.round(typing * (floor.doesNarrow.join(' ').length + 1)) - offset));
        if (narrow) {
          const y0 = top(k);
          return (
            <g key={floor.level}>
              <text x={44} y={y0 + 40} fontSize={22} style={{ ...mono, fill: c.mute }}>
                {floor.level}
              </text>
              <text x={42} y={y0 + 84} fontSize={34} style={{ fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -0.8, fill: lit ? c.ink : c.mute }}>
                {floor.name}
              </text>
              <text x={44} y={y0 + 124} fontSize={22} style={{ ...mono, fill: c.ink }}>
                {type(floor.doesNarrow[0])}
              </text>
              <text x={44} y={y0 + 152} fontSize={22} style={{ ...mono, fill: c.ink }}>
                {type(floor.doesNarrow[1], floor.doesNarrow[0].length + 1)}
              </text>
            </g>
          );
        }
        const chars = Math.round(typing * floor.does.length);
        return (
          <g key={floor.level}>
            <text x={60} y={top(k) + 26} fontSize={15} style={{ ...mono, fill: c.mute }}>
              {floor.level}
            </text>
            <text x={L.labels} y={slab - 64} fontSize={28} style={{ fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -0.6, fill: lit ? c.ink : c.mute }}>
              {floor.name}
            </text>
            <text x={L.labels} y={slab - 36} fontSize={L.mono} style={{ ...mono, fill: c.ink }}>
              {floor.does.slice(0, chars)}
            </text>
            <text x={L.labels} y={slab - 13} fontSize={17} opacity={span(share, REACH[k] + 0.05, REACH[k] + 0.1)} style={{ ...mono, fill: c.mute }}>
              {floor.detail}
            </text>
          </g>
        );
      })}

      {/* The visiting-time scale of each floor; the visitor's mark lands on it when they leave the floor. */}
      {FLOORS.map((floor, k) => {
        const y = slabs[k] - L.scale.rise;
        const t = TIMES[k];
        return (
          <g key={floor.level} opacity={measured ? 1 : 0.0001}>
            <line x1={L.scale.x0} x2={L.scale.x1} y1={y} y2={y} stroke={c.hair} strokeWidth={2} />
            <line x1={L.scale.x0} x2={L.scale.x0} y1={y - 8} y2={y + 8} stroke={c.mute} strokeWidth={2} />
            <line x1={L.scale.x1} x2={L.scale.x1} y1={y - 8} y2={y + 8} stroke={c.mute} strokeWidth={2} />
            {left(k) && <circle cx={lerp(L.scale.x0, L.scale.x1, t)} cy={y} r={narrow ? 9 : 7} fill={c.signal} />}
          </g>
        );
      })}

      {/* The entrance, where every visitor got an iPad. */}
      {narrow ? (
        <>
          <text x={20} y={slabs[0] + 44} fontSize={22} style={{ ...mono, fill: c.mute }}>
            EVERY VISITOR GOT AN IPAD
          </text>
          <text x={20} y={slabs[0] + 74} fontSize={22} style={{ ...mono, fill: c.mute }}>
            AT THE ENTRANCE
          </text>
        </>
      ) : (
        <text x={x0} y={slabs[0] + 36} fontSize={17} style={{ ...mono, fill: c.mute }}>
          {ENTRANCE}
        </text>
      )}

      {/* The visitor's iPad, standing on its floor; from the ground floor on it carries the visitor's data point. */}
      <g transform={`translate(${ix - L.ipad.w / 2} ${iy - L.ipad.h - 3})`}>
        <rect width={L.ipad.w} height={L.ipad.h} rx={5} fill={c.ground} stroke={c.ink} strokeWidth={2.5} />
        <rect x={4} y={5} width={L.ipad.w - 8} height={L.ipad.h - 10} fill="none" stroke={c.hair} strokeWidth={1.5} />
        {measured && <circle cx={L.ipad.w / 2} cy={L.ipad.h / 2} r={narrow ? 7 : 6} fill={c.signal} />}
      </g>
    </svg>
  );
};

