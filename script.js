/* =====================================================================
   КОНФИГУРАЦИЯ САЙТА — редактируйте только этот блок
   ===================================================================== */
const CONFIG = {
  name: "GerardTheBanana",
  title: "GerardTheBanana — Artist & Streamer",

  about: {
    avatar: "assets/avatar.png", // положите файл сюда; пока его нет, показывается заглушка
    text: "Гера, Жерард, ГераЗеБарана и так далее...",
    info: [ // [подпись, значение]
      ["О себе", "22 года, стример, художник, музыкант"],
      ["Интересы", "Много :р"],
      ["Расписание", "ВТ, ЧТ, ВС 19:30-20:00 МСК"],
    ],
  },

  // Добавляйте работы строками ниже. thumbnail — необязательно (по умолчанию берётся src).
  artworks: [
    { src: "assets/artworks/artwork-01.jpg", thumbnail: "", title: "Artwork 01", description: "" },
    { src: "assets/artworks/artwork-02.jpg", thumbnail: "", title: "Artwork 02", description: "" },
    { src: "assets/artworks/artwork-03.jpg", thumbnail: "", title: "Artwork 03", description: "" },
    { src: "assets/artworks/artwork-04.jpg", thumbnail: "", title: "Artwork 04", description: "" },
    { src: "assets/artworks/artwork-05.jpg", thumbnail: "", title: "Artwork 05", description: "" },
    { src: "assets/artworks/artwork-06.jpg", thumbnail: "", title: "Artwork 06", description: "" },
    { src: "assets/artworks/artwork-07.jpg", thumbnail: "", title: "Artwork 07", description: "" },
    { src: "assets/artworks/artwork-08.jpg", thumbnail: "", title: "Artwork 08", description: "" },
    { src: "assets/artworks/artwork-09.jpg", thumbnail: "", title: "Artwork 09", description: "" },
  ],

  socials: [ // icon — файл из assets/icons/
    { name: "Twitch", url: "https://www.twitch.tv/gerardthebanana", icon: "twitch.png" },
    { name: "Второй канал", url: "https://www.twitch.tv/kpyrofriend", icon: "twitch.png" },
    { name: "Telegram", url: "https://t.me/geralox", icon: "telegram.png" },
    { name: "Щитпост", url: "https://t.me/+-k2erP1pUvk5ZDk6", icon: "telegram.png" },
    { name: "YouTube", url: "https://www.youtube.com/@GerardTheBanana/videos", icon: "youtube.png" },
    { name: "DonationAlerts", url: "https://www.donationalerts.com/r/gerardthebanana", icon: "donationalerts.png" },
    { name: "DonateX", url: "https://donatex.gg/donate/gerardthebanana", icon: "donatex.png" },
    { name: "VK", url: "https://vk.ru/boopboopbanan", icon: "vk.png" },
    { name: "Discord", url: "https://discord.gg/UVrbgVMemf", icon: "discord.png" },
    { name: "Memealerts", url: "https://memealerts.com/GerardTheBanana", icon: "memealerts.png" },
    { name: "Boosty", url: "https://boosty.to/gerardthebanana", icon: "boosty.png" },
  ],

  commissions: {
    telegram: "https://t.me/gerardthebanana",
    groups: [
      { title: "Чиби", items: [["Чиби", "500 ₽"]] },
      { title: "Базовый цвет", note: "+ градиент, возможно, без светотени и рендера",
        items: [["Хед", "700 ₽"], ["Халф", "1200 ₽"], ["Фулл", "1800 ₽"]] },
      { title: "Фулл Рендер", items: [["Хед", "1500 ₽"], ["Халф", "2500 ₽"], ["Фулл", "3000 ₽"]] },
      { title: "PNGtuber", items: [["PNGtuber моделька", "3000 ₽"], ["Дополнительная эмоция", "+1500 ₽"]] },
      { title: "Стикеры / Смайлики",
        items: [["1 штука", "500 ₽/шт."], ["От 5 штук", "300 ₽/шт."], ["От 10 штук", "250 ₽/шт."]] },
    ],
  },
};

/* =====================================================================
   ДВИЖОК — ниже трогать не обязательно
   ===================================================================== */
const $ = (s) => document.querySelector(s);
const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  e.append(...kids);
  return e;
};
const ph = (t) => h("div", { class: "ph" }, t);
const desk = () => matchMedia("(min-width:900px)").matches;

/* ---------- Контент ---------- */
document.title = CONFIG.title;
$("#siteName").textContent = CONFIG.name;
$("#aboutName").textContent = CONFIG.name;
$("#aboutText").textContent = CONFIG.about.text;

const avatar = h("img", { src: CONFIG.about.avatar, alt: "Аватарка " + CONFIG.name, width: 84, height: 84 });
avatar.onerror = () => avatar.replaceWith(ph("No avatar"));
$("#avatar").append(avatar);

$("#aboutInfo").append(...CONFIG.about.info.map(([k, v]) => h("div", {}, h("dt", {}, k), h("dd", {}, v))));

$("#socialList").append(...CONFIG.socials.map((s) => {
  const icon = h("img", { src: "assets/icons/" + s.icon, alt: "", width: 32, height: 32 });
  icon.onerror = () => icon.remove();
  return h("li", {}, h("a", { class: "link", href: s.url, target: "_blank", rel: "noopener noreferrer" }, icon, h("span", {}, s.name)));
}));

$("#prices").append(...CONFIG.commissions.groups.map((g) => {
  const box = h("fieldset", { class: "grp" }, h("legend", {}, g.title));
  if (g.note) box.append(h("p", { class: "note" }, g.note));
  g.items.forEach(([label, price]) => box.append(h("div", { class: "row" }, h("span", {}, label), h("i"), h("b", {}, price))));
  return box;
}));
$("#orderBtn").href = CONFIG.commissions.telegram;

/* ---------- Галерея и просмотр ---------- */
const A = CONFIG.artworks, V = $("#viewer"), stage = $("#stage");
let cur = 0;

function buildGallery() {
  const box = $("#gallery");
  if (!A.length) return box.append(ph("Artwork coming soon..."));
  const grid = h("div", { class: "grid" });
  A.forEach((a, i) => {
    const title = a.title || "Artwork " + (i + 1);
    const img = h("img", { src: a.thumbnail || a.src, alt: title, loading: "lazy", decoding: "async", width: 160, height: 160 });
    img.onerror = () => img.replaceWith(ph("Artwork coming soon..."));
    const btn = h("button", { class: "thumb", type: "button", "aria-label": "Открыть: " + title }, img);
    btn.onclick = () => openViewer(i);
    grid.append(btn);
  });
  box.append(grid);
}

function show(i) {
  if (!A.length) return;
  cur = (i + A.length) % A.length;
  const a = A[cur], t = a.title || "Artwork " + (cur + 1);
  const img = h("img", { class: "vimg", src: a.src, alt: t });
  img.onerror = () => stage.replaceChildren(ph("Artwork coming soon..."));
  stage.replaceChildren(img);
  $("#vinfo").textContent = `${cur + 1} / ${A.length} — ${t}`;
  $("#vdesc").textContent = a.description || "";
}

function openViewer(i) {
  show(i);
  V.hidden = false;
  V.classList.remove("min");
  if (desk()) { V.style.left = Math.max(0, (innerWidth - V.offsetWidth) / 2) + "px"; V.style.top = "16px"; }
  focusWin(V);
  $("#next").focus({ preventScroll: true });
}

$("#prev").onclick = () => show(cur - 1);
$("#next").onclick = () => show(cur + 1);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") $("#startMenu").hidden = true;
  if (V.hidden) return;
  if (e.key === "ArrowLeft") show(cur - 1);
  else if (e.key === "ArrowRight") show(cur + 1);
  else if (e.key === "Escape") closeWin(V);
});
let sx = 0;
stage.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
stage.addEventListener("touchend", (e) => {
  const d = e.changedTouches[0].clientX - sx;
  if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1));
});
buildGallery();

/* ---------- Менеджер окон ---------- */
const wins = [...document.querySelectorAll(".win")];
const sections = wins.filter((w) => w !== V);
const tasks = $("#tasks");
let z = 10;

function focusWin(w) {
  w.style.zIndex = ++z;
  wins.forEach((x) => x.classList.toggle("active", x === w));
  renderTasks();
}
function openWin(w) {
  w.hidden = false;
  w.classList.remove("min");
  focusWin(w);
  if (!desk() && w !== V) w.scrollIntoView({ behavior: "smooth", block: "start" });
}
function closeWin(w) { w.hidden = true; w.classList.remove("active"); renderTasks(); }
function minWin(w) {
  if (desk()) { w.classList.add("min"); w.classList.remove("active"); } else w.classList.toggle("min");
  renderTasks();
}
function renderTasks() {
  tasks.replaceChildren(...wins.filter((w) => !w.hidden).map((w) => {
    const on = w.classList.contains("active") && !w.classList.contains("min");
    const b = h("button", { class: "task" + (on ? " on" : ""), type: "button" }, w.dataset.title);
    b.onclick = () => (on ? minWin(w) : openWin(w));
    return b;
  }));
}

function makeDraggable(w, bar) {
  bar.addEventListener("pointerdown", (e) => {
    if (!desk() || w.classList.contains("max") || e.target.closest("button")) return;
    const r = w.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
    bar.setPointerCapture(e.pointerId);
    const move = (ev) => {
      w.style.left = Math.min(Math.max(ev.clientX - dx, 80 - r.width), innerWidth - 80) + "px";
      w.style.top = Math.min(Math.max(ev.clientY - dy, 0), innerHeight - 70) + "px";
    };
    const up = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", up); };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", up);
  });
}

wins.forEach((w) => {
  const btn = (act, txt, label) => h("button", { type: "button", "data-act": act, "aria-label": label }, txt);
  const bar = h("header", { class: "tb" },
    h("span", { class: "tt" }, w.dataset.title),
    h("span", { class: "tbtns" }, btn("min", "_", "Свернуть"), btn("max", "□", "Развернуть"), btn("close", "×", "Закрыть")));
  w.prepend(bar);
  w.addEventListener("pointerdown", () => { if (!w.classList.contains("active")) focusWin(w); });
  bar.addEventListener("click", (e) => {
    const act = e.target.closest("button")?.dataset.act;
    if (act === "close") closeWin(w);
    else if (act === "min") minWin(w);
    else if (act === "max") w.classList.toggle("max");
  });
  makeDraggable(w, bar);
});

/* ---------- Раскладка рабочего стола ---------- */
function layout() {
  if (!desk()) {
    sections.forEach((w) => ["left", "top", "width", "maxHeight"].forEach((p) => (w.style[p] = "")));
    return;
  }
  const W = innerWidth, H = innerHeight, g = 16;
  const lw = Math.min(Math.max(W * 0.22, 240), 340);
  const rw = Math.min(Math.max(W * 0.26, 270), 440);
  const aw = W - lw - rw - g * 4;
  const put = (id, x, y, wd) => {
    const w = $("#" + id);
    w.classList.remove("max");
    w.style.left = x + "px"; w.style.top = y + "px"; w.style.width = wd + "px";
    w.style.maxHeight = Math.max(160, H - y - 48) + "px";
    return w;
  };
  const a = put("about", g, 110, lw);
  put("socials", g, a.offsetTop + a.offsetHeight + g, lw);
  put("artwork", lw + g * 2, 110, aw);
  put("commissions", W - rw - g, 90, rw);
}
let lastW = innerWidth, t;
addEventListener("resize", () => {
  clearTimeout(t);
  t = setTimeout(() => { if (innerWidth !== lastW) { lastW = innerWidth; layout(); } }, 150);
});
layout();

/* ---------- Taskbar, Start, часы ---------- */
const menu = $("#startMenu"), start = $("#start");
menu.append(h("h2", {}, CONFIG.name), ...sections.map((w) => {
  const b = h("button", { type: "button" }, w.dataset.title);
  b.onclick = () => openWin(w);
  return b;
}));
start.onclick = (e) => {
  e.stopPropagation();
  menu.hidden = !menu.hidden;
  start.setAttribute("aria-expanded", String(!menu.hidden));
};
document.addEventListener("click", () => { menu.hidden = true; start.setAttribute("aria-expanded", "false"); });

const tick = () => ($("#clock").textContent = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }));
tick();
setInterval(tick, 30000);

focusWin($("#artwork"));
