// Sizes each line of the stacked hero headline so its visible letters span the same width
// (on desktop, the same width as the buttons below it).
// Measures the real ink of each line (not just the text box), so side-bearings don't leave
// the edges ragged, then nudges the line left so the ink starts on the shared edge.
(() => {
  const title = document.querySelector(".hero__title--stacked");
  if (!title) return;

  const lines = [...title.querySelectorAll(".hero__line")];
  const ctx = document.createElement("canvas").getContext("2d");
  const PROBE = 200; // measure at a large size for precision

  // On desktop the headline is as wide as the buttons row (first button's left edge to the
  // last button's right edge). On smaller screens the CSS width applies.
  const actions = document.querySelector(".hero__actions");
  const desktop = window.matchMedia("(min-width: 861px)");

  function matchButtons() {
    title.style.width = "";
    if (!actions || !desktop.matches) return;
    const boxes = [...actions.children].map((el) => el.getBoundingClientRect());
    if (!boxes.length) return;
    const left = Math.min(...boxes.map((b) => b.left));
    const right = Math.max(...boxes.map((b) => b.right));
    title.style.width = `${right - left}px`;
  }

  function fit() {
    matchButtons();
    const width = title.clientWidth;
    for (const line of lines) {
      const cs = getComputedStyle(line);
      ctx.font = `${cs.fontWeight} ${PROBE}px ${cs.fontFamily}`;
      const m = ctx.measureText(line.textContent.trim().toUpperCase());
      const bearing = -m.actualBoundingBoxLeft; // gap before the first letter's ink
      const ink = m.actualBoundingBoxRight - bearing;
      const size = (PROBE * width) / ink;
      line.style.fontSize = `${size}px`;
      line.style.marginLeft = `${(-bearing * size) / PROBE}px`;
    }
  }

  fit();
  document.fonts.ready.then(fit); // measure again once Purista has loaded
  window.addEventListener("resize", fit);
})();
