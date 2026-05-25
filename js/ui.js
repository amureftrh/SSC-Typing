import { dom } from './dom.js';
import { state } from './state.js';
import { drawChart } from './chart.js';

export function updateLiveStats() {
  const elapsed = state.startTime ? (Date.now() - state.startTime) / 1000 : 0;
  const minutes = elapsed / 60;
  const wpm = minutes > 0 ? Math.round((state.correctCount / 5) / minutes) : 0;
  const accuracy = state.totalTyped > 0
    ? Math.round((state.correctCount / state.totalTyped) * 100)
    : 100;

  dom.wpmDisplay.textContent = wpm;
  dom.accuracyDisplay.textContent = accuracy + '%';
  dom.charsDisplay.textContent = `${state.correctCount}/${state.totalTyped}`;
}

export function animateValue(el, from, to, duration, suffix = '') {
  const start = performance.now();

  function easeOutExpo(t) {
    return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = easeOutExpo(progress);
    const current = Math.round(from + (to - from) * eased);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  el.textContent = from + suffix;
  requestAnimationFrame(tick);
}

export function flashTimer(type) {
  const el = dom.timerDisplay.closest('.stat-card') || dom.timerDisplay;
  el.classList.remove('timer-flash-correct', 'timer-flash-wrong');
  void el.offsetWidth;
  el.classList.add(type === 'correct' ? 'timer-flash-correct' : 'timer-flash-wrong');
  setTimeout(() => {
    el.classList.remove('timer-flash-correct', 'timer-flash-wrong');
  }, 600);
}

export function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  localStorage.setItem('theme', theme);

  if (state.isFinished && state.wordPerformance && state.wordPerformance.length > 0) {
    if (typeof drawChart === 'function') {
      const ctx = dom.resultChart.getContext('2d');
      ctx.clearRect(0, 0, dom.resultChart.width, dom.resultChart.height);
      drawChart();
    }
  }
}
