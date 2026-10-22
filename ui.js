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
  function report() {
    const k = KG();
    if (!k) return;
    k.report({ bestNetWorth: meta.bestNet, bestDays: meta.bestDays, netWorth: s ? G.netWorth(s) : 0, day: s ? s.day : 0, runs: meta.runs, deaths: meta.deaths });
    if (s && !s.over) k.setStatus(`Day ${s.day} · ${G.district(s.loc).name} · ${SH(G.netWorth(s))}`);
  }
  function loadSave() {
    let data = null;
    if (KG()) data = KG().initialSave;
    else { try { data = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) {} }
    const got = G.load(data);
    if (got) { meta = got.meta; s = got.run; }
  }

  // ---------- little UI helpers ----------
  function toast(text, tone) {
    const t = document.createElement('div');
    t.className = 'toast ' + (tone || '');
    t.textContent = text;
    $('#toasts').append(t);
    setTimeout(() => t.remove(), 2700);
  }
  function said(r, goodTone) {
    if (r && r.msg) toast(r.msg, r.ok ? (goodTone || '') : 'bad');
  }
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
    $('#titleFoot').innerHTML = who;
  }
  function startGame() {
    $('#titleScreen').classList.add('hidden');
    $('#gameScreen').classList.remove('hidden');
    lastCash = s.cash;
    render();
    showPending();
  }
  function newGame() {
    if (s && !s.over) { G.closeRun(meta, s); }
    s = G.newRun(meta);
    tab = 'market';
    persist(true);
    startGame();
    G.note(s, 'You owe Vinnie the Shark ' + M(s.debt) + '. He wants it back in ' + G.SHARK.graceDays + ' days.');
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
    if (lastCash !== null && lastCash !== s.cash) { const el = $('.hm.cash'); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
    lastCash = s.cash;
    $('#bHp').style.width = pct(s.hp / s.maxHp); $('#tHp').textContent = Math.round(s.hp);
    $('.bar.hp').classList.toggle('low', s.hp < 35);
    $('#bHeat').style.width = pct(s.heat / 100); $('#tHeat').textContent = Math.round(s.heat);
    $('#bRep').style.width = pct(s.rep / 100); $('#tRep').textContent = Math.round(s.rep);
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
    $('#sceneChips').innerHTML = `<span class="chip r${r}">${['', 'Low', 'Medium', 'High'][r]} risk</span>`
      + `<span class="chip">${d.police >= 0.7 ? 'Heavy' : d.police >= 0.35 ? 'Some' : 'Few'} cops</span>`
      + `<span class="chip">${esc(G.FACTIONS[d.faction].name)}</span>`;
    const news = s.news.map(n => `<em>★</em><b class="${n.tone || ''}">${esc(n.text)}</b>`).join('');
    const ticker = `<span>${news}<em>★</em>${esc(G.CITY)} · Day ${s.day}</span>`;
    if ($('#ticker').dataset.html !== ticker) { $('#ticker').innerHTML = ticker; $('#ticker').dataset.html = ticker; } // keeps scrolling between taps
    // a dot on Jobs when there's work here
    const jobs = G.jobsHere(s).filter(j => !j.done && s.rep >= G.job(j.type).minRep).length;
    const jb = document.querySelector('.tabs [data-tab=jobs]');
    jb.querySelector('.dot')?.remove();
    if (jobs) jb.insertAdjacentHTML('beforeend', '<i class="dot"></i>');
  }
  function renderTab() {
    document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
    const panel = $('#panel');
    panel.innerHTML = ({ market, travel, city, crew, jobs })[tab]();
    hydrate(panel);
  }

  // ---------- market ----------
  function market() {
    const cap = G.capacity(s), used = G.carried(s);
    const news = s.news.filter(n => n.tone).map(n => `<div class="${n.tone}">${esc(n.text)}</div>`).join('');
    const rows = G.DRUGS.map(d => {
      const p = G.price(s, d.id), h = s.inv[d.id];
      const spike = s.news.find(n => n.drug === d.id);
      let tag = '<span class="tag none">Nobody\'s selling</span>';
      if (p) {
        if (spike) tag = `<span class="tag ${spike.tone}">${spike.tone === 'spike' ? 'Price spike!' : 'Crash!'}</span>`;
        else if (p < d.lo * 1.1) tag = '<span class="tag cheap">Cheap</span>';
        else if (p > d.hi * 0.92) tag = '<span class="tag high">Sells high</span>';
        else tag = '<span class="tag none">Normal</span>';
      }
      const avg = h ? h.cost / h.qty : 0;
      const profit = h && p && avg ? Math.round((p - avg) / avg * 100) : null;
      const own = h ? `Own <b>${h.qty}</b>${avg ? ` · paid ${SH(avg)}` : ''}${profit !== null ? ` · <span class="profit ${profit >= 0 ? 'up' : 'down'}">${profit >= 0 ? '+' : ''}${profit}%</span>` : ''}` : 'Own 0';
      const canBuy = p && G.maxBuy(s, d.id) > 0, canSell = p && h;
      return `<div class="card drug ${p ? '' : 'na'}">
        ${art(d.art, 'icon')}
        <div><div class="nm">${esc(d.name)}</div><div class="own">${own}</div></div>
        <div class="pr"><strong>${p ? M(p) : '—'}</strong>${tag}</div>
        <div class="acts">
          <button class="btn small green" data-buy="${d.id}" ${canBuy ? '' : 'disabled'}>Buy</button>
          <button class="btn small red" data-sell="${d.id}" ${canSell ? '' : 'disabled'}>Sell</button>
        </div>
      </div>`;
    }).join('');
    return `<div class="card cap"><span class="note">Carrying</span><div class="meter ${used >= cap ? 'full' : ''}"><i style="width:${pct(Math.min(1, used / cap))}"></i></div><b>${used} / ${cap}</b></div>
      ${news ? `<div class="card news">${news}</div>` : ''}
      <div class="drugs">${rows}</div>
      <div class="sec" style="margin-top:14px"><button class="btn wide ghost" data-act="wait">Lay low for a day (stay in ${esc(G.district(s.loc).name)})</button></div>`;
  }
  function openTrade(id, mode) {
    const d = G.drug(id), p = G.price(s, id), h = s.inv[id];
    const max = mode === 'buy' ? G.maxBuy(s, id) : (h ? h.qty : 0);
    if (!max) return;
    let q = mode === 'buy' ? max : max;
    const avg = h ? h.cost / h.qty : 0;
    modal(`<div class="sheet-h">${art(d.art, 'square icon')}<div><h2>${mode === 'buy' ? 'Buy' : 'Sell'} ${esc(d.name)}</h2><small>${M(p)} each${mode === 'sell' && avg ? ` · you paid ${M(Math.round(avg))}` : ''}</small></div></div>
      <div class="qty">
        <div class="qty-num" id="qn">${q}</div>
        <div class="qty-sub" id="qs"></div>
        <input type="range" id="qr" min="1" max="${max}" value="${q}">
        <div class="quick"><button class="btn small" data-q="1">1</button><button class="btn small" data-q="10">10</button><button class="btn small" data-q="half">Half</button><button class="btn small" data-q="max">Max</button></div>
      </div>
      <div class="m-actions"><button class="btn big ${mode === 'buy' ? 'green' : 'red'}" id="qok"></button><button class="btn ghost" data-close>Cancel</button></div>`);
    const upd = () => {
      $('#qn').textContent = q;
      $('#qr').value = q;
      const total = q * p;
      let sub = `Total <b>${M(total)}</b>`;
      if (mode === 'sell' && avg) { const pr = Math.round((p - avg) * q); sub += ` · profit <b class="profit ${pr >= 0 ? 'up' : 'down'}">${pr >= 0 ? '+' : ''}${M(pr)}</b>`; }
      if (mode === 'buy') sub += ` · space left <b>${G.space(s) - q}</b>`;
      $('#qs').innerHTML = sub;
      $('#qok').textContent = `${mode === 'buy' ? 'Buy' : 'Sell'} ${q}`;
    };
    $('#qr').oninput = e => { q = +e.target.value; upd(); };
    document.querySelectorAll('[data-q]').forEach(b => b.onclick = () => {
      const v = b.dataset.q; q = v === 'max' ? max : v === 'half' ? Math.max(1, Math.floor(max / 2)) : Math.min(max, +v); upd();
    });
    $('#qok').onclick = () => { closeModal(); act(() => mode === 'buy' ? G.buy(s, id, q) : G.sell(s, id, q)); };
    upd();
  }

  // ---------- travel ----------
  function travel() {
    const cards = G.DISTRICTS.map(d => {
      const here = d.id === s.loc, lock = G.locked(s, d);
      const cost = G.travelCost(s, d), r = riskLevel(d);
      const cheap = Object.entries(d.mult).filter(([, v]) => v < 0.9).map(([k]) => G.drug(k).name).slice(0, 3);
      const high = Object.entries(d.mult).filter(([, v]) => v > 1.15).map(([k]) => G.drug(k).name).slice(0, 3);
      const seen = s.seen[d.id];
      return `<button class="dest ${here ? 'here' : ''} ${lock ? 'locked' : ''}" data-go="${d.id}" ${here ? 'disabled' : ''}>
        ${art(d.art, 'wide')}${lock ? `<span class="lock">${esc(lock)}</span>` : ''}
        <div class="info"><div class="nm">${esc(d.name)}</div>
          <div class="meta"><span>${riskBars(r)} ${['', 'Safe-ish', 'Risky', 'Deadly'][r]}</span><span>${M(cost)}${d.days ? ` · ${d.days} days` : ''}</span></div>
          <div class="hint">${cheap.length ? `Cheap: <b>${cheap.join(', ')}</b>` : ''}${cheap.length && high.length ? '<br>' : ''}${high.length ? `Sells high: <i>${high.join(', ')}</i>` : ''}${seen && !here ? `<br>Last visit: day ${seen.day}` : ''}</div>
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
    ov.innerHTML = `${art('scene_travel', 'fill')}<div class="txt"><small>DAY ${s.day + (d.days || 1)}</small><strong>${esc(d.name)}</strong></div>`;
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
  function city() {
    const d = G.district(s.loc);
    const blocks = d.services.map(id => service(id)).join('');
    const fronts = s.fronts.length ? `<div class="card svc"><div class="svc-body"><h3>Your businesses</h3>${s.fronts.map(id => { const f = G.front(id); return `<div class="kv"><span>${esc(f.name)}</span><b>+${M(f.income)}/day</b></div>`; }).join('')}<p class="note" style="margin-top:6px">Paid into your bank every morning.</p></div></div>` : '';
    return `<div class="sec-h"><h2>${esc(d.name)}</h2><small>${d.services.length} places to go</small></div>${blocks}${fronts}
      <div class="sec"><button class="btn wide ghost" data-act="log">Your story so far</button></div>`;
  }
  function svcHead(svc, portrait) {
    const v = G.SERVICES[svc];
    if (portrait) return `<div class="svc-head portrait">${art(v.art, 'square')}<div><h3>${esc(v.name)}</h3><p>${esc(v.blurb)}</p></div></div>`;
    return `<div class="svc-head">${art(v.art, 'wide')}</div><div class="svc-body" style="padding-bottom:0"><h3>${esc(v.name)}</h3><p>${esc(v.blurb)}</p></div>`;
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
        <div class="row" style="margin-top:8px"><button class="btn small amber" data-act="repay" ${s.debt && s.cash ? '' : 'disabled'}>Pay back</button><button class="btn small" data-act="borrow" ${room ? '' : 'disabled'}>Borrow</button></div></div></div>`;
    }
    if (id === 'hospital' || id === 'clinic') {
      const c = G.healCost(s);
      return `<div class="card svc">${svcHead(id, id === 'clinic')}<div class="svc-body">
        <div class="kv"><span>Missing health (you + crew)</span><b>${c.missing} HP</b></div><div class="kv"><span>Price</span><b>${M(c.per)} per HP</b></div>
        <button class="btn wide green" style="margin-top:8px" data-act="heal" ${c.missing ? '' : 'disabled'}>${c.missing ? `Patch everyone up · ${M(c.total)}` : 'Everyone is healthy'}</button></div></div>`;
    }
    if (id === 'guns') {
      const guns = G.WEAPONS.filter(w => w.price).map(w => `<div class="item">${art(w.art, 'square icon')}<div><div class="nm">${esc(w.name)}</div>
        <div class="st">Damage <b>${w.dmg}${w.shots > 1 ? '×' + w.shots : ''}</b> · Aim <b>${pct(w.acc)}</b>${s.weapons[w.id] ? ` · <span class="owned">own ${s.weapons[w.id]}</span>` : ''}</div></div>
        <button class="btn small green" data-gun="${w.id}" ${s.cash >= w.price ? '' : 'disabled'}>${SH(w.price)}</button></div>`).join('');
      const vests = G.ARMOR.filter(a => a.price).map(a => `<div class="item">${art(a.art, 'square icon')}<div><div class="nm">${esc(a.name)}</div>
        <div class="st">Stops <b>${pct(a.block)}</b> of damage${s.armors[a.id] ? ` · <span class="owned">own ${s.armors[a.id]}</span>` : ''}</div></div>
        <button class="btn small green" data-vest="${a.id}" ${s.cash >= a.price ? '' : 'disabled'}>${SH(a.price)}</button></div>`).join('');
      return `<div class="card svc">${svcHead('guns', true)}<div class="svc-body"><p class="note">The best piece goes to you, then down the crew. One weapon and one armor each.</p><div class="items">${guns}${vests}</div></div></div>`;
    }
    if (id === 'recruit') {
      const list = G.recruitsHere(s);
      const full = s.crew.length >= G.crewCap(s);
      const rows = list.length ? list.map(r => { const role = G.ROLES[r.role]; return `<div class="item">${art(role.art, 'square icon')}<div><div class="nm">${esc(r.name)}</div>
        <div class="st"><b>${esc(role.name)}</b> · HP ${r.maxHp} · Aim ${pct(r.acc)} · ${M(r.wage)}/day</div><div class="st">${esc(role.perk)}</div></div>
        <button class="btn small cyan" data-hire="${r.id}" ${!full && s.cash >= r.fee ? '' : 'disabled'}>Hire ${SH(r.fee)}</button></div>`; }).join('') : '<p class="note">Nobody looking for work today.</p>';
      return `<div class="card svc">${svcHead('recruit')}<div class="svc-body"><p class="note">Crew ${s.crew.length}/${G.crewCap(s)}${full ? ' · earn rep to lead more people' : ''}. Hiring costs three days' wages up front.</p><div class="items">${rows}</div></div></div>`;
    }
    if (id === 'tailor') {
      const rows = G.COATS.filter(c => c.price).map(c => { const have = G.coat(s.coat).cap >= c.cap; return `<div class="item ${have ? 'dim' : ''}">${art(c.art, 'square icon')}<div><div class="nm">${esc(c.name)}</div>
        <div class="st">Carry <b>+${c.cap}</b>${c.stealth ? ' · cops find less' : ''}${s.coat === c.id ? ' · <span class="owned">wearing</span>' : ''}</div></div>
        <button class="btn small green" data-coat="${c.id}" ${!have && s.cash >= c.price ? '' : 'disabled'}>${have ? 'Owned' : SH(c.price)}</button></div>`; }).join('');
      return `<div class="card svc">${svcHead('tailor')}<div class="svc-body"><div class="items">${rows}</div></div></div>`;
    }
    if (id === 'cars') {
      const trade = G.tradeIn(s);
      const rows = G.VEHICLES.filter(v => v.price).map(v => { const mine = s.vehicle === v.id, cost = v.price - trade; return `<div class="item wide-art">${art(v.art, 'wide')}<div><div class="nm">${esc(v.name)}</div>
        <div class="st">Carry <b>+${v.cap}</b> · Getaway <b>+${pct(v.escape)}</b>${v.armor ? ` · Armor <b>+${pct(v.armor)}</b>` : ''}</div>${mine ? '<div class="owned">Your ride</div>' : ''}</div>
        <button class="btn small green" data-car="${v.id}" ${!mine && s.cash >= cost ? '' : 'disabled'}>${mine ? 'Owned' : SH(cost)}</button></div>`; }).join('');
      return `<div class="card svc">${svcHead('cars')}<div class="svc-body">${trade ? `<p class="note">Your ${esc(G.vehicle(s.vehicle).name)} is worth ${M(trade)} as a trade-in (already taken off the prices).</p>` : '<p class="note">A ride also unlocks Border Town.</p>'}<div class="items">${rows}</div></div></div>`;
    }
    if (id === 'realty') {
      const rows = G.FRONTS.map(f => { const mine = s.fronts.includes(f.id), lock = s.rep < f.rep; return `<div class="item wide-art ${mine ? 'dim' : ''}">${art(f.art, 'wide')}<div><div class="nm">${esc(f.name)}</div>
        <div class="st">Pays <b>${M(f.income)}/day</b> · cools heat${lock ? ` · needs ${f.rep} rep` : ''}</div>${mine ? '<div class="owned">Yours</div>' : ''}</div>
        <button class="btn small amber" data-front="${f.id}" ${!mine && !lock && s.cash >= f.price ? '' : 'disabled'}>${mine ? 'Owned' : SH(f.price)}</button></div>`; }).join('');
      return `<div class="card svc">${svcHead('realty')}<div class="svc-body"><div class="items">${rows}</div></div></div>`;
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
        <input type="range" id="qr" min="1" max="${max}" value="${max}" step="${max > 2000 ? 100 : 1}">
        <div class="quick"><button class="btn small" data-q="0.1">10%</button><button class="btn small" data-q="0.25">25%</button><button class="btn small" data-q="0.5">Half</button><button class="btn small" data-q="1">All</button></div></div>
      <div class="m-actions"><button class="btn big ${cls}" id="qok">${esc(label)}</button><button class="btn ghost" data-close>Cancel</button></div>`);
    const upd = () => { $('#qn').textContent = M(q); $('#qr').value = q; };
    $('#qr').oninput = e => { q = Math.min(max, +e.target.value); upd(); };
    document.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { q = Math.max(1, Math.round(max * +b.dataset.q)); upd(); });
    $('#qok').onclick = () => { closeModal(); act(() => run(q)); };
    upd();
  }

  // ---------- crew ----------
  function crew() {
    const squad = G.loadout(s);
    const cards = squad.map(m => {
      const c = s.crew.find(x => x.id === m.id), role = m.boss ? null : G.ROLES[m.role];
      const low = m.hp / m.maxHp < 0.35;
      return `<div class="card member">${art(m.art, 'square icon')}
        <div><div class="role">${m.boss ? 'The boss' : esc(role.name)}</div><div class="nm">${esc(m.name)}</div>
          <div class="gear">${esc(m.weapon.name)} · ${esc(m.armorItem.name)}${c ? ` · ${M(c.wage)}/day` : ''}</div>
          <div class="hpbar"><i class="${low ? 'low' : ''}" style="width:${pct(m.hp / m.maxHp)}"></i></div></div>
        ${c ? `<button class="btn small ghost" data-fire="${c.id}">Fire</button>` : ''}</div>`;
    }).join('');
    const guns = Object.entries(s.weapons).map(([id, n]) => `${n}× ${G.weapon(id).name}`).concat(Object.entries(s.armors).map(([id, n]) => `${n}× ${G.armor(id).name}`));
    return `<div class="stats4"><div><span>Crew</span><strong>${s.crew.length}/${G.crewCap(s)}</strong></div><div><span>Firepower</span><strong>${G.firepower(squad)}</strong></div>
        <div><span>Wages</span><strong>${SH(G.wages(s))}</strong></div><div><span>Income</span><strong>${SH(G.income(s))}</strong></div></div>
      <div class="squad">${cards}</div>
      <div class="card svc" style="margin-top:10px"><div class="svc-body"><h3>Armory</h3><p>${guns.length ? esc(guns.join(' · ')) : 'Nothing but your fists.'}</p>
        <div class="kv"><span>Ride</span><b>${esc(G.vehicle(s.vehicle).name)}</b></div><div class="kv"><span>Coat</span><b>${esc(G.coat(s.coat).name)}</b></div><div class="kv"><span>Carry</span><b>${G.capacity(s)}</b></div>
        <p class="note" style="margin-top:8px">${s.crew.length ? 'Wages come out of your cash (then the bank) every morning. Unpaid crew walk.' : 'Hire crew at the Pool Hall (Docks, Eastside, Lantern Row, Border Town). Rep lets you lead more people.'}</p></div></div>`;
  }

  // ---------- jobs ----------
  const oddsCache = {};
  function jobOdds(j) {
    const key = `${j.id}|${s.day}|${s.hp}|${s.crew.map(c => c.id + c.hp).join()}|${JSON.stringify(s.weapons)}|${JSON.stringify(s.armors)}`;
    if (oddsCache[j.id] && oddsCache[j.id].key === key) return oddsCache[j.id].v;
    const v = G.odds(s, G.jobFoes(s, j), 120);
    oddsCache[j.id] = { key, v };
    return v;
  }
  function jobs() {
    const list = G.jobsHere(s);
    if (!list.length) return '<div class="empty">No work in this district right now.</div>';
    const cards = list.map(j => {
      const def = G.job(j.type), f = G.FACTIONS[j.faction];
      const locked = s.rep < def.minRep;
      const odds = j.done || locked ? null : jobOdds(j);
      const ocls = odds === null ? '' : odds >= 0.7 ? 'good' : odds >= 0.4 ? 'ok' : 'bad';
      const loot = [j.cash ? SH(j.cash) : null, j.drugQty ? `${j.drugQty} ${G.drug(j.drug).name}` : null].filter(Boolean).join(' + ');
      return `<div class="card job ${j.done ? 'done' : ''}">${art(def.art, 'wide')}<div class="job-body">
        <h3>${esc(def.name)}</h3><p>${esc(def.blurb)}</p>
        <div class="facts"><div><span>Against</span><strong>${j.size} ${esc(f.name)}</strong></div><div><span>Take</span><strong>${esc(loot)}</strong></div>
          <div><span>Your odds</span><strong class="odds ${ocls}">${j.done ? 'Done' : locked ? `${def.minRep} rep` : pct(odds)}</strong></div></div>
        <button class="btn wide ${odds !== null && odds >= 0.4 ? 'neon' : 'red'}" data-job="${j.id}" ${j.done || locked ? 'disabled' : ''}>${j.done ? 'Already hit' : locked ? `Needs ${def.minRep} rep` : 'Pull the job'}</button>
      </div></div>`;
    }).join('');
    return `<div class="sec-h"><h2>Jobs in ${esc(G.district(s.loc).name)}</h2><small>New work every few days</small></div>${cards}
      <p class="note" style="text-align:center">Odds count your health, crew and guns. Jobs raise heat and rep.</p>`;
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
      <div style="min-width:0"><div class="fn">${esc(m.name)}</div><div class="fw">${us ? esc(m.weapon.name) : `${Math.max(0, Math.round(m.hp))} HP`}</div><div class="fb"><i style="width:${pct(Math.max(0, m.hp) / m.maxHp)}"></i></div></div></div>`;
    const log = (p.last || []).map(h => h.miss ? `<div class="miss">${esc(h.from)} missed ${esc(h.to)}.</div>`
      : `<div class="${h.side}${h.down ? ' down' : ''}">${esc(h.from)} hit ${esc(h.to)} for ${h.dmg}${h.down ? ` · ${esc(h.to)} is down!` : ''}</div>`).join('') || `<div class="miss">${p.round ? '' : 'Nobody has moved yet.'}</div>`;
    const odds = G.odds(s, p.foes.filter(f => f.hp > 0), 60);
    const acts = [`<button class="btn big red" data-fight="hit">${p.round ? 'Keep shooting' : 'Fight'}</button>`];
    const jobStart = p.job && !p.round; // before the first shot a job can simply be called off
    if (p.canRun && !jobStart) acts.push(`<button class="btn big cyan" data-fight="run">${p.job ? 'Retreat' : 'Run'} · ${pct(G.escapeChance(s))}</button>`);
    if (p.bribe) acts.push(`<button class="btn amber" data-fight="bribe" ${s.cash >= p.bribe ? '' : 'disabled'}>Bribe ${SH(p.bribe)}</button>`);
    if (p.canPayDebt) acts.push(`<button class="btn amber" data-fight="pay" ${s.cash + s.bank >= s.debt ? '' : 'disabled'}>Pay ${SH(s.debt)}</button>`);
    if (p.canSurrender) acts.push(`<button class="btn ghost" data-fight="give">Surrender</button>`);
    else if (p.canGive && (!p.job || jobStart)) acts.push(`<button class="btn ${jobStart ? 'big cyan' : 'ghost'}" data-fight="give">${esc(p.giveLabel || 'Give up')}</button>`);
    if (acts.length % 2) acts[acts.length - 1] = acts[acts.length - 1].replace('class="btn', 'class="btn span');
    modal(`<div class="fight" id="fightBox">
      <div class="fight-top">${art(p.art || fac.art, 'wide')}<div class="shade"></div><div class="ttl"><h2>${esc(p.title)}</h2><p>${esc(p.text)}</p></div></div>
      <div class="sides"><div class="side us"><h4>Your side</h4>${squad.map(m => fighter(m, true)).join('')}</div>
        <div class="side them"><h4>${esc(fac.name)}</h4>${p.foes.map(m => fighter(m, false)).join('')}</div></div>
      <div class="fight-log">${log}</div>
      <div class="fight-odds">Odds if you fight it out: <b class="odds ${odds >= 0.7 ? 'good' : odds >= 0.4 ? 'ok' : 'bad'}">${pct(odds)}</b></div>
      <div class="fight-acts">${acts.join('')}</div></div>`, 'full');
    if (fx) {
      const hurt = new Set((p.last || []).filter(h => !h.miss).map(h => h.to));
      document.querySelectorAll('.fighter').forEach(el => { if (hurt.has(el.dataset.f)) el.classList.add('hit'); });
      if ((p.last || []).some(h => h.side === 'them' && !h.miss)) { const box = $('#modalCard'); box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); }
    }
  }
  function fightResult() {
    const p = s.pending, r = p.result;
    const good = ['won', 'escaped', 'bribed', 'paid'].includes(r.outcome);
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

  function gameOver() {
    const o = s.over;
    G.closeRun(meta, s);
    persist(true);
    if (KG()) KG().event(o.reason === 'dead' ? 'death' : 'retired', { day: o.day, net: o.net });
    const dead = o.reason === 'dead';
    const newDays = o.day >= meta.bestDays, newNet = o.peak >= meta.bestNet;
    modal(`<div class="m-art tall">${art(dead ? 'scene_wasted' : 'scene_retire', 'tall')}</div>
      <div class="m-body"><h2 class="${dead ? 'red' : 'green'}">${dead ? 'WASTED' : 'Out of the game'}</h2>
        <p>${dead ? esc(s.pending && s.pending.result ? s.pending.result.text : 'Your run is over.') : `You walked away on day ${o.day} with ${esc(M(o.net))}. Smart.`}</p>
        <div class="over-stats"><div><span>Days survived</span><strong>${o.day}</strong>${newDays ? '<div class="best">New record!</div>' : ''}</div>
          <div><span>Peak net worth</span><strong>${SH(o.peak)}</strong>${newNet ? '<div class="best">New record!</div>' : ''}</div>
          <div><span>Jobs pulled</span><strong>${s.stats.jobs}</strong></div><div><span>Fights won</span><strong>${s.stats.fightsWon}</strong></div></div></div>
      <div class="m-actions"><button class="btn big neon" data-act="again">New game</button><button class="btn ghost" data-act="totitle">Title screen</button></div>`, 'full');
  }

  function help(first) {
    modal(`<div class="m-body"><h2 class="pink">${first ? 'Welcome to Vice Harbor' : 'How to play'}</h2></div><div class="help">
      <p>You've got <b>${M(G.START.cash)}</b>, a baseball bat, and a <b>${M(G.START.debt)}</b> debt to Vinnie the Shark at 5% a day. Get rich. Stay alive.</p>
      <h3>Make money</h3><ul><li><b>Market</b>: buy where it's cheap, travel, sell where it's high. Watch the news for spikes and crashes.</li>
        <li><b>Travel</b> takes a day. Every district has its own prices, dangers and shops.</li></ul>
      <h3>Stay alive</h3><ul><li>Cops, muggers and rival gangs jump you on the road. <b>Fight</b>, <b>run</b>, <b>bribe</b> or give up.</li>
        <li><b>Heat</b> rises when you deal around cops. High heat brings Detective Kane, then SWAT. Businesses and laying low cool it.</li>
        <li>Heal at a hospital or Doc Wu's. If <b>you</b> go down in a fight with a gang, it's over.</li></ul>
      <h3>Build an empire</h3><ul><li>Buy guns and armor, hire a <b>crew</b>, and pull <b>jobs</b>: rob stash houses, hijack shipments, raid the mob.</li>
        <li><b>Rep</b> unlocks The Strip, Palm Hills, bigger crews, bigger jobs and businesses that pay you every day.</li>
        <li>Pay Vinnie back before day ${1 + G.SHARK.graceDays}, or his boys come looking.</li></ul>
      <h3>The scoreboard</h3><p>Two records: your <b>richest net worth</b> and the <b>most days survived</b>. The city gets meaner every day. Retire from the menu to cash out safely.</p>
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
    if (d.gun) return act(() => G.buyWeapon(s, d.gun));
    if (d.vest) return act(() => G.buyArmor(s, d.vest));
    if (d.coat) return act(() => G.buyCoat(s, d.coat));
    if (d.car) return act(() => G.buyVehicle(s, d.car));
    if (d.front) return act(() => G.buyFront(s, d.front));
    if (d.hire) return act(() => G.hire(s, d.hire));
    if (d.fire) { if (confirm('Fire this crew member? They keep nothing and won\'t come back.')) act(() => G.fire(s, d.fire)); return; }
    if (d.job) {
      const j = G.jobsHere(s).find(x => x.id === d.job);
      if (j && jobOdds(j) < 0.3 && !confirm(`Your odds are ${pct(jobOdds(j))}. Get more crew and better guns first, or go anyway?`)) return;
      const r = G.startJob(s, d.job); if (!r.ok) return said(r); persist(); render(); showPending(); return;
    }
    if (d.choice) { closeModal(); return act(() => G.choose(s, d.choice)); }
    if (d.fight) return fightAction(d.fight);
    if (d.act) return menuAct(d.act);
  }
  function menuAct(a) {
    if (a === 'wait') { if (s.pending) return; return act(() => G.wait(s), { quiet: true }); }
    if (a === 'deposit') return openAmount('Deposit cash', s.cash, 'Deposit', 'cyan', q => G.deposit(s, q));
    if (a === 'withdraw') return openAmount('Withdraw cash', s.bank, 'Withdraw', 'green', q => G.withdraw(s, q));
    if (a === 'borrow') return openAmount('Borrow from Vinnie', G.sharkLimit(s) - s.debt, 'Borrow', 'amber', q => G.borrow(s, q));
    if (a === 'repay') return openAmount('Pay Vinnie back', Math.min(s.cash, s.debt), 'Pay back', 'amber', q => G.repay(s, q));
    if (a === 'heal') return act(() => G.heal(s));
    if (a === 'help') return help(false);
    if (a === 'log') return storyLog();
    if (a === 'fullscreen') { closeModal(); return toggleFullscreen(); }
    if (a === 'retire') {
      if (!confirm(`Retire now with ${M(G.netWorth(s))}? This run ends and goes on your record.`)) return;
      G.retire(s); persist(true); return gameOver();
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
    $('#newBtn').onclick = () => {
      if (s && !s.over && !confirm(`Start over? Your current run (day ${s.day}) counts toward your records and ends.`)) return;
      newGame();
      if (document.fullscreenEnabled && matchMedia('(pointer: coarse)').matches && !document.fullscreenElement) toggleFullscreen(true);
    };
    $('#continueBtn').onclick = () => {
      startGame();
      if (document.fullscreenEnabled && matchMedia('(pointer: coarse)').matches && !document.fullscreenElement) toggleFullscreen(true);
    };
    $('#helpBtn').onclick = () => help(false);
    $('#homeBtn').onclick = () => KG() && KG().home();
    $('#menuBtn').onclick = menu;
    $('#modal').addEventListener('click', e => { if (e.target.id === 'modal' && !(s && s.pending) && !(s && s.over)) closeModal(); });
    showTitle();
    report();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(window.DrugWars = window.DrugWars || {});
