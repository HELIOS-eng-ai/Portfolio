const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

const closeMenu = () => {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
};

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    nav.classList.toggle("is-open", !isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const applyTheme = (theme, persist = false) => {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";

  if (themeToggle) {
    themeToggle.setAttribute("aria-checked", String(isDark));
    themeToggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
  }
  if (themeLabel) themeLabel.textContent = isDark ? "DARK" : "LIGHT";
  if (themeColorMeta) themeColorMeta.content = isDark ? "#171815" : "#f5f4ef";

  if (persist) {
    try {
      localStorage.setItem("sumantra-theme", isDark ? "dark" : "light");
    } catch {
      // The selected theme still applies for this visit when storage is unavailable.
    }
  }
};

let savedTheme = null;
try {
  const storedTheme = localStorage.getItem("sumantra-theme");
  if (storedTheme === "dark" || storedTheme === "light") savedTheme = storedTheme;
} catch {
  // Fall back to the device preference when storage is unavailable.
}

const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme, true);
});
