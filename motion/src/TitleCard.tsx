// A still poster for projects that have no film yet, in the same style: the name set huge,
// one line about the work, and who it was for.
import { AbsoluteFill } from 'remotion';
import { fonts, palettes, SIZE, type Theme } from './style';

export type TitleCardProps = {
  theme: Theme;
  title: string;
  line: string;
  years: string;
  client: string;
};

/** Greedy line breaking by characters; good enough for short poster text in one typeface. */
const wrap = (text: string, max: number) =>
  text.split(' ').reduce<string[]>((lines, word) => {
    const last = lines[lines.length - 1];
    if (last !== undefined && (last + ' ' + word).length <= max) lines[lines.length - 1] = last + ' ' + word;
    else lines.push(word);
    return lines;
  }, []);

export const TitleCard = ({ theme, title, line, years, client }: TitleCardProps) => {
  const c = palettes[theme];
  const words = wrap(title.toUpperCase(), 9);
  const longest = Math.max(...words.map((w) => w.length));
  const size = Math.min(150, Math.floor(700 / (0.66 * longest)));
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1.5 };

  return (
    <AbsoluteFill style={{ backgroundColor: c.ground }}>
      <svg width={SIZE.width} height={SIZE.height} viewBox={`0 0 ${SIZE.width} ${SIZE.height}`}>
        <text x={64} y={64} fontSize={22} style={mono}>
          {client.toUpperCase()}
        </text>
        <text x={736} y={64} fontSize={22} textAnchor="end" style={mono}>
          {years}
        </text>
        <line x1={64} y1={84} x2={736} y2={84} stroke={c.hair} strokeWidth={2} />
        {words.map((word, i) => (
          <text
            key={i}
            x={56}
            y={84 + size * 0.98 * (i + 1)}
            fontSize={size}
            style={{ fontFamily: fonts.sans, fontWeight: 800, letterSpacing: -size * 0.045, fill: c.ink }}
          >
            {word}
          </text>
        ))}
        {wrap(line, 30).map((text, i, all) => (
          <text
            key={i}
            x={64}
            y={936 - (all.length - 1 - i) * 46}
            fontSize={36}
            style={{ fontFamily: fonts.sans, fontWeight: 500, letterSpacing: -0.6, fill: c.ink }}
          >
            {text}
          </text>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
