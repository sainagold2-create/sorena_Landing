const VID_KEY = "sg_vid";
const SEEN_SECTIONS = new Set();

function getVid() {
  try {
    let id = localStorage.getItem(VID_KEY);
    if (!id || !/^[a-zA-Z0-9_-]{8,64}$/.test(id)) {
      id = `v_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem(VID_KEY, id);
    }
    return id;
  } catch {
    return `v_${Date.now().toString(36)}`;
  }
}

function track(type, payload = {}) {
  const body = JSON.stringify({ type, vid: getVid(), ...payload });
  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

function classifyClick(el) {
  const a = el.closest("a,button");
  if (!a) return null;
  if (a.closest("#siteNav") || a.classList.contains("nav-login") || a.classList.contains("nav-cta") || a.classList.contains("nav-link")) {
    if (a.classList.contains("nav-login") || a.dataset.track === "login") return "login";
    if (a.classList.contains("nav-cta") || a.dataset.track === "register" || a.dataset.scrollTo === "register") return "register";
    const href = a.getAttribute("href") || "";
    if (/\/blog/i.test(href)) return "blog";
    return "nav";
  }
  if (a.classList.contains("btn-to-register") || a.dataset.scrollTo === "register" || a.dataset.track === "register") {
    return "register";
  }
  if (a.dataset.track === "login") return "login";
  if (a.dataset.track === "cta") return "cta";
  if (a.dataset.track === "blog" || /\/blog/i.test(a.getAttribute("href") || "")) return "blog";
  if (a.classList.contains("btn") && /register|#register/i.test(a.getAttribute("href") || "")) return "register";
  return null;
}

export function bindAnalytics() {
  track("page_view", { path: location.pathname || "/" });

  document.addEventListener(
    "click",
    (e) => {
      const name = classifyClick(e.target);
      if (!name) return;
      track("click", { name });
    },
    { capture: true }
  );

  const sections = document.querySelectorAll("#page-sections > section[id], main#page-sections > section[id]");
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.35) continue;
        const id = entry.target.id;
        if (!id || SEEN_SECTIONS.has(id)) continue;
        SEEN_SECTIONS.add(id);
        track("section_view", { sectionId: id });
      }
    },
    { threshold: [0.35] }
  );
  sections.forEach((sec) => io.observe(sec));
}
