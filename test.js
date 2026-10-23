// Plays many games with a bot to check the rules hold up and to measure the balance: node test.js [games] [days]
'use strict';
global.window = {};
for (const f of ['data.js', 'art.js', 'sim.js']) require('./' + f);
const G = window.DrugWars;

let failures = 0;
const check = (cond, msg) => { if (!cond) { failures++; if (failures < 15) console.error('FAIL:', msg); } };
const finite = (s, where) => {
  for (const k of ['cash', 'bank', 'debt', 'hp', 'heat', 'rep', 'day']) check(Number.isFinite(s[k]), `${where}: ${k} is ${s[k]}`);
  check(s.cash >= 0, `${where}: cash went negative (${s.cash})`);
  check(s.bank >= 0, `${where}: bank went negative (${s.bank})`);
  // crew can be down (0 hp) during a fight; once it's over everyone left is alive
  for (const c of s.crew) check((where === 'fight' ? c.hp >= 0 : c.hp > 0) && c.hp <= c.maxHp, `${where}: crew hp ${c.hp}/${c.maxHp}`);
  for (const [id, h] of Object.entries(s.inv)) check(G.drug(id) && h.qty > 0 && Number.isFinite(h.cost), `${where}: bad inventory ${id}`);
};

// every picture the game asks for exists in the art list, and every listed picture is used
const used = new Set();
const add = k => k && used.add(k);
for (const list of [G.DRUGS, G.DISTRICTS, G.WEAPONS, G.ARMOR, G.ITEMS, G.COATS, G.VEHICLES, G.CRATES, G.FRONTS, G.LUXURIES, G.JOBS]) for (const x of list) add(x.art);
for (const v of Object.values(G.SERVICES)) add(v.art);
for (const r of Object.values(G.ROLES)) add(r.art);
for (const f of Object.values(G.FACTIONS)) { add(f.art); add(f.bossArt); }
['title', 'char_player', 'scene_travel', 'scene_busted', 'scene_wasted', 'scene_retire', 'scene_win', 'scene_loss', 'scene_takeover', 'scene_king', 'scene_island',
 'evt_stash', 'evt_deal', 'evt_tip', 'evt_arms', 'evt_checkpoint', 'evt_reporter', 'evt_cash', 'evt_festival', 'job_turf', 'job_hit', 'casino_wheel', 'empire_map'].forEach(add);
for (const k of used) check(G.artOf(k), `art "${k}" is used but not in art.js`);
for (const a of G.ART) check(used.has(a.key), `art "${a.key}" is listed but never used`);
check(G.ART.slice(0, 77).map(a => a.n).join() === Array.from({ length: 77 }, (_, i) => i + 1).join(), 'the first 77 pictures kept their numbers');

// a reasonable player
function bot(s, meta, maxDays) {
  const milestones = {};
  for (let step = 0; step < 20000 && !s.over; step++) {
    const net = G.netWorth(s);
    for (const m of [1e6, 1e7, 1e8, 1e9]) if (net >= m && !milestones[m]) milestones[m] = s.day;
    if (s.pending) {
      const p = s.pending;
      if (p.kind === 'event') {
        const d = p.data || {};
        const yes = { stash: true, cash: true, festival: true, checkpoint: s.cash > d.fine * 10, skim: true, reporter: s.cash > d.cost * 10,
          deal: s.cash > d.each * d.qty * 2, tip: s.cash > d.cost * 20, coat: s.cash > d.cost * 4, gun: s.cash > d.cost * 5,
          volunteer: G.wages(s) * 30 < s.cash + s.bank }[p.id];
        G.choose(s, p.choices[yes || p.choices.length === 1 ? 0 : 1].id);
        continue;
      }
      if (p.result) { G.closeFight(s); continue; }
      if (p.canPayDebt && s.cash + s.bank >= s.debt) { G.payDebt(s); continue; }
      if (p.bribe && s.cash > p.bribe * 2) { G.bribe(s); continue; }
      if (s.hp < 40 && s.items.medkit) { G.useItem(s, 'medkit'); continue; }
      const odds = G.odds(s, p.foes.filter(f => f.hp > 0), 30);
      if (odds > 0.6) { if (s.items.molotov && p.foes.filter(f => f.hp > 0).length > 3) G.useItem(s, 'molotov'); else G.fight(s); }
      else if (p.reason === 'cops' && odds < 0.3 && G.escapeChance(s) < 0.4) G.surrender(s);
      else if (p.canGive && odds < 0.25 && !(p.job && p.round)) G.surrender(s);
      else if (p.canRun) { if (s.items.smoke && !p.smoke) G.useItem(s, 'smoke'); else G.run(s); }
      else G.fight(s);
      finite(s, 'fight');
      continue;
    }
    // sell what's worth selling, a chunk at a time while the price holds
    for (const [id, h] of Object.entries(s.inv)) {
      if (!G.canTrade(s, id) || !G.sellPrice(s, id)) continue;
      const avg = h.cost / h.qty || G.drug(id).lo;
      let q = h.qty;
      while (q > 0 && G.quoteSell(s, id, q).after < avg * 1.05) q = Math.floor(q / 2);
      if (q > 0 && G.sellPrice(s, id) > avg * 1.12) G.sell(s, id, q);
    }
    if (G.has(s, 'shark') && s.debt > 0 && (s.cash + s.bank > s.debt * 2 || s.day >= s.debtDue - 2)) G.repay(s, s.debt);
    if ((G.has(s, 'hospital') || G.has(s, 'clinic')) && (s.hp < 80 || s.crew.some(c => c.hp < c.maxHp * 0.7))) G.heal(s);
    if (G.has(s, 'lawyer') && s.heat > 55 && s.cash > G.heatFixCost(s) * 3) G.fixHeat(s);
    if (G.has(s, 'lawyer') && !s.chief && s.cash > 80e6) G.buyOfficial(s, 'chief');
    const shop = G.shopHere(s);
    if (shop && G.has(s, 'guns')) {
      for (const id of shop.guns.slice().reverse()) if ((G.weapon(id).rep || 0) <= s.rep && G.priceOf(s, G.weapon(id).price) < s.cash / 5 && Object.values(s.weapons).reduce((a, b) => a + b, 0) <= s.crew.length) { G.buyGear(s, 'weapon', id); break; }
      for (const id of shop.armor.slice().reverse()) if ((G.armor(id).rep || 0) <= s.rep && G.priceOf(s, G.armor(id).price) < s.cash / 6 && Object.values(s.armors).reduce((a, b) => a + b, 0) <= s.crew.length) { G.buyGear(s, 'armor', id); break; }
      if ((s.items.medkit || 0) < 3 && s.cash > 50000) G.buyGear(s, 'item', 'medkit');
      if ((s.items.molotov || 0) < 3 && s.cash > 50000) G.buyGear(s, 'item', 'molotov');
    }
    if (shop && G.has(s, 'blackmarket') && s.rep >= G.BLACK_REP)
      for (const id of shop.black.slice().reverse()) if ((G.weapon(id).rep || 0) <= s.rep && G.priceOf(s, G.weapon(id).price, true) < s.cash / 8) { G.buyGear(s, 'weapon', id, true); break; }
    if (G.has(s, 'tailor')) for (const c of G.COATS) if (c.price && c.price < s.cash / 3) G.buyCoat(s, c.id);
    if (G.has(s, 'cars')) { const v = [...G.VEHICLES].reverse().find(x => x.price && (x.rep || 0) <= s.rep && x.price < s.cash / 3 && G.capacity(s, x.id) > G.capacity(s)); if (v) G.buyVehicle(s, v.id); }
    if (G.has(s, 'supply')) for (let k = 0; k < 6; k++) { const free = G.cratesCarried(s).freeSlots; const c = free >= 3 ? 'large' : free >= 2 ? 'medium' : free >= 1 ? 'small' : null; if (!c || G.cratePrice(s, c) > s.cash / 4) break; G.buyCrate(s, c); }
    if (G.has(s, 'realty')) for (const f of G.FRONTS) if (f.price < s.cash / 2) G.buyFront(s, f.id);
    if (G.has(s, 'luxury')) for (const l of G.LUXURIES) if (l.price < s.cash / 3) G.buyLux(s, l.id);
    if (G.has(s, 'bank') && s.cash > 300000) G.deposit(s, s.cash - 200000);
    if (G.has(s, 'bank') && s.cash < 50000 && s.bank > 0) G.withdraw(s, Math.min(s.bank, 200000));
    for (const r of G.recruitsHere(s).slice()) if (s.crew.length < G.crewCap(s) && s.cash + s.bank > (G.wages(s) + r.wage) * 30) G.hire(s, r.id);
    for (const c of G.contractsHere(s)) G.complete(s, c.id);
    for (const o of G.offersHere(s).slice()) if (o.type !== 'deliver' && s.contracts.length < 1 && s.rep >= 5) G.accept(s, o.id);
    for (const j of G.jobsHere(s)) if (!j.done && !s.pending && s.rep >= G.jobInfo(j).minRep && G.odds(s, G.jobFoes(s, j), 30) > 0.75) G.startJob(s, j.id);
    if (s.pending) continue;
    // buy what's cheap, up to where the price stops being cheap
    const mid = d => (d.lo + d.hi) / 2;
    const best = G.DRUGS.filter(d => G.canTrade(s, d.id) && G.price(s, d.id) && G.price(s, d.id) < mid(d) * 0.75)
      .sort((a, b) => G.price(s, a.id) / mid(a) - G.price(s, b.id) / mid(b))[0];
    if (best) {
      let q = G.maxBuy(s, best.id);
      while (q > 0 && G.quoteBuy(s, best.id, q).after > mid(best) * 0.85) q = Math.floor(q / 2);
      if (q > 0) G.buy(s, best.id, q);
    }
    finite(s, 'trade');
    if (s.day >= maxDays) { G.retire(s); break; }
    const options = G.DISTRICTS.filter(d => d.id !== s.loc && !G.locked(s, d) && G.travelCost(s, d) <= s.cash);
    // head for a contract, or where what we carry sells best, or anywhere
    const job = s.contracts.find(c => options.some(o => o.id === c.to));
    const held = Object.keys(s.inv).sort((a, b) => s.inv[b].cost - s.inv[a].cost)[0];
    const sellAt = held && options.filter(o => (o.mult[held] || 1) > 1.05).sort((a, b) => (b.mult[held] || 1) - (a.mult[held] || 1))[0];
    const dest = job ? job.to : sellAt && Math.random() < 0.7 ? sellAt.id : options.length ? G.util.pick(options).id : null;
    const r = dest ? G.travel(s, dest) : G.wait(s);
    check(r.ok, 'travel failed: ' + r.msg);
    finite(s, 'travel');
  }
  G.closeRun(meta, s);
  s.milestones = milestones;
  return s;
}

const meta = G.newMeta(), results = [];
const N = Number(process.argv[2]) || 200, DAYS = Number(process.argv[3]) || 200;
for (let i = 0; i < N; i++) {
  const s = G.newRun(meta);
  bot(s, meta, DAYS);
  results.push(s);
  JSON.parse(JSON.stringify(s)); // the save must round-trip
}
const q = (arr, f) => arr.length ? arr[Math.floor((arr.length - 1) * f)] : '-';
const dead = results.filter(s => s.over && s.over.reason === 'dead');
const days = results.map(s => s.day).sort((a, b) => a - b);
const peaks = results.map(s => s.peak).sort((a, b) => a - b);
console.log(`${N} bot games (retire at day ${DAYS}): ${dead.length} died`);
console.log(`days survived  p10 ${q(days, 0.1)}  median ${q(days, 0.5)}  p90 ${q(days, 0.9)}`);
console.log(`peak net worth p10 ${G.short(q(peaks, 0.1))}  median ${G.short(q(peaks, 0.5))}  p90 ${G.short(q(peaks, 0.9))}  max ${G.short(peaks[peaks.length - 1])}`);
for (const m of [1e6, 1e7, 1e8, 1e9]) {
  const got = results.map(s => s.milestones[m]).filter(Boolean).sort((a, b) => a - b);
  console.log(`reached ${G.short(m).padEnd(5)} ${String(got.length).padStart(3)} games, on day: median ${q(got, 0.5)}, fastest ${got[0] || '-'}`);
}
const tot = k => results.reduce((n, s) => n + s.stats[k], 0) / N;
const reps = results.map(s => s.rep).sort((a, b) => a - b);
console.log(`per game: fights won ${tot('fightsWon').toFixed(1)}, jobs ${tot('jobs').toFixed(1)}, busts ${tot('busts').toFixed(1)}, crew lost ${tot('crewLost').toFixed(1)}, contracts ${tot('contracts').toFixed(1)}, turf taken ${tot('turfTaken').toFixed(1)}`);
console.log(`rep at the end: median ${q(reps, 0.5)}, p90 ${q(reps, 0.9)}; kings: ${results.filter(s => s.king).length}`);
const deaths = {};
for (const s of dead) { const p = s.pending || {}; const why = `${p.reason}${p.job ? ':' + p.job.type : ''}/${p.faction}`; deaths[why] = (deaths[why] || 0) + 1; }
console.log('killed by:', JSON.stringify(deaths));
if (process.env.STUCK) for (const s of results.filter(x => x.rep < 5).slice(0, 8))
  console.log(`stuck: day ${s.day} rep ${s.rep} cash ${G.short(s.cash)} bank ${G.short(s.bank)} debt ${G.short(s.debt)} heat ${Math.round(s.heat)} busts ${s.stats.busts} sold ${G.short(s.stats.sold)} bought ${G.short(s.stats.bought)} crew ${s.crew.length} cap ${G.capacity(s)} log: ${s.log.slice(0, 4).map(l => l.text).join(' | ')}`);
if (failures) { console.error(`${failures} check(s) failed`); process.exit(1); }
console.log('all checks passed');
