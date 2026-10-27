// Conactive, "One form for each kind of contact, and the screen only shows" (version J). Drawn as the
// reader scrolls past it, starting from the interview result: before digitalisation five channels, each with a
// form of its own; after it eight, and almost all of them on one screen. Then the kinds of contact Conactive gives a
// body leave the screen as objects, and the screen is left to show (thesis p. 148: it "only serves to present"). Only the moves the thesis backs are drawn as lines:
// the day's appointments become conblocks ("a physical visualisation of the appointments agreed online"), notes go
// to the connote ("digitises the handwritten notes"), and the concup takes over what the status in a chat window
// said ("a cup in your hand says 'talk to me' more clearly"), while the chat itself stays on the screen. The condesk
// gets no line: it is a place for working together across a distance, not one of the eight channels, and it keeps
// a screen of its own. Channel names are the interview sketch's, times and rooms the prototype blocks'; the
// objects follow Robert's line drawings, simplified. The stage at the top already plays the film's three acts.
import type { Palette } from '../../../motion/src/style';
import { fonts, stepped } from '../../../motion/src/style';
import { cupBody, cupHandle, cupRim, grooves } from '../../../motion/src/conactive/Conactive';

type Point = [number, number];
type Box = { x: number; y: number; w: number; h: number };

const BEFORE = ['NOTICE BOARD', 'LETTER', 'PHONE', 'NOTE', 'MEMO'];
const AFTER = ['INVITATION', 'CHAT', 'EMAIL', 'PHONE', 'NOTE', 'APPOINTMENT', 'COMMENT', 'VOICE MESSAGE'];
const CHAT = 1;
const NOTE = 4;
const APPOINTMENT = 5;
/** The prototype blocks, as long as their meetings (132 and 200 in the film). */
const BLOCKS = [
  { time: '08:00', room: 'L204', length: 132 },
  { time: '10:15', room: 'H122', length: 200 },
];
/** The cup in the film's coordinates: middle of its foot, and the rim, which is its light ring. */
const CUP = { centre: 190, bottom: 560, rim: 380, rx: 70, ry: 16 };

/** An object in a light oblique view, as in the line drawings: (x, y) is its front left corner on the ground,
 * `dx`/`dy` the shift of its full depth. */
type Solid = { x: number; y: number; w: number; dx: number; dy: number };
const at = (s: Solid, along: number, depth: number, up = 0): Point => [s.x + along + depth * s.dx, s.y - up - depth * s.dy];
const poly = (points: Point[]) => `M ${points.map((p) => p.join(' ')).join(' L ')}`;

interface Layout {
  view: [number, number];
  size: number;
  /** Baseline step between the lines of a label. */
  leading: number;
  before: { head: number; cells: Box[] };
  after: { head: number };
  /** Where the eight channels first appear, each in a box of its own, before they collapse onto the screen. */
  grid: Box[];
  screen: Box & { bar: number };
  rows: Box[];
  stand: { neck: number; half: number };
  cup: { x: number; y: number; scale: number };
  /** The connote: thickness, where each block starts along it and how long it is, and whether the rooms fit. */
  tray: Solid & { h: number; blocks: number[]; widths: number[]; rooms: boolean };
  /** The condesk, with the height of its walls. */
  booth: Solid & { hgt: number };
  labels: {
    cup: Point;
    tray: Point;
    trayLines: string[];
    booth: Point;
    boothLines: string[];
    stays: Point;
    staysLines: string[];
  };
}

const rowsIn = (x: number, top: number, w: number, pitch: number, h: number) =>
  AFTER.map((_, k) => ({ x, y: top + k * pitch, w, h }));

const wide = (): Layout => {
  const screen = { x: 40, y: 168, w: 360, h: 386, bar: 30 };
  const rows = rowsIn(screen.x + 14, screen.y + screen.bar + 8, screen.w - 28, 42, 34);
  return {
    view: [1200, 640],
    size: 17,
    leading: 24,
    before: { head: 28, cells: BEFORE.map((_, k) => ({ x: 40 + k * 226, y: 44, w: 216, h: 48 })) },
    after: { head: 150 },
    grid: AFTER.map((_, k) => ({ x: 40 + (k % 4) * 282, y: 168 + Math.floor(k / 4) * 58, w: 272, h: 48 })),
    screen,
    rows,
    stand: { neck: 28, half: 64 },
    cup: { x: 600, y: 376, scale: 0.85 },
    tray: { x: 500, y: 560, w: 340, h: 20, dx: 90, dy: 104, blocks: [10, 140], widths: [120, 182], rooms: true },
    booth: { x: 916, y: 336, w: 190, dx: 60, dy: 44, hgt: 170 },
    labels: {
      cup: [716, 300],
      tray: [500, 600],
      trayLines: ['CONNOTE + CONBLOCKS', 'A BLOCK PER APPOINTMENT, ROOM FOR NOTES'],
      booth: [916, 370],
      boothLines: ['CONDESK', 'WORKING TOGETHER', 'ACROSS A DISTANCE'],
      stays: [40, 628],
      staysLines: ['THE SCREEN ONLY SHOWS'],
    },
  };
};

/** On a phone the old five sit in boxes as wide as their names: there is no room for five equal ones in a row. */
const flow = (names: string[], x0: number, y0: number, width: number, size: number): Box[] => {
  const cells: Box[] = [];
  let x = x0;
  let y = y0;
  names.forEach((name) => {
    const w = Math.round(name.length * size * 0.62 + 20);
    if (x + w > x0 + width) {
      x = x0;
      y += 56;
    }
    cells.push({ x, y, w, h: 46 });
    x += w + 8;
  });
  return cells;
};

const narrow = (): Layout => {
  const screen = { x: 20, y: 156, w: 310, h: 450, bar: 34 };
  const rows = rowsIn(screen.x + 12, screen.y + screen.bar + 8, screen.w - 24, 50, 40);
  return {
    view: [600, 900],
    size: 22,
    leading: 28,
    before: { head: 30, cells: flow(BEFORE, 20, 46, 560, 22) },
    after: { head: 136 },
    grid: AFTER.map((_, k) => ({ x: 20 + (k % 2) * 285, y: 156 + Math.floor(k / 2) * 58, w: 275, h: 48 })),
    screen,
    rows,
    stand: { neck: 24, half: 56 },
    cup: { x: 440, y: 370, scale: 0.62 },
    tray: { x: 360, y: 606, w: 210, h: 16, dx: 16, dy: 92, blocks: [4, 90], widths: [80, 112], rooms: false },
    booth: { x: 30, y: 886, w: 200, dx: 50, dy: 34, hgt: 120 },
    labels: {
      cup: [358, 186],
      tray: [358, 646],
      trayLines: ['CONNOTE +', 'CONBLOCKS'],
      booth: [300, 762],
      boothLines: ['CONDESK', 'WORKING TOGETHER', 'ACROSS A DISTANCE'],
      stays: [20, 664],
      staysLines: ['THE SCREEN', 'ONLY SHOWS'],
    },
  };
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (share: number, from: number, to: number) => clamp((share - from) / (to - from));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const on = (share: number, from: number) => stepped(span(share, from, from + 0.01), 1);

/** The point a share `t` of the way along a polyline. */
const along = (points: Point[], t: number): Point => {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  let rest = t * lengths.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lengths.length; i++) {
    if (rest <= lengths[i]) {
      const k = lengths[i] ? rest / lengths[i] : 0;
      return [lerp(points[i][0], points[i + 1][0], k), lerp(points[i][1], points[i + 1][1], k)];
    }
    rest -= lengths[i];
  }
  return points[points.length - 1];
};

export const ConactiveFigure = ({ palette: c, share, narrow: thin }: { palette: Palette; share: number; narrow: boolean }) => {
  const L = thin ? narrow() : wide();
  const mono = { fontFamily: fonts.mono, fontSize: L.size, letterSpacing: 1 };
  const cellText = (b: Box) => b.y + b.h / 2 + L.size * 0.36;

  // 1. The old five, each in a box of its own. They go quiet once the eight are there.
  const quiet = span(share, 0.3, 0.38);
  // 2. The eight appear one by one, then collapse into one list on one screen.
  const collapse = ease(span(share, 0.36, 0.5));
  const screenDrawn = span(share, 0.4, 0.52);
  // 3. The objects, one after another: the concup, the connote with its blocks, the condesk.
  const chatRoute = span(share, 0.54, 0.6);
  const dot = ease(span(share, 0.58, 0.64));
  const cupDrawn = span(share, 0.56, 0.64);
  const lit = share >= 0.64;
  const trayDrawn = span(share, 0.62, 0.7);
  const apptRoute = span(share, 0.66, 0.72);
  const carried = ease(span(share, 0.7, 0.76));
  const noteRoute = span(share, 0.72, 0.78);
  const writing = span(share, 0.78, 0.84);
  const boothDrawn = span(share, 0.8, 0.88);
  // 4. What stays.
  const stays = span(share, 0.9, 0.96);

  const row = (k: number) => {
    const from = L.grid[k];
    const to = L.rows[k];
    return { x: lerp(from.x, to.x, collapse), y: lerp(from.y, to.y, collapse), w: lerp(from.w, to.w, collapse), h: lerp(from.h, to.h, collapse) };
  };
  const right = L.screen.x + L.screen.w;
  const middle = (k: number) => L.rows[k].y + L.rows[k].h / 2;
  const gutter = thin ? 16 : 70;

  // The cup, scaled from the film's drawing; its rim is the light ring.
  const cup = L.cup;
  const rimY = cup.y - (CUP.bottom - CUP.rim) * cup.scale;
  const rimLeft = cup.x - CUP.rx * cup.scale;
  const statusDot: Point = [L.rows[CHAT].x + L.rows[CHAT].w - 16, middle(CHAT)];
  const chatPath: Point[] = [
    [right, middle(CHAT)],
    [right + (thin ? 14 : gutter), middle(CHAT)],
    [right + (thin ? 14 : gutter), rimY],
    [rimLeft - 4, rimY],
  ];

  // The connote: front face, top face, the channel for the blocks in front, the notes area behind it.
  const t = L.tray;
  const channel = { from: 0.06, to: 0.38 };
  const notes = { from: 0.48, to: 0.94 };
  const blockDepth = 0.22;
  const blockHeight = thin ? 34 : 30;
  const blockFront = (k: number): Box => {
    const [x, y] = at(t, t.blocks[k], 0.1, t.h);
    return { x, y: y - blockHeight, w: t.widths[k], h: blockHeight };
  };
  const apptPath: Point[] = [
    [right, middle(APPOINTMENT)],
    [right + gutter * (thin ? 1 : 0.5), middle(APPOINTMENT)],
    [right + gutter * (thin ? 1 : 0.5), blockFront(0).y + blockHeight / 2],
    [blockFront(0).x - 4, blockFront(0).y + blockHeight / 2],
  ];
  const noteTarget = at(t, t.w * 0.45, 0.8, t.h);
  const notePath: Point[] = [
    [right, middle(NOTE)],
    [noteTarget[0], middle(NOTE)],
    [noteTarget[0], noteTarget[1] - 6],
  ];

  // The condesk: floor, back and left wall, the frame of the open sides, a counter and the screen with the colleague.
  const b = L.booth;
  const bp = (a: number, d: number, z: number) => at(b, a, d, z);
  const screenIn = { a0: b.w * 0.14, a1: b.w * 0.86, z0: b.hgt * 0.42, z1: b.hgt * 0.9 };
  const head: Point = bp((screenIn.a0 + screenIn.a1) / 2, 1, b.hgt * 0.74);

  const draw = (value: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - value });

  return (
    <svg viewBox={`0 0 ${L.view[0]} ${L.view[1]}`} width="100%" height="100%" aria-hidden="true">
      {/* 1. Before digitalisation: five channels, each with a form of its own. */}
      <text x={L.before.cells[0].x} y={L.before.head} {...mono} fill={c.mute} opacity={on(share, 0)}>
        {thin ? 'BEFORE · 5 CHANNELS' : 'BEFORE DIGITALISATION · 5 CHANNELS, EACH WITH A FORM OF ITS OWN'}
      </text>
      {BEFORE.map((name, k) => {
        const cell = L.before.cells[k];
        return (
          <g key={name} opacity={on(share, 0.03 + k * 0.03) * lerp(1, 0.45, quiet)}>
            <rect x={cell.x} y={cell.y} width={cell.w} height={cell.h} fill="none" stroke={c.ink} strokeWidth={2} />
            <text x={cell.x + (thin ? 10 : 14)} y={cellText(cell)} {...mono} letterSpacing={thin ? 0 : 1} fill={c.ink}>
              {name}
            </text>
          </g>
        );
      })}

      {/* 2. After: eight channels, first each on its own, then in one list on one screen. */}
      <text x={L.screen.x} y={L.after.head} {...mono} fill={c.mute} opacity={on(share, 0.18)}>
        {thin ? 'AFTER · 8 CHANNELS, 1 SCREEN' : 'AFTER DIGITALISATION · 8 CHANNELS, ALMOST ALL ON ONE SCREEN'}
      </text>
      <rect
        x={L.screen.x}
        y={L.screen.y}
        width={L.screen.w}
        height={L.screen.h}
        fill="none"
        stroke={c.ink}
        strokeWidth={3}
        {...draw(screenDrawn)}
      />
      <line
        x1={L.screen.x}
        x2={L.screen.x + L.screen.w}
        y1={L.screen.y + L.screen.bar}
        y2={L.screen.y + L.screen.bar}
        stroke={c.ink}
        strokeWidth={2}
        {...draw(span(share, 0.48, 0.52))}
      />
      <path
        d={`M ${L.screen.x + L.screen.w / 2} ${L.screen.y + L.screen.h} v ${L.stand.neck} m ${-L.stand.half} 0 h ${2 * L.stand.half}`}
        fill="none"
        stroke={c.ink}
        strokeWidth={3}
        {...draw(span(share, 0.5, 0.54))}
      />
      {AFTER.map((name, k) => {
        if (!on(share, 0.18 + k * 0.02)) return null;
        const box = row(k);
        const left = (k === NOTE && noteRoute > 0) || (k === APPOINTMENT && apptRoute > 0);
        return (
          <g key={name}>
            {/* Each channel keeps a box of its own until it lands in the list; a channel that left is a gap. */}
            <rect
              x={box.x}
              y={box.y}
              width={box.w}
              height={box.h}
              fill="none"
              stroke={left ? c.hair : c.ink}
              strokeWidth={2}
              strokeDasharray={left ? '6 6' : undefined}
              opacity={left ? 1 : 1 - span(share, 0.46, 0.52)}
            />
            <text x={box.x + (thin ? 12 : 14)} y={cellText(box)} {...mono} fill={left ? c.mute : c.ink}>
              {name}
            </text>
          </g>
        );
      })}

      {/* The status in the chat window: it is what the concup takes over. The chat itself stays. */}
      {share >= 0.5 && (
        <circle
          cx={statusDot[0]}
          cy={statusDot[1]}
          r={thin ? 8 : 7}
          fill={dot > 0 ? 'none' : c.signal}
          stroke={dot > 0 ? c.hair : 'none'}
          strokeWidth={2}
        />
      )}

      {/* 3. The routes out of the screen, drawn only where the thesis backs them. */}
      <g fill="none" stroke={c.ink} strokeWidth={2}>
        <path d={poly(chatPath)} {...draw(chatRoute)} />
        <path d={poly(apptPath)} {...draw(apptRoute)} />
        <path d={poly(notePath)} {...draw(noteRoute)} />
      </g>
      {dot > 0 && dot < 1 && (() => {
        const [x, y] = along([statusDot, ...chatPath], dot);
        return <circle cx={x} cy={y} r={thin ? 8 : 7} fill={c.signal} />;
      })()}
      {carried > 0 && carried < 1 && (() => {
        const [x, y] = along(apptPath, carried);
        return <rect x={x - 18} y={y - 10} width={36} height={20} fill={c.ink} />;
      })()}

      {/* The concup, its rim lit once the status has arrived: open for a chat. */}
      <g transform={`translate(${cup.x} ${cup.y}) scale(${cup.scale}) translate(${-CUP.centre} ${-CUP.bottom})`}>
        <g fill={c.ground} fillOpacity={cupDrawn} stroke={c.ink} strokeWidth={3 / cup.scale} strokeLinejoin="round">
          <path d={cupBody} {...draw(cupDrawn)} />
          <path d={cupHandle} fill="none" {...draw(cupDrawn)} />
          {grooves.map((d) => (
            <path key={d} d={d} fill="none" stroke={c.hair} strokeWidth={2 / cup.scale} {...draw(cupDrawn)} />
          ))}
          <path d={cupRim} {...draw(cupDrawn)} />
        </g>
        {cupDrawn >= 1 &&
          [0, 1, 2, 3].map((k) => (
            <line
              key={k}
              x1={150 + k * 10}
              x2={150 + k * 10}
              y1={470 - [15, 23, 19, 12][k]}
              y2={470 + [15, 23, 19, 12][k]}
              stroke={c.mute}
              strokeWidth={4}
            />
          ))}
        {lit && (
          <>
            <ellipse cx={CUP.centre} cy={CUP.rim} rx={CUP.rx} ry={CUP.ry} fill="none" stroke={c.signal} strokeWidth={6 / cup.scale} />
            <ellipse
              cx={CUP.centre}
              cy={CUP.rim - 16}
              rx={CUP.rx + 36}
              ry={CUP.ry + 10}
              fill="none"
              stroke={c.signal}
              strokeWidth={2 / cup.scale}
              opacity={0.45}
            />
          </>
        )}
      </g>
      <g opacity={span(share, 0.62, 0.66)}>
        <text x={L.labels.cup[0]} y={L.labels.cup[1]} {...mono} fill={c.ink}>
          CONCUP
        </text>
        <text x={L.labels.cup[0]} y={L.labels.cup[1] + L.leading} {...mono} fill={c.mute}>
          OPEN FOR A CHAT
        </text>
      </g>

      {/* The connote with its blocks in front and the notes area behind. */}
      <g fill={c.ground} fillOpacity={trayDrawn} stroke={c.ink} strokeWidth={2.5} strokeLinejoin="round">
        <path d={`${poly([[t.x, t.y], [t.x + t.w, t.y], at(t, t.w, 0, t.h), at(t, 0, 0, t.h)])} Z`} {...draw(trayDrawn)} />
        <path d={`${poly([[t.x + t.w, t.y], at(t, t.w, 1), at(t, t.w, 1, t.h), at(t, t.w, 0, t.h)])} Z`} {...draw(trayDrawn)} />
        <path d={`${poly([at(t, 0, 0, t.h), at(t, t.w, 0, t.h), at(t, t.w, 1, t.h), at(t, 0, 1, t.h)])} Z`} {...draw(trayDrawn)} />
        <path
          d={`${poly([at(t, 6, channel.from, t.h), at(t, t.w - 6, channel.from, t.h), at(t, t.w - 6, channel.to, t.h), at(t, 6, channel.to, t.h)])} Z`}
          fill="none"
          strokeWidth={2}
          {...draw(trayDrawn)}
        />
        <path
          d={`${poly([at(t, 10, notes.from, t.h), at(t, t.w - 10, notes.from, t.h), at(t, t.w - 10, notes.to, t.h), at(t, 10, notes.to, t.h)])} Z`}
          fill="none"
          stroke={c.hair}
          strokeWidth={2}
          {...draw(trayDrawn)}
        />
      </g>
      {/* Handwriting in the notes area, once the note has arrived. */}
      {[0.62, 0.72, 0.82].map((depth, i) => {
        const [x, y] = at(t, 30, depth, t.h);
        const length = (t.w - 70) * [0.85, 0.7, 0.55][i];
        return <line key={depth} x1={x} y1={y} x2={x + length * clamp(writing * 3 - i)} y2={y} stroke={c.mute} strokeWidth={2} />;
      })}
      {BLOCKS.map((block, k) => {
        if (carried < 1 || !on(share, 0.76 + k * 0.015)) return null;
        const box = blockFront(k);
        const dx = blockDepth * t.dx;
        const dy = blockDepth * t.dy;
        return (
          <g key={block.time}>
            <path
              d={`${poly([
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
            <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={c.ink} />
            <text x={box.x + 7} y={box.y + box.h / 2 + L.size * 0.36} {...mono} letterSpacing={0} xmlSpace="preserve" fill={c.ground}>
              {t.rooms ? `${block.time} ${block.room}` : block.time}
            </text>
          </g>
        );
      })}
      <g opacity={span(share, 0.78, 0.82)}>
        {L.labels.trayLines.map((line, i) => (
          <text key={line} x={L.labels.tray[0]} y={L.labels.tray[1] + i * L.leading} {...mono} fill={i === 0 || (thin && i === 1) ? c.ink : c.mute}>
            {line}
          </text>
        ))}
      </g>

      {/* The condesk: a booth, with a screen of its own for the colleague in the other place. */}
      <g fill="none" stroke={c.ink} strokeWidth={2} strokeLinejoin="round">
        <path d={`${poly([bp(0, 0, 0), bp(b.w, 0, 0), bp(b.w, 1, 0), bp(0, 1, 0)])} Z`} stroke={c.hair} {...draw(boothDrawn)} />
        <path d={`${poly([bp(0, 1, 0), bp(0, 1, b.hgt), bp(b.w, 1, b.hgt), bp(b.w, 1, 0)])}`} {...draw(boothDrawn)} />
        <path d={`${poly([bp(0, 1, b.hgt), bp(0, 0, b.hgt), bp(0, 0, 0), bp(0, 1, 0)])}`} {...draw(boothDrawn)} />
        <path d={`${poly([bp(0, 0, b.hgt), bp(b.w, 0, b.hgt), bp(b.w, 1, b.hgt)])}`} {...draw(boothDrawn)} />
        <path d={`${poly([bp(b.w, 0, 0), bp(b.w, 0, b.hgt)])}`} {...draw(boothDrawn)} />
        <path
          d={`${poly([bp(screenIn.a0, 1, screenIn.z0), bp(screenIn.a1, 1, screenIn.z0), bp(screenIn.a1, 1, screenIn.z1), bp(screenIn.a0, 1, screenIn.z1)])} Z`}
          strokeWidth={2.5}
          {...draw(span(share, 0.84, 0.88))}
        />
        <path
          d={`${poly([bp(b.w * 0.1, 0.35, b.hgt * 0.36), bp(b.w * 0.9, 0.35, b.hgt * 0.36), bp(b.w * 0.9, 0.75, b.hgt * 0.36), bp(b.w * 0.1, 0.75, b.hgt * 0.36)])} Z`}
          fill={c.ground}
          fillOpacity={boothDrawn}
          {...draw(span(share, 0.84, 0.88))}
        />
      </g>
      {share >= 0.88 && (
        <g fill={c.mute}>
          <circle cx={head[0]} cy={head[1]} r={b.hgt * 0.07} />
          <path
            d={`M ${head[0] - b.hgt * 0.15} ${head[1] + b.hgt * 0.24} A ${b.hgt * 0.15} ${b.hgt * 0.12} 0 0 1 ${head[0] + b.hgt * 0.15} ${head[1] + b.hgt * 0.24} Z`}
          />
        </g>
      )}
      <g opacity={span(share, 0.86, 0.9)}>
        {L.labels.boothLines.map((line, i) => (
          <text key={line} x={L.labels.booth[0]} y={L.labels.booth[1] + i * L.leading} {...mono} fill={i === 0 ? c.ink : c.mute}>
            {line}
          </text>
        ))}
      </g>

      {/* 4. What stays on the screen: everything that did not leave. */}
      <g opacity={stays}>
        {L.labels.staysLines.map((line, i) => (
          <text key={line} x={L.labels.stays[0]} y={L.labels.stays[1] + i * L.leading} {...mono} fill={c.ink}>
            {line}
          </text>
        ))}
      </g>
    </svg>
  );
};
