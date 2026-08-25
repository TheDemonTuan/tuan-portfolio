import { useEffect, useState } from "react";

const copy = {
  vi: {
    navigation: "Điều hướng chính",
    about: "Giới thiệu",
    work: "Dự án",
    stack: "Công nghệ",
    contact: "Liên hệ",
    open: "Mở menu",
    close: "Đóng menu",
    language: "Đổi sang tiếng Anh",
  },
  en: {
    navigation: "Main navigation",
    about: "About",
    work: "Work",
    stack: "Stack",
    contact: "Contact",
    open: "Open menu",
    close: "Close menu",
    language: "Switch to Vietnamese",
  },
} as const;

type Language = keyof typeof copy;

function applyLanguage(language: Language) {
  document.documentElement.dataset.language = language;
  document.documentElement.lang = language;
  try {
    localStorage.setItem("portfolio-language", language);
  } catch {
    // Language still applies when storage is unavailable.
  }
}

export default function Navigation() {
  const [language, setLanguage] = useState<Language>("vi");
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const text = copy[language];

  useEffect(() => {
    const current = document.documentElement.dataset.language;
    if (current === "en") setLanguage("en");
    setHydrated(true);
  }, []);

  const closeMenu = () => setOpen(false);
  const toggleLanguage = () => {
    const nextLanguage = language === "vi" ? "en" : "vi";
    applyLanguage(nextLanguage);
    setLanguage(nextLanguage);
  };

  return (
    <header className="site-header">
      <nav className="nav shell" aria-label={text.navigation}>
        <a
          className="brand"
          href="#top"
          onClick={closeMenu}
          aria-label="NT — Nguyễn Viết Tuấn — Home"
        >
          <span className="brand-mark" aria-hidden="true">
            NT
          </span>
          <span className="brand-name">NGUYỄN VIẾT TUẤN</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="navigation-links"
          aria-label={open ? text.close : text.open}
          disabled={!hydrated}
          onClick={() => setOpen((value) => !value)}
        >
          <span></span>
          <span></span>
        </button>

        <div className={`nav-panel ${open ? "is-open" : ""}`} id="navigation-links">
          <div className="nav-links">
            <a href="#about" onClick={closeMenu}>
              {text.about}
            </a>
            <a href="#work" onClick={closeMenu}>
              {text.work}
            </a>
            <a href="#stack" onClick={closeMenu}>
              {text.stack}
            </a>
            <a href="#contact" onClick={closeMenu}>
              {text.contact}
            </a>
          </div>
          <button
            className="language-toggle"
            type="button"
            aria-label={text.language}
            disabled={!hydrated}
            onClick={toggleLanguage}
          >
            <span className={language === "vi" ? "active" : ""}>VI</span>
            <span aria-hidden="true">/</span>
            <span className={language === "en" ? "active" : ""}>EN</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
