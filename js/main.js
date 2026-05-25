import { dom } from './dom.js';
import { state } from './state.js';
import { applyTheme, updateLiveStats } from './ui.js';
import { highlightKey } from './keyboard.js';
import {
  resetTest, lockFocus, handleTypingInput, submitWordGameMode, endTest,
  startTimer, scrollTextToCurrentLine, focusTrap
} from './engine.js';
import { playTypingSound, setVolume, setSoundProfile, initAudio } from './audio.js';

document.addEventListener('click', () => {
  initAudio();
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

  if ((e.code === 'Space' || e.code === 'Enter') && state.isGameMode && state.isRunning) {
    e.preventDefault();
    submitWordGameMode();
    if (!e.repeat) playTypingSound(e.key);
    highlightKey(e.code, true);
    return;
  }

  if (e.code === 'Space' && state.isGameMode) {
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
      if (!e.repeat) {
        playTypingSound('Backspace'); // Play sound on backspace too
      }
    }
    return;
  }

  if (state.isFinished) return;

  if (e.key.length === 1) {
    handleTypingInput(e.key, e.repeat);
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

dom.themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  applyTheme(currentTheme === 'light' ? 'dark' : 'light');
  dom.themeToggle.blur();
});

// ─── Sound Settings ───
dom.soundSelected.addEventListener('click', (e) => {
  e.stopPropagation();
  dom.soundOptions.classList.toggle('select-hide');
});

dom.soundOptions.addEventListener('click', (e) => {
  if (e.target.closest('.volume-wrapper')) return; // ignore clicks on volume slider
  
  const item = e.target.closest('div');
  if (!item || item.id === 'soundOptions') return;

  const profile = item.dataset.value;
  setSoundProfile(profile);
  localStorage.setItem('soundProfile', profile);
  
  // Update UI text (keep the icon)
  const iconHtml = `<svg class="sound-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="1" y1="1" x2="23" y2="23"></line>
    <path d="M9 9v6a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3v-2"></path>
    <path d="M5 10v4a7 7 0 0 0 14 0v-4"></path>
  </svg>`;
  const activeIconHtml = `<svg class="sound-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>`;
  
  dom.soundSelected.innerHTML = (profile === 'mute' ? iconHtml : activeIconHtml) + ' ' + item.textContent;
  
  dom.soundOptions.querySelectorAll('div[data-value]').forEach(sib => sib.classList.remove('same-as-selected'));
  item.classList.add('same-as-selected');

  dom.soundOptions.classList.add('select-hide');
  
  // Play a demo sound
  playTypingSound();
});

dom.volumeSlider.addEventListener('input', (e) => {
  const vol = parseInt(e.target.value, 10) / 100;
  setVolume(vol);
  localStorage.setItem('soundVolume', e.target.value);
});

dom.volumeSlider.addEventListener('change', () => {
  playTypingSound();
});

document.addEventListener('click', (e) => {
  if (dom.difficultyOptions && !dom.difficultyOptions.classList.contains('select-hide') && !e.target.closest('#difficultyCustomSelect')) {
    dom.difficultyOptions.classList.add('select-hide');
    dom.difficultySelected.classList.remove('select-arrow-active');
  }
  if (dom.soundOptions && !dom.soundOptions.classList.contains('select-hide') && !e.target.closest('#soundCustomSelect')) {
    dom.soundOptions.classList.add('select-hide');
  }
});

function init() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }
  
  // Load sound settings
  const savedVolume = localStorage.getItem('soundVolume');
  if (savedVolume !== null) {
    dom.volumeSlider.value = savedVolume;
    setVolume(parseInt(savedVolume, 10) / 100);
  }
  
  const savedProfile = localStorage.getItem('soundProfile');
  if (savedProfile) {
    const item = dom.soundOptions.querySelector(`div[data-value="${savedProfile}"]`);
    if (item) {
      item.click();
      // Hide immediately since click opens it or modifies it
      dom.soundOptions.classList.add('select-hide');
    }
  }

  resetTest();

  setTimeout(lockFocus, 0);
}

init();
