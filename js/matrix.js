/**
 * matrix.js — Matrix rain canvas effect
 * Renders the classic falling character rain on a fixed background canvas.
 */

const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*<>{}[]|\\/?;:~';

let canvas, ctx, drops, cols, animFrame;
const FONT_SIZE = 14;
const FPS = 30;
const INTERVAL = 1000 / FPS;
let lastTime = 0;

function resize() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  cols  = Math.floor(canvas.width / FONT_SIZE);
  drops = Array.from({ length: cols }, () => Math.random() * -50);
}

function drawFrame(timestamp) {
  animFrame = requestAnimationFrame(drawFrame);
  if (timestamp - lastTime < INTERVAL) return;
  lastTime = timestamp;

  // Fade trail
  ctx.fillStyle = 'rgba(1, 11, 1, 0.06)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${FONT_SIZE}px "Share Tech Mono", monospace`;

  for (let i = 0; i < drops.length; i++) {
    const char = CHARS[Math.floor(Math.random() * CHARS.length)];
    const x = i * FONT_SIZE;
    const y = drops[i] * FONT_SIZE;

    // Lead char is bright white
    if (drops[i] > 0 && drops[i] * FONT_SIZE < canvas.height) {
      const isLead = Math.random() > 0.95;
      if (isLead) {
        ctx.fillStyle = '#ffffff';
      } else {
        const alpha = 0.4 + Math.random() * 0.6;
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
      }
      ctx.fillText(char, x, y);
    }

    // Reset column after it passes the bottom
    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i] += 0.5;
  }
}

function startMatrix() {
  if (!canvas) {
    canvas = document.getElementById('matrix-rain');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
  }
  resize();
  // Clear to dark bg first
  ctx.fillStyle = 'rgba(1, 11, 1, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  animFrame = requestAnimationFrame(drawFrame);
}

function stopMatrix() {
  if (animFrame) cancelAnimationFrame(animFrame);
}

function toggleMatrix() {
  const c = document.getElementById('matrix-rain');
  if (!c) return;
  if (c.style.opacity === '0') {
    c.style.opacity = '0.12';
    if (!animFrame) startMatrix();
  } else {
    c.style.opacity = '0';
  }
}

// Listen for the boot-complete signal
document.addEventListener('DOMContentLoaded', () => {
  const c = document.getElementById('matrix-rain');
  if (c) {
    c.addEventListener('matrix-start', startMatrix, { once: true });
  }
});

window.addEventListener('resize', resize);

export { startMatrix, stopMatrix, toggleMatrix };
