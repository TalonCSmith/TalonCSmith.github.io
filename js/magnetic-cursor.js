// Magnetic cursor by Osmo (https://osmo.supply), restyled as a bracket reticle.
// The follower and the Flip hand-off are Osmo's, unchanged. The bootstrap at the bottom marks
// every link on the page as a target (data-magnetic-cursor-target) and gives it a bg slot
// (data-magnetic-cursor-bg), so the cursor works on everything without hand-marking markup.
gsap.registerPlugin(Flip);

function initMagneticCursor() {

  const cursor = document.querySelector(".cursor");
  if(!cursor) return;

  const cursorBg = cursor.querySelector(".cursor-bg");

  // First, make the cursor div follow our mouse
  gsap.set(".cursor", {xPercent:-50, yPercent: -50});

  let xTo = gsap.quickTo(".cursor", "x", {duration: 0.6, ease: "power3"});
  let yTo = gsap.quickTo(".cursor", "y", {duration: 0.6, ease: "power3"});

  window.addEventListener("mousemove", e => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  // Then, make the setup for our flipping button
  const hoverTargets = document.querySelectorAll("[data-magnetic-cursor-target]");
  if(!hoverTargets.length) return;

  hoverTargets.forEach((target) => {
    const bgHolder = target.querySelector("[data-magnetic-cursor-bg]");

    target.addEventListener("mouseenter", () =>{
      // Register the 'state'
      const state = Flip.getState(cursorBg);

      // Add bg element into the link
      bgHolder.appendChild(cursorBg);

      // Create the Flip animation
      Flip.from(state,{
        ease:"back.out(1)",
        duration: 0.3,
        scale: false // animate width/height, not scale, so the corners keep their size
      });
    });

    target.addEventListener("mouseleave", () =>{
      // Register 'state' again, include opacity for subtle ease
      const state = Flip.getState(cursorBg,{
        props:"opacity"
      });

      // Add bg element back into the cursor
      cursor.appendChild(cursorBg);

      // Flip for a smooth animation
      Flip.from(state,{
        ease:"power4.out",
        duration: 0.5,
        scale: false
      });
    });
  });
}

// Site setup: mouse devices only, and never with reduced motion
function tagMagneticTargets() {
  document.querySelectorAll("a[href]:not(.skip-link):not(.hero__scroll)").forEach((link) => {
    // The slot is absolutely positioned inside the link, so the link must be a positioned box
    // (leave sticky/fixed/absolute links alone: they already are)
    if (getComputedStyle(link).position === "static") link.style.position = "relative";
    link.setAttribute("data-magnetic-cursor-target", "");
    const slot = document.createElement("span");
    slot.setAttribute("data-magnetic-cursor-bg", "");
    slot.setAttribute("aria-hidden", "true");
    link.appendChild(slot);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const mouse = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!window.gsap || !window.Flip || !mouse || calm) return;

  tagMagneticTargets();
  initMagneticCursor();

  // Stay hidden until the pointer first moves, and when it leaves the window
  const cursor = document.querySelector(".cursor");
  if (!cursor) return;
  window.addEventListener("mousemove", () => cursor.classList.add("is-active"), { once: true });
  document.documentElement.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  document.documentElement.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
});
