// Belegscanner in seven seconds, on one stage that never empties: three receipts lie on the scanner glass, the
// scan runs over them and each one gets its own box where the white gaps between them are; then the restaurant
// receipt comes forward and its fields are read one by one, the handwritten note on the back of a hospitality
// receipt included; then the three receipts become named PDFs in the day's folder and a row each in its list.
// The receipts are invented (no real receipt is shown anywhere on the site); the steps, the field names, the
// file name pattern and the folder layout are the app's (belegscanner.py: find_regions, PROMPT, filename_for,
// update_list). The poster film and the stage of the case page draw the same scene with different layouts.
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ActWord, Labels, type Act } from '../parts';
import { fonts, palettes, progress, SIZE, stepped, type Palette, type Theme, POSTER_VIEW } from '../style';

export const BELEG_FRAMES = 210;

export const BELEG_ACTS: Act[] = [
  { word: 'SCAN', from: 0, to: 64 },
  { word: 'READ', from: 64, to: 136 },
  { word: 'FILE', from: 136, to: Infinity },
];

/** One printed or handwritten line of a receipt, in the receipt's own units (its paper is w × h). */
type Line = { text: string; y: number; size?: number; kind?: 'head' | 'mono' | 'hand'; right?: string; field?: Field };
type Field = 'date' | 'merchant' | 'kind' | 'amount' | 'note';
type Receipt = { w: number; h: number; lines: Line[]; file: string };

const FUEL: Receipt = {
  w: 200,
  h: 440,
  file: '2026-10-08_Tankstelle-am-See_Tanken_59,68EUR.pdf',
  lines: [
    { text: 'TANKSTELLE', y: 46, kind: 'head' },
    { text: 'AM SEE', y: 68, kind: 'head' },
    { text: 'Uferweg 2, Musterstadt', y: 96 },
    { text: '08.10.2026', y: 132, right: '17:03' },
    { text: 'Säule 4  Super E10', y: 170 },
    { text: '34,12 l × 1,749', y: 194 },
    { text: 'SUMME EUR', y: 244, right: '59,68' },
    { text: 'Kartenzahlung', y: 280 },
    { text: 'MwSt 19 %', y: 316, right: '9,53' },
    { text: 'Vielen Dank', y: 392 },
  ],
};

const DINNER: Receipt = {
  w: 220,
  h: 600,
  file: '2026-10-14_Gasthaus-Seeblick_Bewirtung_48,60EUR.pdf',
  lines: [
    { text: 'GASTHAUS', y: 48, kind: 'head', field: 'merchant' },
    { text: 'SEEBLICK', y: 72, kind: 'head', field: 'merchant' },
    { text: 'Seestraße 1, Musterstadt', y: 100 },
    { text: '14.10.2026', y: 136, right: 'Tisch 7', field: 'date' },
    { text: '2 Tagessuppe', y: 178, right: '9,80' },
    { text: '1 Maultaschen', y: 200, right: '14,50' },
    { text: '1 Zander', y: 222, right: '21,90' },
    { text: '2 Wasser', y: 244, right: '2,40' },
    { text: 'SUMME EUR', y: 290, right: '48,60', field: 'amount' },
    { text: 'BEWIRTUNGSBELEG', y: 352, field: 'kind' },
    { text: 'Anlass:', y: 390 },
    { text: 'Projektgespräch', y: 420, kind: 'hand', field: 'note' },
    { text: 'Bewirtete Personen:', y: 460 },
    { text: 'M. Muster,', y: 490, kind: 'hand', field: 'note' },
    { text: 'E. Beispiel', y: 518, kind: 'hand', field: 'note' },
  ],
};

const PARKING: Receipt = {
  w: 200,
  h: 250,
  file: '2026-10-21_Parkhaus-Altstadt_Parken_4,50EUR.pdf',
  lines: [
    { text: 'PARKHAUS', y: 46, kind: 'head' },
    { text: 'ALTSTADT', y: 68, kind: 'head' },
    { text: '21.10.2026', y: 108, right: '10:12' },
    { text: 'Dauer', y: 136, right: '2:10 h' },
    { text: 'BETRAG EUR', y: 182, right: '4,50' },
  ],
};

/** The order on the glass, left to right, and in the folder. The dinner is the one that is read. */
const RECEIPTS = [FUEL, DINNER, PARKING];
const READ = 1;

/** The fields as the app names them in its list, in the order they are read, with the values for the dinner. */
const FIELDS: { key: Field; label: string; value: string[] }[] = [
  { key: 'date', label: 'DATE', value: ['2026-10-14'] },
  { key: 'merchant', label: 'MERCHANT', value: ['Gasthaus Seeblick'] },
  { key: 'kind', label: 'KIND', value: ['Bewirtung'] },
  { key: 'amount', label: 'AMOUNT', value: ['48,60'] },
  { key: 'note', label: 'NOTE, HANDWRITTEN', value: ['Projektgespräch;', 'M. Muster, E. Beispiel'] },
];
const FIELD_AT = (i: number) => 90 + i * 8;

/** Where a receipt sits: centre, rotation and scale. */
type Place = { x: number; y: number; r: number; s: number };

export type Layout = {
  glass: { x: number; y: number; w: number; h: number };
  /** Act 1: on the glass, at an angle, as they were laid down. */
  laid: Place[];
  /** Act 2: the receipt being read in front, the other two stacked behind it. */
  read: Place[];
  /** Act 3: side by side as PDFs. */
  filed: Place[];
  fields: { x: number; y: number; row: number; label: number; value: number };
  files: { x: number; y: number; row: number; size: number };
};

export const POSTER_LAYOUT: Layout = {
  glass: { x: 64, y: 300, w: 672, h: 580 },
  laid: [
    { x: 182, y: 560, r: -4, s: 0.8 },
    { x: 410, y: 584, r: 2.5, s: 0.8 },
    { x: 634, y: 452, r: -5, s: 0.76 },
  ],
  read: [
    { x: 168, y: 610, r: -3, s: 0.98 },
    { x: 200, y: 598, r: 0, s: 1.02 },
    { x: 246, y: 520, r: 4, s: 0.98 },
  ],
  filed: [
    { x: 116, y: 420, r: 0, s: 0.5 },
    { x: 246, y: 450, r: 0, s: 0.5 },
    { x: 370, y: 354, r: 0, s: 0.5 },
  ],
  fields: { x: 372, y: 320, row: 100, label: 16, value: 30 },
  files: { x: 64, y: 640, row: 40, size: 18 },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mix = (a: Place, b: Place, t: number): Place => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), r: lerp(a.r, b.r, t), s: lerp(a.s, b.s, t) });
const placeOf = (p: Place, receipt: Receipt) =>
  `translate(${p.x} ${p.y}) rotate(${p.r}) scale(${p.s}) translate(${-receipt.w / 2} ${-receipt.h / 2})`;

/** Where each receipt is at a frame: laid down, then read, then filed. */
const placeAt = (layout: Layout, i: number, f: number) => {
  const forward = progress(f, 64, 84);
  const filed = progress(f, 138, 156);
  return mix(mix(layout.laid[i], layout.read[i], forward), layout.filed[i], filed);
};

/** The paper and the print of one receipt. The print is cut to what the scan has passed. */
const Paper = ({ receipt, c }: { receipt: Receipt; c: Palette }) => (
  <rect x={0} y={0} width={receipt.w} height={receipt.h} fill={c.ground} stroke={c.ink} strokeWidth={2} vectorEffect="non-scaling-stroke" />
);

const Print = ({ receipt, c, lit }: { receipt: Receipt; c: Palette; lit: (field?: Field) => boolean }) => (
  <g>
    {receipt.lines.map((line) => {
      const hand = line.kind === 'hand';
      const head = line.kind === 'head';
      const on = lit(line.field);
      const style = head
        ? { fontFamily: fonts.sans, fontWeight: 800, letterSpacing: -0.4, fill: c.ink }
        : hand
          ? { fontFamily: fonts.display, fontWeight: 300, fontStretch: '62.5%', fill: c.ink }
          : { fontFamily: fonts.mono, fill: c.ink };
      const size = line.size ?? (head ? 22 : hand ? 30 : 12.5);
      return (
        <g key={line.text + line.y}>
          {on && <rect x={14} y={line.y - size * 0.85} width={receipt.w - 28} height={size * 1.1} fill={c.signal} opacity={0.18} />}
          <text
            x={hand ? 26 : 18}
            y={line.y}
            fontSize={size}
            xmlSpace="preserve"
            transform={hand ? `skewX(-10) translate(${line.y * 0.17} 0)` : undefined}
            style={style}
          >
            {line.text}
          </text>
          {line.right && (
            <text x={receipt.w - 18} y={line.y} fontSize={size} textAnchor="end" style={{ ...style, fontFamily: fonts.mono }}>
              {line.right}
            </text>
          )}
          {on && <line x1={14} x2={receipt.w - 14} y1={line.y + 6} y2={line.y + 6} stroke={c.signal} strokeWidth={2.5} />}
        </g>
      );
    })}
  </g>
);

/** The scene both versions draw: glass, scan, boxes; the read receipt and its fields; the files and the list. */
export const BelegScene = ({ f, c, layout, wide = false }: { f: number; c: Palette; layout: Layout; wide?: boolean }) => {
  const { glass } = layout;
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };

  // Act 1: the receipts land one after the other, the scan bar runs down, then a box clicks round each one.
  const landed = (i: number) => stepped(progress(f, 2 + i * 3, 3 + i * 3), 1);
  const bar = glass.y + glass.h * Math.min(1, Math.max(0, (f - 12) / 30));
  const scanning = f >= 12 && f < 43;
  const glassFade = 1 - progress(f, 64, 76);
  const forward = progress(f, 64, 84);
  const filed = progress(f, 138, 156);

  // Act 2: the field being read lights up on the receipt; act 3 puts out the lights.
  const reading = FIELDS.reduce((last, _, i) => (f >= FIELD_AT(i) ? i : last), -1);
  const lit = (i: number) => (field?: Field) =>
    i === READ && f >= 88 && f < 138 && !!field && field === FIELDS[Math.max(0, reading)]?.key;

  const order = f < 64 ? [0, 1, 2] : [0, 2, 1];

  return (
    <g>
      {/* The glass, with its edge, until the receipt is lifted off it. */}
      <g opacity={glassFade}>
        <rect x={glass.x} y={glass.y} width={glass.w} height={glass.h} fill="none" stroke={c.hair} strokeWidth={2} />
      </g>

      <defs>
        <clipPath id={`beleg-scanned-${wide ? 'w' : 't'}`}>
          <rect x={-4000} y={-4000} width={8000} height={f >= 43 ? 8000 : bar + 4000} />
        </clipPath>
      </defs>

      {order.map((i) => {
        const receipt = RECEIPTS[i];
        if (!landed(i)) return null;
        const place = placeAt(layout, i, f);
        const behind = i !== READ ? lerp(1, 0.32, forward) * (1 - filed) + filed : 1;
        return (
          <g key={i} opacity={behind}>
            <g transform={placeOf(place, receipt)}>
              <Paper receipt={receipt} c={c} />
            </g>
            <g clipPath={`url(#beleg-scanned-${wide ? 'w' : 't'})`}>
              <g transform={placeOf(place, receipt)}>
                <Print receipt={receipt} c={c} lit={lit(i)} />
              </g>
            </g>
          </g>
        );
      })}

      {/* The scan bar, then the boxes that split the glass into receipts, with the margin the app adds. */}
      {scanning && <line x1={glass.x} x2={glass.x + glass.w} y1={bar} y2={bar} stroke={c.signal} strokeWidth={4} />}
      <g opacity={1 - forward}>
        {RECEIPTS.map((receipt, i) => {
          const p = layout.laid[i];
          const show = stepped(progress(f, 44 + i * 4, 45 + i * 4), 1);
          if (!show) return null;
          const r = (p.r * Math.PI) / 180;
          const w = receipt.w * p.s;
          const h = receipt.h * p.s;
          const bw = Math.abs(w * Math.cos(r)) + Math.abs(h * Math.sin(r)) + 24;
          const bh = Math.abs(w * Math.sin(r)) + Math.abs(h * Math.cos(r)) + 24;
          return (
            <g key={i}>
              <rect x={p.x - bw / 2} y={p.y - bh / 2} width={bw} height={bh} fill="none" stroke={c.signal} strokeWidth={3} />
              <rect x={p.x - bw / 2} y={p.y - bh / 2 - 30} width={30} height={30} fill={c.signal} />
              <text x={p.x - bw / 2 + 15} y={p.y - bh / 2 - 8} fontSize={20} textAnchor="middle" style={{ fontFamily: fonts.mono, fill: c.ground }}>
                {i + 1}
              </text>
            </g>
          );
        })}
      </g>

      {/* Act 2: the fields, one row each, as they are read. */}
      <g opacity={1 - progress(f, 136, 146)}>
        {FIELDS.map((field, i) => {
          const at = FIELD_AT(i);
          if (f < at) return null;
          const y = layout.fields.y + i * layout.fields.row;
          const appear = progress(f, at, at + 6);
          return (
            <g key={field.key} opacity={appear}>
              <text x={layout.fields.x} y={y} fontSize={layout.fields.label} style={{ ...mono, fill: i === reading ? c.signal : c.mute }}>
                {field.label}
              </text>
              {field.value.map((line, k) => (
                <text
                  key={k}
                  x={layout.fields.x - 2}
                  y={y + layout.fields.value * 1.25 + k * layout.fields.value * 1.05}
                  fontSize={field.value.length > 1 ? layout.fields.value * 0.82 : layout.fields.value}
                  style={{ fontFamily: fonts.sans, fontWeight: 700, letterSpacing: -0.6, fill: c.ink }}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </g>

      {/* Act 3: the day's folder, a named PDF per receipt, and the list beside the folder. */}
      <g>
        <text x={layout.files.x} y={layout.files.y} fontSize={layout.files.size} opacity={progress(f, 146, 152)} style={mono}>
          BELEGE / 2026-10-27 /
        </text>
        {RECEIPTS.map((receipt, i) => {
          const start = 150 + i * 7;
          const typed = Math.round(receipt.file.length * Math.min(1, Math.max(0, (f - start) / 12)));
          if (typed <= 0) return null;
          const y = layout.files.y + (i + 1) * layout.files.row;
          return (
            <text
              key={i}
              x={layout.files.x + layout.files.size * 1.2}
              y={y}
              fontSize={layout.files.size}
              xmlSpace="preserve"
              style={{ fontFamily: fonts.mono, fill: i === READ ? c.signal : c.ink }}
            >
              {receipt.file.slice(0, typed)}
            </text>
          );
        })}
        <text
          x={layout.files.x}
          y={layout.files.y + 4.4 * layout.files.row}
          fontSize={layout.files.size}
          opacity={progress(f, 176, 182)}
          style={{ fontFamily: fonts.mono, fill: c.ink }}
        >
          2026-10-27_Belegliste.csv
        </text>
        <text
          x={layout.files.x}
          y={layout.files.y + 5.3 * layout.files.row}
          fontSize={layout.files.size * 0.85}
          opacity={progress(f, 180, 186)}
          style={mono}
        >
          BELEGDATUM; HÄNDLER; ART; BETRAG; NOTIZ; DATEI
        </text>
      </g>
    </g>
  );
};

export const Beleg = ({ theme }: { theme: Theme }) => {
  const f = useCurrentFrame();
  const c = palettes[theme];
  const mono = { fontFamily: fonts.mono, fill: c.mute, letterSpacing: 1 };
  const caption = (from: number, to: number) => progress(f, from, from + 6) * (1 - progress(f, to - 6, to));

  return (
    <AbsoluteFill style={{ backgroundColor: c.ground }}>
      <svg width={SIZE.width} height={SIZE.height} viewBox={POSTER_VIEW}>
        <Labels frame={f} project="Belegscanner" acts={BELEG_ACTS} palette={c} />
        <ActWord frame={f} acts={BELEG_ACTS} palette={c} />
        <BelegScene f={f} c={c} layout={POSTER_LAYOUT} />

        <text x={64} y={930} fontSize={20} opacity={caption(14, 44)} style={mono}>
          ONE SCAN OVER WI-FI
        </text>
        <text x={64} y={930} fontSize={20} opacity={caption(46, 70)} style={mono}>
          SPLIT AT THE WHITE GAPS
        </text>
        <text x={64} y={930} fontSize={20} opacity={caption(88, 136)} style={mono}>
          CLAUDE READS THE IMAGE, HANDWRITING TOO
        </text>

        {/* Act 3, beside the PDFs: the count. */}
        <g opacity={progress(f, 160, 168)}>
          <text
            x={500}
            y={500}
            fontSize={190}
            style={{ fontFamily: fonts.sans, fontWeight: 800, letterSpacing: -8, fill: c.ink, fontVariantNumeric: 'tabular-nums' }}
          >
            3
          </text>
          <text x={506} y={546} fontSize={18} style={mono}>
            PDFS FROM ONE SCAN
          </text>
        </g>
        <text x={64} y={930} fontSize={20} opacity={progress(f, 186, 192)} style={mono}>
          SEARCHABLE · NAMED · LISTED
        </text>
      </svg>
    </AbsoluteFill>
  );
};
