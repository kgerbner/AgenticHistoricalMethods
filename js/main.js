/* Global UI behaviour: mobile nav toggle, scroll-reveal, reduced-motion flag. */

// A single source of truth other scripts (p5 sketches) can read.
window.PREFERS_REDUCED_MOTION =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Touch detection — used to disable the cursor trail.
window.IS_TOUCH = window.matchMedia("(hover: none)").matches;

/* ---- Mobile nav toggle (wired after partials inject the nav) ---- */
function wireNav() {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close the menu after navigating on mobile.
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}
document.addEventListener("partials:loaded", wireNav);

/* ---- Scroll reveal ---- */
function wireReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if (window.PREFERS_REDUCED_MOTION || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}
document.addEventListener("DOMContentLoaded", wireReveal);
// Re-scan after data-driven content (blog/publications) is injected.
document.addEventListener("content:rendered", wireReveal);
