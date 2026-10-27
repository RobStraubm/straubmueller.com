// Flowculate, decisions: where the name and the mark come from (version J). Drawn as the reader scrolls past
// it: flow, the run of circles in the brand's yellow-to-green, plus calculate, the circles and triangle of the
// triangulation, give flowculate, the mark, and then the lockup. Shapes and colours are taken from Robert's
// logo presentation of 10 May 2023 (EFlow/01_CorporateDesign/Logo), without its slide ground; mark and
// wordmark are the exported brand files.
import type { Palette } from '../../../motion/src/style';
import { fonts } from '../../../motion/src/style';

/** The "flow" circles from the presentation, left to right, in its page units. */
const FLOW = { x0: 129.18, step: 14.744, y: 282.07, r: 20.261 };
const FLOW_COLOURS = ['#ffd111', '#f1cf13', '#e3cd14', '#d5cb15', '#c7c917', '#b8c718', '#aac619', '#9cc41b'];

/** The "calculate" drawing from the presentation, in its page units (box 353.8 230.2 104.9 101.5). */
const CALC = [
  { transform: 'matrix(1,0,0,-1,429.0125,235.77179)', width: 0.14, d: 'M0 0C14.734-5.53 22.196-21.957 16.666-36.692 11.136-51.426-5.292-58.887-20.026-53.357-34.76-47.827-42.222-31.4-36.692-16.666-31.162-1.931-14.734 5.53 0 0Z' },
  { transform: 'matrix(1,0,0,-1,396.0594,267.5191)', width: 0.14, d: 'M0 0C14.734-5.53 22.196-21.957 16.666-36.692 11.136-51.426-5.292-58.887-20.026-53.357-34.76-47.827-42.222-31.4-36.692-16.666-31.162-1.931-14.734 5.53 0 0Z' },
  { transform: 'matrix(1,0,0,-1,436.5382,272.8119)', width: 0.14, d: 'M0 0C14.734-5.53 22.196-21.957 16.666-36.692 11.136-51.426-5.292-58.887-20.026-53.357-34.76-47.827-42.222-31.4-36.692-16.666-31.162-1.931-14.734 5.53 0 0Z' },
  { transform: 'matrix(1,0,0,-1,426.0406,258.3755)', width: 2.0, d: 'M0 0C16.05-6.024 24.178-23.918 18.154-39.969 12.13-56.019-5.764-64.147-21.815-58.123-37.865-52.099-45.992-34.204-39.969-18.154-33.945-2.104-16.05 6.024 0 0Z' },
  { transform: 'matrix(1,0,0,-1,444.0518,276.037)', width: 0.5, d: 'M0 0-39.505-39.852-53.323 9.953 0 0Z' },
];
const CALC_BOX = { x: 353.8, y: 230.2, w: 104.9, h: 101.5 };
const ORANGE = '#f1851f';

const WORDMARK_RATIO = 1997 / 351;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (share: number, from: number, to: number) => clamp((share - from) / (to - from));

/** The page is dark when its ink is light. */
const isDark = (c: Palette) => parseInt(c.ink.replace('#', '').slice(0, 2), 16) > 128;

export const FlowculateName = ({ palette: c, share, narrow = false }: { palette: Palette; share: number; narrow?: boolean }) => {
  if (narrow) return <FlowculateNameNarrow palette={c} share={share} />;
  const mono = { fontFamily: fonts.mono, fontSize: 17, letterSpacing: 1, fill: c.ink };
  const note = { fontFamily: fonts.mono, fontSize: 14, fill: c.mute };
  const S = 1.75; // presentation units to figure units
  const row = 170;
  const calc = span(share, 0.3, 0.52);
  const mark = span(share, 0.6, 0.68);
  const lockup = span(share, 0.76, 0.9);
  const markSize = 190;
  const wordH = 74;

  return (
    <svg viewBox="0 0 1200 520" width="100%" height="100%" aria-hidden="true">
      {/* flow */}
      <g transform={`translate(${40 - (FLOW.x0 - FLOW.r) * S} ${row - FLOW.y * S}) scale(${S})`}>
        {FLOW_COLOURS.map((colour, k) => {
          const t = span(share, 0.04 + k * 0.025, 0.1 + k * 0.025);
          return <circle cx={FLOW.x0 + k * FLOW.step - (1 - t) * 14} cy={FLOW.y} r={FLOW.r} fill={colour} opacity={t} />;
        })}
      </g>
      <text x={40} y={row + 128} {...mono} opacity={span(share, 0.04, 0.1)}>FLOW</text>
      <text x={40} y={row + 152} {...note} opacity={span(share, 0.1, 0.2)}>people moving through a room</text>

      <text x={330} y={row + 7} {...mono} fontSize={30} opacity={span(share, 0.27, 0.31)}>+</text>

      {/* calculate */}
      <g transform={`translate(${410 - CALC_BOX.x * S} ${row - (CALC_BOX.y + CALC_BOX.h / 2) * S}) scale(${S})`}>
        {CALC.map((p) => (
          <path
            transform={p.transform}
            d={p.d}
            fill="none"
            stroke={ORANGE}
            strokeWidth={Math.max(p.width, 0.6)}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - calc}
          />
        ))}
      </g>
      <text x={410} y={row + 128} {...mono} opacity={span(share, 0.3, 0.36)}>CALCULATE</text>
      <text x={410} y={row + 152} {...note} opacity={span(share, 0.36, 0.46)}>the triangles the model computes on</text>

      {/* the arrow, then the mark */}
      <g opacity={span(share, 0.54, 0.6)} stroke={c.ink} strokeWidth={2} fill="none">
        <line x1={700} y1={row} x2={700 + 70 * span(share, 0.54, 0.6)} y2={row} />
        <polyline points={`${762},${row - 8} ${772},${row} ${762},${row + 8}`} />
      </g>
      <image
        href="/cases/flowculate/mark.png"
        x={810 + (1 - mark) * 20}
        y={row - markSize / 2}
        width={markSize}
        height={markSize}
        opacity={mark}
      />
      <text x={810} y={row + 128} {...mono} opacity={mark}>FLOWCULATE</text>

      {/* the lockup the two became */}
      <line x1={40} y1={392} x2={1160} y2={392} stroke={c.hair} strokeWidth={1} opacity={lockup} />
      <g opacity={lockup} transform={`translate(0 ${(1 - lockup) * 16})`}>
        <image href="/cases/flowculate/mark.png" x={40} y={420} width={wordH * 1.25} height={wordH * 1.25} />
        <image
          href={isDark(c) ? '/cases/flowculate/wordmark-on-dark.png' : '/cases/flowculate/wordmark-on-light.png'}
          x={40 + wordH * 1.25 + 26}
          y={420 + (wordH * 1.25 - wordH) / 2}
          width={wordH * WORDMARK_RATIO}
          height={wordH}
        />
      </g>
    </svg>
  );
};

/** The narrow version (phones), 600 x 920: flow + calculate side by side, the arrow down to the mark, then the
 * lockup across the full width. Same timing as the wide version. */
const FlowculateNameNarrow = ({ palette: c, share }: { palette: Palette; share: number }) => {
  const mono = { fontFamily: fonts.mono, fontSize: 24, letterSpacing: 1, fill: c.ink };
  const note = { fontFamily: fonts.mono, fontSize: 22, fill: c.mute };
  const S = 1.72; // presentation units to figure units
  const F = 1.45; // the flow run is wider, so it is drawn a little smaller to leave room for the plus
  const row = 128;
  const right = 334; // left edge of the calculate column
  const calc = span(share, 0.3, 0.52);
  const mark = span(share, 0.6, 0.68);
  const lockup = span(share, 0.76, 0.9);
  const arrow = span(share, 0.54, 0.6);
  const markSize = 230;
  const markY = 460;
  const wordH = 70;
  const lockY = 808;

  return (
    <svg viewBox="0 0 600 920" width="100%" height="100%" aria-hidden="true">
      {/* flow */}
      <g transform={`translate(${40 - (FLOW.x0 - FLOW.r) * F} ${row - FLOW.y * F}) scale(${F})`}>
        {FLOW_COLOURS.map((colour, k) => {
          const t = span(share, 0.04 + k * 0.025, 0.1 + k * 0.025);
          return <circle cx={FLOW.x0 + k * FLOW.step - (1 - t) * 14} cy={FLOW.y} r={FLOW.r} fill={colour} opacity={t} />;
        })}
      </g>
      <text x={40} y={row + 140} {...mono} opacity={span(share, 0.04, 0.1)}>FLOW</text>
      <g opacity={span(share, 0.1, 0.2)}>
        <text x={40} y={row + 180} {...note}>people moving</text>
        <text x={40} y={row + 208} {...note}>through a room</text>
      </g>

      <text x={292} y={row + 10} {...mono} fontSize={36} textAnchor="middle" opacity={span(share, 0.27, 0.31)}>+</text>

      {/* calculate */}
      <g transform={`translate(${right - CALC_BOX.x * S} ${row - (CALC_BOX.y + CALC_BOX.h / 2) * S}) scale(${S})`}>
        {CALC.map((p) => (
          <path
            transform={p.transform}
            d={p.d}
            fill="none"
            stroke={ORANGE}
            strokeWidth={Math.max(p.width, 0.8)}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - calc}
          />
        ))}
      </g>
      <text x={right} y={row + 140} {...mono} opacity={span(share, 0.3, 0.36)}>CALCULATE</text>
      <g opacity={span(share, 0.36, 0.46)}>
        <text x={right} y={row + 180} {...note}>the triangles</text>
        <text x={right} y={row + 208} {...note}>the model</text>
        <text x={right} y={row + 236} {...note}>computes on</text>
      </g>

      {/* the arrow down, then the mark */}
      <g opacity={arrow} stroke={c.ink} strokeWidth={2} fill="none">
        <line x1={300} y1={402} x2={300} y2={402 + 36 * arrow} />
        <polyline points={`${292},${430} ${300},${440} ${308},${430}`} />
      </g>
      <image
        href="/cases/flowculate/mark.png"
        x={300 - markSize / 2}
        y={markY + (1 - mark) * 20}
        width={markSize}
        height={markSize}
        opacity={mark}
      />
      <text x={300} y={markY + markSize + 40} {...mono} textAnchor="middle" opacity={mark}>FLOWCULATE</text>

      {/* the lockup the two became */}
      <line x1={40} y1={lockY - 32} x2={560} y2={lockY - 32} stroke={c.hair} strokeWidth={1} opacity={lockup} />
      <g opacity={lockup} transform={`translate(0 ${(1 - lockup) * 16})`}>
        <image href="/cases/flowculate/mark.png" x={40} y={lockY} width={wordH * 1.25} height={wordH * 1.25} />
        <image
          href={isDark(c) ? '/cases/flowculate/wordmark-on-dark.png' : '/cases/flowculate/wordmark-on-light.png'}
          x={40 + wordH * 1.25 + 22}
          y={lockY + (wordH * 1.25 - wordH) / 2}
          width={wordH * WORDMARK_RATIO}
          height={wordH}
        />
      </g>
    </svg>
  );
};
