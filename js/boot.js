/**
 * boot.js — Boot sequence controller
 * Controls the animated terminal boot screen shown on first load.
 */

const BOOT_LINES = [
  { text: 'BIOS v2.4.1 ................ OK',               cls: 'ok',    delay: 60  },
  { text: 'Initializing memory ........ 65536KB OK',        cls: 'ok',    delay: 80  },
  { text: 'Loading kernel modules ...',                     cls: 'dim',   delay: 120 },
  { text: 'Mounting filesystem ......... /dev/sda1 OK',     cls: 'ok',    delay: 70  },
  { text: 'Starting network interface .. eth0 OK',          cls: 'ok',    delay: 90  },
  { text: 'Establishing secure tunnel ..',                  cls: 'dim',   delay: 200 },
  { text: '[WARNING] Unverified certificate detected',      cls: 'warn',  delay: 150 },
  { text: 'Bypassing firewall ......... [##########] DONE', cls: 'ok',    delay: 300 },
  { text: 'Loading user profile: MIGUEL_JESUS ...',            cls: 'dim',   delay: 130 },
  { text: 'Decrypting portfolio data ..',                   cls: 'dim',   delay: 250 },
  { text: '[WARNING] Anomalous patterns detected in CSS',   cls: 'warn',  delay: 100 },
  { text: 'Injecting glitch engine ...... OK',              cls: 'ok',    delay: 180 },
  { text: 'Calibrating reality.exe ...',                    cls: 'dim',   delay: 220 },
  { text: '[ERROR] Sanity check failed — proceeding anyway',cls: 'error', delay: 160 },
  { text: 'Compiling experience layer ..',                  cls: 'dim',   delay: 200 },
  { text: '> ALL SYSTEMS NOMINAL',                          cls: 'ok',    delay: 400 },
  { text: '> WELCOME, VISITOR.',                            cls: 'ok',    delay: 300 },
];

let skipped = false;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function appendLine(text, cls) {
  const log = document.getElementById('boot-log');
  const p = document.createElement('p');
  p.textContent = text;
  if (cls) p.classList.add(cls);
  log.appendChild(p);
  // Auto-scroll to bottom
  log.scrollTop = log.scrollHeight;
}

function updateBar(pct) {
  const bar = document.getElementById('boot-bar');
  if (bar) bar.style.width = pct + '%';
  const status = document.getElementById('boot-status-pct');
  if (status) status.textContent = Math.round(pct) + '%';
}

function exitBoot() {
  const screen = document.getElementById('boot-screen');
  if (!screen) return;

  screen.classList.add('exit');

  screen.addEventListener('animationend', () => {
    screen.remove();

    const content = document.getElementById('site-content');
    if (content) content.classList.remove('hidden');

    // Signal matrix canvas to start
    const matrixCanvas = document.getElementById('matrix-rain');
    if (matrixCanvas) matrixCanvas.dispatchEvent(new Event('matrix-start'));

    // Signal hero to initialize
    document.dispatchEvent(new Event('boot-complete'));
  }, { once: true });
}

function skipBoot() {
  if (skipped) return;
  skipped = true;
  updateBar(100);

  // Flash all remaining lines quickly
  const remaining = BOOT_LINES.slice();
  remaining.forEach(line => appendLine(line.text, line.cls));

  setTimeout(exitBoot, 200);
}

async function startBoot() {
  // Skip on any key or click
  document.addEventListener('keydown', skipBoot, { once: true });
  document.addEventListener('click', skipBoot, { once: true });

  // Auto-skip on mobile after short delay
  if (navigator.maxTouchPoints > 0) {
    setTimeout(skipBoot, 2500);
  }

  for (let i = 0; i < BOOT_LINES.length; i++) {
    if (skipped) break;
    await delay(BOOT_LINES[i].delay);
    if (skipped) break;
    appendLine(BOOT_LINES[i].text, BOOT_LINES[i].cls);
    updateBar(((i + 1) / BOOT_LINES.length) * 100);
  }

  if (!skipped) {
    await delay(700);
    exitBoot();
  }
}

export { startBoot };
