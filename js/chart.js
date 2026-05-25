import { dom } from './dom.js';
import { state } from './state.js';

export function drawChart() {
  const canvas = dom.resultChart;
  if (!canvas) return;

  const data = state.wordPerformance;
  if (data.length < 2) return;

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

  const colors = {
    line: '#8b6cff',
    lineLight: '#a78bfa',
    fillTop: 'rgba(139, 108, 255, 0.28)',
    fillBot: 'rgba(139, 108, 255, 0.03)',
    error: '#ff5c72',
    errorGlow: 'rgba(255, 92, 114, 0.35)',
    grid: 'rgba(255, 255, 255, 0.06)',
    axisLine: 'rgba(255, 255, 255, 0.1)',
    label: 'rgba(255, 255, 255, 0.35)',
    labelDim: 'rgba(255, 255, 255, 0.2)',
  };

  const pad = { top: 20, right: 20, bottom: 36, left: 52 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  const wpmValues = data.map(d => d.wpm);
  const rawMax = Math.max(...wpmValues, 10);
  const yMax = Math.ceil(rawMax / 20) * 20 + 20;
  const yMin = 0;
  const maxTime = Math.max(Math.ceil(data[data.length - 1].time), 1);

  function xPos(time) { return pad.left + (time / maxTime) * cw; }
  function yPos(wpm) { return pad.top + ch - ((wpm - yMin) / (yMax - yMin)) * ch; }

  const points = data.map(d => ({ x: xPos(d.time), y: yPos(d.wpm), correct: d.correct }));

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

  function drawStatic() {
    ctx.clearRect(0, 0, w, h);

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

    ctx.save();
    ctx.translate(12, pad.top + ch / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = colors.labelDim;
    ctx.font = '600 8px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('KATA PER MENIT', 0, 0);
    ctx.restore();

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

    ctx.strokeStyle = colors.axisLine;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top + ch);
    ctx.lineTo(w - pad.right, pad.top + ch);
    ctx.stroke();
  }

  function drawAnimated(progress) {
    const visibleCount = progress * (points.length - 1);
    const lastFullIdx = Math.floor(visibleCount);
    const partialT = visibleCount - lastFullIdx;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i <= lastFullIdx && i < points.length; i++) {
      const cpx = (points[i - 1].x + points[i].x) / 2;
      ctx.bezierCurveTo(cpx, points[i - 1].y, cpx, points[i].y, points[i].x, points[i].y);
    }

    if (lastFullIdx < points.length - 1 && partialT > 0) {
      const prev = points[lastFullIdx];
      const next = points[lastFullIdx + 1];
      const interpX = prev.x + (next.x - prev.x) * partialT;
      const interpY = prev.y + (next.y - prev.y) * partialT;
      const cpx = (prev.x + interpX) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, interpY, interpX, interpY);
    }

    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

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

    const errorY = pad.top + ch - 6;
    for (let i = 0; i <= lastFullIdx && i < points.length; i++) {
      const p = points[i];

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

  const animDuration = 1500;
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
