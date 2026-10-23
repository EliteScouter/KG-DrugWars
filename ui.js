// ============================================================
//  Drug Wars: the screens. Reads and changes the game through
//  sim.js, saves to the Kaotic Gaming account (or this browser).
// ============================================================
(function (G) {
  'use strict';
  const $ = s => document.querySelector(s);
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const M = G.money, SH = G.short;
  const ROOT = window.DW_ROOT || './';
  const LS_KEY = 'drugwars-save-v1';
  const KG = () => window.KG;

  let meta = G.newMeta(), s = null, tab = 'market';

  // ---------- artwork: the real image when it exists, a numbered placeholder until then ----------
  const artCache = {};
  function findImage(a) {
    if (artCache[a.key] !== undefined) return artCache[a.key];
    artCache[a.key] = new Promise(resolve => {
      const exts = ['webp', 'png', 'jpg'];
      const next = i => {
        if (i >= exts.length) return resolve(null);
        const img = new Image(), url = `${ROOT}${a.file}.${exts[i]}`;
        img.onload = () => resolve(url);
        img.onerror = () => next(i + 1);
        img.src = url;
      };
      next(0);
    });
    return artCache[a.key];
  }
  // <div class="art"> for an art key; size class comes from the art list unless given
  function art(key, cls = '') {
    const a = G.artOf(key);
    if (!a) return `<div class="art ${cls}"></div>`;
    const size = /\b(wide|square|tall|fill)\b/.test(cls) ? '' : a.size;
    return `<div class="art ${size} ${cls}" data-art="${a.key}"><div class="ph"><b>PLACEHOLDER ${a.n}</b><em>#${a.n}</em><small>${esc(a.use)}</small></div></div>`;
  }
  function hydrate(root) {
    (root || document).querySelectorAll('.art[data-art]:not([data-done])').forEach(el => {
      el.dataset.done = '1';
      const a = G.artOf(el.dataset.art);
      findImage(a).then(url => {
        if (!url) return;
        const img = new Image();
        img.alt = '';
        img.onload = () => el.classList.add('loaded');
        img.src = url;
        el.prepend(img);
      });
    });
  }

  // ---------- saving ----------
  let saveTimer = null;
  function persist(now) {
    clearTimeout(saveTimer);
    const write = () => {
      if (s) G.record(meta, s);
      const data = { v: G.SAVE_VERSION, meta, run: s && !s.over ? s : null };
      if (KG()) KG().save(data);
      try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) {}
      report();
    };
    if (now) write(); else saveTimer = setTimeout(write, 250);
  }
  // season 2 has its own scoreboard keys, so the old (too easy) records don't count
  function report() {
    const k = KG();
    if (!k) return;
    k.report({ richest: meta.bestNet, mostDays: meta.bestDays, season: G.SEASON, netWorth: s ? G.netWorth(s) : 0, day: s ? s.day : 0,
               rep: s ? Math.floor(s.rep) : 0, turf: s ? Object.keys(s.turf).length : 0, runs: meta.runs, deaths: meta.deaths, kings: meta.kings });
    if (s && !s.over) k.setStatus(`Day ${s.day} · ${G.district(s.loc).name} · ${SH(G.netWorth(s))}`);
  }
  function loadSave() {
    let data = null;
    if (KG()) data = KG().initialSave;
    else { try { data = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) {} }
    const got = G.load(data);
    if (got) { meta = got.meta; s = got.run; }
    if (s && !s.over) G.repFix(s);
  }

  // ---------- little UI helpers ----------
  function toast(text, tone) {
    const t = document.createElement('div');
    t.className = 'toast ' + (tone || '');
    t.textContent = text;
    $('#toasts').append(t);
    setTimeout(() => t.remove(), 2700);
  }
  function said(r, goodTone) { if (r && r.msg) toast(r.msg, r.ok ? (goodTone || '') : 'bad'); }
  let lastCash = null;
  function popMoney(diff) {
    if (!diff) return;
    const box = $('#hCash'), rect = box.getBoundingClientRect(), app = $('#app').getBoundingClientRect();
    const p = document.createElement('div');
    p.className = 'money-pop ' + (diff > 0 ? 'up' : 'down');
    p.textContent = (diff > 0 ? '+' : '-') + SH(Math.abs(diff)).replace('-', '');
    p.style.left = (rect.left - app.left) + 'px';
    p.style.top = (rect.top - app.top + 18) + 'px';
    $('#app').append(p);
    setTimeout(() => p.remove(), 1100);
  }
  const riskLevel = d => (d.risk + d.gang * 0.5 >= 0.75 ? 3 : d.risk + d.gang * 0.5 >= 0.35 ? 2 : 1);
  const riskBars = n => `<span class="risk r${n}"><i></i><i></i><i></i></span>`;
  const pct = v => Math.round(v * 100) + '%';
  const lockTag = rep => `<span class="lock-tag">🔒 ${rep} rep</span>`;
  const repOk = need => s.rep >= (need || 0);

  // do something in the game, then show what changed
  function act(fn, opts = {}) {
    const before = s.cash;
    const r = fn();
    if (!opts.quiet) said(r, opts.tone || 'good');
    if (s.cash !== before && !opts.noPop) popMoney(s.cash - before);
    persist();
    render();
    if (s.pending || s.over) showPending();
    return r;
  }

  // ---------- screens ----------
  function showTitle() {
    $('#gameScreen').classList.add('hidden');
    $('#titleScreen').classList.remove('hidden');
    $('#titleArt').innerHTML = art('title', 'fill');
    hydrate($('#titleArt'));
    const recs = [];
    if (meta.bestNet > 0) recs.push(`<div class="rec"><span>Richest ever</span><strong>${SH(meta.bestNet)}</strong></div>`);
    if (meta.bestDays > 1) recs.push(`<div class="rec"><span>Most days</span><strong>${meta.bestDays}</strong></div>`);
    $('#titleRecords').innerHTML = recs.join('');
    $('#continueBtn').classList.toggle('hidden', !(s && !s.over));
    if (s && !s.over) $('#continueBtn').textContent = `Continue · Day ${s.day}`;
    $('#homeBtn').classList.toggle('hidden', !KG());
    const who = KG() && KG().user ? `Playing as ${esc(KG().user.username)} · saves to your Kaotic Gaming account` : 'Saves in this browser';
    const legacy = meta.legacy && !meta.legacySeen ? '<div class="season">Season 2: a bigger, harder Vice Harbor. The scoreboard starts fresh.</div>' : '';
    $('#titleFoot').innerHTML = legacy + who;
  }
  function startGame() {
    $('#titleScreen').classList.add('hidden');
    $('#gameScreen').classList.remove('hidden');
    lastCash = s.cash;
    sceneFor = null;
    render();
    showPending();
  }
  function newGame() {
    if (s && !s.over) G.closeRun(meta, s);
    s = G.newRun(meta);
    meta.legacySeen = true;
    tab = 'market';
    G.note(s, 'You owe Vinnie the Shark ' + M(s.debt) + '. Pay him at his office (Downtown or The Strip) within ' + G.SHARK.graceDays + ' days.');
    persist(true);
    startGame();
    help(true);
  }

  // ---------- render everything ----------
  function render() {
    if (!s) return;
    renderHud();
    renderScene();
    renderTab();
  }
  function renderHud() {
    $('#hDay').textContent = s.day;
    $('#hCash').textContent = SH(s.cash);
    $('#hBank').textContent = SH(s.bank);
    $('#hDebt').textContent = s.debt ? SH(s.debt) : 'None';
    $('#hDebtBox').classList.toggle('clear', !s.debt);
    $('#hDebtBox').classList.toggle('late', !!s.debt && s.day > s.debtDue);
    if (lastCash !== null && lastCash !== s.cash) { const el = $('.hm.cash'); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
    lastCash = s.cash;
    $('#bHp').style.width = pct(Math.max(0, s.hp) / s.maxHp); $('#tHp').textContent = Math.round(s.hp);
    $('.bar.hp').classList.toggle('low', s.hp < 35);
    const tier = G.heatTier(s);
    $('#bHeat').style.width = pct(s.heat / 100); $('#tHeat').textContent = `${Math.round(s.heat)}${s.heat >= 30 ? ' · ' + tier.name.toUpperCase() : ''}`;
    $('.bar.heat').classList.toggle('hot', s.heat >= 70);
    const next = G.nextTitle(s), title = G.title(s);
    const lo = title.rep, hi = next ? next.rep : 100;
    $('#bRep').style.width = pct(next ? (s.rep - lo) / (hi - lo) : 1); $('#tRep').textContent = `${Math.floor(s.rep)} · ${title.name.toUpperCase()}`;
  }
  let sceneFor = null;
  function renderScene() {
    const d = G.district(s.loc);
    if (sceneFor !== d.id) {
      $('#sceneArt').innerHTML = art(d.art, 'fill');
      hydrate($('#sceneArt'));
      sceneFor = d.id;
    }
    $('#sceneName').textContent = d.name;
    $('#sceneTag').textContent = d.tagline;
    const r = riskLevel(d);
    const owner = s.turf[d.id] ? '<span class="chip mine">YOUR TURF</span>' : s.beaten[d.faction] ? '<span class="chip">No gang</span>' : `<span class="chip">${esc(G.FACTIONS[d.faction].name)}</span>`;
    $('#sceneChips').innerHTML = `<span class="chip r${r}">${['', 'Low', 'Medium', 'High'][r]} risk</span>`
      + `<span class="chip">${d.police >= 0.7 ? 'Heavy' : d.police >= 0.35 ? 'Some' : 'Few'} cops</span>` + owner
      + (s.manhunt ? `<span class="chip r3">Manhunt ${s.manhunt}d</span>` : '');
    const news = s.news.map(n => `<em>★</em><b class="${n.tone || ''}">${esc(n.text)}</b>`).join('');
    const ticker = `<span>${news}<em>★</em>${esc(G.CITY)} · Day ${s.day}</span>`;
    if ($('#ticker').dataset.html !== ticker) { $('#ticker').innerHTML = ticker; $('#ticker').dataset.html = ticker; } // keeps scrolling between taps
    // dots: work to do here
    const dot = (t, on) => { const b = document.querySelector(`.tabs [data-tab=${t}]`); b.querySelector('.dot')?.remove(); if (on) b.insertAdjacentHTML('beforeend', '<i class="dot"></i>'); };
    dot('jobs', G.jobsHere(s).some(j => !j.done && repOk(G.jobInfo(j).minRep)) || G.contractsHere(s).length);
    dot('empire', s.king || s.lux.includes('island'));
  }
  function renderTab() {
    document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
    const panel = $('#panel');
    panel.innerHTML = ({ market, travel, city, crew, jobs, empire })[tab]();
    hydrate(panel);
  }

  // ---------- market ----------
  function capCard() {
    const cap = G.capacity(s), used = G.carried(s), pk = G.packageSpace(s);
    return `<div class="card cap"><span class="note">Carrying</span><div class="meter ${used >= cap ? 'full' : ''}"><i style="width:${pct(Math.min(1, used / Math.max(1, cap)))}"></i></div><b>${used} / ${cap}</b></div>${pk ? `<p class="note center">Includes a ${pk}-space package for the Fixer.</p>` : ''}`;
  }
  function market() {
    const news = s.news.filter(n => n.tone).map(n => `<div class="${n.tone}">${esc(n.text)}</div>`).join('');
    const turf = s.turf[s.loc] ? '<div class="card news"><div class="spike">Your turf: you sell 10% higher here and the market takes bigger loads.</div></div>' : '';
    const stash = s.stashes[s.loc] ? `<button class="btn wide ghost" data-act="stash" style="margin-bottom:10px">Open your safehouse (${G.stashUsed(s.stashes[s.loc])}/${s.stashes[s.loc].cap})</button>` : '';
    const rows = G.DRUGS.map(d => {
      const p = G.price(s, d.id), sp = G.sellPrice(s, d.id), h = s.inv[d.id], ok = G.canTrade(s, d.id);
      const spike = s.news.find(n => n.drug === d.id);
      let tag = '<span class="tag none">Nobody\'s selling</span>';
      if (!ok) tag = lockTag(d.rep);
      else if (p) {
        if (spike) tag = `<span class="tag ${spike.tone}">${spike.tone === 'spike' ? 'Spike: sell here' : 'Crash: buy cheap'}</span>`;
        else if (p < d.lo * 1.1) tag = '<span class="tag cheap">Cheap</span>';
        else if (p > d.hi * 0.92) tag = '<span class="tag high">Sells high</span>';
        else tag = '<span class="tag none">Normal</span>';
      }
      const avg = h && h.qty ? h.cost / h.qty : 0;
      const profit = h && sp && avg ? Math.round((sp - avg) / avg * 100) : null;
      // how many sell at a profit here before the price drops below what you paid
      const best = h && ok && sp ? G.bestSell(s, d.id) : 0;
      const hint = h && ok && sp ? (best >= h.qty ? '' : best ? ` · <b class="warn">sell ~${best} here</b>` : ' · <b class="warn">don\'t sell here</b>') : '';
      const own = h ? `Own <b>${h.qty}</b>${avg ? ` · paid ${SH(avg)}` : ''}${profit !== null ? ` · <span class="profit ${profit >= 0 ? 'up' : 'down'}">${profit >= 0 ? '+' : ''}${profit}%</span>` : ''}${hint}` : 'Own 0';
      const canBuy = ok && p && G.maxBuy(s, d.id) > 0, canSell = ok && p && h;
      return `<div class="card drug ${p && ok ? '' : 'na'}">
        ${art(d.art, 'icon')}
        <div><div class="nm">${esc(d.name)}</div><div class="own">${own}</div></div>
        <div class="pr"><strong>${p && ok ? M(p) : '—'}</strong>${tag}</div>
        <div class="acts">
          <button class="btn small green" data-buy="${d.id}" ${canBuy ? '' : 'disabled'}>Buy</button>
          <button class="btn small red" data-sell="${d.id}" ${canSell ? '' : 'disabled'}>Sell</button>
        </div>
      </div>`;
    }).join('');
    return `${capCard()}${news ? `<div class="card news">${news}</div>` : ''}${turf}${stash}
      <div class="drugs">${rows}</div>
      <p class="note center" style="margin-top:10px">Big orders move the price. Prices recover over a few days. Better product needs more rep.</p>
      <div class="sec"><button class="btn wide ghost" data-act="wait">Lay low for a day (heat cools faster)</button></div>`;
  }
  function openTrade(id, mode) {
    const d = G.drug(id), h = s.inv[id];
    const max = mode === 'buy' ? G.maxBuy(s, id) : (h ? h.qty : 0);
    if (!max) return;
    const avg = h && h.qty ? h.cost / h.qty : 0;
    const best = mode === 'sell' ? G.bestSell(s, id) : max;
    let q = mode === 'sell' ? Math.max(1, best || 1) : max; // selling starts at the best amount, not everything
    const unit = mode === 'buy' ? G.price(s, id) : G.sellPrice(s, id);
    modal(`<div class="sheet-h">${art(d.art, 'square icon')}<div><h2>${mode === 'buy' ? 'Buy' : 'Sell'} ${esc(d.name)}</h2><small>${M(unit)} for the first one${mode === 'sell' && avg ? ` · you paid ${M(Math.round(avg))} each` : ''}</small></div></div>
      <div class="qty">
        <div class="qty-num" id="qn">${q}</div>
        <div class="qty-sub" id="qs"></div>
        <div class="qty-sub small" id="qs2"></div>
        <input type="range" id="qr" min="1" max="${max}" value="${q}">
        <div class="quick"><button class="btn small" data-q="1">1</button><button class="btn small" data-q="10">10</button><button class="btn small" data-q="half">Half</button>${mode === 'sell' && best && best < max ? `<button class="btn small cyan" data-q="best">Best ${best}</button>` : ''}<button class="btn small" data-q="max">Max</button></div>
      </div>
      <div class="m-actions"><button class="btn big ${mode === 'buy' ? 'green' : 'red'}" id="qok"></button><button class="btn ghost" data-close>Cancel</button></div>`);
    const upd = () => {
      $('#qn').textContent = q;
      $('#qr').value = q;
      const quote = mode === 'buy' ? G.quoteBuy(s, id, q) : G.quoteSell(s, id, q);
      const each = Math.round(quote.total / q);
      let sub = `Total <b>${M(quote.total)}</b> · ${M(each)} each`;
      if (mode === 'sell' && avg) { const pr = Math.round(quote.total - avg * q); sub += ` · <b class="profit ${pr >= 0 ? 'up' : 'down'}">${pr >= 0 ? '+' : ''}${M(pr)}</b>`; }
      $('#qs').innerHTML = sub;
      const moved = Math.abs(quote.after - unit) / unit;
      const losing = mode === 'sell' && avg && quote.total < avg * q;
      $('#qs2').innerHTML = losing
        ? `<b class="profit down">This many loses money here.</b> ${best ? `Sell ${best} or fewer, and take the rest to another district or come back in a few days.` : 'The price here is below what you paid. Sell somewhere else.'}`
        : `${mode === 'buy' ? 'Price after' : 'Street price after'}: <b class="${moved > 0.25 ? 'warn' : ''}">${M(quote.after)}</b>${moved > 0.25 ? ' · you\'re flooding the market' : ''}${mode === 'buy' ? ` · space left <b>${G.space(s) - q}</b>` : ''}`;
      $('#qok').textContent = `${mode === 'buy' ? 'Buy' : 'Sell'} ${q}`;
    };
    $('#qr').oninput = e => { q = +e.target.value; upd(); };
    document.querySelectorAll('[data-q]').forEach(b => b.onclick = () => {
      const v = b.dataset.q; q = v === 'max' ? max : v === 'best' ? best : v === 'half' ? Math.max(1, Math.floor(max / 2)) : Math.min(max, +v); upd();
    });
    $('#qok').onclick = () => { closeModal(); act(() => mode === 'buy' ? G.buy(s, id, q) : G.sell(s, id, q)); };
    upd();
  }

  // ---------- travel ----------
  function travel() {
    const cards = G.DISTRICTS.map(d => {
      const here = d.id === s.loc, lock = G.locked(s, d);
      const cost = G.travelCost(s, d), r = riskLevel(d), days = G.travelDays(s, d);
      const cheap = Object.entries(d.mult).filter(([, v]) => v < 0.9).map(([k]) => G.drug(k).name).slice(0, 3);
      const high = Object.entries(d.mult).filter(([, v]) => v > 1.12).map(([k]) => G.drug(k).name).slice(0, 3);
      const contract = s.contracts.find(c => c.to === d.id);
      return `<button class="dest ${here ? 'here' : ''} ${lock ? 'locked' : ''} ${s.turf[d.id] ? 'mine' : ''}" data-go="${d.id}" ${here ? 'disabled' : ''}>
        ${art(d.art, 'wide')}${lock ? `<span class="lock">${esc(lock)}</span>` : s.turf[d.id] ? '<span class="lock own">YOUR TURF</span>' : ''}
        <div class="info"><div class="nm">${esc(d.name)}</div>
          <div class="meta"><span>${riskBars(r)} ${['', 'Safe-ish', 'Risky', 'Deadly'][r]}</span><span>${M(cost)}${days > 1 ? ` · ${days} days` : ''}</span></div>
          <div class="hint">${cheap.length ? `Cheap: <b>${cheap.join(', ')}</b>` : ''}${cheap.length && high.length ? '<br>' : ''}${high.length ? `Sells high: <i>${high.join(', ')}</i>` : ''}${contract ? `<br><u>Contract: ${esc(contract.title)}</u>` : ''}</div>
        </div></button>`;
    }).join('');
    const tip = s.tip ? `<div class="card news"><div class="spike">Tip: ${esc(G.drug(s.tip.drug).name)} in ${esc(G.district(s.tip.dist).name)} before day ${s.tip.until + 1}.</div></div>` : '';
    return `<div class="sec-h"><h2>Where to?</h2><small>Each trip takes a day</small></div>${tip}<div class="map">${cards}</div>`;
  }
  function goTo(id) {
    const d = G.district(id);
    const lock = G.locked(s, d);
    if (lock) return toast(lock + '.', 'bad');
    if (s.cash < G.travelCost(s, d)) return toast(`The trip costs ${M(G.travelCost(s, d))}.`, 'bad');
    const ov = document.createElement('div');
    ov.className = 'travel-ov';
    ov.innerHTML = `${art('scene_travel', 'fill')}<div class="txt"><small>DAY ${s.day + G.travelDays(s, d)}</small><strong>${esc(d.name)}</strong></div>`;
    $('#app').append(ov);
    hydrate(ov);
    setTimeout(() => {
      const r = G.travel(s, id);
      ov.remove();
      if (!r.ok) return said(r);
      tab = 'market';
      $('#panel').scrollTop = 0;
      persist();
      render();
      showPending();
    }, 1100);
  }

  // ---------- city services ----------
  const SERVICE_ORDER = ['shark', 'bank', 'stash', 'hospital', 'clinic', 'guns', 'blackmarket', 'recruit', 'fixer', 'supply', 'cars', 'tailor', 'lawyer', 'casino', 'realty', 'luxury'];
  function city() {
    const d = G.district(s.loc);
    const list = SERVICE_ORDER.filter(id => d.services.includes(id));
    return `<div class="sec-h"><h2>${esc(d.name)}</h2><small>${list.length} places to go</small></div>${list.map(service).join('')}
      <div class="sec"><button class="btn wide ghost" data-act="log">Your story so far</button></div>`;
  }
  function svcHead(svc, portrait) {
    const v = G.SERVICES[svc];
    if (portrait) return `<div class="svc-head portrait">${art(v.art, 'square')}<div><h3>${esc(v.name)}</h3><p>${esc(v.blurb)}</p></div></div>`;
    return `<div class="svc-head">${art(v.art, 'wide')}</div><div class="svc-body" style="padding-bottom:0"><h3>${esc(v.name)}</h3><p>${esc(v.blurb)}</p></div>`;
  }
  const buyBtn = (attrs, price, ok, label, cls = 'green') => `<button class="btn small ${cls}" ${attrs} ${ok ? '' : 'disabled'}>${label || SH(price)}</button>`;
  function gearRows(ids, kind, black) {
    return ids.map(id => {
      const item = kind === 'weapon' ? G.weapon(id) : kind === 'armor' ? G.armor(id) : G.item(id);
      const price = G.priceOf(s, item.price, black), locked = !repOk(item.rep);
      const own = kind === 'weapon' ? s.weapons[id] : kind === 'armor' ? s.armors[id] : s.items[id];
      const stat = kind === 'weapon' ? `Damage <b>${item.dmg}${item.shots > 1 ? '×' + item.shots : ''}</b>${item.splash ? ` · hits <b>${item.splash + 1}</b>` : ''} · Aim <b>${pct(item.acc)}</b>`
        : kind === 'armor' ? `Stops <b>${pct(item.block)}</b> of damage` : esc(item.blurb);
      return `<div class="item ${locked ? 'dim' : ''}">${art(item.art, 'square icon')}<div><div class="nm">${esc(item.name)}</div>
        <div class="st">${stat}${own ? ` · <span class="owned">own ${own}</span>` : ''}${locked ? ' · ' + lockTag(item.rep) : ''}</div></div>
        ${buyBtn(`data-gear="${kind}:${id}:${black ? 1 : 0}"`, price, !locked && s.cash >= price)}</div>`;
    }).join('');
  }
  function service(id) {
    if (id === 'bank') return `<div class="card svc">${svcHead('bank')}<div class="svc-body">
        <div class="kv"><span>In the bank</span><b>${M(s.bank)}</b></div><div class="kv"><span>Interest</span><b>${(G.BANK_RATE * 100).toFixed(1)}% a day</b></div>
        <div class="row" style="margin-top:8px"><button class="btn small cyan" data-act="deposit" ${s.cash < 1 ? 'disabled' : ''}>Deposit</button><button class="btn small" data-act="withdraw" ${s.bank < 1 ? 'disabled' : ''}>Withdraw</button></div></div></div>`;
    if (id === 'shark') {
      const room = Math.max(0, G.sharkLimit(s) - s.debt), late = s.debt && s.day > s.debtDue;
      return `<div class="card svc">${svcHead('shark', true)}<div class="svc-body">
        <div class="kv"><span>You owe</span><b style="color:var(--red)">${M(s.debt)}</b></div>
        <div class="kv"><span>Due</span><b>${s.debt ? (late ? `<span style="color:var(--red)">${s.day - s.debtDue} days late</span>` : `day ${s.debtDue}`) : '—'}</b></div>
        <div class="kv"><span>He'll lend up to</span><b>${M(G.sharkLimit(s))}</b></div>
        <div class="row" style="margin-top:8px"><button class="btn small amber" data-act="repay" ${s.debt && G.repayRoom(s) ? '' : 'disabled'}>Pay back</button><button class="btn small" data-act="borrow" ${room ? '' : 'disabled'}>Borrow</button></div>
        <p class="note" style="margin-top:6px">He takes cash or a transfer from your bank.</p></div></div>`;
    }
    if (id === 'hospital' || id === 'clinic') {
      const c = G.healCost(s);
      return `<div class="card svc">${svcHead(id, id === 'clinic')}<div class="svc-body">
        <div class="kv"><span>Missing health (you + crew)</span><b>${c.missing} HP</b></div><div class="kv"><span>Price</span><b>${M(c.per)} per HP</b></div>
        <button class="btn wide green" style="margin-top:8px" data-act="heal" ${c.missing ? '' : 'disabled'}>${c.missing ? `Patch everyone up · ${M(c.total)}` : 'Everyone is healthy'}</button></div></div>`;
    }
    if (id === 'guns') {
      const sh = G.shopHere(s);
      if (!sh) return '';
      return `<div class="card svc">${svcHead('guns', true)}<div class="svc-body"><p class="note">Today's stock. The best piece goes to you, then down the crew: one weapon and one armor each.</p>
        <div class="items">${gearRows(sh.guns, 'weapon')}${gearRows(sh.armor, 'armor')}${gearRows(['medkit', 'molotov', 'grenade', 'smoke'], 'item')}</div></div></div>`;
    }
    if (id === 'blackmarket') {
      const sh = G.shopHere(s);
      if (!sh) return '';
      if (!repOk(G.BLACK_REP)) return `<div class="card svc">${svcHead('blackmarket')}<div class="svc-body"><p class="note">A man at the door looks you over and shakes his head. Come back with ${G.BLACK_REP} rep.</p></div></div>`;
      return `<div class="card svc">${svcHead('blackmarket')}<div class="svc-body"><p class="note">Custom and military hardware. Stock changes every day.</p>
        <div class="items">${gearRows(sh.black, 'weapon', true)}${gearRows(sh.blackArmor, 'armor', true)}${gearRows(['grenade', 'smoke'], 'item', true)}</div></div></div>`;
    }
    if (id === 'recruit') {
      const list = G.recruitsHere(s), full = s.crew.length >= G.crewCap(s);
      const rows = list.length ? list.map(r => { const role = G.ROLES[r.role]; return `<div class="item">${art(role.art, 'square icon')}<div><div class="nm">${esc(r.name)}</div>
        <div class="st"><b>${esc(role.name)}</b> · HP ${r.maxHp} · Aim ${pct(r.acc)} · ${M(r.wage)}/day</div><div class="st">${esc(role.perk)}</div></div>
        ${buyBtn(`data-hire="${r.id}"`, r.fee, !full && s.cash >= r.fee, `Hire ${SH(r.fee)}`, 'cyan')}</div>`; }).join('') : '<p class="note">Nobody looking for work today.</p>';
      return `<div class="card svc">${svcHead('recruit')}<div class="svc-body"><p class="note">Crew ${s.crew.length}/${G.crewCap(s)}${full ? ' · a bigger crew needs more rep' : ''}. Hiring costs three days' wages up front.</p><div class="items">${rows}</div></div></div>`;
    }
    if (id === 'fixer') {
      const list = G.offersHere(s);
      const rows = list.length ? list.map(o => `<div class="item contract"><div><div class="nm">${esc(o.title)}</div><div class="st">${esc(o.blurb || '')}</div>
        <div class="st">Pays <b>${M(o.pay)}</b> · ${o.type === 'smuggle' ? `hold ${o.hold} days, deliver within ${o.days - o.hold}` : `${o.days} days`} · +rep</div></div>${buyBtn(`data-accept="${o.id}"`, 0, s.contracts.length < 3, 'Take it', 'cyan')}</div>`).join('') : '<p class="note">No work right now. New contracts every few days.</p>';
      return `<div class="card svc">${svcHead('fixer', true)}<div class="svc-body"><p class="note">Active contracts: ${s.contracts.length}/3 (see Jobs). Miss the deadline and your rep takes the hit.</p><div class="items">${rows}</div></div></div>`;
    }
    if (id === 'supply') {
      const c = G.cratesCarried(s), v = G.vehicle(s.vehicle);
      const rows = G.CRATES.map(cr => { const price = G.cratePrice(s, cr.id); return `<div class="item">${art(cr.art, 'square icon')}<div><div class="nm">${esc(cr.name)}</div>
        <div class="st">+<b>${cr.cap}</b> space · takes <b>${cr.slots}</b> slot${cr.slots > 1 ? 's' : ''} · own ${s.crates[cr.id]}</div></div>${buyBtn(`data-crate="${cr.id}"`, price, s.cash >= price)}</div>`; }).join('');
      return `<div class="card svc">${svcHead('supply')}<div class="svc-body">
        <div class="kv"><span>Your ride</span><b>${esc(v.name)}: ${v.slots} crate slots</b></div>
        <div class="kv"><span>Crates riding with you</span><b>+${c.cap} space · ${c.freeSlots} slot${c.freeSlots === 1 ? '' : 's'} free</b></div>
        ${G.crateCount(s) > c.fit.small + c.fit.medium + c.fit.large ? `<p class="note">${G.crateCount(s) - (c.fit.small + c.fit.medium + c.fit.large)} crates are in storage until you get a bigger ride.</p>` : ''}
        <p class="note">Every crate you own makes the next one 5% pricier.</p><div class="items">${rows}</div></div></div>`;
    }
    if (id === 'cars') {
      const trade = G.tradeIn(s);
      const rows = G.VEHICLES.filter(v => v.price).map(v => { const mine = s.vehicle === v.id, cost = v.price - trade, locked = !repOk(v.rep); return `<div class="item wide-art ${locked ? 'dim' : ''}">${art(v.art, 'wide')}<div><div class="nm">${esc(v.name)}</div>
        <div class="st">Trunk <b>${v.trunk}</b> · <b>${v.slots}</b> crate slots · Getaway <b>+${pct(v.escape)}</b>${v.armor ? ` · Armor <b>+${pct(v.armor)}</b>` : ''}${v.heal ? ' · crew heals faster' : ''}</div>
        ${mine ? '<div class="owned">Your ride</div>' : locked ? lockTag(v.rep) : `<div class="st">Carry with your crates: <b>${G.capacity(s, v.id)}</b></div>`}</div>
        ${buyBtn(`data-car="${v.id}"`, cost, !mine && !locked && s.cash >= cost, mine ? 'Owned' : SH(cost))}</div>`; }).join('');
      return `<div class="card svc">${svcHead('cars')}<div class="svc-body">${trade ? `<p class="note">Your ${esc(G.vehicle(s.vehicle).name)} is worth ${M(trade)} as a trade-in (already taken off).</p>` : '<p class="note">A car also unlocks Border Town.</p>'}<div class="items">${rows}</div></div></div>`;
    }
    if (id === 'tailor') {
      const rows = G.COATS.filter(c => c.price).map(c => { const have = G.coat(s.coat).cap >= c.cap; return `<div class="item ${have ? 'dim' : ''}">${art(c.art, 'square icon')}<div><div class="nm">${esc(c.name)}</div>
        <div class="st">Carry <b>+${c.cap}</b>${c.stealth ? ' · cops find less' : ''}${s.coat === c.id ? ' · <span class="owned">wearing</span>' : ''}</div></div>
        ${buyBtn(`data-coat="${c.id}"`, c.price, !have && s.cash >= c.price, have ? 'Owned' : SH(c.price))}</div>`; }).join('');
      return `<div class="card svc">${svcHead('tailor')}<div class="svc-body"><div class="items">${rows}</div></div></div>`;
    }
    if (id === 'lawyer') {
      const cost = G.heatFixCost(s);
      const official = (k, label, perk) => { const o = G.LAWYER[k]; return `<div class="item ${s[k] ? 'dim' : ''}"><div><div class="nm">${label}</div><div class="st">${perk}${!repOk(o.rep) ? ' · ' + lockTag(o.rep) : ''}</div>${s[k] ? '<div class="owned">On your payroll</div>' : ''}</div>
        ${buyBtn(`data-official="${k}"`, o.price, !s[k] && repOk(o.rep) && s.cash >= o.price, s[k] ? 'Owned' : SH(o.price), 'amber')}</div>`; };
      return `<div class="card svc">${svcHead('lawyer', true)}<div class="svc-body">
        <div class="kv"><span>Your heat</span><b>${Math.round(s.heat)} · ${esc(G.heatTier(s).name)}${s.manhunt ? ` · manhunt ${s.manhunt}d` : ''}</b></div>
        <button class="btn wide amber" style="margin:8px 0" data-act="fixheat" ${s.heat >= 5 && s.cash >= cost ? '' : 'disabled'}>Make it go away (-25 heat, ends manhunts) · ${SH(cost)}</button>
        <div class="items">${official('judge', 'Buy a judge', 'Half the jail time and fines')}${official('chief', 'Buy the Chief of Police', 'Heat cools faster, bribes are cheaper, no safehouse raids')}</div></div></div>`;
    }
    if (id === 'casino') return `<div class="card svc">${svcHead('casino')}<div class="svc-body"><div class="kv"><span>Table limit</span><b>${SH(5000000 + s.rep * 500000)}</b></div>
        <button class="btn wide neon" style="margin-top:8px" data-act="casino" ${s.cash >= 100 ? '' : 'disabled'}>Play roulette</button></div></div>`;
    if (id === 'stash') {
      const st = s.stashes[s.loc];
      if (!st) { const price = G.stashPrice(s.loc); return `<div class="card svc">${svcHead('stash')}<div class="svc-body"><div class="kv"><span>Price here</span><b>${M(price)}</b></div><div class="kv"><span>Holds</span><b>${G.STASH.base} to start</b></div>
        <button class="btn wide amber" style="margin-top:8px" data-act="buystash" ${s.cash >= price ? '' : 'disabled'}>Buy a safehouse in ${esc(G.district(s.loc).name)}</button></div></div>`; }
      return `<div class="card svc">${svcHead('stash')}<div class="svc-body"><div class="kv"><span>Stored</span><b>${G.stashUsed(st)} / ${st.cap}</b></div>
        <div class="row" style="margin-top:8px"><button class="btn small cyan" data-act="stash">Open it</button><button class="btn small" data-act="upstash" ${s.cash >= G.stashUpgradePrice(st) ? '' : 'disabled'}>+${G.STASH.upgrade} room · ${SH(G.stashUpgradePrice(st))}</button></div></div></div>`;
    }
    if (id === 'realty') {
      const rows = G.FRONTS.map(f => { const mine = s.fronts.includes(f.id), lock = !repOk(f.rep); return `<div class="item wide-art ${mine || lock ? 'dim' : ''}">${art(f.art, 'wide')}<div><div class="nm">${esc(f.name)}</div>
        <div class="st">Pays <b>${SH(f.income)}/day</b> · cools heat</div>${mine ? '<div class="owned">Yours</div>' : lock ? lockTag(f.rep) : ''}</div>
        ${buyBtn(`data-front="${f.id}"`, f.price, !mine && !lock && s.cash >= f.price, mine ? 'Owned' : SH(f.price), 'amber')}</div>`; }).join('');
      return `<div class="card svc">${svcHead('realty')}<div class="svc-body"><div class="items">${rows}</div></div></div>`;
    }
    if (id === 'luxury') {
      const rows = G.LUXURIES.map(l => { const mine = s.lux.includes(l.id), lock = !repOk(l.rep); return `<div class="item wide-art ${mine || lock ? 'dim' : ''}">${art(l.art, 'wide')}<div><div class="nm">${esc(l.name)}</div>
        <div class="st">${esc(l.perk)} · +${l.gain} rep</div>${mine ? '<div class="owned">Yours</div>' : lock ? lockTag(l.rep) : ''}</div>
        ${buyBtn(`data-lux="${l.id}"`, l.price, !mine && !lock && s.cash >= l.price, mine ? 'Owned' : SH(l.price), 'amber')}</div>`; }).join('');
      return `<div class="card svc">${svcHead('luxury')}<div class="svc-body"><div class="items">${rows}</div></div></div>`;
    }
    return '';
  }
  // a money slider (bank, shark)
  function openAmount(title, max, label, cls, run) {
    max = Math.floor(max);
    if (max < 1) return;
    let q = max;
    modal(`<div class="sheet-h"><div><h2>${esc(title)}</h2><small>Up to ${M(max)}</small></div></div>
      <div class="qty"><div class="qty-num" id="qn"></div>
        <input type="range" id="qr" min="1" max="${max}" value="${max}" step="${max > 2000 ? Math.max(1, Math.round(max / 500)) : 1}">
        <div class="quick"><button class="btn small" data-q="0.1">10%</button><button class="btn small" data-q="0.25">25%</button><button class="btn small" data-q="0.5">Half</button><button class="btn small" data-q="1">All</button></div></div>
      <div class="m-actions"><button class="btn big ${cls}" id="qok">${esc(label)}</button><button class="btn ghost" data-close>Cancel</button></div>`);
    const upd = () => { $('#qn').textContent = M(q); $('#qr').value = q; };
    $('#qr').oninput = e => { q = Math.min(max, +e.target.value); upd(); };
    document.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { q = Math.max(1, Math.round(max * +b.dataset.q)); upd(); });
    $('#qok').onclick = () => { closeModal(); act(() => run(q)); };
    upd();
  }

  // ---------- safehouse ----------
  function openStash() {
    const st = s.stashes[s.loc];
    if (!st) return;
    const ids = G.DRUGS.map(d => d.id).filter(id => (s.inv[id] && s.inv[id].qty) || (st.inv[id] && st.inv[id].qty));
    const rows = ids.length ? ids.map(id => { const d = G.drug(id), on = s.inv[id] ? s.inv[id].qty : 0, inside = st.inv[id] ? st.inv[id].qty : 0;
      return `<div class="item">${art(d.art, 'square icon')}<div><div class="nm">${esc(d.name)}</div><div class="st">On you <b>${on}</b> · Stashed <b>${inside}</b></div></div>
        <div class="col"><button class="btn small cyan" data-put="${id}" ${on ? '' : 'disabled'}>Stash all</button><button class="btn small" data-take="${id}" ${inside ? '' : 'disabled'}>Take all</button></div></div>`; }).join('')
      : '<p class="note">Nothing here, and nothing on you.</p>';
    modal(`<div class="m-art">${art('svc_stash', 'wide')}</div><div class="m-body"><h2 class="pink">${esc(G.district(s.loc).name)} safehouse</h2>
      <p>${G.stashUsed(st)} / ${st.cap} stored · you can carry ${G.space(s)} more. ${s.heat >= G.STASH.raidHeat && !s.chief ? '<b style="color:var(--red)">Your heat is high: cops may raid it while you\'re away.</b>' : ''}</p></div>
      <div class="help"><div class="items">${rows}</div></div><div class="m-actions"><button class="btn ghost" data-close>Done</button></div>`);
  }

  // ---------- casino ----------
  function openCasino(last) {
    const max = Math.floor(G.maxBet(s));
    if (max < 1) return closeModal();
    let bet = Math.min(max, Math.max(1, last && last.bet ? last.bet : Math.round(max / 10)));
    const res = last && last.r ? `<div class="spin-result ${last.r.color}"><b>${last.r.n}</b><span>${last.r.win > 0 ? `You win ${M(last.r.win)}!` : `You lose ${M(-last.r.win)}.`}</span></div>` : '';
    modal(`<div class="m-art casino-art" id="wheel">${art('casino_wheel', 'wide')}${res}</div>
      <div class="m-body"><h2 class="pink">Roulette</h2><p>Red or black pays even money. Green (zero) pays 35 to 1. Cash: ${M(s.cash)}</p></div>
      <div class="qty"><div class="qty-num" id="qn"></div><input type="range" id="qr" min="1" max="${max}" value="${bet}" step="${max > 2000 ? Math.max(1, Math.round(max / 500)) : 1}">
        <div class="quick"><button class="btn small" data-q="0.05">5%</button><button class="btn small" data-q="0.25">25%</button><button class="btn small" data-q="0.5">Half</button><button class="btn small" data-q="1">All in</button></div></div>
      <div class="m-actions roulette"><button class="btn big red" data-bet="red">Red</button><button class="btn big black" data-bet="black">Black</button><button class="btn big green" data-bet="green">Green 35×</button></div>
      <div class="m-actions"><button class="btn ghost" data-close>Leave the table</button></div>`);
    const upd = () => { $('#qn').textContent = M(bet); $('#qr').value = bet; };
    $('#qr').oninput = e => { bet = Math.min(max, +e.target.value); upd(); };
    document.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { bet = Math.max(1, Math.round(max * +b.dataset.q)); upd(); });
    document.querySelectorAll('[data-bet]').forEach(b => b.onclick = () => {
      document.querySelectorAll('[data-bet]').forEach(x => (x.disabled = true));
      $('#wheel').classList.add('spinning');
      setTimeout(() => {
        const r = G.spin(s, bet, b.dataset.bet);
        if (!r.ok) return said(r);
        popMoney(r.win); persist(); renderHud();
        openCasino({ bet: Math.min(bet, Math.floor(G.maxBet(s))), r });
      }, 1300);
    });
    upd();
  }

  // ---------- crew ----------
  function crew() {
    const squad = G.loadout(s);
    const cards = squad.map(m => {
      const c = s.crew.find(x => x.id === m.id), role = m.boss ? null : G.ROLES[m.role];
      const low = m.hp / m.maxHp < 0.35, stars = c ? G.crewLevel(c) : 0;
      return `<div class="card member">${art(m.art, 'square icon')}
        <div><div class="role">${m.boss ? 'The boss · ' + esc(G.title(s).name) : esc(role.name)}${stars ? ` <span class="stars">${'★'.repeat(stars)}</span>` : ''}</div><div class="nm">${esc(m.name)}</div>
          <div class="gear">${esc(m.weapon.name)} · ${esc(m.armorItem.name)}${c ? ` · ${M(c.wage)}/day` : ''}</div>
          ${role ? `<div class="gear">${esc(role.perk)}</div>` : ''}
          <div class="hpbar"><i class="${low ? 'low' : ''}" style="width:${pct(Math.max(0, m.hp) / m.maxHp)}"></i></div></div>
        ${c ? `<button class="btn small ghost" data-fire="${c.id}">Fire</button>` : ''}</div>`;
    }).join('');
    const guns = Object.entries(s.weapons).map(([id, n]) => `${n}× ${G.weapon(id).name}`).concat(Object.entries(s.armors).map(([id, n]) => `${n}× ${G.armor(id).name}`));
    const items = Object.entries(s.items).map(([id, n]) => `${n}× ${G.item(id).name}`);
    const c = G.cratesCarried(s);
    return `<div class="stats4"><div><span>Crew</span><strong>${s.crew.length}/${G.crewCap(s)}</strong></div><div><span>Firepower</span><strong>${G.firepower(squad)}</strong></div>
        <div><span>Wages</span><strong>${SH(G.wages(s))}</strong></div><div><span>Income</span><strong>${SH(G.income(s))}</strong></div></div>
      <div class="squad">${cards}</div>
      <div class="card svc" style="margin-top:10px"><div class="svc-body"><h3>Armory</h3><p>${guns.length ? esc(guns.join(' · ')) : 'Nothing but your fists.'}</p>
        <h3 style="margin-top:6px">Fight items</h3><p>${items.length ? esc(items.join(' · ')) : 'None. Gun runners sell med kits, molotovs, grenades and smoke.'}</p>
        <div class="kv"><span>Ride</span><b>${esc(G.vehicle(s.vehicle).name)}</b></div><div class="kv"><span>Coat</span><b>${esc(G.coat(s.coat).name)}</b></div>
        <div class="kv"><span>Crates riding</span><b>${c.fit.large}L ${c.fit.medium}M ${c.fit.small}S (+${c.cap})</b></div><div class="kv"><span>Carry</span><b>${G.capacity(s)}</b></div>
        <p class="note" style="margin-top:8px">Wages come out of your cash (then the bank) every morning. Unpaid crew walk. Crew who win fights earn stars: more health and better aim.</p></div></div>`;
  }

  // ---------- jobs ----------
  const oddsCache = {};
  function jobOdds(j) {
    const key = `${j.id}|${s.hp}|${s.crew.map(c => c.id + c.hp + ':' + (c.wins || 0)).join()}|${JSON.stringify(s.weapons)}|${JSON.stringify(s.armors)}|${s.vehicle}`;
    if (oddsCache[j.id] && oddsCache[j.id].key === key) return oddsCache[j.id].v;
    const v = G.odds(s, G.jobFoes(s, j), 120);
    oddsCache[j.id] = { key, v };
    return v;
  }
  function jobs() {
    const here = G.contractsHere(s).map(c => {
      const early = c.type === 'smuggle' && c.ready && s.day < c.ready;
      const ready = (c.type === 'smuggle' && !early) || (c.type === 'deliver' && s.inv[c.drug] && s.inv[c.drug].qty >= c.qty);
      return `<div class="card job contract-here"><div class="job-body"><h3>${esc(c.title)}</h3><p>${c.type === 'deliver' ? `You have ${s.inv[c.drug] ? s.inv[c.drug].qty : 0} of ${c.qty}.` : 'The buyer is waiting.'} Pays ${M(c.pay)}.</p>
        <button class="btn wide green" data-complete="${c.id}" ${ready ? '' : 'disabled'}>${ready ? 'Hand it over' : early ? `Buyer ready on day ${c.ready}` : 'Not enough on you'}</button></div></div>`;
    }).join('');
    const active = s.contracts.filter(c => c.to !== s.loc || c.type === 'hit').map(c => `<div class="kv"><span>${esc(c.title)}</span><b>${c.type === 'smuggle' && c.ready > s.day ? `hold until day ${c.ready} · ` : ''}${esc(G.district(c.to).name)} by day ${c.until}</b></div>`).join('');
    const list = G.jobsHere(s);
    const cards = list.map(j => {
      const info = G.jobInfo(j), f = G.FACTIONS[j.faction];
      const locked = !repOk(info.minRep);
      const odds = j.done || locked ? null : jobOdds(j);
      const ocls = odds === null ? '' : odds >= 0.7 ? 'good' : odds >= 0.4 ? 'ok' : 'bad';
      const loot = [j.cash ? SH(j.cash) : null, j.drugQty ? `${j.drugQty} ${G.drug(j.drug).name}` : null].filter(Boolean).join(' + ') || '—';
      const special = j.type === 'turf' || j.type === 'boss';
      return `<div class="card job ${j.done ? 'done' : ''} ${special ? 'special' : ''}">${art(info.art, special && j.type === 'boss' ? 'wide' : 'wide')}<div class="job-body">
        <h3>${esc(info.name)}</h3><p>${esc(info.blurb)}</p>
        <div class="facts"><div><span>Against</span><strong>${j.foes.length} ${esc(f.name)}</strong></div><div><span>Take</span><strong>${esc(loot)}</strong></div>
          <div><span>Your odds</span><strong class="odds ${ocls}">${j.done ? 'Done' : locked ? `${info.minRep} rep` : pct(odds)}</strong></div></div>
        <button class="btn wide ${odds !== null && odds >= 0.4 ? 'neon' : 'red'}" data-job="${j.id}" ${j.done || locked ? 'disabled' : ''}>${j.done ? 'Already hit' : locked ? `Needs ${info.minRep} rep` : special ? 'Go to war' : 'Pull the job'}</button>
      </div></div>`;
    }).join('');
    return `${here}${active ? `<div class="card svc"><div class="svc-body"><h3>Your contracts</h3>${active}</div></div>` : ''}
      <div class="sec-h"><h2>Jobs in ${esc(G.district(s.loc).name)}</h2><small>New work every few days</small></div>${cards || '<div class="empty">No work here right now.</div>'}
      <p class="note center">Odds count your health, crew and gear against who's guarding it. Jobs raise heat and rep.</p>`;
  }

  // ---------- empire ----------
  function empire() {
    const t = G.title(s), next = G.nextTitle(s);
    const turfRows = G.DISTRICTS.map(d => {
      const mine = s.turf[d.id], gone = s.beaten[d.faction];
      return `<div class="turf ${mine ? 'mine' : ''}">${art(d.art, 'wide mini')}<div><b>${esc(d.name)}</b><span>${mine ? `Yours · +${SH(d.tribute)}/day` : gone ? 'Up for grabs' : `${esc(G.FACTIONS[d.faction].name)} · war at ${d.turfRep} rep`}</span></div></div>`;
    }).join('');
    const factions = Object.entries(G.FACTIONS).filter(([, f]) => f.boss).map(([id, f]) => {
      const theirs = G.DISTRICTS.filter(d => d.faction === id), owned = theirs.filter(d => s.turf[d.id]).length;
      return `<div class="kv"><span>${esc(f.name)} (${esc(f.boss)})</span><b>${s.beaten[id] ? '<span style="color:var(--green)">Finished</span>' : `${owned}/${theirs.length} districts taken`}</b></div>`;
    }).join('');
    const stashes = Object.entries(s.stashes).map(([d, st]) => `<div class="kv"><span>${esc(G.district(d).name)}</span><b>${G.stashUsed(st)}/${st.cap}</b></div>`).join('');
    const fronts = s.fronts.map(id => `<div class="kv"><span>${esc(G.front(id).name)}</span><b>+${SH(G.front(id).income)}/day</b></div>`).join('');
    const lux = s.lux.map(id => `<div class="kv"><span>${esc(G.lux(id).name)}</span><b>${esc(G.lux(id).perk)}</b></div>`).join('');
    const officials = [s.chief ? 'the Chief of Police' : null, s.judge ? 'Judge Harlan' : null].filter(Boolean);
    const endings = (s.king ? '<button class="btn big neon wide" data-act="king">Take the throne (end the run as King)</button>' : '')
      + (s.lux.includes('island') ? '<button class="btn big cyan wide" data-act="island">Retire to your island</button>' : '');
    return `<div class="card empire-head">${art('empire_map', 'wide')}<div class="job-body">
        <h3>${esc(t.name)}</h3><div class="meter"><i style="width:${pct(next ? (s.rep - t.rep) / (next.rep - t.rep) : 1)}"></i></div>
        <p class="note">${Math.floor(s.rep)} rep${next ? ` · ${esc(next.name)} at ${next.rep}` : ' · the top'}. Net worth ${SH(G.netWorth(s))}. Best ever ${SH(meta.bestNet)}, ${meta.bestDays} days.</p></div></div>
      ${endings ? `<div class="sec" style="display:grid;gap:8px">${endings}</div>` : ''}
      <div class="sec-h"><h2>Turf</h2><small>${Object.keys(s.turf).length}/${G.DISTRICTS.length} districts</small></div>
      <div class="turfs">${turfRows}</div>
      <div class="card svc" style="margin-top:10px"><div class="svc-body"><h3>The families</h3>${factions}
        <p class="note" style="margin-top:6px">Win a district's turf war (Jobs tab) to own it. Own all of a family's districts to face its boss. Own all nine to rule Vice Harbor.</p></div></div>
      <div class="card svc"><div class="svc-body"><h3>Rep unlocks</h3>${repUnlocks()}
        <p class="note" style="margin-top:6px">Earn rep by selling at a profit (bigger loads count more), getting richer, winning fights, pulling jobs, finishing the Fixer's contracts and taking turf. Paying street tax, losing crew to payroll and missing contracts cost rep.</p></div></div>
      ${fronts ? `<div class="card svc"><div class="svc-body"><h3>Businesses</h3>${fronts}</div></div>` : ''}
      ${stashes ? `<div class="card svc"><div class="svc-body"><h3>Safehouses</h3>${stashes}</div></div>` : ''}
      ${lux || officials.length ? `<div class="card svc"><div class="svc-body"><h3>The good life</h3>${lux}${officials.length ? `<div class="kv"><span>On your payroll</span><b>${officials.join(', ')}</b></div>` : ''}</div></div>` : ''}
      <div class="sec"><button class="btn wide ghost" data-act="log">Your story so far</button></div>`;
  }
  function repUnlocks() {
    const rows = [];
    for (const d of G.DRUGS) if (d.rep) rows.push([d.rep, `Deal ${d.name}`]);
    for (const d of G.DISTRICTS) if (d.rep) rows.push([d.rep, `Travel to ${d.name}`]);
    rows.push([G.BLACK_REP, 'The Black Market']);
    for (let n = 2; n <= 10; n++) rows.push([(n - 1) * 10, `A crew of ${n}`]);
    rows.sort((a, b) => a[0] - b[0]);
    const upcoming = rows.filter(r => r[0] > s.rep).slice(0, 6);
    return upcoming.length ? upcoming.map(r => `<div class="kv"><span>${esc(r[1])}</span><b>${r[0]} rep</b></div>`).join('') : '<p class="note">You\'ve unlocked everything rep can buy.</p>';
  }

  // ---------- modals ----------
  function modal(html, cls) {
    const m = $('#modal');
    m.className = 'modal ' + (cls || '');
    $('#modalCard').innerHTML = html;
    m.classList.remove('hidden');
    $('#modalCard').scrollTop = 0;
    hydrate($('#modalCard'));
  }
  function closeModal() { $('#modal').classList.add('hidden'); $('#modalCard').innerHTML = ''; }

  function showPending() {
    if (s.over) return gameOver();
    const p = s.pending;
    if (!p) return closeModal();
    if (p.kind === 'event') {
      modal(`<div class="m-art">${art(p.art, 'wide')}</div><div class="m-body"><h2 class="pink">${esc(p.title)}</h2><p>${esc(p.text)}</p></div>
        <div class="m-actions">${p.choices.map((c, i) => `<button class="btn ${i === 0 ? 'neon big' : 'ghost'}" data-choice="${c.id}">${esc(c.label)}</button>`).join('')}</div>`);
      return;
    }
    if (p.kind === 'fight') return renderFight();
  }

  function renderFight(fx) {
    const p = s.pending;
    if (p.result) return fightResult();
    const squad = G.loadout(s);
    const fac = G.FACTIONS[p.faction];
    const fighter = (m, us) => `<div class="fighter ${m.hp <= 0 ? 'down' : ''}" data-f="${esc(m.name)}">${art(m.art || fac.art, 'square mini')}
      <div style="min-width:0"><div class="fn">${esc(m.name)}${m.lvl ? ` <span class="stars">${'★'.repeat(m.lvl)}</span>` : ''}</div><div class="fw">${us ? (m.hp <= 0 && m.boss ? 'Down! The crew is covering you' : esc(m.weapon.name)) : `${Math.max(0, Math.round(m.hp))} HP`}</div><div class="fb"><i style="width:${pct(Math.max(0, m.hp) / m.maxHp)}"></i></div></div></div>`;
    const log = (p.last || []).map(h => h.item ? `<div class="us">${esc(h.item)}</div>` : h.miss ? `<div class="miss">${esc(h.from)} missed ${esc(h.to)}.</div>`
      : `<div class="${h.side}${h.down ? ' down' : ''}">${esc(h.from)} hit ${esc(h.to)} for ${h.dmg}${h.down ? ` · ${esc(h.to)} is down!` : ''}</div>`).join('') || `<div class="miss">${p.round ? '' : 'Nobody has moved yet.'}</div>`;
    const odds = G.odds(s, p.foes.filter(f => f.hp > 0), 60);
    const jobStart = p.job && !p.round; // before the first shot a job can simply be called off
    const acts = [`<button class="btn big red" data-fight="hit">${p.round ? 'Keep shooting' : 'Fight'}</button>`];
    if (p.canRun && !jobStart) acts.push(`<button class="btn big cyan" data-fight="run">${p.job ? 'Retreat' : 'Run'} · ${pct(G.escapeChance(s))}</button>`);
    if (p.bribe) acts.push(`<button class="btn amber" data-fight="bribe" ${s.cash >= p.bribe ? '' : 'disabled'}>Bribe ${SH(p.bribe)}</button>`);
    if (p.canPayDebt) acts.push(`<button class="btn amber" data-fight="pay" ${s.cash + s.bank >= s.debt ? '' : 'disabled'}>Pay ${SH(s.debt)}</button>`);
    if (p.canSurrender) acts.push(`<button class="btn ghost" data-fight="give">Surrender</button>`);
    else if (p.canGive && (!p.job || jobStart)) acts.push(`<button class="btn ${jobStart ? 'big cyan' : 'ghost'}" data-fight="give">${esc(p.giveLabel || 'Give up')}</button>`);
    if (acts.length % 2) acts[acts.length - 1] = acts[acts.length - 1].replace('class="btn', 'class="btn span');
    const items = G.ITEMS.filter(it => s.items[it.id] > 0).map(it => `<button class="item-btn" data-use="${it.id}" title="${esc(it.blurb)}">${art(it.art, 'square mini')}<span>${esc(it.name)} ×${s.items[it.id]}</span></button>`).join('');
    const tier = fac.cop ? `<span class="chip r3">${esc(G.heatTier(s).name)}</span>` : '';
    modal(`<div class="fight" id="fightBox">
      <div class="fight-top">${art(p.art || fac.art, 'wide')}<div class="shade"></div><div class="ttl">${tier}<h2>${esc(p.title)}</h2><p>${esc(p.text)}</p></div></div>
      <div class="sides"><div class="side us"><h4>Your side</h4>${squad.map(m => fighter(m, true)).join('')}</div>
        <div class="side them"><h4>${esc(fac.name)}</h4>${p.foes.map(m => fighter(m, false)).join('')}</div></div>
      <div class="fight-log">${log}</div>
      ${items ? `<div class="items-row">${items}</div>` : ''}
      <div class="fight-odds">Odds if you fight it out: <b class="odds ${odds >= 0.7 ? 'good' : odds >= 0.4 ? 'ok' : 'bad'}">${pct(odds)}</b>${p.smoke ? ' · smoke is up' : ''}</div>
      <div class="fight-acts">${acts.join('')}</div></div>`, 'full');
    if (fx) {
      const hurt = new Set((p.last || []).filter(h => !h.miss && h.to).map(h => h.to));
      document.querySelectorAll('.fighter').forEach(el => { if (hurt.has(el.dataset.f)) el.classList.add('hit'); });
      if ((p.last || []).some(h => h.side === 'them' && !h.miss)) { const box = $('#modalCard'); box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); }
    }
  }
  function fightResult() {
    const p = s.pending, r = p.result;
    const good = ['won', 'escaped', 'bribed', 'paid', 'released'].includes(r.outcome);
    const pic = r.art || (good ? (r.outcome === 'won' ? 'scene_win' : 'scene_travel') : 'scene_loss');
    const lost = p.fallen && p.fallen.length ? `<p style="color:var(--red)">Lost: ${esc(p.fallen.join(', '))}.</p>` : '';
    modal(`<div class="m-art">${art(pic, 'wide')}</div><div class="m-body"><h2 class="${good ? 'green' : 'red'}">${esc(r.title)}</h2><p>${esc(r.text)}</p>${lost}</div>
      <div class="m-actions"><button class="btn big neon" data-fight="close">Continue</button></div>`, 'center');
    if (KG() && r.outcome === 'won' && p.job) KG().event('job_done', { job: p.job.type, day: s.day });
  }
  function fightAction(kind) {
    const before = s.cash;
    let r;
    if (kind === 'hit') r = G.fight(s);
    else if (kind === 'run') r = G.run(s);
    else if (kind === 'bribe') r = G.bribe(s);
    else if (kind === 'pay') r = G.payDebt(s);
    else if (kind === 'give') r = G.surrender(s);
    else if (kind === 'close') {
      G.closeFight(s); persist(); render();
      if (s.pending || s.over) showPending(); else closeModal();
      return;
    }
    if (r && !r.ok && r.msg) toast(r.msg, 'bad');
    if (kind === 'run' && r && r.ok === true && r.escaped === false) toast('They cut you off!', 'bad');
    if (s.cash !== before) popMoney(s.cash - before);
    persist();
    renderHud();
    if (s.over) return gameOver();
    renderFight(true);
  }
  function useItem(id) {
    const r = G.useItem(s, id);
    if (!r.ok) return;
    persist(); renderHud();
    if (s.over) return gameOver();
    renderFight(true);
  }

  function gameOver() {
    const o = s.over;
    G.closeRun(meta, s);
    persist(true);
    if (KG()) KG().event(o.reason === 'dead' ? 'death' : 'retired', { day: o.day, net: o.net, how: o.reason });
    const titles = { dead: ['WASTED', 'red', 'scene_wasted'], retired: ['Out of the game', 'green', 'scene_retire'], island: ['Paradise', 'green', 'scene_island'], king: ['King of Vice Harbor', 'pink', 'scene_king'] };
    const [title, cls, pic] = titles[o.reason] || titles.retired;
    const text = o.reason === 'dead' ? (s.pending && s.pending.result ? s.pending.result.text : 'Your run is over.')
      : o.reason === 'king' ? `Every district, every family, every cop on the payroll. You took the throne on day ${o.day}.`
      : o.reason === 'island' ? `You fly out on day ${o.day} and never come back. Nobody finds you.` : `You walked away on day ${o.day} with ${M(o.net)}. Smart.`;
    const newDays = o.day >= meta.bestDays, newNet = o.peak >= meta.bestNet;
    modal(`<div class="m-art tall">${art(pic, 'tall')}</div>
      <div class="m-body"><h2 class="${cls}">${esc(title)}</h2><p>${esc(text)}</p>
        <div class="over-stats"><div><span>Days survived</span><strong>${o.day}</strong>${newDays ? '<div class="best">New record!</div>' : ''}</div>
          <div><span>Peak net worth</span><strong>${SH(o.peak)}</strong>${newNet ? '<div class="best">New record!</div>' : ''}</div>
          <div><span>Turf held</span><strong>${o.turf || 0}/9</strong></div><div><span>Jobs pulled</span><strong>${s.stats.jobs}</strong></div></div></div>
      <div class="m-actions"><button class="btn big neon" data-act="again">New game</button><button class="btn ghost" data-act="totitle">Title screen</button></div>`, 'full');
  }

  function help(first) {
    modal(`<div class="m-body"><h2 class="pink">${first ? 'Welcome to Vice Harbor' : 'How to play'}</h2></div><div class="help">
      <p>You've got <b>${M(G.START.cash)}</b>, a baseball bat, and a <b>${M(G.START.debt)}</b> debt to Vinnie the Shark at 5% a day. Pay him at his office, <b>Downtown</b> or on <b>The Strip</b>.</p>
      <h3>Make money</h3><ul><li><b>Market</b>: buy cheap, travel, sell high. Big orders move the price, so spread your loads around.</li>
        <li><b>Rep</b> decides who deals with you: the expensive product needs a name. Profit, jobs and fights earn rep.</li>
        <li>Carry more with coats, a ride, and <b>crates</b> from Harbor Supply. Bigger rides strap down more crates. Store product in <b>safehouses</b>.</li></ul>
      <h3>Stay alive</h3><ul><li><b>Heat</b> rises when you deal near cops. Kane, then the Narcotics Squad, then <b>SWAT</b>, then the <b>Feds</b>. The hotter you are, the harder they are to fight or outrun.</li>
        <li>Beat the cops and you start a <b>manhunt</b>. Marty the lawyer (Downtown) can make heat go away.</li>
        <li>Your crew fights beside you. You only die if everyone on your side goes down.</li>
        <li>Fight items (med kits, molotovs, grenades, smoke) can turn a fight.</li></ul>
      <h3>Build an empire</h3><ul><li><b>Jobs</b>: stash houses, shipments, armored trucks, the bank, the mob's counting room.</li>
        <li><b>Turf wars</b>: take districts from the gangs. They pay you every day. Take a family's last district, then face its boss.</li>
        <li><b>The Fixer</b> has contracts: deliveries, smuggling runs and hits.</li>
        <li>Buy businesses, a judge, the Chief of Police, a yacht, a jet, an island.</li></ul>
      <h3>The scoreboard</h3><p>Two records: your <b>richest net worth</b> and the <b>most days survived</b>. The city gets meaner every day. Retire from the menu, take the throne once you own every district, or fly off to your island.</p>
      </div><div class="m-actions"><button class="btn big neon" data-close>${first ? 'Let\'s go' : 'Got it'}</button></div>`);
  }
  function menu() {
    modal(`<div class="m-body"><h2 class="pink">Menu</h2><p>Day ${s.day} · net worth ${M(G.netWorth(s))} · best ${SH(meta.bestNet)}, ${meta.bestDays} days</p></div>
      <div class="menu-list">
        ${document.fullscreenEnabled ? `<button class="btn" data-act="fullscreen">${document.fullscreenElement ? 'Exit full screen' : 'Full screen'}</button>` : ''}
        <button class="btn" data-act="help">How to play</button>
        <button class="btn" data-act="log">Your story so far</button>
        <button class="btn amber" data-act="retire">Retire and cash out</button>
        <button class="btn ghost" data-act="totitle">Title screen</button>
        ${KG() ? '<button class="btn ghost" data-act="home">&#9664; All games</button>' : ''}
        <button class="btn ghost" data-close>Close</button>
      </div>`);
  }
  function debtInfo() {
    if (!s.debt) return toast('You don\'t owe Vinnie anything.', 'good');
    if (G.has(s, 'shark')) return menuAct('repay');
    modal(`<div class="sheet-h">${art('char_shark', 'square icon')}<div><h2>You owe ${M(s.debt)}</h2><small>${s.day > s.debtDue ? `${s.day - s.debtDue} days late. His boys are looking for you.` : `Due day ${s.debtDue}.`} 5% a day.</small></div></div>
      <div class="m-body"><p>Pay Vinnie at his office: <b>Downtown</b> or <b>The Strip</b> (City tab). He takes cash or a bank transfer.</p></div>
      <div class="m-actions"><button class="btn ghost" data-close>OK</button></div>`);
  }
  function storyLog() {
    const rows = s.log.length ? s.log.map(l => `<div class="${l.tone}"><span>Day ${l.day}</span>${esc(l.text)}</div>`).join('') : '<div>Nothing yet. Go make some history.</div>';
    modal(`<div class="m-body"><h2 class="pink">Your story</h2></div><div class="help log">${rows}</div><div class="m-actions"><button class="btn ghost" data-close>Close</button></div>`);
  }

  // ---------- clicks ----------
  function onClick(e) {
    const b = e.target.closest('button');
    if (!b || b.disabled) return;
    const d = b.dataset;
    if ('close' in d) return closeModal();
    if (d.tab) { tab = d.tab; $('#panel').scrollTop = 0; renderTab(); return; }
    if (d.buy) return openTrade(d.buy, 'buy');
    if (d.sell) return openTrade(d.sell, 'sell');
    if (d.go) return goTo(d.go);
    if (d.gear) { const [kind, id, black] = d.gear.split(':'); return act(() => G.buyGear(s, kind, id, black === '1')); }
    if (d.coat) return act(() => G.buyCoat(s, d.coat));
    if (d.car) return act(() => G.buyVehicle(s, d.car));
    if (d.crate) return act(() => G.buyCrate(s, d.crate));
    if (d.front) return act(() => G.buyFront(s, d.front));
    if (d.lux) return act(() => G.buyLux(s, d.lux));
    if (d.official) return act(() => G.buyOfficial(s, d.official));
    if (d.hire) return act(() => G.hire(s, d.hire));
    if (d.accept) return act(() => G.accept(s, d.accept));
    if (d.complete) return act(() => G.complete(s, d.complete));
    if (d.put) { act(() => G.stashPut(s, d.put, Infinity)); return openStash(); }
    if (d.take) { act(() => G.stashTake(s, d.take, Infinity)); return openStash(); }
    if (d.fire) { if (confirm('Fire this crew member? They won\'t come back.')) act(() => G.fire(s, d.fire)); return; }
    if (d.job) {
      const j = G.jobsHere(s).find(x => x.id === d.job);
      if (j && jobOdds(j) < 0.35 && !confirm(`Your odds are ${pct(jobOdds(j))}. More crew and better gear would help. Go anyway?`)) return;
      const r = G.startJob(s, d.job); if (!r.ok) return said(r); persist(); render(); showPending(); return;
    }
    if (d.choice) { closeModal(); return act(() => G.choose(s, d.choice)); }
    if (d.fight) return fightAction(d.fight);
    if (d.use) return useItem(d.use);
    if (d.act) return menuAct(d.act);
  }
  function menuAct(a) {
    if (a === 'wait') { if (s.pending) return; return act(() => G.wait(s), { quiet: true }); }
    if (a === 'deposit') return openAmount('Deposit cash', s.cash, 'Deposit', 'cyan', q => G.deposit(s, q));
    if (a === 'withdraw') return openAmount('Withdraw cash', s.bank, 'Withdraw', 'green', q => G.withdraw(s, q));
    if (a === 'borrow') return openAmount('Borrow from Vinnie', G.sharkLimit(s) - s.debt, 'Borrow', 'amber', q => G.borrow(s, q));
    if (a === 'repay') return openAmount('Pay Vinnie back', G.repayRoom(s), 'Pay back', 'amber', q => G.repay(s, q));
    if (a === 'heal') return act(() => G.heal(s));
    if (a === 'fixheat') return act(() => G.fixHeat(s));
    if (a === 'buystash') return act(() => G.buyStash(s));
    if (a === 'upstash') return act(() => G.upgradeStash(s));
    if (a === 'stash') return openStash();
    if (a === 'casino') return openCasino();
    if (a === 'help') return help(false);
    if (a === 'log') return storyLog();
    if (a === 'fullscreen') { closeModal(); return toggleFullscreen(); }
    if (a === 'retire' || a === 'king' || a === 'island') {
      const q = { retire: `Retire now with ${M(G.netWorth(s))}? This run ends and goes on your record.`, king: 'Take the throne? This ends your run as the King of Vice Harbor.', island: 'Fly to your island? This ends your run.' }[a];
      if (!confirm(q)) return;
      G.retire(s, a === 'retire' ? 'retired' : a); persist(true); return gameOver();
    }
    if (a === 'again') { closeModal(); return newGame(); }
    if (a === 'totitle') { closeModal(); persist(true); return showTitle(); }
    if (a === 'home') { persist(true); return KG() && KG().home(); }
  }
  // quiet: the automatic try when a phone player taps Play (no complaint if the browser says no)
  function toggleFullscreen(quiet) {
    if (document.fullscreenElement) return document.exitFullscreen();
    const el = document.documentElement;
    (el.requestFullscreen ? el.requestFullscreen({ navigationUI: 'hide' }) : Promise.reject()).then(() => {
      if (screen.orientation && screen.orientation.lock) screen.orientation.lock('portrait').catch(() => {});
    }).catch(() => { if (!quiet) toast('Full screen isn\'t available here. Add the site to your home screen instead.', 'bad'); });
  }

  // ---------- start ----------
  function boot() {
    loadSave();
    document.addEventListener('click', onClick);
    const phone = () => document.fullscreenEnabled && matchMedia('(pointer: coarse)').matches && !document.fullscreenElement;
    $('#newBtn').onclick = () => {
      if (s && !s.over && !confirm(`Start over? Your current run (day ${s.day}) counts toward your records and ends.`)) return;
      newGame();
      if (phone()) toggleFullscreen(true);
    };
    $('#continueBtn').onclick = () => { startGame(); if (phone()) toggleFullscreen(true); };
    $('#helpBtn').onclick = () => help(false);
    $('#homeBtn').onclick = () => KG() && KG().home();
    $('#menuBtn').onclick = menu;
    $('#hDebtBox').onclick = debtInfo;
    $('#modal').addEventListener('click', e => { if (e.target.id === 'modal' && !(s && s.pending) && !(s && s.over)) closeModal(); });
    showTitle();
    report();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(window.DrugWars = window.DrugWars || {});
