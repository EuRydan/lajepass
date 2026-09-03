# COMU — Documentação de Formulários, Segurança e Integrações

Este documento reúne o código atualizado dos formulários, regras de segurança (reCAPTCHA, Rate Limiting, Sanitização), configurações de deploy (`vercel.json`) e o script de integração com o Google Sheets (`Google Apps Script`).

---

## 1. Código dos Formulários HTML

### A. Formulário do Radar (`#radar-form`) — `home.html` / `index.html`

```html
<!-- ================================================
     FORMULÁRIO: INDICAÇÃO PARA O RADAR
     ================================================ -->
<form class="radar__form animate-right" id="radar-form">
  <div class="form-group">
    <label class="form-label" for="radar-name">Nome do lugar ou evento</label>
    <input type="text" id="radar-name" name="radar-name" class="form-input" placeholder="Ex: Bar do Mineiro" maxlength="100" required />
  </div>

  <div class="form-group">
    <label class="form-label" for="radar-type">Tipo</label>
    <select id="radar-type" name="radar-type" class="form-select" required>
      <option value="" disabled selected>Selecione o tipo</option>
      <option value="bar">🍺 Bar</option>
      <option value="restaurante">🍴 Restaurante</option>
      <option value="festa">🎉 Festa / Evento</option>
      <option value="musica">🎵 Música ao vivo</option>
      <option value="cultura">🎭 Cultural</option>
      <option value="experiencia">✨ Experiência</option>
      <option value="outro">Outro</option>
    </select>
  </div>

  <div class="form-group">
    <label class="form-label" for="radar-instagram">Instagram (opcional)</label>
    <input type="text" id="radar-instagram" name="radar-instagram" class="form-input" placeholder="@perfil" maxlength="100" />
  </div>

  <div class="form-group">
    <label class="form-label" for="radar-reason">Por que indicar?</label>
    <textarea id="radar-reason" name="radar-reason" class="form-textarea" placeholder="Conta pra gente por que esse lugar é especial..." maxlength="1000" required></textarea>
  </div>

  <button type="submit" class="btn btn--primary btn--lg btn--full">INDICAR PARA A COMU</button>
</form>
```

---

### B. Formulário para Produtores / Parceiros (`#producers-form`) — `home.html` / `index.html`

```html
<!-- ================================================
     FORMULÁRIO: QUERO SER PARCEIRO (PRODUTORES)
     ================================================ -->
<form class="producers__form animate-right" id="producers-form">
  <h3 class="producers__form-title">Quero ser parceiro</h3>
  <p class="producers__form-subtitle">
    Quer colocar seu evento no Radar?<br>
    Conte um pouco sobre ele. A gente entra em contato para entender como podemos construir essa parceria.
  </p>

  <div class="producers__form-row">
    <div class="form-group">
      <label class="form-label" for="producer-name">Nome</label>
      <input type="text" id="producer-name" name="producer-name" class="form-input" placeholder="Seu nome" maxlength="100" required />
    </div>
    <div class="form-group">
      <label class="form-label" for="producer-company">Empresa / Projeto</label>
      <input type="text" id="producer-company" name="producer-company" class="form-input" placeholder="Nome do projeto" maxlength="100" required />
    </div>
  </div>

  <div class="producers__form-row">
    <div class="form-group">
      <label class="form-label" for="producer-instagram">Instagram</label>
      <input type="text" id="producer-instagram" name="producer-instagram" class="form-input" placeholder="@perfil" maxlength="100" />
    </div>
    <div class="form-group">
      <label class="form-label" for="producer-whatsapp">WhatsApp</label>
      <input type="text" id="producer-whatsapp" name="producer-whatsapp" class="form-input" placeholder="(21) 99999-9999" maxlength="100" />
    </div>
  </div>

  <div class="producers__form-row">
    <div class="form-group">
      <label class="form-label" for="producer-event-type">Tipo de evento</label>
      <select id="producer-event-type" name="producer-event-type" class="form-select" required>
        <option value="" disabled selected>Selecione</option>
        <option value="festa">Festa / Balada</option>
        <option value="show">Show / Música ao vivo</option>
        <option value="gastronomia">Gastronomia</option>
        <option value="cultural">Cultural / Exposição</option>
        <option value="experiencia">Experiência / Turismo</option>
        <option value="universitario">Atlética / Universitário</option>
        <option value="bar">Bar / Pub</option>
        <option value="outro">Outro</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label" for="producer-website">Site (opcional)</label>
      <input type="text" id="producer-website" name="producer-website" class="form-input" placeholder="www.seusite.com" maxlength="100" />
    </div>
  </div>

  <div class="form-group">
    <label class="form-label" for="producer-message">Como podemos ajudar?</label>
    <textarea id="producer-message" name="producer-message" class="form-textarea" placeholder="Conta pra gente sobre seu evento ou projeto..." maxlength="1000"></textarea>
  </div>

  <button type="submit" class="btn btn--primary btn--lg btn--full">QUERO SER PARCEIRO DA COMU</button>
</form>
```

---

### C. Formulário do Comu Pass (`#pass-form`) — `pass.html`

```html
<!-- ================================================
     FORMULÁRIO: LISTA DE ESPERA / COMU PASS
     ================================================ -->
<form id="pass-form" class="pass__signup">
  <input type="text" name="pass-name" class="form-input" placeholder="Seu nome" maxlength="100" required />
  <input type="email" name="pass-email" class="form-input" placeholder="Seu melhor email" maxlength="100" required />
  <input type="tel" name="pass-whatsapp" class="form-input" placeholder="WhatsApp (opcional)" maxlength="100" />
  <button type="submit" class="btn btn--primary btn--lg btn--full">
    <span>QUERO FAZER PARTE</span>
    <i class="fa-solid fa-arrow-right"></i>
  </button>
</form>
```

---

## 2. Frontend de Processamento e Segurança: `js/forms.js`

```javascript
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
  const RECAPTCHA_SITE_KEY = '6LclA6QtAAAAAAc98Y4QdzQf3oomZrt-PydXgikN';
  const RATE_LIMIT_SECONDS = 60;
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw47e7NkL9E24tEMhVrn8yD6c2cHkVy-kM6LJsJ1Oue4Gfo9Won06QVTgwrJSuD7Hll/exec';

  // ---- Security Helpers ----

  /**
   * Sanitizes text input: trims, strips '<' and '>', and applies character length constraints
   */
  function sanitizeInput(val, isLongField = false) {
    if (typeof val !== 'string') return '';
    const cleaned = val.trim().replace(/[<>]/g, '');
    const maxLen = isLongField ? 1000 : 100;
    return cleaned.slice(0, maxLen);
  }

  /**
   * Checks if form is within the 60-second rate limit
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
   */
  function getRecaptchaToken(action = 'submit') {
    return new Promise((resolve) => {
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

      const remaining = getRateLimitRemaining('radar-form');
      if (remaining > 0) {
        showRateLimitWarning(form, remaining);
        return;
      }

      const nameInput = form.querySelector('[name="radar-name"]');
      const typeInput = form.querySelector('[name="radar-type"]');
      const instagramInput = form.querySelector('[name="radar-instagram"]');
      const reasonInput = form.querySelector('[name="radar-reason"]');

      const nameVal = sanitizeInput(nameInput ? nameInput.value : '', false);
      const typeVal = sanitizeInput(typeInput ? typeInput.value : '', false);
      const instaVal = sanitizeInput(instagramInput ? instagramInput.value : '', false);
      const reasonVal = sanitizeInput(reasonInput ? reasonInput.value : '', true);

      if (!nameVal || !typeVal || !reasonVal) {
        shakeForm(form);
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
        submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Enviando...';
      }

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

      setRateLimitTimestamp('radar-form');

      console.log('📡 Comu Radar — Payload enviado para Google Apps Script:', data);
      await sendToGoogleScript(data);

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

      const remaining = getRateLimitRemaining('producers-form');
      if (remaining > 0) {
        showRateLimitWarning(form, remaining);
        return;
      }

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

      if (!nameVal || !companyVal || !eventTypeVal) {
        shakeForm(form);
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
        submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Enviando...';
      }

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

      setRateLimitTimestamp('producers-form');

      console.log('🤝 Comu — Payload de parceiro enviado para Google Apps Script:', data);
      await sendToGoogleScript(data);

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
```

---

## 3. Configuração de Segurança de Deploy: `vercel.json`

```json
{
  "framework": null,
  "outputDirectory": ".",
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://unpkg.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net; img-src 'self' https: data:; font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; connect-src 'self' https://www.google.com https://www.gstatic.com https://script.google.com https://script.googleusercontent.com https://formsubmit.co; frame-src 'self' https://www.google.com https://recaptcha.google.com; object-src 'none'; base-uri 'self';"
        }
      ]
    }
  ]
}
```

---

## 4. Google Apps Script Backend (`Code.gs`) com Validação Server-Side Ativa

Abaixo está o código completo para substituir no editor do Google Apps Script (`script.google.com/home`). Ele inclui a **Secret Key configurada**, a chamada oficial para `https://www.google.com/recaptcha/api/siteverify` via `UrlFetchApp`, validação de `score >= 0.5` e bloqueio de bots/spams antes de gravar na planilha:

```javascript
/**
 * COMU — Google Apps Script Backend (Web App)
 * Processa e valida submissões com Google reCAPTCHA v3 Server-Side
 */

// Secret Key do reCAPTCHA v3
const RECAPTCHA_SECRET = "6Ldz2aMtAAAAHruwYnBZMvp0f265JYQ2u4PrbJI";
const MIN_RECAPTCHA_SCORE = 0.5; // Score mínimo aceitável (0.0 = bot, 1.0 = humano)

/**
 * Valida o token do reCAPTCHA v3 diretamente na API do Google
 * @param {string} token 
 * @returns {object} { valid: boolean, score: number, error: string }
 */
function verifyRecaptcha(token) {
  if (!token) {
    return { valid: false, score: 0, error: "Token ausente" };
  }

  try {
    const url = "https://www.google.com/recaptcha/api/siteverify";
    const payload = {
      secret: RECAPTCHA_SECRET,
      response: token
    };

    const options = {
      method: "post",
      payload: payload,
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());

    // reCAPTCHA v3 retorna: { "success": true|false, "score": 0.0 - 1.0, "action": "...", ... }
    if (result.success && result.score >= MIN_RECAPTCHA_SCORE) {
      return { valid: true, score: result.score, error: null };
    } else {
      return { 
        valid: false, 
        score: result.score || 0, 
        error: result["error-codes"] ? result["error-codes"].join(", ") : "Score baixo ou inválido" 
      };
    }
  } catch (err) {
    Logger.log("Erro na validação do reCAPTCHA: " + err.toString());
    // Em caso de falha de conexão com a API do Google, decide se bloqueia ou permite
    return { valid: false, score: 0, error: err.toString() };
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const rawData = e.postData ? e.postData.contents : "{}";
    const data = JSON.parse(rawData);
    const formType = (data.formulario || data.form || "geral").toLowerCase();

    // 1. Validação Obrigatória do reCAPTCHA v3
    const token = data.recaptchaToken || "";
    const recaptchaResult = verifyRecaptcha(token);

    if (!recaptchaResult.valid) {
      Logger.log(`🚨 Submissão bloqueada por reCAPTCHA inválido ou suspeito. Form: ${formType}, Score: ${recaptchaResult.score}, Erro: ${recaptchaResult.error}`);
      
      return ContentService
        .createTextOutput(JSON.stringify({ 
          status: "error", 
          message: "Falha na verificação de segurança (reCAPTCHA).",
          score: recaptchaResult.score 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Gravação dos dados válidos na Planilha
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet;
    const timestamp = new Date();
    const scoreText = `Score: ${recaptchaResult.score}`;

    // Roteamento por tipo de formulário
    if (formType.includes("radar")) {
      sheet = getOrCreateSheet(ss, "Radar", [
        "Data/Hora", "Nome do Local/Evento", "Tipo", "Instagram", "Motivo da Indicação", "reCAPTCHA Score"
      ]);
      sheet.appendRow([
        timestamp,
        data.nome || data.name || "",
        data.tipo || data.type || "",
        data.instagram || "",
        data.motivo || data.reason || data.porQueIndicar || "",
        scoreText
      ]);

    } else if (formType.includes("parceiro") || formType.includes("produtor")) {
      sheet = getOrCreateSheet(ss, "Parceiros", [
        "Data/Hora", "Nome", "Empresa/Projeto", "Instagram", "WhatsApp", "Tipo de Evento", "Site", "Mensagem", "reCAPTCHA Score"
      ]);
      sheet.appendRow([
        timestamp,
        data.nome || data.name || "",
        data.empresa || data.company || data.projeto || "",
        data.instagram || "",
        data.whatsapp || "",
        data.tipo || data.tipoEvento || data.eventType || "",
        data.site || data.website || "",
        data.mensagem || data.message || "",
        scoreText
      ]);

    } else if (formType.includes("pass")) {
      sheet = getOrCreateSheet(ss, "Comu Pass", [
        "Data/Hora", "Nome", "E-mail", "WhatsApp", "reCAPTCHA Score"
      ]);
      sheet.appendRow([
        timestamp,
        data.nome || data.name || "",
        data.email || "",
        data.whatsapp || "",
        scoreText
      ]);

    } else if (formType.includes("pesquisa")) {
      sheet = getOrCreateSheet(ss, "Pesquisa Comu", [
        "Data/Hora", "Nome", "Idade", "WhatsApp", "Bairro/Cidade", "Instagram", "Q1 Frequência", "Q2 Lugares", "Q3 O que busca", "Q4 Dificuldades", "Q5 Comu Pass", "Cupom", "reCAPTCHA Score"
      ]);
      sheet.appendRow([
        timestamp,
        data.nome || "",
        data.idade || "",
        data.whatsapp || "",
        data.ondeMora || "",
        data.instagram || "",
        data.q1 || "",
        Array.isArray(data.q2) ? data.q2.join(", ") : (data.q2 || ""),
        Array.isArray(data.q3) ? data.q3.join(", ") : (data.q3 || ""),
        Array.isArray(data.q4) ? data.q4.join(", ") : (data.q4 || ""),
        data.q5 || "",
        data.cupom || "",
        scoreText
      ]);

    } else {
      sheet = getOrCreateSheet(ss, "Outros", ["Data/Hora", "Dados Brutos", "reCAPTCHA Score"]);
      sheet.appendRow([timestamp, JSON.stringify(data), scoreText]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Recebido com sucesso!", score: recaptchaResult.score }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Erro no doPost: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Função auxiliar que cria a aba com cabeçalhos se ela ainda não existir
 */
function getOrCreateSheet(spreadsheet, sheetName, headers) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function doGet(e) {
  return ContentService.createTextOutput("Comu API está ativa e operacional com reCAPTCHA v3.");
}
```
