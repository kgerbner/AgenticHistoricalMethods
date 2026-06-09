/* Renders data/publications.json into #pub-list, grouped by `type`,
   sorted newest-first within each group. Fails gracefully. */
(async function () {
  const target = document.getElementById("pub-list");
  if (!target) return;

  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Display order + friendly labels for known types.
  const ORDER = [
    ["book", "Books"],
    ["article", "Articles & Chapters"],
    ["talk", "Talks & Presentations"],
    ["other", "Other"],
  ];

  try {
    const res = await fetch("data/publications.json");
    if (!res.ok) throw new Error(res.status);
    const items = await res.json();

    if (!Array.isArray(items) || items.length === 0) {
      target.innerHTML = `<p class="lead">Publications coming soon. 📚</p>`;
      return;
    }

    const groups = {};
    for (const it of items) {
      const key = (it.type || "other").toLowerCase();
      (groups[key] ||= []).push(it);
    }

    const html = ORDER.filter(([key]) => groups[key])
      .map(([key, label]) => {
        const list = groups[key]
          .sort((a, b) => (b.year || 0) - (a.year || 0))
          .map((it) => {
            const link = it.url
              ? ` <a href="${esc(it.url)}" target="_blank" rel="noopener">↗</a>`
              : "";
            const meta = [it.venue, it.year].filter(Boolean).map(esc).join(", ");
            return `
            <li>
              <span class="pub-title">${esc(it.title)}</span>${link}<br />
              ${it.authors ? `<span class="pub-meta">${esc(it.authors)}</span><br />` : ""}
              ${meta ? `<span class="pub-meta">${meta}</span>` : ""}
            </li>`;
          })
          .join("");
        return `<div class="pub-group reveal"><h3>${esc(label)}</h3><ul class="pub-list">${list}</ul></div>`;
      })
      .join("");

    target.innerHTML = html;
    document.dispatchEvent(new CustomEvent("content:rendered"));
  } catch (err) {
    console.warn("Could not load publications", err);
    target.innerHTML = `<p class="lead">Publications couldn't load right now. 🥺</p>`;
  }
})();
