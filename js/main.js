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

  // Pet: subtle follow + head turn (monochrome)
  const pet = $('#pet');
  if (pet) {
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const head = pet.querySelector('.pet-head');

    if (!reducedMotion && head) {
      const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
      const lerp = (a, b, t) => a + (b - a) * t;

      let pointerX = window.innerWidth * 0.5;
      let pointerY = window.innerHeight * 0.5;
      let curX = 0;
      let curY = 0;
      let curRot = 0;

      window.addEventListener(
        'pointermove',
        (e) => {
          pointerX = e.clientX;
          pointerY = e.clientY;
        },
        { passive: true }
      );

      const tick = () => {
        const r = pet.getBoundingClientRect();
        const cx = r.left + r.width * 0.5;
        const cy = r.top + r.height * 0.58;
        const dx = pointerX - cx;
        const dy = pointerY - cy;

        // Follow (small nudge so content remains primary)
        const targetX = clamp(dx / 18, -22, 22);
        const targetY = clamp(dy / 18, -16, 16);
        curX = lerp(curX, targetX, 0.12);
        curY = lerp(curY, targetY, 0.12);
        pet.style.setProperty('--pet-x', `${curX.toFixed(2)}px`);
        pet.style.setProperty('--pet-y', `${curY.toFixed(2)}px`);

        // Head turn (mainly horizontal)
        const targetRot = clamp((dx / 180) * 16, -18, 18);
        curRot = lerp(curRot, targetRot, 0.18);
        head.style.setProperty('--pet-rot', `${curRot.toFixed(2)}deg`);

        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }
  }
})();
