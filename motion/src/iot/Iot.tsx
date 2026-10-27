// Sustainable IoT in seven seconds, on one stage that never empties: the lab first wanted a tool that only
// simulates how its devices are connected; the sprint added the people, the rooms and the cloud around that
// network; and the analysis found what matters most: how often people fetch the data on their phones.
// Shapes follow the sprint's wireframes (model and results); the curves show the principle, not data.
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ActWord, Labels, type Act } from '../parts';
import { fonts, palettes, progress, SIZE, stepped, type Palette, type Theme, POSTER_VIEW } from '../style';

export const IOT_FRAMES = 210;

export const IOT_ACTS: Act[] = [
  { word: 'SETUP', from: 0, to: 64 },
  { word: 'USE', from: 64, to: 136 },
  { word: 'FOOTPRINT', from: 136, to: Infinity },
];

/** The device network of the wireframe's IoT panel, at full size: internet, router, hub, sensors, thermostats. */
const HUB = { x: 430, y: 402, r: 48 };
const SENSORS = [
  { x: 616, y: 290, label: 'SENSOR 1' },
  { x: 616, y: 376, label: 'SENSOR 2' },
];
const THERMOS = [70, 236, 402, 568].map((x, i) => ({ x, y: 652, label: `THERMO ${i + 1}` }));
const LINKS = [
  ...SENSORS.map((s) => ({ x: s.x, y: s.y + 28 })),
  ...THERMOS.map((t) => ({ x: t.x + 60, y: t.y })),
].map((to) => {
  const d = Math.hypot(to.x - HUB.x, to.y - HUB.y);
  const from = { x: HUB.x + ((to.x - HUB.x) / d) * HUB.r, y: HUB.y + ((to.y - HUB.y) / d) * HUB.r };
  return { from, to, length: Math.hypot(to.x - from.x, to.y - from.y) };
});

/** Where the network sits in the model once the rest joins it: half size, top left at this offset. */
const MODEL = { scale: 0.5, x: 150, y: 180 };
/** In the second act the whole model sits this much lower; in the third it rises to make room for the curves. */
const LOW = 135;

/** Rooms of the wireframe's environment panel, with the ranges written in them. */
const ROOMS = [
  { x: 588, y: 344, w: 70, h: 48, text: '16–22' },
  { x: 666, y: 344, w: 62, h: 48, text: '19–23' },
  { x: 588, y: 400, w: 70, h: 44, text: '20–22' },
  { x: 666, y: 400, w: 62, h: 44, text: '20–22' },
];
/** Two active people with phones, one passive without, as in the wireframe's user panel. */
const PEOPLE = [
  { x: 300, phone: true },
  { x: 360, phone: true },
  { x: 420, phone: false },
];
const LEVELS = ['HIGH', 'NORMAL', 'LOW'];

/** The backbone's names stay readable: full size at first, then 15 px beside the half-size network. */
const NAMES = [
  { text: 'INTERNET', from: [112, 458], to: [196, 414], devices: false },
  { text: 'ROUTER', from: [254, 446], to: [290, 414], devices: false },
  { text: 'HUB', from: [430, 338], to: [365, 350], devices: true },
];

/** The way a request takes: from the first phone down to the router, through the internet to the cloud. */
const PATH: [number, number][] = [
  [279, 312],
  [279, 381],
  [146, 381],
];
const pathLength = PATH.slice(1).reduce((sum, [x, y], i) => sum + Math.hypot(x - PATH[i][0], y - PATH[i][1]), 0);
const alongPath = (share: number) => {
  let left = share * pathLength;
  for (let i = 1; i < PATH.length; i++) {
    const [x0, y0] = PATH[i - 1];
    const [x1, y1] = PATH[i];
    const step = Math.hypot(x1 - x0, y1 - y0);
    if (left <= step) return [x0 + ((x1 - x0) * left) / step, y0 + ((y1 - y0) * left) / step];
    left -= step;
  }
  return PATH[PATH.length - 1];
};

/** CO₂e over time for the three usage levels of the results page: a small dip, then a rise that levels off. */
const CHART = { x0: 100, x1: 580, base: 732, axis: 744, top: 596 };
const USAGE = [
  { label: 'HIGH', rise: 124 },
  { label: 'NORMAL', rise: 66 },
  { label: 'LOW', rise: 26 },
];
const usageY = (rise: number, t: number) => {
  const dip = t < 0.3 ? 8 * Math.sin((Math.PI * t) / 0.3) : 0;
  const u = Math.min(1, Math.max(0, (t - 0.18) / 0.82));
  return CHART.base + dip - rise * u * u * (3 - 2 * u);
};
const usagePoints = (rise: number, share: number) => {
  const steps = Math.max(1, Math.round(64 * share));
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = (share * i) / steps;
    return `${CHART.x0 + (CHART.x1 - CHART.x0) * t},${usageY(rise, t)}`;
  }).join(' ');
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const drawn = (frame: number, start: number, length: number, span = 12) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress(frame, start, start + span)),
});

/** Draws any path from start to end, whatever its length. */
const drawOn = (frame: number, start: number, span = 10) => ({
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1 - progress(frame, start, start + span),
});

/** The link glyph: Wi-Fi, or Bluetooth while the brief still asks which. */
const Link = ({ x, y, w, bluetooth, c }: { x: number; y: number; w: number; bluetooth: boolean; c: Palette }) => (
  <g>
    <circle cx={x} cy={y} r={19} fill={c.ground} stroke={c.ink} strokeWidth={w} />
    {bluetooth ? (
      <polyline
        points={`${x - 6},${y - 6} ${x + 6},${y + 5} ${x},${y + 11} ${x},${y - 11} ${x + 6},${y - 5} ${x - 6},${y + 6}`}
        fill="none"
        stroke={c.ink}
        strokeWidth={w}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ) : (
      <>
        {[5, 10].map((r) => (
          <path
            key={r}
            d={`M ${x - r * 0.72} ${y + 6 - r * 0.7} A ${r} ${r} 0 0 1 ${x + r * 0.72} ${y + 6 - r * 0.7}`}
            fill="none"
            stroke={c.ink}
            strokeWidth={w}
            strokeLinecap="round"
          />
        ))}
        <circle cx={x} cy={y + 6} r={2.5} fill={c.ink} />
      </>
    )}
  </g>
);

/** A cloud of four bumps, about 70 by 36, centred on its own origin. */
const CLOUD_PATH = 'M -34 18 A 12 12 0 0 1 -26 -4 A 18 18 0 0 1 8 -18 A 14 14 0 0 1 30 2 A 9 9 0 0 1 34 18 Z';

export const Iot = ({ theme }: { theme: Theme }) => {
  const f = useCurrentFrame();
  const c = palettes[theme];
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };
  const label = { ...mono, fill: c.ink, letterSpacing: 0.5 };
  const sans = { fontFamily: fonts.sans, fill: c.ink };
  const onSignal = theme === 'light' ? c.ground : c.ink;

  // One stage: the network shrinks into the model, the model sits low in act 2 and rises in act 3.
  const shrink = progress(f, 64, 84);
  const lift = LOW * (1 - progress(f, 136, 156));
  const s = lerp(1, MODEL.scale, shrink);
  const k = 1 / s; // strokes keep their weight while the network shrinks
  const netX = lerp(0, MODEL.x, shrink);
  const netY = lerp(0, MODEL.y, shrink) + shrink * lift;
  const netText = 1 - progress(f, 62, 70);
  // Act 3 dims what the finding does not need: the devices, the rooms, the question that was dropped.
  const dim = 1 - 0.6 * progress(f, 140, 154);
  const net = { stroke: c.ink, strokeWidth: 2 * k, fill: 'none' };
  const line = { stroke: c.ink, strokeWidth: 2, fill: 'none' };

  // Act 1: while the brief asks how the devices connect, the links switch between Wi-Fi and Bluetooth.
  const bluetooth = f >= 44 && f < 62 && Math.floor((f - 44) / 4) % 2 === 1;

  // The question of the brief travels into the model, turns grey and is crossed out.
  const tagShown = stepped(progress(f, 42, 46), 3);
  const asked = f < 72;
  const tagX = lerp(64, 460, shrink);
  const tagY = lerp(282, 428 + lift, shrink);
  const tagS = lerp(1, 0.75, shrink);

  const model = `translate(0 ${lift})`;
  const caption1 = progress(f, 18, 26) * (1 - progress(f, 60, 66));
  const caption2 = progress(f, 106, 114) * (1 - progress(f, 132, 138));

  // Act 3: requests leave the phone every few frames and travel to the cloud.
  const pulses: number[] = [];
  for (let start = 158; start <= f; start += 8) {
    const t = (f - start) / 18;
    if (t <= 1) pulses.push(t);
  }
  const curveShare = Math.min(1, Math.max(0, (f - 156) / 36));
  const levelsLit = f >= 190;

  return (
    <AbsoluteFill style={{ backgroundColor: c.ground }}>
      <svg width={SIZE.width} height={SIZE.height} viewBox={POSTER_VIEW}>
        <Labels frame={f} project="Sustainable IoT" acts={IOT_ACTS} palette={c} />
        <ActWord frame={f} acts={IOT_ACTS} palette={c} />

        {/* The network: drawn at full size for the brief, then half size inside the model, to the end. */}
        <g transform={`translate(${netX} ${netY}) scale(${s})`}>
          <circle cx={112} cy={402} r={30} {...net} style={drawn(f, 4, 189, 10)} />
          <g opacity={stepped(progress(f, 10, 12), 1)}>
            <ellipse cx={112} cy={402} rx={12} ry={30} {...net} />
            <line x1={82} y1={402} x2={142} y2={402} {...net} />
            <line x1={85} y1={390} x2={139} y2={390} {...net} />
            <line x1={85} y1={414} x2={139} y2={414} {...net} />
          </g>
          <line x1={142} y1={402} x2={212} y2={402} {...net} style={drawn(f, 10, 70, 6)} />
          <g opacity={stepped(progress(f, 14, 18), 1)}>
            <rect x={212} y={382} width={84} height={40} {...net} />
            <line x1={228} y1={382} x2={220} y2={364} {...net} />
            {[242, 254, 266].map((x) => (
              <circle key={x} cx={x} cy={402} r={3.5} fill={c.ink} />
            ))}
          </g>
          <line x1={296} y1={402} x2={HUB.x - HUB.r} y2={402} {...net} style={drawn(f, 16, 86, 6)} />

          <g opacity={dim}>
            {LINKS.map(({ from, to, length }, i) => (
              <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} {...net} style={drawn(f, 24 + i * 2, length, 8)} />
            ))}
            {LINKS.map(({ from, to }, i) =>
              stepped(progress(f, 28 + i * 2, 30 + i * 2), 1) ? (
                <Link
                  key={i}
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2}
                  w={2 * k}
                  bluetooth={bluetooth}
                  c={c}
                />
              ) : null,
            )}
            <g opacity={stepped(progress(f, 20, 24), 3)}>
              <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill={c.ink} />
              {[
                [-1, -1],
                [1, -1],
                [1, 1],
                [-1, 1],
              ].map(([dx, dy]) => (
                <g key={`${dx}${dy}`} stroke={c.ground} strokeWidth={3 * k} strokeLinecap="square" fill="none">
                  <line x1={HUB.x} y1={HUB.y} x2={HUB.x + dx * 18} y2={HUB.y + dy * 18} />
                  <polyline
                    points={`${HUB.x + dx * 9},${HUB.y + dy * 18} ${HUB.x + dx * 18},${HUB.y + dy * 18} ${HUB.x + dx * 18},${HUB.y + dy * 9}`}
                  />
                </g>
              ))}
            </g>
            {SENSORS.map((sensor, i) => {
              const shown = stepped(progress(f, 30 + i * 2, 34 + i * 2), 3);
              if (!shown) return null;
              return (
                <g key={sensor.label} opacity={shown}>
                  <rect x={sensor.x} y={sensor.y} width={120} height={56} fill={c.ground} stroke={c.ink} strokeWidth={2 * k} />
                  <rect x={sensor.x + 14} y={sensor.y + 13} width={18} height={30} {...net} strokeWidth={2.5 * k} />
                  <line x1={sensor.x + 18} y1={sensor.y + 28} x2={sensor.x + 28} y2={sensor.y + 28} {...net} strokeWidth={2.5 * k} />
                  <text x={sensor.x + 40} y={sensor.y + 34} fontSize={15} opacity={netText} style={{ ...label, letterSpacing: 0 }}>
                    {sensor.label}
                  </text>
                </g>
              );
            })}
            {THERMOS.map((thermo, i) => {
              const shown = stepped(progress(f, 34 + i * 2, 38 + i * 2), 3);
              if (!shown) return null;
              return (
                <g key={thermo.label} opacity={shown}>
                  <rect x={thermo.x} y={thermo.y} width={120} height={80} fill={c.ground} stroke={c.ink} strokeWidth={2 * k} />
                  <g stroke={c.ink} strokeWidth={2.5 * k} strokeLinecap="round" fill="none">
                    <line x1={thermo.x + 26} y1={thermo.y + 12} x2={thermo.x + 26} y2={thermo.y + 34} />
                    <circle cx={thermo.x + 26} cy={thermo.y + 40} r={6} />
                    {[16, 22, 28].map((y) => (
                      <line key={y} x1={thermo.x + 36} y1={thermo.y + y} x2={thermo.x + 46} y2={thermo.y + y} />
                    ))}
                  </g>
                  <text x={thermo.x + 12} y={thermo.y + 70} fontSize={15} opacity={netText} style={label}>
                    {thermo.label}
                  </text>
                </g>
              );
            })}
          </g>

        </g>
        {NAMES.map((name) => (
          <text
            key={name.text}
            x={lerp(name.from[0], name.to[0], shrink)}
            y={lerp(name.from[1], name.to[1] + lift, shrink)}
            fontSize={lerp(16, 15, shrink)}
            textAnchor="middle"
            opacity={progress(f, 22, 30) * (name.devices ? dim : 1)}
            style={mono}
          >
            {name.text}
          </text>
        ))}

        {/* Act 2 adds the cloud, the people and the rooms around the network; they stay to the end. */}
        <g transform={model}>
          <g opacity={progress(f, 88, 94)}>
            <text x={64} y={330} fontSize={15} style={mono}>
              CLOUD SERVER
            </text>
            <text x={64} y={347} fontSize={15} style={mono}>
              INTERACTION
            </text>
          </g>
          <path
            d={CLOUD_PATH}
            transform="translate(104 381)"
            {...line}
            strokeLinejoin="round"
            {...drawOn(f, 88, 10)}
          />
          <line x1={191} y1={381} x2={140} y2={381} {...line} style={drawn(f, 94, 51, 6)} />
          {LEVELS.map((level, i) => {
            const shown = stepped(progress(f, 98 + i * 2, 100 + i * 2), 1);
            if (!shown) return null;
            const lit = levelsLit && i === 0;
            return (
              <g key={level}>
                <circle cx={70} cy={428 + i * 24 - 5} r={6} fill={lit ? c.signal : 'none'} stroke={lit ? c.signal : c.ink} strokeWidth={2} />
                <text x={84} y={428 + i * 24} fontSize={15} style={{ ...label, fill: lit ? c.signal : c.ink }}>
                  {level}
                </text>
              </g>
            );
          })}

          <text x={264} y={270} fontSize={15} opacity={progress(f, 84, 90)} style={mono}>
            PEOPLE
          </text>
          {PEOPLE.map((person, i) => {
            const shown = stepped(progress(f, 86 + i * 3, 89 + i * 3), 3);
            if (!shown) return null;
            const stroke = person.phone ? c.ink : c.mute;
            return (
              <g key={person.x} opacity={shown}>
                <circle cx={person.x} cy={292} r={8} fill="none" stroke={stroke} strokeWidth={2.5} />
                <path
                  d={`M ${person.x - 14} 320 A 14 14 0 0 1 ${person.x + 14} 320`}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={2.5}
                />
                {person.phone && stepped(progress(f, 92 + i * 2, 94 + i * 2), 1) > 0 && (
                  <g fill="none" stroke={c.signal} strokeWidth={2.5}>
                    <rect x={person.x - 27} y={290} width={12} height={20} rx={2} />
                    <line x1={person.x - 24} y1={305} x2={person.x - 18} y2={305} />
                  </g>
                )}
              </g>
            );
          })}

          <g opacity={dim}>
            <rect x={456} y={268} width={110} height={40} rx={20} {...line} {...drawOn(f, 100, 8)} />
            <g opacity={progress(f, 104, 110)}>
              <text x={511} y={285} fontSize={15} textAnchor="middle" style={label}>
                ACTS IN
              </text>
              <text x={511} y={302} fontSize={15} textAnchor="middle" style={label}>
                INFLUENCES
              </text>
            </g>

            <polyline points="580,336 658,294 736,336" {...line} {...drawOn(f, 90, 8)} />
            <rect x={580} y={336} width={156} height={116} {...line} {...drawOn(f, 92, 10)} />
            {ROOMS.map((room, i) => {
              const shown = stepped(progress(f, 98 + i * 2, 100 + i * 2), 1);
              if (!shown) return null;
              return (
                <g key={i}>
                  <rect x={room.x} y={room.y} width={room.w} height={room.h} fill="none" stroke={c.hair} strokeWidth={2} />
                  <text x={room.x + room.w / 2} y={room.y + room.h / 2 + 5} fontSize={15} textAnchor="middle" style={label}>
                    {room.text}
                  </text>
                </g>
              );
            })}
            <text x={580} y={476} fontSize={15} opacity={progress(f, 100, 106)} style={mono}>
              ROOMS
            </text>
          </g>
        </g>

        {/* The brief's question: red while it leads, then carried into the model, grey and crossed out. */}
        {tagShown > 0 && (
          <g opacity={dim} transform={`translate(${tagX} ${tagY}) scale(${tagS})`}>
            <rect
              width={150}
              height={64}
              fill={asked ? c.signal : 'none'}
              stroke={asked ? c.signal : c.mute}
              strokeWidth={2 / tagS}
              transform={`scale(${asked ? tagShown : 1})`}
            />
            {['WI-FI OR', 'BLUETOOTH?'].map((text, i) => (
              <text
                key={text}
                x={14}
                y={27 + i * 25}
                fontSize={20}
                opacity={tagShown === 1 ? 1 : 0}
                style={{ fontFamily: fonts.mono, letterSpacing: 1, fill: asked ? onSignal : c.mute }}
              >
                {text}
              </text>
            ))}
            <line x1={6} y1={58} x2={144} y2={6} stroke={c.ink} strokeWidth={2.5 / tagS} style={drawn(f, 84, 148, 8)} />
          </g>
        )}

        <text x={64} y={880} fontSize={18} opacity={caption1} style={mono}>
          THE BRIEF: SIMULATE HOW THE DEVICES ARE CONNECTED
        </text>
        <text x={64} y={880} fontSize={18} opacity={caption2} style={mono}>
          THE SPRINT ADDED THE PEOPLE, THE ROOMS AND THE CLOUD
        </text>

        {/* Act 3: the phone's requests travel through the same network, and the curves show what they cost. */}
        <polyline
          points={PATH.map(([x, y]) => `${x},${y}`).join(' ')}
          fill="none"
          stroke={c.signal}
          strokeWidth={2}
          strokeDasharray="4 6"
          opacity={progress(f, 150, 156)}
        />
        {pulses.map((t, i) => {
          const [x, y] = alongPath(t);
          return <circle key={i} cx={x} cy={y} r={7} fill={c.signal} />;
        })}

        <polyline
          points={`${CHART.x0},${CHART.top} ${CHART.x0},${CHART.axis} ${CHART.x1},${CHART.axis}`}
          {...line}
          {...drawOn(f, 146, 10)}
        />
        <text x={CHART.x0} y={586} fontSize={18} opacity={progress(f, 150, 156)} style={mono}>
          CO<tspan fontSize={13} dy={5}>2</tspan>
          <tspan dy={-5}>e</tspan>
        </text>
        {[220, 340, 460].map((x, i) => (
          <line
            key={x}
            x1={x}
            y1={CHART.top + 8}
            x2={x}
            y2={CHART.axis}
            stroke={c.hair}
            strokeWidth={2}
            strokeDasharray="6 8"
            opacity={stepped(progress(f, 152 + i * 2, 154 + i * 2), 1)}
          />
        ))}
        {curveShare > 0 &&
          USAGE.map((usage, i) => (
            <polyline
              key={usage.label}
              points={usagePoints(usage.rise, curveShare)}
              fill="none"
              stroke={i === 0 ? c.signal : c.ink}
              strokeWidth={i === 0 ? 6 : 3}
              strokeLinejoin="round"
            />
          ))}
        <g opacity={stepped(progress(f, 188, 192), 1)}>
          <text x={592} y={CHART.base - USAGE[0].rise - 28} fontSize={15} style={mono}>
            USAGE
          </text>
          {USAGE.map((usage, i) => (
            <text
              key={usage.label}
              x={592}
              y={CHART.base - usage.rise + 6}
              fontSize={18}
              style={{ ...label, fill: i === 0 ? c.signal : c.ink }}
            >
              {usage.label}
            </text>
          ))}
        </g>
        <text x={64} y={786} fontSize={17} opacity={progress(f, 164, 172)} style={mono}>
          ACCESS AND TRANSFER OVER THE NETWORK USE THE MOST ENERGY
        </text>

        <g>
          <defs>
            <clipPath id="iot-finding-mask">
              <rect x={0} y={808} width={800} height={180} />
            </clipPath>
          </defs>
          <g clipPath="url(#iot-finding-mask)">
            {['What matters most:', 'how often people check', 'the data on their phones.'].map((text, i) => {
              const rise = progress(f, 176 + i * 7, 192 + i * 7);
              return (
                <text
                  key={text}
                  x={64}
                  y={850 + i * 46 + (1 - rise) * 180}
                  fontSize={38}
                  style={{ ...sans, fontWeight: 600, letterSpacing: -1, fill: i === 2 ? c.signal : c.ink }}
                >
                  {text}
                </text>
              );
            })}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
