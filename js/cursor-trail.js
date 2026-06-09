/* Sparkle / heart cursor trail. Pointer-events:none overlay canvas.
   Disabled on touch devices and for reduced-motion users. */
(function () {
  if (window.PREFERS_REDUCED_MOTION || window.IS_TOUCH) return;

  const GLYPHS = ["✨", "♥", "✦", "❀", "★"];
  const COLORS = ["#ff8fb1", "#c89fe0", "#8fd0f5", "#ffb7ce"];

  const sketch = (p) => {
    let sparks = [];
    let lastSpawn = 0;

    p.setup = () => {
      const c = p.createCanvas(window.innerWidth, window.innerHeight);
      c.id("cursor-canvas");
      c.parent(document.body);
      p.textAlign(p.CENTER, p.CENTER);
      p.frameRate(40);
    };

    window.addEventListener("pointermove", (e) => {
      const now = performance.now();
      if (now - lastSpawn < 45) return; // throttle
      lastSpawn = now;
      sparks.push({
        x: e.clientX,
        y: e.clientY,
        vy: p.random(-0.6, -0.2),
        vx: p.random(-0.4, 0.4),
        life: 1,
        size: p.random(12, 22),
        glyph: p.random(GLYPHS),
        color: p.random(COLORS),
      });
      if (sparks.length > 60) sparks.shift();
    });

    p.draw = () => {
      p.clear();
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.025;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }

        p.push();
        p.translate(s.x, s.y);
        p.scale(s.life + 0.3);
        const a = Math.round(s.life * 255).toString(16).padStart(2, "0");
        p.fill(p.color(s.color + a));
        p.noStroke();
        p.textSize(s.size);
        p.text(s.glyph, 0, 0);
        p.pop();
      }
    };

    p.windowResized = () => p.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  new p5(sketch);
})();
