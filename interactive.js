/** تعاملات و انیمیشن‌های زنده لندینگ سورناگلد */

export function bindReveals() {
  const nodes = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    nodes.forEach((n) => n.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
  );
  nodes.forEach((n) => io.observe(n));
}

export function bindScrollProgress() {
  const bar = document.querySelector(".scroll-progress span");
  if (!bar) return;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    document.documentElement.style.setProperty("--scroll-p", String(Math.min(1, Math.max(0, p))));
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

export function bindHeroInteractions() {
  const heroes = document.querySelectorAll(".interactive-hero");
  heroes.forEach((hero) => {
    const glow = hero.querySelector(".pointer-glow");
    const title = hero.querySelector(".tilt-title");
    let mx = 0.5;
    let my = 0.5;
    let tx = 0.5;
    let ty = 0.5;

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      tx = (e.clientX - rect.left) / rect.width;
      ty = (e.clientY - rect.top) / rect.height;
    };
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", () => {
      tx = 0.5;
      ty = 0.45;
    });

    const tick = () => {
      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;
      if (glow) {
        glow.style.setProperty("--x", `${mx * 100}%`);
        glow.style.setProperty("--y", `${my * 100}%`);
      }
      if (title) {
        const rx = (my - 0.5) * -6;
        const ry = (mx - 0.5) * 8;
        title.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function initPageSparks(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const particles = Array.from({ length: 36 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.5 + Math.random() * 1.6,
    s: 0.12 + Math.random() * 0.3,
    a: 0.12 + Math.random() * 0.28,
    c: Math.random() > 0.45 ? "46,196,182" : "226,182,87",
  }));

  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const draw = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.y -= p.s * 0.0012;
      p.x += Math.sin(p.y * 10 + p.r) * 0.00028;
      if (p.y < -0.05) {
        p.y = 1.05;
        p.x = Math.random();
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.c},${p.a})`;
      ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}

export function bindMagneticButtons() {
  document.querySelectorAll(".btn").forEach((btn) => {
    if (btn.dataset.magneticBound === "1") return;
    // دکمه اسکرول به ثبت‌نام بدون جابه‌جایی مغناطیسی تا سایزش نپرد
    if (btn.classList.contains("btn-to-register") || btn.matches('[data-scroll-to="register"]')) {
      btn.dataset.magneticBound = "1";
      return;
    }
    btn.dataset.magneticBound = "1";
    btn.classList.add("btn-magnetic");
    const strength = btn.classList.contains("btn-nav") ? 28 : 16;
    btn.addEventListener("pointermove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
    btn.addEventListener("click", (e) => {
      btn.style.transform = "translate(0, 0)";
      spawnRipple(btn, e);
    });
  });
}

function findRegisterTarget() {
  return (
    document.getElementById("register-1") ||
    document.querySelector(".sec-register") ||
    document.querySelector('[id^="register"]')
  );
}

function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

function animateScrollTo(el, duration = 1400) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offset = Math.min(64, window.innerHeight * 0.06);
  const getTargetY = () => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.min(max, Math.max(0, top - offset));
  };

  if (reduce) {
    window.scrollTo(0, getTargetY());
    return Promise.resolve();
  }

  // سکشن را از قبل visible کن تا وسط اسکرول ارتفاع نپرد
  el.classList.add("is-in");

  const startY = window.scrollY;
  const endY = getTargetY();
  const dist = endY - startY;
  if (Math.abs(dist) < 2) return Promise.resolve();

  // مدت بر اساس فاصله تا حس وقفه ندهد
  const ms = Math.min(1800, Math.max(900, Math.abs(dist) * 0.55));

  return new Promise((resolve) => {
    const t0 = performance.now();
    let raf = 0;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      const y = startY + dist * easeInOutQuart(p);
      window.scrollTo(0, y);
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        window.scrollTo(0, getTargetY());
        resolve();
      }
    };
    raf = requestAnimationFrame(step);
    // اگر کاربر وسط راه اسکرول دستی کرد، انیمیشن را رها نکنیم مگر لازم باشد
    void raf;
  });
}

/** دکمه شروع همکاری → اسکرول نرم بدون بزرگ‌شدن باکس */
export function bindRegisterScroll() {
  let busy = false;

  const go = async () => {
    const target = findRegisterTarget();
    if (!target || busy) return;
    busy = true;
    try {
      history.replaceState(null, "", `#${target.id || "register-1"}`);
    } catch {}
    await animateScrollTo(target);
    const form = target.querySelector(".lead-form");
    const first = form?.querySelector("input, select, textarea");
    // فوکوس بدون اسکرول اضافه و بدون انیمیشن بزرگ‌شدن
    first?.focus({ preventScroll: true });
    busy = false;
  };

  document.querySelectorAll('[data-scroll-to="register"], a[href="#register-1"], a[href="#register"]').forEach((el) => {
    if (el.dataset.scrollBound === "1") return;
    el.dataset.scrollBound = "1";
    el.addEventListener("click", (e) => {
      const target = findRegisterTarget();
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      // ریست فوری هر transform احتمالی
      if (el instanceof HTMLElement) el.style.transform = "";
      go();
    });
  });
}

function spawnRipple(btn, e) {
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
}

export function bindFeatureCards() {
  document.querySelectorAll(".feat-card, .blog-card, .text-box, .cta-panel").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
      if (card.classList.contains("cta-panel") || card.classList.contains("text-box")) {
        const rx = ((y / 100) - 0.5) * -3;
        const ry = ((x / 100) - 0.5) * 4;
        card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      }
    });
    card.addEventListener("pointerleave", () => {
      if (card.classList.contains("cta-panel") || card.classList.contains("text-box")) {
        card.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
      }
    });
  });
}

export function bindPosterEffects() {
  document.querySelectorAll(".poster-slot[data-poster-fx]").forEach((slot) => {
    const fx = slot.dataset.posterFx || "tilt";
    if (fx === "none" || fx === "zoom" || fx === "lift" || fx === "float") return;

    if (fx === "tilt") {
      slot.addEventListener("pointermove", (e) => {
        const rect = slot.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        slot.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
      });
      slot.addEventListener("pointerleave", () => {
        slot.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
      });
      return;
    }

    if (fx === "shine") {
      slot.addEventListener("pointermove", (e) => {
        const rect = slot.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        slot.style.setProperty("--px", `${x}%`);
        slot.style.setProperty("--py", `${y}%`);
      });
    }
  });
}

export function bindFormAura() {
  document.querySelectorAll(".lead-form").forEach((form) => {
    form.addEventListener("pointermove", (e) => {
      const rect = form.getBoundingClientRect();
      form.style.setProperty("--fx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      form.style.setProperty("--fy", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
    const fields = form.querySelectorAll("input, select, textarea");
    fields.forEach((field) => {
      field.addEventListener("focus", () => form.classList.add("is-focus"));
      field.addEventListener("blur", () => {
        if (!form.contains(document.activeElement)) form.classList.remove("is-focus");
      });
    });
  });
}

/** یک اتمسفر سراسری برای کل صفحه */
export function bindPageAtmosphere() {
  const page = document.querySelector(".page-atmosphere");
  if (!page) return;
  const marks = page.querySelectorAll(".page-mark");
  const canvas = page.querySelector(".page-spark");
  if (canvas) initPageSparks(canvas);

  let mx = 0.5;
  let my = 0.3;
  let tx = 0.5;
  let ty = 0.3;
  window.addEventListener(
    "pointermove",
    (e) => {
      tx = e.clientX / window.innerWidth;
      ty = e.clientY / window.innerHeight;
    },
    { passive: true }
  );
  const tick = () => {
    mx += (tx - mx) * 0.055;
    my += (ty - my) * 0.055;
    page.style.setProperty("--px", `${mx * 100}%`);
    page.style.setProperty("--py", `${my * 100}%`);
    marks.forEach((mark, i) => {
      const strength = 10 + i * 6;
      const dx = (mx - 0.5) * strength;
      const dy = (my - 0.5) * strength;
      mark.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function bindTicker() {
  const track = document.querySelector(".ticker-track");
  if (!track || track.dataset.looped === "1") return;
  const html = track.innerHTML.trim();
  if (!html) return;

  // دو گروه هم‌عرض تا لوپ بدون پرش باشد
  track.innerHTML = `<div class="ticker-group">${html}</div><div class="ticker-group">${html}</div>`;
  track.dataset.looped = "1";

  const sync = () => {
    const group = track.querySelector(".ticker-group");
    if (!group) return;
    const width = group.getBoundingClientRect().width;
    if (!width) return;
    track.style.setProperty("--ticker-shift", `${width}px`);
    // سرعت از تنظیمات سایت: ۱ آهسته … ۱۰ سریع (پیش‌فرض ۵ ≈ ۴۲px/s)
    const level = Math.max(1, Math.min(10, Number(track.dataset.tickerSpeed) || 5));
    const pxPerSec = 12 + level * 6;
    const duration = Math.max(8, width / pxPerSec);
    track.style.setProperty("--ticker-duration", `${duration}s`);
  };

  sync();
  requestAnimationFrame(sync);
  window.addEventListener("resize", sync, { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(sync).catch(() => {});
}

export function bindAllInteractions() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  bindReveals();
  bindScrollProgress();
  bindTicker();
  bindRegisterScroll();
  if (reduce) return;
  bindPageAtmosphere();
  bindHeroInteractions();
  bindMagneticButtons();
  bindFeatureCards();
  bindPosterEffects();
  bindFormAura();
}
