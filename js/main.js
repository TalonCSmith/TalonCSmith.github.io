// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Smooth-scroll in-page links, but only after load so a #section in the URL lands on it
window.addEventListener("load", () => {
  document.documentElement.classList.add("smooth-scroll");
});

// Fade sections in as they scroll into view
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("js");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
}
