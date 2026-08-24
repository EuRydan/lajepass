// ==========================================
// LAJE — Main App Logic
// Filtering, rendering, navigation
// ==========================================

(function () {
  'use strict';

  // ---- State ----
  let selectedDateRange = null; // null or [startDate, endDate]
  let activeCategoryFilter = 'todos';
  let activeView = 'cards'; // 'cards' | 'map'

  // ---- DOM References ----
  const experiencesGrid = document.getElementById('experiences-grid');
  const picksGrid = document.getElementById('picks-grid');
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

  function filterExperiences() {
    let filtered = [...EXPERIENCES];

    // Date range filter
    if (selectedDateRange && selectedDateRange.length > 0) {
      const start = new Date(selectedDateRange[0]);
      start.setHours(0, 0, 0, 0);

      let end = null;
      if (selectedDateRange.length > 1) {
        end = new Date(selectedDateRange[1]);
        end.setHours(23, 59, 59, 999);
      } else {
        // Single date selected
        end = new Date(selectedDateRange[0]);
        end.setHours(23, 59, 59, 999);
      }

      filtered = filtered.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= start && expDate <= end;
      });
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
      <a href="event.html?id=${exp.id}" class="card animate-on-scroll" data-category="${exp.category}">
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
      </a>
    `;
  }

  function renderExperiences() {
    const filtered = filterExperiences();

    // If map view is active, update pins instead of cards
    if (activeView === 'map') {
      initLeafletMap();
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
      <a href="event.html?id=${exp.id}" class="pick-card animate-on-scroll">
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
      </a>
    `;
  }

  function renderPicks() {
    if (!picksGrid) return;
    picksGrid.innerHTML = LAJE_PICKS.map(renderPickCard).join('');
  }

  // ---- Filter Event Handlers ----

  function initFilters() {

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
  }  // ---- Map View ----

  const btnViewCards   = document.getElementById('btn-view-cards');
  const btnViewMap     = document.getElementById('btn-view-map');
  const mapView        = document.getElementById('map-view');
  const mapLegendItems = document.getElementById('map-legend-items');

  let mapInstance = null;
  let mapMarkers = [];

  function buildMapLegend(experiences) {
    if (!mapLegendItems) return;
    const categoriesUsed = [...new Set(experiences.map(e => e.category))];
    mapLegendItems.innerHTML = categoriesUsed.map(cat => {
      const c = CATEGORIES[cat];
      return `
        <button class="map-legend__item" data-category="${cat}" style="--cat-color:${c.colorRaw}">
          <span class="map-legend__pin"><span class="map-legend__pin-icon">${c.emoji}</span></span>
          <span class="map-legend__label">${c.label}</span>
        </button>`;
    }).join('');

    // Add click listeners to make the legend items interactive toggles
    mapLegendItems.querySelectorAll('.map-legend__item').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        
        // If clicking the currently active category, toggle to "todos" (show all), otherwise select it
        const newCat = (activeCategoryFilter === cat) ? 'todos' : cat;
        activeCategoryFilter = newCat;
        
        // Update sidebar categories UI (both grid and hero shortcuts)
        const sidebarBtns = document.querySelectorAll('[data-hero-category]');
        sidebarBtns.forEach(b => {
          b.classList.toggle('active', b.dataset.heroCategory === newCat);
        });

        const categoryFilterBtns = document.querySelectorAll('[data-category-filter]');
        categoryFilterBtns.forEach(b => {
          b.classList.toggle('active', b.dataset.categoryFilter === newCat);
        });

        renderExperiences();
      });
    });
  }

  function initLeafletMap() {
    if (mapInstance) {
      setTimeout(() => {
        mapInstance.invalidateSize();
        mapInstance.setView([-22.958, -43.190], 13);
      }, 50);
      return;
    }

    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    // Center on Rio's cultural core (around Botafogo / Copacabana)
    mapInstance = L.map('map-container', {
      center: [-22.958, -43.190],
      zoom: 13,
      minZoom: 11,
      maxZoom: 16,
      zoomControl: true,
      attributionControl: false
    });

    // Add CartoDB Dark Matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(mapInstance);

    setTimeout(() => {
      mapInstance.invalidateSize();
      mapInstance.setView([-22.958, -43.190], 13);
    }, 100);
  }

  function renderMapPins(experiences) {
    if (!mapInstance) return;

    // Clear existing markers from the map
    mapMarkers.forEach(marker => mapInstance.removeLayer(marker));
    mapMarkers = [];

    const byBairro = {};
    experiences.forEach(exp => {
      if (!exp.bairro || !BAIRROS[exp.bairro]) return;
      if (!byBairro[exp.bairro]) byBairro[exp.bairro] = [];
      byBairro[exp.bairro].push(exp);
    });

    Object.entries(byBairro).forEach(([bairroKey, exps]) => {
      const bairro = BAIRROS[bairroKey];
      if (!bairro.lat || !bairro.lng) return;

      const cat    = CATEGORIES[exps[0].category];
      const count  = exps.length;

      const tooltipItems = exps.map(exp => `
        <a href="event.html?id=${exp.id}" class="map-tooltip__event" style="--cat-color:${CATEGORIES[exp.category].colorRaw}; text-decoration: none; color: inherit; display: flex;">
          <span class="map-tooltip__cat-dot"></span>
          <div>
            <div class="map-tooltip__event-name">${exp.name}</div>
            <div class="map-tooltip__event-meta">
              <i class="ph ph-calendar"></i> ${formatDate(exp.date)} · ${formatTime(exp.date)}
            </div>
            ${exp.lajeBenefit ? `<div class="map-tooltip__benefit">🔥 ${exp.lajeBenefit}</div>` : ''}
          </div>
        </a>`).join('');

      const pinHtml = `
        <div class="map-pin">
          <div class="map-pin__body">
            <div class="map-pin__dot" style="--cat-color: ${cat.colorRaw}">
              <span class="map-pin__icon">${count > 1 ? count : cat.emoji}</span>
            </div>
            <div class="map-pin__label">${bairro.label}</div>
          </div>
          <div class="map-tooltip" role="tooltip">
            <div class="map-tooltip__header">
              <i class="ph ph-map-pin"></i>
              <strong>${bairro.label}</strong>
              <span class="map-tooltip__count">${count} evento${count > 1 ? 's' : ''}</span>
            </div>
            <div class="map-tooltip__events">${tooltipItems}</div>
          </div>
        </div>`;

      const customIcon = L.divIcon({
        className: 'leaflet-custom-marker',
        html: pinHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([bairro.lat, bairro.lng], { icon: customIcon }).addTo(mapInstance);
      mapMarkers.push(marker);
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
      
      initLeafletMap();
      renderMapPins(filterExperiences());
    } else {
      grid.style.display = '';
      if (mapView) mapView.hidden = true;
      if (btnViewCards) btnViewCards.classList.add('active');
      if (btnViewMap)   btnViewMap.classList.remove('active');
    }
  }

  let datepickerInstance = null;

  function initDatepicker() {
    const input = document.getElementById('datepicker-input');
    const wrapper = document.querySelector('.datepicker-wrapper');
    const clearBtn = document.getElementById('datepicker-clear');
    if (!input) return;

    datepickerInstance = flatpickr(input, {
      mode: "range",
      dateFormat: "d/m/Y",
      locale: "pt",
      disableMobile: "true",
      onChange: function(selectedDates, dateStr, instance) {
        if (selectedDates.length > 0) {
          wrapper.classList.add('has-date');
          selectedDateRange = selectedDates;
        } else {
          wrapper.classList.remove('has-date');
          selectedDateRange = null;
        }
        renderExperiences();
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (datepickerInstance) {
          datepickerInstance.clear();
        }
        wrapper.classList.remove('has-date');
        selectedDateRange = null;
        renderExperiences();
      });
    }
  }

  function initMapView() {
    if (btnViewCards) btnViewCards.addEventListener('click', () => switchView('cards'));
    if (btnViewMap)   btnViewMap.addEventListener('click',   () => switchView('map'));
  }

  function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq__question');
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const item = question.parentElement;
        const answer = question.nextElementSibling;
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Close other open FAQ items
        document.querySelectorAll('.faq__item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
            otherItem.querySelector('.faq__answer').style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isExpanded) {
          question.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        } else {
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  // ---- Init ----

  function init() {
    renderExperiences();
    renderPicks();
    initFilters();
    initDatepicker();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initCounters();
    initActiveNav();
    initMapView();
    initFaqAccordion();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
