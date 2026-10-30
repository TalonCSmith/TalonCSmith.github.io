// Footer parallax by Osmo (https://osmo.supply): the footer slides up into place as it scrolls
// into view while a dark layer fades off it. Tweak yPercent to change the amount of parallax.
gsap.registerPlugin(ScrollTrigger);

function initFooterParallax() {
  document.querySelectorAll("[data-footer-parallax]").forEach((el) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "clamp(top bottom)",
        end: "clamp(top top)",
        scrub: true,
      },
    });

    const inner = el.querySelector("[data-footer-parallax-inner]");
    const dark = el.querySelector("[data-footer-parallax-dark]");

    if (inner) {
      tl.from(inner, {
        yPercent: -25,
        ease: "linear",
      });
    }

    if (dark) {
      tl.from(
        dark,
        {
          opacity: 0.5,
          ease: "linear",
        },
        "<"
      );
    }
  });
}

// Initialize footer with parallax effect (skipped when GSAP didn't load or motion is reduced)
document.addEventListener("DOMContentLoaded", () => {
  if (window.gsap && window.ScrollTrigger && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    initFooterParallax();
  }
});
