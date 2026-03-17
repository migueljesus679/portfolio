/**
 * glitch.js — Glitch text effects
 *
 * 1. Corrupted text decipher: elements with [data-plain] start scrambled
 *    and reveal their real text character-by-character on trigger.
 * 2. Random glitch bursts: periodically adds .intense to .glitch elements.
 * 3. Click/tap glitch particles: scatter particles from clicked .glitch elements.
 */

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#@$%&|~;:01ABCDEFabcdef█▓▒░';

// ---- Corrupted text decipher ------------------------------------------------

export function decipherText(el) {
  const plain = el.dataset.plain;
  if (!plain) return;

  let iteration = 0;
  const total = plain.length * 4; // 4 passes per character

  el.dataset.deciphering = 'true';

  const interval = setInterval(() => {
    el.textContent = plain
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i < Math.floor(iteration / 4)) return char;
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      })
      .join('');

    iteration++;
    if (iteration > total) {
      el.textContent = plain;
      clearInterval(interval);
      delete el.dataset.deciphering;
    }
  }, 28);
}

// ---- Random glitch bursts ---------------------------------------------------

let glitchTimer = null;

export function startRandomGlitch() {
  function trigger() {
    const elements = document.querySelectorAll('.glitch');
    if (elements.length === 0) {
      glitchTimer = setTimeout(trigger, 4000);
      return;
    }
    const el = elements[Math.floor(Math.random() * elements.length)];
    el.classList.add('intense');
    setTimeout(() => el.classList.remove('intense'), 250 + Math.random() * 200);

    // Schedule next
    glitchTimer = setTimeout(trigger, 3000 + Math.random() * 6000);
  }
  glitchTimer = setTimeout(trigger, 5000 + Math.random() * 3000);
}

export function stopRandomGlitch() {
  if (glitchTimer) clearTimeout(glitchTimer);
}

// ---- Click particles --------------------------------------------------------

export function spawnParticles(x, y, count = 12) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'glitch-particle';

    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist  = 40 + Math.random() * 80;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist;

    const colors = ['#00ff41', '#00d4ff', '#ff003c', '#ffd700'];
    const color  = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      background: ${color};
      box-shadow: 0 0 4px ${color};
      --tx: ${tx}px;
      --ty: ${ty}px;
    `;

    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove(), { once: true });
  }
}

// ---- Init -------------------------------------------------------------------

export function initGlitch() {
  // Attach click/tap handler to all .glitch elements
  document.querySelectorAll('.glitch').forEach(el => {
    el.addEventListener('click', (e) => {
      el.classList.add('intense');
      setTimeout(() => el.classList.remove('intense'), 300);
      spawnParticles(e.clientX, e.clientY);
    });
  });
}
