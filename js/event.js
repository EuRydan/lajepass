// ==========================================
// COMU — Event Details Logic
// Parse URL, load event details, render recommendations
// ==========================================

(function () {
  'use strict';

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

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    // Capitalize first letter of weekday
    let formatted = date.toLocaleDateString('pt-BR', options);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  function formatTime(date) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  // ---- Main Logic ----

  function init() {
    // 1. Get Event ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    if (!eventId) {
      window.location.href = 'index.html';
      return;
    }

    // 2. Find the Event in EXPERIENCES data
    const event = EXPERIENCES.find(exp => exp.id === eventId);

    if (!event) {
      window.location.href = 'index.html';
      return;
    }

    // 3. Populate Event Data into DOM
    populateEventDetails(event);

    // 4. Render Recommended Events
    renderRecommendations(event);

    // 5. Fade In Page
    const mainEl = document.getElementById('event-main');
    if (mainEl) {
      mainEl.style.opacity = '1';
    }
  }

  function populateEventDetails(event) {
    const cat = CATEGORIES[event.category];
    
    // Set Document SEO Title & description
    document.title = `Comu — ${event.name}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `${event.description} Aproveite a vantagem Comu Pass: ${event.comuBenefit || 'Acesso exclusivo'}.`);
    }

    // BG Image and Info
    const bgImage = document.getElementById('event-bg-image');
    if (bgImage) {
      bgImage.src = event.image;
      bgImage.alt = event.name;
    }

    // Badge
    const badge = document.getElementById('event-badge');
    if (badge) {
      badge.className = `badge badge--${event.category}`;
      badge.innerHTML = `${cat.emoji} ${cat.label}`;
    }

    // Title
    const title = document.getElementById('event-title');
    if (title) {
      title.textContent = event.name;
    }

    // Hero Meta Location
    const metaLoc = document.getElementById('event-meta-location');
    if (metaLoc) {
      metaLoc.textContent = event.location;
    }

    // Description
    const desc = document.getElementById('event-description');
    if (desc) {
      desc.textContent = event.description;
    }

    // Comu Pass Benefit
    const benefitText = document.getElementById('event-benefit-text');
    const benefitCard = document.getElementById('event-benefit-card');
    if (event.comuBenefit) {
      if (benefitText) {
        benefitText.textContent = event.comuBenefit;
      }
      if (benefitCard) {
        benefitCard.style.display = 'flex';
      }
    } else {
      if (benefitCard) {
        benefitCard.style.display = 'none';
      }
    }

    // Sidebar details
    const infoDate = document.getElementById('event-info-date');
    if (infoDate) {
      infoDate.textContent = formatDate(event.date);
    }

    const infoTime = document.getElementById('event-info-time');
    if (infoTime) {
      infoTime.textContent = `${formatTime(event.date)}h`;
    }

    const infoPrice = document.getElementById('event-info-price');
    if (infoPrice) {
      infoPrice.textContent = event.price;
    }

    const infoLoc = document.getElementById('event-info-location');
    if (infoLoc) {
      infoLoc.textContent = `${event.location}, Rio de Janeiro`;
    }
  }

  function renderRecommendations(currentEvent) {
    const recommendedGrid = document.getElementById('recommended-grid');
    if (!recommendedGrid) return;

    // Filter out current event and get related ones by category
    let related = EXPERIENCES.filter(exp => exp.id !== currentEvent.id && exp.category === currentEvent.category);
    
    // If not enough, fill with other upcoming experiences
    if (related.length < 3) {
      const extra = EXPERIENCES.filter(exp => exp.id !== currentEvent.id && exp.category !== currentEvent.category);
      related = [...related, ...extra].slice(0, 3);
    } else {
      related = related.slice(0, 3);
    }

    recommendedGrid.innerHTML = related.map(exp => {
      const cat = CATEGORIES[exp.category];
      const benefitHTML = exp.comuBenefit
        ? `<span class="card__comu-benefit">🔥 COMU</span>`
        : '';

      return `
        <a href="event.html?id=${exp.id}" class="card">
          <div class="card__image-wrapper">
            <img class="card__image" src="${exp.image}" alt="${exp.name}" loading="lazy" />
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
                <span class="card__meta-text">${formatDate(exp.date)}</span>
              </div>
              <span class="card__meta-item">
                <span class="card__meta-icon"><i class="ph ph-map-pin"></i></span>
                ${exp.location}
              </span>
            </div>
            <p class="card__description">${exp.description}</p>
          </div>
        </a>
      `;
    }).join('');
  }

  // Init logic on page load
  document.addEventListener('DOMContentLoaded', init);

})();
