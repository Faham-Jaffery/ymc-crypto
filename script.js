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