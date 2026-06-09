/* Subtle fixed-background animation for inner pages — slow floating pastel
   blobs/bubbles. Low density + low frame rate to stay light. Gated for
   reduced motion. Mounts into #ambient-canvas. */
(function () {
  const mount = document.getElementById("ambient-canvas");
  if (!mount) return;
  if (window.PREFERS_REDUCED_MOTION) return;

  const PALETTE = ["#ffd1dc", "#e0bbe4", "#aee2ff", "#b5ead7"];

  const sketch = (p) => {
    let blobs = [];

    function makeBlob() {
      return {
        x: p.random(p.width),
        y: p.random(p.height),
        r: p.random(60, 160),
        dx: p.random(-0.25, 0.25),
        dy: p.random(-0.3, -0.05),
        color: p.random(PALETTE),
      };
    }

    p.setup = () => {
      const c = p.createCanvas(window.innerWidth, window.innerHeight);
      c.parent(mount);
      p.noStroke();
      p.frameRate(24);
      const count = p.constrain(p.floor(p.width / 220), 4, 9);
      blobs = Array.from({ length: count }, makeBlob);
    };

    p.draw = () => {
      p.clear();
      for (const b of blobs) {
        b.x += b.dx;
        b.y += b.dy;
        if (b.y < -b.r) { b.y = p.height + b.r; b.x = p.random(p.width); }
        if (b.x < -b.r) b.x = p.width + b.r;
        if (b.x > p.width + b.r) b.x = -b.r;

        p.fill(p.color(b.color + "33")); // ~20% alpha
        p.circle(b.x, b.y, b.r * 2);
      }
    };

    p.windowResized = () => p.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  new p5(sketch);
})();
