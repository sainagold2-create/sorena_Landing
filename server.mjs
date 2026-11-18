import http from "http";
import fs from "fs";
import path from "path";
import { randomUUID, randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";
import { fileURLToPath } from "url";
import { renderPage, SECTION_LABELS } from "./site-render.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = 4173;
const ADMIN_USER = "admin";
const ADMIN_PASS = "SurenaGold@1404";
const usersFile = path.join(root, "data", "users.json");
const analyticsFile = path.join(root, "data", "analytics.json");
/** @type {Map<string, { userId: string, username: string, role: string, displayName: string }>} */
const sessions = new Map();

const PERM_DEFS = {
  builder: { label: "سایت‌ساز (سکشن‌ها)" },
  blog: { label: "مقالات / بلاگ" },
  site: { label: "تنظیمات سایت و سئو" },
  media: { label: "کتابخانه پوستر" },
  "content.write": { label: "ذخیره و آپلود محتوا" },
  leads: { label: "مشاهده ثبت‌نام‌ها" },
  "leads.write": { label: "ویرایش ثبت‌نام‌ها" },
  stats: { label: "آمار بازدید و کلیک" },
  "users.manage": { label: "مدیریت کاربران و دسترسی‌ها" },
};

const ALL_PERMS = Object.keys(PERM_DEFS);

const ROLE_DEFS = {
  admin: {
    label: "مدیر کل (همه دسترسی‌ها)",
    perms: [...ALL_PERMS],
  },
  editor: {
    label: "ویرایشگر محتوا",
    perms: ["builder", "blog", "site", "media", "content.write", "stats"],
  },
  leads: {
    label: "مسئول ثبت‌نام",
    perms: ["leads", "leads.write"],
  },
  custom: {
    label: "سفارشی",
    perms: [],
  },
};

const DEFAULT_SEO = {
  title: "سورناگلد | معاملات طلای آبشده",
  description:
    "سورناگلد؛ خرید و فروش طلای آبشده با اعتبار سایناگلد. نرخ شفاف، تسویه سریع و معاملات مطمئن برای مغازه‌داران، کیفی‌ها و بنکداران.",
  keywords: "سورناگلد,طلای آبشده,خرید طلا,فروش طلا,سایناگلد,معاملات طلا,اصفهان",
  canonicalUrl: "",
  ogImage: "",
};

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(String(password), salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  try {
    const actual = scryptSync(String(password), String(salt || ""), 64);
    const expected = Buffer.from(String(hash || ""), "hex");
    return expected.length === actual.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function normalizePerms(list, fallbackRole = "editor") {
  const raw = Array.isArray(list) ? list : ROLE_DEFS[fallbackRole]?.perms || [];
  const set = new Set();
  for (const p of raw) {
    if (ALL_PERMS.includes(p)) set.add(p);
  }
  return [...set];
}

function userPerms(u) {
  if (Array.isArray(u?.perms) && u.perms.length) return normalizePerms(u.perms);
  return normalizePerms(ROLE_DEFS[u?.role]?.perms || [], u?.role || "editor");
}

function publicUser(u) {
  const perms = userPerms(u);
  const role = ROLE_DEFS[u.role] ? u.role : "custom";
  return {
    id: u.id,
    username: u.username,
    displayName: u.displayName || u.username,
    role,
    roleLabel: ROLE_DEFS[role]?.label || role,
    perms,
    createdAt: u.createdAt || null,
  };
}

function rolePerms(role) {
  return normalizePerms(ROLE_DEFS[role]?.perms || []);
}

function countUsersWithPerm(users, perm) {
  return users.filter((u) => userPerms(u).includes(perm)).length;
}

function ensureUsers() {
  const data = readJson(usersFile, { users: [] });
  let users = Array.isArray(data.users) ? data.users : [];
  let changed = false;
  if (!users.length) {
    const { salt, hash } = hashPassword(ADMIN_PASS);
    users = [
      {
        id: randomUUID(),
        username: ADMIN_USER,
        displayName: "مدیر کل",
        role: "admin",
        perms: [...ALL_PERMS],
        salt,
        passwordHash: hash,
        createdAt: new Date().toISOString(),
      },
    ];
    changed = true;
  } else {
    users = users.map((u) => {
      if (Array.isArray(u.perms) && u.perms.length) {
        const perms = normalizePerms(u.perms);
        if (perms.length !== u.perms.length) {
          changed = true;
          return { ...u, perms };
        }
        return u;
      }
      changed = true;
      return { ...u, perms: userPerms(u) };
    });
  }
  if (changed) writeJson(usersFile, { users });
  return users;
}

function saveUsers(users) {
  writeJson(usersFile, { users });
}

function findUserByUsername(username) {
  const name = String(username || "").trim().toLowerCase();
  return ensureUsers().find((u) => String(u.username || "").toLowerCase() === name) || null;
}

function findUserById(id) {
  return ensureUsers().find((u) => u.id === id) || null;
}

function getSession(req) {
  const cookies = parseCookies(req);
  const token = cookies.sg_admin;
  if (!token || !sessions.has(token)) return null;
  return { token, ...sessions.get(token) };
}

function hasPerm(session, perm) {
  if (!session) return false;
  const perms = Array.isArray(session.perms) ? session.perms : rolePerms(session.role);
  return perms.includes(perm);
}

function sessionPayload(user) {
  const perms = userPerms(user);
  return {
    userId: user.id,
    username: user.username,
    role: ROLE_DEFS[user.role] ? user.role : "custom",
    displayName: user.displayName || user.username,
    perms,
  };
}

function deny(res, status = 403, error = "دسترسی مجاز نیست") {
  return send(res, status, { error });
}

function dayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function emptyDayStats() {
  return {
    views: 0,
    unique: 0,
    visitors: [],
    clicks: { login: 0, register: 0, nav: 0, cta: 0, blog: 0 },
    sections: {},
  };
}

function loadAnalytics() {
  const data = readJson(analyticsFile, { days: {} });
  if (!data.days || typeof data.days !== "object") data.days = {};
  return data;
}

function saveAnalytics(data) {
  // نگه داشتن فقط ۹۰ روز اخیر
  const keys = Object.keys(data.days || {}).sort();
  if (keys.length > 90) {
    for (const k of keys.slice(0, keys.length - 90)) delete data.days[k];
  }
  // visitors آرایه را کوتاه نگه دار
  for (const day of Object.values(data.days || {})) {
    if (Array.isArray(day.visitors) && day.visitors.length > 5000) {
      day.visitors = day.visitors.slice(-5000);
    }
  }
  writeJson(analyticsFile, data);
}

function visitorIdFrom(req, bodyVid) {
  const fromBody = String(bodyVid || "").trim();
  if (/^[a-zA-Z0-9_-]{8,64}$/.test(fromBody)) return fromBody;
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
  const ua = String(req.headers["user-agent"] || "ua");
  return createHash("sha256").update(`${ip}|${ua}`).digest("hex").slice(0, 16);
}

function requestOrigin(req) {
  const host = String(req.headers.host || `localhost:${port}`);
  const proto = String(req.headers["x-forwarded-proto"] || "http").split(",")[0].trim();
  return `${proto}://${host}`;
}

function normalizeSeo(raw, prev = {}) {
  const src = raw && typeof raw === "object" ? raw : prev || {};
  return {
    title: String(src.title || DEFAULT_SEO.title).trim() || DEFAULT_SEO.title,
    description: String(src.description || DEFAULT_SEO.description).trim() || DEFAULT_SEO.description,
    keywords: String(src.keywords || DEFAULT_SEO.keywords).trim(),
    canonicalUrl: String(src.canonicalUrl || "").trim(),
    ogImage: String(src.ogImage || "").trim(),
  };
}

function escHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSeoHead(site = {}, origin = `http://localhost:${port}`) {
  const seo = normalizeSeo(site.seo);
  const canonical = seo.canonicalUrl || `${origin}/`;
  const image = seo.ogImage
    ? /^https?:\/\//i.test(seo.ogImage)
      ? seo.ogImage
      : `${origin}${seo.ogImage.startsWith("/") ? "" : "/"}${seo.ogImage}`
    : "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.footer?.brand || "سورناگلد",
    url: canonical.replace(/\/$/, "") || origin,
    description: seo.description,
    telephone: site.footer?.phone || undefined,
    address: site.footer?.address
      ? { "@type": "PostalAddress", addressLocality: "اصفهان", streetAddress: site.footer.address, addressCountry: "IR" }
      : undefined,
  };
  return `
<meta name="description" content="${escHtml(seo.description)}" />
<meta name="keywords" content="${escHtml(seo.keywords)}" />
<meta name="robots" content="index,follow,max-image-preview:large" />
<link rel="canonical" href="${escHtml(canonical)}" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="fa_IR" />
<meta property="og:site_name" content="${escHtml(site.footer?.brand || "سورناگلد")}" />
<meta property="og:title" content="${escHtml(seo.title)}" />
<meta property="og:description" content="${escHtml(seo.description)}" />
<meta property="og:url" content="${escHtml(canonical)}" />
${image ? `<meta property="og:image" content="${escHtml(image)}" />` : ""}
<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />
<meta name="twitter:title" content="${escHtml(seo.title)}" />
<meta name="twitter:description" content="${escHtml(seo.description)}" />
${image ? `<meta name="twitter:image" content="${escHtml(image)}" />` : ""}
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
`.trim();
}

function enhanceIndexHtml(html, content, req) {
  const site = content?.site || {};
  const seo = normalizeSeo(site.seo);
  const origin = requestOrigin(req);
  const head = buildSeoHead(site, origin);
  let out = html.replace(/<title>[^<]*<\/title>/i, `<title>${escHtml(seo.title)}</title>`);
  if (out.includes("<!--SEO_HEAD-->")) {
    out = out.replace("<!--SEO_HEAD-->", head);
  } else {
    out = out.replace("</head>", `${head}\n</head>`);
  }
  const rendered = renderPage(content);
  out = out.replace(
    /<main\b[^>]*id="page-sections"[^>]*>[\s\S]*?<\/main>/i,
    `<main id="page-sections">${rendered}</main>`
  );
  out = out.replace(
    /<div\b[^>]*id="page-sections"[^>]*>[\s\S]*?<\/div>/i,
    `<main id="page-sections">${rendered}</main>`
  );
  return out;
}

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".otf": "font/otf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

function send(res, status, body, headers = {}) {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": headers["Content-Type"] || "application/json; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
    ...headers,
  });
  res.end(payload);
}

function parseCookies(req) {
  const raw = req.headers.cookie || "";
  return Object.fromEntries(
    raw
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        const i = p.indexOf("=");
        return i === -1 ? [p, ""] : [p.slice(0, i), decodeURIComponent(p.slice(i + 1))];
      })
  );
}

function isAuthed(req) {
  return Boolean(getSession(req));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function parseMultipart(buffer, boundary) {
  const parts = [];
  const sep = Buffer.from(`--${boundary}`);
  let start = buffer.indexOf(sep) + sep.length;
  while (start < buffer.length) {
    if (buffer[start] === 45 && buffer[start + 1] === 45) break; // --
    if (buffer[start] === 13 && buffer[start + 1] === 10) start += 2;
    const next = buffer.indexOf(sep, start);
    const slice = buffer.subarray(start, next === -1 ? buffer.length : next - 2);
    const headerEnd = slice.indexOf("\r\n\r\n");
    if (headerEnd !== -1) {
      const header = slice.subarray(0, headerEnd).toString("utf8");
      const content = slice.subarray(headerEnd + 4);
      const nameMatch = /name="([^"]+)"/.exec(header);
      const fileMatch = /filename="([^"]+)"/.exec(header);
      const typeMatch = /Content-Type:\s*(.+)/i.exec(header);
      parts.push({
        name: nameMatch?.[1],
        filename: fileMatch?.[1],
        type: typeMatch?.[1]?.trim(),
        data: content,
      });
    }
    if (next === -1) break;
    start = next + sep.length;
  }
  return parts;
}

async function handleApi(req, res, urlPath) {
  const contentFile = path.join(root, "data", "content.json");
  const leadsFile = path.join(root, "data", "leads.json");

  if (req.method === "GET" && urlPath === "/api/content") {
    return send(res, 200, readJson(contentFile, {}));
  }

  if (req.method === "POST" && urlPath === "/api/analytics/event") {
    const raw = await readBody(req);
    let data;
    try {
      data = JSON.parse(raw.toString("utf8") || "{}");
    } catch {
      return send(res, 400, { error: "JSON نامعتبر" });
    }
    const type = String(data.type || "").trim();
    const name = String(data.name || "").trim();
    const sectionId = String(data.sectionId || "").trim();
    const store = loadAnalytics();
    const key = dayKey();
    if (!store.days[key]) store.days[key] = emptyDayStats();
    const day = store.days[key];
    if (!day.clicks || typeof day.clicks !== "object") day.clicks = emptyDayStats().clicks;
    if (!day.sections || typeof day.sections !== "object") day.sections = {};
    if (!Array.isArray(day.visitors)) day.visitors = [];

    const vid = visitorIdFrom(req, data.vid);
    if (type === "page_view") {
      day.views += 1;
      if (!day.visitors.includes(vid)) {
        day.visitors.push(vid);
        day.unique = day.visitors.length;
      }
    } else if (type === "click") {
      const allowed = ["login", "register", "nav", "cta", "blog"];
      const clickName = allowed.includes(name) ? name : "nav";
      day.clicks[clickName] = (Number(day.clicks[clickName]) || 0) + 1;
    } else if (type === "section_view" && sectionId && sectionId.length < 80) {
      day.sections[sectionId] = (Number(day.sections[sectionId]) || 0) + 1;
    } else {
      return send(res, 400, { error: "رویداد نامعتبر" });
    }
    saveAnalytics(store);
    return send(res, 200, { ok: true });
  }

  if (req.method === "POST" && urlPath === "/api/leads") {
    const raw = await readBody(req);
    const ctype = req.headers["content-type"] || "";
    let fields = {};
    let uploaded = null;

    if (ctype.includes("multipart/form-data")) {
      const boundary = /boundary=(.+)$/i.exec(ctype)?.[1];
      if (!boundary) return send(res, 400, { error: "multipart نامعتبر" });
      const parts = parseMultipart(raw, boundary);
      for (const part of parts) {
        if (part.filename) {
          uploaded = part;
        } else if (part.name) {
          fields[part.name] = part.data.toString("utf8").replace(/\r$/, "");
        }
      }
    } else {
      try {
        fields = JSON.parse(raw.toString("utf8"));
      } catch {
        return send(res, 400, { error: "JSON نامعتبر" });
      }
    }

    const fullName = String(fields.fullName || "").trim();
    const phone = String(fields.phone || "")
      .trim()
      .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
      .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
    const interest = String(fields.interest || "other").trim();
    const otherDetail = String(fields.otherDetail || "").trim();
    const message = String(fields.message || "").trim();
    const docRequired = ["shopkeeper", "melt_seller", "wholesaler"].includes(interest);

    if (!fullName || !phone) return send(res, 400, { error: "نام و موبایل الزامی است" });
    if (interest === "other" && !otherDetail) {
      return send(res, 400, { error: "برای گزینه سایر، توضیح الزامی است" });
    }
    if (docRequired && !uploaded?.filename) {
      return send(res, 400, { error: "آپلود جواز کسب یا کارت ویزیت الزامی است" });
    }

    let documentFile = null;
    if (uploaded?.filename) {
      const ext = path.extname(uploaded.filename).toLowerCase() || ".jpg";
      if (![".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"].includes(ext)) {
        return send(res, 400, { error: "فقط تصویر یا PDF مجاز است" });
      }
      const name = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
      const leadsDir = path.join(root, "uploads", "leads");
      fs.mkdirSync(leadsDir, { recursive: true });
      fs.writeFileSync(path.join(leadsDir, name), uploaded.data);
      documentFile = name;
    }

    const leads = readJson(leadsFile, []);
    leads.unshift({
      id: randomUUID(),
      fullName,
      phone,
      city: String(fields.city || "").trim() || null,
      interest,
      otherDetail: otherDetail || null,
      message: message || null,
      document: documentFile,
      notes: "",
      status: "new",
      createdAt: new Date().toISOString(),
    });
    writeJson(leadsFile, leads);
    return send(res, 200, { ok: true });
  }

  if (req.method === "POST" && urlPath === "/api/admin/login") {
    const raw = await readBody(req);
    let data;
    try {
      data = JSON.parse(raw.toString("utf8"));
    } catch {
      return send(res, 400, { error: "JSON نامعتبر" });
    }
    ensureUsers();
    const user = findUserByUsername(data.username);
    if (!user || !verifyPassword(data.password, user.salt, user.passwordHash)) {
      return send(res, 401, { error: "نام کاربری یا رمز اشتباه است" });
    }
    const token = randomUUID();
    const payload = sessionPayload(user);
    sessions.set(token, payload);
    return send(res, 200, { ok: true, user: publicUser(user), perms: payload.perms, roles: ROLE_DEFS, permDefs: PERM_DEFS }, {
      "Set-Cookie": `sg_admin=${token}; Path=/; HttpOnly; SameSite=Lax`,
    });
  }

  if (req.method === "POST" && urlPath === "/api/admin/logout") {
    const cookies = parseCookies(req);
    sessions.delete(cookies.sg_admin);
    return send(res, 200, { ok: true }, {
      "Set-Cookie": "sg_admin=; Path=/; Max-Age=0",
    });
  }

  if (!isAuthed(req) && urlPath.startsWith("/api/admin")) {
    return send(res, 401, { error: "وارد شوید" });
  }

  const session = getSession(req);

  if (req.method === "GET" && urlPath === "/api/admin/session") {
    const user = findUserById(session.userId);
    if (!user) {
      sessions.delete(session.token);
      return send(res, 401, { error: "وارد شوید" });
    }
    const payload = sessionPayload(user);
    sessions.set(session.token, payload);
    return send(res, 200, {
      ok: true,
      user: publicUser(user),
      perms: payload.perms,
      roles: ROLE_DEFS,
      permDefs: PERM_DEFS,
    });
  }

  if (req.method === "GET" && urlPath === "/api/admin/users") {
    if (!hasPerm(session, "users.manage")) return deny(res);
    return send(res, 200, { users: ensureUsers().map(publicUser), roles: ROLE_DEFS, permDefs: PERM_DEFS });
  }

  if (req.method === "POST" && urlPath === "/api/admin/users") {
    if (!hasPerm(session, "users.manage")) return deny(res);
    const raw = await readBody(req);
    let data;
    try {
      data = JSON.parse(raw.toString("utf8"));
    } catch {
      return send(res, 400, { error: "JSON نامعتبر" });
    }
    const username = String(data.username || "").trim().toLowerCase();
    const password = String(data.password || "");
    const displayName = String(data.displayName || "").trim() || username;
    let role = ROLE_DEFS[data.role] ? data.role : "custom";
    let perms = normalizePerms(data.perms, role === "custom" ? "editor" : role);
    if (!Array.isArray(data.perms) || !data.perms.length) {
      perms = rolePerms(role === "custom" ? "editor" : role);
    }
    if (role !== "custom") {
      // اگر پرم‌ها با قالب نقش فرق داشت، سفارشی شود
      const preset = rolePerms(role).slice().sort().join(",");
      if (perms.slice().sort().join(",") !== preset) role = "custom";
    }
    if (!perms.length) return send(res, 400, { error: "حداقل یک دسترسی انتخاب کنید" });
    if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
      return send(res, 400, { error: "نام کاربری باید ۳ تا ۳۲ کاراکتر انگلیسی/عدد باشد" });
    }
    if (password.length < 6) return send(res, 400, { error: "رمز عبور حداقل ۶ کاراکتر باشد" });
    if (findUserByUsername(username)) return send(res, 400, { error: "این نام کاربری قبلاً ثبت شده" });
    const { salt, hash } = hashPassword(password);
    const users = ensureUsers();
    const user = {
      id: randomUUID(),
      username,
      displayName,
      role,
      perms,
      salt,
      passwordHash: hash,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    saveUsers(users);
    return send(res, 200, { ok: true, user: publicUser(user) });
  }

  if (req.method === "PUT" && urlPath.startsWith("/api/admin/users/")) {
    if (!hasPerm(session, "users.manage")) return deny(res);
    const id = urlPath.split("/").pop();
    const raw = await readBody(req);
    let data;
    try {
      data = JSON.parse(raw.toString("utf8"));
    } catch {
      return send(res, 400, { error: "JSON نامعتبر" });
    }
    const users = ensureUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return send(res, 404, { error: "کاربر یافت نشد" });
    if (data.displayName != null) {
      users[idx].displayName = String(data.displayName).trim() || users[idx].username;
    }
    if (data.role != null || data.perms != null) {
      let role = ROLE_DEFS[data.role] ? data.role : users[idx].role || "custom";
      let perms =
        data.perms != null
          ? normalizePerms(data.perms, role)
          : data.role && ROLE_DEFS[data.role]
            ? rolePerms(data.role)
            : userPerms(users[idx]);
      if (!perms.length) return send(res, 400, { error: "حداقل یک دسترسی انتخاب کنید" });
      if (role !== "custom") {
        const preset = rolePerms(role).slice().sort().join(",");
        if (perms.slice().sort().join(",") !== preset) role = "custom";
      }
      const hadManage = userPerms(users[idx]).includes("users.manage");
      const willManage = perms.includes("users.manage");
      if (hadManage && !willManage && countUsersWithPerm(users, "users.manage") <= 1) {
        return send(res, 400, { error: "حداقل یک کاربر باید دسترسی مدیریت کاربران داشته باشد" });
      }
      users[idx].role = role;
      users[idx].perms = perms;
    }
    if (data.password != null && String(data.password).length) {
      if (String(data.password).length < 6) return send(res, 400, { error: "رمز عبور حداقل ۶ کاراکتر باشد" });
      const { salt, hash } = hashPassword(data.password);
      users[idx].salt = salt;
      users[idx].passwordHash = hash;
    }
    saveUsers(users);
    for (const [token, s] of sessions.entries()) {
      if (s.userId === id) sessions.set(token, sessionPayload(users[idx]));
    }
    return send(res, 200, { ok: true, user: publicUser(users[idx]) });
  }

  if (req.method === "DELETE" && urlPath.startsWith("/api/admin/users/")) {
    if (!hasPerm(session, "users.manage")) return deny(res);
    const id = urlPath.split("/").pop();
    if (id === session.userId) return send(res, 400, { error: "نمی‌توانید خودتان را حذف کنید" });
    const users = ensureUsers();
    const target = users.find((u) => u.id === id);
    if (!target) return send(res, 404, { error: "کاربر یافت نشد" });
    if (userPerms(target).includes("users.manage") && countUsersWithPerm(users, "users.manage") <= 1) {
      return send(res, 400, { error: "حداقل یک کاربر باید دسترسی مدیریت کاربران داشته باشد" });
    }
    const next = users.filter((u) => u.id !== id);
    saveUsers(next);
    for (const [token, s] of sessions.entries()) {
      if (s.userId === id) sessions.delete(token);
    }
    return send(res, 200, { ok: true });
  }

  if (req.method === "GET" && urlPath === "/api/admin/analytics") {
    if (!hasPerm(session, "stats")) return deny(res);
    const daysN = Math.max(1, Math.min(90, Number(new URL(req.url || "", "http://x").searchParams.get("days")) || 14));
    const store = loadAnalytics();
    const content = readJson(contentFile, {});
    const sectionMeta = {};
    for (const sec of content.sections || []) {
      if (!sec?.id) continue;
      sectionMeta[sec.id] = {
        id: sec.id,
        type: sec.type,
        label: SECTION_LABELS[sec.type] || sec.type,
        title: sec.data?.title || sec.data?.headline || sec.id,
      };
    }
    const series = [];
    const now = new Date();
    let totals = {
      views: 0,
      unique: 0,
      clicks: { login: 0, register: 0, nav: 0, cta: 0, blog: 0 },
      sections: {},
    };
    for (let i = daysN - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = dayKey(d);
      const day = store.days[key] || emptyDayStats();
      const clicks = { ...emptyDayStats().clicks, ...(day.clicks || {}) };
      series.push({
        date: key,
        views: Number(day.views) || 0,
        unique: Number(day.unique) || (Array.isArray(day.visitors) ? day.visitors.length : 0),
        clicks,
      });
      totals.views += Number(day.views) || 0;
      totals.unique += Number(day.unique) || (Array.isArray(day.visitors) ? day.visitors.length : 0);
      for (const [k, v] of Object.entries(clicks)) totals.clicks[k] = (totals.clicks[k] || 0) + (Number(v) || 0);
      for (const [sid, cnt] of Object.entries(day.sections || {})) {
        totals.sections[sid] = (totals.sections[sid] || 0) + (Number(cnt) || 0);
      }
    }
    const topSections = Object.entries(totals.sections)
      .map(([id, count]) => ({
        id,
        count,
        ...(sectionMeta[id] || { label: id, title: id, type: "" }),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
    const today = store.days[dayKey()] || emptyDayStats();
    return send(res, 200, {
      days: daysN,
      today: {
        views: Number(today.views) || 0,
        unique: Number(today.unique) || (Array.isArray(today.visitors) ? today.visitors.length : 0),
        clicks: { ...emptyDayStats().clicks, ...(today.clicks || {}) },
      },
      totals,
      series,
      topSections,
    });
  }

  if (req.method === "GET" && urlPath === "/api/admin/leads") {
    if (!hasPerm(session, "leads")) return deny(res);
    return send(res, 200, readJson(leadsFile, []));
  }

  if (req.method === "PUT" && urlPath.startsWith("/api/admin/leads/")) {
    if (!hasPerm(session, "leads.write")) return deny(res);
    const id = urlPath.split("/").pop();
    const raw = await readBody(req);
    let data;
    try {
      data = JSON.parse(raw.toString("utf8"));
    } catch {
      return send(res, 400, { error: "JSON نامعتبر" });
    }
    const leads = readJson(leadsFile, []);
    const idx = leads.findIndex((l) => l.id === id);
    if (idx === -1) return send(res, 404, { error: "یافت نشد" });
    leads[idx] = {
      ...leads[idx],
      status: data.status ?? leads[idx].status,
      notes: data.notes ?? leads[idx].notes,
    };
    writeJson(leadsFile, leads);
    return send(res, 200, leads[idx]);
  }

  if (req.method === "PUT" && urlPath === "/api/admin/content") {
    if (!hasPerm(session, "content.write")) return deny(res);
    const raw = await readBody(req);
    let data;
    try {
      data = JSON.parse(raw.toString("utf8"));
    } catch {
      return send(res, 400, { error: "JSON نامعتبر" });
    }
    if (!Array.isArray(data.sections)) {
      return send(res, 400, { error: "ساختار sections نامعتبر است" });
    }
    const prev = readJson(contentFile, {});
    const site = data.site && typeof data.site === "object" ? data.site : prev.site || {};
    const normalizeTicker = (items) =>
      (Array.isArray(items) ? items : [])
        .map((t) => {
          if (typeof t === "string") {
            const text = t.trim();
            return text ? { text, color: "#f7f0e3" } : null;
          }
          if (t && typeof t === "object") {
            const text = String(t.text || "").trim();
            if (!text) return null;
            const color = String(t.color || "#f7f0e3").trim() || "#f7f0e3";
            return { text, color };
          }
          return null;
        })
        .filter(Boolean);
    const tickerItems = normalizeTicker(site.tickerItems);
    const normalizeNav = (items) =>
      (Array.isArray(items) ? items : [])
        .map((n) => {
          if (!n || typeof n !== "object") return null;
          const label = String(n.label || "").trim();
          if (!label) return null;
          const variant = ["link", "login", "cta"].includes(n.variant) ? n.variant : "link";
          return {
            label,
            href: String(n.href || "").trim(),
            font: String(n.font || "Graphik Arabic").trim() || "Graphik Arabic",
            size: Math.max(10, Math.min(28, Number(n.size) || 14)),
            color: String(n.color || "#f7f0e3").trim() || "#f7f0e3",
            variant,
          };
        })
        .filter(Boolean);
    const navItems = normalizeNav(site.navItems);
    const normalizeFooter = (raw) => {
      const src = raw && typeof raw === "object" ? raw : prev.site?.footer || {};
      const infos = Array.isArray(src.infos)
        ? src.infos
            .map((item, i) => {
              if (!item || typeof item !== "object") return null;
              const label = String(item.label || "").trim();
              if (!label) return null;
              return {
                id: String(item.id || `info-${i}`).trim() || `info-${i}`,
                label,
                title: String(item.title || label).trim() || label,
                body: String(item.body || "").trim(),
              };
            })
            .filter(Boolean)
        : [];
      return {
        brand: String(src.brand || "سورناگلد").trim() || "سورناگلد",
        tagline: String(src.tagline ?? "معاملات طلای آبشده · با اعتبار سایناگلد").trim(),
        address: String(src.address || "").trim(),
        phone: String(src.phone || "").trim(),
        infos,
      };
    };
    writeJson(contentFile, {
      site: {
        loginUrl: String(site.loginUrl || "").trim(),
        loginLabel: String(site.loginLabel || "ورود").trim() || "ورود",
        defaultFont: String(site.defaultFont || "Graphik Arabic").trim() || "Graphik Arabic",
        tickerSpeed: Math.max(1, Math.min(10, Math.round(Number(site.tickerSpeed) || Number(prev.site?.tickerSpeed) || 5))),
        navItems: navItems.length ? navItems : normalizeNav(prev.site?.navItems),
        tickerItems: tickerItems.length ? tickerItems : normalizeTicker(prev.site?.tickerItems),
        footer: normalizeFooter(site.footer),
        seo: normalizeSeo(site.seo, prev.site?.seo),
      },
      posts: Array.isArray(data.posts)
        ? data.posts.map((p) => {
            if (!p || typeof p !== "object") return null;
            return {
              ...p,
              image: String(p.image || "").trim() || null,
            };
          }).filter(Boolean)
        : prev.posts || [],
      media: Array.isArray(data.media) ? data.media : [],
      sections: data.sections,
      posters: Array.isArray(data.posters) ? data.posters : prev.posters || [],
    });
    return send(res, 200, { ok: true });
  }

  if (req.method === "POST" && urlPath === "/api/admin/post-image") {
    if (!hasPerm(session, "content.write") && !hasPerm(session, "blog")) return deny(res);
    const raw = await readBody(req);
    const ctype = req.headers["content-type"] || "";
    const boundary = /boundary=(.+)$/i.exec(ctype)?.[1];
    if (!boundary) return send(res, 400, { error: "multipart لازم است" });
    const parts = parseMultipart(raw, boundary);
    const file = parts.find((p) => p.filename);
    if (!file) return send(res, 400, { error: "فایل انتخاب نشده" });
    const ext = path.extname(file.filename).toLowerCase() || ".jpg";
    if (![".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) {
      return send(res, 400, { error: "فقط تصویر مجاز است" });
    }
    const name = `post-${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
    const postersDir = path.join(root, "posters");
    fs.mkdirSync(postersDir, { recursive: true });
    fs.writeFileSync(path.join(postersDir, name), file.data);
    return send(res, 200, { ok: true, file: name });
  }

  if (req.method === "POST" && urlPath === "/api/admin/media") {
    if (!hasPerm(session, "media")) return deny(res);
    const raw = await readBody(req);
    const ctype = req.headers["content-type"] || "";
    const boundary = /boundary=(.+)$/i.exec(ctype)?.[1];
    if (!boundary) return send(res, 400, { error: "multipart لازم است" });
    const parts = parseMultipart(raw, boundary);
    const file = parts.find((p) => p.filename);
    if (!file) return send(res, 400, { error: "فایل انتخاب نشده" });
    const ext = path.extname(file.filename).toLowerCase() || ".jpg";
    if (![".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) {
      return send(res, 400, { error: "فقط تصویر مجاز است" });
    }
    const name = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
    const postersDir = path.join(root, "posters");
    fs.mkdirSync(postersDir, { recursive: true });
    fs.writeFileSync(path.join(postersDir, name), file.data);
    const content = readJson(contentFile, { media: [], sections: [] });
    content.media = content.media || [];
    const item = { id: randomUUID(), file: name, createdAt: new Date().toISOString() };
    content.media.unshift(item);
    writeJson(contentFile, content);
    return send(res, 200, { ok: true, media: content.media, item });
  }

  if (req.method === "DELETE" && urlPath.startsWith("/api/admin/media/")) {
    if (!hasPerm(session, "media")) return deny(res);
    const id = urlPath.split("/").pop();
    const content = readJson(contentFile, { media: [], sections: [] });
    const poster = (content.media || []).find((p) => p.id === id);
    content.media = (content.media || []).filter((p) => p.id !== id);
    content.sections = (content.sections || []).map((sec) => {
      if (sec.type !== "posters") return sec;
      const mediaIds = (sec.data?.mediaIds || []).filter((mid) => mid !== id);
      return { ...sec, data: { ...sec.data, mediaIds } };
    });
    writeJson(contentFile, content);
    if (poster?.file) {
      try {
        fs.unlinkSync(path.join(root, "posters", poster.file));
      } catch {
        // ignore
      }
    }
    return send(res, 200, { ok: true, media: content.media, sections: content.sections });
  }

  return send(res, 404, { error: "Not found" });
}

function serveStatic(req, res, urlPath) {
  let filePath = urlPath;
  if (filePath === "/") filePath = "/index.html";
  if (filePath === "/admin" || filePath === "/admin/") filePath = "/admin.html";
  if (filePath === "/blog" || filePath === "/blog/" || /^\/blog\/[^/]+\/?$/.test(filePath)) {
    filePath = "/blog.html";
  }
  if (filePath.startsWith("/uploads/")) {
    // served as static below
  }

  const full = path.normalize(path.join(root, decodeURIComponent(filePath)));
  if (!full.startsWith(root)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(full, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Not found");
    }
    const ext = path.extname(full).toLowerCase();
    let body = data;
    if (filePath === "/index.html") {
      try {
        const content = readJson(path.join(root, "data", "content.json"), {});
        body = Buffer.from(enhanceIndexHtml(data.toString("utf8"), content, req), "utf8");
      } catch (e) {
        console.error("SEO/SSR index failed", e);
      }
    }
    const noCache = [".html", ".js", ".mjs", ".css", ".json"].includes(ext);
    res.writeHead(200, {
      "Content-Type": mime[ext] || "application/octet-stream",
      ...(noCache
        ? { "Cache-Control": "no-store, no-cache, must-revalidate", Pragma: "no-cache" }
        : { "Cache-Control": "public, max-age=86400" }),
    });
    res.end(body);
  });
}

const server = http.createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  try {
    if (urlPath === "/robots.txt") {
      const origin = requestOrigin(req);
      const body = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin",
        "Disallow: /api/",
        `Sitemap: ${origin}/sitemap.xml`,
        "",
      ].join("\n");
      return send(res, 200, body, { "Content-Type": "text/plain; charset=utf-8" });
    }
    if (urlPath === "/sitemap.xml") {
      const origin = requestOrigin(req);
      const content = readJson(path.join(root, "data", "content.json"), {});
      const urls = [`${origin}/`, `${origin}/blog`];
      for (const post of content.posts || []) {
        if (post?.published === false || !post?.slug) continue;
        urls.push(`${origin}/blog/${encodeURIComponent(post.slug)}`);
      }
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url><loc>${escHtml(u)}</loc><changefreq>weekly</changefreq></url>`
  )
  .join("\n")}
</urlset>`;
      return send(res, 200, xml, { "Content-Type": "application/xml; charset=utf-8" });
    }
    if (urlPath.startsWith("/api/")) {
      await handleApi(req, res, urlPath);
      return;
    }
    serveStatic(req, res, urlPath);
  } catch (e) {
    console.error(e);
    send(res, 500, { error: "خطای سرور" });
  }
});

server.listen(port, () => {
  console.log(`SurenaGold http://localhost:${port}`);
  console.log(`Admin     http://localhost:${port}/admin`);
  console.log(`Login     ${ADMIN_USER} / ${ADMIN_PASS}`);
});
