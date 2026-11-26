"use strict";
(() => {
  /* ---- Theme: light 06:00–18:00, dark otherwise; manual override lasts until the next switch ---- */
  const KEY = "sc-theme-override";
  const root = document.documentElement;
  const fab = document.getElementById("themeToggle");
  const matrix = document.getElementById("gcMatrix");
  const strip = document.getElementById("gcStrip");
  const clock = document.getElementById("glyphClock");
  const modeEl = document.getElementById("gcMode");
  const themeEl = document.getElementById("gcTheme");
  const meta = document.querySelector('meta[name="theme-color"]');

  const scheduled = d => (d.getHours() >= 6 && d.getHours() < 18 ? "light" : "dark");
  function nextSwitch(d) {
    const n = new Date(d); n.setMinutes(0, 0, 0);
    const h = d.getHours();
    if (h < 6) n.setHours(6);
    else if (h < 18) n.setHours(18);
    else { n.setDate(n.getDate() + 1); n.setHours(6); }
    return n.getTime();
  }
  function readOverride() {
    try {
      const o = JSON.parse(localStorage.getItem(KEY) || "null");
      if (o && o.until > Date.now() && (o.t === "light" || o.t === "dark")) return o;
      if (o) localStorage.removeItem(KEY);
    } catch (e) {}
    return null;
  }
  function writeOverride(t, d) {
    try { localStorage.setItem(KEY, JSON.stringify({ t, until: nextSwitch(d) })); } catch (e) {}
  }
  function clearOverride() { try { localStorage.removeItem(KEY); } catch (e) {} }

  /* 3×5 dot-matrix glyphs */
  const GLYPHS = ["111101101101111","010110010010111","111001111100111","111001111001111","101101111001001","111100111001111","111100111101111","111001001010010","111101111101111","111101111001111"];
  const mk = (n, cls) => { const w = document.createElement("span"); w.className = cls; for (let i = 0; i < n; i++) w.appendChild(document.createElement("i")); return w; };
  let digits = [], colon = null, dots = [];
  if (matrix) {
    for (let i = 0; i < 4; i++) {
      digits.push(mk(15, "gc-digit"));
      if (i === 2) { colon = mk(5, "gc-colon"); colon.children[1].classList.add("on"); colon.children[3].classList.add("on"); matrix.appendChild(colon); }
      matrix.appendChild(digits[i]);
    }
  }
  if (strip) for (let i = 0; i < 12; i++) { const d = document.createElement("i"); strip.appendChild(d); dots.push(d); }

  let shownMin = -1;
  function renderClock(d) {
    const sec = d.getSeconds();
    if (dots.length) { const lit = Math.floor(sec / 5) + 1; dots.forEach((el, i) => { el.classList.toggle("on", i < lit); el.classList.toggle("now", i === lit - 1); }); }
    const min = d.getHours() * 60 + d.getMinutes();
    if (min === shownMin) return;
    shownMin = min;
    const str = String(d.getHours()).padStart(2, "0") + String(d.getMinutes()).padStart(2, "0");
    digits.forEach((el, i) => { const g = GLYPHS[+str[i]]; [...el.children].forEach((c, k) => c.classList.toggle("on", g[k] === "1")); });
    if (clock) clock.setAttribute("aria-label", "Local time " + str.slice(0, 2) + ":" + str.slice(2) + ", " + root.getAttribute("data-theme") + " theme");
  }

  function paint(theme, manual) {
    if (root.getAttribute("data-theme") !== theme) root.setAttribute("data-theme", theme);
    if (meta) meta.setAttribute("content", theme === "dark" ? "#1b2127" : "#e3ddf0");
    if (modeEl) modeEl.textContent = manual ? "MANUAL" : "AUTO";
    if (themeEl) themeEl.textContent = theme.toUpperCase();
    if (fab) {
      const next = theme === "dark" ? "light" : "dark";
      fab.setAttribute("aria-label", "Switch to " + next + " theme");
      fab.title = manual ? "Switch to " + next + " theme (manual until the next 6 am / 6 pm)" : "Switch to " + next + " theme";
    }
  }
  function sync() {
    const now = new Date(), o = readOverride();
    paint(o ? o.t : scheduled(now), !!o);
    shownMin = -1;
    renderClock(now);
  }
  if (fab) fab.addEventListener("click", () => {
    const now = new Date();
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.classList.add("theme-anim");
    setTimeout(() => root.classList.remove("theme-anim"), 500);
    if (next === scheduled(now)) clearOverride(); else writeOverride(next, now);
    sync();
  });
  window.addEventListener("storage", e => { if (e.key === KEY) sync(); });
  sync();
  setInterval(() => {
    if (document.hidden) return;
    const now = new Date(), o = readOverride();
    const want = o ? o.t : scheduled(now);
    if (want !== root.getAttribute("data-theme") || (!!o) !== (modeEl && modeEl.textContent === "MANUAL")) { root.classList.add("theme-anim"); setTimeout(() => root.classList.remove("theme-anim"), 500); paint(want, !!o); }
    renderClock(now);
  }, 1000);

  /* ---- Navigation ---- */
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("siteNav");
  const year = document.querySelectorAll("[data-year]");
  year.forEach(node => { node.textContent = String(new Date().getFullYear()); });
  if (!toggle || !nav) return;
  const mobile = window.matchMedia("(max-width: 760px)");
  function closeMenu(returnFocus = false) {
    const wasOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    nav.classList.remove("is-open");
    if (returnFocus && wasOpen) toggle.focus();
  }
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMenu();
    else {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation menu");
      nav.classList.add("is-open");
      const first = nav.querySelector("a");
      if (first) first.focus();
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu(true);
  });
  document.addEventListener("pointerdown", event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => closeMenu()));
  const onChange = () => { if (!mobile.matches) closeMenu(); };
  if (mobile.addEventListener) mobile.addEventListener("change", onChange);
  else mobile.addListener(onChange);
})();
