/* Hero animation — drifting cute particles (hearts, stars, clouds, sparkles)
   rising with a gentle sine sway plus light mouse parallax.
   Instance-mode p5 mounted into #hero-canvas. Gated off for reduced motion. */
(function () {
  const mount = document.getElementById("hero-canvas");
  if (!mount) return;
  if (window.PREFERS_REDUCED_MOTION) return; // CSS provides a static gradient

  const PALETTE = ["#ffb7ce", "#e0bbe4", "#aee2ff", "#b5ead7", "#fff5ba", "#ff8fb1"];
  const GLYPHS = ["♥", "✿", "★", "✦", "☁", "❀"];

  const sketch = (p) => {
    let particles = [];
    let visible = true;

    function makeParticle(atBottom) {
      const w = mount.clientWidth || 800;
      const h = mount.clientHeight || 600;
      return {
        x: p.random(w),
        y: atBottom ? h + p.random(40) : p.random(h),
        size: p.random(16, 40),
        speed: p.random(0.3, 1.1),
        sway: p.random(0.6, 1.8),
        phase: p.random(p.TWO_PI),
        rot: p.random(p.TWO_PI),
        rotSpeed: p.random(-0.01, 0.01),
        color: p.random(PALETTE),
        glyph: p.random(GLYPHS),
        alpha: p.random(140, 230),
      };
    }

    p.setup = () => {
      const c = p.createCanvas(mount.clientWidth, mount.clientHeight);
      c.parent(mount);
      p.textAlign(p.CENTER, p.CENTER);
      p.frameRate(40);
      const count = p.constrain(p.floor((p.width * p.height) / 16000), 28, 60);
      particles = Array.from({ length: count }, () => makeParticle(false));

      // Pause when the hero scrolls out of view.
      if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
          visible = entries[0].isIntersecting;
          visible ? p.loop() : p.noLoop();
        }).observe(mount);
      }
    };

    p.draw = () => {
      p.clear();
      const mx = (p.mouseX / p.width - 0.5) || 0;

      for (const o of particles) {
        o.y -= o.speed;
        o.phase += 0.01;
        o.rot += o.rotSpeed;
        const x = o.x + Math.sin(o.phase) * o.sway * 8 + mx * o.size * 0.6;

        if (o.y < -50) Object.assign(o, makeParticle(true));

        p.push();
        p.translate(x, o.y);
        p.rotate(o.rot);
        p.fill(p.color(o.color + hex(o.alpha)));
        p.noStroke();
        p.textSize(o.size);
        p.text(o.glyph, 0, 0);
        p.pop();
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(mount.clientWidth, mount.clientHeight);
    };

    function hex(a) {
      const v = Math.round(a).toString(16);
      return v.length === 1 ? "0" + v : v;
    }
  };

  new p5(sketch);
})();
