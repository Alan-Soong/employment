(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Theme (manual override)
  const themeToggle = $('#themeToggle');
  const THEME_KEY = 'theme'; // 'light' | 'dark'
  const getSystemTheme = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === 'dark' || theme === 'light') {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }
  };

  const setThemeToggleUI = (theme) => {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('span') || themeToggle;
    const isDark = theme === 'dark';
    icon.textContent = isDark ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
    themeToggle.title = isDark ? '切换到浅色' : '切换到深色';
  };

  const storedTheme = (() => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  })();

  const initialTheme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : getSystemTheme();
  if (storedTheme === 'dark' || storedTheme === 'light') applyTheme(storedTheme);
  setThemeToggleUI(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || getSystemTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // ignore
      }
      setThemeToggleUI(next);
    });
  }

  const progress = $('#progress');
  const toTop = $('#totop');
  const navLinks = $$('.nav a.navlink');
  const sectionIds = navLinks
    .map((a) => (a.getAttribute('href') || '').trim())
    .filter((href) => href.startsWith('#'))
    .map((href) => href.slice(1));
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const updateProgress = () => {
    if (!progress) return;
    const doc = document.documentElement;
    const total = Math.max(1, doc.scrollHeight - doc.clientHeight);
    const cur = doc.scrollTop || document.body.scrollTop || 0;
    const pct = Math.max(0, Math.min(100, (cur / total) * 100));
    progress.style.width = `${pct}%`;
  };

  const updateToTop = () => {
    if (!toTop) return;
    toTop.classList.toggle('show', window.scrollY > 620);
  };

  const onScroll = () => {
    updateProgress();
    updateToTop();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
  updateToTop();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Reveal on scroll
  const revealEls = $$('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('on');
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealEls.forEach((el) => {
    revealObserver.observe(el);
    // Extra safety: render visible elements without waiting for scroll event.
    // getBoundingClientRect().top is relative to viewport.
    if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('on');
    }
  });

  // Active nav link
  if (sections.length && navLinks.length) {
    const setActive = (id) => {
      for (const a of navLinks) {
        const active = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('active', active);
      }
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0.1, 0.2, 0.35, 0.5] }
    );

    sections.forEach((sec) => sectionObserver.observe(sec));
  }
})();
