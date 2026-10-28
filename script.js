(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }));
  }


  // Pointer-following metallic highlight for architecture and tokenomics surfaces.
  const glowCards = document.querySelectorAll(".detail-card, .benchmark-card, .supply-card, .allocation-card, .stack-layer");
  glowCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--glow-x", "50%");
      card.style.setProperty("--glow-y", "50%");
    });
  });

  // Clearly labeled local simulation: it is not connected to a blockchain.
  const blockHeight = document.querySelector("#sim-block-height");
  const heartbeat = document.querySelector(".network-heartbeat");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let blockTimer = null;
  if (blockHeight && heartbeat) {
    let height = Number(blockHeight.dataset.baseHeight || blockHeight.textContent.replace(/\\D/g, "")) || 128430;
    const renderHeight = () => { blockHeight.textContent = height.toLocaleString("en-US"); };
    const startHeartbeat = () => {
      if (blockTimer || document.hidden) return;
      blockTimer = window.setInterval(() => {
        height += 1;
        renderHeight();
      }, 1200);
    };
    const stopHeartbeat = () => {
      if (blockTimer) window.clearInterval(blockTimer);
      blockTimer = null;
    };
    renderHeight();
    startHeartbeat();
    document.addEventListener("visibilitychange", () => document.hidden ? stopHeartbeat() : startHeartbeat());
  }

  // Count up only when metric elements enter view. Final values remain in the HTML
  // for no-JS access and reduced-motion preferences.
  const countTargets = document.querySelectorAll("[data-count]");
  const formatCount = (value) => Math.round(value).toLocaleString("en-US");
  const animateCount = (element) => {
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) return;
    if (reducedMotion || !("requestAnimationFrame" in window)) {
      element.textContent = formatCount(target);
      return;
    }
    const duration = 1050;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = formatCount(target * eased);
      if (progress < 1) window.requestAnimationFrame(tick);
      else element.textContent = formatCount(target);
    };
    window.requestAnimationFrame(tick);
  };
  if (countTargets.length) {
    if ("IntersectionObserver" in window) {
      const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.45 });
      countTargets.forEach((element) => countObserver.observe(element));
    } else {
      countTargets.forEach(animateCount);
    }
  }

  // Subtle canvas node field. Cursor proximity strengthens links; no external data.
  const canvas = document.querySelector("#hero-node-canvas");
  const hero = document.querySelector(".hero");
  if (canvas && hero && !reducedMotion) {
    const context = canvas.getContext("2d");
    if (context) {
      let width = 0, height = 0, dpr = 1, frame = 0;
      let nodes = [];
      const pointer = { x: -1000, y: -1000, active: false };
      const palette = ["212, 212, 212", "212, 175, 98", "125, 125, 130"];
      const resizeCanvas = () => {
        const rect = hero.getBoundingClientRect();
        width = rect.width; height = rect.height;
        dpr = Math.min(window.devicePixelRatio || 1, 1.7);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.max(24, Math.min(66, Math.round(width / 17)));
        nodes = Array.from({ length: count }, () => ({
          x: Math.random() * width, y: Math.random() * height,
          vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
          r: Math.random() * 1.5 + .7,
          color: palette[Math.random() < .22 ? 1 : (Math.random() < .5 ? 0 : 2)]
        }));
      };
      const draw = () => {
        context.clearRect(0, 0, width, height);
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          node.x += node.vx; node.y += node.vy;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
          if (pointer.active) {
            const dx = pointer.x - node.x, dy = pointer.y - node.y;
            const distance = Math.hypot(dx, dy);
            if (distance < 130 && distance > 0) {
              node.x -= dx / distance * .08;
              node.y -= dy / distance * .08;
            }
          }
          for (let j = i + 1; j < nodes.length; j++) {
            const other = nodes[j];
            const dx = node.x - other.x, dy = node.y - other.y;
            const distance = Math.hypot(dx, dy);
            if (distance < 95) {
              const cursorNear = pointer.active && Math.hypot(pointer.x - (node.x + other.x) / 2, pointer.y - (node.y + other.y) / 2) < 155;
              const alpha = (1 - distance / 95) * (cursorNear ? .28 : .095);
              context.strokeStyle = `rgba(${node.color},${alpha})`;
              context.lineWidth = cursorNear ? .85 : .55;
              context.beginPath(); context.moveTo(node.x, node.y); context.lineTo(other.x, other.y); context.stroke();
            }
          }
          context.fillStyle = `rgba(${node.color},${node.color === palette[1] ? .72 : .38})`;
          context.beginPath(); context.arc(node.x, node.y, node.r, 0, Math.PI * 2); context.fill();
        }
        frame = window.requestAnimationFrame(draw);
      };
      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.active = true;
      }, { passive: true });
      hero.addEventListener("pointerleave", () => { pointer.active = false; }, { passive: true });
      window.addEventListener("resize", resizeCanvas, { passive: true });
      resizeCanvas();
      draw();
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) { window.cancelAnimationFrame(frame); }
        else { draw(); }
      });
    }
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const copyButton = document.querySelector("#copy-config");
  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      const sample = `// Proposed network parameters
export const ymcConcept = {
  network: "YMC",
  stage: "concept",
  execution: "EVM-compatible target",
  consensus: {
    model: "DPoS + IBFT 2.0",
    status: "under design"
  },
  targets: {
    blockTimeSeconds: 1.2,
    throughputTPS: 3500
  }
} // not deployed or benchmarked`;
      const original = copyButton.textContent;
      try {
        await navigator.clipboard.writeText(sample);
        copyButton.textContent = "Copied";
      } catch {
        copyButton.textContent = "Select code to copy";
      }
      window.setTimeout(() => { copyButton.textContent = original; }, 1800);
    });
  }

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const targets = document.querySelectorAll(".detail-card, .roadmap-item, .metric, .supply-card, .allocation-card, .brief-card");
    targets.forEach((target) => target.classList.add("reveal"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach((target) => observer.observe(target));
  }
})();