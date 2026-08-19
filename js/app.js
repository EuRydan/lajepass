// ==========================================
// LAJE — Main App Logic
// Filtering, rendering, navigation
// ==========================================

(function () {
  'use strict';

  // ---- State ----
  let activeTimeFilter = 'todos';
  let activeCategoryFilter = 'todos';
  let activeView = 'cards'; // 'cards' | 'map'

  // ---- DOM References ----
  const experiencesGrid = document.getElementById('experiences-grid');
  const picksGrid = document.getElementById('picks-grid');
  const timeFilters = document.querySelectorAll('[data-time-filter]');
  const categoryFilters = document.querySelectorAll('[data-category-filter]');
  const heroCategories = document.querySelectorAll('[data-hero-category]');
  const header = document.querySelector('.header');
  const burger = document.querySelector('.header__burger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');
  const statValues = document.querySelectorAll('[data-stat-value]');

  // ---- Formatting Helpers ----

  function formatDate(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Amanhã';
    }

    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('pt-BR', options);
  }

  function formatTime(date) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  // ---- Filtering ----

  function filterExperiences() {
    let filtered = [...EXPERIENCES];

    // Time filter
    if (activeTimeFilter === 'hoje') {
      filtered = filtered.filter(exp => isToday(exp.date));
    } else if (activeTimeFilter === 'mes') {
      filtered = filtered.filter(exp => isThisMonth(exp.date));
    } else if (activeTimeFilter === 'fds') {
      filtered = filtered.filter(exp => isWeekend(exp.date));
    }

    // Category filter
    if (activeCategoryFilter !== 'todos') {
      filtered = filtered.filter(exp => exp.category === activeCategoryFilter);
    }

    // Sort by date
    filtered.sort((a, b) => a.date - b.date);

    return filtered;
  }

  // ---- Rendering: Experience Cards ----

  function renderExperienceCard(exp) {
    const cat = CATEGORIES[exp.category];
    const benefitHTML = exp.lajeBenefit
      ? `<span class="card__laje-benefit">🔥 LAJE</span>`
      : '';
    const benefitTagHTML = exp.lajeBenefit
      ? `<div class="card__benefit-tag">🔥 ${exp.lajeBenefit}</div>`
      : '';

    return `
      <article class="card animate-on-scroll" data-category="${exp.category}">
        <div class="card__image-wrapper">
          <img 
            class="card__image" 
            src="${exp.image}" 
            alt="${exp.name}"
            loading="lazy"
          />
          <span class="card__badge badge--${exp.category}">
            ${cat.emoji} ${cat.label}
          </span>
          ${benefitHTML}
        </div>
        <div class="card__body">
          <h3 class="card__name">${exp.name}</h3>
          <div class="card__meta">
            <div class="card__meta-item">
              <span class="card__meta-icon"><i class="ph ph-calendar"></i></span>
              <span class="card__meta-text">${formatDate(exp.date)}</span> · ${formatTime(exp.date)}
            </div>
            <span class="card__meta-item">
              <span class="card__meta-icon"><i class="ph ph-map-pin"></i></span>
              ${exp.location}
            </span>
          </div>
          <p class="card__description">${exp.description}</p>
          ${benefitTagHTML}
        </div>
      </article>
    `;
  }

  function renderExperiences() {
    const filtered = filterExperiences();

    // If map view is active, update pins instead of cards
    if (activeView === 'map') {
      renderMapPins(filtered);
      return;
    }

    if (filtered.length === 0) {
      experiencesGrid.innerHTML = `
        <div class="experiences__empty no-results">
          <span class="no-results__icon"><i class="ph ph-magnifying-glass"></i></span>
          <p class="no-results__text">Nenhuma experiência encontrada com esses filtros.</p>
        </div>
      `;
      return;
    }

    experiencesGrid.innerHTML = filtered.map(renderExperienceCard).join('');

    // Trigger animations for new cards
    requestAnimationFrame(() => {
      const cards = experiencesGrid.querySelectorAll('.animate-on-scroll');
      cards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 80}ms`;
        // Force reflow
        void card.offsetHeight;
        card.classList.add('is-visible');
      });
    });
  }

  // ---- Rendering: Picks ----

  function renderPickCard(pick) {
    const exp = EXPERIENCES.find(e => e.id === pick.experienceId);
    if (!exp) return '';
    const cat = CATEGORIES[exp.category];

    return `
      <article class="pick-card animate-on-scroll">
        <div class="pick-card__image-wrapper">
          <img 
            class="pick-card__image" 
            src="${exp.image}" 
            alt="${exp.name}"
            loading="lazy"
          />
          <div class="pick-card__overlay"></div>
          <span class="pick-card__badge"><i class="ph-fill ph-star"></i> LAJE PICK</span>
        <div class="pick-card__body">
          <h3 class="pick-card__name">${exp.name}</h3>
          <div class="pick-card__meta">
            <span class="pick-card__meta-item">
              <span>${cat.emoji}</span> ${cat.label}
            </span>
            <div class="pick-card__info-item">
              <span><i class="ph ph-calendar"></i></span> ${formatDate(exp.date)}
            </div>
            <span class="pick-card__meta-item">
              <span><i class="ph ph-map-pin"></i></span> ${exp.location}
            </span>
          </div>
          <blockquote class="pick-card__reason">${pick.reason}</blockquote>
          <p class="pick-card__curator">— ${pick.curator}</p>
        </div>
      </article>
    `;
  }

  function renderPicks() {
    if (!picksGrid) return;
    picksGrid.innerHTML = LAJE_PICKS.map(renderPickCard).join('');
  }

  // ---- Filter Event Handlers ----

  function initFilters() {
    timeFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        activeTimeFilter = btn.dataset.timeFilter;
        timeFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderExperiences();
      });
    });

    categoryFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategoryFilter = btn.dataset.categoryFilter;
        categoryFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderExperiences();
      });
    });

    // Hero category shortcuts
    heroCategories.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.heroCategory;
        activeCategoryFilter = cat;

        // Update the hero category buttons themselves
        heroCategories.forEach(b => {
          b.classList.toggle('active', b.dataset.heroCategory === cat);
        });

        // Re-render immediately
        renderExperiences();
      });
    });
  }

  // ---- Header Scroll Effect ----

  function initHeader() {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ---- Mobile Menu ----

  function initMobileMenu() {
    if (!burger || !mobileNav) return;

    const closeBtn = document.getElementById('mobile-nav-close');

    function closeMenu() {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // ---- Smooth Scroll for Anchor Links ----

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        
        // Remove '#' and get element by ID to avoid querySelector syntax errors
        const targetId = href.substring(1);
        if (!targetId) return;
        
        const target = document.getElementById(targetId);
        if (target) {
          const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // ---- Animated Counters ----

  function initCounters() {
    const counters = document.querySelectorAll('[data-stat-value]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.statValue);
          const suffix = el.dataset.statSuffix || '';
          animateCounter(el, target, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(el, target, suffix) {
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('pt-BR') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ---- Active Nav Highlight ----

  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      rootMargin: '-40% 0px -55% 0px',
    });

    sections.forEach(section => observer.observe(section));
  }

  // ---- Map View ----

  const btnViewCards   = document.getElementById('btn-view-cards');
  const btnViewMap     = document.getElementById('btn-view-map');
  const mapView        = document.getElementById('map-view');
  const mapPins        = document.getElementById('map-pins');
  const mapLegendItems = document.getElementById('map-legend-items');

  function buildMapLegend(experiences) {
    if (!mapLegendItems) return;
    const categoriesUsed = [...new Set(experiences.map(e => e.category))];
    mapLegendItems.innerHTML = categoriesUsed.map(cat => {
      const c = CATEGORIES[cat];
      return `<span class="map-legend__item" style="--cat-color:${c.colorRaw}">${c.emoji} ${c.label}</span>`;
    }).join('');
  }

  function renderMapPins(experiences) {
    if (!mapPins) return;
    mapPins.innerHTML = '';

    const byBairro = {};
    experiences.forEach(exp => {
      if (!exp.bairro || !BAIRROS[exp.bairro]) return;
      if (!byBairro[exp.bairro]) byBairro[exp.bairro] = [];
      byBairro[exp.bairro].push(exp);
    });

    Object.entries(byBairro).forEach(([bairroKey, exps]) => {
      const bairro = BAIRROS[bairroKey];
      const cat    = CATEGORIES[exps[0].category];
      const count  = exps.length;

      const tooltipItems = exps.map(exp => `
        <div class="map-tooltip__event" style="--cat-color:${CATEGORIES[exp.category].colorRaw}">
          <span class="map-tooltip__cat-dot"></span>
          <div>
            <div class="map-tooltip__event-name">${exp.name}</div>
            <div class="map-tooltip__event-meta">
              <i class="ph ph-calendar"></i> ${formatDate(exp.date)} · ${formatTime(exp.date)}
            </div>
            ${exp.lajeBenefit ? `<div class="map-tooltip__benefit">🔥 ${exp.lajeBenefit}</div>` : ''}
          </div>
        </div>`).join('');

      const pin = document.createElement('div');
      pin.className = 'map-pin';
      pin.setAttribute('data-bairro', bairroKey);
      pin.setAttribute('data-category', exps[0].category);
      pin.style.left = bairro.x + '%';
      pin.style.top  = bairro.y + '%';
      pin.style.setProperty('--cat-color', cat.colorRaw);

      pin.innerHTML = `
        <div class="map-pin__dot">
          <span class="map-pin__icon">${count > 1 ? count : cat.emoji}</span>
        </div>
        <div class="map-pin__label">${bairro.label}</div>
        <div class="map-tooltip" role="tooltip">
          <div class="map-tooltip__header">
            <i class="ph ph-map-pin"></i>
            <strong>${bairro.label}</strong>
            <span class="map-tooltip__count">${count} evento${count > 1 ? 's' : ''}</span>
          </div>
          <div class="map-tooltip__events">${tooltipItems}</div>
        </div>`;

      mapPins.appendChild(pin);
    });

    buildMapLegend(experiences);
  }

  function switchView(view) {
    activeView = view;
    const grid = document.getElementById('experiences-grid');
    if (view === 'map') {
      grid.style.display = 'none';
      if (mapView) mapView.hidden = false;
      if (btnViewCards) btnViewCards.classList.remove('active');
      if (btnViewMap)   btnViewMap.classList.add('active');
      renderMapPins(filterExperiences());
    } else {
      grid.style.display = '';
      if (mapView) mapView.hidden = true;
      if (btnViewCards) btnViewCards.classList.add('active');
      if (btnViewMap)   btnViewMap.classList.remove('active');
    }
  }

  function initMapView() {
    if (btnViewCards) btnViewCards.addEventListener('click', () => switchView('cards'));
    if (btnViewMap)   btnViewMap.addEventListener('click',   () => switchView('map'));
  }

  // ---- Init ----

  function init() {
    renderExperiences();
    renderPicks();
    initFilters();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initCounters();
    initActiveNav();
    initMapView();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
