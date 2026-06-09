/* Injects shared nav + footer from /partials so they live in one place.
   Requires the site to be served over HTTP (GitHub Pages, or a local static
   server) because it uses fetch — it will NOT work from file://.

   Each page has:  <div data-include="nav"></div> ... <div data-include="footer"></div>
   and sets <body data-page="home|about|claude|tutorials|publications|blog">.
*/
(async function () {
  const slots = document.querySelectorAll("[data-include]");

  // Resolve partials relative to the site root. Pages in /blog/ need "../".
  const inBlog = location.pathname.includes("/blog/");
  const base = inBlog ? "../partials/" : "partials/";

  await Promise.all(
    Array.from(slots).map(async (slot) => {
      const name = slot.getAttribute("data-include");
      try {
        const res = await fetch(`${base}${name}.html`);
        if (!res.ok) throw new Error(res.status);
        let html = await res.text();
        // Fix relative links for pages living in /blog/
        if (inBlog) html = html.replace(/(href|src)="(?!https?:|mailto:|#|\.\.?\/)/g, '$1="../');
        slot.outerHTML = html;
      } catch (err) {
        console.warn(`Could not load partial "${name}"`, err);
      }
    })
  );

  // Mark the active nav link.
  const page = document.body.getAttribute("data-page");
  if (page) {
    const link = document.querySelector(`.nav__links a[data-nav="${page}"]`);
    if (link) link.setAttribute("aria-current", "page");
  }

  // Fill the footer year.
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Now that nav exists, wire up its behaviour.
  document.dispatchEvent(new CustomEvent("partials:loaded"));
})();
