// Drives the opening stage of a case page (version J, CaseStage.astro). The scene is the project's film from
// motion/src, drawn live with Preact instead of played as video, so the page can choose the frame:
// on arrival the first act plays by itself, then the scroll position is the clock, from the top of the page on. The frame follows the
// scroll with a little lag, which gives the scroll its weight. Landscape screens, a phone held sideways too, get
// the 1600 × 900 stage scene; portrait screens the 4:5 poster film. With reduced motion the stage does not pin and shows the
// last frame, the result; the steps then switch between the end states of the acts.
import { h, render, type VNode } from 'preact';
// The films are written for React: compat turns their SVG props (fontSize, strokeWidth …) into attributes.
import 'preact/compat';
import { FrameContext } from '../../scripts/remotion-shim';
import { palettes, type Palette, type Theme } from '../../../motion/src/style';
import { Saunter, SAUNTER_FRAMES, speedAt } from '../../../motion/src/saunter/Saunter';
import { Flowculate, FLOWCULATE_FRAMES } from '../../../motion/src/flowculate/Flowculate';
import { SaunterStage } from '../../../motion/src/stage/SaunterStage';
import { FlowculateStage } from '../../../motion/src/stage/FlowculateStage';
import { Constat } from '../../../motion/src/constat/Constat';
import { ConstatStage, CONSTAT_STAGE_FRAMES } from '../../../motion/src/stage/ConstatStage';
import { Notenprogramm, NOTENPROGRAMM_FRAMES } from '../../../motion/src/notenprogramm/Notenprogramm';
import { NotenprogrammStage } from '../../../motion/src/stage/NotenprogrammStage';
import { Minutes, MINUTES_FRAMES } from '../../../motion/src/minutes/Minutes';
import { MinutesStage } from '../../../motion/src/stage/MinutesStage';
import { SayFit, SAYFIT_FRAMES } from '../../../motion/src/sayfit/SayFit';
import { SayFitStage } from '../../../motion/src/stage/SayFitStage';
import { Beleg, BELEG_FRAMES } from '../../../motion/src/beleg/Beleg';
import { BelegStage } from '../../../motion/src/stage/BelegStage';
import { Tealucent, TEALUCENT_FRAMES } from '../../../motion/src/tealucent/Tealucent';
import { TealucentStage } from '../../../motion/src/stage/TealucentStage';
import { Conactive, CONACTIVE_FRAMES } from '../../../motion/src/conactive/Conactive';
import { ConactiveStage } from '../../../motion/src/stage/ConactiveStage';
import { Stayin, STAYIN_FRAMES } from '../../../motion/src/stayin/Stayin';
import { StayinStage } from '../../../motion/src/stage/StayinStage';
import { Iot, IOT_FRAMES } from '../../../motion/src/iot/Iot';
import { IotStage } from '../../../motion/src/stage/IotStage';
import { LakeGoal } from './LakeGoal';
import { FlowculateName } from './FlowculateName';
import { SayFitFigure } from './SayFitFigure';
import { LevelworkFigure } from './LevelworkFigure';
import { LevelworkMark } from './LevelworkMark';
import { LevelworkInterview } from './LevelworkInterview';
import { NotenFigure } from './NotenFigure';
import { MinutesFigure } from './MinutesFigure';
import { TealucentFigure } from './TealucentFigure';
import { ConactiveFigure } from './ConactiveFigure';
import { StayinFigure } from './StayinFigure';
import { IotFigure } from './IotFigure';
import { BelegFigure } from './BelegFigure';

interface Scene {
  frames: number;
  /** The frame the stage plays to by itself before the scroll takes over. */
  intro: number;
  /** First frame of each act, in the order of the steps under the stage. */
  acts: number[];
  wide: (palette: Palette, belt: number) => VNode;
  tall: (theme: Theme) => VNode;
  /** Belt speed per frame, for scenes whose drawing keeps moving in real time. */
  speedAt?: (frame: number) => number;
}

const scenes: Record<string, Scene> = {
  saunter: {
    frames: SAUNTER_FRAMES,
    intro: 48,
    acts: [0, 64, 136],
    wide: (palette, belt) => h(SaunterStage, { palette, belt }),
    tall: (theme) => h(Saunter, { theme }),
    speedAt,
  },
  flowculate: {
    frames: FLOWCULATE_FRAMES,
    intro: 32,
    acts: [0, 34, 100],
    wide: (palette) => h(FlowculateStage, { palette }),
    tall: (theme) => h(Flowculate, { theme, titles: true }),
  },
  constat: {
    frames: CONSTAT_STAGE_FRAMES,
    intro: 52,
    acts: [0, 64, 132],
    wide: (palette) => h(ConstatStage, { palette }),
    tall: (theme) => h(Constat, { theme }),
  },
  notenprogramm: {
    frames: NOTENPROGRAMM_FRAMES,
    intro: 52,
    acts: [0, 64, 136],
    wide: (palette) => h(NotenprogrammStage, { palette }),
    tall: (theme) => h(Notenprogramm, { theme }),
  },
  minutes: {
    frames: MINUTES_FRAMES,
    intro: 52,
    acts: [0, 64, 136],
    wide: (palette) => h(MinutesStage, { palette }),
    tall: (theme) => h(Minutes, { theme }),
  },
  sayfit: {
    frames: SAYFIT_FRAMES,
    intro: 62,
    acts: [0, 64, 136],
    wide: (palette) => h(SayFitStage, { palette }),
    tall: (theme) => h(SayFit, { theme }),
  },
  beleg: {
    frames: BELEG_FRAMES,
    intro: 52,
    acts: [0, 64, 136],
    wide: (palette) => h(BelegStage, { palette }),
    tall: (theme) => h(Beleg, { theme }),
  },
  tealucent: {
    frames: TEALUCENT_FRAMES,
    intro: 52,
    acts: [0, 64, 136],
    wide: (palette) => h(TealucentStage, { palette }),
    tall: (theme) => h(Tealucent, { theme }),
  },
  conactive: {
    frames: CONACTIVE_FRAMES,
    intro: 52,
    acts: [0, 64, 136],
    wide: (palette) => h(ConactiveStage, { palette }),
    tall: (theme) => h(Conactive, { theme }),
  },
  stayin: {
    frames: STAYIN_FRAMES,
    intro: 52,
    acts: [0, 64, 136],
    wide: (palette) => h(StayinStage, { palette }),
    tall: (theme) => h(Stayin, { theme }),
  },
  iot: {
    frames: IOT_FRAMES,
    intro: 52,
    acts: [0, 64, 136],
    wide: (palette) => h(IotStage, { palette }),
    tall: (theme) => h(Iot, { theme }),
  },
};

/** Of the scroll through the stage, this share runs the scene; the rest holds the result before it unpins. */
const RUN = 0.86;
const BELT_PER_SECOND = 95;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** The scenes take the page's own tokens, so they sit on the paper with no ground of their own. */
const readTokens = (element: HTMLElement): Palette => {
  const css = getComputedStyle(element);
  const token = (name: string) => css.getPropertyValue(name).trim();
  return { ground: token('--paper'), ink: token('--ink'), mute: token('--mute'), hair: token('--hair'), signal: token('--signal') };
};

export function mountStage(root: HTMLElement) {
  const scene = scenes[root.dataset.stage ?? ''];
  const canvas = root.querySelector<HTMLElement>('[data-stage-canvas]');
  if (!scene || !canvas) return;
  const steps = [...root.querySelectorAll<HTMLButtonElement>('[data-stage-step]')];
  const label = root.querySelector<HTMLElement>('[data-stage-label]');
  const last = scene.frames - 1;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wideScreen = window.matchMedia('(min-width: 560px) and (min-aspect-ratio: 1/1)');
  const dark = window.matchMedia('(prefers-color-scheme: dark)');

  let palette = readTokens(root);

  let intro = 0;
  let shown = 0;
  let belt = 0;
  let chosen: number | null = null;
  let drawnKey = '';

  // The clock starts with the page's first pixel of scroll, not when the stage reaches the top: the stretch
  // above it (header, margin) already moves the scene, so the first scroll never feels dead.
  const runway = () => root.getBoundingClientRect().top + window.scrollY + root.offsetHeight - window.innerHeight;
  const scrollShare = () => {
    const total = runway();
    return total > 0 ? clamp(window.scrollY / total) : 0;
  };

  const target = () => {
    if (reduce.matches) return chosen ?? last;
    const share = scrollShare();
    if (share === 0) return intro;
    return Math.max(intro, scene.intro + clamp(share / RUN) * (last - scene.intro));
  };

  const draw = (frame: number) => {
    const wide = wideScreen.matches;
    const key = `${frame}|${wide}|${Math.round(belt)}|${palette.ink}`;
    if (key === drawnKey) return;
    drawnKey = key;
    const theme: Theme = dark.matches ? 'dark' : 'light';
    // The poster films read their colours from the palettes; give the current one the page's paper.
    Object.assign(palettes[theme], palette);
    canvas.dataset.layout = wide ? 'wide' : 'tall';
    render(
      h(FrameContext.Provider, { value: wide ? { frame, width: 1600, height: 900 } : { frame, width: 800, height: 1000 } }, [
        wide ? scene.wide(palette, belt) : scene.tall(theme),
      ]),
      canvas,
    );

    steps.forEach((step, i) => {
      const from = scene.acts[i];
      const to = scene.acts[i + 1] ?? last;
      step.style.setProperty('--fill', String(clamp((frame - from) / (to - from))));
      const current = frame >= from && (i === steps.length - 1 || frame < to);
      if (current) {
        step.setAttribute('aria-current', 'step');
        if (label) label.textContent = step.dataset.label ?? '';
      } else step.removeAttribute('aria-current');
    });
    root.toggleAttribute('data-scrolled', scrollShare() > 0.01);
  };

  let running = false;
  let then = 0;
  const tick = (now: number) => {
    if (!running) return;
    const dt = Math.min(0.1, (now - then) / 1000 || 0);
    then = now;
    if (!reduce.matches) intro = Math.min(scene.intro, intro + dt * 30);
    const goal = target();
    shown = reduce.matches ? goal : shown + (goal - shown) * (1 - Math.exp(-dt * 7));
    if (Math.abs(goal - shown) < 0.02) shown = goal;
    const frame = Math.round(shown);
    if (scene.speedAt && !reduce.matches) belt += scene.speedAt(frame) * dt * BELT_PER_SECOND;
    draw(frame);
    requestAnimationFrame(tick);
  };

  new IntersectionObserver((entries) => {
    const visible = entries[0].isIntersecting;
    if (visible && !running) {
      running = true;
      then = performance.now();
      requestAnimationFrame(tick);
    } else if (!visible) running = false;
  }).observe(root);

  // A step jumps to its act: by scrolling to where the act has settled, or, with reduced motion, to its end state.
  steps.forEach((step, i) => {
    step.addEventListener('click', () => {
      const from = scene.acts[i];
      const to = scene.acts[i + 1] ?? last;
      if (reduce.matches) {
        chosen = i === steps.length - 1 ? last : to - 1;
        draw(chosen);
        return;
      }
      const settled = i === 0 ? 0 : from + (to - from) * 0.55;
      const share = clamp((settled - scene.intro) / (last - scene.intro)) * RUN;
      window.scrollTo({ top: share * runway() + (i === 0 ? 0 : 1), behavior: 'smooth' });
    });
  });

  dark.addEventListener('change', () => {
    palette = readTokens(root);
    draw(Math.round(shown));
  });
  wideScreen.addEventListener('change', () => draw(Math.round(shown)));
  reduce.addEventListener('change', () => draw(Math.round(target())));

  shown = reduce.matches ? last : 0;
  draw(Math.round(shown));
}

/** Figures in the case text that pick the stage up again, drawn as they pass through the viewport. */
/** A figure narrower than this is drawn in its narrow version: taller, with fewer things side by side and labels
 * large enough to read on a phone. */
const NARROW = 600;

const figures: Record<string, (palette: Palette, share: number, narrow: boolean) => VNode> = {
  'saunter-lake': (palette, share) => h(LakeGoal, { palette, share }),
  // "A brand drawn from the maths": flow plus calculate gives the mark, then the lockup.
  'flowculate-name': (palette, share, narrow) => h(FlowculateName, { palette, share, narrow }),
  // "Stricter prompts, not longer ones": both prompts step back to their new length, structure takes the place of prose.
  'sayfit-prompts': (palette, share, narrow) => h(SayFitFigure, { palette, share, narrow }),
  // "How fast we learn": the first run captures nothing, the replay with the new guide finds four roles after three answers.
  'levelwork-roles': (palette, share, narrow) => h(LevelworkFigure, { palette, share, narrow }),
  // "What I made": the frame is the role as designed, the bar the role as lived, its overshoot the part nobody wrote down; then the lockup.
  'levelwork-mark': (palette, share, narrow) => h(LevelworkMark, { palette, share, narrow }),
  // "What I made", the experience: a vague answer is followed up, not noted; the next one lands in the record with its passage.
  'levelwork-interview': (palette, share, narrow) => h(LevelworkInterview, { palette, share, narrow }),
  // "Check, don't retype": every bar of every voice, then only the open questions stay.
  'noten-questions': (palette, share, narrow) => h(NotenFigure, { palette, share, narrow }),
  // "Agenda items from the meeting documents": the first run went by what the chair announced; now the documents set the items and empty ones are flagged.
  'minutes-agenda': (palette, share, narrow) => h(MinutesFigure, { palette, share, narrow }),
  // "Tokens in three tiers": one value through global, alias and component token; the alias switches the modes.
  'tealucent-tokens': (palette, share, narrow) => h(TealucentFigure, { palette, share, narrow }),
  // "Office work has not changed much": the old channels multiply onto one screen, then leave it as objects.
  'conactive-channels': (palette, share, narrow) => h(ConactiveFigure, { palette, share, narrow }),
  // "One iPad that carried the whole exhibition": the visitor climbs the tower floor by floor.
  'stayin-floors': (palette, share, narrow) => h(StayinFigure, { palette, share, narrow }),
  // "Model the use, not the network": the wiring sorts itself into rooms, people and services.
  'iot-model': (palette, share, narrow) => h(IotFigure, { palette, share, narrow }),
  // "Several receipts, one scan": where the glass is cut, columns first, then rows, specks dropped.
  'beleg-split': (palette, share, narrow) => h(BelegFigure, { palette, share, narrow }),
};

export function mountFigure(root: HTMLElement) {
  const figure = figures[root.dataset.scrub ?? ''];
  if (!figure) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  let drawn = -1;
  let palette = readTokens(root);

  // The figure runs while it is wholly on screen: 0 once its bottom has come up to 95 % of the height, 1 when
  // its top is about to leave. Starting as it entered meant the drawing had mostly run before it could be seen.
  // A figure too tall for that still gets a third of a screen of scroll, centred on the same stretch.
  const share = () => {
    if (reduce.matches) return 1;
    const { top, height } = root.getBoundingClientRect();
    const screen = window.innerHeight;
    let from = screen * 0.95 - height;
    let to = screen * 0.12;
    const least = screen * 0.35;
    if (from - to < least) {
      const middle = (from + to) / 2;
      from = middle + least / 2;
      to = middle - least / 2;
    }
    return clamp((from - top) / (from - to));
  };
  // The page gives a ratio per version; the narrow one only where the figure has one.
  const ratio = { wide: root.dataset.ratio ?? '', narrow: root.dataset.ratioNarrow ?? root.dataset.ratio ?? '' };
  let narrow: boolean | null = null;
  // The drawing follows the scroll with a short glide instead of jumping with every notch of a mouse wheel
  // (Robert, 27 Oct 2026: "nicht so ruckelig"): each frame it closes part of the gap to where the scroll is.
  let shown = share();
  let glideFrom = 0;
  let gliding = false;
  const draw = (force = false) => {
    const now = Math.round(shown * 2000) / 2000;
    const thin = root.clientWidth < NARROW;
    if (now === drawn && thin === narrow && !force) return;
    drawn = now;
    if (thin !== narrow) root.style.aspectRatio = thin ? ratio.narrow : ratio.wide;
    narrow = thin;
    render(figure(palette, now, thin), root);
  };
  const glide = (time: number) => {
    const target = share();
    const dt = glideFrom ? Math.min(64, time - glideFrom) : 16;
    glideFrom = time;
    shown = reduce.matches ? target : shown + (target - shown) * (1 - Math.exp(-dt / 110));
    if (Math.abs(target - shown) < 0.0005) shown = target;
    draw();
    if (shown !== target) requestAnimationFrame(glide);
    else {
      gliding = false;
      glideFrom = 0;
    }
  };
  new ResizeObserver(() => {
    shown = share();
    draw();
  }).observe(root);

  const onScroll = () => {
    if (gliding) return;
    gliding = true;
    requestAnimationFrame(glide);
  };
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      window.addEventListener('scroll', onScroll, { passive: true });
      shown = share();
      draw();
    } else window.removeEventListener('scroll', onScroll);
  }).observe(root);
  dark.addEventListener('change', () => {
    palette = readTokens(root);
    draw(true);
  });
  draw(true);
}
