// ============================================================
//  Drug Wars: the rules. Everything works on one plain state
//  object (which is also the save), with no screen code, so it
//  can be tested on its own (node test.js).
// ============================================================
(function (G) {
  'use strict';
  const SAVE_VERSION = 1;

  // ---------- helpers ----------
  const rnd = (a, b) => a + Math.random() * (b - a);
  const ri = (a, b) => Math.floor(rnd(a, b + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const chance = p => Math.random() < p;
  function weighted(pairs) { // [[item, weight], ...]
    const tot = pairs.reduce((n, p) => n + Math.max(0, p[1]), 0);
    if (tot <= 0) return null;
    let r = Math.random() * tot;
    for (const [item, w] of pairs) { r -= Math.max(0, w); if (r <= 0) return item; }
    return pairs[pairs.length - 1][0];
  }
  const shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  G.util = { rnd, ri, pick, clamp, chance };

  const by = list => Object.fromEntries(list.map(x => [x.id, x]));
  const DRUG = by(G.DRUGS), DIST = by(G.DISTRICTS), WEAPON = by(G.WEAPONS), ARMOR = by(G.ARMOR);
  const COAT = by(G.COATS), VEHICLE = by(G.VEHICLES), FRONT = by(G.FRONTS), JOB = by(G.JOBS);
  G.drug = id => DRUG[id]; G.district = id => DIST[id]; G.weapon = id => WEAPON[id]; G.armor = id => ARMOR[id];
  G.coat = id => COAT[id]; G.vehicle = id => VEHICLE[id]; G.front = id => FRONT[id]; G.job = id => JOB[id];

  // the city gets meaner the longer you last
  G.scale = s => 1 + (s.day - 1) / 45;

  // ---------- a new run ----------
  G.newMeta = () => ({ bestNet: 0, bestDays: 0, runs: 0, deaths: 0, retired: 0 });
  G.newRun = function (meta) {
    const s = {
      v: SAVE_VERSION, day: 1, loc: 'downtown',
      cash: G.START.cash, bank: 0, debt: G.START.debt, debtDue: 1 + G.SHARK.graceDays,
      hp: G.START.hp, maxHp: G.START.hp, heat: 0, rep: 0,
      inv: {}, coat: 'pockets', vehicle: 'feet', weapons: { bat: 1 }, armors: {}, crew: [], fronts: [],
      prices: {}, seen: {}, news: [], jobs: {}, recruits: {}, tip: null,
      pending: null, log: [], over: null, nextId: 1, peak: 0,
      stats: { sold: 0, bought: 0, fightsWon: 0, fightsLost: 0, jobs: 0, busts: 0, crewLost: 0 },
    };
    if (meta) meta.runs++;
    arrive(s, true);
    return s;
  };

  // ---------- carrying ----------
  G.capacity = s => G.START.capacity + COAT[s.coat].cap + VEHICLE[s.vehicle].cap;
  G.carried = s => Object.values(s.inv).reduce((n, h) => n + h.qty, 0);
  G.space = s => Math.max(0, G.capacity(s) - G.carried(s));
  const mid = d => (d.lo + d.hi) / 2;
  G.drugValue = s => Object.entries(s.inv).reduce((n, [id, h]) => n + h.qty * mid(DRUG[id]) * 0.6, 0);
  G.netWorth = s => Math.round(s.cash + s.bank - s.debt + G.drugValue(s)
    + s.fronts.reduce((n, id) => n + FRONT[id].price * 0.5, 0) + VEHICLE[s.vehicle].price * 0.4);
  G.crewCap = s => Math.min(8, 1 + Math.floor(s.rep / 12));
  G.sharkLimit = s => G.SHARK.baseLimit + s.rep * G.SHARK.limitPerRep;
  G.wages = s => s.crew.reduce((n, c) => n + c.wage, 0);
  G.income = s => s.fronts.reduce((n, id) => n + FRONT[id].income, 0);
  G.locked = (s, d) => (d.rep && s.rep < d.rep) ? `Needs ${d.rep} rep` : (d.vehicle && G.VEHICLES.indexOf(VEHICLE[s.vehicle]) < d.vehicle) ? 'Needs a vehicle' : '';

  function note(s, text, tone) {
    s.log.unshift({ day: s.day, text, tone: tone || '' });
    if (s.log.length > 40) s.log.length = 40;
  }
  G.note = note;

  // ---------- prices ----------
  function genPrices(s, dist) {
    const prices = {}, news = [];
    const tip = s.tip && s.tip.dist === dist.id && s.day <= s.tip.until ? s.tip : null;
    const missing = shuffle(G.DRUGS.map(d => d.id)).slice(0, ri(0, 2)); // nobody's holding these today
    for (const d of G.DRUGS) {
      if (missing.includes(d.id) && !(tip && tip.drug === d.id)) { prices[d.id] = null; continue; }
      // log-uniform inside the normal range, then the district's taste
      const base = Math.exp(rnd(Math.log(d.lo), Math.log(d.hi)));
      prices[d.id] = Math.max(1, Math.round(base * (dist.mult[d.id] || 1) * rnd(0.92, 1.08)));
    }
    const avail = G.DRUGS.filter(d => prices[d.id] !== null);
    if (tip) {
      prices[tip.drug] = Math.round(DRUG[tip.drug].hi * rnd(2.6, 4) * (dist.mult[tip.drug] || 1));
      news.push({ tone: 'spike', text: G.SPIKES[tip.drug] + ' (Your tip was good.)' });
      s.tip = null;
    } else if (chance(0.22) && avail.length) {
      const d = pick(avail);
      prices[d.id] = Math.round(DRUG[d.id].hi * rnd(2, 3.6));
      news.push({ tone: 'spike', drug: d.id, text: G.SPIKES[d.id] });
    }
    if (chance(0.2) && avail.length) {
      const d = pick(avail.filter(x => !news.some(n => n.drug === x.id)));
      if (d) { prices[d.id] = Math.max(1, Math.round(DRUG[d.id].lo * rnd(0.2, 0.45))); news.push({ tone: 'crash', drug: d.id, text: G.CRASHES[d.id] }); }
    }
    if (!news.length || chance(0.35)) news.push({ tone: '', text: pick(G.HEADLINES) });
    return { prices, news };
  }
  G.price = (s, id) => (s.prices[s.loc] || {})[id] ?? null;

  // ---------- buying and selling ----------
  G.maxBuy = (s, id) => { const p = G.price(s, id); return p ? Math.max(0, Math.min(G.space(s), Math.floor(s.cash / p))) : 0; };
  G.buy = function (s, id, qty) {
    const p = G.price(s, id);
    qty = Math.floor(qty);
    if (!p || qty < 1) return { ok: false, msg: 'Nobody\'s selling that here.' };
    if (qty > G.space(s)) return { ok: false, msg: 'You can\'t carry that much.' };
    if (qty * p > s.cash) return { ok: false, msg: 'Not enough cash.' };
    s.cash -= qty * p;
    const h = s.inv[id] || (s.inv[id] = { qty: 0, cost: 0 });
    h.qty += qty; h.cost += qty * p;
    s.stats.bought += qty * p;
    addHeat(s, qty * p, 0.35);
    return { ok: true, msg: `Bought ${qty} ${DRUG[id].name} for ${G.money(qty * p)}.` };
  };
  G.sell = function (s, id, qty) {
    const p = G.price(s, id), h = s.inv[id];
    qty = Math.floor(qty);
    if (!h || qty < 1 || qty > h.qty) return { ok: false, msg: 'You don\'t have that many.' };
    if (!p) return { ok: false, msg: 'Nobody\'s buying that here today.' };
    const avg = h.cost / h.qty;
    s.cash += qty * p;
    h.cost -= avg * qty; h.qty -= qty;
    if (h.qty <= 0) delete s.inv[id];
    s.stats.sold += qty * p;
    addHeat(s, qty * p, 1);
    const profit = Math.round((p - avg) * qty);
    if (profit > 50000) gainRep(s, Math.min(4, Math.floor(profit / 50000)));
    return { ok: true, msg: `Sold ${qty} ${DRUG[id].name} for ${G.money(qty * p)} (${profit >= 0 ? '+' : ''}${G.money(profit)}).`, profit };
  };
  function addHeat(s, value, weight) {
    const stealth = COAT[s.coat].stealth || 0;
    s.heat = clamp(s.heat + Math.min(9, value / 12000) * DIST[s.loc].police * weight * (1 - stealth), 0, 100);
  }
  function gainRep(s, n) { s.rep = clamp(s.rep + n, 0, 100); }

  // ---------- days ----------
  function dailyTick(s) {
    s.day++;
    if (s.debt > 0) s.debt = Math.round(s.debt * (1 + G.SHARK.rate));
    if (s.bank > 0) s.bank = Math.round(s.bank * (1 + G.BANK_RATE));
    const inc = G.income(s);
    if (inc) s.bank += inc;
    // payroll: cash first, then the bank; whoever isn't paid walks
    let owed = G.wages(s);
    const fromCash = Math.min(s.cash, owed); s.cash -= fromCash; owed -= fromCash;
    const fromBank = Math.min(s.bank, owed); s.bank -= fromBank; owed -= fromBank;
    while (owed > 0 && s.crew.length) {
      const c = s.crew.reduce((a, b) => (b.wage > a.wage ? b : a));
      s.crew = s.crew.filter(x => x !== c);
      owed -= c.wage;
      note(s, `${c.name} quit. You couldn't make payroll.`, 'bad');
      s.rep = Math.max(0, s.rep - 2);
    }
    const cool = 3 + s.fronts.reduce((n, id) => n + FRONT[id].cool, 0);
    s.heat = clamp(s.heat - cool, 0, 100);
    s.hp = Math.min(s.maxHp, s.hp + 3);
    for (const c of s.crew) c.hp = Math.min(c.maxHp, c.hp + 4);
    s.peak = Math.max(s.peak, G.netWorth(s));
  }

  // land in a district: fresh prices, jobs and recruits
  function arrive(s, quiet) {
    const dist = DIST[s.loc];
    const { prices, news } = genPrices(s, dist);
    s.prices = { [s.loc]: prices };
    s.seen[s.loc] = { day: s.day, prices };
    s.news = news;
    if (!s.jobs[s.loc] || s.day - s.jobs[s.loc].day >= 4) s.jobs[s.loc] = { day: s.day, list: genJobs(s, dist) };
    if (dist.services.includes('recruit') && (!s.recruits[s.loc] || s.recruits[s.loc].day !== s.day)) s.recruits[s.loc] = { day: s.day, list: genRecruits(s, 3) };
    if (!quiet) rollEncounter(s);
  }

  G.travelCost = (s, d) => Math.round(d.travel * (s.vehicle === 'feet' ? 1 : 1.5));
  G.travel = function (s, to) {
    const d = DIST[to];
    if (!d || to === s.loc) return { ok: false, msg: 'You\'re already here.' };
    if (s.pending) return { ok: false, msg: 'Deal with what\'s in front of you first.' };
    const lock = G.locked(s, d);
    if (lock) return { ok: false, msg: lock + '.' };
    const cost = G.travelCost(s, d);
    if (s.cash < cost) return { ok: false, msg: `The trip costs ${G.money(cost)}.` };
    s.cash -= cost;
    const days = d.days || 1;
    for (let i = 0; i < days; i++) dailyTick(s);
    s.loc = to;
    arrive(s);
    s.peak = Math.max(s.peak, G.netWorth(s));
    return { ok: true, days };
  };
  // stay put for a day (prices change, the day passes)
  G.wait = function (s) {
    if (s.pending) return { ok: false, msg: 'Deal with what\'s in front of you first.' };
    dailyTick(s);
    arrive(s);
    return { ok: true };
  };

  // ---------- the boss and the crew in a fight ----------
  const BOSS_ACC = 0.7;
  function rankWeapons(s) {
    const out = [];
    for (const [id, n] of Object.entries(s.weapons)) for (let i = 0; i < n; i++) out.push(WEAPON[id]);
    return out.sort((a, b) => b.dmg * b.shots * b.acc - a.dmg * a.shots * a.acc);
  }
  function rankArmor(s) {
    const out = [];
    for (const [id, n] of Object.entries(s.armors)) for (let i = 0; i < n; i++) out.push(ARMOR[id]);
    return out.sort((a, b) => b.block - a.block);
  }
  // who carries what: the best gear goes to the boss, then the crew in order
  G.loadout = function (s) {
    const guns = rankWeapons(s), vests = rankArmor(s);
    const veh = (VEHICLE[s.vehicle].armor || 0);
    const squad = [{ id: 'boss', name: 'You', boss: true, hp: s.hp, maxHp: s.maxHp, acc: BOSS_ACC, art: 'char_player' }]
      .concat(s.crew.map(c => ({ id: c.id, name: c.name, role: c.role, hp: c.hp, maxHp: c.maxHp, acc: c.acc, art: G.ROLES[c.role].art })));
    squad.forEach((m, i) => {
      m.weapon = guns[i] || WEAPON.fists;
      m.armorItem = vests[i] || ARMOR.none;
      m.armor = Math.min(0.7, m.armorItem.block + veh);
    });
    return squad;
  };
  G.firepower = list => Math.round(list.reduce((n, m) => n + (m.hp > 0 ? (m.weapon ? m.weapon.dmg * m.weapon.shots : m.dmg * (m.shots || 1)) * m.acc * Math.sqrt(m.hp / 60) : 0), 0));

  function makeFoes(s, factionId, count, power) {
    const f = G.FACTIONS[factionId], sc = G.scale(s);
    const hpM = 1 + (sc - 1) * 0.6, dmgM = 1 + (sc - 1) * 0.4;
    return Array.from({ length: count }, (_, i) => {
      const hp = Math.round(f.hp * hpM * (power || 1) * rnd(0.85, 1.15));
      return { id: 'f' + i, name: i === 0 && count > 2 ? `${f.unit} boss` : f.unit, hp, maxHp: hp,
               dmg: f.dmg * dmgM * (power || 1) * (i === 0 && count > 2 ? 1.25 : 1), acc: f.acc, armor: f.armor, shots: 1, art: f.art };
    });
  }

  // one exchange of fire. Both sides shoot with whoever was standing at the start of the round.
  function volley(attackers, defenders, out, side) {
    for (const a of attackers.filter(x => x.hp > 0)) {
      const w = a.weapon || { dmg: a.dmg, acc: a.acc, shots: a.shots || 1 };
      const acc = a.weapon ? a.acc * (w.acc / 0.7) : a.acc;
      for (let k = 0; k < w.shots; k++) {
        const targets = defenders.filter(x => x.hp > 0);
        if (!targets.length) return;
        const t = pick(targets);
        if (chance(clamp(acc, 0.1, 0.95))) {
          const dmg = Math.max(1, Math.round(w.dmg * rnd(0.75, 1.25) * (1 - (t.armor || 0))));
          t.hp = Math.max(0, t.hp - dmg);
          out.push({ side, from: a.name, to: t.name, dmg, down: t.hp === 0 });
        } else out.push({ side, from: a.name, to: t.name, miss: true });
      }
    }
  }
  function exchange(squad, foes) {
    const out = [];
    const sq = squad.map(m => ({ ...m })), fo = foes.map(m => ({ ...m }));
    volley(squad, fo, out, 'us');
    volley(foes, sq, out, 'them');
    squad.forEach((m, i) => { m.hp = sq[i].hp; });
    foes.forEach((m, i) => { m.hp = fo[i].hp; });
    return out;
  }
  // rough odds of winning a fight to the end, by playing it out many times
  G.odds = function (s, foes, tries = 160) {
    let wins = 0;
    for (let t = 0; t < tries; t++) {
      const sq = G.loadout(s).map(m => ({ ...m })), fo = foes.map(m => ({ ...m }));
      for (let r = 0; r < 40; r++) {
        exchange(sq, fo);
        if (!fo.some(x => x.hp > 0)) { wins++; break; }
        if (sq[0].hp <= 0) break;
      }
    }
    return wins / tries;
  };

  // ---------- encounters ----------
  function fightPending(s, o) {
    return { kind: 'fight', round: 0, log: [], ...o };
  }
  function rollEncounter(s) {
    const dist = DIST[s.loc], sc = G.scale(s);
    const carrying = G.carried(s) > 0;
    const ramp = Math.min(1, 0.45 + s.day / 25); // the first couple of weeks are gentler
    const bad = (0.08 + dist.risk * 0.25 + s.heat / 260 + Math.min(0.12, s.day / 500)) * ramp;
    const worth = G.drugValue(s) + s.cash;
    const vinnieDue = s.debt > 0 && s.day > s.debtDue;
    if (vinnieDue && chance(0.45)) return startVinnie(s);
    if (chance(bad)) {
      const type = weighted([
        ['cops', dist.police * (0.35 + s.heat / 35) * (carrying ? 1 : 0.4)],
        ['muggers', dist.risk * 1.1 * (s.cash > 300 ? 1 : 0.3)],
        ['rival', worth > 4000 || s.rep >= 5 ? dist.gang * (0.45 + s.rep / 45) * (carrying || s.rep > 10 ? 1 : 0.4) : 0],
      ]);
      if (type === 'cops') return startCops(s);
      if (type === 'muggers') {
        const n = ri(1, 1 + Math.floor(sc));
        s.pending = fightPending(s, { reason: 'muggers', faction: 'muggers', title: 'Jumped in an alley',
          text: `${n === 1 ? 'A mugger steps' : n + ' muggers step'} out of the dark. "Wallet. Now."`,
          foes: makeFoes(s, 'muggers', n, 1), canRun: true, canGive: true, giveLabel: 'Hand over some cash' });
        return;
      }
      if (type === 'rival') {
        const f = dist.faction, n = Math.min(8, ri(1, 2) + Math.floor(s.rep / 15) + Math.floor((sc - 1) * 1.5));
        s.pending = fightPending(s, { reason: 'rival', faction: f, title: `${G.FACTIONS[f].name} want a word`,
          text: `You're dealing on ${G.FACTIONS[f].name} turf. ${n} of them block the street.`,
          foes: makeFoes(s, f, n, 1), canRun: true, canGive: carrying || s.cash > 0, giveLabel: 'Pay the street tax' });
        return;
      }
    }
    if (chance(0.2)) goodEvent(s);
  }
  function startCops(s) {
    const n = Math.min(6, 1 + Math.floor(s.heat / 22) + (s.day > 40 ? 1 : 0));
    const swat = s.heat >= 70;
    const bribe = Math.round((1500 + s.heat * 450) * G.scale(s) / 100) * 100;
    s.pending = fightPending(s, { reason: 'cops', faction: swat ? 'swat' : 'cops',
      title: swat ? 'SWAT kicks in the door' : 'Detective Kane pulls up',
      text: swat ? `Your heat is through the roof. ${n} SWAT officers, guns up.` : `"Well, well. Turn around, hands on the car." ${n === 1 ? 'Kane is alone.' : `Kane brought ${n - 1} more.`}`,
      foes: makeFoes(s, swat ? 'swat' : 'cops', n, 1), canRun: true, bribe, canSurrender: true });
  }
  function startVinnie(s) {
    const n = ri(2, 3) + Math.floor((s.day - s.debtDue) / 7);
    s.pending = fightPending(s, { reason: 'vinnie', faction: 'vinnie', title: 'Vinnie sends his regards',
      text: `You're ${s.day - s.debtDue} day${s.day - s.debtDue === 1 ? '' : 's'} late on ${G.money(s.debt)}. ${Math.min(n, 8)} leg-breakers are here to collect.`,
      foes: makeFoes(s, 'vinnie', Math.min(n, 8), 1), canRun: true, canPayDebt: true, canGive: true, giveLabel: 'Take the beating' });
  }

  function goodEvent(s) {
    const dist = DIST[s.loc];
    const cheap = G.DRUGS.slice(0, 6);
    const ev = weighted([
      ['stash', 1.2], ['deal', 1.4], ['tip', 1], ['coat', s.coat === 'pockets' ? 0.8 : 0],
      ['volunteer', s.crew.length < G.crewCap(s) ? 0.8 : 0], ['gun', 0.7],
    ]);
    if (ev === 'stash') {
      const d = pick(cheap), qty = ri(4, 18);
      s.pending = { kind: 'event', id: 'stash', art: 'evt_stash', title: 'Somebody dropped their bag',
        text: `A gym bag under a bench. Inside: ${qty} ${d.name}. Nobody's around.`, data: { drug: d.id, qty },
        choices: [{ id: 'take', label: 'Take it' }, { id: 'leave', label: 'Leave it' }] };
    } else if (ev === 'deal') {
      const avail = G.DRUGS.filter(d => G.price(s, d.id));
      const d = pick(avail.length ? avail : cheap);
      const local = G.price(s, d.id) || mid(d);
      const each = Math.max(1, Math.round(local * rnd(0.38, 0.6))), qty = ri(8, 40);
      s.pending = { kind: 'event', id: 'deal', art: 'evt_deal', title: 'A desperate seller',
        text: `A twitchy guy needs cash fast: ${qty} ${d.name} at ${G.money(each)} each. That's way under the street price.`,
        data: { drug: d.id, qty, each }, choices: [{ id: 'buy', label: `Buy (${G.money(each * qty)})` }, { id: 'pass', label: 'Pass' }] };
    } else if (ev === 'tip') {
      const where = pick(G.DISTRICTS.filter(d => d.id !== s.loc && !G.locked(s, d))), d = pick(G.DRUGS);
      const cost = Math.round((300 + s.day * 40) / 50) * 50;
      s.pending = { kind: 'event', id: 'tip', art: 'evt_tip', title: 'The payphone rings',
        text: `"I know something about ${d.name} in ${where.name}. Big. ${G.money(cost)} and it's yours."`,
        data: { dist: where.id, drug: d.id, cost }, choices: [{ id: 'pay', label: `Pay ${G.money(cost)}` }, { id: 'hang', label: 'Hang up' }] };
    } else if (ev === 'coat') {
      const cost = ri(8, 14) * 100;
      s.pending = { kind: 'event', id: 'coat', art: 'gear_trench', title: 'A coat with deep pockets',
        text: `A guy on the corner is selling a trench coat with ${COAT.trench.cap} units of hidden pockets for ${G.money(cost)}.`,
        data: { cost }, choices: [{ id: 'buy', label: `Buy (${G.money(cost)})` }, { id: 'pass', label: 'Pass' }] };
    } else if (ev === 'volunteer') {
      const r = genRecruits(s, 1)[0]; r.fee = 0;
      s.pending = { kind: 'event', id: 'volunteer', art: G.ROLES[r.role].art, title: 'Someone wants in',
        text: `${r.name} (${G.ROLES[r.role].name}) heard about you. "No signing fee. Just pay me ${G.money(r.wage)} a day."`,
        data: { recruit: r }, choices: [{ id: 'hire', label: 'Welcome aboard' }, { id: 'pass', label: 'Not now' }] };
    } else if (ev === 'gun') {
      const w = pick(G.WEAPONS.filter(x => x.price > 0 && x.price < 25000)), cost = Math.round(w.price * rnd(0.45, 0.65) / 50) * 50;
      s.pending = { kind: 'event', id: 'gun', art: w.art, title: 'Fell off a truck',
        text: `A stranger opens his car trunk: a ${w.name} for ${G.money(cost)}. Half the store price.`,
        data: { weapon: w.id, cost }, choices: [{ id: 'buy', label: `Buy (${G.money(cost)})` }, { id: 'pass', label: 'Pass' }] };
    }
    if (dist && s.pending) s.pending.where = dist.id;
  }

  G.choose = function (s, choice) {
    const p = s.pending;
    if (!p || p.kind !== 'event') return { ok: false };
    const d = p.data || {};
    let msg = '';
    if (p.id === 'stash' && choice === 'take') {
      const qty = Math.min(d.qty, G.space(s));
      if (qty > 0) { const h = s.inv[d.drug] || (s.inv[d.drug] = { qty: 0, cost: 0 }); h.qty += qty; msg = `You grabbed ${qty} ${DRUG[d.drug].name}.`; }
      else msg = 'No room to carry it.';
    } else if (p.id === 'deal' && choice === 'buy') {
      const qty = Math.min(d.qty, G.space(s), Math.floor(s.cash / d.each));
      if (qty > 0) { s.cash -= qty * d.each; const h = s.inv[d.drug] || (s.inv[d.drug] = { qty: 0, cost: 0 }); h.qty += qty; h.cost += qty * d.each; msg = `Bought ${qty} ${DRUG[d.drug].name} on the cheap.`; }
      else msg = 'You couldn\'t afford it or carry it.';
    } else if (p.id === 'tip' && choice === 'pay') {
      if (s.cash < d.cost) msg = 'You don\'t have the cash.';
      else { s.cash -= d.cost; s.tip = { dist: d.dist, drug: d.drug, until: s.day + 4 }; msg = `"${DRUG[d.drug].name} in ${DIST[d.dist].name}. Get there in the next few days and you'll thank me."`; }
    } else if (p.id === 'coat' && choice === 'buy') {
      if (s.cash < d.cost) msg = 'You don\'t have the cash.';
      else { s.cash -= d.cost; s.coat = 'trench'; msg = 'More pockets. Nice.'; }
    } else if (p.id === 'volunteer' && choice === 'hire') {
      if (s.crew.length >= G.crewCap(s)) msg = 'Your crew is full.';
      else { s.crew.push(d.recruit); msg = `${d.recruit.name} joins the crew.`; }
    } else if (p.id === 'gun' && choice === 'buy') {
      if (s.cash < d.cost) msg = 'You don\'t have the cash.';
      else { s.cash -= d.cost; s.weapons[d.weapon] = (s.weapons[d.weapon] || 0) + 1; msg = `You picked up a ${WEAPON[d.weapon].name}.`; }
    }
    s.pending = null;
    if (msg) note(s, msg);
    return { ok: true, msg };
  };

  // ---------- fighting ----------
  // the squad as it stands, with the crew's live health
  function liveSquad(s) { return G.loadout(s); }
  function writeBack(s, squad) {
    s.hp = Math.max(0, squad[0].hp);
    for (const m of squad.slice(1)) { const c = s.crew.find(x => x.id === m.id); if (c) c.hp = m.hp; }
  }
  G.fight = function (s) {
    const p = s.pending;
    if (!p || p.kind !== 'fight' || p.result) return { ok: false };
    const squad = liveSquad(s);
    p.round++;
    const hits = exchange(squad, p.foes);
    writeBack(s, squad);
    p.last = hits;
    return checkFight(s);
  };
  G.escapeChance = function (s) {
    const p = s.pending;
    const wheel = s.crew.filter(c => c.role === 'wheelman' && c.hp > 0).length;
    const alive = p ? p.foes.filter(f => f.hp > 0).length : 1;
    return clamp(0.45 + VEHICLE[s.vehicle].escape + wheel * G.ROLES.wheelman.escape - alive * 0.04 + (p && p.faction === 'muggers' ? 0.2 : 0) - (p && p.job ? 0.05 : 0), 0.08, 0.92);
  };
  G.run = function (s) {
    const p = s.pending;
    if (!p || p.kind !== 'fight' || p.result || !p.canRun) return { ok: false };
    if (chance(G.escapeChance(s))) {
      p.result = { outcome: 'escaped', title: 'You got away', text: p.job ? 'You called it off and got out of there.' : 'You lost them in the back streets.' };
      if (p.reason === 'cops') s.heat = clamp(s.heat + 6, 0, 100);
      return { ok: true, escaped: true };
    }
    const squad = liveSquad(s), hits = [];
    const chasers = p.foes.filter(f => f.hp > 0 && chance(0.6)); // only the ones who keep up get a shot
    volley(chasers.length ? chasers : p.foes.filter(f => f.hp > 0).slice(0, 1), squad, hits, 'them');
    writeBack(s, squad);
    p.last = hits; p.round++;
    const r = checkFight(s);
    return { ...r, escaped: false };
  };
  G.bribe = function (s) {
    const p = s.pending;
    if (!p || p.result || !p.bribe) return { ok: false };
    if (s.cash < p.bribe) return { ok: false, msg: `Kane wants ${G.money(p.bribe)}. You don't have it.` };
    s.cash -= p.bribe;
    s.heat = clamp(s.heat - 15, 0, 100);
    p.result = { outcome: 'bribed', title: 'Money talks', text: `Kane counts the ${G.money(p.bribe)}, tips his hat and drives off.` };
    return { ok: true };
  };
  G.payDebt = function (s) {
    const p = s.pending;
    if (!p || p.result || !p.canPayDebt) return { ok: false };
    const total = s.cash + s.bank;
    if (total < s.debt) return { ok: false, msg: `You need ${G.money(s.debt)} between cash and the bank.` };
    const fromCash = Math.min(s.cash, s.debt); s.cash -= fromCash; s.bank -= (s.debt - fromCash);
    s.debt = 0;
    p.result = { outcome: 'paid', title: 'Paid in full', text: '"Pleasure doing business." Vinnie\'s boys straighten your collar and leave.' };
    return { ok: true };
  };
  // give in: what it costs depends on who you're giving in to
  G.surrender = function (s) {
    const p = s.pending;
    if (!p || p.kind !== 'fight' || p.result) return { ok: false };
    if (p.reason === 'cops') return busted(s, 'You put your hands up.');
    if (p.reason === 'muggers') {
      const take = Math.round(s.cash * rnd(0.25, 0.5));
      s.cash -= take;
      p.result = { outcome: 'robbed', title: 'Robbed', text: `They grab ${G.money(take)} and run.` };
    } else if (p.reason === 'rival') {
      const lost = [];
      for (const [id, h] of Object.entries(s.inv)) { const q = Math.ceil(h.qty / 2); h.cost -= h.cost / h.qty * q; h.qty -= q; if (h.qty <= 0) delete s.inv[id]; lost.push(`${q} ${DRUG[id].name}`); }
      const take = Math.round(s.cash * 0.2); s.cash -= take;
      gainRep(s, -3);
      p.result = { outcome: 'robbed', title: 'Street tax paid', text: `They take ${lost.length ? lost.join(', ') + ' and ' : ''}${G.money(take)}. Word gets around.` };
    } else if (p.reason === 'vinnie') {
      const take = Math.min(s.cash, s.debt); s.cash -= take; s.debt -= take;
      s.hp = Math.max(5, s.hp - 30);
      s.debtDue = s.day + 5;
      p.result = { outcome: 'beaten', title: 'A friendly reminder', text: `They take ${G.money(take)} toward the debt and break a couple of fingers. Five more days.` };
    } else if (p.job) {
      if (p.round > 0) return { ok: false, msg: 'Too late to call it off. Fight or retreat.' };
      p.result = { outcome: 'escaped', title: 'Called off', text: 'You back out before anyone gets hurt.' };
    }
    return { ok: true };
  };
  function busted(s, why) {
    const p = s.pending;
    const drugs = G.carried(s);
    const fine = Math.round(Math.min(s.cash, s.cash * 0.4 + drugs * 50));
    const days = Math.min(9, 1 + Math.floor(drugs / 40) + Math.floor(s.heat / 30));
    s.inv = {}; s.cash -= fine;
    s.heat = 10; s.stats.busts++;
    s.hp = Math.max(s.hp, 25);
    for (let i = 0; i < days; i++) dailyTick(s);
    p.result = { outcome: 'busted', title: 'Busted', art: 'scene_busted',
      text: `${why} They take ${drugs ? 'all your product, ' : ''}${G.money(fine)} in "fines", and you sit ${days} day${days === 1 ? '' : 's'} in county lockup.` };
    return { ok: true };
  }
  function checkFight(s) {
    const p = s.pending;
    const squad = G.loadout(s);
    // crew who went down are gone for good
    const fallen = s.crew.filter(c => c.hp <= 0);
    for (const c of fallen) { note(s, `${c.name} didn't make it.`, 'bad'); s.stats.crewLost++; }
    s.crew = s.crew.filter(c => c.hp > 0);
    if (fallen.length) p.fallen = (p.fallen || []).concat(fallen.map(c => c.name));
    if (squad[0].hp <= 0) {
      if (p.reason === 'cops') { s.hp = 1; return busted(s, 'You wake up in handcuffs.'); }
      s.stats.fightsLost++;
      p.result = { outcome: 'dead', title: 'WASTED', text: `${G.FACTIONS[p.faction].name} left you in the street on day ${s.day}.`, art: 'scene_wasted' };
      endRun(s, 'dead');
      return { ok: true, dead: true };
    }
    if (!p.foes.some(f => f.hp > 0)) return winFight(s);
    return { ok: true };
  }
  function winFight(s) {
    const p = s.pending, sc = G.scale(s);
    s.stats.fightsWon++;
    const medic = s.crew.filter(c => c.role === 'medic').length;
    if (medic) {
      const heal = G.ROLES.medic.heal * medic;
      s.hp = Math.min(s.maxHp, s.hp + heal);
      for (const c of s.crew) c.hp = Math.min(c.maxHp, c.hp + heal);
    }
    const gains = [];
    let cash = 0;
    if (p.job) {
      const j = p.job;
      cash = j.cash;
      if (j.drugQty && j.drug) {
        const qty = Math.min(j.drugQty, G.space(s));
        if (qty > 0) { const h = s.inv[j.drug] || (s.inv[j.drug] = { qty: 0, cost: 0 }); h.qty += qty; gains.push(`${qty} ${DRUG[j.drug].name}`); }
        if (qty < j.drugQty) gains.push(`(${j.drugQty - qty} more left behind, no room)`);
      }
      s.heat = clamp(s.heat + JOB[j.type].heat, 0, 100);
      gainRep(s, JOB[j.type].rep);
      s.stats.jobs++;
    } else if (p.reason === 'cops') {
      s.heat = clamp(s.heat + 25, 0, 100); gainRep(s, 6);
    } else if (p.reason === 'muggers') {
      cash = ri(80, 500); gainRep(s, 1);
    } else if (p.reason === 'rival') {
      cash = Math.round(ri(600, 3500) * sc); gainRep(s, 4); s.heat = clamp(s.heat + 5, 0, 100);
      const d = pick(G.DRUGS.slice(0, 6)), qty = Math.min(ri(5, 25), G.space(s));
      if (qty > 0) { const h = s.inv[d.id] || (s.inv[d.id] = { qty: 0, cost: 0 }); h.qty += qty; gains.push(`${qty} ${d.name}`); }
    } else if (p.reason === 'vinnie') {
      gainRep(s, 4); s.debtDue = s.day + 6; s.heat = clamp(s.heat + 5, 0, 100);
      gains.push('Vinnie gives you six more days');
    }
    s.cash += cash;
    if (cash) gains.unshift(G.money(cash));
    p.result = { outcome: 'won', title: p.job ? 'Job done' : 'You won', art: 'scene_win',
      text: gains.length ? `You walk away with ${gains.join(', ')}.` : 'They won\'t try that again.' };
    s.peak = Math.max(s.peak, G.netWorth(s));
    return { ok: true, won: true };
  }
  // close the result screen
  G.closeFight = function (s) {
    if (s.pending && s.pending.result) s.pending = null;
  };

  // ---------- jobs ----------
  function genJobs(s, dist) {
    const sc = G.scale(s);
    const fits = G.JOBS.filter(j => !j.where || j.where.includes(dist.id));
    return shuffle(fits.slice()).slice(0, 2).map(j => {
      const size = Math.min(12, ri(j.size[0], j.size[1]) + Math.floor((sc - 1) * 1.5));
      const drug = j.premium ? pick(['heroin', 'cocaine']) : pick(G.DRUGS.slice(0, 6)).id;
      return { id: 'j' + (s.nextId++), type: j.id, faction: j.faction || dist.faction, size, power: j.power,
               cash: Math.round(ri(j.cash[0], j.cash[1]) * (1 + (sc - 1) * 0.5) / 100) * 100,
               drug: j.drugs[1] ? drug : null, drugQty: j.drugs[1] ? ri(j.drugs[0], j.drugs[1]) : 0, done: false };
    });
  }
  G.jobsHere = s => (s.jobs[s.loc] ? s.jobs[s.loc].list : []);
  G.jobFoes = (s, j) => makeFoes(s, j.faction, j.size, j.power);
  G.startJob = function (s, jobId) {
    const j = G.jobsHere(s).find(x => x.id === jobId);
    if (!j || j.done) return { ok: false, msg: 'That job is gone.' };
    if (s.pending) return { ok: false, msg: 'Deal with what\'s in front of you first.' };
    const def = JOB[j.type];
    if (s.rep < def.minRep) return { ok: false, msg: `You need ${def.minRep} rep for this.` };
    j.done = true;
    s.pending = fightPending(s, { reason: 'job', job: j, faction: j.faction, title: def.name, art: def.art,
      text: def.blurb, foes: G.jobFoes(s, j), canRun: true, canGive: true, giveLabel: 'Call it off' });
    return { ok: true };
  };

  // ---------- crew ----------
  function genRecruits(s, n) {
    const roles = Object.keys(G.ROLES);
    return Array.from({ length: n }, () => {
      const role = pick(roles), r = G.ROLES[role];
      const hp = ri(r.hp[0], r.hp[1]);
      const wage = Math.round(ri(r.wage[0], r.wage[1]) * (1 + (G.scale(s) - 1) * 0.3) / 10) * 10;
      return { id: 'c' + (s.nextId++), name: `${pick(G.FIRST)} "${pick(G.NICK)}"`, role, hp, maxHp: hp,
               acc: Math.round(rnd(r.acc[0], r.acc[1]) * 100) / 100, wage, fee: wage * 3 };
    });
  }
  G.recruitsHere = s => (s.recruits[s.loc] ? s.recruits[s.loc].list : []);
  G.hire = function (s, id) {
    const list = G.recruitsHere(s), r = list.find(x => x.id === id);
    if (!r) return { ok: false, msg: 'They left.' };
    if (s.crew.length >= G.crewCap(s)) return { ok: false, msg: `Your rep only holds a crew of ${G.crewCap(s)}. Earn more rep.` };
    if (s.cash < r.fee) return { ok: false, msg: `Signing fee is ${G.money(r.fee)}.` };
    s.cash -= r.fee;
    list.splice(list.indexOf(r), 1);
    const { fee, ...member } = r;
    s.crew.push(member);
    return { ok: true, msg: `${r.name} is on the crew.` };
  };
  G.fire = function (s, id) {
    const c = s.crew.find(x => x.id === id);
    if (!c) return { ok: false };
    s.crew = s.crew.filter(x => x !== c);
    return { ok: true, msg: `${c.name} is off the crew.` };
  };

  // ---------- services ----------
  G.has = (s, svc) => DIST[s.loc].services.includes(svc);
  G.deposit = function (s, amt) {
    amt = Math.floor(Math.min(amt, s.cash));
    if (!G.has(s, 'bank') || amt <= 0) return { ok: false };
    s.cash -= amt; s.bank += amt; return { ok: true, msg: `Deposited ${G.money(amt)}.` };
  };
  G.withdraw = function (s, amt) {
    amt = Math.floor(Math.min(amt, s.bank));
    if (!G.has(s, 'bank') || amt <= 0) return { ok: false };
    s.bank -= amt; s.cash += amt; return { ok: true, msg: `Withdrew ${G.money(amt)}.` };
  };
  G.borrow = function (s, amt) {
    amt = Math.floor(amt);
    const room = G.sharkLimit(s) - s.debt;
    if (!G.has(s, 'shark') || amt <= 0) return { ok: false };
    if (amt > room) return { ok: false, msg: `Vinnie won't go past ${G.money(G.sharkLimit(s))} total.` };
    if (s.debt === 0) s.debtDue = s.day + G.SHARK.graceDays;
    s.debt += amt; s.cash += amt;
    return { ok: true, msg: `Borrowed ${G.money(amt)}. Clock's ticking.` };
  };
  G.repay = function (s, amt) {
    amt = Math.floor(Math.min(amt, s.cash, s.debt));
    if (!G.has(s, 'shark') || amt <= 0) return { ok: false };
    s.cash -= amt; s.debt -= amt;
    if (s.debt === 0) return { ok: true, msg: 'Debt cleared. Vinnie smiles.' };
    return { ok: true, msg: `Paid ${G.money(amt)}. Still owe ${G.money(s.debt)}.` };
  };
  G.healCost = function (s) {
    const per = G.has(s, 'clinic') ? G.SERVICES.clinic.hpCost : G.SERVICES.hospital.hpCost;
    const missing = (s.maxHp - s.hp) + s.crew.reduce((n, c) => n + (c.maxHp - c.hp), 0);
    return { per, missing, total: per * missing };
  };
  G.heal = function (s) {
    if (!G.has(s, 'hospital') && !G.has(s, 'clinic')) return { ok: false };
    const { per, missing } = G.healCost(s);
    if (!missing) return { ok: false, msg: 'Everyone is healthy.' };
    const affordable = Math.min(missing, Math.floor(s.cash / per));
    if (affordable <= 0) return { ok: false, msg: 'You can\'t afford it.' };
    let left = affordable;
    const boss = Math.min(left, s.maxHp - s.hp); s.hp += boss; left -= boss;
    for (const c of s.crew) { const h = Math.min(left, c.maxHp - c.hp); c.hp += h; left -= h; }
    s.cash -= affordable * per;
    return { ok: true, msg: affordable === missing ? 'Everyone\'s patched up.' : `Healed ${affordable} HP, all you could afford.` };
  };
  G.buyWeapon = function (s, id) {
    const w = WEAPON[id];
    if (!G.has(s, 'guns') || !w || !w.price) return { ok: false };
    if (s.cash < w.price) return { ok: false, msg: 'Not enough cash.' };
    s.cash -= w.price; s.weapons[id] = (s.weapons[id] || 0) + 1;
    s.heat = clamp(s.heat + 1, 0, 100);
    return { ok: true, msg: `Bought a ${w.name}.` };
  };
  G.buyArmor = function (s, id) {
    const a = ARMOR[id];
    if (!G.has(s, 'guns') || !a || !a.price) return { ok: false };
    if (s.cash < a.price) return { ok: false, msg: 'Not enough cash.' };
    s.cash -= a.price; s.armors[id] = (s.armors[id] || 0) + 1;
    return { ok: true, msg: `Bought a ${a.name}.` };
  };
  G.gearCount = s => Object.values(s.weapons).reduce((n, v) => n + v, 0);
  G.buyCoat = function (s, id) {
    const c = COAT[id];
    if (!G.has(s, 'tailor') || !c) return { ok: false };
    if (c.cap <= COAT[s.coat].cap) return { ok: false, msg: 'You already have something better.' };
    if (s.cash < c.price) return { ok: false, msg: 'Not enough cash.' };
    s.cash -= c.price; s.coat = id;
    return { ok: true, msg: `${c.name}: room for ${c.cap} more.` };
  };
  G.tradeIn = s => Math.round(VEHICLE[s.vehicle].price * 0.4);
  G.buyVehicle = function (s, id) {
    const v = VEHICLE[id];
    if (!G.has(s, 'cars') || !v || id === s.vehicle || !v.price) return { ok: false };
    const cost = v.price - G.tradeIn(s);
    if (s.cash < cost) return { ok: false, msg: `You need ${G.money(cost)} after trade-in.` };
    if (G.carried(s) > G.START.capacity + COAT[s.coat].cap + v.cap) return { ok: false, msg: 'Sell some product first: it won\'t fit in that.' };
    s.cash -= cost; s.vehicle = id;
    return { ok: true, msg: `New wheels: ${v.name}.` };
  };
  G.buyFront = function (s, id) {
    const f = FRONT[id];
    if (!G.has(s, 'realty') || !f || s.fronts.includes(id)) return { ok: false };
    if (s.rep < f.rep) return { ok: false, msg: `You need ${f.rep} rep for the seller to take your call.` };
    if (s.cash < f.price) return { ok: false, msg: 'Not enough cash.' };
    s.cash -= f.price; s.fronts.push(id);
    gainRep(s, 3);
    return { ok: true, msg: `${f.name} is yours. It pays ${G.money(f.income)} a day into the bank.` };
  };

  // ---------- the end of a run ----------
  function endRun(s, reason) {
    const net = G.netWorth(s);
    s.peak = Math.max(s.peak, net);
    s.over = { reason, day: s.day, net, peak: s.peak };
  }
  G.retire = function (s) {
    if (s.pending || s.over) return { ok: false };
    endRun(s, 'retired');
    return { ok: true };
  };
  // fold a finished (or ongoing) run into the lifetime records
  G.record = function (meta, s) {
    meta.bestNet = Math.max(meta.bestNet, s.peak || 0, s.over ? s.over.net : 0);
    meta.bestDays = Math.max(meta.bestDays, s.day);
  };
  G.closeRun = function (meta, s) {
    G.record(meta, s);
    if (s.over && !s.over.counted) {
      s.over.counted = true;
      if (s.over.reason === 'dead') meta.deaths++; else meta.retired++;
    }
  };

  G.money = v => (v < 0 ? '-$' : '$') + Math.abs(Math.round(v)).toLocaleString('en-US');
  G.short = v => { const a = Math.abs(v), sign = v < 0 ? '-' : ''; return a >= 1e6 ? `${sign}$${(a / 1e6).toFixed(a >= 1e7 ? 0 : 1)}M` : a >= 1e4 ? `${sign}$${Math.round(a / 1e3)}K` : G.money(v); };

  // ---------- saves ----------
  G.SAVE_VERSION = SAVE_VERSION;
  G.load = function (data) {
    if (!data || typeof data !== 'object') return null;
    const meta = { ...G.newMeta(), ...(data.meta || {}) };
    const run = data.run && data.run.v === SAVE_VERSION ? data.run : null;
    return { meta, run };
  };
})(window.DrugWars = window.DrugWars || {});
