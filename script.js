/* ═══════════════════════════════════════════════════════════════
   TypeFlow — Touch Typing Test
   Main Application Logic
   ═══════════════════════════════════════════════════════════════ */

;(function () {
  'use strict';

  // ─── Word Banks (multi-language) ───
  const WORD_BANKS = {
    en: [
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
      'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
      'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
      'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
      'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
      'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
      'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
      'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only',
      'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
      'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new',
      'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
      'great', 'between', 'need', 'large', 'under', 'never', 'city',
      'tree', 'water', 'long', 'find', 'here', 'thing', 'many', 'still',
      'high', 'every', 'name', 'keep', 'should', 'home', 'big', 'hand',
      'life', 'place', 'where', 'next', 'old', 'while', 'last', 'right',
      'start', 'might', 'begin', 'those', 'side', 'same', 'world', 'help',
      'line', 'turn', 'move', 'live', 'real', 'left', 'point', 'read',
      'often', 'run', 'head', 'play', 'small', 'set', 'change', 'off',
      'much', 'before', 'why', 'kind', 'each', 'tell', 'does', 'land',
      'page', 'letter', 'show', 'try', 'close', 'group', 'open', 'own',
      'learn', 'end', 'above', 'below', 'power', 'music', 'paper', 'food',
      'part', 'plant', 'best', 'light', 'story', 'study', 'room', 'young',
      'house', 'table', 'early', 'money', 'three', 'being', 'body', 'state',
      'river', 'south', 'north', 'hard', 'near', 'face', 'form', 'number',
      'again', 'once', 'book', 'sound', 'build', 'along', 'very', 'write',
      'word', 'black', 'white', 'round', 'field', 'class', 'clear', 'rock',
      'force', 'sure', 'done', 'front', 'hold', 'step', 'plan', 'fast',
      'mind', 'dream', 'green', 'earth', 'cover', 'order', 'voice',
      'system', 'level', 'cross', 'spend', 'press', 'fire', 'watch',
      'reach', 'rest', 'speak', 'human', 'space', 'month', 'drive',
      'check', 'stand', 'model', 'woman', 'bring', 'heat', 'warm', 'free',
      'moment', 'happy', 'exist', 'chair', 'fish', 'simple', 'window',
      'strong', 'care', 'final', 'cool', 'dark', 'deep', 'sense', 'ball',
      'train', 'child', 'night', 'heart', 'short', 'piece', 'glass',
      'horse', 'mountain', 'answer', 'travel', 'center', 'half', 'ten',
      'several', 'against', 'during', 'hundred', 'ocean', 'island'
    ],
    id: [
      'dan', 'di', 'yang', 'ini', 'itu', 'dengan', 'untuk', 'pada',
      'adalah', 'dari', 'dalam', 'akan', 'tidak', 'bisa', 'ada', 'juga',
      'saya', 'kita', 'kami', 'mereka', 'dia', 'anda', 'kalian', 'kamu',
      'sudah', 'belum', 'sedang', 'telah', 'masih', 'harus', 'baru',
      'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan',
      'sembilan', 'sepuluh', 'ratus', 'ribu', 'juta', 'pertama', 'kedua',
      'waktu', 'hari', 'bulan', 'tahun', 'pagi', 'siang', 'sore', 'malam',
      'rumah', 'sekolah', 'kantor', 'kota', 'desa', 'jalan', 'pintu',
      'makan', 'minum', 'tidur', 'bangun', 'duduk', 'berdiri', 'jalan',
      'lari', 'baca', 'tulis', 'bicara', 'dengar', 'lihat', 'rasa',
      'besar', 'kecil', 'tinggi', 'rendah', 'panjang', 'pendek', 'lebar',
      'berat', 'ringan', 'cepat', 'lambat', 'banyak', 'sedikit', 'semua',
      'baik', 'buruk', 'bagus', 'indah', 'cantik', 'tampan', 'pintar',
      'bodoh', 'kuat', 'lemah', 'muda', 'tua', 'baru', 'lama', 'dekat',
      'jauh', 'dalam', 'luar', 'atas', 'bawah', 'depan', 'belakang',
      'kanan', 'kiri', 'tengah', 'samping', 'antara', 'sekitar', 'selalu',
      'air', 'api', 'tanah', 'angin', 'hujan', 'panas', 'dingin', 'terang',
      'gelap', 'putih', 'hitam', 'merah', 'biru', 'hijau', 'kuning',
      'orang', 'anak', 'ibu', 'ayah', 'kakak', 'adik', 'teman', 'guru',
      'dokter', 'petani', 'nelayan', 'polisi', 'tentara', 'raja', 'rakyat',
      'negara', 'bangsa', 'dunia', 'tanah', 'laut', 'gunung', 'sungai',
      'hutan', 'pantai', 'pulau', 'danau', 'langit', 'bintang', 'bulan',
      'matahari', 'awan', 'pelangi', 'bunga', 'pohon', 'daun', 'buah',
      'buku', 'kertas', 'pena', 'meja', 'kursi', 'papan', 'komputer',
      'telepon', 'mobil', 'motor', 'kapal', 'pesawat', 'kereta', 'sepeda',
      'uang', 'harga', 'pasar', 'toko', 'beli', 'jual', 'bayar', 'murah',
      'mahal', 'untung', 'rugi', 'kerja', 'usaha', 'hasil', 'sukses',
      'gagal', 'coba', 'mulai', 'selesai', 'berhenti', 'lanjut', 'ulang',
      'tahu', 'pikir', 'ingat', 'lupa', 'belajar', 'ajar', 'latih',
      'bantu', 'tolong', 'terima', 'kasih', 'maaf', 'silakan', 'selamat',
      'senang', 'sedih', 'marah', 'takut', 'berani', 'sabar', 'sayang',
      'cinta', 'rindu', 'harap', 'percaya', 'yakin', 'ragu', 'benar',
      'salah', 'betul', 'tepat', 'pasti', 'mungkin', 'tentu', 'hampir',
      'sangat', 'cukup', 'terlalu', 'kurang', 'lebih', 'paling', 'agak',
      'hanya', 'justru', 'bahkan', 'namun', 'tetapi', 'karena', 'sebab',
      'supaya', 'agar', 'jika', 'kalau', 'ketika', 'sambil', 'setelah',
      'sebelum', 'selama', 'hingga', 'sampai', 'sejak', 'seperti', 'begitu',
      'makanan', 'minuman', 'pakaian', 'sepatu', 'topi', 'cincin', 'kalung',
      'suara', 'musik', 'lagu', 'cerita', 'gambar', 'warna', 'bentuk'
    ]
  };

  // ─── DOM Elements ───
  const dom = {
    textDisplay:     document.getElementById('textDisplay'),
    timerDisplay:    document.getElementById('timerDisplay'),
    wpmDisplay:      document.getElementById('wpmDisplay'),
    accuracyDisplay: document.getElementById('accuracyDisplay'),
    charsDisplay:    document.getElementById('charsDisplay'),
    hintText:        document.getElementById('hintText'),
    // Top Controls
    langSelector:    document.getElementById('langSelector'),
    timerSelector:   document.getElementById('timerSelector'),
    keyboard:        document.getElementById('virtualKeyboard'),
    typingArea:      document.getElementById('typingArea'),
    keyboardSection: document.getElementById('keyboardSection'),
    resultSection:   document.getElementById('resultSection'),
    resultWpm:       document.getElementById('resultWpm'),
    resultAccuracy:  document.getElementById('resultAccuracy'),
    resultCorrect:   document.getElementById('resultCorrect'),
    resultWrong:     document.getElementById('resultWrong'),
    resultTime:      document.getElementById('resultTime'),
    resultChart:     document.getElementById('resultChart'),
    restartBtn:      document.getElementById('restartBtn'),
    difficultyCustomSelect: document.getElementById('difficultyCustomSelect'),
    difficultySelected: document.getElementById('difficultySelected'),
    difficultyOptions: document.getElementById('difficultyOptions'),
    speedBadge:      document.getElementById('speedBadge'),
    themeToggle:     document.getElementById('themeToggle'),
  };

  // ─── State ───
  let state = {
    duration: 30,
    timeLeft: 30,
    timerInterval: null,
    isRunning: false,
    isFinished: false,
    textChars: [],
    charElements: [],
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    totalTyped: 0,
    startTime: null,
    language: 'en',
    fingerMode: 10,
    tabPressed: false,
    // Word-level tracking
    wordsCorrect: 0,
    wordsWrong: 0,
    wordBoundaries: [],
    currentWordHasError: false,
    currentWordIndex: 0,
    // Per-word performance data for chart
    wordPerformance: [],
    // Game mode
    isGameMode: false,
    gameTimeLeft: 60,        // dynamic countdown (in seconds, float)
    gameLastTick: null,      // timestamp for delta-time
    gameWordStart: 0,        // charIndex where current word started typing
    difficulty: 'normal',    // normal, hard, expert, pro
    speedMultiplier: 1,      // dynamic speed multiplier based on errors
  };

  // ─── Key Mapping (physical code → virtual data-key) ───
  const CODE_TO_KEY = {
    'Backquote': '`', 'Digit1': '1', 'Digit2': '2', 'Digit3': '3',
    'Digit4': '4', 'Digit5': '5', 'Digit6': '6', 'Digit7': '7',
    'Digit8': '8', 'Digit9': '9', 'Digit0': '0', 'Minus': '-',
    'Equal': '=', 'Backspace': 'Backspace',
    'Tab': 'Tab',
    'KeyQ': 'q', 'KeyW': 'w', 'KeyE': 'e', 'KeyR': 'r', 'KeyT': 't',
    'KeyY': 'y', 'KeyU': 'u', 'KeyI': 'i', 'KeyO': 'o', 'KeyP': 'p',
    'BracketLeft': '[', 'BracketRight': ']', 'Backslash': '\\',
    'CapsLock': 'CapsLock',
    'KeyA': 'a', 'KeyS': 's', 'KeyD': 'd', 'KeyF': 'f', 'KeyG': 'g',
    'KeyH': 'h', 'KeyJ': 'j', 'KeyK': 'k', 'KeyL': 'l',
    'Semicolon': ';', 'Quote': "'", 'Enter': 'Enter',
    'ShiftLeft': 'ShiftLeft',
    'KeyZ': 'z', 'KeyX': 'x', 'KeyC': 'c', 'KeyV': 'v', 'KeyB': 'b',
    'KeyN': 'n', 'KeyM': 'm',
    'Comma': ',', 'Period': '.', 'Slash': '/',
    'ShiftRight': 'ShiftRight',
    'ControlLeft': 'ControlLeft', 'AltLeft': 'AltLeft',
    'Space': ' ',
    'AltRight': 'AltRight', 'ControlRight': 'ControlRight',
  };

  // Supplementary word lists for restrictive modes (real words only)
  // [FINGER MODES REMOVED]

  // ─── Utility: Generate Random Words ───
  function generateText(wordCount) {
    let bank = WORD_BANKS[state.language];

    // Fallback if bank is too small
    if (bank.length < 5) {
      bank = WORD_BANKS.en; // fallback to english if something goes wrong
    }

    const words = [];
    for (let i = 0; i < wordCount; i++) {
      let word = bank[Math.floor(Math.random() * bank.length)];

      if (state.difficulty !== 'normal') {
        const punctuation = [',', '.', '?', '!', ';', ':', '"', "'"];
        const symbols = ['@', '#', '$', '%', '&', '*', '(', ')', '-', '+', '=', '/', '[', ']'];
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        if (state.difficulty === 'hard') {
          // Hard: 20% punctuation, 20% combined words (longer), 10% capitalized
          if (Math.random() < 0.2) word += punctuation[Math.floor(Math.random() * punctuation.length)];
          if (Math.random() < 0.2) word += bank[Math.floor(Math.random() * bank.length)];
          if (Math.random() < 0.1) word = word.charAt(0).toUpperCase() + word.slice(1);
        } else if (state.difficulty === 'expert') {
          // Expert: 40% punctuation, 40% combined words, 30% capitalized
          if (Math.random() < 0.4) word += punctuation[Math.floor(Math.random() * punctuation.length)];
          if (Math.random() < 0.4) word += bank[Math.floor(Math.random() * bank.length)];
          if (Math.random() < 0.3) word = word.charAt(0).toUpperCase() + word.slice(1);
        } else if (state.difficulty === 'pro') {
          // Pro: Mix of symbols, numbers, punctuation, combinations, and capitalization
          if (Math.random() < 0.4) word += punctuation[Math.floor(Math.random() * punctuation.length)];
          if (Math.random() < 0.4) word += symbols[Math.floor(Math.random() * symbols.length)];
          if (Math.random() < 0.3) word = numbers[Math.floor(Math.random() * numbers.length)] + word;
          if (Math.random() < 0.3) word += bank[Math.floor(Math.random() * bank.length)];
          if (Math.random() < 0.4) word = word.charAt(0).toUpperCase() + word.slice(1);
          // 10% chance to replace a character with a symbol or number
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

  // ─── Render Text ───
  function renderText() {
    // Generate enough words so the user won't run out
    const wordsNeeded = state.isGameMode
      ? 300  // game mode: generate plenty of words
      : Math.ceil(state.duration / 60 * 100) + 40;
    const text = generateText(wordsNeeded);
    state.textChars = text.split('');
    state.charElements = [];
    state.wordBoundaries = [];

    dom.textDisplay.innerHTML = '';

    // Split text into words (keeping spaces as separators)
    const words = text.split(' ');
    let charIndex = 0;

    words.forEach((word, wordIdx) => {
      // Create a word wrapper so the word never breaks across lines
      const wordSpan = document.createElement('span');
      wordSpan.classList.add('word');

      const wordStart = charIndex;

      // Add character spans for each letter in the word
      for (let i = 0; i < word.length; i++) {
        const span = document.createElement('span');
        span.classList.add('char');
        span.textContent = word[i];
        if (charIndex === 0) span.classList.add('current');
        wordSpan.appendChild(span);
        state.charElements.push(span);
        charIndex++;
      }

      // Record word boundary (the word's char indices, excluding the trailing space)
      state.wordBoundaries.push({ start: wordStart, end: charIndex - 1 });

      dom.textDisplay.appendChild(wordSpan);

      // Add space character between words (not after the last word)
      if (wordIdx < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.classList.add('char', 'space-char');
        spaceSpan.textContent = '\u00A0'; // non-breaking space for visibility
        if (charIndex === 0) spaceSpan.classList.add('current');
        dom.textDisplay.appendChild(spaceSpan);
        state.charElements.push(spaceSpan);
        charIndex++;
      }
    });
  }

  // ─── Scroll text display to keep cursor visible ───
  function scrollTextToCurrentLine() {
    const currentEl = state.charElements[state.currentIndex];
    if (!currentEl) return;

    const wrapper = dom.textDisplay.parentElement;
    const wrapperRect = wrapper.getBoundingClientRect();
    const charRect = currentEl.getBoundingClientRect();
    const displayRect = dom.textDisplay.getBoundingClientRect();

    // If the current character is below the visible area
    const relativeTop = charRect.top - displayRect.top;
    const lineHeight = parseFloat(getComputedStyle(dom.textDisplay).lineHeight);
    const maxVisibleTop = wrapperRect.height - lineHeight;

    if (relativeTop > maxVisibleTop) {
      const scrollAmount = relativeTop - lineHeight;
      dom.textDisplay.style.transform = `translateY(-${scrollAmount}px)`;
    }
  }

  // ─── Timer ───
  function startTimer() {
    state.isRunning = true;
    state.startTime = Date.now();
    dom.hintText.classList.add('hidden');

    if (state.isGameMode) {
      // Game mode: real-time countdown with dynamic time
      state.gameLastTick = Date.now();
      state.timerInterval = setInterval(() => {
        const now = Date.now();
        const delta = (now - state.gameLastTick) / 1000;
        state.gameLastTick = now;
        
        // Apply speed multiplier based on errors
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
        // Countdown mode
        state.timeLeft = Math.max(0, state.duration - elapsed);
        dom.timerDisplay.textContent = state.timeLeft;
        updateLiveStats();
        if (state.timeLeft <= 0) {
          endTest();
        }
      }, 200);
    }
  }

  function endTest() {
    clearInterval(state.timerInterval);
    state.isRunning = false;
    state.isFinished = true;
    state.timeLeft = 0;
    dom.timerDisplay.textContent = '0';

    updateLiveStats();
    showResults();
  }

  // ─── Live Stats ───
  function updateLiveStats() {
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

  // ─── Show Results ───
  function showResults() {
    finalizeCurrentWord();

    const elapsed = (Date.now() - state.startTime) / 1000;
    const minutes = elapsed / 60;
    const wpm = minutes > 0 ? Math.round((state.correctCount / 5) / minutes) : 0;
    const accuracy = state.totalTyped > 0
      ? Math.round((state.correctCount / state.totalTyped) * 100)
      : 100;

    // Add final data point for chart so it always reaches the end time
    state.wordPerformance.push({
      wpm: wpm,
      correct: true,
      word: '',
      time: elapsed,
    });

    // Show result section first (so canvas has width)
    dom.typingArea.style.display = 'none';
    dom.keyboardSection.style.display = 'none';
    dom.resultSection.classList.add('visible');

    // Animate all stats from 0 to target
    animateValue(dom.resultWpm, 0, wpm, 1200);
    animateValue(dom.resultAccuracy, 0, accuracy, 1200, '%');
    animateValue(dom.resultCorrect, 0, state.correctCount, 800);
    animateValue(dom.resultWrong, 0, state.wrongCount, 800);
    animateValue(dom.resultTime, 0, Math.round(elapsed), 800, 's');

    // Draw chart after layout is computed
    requestAnimationFrame(() => {
      drawChart();
    });
  }

  // ─── Count-up Animation ───
  function animateValue(el, from, to, duration, suffix) {
    suffix = suffix || '';
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

  // ─── Draw Performance Chart (Animated) ───
  function drawChart() {
    const canvas = dom.resultChart;
    if (!canvas) return;

    const data = state.wordPerformance;
    if (data.length < 2) return;

    // High-DPI support
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = 240;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Color palette
    const colors = {
      line:      '#8b6cff',
      lineLight: '#a78bfa',
      fillTop:   'rgba(139, 108, 255, 0.28)',
      fillBot:   'rgba(139, 108, 255, 0.03)',
      error:     '#ff5c72',
      errorGlow: 'rgba(255, 92, 114, 0.35)',
      grid:      'rgba(255, 255, 255, 0.06)',
      axisLine:  'rgba(255, 255, 255, 0.1)',
      label:     'rgba(255, 255, 255, 0.35)',
      labelDim:  'rgba(255, 255, 255, 0.2)',
    };

    // Chart area
    const pad = { top: 20, right: 20, bottom: 36, left: 52 };
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;

    // Data ranges
    const wpmValues = data.map(d => d.wpm);
    const rawMax = Math.max(...wpmValues, 10);
    const yMax = Math.ceil(rawMax / 20) * 20 + 20;
    const yMin = 0;
    const maxTime = Math.max(Math.ceil(data[data.length - 1].time), 1);

    function xPos(time) { return pad.left + (time / maxTime) * cw; }
    function yPos(wpm)  { return pad.top + ch - ((wpm - yMin) / (yMax - yMin)) * ch; }

    // Pre-compute all point positions
    const points = data.map(d => ({ x: xPos(d.time), y: yPos(d.wpm), correct: d.correct }));

    // Get the point at a fractional index (interpolating between points)
    function getPointAt(frac) {
      const idx = frac * (points.length - 1);
      const i = Math.floor(idx);
      const t = idx - i;
      if (i >= points.length - 1) return points[points.length - 1];
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * t,
        y: points[i].y + (points[i + 1].y - points[i].y) * t,
      };
    }

    // ─── Draw static elements (grid, axes, labels) ───
    function drawStatic() {
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      const gridStep = yMax <= 60 ? 10 : yMax <= 120 ? 20 : yMax <= 200 ? 30 : 40;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      for (let val = 0; val <= yMax; val += gridStep) {
        const y = yPos(val);
        ctx.strokeStyle = colors.grid;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();
        ctx.fillStyle = colors.label;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(val, pad.left - 8, y);
      }
      ctx.setLineDash([]);

      // Y-axis title
      ctx.save();
      ctx.translate(12, pad.top + ch / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = colors.labelDim;
      ctx.font = '600 8px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('KATA PER MENIT', 0, 0);
      ctx.restore();

      // X-axis labels
      const totalSec = maxTime;
      const xStep = totalSec <= 15 ? 1 : totalSec <= 30 ? 2 : totalSec <= 60 ? 5 : 10;
      ctx.fillStyle = colors.label;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      for (let sec = 0; sec <= totalSec; sec += xStep) {
        const x = xPos(sec);
        ctx.fillText(sec, x, pad.top + ch + 8);
        ctx.strokeStyle = colors.axisLine;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, pad.top + ch);
        ctx.lineTo(x, pad.top + ch + 4);
        ctx.stroke();
      }

      // X-axis baseline
      ctx.strokeStyle = colors.axisLine;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, pad.top + ch);
      ctx.lineTo(w - pad.right, pad.top + ch);
      ctx.stroke();
    }

    // ─── Draw animated elements ───
    function drawAnimated(progress) {
      // How many points to show (fractional)
      const visibleCount = progress * (points.length - 1);
      const lastFullIdx = Math.floor(visibleCount);
      const partialT = visibleCount - lastFullIdx;

      // Build the visible path
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i <= lastFullIdx && i < points.length; i++) {
        const cpx = (points[i - 1].x + points[i].x) / 2;
        ctx.bezierCurveTo(cpx, points[i - 1].y, cpx, points[i].y, points[i].x, points[i].y);
      }

      // Partial segment to the interpolated point
      if (lastFullIdx < points.length - 1 && partialT > 0) {
        const prev = points[lastFullIdx];
        const next = points[lastFullIdx + 1];
        const interpX = prev.x + (next.x - prev.x) * partialT;
        const interpY = prev.y + (next.y - prev.y) * partialT;
        const cpx = (prev.x + interpX) / 2;
        ctx.bezierCurveTo(cpx, prev.y, cpx, interpY, interpX, interpY);
      }

      // Stroke
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Fill area
      const endPoint = getPointAt(progress);
      ctx.lineTo(endPoint.x, pad.top + ch);
      ctx.lineTo(points[0].x, pad.top + ch);
      ctx.closePath();

      const areaGrad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
      areaGrad.addColorStop(0, colors.fillTop);
      areaGrad.addColorStop(0.7, 'rgba(139, 108, 255, 0.08)');
      areaGrad.addColorStop(1, colors.fillBot);
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Draw visible dots + errors
      const errorY = pad.top + ch - 6;
      for (let i = 0; i <= lastFullIdx && i < points.length; i++) {
        const p = points[i];

        // Error dot at bottom
        if (!data[i].correct) {
          ctx.beginPath();
          ctx.arc(p.x, errorY, 8, 0, Math.PI * 2);
          ctx.fillStyle = colors.errorGlow;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, errorY, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = colors.error;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, errorY, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.fill();
        }

        // WPM dot on line
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 108, 255, 0.2)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = data[i].correct ? colors.lineLight : colors.error;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      }
    }

    // ─── Animation loop ───
    const animDuration = 1500; // 1.5 seconds
    const animStart = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(now) {
      const timestamp = now || performance.now();
      const rawProgress = Math.min((timestamp - animStart) / animDuration, 1);
      const progress = easeOutCubic(rawProgress);

      drawStatic();
      drawAnimated(progress);

      if (rawProgress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  // ─── Reset / Restart ───
  // ─── Finalize the current word when test ends mid-word ───
  function finalizeCurrentWord() {
    const wb = state.wordBoundaries[state.currentWordIndex];
    if (!wb) return;
    // Only count if we've typed at least the first char of this word
    if (state.currentIndex > wb.start) {
      if (state.currentWordHasError) {
        state.wordsWrong++;
      } else {
        // Partial word (didn't finish all chars) counts as wrong
        if (state.currentIndex <= wb.end) {
          state.wordsWrong++;
        } else {
          state.wordsCorrect++;
        }
      }
    }
  }

  // ─── Flash timer display for game mode feedback ───
  function flashTimer(type) {
    const el = dom.timerDisplay.closest('.stat-card') || dom.timerDisplay;
    el.classList.remove('timer-flash-correct', 'timer-flash-wrong');
    void el.offsetWidth; // trigger reflow for re-animation
    el.classList.add(type === 'correct' ? 'timer-flash-correct' : 'timer-flash-wrong');
    setTimeout(() => {
      el.classList.remove('timer-flash-correct', 'timer-flash-wrong');
    }, 600);
  }

  function resetTest() {
    clearInterval(state.timerInterval);

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
    
    // Add initial data point so the chart has at least one point to draw from
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
    // Show typing area & keyboard, hide result section
    dom.typingArea.style.display = '';
    dom.keyboardSection.style.display = '';
    dom.resultSection.classList.remove('visible');
    dom.textDisplay.style.transform = 'translateY(0)';

    // Cleanup keys
    const allKeys = dom.keyboard.querySelectorAll('.key');
    allKeys.forEach(keyEl => {
      keyEl.classList.remove('dimmed', 'zone-active', 'active');
    });

    renderText();
  }

  // Finger zone visualization removed

  // ─── Virtual Keyboard Highlight ───
  function highlightKey(code, isDown) {
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

  // ─── Handle Typing Input ───
  function handleTypingInput(key) {
    if (state.isFinished) return;

    // Start timer on first keypress
    if (!state.isRunning && !state.isFinished) {
      startTimer();
    }

    // Prevent typing past the end of the current word in game mode
    if (state.isGameMode) {
      const wb = state.wordBoundaries[state.currentWordIndex];
      if (wb && state.currentIndex > wb.end) {
        return; // can't type more characters than the word has
      }
    }

    const expected = state.textChars[state.currentIndex];
    if (expected === undefined) return; // no more text

    // Remove current indicator
    state.charElements[state.currentIndex].classList.remove('current');

    if (key === expected) {
      state.charElements[state.currentIndex].classList.add('correct');
      state.correctCount++;
    } else {
      state.charElements[state.currentIndex].classList.add('wrong');
      state.wrongCount++;
      state.currentWordHasError = true;
    }

    state.totalTyped++;
    state.currentIndex++;

    // Check if we just completed a word (moved past its last char onto a space or next word)
    // Only auto-completes in normal mode
    if (!state.isGameMode) {
      const wb = state.wordBoundaries[state.currentWordIndex];
      if (wb && state.currentIndex > wb.end) {
        const isCorrect = !state.currentWordHasError;
        if (state.currentWordHasError) {
          state.wordsWrong++;
        } else {
          state.wordsCorrect++;
        }

        // Record per-word performance for the chart
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

    // Set new current
    if (state.currentIndex < state.charElements.length) {
      state.charElements[state.currentIndex].classList.add('current');
      scrollTextToCurrentLine();
    } else {
      // Ran out of text, generate more (unlikely with large word count)
      endTest();
    }
  }

  // ─── Submit Word in Game Mode (On Enter) ───
  function submitWordGameMode() {
    if (state.isFinished || !state.isRunning) return;

    const wb = state.wordBoundaries[state.currentWordIndex];
    if (!wb) return;

    let isCorrect = true;
    let wrongChars = 0;

    // Check characters from wb.start to wb.end
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
        // Untyped character: mark as wrong
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

    // Update speed multiplier based on wrong words (increases by 0.15 per wrong word)
    state.speedMultiplier = 1 + (state.wordsWrong * 0.15);
    
    // Update speed badge UI
    if (state.speedMultiplier > 1) {
      dom.speedBadge.classList.remove('hidden');
      dom.speedBadge.textContent = `${state.speedMultiplier.toFixed(2)}x`;
      // add a small animation reset
      dom.speedBadge.style.animation = 'none';
      void dom.speedBadge.offsetWidth;
      dom.speedBadge.style.animation = 'pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    } else {
      dom.speedBadge.classList.add('hidden');
    }

    // Record per-word performance for the chart
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

    // Mark the space character after the word as correct/completed visually
    const spaceIndex = wb.end + 1;
    if (state.charElements[spaceIndex]) {
      state.charElements[spaceIndex].classList.remove('current');
      state.charElements[spaceIndex].classList.add('correct');
    }

    // Clean up current styling
    if (state.charElements[state.currentIndex]) {
      state.charElements[state.currentIndex].classList.remove('current');
    }

    // Move to next word
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

  // ─── Keyboard Event Listeners ───
  document.addEventListener('keydown', (e) => {
    // Prevent default for space, tab to avoid page scrolling
    if (e.code === 'Space' || e.code === 'Tab') {
      e.preventDefault();
    }

    // Tab+Enter restart shortcut
    if (e.code === 'Tab') {
      state.tabPressed = true;
      highlightKey(e.code, true);
      return;
    }

    if (e.code === 'Enter' && state.tabPressed) {
      resetTest();
      highlightKey(e.code, true);
      return;
    }

    // Game mode: ignore Space key completely
    if (e.code === 'Space' && state.isGameMode) {
      return;
    }

    // Game mode: Enter key submits the word
    if (e.code === 'Enter' && state.isGameMode && state.isRunning) {
      e.preventDefault();
      submitWordGameMode();
      highlightKey(e.code, true);
      return;
    }

    // Escape key: end test and show results (especially useful for unlimited mode)
    if (e.code === 'Escape' && state.isRunning) {
      e.preventDefault();
      endTest();
      return;
    }

    // Highlight virtual key
    highlightKey(e.code, true);

    // Don't process modifier keys, functional keys as typing input
    if (['ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight',
         'AltLeft', 'AltRight', 'CapsLock', 'Tab', 'Enter',
         'Backspace', 'Escape', 'Meta'].includes(e.code)) {

      // Handle backspace
      if (e.code === 'Backspace' && state.currentIndex > 0 && state.isRunning) {
        // Game mode: can't backspace past current word start
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

        // Normal mode: allow backspacing into previous words
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

    // If result overlay is showing, ignore typing
    if (state.isFinished) return;

    // Only accept printable single characters
    if (e.key.length === 1) {
      handleTypingInput(e.key);
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'Tab') {
      state.tabPressed = false;
    }
    highlightKey(e.code, false);
  });

  // ─── Timer Selector ───
  dom.timerSelector.addEventListener('click', (e) => {
    const btn = e.target.closest('.timer-btn');
    if (!btn) return;

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
  });

  // ─── Custom Difficulty Dropdown ───
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

  // ─── Language Selector ───
  dom.langSelector.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;

    dom.langSelector.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    state.language = btn.dataset.lang;
    resetTest();
  });

  // ─── Restart Button ───
  dom.restartBtn.addEventListener('click', () => {
    resetTest();
  });



  // ─── Focus Management ───
  // Keep focus on the document so keystrokes are captured
  // and close custom dropdowns if clicked outside
  document.addEventListener('click', (e) => {
    // Don't steal focus from buttons
    if (dom.difficultyOptions && !dom.difficultyOptions.classList.contains('select-hide') && !e.target.closest('#difficultyCustomSelect')) {
      dom.difficultyOptions.classList.add('select-hide');
      dom.difficultySelected.classList.remove('select-arrow-active');
    }
  });

  // ─── Theme Toggle ───
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
    
    // Redraw chart if test is finished so colors update
    if (state.isFinished && state.wordPerformance && state.wordPerformance.length > 0) {
      // Need to re-trigger chart drawing with updated CSS variable colors
      if (typeof drawChart === 'function') {
        const ctx = dom.resultChart.getContext('2d');
        ctx.clearRect(0, 0, dom.resultChart.width, dom.resultChart.height);
        drawChart(state.wordPerformance);
      }
    }
  }

  dom.themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    dom.themeToggle.blur();
  });

  // ─── Initialize ───
  function init() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      applyTheme('light');
    }
    resetTest();
  }

  init();
})();
