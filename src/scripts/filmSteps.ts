// A bar of one segment per act under a film: the segment of the act that is playing fills up, earlier ones
// stay full, and a click on a segment plays that act again. Markup comes from FilmSteps.astro.

export interface ActMark {
  at: number;
  label: string;
}

export function bindSteps(video: HTMLVideoElement, root: HTMLElement, acts: ActMark[]) {
  const steps = [...root.querySelectorAll<HTMLButtonElement>('[data-step]')];
  const fills = steps.map((step) => step.querySelector<HTMLElement>('[data-fill]'));
  const label = root.querySelector('[data-step-label]');
  let request = 0;

  const end = (i: number) => acts[i + 1]?.at ?? (Number.isFinite(video.duration) ? video.duration : acts[i].at + 1);

  const sync = () => {
    const t = video.ended ? Infinity : video.currentTime;
    let current = 0;
    acts.forEach((act, i) => {
      const share = Math.min(1, Math.max(0, (t - act.at) / (end(i) - act.at)));
      fills[i]?.style.setProperty('transform', `scaleX(${share})`);
      if (t >= act.at) current = i;
    });
    steps.forEach((step, i) => {
      if (i === current) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
    if (label) label.textContent = acts[current].label;
    if (!video.paused && !video.ended) request = window.requestAnimationFrame(sync);
  };

  const run = () => {
    window.cancelAnimationFrame(request);
    request = window.requestAnimationFrame(sync);
  };

  video.addEventListener('play', run);
  video.addEventListener('seeked', sync);
  video.addEventListener('ended', sync);
  video.addEventListener('loadedmetadata', sync);

  steps.forEach((step, i) =>
    step.addEventListener('click', (event) => {
      // The row under the panel must not take this click as a choice of its own.
      event.stopPropagation();
      video.currentTime = acts[i].at;
      video.play().catch(() => {});
    }),
  );

  sync();
  return { sync };
}
