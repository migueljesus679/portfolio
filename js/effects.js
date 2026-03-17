/**
 * effects.js — Ambient effects & scroll-triggered animations
 *
 * - Animated noise canvas (static texture)
 * - CRT flicker (rare body opacity dip)
 * - IntersectionObserver for scroll animations
 * - Matrix canvas opacity based on scroll position
 */

import { decipherText } from './glitch.js';

// ---- Noise canvas -----------------------------------------------------------

let noiseCanvas, noiseCtx;

function drawNoise() {
  if (!noiseCanvas || !noiseCtx) return;
  const w = noiseCanvas.width;
  const h = noiseCanvas.height;
  const img = noiseCtx.createImageData(w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() * 255;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = Math.random() * 18;
  }
  noiseCtx.putImageData(img, 0, 0);
}

export function initNoise() {
  noiseCanvas = document.getElementById('noise-overlay');
  if (!noiseCanvas) return;
  noiseCtx = noiseCanvas.getContext('2d');

  function resize() {
    noiseCanvas.width  = window.innerWidth;
    noiseCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  setInterval(drawNoise, 80);
}

// ---- CRT flicker ------------------------------------------------------------

export function scheduleCrtFlicker() {
  const delay = 6000 + Math.random() * 16000;
  setTimeout(() => {
    // Quick opacity dip
    const originalOpacity = document.body.style.opacity || '1';
    document.body.style.opacity = (0.75 + Math.random() * 0.15).toString();
    setTimeout(() => {
      document.body.style.opacity = originalOpacity;
      // Sometimes do a second quick flicker
      if (Math.random() > 0.5) {
        setTimeout(() => {
          document.body.style.opacity = (0.8 + Math.random() * 0.1).toString();
          setTimeout(() => {
            document.body.style.opacity = originalOpacity;
            scheduleCrtFlicker();
          }, 40 + Math.random() * 60);
        }, 80 + Math.random() * 100);
      } else {
        scheduleCrtFlicker();
      }
    }, 50 + Math.random() * 80);
  }, delay);
}

// ---- Scroll observer --------------------------------------------------------

export function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // Corrupted text — decipher on scroll
      if (el.classList.contains('corrupted-text') && !el.dataset.deciphering) {
        decipherText(el);
      }

      // Skill bars — start fill animation
      if (el.classList.contains('skill-bar-fill')) {
        el.classList.add('running');
      }

      // Skill items — fade in
      if (el.classList.contains('skill-item')) {
        el.classList.add('animate-in');
      }

      // Section titles — slide up
      if (el.classList.contains('section-title')) {
        el.classList.add('animate-in');
      }

      // About bio paragraphs
      if (el.classList.contains('about-bio-p')) {
        el.classList.add('animate-in');
      }

      // ASCII art
      if (el.classList.contains('ascii-art')) {
        el.classList.add('animate-in');
      }

      // Project cards
      if (el.classList.contains('project-card')) {
        el.classList.add('animate-in');
      }

      // Contact info
      if (el.classList.contains('contact-info-p')) {
        el.classList.add('animate-in');
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.25 });

  // Observe all animatable elements
  const selectors = [
    '.corrupted-text',
    '.skill-bar-fill',
    '.skill-item',
    '.section-title',
    '.about-bio p',
    '.ascii-art',
    '.project-card',
    '.contact-info p',
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      // Add helper classes for about bio and contact
      if (sel === '.about-bio p') el.classList.add('about-bio-p');
      if (sel === '.contact-info p') el.classList.add('contact-info-p');
      observer.observe(el);
    });
  });
}

// ---- Matrix opacity based on scroll -----------------------------------------

export function initScrollMatrixFade() {
  const canvas = document.getElementById('matrix-rain');
  if (!canvas) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const ratio = Math.max(0, 1 - scrollY / (heroHeight * 0.7));
      canvas.style.opacity = (ratio * 0.12).toString();
      ticking = false;
    });
  });
}

// ---- Scroll spy for nav active state ----------------------------------------

export function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#topnav .nav-links a');

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => spy.observe(s));
}
