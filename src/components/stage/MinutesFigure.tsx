// Ambacta, AI meeting minutes, testing: why speech landed under the wrong agenda item, and what the editor does now
// (version J). Drawn as the reader scrolls past it: the recording with the items the chair announced, the first
// run, which only knew those items and stopped where the recording stopped without saying so, and the editor now,
// which takes the items from the meeting documents and flags every item without speech. Facts from the case text;
// the waveform is the stage's, the seven items stand for an agenda and are not the meeting's.
import type { Palette } from '../../../motion/src/style';
import { fonts } from '../../../motion/src/style';
import { seeded } from '../../../motion/src/random';
import { mix } from '../../../motion/src/tealucent/Tealucent';

/** The timeline right of the row titles. */
const LINE = { x: 260, width: 940 };
/** Where each agenda item starts, as a share of the timeline. The chair announced all but the third. */
const ITEMS = [0, 0.17, 0.32, 0.47, 0.62, 0.8, 0.9];
const UNANNOUNCED = 2;
/** The recording ends in the middle of the fifth item. */
const END = 0.72;
const WAVE = { y: 70, height: 30, pitch: 8 };
const ROW = { first: 196, now: 352, h: 40 };

const random = seeded(519);
const at = (t: number) => LINE.x + LINE.width * t;
/** Loudness per bar: speech, with a breath at every change of item. */
const LEVELS = Array.from({ length: Math.floor((LINE.width * END) / WAVE.pitch) }, (_, i) => {
  const x = at(0) + i * WAVE.pitch;
  return ITEMS.some((t) => Math.abs(at(t) - x) < 10) ? 0.06 : 0.25 + 0.75 * random();
});

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (share: number, from: number, to: number) => clamp((share - from) / (to - from));
/** Fade in: nothing pops, it comes up over a short stretch of scroll (Robert, 27 Oct 2026). */
const FADE = 0.04;
const fade = (share: number, from: number) => span(share, from, from + FADE);
/** A bar from one item boundary to the next, with a gap at both ends, drawn as far as the reveal has got. */
const bar = (from: number, to: number, reveal: number, gap = 2) => {
  const x = at(from) + gap;
  const width = Math.min(at(to) - gap, at(reveal)) - x;
  return width > 0 ? { x, width } : null;
};

export const MinutesFigure = ({ palette: c, share, narrow = false }: { palette: Palette; share: number; narrow?: boolean }) => {
  if (narrow) return <MinutesNarrow palette={c} share={share} />;
  const mono = { fontFamily: fonts.mono, fontSize: 16, letterSpacing: 0.5, whiteSpace: 'pre' };
  const title = { fontFamily: fonts.sans, fontSize: 34, fontWeight: 500, fill: c.ink };
  const head = at(END * span(share, 0.04, 0.26));
  const ended = fade(share, 0.27);
  const first = span(share, 0.3, 0.46);
  const wrong = fade(share, 0.5);
  const silent = fade(share, 0.54);
  const grid = span(share, 0.58, 0.66);
  const now = span(share, 0.66, 0.8);
  const flagged = (k: number) => fade(share, 0.82 + k * 0.04);
  // The first run only knew the items the chair announced, and nothing after the recording.
  const announced = ITEMS.filter((t, i) => i !== UNANNOUNCED && t < END);
  const firstRun = announced.map((t, i) => [t, announced[i + 1] ?? END]);

  return (
    <svg viewBox="0 0 1200 460" width="100%" height="100%" aria-hidden="true">
      {/* The recording, with a mark for every item the chair announced in so many words. */}
      <g opacity={fade(share, 0.04)}>
        <text x={0} y={WAVE.y + 12} style={title}>
          Recording
        </text>
        <polygon points="0,118 7,106 14,118" fill={c.ink} />
        <text x={24} y={118} style={{ ...mono, fill: c.mute }}>
          ITEM ANNOUNCED
        </text>
      </g>
      {LEVELS.map((level, i) => {
        const x = at(0) + i * WAVE.pitch;
        if (x >= head) return null;
        const h = Math.max(1, level * WAVE.height);
        return <rect key={i} x={x} y={WAVE.y - h} width={4} height={h * 2} fill={c.ink} />;
      })}
      {announced.map((t) =>
        at(t) <= head ? <polygon key={t} points={`${at(t)},118 ${at(t) + 7},106 ${at(t) + 14},118`} fill={c.ink} /> : null,
      )}
      {ended > 0 && (
        <g opacity={ended}>
          <line x1={at(END)} x2={at(END)} y1={WAVE.y - 40} y2={WAVE.y + 40} stroke={c.ink} strokeWidth={2} />
          <line x1={at(END) + 8} x2={at(1)} y1={WAVE.y} y2={WAVE.y} stroke={c.hair} strokeWidth={2} strokeDasharray="6 6" />
          <text x={at(END) + 12} y={WAVE.y - 22} style={{ ...mono, fill: c.mute }}>
            RECORDING ENDS
          </text>
        </g>
      )}

      {/* The item boundaries from the documents, drawn down behind both runs: they show in the gaps, and above
          and below the first run where it ran on past an item. */}
      {ITEMS.slice(1).flatMap((t) =>
        [ROW.first, ROW.now].map((y) => (
          <line
            key={`${t}-${y}`}
            x1={at(t)}
            x2={at(t)}
            y1={y - 10}
            y2={y - 10 + (ROW.h + 20) * grid}
            stroke={c.hair}
            strokeWidth={2}
            opacity={fade(share, 0.58)}
          />
        )),
      )}

      {/* First run: speech after an unannounced item landed under the one before, and the export just stopped. */}
      <g opacity={fade(share, 0.3)}>
        <text x={0} y={ROW.first + 30} style={title}>
          First run
        </text>
        <text x={0} y={ROW.first + 60} style={{ ...mono, fill: c.mute }}>
          ITEMS AS THE CHAIR
        </text>
        <text x={0} y={ROW.first + 82} style={{ ...mono, fill: c.mute }}>
          ANNOUNCES THEM
        </text>
      </g>
      {firstRun.map(([from, to]) => {
        const b = bar(from, to, first * END, to === END ? 0 : 2);
        return b && <rect key={from} x={b.x} y={ROW.first} width={b.width} height={ROW.h} fill={c.ink} />;
      })}
      {wrong > 0 && (
        <g opacity={wrong}>
          <rect x={at(ITEMS[UNANNOUNCED])} y={ROW.first} width={at(ITEMS[UNANNOUNCED + 1]) - 2 - at(ITEMS[UNANNOUNCED])} height={ROW.h} fill={c.signal} />
          <text x={at(ITEMS[UNANNOUNCED])} y={ROW.first + ROW.h + 26} style={{ ...mono, fill: c.signal }}>
            UNDER THE WRONG ITEM
          </text>
        </g>
      )}
      {silent > 0 && (
        <text opacity={silent} x={at(END)} y={ROW.first + ROW.h + 26} style={{ ...mono, fill: c.mute }}>
          EXPORT DOES NOT SAY SO
        </text>
      )}

      {/* Now: the items come down from the meeting documents, and every item without speech is flagged. */}
      <g opacity={fade(share, 0.58)}>
        <text x={0} y={ROW.now + 30} style={title}>
          Now
        </text>
        <text x={0} y={ROW.now + 60} style={{ ...mono, fill: c.mute }}>
          ITEMS FROM THE
        </text>
        <text x={0} y={ROW.now + 82} style={{ ...mono, fill: c.mute }}>
          MEETING DOCUMENTS
        </text>
      </g>
      {ITEMS.map((t, i) => {
        const to = ITEMS[i + 1] ?? 1;
        if (to <= END) {
          const b = bar(t, to, now);
          return b && <rect key={t} x={b.x} y={ROW.now} width={b.width} height={ROW.h} fill={c.ink} />;
        }
        if (t < END) {
          const spoken = bar(t, END, now, 0);
          const rest = bar(END, to, now, 0);
          return (
            <g key={t}>
              {spoken && <rect x={spoken.x + 2} y={ROW.now} width={spoken.width - 2} height={ROW.h} fill={c.ink} />}
              {rest && <rect x={rest.x + 1} y={ROW.now + 1} width={Math.max(0, rest.width - 3)} height={ROW.h - 2} fill="none" stroke={c.hair} strokeWidth={2} />}
            </g>
          );
        }
        const b = bar(t, to, now);
        const k = i - ITEMS.findIndex((s) => s >= END);
        return (
          b && (
            <rect
              key={t}
              x={b.x + 1}
              y={ROW.now + 1}
              width={Math.max(0, b.width - 2)}
              height={ROW.h - 2}
              fill="none"
              stroke={mix(c.hair, c.signal, flagged(k))}
              strokeWidth={2 + flagged(k)}
            />
          )
        );
      })}
      <g opacity={flagged(2)}>
        <text x={1200} y={ROW.now + ROW.h + 26} textAnchor="end" style={{ ...mono, fill: c.signal }}>
          NO SPEECH
        </text>
        <text x={1200} y={ROW.now + ROW.h + 48} textAnchor="end" style={{ ...mono, fill: c.mute }}>
          SHOWN IN THE CHECK VIEW
        </text>
      </g>

    </svg>
  );
};

/** Narrow version (phones): the three rows keep their order, but each takes the full width with its title above it. */
const NW = { width: 600, wave: 128, height: 30, pitch: 8, first: 314, now: 548, h: 48 };
const nat = (t: number) => NW.width * t;
const N_LEVELS = Array.from({ length: Math.floor((NW.width * END) / NW.pitch) }, (_, i) => {
  const x = i * NW.pitch;
  return ITEMS.some((t) => Math.abs(nat(t) - x) < 8) ? 0.06 : LEVELS[i % LEVELS.length];
});
/** As bar(), on the narrow timeline. */
const nbar = (from: number, to: number, reveal: number, gap = 2) => {
  const x = nat(from) + gap;
  const width = Math.min(nat(to) - gap, nat(reveal)) - x;
  return width > 0 ? { x, width } : null;
};
/** The mark for an item the chair announced. */
const tick = (x: number, y: number) => `${x},${y} ${x + 8},${y - 14} ${x + 16},${y}`;

const MinutesNarrow = ({ palette: c, share }: { palette: Palette; share: number }) => {
  const mono = { fontFamily: fonts.mono, fontSize: 22, letterSpacing: 0.5, whiteSpace: 'pre' };
  const title = { fontFamily: fonts.sans, fontSize: 44, fontWeight: 500, fill: c.ink };
  const head = nat(END * span(share, 0.04, 0.26));
  const ended = fade(share, 0.27);
  const first = span(share, 0.3, 0.46);
  const wrong = fade(share, 0.5);
  const silent = fade(share, 0.54);
  const grid = span(share, 0.58, 0.66);
  const now = span(share, 0.66, 0.8);
  const flagged = (k: number) => fade(share, 0.82 + k * 0.04);
  const announced = ITEMS.filter((t, i) => i !== UNANNOUNCED && t < END);
  const firstRun = announced.map((t, i) => [t, announced[i + 1] ?? END]);
  const marks = NW.wave + NW.height + 32;

  return (
    <svg viewBox="0 0 600 680" width="100%" height="100%" aria-hidden="true">
      {/* The recording, with a mark for every item the chair announced in so many words. */}
      <g opacity={fade(share, 0.04)}>
        <text x={0} y={40} style={title}>
          Recording
        </text>
        <polygon points={tick(364, 38)} fill={c.ink} />
        <text x={600} y={40} textAnchor="end" style={{ ...mono, fill: c.mute }}>
          ITEM ANNOUNCED
        </text>
      </g>
      {N_LEVELS.map((level, i) => {
        const x = i * NW.pitch;
        if (x >= head) return null;
        const h = Math.max(1, level * NW.height);
        return <rect key={i} x={x} y={NW.wave - h} width={4} height={h * 2} fill={c.ink} />;
      })}
      {announced.map((t) => (nat(t) <= head ? <polygon key={t} points={tick(nat(t), marks)} fill={c.ink} /> : null))}
      {ended > 0 && (
        <g opacity={ended}>
          <line x1={nat(END)} x2={nat(END)} y1={NW.wave - 46} y2={NW.wave + 46} stroke={c.ink} strokeWidth={2} />
          <line x1={nat(END) + 8} x2={600} y1={NW.wave} y2={NW.wave} stroke={c.hair} strokeWidth={2} strokeDasharray="6 6" />
          <text x={nat(END) + 14} y={NW.wave - 46} style={{ ...mono, fill: c.mute }}>
            RECORDING
          </text>
          <text x={nat(END) + 14} y={NW.wave - 20} style={{ ...mono, fill: c.mute }}>
            ENDS
          </text>
        </g>
      )}

      {/* The item boundaries from the documents, drawn down behind both runs. */}
      {ITEMS.slice(1).flatMap((t) =>
        [NW.first, NW.now].map((y) => (
          <line
            key={`${t}-${y}`}
            x1={nat(t)}
            x2={nat(t)}
            y1={y - 10}
            y2={y - 10 + (NW.h + 20) * grid}
            stroke={c.hair}
            strokeWidth={2}
            opacity={fade(share, 0.58)}
          />
        )),
      )}

      {/* First run: speech after an unannounced item landed under the one before, and the export just stopped. */}
      <g opacity={fade(share, 0.3)}>
        <text x={0} y={NW.first - 62} style={title}>
          First run
        </text>
        <text x={0} y={NW.first - 26} style={{ ...mono, fill: c.mute }}>
          ITEMS AS THE CHAIR ANNOUNCES THEM
        </text>
      </g>
      {firstRun.map(([from, to]) => {
        const b = nbar(from, to, first * END, to === END ? 0 : 2);
        return b && <rect key={from} x={b.x} y={NW.first} width={b.width} height={NW.h} fill={c.ink} />;
      })}
      {wrong > 0 && (
        <g opacity={wrong}>
          <rect x={nat(ITEMS[UNANNOUNCED])} y={NW.first} width={nat(ITEMS[UNANNOUNCED + 1]) - 2 - nat(ITEMS[UNANNOUNCED])} height={NW.h} fill={c.signal} />
          <text x={nat(ITEMS[UNANNOUNCED])} y={NW.first + NW.h + 34} style={{ ...mono, fill: c.signal }}>
            UNDER THE
          </text>
          <text x={nat(ITEMS[UNANNOUNCED])} y={NW.first + NW.h + 60} style={{ ...mono, fill: c.signal }}>
            WRONG ITEM
          </text>
        </g>
      )}
      {silent > 0 && (
        <g opacity={silent}>
          <text x={nat(END) + 8} y={NW.first + NW.h + 34} style={{ ...mono, fill: c.mute }}>
            EXPORT DOES
          </text>
          <text x={nat(END) + 8} y={NW.first + NW.h + 60} style={{ ...mono, fill: c.mute }}>
            NOT SAY SO
          </text>
        </g>
      )}

      {/* Now: the items come down from the meeting documents, and every item without speech is flagged. */}
      <g opacity={fade(share, 0.58)}>
        <text x={0} y={NW.now - 62} style={title}>
          Now
        </text>
        <text x={0} y={NW.now - 26} style={{ ...mono, fill: c.mute }}>
          ITEMS FROM THE MEETING DOCUMENTS
        </text>
      </g>
      {ITEMS.map((t, i) => {
        const to = ITEMS[i + 1] ?? 1;
        if (to <= END) {
          const b = nbar(t, to, now);
          return b && <rect key={t} x={b.x} y={NW.now} width={b.width} height={NW.h} fill={c.ink} />;
        }
        if (t < END) {
          const spoken = nbar(t, END, now, 0);
          const rest = nbar(END, to, now, 0);
          return (
            <g key={t}>
              {spoken && <rect x={spoken.x + 2} y={NW.now} width={spoken.width - 2} height={NW.h} fill={c.ink} />}
              {rest && <rect x={rest.x + 1} y={NW.now + 1} width={Math.max(0, rest.width - 3)} height={NW.h - 2} fill="none" stroke={c.hair} strokeWidth={2} />}
            </g>
          );
        }
        const b = nbar(t, to, now);
        const k = i - ITEMS.findIndex((s) => s >= END);
        return (
          b && (
            <rect
              key={t}
              x={b.x + 1.5}
              y={NW.now + 1.5}
              width={Math.max(0, b.width - 3)}
              height={NW.h - 3}
              fill="none"
              stroke={mix(c.hair, c.signal, flagged(k))}
              strokeWidth={2 + flagged(k)}
            />
          )
        );
      })}
      <g opacity={flagged(2)}>
        <text x={600} y={NW.now + NW.h + 34} textAnchor="end" style={{ ...mono, fill: c.signal }}>
          NO SPEECH
        </text>
        <text x={600} y={NW.now + NW.h + 60} textAnchor="end" style={{ ...mono, fill: c.mute }}>
          SHOWN IN THE CHECK VIEW
        </text>
      </g>
    </svg>
  );
};
