// A strong, careful bot that plays for $1B, to check the late-game balance: node tools/pro-bot.js [games] [max days]
'use strict';
global.window = {};
const dir = require('path').join(__dirname, '..');
for (const f of ['data.js', 'art.js', 'sim.js']) require(dir + '/' + f);
const G = window.DrugWars;
const N = Number(process.argv[2]) || 20, MAXDAY = Number(process.argv[3]) || 700;
const mid = d => (d.lo + d.hi) / 2;

function liquid(s) { return s.cash + s.bank; }
function needCash(s, amt) { // pull from the bank when we're at one
  if (s.cash >= amt) return true;
  if (G.has(s, 'bank') && s.cash + s.bank >= amt) { G.withdraw(s, amt - s.cash); return true; }
  return false;
}

// give whoever has the weakest gun (or vest) something clearly better, while it's affordable
const gunScore = w => w.dmg * w.shots * w.acc * (1 + (w.splash || 0) * 0.6);
function upgradeFor(s) {
  return function (ids, kind, black) {
    let bought = 0;
    for (let k = 0; k < 12; k++) {
      const squad = G.loadout(s);
      const worst = kind === 'weapon' ? squad.reduce((a, m) => (gunScore(m.weapon) < gunScore(a.weapon) ? m : a)) : squad.reduce((a, m) => (m.armorItem.block < a.armorItem.block ? m : a));
      const items = ids.map(kind === 'weapon' ? G.weapon : G.armor).filter(x => (x.rep || 0) <= s.rep && G.priceOf(s, x.price, black) < liquid(s) * 0.05
        && (kind === 'weapon' ? gunScore(x) > gunScore(worst.weapon) * 1.15 : x.block > worst.armorItem.block));
      const up = items.sort((a, b) => (kind === 'weapon' ? gunScore(b) - gunScore(a) : b.block - a.block))[0];
      if (!up || !needCash(s, G.priceOf(s, up.price, black)) || !G.buyGear(s, kind, up.id, black).ok) break;
      bought++;
    }
    return bought;
  };
}

function play(s, meta) {
  const upgrade = upgradeFor(s);
  const notes = [], mark = {}, firsts = {};
  const first = (k, text) => { if (!firsts[k]) { firsts[k] = s.day; notes.push(`day ${s.day}: ${text}`); } };
  for (let step = 0; step < 60000 && !s.over && s.day < MAXDAY; step++) {
    const net = G.netWorth(s);
    for (const m of [1e5, 1e6, 1e7, 1e8, 5e8, 1e9]) if (net >= m && !mark[m]) mark[m] = { day: s.day, income: G.income(s), rep: Math.floor(s.rep), crew: s.crew.length, cap: G.capacity(s), turf: Object.keys(s.turf).length, fronts: s.fronts.length };
    if (net >= 1e9) break;
    const p = s.pending;
    if (p) {
      if (p.kind === 'event') {
        const d = p.data || {};
        const yes = { stash: true, cash: true, festival: true, contract: true, checkpoint: s.cash > d.fine * 5, skim: true, reporter: s.cash > d.cost * 5,
          deal: s.cash > d.each * d.qty * 1.5, tip: s.cash > d.cost * 10, coat: true, gun: s.cash > d.cost * 4, volunteer: G.wages(s) * 40 < liquid(s) }[p.id];
        const pickId = p.id === 'contract' ? (p.choices.find(c => c.id === 'deliver') || p.choices[0]).id : p.choices[yes || p.choices.length === 1 ? 0 : 1].id;
        G.choose(s, pickId); continue;
      }
      if (p.result) { G.closeFight(s); continue; }
      if (p.canPayDebt && liquid(s) >= s.debt) { G.payDebt(s); continue; }
      if (p.bribe && !p.round && (s.cash >= p.bribe || needCash(s, p.bribe))) { G.bribe(s); continue; }
      if ((s.hp < 50 || s.crew.some(c => c.hp < c.maxHp * 0.35)) && s.items.medkit) { G.useItem(s, 'medkit'); continue; }
      const alive = p.foes.filter(f => f.hp > 0);
      const odds = G.odds(s, alive, 40);
      if (odds > (p.round ? 0.45 : 0.6) || !p.canRun) {
        if (alive.length >= 3 && s.items.grenade) G.useItem(s, 'grenade');
        else if (alive.length >= 4 && s.items.molotov) G.useItem(s, 'molotov');
        else G.fight(s);
      } else if (p.reason === 'cops' && odds < 0.35 && G.escapeChance(s) < 0.4 && p.canSurrender) G.surrender(s);
      else if (p.canGive && odds < 0.2 && !(p.job && p.round)) G.surrender(s);
      else if (s.items.smoke && !p.smoke) G.useItem(s, 'smoke');
      else G.run(s);
      continue;
    }

    // ---- sell the best amounts ----
    for (const id of Object.keys(s.inv)) { const q = G.bestSell(s, id); if (q > 0) G.sell(s, id, q); }
    // ---- money housekeeping ----
    if (G.has(s, 'shark') && s.debt > 0 && liquid(s) > s.debt * 2) G.repay(s, s.debt);
    if ((G.has(s, 'hospital') || G.has(s, 'clinic')) && (s.hp < s.maxHp || s.crew.some(c => c.hp < c.maxHp))) { needCash(s, G.healCost(s).total); G.heal(s); }
    if (G.has(s, 'lawyer') && s.heat > 30 && G.heatFixCost(s) < liquid(s) * 0.1 && needCash(s, G.heatFixCost(s))) { G.fixHeat(s); first('lawyer', 'starts paying the lawyer to keep heat down'); }
    if (G.has(s, 'lawyer') && !s.judge && s.rep >= 35 && liquid(s) > 40e6 && needCash(s, 8e6)) { G.buyOfficial(s, 'judge'); first('judge', 'buys a judge'); }
    if (G.has(s, 'lawyer') && !s.chief && s.rep >= 50 && liquid(s) > 80e6 && needCash(s, 25e6)) { G.buyOfficial(s, 'chief'); first('chief', 'buys the Chief of Police'); }
    // businesses: the compounding engine
    if (G.has(s, 'realty')) for (const f of G.FRONTS) if (!s.fronts.includes(f.id) && s.rep >= f.rep && liquid(s) > f.price * 1.3 && needCash(s, f.price)) { G.buyFront(s, f.id); first('front-' + f.id, `buys ${f.name}`); }
    // carrying: ride, crates, coat
    if (G.has(s, 'cars')) { const v = [...G.VEHICLES].reverse().find(x => x.price && (x.rep || 0) <= s.rep && x.price - G.tradeIn(s) < liquid(s) * 0.25 && G.capacity(s, x.id) > G.capacity(s)); if (v && needCash(s, v.price - G.tradeIn(s))) { G.buyVehicle(s, v.id); first('car-' + v.id, `buys a ${v.name}`); } }
    if (G.has(s, 'supply')) for (let k = 0; k < 20; k++) { const free = G.cratesCarried(s).freeSlots; const c = free >= 3 ? 'large' : free >= 2 ? 'medium' : free >= 1 ? 'small' : null; if (!c || G.cratePrice(s, c) > liquid(s) * 0.08 || !needCash(s, G.cratePrice(s, c))) break; G.buyCrate(s, c); first('crates', 'starts buying crates'); }
    if (G.has(s, 'tailor')) for (const c of G.COATS) if (c.price && c.price < liquid(s) / 4) G.buyCoat(s, c.id);
    // crew and gear
    const roleRank = { shooter: 3, medic: s.crew.some(c => c.role === 'medic') ? 1 : 4, muscle: 2, wheelman: 1.5, smuggler: 1.5, fixer: 1 };
    for (const r of G.recruitsHere(s).slice().sort((a, b) => roleRank[b.role] - roleRank[a.role])) if (s.crew.length < G.crewCap(s) && liquid(s) > (G.wages(s) + r.wage) * 40 && needCash(s, r.fee)) { G.hire(s, r.id); first('crew', 'hires crew'); }
    const shop = G.shopHere(s);
    const nGuns = () => Object.values(s.weapons).reduce((a, b) => a + b, 0), nVests = () => Object.values(s.armors).reduce((a, b) => a + b, 0);
    if (shop && G.has(s, 'guns')) {
      upgrade(shop.guns, 'weapon', false);
      upgrade(shop.armor, 'armor', false);
      for (const it of ['medkit', 'molotov', 'grenade', 'smoke']) while ((s.items[it] || 0) < G.item(it).max && (G.item(it).rep || 0) <= s.rep && liquid(s) > G.item(it).price * 40) { needCash(s, G.item(it).price * 1.2); if (!G.buyGear(s, 'item', it).ok) break; }
    }
    if (shop && G.has(s, 'blackmarket') && s.rep >= G.BLACK_REP) { if (upgrade(shop.black, 'weapon', true)) first('black', 'buys Black Market weapons'); upgrade(shop.blackArmor, 'armor', true); }
    // contracts the Fixer offers
    for (const c of G.contractsHere(s)) G.complete(s, c.id);
    for (const o of G.offersHere(s).slice()) if (s.contracts.length < 2 && (o.type !== 'smuggle' || !o.hot || (s.crew.length >= 6 && s.heat < 30)) && o.type !== 'deliver') { G.accept(s, o.id); first('contracts', 'takes Fixer contracts'); }
    // jobs and turf wars it should win
    for (const j of G.jobsHere(s)) {
      if (j.done || s.pending || s.rep < G.jobInfo(j).minRep) continue;
      const odds = G.odds(s, G.jobFoes(s, j), 40);
      const healthy = s.hp >= s.maxHp * 0.9 && s.crew.every(c => c.hp >= c.maxHp * 0.8);
      if (healthy && odds > 0.92) { G.startJob(s, j.id); if (j.type === 'turf') first('turf', 'starts taking turf'); }
    }
    if (s.pending) continue;
    // ---- buy what's cheap, several products ----
    const working = Math.max(0, liquid(s) * 0.5);
    if (s.cash < working && G.has(s, 'bank')) G.withdraw(s, working - s.cash);
    const deals = G.DRUGS.filter(d => G.canTrade(s, d.id) && G.price(s, d.id) && G.price(s, d.id) < mid(d) * 0.8)
      .sort((a, b) => G.price(s, a.id) / mid(a) - G.price(s, b.id) / mid(b));
    for (const d of deals) { const q = Math.min(G.bestBuy(s, d.id), G.space(s)); if (q > 0) G.buy(s, d.id, q); }
    // bank the rest
    if (G.has(s, 'bank') && s.cash > liquid(s) * 0.6 && s.cash > 500000) G.deposit(s, s.cash - Math.max(200000, liquid(s) * 0.3));
    // ---- go where what we carry sells best (or where a contract is due) ----
    const options = G.DISTRICTS.filter(d => d.id !== s.loc && !G.locked(s, d) && G.travelCost(s, d) <= s.cash);
    if (!options.length) { G.wait(s); continue; }
    // hurt: go get patched up first; hot: lie low
    const hurt = s.hp < s.maxHp * 0.6 || s.crew.some(c => c.hp < c.maxHp * 0.5);
    if (hurt && !G.has(s, 'hospital') && !G.has(s, 'clinic')) { const h = options.filter(d => d.services.includes('hospital') || d.services.includes('clinic')).sort((a, b) => a.risk - b.risk)[0]; if (h) { G.travel(s, h.id); continue; } }
    if (s.heat > 55 && Math.random() < 0.6) { G.wait(s); continue; }
    const job = s.contracts.find(c => options.some(o => o.id === c.to) && (!c.ready || s.day + 1 >= c.ready));
    const value = d => (Object.entries(s.inv).reduce((n, [id, h]) => n + h.qty * mid(G.drug(id)) * (d.mult[id] || 1), 0) + 1) * (s.turf[d.id] ? 1.1 : 1) * (1 - d.risk * 0.5) * (1 - d.police * s.heat / 150) * (0.85 + Math.random() * 0.3);
    const dest = job ? job.to : options.sort((a, b) => value(b) - value(a))[0].id;
    G.travel(s, dest);
  }
  G.closeRun(meta, s);
  return { s, mark, notes };
}

const meta = G.newMeta(), runs = [];
for (let i = 0; i < N; i++) runs.push(play(G.newRun(meta), meta));
const q = (arr, f) => arr.length ? arr[Math.floor((arr.length - 1) * f)] : '-';
console.log(`${N} pro-bot games, up to day ${MAXDAY}: ${runs.filter(r => r.s.over && r.s.over.reason === 'dead').length} died`);
for (const m of [1e5, 1e6, 1e7, 1e8, 5e8, 1e9]) {
  const got = runs.filter(r => r.mark[m]).map(r => r.mark[m]);
  const days = got.map(x => x.day).sort((a, b) => a - b);
  const inc = got.map(x => x.income).sort((a, b) => a - b);
  const reps = got.map(x => x.rep).sort((a, b) => a - b);
  console.log(`${G.short(m).padEnd(6)} reached by ${String(got.length).padStart(2)}/${N}: day median ${q(days, 0.5)} (fastest ${days[0] || '-'}, slowest ${days[days.length - 1] || '-'}) · daily income then ${G.short(q(inc, 0.5) || 0)} · rep ${q(reps, 0.5)}`);
}
const best = runs.slice().sort((a, b) => (a.mark[1e9] ? a.mark[1e9].day : 1e9) - (b.mark[1e9] ? b.mark[1e9].day : 1e9) || b.s.peak - a.s.peak)[0];
console.log('\nbest run, peak ' + G.short(best.s.peak) + ', ended day ' + best.s.day + (best.s.over ? ' (' + best.s.over.reason + ')' : '') + ':');
console.log(best.notes.join('\n'));
const tot = k => (runs.reduce((n, r) => n + r.s.stats[k], 0) / N).toFixed(1);
console.log(`\nper game: jobs ${tot('jobs')}, fights won ${tot('fightsWon')}, busts ${tot('busts')}, contracts ${tot('contracts')}, turf ${tot('turfTaken')}`);
const deaths = {}; for (const r of runs.filter(r => r.s.over && r.s.over.reason === 'dead')) { const p = r.s.pending || {}; const k = (p.reason || '?') + (p.job ? ':' + p.job.type : '') + '/' + p.faction + ' d' + r.s.day; deaths[k] = 1; }
console.log('deaths:', Object.keys(deaths).join(', ') || 'none');
