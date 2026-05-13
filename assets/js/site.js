const localeCache = {};

const getCookie = (name) => {
  const entry = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.split("=")[1]) : "";
};

const setCookie = (name, value) => {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${oneYear}; path=/; SameSite=Lax`;
};

const getLanguage = () => {
  const saved = getCookie("portfolio_lang");
  return saved === "zh" || saved === "en" ? saved : "en";
};

const getLocaleBasePath = () => {
  const script = document.querySelector('script[src$="assets/js/site.js"]');
  const src = script?.getAttribute("src") || "assets/js/site.js";
  return src.startsWith("../") ? "../locales" : "locales";
};

const loadLocale = async (lang) => {
  if (localeCache[lang]) return localeCache[lang];

  const response = await fetch(`${getLocaleBasePath()}/${lang}.json`, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Failed to load locale: ${lang}`);
  }

  const dictionary = await response.json();
  localeCache[lang] = dictionary;
  return dictionary;
};

const applyLanguage = (dictionary, lang) => {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (dictionary[key]) node.textContent = dictionary[key];
  });

  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    const key = node.dataset.i18nTitle;
    if (dictionary[key]) node.setAttribute("title", dictionary[key]);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    const key = node.dataset.i18nAria;
    if (dictionary[key]) node.setAttribute("aria-label", dictionary[key]);
  });
};

const setLanguage = async (lang) => {
  try {
    const dictionary = await loadLocale(lang);
    setCookie("portfolio_lang", lang);
    applyLanguage(dictionary, lang);
  } catch (error) {
    console.warn(error);
    document.documentElement.lang = "en";
  }
};

const menuButton = document.querySelector("[data-menu-button]");
const navLinks = document.querySelector("[data-nav-links]");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll("[data-dropdown-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const parent = button.closest(".nav-item");
    const isOpen = parent.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

const currentPage = document.body.dataset.page;
document.querySelectorAll("[data-nav]").forEach((link) => {
  if (link.dataset.nav === currentPage) {
    link.classList.add("is-active");
    link.closest(".nav-item")?.classList.add("is-active");
  }
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    document.querySelectorAll("[data-work-card]").forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.hidden = !match;
    });
  });
});

document.querySelector("[data-language-toggle]")?.addEventListener("click", async () => {
  const next = getLanguage() === "en" ? "zh" : "en";
  await setLanguage(next);
});

setLanguage(getLanguage());
