/**
 * terminal.js — Interactive Easter egg terminal
 * Toggled by backtick key or the >_ button.
 * Supports command history (up/down arrows).
 */

import { toggleMatrix } from './matrix.js';

const COMMANDS = {
  help: {
    desc: 'List available commands',
    run: () => [
      { text: '┌─ AVAILABLE COMMANDS ─────────────────────────┐', cls: 'dim' },
      { text: '│  help        — show this message              │', cls: 'dim' },
      { text: '│  about       — who is Miguel Jesus            │', cls: 'dim' },
      { text: '│  skills      — list technical skills          │', cls: 'dim' },
      { text: '│  projects    — list projects                  │', cls: 'dim' },
      { text: '│  contact     — get contact info               │', cls: 'dim' },
      { text: '│  whoami      — identify visitor               │', cls: 'dim' },
      { text: '│  ls          — list directory contents        │', cls: 'dim' },
      { text: '│  cat readme  — read README.txt                │', cls: 'dim' },
      { text: '│  matrix      — toggle matrix rain             │', cls: 'dim' },
      { text: '│  sudo rm -rf — you sure about that?           │', cls: 'dim' },
      { text: '│  clear       — clear terminal output          │', cls: 'dim' },
      { text: '│  exit        — close terminal                 │', cls: 'dim' },
      { text: '└───────────────────────────────────────────────┘', cls: 'dim' },
    ]
  },

  about: {
    desc: 'About Miguel Jesus',
    run: () => [
      { text: '// PROFILE LOADED', cls: 'info' },
      { text: 'NAME     : Miguel Jesus', cls: '' },
      { text: 'ROLE     : Full Stack Developer', cls: '' },
      { text: 'LOCATION : [REDACTED]', cls: '' },
      { text: 'YEARS    : X years of experience', cls: '' },
      { text: 'STATUS   : Available for hire', cls: 'cmd' },
      { text: '', cls: '' },
      { text: 'BIO      : Passionate developer who builds things', cls: '' },
      { text: '           that actually work. Loves clean code,', cls: '' },
      { text: '           dark themes, and coffee. Lots of coffee.', cls: '' },
    ]
  },

  skills: {
    desc: 'Technical skills',
    run: () => {
      const makeBar = (pct) => {
        const filled = Math.round(pct / 5);
        const empty = 20 - filled;
        return '█'.repeat(filled) + '░'.repeat(empty);
      };
      return [
        { text: '// SKILL_MATRIX.json', cls: 'info' },
        { text: `JAVASCRIPT       ${makeBar(63)}  63%`, cls: '' },
        { text: `LARAVEL          ${makeBar(55)}  55%`, cls: '' },
        { text: `HTML/CSS         ${makeBar(65)}  65%`, cls: '' },
        { text: `SQL              ${makeBar(52)}  52%`, cls: '' },
        { text: `WORDPRESS        ${makeBar(85)}  85%`, cls: '' },
        { text: `WOOCOMMERCE      ${makeBar(70)}  70%`, cls: '' },
        { text: `CLAUDE CODE      ${makeBar(65)}  65%`, cls: '' },
        { text: `WINDOWS SERVER   ${makeBar(60)}  60%`, cls: '' },
        { text: `PRTG             ${makeBar(30)}  30%`, cls: '' },
      ];
    }
  },

  projects: {
    desc: 'List projects',
    run: () => [
      { text: '// PROJECTS_INDEX', cls: 'info' },
      { text: '', cls: '' },
      { text: '[01] Riddle Games        ● ONLINE', cls: 'cmd' },
      { text: '     Full-stack web app — React + Node.js + MongoDB', cls: '' },
      { text: '', cls: '' },
      { text: '[02] Global Elite        ● ONLINE', cls: 'cmd' },
      { text: '     CLI tool — Python + Docker', cls: '' },
      { text: '', cls: '' },
      { text: '[03] PROJECT_GAMMA       ◌ WIP', cls: 'warn' },
      { text: '     Machine learning pipeline — TensorFlow', cls: '' },
    ]
  },

  contact: {
    desc: 'Contact information',
    run: () => [
      { text: '// CONTACT_ENDPOINTS', cls: 'info' },
      { text: 'EMAIL    : user@domain.com', cls: '' },
      { text: 'GITHUB   : github.com/MIGUEL_JESUS', cls: '' },
      { text: 'LINKEDIN : linkedin.com/in/MIGUEL_JESUS', cls: '' },
      { text: '', cls: '' },
      { text: '> STATUS: WORKING IN PROGRESS', cls: 'cmd' },
    ]
  },

  whoami: {
    desc: 'Identify current user',
    run: () => [
      { text: 'visitor@unknown-host', cls: '' },
      { text: 'uid=1337(visitor) gid=0(visitors)', cls: 'dim' },
      { text: '[WARNING] Unauthorized access detected and logged.', cls: 'warn' },
      { text: '[INFO]    Just kidding. Welcome! :)', cls: 'info' },
    ]
  },

  ls: {
    desc: 'List directory',
    run: () => [
      { text: 'total 42', cls: 'dim' },
      { text: 'drwxr-xr-x  portfolio/', cls: '' },
      { text: 'drwxr-xr-x  secrets/', cls: 'warn' },
      { text: 'drwxr-xr-x  projects/', cls: '' },
      { text: '-rw-r--r--  README.txt', cls: '' },
      { text: '-rwxr-xr-x  reality.exe', cls: 'cmd' },
      { text: '-rw-------  .bash_history   [CLASSIFIED]', cls: 'warn' },
      { text: '-rw-------  .env            [ENCRYPTED]', cls: 'warn' },
    ]
  },

  'cat readme': {
    desc: 'Read README',
    run: () => [
      { text: '=== README.txt ===================================', cls: 'dim' },
      { text: '', cls: '' },
      { text: 'This portfolio was built by MIGUEL_JESUS.', cls: '' },
      { text: 'It is a living document — expect updates.', cls: '' },
      { text: '', cls: '' },
      { text: 'The terminal you are using right now is', cls: '' },
      { text: 'purely aesthetic and totally pointless.', cls: '' },
      { text: 'Or is it?', cls: 'warn' },
      { text: '', cls: '' },
      { text: '// END OF FILE', cls: 'dim' },
    ]
  },

  matrix: {
    desc: 'Toggle matrix rain',
    run: () => {
      toggleMatrix();
      return [{ text: 'Matrix rain toggled.', cls: 'info' }];
    }
  },

  'sudo rm -rf': {
    desc: 'Dangerous command',
    run: () => {
      document.body.classList.add('page-glitch');
      setTimeout(() => document.body.classList.remove('page-glitch'), 1500);
      return [
        { text: 'sudo: rm -rf: command requires authentication', cls: 'err' },
        { text: '[ALERT] Intrusion attempt logged. Nice try.', cls: 'warn' },
        { text: 'Initiating countermeasures...', cls: 'err' },
        { text: '...just kidding.', cls: 'dim' },
      ];
    }
  },

  clear: {
    desc: 'Clear terminal',
    run: (outputEl) => {
      if (outputEl) outputEl.innerHTML = '';
      return [];
    }
  },

  exit: {
    desc: 'Close terminal',
    run: () => {
      setTimeout(() => closeTerminal(), 200);
      return [{ text: 'Closing session...', cls: 'dim' }];
    }
  },
};

// ---- State ------------------------------------------------------------------
let history = [];
let historyIdx = -1;
let isOpen = false;

// ---- DOM refs (populated on init) ------------------------------------------
let modal, output, input;

// ---- Helpers ----------------------------------------------------------------

function appendOutput(text, cls = '') {
  if (!output) return;
  const p = document.createElement('p');
  p.className = `t-line${cls ? ' ' + cls : ''}`;
  p.textContent = text;
  output.appendChild(p);
  output.scrollTop = output.scrollHeight;
}

function appendSeparator() {
  const p = document.createElement('p');
  p.className = 't-line separator';
  output.appendChild(p);
}

function openTerminal() {
  if (!modal) return;
  modal.classList.remove('hidden');
  isOpen = true;
  setTimeout(() => input && input.focus(), 50);
}

function closeTerminal() {
  if (!modal) return;
  modal.classList.add('hidden');
  isOpen = false;
}

export function toggleTerminal() {
  isOpen ? closeTerminal() : openTerminal();
}

// ---- Command execution ------------------------------------------------------

function executeCommand(raw) {
  const cmd = raw.trim().toLowerCase();

  appendOutput(`root@portfolio:~$ ${raw}`, 'cmd');

  if (!cmd) return;

  // Push to history (avoid duplicates at top)
  if (history[0] !== raw) history.unshift(raw);
  if (history.length > 50) history.pop();
  historyIdx = -1;

  const handler = COMMANDS[cmd];
  if (handler) {
    const lines = handler.run(output);
    if (lines && lines.length > 0) {
      lines.forEach(l => {
        if (typeof l === 'string') appendOutput(l);
        else appendOutput(l.text, l.cls || '');
      });
    }
  } else {
    appendOutput(`bash: ${raw}: command not found. Type 'help'.`, 'err');
  }

  appendSeparator();
}

// ---- Init -------------------------------------------------------------------

export function initTerminal() {
  modal  = document.getElementById('terminal-modal');
  output = document.getElementById('terminal-output');
  input  = document.getElementById('terminal-input');

  const trigger = document.getElementById('terminal-trigger');
  const close   = document.getElementById('terminal-close');

  if (trigger) trigger.addEventListener('click', toggleTerminal);
  if (close)   close.addEventListener('click', closeTerminal);

  // Backtick key toggle
  document.addEventListener('keydown', (e) => {
    if (e.key === '`') {
      e.preventDefault();
      toggleTerminal();
    }
  });

  // Input handling
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = input.value;
        input.value = '';
        executeCommand(val);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIdx < history.length - 1) {
          historyIdx++;
          input.value = history[historyIdx];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIdx > 0) {
          historyIdx--;
          input.value = history[historyIdx];
        } else {
          historyIdx = -1;
          input.value = '';
        }
      }
    });
  }

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!isOpen) return;
    if (!modal.contains(e.target) && e.target.id !== 'terminal-trigger') {
      closeTerminal();
    }
  });
}
