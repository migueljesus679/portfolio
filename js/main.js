/**
 * main.js — Entry point
 * Wires all modules together after DOMContentLoaded.
 */

import { startBoot }        from './boot.js';
import { Typewriter }       from './typewriter.js';
import { initGlitch, startRandomGlitch } from './glitch.js';
import { initTerminal }     from './terminal.js';
import { initNoise, scheduleCrtFlicker, initScrollObserver, initScrollMatrixFade, initScrollSpy } from './effects.js';

// ---- Hero initialization (called after boot completes) ---------------------

function initHero() {
  const heroTitleEl = document.getElementById('hero-title');
  if (heroTitleEl) {
    new Typewriter(heroTitleEl, {
      phrases: [
        'WEB DEVELOPER',
        'PROBLEM SOLVER',
        'AI ETHUSIAST',
        'BUG HUNTER',
      ],
      speed: 85,
      deleteSpeed: 42,
      pause: 2400,
      loop: true,
      startDelay: 300,
    }).start();
  }

  // Trigger glitch click handlers
  initGlitch();

  // Start periodic random glitches
  setTimeout(startRandomGlitch, 6000);
}

// ---- Contact form (demo — shows status message) ----------------------------

function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.className = 'form-status sending';
    status.textContent = '> TRANSMITTING...';

    // Simulate async send
    setTimeout(() => {
      status.className = 'form-status success';
      status.textContent = '> MESSAGE RECEIVED. WILL RESPOND WITHIN 24H.';
      form.reset();
    }, 1800);
  });
}

// ---- DOMContentLoaded ------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // 1. Boot sequence — everything else starts after it finishes
  startBoot();

  // 2. After boot completes, init the main site
  document.addEventListener('boot-complete', () => {
    initHero();
    initScrollObserver();
    initScrollMatrixFade();
    initScrollSpy();
    scheduleCrtFlicker();
  }, { once: true });

  // 3. These run immediately (don't depend on boot)
  initNoise();
  initTerminal();
  initContactForm();
});
