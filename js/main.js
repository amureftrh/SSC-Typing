import { dom } from './dom.js';
import { state } from './state.js';
import { applyTheme, updateLiveStats } from './ui.js';
import { highlightKey } from './keyboard.js';
import {
  resetTest, lockFocus, handleTypingInput, submitWordGameMode, endTest,
  startTimer, scrollTextToCurrentLine, focusTrap
} from './engine.js';

document.addEventListener('click', () => {
  setTimeout(lockFocus, 50);
});

window.addEventListener('focus', lockFocus);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) lockFocus();
});

focusTrap.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'Tab' || e.code === 'Backspace') {
    e.preventDefault();
  }

  if (e.code === 'Tab') {
    highlightKey(e.code, true);
    return;
  }

  if (e.code === 'Escape') {
    e.preventDefault();
    if (state.isRunning) {
      endTest();
    } else {
      resetTest();
    }
    return;
  }

  if (e.code === 'Space' && state.isGameMode) {
    return;
  }

  if (e.code === 'Enter' && state.isGameMode && state.isRunning) {
    e.preventDefault();
    submitWordGameMode();
    highlightKey(e.code, true);
    return;
  }

  highlightKey(e.code, true);

  if (['ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight',
    'AltLeft', 'AltRight', 'CapsLock', 'Tab', 'Enter',
    'Backspace', 'Escape', 'Meta'].includes(e.code)) {

    if (e.code === 'Backspace' && state.currentIndex > 0 && state.isRunning) {
      if (state.isGameMode && state.currentIndex <= state.gameWordStart) {
        return;
      }

      state.charElements[state.currentIndex].classList.remove('current');
      state.currentIndex--;

      const prevEl = state.charElements[state.currentIndex];
      if (prevEl.classList.contains('correct')) {
        state.correctCount--;
        state.totalTyped--;
      } else if (prevEl.classList.contains('wrong')) {
        state.wrongCount--;
        state.totalTyped--;
      }

      prevEl.classList.remove('correct', 'wrong');
      prevEl.classList.add('current');

      if (!state.isGameMode) {
        const prevWb = state.wordBoundaries[state.currentWordIndex - 1];
        if (prevWb && state.currentIndex <= prevWb.end) {
          state.currentWordIndex--;
          let hadError = false;
          for (let ci = prevWb.start; ci <= prevWb.end; ci++) {
            if (state.charElements[ci].classList.contains('wrong')) {
              hadError = true;
              break;
            }
          }
          if (hadError) {
            state.wordsWrong--;
          } else {
            state.wordsCorrect--;
          }
          state.currentWordHasError = hadError;
          updateLiveStats();
        }
      }

      scrollTextToCurrentLine();
    }
    return;
  }

  if (state.isFinished) return;

  if (e.key.length === 1) {
    handleTypingInput(e.key);
  }
});

focusTrap.addEventListener('keyup', (e) => {
  highlightKey(e.code, false);
});

dom.timerSelector.addEventListener('click', (e) => {
  const btn = e.target.closest('.timer-btn');
  if (!btn) return;
  setTimeout(() => btn.blur(), 0);

  dom.timerSelector.querySelectorAll('.timer-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  if (btn.dataset.time === 'game') {
    state.isGameMode = true;
    state.duration = 60;
  } else {
    state.isGameMode = false;
    state.duration = parseInt(btn.dataset.time, 10);
  }
  resetTest();
  setTimeout(() => btn.blur(), 0);
});

dom.difficultySelected.addEventListener('click', (e) => {
  e.stopPropagation();
  dom.difficultyOptions.classList.toggle('select-hide');
  dom.difficultySelected.classList.toggle('select-arrow-active');
});

dom.difficultyOptions.addEventListener('click', (e) => {
  const item = e.target.closest('div');
  if (!item) return;

  dom.difficultySelected.innerHTML = item.innerHTML;
  state.difficulty = item.dataset.value;

  dom.difficultyOptions.querySelectorAll('div').forEach(sib => sib.classList.remove('same-as-selected'));
  item.classList.add('same-as-selected');

  dom.difficultyOptions.classList.add('select-hide');
  dom.difficultySelected.classList.remove('select-arrow-active');

  resetTest();
});

dom.langSelector.addEventListener('click', (e) => {
  const btn = e.target.closest('.lang-btn');
  if (!btn) return;
  setTimeout(() => btn.blur(), 0);

  dom.langSelector.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  state.language = btn.dataset.lang;
  resetTest();
  setTimeout(() => btn.blur(), 0);
});

dom.restartBtn.addEventListener('click', () => {
  resetTest();
  setTimeout(() => dom.restartBtn.blur(), 0);
});

document.addEventListener('click', (e) => {
  if (dom.difficultyOptions && !dom.difficultyOptions.classList.contains('select-hide') && !e.target.closest('#difficultyCustomSelect')) {
    dom.difficultyOptions.classList.add('select-hide');
    dom.difficultySelected.classList.remove('select-arrow-active');
  }
});

dom.themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  applyTheme(currentTheme === 'light' ? 'dark' : 'light');
  dom.themeToggle.blur();
});

function init() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }
  resetTest();

  setTimeout(lockFocus, 0);
}

init();
