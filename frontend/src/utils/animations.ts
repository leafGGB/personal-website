export function run(
  el: HTMLElement,
  from: number,
  to: number,
  dur: number
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - (1 - t) * (1 - t);
      el.style.opacity = String(from + (to - from) * ease);
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}
