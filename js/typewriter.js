/**
 * typewriter.js — Reusable Typewriter class
 * Types and erases text with configurable speed and phrases.
 */

export class Typewriter {
  constructor(el, options = {}) {
    this.el          = typeof el === 'string' ? document.querySelector(el) : el;
    this.speed       = options.speed       ?? 80;
    this.deleteSpeed = options.deleteSpeed ?? 40;
    this.pause       = options.pause       ?? 2200;
    this.startDelay  = options.startDelay  ?? 0;
    this.phrases     = options.phrases     ?? [];
    this.loop        = options.loop        ?? true;
    this.cursorEl    = null;
  }

  async start() {
    if (!this.el) return;

    // Insert cursor sibling
    this.cursorEl = document.createElement('span');
    this.cursorEl.className = 'cursor';
    this.cursorEl.textContent = '_';
    this.el.insertAdjacentElement('afterend', this.cursorEl);

    if (this.startDelay) await this._wait(this.startDelay);

    let i = 0;
    do {
      const phrase = this.phrases[i % this.phrases.length];
      await this._type(phrase);
      await this._wait(this.pause);
      if (this.loop || i < this.phrases.length - 1) {
        await this._erase();
        await this._wait(280);
      }
      i++;
    } while (this.loop);
  }

  _type(text) {
    return new Promise(resolve => {
      let j = 0;
      const t = setInterval(() => {
        if (!this.el) { clearInterval(t); resolve(); return; }
        this.el.textContent += text[j++];
        if (j >= text.length) { clearInterval(t); resolve(); }
      }, this.speed);
    });
  }

  _erase() {
    return new Promise(resolve => {
      const t = setInterval(() => {
        if (!this.el) { clearInterval(t); resolve(); return; }
        const txt = this.el.textContent;
        if (!txt.length) { clearInterval(t); resolve(); return; }
        this.el.textContent = txt.slice(0, -1);
      }, this.deleteSpeed);
    });
  }

  _wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  destroy() {
    if (this.cursorEl) this.cursorEl.remove();
  }
}
