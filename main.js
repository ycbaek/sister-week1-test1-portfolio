const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const themeToggle = document.querySelector(".theme-toggle");
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");
const emptyState = document.querySelector("#empty-state");
const form = document.querySelector("#contact-form");
const formError = document.querySelector("#form-error");
const formSuccess = document.querySelector("#form-success");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark" || savedTheme === "light") {
  document.documentElement.dataset.theme = savedTheme;
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.documentElement.dataset.theme = "dark";
}

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
});

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...nav.querySelectorAll("a[href^='#']")];

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("is-current", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);

sections.forEach((section) => spy.observe(section));

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    filters.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    let visible = 0;
    projects.forEach((project) => {
      const show = category === "all" || project.dataset.category === category;
      project.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });
    emptyState.hidden = visible > 0;
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.hidden = true;
  formSuccess.hidden = true;

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !emailOk || message.length < 8) {
    formError.textContent = "Add your name, a valid email, and a message of at least a few words.";
    formError.hidden = false;
    return;
  }

  console.info("Portfolio message", { name, email, message });
  form.reset();
  formSuccess.hidden = false;
});
