// ==========================================
// COMU — Event Details Logic
// Dynamic rendering of real events, tickets, promo codes & community
// ==========================================

(function () {
  'use strict';

  // ---- Formatting Helpers ----

  function formatDateLong(date) {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    let formatted = date.toLocaleDateString('pt-BR', options);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  function formatDateShort(date) {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('pt-BR', options);
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
      window.location.href = 'home.html';
      return;
    }

    // 2. Find the Event in EXPERIENCES data
    const event = EXPERIENCES.find(exp => exp.id === eventId);

    if (!event) {
      // Fallback: if not found, redirect to home
      window.location.href = 'home.html';
      return;
    }

    // 3. Populate Event Data into DOM
    populateEventDetails(event);

    // 4. Setup Interactive Promo Code Copy Buttons
    setupCopyButtons(event.promoCode || 'BRAGA');

    // 5. Render Recommended Events
    renderRecommendations(event);

    // 6. Fade In Page
    const mainEl = document.getElementById('event-main');
    if (mainEl) {
      mainEl.style.opacity = '1';
    }
  }

  function populateEventDetails(event) {
    const cat = CATEGORIES[event.category] || CATEGORIES.musica;
    
    // Set Document SEO Title & description
    document.title = `Comu — ${event.name}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `${event.description} Compre ingressos com desconto exclusivo Comu.`);
    }

    // Hero Background Image
    const bgImage = document.getElementById('event-bg-image');
    if (bgImage) {
      bgImage.src = event.image;
      bgImage.alt = event.name;
    }

    // Category Badge
    const badge = document.getElementById('event-badge');
    if (badge) {
      badge.className = `badge badge--${event.category}`;
      badge.innerHTML = `${cat.emoji} ${cat.label}`;
    }

    // Ticketing Partner Badge
    const partnerBadge = document.getElementById('event-partner-badge');
    if (partnerBadge) {
      if (event.ticketPartner) {
        partnerBadge.textContent = event.ticketPartner;
        partnerBadge.style.display = 'inline-flex';
      } else {
        partnerBadge.style.display = 'none';
      }
    }

    // Title & Subtitle
    const title = document.getElementById('event-title');
    if (title) {
      title.textContent = event.name;
    }

    const subtitle = document.getElementById('event-subtitle');
    if (subtitle) {
      if (event.subtitle) {
        subtitle.textContent = event.subtitle;
        subtitle.style.display = 'block';
      } else {
        subtitle.style.display = 'none';
      }
    }

    // Meta: Location, Date & Capacity
    const metaLoc = document.getElementById('event-meta-location');
    if (metaLoc) {
      metaLoc.textContent = event.venue || event.location;
    }

    const metaDate = document.getElementById('event-meta-date');
    if (metaDate) {
      metaDate.textContent = `${formatDateShort(event.date)} · ${formatTime(event.date)}h`;
    }

    const metaCapacity = document.getElementById('event-meta-capacity');
    const metaCapacityWrapper = document.getElementById('event-meta-capacity-wrapper');
    if (metaCapacity && metaCapacityWrapper) {
      if (event.capacity) {
        metaCapacity.textContent = event.capacity;
        metaCapacityWrapper.style.display = 'inline-flex';
      } else {
        metaCapacityWrapper.style.display = 'none';
      }
    }

    // Atrações Confirmadas Section
    const attractionsSec = document.getElementById('event-attractions-section');
    const attractionsContent = document.getElementById('event-attractions-content');
    if (attractionsSec && attractionsContent) {
      if (event.attractions) {
        attractionsContent.innerHTML = `
          <div class="attraction-badge-group">
            <span class="attraction-pill"><i class="fa-solid fa-star"></i> ${event.attractions}</span>
          </div>
        `;
        attractionsSec.style.display = 'block';
      } else {
        attractionsSec.style.display = 'none';
      }
    }

    // Description Paragraphs
    const descContainer = document.getElementById('event-description-container');
    if (descContainer) {
      if (Array.isArray(event.fullDescription) && event.fullDescription.length > 0) {
        descContainer.innerHTML = event.fullDescription.map(paragraph => `<p>${paragraph}</p>`).join('');
      } else {
        descContainer.innerHTML = `<p>${event.description}</p>`;
      }
    }

    // Highlights Section
    const highlightsSec = document.getElementById('event-highlights-section');
    const highlightsList = document.getElementById('event-highlights-list');
    if (highlightsSec && highlightsList) {
      if (Array.isArray(event.highlights) && event.highlights.length > 0) {
        highlightsList.innerHTML = event.highlights.map(item => `<li><span class="highlight-bullet">✓</span> <span>${item}</span></li>`).join('');
        highlightsSec.style.display = 'block';
      } else {
        highlightsSec.style.display = 'none';
      }
    }

    // Info List Section
    const infolistSec = document.getElementById('event-infolist-section');
    const infolistItems = document.getElementById('event-infolist-items');
    if (infolistSec && infolistItems) {
      if (Array.isArray(event.infoList) && event.infoList.length > 0) {
        infolistItems.innerHTML = event.infoList.map(item => `<li>${item}</li>`).join('');
        infolistSec.style.display = 'block';
      } else {
        infolistSec.style.display = 'none';
      }
    }

    // Promo Code & Buy Ticket Section
    const promoBox = document.getElementById('event-promo-box');
    const promoCodeEl = document.getElementById('event-promo-code');
    const sidebarPromoItem = document.querySelector('.event-sidebar-card__info-item--promo');
    const sidebarPromoEl = document.getElementById('event-sidebar-promo');
    const ticketsTitle = document.getElementById('event-tickets-title');
    const ticketsText = document.getElementById('event-tickets-text');

    if (event.promoCode) {
      if (promoBox) promoBox.style.display = 'flex';
      if (promoCodeEl) promoCodeEl.textContent = event.promoCode;
      if (sidebarPromoItem) sidebarPromoItem.style.display = 'flex';
      if (sidebarPromoEl) sidebarPromoEl.textContent = event.promoCode;
      if (ticketsTitle) ticketsTitle.textContent = 'Garanta seu ingresso com desconto';
      if (ticketsText) ticketsText.textContent = 'Utilize nosso código promocional na compra dos seus ingressos:';
    } else {
      if (promoBox) promoBox.style.display = 'none';
      if (sidebarPromoItem) sidebarPromoItem.style.display = 'none';
      if (ticketsTitle) ticketsTitle.textContent = 'Garanta seu ingresso';
      if (ticketsText) ticketsText.textContent = 'Garanta sua entrada de forma rápida e segura na bilheteria oficial:';
    }

    const buyTicketBtn = document.getElementById('event-buy-ticket-btn');
    const sidebarBuyBtn = document.getElementById('event-sidebar-buy-btn');
    const ticketUrl = event.ticketUrl || '#';
    const partnerName = event.ticketPartner || 'Bilheteria Oficial';
    const discountSuffix = event.promoCode ? ' com Desconto' : '';

    if (buyTicketBtn) {
      buyTicketBtn.href = ticketUrl;
      buyTicketBtn.innerHTML = `<span>Comprar na ${partnerName}${discountSuffix}</span> <i class="fa-solid fa-arrow-up-right-from-square"></i>`;
    }
    if (sidebarBuyBtn) {
      sidebarBuyBtn.href = ticketUrl;
      sidebarBuyBtn.innerHTML = `<i class="fa-solid fa-ticket"></i> <span>Garantir Ingresso</span>`;
    }

    // Birthday & Bachelor CTA
    const birthdaySec = document.getElementById('event-birthday-section');
    const birthdayBtn = document.getElementById('event-birthday-btn');
    const sidebarBirthdayBtn = document.getElementById('event-sidebar-birthday-btn');
    if (event.birthdayConditionsUrl) {
      if (birthdaySec) birthdaySec.style.display = 'flex';
      if (birthdayBtn) birthdayBtn.href = event.birthdayConditionsUrl;
      if (sidebarBirthdayBtn) {
        sidebarBirthdayBtn.href = event.birthdayConditionsUrl;
        sidebarBirthdayBtn.style.display = 'inline-flex';
      }
    } else {
      if (birthdaySec) birthdaySec.style.display = 'none';
      if (sidebarBirthdayBtn) sidebarBirthdayBtn.style.display = 'none';
    }

    // Open Bar Section
    const openBarSec = document.getElementById('event-openbar-section');
    const openBarContent = document.getElementById('event-openbar-content');
    if (openBarSec && openBarContent) {
      if (event.openBar) {
        openBarContent.textContent = event.openBar;
        openBarSec.style.display = 'block';
      } else {
        openBarSec.style.display = 'none';
      }
    }

    // PIX sem taxas button
    const pixBtn = document.getElementById('event-pix-btn');
    if (pixBtn) {
      if (event.pixUrl) {
        pixBtn.href = event.pixUrl;
        pixBtn.style.display = 'inline-flex';
      } else {
        pixBtn.style.display = 'none';
      }
    }

    // Lista VIP button
    const vipBtn = document.getElementById('event-vip-btn');
    const sidebarVipBtn = document.getElementById('event-sidebar-vip-btn');
    if (vipBtn) {
      if (event.vipListUrl) {
        vipBtn.href = event.vipListUrl;
        vipBtn.style.display = 'inline-flex';
      } else {
        vipBtn.style.display = 'none';
      }
    }
    if (sidebarVipBtn) {
      if (event.vipListUrl) {
        sidebarVipBtn.href = event.vipListUrl;
        sidebarVipBtn.style.display = 'inline-flex';
      } else {
        sidebarVipBtn.style.display = 'none';
      }
    }



    // Sidebar Details
    const infoDate = document.getElementById('event-info-date');
    if (infoDate) {
      infoDate.textContent = formatDateLong(event.date);
    }

    const infoTime = document.getElementById('event-info-time');
    if (infoTime) {
      infoTime.textContent = `${formatTime(event.date)}h`;
    }

    const infoLoc = document.getElementById('event-info-location');
    if (infoLoc) {
      infoLoc.textContent = event.address ? `${event.venue || event.location} (${event.address})` : `${event.location}, Rio de Janeiro`;
    }

    const infoFormat = document.getElementById('event-info-format');
    const infoFormatWrapper = document.getElementById('event-info-format-wrapper');
    if (infoFormat && infoFormatWrapper) {
      if (event.format || event.capacity) {
        infoFormat.textContent = [event.format, event.capacity].filter(Boolean).join(' · ');
        infoFormatWrapper.style.display = 'flex';
      } else {
        infoFormatWrapper.style.display = 'none';
      }
    }
  }

  // Setup 1-click clipboard copy
  function setupCopyButtons(code) {
    const copyBtns = [
      document.getElementById('btn-copy-promo'),
      document.getElementById('btn-sidebar-copy-promo')
    ].filter(Boolean);

    copyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(code).then(() => {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Copiado!</span>`;
          btn.classList.add('copied');
          
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
          }, 2200);
        }).catch(() => {
          // Fallback
          prompt('Copie o código abaixo:', code);
        });
      });
    });
  }

  function renderRecommendations(currentEvent) {
    const recommendedGrid = document.getElementById('recommended-grid');
    if (!recommendedGrid) return;

    // Filter out current event
    let related = EXPERIENCES.filter(exp => exp.id !== currentEvent.id);
    
    if (related.length === 0) {
      // If no other events yet, hide or show a curated teaser
      const recSection = document.querySelector('.recommended-section');
      if (recSection) recSection.style.display = 'none';
      return;
    }

    recommendedGrid.innerHTML = related.map(exp => {
      const cat = CATEGORIES[exp.category] || CATEGORIES.musica;
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
                <span class="card__meta-icon"><i class="fa-regular fa-calendar"></i></span>
                <span class="card__meta-text">${formatDateShort(exp.date)} · ${formatTime(exp.date)}</span>
              </div>
              <span class="card__meta-item">
                <span class="card__meta-icon"><i class="fa-solid fa-location-dot"></i></span>
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
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
