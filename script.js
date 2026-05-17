/* ================================================
   Waheed Rashid – Portfolio  |  script.js
   Features:
     • Mobile navbar toggle
     • Navbar scroll style + active link tracking
     • Typing animation
     • Scroll reveal animations
     • Skill bar animations (triggered on scroll)
     • Contact form validation
     • Back-to-top button
   ================================================ */

'use strict';

/* ─────────────────────────────────────────────
   1. DOM ELEMENTS
───────────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('nav-links');
const navItems    = document.querySelectorAll('.nav-link');
const backToTop   = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

/* ─────────────────────────────────────────────
   2. MOBILE NAVBAR TOGGLE
───────────────────────────────────────────── */
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);

  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

/* ─────────────────────────────────────────────
   3. NAVBAR: SCROLL STYLE + ACTIVE LINK
───────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  const scrollY = window.scrollY;

  /* Sticky style */
  navbar.classList.toggle('scrolled', scrollY > 20);

  /* Back-to-top visibility */
  backToTop.classList.toggle('visible', scrollY > 400);

  /* Active nav link based on current section */
  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 100;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      const id = section.getAttribute('id');
      navItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // Run once on load

/* ─────────────────────────────────────────────
   4. BACK TO TOP
───────────────────────────────────────────── */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─────────────────────────────────────────────
   5. TYPING ANIMATION
───────────────────────────────────────────── */
const typedEl   = document.getElementById('typed-text');
const roles     = [
  'Frontend Developer',
  'UI/UX Enthusiast',
  'Web Designer',
  'Problem Solver',
];
let roleIndex   = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingTimer = null;

function typeEffect() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    // Remove one character
    typedEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Add one character
    typedEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIndex === currentRole.length) {
    // Pause at the end of a word
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Move to next role
    isDeleting = false;
    roleIndex  = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  typingTimer = setTimeout(typeEffect, delay);
}

// Start typing animation after a short delay
setTimeout(typeEffect, 800);

/* ─────────────────────────────────────────────
   6. SCROLL REVEAL
───────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal so it doesn't re-trigger
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────────────
   7. SKILL BAR ANIMATION
───────────────────────────────────────────── */
const skillBars = document.querySelectorAll('.skill-bar');

const skillObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const fill  = bar.querySelector('.skill-fill');
        const width = bar.getAttribute('data-width');

        // Slight stagger per bar
        const delay = parseInt(bar.closest('.skill-card')?.dataset.index || 0, 10) * 80;
        setTimeout(() => {
          fill.style.width = `${width}%`;
        }, delay);

        skillObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.4 }
);

skillBars.forEach((bar, i) => {
  // Store index for stagger
  bar.closest('.skill-card').dataset.index = i;
  skillObserver.observe(bar);
});

/* ─────────────────────────────────────────────
   8. CONTACT FORM VALIDATION
───────────────────────────────────────────── */

/**
 * Show an error message under a field.
 * @param {string} fieldId   - ID of the input/textarea
 * @param {string} errorId   - ID of the <span> for the error
 * @param {string} message   - Error text to display
 */
function showError(fieldId, errorId, message) {
  const field     = document.getElementById(fieldId);
  const errorEl   = document.getElementById(errorId);
  const formGroup = field.closest('.form-group');

  errorEl.textContent = message;
  formGroup.classList.add('error');
}

/**
 * Clear an error from a field.
 */
function clearError(fieldId, errorId) {
  const field     = document.getElementById(fieldId);
  const errorEl   = document.getElementById(errorId);
  const formGroup = field.closest('.form-group');

  errorEl.textContent = '';
  formGroup.classList.remove('error');
}

/**
 * Validate the entire form.
 * Returns true if all fields pass, false otherwise.
 */
function validateForm() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let   valid   = true;

  /* Name */
  if (!name) {
    showError('name', 'name-error', 'Please enter your full name.');
    valid = false;
  } else if (name.length < 2) {
    showError('name', 'name-error', 'Name must be at least 2 characters.');
    valid = false;
  } else {
    clearError('name', 'name-error');
  }

  /* Email */
  if (!email) {
    showError('email', 'email-error', 'Please enter your email address.');
    valid = false;
  } else if (!emailRe.test(email)) {
    showError('email', 'email-error', 'Please enter a valid email address.');
    valid = false;
  } else {
    clearError('email', 'email-error');
  }

  /* Message */
  if (!message) {
    showError('message', 'message-error', 'Please enter a message.');
    valid = false;
  } else if (message.length < 10) {
    showError('message', 'message-error', 'Message must be at least 10 characters.');
    valid = false;
  } else {
    clearError('message', 'message-error');
  }

  return valid;
}

/* Real-time validation – clear errors as user types */
['name', 'email', 'message'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => {
    clearError(id, `${id}-error`);
  });
});

/* Form submit */
contactForm?.addEventListener('submit', e => {
  e.preventDefault();

  if (!validateForm()) return;

  /* Simulate sending (replace with real fetch/EmailJS in production) */
  const submitBtn  = contactForm.querySelector('button[type="submit"]');
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnIcon    = submitBtn.querySelector('.btn-icon');

  submitBtn.disabled  = true;
  btnText.textContent = 'Sending…';
  btnIcon.textContent = '⏳';

  setTimeout(() => {
    // Reset button
    submitBtn.disabled  = false;
    btnText.textContent = 'Send Message';
    btnIcon.textContent = '🚀';

    // Show success message
    formSuccess.classList.add('show');
    contactForm.reset();

    // Hide success after 5 s
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1400);
});

/* ─────────────────────────────────────────────
   9. SMOOTH SCROLL for anchor links
   (enhances browsers that don't support CSS scroll-behavior)
───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ─────────────────────────────────────────────
   10. HERO REVEAL on page load
───────────────────────────────────────────── */
window.addEventListener('load', () => {
  // Immediately reveal hero elements
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 150);
  });
});
