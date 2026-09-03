// ==========================================
// COMU — Auth (Login & Register) Modal Popups
// ==========================================

(function () {
  'use strict';

  function initAuthModals() {
    // Login Modal Elements
    const loginOverlay = document.getElementById('auth-modal-overlay');
    const loginCloseBtn = document.getElementById('auth-modal-close');
    const loginForm = document.getElementById('auth-modal-form');
    const loginCreateLink = document.getElementById('auth-modal-create-link');
    const loginInput = document.getElementById('auth-identifier');

    // Register Modal Elements
    const regOverlay = document.getElementById('register-modal-overlay');
    const regCloseBtn = document.getElementById('register-modal-close');
    const regForm = document.getElementById('register-modal-form');
    const switchToLoginLink = document.getElementById('switch-to-login');
    const openTermsLink = document.getElementById('open-terms-from-reg');

    // Register Inputs
    const regCpf = document.getElementById('reg-cpf');
    const regPhone = document.getElementById('reg-phone');
    const regBirthdate = document.getElementById('reg-birthdate');
    const regPassword = document.getElementById('reg-password');
    const regPasswordConfirm = document.getElementById('reg-password-confirm');

    // ---- Modal Controllers ----

    function openLoginModal() {
      if (regOverlay) closeRegisterModal();
      if (!loginOverlay) return;
      loginOverlay.classList.add('open');
      loginOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (loginInput) loginInput.focus();
      }, 150);
    }

    function closeLoginModal() {
      if (!loginOverlay) return;
      loginOverlay.classList.remove('open');
      loginOverlay.setAttribute('aria-hidden', 'true');
      if (!regOverlay || !regOverlay.classList.contains('open')) {
        document.body.style.overflow = '';
      }
    }

    function openRegisterModal() {
      if (loginOverlay) closeLoginModal();
      if (!regOverlay) return;
      regOverlay.classList.add('open');
      regOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (regCpf) regCpf.focus();
      }, 150);
    }

    function closeRegisterModal() {
      if (!regOverlay) return;
      regOverlay.classList.remove('open');
      regOverlay.setAttribute('aria-hidden', 'true');
      if (!loginOverlay || !loginOverlay.classList.contains('open')) {
        document.body.style.overflow = '';
      }
    }

    // ---- Triggers ----

    // Open Login triggers
    const loginTriggers = document.querySelectorAll(
      '.header__btn-login, .mobile-nav__login-btn, [data-open-login-modal]'
    );

    loginTriggers.forEach((trigger) => {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        closeMobileNav();
        openLoginModal();
      });
    });

    // In Login Modal: "Cria uma conta" -> Opens Register Modal
    if (loginCreateLink) {
      loginCreateLink.addEventListener('click', function (e) {
        e.preventDefault();
        openRegisterModal();
      });
    }

    // In Register Modal: "Já tem conta? Entrar" -> Opens Login Modal
    if (switchToLoginLink) {
      switchToLoginLink.addEventListener('click', function (e) {
        e.preventDefault();
        openLoginModal();
      });
    }

    // Close buttons
    if (loginCloseBtn) {
      loginCloseBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeLoginModal();
      });
    }

    if (regCloseBtn) {
      regCloseBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeRegisterModal();
      });
    }

    // Click outside backdrop to close
    if (loginOverlay) {
      loginOverlay.addEventListener('click', function (e) {
        if (e.target === loginOverlay) closeLoginModal();
      });
    }

    if (regOverlay) {
      regOverlay.addEventListener('click', function (e) {
        if (e.target === regOverlay) closeRegisterModal();
      });
    }

    // ESC key to close any open modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (loginOverlay && loginOverlay.classList.contains('open')) closeLoginModal();
        if (regOverlay && regOverlay.classList.contains('open')) closeRegisterModal();
      }
    });

    // Terms of use link from Register Modal: allows normal link click to termos.html
    // (no preventDefault so it opens termos.html cleanly)

    function closeMobileNav() {
      const mobileNav = document.getElementById('mobile-nav');
      const mobileOverlay = document.getElementById('mobile-nav-overlay');
      const burger = document.getElementById('burger');
      if (mobileNav && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        if (mobileOverlay) mobileOverlay.classList.remove('open');
        if (burger) burger.classList.remove('open');
      }
    }

    // ---- Input Masks ----

    // CPF Mask: 000.000.000-00
    if (regCpf) {
      regCpf.addEventListener('input', function (e) {
        let v = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 9) {
          v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        } else if (v.length > 6) {
          v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (v.length > 3) {
          v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        }
        e.target.value = v;
      });
    }

    // Phone Mask: (00) 00000-0000 or (00) 0000-0000
    if (regPhone) {
      regPhone.addEventListener('input', function (e) {
        let v = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 10) {
          v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (v.length > 6) {
          v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (v.length > 2) {
          v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else if (v.length > 0) {
          v = v.replace(/(\d{0,2})/, '($1');
        }
        e.target.value = v;
      });
    }

    // Birthdate Mask: DD/MM/AAAA
    if (regBirthdate) {
      regBirthdate.addEventListener('input', function (e) {
        let v = e.target.value.replace(/\D/g, '').slice(0, 8);
        if (v.length > 4) {
          v = v.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
        } else if (v.length > 2) {
          v = v.replace(/(\d{2})(\d{1,2})/, '$1/$2');
        }
        e.target.value = v;
      });
    }

    // ---- Form Handlers ----

    // Login Form
    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const value = loginInput ? loginInput.value.trim() : '';
        if (!value) return;

        const submitBtn = loginForm.querySelector('.auth-modal__submit-btn');
        const originalContent = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Acessando...</span>';
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
          }
          alert(`Código de verificação enviado para: ${value}\n\nEm breve: acesso direto ao Painel do Membro Comu!`);
          closeLoginModal();
        }, 700);
      });
    }

    // Register Form
    if (regForm) {
      regForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        if (regPassword && regPasswordConfirm && regPassword.value !== regPasswordConfirm.value) {
          alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
          regPasswordConfirm.focus();
          return;
        }

        const nameVal = document.getElementById('reg-name') ? document.getElementById('reg-name').value.trim() : 'Membro';
        const submitBtn = regForm.querySelector('.auth-modal__submit-btn');
        const originalContent = submitBtn ? submitBtn.innerHTML : '';
        
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Criando conta...</span>';
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
          }
          alert(`🎉 Cadastro realizado com sucesso!\n\nBem-vindo(a) à Comu, ${nameVal}!`);
          closeRegisterModal();
        }, 900);
      });
    }

    // Expose helpers globally if needed
    window.ComuAuth = {
      openLogin: openLoginModal,
      closeLogin: closeLoginModal,
      openRegister: openRegisterModal,
      closeRegister: closeRegisterModal
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthModals);
  } else {
    initAuthModals();
  }
})();
