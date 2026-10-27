// Stayin' Alive as the opening of its case page (version J): the film's three acts across the whole width, with
// no ground of its own. The page sets the title and the summary as real text in the same 1600 × 900 box, top
// left; the column under the summary says who and what each act is about, the exhibition takes the right.
// Act 1: about 80 students stand as a loose crowd under the summary and gather to the right into the outlines
// of three kinds of stations. Act 2: the outlines draw and take the crowd up, one iPad guide is wired to all
// three and shows each station in turn, in red while it does. Act 3: the exhibition steps back, and the three
// awards, for the project and its team, are set in the title's type under the summary, where the crowd stood.
// As in the film, the dots, the layout and the screen contents are an illustration; stations, guide and awards
// are the real ones, and the words are the film's.
import { useCurrentFrame } from 'remotion';
import type { Palette } from '../style';
import { fonts, progress, stepped } from '../style';
import { seeded } from '../random';
import { AWARDS, Content, SHOWS, STATIONS } from '../stayin/Stayin';

/** The three stations in a row on the right; the guide hangs under the middle one. */
const BOX = { y: 226, w: 240, h: 180 };
const ROW_X = [790, 1075, 1360];
const BOX_LENGTH = 2 * (BOX.w + BOX.h);
const centre = (i: number) => ROW_X[i] + BOX.w / 2;
const BUS = 468;
const IPAD = { x: 985, y: 508, w: 420, h: 280, r: 22, inset: 20 };
const IPAD_LENGTH = 2 * (IPAD.w + IPAD.h);
const SCREEN = { x: IPAD.x + IPAD.inset, y: IPAD.y + IPAD.inset, w: IPAD.w - 2 * IPAD.inset, h: IPAD.h - 2 * IPAD.inset };
const MID = centre(1);

/** The column under the summary: one label per act, the crowd in act 1, the awards in act 3. */
const LABEL_Y = 470;
const CROWD = { x: 14, y: 530, cols: 10, rows: 8, dx: 66, dy: 34 };
const AWARD = { size: 56, y: 544, step: 108, rule: 24 };
/** Act 2's column: the page's own sentences about the guide. */
const GUIDE_LINES = ['EVERY VISITOR GOT AN IPAD AT THE ENTRANCE.', 'IT CARRIED THE WHOLE EXHIBITION,', 'APART FROM THE TEXTS ON THE WALLS.'];

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

/** 80 students as a loose crowd under the summary; the left of the crowd goes to the first station, and so on.
 * Same recipe as the film's crowd, laid out for the wide stage. */
const DOTS: Dot[] = (() => {
  const random = seeded(80);
  const crowd = Array.from({ length: CROWD.cols * CROWD.rows }, (_, i): [number, number] => [
    CROWD.x + (i % CROWD.cols) * CROWD.dx + (random() - 0.5) * 26,
    CROWD.y + Math.floor(i / CROWD.cols) * CROWD.dy + (random() - 0.5) * 14,
  ]);
  const order = crowd.map((_, i) => i).sort((a, b) => crowd[a][0] - crowd[b][0]);
  const dots: Dot[] = [];
  [27, 27, 26].forEach((count, station) => {
    const group = order.splice(0, count);
    const x = ROW_X[station];
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

const drawn = (frame: number, start: number, length: number, span = 12) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress(frame, start, start + span)),
});

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const StayinStage = ({ palette: c }: { palette: Palette }) => {
  const f = useCurrentFrame();
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };

  const shown = [...SHOWS].reverse().find((show) => f >= show.from);
  const kind = shown ? shown.station : -1;
  // The red belongs to the guide in act 2; in act 3 it moves on to the first award.
  const active = f < 138 ? kind : -1;
  // Each new station comes onto the screen top to bottom, in hard steps.
  const reveal = shown ? Math.max(1 / 6, stepped(progress(f, shown.from, shown.from + 6), 6)) : 0;
  // Act 3 lets the exhibition step back: it is what the awards were given for, no longer the subject.
  const back = 1 - 0.55 * progress(f, 136, 150);

  return (
    <svg viewBox="0 0 1600 900" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <defs>
        <clipPath id="stayin-stage-screen">
          <rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.w} height={SCREEN.h * reveal} />
        </clipPath>
      </defs>

      {/* Act 1: about 80 students under the summary, gathering into three kinds of stations on the right. As
          each outline draws in act 2, it takes up the dots it passes, so the crowd becomes the stations. */}
      {DOTS.map((dot, i) => {
        if (!stepped(progress(f, dot.at, dot.at + 1), 1)) return null;
        const outline = progress(f, 64 + dot.station * 3, 74 + dot.station * 3) * BOX_LENGTH;
        if (outline > dot.along) return null;
        const move = progress(f, 30 + dot.delay, 46 + dot.delay);
        const x = lerp(dot.from[0], dot.to[0], move);
        const y = lerp(dot.from[1], dot.to[1], move);
        return <circle key={i} cx={x} cy={y} r={6} fill={c.ink} />;
      })}
      <text x={0} y={LABEL_Y} fontSize={19} opacity={progress(f, 14, 22) * (1 - progress(f, 60, 66))} style={mono}>
        ABOUT 80 STUDENTS
      </text>

      <g opacity={back}>
        {STATIONS.map((station, i) => (
          <g key={i}>
            <rect
              x={ROW_X[i]}
              y={BOX.y}
              width={BOX.w}
              height={BOX.h}
              fill="none"
              stroke={c.ink}
              strokeWidth={3}
              style={drawn(f, 64 + i * 3, BOX_LENGTH, 10)}
            />
            {station.name.map((line, k) => (
              <text
                key={line}
                x={ROW_X[i] + 18}
                y={BOX.y + BOX.h - 22 - (station.name.length - 1 - k) * 24}
                fontSize={19}
                opacity={stepped(progress(f, 50 + i * 2, 52 + i * 2), 1)}
                style={{ ...mono, fill: c.ink }}
              >
                {line}
              </text>
            ))}
            <g opacity={stepped(progress(f, 76 + i * 2, 78 + i * 2), 1)}>
              <Content kind={i} x={centre(i)} y={BOX.y + 62} scale={0.5} c={c} />
            </g>
          </g>
        ))}

        {/* Act 2: one guide for all of them. */}
        <rect
          x={IPAD.x}
          y={IPAD.y}
          width={IPAD.w}
          height={IPAD.h}
          rx={IPAD.r}
          fill="none"
          stroke={c.ink}
          strokeWidth={3}
          style={drawn(f, 70, IPAD_LENGTH, 14)}
        />
        <rect
          x={SCREEN.x}
          y={SCREEN.y}
          width={SCREEN.w}
          height={SCREEN.h}
          fill="none"
          stroke={c.hair}
          strokeWidth={2}
          opacity={stepped(progress(f, 82, 84), 1)}
        />
        <path d={`M ${MID} ${IPAD.y} V ${BUS}`} fill="none" stroke={c.ink} strokeWidth={2} style={drawn(f, 78, IPAD.y - BUS, 4)} />
        <path
          d={`M ${centre(0)} ${BUS} H ${centre(2)}`}
          fill="none"
          stroke={c.ink}
          strokeWidth={2}
          style={drawn(f, 82, centre(2) - centre(0), 8)}
        />
        {ROW_X.map((x, i) => (
          <path
            key={x}
            d={`M ${centre(i)} ${BUS} V ${BOX.y + BOX.h}`}
            fill="none"
            stroke={c.ink}
            strokeWidth={2}
            style={drawn(f, 88 + i, BUS - BOX.y - BOX.h, 4)}
          />
        ))}

        {kind >= 0 && (
          <g clipPath="url(#stayin-stage-screen)">
            <Content kind={kind} x={MID} y={SCREEN.y + SCREEN.h / 2} scale={1.1} c={c} />
          </g>
        )}
        {active >= 0 && (
          <g>
            <rect x={ROW_X[active]} y={BOX.y} width={BOX.w} height={BOX.h} fill="none" stroke={c.signal} strokeWidth={5} />
            <path
              d={`M ${centre(active)} ${BOX.y + BOX.h} V ${BUS} H ${MID} V ${IPAD.y}`}
              fill="none"
              stroke={c.signal}
              strokeWidth={4}
            />
          </g>
        )}
      </g>

      <text x={0} y={LABEL_Y} fontSize={19} opacity={progress(f, 86, 94) * (1 - progress(f, 132, 138))} style={mono}>
        THE IPAD VISITOR GUIDE · LED THE UX TEAM
      </text>
      {/* What the guide meant for a visitor, in the case text's words, while it shows the stations. */}
      <g opacity={1 - progress(f, 132, 138)}>
        {GUIDE_LINES.map((line, i) => (
          <text
            key={line}
            x={0}
            y={LABEL_Y + 58 + i * 30}
            fontSize={19}
            opacity={progress(f, 96 + i * 8, 102 + i * 8)}
            style={{ ...mono, fill: c.ink }}
          >
            {line}
          </text>
        ))}
      </g>

      {/* Act 3: the awards, for the project and its team, under the summary where the team stood in act 1. */}
      <text x={0} y={LABEL_Y} fontSize={19} opacity={progress(f, 140, 148)} style={mono}>
        AWARDS FOR THE PROJECT
      </text>
      {AWARDS.map((award, i) => {
        if (f < 140) return null;
        const base = AWARD.y + i * AWARD.step;
        const enter = progress(f, 142 + i * 9, 156 + i * 9);
        return (
          <g key={award.name}>
            <defs>
              <clipPath id={`stayin-stage-award-${i}`}>
                <rect x={-20} y={base - AWARD.size * 0.82} width={720} height={AWARD.size * 0.98} />
              </clipPath>
            </defs>
            <g clipPath={`url(#stayin-stage-award-${i})`}>
              <text
                x={-3}
                y={base + (1 - enter) * AWARD.size}
                fontSize={AWARD.size}
                style={{
                  fontFamily: fonts.sans,
                  fontWeight: 800,
                  letterSpacing: -AWARD.size * 0.04,
                  fill: i === 0 ? c.signal : c.ink,
                }}
              >
                {award.name}
              </text>
            </g>
            <text x={0} y={base + 30} fontSize={19} opacity={progress(f, 150 + i * 9, 156 + i * 9)} style={mono}>
              {award.detail}
            </text>
            {i < AWARDS.length - 1 && (
              <line
                x1={0}
                x2={600}
                y1={base + 30 + AWARD.rule}
                y2={base + 30 + AWARD.rule}
                stroke={c.hair}
                strokeWidth={2}
                style={drawn(f, 152 + i * 9, 600, 10)}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};
