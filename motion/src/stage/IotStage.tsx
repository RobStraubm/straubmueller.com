// Sustainable IoT as the opening of its case page (version J): the film's three acts across the whole width, with
// no ground of its own. The page sets the title and the summary as real text in the same 1600 × 900 box. In the
// first act the brief's network runs on from the end of the title, internet, router and hub on the title's line and
// the devices hanging under it, as if the title named the wiring; the brief's question stands under the summary in
// red while the links switch between Wi-Fi and Bluetooth. In act 2 the network leaves the title and shrinks into the
// model on the right, the people, the rooms and the cloud come in around it, and the question is carried in and
// crossed out. In act 3 the model rises, the phone's requests travel through the network to the cloud and the curves
// below show what they cost; the finding takes the left column. Words are the film's; shapes follow the sprint's
// wireframes, the curves show the principle, not data.
import { useCurrentFrame } from 'remotion';
import type { Palette } from '../style';
import { fonts, progress, stepped } from '../style';

type Point = [number, number];

/** The model is the film's, enlarged into the right half. While the sprint builds it (act 2) it fills the right
 * half, film x 64 on stage x 680; in act 3 it rises and steps down to 1.25 × to make room for the curves, film
 * x 64 on stage x 720, the chart's left edge. */
const MODEL = { build: { scale: 1.34, x: 594, y: -60 }, rest: { scale: 1.25, x: 640, y: -120 } };
/** Inside the model the network is half its own size, top left at this offset (as MODEL in Iot.tsx). */
const NET = { scale: 0.5, x: 150, y: 180 };

/** Network nodes: where each stands in act 1 (stage units, at its act-1 scale) and in the network's own
 * coordinates of the film, which place it in the model. Sizes in the film's units: globe r 30, router 84 × 40,
 * hub r 48, sensor 120 × 56, thermostat 120 × 80. */
type NetNode = { a: Point; scale: number; local: Point };
const GLOBE: NetNode = { a: [1020, 124], scale: 1, local: [112, 402] };
const ROUTER: NetNode = { a: [1166, 124], scale: 1.1, local: [254, 402] };
const HUB: NetNode = { a: [1336, 124], scale: 1.125, local: [430, 402] };
const SENSORS = [
  { a: [1520, 392] as Point, scale: 1.1, local: [676, 318] as Point, label: 'SENSOR 1' },
  { a: [1520, 512] as Point, scale: 1.1, local: [676, 404] as Point, label: 'SENSOR 2' },
];
const THERMOS = [860, 1030, 1200, 1370].map((x, i) => ({
  a: [x, 668] as Point,
  scale: 1.1,
  local: [130 + 166 * i, 692] as Point,
  label: `THERMO ${i + 1}`,
}));

// The rooms, people, levels, the request path, the cloud and the link glyph are copied from Iot.tsx, which does not
// export them; they must stay in sync with the film.

/** Rooms of the wireframe's environment panel, with the ranges written in them (film coordinates). */
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

/** The way a request takes, in film coordinates: from the first phone down to the router, along the backbone
 * through the internet to the cloud. */
const PATH: Point[] = [
  [279, 312],
  [279, 381],
  [146, 381],
];
const pathLength = PATH.slice(1).reduce((sum, [x, y], i) => sum + Math.hypot(x - PATH[i][0], y - PATH[i][1]), 0);
const alongPath = (share: number): Point => {
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

/** CO₂e over time for the three usage levels of the results page, under the risen model: a small dip, then a
 * rise that levels off. The shape of the film's curves, stretched to this chart; no values. */
const CHART = { x0: 720, x1: 1290, base: 786, axis: 800, top: 620 };
const USAGE = [
  { label: 'HIGH', rise: 156 },
  { label: 'NORMAL', rise: 83 },
  { label: 'LOW', rise: 33 },
];
const usageY = (rise: number, t: number) => {
  const dip = t < 0.3 ? 10 * Math.sin((Math.PI * t) / 0.3) : 0;
  const u = Math.min(1, Math.max(0, (t - 0.18) / 0.82));
  return CHART.base + dip - rise * u * u * (3 - 2 * u);
};
const usagePoints = (rise: number, share: number) => {
  const steps = Math.max(1, Math.round(80 * share));
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = (share * i) / steps;
    return `${CHART.x0 + (CHART.x1 - CHART.x0) * t},${usageY(rise, t)}`;
  }).join(' ');
};

/** The left column under the summary: a small head, then the act's point in the title's type. */
const COLUMN = { head: 512, first: 584, line: 58, size: 46 };
const ADDED = ['The people,', 'the rooms', 'and the cloud.'];
const FINDING = ['What matters most:', 'how often people check', 'the data on their phones.'];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPoint = (a: Point, b: Point, t: number): Point => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

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

/** The link glyph: Wi-Fi, or Bluetooth while the brief still asks which. Drawn at the film's size, r 19. */
const Link = ({ bluetooth, w, c }: { bluetooth: boolean; w: number; c: Palette }) => (
  <g>
    <circle r={19} fill={c.ground} stroke={c.ink} strokeWidth={w} />
    {bluetooth ? (
      <polyline
        points="-6,-6 6,5 0,11 0,-11 6,-5 -6,6"
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
            d={`M ${-r * 0.72} ${6 - r * 0.7} A ${r} ${r} 0 0 1 ${r * 0.72} ${6 - r * 0.7}`}
            fill="none"
            stroke={c.ink}
            strokeWidth={w}
            strokeLinecap="round"
          />
        ))}
        <circle cy={6} r={2.5} fill={c.ink} />
      </>
    )}
  </g>
);

/** A cloud of four bumps, about 70 by 36, centred on its own origin. */
const CLOUD_PATH = 'M -34 18 A 12 12 0 0 1 -26 -4 A 18 18 0 0 1 8 -18 A 14 14 0 0 1 30 2 A 9 9 0 0 1 34 18 Z';

export const IotStage = ({ palette: c }: { palette: Palette }) => {
  const f = useCurrentFrame();
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };
  const label = { ...mono, fill: c.ink, letterSpacing: 0.5 };
  const sans = { fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -1.2, fill: c.ink };
  const STROKE = 2.5;

  // Act 2 takes the network off the title into the model; act 3 lifts the model to make room for the curves.
  const shrink = progress(f, 64, 84);
  const rise = progress(f, 136, 156);
  const m = {
    scale: lerp(MODEL.build.scale, MODEL.rest.scale, rise),
    x: lerp(MODEL.build.x, MODEL.rest.x, rise),
    y: lerp(MODEL.build.y, MODEL.rest.y, rise),
  };
  const model = (x: number, y: number): Point => [m.x + m.scale * x, m.y + m.scale * y];
  const inModel = `translate(${m.x} ${m.y}) scale(${m.scale})`;
  /** Where a network node stands now and at what scale. */
  const place = (node: { a: Point; scale: number; local: Point }) => {
    const b = model(NET.x + NET.scale * node.local[0], NET.y + NET.scale * node.local[1]);
    return { at: lerpPoint(node.a, b, shrink), s: lerp(node.scale, m.scale * NET.scale, shrink) };
  };
  // Act 3 dims what the finding does not need: the devices, the rooms, the question that was dropped.
  const dim = 1 - 0.6 * progress(f, 140, 154);
  const netText = 1 - progress(f, 62, 70);

  // Act 1: while the brief asks how the devices connect, the links switch between Wi-Fi and Bluetooth.
  const bluetooth = f >= 44 && f < 62 && Math.floor((f - 44) / 4) % 2 === 1;
  const asked = f < 72;

  const globe = place(GLOBE);
  const router = place(ROUTER);
  const hub = place(HUB);
  const sensors = SENSORS.map((sensor) => ({ ...sensor, ...place(sensor) }));
  const thermos = THERMOS.map((thermo) => ({ ...thermo, ...place(thermo) }));
  // Every link runs from the hub's rim to the device: a sensor's left side, a thermostat's top.
  const links = [
    ...sensors.map(({ at, s }) => [at[0] - 60 * s, at[1]] as Point),
    ...thermos.map(({ at, s }) => [at[0], at[1] - 40 * s] as Point),
  ].map((to) => {
    const d = Math.hypot(to[0] - hub.at[0], to[1] - hub.at[1]);
    const from: Point = [hub.at[0] + ((to[0] - hub.at[0]) / d) * 48 * hub.s, hub.at[1] + ((to[1] - hub.at[1]) / d) * 48 * hub.s];
    return { from, to, length: Math.hypot(to[0] - from[0], to[1] - from[1]) };
  });
  const linkScale = lerp(1.1, m.scale * NET.scale, shrink);

  // The names of the backbone: beside their nodes on the title's line, then where the film puts them in the model.
  // The hub's name changes sides, so it steps out while the network moves and comes back above the hub.
  const moving = 1 - progress(f, 62, 66) * (1 - progress(f, 82, 88));
  const names = [
    { text: 'INTERNET', node: globe, from: [0, 60], to: [-12, 41], shown: 1, devices: false },
    { text: 'ROUTER', node: router, from: [0, 60], to: [16, 41], shown: 1, devices: false },
    { text: 'HUB', node: hub, from: [94, 6], to: [0, -39], shown: moving, devices: true },
  ];

  // The brief's question: large and red under the summary, then carried into the model, grey and crossed out.
  const tagShown = stepped(progress(f, 40, 44), 3);
  const tagAt = lerpPoint([0, 540], model(460, 428), shrink);
  const tagS = lerp(1.8, 0.75 * m.scale, shrink);

  // Act 3: requests leave the phone every few frames and travel to the cloud.
  const pulses: number[] = [];
  for (let start = 158; start <= f; start += 8) {
    const t = (f - start) / 18;
    if (t <= 1) pulses.push(t);
  }
  const curveShare = Math.min(1, Math.max(0, (f - 156) / 36));
  const levelsLit = f >= 190;

  const cloudEnd = model(138, 381)[0];

  return (
    <svg viewBox="0 0 1600 900" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <defs>
        <clipPath id="iot-stage-column">
          <rect x={-20} y={COLUMN.head + 16} width={700} height={COLUMN.line * 3 + 20} />
        </clipPath>
      </defs>

      {/* The backbone: internet, router and hub, on the title's line in act 1, in the model from act 2 on. */}
      <line
        x1={globe.at[0] + 30 * globe.s}
        y1={globe.at[1]}
        x2={router.at[0] - 42 * router.s}
        y2={router.at[1]}
        stroke={c.ink}
        strokeWidth={STROKE}
        style={drawn(f, 10, Math.max(1, router.at[0] - 42 * router.s - globe.at[0] - 30 * globe.s), 6)}
      />
      <line
        x1={router.at[0] + 42 * router.s}
        y1={router.at[1]}
        x2={hub.at[0] - 48 * hub.s}
        y2={hub.at[1]}
        stroke={c.ink}
        strokeWidth={STROKE}
        style={drawn(f, 16, Math.max(1, hub.at[0] - 48 * hub.s - router.at[0] - 42 * router.s), 6)}
      />
      <g transform={`translate(${globe.at[0]} ${globe.at[1]}) scale(${globe.s})`} fill="none" stroke={c.ink} strokeWidth={STROKE / globe.s}>
        <circle r={30} style={drawn(f, 4, 189, 10)} />
        <g opacity={stepped(progress(f, 10, 12), 1)}>
          <ellipse rx={12} ry={30} />
          <line x1={-30} x2={30} />
          <line x1={-27} x2={27} y1={-12} y2={-12} />
          <line x1={-27} x2={27} y1={12} y2={12} />
        </g>
      </g>
      <g
        transform={`translate(${router.at[0]} ${router.at[1]}) scale(${router.s})`}
        opacity={stepped(progress(f, 14, 18), 1)}
        fill="none"
        stroke={c.ink}
        strokeWidth={STROKE / router.s}
      >
        <rect x={-42} y={-20} width={84} height={40} fill={c.ground} />
        <line x1={-26} y1={-20} x2={-34} y2={-38} />
        {[-12, 0, 12].map((x) => (
          <circle key={x} cx={x} r={3.5} fill={c.ink} stroke="none" />
        ))}
      </g>

      <g opacity={dim}>
        {links.map(({ from, to, length }, i) => (
          <line
            key={i}
            x1={from[0]}
            y1={from[1]}
            x2={to[0]}
            y2={to[1]}
            stroke={c.ink}
            strokeWidth={STROKE}
            style={f < 64 ? drawn(f, 24 + i * 2, length, 8) : undefined}
          />
        ))}
        {links.map(({ from, to }, i) =>
          stepped(progress(f, 28 + i * 2, 30 + i * 2), 1) ? (
            <g key={i} transform={`translate(${(from[0] + to[0]) / 2} ${(from[1] + to[1]) / 2}) scale(${linkScale})`}>
              <Link bluetooth={bluetooth} w={STROKE / linkScale} c={c} />
            </g>
          ) : null,
        )}

        {/* The hub, a gateway mark on a filled disc. */}
        <g transform={`translate(${hub.at[0]} ${hub.at[1]}) scale(${hub.s})`} opacity={stepped(progress(f, 20, 24), 3)}>
          <circle r={48} fill={c.ink} />
          {[
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ].map(([dx, dy]) => (
            <g key={`${dx}${dy}`} stroke={c.ground} strokeWidth={3 / hub.s} strokeLinecap="square" fill="none">
              <line x2={dx * 18} y2={dy * 18} />
              <polyline points={`${dx * 9},${dy * 18} ${dx * 18},${dy * 18} ${dx * 18},${dy * 9}`} />
            </g>
          ))}
        </g>

        {sensors.map((sensor, i) => {
          const shown = stepped(progress(f, 30 + i * 2, 34 + i * 2), 3);
          if (!shown) return null;
          const w = STROKE / sensor.s;
          return (
            <g key={sensor.label} opacity={shown} transform={`translate(${sensor.at[0] - 60 * sensor.s} ${sensor.at[1] - 28 * sensor.s}) scale(${sensor.s})`}>
              <rect width={120} height={56} fill={c.ground} stroke={c.ink} strokeWidth={w} />
              <rect x={14} y={13} width={18} height={30} fill="none" stroke={c.ink} strokeWidth={w} />
              <line x1={18} y1={28} x2={28} y2={28} stroke={c.ink} strokeWidth={w} />
              <text x={40} y={34} fontSize={16 / sensor.s} opacity={netText} style={{ ...label, letterSpacing: 0 }}>
                {sensor.label}
              </text>
            </g>
          );
        })}
        {thermos.map((thermo, i) => {
          const shown = stepped(progress(f, 34 + i * 2, 38 + i * 2), 3);
          if (!shown) return null;
          return (
            <g key={thermo.label} opacity={shown} transform={`translate(${thermo.at[0] - 60 * thermo.s} ${thermo.at[1] - 40 * thermo.s}) scale(${thermo.s})`}>
              <rect width={120} height={80} fill={c.ground} stroke={c.ink} strokeWidth={STROKE / thermo.s} />
              <g stroke={c.ink} strokeWidth={STROKE / thermo.s} strokeLinecap="round" fill="none">
                <line x1={26} y1={12} x2={26} y2={34} />
                <circle cx={26} cy={40} r={6} />
                {[16, 22, 28].map((y) => (
                  <line key={y} x1={36} y1={y} x2={46} y2={y} />
                ))}
              </g>
              <text x={12} y={70} fontSize={17 / thermo.s} opacity={netText} style={label}>
                {thermo.label}
              </text>
            </g>
          );
        })}
      </g>
      {names.map((name) => (
        <text
          key={name.text}
          x={name.node.at[0] + lerp(name.from[0], name.to[0], shrink)}
          y={name.node.at[1] + lerp(name.from[1], name.to[1], shrink)}
          fontSize={17}
          textAnchor="middle"
          opacity={progress(f, 22, 30) * name.shown * (name.devices ? dim : 1)}
          style={mono}
        >
          {name.text}
        </text>
      ))}

      {/* Act 2 adds the people, the rooms and the cloud around the network; they stay to the end. */}
      <line
        x1={globe.at[0] - 30 * globe.s}
        y1={globe.at[1]}
        x2={cloudEnd}
        y2={globe.at[1]}
        stroke={c.ink}
        strokeWidth={STROKE}
        style={drawn(f, 104, Math.max(1, globe.at[0] - 30 * globe.s - cloudEnd), 6)}
      />
      <g transform={inModel}>
        <g opacity={progress(f, 98, 104)}>
          <text x={64} y={330} fontSize={14} style={mono}>
            CLOUD SERVER
          </text>
          <text x={64} y={347} fontSize={14} style={mono}>
            INTERACTION
          </text>
        </g>
        <path d={CLOUD_PATH} transform="translate(104 381)" fill="none" stroke={c.ink} strokeWidth={2} strokeLinejoin="round" {...drawOn(f, 98, 10)} />
        {LEVELS.map((level, i) => {
          const shown = stepped(progress(f, 104 + i * 2, 106 + i * 2), 1);
          if (!shown) return null;
          const lit = levelsLit && i === 0;
          return (
            <g key={level}>
              <circle cx={70} cy={428 + i * 24 - 5} r={6} fill={lit ? c.signal : 'none'} stroke={lit ? c.signal : c.ink} strokeWidth={2} />
              <text x={84} y={428 + i * 24} fontSize={14} style={{ ...label, fill: lit ? c.signal : c.ink }}>
                {level}
              </text>
            </g>
          );
        })}

        <text x={264} y={270} fontSize={14} opacity={progress(f, 84, 90)} style={mono}>
          PEOPLE
        </text>
        {PEOPLE.map((person, i) => {
          const shown = stepped(progress(f, 84 + i * 3, 87 + i * 3), 3);
          if (!shown) return null;
          const stroke = person.phone ? c.ink : c.mute;
          return (
            <g key={person.x} opacity={shown}>
              <circle cx={person.x} cy={292} r={8} fill="none" stroke={stroke} strokeWidth={2} />
              <path d={`M ${person.x - 14} 320 A 14 14 0 0 1 ${person.x + 14} 320`} fill="none" stroke={stroke} strokeWidth={2} />
              {person.phone && stepped(progress(f, 90 + i * 2, 92 + i * 2), 1) > 0 && (
                <g fill="none" stroke={c.signal} strokeWidth={2}>
                  <rect x={person.x - 27} y={290} width={12} height={20} rx={2} />
                  <line x1={person.x - 24} y1={305} x2={person.x - 18} y2={305} />
                </g>
              )}
            </g>
          );
        })}

        <g opacity={dim}>
          <rect x={456} y={268} width={110} height={40} rx={20} fill="none" stroke={c.ink} strokeWidth={2} {...drawOn(f, 108, 8)} />
          <g opacity={progress(f, 112, 118)}>
            <text x={511} y={285} fontSize={13} textAnchor="middle" style={label}>
              ACTS IN
            </text>
            <text x={511} y={301} fontSize={13} textAnchor="middle" style={label}>
              INFLUENCES
            </text>
          </g>

          <polyline points="580,336 658,294 736,336" fill="none" stroke={c.ink} strokeWidth={2} {...drawOn(f, 90, 8)} />
          <rect x={580} y={336} width={156} height={116} fill="none" stroke={c.ink} strokeWidth={2} {...drawOn(f, 92, 10)} />
          {ROOMS.map((room, i) => {
            const shown = stepped(progress(f, 96 + i * 2, 98 + i * 2), 1);
            if (!shown) return null;
            return (
              <g key={i}>
                <rect x={room.x} y={room.y} width={room.w} height={room.h} fill="none" stroke={c.hair} strokeWidth={2} />
                <text x={room.x + room.w / 2} y={room.y + room.h / 2 + 5} fontSize={14} textAnchor="middle" style={label}>
                  {room.text}
                </text>
              </g>
            );
          })}
          <text x={580} y={474} fontSize={14} opacity={progress(f, 98, 104)} style={mono}>
            ROOMS
          </text>
        </g>

        {/* Act 3: the phone's requests travel through the same network to the cloud. */}
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
          return <circle key={i} cx={x} cy={y} r={6} fill={c.signal} />;
        })}
      </g>

      {/* The brief's question: red while it leads, then carried into the model, grey and crossed out. */}
      {tagShown > 0 && (
        <g opacity={dim} transform={`translate(${tagAt[0]} ${tagAt[1]}) scale(${tagS})`}>
          <rect
            width={150}
            height={64}
            fill={asked ? c.signal : c.ground}
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
              style={{ fontFamily: fonts.mono, letterSpacing: 1, fill: asked ? c.ground : c.mute }}
            >
              {text}
            </text>
          ))}
          <line x1={6} y1={58} x2={144} y2={6} stroke={c.ink} strokeWidth={2.5 / tagS} style={drawn(f, 84, 148, 8)} />
        </g>
      )}

      {/* The left column under the summary: what each act means. */}
      <text x={0} y={COLUMN.head} fontSize={19} opacity={progress(f, 18, 26) * (1 - progress(f, 62, 68))} style={mono}>
        THE BRIEF: SIMULATE HOW THE DEVICES ARE CONNECTED
      </text>
      <g opacity={1 - progress(f, 132, 138)}>
        <text x={0} y={COLUMN.head} fontSize={19} opacity={progress(f, 80, 86)} style={mono}>
          THE SPRINT ADDED
        </text>
        <g clipPath="url(#iot-stage-column)">
          {ADDED.map((text, i) => {
            const rise = progress(f, 84 + i * 8, 96 + i * 8);
            return (
              <text key={text} x={-2} y={COLUMN.first + i * COLUMN.line + (1 - rise) * 200} fontSize={COLUMN.size} style={sans}>
                {text}
              </text>
            );
          })}
        </g>
      </g>
      <text x={0} y={COLUMN.head} fontSize={19} opacity={progress(f, 146, 152)} style={mono}>
        ONCE USE WAS IN THE MODEL
      </text>
      <g clipPath="url(#iot-stage-column)">
        {FINDING.map((text, i) => {
          const rise = progress(f, 154 + i * 8, 170 + i * 8);
          return (
            <text
              key={text}
              x={-2}
              y={COLUMN.first + i * COLUMN.line + (1 - rise) * 200}
              fontSize={COLUMN.size}
              style={{ ...sans, fill: i === 2 ? c.signal : c.ink }}
            >
              {text}
            </text>
          );
        })}
      </g>

      {/* Act 3, under the risen model: what the requests cost, for high, normal and low use. */}
      <polyline
        points={`${CHART.x0},${CHART.top} ${CHART.x0},${CHART.axis} ${CHART.x1},${CHART.axis}`}
        fill="none"
        stroke={c.ink}
        strokeWidth={2}
        {...drawOn(f, 146, 10)}
      />
      <text x={CHART.x0 + 14} y={CHART.top + 6} fontSize={19} opacity={progress(f, 150, 156)} style={mono}>
        CO<tspan fontSize={14} dy={5}>2</tspan>
        <tspan dy={-5}>e</tspan>
      </text>
      {[0.25, 0.5, 0.75].map((t, i) => {
        const x = lerp(CHART.x0, CHART.x1, t);
        return (
          <line
            key={t}
            x1={x}
            y1={CHART.top + 10}
            x2={x}
            y2={CHART.axis}
            stroke={c.hair}
            strokeWidth={2}
            strokeDasharray="6 8"
            opacity={stepped(progress(f, 152 + i * 2, 154 + i * 2), 1)}
          />
        );
      })}
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
        <text x={CHART.x1 + 22} y={CHART.base - USAGE[0].rise - 30} fontSize={17} style={mono}>
          USAGE
        </text>
        {USAGE.map((usage, i) => (
          <text
            key={usage.label}
            x={CHART.x1 + 22}
            y={CHART.base - usage.rise + 7}
            fontSize={19}
            style={{ ...label, fill: i === 0 ? c.signal : c.ink }}
          >
            {usage.label}
          </text>
        ))}
      </g>
      <text x={CHART.x0} y={846} fontSize={17} opacity={progress(f, 164, 172)} style={mono}>
        ACCESS AND TRANSFER OVER THE NETWORK USE THE MOST ENERGY
      </text>
    </svg>
  );
};
