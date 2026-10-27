// Flowculate film, the model: a hall and a corridor in metres, the numbers that describe them,
// and a small deterministic crowd that walks to the exits. Nothing here is the real Flowculate maths;
// it only has to read like a plan and behave like people at a door.
import { seeded } from '../random';

export const SCALE = 32; // px per metre
export const PLAN = { w: 21, h: 15 };

type Segment = [number, number, number, number];

export const walls: Segment[] = [
  [0, 0, 21, 0],
  [21, 0, 21, 9],
  [21, 11, 21, 15],
  [21, 15, 5, 15],
  [3, 15, 0, 15],
  [0, 15, 0, 0],
  [14, 0, 14, 6],
  [14, 8, 14, 15],
];

/** Double doors: two hinges, leaves swing towards `dir`. */
export const doors = [
  { hinges: [[21, 9], [21, 11]], dir: [1, 0] },
  { hinges: [[3, 15], [5, 15]], dir: [0, 1] },
  { hinges: [[14, 6], [14, 8]], dir: [1, 0] },
] as const;

export const pillars = [
  { x: 4.6, y: 4.2 },
  { x: 9.4, y: 4.2 },
  { x: 4.6, y: 9.8 },
  { x: 9.4, y: 9.8 },
];
export const PILLAR = 0.8;

const fmt = (n: number) => n.toFixed(1).padStart(5, ' ');

/** The input as it had to be typed before the app existed. */
export const rows: { label: string; values: string[] }[] = [
  ...walls.map((w) => ({ label: 'WALL', values: w.map(fmt) })),
  { label: 'EXIT', values: [21, 9, 21, 11].map(fmt) },
  { label: 'EXIT', values: [3, 15, 5, 15].map(fmt) },
  { label: 'PERSONS', values: ['48'] },
  { label: 'SPEED', values: ['1.34'] },
];

const EXIT_A = { x: 21, y: 10 };
const EXIT_B = { x: 4, y: 15 };
const INNER = { x: 14, y: 7 };

/** Where someone at (x, y) heads next. Used for the people and for the arrow field. */
export const targetFor = (x: number, y: number, viaInner?: boolean) => {
  if (x > 14.2) return EXIT_A;
  const toB = Math.hypot(EXIT_B.x - x, EXIT_B.y - y);
  const toInner = Math.hypot(INNER.x - x, INNER.y - y) + 3; // the corridor is the longer way out
  if (viaInner === undefined) return toB < toInner ? EXIT_B : INNER;
  return viaInner ? INNER : EXIT_B;
};

export const FIRST_MOVE = 72;
export const LAST_FRAME = 179;

export type Person = { x: number; y: number; gone: number | null };

/** Positions for every frame, computed once. gone = frame the person left through a door. */
export const simulate = () => {
  const rand = seeded(2022);
  const people: { x: number; y: number; speed: number; viaInner: boolean; gone: number | null }[] = [];
  while (people.length < 48) {
    const inCorridor = people.length >= 38;
    const x = inCorridor ? 14.8 + rand() * 5.4 : 0.8 + rand() * 12.4;
    const y = 0.8 + rand() * 13.4;
    const nearPillar = pillars.some((p) => Math.abs(p.x - x) < 0.9 && Math.abs(p.y - y) < 0.9);
    const crowded = people.some((p) => Math.hypot(p.x - x, p.y - y) < 0.7);
    if (nearPillar || crowded) continue;
    const viaInner = targetFor(x, y) === INNER;
    people.push({ x, y, speed: 0.1 + rand() * 0.045, viaInner, gone: null });
  }

  const frames: Person[][] = [];
  for (let f = 0; f <= LAST_FRAME; f++) {
    if (f > FIRST_MOVE) {
      for (const p of people) {
        if (p.gone !== null) {
          // Keep walking out of the door for a few frames, then stop drawing.
          if (p.x > 20.9) p.x += p.speed;
          else p.y += p.speed;
          continue;
        }
        const t = targetFor(p.x, p.y, p.viaInner);
        const d = Math.hypot(t.x - p.x, t.y - p.y) || 1;
        let dx = (t.x - p.x) / d;
        let dy = (t.y - p.y) / d;
        // Pillars push the way sideways, so nobody walks into one and stays there.
        for (const q of pillars) {
          const ox = p.x - q.x;
          const oy = p.y - q.y;
          const dq = Math.hypot(ox, oy) || 1;
          const weight = Math.max(0, 1.6 - dq) * 1.4;
          dx += (ox / dq) * weight + (Math.abs(ox) < 0.05 ? 0.3 : 0);
          dy += (oy / dq) * weight;
        }
        const n = Math.hypot(dx, dy) || 1;
        p.x += (dx / n) * p.speed;
        p.y += (dy / n) * p.speed;
      }
      // Keep a body's width between people: this is what makes the doors jam.
      for (let i = 0; i < people.length; i++) {
        for (let j = i + 1; j < people.length; j++) {
          const a = people[i];
          const b = people[j];
          if (a.gone !== null || b.gone !== null) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy);
          if (d > 0 && d < 0.62) {
            const push = (0.62 - d) / 2;
            a.x -= (dx / d) * push;
            a.y -= (dy / d) * push;
            b.x += (dx / d) * push;
            b.y += (dy / d) * push;
          }
        }
      }
      for (const p of people) {
        if (p.gone !== null) continue;
        for (const q of pillars) {
          const half = PILLAR / 2 + 0.3;
          const ox = p.x - q.x;
          const oy = p.y - q.y;
          if (Math.abs(ox) < half && Math.abs(oy) < half) {
            if (half - Math.abs(ox) < half - Math.abs(oy)) p.x = q.x + Math.sign(ox || 1) * half;
            else p.y = q.y + Math.sign(oy || 1) * half;
          }
        }
        // Walls: the inner wall only opens at its door, the outer walls only at the exits.
        if (p.x < 14 && p.x > 13.7 && (p.y < 6.3 || p.y > 7.7)) p.x = 13.7;
        if (p.x > 14 && p.x < 14.3 && (p.y < 6.3 || p.y > 7.7)) p.x = 14.3;
        p.y = Math.max(0.3, p.y);
        p.x = Math.max(0.3, p.x);
        if (p.y > 14.7 && !(p.x > 3.3 && p.x < 4.7)) p.y = 14.7;
        if (p.x > 20.7 && !(p.y > 9.3 && p.y < 10.7)) p.x = 20.7;
        if (p.x > 14.3 && p.viaInner) p.viaInner = false;
        if (p.x > 21 || p.y > 15) p.gone = f;
      }
    }
    frames.push(people.map((p) => ({ x: p.x, y: p.y, gone: p.gone })));
  }
  return frames;
};
