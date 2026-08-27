// ==========================================
// COMU — Interactive Strategic Survey (Pesquisa Comu)
// Step-by-step navigation, coupon generation, and data submission
// ==========================================

(function () {
  'use strict';

  // ---- Configuration ----
  // Cole a URL do seu Web App do Google Apps Script aqui para enviar os dados para a Planilha
  const GOOGLE_SHEETS_URL = '';

  // ---- State ----
  let currentStep = 0;
  const totalQuestionSteps = 5; // Q1 to Q5
  const steps = []; // DOM elements of slides
  let userData = {
    nome: '',
    idade: '',
    whatsapp: '',
    ondeMora: '',
    instagram: ''
  };
  let answers = {
    q1: '', // Single select
    q2: [], // Multi select
    q3: [], // Multi select
    q4: [], // Multi select
    q5: ''  // Single select
  };
  let generatedCoupon = '';

  // ---- DOM Elements ----
  let container, progressContainer, progressBar, stepCounter, btnPrev, btnNext, body, actionsContainer;

  // ---- Init Function ----
  function init() {
    body = document.body;
    container = document.querySelector('.pesquisa-wrapper');
    if (!container) return;

    progressContainer = document.querySelector('.pesquisa-progress-container');
    progressBar = document.querySelector('.pesquisa-progress-bar');
    stepCounter = document.querySelector('.pesquisa-step-counter');
    btnPrev = document.getElementById('btn-prev');
    btnNext = document.getElementById('btn-next');
    actionsContainer = document.querySelector('.pesquisa-actions');

    // Check for admin view
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin')) {
      renderAdminDashboard();
      return;
    }

    // Load steps
    const slideElements = document.querySelectorAll('.pesquisa-slide');
    slideElements.forEach(el => steps.push(el));

    // Setup Event Listeners
    setupOptionSelectors();
    setupNavigation();
    setupInputs();
    setupCopyCoupon();

    // Show initial slide
    goToStep(0);
  }

  // ---- Admin Dashboard ----
  function renderAdminDashboard() {
    body.innerHTML = '';
    body.classList.remove('slide-white-bg');
    body.style.padding = 'var(--space-8) var(--space-4)';
    body.style.display = 'block';

    const adminDiv = document.createElement('div');
    adminDiv.className = 'admin-container';

    const responses = JSON.parse(localStorage.getItem('comu_survey_responses') || '[]');

    let rowsHTML = '';
    if (responses.length === 0) {
      rowsHTML = `<tr><td colspan="7" style="text-align: center; color: var(--color-text-muted);">Nenhuma resposta registrada ainda.</td></tr>`;
    } else {
      responses.forEach((resp, index) => {
        const date = new Date(resp.timestamp).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        rowsHTML += `
          <tr>
            <td>${date}</td>
            <td><strong>${escapeHtml(resp.nome)}</strong></td>
            <td>${escapeHtml(resp.idade)}</td>
            <td><a href="https://wa.me/55${resp.whatsapp.replace(/\D/g, '')}" target="_blank" style="color: var(--brand-primary); text-decoration: none;">${escapeHtml(resp.whatsapp)}</a></td>
            <td>${escapeHtml(resp.ondeMora)}</td>
            <td><a href="https://instagram.com/${resp.instagram.replace('@', '')}" target="_blank" style="color: var(--color-sky); text-decoration: none;">${escapeHtml(resp.instagram)}</a></td>
            <td>${escapeHtml(resp.coupon)}</td>
          </tr>
        `;
      });
    }

    adminDiv.innerHTML = `
      <div class="admin-header">
        <h2 style="font-family: var(--font-display); font-size: var(--text-xl);">Painel de Respostas — Pesquisa Comu</h2>
        <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">${responses.length} formulários enviados</span>
      </div>
      <div style="margin-bottom: var(--space-4); display: flex; gap: var(--space-3); flex-wrap: wrap;">
        <button id="btn-export-csv" class="btn btn--primary btn--sm" ${responses.length === 0 ? 'disabled' : ''}>Exportar CSV</button>
        <button id="btn-export-json" class="btn btn--secondary btn--sm" ${responses.length === 0 ? 'disabled' : ''}>Exportar JSON</button>
        <button id="btn-clear-db" class="btn btn--ghost btn--sm" style="color: var(--color-rose); margin-left: auto;">Limpar Banco Local</button>
      </div>
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Nome</th>
              <th>Idade</th>
              <th>WhatsApp</th>
              <th>Onde Mora</th>
              <th>Instagram</th>
              <th>Cupom</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
      </div>
      <div style="text-align: right;">
        <a href="pesquisa-comu.html" class="btn btn--ghost btn--sm"><i class="ph ph-arrow-left"></i> Voltar para Pesquisa</a>
      </div>
    `;

    body.appendChild(adminDiv);

    // Export CSV handler
    document.getElementById('btn-export-csv')?.addEventListener('click', () => {
      if (responses.length === 0) return;
      let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
      csvContent += "Data,Nome,Idade,WhatsApp,Onde Mora,Instagram,Cupom,Q1 Frequencia,Q2 Onde Procura,Q3 Dificuldade,Q4 Interesse,Q5 Entraria\n";

      responses.forEach(r => {
        const q2 = Array.isArray(r.answers.q2) ? r.answers.q2.join('; ') : r.answers.q2;
        const q3 = Array.isArray(r.answers.q3) ? r.answers.q3.join('; ') : r.answers.q3;
        const q4 = Array.isArray(r.answers.q4) ? r.answers.q4.join('; ') : r.answers.q4;
        
        const row = [
          new Date(r.timestamp).toISOString(),
          `"${r.nome.replace(/"/g, '""')}"`,
          `"${r.idade}"`,
          `"${r.whatsapp}"`,
          `"${r.ondeMora.replace(/"/g, '""')}"`,
          `"${r.instagram}"`,
          `"${r.coupon}"`,
          `"${r.answers.q1}"`,
          `"${q2}"`,
          `"${q3}"`,
          `"${q4}"`,
          `"${r.answers.q5}"`
        ].join(",");
        csvContent += row + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `respostas_comu_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    // Export JSON handler
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      if (responses.length === 0) return;
      const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(responses, null, 2));
      const link = document.createElement("a");
      link.setAttribute("href", jsonString);
      link.setAttribute("download", `respostas_comu_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    // Clear Database handler
    document.getElementById('btn-clear-db')?.addEventListener('click', () => {
      if (confirm("Tem certeza que deseja apagar permanentemente todas as respostas salvas localmente?")) {
        localStorage.removeItem('comu_survey_responses');
        alert("Banco de dados local limpo!");
        window.location.reload();
      }
    });
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ---- Navigation Logic ----
  function goToStep(index) {
    if (index < 0 || index >= steps.length) return;

    // Remove active class from current step
    steps.forEach(step => step.classList.remove('active'));

    // Set new active slide
    currentStep = index;
    const currentSlide = steps[currentStep];
    currentSlide.classList.add('active');

    // Trigger body class for Screen 1 (fundo branco)
    if (currentStep === 1) {
      body.classList.add('slide-white-bg');
    } else {
      body.classList.remove('slide-white-bg');
    }

    // Update Progress bar & steps display
    updateProgressDisplay();
    validateStepState();
  }

  function updateProgressDisplay() {
    // Hide controls on Intro (0), White Page (1), and Thank You (8) slides
    if (currentStep === 0 || currentStep === 1 || currentStep === steps.length - 1) {
      progressContainer.style.display = 'none';
      stepCounter.style.display = 'none';
      btnPrev.style.display = 'none';
      btnNext.style.display = 'none';
      if (actionsContainer) actionsContainer.style.display = 'none';
    } else {
      if (actionsContainer) actionsContainer.style.display = 'flex';
      progressContainer.style.display = 'block';
      stepCounter.style.display = 'block';
      
      // Show/hide previous button
      // On Step 2 (Cadastro), we don't show the back button to Step 1 to keep a clean forward funnel
      if (currentStep === 2) {
        btnPrev.style.display = 'none';
      } else {
        btnPrev.style.display = 'inline-flex';
      }
      btnNext.style.display = 'inline-flex';

      // We calculate progress from Step 1 to Step 7
      const totalStepsTracked = steps.length - 2; // Steps 1 to 7
      const currentTracked = currentStep - 1;
      const progressPercent = Math.round((currentTracked / totalStepsTracked) * 100);
      
      progressBar.style.width = `${progressPercent}%`;
      
      // Update step text (only count questions 1 to 5)
      // Steps: 0: Intro, 1: White page, 2: Cadastro, 3: Q1, 4: Q2, 5: Q3, 6: Q4, 7: Q5, 8: Thank you
      if (currentStep === 2) {
        stepCounter.textContent = 'Cadastro';
      } else if (currentStep >= 3 && currentStep <= 7) {
        stepCounter.textContent = `Pergunta ${currentStep - 2} de ${totalQuestionSteps}`;
      } else {
        stepCounter.textContent = `Progresso`;
      }
    }
  }

  // ---- Navigation Buttons ----
  function setupNavigation() {
    // Next slide click
    btnNext.addEventListener('click', () => {
      if (currentStep === 2) {
        if (!validateCadastroForm()) {
          shakeContainer();
          return;
        }
      }

      if (currentStep === 7) {
        submitSurvey();
      } else {
        goToStep(currentStep + 1);
      }
    });

    // Prev slide click
    btnPrev.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });

    // Start buttons on intro slides
    const startBtns = document.querySelectorAll('.btn-start-survey');
    startBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        goToStep(currentStep + 1);
      });
    });
  }

  function shakeContainer() {
    container.style.animation = 'none';
    void container.offsetHeight; // Force reflow
    container.style.animation = 'shake 0.4s ease-in-out';
  }

  // ---- Option Selectors ----
  function setupOptionSelectors() {
    const optionCards = document.querySelectorAll('.pesquisa-option-card');
    
    optionCards.forEach(card => {
      card.addEventListener('click', () => {
        const slide = card.closest('.pesquisa-slide');
        const qKey = slide.dataset.q;
        const optionValue = card.dataset.value;
        const isMulti = slide.dataset.multi === 'true';

        if (isMulti) {
          // Toggle selection for multiple choice
          card.classList.toggle('selected');
          if (card.classList.contains('selected')) {
            if (!answers[qKey].includes(optionValue)) {
              answers[qKey].push(optionValue);
            }
          } else {
            answers[qKey] = answers[qKey].filter(v => v !== optionValue);
          }
        } else {
          // Select single choice
          slide.querySelectorAll('.pesquisa-option-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          answers[qKey] = optionValue;
          
          // Auto advance on single choice questions after a brief delay
          setTimeout(() => {
            if (currentStep === 7) {
              submitSurvey();
            } else {
              goToStep(currentStep + 1);
            }
          }, 350);
        }

        validateStepState();
      });
    });
  }

  // ---- Form Handling & Inputs ----
  function setupInputs() {
    const inputs = document.querySelectorAll('.pesquisa-input');
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const field = e.target.id.replace('cadastro-', '');
        userData[field] = e.target.value.trim();
        
        // Remove error formatting on type
        if (e.target.value.trim()) {
          e.target.style.borderColor = '';
          e.target.style.boxShadow = '';
        }
        
        validateStepState();
      });

      // Special format for instagram to prepend @ if missing
      if (input.id === 'cadastro-instagram') {
        input.addEventListener('blur', (e) => {
          let val = e.target.value.trim();
          if (val && !val.startsWith('@')) {
            e.target.value = '@' + val;
            userData.instagram = '@' + val;
          }
        });
      }
    });
  }

  // Check if current step has valid choices to enable next button
  function validateStepState() {
    let isValid = false;

    if (currentStep === 0 || currentStep === 1) {
      isValid = true;
    } else if (currentStep === 2) {
      // Cadastro validation
      isValid = !!(userData.nome && userData.idade && userData.whatsapp && userData.ondeMora);
    } else if (currentStep >= 3 && currentStep <= 7) {
      // Questions
      const qKey = steps[currentStep].dataset.q;
      const answer = answers[qKey];
      isValid = Array.isArray(answer) ? answer.length > 0 : !!answer;
    }

    btnNext.disabled = !isValid;
    if (isValid) {
      btnNext.classList.remove('btn--disabled');
    } else {
      btnNext.classList.add('btn--disabled');
    }
  }

  function validateCadastroForm() {
    let isValid = true;
    const requiredIds = ['cadastro-nome', 'cadastro-idade', 'cadastro-whatsapp', 'cadastro-ondeMora'];
    
    requiredIds.forEach(id => {
      const input = document.getElementById(id);
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = 'var(--color-rose)';
        input.style.boxShadow = '0 0 0 3px var(--color-rose-glow)';
      }
    });

    return isValid;
  }

  // ---- Coupon Generation ----
  function generateCouponCode(name) {
    const cleanName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .toUpperCase()
      .replace(/[^A-Z]/g, '') // Keep letters only
      .split(' ')[0]; // Take first name

    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Readable characters
    let randomCode = '';
    for (let i = 0; i < 4; i++) {
      randomCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return `${cleanName || 'COMU'}-${randomCode}`;
  }

  // ---- Clipboard Copy ----
  function setupCopyCoupon() {
    const copyBtn = document.getElementById('btn-copy-coupon');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
      const codeText = document.querySelector('.coupon-code').textContent;
      navigator.clipboard.writeText(codeText).then(() => {
        copyBtn.innerHTML = '<i class="ph ph-check" style="color: var(--color-teal)"></i> Copiado!';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="ph ph-copy"></i> Copiar Código';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }

  // ---- Form Submission ----
  function submitSurvey() {
    // Generate coupon
    generatedCoupon = generateCouponCode(userData.nome);
    document.querySelector('.coupon-code').textContent = generatedCoupon;
    document.getElementById('display-user-name').textContent = userData.nome.split(' ')[0];

    // Combine payload
    const payload = {
      timestamp: new Date().toISOString(),
      ...userData,
      answers: { ...answers },
      coupon: generatedCoupon
    };

    console.log('📝 Survey Response Compiled:', payload);

    // Save to LocalStorage
    try {
      const existing = JSON.parse(localStorage.getItem('comu_survey_responses') || '[]');
      existing.push(payload);
      localStorage.setItem('comu_survey_responses', JSON.stringify(existing));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    // Advance to Thank You slide immediately
    goToStep(steps.length - 1);

    // Submit to FormSubmit.co via background fetch (Option A)
    // Email: relacionamento@comupass.com.br
    const formSubmitUrl = 'https://formsubmit.co/ajax/relacionamento@comupass.com.br';
    
    // Prepare FormData
    const formData = new FormData();
    formData.append('_subject', `Nova Resposta Pesquisa — ${userData.nome}`);
    formData.append('Nome Completo', userData.nome);
    formData.append('Idade', userData.idade);
    formData.append('WhatsApp', userData.whatsapp);
    formData.append('Onde Mora', userData.ondeMora);
    formData.append('Instagram', userData.instagram || 'Não informado');
    formData.append('Cupom Gerado', generatedCoupon);
    
    // Format answers nicely for email reading
    formData.append('Q1: Frequencia de Saidas', answers.q1);
    formData.append('Q2: Onde Procura Eventos', Array.isArray(answers.q2) ? answers.q2.join(', ') : answers.q2);
    formData.append('Q3: Maior Dificuldade', Array.isArray(answers.q3) ? answers.q3.join(', ') : answers.q3);
    formData.append('Q4: O que mais interessa na comunidade', Array.isArray(answers.q4) ? answers.q4.join(', ') : answers.q4);
    formData.append('Q5: Entraria gratuitamente', answers.q5);

    fetch(formSubmitUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('📡 Survey sent via FormSubmit:', data);
    })
    .catch(error => {
      console.error('📡 FormSubmit error (will try local backup only):', error);
    });

    // Submit to Google Sheets (Apps Script Web App)
    if (GOOGLE_SHEETS_URL) {
      fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors', // Opaque request to avoid CORS redirect blocks from Google Apps Script
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: payload.timestamp,
          nome: payload.nome,
          idade: payload.idade,
          whatsapp: payload.whatsapp,
          ondeMora: payload.ondeMora,
          instagram: payload.instagram || 'Não informado',
          coupon: payload.coupon,
          q1: payload.answers.q1,
          q2: Array.isArray(payload.answers.q2) ? payload.answers.q2.join(', ') : payload.answers.q2,
          q3: Array.isArray(payload.answers.q3) ? payload.answers.q3.join(', ') : payload.answers.q3,
          q4: Array.isArray(payload.answers.q4) ? payload.answers.q4.join(', ') : payload.answers.q4,
          q5: payload.answers.q5
        })
      })
      .then(() => {
        console.log('📊 Survey sent to Google Sheets!');
      })
      .catch(error => {
        console.error('📊 Google Sheets error:', error);
      });
    }
  }

  // Setup Styles dynamically for shaking container
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
    .btn--disabled {
      opacity: 0.5;
      cursor: not-allowed !important;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  // ---- DOM Load Init ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
