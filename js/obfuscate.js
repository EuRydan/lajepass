/* ==========================================================================
   COMU — Contact Obfuscation Utility (Anti-Scraping Security)
   Dynamically builds emails and phone links in the DOM to avoid plain-text scrapers
   ========================================================================== */

(function () {
  'use strict';

  function initObfuscatedContacts() {
    // 1. Obfuscate Email addresses dynamically
    const emailElements = document.querySelectorAll('.js-obfuscated-email');
    emailElements.forEach((el) => {
      const user = el.getAttribute('data-user') || 'relacionamento';
      const domain = el.getAttribute('data-domain') || 'comupass.com.br';
      const email = user + '@' + domain;

      if (el.tagName.toLowerCase() === 'a') {
        el.href = 'mailto:' + email;
        if (!el.getAttribute('data-custom-text')) {
          el.textContent = email;
        }
      } else {
        el.textContent = email;
      }
    });

    // 2. Obfuscate WhatsApp Phone Links dynamically
    const waElements = document.querySelectorAll('.js-obfuscated-wa');
    waElements.forEach((el) => {
      const country = el.getAttribute('data-country') || '55';
      const ddd = el.getAttribute('data-ddd') || '21';
      const number = el.getAttribute('data-num') || '978949944';
      const fullPhone = country + ddd + number;

      if (el.tagName.toLowerCase() === 'a') {
        el.href = 'https://wa.me/' + fullPhone;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObfuscatedContacts);
  } else {
    initObfuscatedContacts();
  }

  // Export to window in case dynamically rendered modals need to re-init
  window.initObfuscatedContacts = initObfuscatedContacts;
})();
