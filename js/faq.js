/* ==========================================================================
   COMU — Dedicated FAQ Logic
   ========================================================================== */

(function () {
  'use strict';

  // ---- Accordion Logic ----
  const faqQuestions = document.querySelectorAll('.faq__question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isExpanded = question.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ---- Expand All / Collapse All ----
  const btnExpandAll = document.getElementById('btn-expand-all');
  const btnCollapseAll = document.getElementById('btn-collapse-all');

  if (btnExpandAll) {
    btnExpandAll.addEventListener('click', () => {
      faqQuestions.forEach(question => {
        const answer = question.nextElementSibling;
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      });
    });
  }

  if (btnCollapseAll) {
    btnCollapseAll.addEventListener('click', () => {
      faqQuestions.forEach(question => {
        const answer = question.nextElementSibling;
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      });
    });
  }

  // ---- Scrollspy (Highlight sidebar link on scroll) & Smooth scroll ----
  const sidebarLinks = document.querySelectorAll('.faq-sidebar__link');
  const faqSections = document.querySelectorAll('.faq-section-block');

  // Smooth scroll
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Scroll smoothly to target
        const offset = 90; // Header height offset
        const bodyRect = document.body.getBoundingClientRect().top;
        const targetRect = targetSection.getBoundingClientRect().top;
        const targetPosition = targetRect - bodyRect - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update active class immediately
        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // Scrollspy logic
  function scrollspy() {
    const scrollPosition = window.scrollY + 120; // Offset for header/margin

    faqSections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        sidebarLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Hook scrollspy to scroll event
  window.addEventListener('scroll', scrollspy);
  window.addEventListener('load', scrollspy);

})();
