// Sustainable IoT, "Model the use, not the network" (version J). Drawn as the reader scrolls past it: first the
// March wireframe, the network in the middle, cloud, internet, router, gateway, lamps and heaters, every link
// marked Bluetooth or WLAN, with the house and the person as small settings beside it. Then it sorts itself into
// the June model: the house opens into the rooms and when they are used, the person into the people, active or
// passive, how long at home and which device, the network into the IoT services, and the cloud steps out of the
// chain with the switch for how much the system talks to it. Last, the requests of the active people's phones run
// through router and internet to the cloud, and as the switch moves from high to low they thin out. The stage at
// the top already shows the shift and the cost; this figure shows what the switch stands for. Shapes and the
// hours of rooms and people follow the wireframes; the request rhythm is illustration, and there are no values.
import type { Palette } from '../../../motion/src/style';
import { fonts } from '../../../motion/src/style';
import { mix } from '../../../motion/src/tealucent/Tealucent';

type Point = [number, number];
type Rect = [number, number, number, number];
type Side = 'below' | 'above' | 'right' | 'left' | 'none';

/** One layout per version: the wide one for the content column, the narrow one stacked for a phone. */
interface Layout {
  w: number;
  h: number;
  /** Size of the labels, scale of the small icons, line weight. */
  font: number;
  icon: number;
  stroke: number;
  stamp: Point;
  march: {
    house: Point;
    person: Point;
    rule: [number, number, number, number];
    cloud: Point;
    globe: Point;
    router: Point;
    gateway: Point;
    lamps: Point[];
    heaters: Point[];
    /** Scale of the network in March, and where the names of its nodes, its gateway and its devices stand. */
    big: number;
    names: Side;
    gatewayName: Side;
    deviceNames: Side;
  };
  june: {
    rooms: Rect;
    people: Rect;
    services: Rect;
    /** The services' name at the panel's left, or at its right where the requests come in on the left. */
    servicesName: 'start' | 'end';
    pill: Point;
    cloud: Point;
    globe: Point;
    router: Point;
    gateway: Point;
    sensors: Point[];
    thermos: Point[];
    names: { router: Side; gateway: Side };
    thermosName: Point;
    sensorsName: Point | null;
    roomRows: { glyph: number; track: [number, number]; ys: number[]; head: number };
    personRows: { icon: number; tag: number; bar: [number, number]; laptop: number; phones: number[]; ys: number[]; heads: number };
    /** The switch: where its name stands, each level's knob, and where its request rhythm starts from the knob. */
    cloudName: Point;
    cloudNameLines: string[];
    levels: { xs: number[]; ys: number[]; rhythm: Point };
    /** A hair line from the cloud to its switch, where the two stand apart. */
    tie: [number, number, number, number] | null;
    /** The way each active person's request takes, from the phone to the router. */
    lanes: Point[][];
    note: Point | null;
  };
}

const WIDE: Layout = {
  w: 1200,
  h: 560,
  font: 17,
  icon: 1,
  stroke: 2,
  stamp: [1198, 20],
  march: {
    house: [64, 170],
    person: [64, 420],
    rule: [140, 40, 140, 540],
    cloud: [270, 300],
    globe: [420, 300],
    router: [570, 300],
    gateway: [760, 190],
    lamps: [
      [1080, 90],
      [1080, 200],
    ],
    heaters: [
      [1080, 340],
      [1080, 460],
    ],
    big: 1.5,
    names: 'below',
    gatewayName: 'below',
    deviceNames: 'right',
  },
  june: {
    rooms: [0, 40, 400, 196],
    people: [0, 296, 400, 244],
    services: [680, 40, 520, 500],
    servicesName: 'start',
    pill: [200, 266],
    cloud: [520, 290],
    globe: [732, 290],
    router: [840, 290],
    gateway: [990, 290],
    sensors: [
      [1150, 160],
      [1150, 222],
    ],
    thermos: [930, 1010, 1090, 1170].map((x) => [x, 472] as Point),
    names: { router: 'above', gateway: 'above' },
    thermosName: [902, 524],
    sensorsName: [1176, 268],
    roomRows: { glyph: 34, track: [70, 380], ys: [116, 148, 180, 212], head: 94 },
    personRows: { icon: 28, tag: 56, bar: [152, 282], laptop: 318, phones: [356, 356], ys: [400, 452, 504], heads: 360 },
    cloudName: [450, 92],
    cloudNameLines: ['CLOUD SERVER', 'INTERACTION'],
    levels: { xs: [462, 462, 462], ys: [154, 188, 222], rhythm: [94, 0] },
    tie: null,
    lanes: [
      [
        [368, 400],
        [830, 400],
        [830, 302],
      ],
      [
        [368, 452],
        [852, 452],
        [852, 302],
      ],
    ],
    note: [450, 500],
  },
};

const NARROW: Layout = {
  w: 600,
  h: 920,
  font: 22,
  icon: 1.25,
  stroke: 2.5,
  stamp: [598, 26],
  march: {
    house: [90, 112],
    person: [236, 112],
    rule: [0, 190, 600, 190],
    cloud: [80, 790],
    globe: [240, 790],
    router: [390, 790],
    gateway: [250, 520],
    lamps: [
      [500, 300],
      [500, 430],
    ],
    heaters: [
      [520, 600],
      [540, 740],
    ],
    big: 1.2,
    names: 'below',
    gatewayName: 'left',
    deviceNames: 'below',
  },
  june: {
    rooms: [2, 44, 596, 196],
    people: [2, 296, 596, 230],
    services: [112, 552, 488, 254],
    servicesName: 'end',
    pill: [300, 268],
    cloud: [70, 650],
    globe: [190, 650],
    router: [300, 650],
    gateway: [450, 650],
    sensors: [
      [552, 636],
      [552, 700],
    ],
    thermos: [334, 408, 482, 556].map((x) => [x, 764] as Point),
    names: { router: 'below', gateway: 'none' },
    thermosName: [128, 772],
    sensorsName: null,
    roomRows: { glyph: 30, track: [70, 580], ys: [148, 174, 200, 226], head: 120 },
    personRows: { icon: 28, tag: 60, bar: [350, 580], laptop: 230, phones: [285, 315], ys: [408, 450, 492], heads: 372 },
    cloudName: [20, 846],
    cloudNameLines: ['CLOUD SERVER INTERACTION'],
    levels: { xs: [30, 206, 412], ys: [880, 880, 880], rhythm: [-6, 28] },
    tie: [70, 682, 70, 820],
    lanes: [
      [
        [285, 422],
        [285, 634],
      ],
      [
        [315, 464],
        [315, 634],
      ],
    ],
    note: null,
  },
};

/** Hours of use from the June wireframe: the rooms, and how long each person is at home (of 24). */
const ROOM_HOURS: [number, number][] = [
  [16, 22],
  [19, 23],
  [20, 22],
  [20, 22],
];
const PEOPLE = [
  { active: true, home: 11, laptop: true },
  { active: true, home: 16, laptop: false },
  { active: false, home: 16, laptop: false },
];
const LEVELS = ['HIGH', 'NORMAL', 'LOW'];
/** Space between two requests on the way, per level: the higher the setting, the more often the phones ask. */
const SPACING = [34, 80, 230];
const RHYTHM = [
  { dots: 6, gap: 12 },
  { dots: 3, gap: 24 },
  { dots: 1, gap: 0 },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (share: number, from: number, to: number) => clamp((share - from) / (to - from));
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPoint = (a: Point, b: Point, t: number): Point => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
/** Fade in: from nothing to full over a short stretch of scroll, so that nothing pops (Robert, 27 Oct 2026). */
const at = (share: number, from: number) => span(share, from, from + 0.04);

/** Where a line from a node's centre towards another point leaves the node, a box of half width hw and half height hh. */
const edge = ([x, y]: Point, hw: number, hh: number, [tx, ty]: Point): Point => {
  const dx = tx - x;
  const dy = ty - y;
  const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
  return [x + dx * t, y + dy * t];
};

const polyLength = (points: Point[]) =>
  points.slice(1).reduce((sum, [x, y], i) => sum + Math.hypot(x - points[i][0], y - points[i][1]), 0);
const along = (points: Point[], d: number): Point => {
  let left = d;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const step = Math.hypot(x1 - x0, y1 - y0);
    if (left <= step) return [x0 + ((x1 - x0) * left) / step, y0 + ((y1 - y0) * left) / step];
    left -= step;
  }
  return points[points.length - 1];
};

/** A cloud of four bumps, about 68 by 36, centred on its own origin. */
const CLOUD_PATH = 'M -34 18 A 12 12 0 0 1 -26 -4 A 18 18 0 0 1 8 -18 A 14 14 0 0 1 30 2 A 9 9 0 0 1 34 18 Z';

export const IotFigure = ({ palette: c, share, narrow }: { palette: Palette; share: number; narrow: boolean }) => {
  const L = narrow ? NARROW : WIDE;
  const { march: M, june: J } = L;
  const sw = L.stroke;
  const k = L.icon;
  const mono = { fontFamily: fonts.mono, fontSize: L.font, letterSpacing: 0.5, fill: c.mute };
  const label = { ...mono, fill: c.ink };

  // March is drawn first; its link types and devices step out while the chain moves into the model, the panels
  // open around it and fill row by row.
  const drawMarch = at(share, 0.02);
  const marchOnly = 1 - span(share, 0.14, 0.22);
  const move = ease(span(share, 0.16, 0.38));
  const june = at(share, 0.3);
  const frames = span(share, 0.26, 0.36);
  const rows = (i: number) => at(share, 0.34 + i * 0.02);
  const devices = (i: number) => at(share, 0.36 + i * 0.012);
  const cloudPanel = span(share, 0.38, 0.46);
  // The requests: their way first, then the stream, while the switch moves from high to low. What the requests
  // do not touch steps back.
  const lanes = span(share, 0.54, 0.6);
  // How much each level is the one set, 0 to 1: the switch fades from high to normal to low.
  const toNormal = at(share, 0.7);
  const toLow = at(share, 0.82);
  const flowing = at(share, 0.58);
  const levelOn = [flowing * (1 - toNormal), toNormal * (1 - toLow), toLow];
  const aside = 1 - 0.6 * span(share, 0.54, 0.6);

  const big = lerp(M.big, 1, move) * k;
  const cloudScale = big * 1.2;
  const node = (from: Point, to: Point) => lerpPoint(from, to, move);
  const cloud = node(M.cloud, J.cloud);
  const globe = node(M.globe, J.globe);
  const router = node(M.router, J.router);
  const gateway = node(M.gateway, J.gateway);
  /** Half sizes of the nodes, for lines that start at their edges. */
  const half = {
    cloud: [34 * cloudScale, 18 * cloudScale],
    globe: [20 * big, 20 * big],
    router: [24 * big, 13 * big],
    gateway: [24 * big, 24 * big],
  } as const;
  const link = (a: Point, ah: readonly number[], b: Point, bh: readonly number[]) => {
    const [x1, y1] = edge(a, ah[0], ah[1], b);
    const [x2, y2] = edge(b, bh[0], bh[1], a);
    return { x1, y1, x2, y2 };
  };

  // In March the house and the person are settings beside the network; in June they head their own panels.
  const house = node(M.house, [J.rooms[0] + 22 * k, J.rooms[1] + 26 * k]);
  const person = node(M.person, [J.people[0] + 22 * k, J.people[1] + 26 * k]);
  const sideIcon = lerp(2.2, 1, move) * k;

  // Every request's whole way: from the phone into the router, out along the backbone through the internet to
  // the cloud's edge.
  const ways = J.lanes.map((lane): Point[] => [
    ...lane,
    [lane[lane.length - 1][0], J.router[1]],
    [J.cloud[0] + 34 * 1.2 * k, J.cloud[1]],
  ]);

  const nameAt = ([x, y]: Point, h: number, side: Side, size = L.font): { x: number; y: number; anchor: 'start' | 'middle' | 'end' } =>
    side === 'right'
      ? { x: x + h + 12 * k, y: y + size * 0.35, anchor: 'start' }
      : side === 'left'
        ? { x: x - h - 12 * k, y: y + size * 0.35, anchor: 'end' }
        : side === 'above'
        ? { x, y: y - h - size * 0.5, anchor: 'middle' }
        : { x, y: y + h + size * 1.1, anchor: 'middle' };

  const panel = (rect: Rect, name: string, align: 'start' | 'end' = 'start') => {
    const [x, y, w, h] = rect;
    return (
      <g opacity={june}>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill="none"
          stroke={c.hair}
          strokeWidth={sw}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - frames}
        />
        <text
          x={align === 'start' ? x + 44 * k : x + w - 16 * k}
          y={y + 32 * k}
          textAnchor={align}
          opacity={span(share, 0.36, 0.4)}
          style={{ ...label, letterSpacing: 1 }}
        >
          {name}
        </text>
      </g>
    );
  };

  const personIcon = (x: number, y: number, s: number, color: string) => (
    <g fill="none" stroke={color} strokeWidth={sw / s} transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cy={-8} r={6} />
      <path d="M -11 12 A 11 11 0 0 1 11 12" />
    </g>
  );
  const phone = (x: number, y: number) => (
    <g fill="none" stroke={c.signal} strokeWidth={sw}>
      <rect x={x - 6 * k} y={y - 11 * k} width={12 * k} height={22 * k} rx={2} />
      <line x1={x - 3 * k} y1={y + 6 * k} x2={x + 3 * k} y2={y + 6 * k} />
    </g>
  );
  const linkGlyph = (at: Point, bluetooth: boolean) => (
    <g transform={`translate(${at[0]} ${at[1]}) scale(${big})`} fill="none" stroke={c.ink} strokeWidth={sw / big}>
      <circle r={13} fill={c.ground} />
      {bluetooth ? (
        <polyline points="-4,-4 4,3.5 0,7.5 0,-7.5 4,-3.5 -4,4" strokeLinejoin="round" />
      ) : (
        <g strokeLinecap="round">
          <path d="M -3 1 A 4 4 0 0 1 3 1" />
          <path d="M -6 -2 A 8 8 0 0 1 6 -2" />
          <circle cy={4} r={1.2} fill={c.ink} />
        </g>
      )}
    </g>
  );

  const marchLinks = [
    { from: gateway, fh: half.gateway, to: M.lamps[0], bt: true },
    { from: gateway, fh: half.gateway, to: M.lamps[1], bt: true },
    { from: router, fh: half.router, to: M.heaters[0], bt: false },
    { from: router, fh: half.router, to: M.heaters[1], bt: false },
    { from: router, fh: half.router, to: gateway, bt: false },
  ];
  const deviceNames = [
    { at: M.lamps[0], text: 'LAMP' },
    { at: M.lamps[1], text: 'LAMP' },
    { at: M.heaters[0], text: 'HEATER' },
    { at: M.heaters[1], text: 'HEATER' },
  ];
  const names = [
    { p: cloud, h: 18 * cloudScale, text: 'CLOUD', side: june > 0 ? 'none' : M.names, show: 1 },
    { p: globe, h: 20 * big, text: 'INTERNET', side: move > 0.5 ? 'below' : M.names, show: 1 },
    { p: router, h: 13 * big, text: 'ROUTER', side: move > 0.5 ? J.names.router : M.names, show: 1 },
    { p: gateway, h: 24 * big, text: 'GATEWAY', side: move > 0.5 ? J.names.gateway : M.gatewayName, show: aside },
  ] as { p: Point; h: number; text: string; side: Side; show: number }[];

  return (
    <svg viewBox={`0 0 ${L.w} ${L.h}`} width="100%" height="100%" aria-hidden="true">
      {/* Which wireframe the drawing is in. */}
      <text x={L.stamp[0]} y={L.stamp[1]} textAnchor="end" opacity={1 - june} style={{ ...label, letterSpacing: 1 }}>
        MARCH WIREFRAME
      </text>
      <text x={L.stamp[0]} y={L.stamp[1]} textAnchor="end" opacity={june} style={{ ...label, letterSpacing: 1 }}>
        JUNE WIREFRAME
      </text>

      {/* March: the house and the person as small settings at the side. */}
      <line x1={M.rule[0]} y1={M.rule[1]} x2={M.rule[2]} y2={M.rule[3]} stroke={c.hair} strokeWidth={sw} opacity={marchOnly * drawMarch} />
      <g fill="none" stroke={c.ink} strokeWidth={sw / sideIcon} transform={`translate(${house[0]} ${house[1]}) scale(${sideIcon})`} opacity={drawMarch}>
        <polyline points="-11,-1 0,-11 11,-1" />
        <polyline points="-8,-3 -8,10 8,10 8,-3" />
      </g>
      <g opacity={drawMarch}>{personIcon(person[0], person[1] + 2 * sideIcon, sideIcon, c.ink)}</g>

      {/* June: the three panels the model is made of, and how they act on each other. */}
      {panel(J.rooms, 'ROOMS')}
      {panel(J.people, 'PEOPLE')}
      {panel(J.services, 'IOT SERVICES', J.servicesName)}
      <g opacity={rows(0)}>
        <rect x={J.pill[0] - 110 * k} y={J.pill[1] - 15 * k} width={220 * k} height={30 * k} rx={15 * k} fill={c.ground} stroke={c.ink} strokeWidth={sw} />
        <text x={J.pill[0]} y={J.pill[1] + L.font * 0.32} textAnchor="middle" style={{ ...label, fontSize: L.font * 0.9 }}>
          ACTS IN · INFLUENCES
        </text>
      </g>

      {/* Rooms: when each is used, as a stretch of the day. */}
      <g opacity={aside}>
        <text x={J.roomRows.track[0]} y={J.roomRows.head} opacity={rows(0)} style={mono}>
          WHEN EACH ROOM IS USED
        </text>
        {ROOM_HOURS.map(([from, to], i) => {
          const y = J.roomRows.ys[i];
          const [x0, x1] = J.roomRows.track;
          const hour = (x1 - x0) / 24;
          return (
            <g key={i} opacity={rows(i)}>
              <rect x={J.roomRows.glyph - 8 * k} y={y - 8 * k} width={16 * k} height={16 * k} fill="none" stroke={c.ink} strokeWidth={sw} />
              <line x1={x0} y1={y} x2={x1} y2={y} stroke={c.hair} strokeWidth={sw} />
              <rect x={x0 + from * hour} y={y - 5 * k} width={(to - from) * hour} height={10 * k} fill={c.ink} />
            </g>
          );
        })}
      </g>

      {/* People: active or passive, how long at home, which device they connect with. */}
      <g opacity={rows(1)}>
        <text x={J.personRows.laptop - 12 * k} y={J.personRows.heads} style={mono}>
          DEVICE
        </text>
        <text x={J.personRows.bar[0]} y={J.personRows.heads} style={mono}>
          TIME AT HOME
        </text>
      </g>
      {PEOPLE.map((p, i) => {
        const y = J.personRows.ys[i];
        const [x0, x1] = J.personRows.bar;
        const ink = p.active ? c.ink : c.mute;
        return (
          <g key={i} opacity={rows(i + 1) * (p.active ? 1 : aside)}>
            {personIcon(J.personRows.icon, y, k, ink)}
            <text x={J.personRows.tag} y={y + L.font * 0.35} style={{ ...label, fill: ink }}>
              {p.active ? 'ACTIVE' : 'PASSIVE'}
            </text>
            <line x1={x0} y1={y} x2={x1} y2={y} stroke={c.hair} strokeWidth={sw} />
            <rect x={x0} y={y - 5 * k} width={((x1 - x0) * p.home) / 24} height={10 * k} fill={ink} />
            {p.laptop && (
              <g fill="none" stroke={c.ink} strokeWidth={sw} opacity={aside}>
                <rect x={J.personRows.laptop - 11 * k} y={y - 9 * k} width={22 * k} height={14 * k} />
                <line x1={J.personRows.laptop - 15 * k} y1={y + 9 * k} x2={J.personRows.laptop + 15 * k} y2={y + 9 * k} />
              </g>
            )}
            {p.active && phone(J.personRows.phones[i], y)}
          </g>
        );
      })}

      {/* The network. March: every link marked Bluetooth or WLAN, lamps and heaters at the end of it. */}
      <g opacity={marchOnly * drawMarch}>
        {marchLinks.map(({ from, fh, to, bt }, i) => {
          const end = to === gateway ? link(from, fh, to, half.gateway) : link(from, fh, to, [16 * big, 16 * big]);
          return (
            <g key={i}>
              <line {...end} stroke={c.ink} strokeWidth={sw} strokeDasharray={`${4 * k} ${5 * k}`} />
              {linkGlyph(lerpPoint([end.x1, end.y1], [end.x2, end.y2], 0.5), bt)}
            </g>
          );
        })}
        {M.lamps.map(([x, y], i) => (
          <g key={`l${i}`} fill="none" stroke={c.ink} strokeWidth={sw / big} transform={`translate(${x} ${y}) scale(${big})`}>
            <path d="M -5 6 A 10 10 0 1 1 5 6 L 5 10 L -5 10 Z" />
            <line x1={-4} y1={14} x2={4} y2={14} />
          </g>
        ))}
        {M.heaters.map(([x, y], i) => (
          <g key={`h${i}`} fill="none" stroke={c.ink} strokeWidth={sw / big} transform={`translate(${x} ${y}) scale(${big})`}>
            <line x1={-4} y1={-14} x2={-4} y2={6} />
            <circle cx={-4} cy={11} r={5} />
            {[-12, -7, -2].map((dy) => (
              <line key={dy} x1={3} y1={dy} x2={10} y2={dy} />
            ))}
          </g>
        ))}
        {deviceNames.map(({ at: p, text }, i) => {
          const n = nameAt(p, 16 * big, M.deviceNames);
          return (
            <text key={i} x={n.x} y={n.y} textAnchor={n.anchor} style={mono}>
              {text}
            </text>
          );
        })}
      </g>

      {/* June: the gateway's devices, thermostats and sensors. */}
      <g opacity={aside}>
        {[...J.sensors, ...J.thermos].map((to, i) => (
          <line key={i} {...link(gateway, half.gateway, to, i < J.sensors.length ? [26 * k, 15 * k] : [28 * k, 20 * k])} stroke={c.ink} strokeWidth={sw} opacity={devices(i)} />
        ))}
        {J.sensors.map(([x, y], i) => (
          <g key={`s${i}`} opacity={devices(i)}>
            <rect x={x - 26 * k} y={y - 15 * k} width={52 * k} height={30 * k} fill={c.ground} stroke={c.ink} strokeWidth={sw} />
            <rect x={x - 17 * k} y={y - 9 * k} width={10 * k} height={18 * k} fill="none" stroke={c.ink} strokeWidth={sw} />
          </g>
        ))}
        {J.thermos.map(([x, y], i) => (
          <g key={`t${i}`} opacity={devices(i + 2)}>
            <rect x={x - 28 * k} y={y - 20 * k} width={56 * k} height={40 * k} fill={c.ground} stroke={c.ink} strokeWidth={sw} />
            <g fill="none" stroke={c.ink} strokeWidth={sw} strokeLinecap="round">
              <line x1={x - 12 * k} y1={y - 12 * k} x2={x - 12 * k} y2={y + 2 * k} />
              <circle cx={x - 12 * k} cy={y + 7 * k} r={4 * k} />
              {[-10, -5, 0].map((dy) => (
                <line key={dy} x1={x - 4 * k} y1={y + dy * k} x2={x + 3 * k} y2={y + dy * k} />
              ))}
            </g>
          </g>
        ))}
        <text x={J.thermosName[0]} y={J.thermosName[1]} opacity={devices(2)} style={mono}>
          THERMOSTATS
        </text>
        {J.sensorsName && (
          <text x={J.sensorsName[0]} y={J.sensorsName[1]} textAnchor="end" opacity={devices(0)} style={mono}>
            SENSORS
          </text>
        )}
      </g>

      {/* The backbone, in March from the cloud through the internet to the router; in June the cloud steps out of
          the chain into its own column and only a line ties it to the internet. */}
      <line {...link(cloud, half.cloud, globe, half.globe)} stroke={c.ink} strokeWidth={sw} opacity={drawMarch} />
      <line {...link(globe, half.globe, router, half.router)} stroke={c.ink} strokeWidth={sw} opacity={drawMarch} />
      <line {...link(router, half.router, gateway, half.gateway)} stroke={c.ink} strokeWidth={sw} opacity={move > 0.5 ? aside : 0} />
      <path
        d={CLOUD_PATH}
        transform={`translate(${cloud[0]} ${cloud[1]}) scale(${cloudScale})`}
        fill={c.ground}
        stroke={c.ink}
        strokeWidth={sw / cloudScale}
        strokeLinejoin="round"
        opacity={drawMarch}
      />
      <g fill={c.ground} stroke={c.ink} strokeWidth={sw / big} transform={`translate(${globe[0]} ${globe[1]}) scale(${big})`} opacity={drawMarch}>
        <circle r={20} />
        <ellipse rx={8} ry={20} fill="none" />
        <line x1={-20} x2={20} />
      </g>
      <g transform={`translate(${router[0]} ${router[1]}) scale(${big})`} stroke={c.ink} strokeWidth={sw / big} opacity={drawMarch}>
        <rect x={-24} y={-13} width={48} height={26} fill={c.ground} />
        {[-8, 0, 8].map((x) => (
          <circle key={x} cx={x} r={2.4} fill={c.ink} stroke="none" />
        ))}
      </g>
      <g transform={`translate(${gateway[0]} ${gateway[1]}) scale(${big})`} opacity={drawMarch * (move > 0.5 ? aside : 1)}>
        <circle r={24} fill={c.ink} />
        {[
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
        ].map(([dx, dy]) => (
          <g key={`${dx}${dy}`} stroke={c.ground} strokeWidth={2.4 / big} strokeLinecap="square" fill="none">
            <line x2={dx * 9} y2={dy * 9} />
            <polyline points={`${dx * 4.5},${dy * 9} ${dx * 9},${dy * 9} ${dx * 9},${dy * 4.5}`} />
          </g>
        ))}
      </g>
      {/* Names of the nodes: they step to their June side once the chain has moved most of the way. */}
      {names.map(({ p, h, text, side, show }) =>
        side === 'none' ? null : (
          <text key={text} {...(({ x, y, anchor }) => ({ x, y, textAnchor: anchor }))(nameAt(p, h, side))} opacity={drawMarch * show} style={mono}>
            {text}
          </text>
        ),
      )}

      {/* The cloud's switch: how much the system talks to the cloud server, high, normal or low. Beside each level
          the rhythm of its requests: the lower the setting, the fewer requests. */}
      <g opacity={cloudPanel}>
        {J.tie && <line x1={J.tie[0]} y1={J.tie[1]} x2={J.tie[2]} y2={J.tie[3]} stroke={c.hair} strokeWidth={sw} />}
        {J.cloudNameLines.map((text, i) => (
          <text key={text} x={J.cloudName[0]} y={J.cloudName[1] + i * L.font * 1.3} style={label}>
            {text}
          </text>
        ))}
        {/* Stacked levels share a track; side by side, the labels stand between them and need none. */}
        {J.levels.xs[0] === J.levels.xs[2] && (
          <line x1={J.levels.xs[0]} y1={J.levels.ys[0]} x2={J.levels.xs[2]} y2={J.levels.ys[2]} stroke={c.hair} strokeWidth={sw} />
        )}
        {LEVELS.map((name, i) => {
          const on = levelOn[i];
          const x = J.levels.xs[i];
          const y = J.levels.ys[i];
          const r = RHYTHM[i];
          return (
            <g key={name}>
              <circle cx={x} cy={y} r={7 * k} fill={mix(c.ground, c.signal, on)} stroke={mix(c.ink, c.signal, on)} strokeWidth={sw} />
              <text x={x + 16 * k} y={y + L.font * 0.35} style={{ ...label, fill: mix(c.ink, c.signal, on) }}>
                {name}
              </text>
              {Array.from({ length: r.dots }, (_, n) => (
                <circle
                  key={n}
                  cx={x + J.levels.rhythm[0] + (n * r.gap + 3) * k}
                  cy={y + J.levels.rhythm[1]}
                  r={3 * k}
                  fill={mix(c.mute, c.signal, on)}
                />
              ))}
            </g>
          );
        })}
      </g>

      {/* The requests: from the active people's phones through router and internet to the cloud. */}
      {J.note && (
        <g opacity={lanes}>
          <text x={J.note[0]} y={J.note[1]} style={mono}>
            EVERY REQUEST TRAVELS
          </text>
          <text x={J.note[0]} y={J.note[1] + L.font * 1.3} style={mono}>
            THROUGH THE NETWORK
          </text>
        </g>
      )}
      {ways.map((way, w) => {
        const length = polyLength(way);
        // One stream per level, each as strong as its level is set: the rhythms cross-fade as the switch moves.
        const streams = SPACING.map((gap, i) => {
          const spacing = gap * k;
          const offset = (share * 2400 + w * spacing * 0.5) % spacing;
          const dots: Point[] = [];
          if (levelOn[i] > 0) for (let d = offset; d < length; d += spacing) dots.push(along(way, d));
          return { dots, strength: levelOn[i] };
        });
        return (
          <g key={w}>
            <polyline
              points={way.map(([x, y]) => `${x},${y}`).join(' ')}
              fill="none"
              stroke={c.signal}
              strokeWidth={sw}
              strokeDasharray={`${4 * k} ${6 * k}`}
              opacity={lanes}
            />
            {streams.map(({ dots, strength }, i) =>
              dots.map(([x, y], n) => <circle key={`${i}-${n}`} cx={x} cy={y} r={5 * k} fill={c.signal} opacity={strength} />),
            )}
          </g>
        );
      })}
    </svg>
  );
};
