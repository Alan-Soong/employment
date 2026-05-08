(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const themeToggle = $("#themeToggle");
  const root = document.documentElement;
  const THEME_KEY = "theme";
  const lang = (root.getAttribute("lang") || "").toLowerCase();
  const isEnglish = lang.startsWith("en");

  const themeLabels = {
    light: {
      aria: isEnglish ? "Switch to dark mode" : "切换到深色模式",
      title: isEnglish ? "Dark mode" : "深色模式",
      icon: "☾"
    },
    dark: {
      aria: isEnglish ? "Switch to light mode" : "切换到浅色模式",
      title: isEnglish ? "Light mode" : "浅色模式",
      icon: "☀"
    }
  };

  const getSystemTheme = () =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const applyTheme = (theme) => {
    if (theme === "dark" || theme === "light") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  };

  const setThemeToggleUI = (theme) => {
    if (!themeToggle) return;
    const mode = theme === "dark" ? "dark" : "light";
    const ui = themeLabels[mode];
    const icon = themeToggle.querySelector("span") || themeToggle;
    icon.textContent = ui.icon;
    themeToggle.setAttribute("aria-label", ui.aria);
    themeToggle.title = ui.title;
  };

  const storedTheme = (() => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  })();

  const initialTheme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : getSystemTheme();
  if (storedTheme === "dark" || storedTheme === "light") {
    applyTheme(storedTheme);
  }
  setThemeToggleUI(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || getSystemTheme();
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // ignore storage failures
      }
      setThemeToggleUI(next);
    });
  }

  const progress = $("#progress");
  const toTop = $("#totop");
  const navLinks = $$(".navlink");
  const sectionIds = navLinks
    .map((a) => (a.getAttribute("href") || "").trim())
    .filter((href) => href.startsWith("#"))
    .map((href) => href.slice(1));
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  const updateProgress = () => {
    if (!progress) return;
    const doc = document.documentElement;
    const total = Math.max(1, doc.scrollHeight - doc.clientHeight);
    const current = doc.scrollTop || document.body.scrollTop || 0;
    const percent = Math.max(0, Math.min(100, (current / total) * 100));
    progress.style.width = `${percent}%`;
  };

  const updateToTop = () => {
    if (!toTop) return;
    toTop.classList.toggle("show", window.scrollY > 620);
  };

  const onScroll = () => {
    updateProgress();
    updateToTop();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
  updateToTop();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const revealEls = $$(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting && !entry.target.classList.contains("on"));
      const delayMap = new Map();

      visible.forEach((entry) => {
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.querySelectorAll(":scope > .reveal:not(.on)"))
          : [];
        delayMap.set(entry.target, Math.max(0, siblings.indexOf(entry.target)) * 0.07);
      });

      visible.forEach((entry) => {
        const delay = delayMap.get(entry.target) || 0;
        if (delay > 0) {
          entry.target.style.transitionDelay = `${delay}s`;
          setTimeout(() => {
            entry.target.style.transitionDelay = "";
          }, 600 + delay * 1000);
        }
        entry.target.classList.add("on");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  revealEls.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add("on");
    } else {
      revealObserver.observe(el);
    }
  });

  if (sections.length && navLinks.length) {
    const setActive = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (visible[0] && visible[0].target && visible[0].target.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -52% 0px", threshold: [0.12, 0.25, 0.4, 0.6] }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const pet = $("#pet");
  if (pet) {
    const reducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const head = pet.querySelector(".pet-head");

    if (!reducedMotion && head) {
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
      const lerp = (from, to, amount) => from + (to - from) * amount;

      let pointerX = window.innerWidth * 0.5;
      let pointerY = window.innerHeight * 0.5;
      let currentX = 0;
      let currentY = 0;
      let currentRotation = 0;

      window.addEventListener(
        "pointermove",
        (event) => {
          pointerX = event.clientX;
          pointerY = event.clientY;
        },
        { passive: true }
      );

      const tick = () => {
        const rect = pet.getBoundingClientRect();
        const centerX = rect.left + rect.width * 0.5;
        const centerY = rect.top + rect.height * 0.58;
        const dx = pointerX - centerX;
        const dy = pointerY - centerY;

        const targetX = clamp(dx / 18, -22, 22);
        const targetY = clamp(dy / 18, -16, 16);
        currentX = lerp(currentX, targetX, 0.12);
        currentY = lerp(currentY, targetY, 0.12);
        pet.style.setProperty("--pet-x", `${currentX.toFixed(2)}px`);
        pet.style.setProperty("--pet-y", `${currentY.toFixed(2)}px`);

        const targetRotation = clamp((dx / 180) * 16, -18, 18);
        currentRotation = lerp(currentRotation, targetRotation, 0.18);
        head.style.setProperty("--pet-rot", `${currentRotation.toFixed(2)}deg`);

        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }
  }
})();
