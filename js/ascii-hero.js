// Plays the ASCII animation behind the hero (frames live in js/ascii-frames.js).
// Same timing as talon.webflow.io: 40ms per frame, looping.
(() => {
  const frames = window.ASCII_FRAMES;
  const el = document.querySelector(".hero__ascii");
  if (!frames || !frames.length || !el) return;

  const FRAME_MS = 40;
  const section = el.parentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let index = 0;
  let elapsed = 0;
  let last = 0;
  let raf = 0;

  const show = (i) => {
    el.textContent = frames[i];
  };

  function tick(now) {
    elapsed += now - last;
    last = now;
    const next = Math.floor(elapsed / FRAME_MS) % frames.length;
    if (next !== index) {
      index = next;
      show(index);
    }
    raf = requestAnimationFrame(tick);
  }

  const play = () => {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const pause = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  show(0);

  // Only animate while the hero is on screen, and never with reduced motion
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !reducedMotion.matches) play();
    else pause();
  }).observe(section);
})();
