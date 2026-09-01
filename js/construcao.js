/* ==========================================================================
   COMU / LAJE PASS — UNDER CONSTRUCTION JAVASCRIPT
   VIP Form Handler & Admin Access
   ========================================================================== */

(function () {
  'use strict';

  // VIP Early Access / Newsletter Form Handler
  const notifyForm = document.getElementById('notifyForm');
  const notifyInput = document.getElementById('notifyInput');
  const notifySuccess = document.getElementById('notifySuccess');

  if (notifyForm && notifyInput && notifySuccess) {
    notifyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const value = notifyInput.value.trim();

      if (!value) return;

      try {
        const list = JSON.parse(localStorage.getItem('comu_vip_subscribers') || '[]');
        list.push({ contact: value, date: new Date().toISOString() });
        localStorage.setItem('comu_vip_subscribers', JSON.stringify(list));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      notifyForm.style.display = 'none';
      notifySuccess.style.display = 'flex';
    });
  }

  // Developer & Admin Bypass Shortcut (Ctrl+Shift+P)
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
      window.location.href = 'home.html';
    }
  });

})();
