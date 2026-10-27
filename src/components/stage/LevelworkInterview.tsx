// Levelwork, what I made: the conversation design of the AI interview (version J). Drawn as the reader scrolls
// past it: a vague answer is not written down but followed up; the next answer names work that is in no role
// description, and that line lands in the record as invisible work, unasked, with its interview passage attached:
// the source a finding needs. The behaviour is what held in testing against the live model (build status of
// 17 Sep 2026, levelwork repo research/method/2026-10-12-what-running-interviews-taught-us.md); "note invisible
// work" is one of the interview's fixed record tools. The exchange itself is written for this page, and the entry
// leads to F-07, the public example finding on levelwork.ai.
import type { Palette } from '../../../motion/src/style';
import { fonts } from '../../../motion/src/style';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (share: number, from: number, to: number) => clamp((share - from) / (to - from));

interface Layout {
  view: [number, number];
  speech: number;
  label: number;
  /** Conversation column. */
  talk: { x: number; first: number[]; question: number[]; second: number[] };
  /** Record column (or band, on phones). */
  record: { x: number; head: number; ghost: number; box: [number, number, number, number] };
  /** The line that carries the answer into the record. */
  link: [number, number, number, number];
  first: string[];
  question: string[];
  second: string[];
  rule?: number;
}

const FIRST = ['“A lot of project management, really.”'];
const QUESTION = ['What was the last project? Which part was', 'yours, and who decided?'];
const SECOND = ['“Mostly I keep the teams in step with each', 'other. That is in none of my role', 'descriptions.”'];

const WIDE: Layout = {
  view: [1200, 500],
  speech: 25,
  label: 14,
  talk: { x: 40, first: [56, 94], question: [168, 204], second: [292, 328] },
  record: { x: 730, head: 56, ghost: 94, box: [730, 262, 430, 214] },
  link: [600, 322, 730, 322],
  first: FIRST,
  question: QUESTION,
  second: SECOND,
};

const NARROW: Layout = {
  view: [600, 1080],
  speech: 28,
  label: 22,
  talk: { x: 40, first: [52, 96], question: [200, 244], second: [364, 408] },
  record: { x: 40, head: 600, ghost: 648, box: [40, 732, 520, 300] },
  link: [566, 450, 566, 732],
  first: ['“A lot of project management,', 'really.”'],
  question: ['What was the last project?', 'Which part was yours, and who', 'decided?'],
  second: ['“Mostly I keep the teams in', 'step with each other. That is in', 'none of my role descriptions.”'],
  rule: 552,
};

export const LevelworkInterview = ({ palette: c, share, narrow = false }: { palette: Palette; share: number; narrow?: boolean }) => {
  const L = narrow ? NARROW : WIDE;
  const [w, h] = L.view;
  const lead = L.speech * 1.4;
  const mono = (size: number, fill: string) => ({ fontFamily: fonts.mono, fontSize: size, letterSpacing: 1, fill, whiteSpace: 'pre' as const });
  const say = (fill: string) => ({ fontFamily: fonts.sans, fontSize: L.speech, letterSpacing: -0.3, fill });

  const first = span(share, 0.03, 0.1);
  const ghost = span(share, 0.12, 0.2);
  const strike = span(share, 0.2, 0.26);
  const vague = span(share, 0.24, 0.3);
  const question = span(share, 0.3, 0.38);
  const second = span(share, 0.44, 0.52);
  const link = span(share, 0.56, 0.66);
  const entry = span(share, 0.62, 0.72);
  const unasked = span(share, 0.7, 0.76);
  const finding = span(share, 0.82, 0.92);

  const R = L.record;
  const [bx, by, bw, bh] = R.box;
  const pad = narrow ? 24 : 20;
  const ghostWidth = L.speech * 0.5 * 'Project management'.length;
  const rise = (t: number) => `translate(0 ${(1 - t) * 10})`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" aria-hidden="true">
      {/* The two columns: what is said, and what the interview writes down. */}
      {narrow ? (
        <line x1={0} y1={L.rule} x2={w * span(share, 0.08, 0.2)} y2={L.rule} stroke={c.hair} strokeWidth={1} />
      ) : (
        <line x1={680} y1={20} x2={680} y2={20 + (h - 40) * span(share, 0.02, 0.14)} stroke={c.hair} strokeWidth={1} />
      )}
      <text x={R.x} y={R.head} opacity={span(share, 0.1, 0.14)} style={mono(L.label, c.mute)}>RECORD</text>

      {/* A vague answer. */}
      <g opacity={first} transform={rise(first)}>
        <text x={L.talk.x} y={L.talk.first[0]} style={mono(L.label, c.mute)}>PERSON</text>
        {L.first.map((line, k) => (
          <text key={line} x={L.talk.x} y={L.talk.first[1] + k * lead} style={say(c.ink)}>{line}</text>
        ))}
      </g>

      {/* It is not written down. */}
      <g opacity={ghost * (1 - finding * 0.5)}>
        <text x={R.x} y={R.ghost} style={say(c.mute)} opacity={0.75}>Project management</text>
        <line x1={R.x - 4} y1={R.ghost - L.speech * 0.32} x2={R.x - 4 + (ghostWidth + 8) * strike} y2={R.ghost - L.speech * 0.32} stroke={c.ink} strokeWidth={2} />
        <text x={R.x} y={R.ghost + L.label * 2.2} opacity={vague} style={mono(L.label, c.mute)}>
          VAGUE · FOLLOWED UP, NOT RECORDED
        </text>
      </g>

      {/* The follow-up instead of a note. */}
      <g opacity={question} transform={rise(question)}>
        <text x={L.talk.x} y={L.talk.question[0]} style={mono(L.label, c.signal)}>INTERVIEW · FOLLOW-UP</text>
        {L.question.map((line, k) => (
          <text key={line} x={L.talk.x} y={L.talk.question[1] + k * lead} style={say(c.ink)}>{line}</text>
        ))}
      </g>

      {/* The answer that names work nobody wrote down, at its passage in the interview. */}
      <g opacity={second} transform={rise(second)}>
        <text x={L.talk.x} y={L.talk.second[0]} style={mono(L.label, c.mute)}>
          {'PERSON · '}
          <tspan fill={finding > 0 ? c.signal : c.mute}>14:22</tspan>
        </text>
        {L.second.map((line, k) => (
          <text key={line} x={L.talk.x} y={L.talk.second[1] + k * lead} style={say(c.ink)}>{line}</text>
        ))}
      </g>

      {/* It lands in the record. */}
      <g stroke={finding > 0 ? c.signal : c.ink} strokeWidth={2} fill="none">
        <line x1={L.link[0]} y1={L.link[1]} x2={L.link[0] + (L.link[2] - L.link[0]) * link} y2={L.link[1] + (L.link[3] - L.link[1]) * link} />
        {link >= 1 &&
          (narrow ? (
            <polyline points={`${L.link[2] - 8},${L.link[3] - 12} ${L.link[2]},${L.link[3]} ${L.link[2] + 8},${L.link[3] - 12}`} />
          ) : (
            <polyline points={`${L.link[2] - 12},${L.link[3] - 8} ${L.link[2]},${L.link[3]} ${L.link[2] - 12},${L.link[3] + 8}`} />
          ))}
      </g>

      <g opacity={entry} transform={rise(entry)}>
        <rect
          x={bx}
          y={by}
          width={bw}
          height={bh}
          fill="none"
          stroke={finding > 0 ? c.ink : c.hair}
          strokeWidth={finding > 0 ? 2 : 1}
          pathLength={1}
          strokeDasharray={finding > 0 && finding < 1 ? 1 : undefined}
          strokeDashoffset={finding > 0 && finding < 1 ? 1 - finding : undefined}
        />
        <text x={bx + pad} y={by + pad + L.label} style={mono(L.label, c.mute)}>NOTE INVISIBLE WORK</text>
        <text x={bx + pad} y={by + pad + L.label + L.speech * 1.7} style={{ ...say(c.ink), fontSize: L.speech * 1.08, fontWeight: 500 }}>
          Cross-team coordination
        </text>
        <text x={bx + pad} y={by + pad + L.label * 2 + L.speech * 2.9} style={mono(L.label, c.ink)}>
          {'SOURCE · '}
          <tspan fill={finding > 0 ? c.signal : c.ink}>INTERVIEW PASSAGE 14:22</tspan>
        </text>
        <text x={bx + pad} y={by + pad + L.label * 3.8 + L.speech * 2.9} opacity={unasked} style={mono(L.label, c.mute)}>
          RECORDED UNASKED
        </text>
        <text x={bx + pad} y={by + bh - pad} opacity={finding} style={mono(L.label, c.ink)}>
          {narrow ? '→ FINDING F-07' : '→ FINDING F-07 · NO SOURCE, NO FINDING'}
        </text>
      </g>
    </svg>
  );
};
