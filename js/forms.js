// ==========================================
// COMU — Form Handling & Security Suite
// 1. Rate limiting (60s cooldown with countdown)
// 2. Input Sanitization (<> removal, trim, length constraints)
// 3. reCAPTCHA v3 Integration
// 4. Google Sheets / Google Apps Script payload dispatch
// ==========================================

(function () {
  'use strict';

  // ---- Configuration ----
  // Insira sua chave pública do reCAPTCHA v3 (Site Key) abaixo:
  const RECAPTCHA_SITE_KEY = '6Ldz2aMtAAAAL_EQdVtngqlkalT_tujO4MQ-0NL';
  const RATE_LIMIT_SECONDS = 60;
  const GOOGLE_SCRIPT_URL = '/api/submit';

  // ---- Security Helpers ----

  /**
   * Sanitizes text input: trims, strips '<' and '>', and applies character length constraints
   * @param {string} val 
   * @param {boolean} isLongField (true = 1000 chars, false = 100 chars)
   * @returns {string}
   */
  function sanitizeInput(val, isLongField = false) {
    if (typeof val !== 'string') return '';
    const cleaned = val.trim().replace(/[<>]/g, '');
    const maxLen = isLongField ? 1000 : 100;
    return cleaned.slice(0, maxLen);
  }

  /**
   * Checks if form is within the 60-second rate limit
   * @param {string} formId 
   * @returns {number} Remaining seconds, or 0 if allowed
   */
  function getRateLimitRemaining(formId) {
    try {
      const storageKey = `comu_ratelimit_${formId}`;
      const lastSent = localStorage.getItem(storageKey);
      if (!lastSent) return 0;

      const elapsed = (Date.now() - parseInt(lastSent, 10)) / 1000;
      if (elapsed < RATE_LIMIT_SECONDS) {
        return Math.ceil(RATE_LIMIT_SECONDS - elapsed);
      }
    } catch (e) {
      console.warn('LocalStorage error in rate limiter:', e);
    }
    return 0;
  }

  /**
   * Records a successful form submit timestamp for rate limiting
   * @param {string} formId 
   */
  function setRateLimitTimestamp(formId) {
    try {
      const storageKey = `comu_ratelimit_${formId}`;
      localStorage.setItem(storageKey, Date.now().toString());
    } catch (e) {
      console.warn('LocalStorage error setting rate limit:', e);
    }
  }

  /**
   * Shows a rate limit warning banner on the form
   * @param {HTMLFormElement} form 
   * @param {number} remainingSeconds 
   */
  function showRateLimitWarning(form, remainingSeconds) {
    shakeForm(form);

    let warningEl = form.querySelector('.form-ratelimit-warning');
    if (!warningEl) {
      warningEl = document.createElement('div');
      warningEl.className = 'form-ratelimit-warning';
      warningEl.style.cssText = `
        background: rgba(255, 1, 73, 0.15);
        border: 1px solid rgba(255, 1, 73, 0.4);
        color: #ff6b8b;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-size: 0.875rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: fadeIn 0.3s ease;
      `;
      form.prepend(warningEl);
    }

    warningEl.innerHTML = `<i class="ph-fill ph-clock-countdown" style="font-size: 1.2em;"></i> Aguarde <strong>${remainingSeconds}s</strong> antes de enviar novamente.`;

    setTimeout(() => {
      if (warningEl && warningEl.parentNode) {
        warningEl.remove();
      }
    }, 4000);
  }

  /**
   * Fetches reCAPTCHA v3 token if script is loaded and site key is present
   * @param {string} action 
   * @returns {Promise<string>}
   */
  function getRecaptchaToken(action = 'submit') {
    return new Promise((resolve) => {
      // Timeout fallback: never let the form hang for more than 2.5 seconds
      const timeout = setTimeout(() => {
        console.warn('reCAPTCHA timed out — proceeding with submission');
        resolve('');
      }, 2500);

      try {
        if (typeof grecaptcha !== 'undefined' && typeof grecaptcha.ready === 'function' && RECAPTCHA_SITE_KEY && RECAPTCHA_SITE_KEY !== 'SITE_KEY') {
          grecaptcha.ready(function () {
            try {
              grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: action })
                .then(token => {
                  clearTimeout(timeout);
                  resolve(token || '');
                })
                .catch(err => {
                  clearTimeout(timeout);
                  console.warn('reCAPTCHA execution error:', err);
                  resolve('');
                });
            } catch (innerErr) {
              clearTimeout(timeout);
              console.warn('reCAPTCHA execute sync error:', innerErr);
              resolve('');
            }
          });
        } else {
          clearTimeout(timeout);
          resolve('');
        }
      } catch (outerErr) {
        clearTimeout(timeout);
        console.warn('reCAPTCHA ready error:', outerErr);
        resolve('');
      }
    });
  }

  /**
   * Dispatches JSON payload to Google Apps Script Web App
   * @param {object} payload 
   * @returns {Promise<boolean>}
   */
  async function sendToGoogleScript(payload) {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      return response.ok;
    } catch (err) {
      console.error('Erro ao enviar dados para o Google Sheets:', err);
      return false;
    }
  }

  // ==========================================
  // 1. Radar Form ("Indicar ao Radar")
  // ==========================================

  function initRadarForm() {
    const form = document.getElementById('radar-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Check Rate Limit (60s)
      const remaining = getRateLimitRemaining('radar-form');
      if (remaining > 0) {
        showRateLimitWarning(form, remaining);
        return;
      }

      // Sanitize fields (trim, strip <>, limit lengths)
      const nameInput = form.querySelector('[name="radar-name"]');
      const typeInput = form.querySelector('[name="radar-type"]');
      const instagramInput = form.querySelector('[name="radar-instagram"]');
      const reasonInput = form.querySelector('[name="radar-reason"]');

      const nameVal = sanitizeInput(nameInput ? nameInput.value : '', false);
      const typeVal = sanitizeInput(typeInput ? typeInput.value : '', false);
      const instaVal = sanitizeInput(instagramInput ? instagramInput.value : '', false);
      const reasonVal = sanitizeInput(reasonInput ? reasonInput.value : '', true);

      // Basic validation
      if (!nameVal || !typeVal || !reasonVal) {
        shakeForm(form);
        return;
      }

      // UI Loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
        submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Enviando...';
      }

      // Execute reCAPTCHA v3
      const token = await getRecaptchaToken('radar_submit');

      const data = {
        formulario: 'radar',
        name: nameVal,
        nome: nameVal,
        type: typeVal,
        tipo: typeVal,
        instagram: instaVal,
        reason: reasonVal,
        motivo: reasonVal,
        porQueIndicar: reasonVal,
        recaptchaToken: token,
        timestamp: new Date().toISOString()
      };

      // Record rate limit in localStorage
      setRateLimitTimestamp('radar-form');

      console.log('📡 Comu Radar — Payload enviado para Google Apps Script:', data);

      // Send to Google Sheets via fetch POST
      await sendToGoogleScript(data);

      // Show success
      showFormSuccess(form, {
        theme: 'dark',
        badge: 'Indicação Registrada',
        icon: '<i class="ph-fill ph-broadcast" style="color: var(--brand-primary)"></i>',
        title: 'Indicação enviada!',
        text: 'Vamos analisar sua indicação e, se for aprovada, ela entra no radar da Comu.',
        buttonText: 'Indicar outro lugar',
        onReset: () => initRadarForm()
      });
    });
  }

  // ==========================================
  // 2. Producers Form ("Quero ser parceiro")
  // ==========================================

  function initProducersForm() {
    const form = document.getElementById('producers-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Check Rate Limit (60s)
      const remaining = getRateLimitRemaining('producers-form');
      if (remaining > 0) {
        showRateLimitWarning(form, remaining);
        return;
      }

      // Sanitize fields (trim, strip <>, limit lengths)
      const nameInput = form.querySelector('[name="producer-name"]');
      const companyInput = form.querySelector('[name="producer-company"]');
      const instagramInput = form.querySelector('[name="producer-instagram"]');
      const whatsappInput = form.querySelector('[name="producer-whatsapp"]');
      const eventTypeInput = form.querySelector('[name="producer-event-type"]');
      const websiteInput = form.querySelector('[name="producer-website"]');
      const messageInput = form.querySelector('[name="producer-message"]');

      const nameVal = sanitizeInput(nameInput ? nameInput.value : '', false);
      const companyVal = sanitizeInput(companyInput ? companyInput.value : '', false);
      const instaVal = sanitizeInput(instagramInput ? instagramInput.value : '', false);
      const waVal = sanitizeInput(whatsappInput ? whatsappInput.value : '', false);
      const eventTypeVal = sanitizeInput(eventTypeInput ? eventTypeInput.value : '', false);
      const siteVal = sanitizeInput(websiteInput ? websiteInput.value : '', false);
      const msgVal = sanitizeInput(messageInput ? messageInput.value : '', true);

      // Basic validation
      if (!nameVal || !companyVal || !eventTypeVal) {
        shakeForm(form);
        return;
      }

      // UI Loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
        submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Enviando...';
      }

      // Execute reCAPTCHA v3
      const token = await getRecaptchaToken('producers_submit');

      const data = {
        formulario: 'parceiro',
        name: nameVal,
        nome: nameVal,
        company: companyVal,
        empresa: companyVal,
        projeto: companyVal,
        instagram: instaVal,
        whatsapp: waVal,
        eventType: eventTypeVal,
        tipoEvento: eventTypeVal,
        tipo: eventTypeVal,
        website: siteVal,
        site: siteVal,
        message: msgVal,
        mensagem: msgVal,
        recaptchaToken: token,
        timestamp: new Date().toISOString()
      };

      // Record rate limit in localStorage
      setRateLimitTimestamp('producers-form');

      console.log('🤝 Comu — Payload de parceiro enviado para Google Apps Script:', data);

      // Send to Google Sheets via fetch POST
      await sendToGoogleScript(data);

      // Show success
      showFormSuccess(form, {
        theme: 'light',
        badge: 'Solicitação Recebida',
        icon: '<i class="ph-fill ph-handshake" style="color: var(--brand-primary)"></i>',
        title: 'Solicitação enviada!',
        text: 'Nossa equipe vai entrar em contato em até 48h. Estamos ansiosos para conhecer seu projeto.',
        buttonText: 'Enviar nova mensagem',
        onReset: () => initProducersForm()
      });
    });
  }

  // ==========================================
  // 3. Comu Pass Form
  // ==========================================

  function initPassForm() {
    const form = document.getElementById('pass-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const remaining = getRateLimitRemaining('pass-form');
      if (remaining > 0) {
        showRateLimitWarning(form, remaining);
        return;
      }

      const nameInput = form.querySelector('[name="pass-name"]');
      const emailInput = form.querySelector('[name="pass-email"]');
      const whatsappInput = form.querySelector('[name="pass-whatsapp"]');

      const nameVal = sanitizeInput(nameInput ? nameInput.value : '', false);
      const emailVal = sanitizeInput(emailInput ? emailInput.value : '', false);
      const waVal = sanitizeInput(whatsappInput ? whatsappInput.value : '', false);

      if (!nameVal || !emailVal) {
        shakeForm(form);
        return;
      }

      const token = await getRecaptchaToken('pass_submit');

      const data = {
        formulario: 'pass',
        name: nameVal,
        nome: nameVal,
        email: emailVal,
        whatsapp: waVal,
        recaptchaToken: token,
        timestamp: new Date().toISOString()
      };

      setRateLimitTimestamp('pass-form');

      console.log('💳 Comu Pass — Payload enviado para Google Apps Script:', data);

      await sendToGoogleScript(data);

      showFormSuccess(form, {
        theme: 'dark',
        badge: 'Lista de Espera',
        icon: '<i class="ph-fill ph-sparkle" style="color: var(--brand-primary)"></i>',
        title: 'Você está na lista!',
        text: 'Em breve você vai receber seu convite para fazer parte da Comu.',
        buttonText: null
      });
    });
  }

  // ==========================================
  // Form Feedback Helpers
  // ==========================================

  function shakeForm(form) {
    form.style.animation = 'none';
    void form.offsetHeight;
    form.style.animation = 'shake 0.4s ease-in-out';

    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = 'var(--color-rose)';
        input.style.boxShadow = '0 0 0 3px var(--color-rose-glow)';

        const resetStyle = () => {
          input.style.borderColor = '';
          input.style.boxShadow = '';
          input.removeEventListener('input', resetStyle);
        };
        input.addEventListener('input', resetStyle);
      }
    });
  }

  function showFormSuccess(form, content) {
    if (!form.dataset.originalHtml) {
      form.dataset.originalHtml = form.innerHTML;
    }

    const formHeight = form.offsetHeight;
    if (formHeight > 0) {
      form.style.minHeight = `${formHeight}px`;
    }

    const isLight = content.theme === 'light' || form.classList.contains('producers__form');
    const themeClass = isLight ? 'form-success--light' : 'form-success--dark';

    form.innerHTML = `
      <div class="form-success ${themeClass}">
        <div class="form-success__icon-wrapper">
          <div class="form-success__pulse"></div>
          <div class="form-success__icon-circle">
            <span class="form-success__icon">${content.icon}</span>
          </div>
        </div>

        ${content.badge ? `
          <div class="form-success__badge">
            <i class="ph-fill ph-check-circle"></i>
            <span>${content.badge}</span>
          </div>
        ` : ''}

        <h3 class="form-success__title">${content.title}</h3>
        <p class="form-success__text">${content.text}</p>

        ${content.buttonText ? `
          <button type="button" class="form-success__btn js-form-reset-btn">
            <i class="ph ph-arrow-counter-clockwise"></i>
            <span>${content.buttonText}</span>
          </button>
        ` : ''}
      </div>
    `;

    // Handle Reset Button if present
    const resetBtn = form.querySelector('.js-form-reset-btn');
    if (resetBtn && form.dataset.originalHtml) {
      resetBtn.addEventListener('click', () => {
        form.innerHTML = form.dataset.originalHtml;
        form.style.minHeight = '';
        if (typeof content.onReset === 'function') {
          content.onReset();
        }
      });
    }
  }

  // Add shake animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);

  // ---- Init ----
  function init() {
    initRadarForm();
    initProducersForm();
    initPassForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
