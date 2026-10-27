// Style “Kinetic” (version H): the story told only with type. Huge words rise out of masks,
// numbers count in the condensed serif, a URL runs as a ticker, an award circles its prize.
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fonts, palettes, type Palette, type Theme } from '../style';
import { scripts, type Beat, type Line } from './scripts';

const ease = Easing.bezier(0.2, 0.7, 0.2, 1);
const ramp = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

const tone = (c: Palette, line: Line) => (line.tone === 'signal' ? c.signal : line.tone === 'mute' ? c.mute : c.ink);

type Frame = { width: number; height: number; margin: number };

/** Lines stacked and rising one after another out of their own masks; they leave upwards. */
const Stack = ({ beat, f, out, c, box, id }: { beat: Extract<Beat, { kind: 'stack' }>; f: number; out: number; c: Palette; box: Frame; id: string }) => {
  const usable = box.width - 2 * box.margin;
  const longest = Math.max(...beat.lines.map((line) => line.text.length));
  const size = Math.min(box.height * 0.2, usable / (0.6 * longest));
  const lead = size * 0.9;
  const block = lead * beat.lines.length;
  const top = (box.height - block) / 2 + size * 0.1;
  return (
    <g>
      {beat.lines.map((line, i) => {
        const y = top + lead * (i + 1) - size * 0.12;
        const enter = ramp(f, i * 5, i * 5 + 16);
        const shift = (1 - enter) * size - out * size;
        return (
          <g key={i}>
            <clipPath id={`${id}-${i}`}>
              <rect x={0} y={y - size * 0.82} width={box.width} height={size * 0.98} />
            </clipPath>
            <text
              clipPath={`url(#${id}-${i})`}
              x={box.margin - size * 0.04}
              y={y + shift}
              fontSize={size}
              style={{ fontFamily: fonts.sans, fontWeight: 500, letterSpacing: -size * 0.05, fill: tone(c, line) }}
            >
              {line.text}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const Count = ({ beat, f, c, box }: { beat: Extract<Beat, { kind: 'count' }>; f: number; c: Palette; box: Frame }) => {
  const value = beat.from + (beat.to - beat.from) * ramp(f, 4, 44);
  const text = `${value.toFixed(beat.decimals ?? 0)}${beat.suffix ?? ''}`;
  const finalText = `${beat.to.toFixed(beat.decimals ?? 0)}${beat.suffix ?? ''}`;
  const usable = box.width - 2 * box.margin;
  const size = Math.min(box.height * 0.42, usable / (0.42 * finalText.length));
  return (
    <text
      x={box.margin - size * 0.03}
      y={box.height / 2 + size * 0.3}
      fontSize={size}
      opacity={ramp(f, 0, 8)}
      style={{
        fontFamily: fonts.display,
        fontWeight: 200,
        fontStretch: '62.5%',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: -size * 0.02,
        fill: c.ink,
      }}
    >
      {text}
    </text>
  );
};

const Marquee = ({ beat, f, c, box }: { beat: Extract<Beat, { kind: 'marquee' }>; f: number; c: Palette; box: Frame }) => {
  const size = box.height * 0.3;
  const span = beat.text.length * size * 0.62 + size * 0.6;
  // Runs right to left at one screen width every three seconds, in three copies for a seamless loop.
  const x = box.width - ((f * box.width) / 90) % span;
  return (
    <g style={{ fontFamily: fonts.sans, fontWeight: 500, letterSpacing: -size * 0.05, fill: c.ink }}>
      {[0, 1, 2].map((k) => (
        <text key={k} x={x + (k - 1) * span} y={box.height / 2 + size * 0.36} fontSize={size}>
          {beat.text}
        </text>
      ))}
    </g>
  );
};

const Ring = ({ beat, f, c, box, id }: { beat: Extract<Beat, { kind: 'ring' }>; f: number; c: Palette; box: Frame; id: string }) => {
  const r = Math.min(box.width, box.height) * 0.36;
  const cx = box.width / 2;
  const cy = box.height / 2;
  const ringSize = r * 0.13;
  const circle = 2 * Math.PI * r;
  const turns = Math.max(1, Math.floor(circle / (beat.ring.length * ringSize * 0.66)));
  return (
    <g opacity={ramp(f, 0, 10)}>
      <path id={`${id}-path`} d={`M ${cx - r} ${cy} a ${r} ${r} 0 1 1 ${2 * r} 0 a ${r} ${r} 0 1 1 ${-2 * r} 0`} fill="none" />
      <g transform={`rotate(${f * 0.6} ${cx} ${cy})`}>
        <text fontSize={ringSize} style={{ fontFamily: fonts.mono, letterSpacing: ringSize * 0.08, fill: c.ink }}>
          <textPath href={`#${id}-path`} textLength={circle - ringSize * 0.5} lengthAdjust="spacing">
            {beat.ring.repeat(turns)}
          </textPath>
        </text>
      </g>
      {beat.lines.map((line, i) => {
        const size = r * 0.55;
        const y = cy - (beat.lines.length * size * 0.86) / 2 + size * 0.86 * (i + 1) - size * 0.12;
        const enter = ramp(f, 8 + i * 5, 24 + i * 5);
        return (
          <text
            key={i}
            x={cx}
            y={y + (1 - enter) * size * 0.5}
            opacity={enter}
            textAnchor="middle"
            fontSize={size}
            style={{ fontFamily: fonts.sans, fontWeight: 500, letterSpacing: -size * 0.05, fill: tone(c, line) }}
          >
            {line.text}
          </text>
        );
      })}
    </g>
  );
};

const Tokens = ({ beat, f, c, box }: { beat: Extract<Beat, { kind: 'tokens' }>; f: number; c: Palette; box: Frame }) => {
  const usable = box.width - 2 * box.margin;
  const cell = usable / beat.tokens.length;
  const size = cell * 0.5;
  const y = box.height / 2 - cell * 0.6;
  return (
    <g>
      {beat.tokens.map((token, i) => {
        const shown = f >= 4 + i * 4;
        const marked = i === beat.mark && f >= 4 + beat.tokens.length * 4 + 6;
        if (!shown) return null;
        return (
          <g key={i}>
            <rect x={box.margin + i * cell} y={y} width={cell} height={cell * 1.2} fill={marked ? c.signal : 'none'} stroke={c.ink} strokeWidth={2} />
            <text
              x={box.margin + i * cell + cell / 2}
              y={y + cell * 0.6 + size * 0.36}
              textAnchor="middle"
              fontSize={size}
              style={{ fontFamily: fonts.mono, fill: c.ink }}
            >
              {token}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export const Kinetic = ({ theme, script }: { theme: Theme; script: string }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const c = palettes[theme];
  const s = scripts[script];
  const box: Frame = { width, height, margin: Math.round(width * 0.08) };
  const label = Math.round(Math.min(width, height) * 0.028);
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: label * 0.07 };

  return (
    <AbsoluteFill style={{ backgroundColor: c.ground }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <text x={box.margin} y={box.margin * 0.8} fontSize={label} style={mono}>
          {s.label.toUpperCase()}
        </text>
        <text x={width - box.margin} y={box.margin * 0.8} fontSize={label} textAnchor="end" style={mono}>
          {s.years.toUpperCase()}
        </text>
        {s.beats.map((beat, i) => {
          const next = s.beats[i + 1]?.at ?? Infinity;
          if (f < beat.at || f > next) return null;
          const local = f - beat.at;
          const out = Number.isFinite(next) ? ramp(f, next - 8, next) : 0;
          const id = `${script}-${i}`;
          const fade = beat.kind === 'stack' ? 1 : 1 - out;
          return (
            <g key={i} opacity={fade} transform={beat.kind === 'stack' ? undefined : `translate(0 ${-out * 40})`}>
              {beat.kind === 'stack' && <Stack beat={beat} f={local} out={out} c={c} box={box} id={id} />}
              {beat.kind === 'count' && <Count beat={beat} f={local} c={c} box={box} />}
              {beat.kind === 'marquee' && <Marquee beat={beat} f={local} c={c} box={box} />}
              {beat.kind === 'ring' && <Ring beat={beat} f={local} c={c} box={box} id={id} />}
              {beat.kind === 'tokens' && <Tokens beat={beat} f={local} c={c} box={box} />}
              {beat.caption && (
                <text x={box.margin} y={height - box.margin * 0.7} fontSize={label} opacity={ramp(local, 10, 20) * (1 - out)} style={mono}>
                  {beat.caption}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
