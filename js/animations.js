// ==========================================
// LAJE — Scroll Animations
// IntersectionObserver-based reveal system
// ==========================================

(function () {
  'use strict';

  // ---- Scroll Reveal ----

  function initScrollReveal() {
    const elements = document.querySelectorAll('.animate-on-scroll, .animate-scale, .animate-left, .animate-right');

    if (!elements.length) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    elements.forEach(el => observer.observe(el));
  }

  // ---- Staggered Grid Animations ----

  function initStaggeredGrids() {
    const grids = document.querySelectorAll('[data-stagger]');

    grids.forEach(grid => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const children = entry.target.children;
            Array.from(children).forEach((child, i) => {
              child.style.transitionDelay = `${i * 100}ms`;
              child.classList.add('is-visible');
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(grid);
    });
  }

  // ---- Card Glow Effect (mouse follow) ----

  function initCardGlow() {
    const cards = document.querySelectorAll('.card, .pick-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // ---- Parallax Hero ----

  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const heroBg = hero.querySelector('.hero__bg');
    if (!heroBg) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.querySelector('.hero__content').style.transform = `translateY(${scrolled * 0.15}px)`;
        hero.querySelector('.hero__content').style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
      }
    }, { passive: true });
  }

  // ---- Tilt Effect on Pass Card ----

  function initPassCardTilt() {
    const passCard = document.querySelector('.pass-card');
    if (!passCard) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    passCard.addEventListener('mousemove', (e) => {
      const rect = passCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const tiltX = (y - 0.5) * 10;
      const tiltY = (x - 0.5) * -10;

      passCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    passCard.addEventListener('mouseleave', () => {
      passCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      passCard.style.transition = 'transform 0.5s ease-out';
    });

    passCard.addEventListener('mouseenter', () => {
      passCard.style.transition = 'none';
    });
  }

  // ---- Init ----

  function init() {
    initScrollReveal();
    initStaggeredGrids();
    initCardGlow();
    initParallax();
    initPassCardTilt();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
