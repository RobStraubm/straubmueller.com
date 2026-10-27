// Style “Bauhaus” (version G): the same scripts as the kinetic films, set as geometric posters.
// One shape per beat in red, blue or yellow on cream; shapes and words move like parts of a machine,
// sliding in and out on straight paths, never bouncing.
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fonts } from '../style';
import { scripts, type Beat, type Line } from '../kinetic/scripts';

const C = { ground: '#f2eee3', ink: '#121413', red: '#e5361b', blue: '#2340a8', yellow: '#f2b705', mute: '#5d615c' };

const machine = Easing.bezier(0.7, 0, 0.3, 1);
const move = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: machine });

const toneOf = (line: Line) => (line.tone === 'signal' ? C.red : line.tone === 'mute' ? C.mute : C.ink);

type Box = { width: number; height: number; margin: number };

/** The shape that carries a stack beat, and the part of the poster left free for the words. */
const SHAPES = ['circle', 'band', 'triangle', 'half'] as const;

const Shape = ({ kind, t, box }: { kind: (typeof SHAPES)[number]; t: number; box: Box }) => {
  const { width: w, height: h } = box;
  if (kind === 'circle') return <circle cx={w * 0.74} cy={h * 0.3} r={w * 0.38 * t} fill={C.red} />;
  if (kind === 'band') return <rect x={-w + w * t} y={h * 0.6} width={w} height={h * 0.2} fill={C.blue} />;
  if (kind === 'triangle')
    return (
      <polygon
        points={`${w},${h * 0.48} ${w},${h} ${w * 0.3},${h}`}
        fill={C.yellow}
        transform={`rotate(${(1 - t) * 90} ${w} ${h})`}
      />
    );
  return (
    <path
      d={`M 0 ${h * 0.1} A ${w * 0.34} ${w * 0.34} 0 0 1 0 ${h * 0.1 + w * 0.68} Z`}
      fill={C.ink}
      transform={`translate(${-w * 0.34 * (1 - t)} 0)`}
    />
  );
};

const Stack = ({ beat, index, f, box }: { beat: Extract<Beat, { kind: 'stack' }>; index: number; f: number; box: Box }) => {
  const kind = SHAPES[index % SHAPES.length];
  const usable = box.width - 2 * box.margin;
  const longest = Math.max(...beat.lines.map((line) => line.text.length));
  const size = Math.min(box.height * 0.16, usable / (0.68 * longest));
  const lead = size * 0.92;
  const block = lead * beat.lines.length;
  // Words stay clear of the shape: below the shapes that sit high, above the ones that sit low.
  const low = kind === 'circle' || kind === 'half';
  const top = low ? box.height * 0.9 - block : box.height * 0.14;
  return (
    <g>
      <Shape kind={kind} t={move(f, 0, 18)} box={box} />
      {beat.lines.map((line, i) => {
        const t = move(f, 6 + i * 5, 24 + i * 5);
        const from = i % 2 === 0 ? -box.width : box.width;
        return (
          <text
            key={i}
            x={box.margin + from * (1 - t)}
            y={top + lead * (i + 1) - size * 0.12}
            fontSize={size}
            style={{ fontFamily: fonts.sans, fontWeight: 800, letterSpacing: -size * 0.04, fill: toneOf(line) }}
          >
            {line.text}
          </text>
        );
      })}
    </g>
  );
};

const Count = ({ beat, f, box }: { beat: Extract<Beat, { kind: 'count' }>; f: number; box: Box }) => {
  const r = box.width * 0.4;
  const value = beat.from + (beat.to - beat.from) * move(f, 8, 48);
  const finalText = `${beat.to.toFixed(beat.decimals ?? 0)}${beat.suffix ?? ''}`;
  const size = Math.min(r * 0.9, (r * 1.7) / (0.66 * finalText.length));
  return (
    <g>
      <circle cx={box.width / 2} cy={box.height * 0.48} r={r * move(f, 0, 16)} fill={C.yellow} />
      <text
        x={box.width / 2}
        y={box.height * 0.48 + size * 0.35}
        textAnchor="middle"
        fontSize={size}
        opacity={move(f, 8, 14)}
        style={{ fontFamily: fonts.sans, fontWeight: 800, letterSpacing: -size * 0.04, fontVariantNumeric: 'tabular-nums', fill: C.ink }}
      >
        {`${value.toFixed(beat.decimals ?? 0)}${beat.suffix ?? ''}`}
      </text>
    </g>
  );
};

const Marquee = ({ beat, f, box }: { beat: Extract<Beat, { kind: 'marquee' }>; f: number; box: Box }) => {
  const size = box.height * 0.13;
  const span = beat.text.length * size * 0.66 + size;
  const x = -((f * box.width) / 80) % span;
  const band = move(f, 0, 16);
  return (
    <g transform={`rotate(-14 ${box.width / 2} ${box.height / 2})`}>
      <rect x={-box.width} y={box.height / 2 - size * 0.9} width={box.width * 3 * band} height={size * 1.6} fill={C.blue} />
      <g style={{ fontFamily: fonts.sans, fontWeight: 800, letterSpacing: -size * 0.04, fill: C.ground }} opacity={move(f, 10, 16)}>
        {[0, 1, 2, 3].map((k) => (
          <text key={k} x={x + k * span - box.width * 0.5} y={box.height / 2 + size * 0.35} fontSize={size}>
            {beat.text}
          </text>
        ))}
      </g>
    </g>
  );
};

const Ring = ({ beat, f, box, id }: { beat: Extract<Beat, { kind: 'ring' }>; f: number; box: Box; id: string }) => {
  const r = box.width * 0.34;
  const cx = box.width / 2;
  const cy = box.height * 0.48;
  const ringSize = r * 0.12;
  const circle = 2 * Math.PI * (r + ringSize * 0.5);
  const turns = Math.max(1, Math.floor(circle / (beat.ring.length * ringSize * 0.66)));
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * move(f, 0, 16)} fill={C.red} />
      <path id={`${id}-path`} d={`M ${cx - r - ringSize * 0.5} ${cy} a ${r + ringSize * 0.5} ${r + ringSize * 0.5} 0 1 1 ${2 * r + ringSize} 0 a ${r + ringSize * 0.5} ${r + ringSize * 0.5} 0 1 1 ${-2 * r - ringSize} 0`} fill="none" />
      <g transform={`rotate(${-f * 0.8} ${cx} ${cy})`} opacity={move(f, 10, 18)}>
        <text fontSize={ringSize} style={{ fontFamily: fonts.mono, letterSpacing: ringSize * 0.1, fill: C.ink }}>
          <textPath href={`#${id}-path`} textLength={circle - ringSize * 0.5} lengthAdjust="spacing">
            {beat.ring.repeat(turns)}
          </textPath>
        </text>
      </g>
      {beat.lines.map((line, i) => {
        const size = r * 0.52;
        const t = move(f, 12 + i * 5, 28 + i * 5);
        return (
          <text
            key={i}
            x={cx + (i % 2 === 0 ? -1 : 1) * box.width * (1 - t)}
            y={cy - (beat.lines.length * size * 0.9) / 2 + size * 0.9 * (i + 1) - size * 0.14}
            textAnchor="middle"
            fontSize={size}
            style={{ fontFamily: fonts.sans, fontWeight: 800, letterSpacing: -size * 0.04, fill: C.ground }}
          >
            {line.text}
          </text>
        );
      })}
    </g>
  );
};

const Tokens = ({ beat, f, box }: { beat: Extract<Beat, { kind: 'tokens' }>; f: number; box: Box }) => {
  const usable = box.width - 2 * box.margin;
  const cell = usable / beat.tokens.length;
  const colours = [C.ink, C.yellow, C.blue];
  return (
    <g>
      {beat.tokens.map((token, i) => {
        const t = move(f, i * 4, i * 4 + 14);
        const marked = i === beat.mark;
        const fill = marked ? C.red : colours[i % colours.length];
        const y = box.height * 0.42 - (1 - t) * box.height * 0.5;
        return (
          <g key={i}>
            <rect x={box.margin + i * cell} y={y} width={cell} height={cell} fill={fill} />
            <text
              x={box.margin + i * cell + cell / 2}
              y={y + cell * 0.62}
              textAnchor="middle"
              fontSize={cell * 0.42}
              style={{ fontFamily: fonts.mono, fill: fill === C.yellow ? C.ink : C.ground }}
            >
              {token}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export const Bauhaus = ({ script }: { script: string }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const s = scripts[script];
  const box: Box = { width, height, margin: Math.round(width * 0.08) };
  const label = Math.round(Math.min(width, height) * 0.028);
  const mono = { fontFamily: fonts.mono, fill: C.ink, letterSpacing: label * 0.07 };
  let stacks = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.ground }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {s.beats.map((beat, i) => {
          const next = s.beats[i + 1]?.at ?? Infinity;
          const stackIndex = beat.kind === 'stack' ? stacks++ : 0;
          if (f < beat.at || f > next) return null;
          const local = f - beat.at;
          // Each beat leaves to the left as one piece, like a slide pulled out of a projector.
          const out = Number.isFinite(next) ? move(f, next - 10, next) : 0;
          const id = `${script}-${i}`;
          return (
            <g key={i} transform={`translate(${-out * width} 0)`}>
              {beat.kind === 'stack' && <Stack beat={beat} index={stackIndex} f={local} box={box} />}
              {beat.kind === 'count' && <Count beat={beat} f={local} box={box} />}
              {beat.kind === 'marquee' && <Marquee beat={beat} f={local} box={box} />}
              {beat.kind === 'ring' && <Ring beat={beat} f={local} box={box} id={id} />}
              {beat.kind === 'tokens' && <Tokens beat={beat} f={local} box={box} />}
              {beat.caption && (
                <text x={box.margin} y={height - box.margin * 0.7} fontSize={label} opacity={move(local, 12, 20)} style={mono}>
                  {beat.caption}
                </text>
              )}
            </g>
          );
        })}
        {/* Drawn last so the label row stays readable over every shape. */}
        <rect x={0} y={0} width={width} height={box.margin * 1.15} fill={C.ground} />
        <text x={box.margin} y={box.margin * 0.8} fontSize={label} style={mono}>
          {s.label.toUpperCase()}
        </text>
        <text x={width - box.margin} y={box.margin * 0.8} fontSize={label} textAnchor="end" style={mono}>
          {s.years.toUpperCase()}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
