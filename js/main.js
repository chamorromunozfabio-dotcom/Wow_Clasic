/* ============================================================
   WORLD OF WARCRAFT — CRONICAS DE AZEROTH
   1. Brasas arcanas en el hero (canvas #embers)
   2. Animaciones de aparicion al hacer scroll
   3. Contadores animados
   4. Menu hamburguesa
   5. Boton "volver arriba"
   ============================================================ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Brasas arcanas / chispas de forja ---------- */
(function embers() {
  const canvas = document.getElementById("embers") || document.getElementById("butterflies");
  if (!canvas || reducedMotion) return;

  const ctx = canvas.getContext("2d");
  let width, height, particles = [];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    // Soporte high-DPI
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    width = rect.width;
    height = rect.height;
  }

  const COLORS = [
    { core: "#ffe8a3", glow: "rgba(248,183,0,0.85)" },  // oro WoW
    { core: "#ff8c42", glow: "rgba(255,128,0,0.65)" },  // fuego forja / legendario
    { core: "#7ed3ff", glow: "rgba(0,112,221,0.55)" },  // arcano alianza
    { core: "#ff6b6b", glow: "rgba(196,30,58,0.55)" },  // fel / horda
    { core: "#c792ff", glow: "rgba(163,53,238,0.45)" }, // epico violeta
  ];

  function makeParticle() {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * width,
      y: Math.random() * height + height * 0.2,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -0.35 - Math.random() * 1.1, // tienden a subir
      size: 1.2 + Math.random() * 2.6,
      alpha: 0.45 + Math.random() * 0.55,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      drift: (Math.random() - 0.5) * 0.015,
      color: c,
      // 18% son runas flotantes mas grandes y lentas
      isRune: Math.random() < 0.18,
      runeChar: ["✦","⬥","◆","✧"][Math.floor(Math.random()*4)],
      angle: Math.random()*Math.PI*2,
      spin: (Math.random()-0.5)*0.008
    };
  }

  function draw(p) {
    ctx.save();
    ctx.globalAlpha = p.alpha * (0.7 + Math.abs(Math.sin(p.pulse)) * 0.3);
    ctx.translate(p.x, p.y);
    if (p.isRune) {
      // Rune: glifo dorado con brillo exterior
      ctx.rotate(p.angle);
      ctx.shadowColor = p.color.glow;
      ctx.shadowBlur = p.size * 5;
      ctx.fillStyle = p.color.core;
      ctx.font = `700 ${p.size * 6}px Cinzel, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.runeChar, 0, 0);
      // brillo interior
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.globalAlpha *= 0.55;
      ctx.fillText(p.runeChar, 0, 0);
    } else {
      // Brasa: nucleo + halo
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 4);
      grad.addColorStop(0, p.color.core);
      grad.addColorStop(0.35, p.color.glow);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 4, 0, Math.PI * 2);
      ctx.fill();
      // nucleo solido
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color.core;
      ctx.shadowColor = p.color.glow;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.pulse += p.pulseSpeed;
      p.angle += p.spin;
      p.vx += Math.sin(p.pulse * 0.5) * 0.004 + p.drift;
      p.x += p.vx;
      p.y += p.vy;
      // leve gravedad inversa + friccion
      p.vy -= 0.002;
      p.vx *= 0.999;

      // Parpadeo de alpha
      p.alpha += Math.sin(p.pulse) * 0.001;
      p.alpha = Math.max(0.25, Math.min(0.95, p.alpha));

      // Reciclaje
      if (p.y < -20 || p.x < -30 || p.x > width + 30) {
        p.x = Math.random() * width;
        p.y = height + 12 + Math.random() * 30;
        p.vx = (Math.random() - 0.5) * 0.45;
        p.vy = -0.35 - Math.random() * 1.1;
        p.alpha = 0.45 + Math.random() * 0.55;
      }

      draw(p);
    }
    requestAnimationFrame(step);
  }

  resize();
  const count = Math.min(42, Math.max(18, Math.floor(width / 32)));
  particles = Array.from({ length: count }, makeParticle);
  window.addEventListener("resize", () => {
    resize();
    // Reajustar cantidad si cambia mucho el ancho
    const desired = Math.min(42, Math.max(18, Math.floor(width / 32)));
    if (desired > particles.length) {
      while (particles.length < desired) particles.push(makeParticle());
    } else if (desired < particles.length) {
      particles = particles.slice(0, desired);
    }
  });
  step();
})();

/* ---------- 2. Aparicion al hacer scroll ---------- */
(function scrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

/* ---------- 3. Contadores animados ---------- */
(function counters() {
  const nums = document.querySelectorAll(".stat-num[data-count]");
  if (!nums.length) return;

  function animate(el) {
    const target = parseInt(el.dataset.count, 10);
    if (reducedMotion) { el.textContent = target; return; }

    const duration = 1450;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  nums.forEach((el) => observer.observe(el));
})();

/* ---------- 4. Menu hamburguesa ---------- */
(function mobileMenu() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
})();

/* ---------- 5. Boton "volver arriba" ---------- */
(function toTop() {
  const btn = document.getElementById("toTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 600);
  }, { passive: true });
})();
