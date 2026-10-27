// Levelwork, how fast we learn: why the first outside run of the founder interview failed (version J). Drawn as
// the reader scrolls past it: on 22 Sep the person talks about the week in channels and the interview, waiting
// for roles, captures nothing; the next day the guide asks once what a channel is for, and a replay finds four
// roles after three answers. Every word and number is from the case text; the lines are illustration.
import type { Palette } from '../../../motion/src/style';
import { fonts } from '../../../motion/src/style';
import { mix } from '../../../motion/src/tealucent/Tealucent';

/** The conversation runs from here; the roles stand in their own column on the right. */
const TALK_X = 200;
const ROLES_X = 700;
const FIRST = 120;
const REPLAY = 320;
const ANSWERS = [300, 400, 500];
const ROLE = { size: 50, step: 75 };

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (share: number, from: number, to: number) => clamp((share - from) / (to - from));
/** Fade in: from nothing to full over a short stretch of scroll, so that nothing pops (Robert, 27 Oct 2026). */
const at = (share: number, from: number) => span(share, from, from + 0.04);
/** A role box filling in: outline in mute, then ink. */
const role = (c: Palette, on: number) => ({ fill: c.ink, fillOpacity: on, stroke: mix(c.mute, c.ink, on), strokeWidth: 1 + on });

export const LevelworkFigure = ({ palette: c, share, narrow = false }: { palette: Palette; share: number; narrow?: boolean }) => {
  if (narrow) return <LevelworkNarrow palette={c} share={share} />;
  const mono = { fontFamily: fonts.mono, fontSize: 18, letterSpacing: 1, whiteSpace: 'pre' };
  const note = { fontFamily: fonts.mono, fontSize: 15, letterSpacing: 0.5, whiteSpace: 'pre', fill: c.mute };
  const large = { fontFamily: fonts.sans, fontSize: 64, fontWeight: 600, letterSpacing: -1.5, fill: c.ink };
  const first = span(share, 0.04, 0.22);
  const replay = span(share, 0.4, 0.6);
  const translate = span(share, 0.62, 0.7);
  const talkEnd = ANSWERS[ANSWERS.length - 1];

  return (
    <svg viewBox="0 0 1000 500" width="100%" height="100%" aria-hidden="true">
      <text x={TALK_X} y={34} opacity={at(share, 0.02)} style={note}>INTERVIEW</text>
      <text x={ROLES_X} y={34} opacity={at(share, 0.02)} style={note}>ROLES</text>

      {/* 22 Sep: the week in channels, and an interview that waits for roles. */}
      <g opacity={at(share, 0.03)}>
        <text x={0} y={FIRST - 6} style={{ ...mono, fill: c.ink }}>22 SEP</text>
        <text x={0} y={FIRST + 18} style={note}>FIRST RUN</text>
      </g>
      <text x={TALK_X} y={FIRST - 22} opacity={at(share, 0.08)} style={note}>THE WEEK, IN CHANNELS</text>
      <line x1={TALK_X} y1={FIRST} x2={TALK_X + (640 - TALK_X) * first} y2={FIRST} stroke={c.ink} strokeWidth={2} />
      <text x={TALK_X} y={FIRST + 34} opacity={at(share, 0.18)} style={note}>THE INTERVIEW WAITS FOR ROLES</text>
      <text x={ROLES_X} y={FIRST + 6} opacity={at(share, 0.26)} style={{ ...mono, fill: c.ink }}>NOTHING CAPTURED</text>

      <line x1={0} y1={226} x2={1000 * span(share, 0.3, 0.36)} y2={226} stroke={c.hair} strokeWidth={1} />

      {/* The next day: the guide asks once what a channel is for, and the replay translates. */}
      <g opacity={at(share, 0.36)}>
        <text x={0} y={REPLAY - 6} style={{ ...mono, fill: c.ink }}>NEXT DAY</text>
        <text x={0} y={REPLAY + 18} style={note}>REPLAY</text>
      </g>
      <text x={TALK_X} y={REPLAY - 30} opacity={at(share, 0.38)} style={note}>ASK ONCE WHAT A CHANNEL IS FOR</text>
      <line x1={TALK_X} y1={REPLAY} x2={TALK_X + (talkEnd - TALK_X) * replay} y2={REPLAY} stroke={c.ink} strokeWidth={2} />
      {ANSWERS.map((x) => (
        <line
          key={x}
          x1={x}
          y1={REPLAY - 14}
          x2={x}
          y2={REPLAY + 14}
          stroke={c.ink}
          strokeWidth={4}
          opacity={span(replay, (x - TALK_X) / (talkEnd - TALK_X) - 0.12, (x - TALK_X) / (talkEnd - TALK_X))}
        />
      ))}

      {/* The translation into roles, in the one colour. */}
      {translate > 0 && (
        <g stroke={c.signal} strokeWidth={3} fill="none">
          <line x1={talkEnd} y1={REPLAY} x2={talkEnd + (ROLES_X - 24 - talkEnd) * translate} y2={REPLAY} />
          {translate > 0.85 && <polyline points={`${ROLES_X - 34},${REPLAY - 9} ${ROLES_X - 22},${REPLAY} ${ROLES_X - 34},${REPLAY + 9}`} opacity={(translate - 0.85) / 0.15} />}
        </g>
      )}
      {[0, 1, 2, 3].map((k) => (
        <rect
          key={k}
          x={ROLES_X + k * ROLE.step}
          y={REPLAY - ROLE.size / 2}
          width={ROLE.size}
          height={ROLE.size}
          {...role(c, at(share, 0.72 + k * 0.03))}
          opacity={at(share, 0.4)}
        />
      ))}

      <text x={TALK_X} y={REPLAY + 130} opacity={at(share, 0.64)} style={large}>3 answers</text>
      <text x={ROLES_X} y={REPLAY + 130} opacity={at(share, 0.84)} style={large}>4 roles</text>
    </svg>
  );
};

/** Narrow version (phones): the same two runs, stacked as rows under the two column heads; the counts end it as big numerals. */
const N = { roles: 380, talk: 330, first: 196, replay: 520, end: 300, answers: [100, 200, 300], role: { size: 44, step: 58 } };

const LevelworkNarrow = ({ palette: c, share }: { palette: Palette; share: number }) => {
  const mono = { fontFamily: fonts.mono, fontSize: 26, letterSpacing: 1, whiteSpace: 'pre' };
  const note = { fontFamily: fonts.mono, fontSize: 22, letterSpacing: 0.5, whiteSpace: 'pre', fill: c.mute };
  const large = { fontFamily: fonts.sans, fontSize: 150, fontWeight: 600, letterSpacing: -3, fill: c.ink };
  const first = span(share, 0.04, 0.22);
  const replay = span(share, 0.4, 0.6);
  const translate = span(share, 0.62, 0.7);
  const talkEnd = N.answers[N.answers.length - 1];

  return (
    <svg viewBox="0 0 600 860" width="100%" height="100%" aria-hidden="true">
      <text x={0} y={30} opacity={at(share, 0.02)} style={note}>INTERVIEW</text>
      <text x={N.roles} y={30} opacity={at(share, 0.02)} style={note}>ROLES</text>
      <line x1={N.roles - 24} y1={0} x2={N.roles - 24} y2={590} stroke={c.hair} strokeWidth={1} opacity={at(share, 0.02)} />

      {/* 22 Sep: the week in channels, and an interview that waits for roles. */}
      <g opacity={at(share, 0.03)}>
        <text x={0} y={96} style={{ ...mono, fill: c.ink }}>22 SEP</text>
        <text x={124} y={96} style={note}>FIRST RUN</text>
      </g>
      <text x={0} y={N.first - 24} opacity={at(share, 0.08)} style={note}>THE WEEK, IN CHANNELS</text>
      <line x1={0} y1={N.first} x2={N.talk * first} y2={N.first} stroke={c.ink} strokeWidth={3} />
      <g opacity={at(share, 0.18)}>
        <text x={0} y={N.first + 40} style={note}>THE INTERVIEW</text>
        <text x={0} y={N.first + 68} style={note}>WAITS FOR ROLES</text>
      </g>
      <g opacity={at(share, 0.26)}>
        <text x={N.roles} y={N.first + 9} style={{ ...mono, fill: c.ink }}>NOTHING</text>
        <text x={N.roles} y={N.first + 41} style={{ ...mono, fill: c.ink }}>CAPTURED</text>
      </g>

      <line x1={0} y1={326} x2={600 * span(share, 0.3, 0.36)} y2={326} stroke={c.hair} strokeWidth={1} />

      {/* The next day: the guide asks once what a channel is for, and the replay translates. */}
      <g opacity={at(share, 0.36)}>
        <text x={0} y={392} style={{ ...mono, fill: c.ink }}>NEXT DAY</text>
        <text x={156} y={392} style={note}>REPLAY</text>
      </g>
      <g opacity={at(share, 0.38)}>
        <text x={0} y={N.replay - 68} style={note}>ASK ONCE WHAT A</text>
        <text x={0} y={N.replay - 40} style={note}>CHANNEL IS FOR</text>
      </g>
      <line x1={0} y1={N.replay} x2={talkEnd * replay} y2={N.replay} stroke={c.ink} strokeWidth={3} />
      {N.answers.map((x) => (
        <line
          key={x}
          x1={x}
          y1={N.replay - 18}
          x2={x}
          y2={N.replay + 18}
          stroke={c.ink}
          strokeWidth={5}
          opacity={span(replay, x / talkEnd - 0.12, x / talkEnd)}
        />
      ))}

      {/* The translation into roles, in the one colour. */}
      {translate > 0 && (
        <g stroke={c.signal} strokeWidth={3} fill="none">
          <line x1={talkEnd} y1={N.replay} x2={talkEnd + (N.roles - 14 - talkEnd) * translate} y2={N.replay} />
          {translate > 0.85 && <polyline points={`${N.roles - 24},${N.replay - 9} ${N.roles - 12},${N.replay} ${N.roles - 24},${N.replay + 9}`} opacity={(translate - 0.85) / 0.15} />}
        </g>
      )}
      {[0, 1, 2, 3].map((k) => (
        <rect
          key={k}
          x={N.roles + k * N.role.step}
          y={N.replay - N.role.size / 2}
          width={N.role.size}
          height={N.role.size}
          {...role(c, at(share, 0.72 + k * 0.03))}
          opacity={at(share, 0.4)}
        />
      ))}

      {/* What the replay came to: the counts, big, each under its column. */}
      <g opacity={at(share, 0.64)}>
        <text x={-6} y={770} style={large}>3</text>
        <text x={0} y={820} style={{ ...mono, fill: c.ink }}>ANSWERS</text>
      </g>
      <g opacity={at(share, 0.84)}>
        <text x={N.roles - 6} y={770} style={large}>4</text>
        <text x={N.roles} y={820} style={{ ...mono, fill: c.ink }}>ROLES</text>
      </g>
    </svg>
  );
};
