// Plays many games with a simple bot to check the rules hold up: node test.js
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
  check(G.carried(s) <= G.capacity(s), `${where}: carrying ${G.carried(s)} > ${G.capacity(s)}`);
  for (const c of s.crew) check(c.hp > 0 && c.hp <= c.maxHp, `${where}: crew hp ${c.hp}/${c.maxHp}`);
};

// every picture the game asks for exists in the art list
const used = new Set();
for (const d of G.DRUGS) used.add(d.art);
for (const d of G.DISTRICTS) used.add(d.art);
for (const v of Object.values(G.SERVICES)) used.add(v.art);
for (const list of [G.WEAPONS, G.ARMOR, G.COATS, G.VEHICLES, G.FRONTS, G.JOBS]) for (const x of list) if (x.art) used.add(x.art);
for (const r of Object.values(G.ROLES)) used.add(r.art);
for (const f of Object.values(G.FACTIONS)) used.add(f.art);
['title', 'char_player', 'scene_travel', 'scene_busted', 'scene_wasted', 'scene_retire', 'scene_win', 'scene_loss', 'evt_stash', 'evt_deal', 'evt_tip'].forEach(k => used.add(k));
for (const k of used) check(G.artOf(k), `art "${k}" is used but not in art.js`);
for (const a of G.ART) check(used.has(a.key), `art "${a.key}" is listed but never used`);

// a bot: buy cheap here, sell where it's dear, gear up, hire, do jobs it can win
function bot(s, meta) {
  for (let step = 0; step < 4000 && !s.over; step++) {
    if (s.pending) {
      const p = s.pending;
      if (p.kind === 'event') { G.choose(s, p.choices[0].id); continue; }
      if (p.result) { G.closeFight(s); continue; }
      if (p.canPayDebt && s.cash + s.bank >= s.debt) { G.payDebt(s); continue; }
      if (p.bribe && s.cash > p.bribe * 3) { G.bribe(s); continue; }
      const odds = G.odds(s, p.foes.filter(f => f.hp > 0), 40);
      // like a sensible player: fight when it's a good bet, give in when it's hopeless and cheap, otherwise run
      if (odds > 0.6) G.fight(s);
      else if ((p.canGive || p.canSurrender) && (odds < 0.25 || s.hp < 35) && p.reason !== 'cops' && !(p.job && p.round)) G.surrender(s);
      else if (p.reason === 'cops' && s.hp < 30) G.surrender(s);
      else if (p.canRun) G.run(s); else G.fight(s);
      finite(s, 'fight');
      continue;
    }
    // sell everything that's above what we paid
    for (const [id, h] of Object.entries(s.inv)) { const p = G.price(s, id); if (p && p * h.qty > h.cost * 1.1) G.sell(s, id, h.qty); }
    if (G.has(s, 'shark') && s.debt > 0) G.repay(s, s.debt);
    if (G.has(s, 'hospital') || G.has(s, 'clinic')) { if (s.hp < 80 || s.crew.some(c => c.hp < c.maxHp * 0.7)) G.heal(s); }
    if (G.has(s, 'guns') && s.cash > 30000) { const w = [...G.WEAPONS].reverse().find(x => x.price && x.price < s.cash / 4); if (w) G.buyWeapon(s, w.id); }
    if (G.has(s, 'tailor')) for (const c of G.COATS) if (c.price && c.price < s.cash / 3) G.buyCoat(s, c.id);
    if (G.has(s, 'cars')) { const v = [...G.VEHICLES].reverse().find(x => x.price && x.price < s.cash / 3 && x.cap > G.vehicle(s.vehicle).cap); if (v) G.buyVehicle(s, v.id); }
    if (G.has(s, 'realty')) for (const f of G.FRONTS) if (f.price < s.cash / 2) G.buyFront(s, f.id);
    if (G.has(s, 'bank') && s.cash > 50000) G.deposit(s, s.cash - 30000);
    for (const r of G.recruitsHere(s).slice()) if (s.crew.length < G.crewCap(s) && s.cash > r.fee * 6) G.hire(s, r.id);
    for (const j of G.jobsHere(s)) if (!j.done && !s.pending && s.rep >= G.job(j.type).minRep && G.odds(s, G.jobFoes(s, j), 40) > 0.75) G.startJob(s, j.id);
    if (s.pending) continue;
    // buy the cheapest-relative product
    const best = G.DRUGS.map(d => ({ d, p: G.price(s, d.id) })).filter(x => x.p && x.p < x.d.lo * 1.05).sort((a, b) => a.p / a.d.lo - b.p / b.d.lo)[0];
    if (best) G.buy(s, best.d.id, G.maxBuy(s, best.d.id));
    finite(s, 'trade');
    if (s.day > 120) { G.retire(s); break; }
    const options = G.DISTRICTS.filter(d => d.id !== s.loc && !G.locked(s, d) && G.travelCost(s, d) <= s.cash);
    const r = options.length ? G.travel(s, G.util.pick(options).id) : G.wait(s);
    check(r.ok, 'travel failed: ' + r.msg);
    finite(s, 'travel');
  }
  G.closeRun(meta, s);
  return s;
}

const meta = G.newMeta(), results = [];
const N = Number(process.argv[2]) || 300;
for (let i = 0; i < N; i++) {
  const s = G.newRun(meta);
  bot(s, meta);
  results.push(s);
  JSON.parse(JSON.stringify(s)); // the save must round-trip
}
const dead = results.filter(s => s.over && s.over.reason === 'dead');
const days = results.map(s => s.day).sort((a, b) => a - b);
const peaks = results.map(s => s.peak).sort((a, b) => a - b);
const q = (arr, f) => arr[Math.floor((arr.length - 1) * f)];
console.log(`${N} bot games: ${dead.length} died, ${N - dead.length} retired at day 120`);
console.log(`days survived  p10 ${q(days, 0.1)}  median ${q(days, 0.5)}  p90 ${q(days, 0.9)}`);
console.log(`peak net worth p10 ${G.short(q(peaks, 0.1))}  median ${G.short(q(peaks, 0.5))}  p90 ${G.short(q(peaks, 0.9))}  max ${G.short(peaks[peaks.length - 1])}`);
const tot = k => results.reduce((n, s) => n + s.stats[k], 0);
console.log(`per game: fights won ${(tot('fightsWon') / N).toFixed(1)}, lost ${(tot('fightsLost') / N).toFixed(2)}, jobs ${(tot('jobs') / N).toFixed(1)}, busts ${(tot('busts') / N).toFixed(1)}, crew lost ${(tot('crewLost') / N).toFixed(1)}`);
console.log(`lifetime records: best ${G.short(meta.bestNet)}, ${meta.bestDays} days`);
if (failures) { console.error(`${failures} check(s) failed`); process.exit(1); }
console.log('all checks passed');
