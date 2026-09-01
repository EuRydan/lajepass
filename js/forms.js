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
  const RECAPTCHA_SITE_KEY = 'SITE_KEY'; // Substitua pelo seu site key do Google reCAPTCHA v3
  const RATE_LIMIT_SECONDS = 60;
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw47e7NkL9E24tEMhVrn8yD6c2cHkVy-kM6LJsJ1Oue4Gfo9Won06QVTgwrJSuD7Hll/exec';

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

    // Clear warning automatically after 4 seconds
    setTimeout(() => {
      if (warningEl && warningEl.parentNode) {
        warningEl.remove();
      }
    }, 4000);
  }

  /**
   * Fetches reCAPTCHA v3 token if script is loaded
   * @param {string} action 
   * @returns {Promise<string>}
   */
  async function getRecaptchaToken(action = 'submit') {
    if (typeof grecaptcha !== 'undefined' && RECAPTCHA_SITE_KEY && RECAPTCHA_SITE_KEY !== 'SITE_KEY') {
      try {
        return await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
      } catch (err) {
        console.warn('reCAPTCHA execution error:', err);
      }
    }
    return '';
  }

  /**
   * Dispatches JSON payload to Google Apps Script / Google Sheets
   * @param {object} payload 
   * @returns {Promise<boolean>}
   */
  async function sendToGoogleScript(payload) {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });
      return true;
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

      const data = {
        formulario: 'radar',
        name: sanitizeInput(nameInput ? nameInput.value : '', false),             // Short text: max 100
        type: sanitizeInput(typeInput ? typeInput.value : '', false),             // Short text: max 100
        instagram: sanitizeInput(instagramInput ? instagramInput.value : '', false), // Short text: max 100
        reason: sanitizeInput(reasonInput ? reasonInput.value : '', true),          // Long text: max 1000
        recaptchaToken: '',
        timestamp: new Date().toISOString()
      };

      // Basic validation
      if (!data.name || !data.type || !data.reason) {
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
      data.recaptchaToken = await getRecaptchaToken('radar_submit');

      // Record rate limit in localStorage
      setRateLimitTimestamp('radar-form');

      console.log('📡 Comu Radar — Enviando POST para Google Apps Script:', data);

      // Send to Google Sheets via fetch POST
      await sendToGoogleScript(data);

      // Show success
      showFormSuccess(form, {
        icon: '📡',
        title: 'Indicação enviada!',
        text: 'Vamos analisar sua indicação e, se for aprovada, ela entra no radar da Comu.',
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

      const data = {
        formulario: 'parceiro',
        name: sanitizeInput(nameInput ? nameInput.value : '', false),                 // Short text: max 100
        company: sanitizeInput(companyInput ? companyInput.value : '', false),           // Short text: max 100
        instagram: sanitizeInput(instagramInput ? instagramInput.value : '', false),       // Short text: max 100
        whatsapp: sanitizeInput(whatsappInput ? whatsappInput.value : '', false),         // Short text: max 100
        eventType: sanitizeInput(eventTypeInput ? eventTypeInput.value : '', false),       // Short text: max 100
        website: sanitizeInput(websiteInput ? websiteInput.value : '', false),           // Short text: max 100
        message: sanitizeInput(messageInput ? messageInput.value : '', true),            // Long text: max 1000
        recaptchaToken: '',
        timestamp: new Date().toISOString()
      };

      // Basic validation
      if (!data.name || !data.company || !data.eventType) {
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
      data.recaptchaToken = await getRecaptchaToken('producers_submit');

      // Record rate limit in localStorage
      setRateLimitTimestamp('producers-form');

      console.log('🤝 Comu — Enviando POST de parceiro para Google Apps Script:', data);

      // Send to Google Sheets via fetch POST
      await sendToGoogleScript(data);

      // Show success
      showFormSuccess(form, {
        icon: '🤝',
        title: 'Solicitação enviada!',
        text: 'Nossa equipe vai entrar em contato em até 48h. Estamos ansiosos para conhecer seu projeto.',
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

      const data = {
        formulario: 'pass',
        name: sanitizeInput(nameInput ? nameInput.value : '', false),
        email: sanitizeInput(emailInput ? emailInput.value : '', false),
        whatsapp: sanitizeInput(whatsappInput ? whatsappInput.value : '', false),
        recaptchaToken: '',
        timestamp: new Date().toISOString()
      };

      if (!data.name || !data.email) {
        shakeForm(form);
        return;
      }

      data.recaptchaToken = await getRecaptchaToken('pass_submit');
      setRateLimitTimestamp('pass-form');

      console.log('💳 Comu Pass — Enviando POST para Google Apps Script:', data);

      await sendToGoogleScript(data);

      showFormSuccess(form, {
        icon: '<i class="ph-fill ph-confetti" style="font-size: 24px; color: var(--brand-primary)"></i>',
        title: 'Você está na lista!',
        text: 'Em breve você vai receber seu convite para fazer parte da Comu.',
      });
    });
  }

  // ==========================================
  // Form Feedback Helpers
  // ==========================================

  function shakeForm(form) {
    form.style.animation = 'none';
    void form.offsetHeight; // Force reflow
    form.style.animation = 'shake 0.4s ease-in-out';

    // Highlight empty required fields
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
    const formHeight = form.offsetHeight;
    form.style.minHeight = `${formHeight}px`;

    form.innerHTML = `
      <div class="form-success">
        <span class="form-success__icon">${content.icon}</span>
        <h3 class="form-success__title">${content.title}</h3>
        <p class="form-success__text">${content.text}</p>
      </div>
    `;
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
