import { dom } from './dom.js';
import { CODE_TO_KEY } from './data.js';

export function highlightKey(code, isDown) {
  const dataKey = CODE_TO_KEY[code];
  if (!dataKey) return;

  const keyEl = dom.keyboard.querySelector(`.key[data-key="${CSS.escape(dataKey)}"]`);
  if (!keyEl) return;

  if (isDown) {
    keyEl.classList.add('active');
  } else {
    keyEl.classList.remove('active');
  }
}
