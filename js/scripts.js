"use strict";
(() => {
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
