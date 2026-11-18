/** رندر سکشن‌های لندینگ از content.json */

export const SECTION_LABELS = {
  hero: "هیرو",
  text: "متن / توضیح",
  text_box: "باکس متن",
  text_image: "متن و عکس",
  posters: "پوسترها",
  features: "ویژگی‌ها",
  blog: "مقالات / بلاگ",
  cta: "فراخوان اقدام",
  links: "لینک‌ها",
  register: "فرم ثبت‌نام",
  spacer: "فاصله خالی",
};

export const FONT_GROUPS = [
  { id: "brand", label: "برند / مدرن" },
  { id: "persian", label: "متن فارسی (طراحی UI)" },
  { id: "display", label: "نمایشی / تیتر گرافیکی" },
  { id: "naskh", label: "نستعلیق‌وار / نسخ کلاسیک" },
  { id: "kufi", label: "کوفی / هندسی" },
  { id: "system", label: "سیستمی" },
];

export const FONT_OPTIONS = [
  { value: "Graphik Arabic", label: "Graphik Arabic", group: "brand" },
  { value: "Readex Pro", label: "Readex Pro", group: "brand" },
  { value: "IBM Plex Sans Arabic", label: "IBM Plex Sans Arabic", group: "brand" },
  { value: "Rubik", label: "Rubik", group: "brand" },
  { value: "Alexandria", label: "Alexandria", group: "brand" },
  { value: "Beiruti", label: "Beiruti", group: "brand" },

  { value: "Vazirmatn", label: "وزیرمتن — Vazirmatn", group: "persian" },
  { value: "Estedad", label: "استعداد — Estedad", group: "persian" },
  { value: "Samim", label: "صمیم — Samim", group: "persian" },
  { value: "Shabnam", label: "شبنم — Shabnam", group: "persian" },
  { value: "Sahel", label: "ساحل — Sahel", group: "persian" },
  { value: "Tanha", label: "تنها — Tanha", group: "persian" },
  { value: "Parastoo", label: "پرستو — Parastoo", group: "persian" },
  { value: "Gandom", label: "گندم — Gandom", group: "persian" },
  { value: "Nahid", label: "ناهید — Nahid", group: "persian" },
  { value: "Cairo", label: "Cairo", group: "persian" },
  { value: "Tajawal", label: "Tajawal", group: "persian" },
  { value: "Almarai", label: "Almarai", group: "persian" },
  { value: "Mada", label: "Mada", group: "persian" },
  { value: "Noto Sans Arabic", label: "Noto Sans Arabic", group: "persian" },

  { value: "Lalezar", label: "لاله‌زار — Lalezar", group: "display" },
  { value: "Markazi Text", label: "مرکزی — Markazi Text", group: "display" },
  { value: "El Messiri", label: "El Messiri", group: "display" },
  { value: "Lemonada", label: "Lemonada", group: "display" },
  { value: "Marhey", label: "Marhey", group: "display" },
  { value: "Rakkas", label: "Rakkas", group: "display" },
  { value: "Katibeh", label: "Katibeh", group: "display" },
  { value: "Baloo Bhaijaan 2", label: "Baloo Bhaijaan 2", group: "display" },
  { value: "Blaka", label: "Blaka", group: "display" },
  { value: "Mirza", label: "Mirza", group: "display" },
  { value: "Changa", label: "Changa", group: "display" },

  { value: "Amiri", label: "امیری — Amiri", group: "naskh" },
  { value: "Noto Naskh Arabic", label: "Noto Naskh Arabic", group: "naskh" },
  { value: "Scheherazade New", label: "Scheherazade New", group: "naskh" },
  { value: "Lateef", label: "Lateef", group: "naskh" },
  { value: "Harmattan", label: "Harmattan", group: "naskh" },
  { value: "Aref Ruqaa", label: "Aref Ruqaa", group: "naskh" },

  { value: "Noto Kufi Arabic", label: "Noto Kufi Arabic", group: "kufi" },
  { value: "Reem Kufi", label: "Reem Kufi", group: "kufi" },
  { value: "Kufam", label: "Kufam", group: "kufi" },

  { value: "Tahoma", label: "Tahoma", group: "system" },
  { value: "Arial", label: "Arial", group: "system" },
  { value: "Segoe UI", label: "Segoe UI", group: "system" },
];

/** تک‌کوتیشن تا داخل style="..." نشکند */
export const FONT_STACK = {
  "Graphik Arabic": "'Graphik Arabic', Tahoma, sans-serif",
  "Readex Pro": "'Readex Pro', Tahoma, sans-serif",
  "IBM Plex Sans Arabic": "'IBM Plex Sans Arabic', Tahoma, sans-serif",
  Rubik: "'Rubik', Tahoma, sans-serif",
  Alexandria: "'Alexandria', Tahoma, sans-serif",
  Beiruti: "'Beiruti', Tahoma, sans-serif",

  Vazirmatn: "'Vazirmatn', Tahoma, sans-serif",
  Estedad: "'Estedad', Tahoma, sans-serif",
  Samim: "'Samim', Tahoma, sans-serif",
  Shabnam: "'Shabnam', Tahoma, sans-serif",
  Sahel: "'Sahel', Tahoma, sans-serif",
  Tanha: "'Tanha', Tahoma, sans-serif",
  Parastoo: "'Parastoo', Tahoma, sans-serif",
  Gandom: "'Gandom', Tahoma, sans-serif",
  Nahid: "'Nahid', Tahoma, sans-serif",
  Cairo: "'Cairo', Tahoma, sans-serif",
  Tajawal: "'Tajawal', Tahoma, sans-serif",
  Almarai: "'Almarai', Tahoma, sans-serif",
  Mada: "'Mada', Tahoma, sans-serif",
  "Noto Sans Arabic": "'Noto Sans Arabic', Tahoma, sans-serif",

  Lalezar: "'Lalezar', 'Graphik Arabic', cursive",
  "Markazi Text": "'Markazi Text', 'Graphik Arabic', serif",
  "El Messiri": "'El Messiri', 'Graphik Arabic', sans-serif",
  Lemonada: "'Lemonada', 'Graphik Arabic', cursive",
  Marhey: "'Marhey', 'Graphik Arabic', cursive",
  Rakkas: "'Rakkas', 'Graphik Arabic', cursive",
  Katibeh: "'Katibeh', 'Graphik Arabic', cursive",
  "Baloo Bhaijaan 2": "'Baloo Bhaijaan 2', Tahoma, sans-serif",
  Blaka: "'Blaka', 'Graphik Arabic', cursive",
  Mirza: "'Mirza', 'Graphik Arabic', cursive",
  Changa: "'Changa', Tahoma, sans-serif",

  Amiri: "'Amiri', 'Times New Roman', serif",
  "Noto Naskh Arabic": "'Noto Naskh Arabic', 'Times New Roman', serif",
  "Scheherazade New": "'Scheherazade New', 'Times New Roman', serif",
  Lateef: "'Lateef', 'Times New Roman', serif",
  Harmattan: "'Harmattan', 'Times New Roman', serif",
  "Aref Ruqaa": "'Aref Ruqaa', 'Times New Roman', serif",

  "Noto Kufi Arabic": "'Noto Kufi Arabic', Tahoma, sans-serif",
  "Reem Kufi": "'Reem Kufi', Tahoma, sans-serif",
  Kufam: "'Kufam', Tahoma, sans-serif",

  Tahoma: "Tahoma, sans-serif",
  Arial: "Arial, Tahoma, sans-serif",
  "Segoe UI": "'Segoe UI', Tahoma, sans-serif",
};

/** HTML گزینه‌های فونت با گروه‌بندی برای سلکت ادمین */
export function fontOptionsGroupedHtml(selected) {
  const cur = selected || "Graphik Arabic";
  return FONT_GROUPS.map((g) => {
    const opts = FONT_OPTIONS.filter((f) => f.group === g.id)
      .map(
        (o) =>
          `<option value="${o.value}" ${o.value === cur ? "selected" : ""} style="font-family:'${o.value}', Tahoma, sans-serif">${o.label}</option>`
      )
      .join("");
    return `<optgroup label="${g.label}">${opts}</optgroup>`;
  }).join("");
}

export function fontStack(name) {
  return FONT_STACK[name] || FONT_STACK["Graphik Arabic"];
}

/** فونت فیلد متن با fallback به استایل سکشن */
export function fieldFont(section, field, fallback = "body") {
  const d = section?.data || {};
  const st = section?.style || {};
  const fromField = d.fonts?.[field];
  if (fromField) return fontStack(fromField);
  if (fallback === "title") return fontStack(st.titleFont || "Graphik Arabic");
  if (fallback === "button") return fontStack(st.buttonFont || st.titleFont || "Graphik Arabic");
  return fontStack(st.bodyFont || "Graphik Arabic");
}

export function fieldColor(section, field, fallback = "body") {
  const d = section?.data || {};
  const st = section?.style || {};
  const fromField = String(d.colors?.[field] || "").trim();
  if (/^#[0-9a-fA-F]{6}$/i.test(fromField)) return fromField;
  if (fallback === "title") {
    const c = String(st.titleColor || "").trim();
    return /^#[0-9a-fA-F]{6}$/i.test(c) ? c : "";
  }
  if (fallback === "button") {
    const c = String(st.buttonColor || st.titleColor || "").trim();
    return /^#[0-9a-fA-F]{6}$/i.test(c) ? c : "";
  }
  const c = String(st.bodyColor || "").trim();
  return /^#[0-9a-fA-F]{6}$/i.test(c) ? c : "";
}

export function fontStyle(section, field, fallback = "body") {
  const parts = [`font-family:${fieldFont(section, field, fallback)}`];
  const color = fieldColor(section, field, fallback);
  if (color) parts.push(`color:${color}`);
  return parts.join(";");
}

export function normalizeTextAlign(value, fallback = "right") {
  const a = String(value || fallback).toLowerCase();
  return ["right", "left", "center", "justify"].includes(a) ? a : fallback;
}

export function textAlignCss(style = {}, fallback = "right") {
  return `text-align:${normalizeTextAlign(style?.textAlign, fallback)}`;
}

export function defaultSection(type) {
  const id = `${type}-${Date.now().toString(36)}`;
  const baseStyle = {
    paddingTop: 64,
    paddingBottom: 64,
    paddingX: 16,
    minHeight: 0,
    gap: 16,
    maxWidth: 1152,
    titleSize: 32,
    textSize: 16,
    boxWidth: 100,
    titleFont: "Graphik Arabic",
    bodyFont: "Graphik Arabic",
    buttonFont: "Graphik Arabic",
    titleColor: "",
    bodyColor: "",
    buttonColor: "",
    textAlign: "right",
  };

  const map = {
    hero: {
      id,
      type,
      visible: true,
      style: { ...baseStyle, minHeight: 100, paddingTop: 112, paddingBottom: 140, titleSize: 80, textSize: 20 },
      data: {
        kicker: "با اعتبار سایناگلد",
        headline: "عنوان جدید",
        subheadline: "توضیح کوتاه",
        ctaLabel: "دکمه",
        ctaHref: "#register-1",
      },
    },
    text: {
      id,
      type,
      visible: true,
      style: { ...baseStyle, titleSize: 28, textSize: 20 },
      data: { title: "عنوان متن", body: "متن توضیحات را اینجا بنویسید." },
    },
    text_box: {
      id,
      type,
      visible: true,
      style: { ...baseStyle, boxWidth: 70, titleSize: 24, textSize: 16 },
      data: { title: "باکس متن", body: "محتوای داخل باکس", linkLabel: "", linkHref: "" },
    },
    text_image: {
      id,
      type,
      visible: true,
      style: { ...baseStyle, gap: 36, titleSize: 32, textSize: 17, minHeight: 280 },
      data: {
        title: "عنوان بخش",
        body: "متن توضیحات این بخش را اینجا بنویسید.",
        mediaId: null,
        imageSide: "right",
        linkLabel: "",
        linkHref: "",
      },
    },
    posters: {
      id,
      type,
      visible: true,
      style: { ...baseStyle, minHeight: 420, titleSize: 36 },
      data: { title: "پوسترها", subtitle: "توضیح پوسترها", mediaIds: [], effect: "tilt" },
    },
    features: {
      id,
      type,
      visible: true,
      style: { ...baseStyle, gap: 40, titleSize: 36 },
      data: {
        title: "ویژگی‌ها",
        items: [
          { title: "ویژگی ۱", body: "توضیح" },
          { title: "ویژگی ۲", body: "توضیح" },
          { title: "ویژگی ۳", body: "توضیح" },
        ],
      },
    },
    blog: {
      id,
      type,
      visible: true,
      style: { ...baseStyle, gap: 28, titleSize: 36 },
      data: {
        title: "مقالات و بلاگ",
        subtitle: "آخرین نوشته‌ها",
        limit: 3,
        moreLabel: "همه مقالات",
        moreHref: "/blog",
      },
    },
    cta: {
      id,
      type,
      visible: true,
      style: { ...baseStyle, titleSize: 36 },
      data: {
        title: "فراخوان",
        body: "توضیح کوتاه",
        buttonLabel: "ادامه",
        buttonHref: "#register-1",
      },
    },
    links: {
      id,
      type,
      visible: true,
      style: { ...baseStyle, titleSize: 24 },
      data: {
        title: "لینک‌ها",
        items: [{ label: "لینک نمونه", href: "#" }],
      },
    },
    register: {
      id,
      type,
      visible: true,
      style: { ...baseStyle, gap: 40, titleSize: 36 },
      data: {
        eyebrow: "ثبت‌نام",
        title: "اعلام آمادگی",
        body: "فرم را تکمیل کنید.",
        formBg: "#ffffff",
        formText: "#1a1a1a",
        formAccent: "#2ec4b6",
        formButtonBg: "#2ec4b6",
        formButtonText: "#062a32",
        successTitle: "درخواست شما ثبت شد",
        successBody: "کارشناسان سورناگلد به زودی با شما تماس می‌گیرند.",
        successAsk: "تمایل دارید از بنکداری هوشمند سایناگلد نیز دیدن کنید؟",
        successLinkLabel: "مشاهده سایناگلد",
        successLinkUrl: "https://sainagold.com",
      },
    },
    spacer: {
      id,
      type,
      visible: true,
      style: { ...baseStyle, minHeight: 48, paddingTop: 0, paddingBottom: 0 },
      data: {},
    },
  };

  return map[type] || map.text;
}

function styleAttr(style = {}) {
  const s = style;
  const titleFont = fontStack(s.titleFont || "Graphik Arabic");
  const bodyFont = fontStack(s.bodyFont || "Graphik Arabic");
  const buttonFont = fontStack(s.buttonFont || s.titleFont || "Graphik Arabic");
  const parts = [
    `padding-top:${Number(s.paddingTop) || 0}px`,
    `padding-bottom:${Number(s.paddingBottom) || 0}px`,
    `padding-inline:${Number(s.paddingX) || 0}px`,
    `--sec-gap:${Number(s.gap) || 16}px`,
    `--sec-max:${Number(s.maxWidth) || 1152}px`,
    `--sec-title:${Number(s.titleSize) || 32}px`,
    `--sec-text:${Number(s.textSize) || 16}px`,
    `--sec-box:${Number(s.boxWidth) || 100}%`,
    `--sec-title-font:${titleFont}`,
    `--sec-body-font:${bodyFont}`,
    `--sec-button-font:${buttonFont}`,
    `--sec-align:${normalizeTextAlign(s.textAlign)}`,
    `font-family:${bodyFont}`,
  ];
  if (Number(s.minHeight) > 0) {
    parts.push(`min-height:${Number(s.minHeight)}px`);
  }
  return parts.join(";");
}

export function toFaDigits(value) {
  return String(value ?? "").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** متن قابل‌نمایش: escape + ارقام فارسی + حفظ اینتر */
function txt(str) {
  return esc(toFaDigits(str)).replace(/\r\n|\r|\n/g, "<br>");
}

function mediaById(media, id) {
  return (media || []).find((m) => m.id === id);
}

function atmosphere() {
  return "";
}

export function publishedPosts(posts = []) {
  return (posts || [])
    .filter((p) => p && p.published !== false && p.title && p.slug)
    .sort((a, b) => String(b.publishedAt || "").localeCompare(String(a.publishedAt || "")));
}

export function formatPostDate(iso) {
  if (!iso) return "";
  try {
    return toFaDigits(
      new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        numberingSystem: "arabext",
      }).format(new Date(iso))
    );
  } catch {
    return toFaDigits(iso);
  }
}

export function postImageUrl(post) {
  const file = String(post?.image || "").trim();
  return file ? `/posters/${esc(file)}` : "";
}

export function renderBlogCards(posts, { limit = 0 } = {}) {
  const list = publishedPosts(posts);
  const items = limit > 0 ? list.slice(0, limit) : list;
  if (!items.length) {
    return `<p class="blog-empty">هنوز مقاله‌ای منتشر نشده است.</p>`;
  }
  return `
    <div class="blog-grid">
      ${items
        .map((p, i) => {
          const titleF = fontStack(p.titleFont || "Graphik Arabic");
          const bodyF = fontStack(p.bodyFont || "Graphik Arabic");
          const img = postImageUrl(p);
          const cover = img
            ? `<span class="blog-cover"><img src="${img}" alt="" loading="lazy" /></span>`
            : `<span class="blog-cover blog-cover-fallback" aria-hidden="true"></span>`;
          return `
        <a class="blog-card ${img ? "has-cover" : "no-cover"}" href="/blog/${esc(p.slug)}" style="--i:${i}">
          ${cover}
          <div class="blog-card-body">
            <time style="font-family:${bodyF}">${esc(formatPostDate(p.publishedAt))}</time>
            <h3 style="font-family:${titleF}">${txt(p.title)}</h3>
            <p style="font-family:${bodyF}">${txt(p.excerpt || "")}</p>
            <span class="blog-more" style="font-family:${titleF}">ادامه مطلب</span>
          </div>
        </a>`;
        })
        .join("")}
    </div>`;
}

export function renderSection(section, media = [], posts = []) {
  if (!section || section.visible === false) return "";
  const d = section.data || {};
  const st = section.style || {};
  const wrapOpen = `<div class="sec-wrap" style="max-width:var(--sec-max);margin:0 auto;width:100%;position:relative;z-index:2">`;
  const wrapClose = `</div>`;

  if (section.type === "spacer") {
    const h = Number(st.minHeight) || 48;
    return `<section class="sec sec-spacer" id="${esc(section.id)}" style="height:${h}px"></section>`;
  }

  if (section.type === "hero") {
    const minH = Number(st.minHeight) > 0 ? `${Number(st.minHeight)}svh` : "100svh";
    return `
<section class="sec sec-hero reveal interactive-hero" id="${esc(section.id)}" style="${styleAttr(st)};min-height:${minH}">
  <div class="hero-bg" aria-hidden="true">
    <div class="pointer-glow"></div>
    <div class="hairline"></div>
  </div>
  ${wrapOpen}
    <div class="hero-inner" style="gap:var(--sec-gap);display:flex;flex-direction:column;justify-content:center;min-height:inherit;padding:0">
      <p class="hero-kicker fade-up" style="${fontStyle(section, "kicker", "body")}">${txt(d.kicker || "با اعتبار سایناگلد")}</p>
      <h1 class="hero-title fade-up delay-1 tilt-title" style="font-size:clamp(2.8rem,10vw,var(--sec-title));${fontStyle(section, "headline", "title")}">${txt(d.headline)}</h1>
      <p class="hero-sub fade-up delay-2" style="font-size:var(--sec-text);${fontStyle(section, "subheadline", "body")};${textAlignCss(st)};line-height:1.8">${txt(d.subheadline)}</p>
      <div class="hero-cta fade-up delay-3">
        <a class="btn btn-magnetic btn-to-register" data-scroll-to="register" style="${fontStyle(section, "ctaLabel", "button")}" href="${esc(d.ctaHref || "#register-1")}"><span>${txt(d.ctaLabel || "ادامه")}</span></a>
      </div>
    </div>
  ${wrapClose}
</section>`;
  }

  if (section.type === "text") {
    return `
<section class="sec sec-text trust reveal sec-interactive" id="${esc(section.id)}" style="${styleAttr(st)}">
  ${atmosphere("trust")}
  ${wrapOpen}
    <h2 class="ink-title" style="font-size:var(--sec-title);color:var(--turquoise);${fontStyle(section, "title", "title")};margin:0 0 var(--sec-gap)">${txt(d.title)}</h2>
    <p style="font-size:var(--sec-text);color:rgba(247,240,227,.88);${fontStyle(section, "body", "body")};${textAlignCss(st)};line-height:1.75;margin:0;max-width:40rem">${txt(d.body)}</p>
  ${wrapClose}
</section>`;
  }

  if (section.type === "text_box") {
    const link =
      d.linkHref && d.linkLabel
        ? `<a class="btn" style="margin-top:var(--sec-gap);display:inline-flex;${fontStyle(section, "linkLabel", "button")}" href="${esc(d.linkHref)}">${txt(d.linkLabel)}</a>`
        : "";
    return `
<section class="sec sec-textbox reveal sec-interactive" id="${esc(section.id)}" style="${styleAttr(st)}">
  ${atmosphere("box")}
  ${wrapOpen}
    <div class="text-box" style="width:min(100%,var(--sec-box));margin-inline:auto;padding:1.4rem 1.5rem;border:1px solid rgba(46,196,182,.22);background:rgba(10,53,64,.55)">
      <h2 style="font-size:var(--sec-title);color:var(--gold);${fontStyle(section, "title", "title")};margin:0 0 .75rem">${txt(d.title)}</h2>
      <p style="font-size:var(--sec-text);color:rgba(247,240,227,.85);${fontStyle(section, "body", "body")};${textAlignCss(st)};line-height:1.8;margin:0">${txt(d.body)}</p>
      ${link}
    </div>
  ${wrapClose}
</section>`;
  }

  if (section.type === "text_image") {
    const side = d.imageSide === "left" ? "left" : "right";
    const img = mediaById(media, d.mediaId);
    const link =
      d.linkHref && d.linkLabel
        ? `<a class="btn btn-nav split-link" style="margin-top:1rem;display:inline-flex;${fontStyle(section, "linkLabel", "button")}" href="${esc(d.linkHref)}">${txt(d.linkLabel)}</a>`
        : "";
    const mediaBlock = img
      ? `<div class="split-media"><img src="/posters/${esc(img.file)}" alt="" loading="lazy" /></div>`
      : `<div class="split-media split-media-empty"><span>عکس را از ادمین انتخاب کنید</span></div>`;
    return `
<section class="sec sec-split reveal sec-interactive" id="${esc(section.id)}" style="${styleAttr(st)}">
  ${atmosphere("split")}
  ${wrapOpen}
    <div class="split-row" data-image-side="${side}" style="gap:var(--sec-gap);min-height:${Number(st.minHeight) || 0}px">
      <div class="split-copy">
        <h2 style="font-size:var(--sec-title);color:var(--gold);${fontStyle(section, "title", "title")};margin:0 0 .85rem">${txt(d.title)}</h2>
        <p style="font-size:var(--sec-text);color:rgba(247,240,227,.86);${fontStyle(section, "body", "body")};${textAlignCss(st)};line-height:1.85;margin:0">${txt(d.body)}</p>
        ${link}
      </div>
      ${mediaBlock}
    </div>
  ${wrapClose}
</section>`;
  }

  if (section.type === "posters") {
    const ids = d.mediaIds || [];
    const posters = ids.map((id) => mediaById(media, id)).filter(Boolean);
    const effect = ["none", "tilt", "zoom", "shine", "lift", "float"].includes(d.effect) ? d.effect : "tilt";
    const slotClass = `poster-slot poster-fx-${effect}`;
    let stage;
    if (!posters.length) {
      stage = `<div class="${slotClass}" data-poster-fx="${effect}" style="min-height:${Number(st.minHeight) || 420}px"><div class="placeholder"><strong>جای پوستر</strong><span>از پنل ادمین پوستر اضافه کنید.</span></div></div>`;
    } else if (posters.length === 1) {
      stage = `<div class="${slotClass}" data-poster-fx="${effect}" style="min-height:${Number(st.minHeight) || 420}px"><img src="/posters/${esc(posters[0].file)}" alt="" /></div>`;
    } else {
      const rest = posters.slice(1, 3);
      stage = `
        <div class="poster-stage-grid" style="gap:var(--sec-gap)">
          <div class="${slotClass}" data-poster-fx="${effect}" style="min-height:${Number(st.minHeight) || 420}px"><img src="/posters/${esc(posters[0].file)}" alt="" /></div>
          <div class="poster-side" style="gap:var(--sec-gap)">
            ${rest
              .map(
                (p) =>
                  `<div class="${slotClass}" data-poster-fx="${effect}" style="min-height:${Math.max(160, (Number(st.minHeight) || 420) / 2 - 8)}px"><img src="/posters/${esc(p.file)}" alt="" /></div>`
              )
              .join("")}
          </div>
        </div>`;
    }
    return `
<section class="sec sec-posters reveal sec-interactive" id="${esc(section.id)}" data-poster-fx="${effect}" style="${styleAttr(st)}">
  ${atmosphere("posters")}
  ${wrapOpen}
    <h2 style="font-size:var(--sec-title);color:var(--gold);${fontStyle(section, "title", "title")};margin:0">${txt(d.title)}</h2>
    <p style="font-size:var(--sec-text);color:rgba(247,240,227,.65);${fontStyle(section, "subtitle", "body")};${textAlignCss(st)};margin:var(--sec-gap) 0 calc(var(--sec-gap)*1.2);max-width:36rem">${txt(d.subtitle || "")}</p>
    ${stage}
  ${wrapClose}
</section>`;
  }

  if (section.type === "features") {
    const items = d.items || [];
    const count = Math.max(1, items.length);
    return `
<section class="sec sec-features reveal sec-interactive" id="${esc(section.id)}" style="${styleAttr(st)}">
  ${atmosphere("features")}
  ${wrapOpen}
    <h2 class="features-title" style="font-size:var(--sec-title);color:var(--gold);${fontStyle(section, "title", "title")};margin:0 0 calc(var(--sec-gap)*1.05)">${txt(d.title)}</h2>
    <div class="features-row" style="--feat-count:${count};--feat-gap:var(--sec-gap)">
      ${items
        .map((item, i) => {
          const itemTitleF = fontStack(item.titleFont || d.fonts?.[`item${i}Title`] || st.titleFont || "Graphik Arabic");
          const itemBodyF = fontStack(item.bodyFont || d.fonts?.[`item${i}Body`] || st.bodyFont || "Graphik Arabic");
          const itemTitleC = /^#[0-9a-fA-F]{6}$/i.test(String(item.titleColor || "")) ? String(item.titleColor) : "";
          const itemBodyC = /^#[0-9a-fA-F]{6}$/i.test(String(item.bodyColor || "")) ? String(item.bodyColor) : "";
          const bodyAlign = normalizeTextAlign(item.bodyAlign || st.textAlign, "right");
          return `
        <article class="feat feat-card" style="--i:${i}">
          <div class="feat-head">
            <span class="feat-index" aria-hidden="true" style="font-family:${itemTitleF}">${toFaDigits(String(i + 1).padStart(2, "0"))}</span>
            <h3 style="font-family:${itemTitleF}${itemTitleC ? `;color:${itemTitleC}` : ""}">${txt(item.title)}</h3>
          </div>
          <p style="font-size:var(--sec-text);font-family:${itemBodyF}${itemBodyC ? `;color:${itemBodyC}` : ""};text-align:${bodyAlign}">${txt(item.body)}</p>
        </article>`;
        })
        .join("")}
    </div>
  ${wrapClose}
</section>`;
  }

  if (section.type === "blog") {
    const limit = Number(d.limit) > 0 ? Number(d.limit) : 3;
    const more =
      d.moreHref && d.moreLabel
        ? `<div class="blog-section-actions"><a class="btn btn-nav" style="${fontStyle(section, "moreLabel", "button")}" href="${esc(d.moreHref)}">${txt(d.moreLabel)}</a></div>`
        : "";
    return `
<section class="sec sec-blog reveal sec-interactive" id="${esc(section.id)}" style="${styleAttr(st)}">
  ${atmosphere("blog")}
  ${wrapOpen}
    <h2 style="font-size:var(--sec-title);color:var(--gold);${fontStyle(section, "title", "title")};margin:0">${txt(d.title || "مقالات")}</h2>
    <p style="font-size:var(--sec-text);color:rgba(247,240,227,.68);${fontStyle(section, "subtitle", "body")};${textAlignCss(st)};margin:var(--sec-gap) 0 calc(var(--sec-gap)*1.1);max-width:38rem">${txt(d.subtitle || "")}</p>
    ${renderBlogCards(posts, { limit })}
    ${more}
  ${wrapClose}
</section>`;
  }

  if (section.type === "cta") {
    return `
<section class="sec sec-cta reveal sec-interactive" id="${esc(section.id)}" style="${styleAttr(st)}">
  ${atmosphere("cta")}
  ${wrapOpen}
    <div class="cta-panel">
      <div class="content">
        <h2 style="font-size:var(--sec-title);color:var(--gold);${fontStyle(section, "title", "title")};margin:0">${txt(d.title)}</h2>
        <p style="font-size:var(--sec-text);${fontStyle(section, "body", "body")};${textAlignCss(st)}">${txt(d.body)}</p>
        <a class="btn btn-magnetic btn-to-register" data-scroll-to="register" style="${fontStyle(section, "buttonLabel", "button")}" href="${esc(d.buttonHref || "#register-1")}"><span>${txt(d.buttonLabel || "ادامه")}</span></a>
      </div>
    </div>
  ${wrapClose}
</section>`;
  }

  if (section.type === "links") {
    const items = d.items || [];
    return `
<section class="sec sec-links reveal sec-interactive" id="${esc(section.id)}" style="${styleAttr(st)}">
  ${atmosphere("links")}
  ${wrapOpen}
    <h2 style="font-size:var(--sec-title);color:var(--turquoise);${fontStyle(section, "title", "title")};margin:0 0 var(--sec-gap)">${txt(d.title)}</h2>
    <div class="links-row" style="gap:var(--sec-gap);display:flex;flex-wrap:wrap">
      ${items
        .map((item, i) => {
          const lf = fontStack(item.font || d.fonts?.[`link${i}`] || st.buttonFont || st.titleFont || "Graphik Arabic");
          const lc = /^#[0-9a-fA-F]{6}$/i.test(String(item.color || "")) ? String(item.color) : "";
          return `<a class="btn btn-nav" style="font-family:${lf}${lc ? `;color:${lc};border-color:${lc}` : ""}" href="${esc(item.href || "#")}"><span>${txt(item.label)}</span></a>`;
        })
        .join("")}
    </div>
  ${wrapClose}
</section>`;
  }

  if (section.type === "register") {
    const formBg = d.formBg || "#ffffff";
    const formText = d.formText || "#1a1a1a";
    const formAccent = d.formAccent || "#2ec4b6";
    const formButtonBg = d.formButtonBg || formAccent;
    const formButtonText = d.formButtonText || "#062a32";
    const successTitle = d.successTitle || "درخواست شما ثبت شد";
    const successBody = d.successBody || "کارشناسان سورناگلد به زودی با شما تماس می‌گیرند.";
    const successAsk = d.successAsk || "تمایل دارید از بنکداری هوشمند سایناگلد نیز دیدن کنید؟";
    const successLinkLabel = d.successLinkLabel || "مشاهده سایناگلد";
    const successLinkUrl = d.successLinkUrl || "https://sainagold.com";
    return `
<section class="sec sec-register reveal sec-interactive" id="${esc(section.id)}" style="${styleAttr(st)}">
  ${atmosphere("register")}
  <div class="sec-wrap register-stage" style="margin:0 auto;width:100%;gap:var(--sec-gap);position:relative;z-index:2">
    <div class="register-copy">
      <p class="register-eyebrow" style="color:var(--turquoise);font-size:.9rem;margin:0;font-weight:500;${fontStyle(section, "eyebrow", "body")}">${txt(d.eyebrow || "")}</p>
      <h2 style="margin-top:.55rem;font-size:var(--sec-title);color:var(--gold);${fontStyle(section, "title", "title")}">${txt(d.title)}</h2>
      <p class="register-lead" style="margin-top:.75rem;color:rgba(247,240,227,.8);line-height:1.75;font-size:var(--sec-text);${fontStyle(section, "body", "body")};${textAlignCss(st)}">${txt(d.body)}</p>
      <div class="register-copy-ornament" aria-hidden="true"></div>
    </div>
    <div class="register-panel">
      <form class="form lead-form form-elegant" enctype="multipart/form-data" data-success-modal="leadSuccessModal" style="${fontStyle(section, "form", "body")};--form-bg:${esc(formBg)};--form-text:${esc(formText)};--form-accent:${esc(formAccent)};--form-btn-bg:${esc(formButtonBg)};--form-btn-text:${esc(formButtonText)}">
        <div class="fields">
          <div class="field-row">
            <div class="field"><label>نام کامل</label><input name="fullName" required placeholder="نام و نام خانوادگی" autocomplete="name" /></div>
            <div class="field"><label>موبایل</label><input name="phone" required placeholder="۰۹۱۲۰۰۰۰۰۰۰" dir="ltr" inputmode="tel" autocomplete="tel" /></div>
          </div>
          <div class="field-row">
            <div class="field"><label>شهر</label><input name="city" placeholder="مثلاً تهران" autocomplete="address-level2" /></div>
            <div class="field"><label>نوع همکاری</label>
              <select name="interest" data-interest>
                <option value="shopkeeper">مغازه‌دار</option>
                <option value="keyfi">کیفی</option>
                <option value="melt_seller">آبشده‌فروش</option>
                <option value="wholesaler">بنکدار</option>
                <option value="maker">سازنده</option>
                <option value="other">سایر</option>
              </select>
            </div>
          </div>
          <div class="field field-doc is-hidden" data-doc-field>
            <label>جواز کسب / کارت ویزیت <span class="req">*</span></label>
            <input type="file" name="document" accept="image/*,.pdf" />
            <p class="hint">فقط برای مغازه‌دار، آبشده‌فروش و بنکدار.</p>
          </div>
          <div class="field field-other is-hidden" data-other-field>
            <label>توضیح کوتاه <span class="req">*</span></label>
            <input name="otherDetail" placeholder="نوع فعالیت خود را بنویسید" />
          </div>
          <button class="btn" type="submit" style="${fontStyle(section, "submit", "button")}"><span>ثبت اعلام آمادگی</span></button>
        </div>
      </form>
    </div>
  </div>
  <div class="lead-modal" id="leadSuccessModal" hidden>
    <div class="lead-modal-backdrop" data-modal-close></div>
    <div class="lead-modal-card" role="dialog" aria-modal="true" aria-labelledby="leadSuccessTitle">
      <button type="button" class="lead-modal-x" data-modal-close aria-label="بستن">×</button>
      <div class="lead-modal-ornament" aria-hidden="true"></div>
      <div class="lead-modal-icon" aria-hidden="true">✓</div>
      <h3 id="leadSuccessTitle">${txt(successTitle)}</h3>
      <p class="lead-modal-body">${txt(successBody)}</p>
      <div class="lead-modal-divider" aria-hidden="true"></div>
      <p class="lead-modal-ask">${txt(successAsk)}</p>
      <a class="lead-modal-link" href="${esc(successLinkUrl)}" target="_blank" rel="noopener noreferrer">${txt(successLinkLabel)}</a>
      <button type="button" class="lead-modal-close-btn" data-modal-close>بستن</button>
    </div>
  </div>
</section>`;
  }

  return "";
}


export function renderPage(content) {
  const sections = content?.sections || [];
  const media = content?.media || [];
  const posts = content?.posts || [];
  return sections.map((s) => renderSection(s, media, posts)).join("\n");
}

export function renderPostBody(body = "") {
  return String(body || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${txt(p)}</p>`)
    .join("");
}

export const INTEREST_LABELS = {
  shopkeeper: "مغازه‌دار",
  keyfi: "کیفی",
  melt_seller: "آبشده‌فروش",
  wholesaler: "بنکدار",
  maker: "سازنده",
  other: "سایر",
  melt_trader: "معامله‌گر طلای آبشده",
  gold_dealer: "طلافروش / بنکدار",
  supply: "تأمین‌کننده",
};

export const DOC_REQUIRED_INTERESTS = ["shopkeeper", "melt_seller", "wholesaler"];
