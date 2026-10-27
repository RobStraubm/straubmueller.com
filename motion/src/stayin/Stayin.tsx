// Stayin' Alive in seven seconds, on one stage that stays in view: about 80 students gather into an exhibition
// of three kinds of stations, one iPad guide joins them and leads visitors through all of them (the UX team
// Robert led), and the exhibition moves up to make room for the project's three awards.
// The dots, the layout and the screen contents are an illustration; the stations and awards are the real ones.
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ActWord, Labels, type Act } from '../parts';
import { seeded } from '../random';
import { fonts, palettes, progress, SIZE, stepped, type Theme, type Palette, POSTER_VIEW } from '../style';

export const STAYIN_FRAMES = 210;

export const STAYIN_ACTS: Act[] = [
  { word: 'STATIONS', from: 0, to: 64 },
  { word: 'GUIDE', from: 64, to: 136 },
  { word: 'AWARDS', from: 136, to: Infinity },
];

/** The stations as the students form them; in act 3 they get lower to make room for the awards. */
const BOX = { y: 296, w: 200, h: 150 };
export const STATIONS = [
  { name: ['AR STATION'], x: 64 },
  { name: ['HISTORICAL', 'DOCUMENTS'], x: 300 },
  { name: ['INFOGRAPHICS'], x: 536 },
];
const BOX_LENGTH = 2 * (BOX.w + BOX.h);
const centre = (i: number) => STATIONS[i].x + BOX.w / 2;

/** Act 2 layout, and the smaller one act 3 moves to. */
const LAYOUT = {
  guide: { boxY: 296, boxH: 150, bus: 500, ipad: { x: 230, y: 540, w: 340, h: 230, r: 20 }, inset: 18, content: 1 },
  awards: { boxY: 286, boxH: 112, bus: 418, ipad: { x: 300, y: 438, w: 200, h: 136, r: 12 }, inset: 11, content: 0.6 },
};
const IPAD_LENGTH = 2 * (340 + 230);

/** Which station the guide shows, from frame to frame. */
export const SHOWS = [
  { station: 0, from: 92 },
  { station: 1, from: 106 },
  { station: 2, from: 120 },
];

export const AWARDS = [
  { name: 'RED DOT', detail: 'JUNIOR AWARD 2022 · EXHIBITION DESIGN' },
  { name: 'ADC', detail: 'TALENT AWARD 2022 · GOLD · EXHIBITION' },
  { name: 'COMMAWARDS', detail: '2021 · GOLD · SPACE' },
];
const AWARD_SIZE = 56;
const AWARD_Y = 648;
const AWARD_STEP = 88;

/** A point a given distance along a station's outline, clockwise from its top left corner. */
const alongBox = (x: number, distance: number): [number, number] => {
  const { y, w, h } = BOX;
  const d = ((distance % BOX_LENGTH) + BOX_LENGTH) % BOX_LENGTH;
  if (d < w) return [x + d, y];
  if (d < w + h) return [x + w, y + d - w];
  if (d < 2 * w + h) return [x + w - (d - w - h), y + h];
  return [x, y + h - (d - 2 * w - h)];
};

/** `along` is where on its station's outline a dot lands, so the outline can take the dots up as it draws. */
type Dot = { from: [number, number]; to: [number, number]; station: number; along: number; at: number; delay: number };

/** 80 students as a loose crowd, each of whom ends up on the outline of one station. */
const DOTS: Dot[] = (() => {
  const random = seeded(80);
  const crowd = Array.from({ length: 80 }, (_, i): [number, number] => [
    96 + (i % 10) * 68 + (random() - 0.5) * 30,
    316 + Math.floor(i / 10) * 62 + (random() - 0.5) * 30,
  ]);
  const order = crowd.map((_, i) => i).sort((a, b) => crowd[a][0] - crowd[b][0]);
  const dots: Dot[] = [];
  [27, 27, 26].forEach((count, station) => {
    const group = order.splice(0, count);
    const x = STATIONS[station].x;
    const cx = x + BOX.w / 2;
    const cy = BOX.y + BOX.h / 2;
    const angle = ([px, py]: [number, number]) => Math.atan2(py - cy, px - cx);
    const targets = Array.from({ length: count }, (_, k) => {
      const along = (k * BOX_LENGTH) / count;
      return { point: alongBox(x, along), along };
    }).sort((a, b) => angle(a.point) - angle(b.point));
    group
      .sort((a, b) => angle(crowd[a]) - angle(crowd[b]))
      .forEach((index, k) =>
        dots.push({
          from: crowd[index],
          to: targets[k].point,
          station,
          along: targets[k].along,
          at: 2 + Math.floor(random() * 22),
          delay: random() * 8,
        }),
      );
  });
  return dots;
})();

/** What a station holds, drawn small in its box and large on the guide's screen. */
export const Content = ({ kind, x, y, scale, c }: { kind: number; x: number; y: number; scale: number; c: Palette }) => {
  const s = (v: number) => v * scale;
  const line = { fill: 'none', stroke: c.ink, strokeWidth: 3, strokeLinejoin: 'round' as const };
  if (kind === 0) {
    // A wireframe cube with the corner marks of an AR view.
    const top = [[0, -56], [48, -28], [0, 0], [-48, -28]].map(([a, b]) => `${x + s(a)},${y + s(b)}`).join(' ');
    return (
      <g>
        <polygon points={top} {...line} />
        <path d={`M ${x - s(48)} ${y - s(28)} V ${y + s(28)} L ${x} ${y + s(56)} L ${x + s(48)} ${y + s(28)} V ${y - s(28)} M ${x} ${y} V ${y + s(56)}`} {...line} />
        {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([dx, dy]) => (
          <path
            key={`${dx}${dy}`}
            d={`M ${x + dx * s(96)} ${y + dy * s(58)} h ${-dx * s(20)} M ${x + dx * s(96)} ${y + dy * s(58)} v ${-dy * s(20)}`}
            stroke={c.mute}
            strokeWidth={3}
          />
        ))}
      </g>
    );
  }
  if (kind === 1) {
    // Two pages of a historical document, lines of text as bars.
    return (
      <g>
        <rect x={x - s(56)} y={y - s(70)} width={s(96)} height={s(124)} fill={c.ground} stroke={c.mute} strokeWidth={2} />
        <rect x={x - s(40)} y={y - s(58)} width={s(96)} height={s(124)} fill={c.ground} stroke={c.ink} strokeWidth={3} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={x - s(28)} y={y - s(42) + s(i * 17)} width={s([72, 60, 68, 48, 70, 40][i])} height={s(7)} fill={c.mute} />
        ))}
      </g>
    );
  }
  // An infographic: bars without numbers.
  return (
    <g>
      <line x1={x - s(100)} x2={x + s(100)} y1={y + s(56)} y2={y + s(56)} stroke={c.mute} strokeWidth={2} />
      {[60, 96, 74, 120, 44].map((height, i) => (
        <rect key={i} x={x - s(96) + s(i * 40)} y={y + s(56) - s(height)} width={s(28)} height={s(height)} fill={c.ink} />
      ))}
    </g>
  );
};

const drawn = (frame: number, start: number, length: number, span = 12) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress(frame, start, start + span)),
});

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Stayin = ({ theme }: { theme: Theme }) => {
  const f = useCurrentFrame();
  const c = palettes[theme];
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };

  // Act 3 does not clear the stage: the exhibition and its guide move up and get smaller.
  const t = progress(f, 136, 158);
  const { guide: g, awards: a } = LAYOUT;
  const boxY = lerp(g.boxY, a.boxY, t);
  const boxH = lerp(g.boxH, a.boxH, t);
  const bus = lerp(g.bus, a.bus, t);
  const ipad = {
    x: lerp(g.ipad.x, a.ipad.x, t),
    y: lerp(g.ipad.y, a.ipad.y, t),
    w: lerp(g.ipad.w, a.ipad.w, t),
    h: lerp(g.ipad.h, a.ipad.h, t),
    r: lerp(g.ipad.r, a.ipad.r, t),
  };
  const inset = lerp(g.inset, a.inset, t);
  const screen = { x: ipad.x + inset, y: ipad.y + inset, w: ipad.w - 2 * inset, h: ipad.h - 2 * inset };
  const contentScale = lerp(g.content, a.content, t);

  const shown = [...SHOWS].reverse().find((show) => f >= show.from);
  const kind = shown ? shown.station : -1;
  // The red belongs to the guide in act 2; in act 3 it moves on to the first award.
  const active = f < 138 ? kind : -1;
  // Each new station comes onto the screen top to bottom, in hard steps.
  const reveal = shown ? Math.max(1 / 6, stepped(progress(f, shown.from, shown.from + 6), 6)) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: c.ground }}>
      <svg width={SIZE.width} height={SIZE.height} viewBox={POSTER_VIEW}>
        <defs>
          <clipPath id="guide-screen">
            <rect x={screen.x} y={screen.y} width={screen.w} height={screen.h * reveal} />
          </clipPath>
        </defs>

        <Labels frame={f} project="Stayin’ Alive" acts={STAYIN_ACTS} palette={c} />
        <ActWord frame={f} acts={STAYIN_ACTS} palette={c} />

        {/* Act 1: about 80 students, gathering into three kinds of stations. As each outline draws in act 2,
            it takes up the dots it passes, so the crowd becomes the stations. */}
        {DOTS.map((dot, i) => {
          if (!stepped(progress(f, dot.at, dot.at + 1), 1)) return null;
          const outline = progress(f, 64 + dot.station * 3, 74 + dot.station * 3) * BOX_LENGTH;
          if (outline > dot.along) return null;
          const move = progress(f, 30 + dot.delay, 46 + dot.delay);
          const x = dot.from[0] + (dot.to[0] - dot.from[0]) * move;
          const y = dot.from[1] + (dot.to[1] - dot.from[1]) * move;
          return <circle key={i} cx={x} cy={y} r={6} fill={c.ink} />;
        })}
        <text x={64} y={860} fontSize={20} opacity={progress(f, 18, 26) * (1 - progress(f, 62, 68))} style={mono}>
          ABOUT 80 STUDENTS
        </text>

        {STATIONS.map((station, i) => (
          <g key={station.x}>
            <rect
              x={station.x}
              y={boxY}
              width={BOX.w}
              height={boxH}
              fill="none"
              stroke={c.ink}
              strokeWidth={3}
              style={drawn(f, 64 + i * 3, BOX_LENGTH, 10)}
            />
            {station.name.map((line, k) => (
              <text
                key={line}
                x={station.x + 14}
                y={boxY + boxH - 18 - (station.name.length - 1 - k) * 22}
                fontSize={18}
                opacity={stepped(progress(f, 50 + i * 2, 52 + i * 2), 1)}
                style={{ ...mono, fill: c.ink }}
              >
                {line}
              </text>
            ))}
            <g opacity={stepped(progress(f, 76 + i * 2, 78 + i * 2), 1)}>
              <Content kind={i} x={centre(i)} y={boxY + lerp(52, 30, t)} scale={lerp(0.42, 0.26, t)} c={c} />
            </g>
          </g>
        ))}

        {/* Act 2: one guide for all of them. */}
        <rect
          x={ipad.x}
          y={ipad.y}
          width={ipad.w}
          height={ipad.h}
          rx={ipad.r}
          fill="none"
          stroke={c.ink}
          strokeWidth={3}
          style={drawn(f, 70, IPAD_LENGTH, 14)}
        />
        <rect
          x={screen.x}
          y={screen.y}
          width={screen.w}
          height={screen.h}
          fill="none"
          stroke={c.hair}
          strokeWidth={2}
          opacity={stepped(progress(f, 82, 84), 1)}
        />
        <path d={`M 400 ${ipad.y} V ${bus}`} fill="none" stroke={c.ink} strokeWidth={2} style={drawn(f, 78, 40, 4)} />
        <path d={`M ${centre(0)} ${bus} H ${centre(2)}`} fill="none" stroke={c.ink} strokeWidth={2} style={drawn(f, 82, 472, 8)} />
        {STATIONS.map((station, i) => (
          <path
            key={station.x}
            d={`M ${centre(i)} ${bus} V ${boxY + boxH}`}
            fill="none"
            stroke={c.ink}
            strokeWidth={2}
            style={drawn(f, 88 + i, 54, 4)}
          />
        ))}

        {kind >= 0 && (
          <g clipPath="url(#guide-screen)">
            <Content kind={kind} x={400} y={screen.y + screen.h / 2} scale={contentScale} c={c} />
          </g>
        )}
        {active >= 0 && (
          <g>
            <rect x={STATIONS[active].x} y={boxY} width={BOX.w} height={boxH} fill="none" stroke={c.signal} strokeWidth={5} />
            <path
              d={`M ${centre(active)} ${boxY + boxH} V ${bus} H 400 V ${ipad.y}`}
              fill="none"
              stroke={c.signal}
              strokeWidth={4}
            />
          </g>
        )}

        <text x={64} y={860} fontSize={19} opacity={progress(f, 86, 94) * (1 - progress(f, 134, 140))} style={mono}>
          THE IPAD VISITOR GUIDE · CO-LED THE UX TEAM
        </text>

        {/* Act 3: the awards, for the project and its team, under the exhibition they were given for. */}
        {AWARDS.map((award, i) => {
          if (f < 140) return null;
          const base = AWARD_Y + i * AWARD_STEP;
          const enter = progress(f, 142 + i * 9, 156 + i * 9);
          return (
            <g key={award.name}>
              <defs>
                <clipPath id={`award-mask-${i}`}>
                  <rect x={0} y={base - AWARD_SIZE * 0.82} width={800} height={AWARD_SIZE * 0.98} />
                </clipPath>
              </defs>
              <g clipPath={`url(#award-mask-${i})`}>
                <text
                  x={60}
                  y={base + (1 - enter) * AWARD_SIZE}
                  fontSize={AWARD_SIZE}
                  style={{
                    fontFamily: fonts.sans,
                    fontWeight: 800,
                    letterSpacing: -AWARD_SIZE * 0.04,
                    fill: i === 0 ? c.signal : c.ink,
                  }}
                >
                  {award.name}
                </text>
              </g>
              <text x={64} y={base + 30} fontSize={19} opacity={progress(f, 150 + i * 9, 156 + i * 9)} style={mono}>
                {award.detail}
              </text>
              {i < AWARDS.length - 1 && (
                <line
                  x1={64}
                  x2={736}
                  y1={base + 50}
                  y2={base + 50}
                  stroke={c.hair}
                  strokeWidth={2}
                  style={drawn(f, 152 + i * 9, 672, 10)}
                />
              )}
            </g>
          );
        })}
        <text x={64} y={936} fontSize={20} opacity={progress(f, 172, 180)} style={mono}>
          AWARDS FOR THE PROJECT
        </text>
      </svg>
    </AbsoluteFill>
  );
};
