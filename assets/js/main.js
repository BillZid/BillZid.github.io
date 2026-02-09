/* Minimal JS: mobile nav toggle, section reveal + active nav. */

function isReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;

  function closeNav() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close after click on small screens (UX).
  nav.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    closeNav();
  });

  // Close when clicking outside.
  document.addEventListener("click", (e) => {
    if (e.target.closest(".nav") || e.target.closest(".nav-toggle")) return;
    closeNav();
  });
}

function setupReveal() {
  const els = Array.from(document.querySelectorAll(".reveal"));
  if (!els.length) return;

  if (isReducedMotion() || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const ent of entries) {
        if (!ent.isIntersecting) continue;
        ent.target.classList.add("is-visible");
        io.unobserve(ent.target);
      }
    },
    { threshold: 0.08 }
  );

  els.forEach((el) => io.observe(el));
}

function setupActiveNav() {
  const navLinks = Array.from(document.querySelectorAll(".nav a[href^=\"#\"]"));
  if (!navLinks.length || !("IntersectionObserver" in window)) return;

  const idToLink = new Map();
  for (const a of navLinks) {
    const id = (a.getAttribute("href") || "").slice(1);
    if (id) idToLink.set(id, a);
  }

  const sections = Array.from(idToLink.keys())
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  function setCurrent(id) {
    for (const a of navLinks) a.removeAttribute("aria-current");
    const active = idToLink.get(id);
    if (active) active.setAttribute("aria-current", "page");
  }

  const io = new IntersectionObserver(
    (entries) => {
      // Choose the most visible section near top.
      let best = null;
      for (const ent of entries) {
        if (!ent.isIntersecting) continue;
        if (!best || ent.intersectionRatio > best.intersectionRatio) best = ent;
      }
      if (best && best.target && best.target.id) setCurrent(best.target.id);
    },
    {
      rootMargin: "-20% 0px -70% 0px",
      threshold: [0.05, 0.1, 0.2, 0.35],
    }
  );

  sections.forEach((s) => io.observe(s));
}

function setupYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

setupNavToggle();
setupReveal();
setupActiveNav();
setupYear();

