import { state } from './state.js';
import { dom } from './dom.js';
import { WORD_BANKS } from './data.js';
import { drawChart } from './chart.js';
import { updateLiveStats, animateValue, flashTimer } from './ui.js';
import { highlightKey } from './keyboard.js';
import { playTypingSound } from './audio.js';

export function generateText(wordCount) {
  let bank = WORD_BANKS[state.language];

  if (bank.length < 5) {
    bank = WORD_BANKS.en;
  }

  const words = [];
  for (let i = 0; i < wordCount; i++) {
    let word = bank[Math.floor(Math.random() * bank.length)];

    if (state.difficulty !== 'normal') {
      const punctuation = [',', '.', '?', '!', ';', ':', '"', "'"];
      const symbols = ['@', '#', '$', '%', '&', '*', '(', ')', '-', '+', '=', '/', '[', ']'];
      const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

      if (state.difficulty === 'hard') {
        if (Math.random() < 0.2) word += punctuation[Math.floor(Math.random() * punctuation.length)];
        if (Math.random() < 0.2) word += bank[Math.floor(Math.random() * bank.length)];
        if (Math.random() < 0.1) word = word.charAt(0).toUpperCase() + word.slice(1);
      } else if (state.difficulty === 'expert') {
        if (Math.random() < 0.4) word += punctuation[Math.floor(Math.random() * punctuation.length)];
        if (Math.random() < 0.4) word += bank[Math.floor(Math.random() * bank.length)];
        if (Math.random() < 0.3) word = word.charAt(0).toUpperCase() + word.slice(1);
      } else if (state.difficulty === 'pro') {
        if (Math.random() < 0.4) word += punctuation[Math.floor(Math.random() * punctuation.length)];
        if (Math.random() < 0.4) word += symbols[Math.floor(Math.random() * symbols.length)];
        if (Math.random() < 0.3) word = numbers[Math.floor(Math.random() * numbers.length)] + word;
        if (Math.random() < 0.3) word += bank[Math.floor(Math.random() * bank.length)];
        if (Math.random() < 0.4) word = word.charAt(0).toUpperCase() + word.slice(1);

        if (Math.random() < 0.1 && word.length > 2) {
          const idx = Math.floor(Math.random() * (word.length - 1)) + 1;
          const repl = Math.random() < 0.5 ? symbols[Math.floor(Math.random() * symbols.length)] : numbers[Math.floor(Math.random() * numbers.length)];
          word = word.substring(0, idx) + repl + word.substring(idx + 1);
        }
      }
    }
    words.push(word);
  }
  return words.join(' ');
}

export function renderText() {
  const wordsNeeded = state.isGameMode
    ? 300
    : Math.ceil(state.duration / 60 * 100) + 40;
  const text = generateText(wordsNeeded);
  state.textChars = text.split('');
  state.charElements = [];
  state.wordBoundaries = [];

  dom.textDisplay.innerHTML = '';

  const words = text.split(' ');
  let charIndex = 0;

  words.forEach((word, wordIdx) => {
    const wordSpan = document.createElement('span');
    wordSpan.classList.add('word');
    const wordStart = charIndex;

    for (let i = 0; i < word.length; i++) {
      const span = document.createElement('span');
      span.classList.add('char');
      span.textContent = word[i];
      if (charIndex === 0) span.classList.add('current');
      wordSpan.appendChild(span);
      state.charElements.push(span);
      charIndex++;
    }

    state.wordBoundaries.push({ start: wordStart, end: charIndex - 1 });
    dom.textDisplay.appendChild(wordSpan);

    if (wordIdx < words.length - 1) {
      const spaceSpan = document.createElement('span');
      spaceSpan.classList.add('char', 'space-char');
      spaceSpan.textContent = ' ';
      if (charIndex === 0) spaceSpan.classList.add('current');
      dom.textDisplay.appendChild(spaceSpan);
      state.charElements.push(spaceSpan);
      charIndex++;
    }
  });

  dom.textDisplay.style.transform = 'translateY(0)';
  requestAnimationFrame(() => {
    scrollTextToCurrentLine();
  });
}

export function scrollTextToCurrentLine() {
  const currentEl = state.charElements[state.currentIndex];
  if (!currentEl) return;

  const lineHeight = parseFloat(getComputedStyle(dom.textDisplay).lineHeight);
  const displayRect = dom.textDisplay.getBoundingClientRect();
  const charRect = currentEl.getBoundingClientRect();
  const charTopAbsolute = charRect.top - displayRect.top;

  const charRow = Math.round(charTopAbsolute / lineHeight);
  const targetOffset = charRow >= 2 ? (charRow - 1) * lineHeight : 0;

  const currentTransform = new DOMMatrix(getComputedStyle(dom.textDisplay).transform);
  const currentOffset = -currentTransform.m42;

  if (Math.abs(targetOffset - currentOffset) > 2) {
    dom.textDisplay.style.transform = `translateY(-${targetOffset}px)`;
  }
}

export function startTimer() {
  state.isRunning = true;
  state.startTime = Date.now();
  dom.hintText.classList.add('hidden');

  if (state.isGameMode) {
    state.gameLastTick = Date.now();
    state.timerInterval = setInterval(() => {
      const now = Date.now();
      const delta = (now - state.gameLastTick) / 1000;
      state.gameLastTick = now;
      const effectiveDelta = delta * state.speedMultiplier;

      state.gameTimeLeft = Math.max(0, state.gameTimeLeft - effectiveDelta);
      state.timeLeft = Math.ceil(state.gameTimeLeft);
      dom.timerDisplay.textContent = state.timeLeft;
      updateLiveStats();
      if (state.gameTimeLeft <= 0) {
        endTest();
      }
    }, 100);
  } else {
    state.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      state.timeLeft = Math.max(0, state.duration - elapsed);
      dom.timerDisplay.textContent = state.timeLeft;
      updateLiveStats();
      if (state.timeLeft <= 0) {
        endTest();
      }
    }, 200);
  }
}

export function endTest() {
  if (state.isFinished) return;
  
  clearInterval(state.timerInterval);
  state.isRunning = false;
  state.isFinished = true;
  state.timeLeft = 0;
  dom.timerDisplay.textContent = '0';

  updateLiveStats();
  showResults();
}

export function showResults() {
  finalizeCurrentWord();

  const elapsed = (Date.now() - state.startTime) / 1000;
  const minutes = elapsed / 60;
  const wpm = minutes > 0 ? Math.round((state.correctCount / 5) / minutes) : 0;
  const accuracy = state.totalTyped > 0
    ? Math.round((state.correctCount / state.totalTyped) * 100)
    : 100;

  state.wordPerformance.push({
    wpm: wpm,
    correct: true,
    word: '',
    time: elapsed,
  });

  dom.typingArea.style.display = 'none';
  dom.keyboardSection.style.display = 'none';
  dom.resultSection.classList.add('visible');

  animateValue(dom.resultWpm, 0, wpm, 1200);
  animateValue(dom.resultAccuracy, 0, accuracy, 1200, '%');
  animateValue(dom.resultCorrect, 0, state.correctCount, 800);
  animateValue(dom.resultWrong, 0, state.wrongCount, 800);
  animateValue(dom.resultTime, 0, Math.round(elapsed), 800, 's');

  setTimeout(() => {
    requestAnimationFrame(() => {
      drawChart();
    });
  }, 50);
}

export function finalizeCurrentWord() {
  const wb = state.wordBoundaries[state.currentWordIndex];
  if (!wb) return;

  if (state.currentIndex > wb.start) {
    if (state.currentWordHasError) {
      state.wordsWrong++;
    } else {
      if (state.currentIndex <= wb.end) {
        state.wordsWrong++;
      } else {
        state.wordsCorrect++;
      }
    }
  }
}

export function resetTest() {
  clearInterval(state.timerInterval);

  setTimeout(() => {
    if (document.activeElement && typeof document.activeElement.blur === 'function' && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  }, 0);

  state.timeLeft = state.duration;
  state.timerInterval = null;
  state.isRunning = false;
  state.isFinished = false;
  state.currentIndex = 0;
  state.correctCount = 0;
  state.wrongCount = 0;
  state.totalTyped = 0;
  state.startTime = null;
  state.wordsCorrect = 0;
  state.wordsWrong = 0;
  state.currentWordHasError = false;
  state.currentWordIndex = 0;

  state.wordPerformance = [{ wpm: 0, correct: true, word: '', time: 0 }];

  state.gameTimeLeft = 60;
  state.gameLastTick = null;
  state.gameWordStart = 0;
  state.speedMultiplier = 1;

  dom.timerDisplay.textContent = state.duration;
  dom.wpmDisplay.textContent = '0';
  dom.accuracyDisplay.textContent = '100%';
  dom.charsDisplay.textContent = '0/0';
  dom.speedBadge.classList.add('hidden');
  dom.speedBadge.textContent = '1x';
  dom.hintText.classList.remove('hidden');

  dom.typingArea.style.display = '';
  dom.keyboardSection.style.display = '';
  dom.resultSection.classList.remove('visible');
  dom.textDisplay.style.transform = 'translateY(0)';

  const allKeys = dom.keyboard.querySelectorAll('.key');
  allKeys.forEach(keyEl => {
    keyEl.classList.remove('dimmed', 'zone-active', 'active');
  });

  renderText();
}

export function handleTypingInput(key, isRepeat = false) {
  if (state.isFinished) return;

  if (!state.isRunning && !state.isFinished) {
    startTimer();
  }

  if (state.isGameMode) {
    const wb = state.wordBoundaries[state.currentWordIndex];
    if (wb && state.currentIndex > wb.end) {
      return;
    }
  }

  const expected = state.textChars[state.currentIndex];
  if (expected === undefined) return;

  state.charElements[state.currentIndex].classList.remove('current');

  if (key === expected) {
    state.charElements[state.currentIndex].classList.add('correct');
    state.correctCount++;
  } else {
    state.charElements[state.currentIndex].classList.add('wrong');
    state.wrongCount++;
    state.currentWordHasError = true;
  }
  
  if (!isRepeat) {
    playTypingSound(key === ' ' ? ' ' : key);
  }

  state.totalTyped++;
  state.currentIndex++;

  if (!state.isGameMode) {
    const wb = state.wordBoundaries[state.currentWordIndex];
    if (wb && state.currentIndex > wb.end) {
      const isCorrect = !state.currentWordHasError;
      if (state.currentWordHasError) {
        state.wordsWrong++;
      } else {
        state.wordsCorrect++;
      }

      const elapsed = (Date.now() - state.startTime) / 1000;
      const mins = elapsed / 60;
      const currentWpm = mins > 0 ? Math.round((state.correctCount / 5) / mins) : 0;
      const wordText = state.textChars.slice(wb.start, wb.end + 1).join('');
      state.wordPerformance.push({
        wpm: currentWpm,
        correct: isCorrect,
        word: wordText,
        time: elapsed,
      });

      state.currentWordIndex++;
      state.currentWordHasError = false;
      updateLiveStats();
    }
  }

  if (state.currentIndex < state.charElements.length) {
    state.charElements[state.currentIndex].classList.add('current');
    scrollTextToCurrentLine();
  } else {
    endTest();
  }
}

export function submitWordGameMode() {
  if (state.isFinished || !state.isRunning) return;

  const wb = state.wordBoundaries[state.currentWordIndex];
  if (!wb) return;

  let isCorrect = true;
  let wrongChars = 0;

  for (let ci = wb.start; ci <= wb.end; ci++) {
    const charEl = state.charElements[ci];
    if (!charEl) {
      isCorrect = false;
      wrongChars++;
      continue;
    }

    if (charEl.classList.contains('wrong')) {
      isCorrect = false;
      wrongChars++;
    } else if (!charEl.classList.contains('correct')) {
      charEl.classList.add('wrong');
      isCorrect = false;
      wrongChars++;
      state.wrongCount++;
      state.totalTyped++;
    }
  }

  if (isCorrect) {
    state.wordsCorrect++;
    state.gameTimeLeft += 3;
    flashTimer('correct');
  } else {
    state.wordsWrong++;
    state.gameTimeLeft = Math.max(0, state.gameTimeLeft - wrongChars);
    flashTimer('wrong');
    if (state.gameTimeLeft <= 0) {
      endTest();
      return;
    }
  }

  state.speedMultiplier = 1 + (state.wordsWrong * 0.40);

  if (state.speedMultiplier > 1) {
    dom.speedBadge.classList.remove('hidden');
    dom.speedBadge.textContent = `${state.speedMultiplier.toFixed(2)}x`;
    dom.speedBadge.style.animation = 'none';
    void dom.speedBadge.offsetWidth;
    dom.speedBadge.style.animation = 'pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  } else {
    dom.speedBadge.classList.add('hidden');
  }

  const elapsed = (Date.now() - state.startTime) / 1000;
  const mins = elapsed / 60;
  const currentWpm = mins > 0 ? Math.round((state.correctCount / 5) / mins) : 0;
  const wordText = state.textChars.slice(wb.start, wb.end + 1).join('');
  state.wordPerformance.push({
    wpm: currentWpm,
    correct: isCorrect,
    word: wordText,
    time: elapsed,
  });

  const spaceIndex = wb.end + 1;
  if (state.charElements[spaceIndex]) {
    state.charElements[spaceIndex].classList.remove('current');
    state.charElements[spaceIndex].classList.add('correct');
  }

  if (state.charElements[state.currentIndex]) {
    state.charElements[state.currentIndex].classList.remove('current');
  }

  state.currentWordIndex++;
  const nextWb = state.wordBoundaries[state.currentWordIndex];
  if (nextWb) {
    state.currentIndex = nextWb.start;
    state.gameWordStart = nextWb.start;
    state.charElements[state.currentIndex].classList.add('current');
    state.currentWordHasError = false;
    scrollTextToCurrentLine();
  } else {
    endTest();
  }

  dom.timerDisplay.textContent = Math.ceil(state.gameTimeLeft);
  updateLiveStats();
}

export const focusTrap = document.createElement('input');
focusTrap.setAttribute('type', 'text');
focusTrap.setAttribute('autocomplete', 'off');
focusTrap.setAttribute('autocorrect', 'off');
focusTrap.setAttribute('autocapitalize', 'off');
focusTrap.setAttribute('spellcheck', 'false');
focusTrap.setAttribute('aria-hidden', 'true');
focusTrap.setAttribute('tabindex', '-1');
focusTrap.style.cssText = [
  'position:fixed',
  'top:-9999px',
  'left:-9999px',
  'width:1px',
  'height:1px',
  'opacity:0',
  'pointer-events:none',
  'border:none',
  'outline:none',
  'background:transparent',
  'color:transparent',
  'caret-color:transparent',
].join(';');
document.body.appendChild(focusTrap);

export function lockFocus() {
  if (document.activeElement !== focusTrap) {
    focusTrap.focus({ preventScroll: true });
  }
  focusTrap.value = '';
}
