const UI = {
  ro: { eyebrow: 'Rețete autentice', title: 'Rețetar Autentic', sub: 'Rețete din țara de origine — comparate din mai multe surse, cu pași, timere și poze.', open: 'Click pentru rețetă', reset: 'Resetează', footer: 'Gătit cu răbdare și surse verificate · 2026', start: 'Pornește', stop: 'Oprește', done: 'Gata!' },
  en: { eyebrow: 'Authentic recipes', title: 'Authentic Recipes', sub: 'Recipes from their country of origin — compared across sources, with steps, timers and photos.', open: 'Tap for recipe', reset: 'Reset', footer: 'Cooked with patience and checked sources · 2026', start: 'Start', stop: 'Stop', done: 'Done!' }
};

const $ = (id) => document.getElementById(id);
const toggle = $('lang-toggle'), grid = $('cards'), reader = $('reader'), body = $('reader-body');
let index = [], current = null, wakeLock = null;
const timers = new Set();

const lang = () => (toggle.checked ? 'ro' : 'en');
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  del: (k) => { try { localStorage.removeItem(k); } catch {} }
};

function renderUI() {
  const t = UI[lang()];
  document.documentElement.lang = lang();
  $('t-eyebrow').textContent = t.eyebrow;
  $('t-title').textContent = t.title;
  document.title = t.title;
  $('t-sub').textContent = t.sub;
  $('t-footer').textContent = t.footer;
  $('reader-reset').textContent = t.reset;
  grid.innerHTML = '';
  index.forEach((r, i) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.style.animationDelay = `${i * 0.1}s`;
    card.style.setProperty('--card-theme', r.theme);
    card.innerHTML = `
      <div class="card-img"><img src="${r.image}" alt="${r.title[lang()]}" loading="lazy"></div>
      <span class="card-tag">${r.origin} · ${r.time}</span>
      <div class="card-front-overlay">
        <h2>${r.title[lang()]}</h2>
        <p class="tagline">${r.tagline[lang()]}</p>
        <div class="flip-hint">${t.open}</div>
      </div>`;
    card.addEventListener('click', () => openRecipe(r));
    grid.appendChild(card);
  });
}

// --- reader -------------------------------------------------------------
const toSeconds = (txt) => {
  const m = txt.match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*(h|min|s)\b/i);
  if (!m) return 0;
  return +(m[2] || m[1]) * { h: 3600, min: 60, s: 1 }[m[3].toLowerCase()];
};
const fmt = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), p = (n) => String(n).padStart(2, '0');
  return (h ? `${h}:${p(m)}` : m) + `:${p(s % 60)}`;
};

async function openRecipe(r) {
  current = r;
  const file = `recipes/${r.slug}${lang() === 'ro' ? '.ro' : ''}.md`;
  const md = (await (await fetch(file, { cache: 'no-cache' })).text()).replace(/^---[\s\S]*?---\n/, '');
  body.innerHTML = marked.parse(md)
    .replace(/(src=")images\//g, '$1recipes/images/')
    .replace(/<a /g, '<a target="_blank" rel="noopener" ')
    .replace(/⏱ <strong>(.*?)<\/strong>/g, (_, t) => {
      const s = toSeconds(t);
      return s ? `<button type="button" class="timer" data-s="${s}">⏱ ${t} · <span>${UI[lang()].start} ${fmt(s)}</span></button>` : `⏱ <strong>${t}</strong>`;
    });
  const boxes = body.querySelectorAll('input[type=checkbox]');
  boxes.forEach((b, i) => {
    b.disabled = false;
    b.checked = store.get(key(i)) === '1';
    b.dataset.i = i;
  });
  reader.hidden = false;
  document.body.classList.add('no-scroll');
  reader.scrollTop = 0;
  try { wakeLock = await navigator.wakeLock?.request('screen'); } catch {}
}

const key = (i) => `chk:${current.slug}:${lang()}:${i}`;

function closeRecipe() {
  reader.hidden = true;
  document.body.classList.remove('no-scroll');
  timers.forEach(clearInterval);
  timers.clear();
  wakeLock?.release?.();
}

function beep() {
  try {
    const ctx = new AudioContext(), o = ctx.createOscillator();
    o.connect(ctx.destination); o.frequency.value = 880; o.start();
    setTimeout(() => { o.stop(); ctx.close(); }, 900);
  } catch {}
  navigator.vibrate?.([300, 150, 300]);
}

function runTimer(btn) {
  const label = btn.querySelector('span'), t = UI[lang()];
  if (btn._iv) { // second tap stops
    clearInterval(btn._iv); timers.delete(btn._iv); btn._iv = null;
    btn.classList.remove('running'); label.textContent = `${t.start} ${fmt(+btn.dataset.s)}`;
    return;
  }
  let left = +btn.dataset.s;
  btn.classList.add('running');
  btn._iv = setInterval(() => {
    left--;
    label.textContent = `${t.stop} ${fmt(left)}`;
    if (left <= 0) {
      clearInterval(btn._iv); timers.delete(btn._iv); btn._iv = null;
      btn.classList.remove('running'); btn.classList.add('done');
      label.textContent = t.done; beep();
    }
  }, 1000);
  timers.add(btn._iv);
  label.textContent = `${t.stop} ${fmt(left)}`;
}

body.addEventListener('click', (e) => {
  const btn = e.target.closest('.timer');
  if (btn) runTimer(btn);
});
body.addEventListener('change', (e) => {
  if (e.target.matches('input[type=checkbox]')) {
    e.target.checked ? store.set(key(e.target.dataset.i), '1') : store.del(key(e.target.dataset.i));
  }
});
$('reader-close').addEventListener('click', closeRecipe);
$('reader-reset').addEventListener('click', () => {
  body.querySelectorAll('input[type=checkbox]').forEach((b) => { b.checked = false; store.del(key(b.dataset.i)); });
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !reader.hidden) closeRecipe(); });
toggle.addEventListener('change', () => { closeRecipe(); renderUI(); });

fetch('recipes/index.json', { cache: 'no-cache' }).then((r) => r.json()).then((j) => { index = j; renderUI(); });
