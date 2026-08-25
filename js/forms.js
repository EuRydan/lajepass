// ==========================================
// COMU — Form Handling
// Validation and feedback for Radar & Producers
// ==========================================

(function () {
  'use strict';

  // ---- Radar Form ----

  function initRadarForm() {
    const form = document.getElementById('radar-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = {
        name: form.querySelector('[name="radar-name"]').value.trim(),
        type: form.querySelector('[name="radar-type"]').value,
        instagram: form.querySelector('[name="radar-instagram"]').value.trim(),
        reason: form.querySelector('[name="radar-reason"]').value.trim(),
      };

      // Basic validation
      if (!data.name || !data.type || !data.reason) {
        shakeForm(form);
        return;
      }

      console.log('📡 Comu Radar — Indicação recebida:', data);

      // Show success
      showFormSuccess(form, {
        icon: '📡',
        title: 'Indicação enviada!',
        text: 'Vamos analisar sua indicação e, se for aprovada, ela entra no radar da Comu.',
      });
    });
  }

  // ---- Producers Form ----

  function initProducersForm() {
    const form = document.getElementById('producers-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = {
        name: form.querySelector('[name="producer-name"]').value.trim(),
        company: form.querySelector('[name="producer-company"]').value.trim(),
        instagram: form.querySelector('[name="producer-instagram"]').value.trim(),
        whatsapp: form.querySelector('[name="producer-whatsapp"]').value.trim(),
        eventType: form.querySelector('[name="producer-event-type"]').value,
        message: form.querySelector('[name="producer-message"]').value.trim(),
      };

      // Basic validation
      if (!data.name || !data.company || !data.eventType) {
        shakeForm(form);
        return;
      }

      console.log('🤝 Comu — Solicitação de parceria:', data);

      // Show success
      showFormSuccess(form, {
        icon: '🤝',
        title: 'Solicitação enviada!',
        text: 'Nossa equipe vai entrar em contato em até 48h. Estamos ansiosos para conhecer seu projeto.',
      });
    });
  }

  // ---- Comu Pass Form ----

  function initPassForm() {
    const form = document.getElementById('pass-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = {
        name: form.querySelector('[name="pass-name"]').value.trim(),
        email: form.querySelector('[name="pass-email"]').value.trim(),
        whatsapp: form.querySelector('[name="pass-whatsapp"]').value.trim(),
      };

      if (!data.name || !data.email) {
        shakeForm(form);
        return;
      }

      console.log('💳 Comu Pass — Cadastro:', data);

      showFormSuccess(form, {
        icon: '<i class="ph-fill ph-confetti" style="font-size: 24px; color: var(--brand-primary)"></i>',
        title: 'Você está na lista!',
        text: 'Em breve você vai receber seu convite para fazer parte da Comu.',
      });
    });
  }

  // ---- Helpers ----

  function shakeForm(form) {
    form.style.animation = 'none';
    // Force reflow
    void form.offsetHeight;
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
