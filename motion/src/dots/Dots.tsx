// Style “Dots”: the same scripts on an LED dot-matrix board. Every letter is a 5×7 bitmap; dots switch
// on in a sweep from the left with a little jitter, numbers tick like a scoreboard, and nothing glows.
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { fonts } from '../style';
import { scripts, type Beat, type Line } from '../kinetic/scripts';

const C = { ground: '#0e0f0e', off: '#1d201d', ink: '#e7e8e3', signal: '#ff6a4d', mute: '#6d716b' };

/** A 5×7 dot font for the characters the scripts use. */
const FONT: Record<string, string[]> = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['###..', '#..#.', '#...#', '#...#', '#...#', '#..#.', '###..'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.####'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  J: ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '#.#.#', '.#.#.'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '3': ['#####', '...#.', '..#..', '...#.', '....#', '#...#', '.###.'],
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'],
  '’': ['..#..', '..#..', '.#...', '.....', '.....', '.....', '.....'],
  '?': ['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..'],
  '…': ['.....', '.....', '.....', '.....', '.....', '.....', '#.#.#'],
  '%': ['##...', '##..#', '...#.', '..#..', '.#...', '#..##', '...##'],
  '/': ['.....', '....#', '...#.', '..#..', '.#...', '#....', '.....'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
};

type Cell = { x: number; y: number; colour: string };

/** Dots lit by one line of text at 1, 2 or 3 board dots per font pixel. */
const rasterise = (text: string, scale: number, x0: number, y0: number, colour: string): Cell[] => {
  const cells: Cell[] = [];
  [...text].forEach((ch, i) => {
    (FONT[ch] ?? FONT[' ']).forEach((row, y) =>
      [...row].forEach((px, x) => {
        if (px !== '#') return;
        for (let dy = 0; dy < scale; dy++)
          for (let dx = 0; dx < scale; dx++) cells.push({ x: x0 + (i * 6 + x) * scale + dx, y: y0 + y * scale + dy, colour });
      }),
    );
  });
  return cells;
};

const widthOf = (text: string, scale: number) => (text.length * 6 - 1) * scale;

/** Split lines that are too long for the board at the smallest scale. */
const wrap = (lines: Line[], capacity: number) =>
  lines.flatMap((line) => {
    if (line.text.length <= capacity) return [line];
    return line.text.split(' ').reduce<Line[]>((out, word) => {
      const last = out[out.length - 1];
      if (last && (last.text + ' ' + word).length <= capacity) last.text += ' ' + word;
      else out.push({ ...line, text: word });
      return out;
    }, []);
  });

/** Same pseudo-random number for the same dot, so the film renders identically every time. */
const jitter = (x: number, y: number, k: number) => {
  const v = Math.sin(x * 12.9898 + y * 78.233 + k * 37.719) * 43758.5453;
  return v - Math.floor(v);
};

type Board = { cols: number; rows: number; margin: number };

/** Biggest scale at which the lines fit the board. */
const fit = (lines: Line[], board: Board, room: number) => {
  for (const scale of [3, 2, 1]) {
    const wide = Math.max(...lines.map((l) => widthOf(l.text, scale)));
    const tall = lines.length * 9 * scale - 2 * scale;
    if (wide <= board.cols - 2 * board.margin && tall <= room) return scale;
  }
  return 1;
};

const block = (lines: Line[], board: Board, scale: number, centreY: number, centred = false): Cell[] => {
  const tall = lines.length * 9 * scale - 2 * scale;
  const top = Math.round(centreY - tall / 2);
  return lines.flatMap((line, i) => {
    const x = centred ? Math.round((board.cols - widthOf(line.text, scale)) / 2) : board.margin;
    return rasterise(line.text, scale, x, top + i * 9 * scale, line.tone === 'signal' ? C.signal : C.ink);
  });
};

/** All dots a beat lights at its local frame f (before the sweep and the exit are applied). */
const cellsFor = (beat: Beat, f: number, board: Board): Cell[] => {
  const capacity = Math.floor((board.cols - 2 * board.margin + 1) / 6);
  const centre = board.rows / 2;
  if (beat.kind === 'stack') {
    const lines = wrap(beat.lines.map((l) => ({ ...l })), capacity);
    return block(lines, board, fit(lines, board, board.rows * 0.7), centre);
  }
  if (beat.kind === 'count') {
    const t = Math.min(1, f / 40);
    const value = beat.from + (beat.to - beat.from) * (1 - (1 - t) ** 3);
    const text = `${value.toFixed(beat.decimals ?? 0)}${beat.suffix ?? ''}`;
    const final = `${beat.to.toFixed(beat.decimals ?? 0)}${beat.suffix ?? ''}`;
    const lines = [{ text: final }];
    const scale = fit(lines, board, board.rows * 0.5);
    return rasterise(text, scale, board.margin, Math.round(centre - (7 * scale) / 2), C.ink);
  }
  if (beat.kind === 'marquee') {
    // A ticker that runs in from the right in single-dot steps and stops at the margin.
    const lines = wrap(beat.text.split('.').map((part, i, all) => ({ text: i < all.length - 1 ? part : '.' + part })), capacity);
    const scale = fit(lines, board, board.rows * 0.5);
    const shift = Math.max(0, board.cols - Math.floor(f * 3));
    return block(lines, board, scale, centre).map((cell) => ({ ...cell, x: cell.x + shift }));
  }
  if (beat.kind === 'ring') {
    const lines = beat.lines;
    return block(lines, board, fit(lines, board, board.rows * 0.3), centre, true);
  }
  // Tokens: bytes appear one at a time, the marked one in red.
  const words: Line[] = [];
  let current = '';
  const owner: number[] = [];
  beat.tokens.forEach((token, i) => {
    const next = current ? current + ' ' + token : token;
    if (next.length > capacity) {
      words.push({ text: current });
      current = token;
    } else current = next;
    owner.push(words.length);
  });
  words.push({ text: current });
  const scale = fit(words, board, board.rows * 0.5);
  const shown = Math.min(beat.tokens.length, Math.floor(f / 4));
  const tall = words.length * 9 * scale - 2 * scale;
  const top = Math.round(centre - tall / 2);
  const cells: Cell[] = [];
  const column: number[] = words.map(() => 0);
  beat.tokens.forEach((token, i) => {
    const line = owner[i];
    const x = board.margin + column[line] * 6 * scale;
    column[line] += token.length + 1;
    if (i >= shown) return;
    const colour = i === beat.mark && f > beat.tokens.length * 4 + 6 ? C.signal : C.ink;
    cells.push(...rasterise(token, scale, x, top + line * 9 * scale, colour));
  });
  return cells;
};

export const Dots = ({ script }: { script: string }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const s = scripts[script];
  const pitch = width / 80;
  const board: Board = { cols: 80, rows: Math.floor(height / pitch), margin: 4 };
  const r = pitch * 0.36;
  const label = Math.round(Math.min(width, height) * 0.028);
  const mono = { fontFamily: fonts.mono, fill: C.mute, letterSpacing: label * 0.07 };

  const lit: Cell[] = [];
  const ringDots: { x: number; y: number }[] = [];
  let caption: string | undefined;
  s.beats.forEach((beat, i) => {
    const next = s.beats[i + 1]?.at ?? Infinity;
    if (f < beat.at || f > next) return;
    const local = f - beat.at;
    caption = local > 10 ? beat.caption : undefined;
    for (const cell of cellsFor(beat, local, board)) {
      // On: a sweep from the left with jitter. Off: at random in the last eight frames.
      const on = cell.x * 0.22 + jitter(cell.x, cell.y, i) * 4;
      const off = Number.isFinite(next) ? next - beat.at - 8 + jitter(cell.y, cell.x, i) * 8 : Infinity;
      if (local >= on && local < off) lit.push(cell);
    }
    if (beat.kind === 'ring') {
      const count = Math.min(72, Math.floor(local * 1.2));
      for (let k = 0; k < count; k++) {
        const a = (k / 72) * Math.PI * 2 - Math.PI / 2;
        ringDots.push({ x: width / 2 + Math.cos(a) * width * 0.4, y: height / 2 + Math.sin(a) * width * 0.4 });
      }
    }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.ground }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <pattern id="board" width={pitch} height={pitch} patternUnits="userSpaceOnUse">
            <circle cx={pitch / 2} cy={pitch / 2} r={r} fill={C.off} />
          </pattern>
        </defs>
        <rect x={0} y={pitch * 9} width={width} height={height - pitch * 18} fill="url(#board)" />
        {lit
          .filter((cell) => cell.x >= 0 && cell.x < board.cols)
          .map((cell, k) => (
            <circle key={k} cx={(cell.x + 0.5) * pitch} cy={(cell.y + 0.5) * pitch} r={r} fill={cell.colour} />
          ))}
        {ringDots.map((dot, k) => (
          <circle key={`r${k}`} cx={dot.x} cy={dot.y} r={r * 1.1} fill={C.signal} />
        ))}
        <text x={pitch * 4} y={pitch * 6} fontSize={label} style={mono}>
          {s.label.toUpperCase()}
        </text>
        <text x={width - pitch * 4} y={pitch * 6} fontSize={label} textAnchor="end" style={mono}>
          {s.years.toUpperCase()}
        </text>
        {caption && (
          <text x={pitch * 4} y={height - pitch * 4} fontSize={label} style={mono}>
            {caption}
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
};
