const UI = {
  ro: {
    eyebrow: 'Rețete autentice', title: 'Rețetar Autentic',
    sub: 'Rețete din țara de origine — comparate din mai multe surse, cu pași, timere și poze.',
    open: 'Click pentru rețetă', reset: 'Resetează', footer: 'Gătit cu răbdare și surse verificate · 2026',
    start: 'Pornește', stop: 'Oprește', done: 'Gata!',
    shop: 'Listă de cumpărături', addList: '＋ Listă', inList: '✓ În listă', copy: 'Copiază', copied: 'Copiat!', clear: 'Șterge bifele',
    pick: 'Alege rețetele', empty: 'Alege cel puțin o rețetă ca să vezi lista.', optional: 'opțional', toTaste: 'după gust',
    openSource: 'Deschide originalul', fab: 'Cumpărături', allDone: 'Totul bifat 🎉', refs: 'Site-uri de referință', refsTop: '📚 Site-uri de referință', visit: 'Deschide site-ul',
    search: 'Caută o rețetă…', recipes: 'rețete', noMatch: 'Nicio rețetă cu aceste filtre.', clearFilters: 'Șterge filtrele'
  },
  en: {
    eyebrow: 'Authentic recipes', title: 'Authentic Recipes',
    sub: 'Recipes from their country of origin — compared across sources, with steps, timers and photos.',
    open: 'Tap for recipe', reset: 'Reset', footer: 'Cooked with patience and checked sources · 2026',
    start: 'Start', stop: 'Stop', done: 'Done!',
    shop: 'Shopping list', addList: '＋ List', inList: '✓ In list', copy: 'Copy', copied: 'Copied!', clear: 'Clear ticks',
    pick: 'Pick recipes', empty: 'Pick at least one recipe to see the list.', optional: 'optional', toTaste: 'to taste',
    openSource: 'Open original', fab: 'Shopping', allDone: 'All ticked 🎉', refs: 'Reference sites', refsTop: '📚 Reference sites', visit: 'Open site',
    search: 'Search a recipe…', recipes: 'recipes', noMatch: 'No recipes match these filters.', clearFilters: 'Clear filters'
  }
};
const AISLES = ['produce', 'meat', 'dairy', 'pantry', 'other'];
const AISLE = {
  produce: { en: 'Produce', ro: 'Legume și fructe' }, meat: { en: 'Meat', ro: 'Carne' },
  dairy: { en: 'Dairy & eggs', ro: 'Lactate și ouă' }, pantry: { en: 'Pantry', ro: 'Cămară' }, other: { en: 'Other', ro: 'Altele' }
};
const UNIT = { g: { en: 'g', ro: 'g' }, ml: { en: 'ml', ro: 'ml' }, pcs: { en: '', ro: '' }, bunch: { en: 'bunch', ro: 'legătură' } };
const STEPS = [0.5, 1, 2, 3, 4];

const $ = (id) => document.getElementById(id);
const toggle = $('lang-toggle'), grid = $('cards'), reader = $('reader'), body = $('reader-body'),
  shop = $('shop'), shopBody = $('shop-body'), fab = $('shop-fab');
let index = [], refs = [], current = null, wakeLock = null;
const timers = new Set();

const lang = () => (toggle.checked ? 'ro' : 'en');
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  del: (k) => { try { localStorage.removeItem(k); } catch {} }
};
const load = (k) => { try { return JSON.parse(store.get(k) || '{}'); } catch { return {}; } };
let list = load('list'); // { slug: servings multiplier }
let got = load('got');   // { itemKey: true }
const saveList = () => store.set('list', JSON.stringify(list));
const saveGot = () => store.set('got', JSON.stringify(got));

// --- home ---------------------------------------------------------------
const SRC = { web: '🌐 Web', social: '▶ Social media', facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube' };
const COURSE = {
  breakfast: { en: 'Breakfast', ro: 'Mic dejun' }, dessert: { en: 'Dessert', ro: 'Desert' }, soup: { en: 'Soup', ro: 'Supă' },
  main: { en: 'Main course', ro: 'Fel principal' }, snack: { en: 'Snack', ro: 'Gustare' }, salad: { en: 'Salad', ro: 'Salată' }, appetizer: { en: 'Appetizer', ro: 'Aperitiv' }, sauce: { en: 'Sauce', ro: 'Sos' }, side: { en: 'Side dish', ro: 'Garnitură' }
};
const GROUPS = [
  { id: 'source', title: { en: 'Source', ro: 'Sursă' }, vals: (r) => r.source?.tags || [], label: (k) => SRC[k] || k },
  { id: 'country', title: { en: 'Country / language', ro: 'Țară / limbă' }, vals: (r) => (r.country ? [r.country.key] : []),
    label: (k) => index.find((r) => r.country?.key === k).country[lang()] },
  { id: 'course', title: { en: 'Type', ro: 'Tip' }, vals: (r) => r.course || [], label: (k) => (COURSE[k] ? COURSE[k][lang()] : k) }
];
const active = { source: new Set(), country: new Set(), course: new Set() };
let query = '';
const norm = (x) => x.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

const visible = () => index.filter((r) =>
  GROUPS.every((g) => !active[g.id].size || g.vals(r).some((v) => active[g.id].has(v))) &&
  (!query || norm(`${r.title.en} ${r.title.ro} ${r.tagline.en} ${r.tagline.ro}`).includes(query)));

function renderChips() {
  const t = UI[lang()];
  $('chips').innerHTML = GROUPS.map((g) => {
    const vals = [...new Set(index.flatMap(g.vals))];
    if (vals.length < 2) return '';
    return `<div class="chip-group"><h3>${g.title[lang()]}</h3><div class="chip-row">` +
      vals.map((v) => `<button type="button" class="chip${active[g.id].has(v) ? ' active' : ''}" data-g="${g.id}" data-v="${v}">${g.label(v)}</button>`).join('') +
      '</div></div>';
  }).join('') + (Object.values(active).some((s) => s.size) || query ? `<div class="chip-group"><button type="button" class="chip reset" data-reset="1">${t.clearFilters}</button></div>` : '');
}

function renderCards() {
  const t = UI[lang()], list_ = visible();
  $('count').textContent = `${list_.length} / ${index.length} ${t.recipes}`;
  grid.innerHTML = list_.length ? '' : `<p class="empty">${t.noMatch}</p>`;
  list_.forEach((r, i) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.style.animationDelay = `${i * 0.1}s`;
    card.style.setProperty('--card-theme', r.theme);
    const s = r.source;
    card.innerHTML = `
      <div class="card-img"><img src="${r.image}" alt="${r.title[lang()]}" loading="lazy"></div>
      <span class="card-tag">${r.origin} · ${r.time}</span>
      ${s ? `<span class="card-source ${s.kind}">${s.badge[lang()]}</span>` : ''}
      <div class="card-front-overlay">
        <h2>${r.title[lang()]}</h2>
        <p class="tagline">${r.tagline[lang()]}</p>
        <div class="flip-hint">${t.open}</div>
      </div>`;
    card.addEventListener('click', () => openRecipe(r));
    grid.appendChild(card);
  });
}

function renderUI() {
  const t = UI[lang()];
  document.documentElement.lang = lang();
  $('t-eyebrow').textContent = t.eyebrow;
  $('t-title').textContent = t.title;
  document.title = t.title;
  $('t-sub').textContent = t.sub;
  $('t-footer').textContent = t.footer;
  $('reader-reset').textContent = t.reset;
  $('shop-copy').textContent = t.copy;
  $('shop-clear').textContent = t.clear;
  $('q').placeholder = t.search;
  $('t-refs').textContent = t.refs;
  $('refs-top').textContent = t.refsTop;
  $('refs-top').parentElement.hidden = !refs.length;
  $('refs').hidden = !refs.length;
  $('refs-list').innerHTML = refs.map((r) => `<a class="ref-card" href="${r.url}" target="_blank" rel="noopener"><strong>${r.title}</strong><span>${r.description[lang()]}</span><em>${t.visit} ↗</em></a>`).join('');
  renderChips();
  renderCards();
  updateFab();
}

$('chips').addEventListener('click', (e) => {
  const b = e.target.closest('.chip');
  if (!b) return;
  if (b.dataset.reset) { Object.values(active).forEach((s) => s.clear()); query = ''; $('q').value = ''; }
  else { const s = active[b.dataset.g]; s.has(b.dataset.v) ? s.delete(b.dataset.v) : s.add(b.dataset.v); }
  renderChips(); renderCards();
});
$('q').addEventListener('input', (e) => { query = norm(e.target.value.trim()); renderChips(); renderCards(); });

// --- recipe reader ------------------------------------------------------
const toSeconds = (txt) => {
  const m = txt.match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*(h|min|s)\b/i);
  if (!m) return 0;
  return +(m[2] || m[1]) * { h: 3600, min: 60, s: 1 }[m[3].toLowerCase()];
};
const fmt = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), p = (n) => String(n).padStart(2, '0');
  return (h ? `${h}:${p(m)}` : m) + `:${p(s % 60)}`;
};

function banner(r) {
  const s = r.source;
  if (!s) return '';
  return `<div class="source-banner ${s.kind}"><span>${s.kind === 'reel' ? '▶' : '🌐'}</span><span>${s.label[lang()]}</span>` +
    (s.url ? `<a href="${s.url}" target="_blank" rel="noopener">${UI[lang()].openSource} ↗</a>` : '') + '</div>';
}

function updateAddBtn() {
  const b = $('reader-add'), on = current && list[current.slug];
  b.textContent = UI[lang()][on ? 'inList' : 'addList'];
  b.classList.toggle('on', !!on);
}

async function openRecipe(r) {
  current = r;
  const file = `recipes/${r.slug}${lang() === 'ro' ? '.ro' : ''}.md`;
  const md = (await (await fetch(file, { cache: 'no-cache' })).text()).replace(/^---[\s\S]*?---\n/, '');
  body.innerHTML = banner(r) + marked.parse(md)
    .replace(/(src=")images\//g, '$1recipes/images/')
    .replace(/<a /g, '<a target="_blank" rel="noopener" ')
    .replace(/⏱ <strong>(.*?)<\/strong>/g, (_, t) => {
      const s = toSeconds(t);
      return s ? `<button type="button" class="timer" data-s="${s}">⏱ ${t} · <span>${UI[lang()].start} ${fmt(s)}</span></button>` : `⏱ <strong>${t}</strong>`;
    });
  body.querySelectorAll('input[type=checkbox]').forEach((b, i) => {
    b.disabled = false;
    b.checked = store.get(key(i)) === '1';
    b.dataset.i = i;
  });
  updateAddBtn();
  reader.hidden = false;
  document.body.classList.add('no-scroll');
  reader.scrollTop = 0;
  try { wakeLock = await navigator.wakeLock?.request('screen'); } catch {}
}

const key = (i) => `chk:${current.slug}:${lang()}:${i}`;

function closeAll() {
  reader.hidden = true;
  shop.hidden = true;
  document.body.classList.remove('no-scroll');
  timers.forEach(clearInterval);
  timers.clear();
  wakeLock?.release?.();
  updateFab();
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
$('reader-reset').addEventListener('click', () => {
  body.querySelectorAll('input[type=checkbox]').forEach((b) => { b.checked = false; store.del(key(b.dataset.i)); });
});
$('reader-add').addEventListener('click', () => {
  list[current.slug] ? delete list[current.slug] : (list[current.slug] = 1);
  saveList(); updateAddBtn();
});

// --- shopping list ------------------------------------------------------
function aggregate() {
  const map = {};
  for (const r of index) {
    const m = list[r.slug];
    if (!m) continue;
    for (const g of r.grocery || []) {
      const k = `${g.aisle}|${g.key}|${g.unit || ''}`;
      const o = map[k] ||= { k, aisle: g.aisle, name: g.name, unit: g.unit || '', qty: 0, opt: true, from: [] };
      o.qty += (g.qty || 0) * m;
      o.opt = o.opt && !!g.optional;
      if (!o.from.includes(r.title[lang()])) o.from.push(r.title[lang()]);
    }
  }
  return Object.values(map);
}

function fmtQty(o) {
  if (!o.qty) return UI[lang()].toTaste;
  let q = o.qty, u = o.unit;
  if ((u === 'g' || u === 'ml') && q >= 1000) { q /= 1000; u = u === 'g' ? 'kg' : 'L'; }
  q = (u === 'pcs' || u === 'bunch') ? Math.ceil(q - 1e-9) : Math.round(q * 100) / 100;
  const label = UNIT[u] ? UNIT[u][lang()] : u;
  return `${q.toLocaleString(lang() === 'ro' ? 'ro-RO' : 'en')}${label ? ' ' + label : ''}`;
}

function updateFab() {
  const t = UI[lang()], items = aggregate(), left = items.filter((i) => !got[i.k]).length;
  fab.textContent = `🛒 ${t.fab}${items.length ? ` (${left})` : ''}`;
  fab.hidden = !reader.hidden || !shop.hidden;
}

function renderShop() {
  const t = UI[lang()], items = aggregate();
  const rows = index.map((r) => {
    const m = list[r.slug];
    return `<div class="recipe-row"><input type="checkbox" id="sr-${r.slug}" data-slug="${r.slug}" ${m ? 'checked' : ''}>` +
      `<label for="sr-${r.slug}">${r.title[lang()]}</label>` +
      (m ? `<span class="stepper" data-slug="${r.slug}"><button type="button" data-d="-1" aria-label="−">−</button><span>×${m}</span><button type="button" data-d="1" aria-label="+">+</button></span>` : '') + '</div>';
  }).join('');
  let html = `<h1>${t.shop}</h1><h2>${t.pick}</h2>${rows}`;
  if (!items.length) html += `<p class="empty">${t.empty}</p>`;
  else if (items.every((i) => got[i.k])) html += `<p class="empty">${t.allDone}</p>`;
  for (const a of AISLES) {
    const its = items.filter((i) => i.aisle === a).sort((x, y) => x.name[lang()].localeCompare(y.name[lang()]));
    if (!its.length) continue;
    html += `<section class="aisle"><h2>${AISLE[a][lang()]}</h2><ul class="shop-list">` + its.map((i) =>
      `<li class="shop-item${i.opt ? ' opt' : ''}${got[i.k] ? ' done' : ''}" data-k="${i.k}"><label>` +
      `<input type="checkbox" ${got[i.k] ? 'checked' : ''}><span><span class="qty">${fmtQty(i)}</span> ` +
      `<span class="nm">${i.name[lang()]}${i.opt ? ` (${t.optional})` : ''}</span>` +
      (i.from.length > 1 ? `<span class="from">${i.from.join(' + ')}</span>` : '') + '</span></label></li>').join('') + '</ul></section>';
  }
  shopBody.innerHTML = html;
  updateFab();
}

function openShop() {
  renderShop();
  shop.hidden = false;
  document.body.classList.add('no-scroll');
  shop.scrollTop = 0;
  fab.hidden = true;
}

shopBody.addEventListener('change', (e) => {
  const li = e.target.closest('.shop-item');
  if (li) {
    e.target.checked ? (got[li.dataset.k] = true) : delete got[li.dataset.k];
    saveGot();
    li.classList.toggle('done', e.target.checked);
    updateFab(); fab.hidden = true;
    return;
  }
  const slug = e.target.dataset.slug;
  if (slug) { e.target.checked ? (list[slug] = 1) : delete list[slug]; saveList(); renderShop(); }
});
shopBody.addEventListener('click', (e) => {
  const b = e.target.closest('.stepper button');
  if (!b) return;
  const slug = b.parentElement.dataset.slug, i = STEPS.indexOf(list[slug]);
  list[slug] = STEPS[Math.max(0, Math.min(STEPS.length - 1, i + +b.dataset.d))];
  saveList(); renderShop();
});
$('shop-clear').addEventListener('click', () => { got = {}; saveGot(); renderShop(); });
$('shop-copy').addEventListener('click', async () => {
  const t = UI[lang()], items = aggregate();
  const text = [t.shop, ...AISLES.flatMap((a) => {
    const its = items.filter((i) => i.aisle === a);
    return its.length ? ['', AISLE[a][lang()], ...its.map((i) => `${got[i.k] ? '[x]' : '[ ]'} ${fmtQty(i)} ${i.name[lang()]}`)] : [];
  })].join('\n');
  try {
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) await navigator.share({ text });
    else await navigator.clipboard.writeText(text);
    $('shop-copy').textContent = t.copied;
    setTimeout(() => { $('shop-copy').textContent = t.copy; }, 1500);
  } catch {}
});
fab.addEventListener('click', openShop);

// --- wiring -------------------------------------------------------------
$('reader-close').addEventListener('click', closeAll);
$('shop-close').addEventListener('click', closeAll);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && (!reader.hidden || !shop.hidden)) closeAll(); });
toggle.addEventListener('change', () => { closeAll(); renderUI(); });

Promise.all([
  fetch('recipes/index.json', { cache: 'no-cache' }).then((r) => r.json()),
  fetch('references.json', { cache: 'no-cache' }).then((r) => r.json()).catch(() => [])
]).then(([j, r]) => { index = j; refs = r; renderUI(); });
