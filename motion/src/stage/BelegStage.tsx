// Stub as the opening of its case page (version J): the film's scene across the whole width, with no
// ground of its own. The page sets the title and the summary as real text in the left column of the same
// 1600 × 900 box; the glass, the read receipt and the folder fill the right. Under the summary, what each act
// means, and in act 3 the count in the title's type. Receipts, words and numbers are the film's.
import { useCurrentFrame } from 'remotion';
import type { Palette } from '../style';
import { fonts, progress } from '../style';
import { BelegScene, type Layout } from '../beleg/Beleg';

const STAGE_LAYOUT: Layout = {
  glass: { x: 780, y: 40, w: 800, h: 780 },
  laid: [
    { x: 916, y: 420, r: -4, s: 1 },
    { x: 1186, y: 440, r: 2.5, s: 1 },
    { x: 1452, y: 300, r: -5, s: 1 },
  ],
  read: [
    { x: 890, y: 450, r: -3, s: 1.2 },
    { x: 930, y: 440, r: 0, s: 1.25 },
    { x: 990, y: 380, r: 4, s: 1.2 },
  ],
  filed: [
    { x: 860, y: 181, r: 0, s: 0.55 },
    { x: 1010, y: 225, r: 0, s: 0.55 },
    { x: 1150, y: 129, r: 0, s: 0.55 },
  ],
  fields: { x: 1130, y: 110, row: 140, label: 19, value: 42 },
  files: { x: 790, y: 480, row: 52, size: 24 },
};

export const BelegStage = ({ palette: c }: { palette: Palette }) => {
  const f = useCurrentFrame();
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };
  const caption = (from: number, to: number) => progress(f, from, from + 6) * (1 - progress(f, to - 6, to));

  return (
    <svg viewBox="0 0 1600 900" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <BelegScene f={f} c={c} layout={STAGE_LAYOUT} wide />

      {/* Left column under the summary: what each act does. */}
      <g opacity={caption(10, 70)}>
        <text x={0} y={520} fontSize={19} style={mono}>
          ONE SCAN OVER WI-FI, NO DRIVER (ESCL)
        </text>
        <text x={0} y={568} fontSize={19} opacity={progress(f, 44, 50)} style={{ ...mono, fill: c.signal }}>
          SPLIT AT THE WHITE GAPS BETWEEN THEM
        </text>
      </g>
      <g opacity={caption(84, 140)}>
        <text x={0} y={520} fontSize={19} style={mono}>
          MACOS VISION: TEXT LAYER FOR THE PDF
        </text>
        <text x={0} y={568} fontSize={19} opacity={progress(f, 90, 96)} style={{ ...mono, fill: c.ink }}>
          CLAUDE: READS THE IMAGE, HANDWRITING TOO
        </text>
      </g>

      {/* Act 3, under the summary in the title's type: the count. */}
      <g opacity={progress(f, 160, 168)}>
        <text x={0} y={520} fontSize={19} style={{ ...mono, fill: c.ink }}>
          SEARCHABLE · NAMED · LISTED
        </text>
        <text
          x={-6}
          y={712}
          fontSize={176}
          style={{ fontFamily: fonts.sans, fontWeight: 600, letterSpacing: -9.7, fill: c.ink, fontVariantNumeric: 'tabular-nums' }}
        >
          3 PDFs
        </text>
        <text x={0} y={772} fontSize={19} style={mono}>
          FROM ONE SCAN, READ IN ABOUT 8 S
        </text>
      </g>
    </svg>
  );
};
