/* ============================================================
   Данил Бодров — портфолио · app.js
   Прогрессивные улучшения: меню, появление блоков,
   видео по viewport, активная навигация, состояние шапки
   ============================================================ */
(() => {
  'use strict';

  // Флаг "JS работает" — без него весь контент виден сразу (no-JS safety)
  document.documentElement.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Мобильное меню ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  const setMenu = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle?.addEventListener('click', () => {
    setMenu(!nav.classList.contains('open'));
  });

  // Закрытие по Esc + возврат фокуса на кнопку
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav?.classList.contains('open')) {
      setMenu(false);
      toggle?.focus();
    }
  });

  // Закрытие по клику вне панели
  document.addEventListener('click', (e) => {
    if (!nav?.classList.contains('open')) return;
    if (!nav.contains(e.target) && !toggle?.contains(e.target)) setMenu(false);
  });

  // Клик по ссылке меню — закрыть
  nav?.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => setMenu(false))
  );

  /* ---------- 2. Тень шапки при скролле ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 8) header.setAttribute('data-scrolled', '');
    else header.removeAttribute('data-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 3. Активный пункт навигации ---------- */
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sectionsById = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sectionsById.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
        );
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sectionsById.forEach((s) => spy.observe(s));
  }

  /* ---------- 4. Появление блоков со stagger-задержкой ---------- */
  const revealEls = document.querySelectorAll('section > .container > *');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in-view'));
  } else {
    revealEls.forEach((el) => el.classList.add('reveal-target'));

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .12 });

    // Задержка внутри одного контейнера: элементы появляются друг за другом
    const groups = new Map();
    revealEls.forEach((el) => {
      const parent = el.parentElement;
      if (!parent) return;
      const idx = (groups.get(parent) ?? 0);
      groups.set(parent, idx + 1);
      el.style.transitionDelay = `${Math.min(idx * 90, 360)}ms`;
      revealObserver.observe(el);
    });
  }

  /* ---------- 5. Видео: запуск только в зоне видимости ---------- */
  // Видео с data-autoplay (FoodSource, BubbleScope) не грузятся,
  // пока пользователь не доскроллит до них — экономия ~3 МБ трафика
  const lazyVideos = document.querySelectorAll('video[data-autoplay]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    lazyVideos.forEach((v) => v.setAttribute('preload', 'metadata'));
  } else {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {/* автозапуск может быть заблокирован — покажем постер */});
        } else {
          video.pause();
        }
      });
    }, { threshold: .35 });

    lazyVideos.forEach((v) => videoObserver.observe(v));
  }
})();
