/* Renders the blog index from blog/posts.json into #blog-grid as cute cards.
   Fails gracefully when the file is missing or empty. */
(async function () {
  const grid = document.getElementById("blog-grid");
  if (!grid) return;

  const fmtDate = (iso) => {
    const d = new Date(iso);
    return isNaN(d) ? iso : d.toLocaleDateString(undefined, {
      year: "numeric", month: "long", day: "numeric",
    });
  };
  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  try {
    const res = await fetch("blog/posts.json");
    if (!res.ok) throw new Error(res.status);
    const posts = await res.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      grid.innerHTML = `<p class="lead">No posts yet — check back soon! 🌸</p>`;
      return;
    }

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    grid.innerHTML = posts
      .map((post) => {
        const tags = (post.tags || [])
          .map((t) => `<span class="tag">${esc(t)}</span>`)
          .join("");
        return `
        <a class="card card--link post-card reveal" href="blog/${esc(post.slug)}.html">
          <span class="post-meta">${esc(fmtDate(post.date))}</span>
          <h3>${esc(post.title)}</h3>
          <p>${esc(post.excerpt || "")}</p>
          <div class="tags">${tags}</div>
        </a>`;
      })
      .join("");

    // Re-run reveal for freshly inserted cards.
    document.dispatchEvent(new CustomEvent("content:rendered"));
  } catch (err) {
    console.warn("Could not load blog posts", err);
    grid.innerHTML = `<p class="lead">Posts couldn't load right now. 🥺</p>`;
  }
})();
