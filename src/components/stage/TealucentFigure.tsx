// Tealucent, tokens in three tiers (version J). Drawn as the reader scrolls past it: four values become four
// global tokens, the global tokens feed one alias token, action_background_, in its four modes, and the
// component tokens of the dropdown and the input use the alias. Then the alias steps through its modes, light,
// dark, translucent, action, and each time the dropdown and the input take on that mode's colour while their own
// token names stay the same: a new mode changes the alias, not the components. The end state keeps all four modes
// side by side, so it tells the whole story without the scroll. Values and token names are from the token board
// (tokens.jpg); the modes carry the names Robert gives them (27 Oct 2026), where the board's alias says side and
// trans. The colours are drawn as steps between the house ground and ink, as in the film, and the fields, the text
// bars and the floor under them are an illustration.
import type { Palette } from '../../../motion/src/style';
import { fonts } from '../../../motion/src/style';
import { mix } from '../../../motion/src/tealucent/Tealucent';

/** One column per mode, in the order of the case text: the value, its global token, the mode of the alias. */
const MODES = [
  { value: '#CED7D8', token: 'teal_20', mode: 'light', share: 0.2, see: false },
  { value: '#2F5558', token: 'teal_85', mode: 'dark', share: 0.85, see: false },
  { value: '#CED7D8 20%', token: 'trans_20G50', mode: 'translucent', share: 0.2, see: true },
  { value: '#47696B', token: 'teal_75', mode: 'action', share: 0.75, see: false },
];
const ALIAS = 'action_background_';
const COMPONENTS = ['dropdown-background', 'input-background'];

/** The chain draws over the first part of the scroll; then the alias steps through its modes, one hard step each,
 * late enough that the components under the chain are on screen when they change. */
const MODE_AT = [0.56, 0.68, 0.8, 0.92];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (share: number, from: number, to: number) => clamp((share - from) / (to - from));
/** Fade in: from nothing to full over a short stretch of scroll, so that nothing pops (Robert, 27 Oct 2026). */
const FADE = 0.05;
const at = (share: number, from: number) => span(share, from, from + FADE);
/** How far mode k has been switched on, 0 to 1: the components take on its colour over a stretch of scroll. */
const MODE_FADE = 0.06;
const filledAt = (share: number, k: number) => span(share, MODE_AT[k], MODE_AT[k] + MODE_FADE);
/** How much mode k is the one that is on: it fades in with its colour and out as the next mode comes. */
const litAt = (share: number, k: number) => filledAt(share, k) * (k < MODES.length - 1 ? 1 - filledAt(share, k + 1) : 1);

const drawn = (progress: number, length: number) => ({
  strokeDasharray: length,
  strokeDashoffset: length * (1 - progress),
});

type Shape = { x: number; y: number; w: number; h: number };

/** The steps run from the lighter of ground and ink to the darker, in both themes: the values are real colours,
 * so #2F5558 and the dark mode stay dark on a dark page too (the film flips them with the theme). */
const brightness = (hex: string) => [1, 3, 5].reduce((sum, i) => sum + parseInt(hex.slice(i, i + 2), 16), 0);
const ends = (c: Palette) => (brightness(c.ground) > brightness(c.ink) ? [c.ground, c.ink] : [c.ink, c.ground]);
const tone = (c: Palette, share: number) => mix(ends(c)[0], ends(c)[1], share);
/** Marks on a step: light steps carry the dark end, strong steps the light one. */
const onTone = (c: Palette, share: number) => ends(c)[share >= 0.5 ? 0 : 1];

/** A swatch of a mode's colour; the translucent one lets a hatch through, so it reads as see-through even small. */
const Swatch = ({ c, k, x, y, size, id }: { c: Palette; k: number; x: number; y: number; size: number; id: string }) => {
  const m = MODES[k];
  return (
    <g>
      {m.see && <rect x={x} y={y} width={size} height={size} fill={`url(#${id})`} opacity={0.5} />}
      <rect x={x} y={y} width={size} height={size} fill={tone(c, m.share)} fillOpacity={m.see ? 0.55 : 1} stroke={c.ink} strokeWidth={1.5} />
    </g>
  );
};

/** A field of the component, empty until its mode is switched on, then cross-fading into that mode's colour. */
const Field = ({ c, k, r, kind, amount }: { c: Palette; k: number; r: Shape; kind: 0 | 1; amount: number }) => (
  <g>
    {amount < 1 && (
      <g opacity={1 - amount}>
        <FieldFace c={c} k={k} r={r} kind={kind} filled={false} />
      </g>
    )}
    {amount > 0 && (
      <g opacity={amount}>
        <FieldFace c={c} k={k} r={r} kind={kind} filled={true} />
      </g>
    )}
  </g>
);

/** One face of a field, empty or filled. The text is a bar, the dropdown has its chevron, the input its magnifier. */
const FieldFace = ({ c, k, r, kind, filled }: { c: Palette; k: number; r: Shape; kind: 0 | 1; filled: boolean }) => {
  const m = MODES[k];
  const mark = filled ? onTone(c, m.share) : c.hair;
  const s = r.h;
  const ix = r.x + r.w - s * 0.75;
  const iy = r.y + s / 2;
  return (
    <g>
      <rect
        x={r.x}
        y={r.y}
        width={r.w}
        height={r.h}
        fill={filled ? tone(c, m.share) : c.ground}
        fillOpacity={filled && m.see ? 0.55 : 1}
        stroke={filled ? 'none' : c.hair}
        strokeWidth={2}
      />
      <rect x={r.x + s * 0.32} y={iy - s * 0.08} width={r.w * 0.42} height={s * 0.16} fill={mark} />
      {kind === 0 ? (
        <path
          d={`M ${ix - s * 0.14} ${iy - s * 0.07} L ${ix} ${iy + s * 0.08} L ${ix + s * 0.14} ${iy - s * 0.07}`}
          fill="none"
          stroke={mark}
          strokeWidth={s * 0.06}
        />
      ) : (
        <g fill="none" stroke={mark} strokeWidth={s * 0.06}>
          <circle cx={ix - s * 0.03} cy={iy - s * 0.03} r={s * 0.12} />
          <line x1={ix + s * 0.06} y1={iy + s * 0.06} x2={ix + s * 0.16} y2={iy + s * 0.16} />
        </g>
      )}
    </g>
  );
};

/** What lies under the components, a few hairlines like the calendar: it shows only through the translucent mode. */
const Floor = ({ c, r, pitch }: { c: Palette; r: Shape; pitch: number }) => (
  <g stroke={c.hair} strokeWidth={1.5}>
    {Array.from({ length: Math.floor(r.h / pitch) + 1 }, (_, i) => (
      <line key={`h${i}`} x1={r.x} x2={r.x + r.w} y1={r.y + i * pitch} y2={r.y + i * pitch} />
    ))}
    {Array.from({ length: Math.floor(r.w / (pitch * 2)) + 1 }, (_, i) => (
      <line key={`v${i}`} x1={r.x + i * pitch * 2} x2={r.x + i * pitch * 2} y1={r.y} y2={r.y + r.h} />
    ))}
  </g>
);

const Hatch = ({ c, id }: { c: Palette; id: string }) => (
  <defs>
    <pattern id={id} width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1={0} y1={0} x2={0} y2={8} stroke={c.ink} strokeWidth={2.5} />
    </pattern>
  </defs>
);

export const TealucentFigure = ({ palette: c, share, narrow }: { palette: Palette; share: number; narrow: boolean }) =>
  narrow ? <TokensNarrow c={c} share={share} /> : <TokensWide c={c} share={share} />;

// Wide: the tiers are rows, read top to bottom; the four modes are columns. The alias runs across all of them
// as one box, and each mode drops into the dropdown and the input below it.
const COL = { x: 220, pitch: 245, w: 225 };
const colX = (k: number) => COL.x + k * COL.pitch;
const ROW = { value: 40, global: 120, alias: 172, slot: 216, tile: 300, field: 52 };

const TokensWide = ({ c, share }: { c: Palette; share: number }) => {
  const label = { fontFamily: fonts.mono, fontSize: 17, letterSpacing: 1, fill: c.mute };
  const name = { fontFamily: fonts.mono, fontSize: 19, fill: c.ink };
  const box = { x: COL.x - 12, y: ROW.alias, w: 4 * COL.pitch - 20 + 24, h: 76 };
  const boxDrawn = span(share, 0.2, 0.3);
  const field = (k: number, i: number): Shape => ({ x: colX(k), y: ROW.tile + 18 + i * 100, w: COL.w, h: ROW.field });

  return (
    <svg viewBox="0 0 1200 520" width="100%" height="100%" aria-hidden="true">
      <Hatch c={c} id="tealucent-figure-hatch" />

      {/* The tiers, named in the left column. */}
      <g style={label}>
        <text x={0} y={ROW.value + 6} opacity={at(share, 0.02)}>VALUE</text>
        <text x={0} y={ROW.global + 6} opacity={at(share, 0.1)}>GLOBAL TOKEN</text>
        <text x={0} y={ROW.slot - 10} opacity={at(share, 0.2)}>ALIAS TOKEN</text>
        <text x={0} y={ROW.slot + 18} opacity={at(share, 0.24)} style={{ fill: c.ink, letterSpacing: 0 }}>
          {ALIAS}
        </text>
        <text x={0} y={ROW.tile + 8} opacity={at(share, 0.32)}>COMPONENT TOKEN</text>
        <text x={0} y={ROW.tile + 34} opacity={at(share, MODE_AT[3])} style={{ fill: c.signal }}>
          SAME IN EVERY MODE
        </text>
      </g>

      {/* The floor the components lie on, under all four columns. */}
      <g opacity={at(share, 0.34)}>
        <Floor c={c} r={{ x: COL.x - 12, y: ROW.tile - 12, w: box.w, h: 210 }} pitch={26} />
      </g>

      {/* The one alias, a dashed box across the four modes, as on the board. */}
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        fill="none"
        stroke={c.ink}
        strokeWidth={2}
        strokeDasharray={boxDrawn < 1 ? 2 * (box.w + box.h) : '6 5'}
        strokeDashoffset={boxDrawn < 1 ? 2 * (box.w + box.h) * (1 - boxDrawn) : 0}
        opacity={boxDrawn > 0 ? 1 : 0}
      />

      {MODES.map((m, k) => {
        const x = colX(k);
        const lit = litAt(share, k);
        const filled = filledAt(share, k);
        const toGlobal = span(share, 0.08 + k * 0.02, 0.14 + k * 0.02);
        const toAlias = span(share, 0.18 + k * 0.02, 0.24 + k * 0.02);
        const toTile = span(share, 0.28 + k * 0.02, 0.34 + k * 0.02);
        const down = ROW.tile + 18 - (ROW.slot + 18);
        return (
          <g key={m.mode}>
            {/* Value, then its global token, each a swatch and a name. */}
            <g opacity={at(share, 0.03 + k * 0.015)}>
              <Swatch c={c} k={k} x={x} y={ROW.value - 12} size={24} id="tealucent-figure-hatch" />
              <text x={x + 36} y={ROW.value + 7} style={name}>
                {m.value}
              </text>
            </g>
            <line x1={x + 12} x2={x + 12} y1={ROW.value + 16} y2={ROW.global - 16} stroke={c.mute} strokeWidth={2} strokeDasharray="2 5" opacity={toGlobal > 0 ? 1 : 0} style={drawn(toGlobal, 64)} />
            <g opacity={at(share, 0.12 + k * 0.02)}>
              <Swatch c={c} k={k} x={x} y={ROW.global - 12} size={24} id="tealucent-figure-hatch" />
              <text x={x + 36} y={ROW.global + 7} style={{ ...name, fontSize: 21 }}>
                {m.token}
              </text>
            </g>
            <line x1={x + 12} x2={x + 12} y1={ROW.global + 16} y2={ROW.slot - 16} stroke={c.mute} strokeWidth={2} strokeDasharray="2 5" opacity={toAlias > 0 ? 1 : 0} style={drawn(toAlias, 64)} />

            {/* The mode inside the alias. */}
            <g opacity={at(share, 0.24 + k * 0.02)}>
              <Swatch c={c} k={k} x={x} y={ROW.slot - 12} size={24} id="tealucent-figure-hatch" />
              <text x={x + 36} y={ROW.slot + 7} style={{ ...name, fontSize: 21 }}>
                {m.mode}
              </text>
            </g>

            {/* From the mode down to the components: a hairline, red while this mode is on. */}
            <line
              x1={x + 12}
              x2={x + 12}
              y1={ROW.slot + 18}
              y2={ROW.tile + 18}
              stroke={mix(c.hair, c.signal, lit)}
              strokeWidth={2 + lit}
              opacity={toTile > 0 ? 1 : 0}
              style={drawn(toTile, down)}
            />

            {/* The components: the same two token names in every column, the colour from the mode. */}
            <g opacity={at(share, 0.34 + k * 0.02)}>
              {COMPONENTS.map((token, i) => {
                const r = field(k, i);
                return (
                  <g key={token}>
                    <Field c={c} k={k} r={r} kind={i as 0 | 1} amount={filled} />
                    <text x={r.x} y={r.y + r.h + 24} style={{ ...name, fontSize: 17, fill: mix(c.mute, c.ink, filled) }}>
                      {token}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* The mode that is on: framed in red from the alias down to its components. */}
            {lit > 0 && (
              <rect x={x - 8} y={ROW.slot - 20} width={COL.w + 16} height={ROW.tile + 18 + 100 + ROW.field + 36 - (ROW.slot - 20)} fill="none" stroke={c.signal} strokeWidth={3} opacity={lit} />
            )}
          </g>
        );
      })}
    </svg>
  );
};

// Narrow: the chain runs top to bottom. Each mode is a row, from its value through its global token into the
// alias on the right; below, the components in all four modes, two by two.
const N = { row: 58, top: 92, alias: 420, tileTop: 400, tileW: 282, tileH: 236, field: 60 };
const rowY = (k: number) => N.top + k * N.row;
const tileAt = (k: number) => ({ x: 6 + (k % 2) * 306, y: N.tileTop + Math.floor(k / 2) * (N.tileH + 30) });

const TokensNarrow = ({ c, share }: { c: Palette; share: number }) => {
  const label = { fontFamily: fonts.mono, fontSize: 22, letterSpacing: 0.5, fill: c.mute };
  const name = { fontFamily: fonts.mono, fontSize: 22, fill: c.ink };
  const box = { x: N.alias - 14, y: rowY(0) - 34, w: 600 - (N.alias - 14), h: 4 * N.row + 4 };
  const boxDrawn = span(share, 0.2, 0.3);

  return (
    <svg viewBox="0 0 600 910" width="100%" height="100%" aria-hidden="true">
      <Hatch c={c} id="tealucent-figure-hatch-narrow" />

      <g style={label}>
        <text x={0} y={30} opacity={at(share, 0.02)}>VALUE</text>
        <text x={206} y={30} opacity={at(share, 0.1)}>GLOBAL</text>
        <text x={N.alias} y={30} opacity={at(share, 0.2)}>ALIAS</text>
      </g>
      {/* The alias name under its box, across the width it needs. */}
      <text x={600} y={box.y + box.h + 38} textAnchor="end" opacity={at(share, 0.24)} style={{ ...name, fontSize: 24 }}>
        {ALIAS}
      </text>

      <rect
        x={box.x}
        y={box.y}
        width={box.w - 1}
        height={box.h}
        fill="none"
        stroke={c.ink}
        strokeWidth={2}
        strokeDasharray={boxDrawn < 1 ? 2 * (box.w + box.h) : '6 5'}
        strokeDashoffset={boxDrawn < 1 ? 2 * (box.w + box.h) * (1 - boxDrawn) : 0}
        opacity={boxDrawn > 0 ? 1 : 0}
      />

      {MODES.map((m, k) => {
        const y = rowY(k);
        const toGlobal = span(share, 0.08 + k * 0.02, 0.14 + k * 0.02);
        const toAlias = span(share, 0.18 + k * 0.02, 0.24 + k * 0.02);
        return (
          <g key={m.mode}>
            <g opacity={at(share, 0.03 + k * 0.015)}>
              <Swatch c={c} k={k} x={0} y={y - 22} size={28} id="tealucent-figure-hatch-narrow" />
              {/* The translucent value is the longest; its "20%" goes on a second line. */}
              <text x={38} y={y} style={name}>
                {m.value.split(' ')[0]}
              </text>
              {m.see && (
                <text x={38} y={y + 26} style={{ ...name, fill: c.mute }}>
                  20%
                </text>
              )}
            </g>
            <line x1={146} x2={198} y1={y - 8} y2={y - 8} stroke={c.mute} strokeWidth={2} strokeDasharray="2 5" opacity={toGlobal > 0 ? 1 : 0} style={drawn(toGlobal, 52)} />
            <g opacity={at(share, 0.12 + k * 0.02)}>
              <Swatch c={c} k={k} x={206} y={y - 22} size={28} id="tealucent-figure-hatch-narrow" />
              <text x={244} y={y} style={name}>
                {m.token}
              </text>
            </g>
            <line x1={392} x2={N.alias} y1={y - 8} y2={y - 8} stroke={c.mute} strokeWidth={2} strokeDasharray="2 5" opacity={toAlias > 0 ? 1 : 0} style={drawn(toAlias, 28)} />
            <g opacity={at(share, 0.24 + k * 0.02)}>
              {/* Swatch first, as in the other two columns, so that "translucent" has the room it needs. */}
              <Swatch c={c} k={k} x={N.alias + 6} y={y - 22} size={28} id="tealucent-figure-hatch-narrow" />
              <text x={N.alias + 42} y={y} style={{ ...name, fontSize: 20 }}>
                {m.mode}
              </text>
            </g>
            {litAt(share, k) > 0 && <rect x={N.alias - 6} y={y - 30} width={600 - N.alias + 4} height={42} fill="none" stroke={c.signal} strokeWidth={3} opacity={litAt(share, k)} />}
          </g>
        );
      })}

      {/* The components in all four modes; the token names stay, the colour comes from the alias. */}
      <g style={label} opacity={at(share, 0.32)}>
        <text x={0} y={N.tileTop - 22}>COMPONENT TOKENS</text>
        <text x={600} y={N.tileTop - 22} textAnchor="end" opacity={at(share, MODE_AT[3])} style={{ fill: c.signal }}>
          SAME IN EVERY MODE
        </text>
      </g>
      {MODES.map((m, k) => {
        const t = tileAt(k);
        const lit = litAt(share, k);
        const filled = filledAt(share, k);
        return (
          <g key={m.mode} opacity={at(share, 0.34 + k * 0.02)}>
            <Floor c={c} r={{ x: t.x, y: t.y + 40, w: N.tileW, h: N.tileH - 40 }} pitch={30} />
            <text x={t.x} y={t.y + 26} style={{ ...name, fontSize: 24, fill: mix(c.mute, c.ink, filled) }}>
              {m.mode}
            </text>
            {COMPONENTS.map((token, i) => {
              const r = { x: t.x, y: t.y + 48 + i * 100, w: N.tileW, h: N.field };
              return (
                <g key={token}>
                  <Field c={c} k={k} r={r} kind={i as 0 | 1} amount={filled} />
                  <text x={r.x} y={r.y + r.h + 28} style={{ ...name, fontSize: 21, fill: mix(c.mute, c.ink, filled) }}>
                    {token}
                  </text>
                </g>
              );
            })}
            {lit > 0 && <rect x={t.x - 6} y={t.y - 6} width={N.tileW + 12} height={N.tileH + 18} fill="none" stroke={c.signal} strokeWidth={3} opacity={lit} />}
          </g>
        );
      })}
    </svg>
  );
};
