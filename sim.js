// ============================================================
//  Drug Wars: the rules. Everything works on one plain state
//  object (which is also the save), with no screen code, so it
//  can be tested on its own (node test.js).
// ============================================================
(function (G) {
  'use strict';
  const SAVE_VERSION = 2;

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
  const roundTo = (v, step) => Math.round(v / step) * step;
  const nice = v => (v < 1000 ? Math.round(v) : v < 100000 ? roundTo(v, 50) : v < 1e7 ? roundTo(v, 1000) : roundTo(v, 100000));
  G.util = { rnd, ri, pick, clamp, chance };

  const by = list => Object.fromEntries(list.map(x => [x.id, x]));
  const DRUG = by(G.DRUGS), DIST = by(G.DISTRICTS), WEAPON = by(G.WEAPONS), ARMOR = by(G.ARMOR), ITEM = by(G.ITEMS);
  const COAT = by(G.COATS), VEHICLE = by(G.VEHICLES), FRONT = by(G.FRONTS), JOB = by(G.JOBS), CRATE = by(G.CRATES), LUX = by(G.LUXURIES);
  G.drug = id => DRUG[id]; G.district = id => DIST[id]; G.weapon = id => WEAPON[id]; G.armor = id => ARMOR[id]; G.item = id => ITEM[id];
  G.coat = id => COAT[id]; G.vehicle = id => VEHICLE[id]; G.front = id => FRONT[id]; G.job = id => JOB[id]; G.crate = id => CRATE[id]; G.lux = id => LUX[id];

  // the city gets meaner the longer you last
  G.scale = s => Math.min(5, 1 + (s.day - 1) / 50);

  // ---------- a new run ----------
  G.newMeta = () => ({ season: G.SEASON, bestNet: 0, bestDays: 0, runs: 0, deaths: 0, retired: 0, kings: 0 });
  G.newRun = function (meta) {
    const s = {
      v: SAVE_VERSION, day: 1, loc: 'downtown',
      cash: G.START.cash, bank: 0, debt: G.START.debt, debtDue: 1 + G.SHARK.graceDays,
      hp: G.START.hp, maxHp: G.START.hp, heat: 0, rep: 0,
      inv: {}, coat: 'pockets', vehicle: 'feet', crates: { small: 0, medium: 0, large: 0 },
      weapons: { bat: 1 }, armors: {}, items: { medkit: 1 }, crew: [], fronts: [], lux: [], stashes: {},
      turf: {}, beaten: {}, manhunt: 0, chief: false, judge: false, king: false,
      press: {}, prices: {}, seen: {}, news: [], jobs: {}, recruits: {}, shops: {}, offers: {}, contracts: [],
      tip: null, pending: null, log: [], over: null, nextId: 1, peak: 0, marks: 0, repFix: 1,
      stats: { sold: 0, bought: 0, fightsWon: 0, fightsLost: 0, jobs: 0, busts: 0, crewLost: 0, copsBeaten: 0, contracts: 0, turfTaken: 0, gambled: 0 },
    };
    if (meta) meta.runs++;
    arrive(s, true);
    return s;
  };

  // ---------- rep ----------
  G.title = s => { let t = G.TITLES[0]; for (const x of G.TITLES) if (s.rep >= x.rep) t = x; return t; };
  G.nextTitle = s => G.TITLES.find(x => x.rep > s.rep) || null;
  function gainRep(s, n) { s.rep = clamp(Math.round((s.rep + n) * 100) / 100, 0, 100); }
  // dealing builds your name: mostly the profit, partly just the volume you move
  const REP_PER = 6000;
  const tradeRep = (s, total, profit) => (Math.max(0, profit) * 0.7 + total * 0.3) / (REP_PER * (1 + s.rep / 4));
  // the street notices when you get rich
  G.NET_MILESTONES = [25e3, 1e5, 2.5e5, 5e5, 1e6, 2.5e6, 5e6, 1e7, 2.5e7, 5e7, 1e8, 2.5e8, 5e8, 1e9, 2.5e9];
  function milestones(s) {
    const net = G.netWorth(s);
    s.marks = s.marks || 0;
    while (s.marks < G.NET_MILESTONES.length && net >= G.NET_MILESTONES[s.marks]) {
      gainRep(s, 2);
      note(s, `Word gets around: you're worth ${G.short(G.NET_MILESTONES[s.marks])}. +2 rep.`);
      s.marks++;
    }
  }
  G.milestones = milestones;
  // runs from before the rep fix get credit for the trading they already did
  G.repFix = function (s) {
    if (s.repFix) return;
    s.repFix = 1;
    let r = Math.floor(s.rep), budget = s.stats.sold * 0.3 + Math.max(0, s.stats.sold - s.stats.bought) * 0.7;
    while (r < 100 && budget >= REP_PER * (1 + r / 4)) { budget -= REP_PER * (1 + r / 4); r++; }
    if (r > s.rep) { note(s, `The street caught up with what you've been moving: rep ${Math.floor(s.rep)} → ${r}.`); s.rep = r; }
    s.peak = Math.max(s.peak, G.netWorth(s));
    const before = s.marks || 0; s.marks = 0;
    while (s.marks < G.NET_MILESTONES.length && s.peak >= G.NET_MILESTONES[s.marks]) s.marks++;
    gainRep(s, 2 * Math.max(0, s.marks - before));
  };
  G.canTrade = (s, id) => s.rep >= DRUG[id].rep;

  // ---------- carrying ----------
  G.crateCount = s => s.crates.small + s.crates.medium + s.crates.large;
  // the crates that fit in your ride: biggest first
  G.cratesCarried = function (s, vehicleId) {
    let slots = VEHICLE[vehicleId || s.vehicle].slots, cap = 0;
    const fit = { small: 0, medium: 0, large: 0 };
    for (const c of ['large', 'medium', 'small']) {
      const n = Math.min(s.crates[c], Math.floor(slots / CRATE[c].slots));
      fit[c] = n; slots -= n * CRATE[c].slots; cap += n * CRATE[c].cap;
    }
    return { fit, cap, freeSlots: slots };
  };
  G.capacity = (s, vehicleId) => G.START.pockets + COAT[s.coat].cap + VEHICLE[vehicleId || s.vehicle].trunk + G.cratesCarried(s, vehicleId).cap
    + s.crew.reduce((n, c) => n + (G.ROLES[c.role].carry || 0), 0);
  G.packageSpace = s => s.contracts.filter(c => c.type === 'smuggle' && !c.done && !c.failed).reduce((n, c) => n + c.size, 0);
  G.carried = s => Object.values(s.inv).reduce((n, h) => n + h.qty, 0) + G.packageSpace(s);
  G.space = s => Math.max(0, G.capacity(s) - G.carried(s));
  const mid = d => (d.lo + d.hi) / 2;
  const stashUnits = st => Object.values(st.inv).reduce((n, h) => n + h.qty, 0);
  const invValue = inv => Object.entries(inv).reduce((n, [id, h]) => n + h.qty * mid(DRUG[id]) * 0.6, 0);
  G.drugValue = s => invValue(s.inv) + Object.values(s.stashes).reduce((n, st) => n + invValue(st.inv), 0);
  G.netWorth = s => Math.round(s.cash + s.bank - s.debt + G.drugValue(s)
    + s.fronts.reduce((n, id) => n + FRONT[id].price * 0.5, 0)
    + s.lux.reduce((n, id) => n + LUX[id].price * 0.6, 0)
    + Object.keys(s.stashes).reduce((n, d) => n + G.STASH_PRICE[d] * 0.5, 0)
    + VEHICLE[s.vehicle].price * 0.4);
  G.crewCap = s => Math.min(10, 1 + Math.floor(s.rep / 10));
  G.sharkLimit = s => G.SHARK.baseLimit + Math.floor(s.rep) * G.SHARK.limitPerRep;
  G.wages = s => s.crew.reduce((n, c) => n + c.wage, 0);
  G.income = s => s.fronts.reduce((n, id) => n + FRONT[id].income, 0) + Object.keys(s.turf).reduce((n, d) => n + DIST[d].tribute, 0);
  G.locked = (s, d) => (d.rep && s.rep < d.rep) ? `Needs ${d.rep} rep` : (d.vehicle && G.VEHICLES.indexOf(VEHICLE[s.vehicle]) < 2) ? 'Needs a car' : '';
  G.heatTier = s => { let t = G.HEAT_TIERS[0]; for (const x of G.HEAT_TIERS) if (s.heat >= x.min) t = x; return t; };
  G.stealth = s => Math.min(0.6, (COAT[s.coat].stealth || 0) + s.crew.filter(c => c.role === 'smuggler').length * 0.08);

  function note(s, text, tone) {
    s.log.unshift({ day: s.day, text, tone: tone || '' });
    if (s.log.length > 60) s.log.length = 60;
  }
  G.note = note;
  const addInv = (inv, id, qty, cost) => { const h = inv[id] || (inv[id] = { qty: 0, cost: 0 }); h.qty += qty; h.cost += cost || 0; };
  const takeInv = (inv, id, qty) => { const h = inv[id]; const avg = h.cost / h.qty; h.qty -= qty; h.cost -= avg * qty; if (h.qty <= 0) delete inv[id]; return avg * qty; };

  // ---------- markets ----------
  // Each district remembers how hard you've pushed each product (press): selling pushes the price
  // down, buying pushes it up, and it recovers a little every day. Big loads have to be spread out.
  function genPrices(s, dist) {
    const prices = {}, news = [];
    const tip = s.tip && s.tip.dist === dist.id && s.day <= s.tip.until ? s.tip : null;
    const missing = shuffle(G.DRUGS.map(d => d.id)).slice(0, ri(1, 3));
    for (const d of G.DRUGS) {
      const rare = d.rep >= 25 && chance(0.25); // the heavy stuff isn't always around
      if ((missing.includes(d.id) || rare) && !(tip && tip.drug === d.id)) { prices[d.id] = null; continue; }
      const base = Math.exp(rnd(Math.log(d.lo), Math.log(d.hi)));
      prices[d.id] = Math.max(1, Math.round(base * (dist.mult[d.id] || 1) * rnd(0.94, 1.06)));
    }
    const avail = G.DRUGS.filter(d => prices[d.id] !== null);
    if (tip) {
      prices[tip.drug] = Math.round(DRUG[tip.drug].hi * rnd(2.2, 3.2) * (dist.mult[tip.drug] || 1));
      news.push({ tone: 'spike', drug: tip.drug, text: G.SPIKES[tip.drug] + ' (Your tip was good.)' });
      s.tip = null;
    } else if (chance(0.22) && avail.length) {
      const d = pick(avail);
      prices[d.id] = Math.round(DRUG[d.id].hi * rnd(1.8, 2.8));
      news.push({ tone: 'spike', drug: d.id, text: G.SPIKES[d.id] });
    }
    if (chance(0.2) && avail.length) {
      const d = pick(avail.filter(x => !news.some(n => n.drug === x.id)));
      if (d) { prices[d.id] = Math.max(1, Math.round(DRUG[d.id].lo * rnd(0.3, 0.55))); news.push({ tone: 'crash', drug: d.id, text: G.CRASHES[d.id] }); }
    }
    if (!news.length || chance(0.35)) news.push({ tone: '', text: pick(G.HEADLINES) });
    return { prices, news };
  }
  const basePrice = (s, id) => (s.prices[s.loc] || {})[id] ?? null;
  const press = (s, id) => ((s.press[s.loc] || {})[id] || 0);
  const setPress = (s, id, v) => { const p = s.press[s.loc] || (s.press[s.loc] = {}); if (Math.abs(v) < 0.005) delete p[id]; else p[id] = v; };
  // how many units move the price by about two thirds
  G.depth = (s, id) => DRUG[id].depth * DIST[s.loc].size * (s.turf[s.loc] ? 1.5 : 1) * (1 + s.rep / 100);
  const sellBonus = s => (s.turf[s.loc] ? 1.1 : 1);
  // the price for the next single unit
  G.price = (s, id) => { const b = basePrice(s, id); return b === null ? null : Math.max(1, Math.round(b * Math.exp(-press(s, id)))); };
  G.sellPrice = (s, id) => { const p = G.price(s, id); return p === null ? null : Math.round(p * sellBonus(s)); };
  // what buying or selling q units costs or pays, all together
  // however hard you push, a price goes no higher than 2.5x and no lower than a quarter of today's street price
  const P_MIN = -Math.log(2.5), P_MAX = Math.log(4);
  G.quoteBuy = function (s, id, q) {
    const b = basePrice(s, id), D = G.depth(s, id), p0 = press(s, id);
    if (b === null || q <= 0) return { total: 0, after: G.price(s, id) };
    const curved = Math.max(0, Math.min(q, (p0 - P_MIN) * D)); // units bought before the price hits its ceiling
    const p1 = p0 - curved / D;
    const total = b * D * (Math.exp(-p1) - Math.exp(-p0)) + (q - curved) * b * 2.5;
    return { total: Math.max(q, Math.round(total)), after: Math.round(b * Math.exp(-Math.max(P_MIN, p0 - q / D))), press: Math.max(P_MIN, p0 - q / D) };
  };
  G.quoteSell = function (s, id, q) {
    const b = basePrice(s, id), D = G.depth(s, id), p0 = press(s, id);
    if (b === null || q <= 0) return { total: 0, after: G.sellPrice(s, id) };
    const curved = Math.max(0, Math.min(q, (P_MAX - p0) * D)); // units sold before the price hits its floor
    const p1 = p0 + curved / D;
    const total = (b * D * (Math.exp(-p0) - Math.exp(-p1)) + (q - curved) * b * 0.25) * sellBonus(s);
    return { total: Math.round(total), after: Math.round(b * Math.exp(-Math.min(P_MAX, p0 + q / D)) * sellBonus(s)), press: Math.min(P_MAX, p0 + q / D) };
  };
  // a sensible amount to buy here: up to where the price has gone up about 40% (or hits the normal street price)
  G.bestBuy = function (s, id) {
    const max = G.maxBuy(s, id), p = G.price(s, id);
    if (!max || !p) return 0;
    const d = DRUG[id], target = Math.max(p * 1.15, Math.min(p * 1.4, mid(d)));
    return Math.max(1, Math.min(max, Math.floor(G.depth(s, id) * Math.log(target / p))));
  };
  // the most you can sell here before the next one goes for less than you paid (0 = selling here loses money)
  G.bestSell = function (s, id) {
    const h = s.inv[id], sp = G.sellPrice(s, id);
    if (!h || !sp || !G.canTrade(s, id)) return 0;
    const avg = h.cost / h.qty;
    if (!avg) return h.qty; // it was free: every sale is profit
    if (sp <= avg) return 0;
    return Math.max(1, Math.min(h.qty, Math.floor(G.depth(s, id) * Math.log(sp / avg))));
  };
  G.maxBuy = function (s, id) {
    const b = basePrice(s, id);
    if (b === null || !G.canTrade(s, id)) return 0;
    // the most you can afford (and carry), found by halving
    let lo = 0, hi = G.space(s);
    if (G.quoteBuy(s, id, hi).total <= s.cash) return hi;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (G.quoteBuy(s, id, m).total <= s.cash) lo = m; else hi = m; }
    return lo;
  };
  G.buy = function (s, id, qty) {
    qty = Math.floor(qty);
    if (!G.canTrade(s, id)) return { ok: false, msg: `Nobody here deals ${DRUG[id].name} with a ${G.title(s).name}. Needs ${DRUG[id].rep} rep.` };
    if (basePrice(s, id) === null || qty < 1) return { ok: false, msg: 'Nobody\'s selling that here.' };
    if (qty > G.space(s)) return { ok: false, msg: 'You can\'t carry that much.' };
    const q = G.quoteBuy(s, id, qty);
    if (q.total > s.cash) return { ok: false, msg: 'Not enough cash.' };
    s.cash -= q.total;
    addInv(s.inv, id, qty, q.total);
    setPress(s, id, q.press);
    s.stats.bought += q.total;
    addHeat(s, q.total, 0.35, DRUG[id]);
    return { ok: true, msg: `Bought ${qty} ${DRUG[id].name} for ${G.money(q.total)}.` };
  };
  G.sell = function (s, id, qty) {
    const h = s.inv[id];
    qty = Math.floor(qty);
    if (!h || qty < 1 || qty > h.qty) return { ok: false, msg: 'You don\'t have that many.' };
    if (!G.canTrade(s, id)) return { ok: false, msg: `Nobody here will buy ${DRUG[id].name} from a ${G.title(s).name}. Needs ${DRUG[id].rep} rep.` };
    if (basePrice(s, id) === null) return { ok: false, msg: 'Nobody\'s buying that here today.' };
    const q = G.quoteSell(s, id, qty);
    const paid = takeInv(s.inv, id, qty);
    s.cash += q.total;
    setPress(s, id, q.press);
    s.stats.sold += q.total;
    addHeat(s, q.total, 1, DRUG[id]);
    const profit = Math.round(q.total - paid);
    gainRep(s, Math.min(1.5, tradeRep(s, q.total, profit)));
    milestones(s);
    return { ok: true, msg: `Sold ${qty} ${DRUG[id].name} for ${G.money(q.total)} (${profit >= 0 ? '+' : ''}${G.money(profit)}).`, profit };
  };
  // dealing where the cops look gets you noticed; the heavy stuff gets you noticed faster
  function addHeat(s, value, weight, drug) {
    const tier = drug ? 1 + drug.rep / 40 : 1;
    const gain = DIST[s.loc].police * weight * tier * 5 * (1 - Math.exp(-value / 200000)) * (1 - G.stealth(s));
    s.heat = clamp(s.heat + gain, 0, 100);
  }

  // ---------- days ----------
  function dailyTick(s) {
    s.day++;
    if (s.debt > 0) s.debt = Math.round(s.debt * (1 + G.SHARK.rate));
    if (s.bank > 0) s.bank = Math.round(s.bank * (1 + G.BANK_RATE));
    const inc = G.income(s);
    if (inc) s.bank += inc;
    if (s.lux.includes('horse') && chance(0.08)) { const won = ri(5, 30) * 100000; s.bank += won; note(s, `Your racehorse won ${G.money(won)}.`); }
    // payroll: cash first, then the bank; whoever isn't paid walks
    let owed = G.wages(s);
    const fromCash = Math.min(s.cash, owed); s.cash -= fromCash; owed -= fromCash;
    const fromBank = Math.min(s.bank, owed); s.bank -= fromBank; owed -= fromBank;
    while (owed > 0 && s.crew.length) {
      const c = s.crew.reduce((a, b) => (b.wage > a.wage ? b : a));
      s.crew = s.crew.filter(x => x !== c);
      owed -= c.wage;
      note(s, `${c.name} quit. You couldn't make payroll.`, 'bad');
      gainRep(s, -2);
    }
    const cool = 3 + s.fronts.reduce((n, id) => n + FRONT[id].cool, 0) + (s.chief ? 4 : 0);
    s.heat = clamp(s.heat - cool, 0, 100);
    if (s.manhunt > 0) s.manhunt--;
    s.hp = Math.min(s.maxHp, s.hp + 3 + (s.lux.includes('penthouse') ? 10 : 0));
    const crewHeal = 4 + (VEHICLE[s.vehicle].heal || 0);
    for (const c of s.crew) c.hp = Math.min(c.maxHp, c.hp + crewHeal);
    // markets recover from what you did to them
    for (const d of Object.keys(s.press)) {
      for (const id of Object.keys(s.press[d])) { s.press[d][id] *= 0.45; if (Math.abs(s.press[d][id]) < 0.005) delete s.press[d][id]; }
      if (!Object.keys(s.press[d]).length) delete s.press[d];
    }
    // a hot boss has hot safehouses
    if (s.heat >= G.STASH.raidHeat && !s.chief) {
      for (const [d, st] of Object.entries(s.stashes)) {
        if (d === s.loc || !stashUnits(st) || !chance(G.STASH.raidChance)) continue;
        for (const id of Object.keys(st.inv)) takeInv(st.inv, id, Math.ceil(st.inv[id].qty / 2));
        note(s, `Cops raided your ${DIST[d].name} safehouse and took half of what was there.`, 'bad');
      }
    }
    // contracts run out
    for (const c of s.contracts) if (!c.done && !c.failed && s.day > c.until) { c.failed = true; gainRep(s, -2); note(s, `You missed a contract: ${c.title}.`, 'bad'); }
    s.contracts = s.contracts.filter(c => !c.done && !c.failed);
    s.peak = Math.max(s.peak, G.netWorth(s));
    milestones(s);
  }

  // land in a district: fresh prices, jobs, recruits, shop stock and contracts
  function arrive(s, quiet) {
    const dist = DIST[s.loc];
    const { prices, news } = genPrices(s, dist);
    s.prices = { [s.loc]: prices };
    s.seen[s.loc] = { day: s.day };
    s.news = news;
    if (!s.jobs[s.loc] || s.day - s.jobs[s.loc].day >= 4) {
      const hits = s.jobs[s.loc] ? s.jobs[s.loc].list.filter(j => j.type === 'hit' && !j.done) : [];
      s.jobs[s.loc] = { day: s.day, list: genJobs(s, dist).concat(hits) };
    }
    refreshSpecialJobs(s);
    if (dist.services.includes('recruit') && (!s.recruits[s.loc] || s.recruits[s.loc].day !== s.day)) s.recruits[s.loc] = { day: s.day, list: genRecruits(s, 3) };
    if ((dist.services.includes('guns') || dist.services.includes('blackmarket')) && (!s.shops[s.loc] || s.shops[s.loc].day !== s.day)) s.shops[s.loc] = genShop(s);
    if (dist.services.includes('fixer') && (!s.offers[s.loc] || s.day - s.offers[s.loc].day >= 3)) s.offers[s.loc] = { day: s.day, list: genOffers(s) };
    if (!quiet && contractArrival(s)) return;
    if (!quiet) rollEncounter(s);
  }

  G.travelDays = (s, d) => (d.days && !s.lux.includes('jet') ? d.days : 1);
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
    const days = G.travelDays(s, d);
    for (let i = 0; i < days; i++) dailyTick(s);
    s.loc = to;
    arrive(s);
    s.peak = Math.max(s.peak, G.netWorth(s));
    return { ok: true, days };
  };
  // stay put for a day: prices change and you cool off a bit more
  G.wait = function (s) {
    if (s.pending) return { ok: false, msg: 'Deal with what\'s in front of you first.' };
    dailyTick(s);
    s.heat = clamp(s.heat - 4, 0, 100);
    arrive(s);
    return { ok: true };
  };

  // ---------- the squad ----------
  const BOSS_ACC = 0.7;
  G.crewLevel = c => G.CREW_LEVELS.filter(n => (c.wins || 0) >= n).length - 1;
  const gearScore = w => w.dmg * w.shots * w.acc * (1 + (w.splash || 0) * 0.6);
  function rankWeapons(s) {
    const out = [];
    for (const [id, n] of Object.entries(s.weapons)) for (let i = 0; i < n; i++) out.push(WEAPON[id]);
    return out.sort((a, b) => gearScore(b) - gearScore(a));
  }
  function rankArmor(s) {
    const out = [];
    for (const [id, n] of Object.entries(s.armors)) for (let i = 0; i < n; i++) out.push(ARMOR[id]);
    return out.sort((a, b) => b.block - a.block);
  }
  // who carries what: the best gear goes to the boss, then the crew in order
  // who carries what: pieces you picked for someone (s.equip) go to them first; everyone on "auto"
  // gets the best that's left, the boss first, then the crew in order
  G.loadout = function (s) {
    const veh = (VEHICLE[s.vehicle].armor || 0);
    const squad = [{ id: 'boss', name: 'You', boss: true, hp: s.hp, maxHp: s.maxHp, acc: BOSS_ACC, art: 'char_player' }]
      .concat(s.crew.map(c => ({ id: c.id, name: c.name, role: c.role, hp: c.hp, maxHp: c.maxHp, acc: Math.min(0.95, c.acc + 0.03 * G.crewLevel(c)), art: G.ROLES[c.role].art, lvl: G.crewLevel(c) })));
    const equip = s.equip || {};
    const handOut = (kind, ranked, none) => {
      const left = ranked.slice(), field = kind === 'weapon' ? 'weapon' : 'armorItem';
      for (const m of squad) {
        const want = (equip[m.id] || {})[kind];
        if (!want || want === 'auto') continue;
        if (want === 'none') { m[field] = none; m[field + 'Set'] = true; continue; }
        const i = left.findIndex(x => x.id === want);
        if (i >= 0) { m[field] = left.splice(i, 1)[0]; m[field + 'Set'] = true; }
      }
      for (const m of squad) if (!m[field]) m[field] = left.shift() || none;
    };
    handOut('weapon', rankWeapons(s), WEAPON.fists);
    handOut('armor', rankArmor(s), ARMOR.none);
    for (const m of squad) m.armor = Math.min(0.75, m.armorItem.block + veh);
    return squad;
  };
  // pick a weapon or armor for someone ('auto' = best available, 'none' = go without)
  G.setEquip = function (s, memberId, kind, id) {
    if (memberId !== 'boss' && !s.crew.some(c => c.id === memberId)) return { ok: false };
    if (!['weapon', 'armor'].includes(kind)) return { ok: false };
    const own = kind === 'weapon' ? s.weapons : s.armors;
    if (id !== 'auto' && id !== 'none' && !own[id]) return { ok: false, msg: 'You don\'t own that.' };
    s.equip = s.equip || {};
    const e = s.equip[memberId] || (s.equip[memberId] = {});
    if (id === 'auto') delete e[kind]; else e[kind] = id;
    // people who left the crew don't hold anything
    for (const k of Object.keys(s.equip)) if (k !== 'boss' && !s.crew.some(c => c.id === k)) delete s.equip[k];
    return { ok: true };
  };
  // rough fighting strength: damage per round times how much punishment they can take
  function sideStats(list, enemyArmor) {
    let dps = 0, ehp = 0;
    for (const m of list) {
      if (m.hp <= 0) continue;
      const w = m.weapon || { dmg: m.dmg, acc: 0.7, shots: m.shots || 1 };
      const acc = m.weapon ? clamp(m.acc * (w.acc / 0.7), 0.1, 0.95) : m.acc;
      dps += w.dmg * w.shots * acc * (1 + (w.splash || 0) * 0.6) * (1 - enemyArmor);
      ehp += m.hp; // armor is already in the other side's damage
    }
    return { dps, ehp };
  }
  G.firepower = list => Math.round(sideStats(list, 0).dps);

  // A squad of enemies sized so that you'd win a fight to the finish about `target` of the time.
  // It's found by playing the fight out (G.odds), so it stays right whatever your crew and gear.
  function makeFoes(s, factionId, target, opts = {}) {
    const min = opts.min || 1, power = opts.power || 1;
    const build = (n, boost) => fixedFoes(s, factionId, n, power * Math.sqrt(boost), opts.leader, opts.leaderArt);
    const win = foes => G.odds(s, foes, 40);
    let best = build(min, 1);
    if (win(best) < target) return best; // even the smallest squad is a hard fight
    let lo = min, hi = 14;
    if (win(build(hi, 1)) >= target) {
      // a big crew: same headcount, tougher people
      let boost = 1;
      for (const b of [1.4, 2, 2.8, 4, 5.6, 8, 11, 16]) { if (win(build(14, b)) < target) break; boost = b; }
      return build(14, boost * 1.2);
    }
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (win(build(m, 1)) >= target) lo = m; else hi = m; }
    return build(hi, 1);
  }
  G.makeFoes = makeFoes;
  // a fixed squad (jobs, turf wars, bosses): tougher with the day and the job, not with your crew
  function fixedFoes(s, factionId, n, power, leader, leaderArt) {
    const f = G.FACTIONS[factionId], sc = G.scale(s);
    const hpM = (1 + (sc - 1) * 0.5) * power, dmgM = (1 + (sc - 1) * 0.35) * power;
    n = Math.min(14, n);
    return Array.from({ length: n }, (_, i) => {
      const isLead = i === 0 && (leader || n > 2);
      const hp = Math.round(f.hp * hpM * rnd(0.85, 1.15) * (isLead ? (leader ? 2.4 : 1.4) : 1));
      return { id: 'f' + i, name: isLead ? (leader || `${f.unit} boss`) : f.unit, hp, maxHp: hp,
               dmg: f.dmg * dmgM * (isLead ? (leader ? 1.6 : 1.25) : 1), acc: f.acc, armor: f.armor, shots: 1, art: isLead && leaderArt ? leaderArt : f.art };
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
          const hitOne = (target, mult) => {
            const dmg = Math.max(1, Math.round(w.dmg * mult * rnd(0.75, 1.25) * (1 - (target.armor || 0))));
            target.hp = Math.max(0, target.hp - dmg);
            out.push({ side, from: a.name, to: target.name, dmg, down: target.hp === 0 });
          };
          hitOne(t, 1);
          if (w.splash) shuffle(targets.filter(x => x !== t && x.hp > 0)).slice(0, w.splash).forEach(x => hitOne(x, 0.6));
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
    const base = G.loadout(s);
    for (let t = 0; t < tries; t++) {
      const sq = base.map(m => ({ ...m })), fo = foes.map(m => ({ ...m }));
      for (let r = 0; r < 40; r++) {
        exchange(sq, fo);
        if (!fo.some(x => x.hp > 0)) { wins++; break; }
        if (!sq.some(x => x.hp > 0)) break;
      }
    }
    return wins / tries;
  };

  // ---------- encounters ----------
  const fightPending = (s, o) => ({ kind: 'fight', round: 0, smoke: 0, ...o });
  function rollEncounter(s) {
    const dist = DIST[s.loc], sc = G.scale(s);
    const carrying = G.carried(s) > 0;
    const smuggling = G.packageSpace(s) > 0, hot = G.hotPackage(s);
    if (s.debt > 0 && s.day > s.debtDue && chance(0.45)) return startVinnie(s);
    if (s.manhunt > 0 && chance(0.55)) return startCops(s, 'manhunt');
    const f = dist.faction;
    if (s.turf[s.loc] && !s.beaten[f] && chance(0.1)) return startRetaliation(s);
    const ramp = Math.min(1, 0.45 + s.day / 25); // the first couple of weeks are gentler
    const bad = (0.1 + dist.risk * 0.25 + s.heat / 220 + Math.min(0.12, s.day / 500) + (smuggling ? 0.12 : 0) + (hot ? 0.15 : 0)) * ramp;
    const worth = G.drugValue(s) + s.cash;
    if (chance(bad)) {
      const type = weighted([
        ['cops', dist.police * (0.3 + s.heat / 30) * (carrying ? 1 : 0.5) + (smuggling ? 0.3 : 0) + (hot ? 0.4 : 0)],
        ['muggers', dist.risk * 1.1 * (s.cash > 300 ? 1 : 0.3) * (s.crew.length < 2 ? 1 : 0.15)],
        ['rival', !s.beaten[f] && (worth > 4000 || s.rep >= 5) ? dist.gang * (0.45 + s.rep / 45) * (carrying || s.rep > 10 ? 1 : 0.4) * (s.turf[s.loc] ? 0.3 : 1) : 0],
      ]);
      if (type === 'cops') return startCops(s);
      if (type === 'muggers') {
        const n = ri(1, Math.min(4, 1 + Math.floor(sc)));
        const foes = fixedFoes(s, 'muggers', n, 1);
        s.pending = fightPending(s, { reason: 'muggers', faction: 'muggers', title: 'Jumped in an alley',
          text: `${n === 1 ? 'A mugger steps' : n + ' muggers step'} out of the dark. "Wallet. Now."`,
          foes, canRun: true, canGive: true, giveLabel: 'Hand over some cash' });
        return;
      }
      if (type === 'rival') {
        const foes = makeFoes(s, f, rnd(0.55, 0.9));
        s.pending = fightPending(s, { reason: 'rival', faction: f, title: `${G.FACTIONS[f].name} want a word`,
          text: `You're dealing on ${G.FACTIONS[f].name} turf. ${foes.length} of them block the street.`,
          foes, canRun: true, canGive: carrying || s.cash > 0, giveLabel: 'Pay the street tax' });
        if (hot) cornered(s.pending, 'They know what you\'re carrying. No running, no paying them off.');
        return;
      }
    }
    if (chance(0.24)) goodEvent(s);
  }
  // the cops that show up depend on your heat
  function startCops(s, why) {
    const tier = G.heatTier(s);
    // how likely you are to win a straight fight against them
    const odds = { beat: [0.7, 0.95], cops: [0.55, 0.85], narcs: [0.35, 0.65], swat: [0.15, 0.4], feds: [0.05, 0.2] }[tier.faction];
    const foes = makeFoes(s, tier.faction, rnd(odds[0], odds[1]) * (why === 'manhunt' ? 0.85 : 1));
    const fixer = s.crew.some(c => c.role === 'fixer') ? 1 - G.ROLES.fixer.bribe : 1;
    const bribe = tier.bribe ? nice((2000 + s.heat * 700) * G.scale(s) * tier.bribe * (s.chief ? 0.6 : 1) * fixer) : 0;
    const titles = { beat: 'A patrol car pulls up', cops: 'Detective Kane pulls up', narcs: 'The Narcotics Squad', swat: 'SWAT boxes you in', feds: 'Federal agents everywhere' };
    const texts = {
      beat: `"Evening. Mind if we look in your pockets?" ${foes.length} officer${foes.length === 1 ? '' : 's'}.`,
      cops: `"Well, well. Turn around, hands on the car." Kane brought ${foes.length - 1} more.`,
      narcs: `Unmarked cars at both ends of the street. ${foes.length} narcs with vests and shotguns.`,
      swat: `Armored van, spotlights, ${foes.length} SWAT officers in full plate. Running won't be easy.`,
      feds: `A helicopter overhead and ${foes.length} federal agents. They don't take bribes, and they don't miss.`,
    };
    s.pending = fightPending(s, { reason: 'cops', faction: tier.faction, title: why === 'manhunt' ? 'Manhunt! ' + titles[tier.faction] : titles[tier.faction],
      text: texts[tier.faction], foes, canRun: true, bribe, canSurrender: true, escapeCap: tier.escapeCap });
    if (G.hotPackage(s)) cornered(s.pending, 'You\'re carrying a hot package: nobody takes a bribe for this, there\'s nowhere to run, and giving up isn\'t an option.');
  }
  // carrying a hot package: fight or nothing
  function cornered(p, why) {
    p.canRun = false; p.bribe = 0; p.canSurrender = false; p.canGive = false; p.hot = true;
    p.text += ' ' + why;
  }
  G.hotPackage = s => s.contracts.some(c => c.type === 'smuggle' && c.hot && !c.done && !c.failed);
  function startVinnie(s) {
    const late = s.day - s.debtDue;
    const foes = makeFoes(s, 'vinnie', clamp(0.8 - late / 40, 0.3, 0.8), { min: 2 });
    s.pending = fightPending(s, { reason: 'vinnie', faction: 'vinnie', title: 'Vinnie sends his regards',
      text: `You're ${late} day${late === 1 ? '' : 's'} late on ${G.money(s.debt)}. ${foes.length} leg-breakers are here to collect.`,
      foes, canRun: true, canPayDebt: true, canGive: true, giveLabel: 'Take the beating' });
  }
  function startRetaliation(s) {
    const f = DIST[s.loc].faction;
    const foes = makeFoes(s, f, rnd(0.45, 0.75), { power: 1.1 });
    s.pending = fightPending(s, { reason: 'retaliation', faction: f, title: `${G.FACTIONS[f].name} want their turf back`,
      text: `${foes.length} of them roll up on your corner in ${DIST[s.loc].name}. Lose this and the district is theirs again.`,
      foes, canRun: true, canGive: true, giveLabel: 'Give up the district' });
  }

  function goodEvent(s) {
    const tradable = G.DRUGS.filter(d => G.canTrade(s, d.id));
    const ev = weighted([
      ['stash', 1.1], ['deal', 1.3], ['tip', 1], ['coat', s.coat === 'pockets' ? 0.8 : 0],
      ['volunteer', s.crew.length < G.crewCap(s) ? 0.8 : 0], ['gun', 0.7], ['arms', s.rep >= 15 ? 0.6 : 0],
      ['checkpoint', G.carried(s) > 20 ? 0.8 : 0], ['skim', s.crew.length && s.cash > 20000 ? 0.4 : 0],
      ['reporter', s.heat > 35 ? 0.5 : 0], ['cash', 0.4], ['festival', 0.5],
    ]);
    const P = o => { s.pending = { kind: 'event', ...o }; };
    if (ev === 'stash') {
      const d = pick(tradable), qty = Math.max(2, Math.round(ri(8, 30) * Math.min(1, 1200 / mid(d) + 0.15)));
      P({ id: 'stash', art: 'evt_stash', title: 'Somebody dropped their bag', text: `A gym bag under a bench. Inside: ${qty} ${d.name}. Nobody's around.`,
        data: { drug: d.id, qty }, choices: [{ id: 'take', label: 'Take it' }, { id: 'leave', label: 'Leave it' }] });
    } else if (ev === 'deal') {
      const avail = tradable.filter(d => basePrice(s, d.id));
      const d = pick(avail.length ? avail : tradable);
      const local = G.price(s, d.id) || mid(d);
      const each = Math.max(1, Math.round(local * rnd(0.42, 0.62))), qty = Math.max(5, Math.round(ri(8, 40) * Math.sqrt(1 + s.rep / 10)));
      P({ id: 'deal', art: 'evt_deal', title: 'A desperate seller', text: `A twitchy guy needs cash fast: ${qty} ${d.name} at ${G.money(each)} each. Way under the street price.`,
        data: { drug: d.id, qty, each }, choices: [{ id: 'buy', label: `Buy (${G.money(each * qty)})` }, { id: 'pass', label: 'Pass' }] });
    } else if (ev === 'tip') {
      const where = pick(G.DISTRICTS.filter(d => d.id !== s.loc && !G.locked(s, d))), d = pick(tradable);
      const cost = nice(300 + s.day * 60 + s.rep * 400);
      P({ id: 'tip', art: 'evt_tip', title: 'The payphone rings', text: `"I know something about ${d.name} in ${where.name}. Big. ${G.money(cost)} and it's yours."`,
        data: { dist: where.id, drug: d.id, cost }, choices: [{ id: 'pay', label: `Pay ${G.money(cost)}` }, { id: 'hang', label: 'Hang up' }] });
    } else if (ev === 'coat') {
      const cost = ri(8, 14) * 100;
      P({ id: 'coat', art: 'gear_trench', title: 'A coat with deep pockets', text: `A guy on the corner is selling a trench coat with ${COAT.trench.cap} units of hidden pockets for ${G.money(cost)}.`,
        data: { cost }, choices: [{ id: 'buy', label: `Buy (${G.money(cost)})` }, { id: 'pass', label: 'Pass' }] });
    } else if (ev === 'volunteer') {
      const r = genRecruits(s, 1)[0]; r.fee = 0;
      P({ id: 'volunteer', art: G.ROLES[r.role].art, title: 'Someone wants in', text: `${r.name} (${G.ROLES[r.role].name}) heard about you. "No signing fee. Just pay me ${G.money(r.wage)} a day."`,
        data: { recruit: r }, choices: [{ id: 'hire', label: 'Welcome aboard' }, { id: 'pass', label: 'Not now' }] });
    } else if (ev === 'gun') {
      const w = pick(G.WEAPONS.filter(x => x.where === 'shop' && x.price < 100000 && (x.rep || 0) <= s.rep + 10));
      const cost = nice(w.price * rnd(0.45, 0.65));
      P({ id: 'gun', art: w.art, title: 'Fell off a truck', text: `A stranger opens his car trunk: a ${w.name} for ${G.money(cost)}. Half the store price.`,
        data: { weapon: w.id, cost }, choices: [{ id: 'buy', label: `Buy (${G.money(cost)})` }, { id: 'pass', label: 'Pass' }] });
    } else if (ev === 'arms') {
      const w = pick(G.WEAPONS.filter(x => x.where === 'black' && (x.rep || 0) <= s.rep + 15));
      const cost = nice(w.price * rnd(0.6, 0.85));
      P({ id: 'gun', art: 'evt_arms', title: 'A traveling arms dealer', text: `A man with a long case and an accent nobody can place. Inside: a ${w.name} (${w.dmg} damage${w.shots > 1 ? ` × ${w.shots}` : ''}) for ${G.money(cost)}. One time offer.`,
        data: { weapon: w.id, cost }, choices: [{ id: 'buy', label: `Buy (${G.money(cost)})` }, { id: 'pass', label: 'Pass' }] });
    } else if (ev === 'checkpoint') {
      const hide = G.stealth(s);
      const fine = nice(1000 + s.heat * 300 * G.scale(s));
      P({ id: 'checkpoint', art: 'evt_checkpoint', title: 'Police checkpoint', text: `Cones, flares and a line of cars. They're searching trunks. Your stealth: ${Math.round(hide * 100)}%. Drive through and hope, or pay a cop ${G.money(fine)} to wave you past.`,
        data: { fine, hide }, choices: [{ id: 'risk', label: 'Drive through' }, { id: 'pay', label: `Pay ${G.money(fine)}` }] });
    } else if (ev === 'skim') {
      const c = pick(s.crew), amt = nice(s.cash * rnd(0.05, 0.12));
      P({ id: 'skim', art: G.ROLES[c.role].art, title: 'Someone\'s been skimming', text: `${c.name} has been taking from the count: ${G.money(amt)} so far. What do you do?`,
        data: { crew: c.id, amt }, choices: [{ id: 'fire', label: 'Cut them loose' }, { id: 'forgive', label: 'Let it go this once' }] });
    } else if (ev === 'reporter') {
      const cost = nice(5000 + s.heat * 800);
      P({ id: 'reporter', art: 'evt_reporter', title: 'A nosy reporter', text: `A journalist from the Harbor Herald has photos of you. Pay ${G.money(cost)} and the story dies, or the city reads about you tomorrow.`,
        data: { cost }, choices: [{ id: 'pay', label: `Pay ${G.money(cost)}` }, { id: 'ignore', label: 'Let them print it' }] });
    } else if (ev === 'cash') {
      const amt = nice(rnd(300, 2500) * G.scale(s) * (1 + s.rep / 20));
      P({ id: 'cash', art: 'evt_cash', title: 'Lucky night', text: `A wallet in the gutter with ${G.money(amt)} in it and no ID.`,
        data: { amt }, choices: [{ id: 'take', label: 'Pocket it' }] });
    } else if (ev === 'festival') {
      const party = ['ecstasy', 'acid', 'shrooms', 'weed', 'peyote', 'hash'].filter(id => basePrice(s, id));
      if (!party.length) return;
      for (const id of party) s.prices[s.loc][id] = Math.round(s.prices[s.loc][id] * 1.6);
      P({ id: 'festival', art: 'evt_festival', title: 'Festival in town', text: 'A music festival just opened. Party favors are going for 60% more here today.',
        data: {}, choices: [{ id: 'ok', label: 'Good to know' }] });
    }
  }

  G.choose = function (s, choice) {
    const p = s.pending;
    if (!p || p.kind !== 'event') return { ok: false };
    const d = p.data || {};
    let msg = '', tone = '';
    if (p.id === 'stash' && choice === 'take') {
      const qty = Math.min(d.qty, G.space(s));
      if (qty > 0) { addInv(s.inv, d.drug, qty, 0); msg = `You grabbed ${qty} ${DRUG[d.drug].name}.`; } else msg = 'No room to carry it.';
    } else if (p.id === 'deal' && choice === 'buy') {
      const qty = Math.min(d.qty, G.space(s), Math.floor(s.cash / d.each));
      if (qty > 0) { s.cash -= qty * d.each; addInv(s.inv, d.drug, qty, qty * d.each); msg = `Bought ${qty} ${DRUG[d.drug].name} on the cheap.`; } else msg = 'You couldn\'t afford it or carry it.';
    } else if (p.id === 'tip' && choice === 'pay') {
      if (s.cash < d.cost) msg = 'You don\'t have the cash.';
      else { s.cash -= d.cost; s.tip = { dist: d.dist, drug: d.drug, until: s.day + 4 }; msg = `"${DRUG[d.drug].name} in ${DIST[d.dist].name}. Get there in the next few days."`; }
    } else if (p.id === 'coat' && choice === 'buy') {
      if (s.cash < d.cost) msg = 'You don\'t have the cash.'; else { s.cash -= d.cost; s.coat = 'trench'; msg = 'More pockets. Nice.'; }
    } else if (p.id === 'volunteer' && choice === 'hire') {
      if (s.crew.length >= G.crewCap(s)) msg = 'Your crew is full.'; else { const { fee, ...m } = d.recruit; s.crew.push(m); msg = `${d.recruit.name} joins the crew.`; }
    } else if (p.id === 'gun' && choice === 'buy') {
      if (s.cash < d.cost) msg = 'You don\'t have the cash.'; else { s.cash -= d.cost; s.weapons[d.weapon] = (s.weapons[d.weapon] || 0) + 1; msg = `You picked up a ${WEAPON[d.weapon].name}.`; }
    } else if (p.id === 'checkpoint') {
      if (choice === 'pay' && s.cash >= d.fine) { s.cash -= d.fine; msg = 'The cop pockets the cash and waves you through.'; }
      else if (chance(0.45 + d.hide)) msg = 'They waved you through. Breathe.';
      else {
        const lost = [];
        for (const id of Object.keys(s.inv)) { const q = Math.ceil(s.inv[id].qty * rnd(0.3, 0.7)); takeInv(s.inv, id, q); lost.push(`${q} ${DRUG[id].name}`); }
        s.heat = clamp(s.heat + 12, 0, 100); tone = 'bad';
        msg = lost.length ? `They found some of it: ${lost.join(', ')} gone, and now they know your face.` : 'They tore the car apart and found nothing. Now they know your face.';
      }
    } else if (p.id === 'skim') {
      const c = s.crew.find(x => x.id === d.crew);
      if (choice === 'fire' && c) { s.crew = s.crew.filter(x => x !== c); gainRep(s, 1); msg = `${c.name} is gone. Everyone else got the message.`; }
      else { s.cash = Math.max(0, s.cash - d.amt); msg = 'You let it go. It costs you, and the crew noticed.'; gainRep(s, -1); tone = 'bad'; }
    } else if (p.id === 'reporter') {
      if (choice === 'pay' && s.cash >= d.cost) { s.cash -= d.cost; msg = 'The story never runs.'; }
      else { s.heat = clamp(s.heat + 15, 0, 100); gainRep(s, 2); msg = 'You\'re on the front page. Your rep went up, and so did the heat.'; tone = 'bad'; }
    } else if (p.id === 'cash') {
      s.cash += d.amt; msg = `+${G.money(d.amt)}.`;
    } else if (p.id === 'contract' && choice === 'deliver') {
      msg = G.complete(s, d.contract).msg || '';
    }
    s.pending = null;
    if (msg) note(s, msg, tone);
    return { ok: true, msg };
  };

  // ---------- fighting ----------
  function writeBack(s, squad) {
    s.hp = Math.max(0, squad[0].hp);
    for (const m of squad.slice(1)) { const c = s.crew.find(x => x.id === m.id); if (c) c.hp = m.hp; }
  }
  G.fight = function (s) {
    const p = s.pending;
    if (!p || p.kind !== 'fight' || p.result) return { ok: false };
    const squad = G.loadout(s);
    p.round++;
    p.last = exchange(squad, p.foes);
    writeBack(s, squad);
    return checkFight(s);
  };
  G.escapeChance = function (s) {
    const p = s.pending;
    const wheel = s.crew.filter(c => c.role === 'wheelman' && c.hp > 0).length;
    const alive = p ? p.foes.filter(f => f.hp > 0).length : 1;
    const cap = p && p.escapeCap ? p.escapeCap : 0.8;
    const base = 0.4 + VEHICLE[s.vehicle].escape + Math.min(0.18, wheel * G.ROLES.wheelman.escape) - alive * 0.025 - s.heat / 250
      + (p && p.faction === 'muggers' ? 0.15 : 0) - (p && p.job ? 0.05 : 0);
    return clamp(Math.min(cap, base) + (p ? p.smoke : 0), 0.05, 0.95);
  };
  G.run = function (s) {
    const p = s.pending;
    if (!p || p.kind !== 'fight' || p.result || !p.canRun) return { ok: false };
    const odds = G.escapeChance(s);
    p.smoke = 0;
    if (chance(odds)) {
      p.result = { outcome: 'escaped', title: 'You got away', text: p.job ? 'You pulled out and got away.' : 'You lost them in the back streets.' };
      if (p.reason === 'cops') s.heat = clamp(s.heat + 6, 0, 100);
      if (p.reason === 'retaliation') loseTurf(s, s.loc);
      return { ok: true, escaped: true };
    }
    const squad = G.loadout(s), hits = [];
    const chasers = p.foes.filter(f => f.hp > 0 && chance(0.65)); // only the ones who keep up get a shot
    volley(chasers.length ? chasers : p.foes.filter(f => f.hp > 0).slice(0, 1), squad, hits, 'them');
    writeBack(s, squad);
    p.last = hits; p.round++;
    return { ...checkFight(s), escaped: false };
  };
  // use something from the bag; everything but smoke takes your turn (the enemy shoots back)
  G.useItem = function (s, id) {
    const p = s.pending;
    if (!p || p.kind !== 'fight' || p.result || !(s.items[id] > 0)) return { ok: false };
    s.items[id]--;
    if (!s.items[id]) delete s.items[id];
    const hits = [];
    if (id === 'smoke') { p.smoke = 0.35; p.last = [{ side: 'us', item: 'Smoke fills the street. Your next run is much more likely to work.' }]; return { ok: true }; }
    if (id === 'medkit') {
      s.hp = Math.min(s.maxHp, s.hp + 35);
      for (const c of s.crew) c.hp = Math.min(c.maxHp, c.hp + 35);
      hits.push({ side: 'us', item: 'Med kit: everyone patched up (+35).' });
    } else {
      const alive = p.foes.filter(f => f.hp > 0);
      const targets = id === 'molotov' ? alive : shuffle(alive.slice()).slice(0, 3);
      const dmg = id === 'molotov' ? 18 : 50;
      for (const t of targets) { const d = Math.max(1, Math.round(dmg * rnd(0.85, 1.15) * (1 - t.armor))); t.hp = Math.max(0, t.hp - d); hits.push({ side: 'us', from: ITEM[id].name, to: t.name, dmg: d, down: t.hp === 0 }); }
    }
    const squad = G.loadout(s);
    volley(p.foes, squad, hits, 'them');
    writeBack(s, squad);
    p.last = hits; p.round++;
    return checkFight(s);
  };
  G.bribe = function (s) {
    const p = s.pending;
    if (!p || p.result || !p.bribe) return { ok: false };
    if (s.cash < p.bribe) return { ok: false, msg: `They want ${G.money(p.bribe)}. You don't have it.` };
    s.cash -= p.bribe;
    s.heat = clamp(s.heat - 12, 0, 100);
    p.result = { outcome: 'bribed', title: 'Money talks', text: `${G.money(p.bribe)} changes hands. They remember somewhere else to be.` };
    return { ok: true };
  };
  G.payDebt = function (s) {
    const p = s.pending;
    if (!p || p.result || !p.canPayDebt) return { ok: false };
    if (s.cash + s.bank < s.debt) return { ok: false, msg: `You need ${G.money(s.debt)} between cash and the bank.` };
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
    if (p.job) {
      if (p.round > 0) return { ok: false, msg: 'Too late to call it off. Fight or retreat.' };
      p.result = { outcome: 'escaped', title: 'Called off', text: 'You back out before anyone gets hurt.' };
      return { ok: true };
    }
    gainRep(s, -1);
    if (p.reason === 'muggers') {
      const take = Math.round(s.cash * rnd(0.25, 0.5)); s.cash -= take;
      p.result = { outcome: 'robbed', title: 'Robbed', text: `They grab ${G.money(take)} and run.` };
    } else if (p.reason === 'rival') {
      const lost = [];
      for (const id of Object.keys(s.inv)) { const q = Math.ceil(s.inv[id].qty / 2); takeInv(s.inv, id, q); lost.push(`${q} ${DRUG[id].name}`); }
      const take = Math.round(s.cash * 0.2); s.cash -= take;
      gainRep(s, -2);
      p.result = { outcome: 'robbed', title: 'Street tax paid', text: `They take ${lost.length ? lost.join(', ') + ' and ' : ''}${G.money(take)}. Word gets around.` };
    } else if (p.reason === 'vinnie') {
      const take = Math.min(s.cash, s.debt); s.cash -= take; s.debt -= take;
      s.hp = Math.max(5, s.hp - 30); s.debtDue = s.day + 5;
      p.result = { outcome: 'beaten', title: 'A friendly reminder', text: `They take ${G.money(take)} toward the debt and break a couple of fingers. Five more days.` };
    } else if (p.reason === 'retaliation') {
      loseTurf(s, s.loc);
      p.result = { outcome: 'robbed', title: 'You gave it up', text: `${DIST[s.loc].name} belongs to the ${G.FACTIONS[p.faction].name} again.` };
    }
    return { ok: true };
  };
  function busted(s, why) {
    const p = s.pending;
    const drugs = Object.values(s.inv).reduce((n, h) => n + h.qty, 0);
    // nothing on you and no warrant: they search you and let you go
    if (!drugs && !G.packageSpace(s) && s.heat < 50 && s.hp > 0) {
      s.heat = clamp(s.heat - 5, 0, 100);
      p.result = { outcome: 'released', title: 'Clean', text: 'They pat you down, find nothing and let you walk. "We\'ll be seeing you."' };
      return { ok: true };
    }
    if (p.faction === 'beat' && s.hp > 0) {
      // a patrol car: they take a cut of the product and look the other way
      const lost = [];
      for (const id of Object.keys(s.inv)) { const q = Math.ceil(s.inv[id].qty * 0.4); takeInv(s.inv, id, q); lost.push(`${q} ${DRUG[id].name}`); }
      s.heat = clamp(s.heat + 5, 0, 100);
      p.result = { outcome: 'robbed', title: 'Shaken down', text: `The officers "confiscate" ${lost.join(', ')} and let you go. Nobody files a report.` };
      return { ok: true };
    }
    let fine = Math.round(Math.min(s.cash, s.cash * 0.15 + drugs * 50));
    let days = Math.min(10, 1 + Math.floor(drugs / 80) + Math.floor(s.heat / 30));
    if (s.judge) { fine = Math.round(fine / 2); days = Math.ceil(days / 2); }
    s.inv = {}; s.cash -= fine;
    s.heat = 15; s.manhunt = 0; s.stats.busts++;
    for (const c of s.contracts) if (c.type === 'smuggle') { c.failed = true; gainRep(s, -3); }
    s.contracts = s.contracts.filter(c => !c.failed);
    s.hp = Math.max(s.hp, 25);
    for (let i = 0; i < days; i++) dailyTick(s);
    p.result = { outcome: 'busted', title: 'Busted', art: 'scene_busted',
      text: `${why} They take ${drugs ? 'everything you were carrying, ' : ''}${G.money(fine)} in "fines", and you sit ${days} day${days === 1 ? '' : 's'} in county lockup.${s.judge ? ' (Your judge helped.)' : ''}` };
    return { ok: true };
  }
  function checkFight(s) {
    const p = s.pending;
    const fallen = s.crew.filter(c => c.hp <= 0);
    for (const c of fallen) { note(s, `${c.name} didn't make it.`, 'bad'); s.stats.crewLost++; }
    s.crew = s.crew.filter(c => c.hp > 0);
    if (fallen.length) p.fallen = (p.fallen || []).concat(fallen.map(c => c.name));
    // you only die when nobody on your side is left standing; until then the crew fights on
    if (s.hp <= 0 && !s.crew.length) {
      if (p.reason === 'cops' && p.faction !== 'feds') { s.hp = 1; return busted(s, 'You wake up in handcuffs.'); }
      s.stats.fightsLost++;
      // half the time they leave you for dead: you lose what you carried and wake up in the hospital
      if (p.faction !== 'feds' && chance(0.5)) {
        const took = Math.round(s.cash * 0.3);
        s.cash -= took; s.inv = {}; s.hp = 15;
        for (let i = 0; i < 3; i++) dailyTick(s);
        p.result = { outcome: 'beaten', title: 'Left for dead', art: 'scene_loss',
          text: `${G.FACTIONS[p.faction].name} took everything you carried and ${G.money(took)}, and left you in the gutter. You wake up three days later at Mercy General.` };
        return { ok: true };
      }
      p.result = { outcome: 'dead', title: 'WASTED', text: `${G.FACTIONS[p.faction].name} left you in the street on day ${s.day}.`, art: 'scene_wasted' };
      endRun(s, 'dead');
      return { ok: true, dead: true };
    }
    if (!p.foes.some(f => f.hp > 0)) return winFight(s);
    return { ok: true };
  }
  function winFight(s) {
    const p = s.pending, sc = G.scale(s), n = p.foes.length;
    s.stats.fightsWon++;
    if (s.hp <= 0) { s.hp = 1; note(s, 'You went down, but your crew won it and dragged you out.'); }
    // the crew gets better with every win
    for (const c of s.crew) {
      const before = G.crewLevel(c);
      c.wins = (c.wins || 0) + 1;
      if (G.crewLevel(c) > before) { c.maxHp += 8; c.hp += 8; note(s, `${c.name} is getting good at this (${'★'.repeat(G.crewLevel(c))}).`); }
    }
    const medic = s.crew.filter(c => c.role === 'medic').length;
    if (medic) {
      const heal = G.ROLES.medic.heal * medic;
      s.hp = Math.min(s.maxHp, s.hp + heal);
      for (const c of s.crew) c.hp = Math.min(c.maxHp, c.hp + heal);
    }
    const gains = [];
    let cash = 0;
    const giveDrugs = (id, qty) => { const q = Math.min(qty, G.space(s)); if (q > 0) { addInv(s.inv, id, q, 0); gains.push(`${q} ${DRUG[id].name}`); } if (q < qty) gains.push(`(${qty - q} left behind, no room)`); };
    if (p.job) {
      const j = p.job, def = JOB[j.type] || {};
      cash = j.cash;
      if (j.drugQty && j.drug) giveDrugs(j.drug, j.drugQty);
      s.heat = clamp(s.heat + (j.heat || def.heat || 0), 0, 100);
      gainRep(s, (j.rep || def.rep || 0) * 0.6);
      s.stats.jobs++;
      if (j.type === 'turf') {
        s.turf[j.dist] = true; s.stats.turfTaken++;
        gains.push(`${DIST[j.dist].name} is now YOUR turf`);
        note(s, `You took ${DIST[j.dist].name} from the ${G.FACTIONS[j.faction].name}.`);
      } else if (j.type === 'boss') {
        s.beaten[j.faction] = true;
        gains.push(`the ${G.FACTIONS[j.faction].name} are finished`);
        note(s, `${G.FACTIONS[j.faction].boss} is gone. The ${G.FACTIONS[j.faction].name} are finished.`);
      } else if (j.type === 'hit') {
        const c = s.contracts.find(x => x.id === j.contract);
        if (c) { c.done = true; s.stats.contracts++; s.contracts = s.contracts.filter(x => x !== c); }
      }
      if (chance(0.12 + (j.rep || def.rep || 0) / 100)) { // sometimes they had something nice
        const w = pick(G.WEAPONS.filter(x => x.where && (x.rep || 0) <= s.rep + 20));
        s.weapons[w.id] = (s.weapons[w.id] || 0) + 1; gains.push(`a ${w.name}`);
      }
    } else if (p.reason === 'cops') {
      s.heat = clamp(s.heat + 30, 0, 100); s.manhunt += 4; s.stats.copsBeaten += n;
      gainRep(s, p.faction === 'feds' ? 5 : p.faction === 'swat' ? 3 : 1.5);
      gains.push(`a ${s.manhunt}-day manhunt`);
    } else if (p.reason === 'muggers') {
      cash = ri(80, 500); gainRep(s, 0.5);
    } else if (p.reason === 'rival' || p.reason === 'retaliation') {
      cash = nice(ri(500, 1500) * n * sc); gainRep(s, 0.5 + n / 10); s.heat = clamp(s.heat + 5, 0, 100);
      const d = pick(G.DRUGS.filter(x => G.canTrade(s, x.id)));
      giveDrugs(d.id, Math.max(3, Math.round(ri(4, 12) * n * Math.min(1, 600 / mid(d) + 0.1))));
      if (p.reason === 'retaliation') gains.push('you kept your turf');
    } else if (p.reason === 'vinnie') {
      gainRep(s, 3); s.debtDue = s.day + 6; s.heat = clamp(s.heat + 5, 0, 100);
      gains.push('Vinnie gives you six more days');
    }
    s.cash += cash;
    if (cash) gains.unshift(G.money(cash));
    const big = p.job && (p.job.type === 'turf' || p.job.type === 'boss');
    p.result = { outcome: 'won', title: p.job ? (big ? 'The streets are yours' : 'Job done') : 'You won', art: big ? 'scene_takeover' : 'scene_win',
      text: gains.length ? `You walk away with ${gains.join(', ')}.` : 'They won\'t try that again.' };
    if (Object.keys(s.turf).length === G.DISTRICTS.length && !s.king) {
      s.king = true; gainRep(s, 10);
      p.result.text += ' Every district in Vice Harbor answers to you now. You can take the throne from the menu.';
      note(s, 'You run all of Vice Harbor.');
    }
    s.peak = Math.max(s.peak, G.netWorth(s));
    return { ok: true, won: true };
  }
  function loseTurf(s, d) {
    if (!s.turf[d]) return;
    delete s.turf[d];
    note(s, `You lost ${DIST[d].name}.`, 'bad');
  }
  G.closeFight = function (s) { if (s.pending && s.pending.result) { s.pending = null; if (s.hp <= 0 && !s.over) s.hp = 1; } };

  // ---------- jobs, turf wars and bosses ----------
  function genJobs(s, dist) {
    const sc = G.scale(s);
    const fits = G.JOBS.filter(j => !j.where || j.where.includes(dist.id));
    return shuffle(fits.slice()).slice(0, 2).map(j => {
      const drug = j.premium ? pick(['heroin', 'cocaine', 'opium']) : pick(G.DRUGS.slice(0, 8)).id;
      const faction = j.faction || dist.faction, n = ri(j.size[0], j.size[1]) + Math.floor((sc - 1) * 2);
      return { id: 'j' + (s.nextId++), type: j.id, faction, foes: fixedFoes(s, faction, n, j.power),
               cash: nice(ri(j.cash[0], j.cash[1]) * (1 + (sc - 1) * 0.8) * (1 + s.rep / 30)),
               drug: j.drugs[1] ? drug : null, drugQty: j.drugs[1] ? Math.round(ri(j.drugs[0], j.drugs[1]) * (1 + s.rep / 80)) : 0, done: false };
    });
  }
  const homeOf = f => (f === 'kings' ? 'eastside' : f === 'vitale' ? 'strip' : (G.DISTRICTS.find(d => d.faction === f) || {}).id);
  G.homeOf = homeOf;
  // the turf war and boss fight for this district, when they're open
  function refreshSpecialJobs(s) {
    const dist = DIST[s.loc], f = dist.faction, list = s.jobs[s.loc].list;
    const keep = list.filter(j => !['turf', 'boss'].includes(j.type));
    const extra = [];
    if (!s.turf[s.loc] && !s.beaten[f]) {
      const old = list.find(j => j.type === 'turf' && !j.done);
      extra.push(old || { id: 'j' + (s.nextId++), type: 'turf', dist: s.loc, faction: f,
        foes: fixedFoes(s, f, 4 + Math.round(dist.turfRep / 10), 1.1 + dist.turfRep / 150, dist.lieutenant),
        cash: nice(dist.tribute * 3), rep: 8, heat: 20, done: false, minRep: dist.turfRep });
    }
    const theirs = G.DISTRICTS.filter(d => d.faction === f);
    if (!s.beaten[f] && homeOf(f) === s.loc && theirs.every(d => s.turf[d.id])) {
      const old = list.find(j => j.type === 'boss' && !j.done);
      extra.push(old || { id: 'j' + (s.nextId++), type: 'boss', dist: s.loc, faction: f,
        foes: fixedFoes(s, f, 12, 1.5 + theirs.reduce((n, d) => n + d.turfRep, 0) / 300, G.FACTIONS[f].boss, G.FACTIONS[f].bossArt),
        cash: nice(theirs.reduce((n, d) => n + d.tribute, 0) * 10), rep: 15, heat: 25, done: false, minRep: 0 });
    }
    s.jobs[s.loc].list = extra.concat(keep);
  }
  G.jobsHere = s => (s.jobs[s.loc] ? s.jobs[s.loc].list : []);
  G.jobInfo = function (j) {
    if (j.type === 'turf') return { name: `Turf war: take ${DIST[j.dist].name}`, art: 'job_turf', minRep: j.minRep,
      blurb: `${DIST[j.dist].lieutenant} runs ${DIST[j.dist].name} for the ${G.FACTIONS[j.faction].name}. Beat him and his crew, and the district pays YOU ${G.money(DIST[j.dist].tribute)} a day, sells 10% higher and takes bigger loads.` };
    if (j.type === 'boss') return { name: `Take down ${G.FACTIONS[j.faction].boss}`, art: G.FACTIONS[j.faction].bossArt, minRep: 0,
      blurb: `You own every district the ${G.FACTIONS[j.faction].name} had. Only ${G.FACTIONS[j.faction].boss} is left, with everyone still loyal. Finish it and they never bother you again.` };
    if (j.type === 'hit') return { name: j.title, art: 'job_hit', minRep: 0, blurb: j.blurb };
    const def = JOB[j.type];
    return { name: def.name, art: def.art, minRep: def.minRep, blurb: def.blurb };
  };
  G.jobFoes = (s, j) => j.foes.map(f => ({ ...f }));
  G.startJob = function (s, jobId) {
    const j = G.jobsHere(s).find(x => x.id === jobId);
    if (!j || j.done) return { ok: false, msg: 'That job is gone.' };
    if (s.pending) return { ok: false, msg: 'Deal with what\'s in front of you first.' };
    const info = G.jobInfo(j);
    if (s.rep < info.minRep) return { ok: false, msg: `You need ${info.minRep} rep for this.` };
    j.done = true;
    s.pending = fightPending(s, { reason: 'job', job: j, faction: j.faction, title: info.name, art: info.art,
      text: info.blurb, foes: G.jobFoes(s, j), canRun: true, canGive: true, giveLabel: 'Call it off',
      escapeCap: G.FACTIONS[j.faction].cop ? G.heatTier(s).escapeCap : 0.8 });
    return { ok: true };
  };

  // ---------- contracts (the Fixer) ----------
  function genOffers(s) {
    const fixer = s.crew.some(c => c.role === 'fixer') ? 1.15 : 1;
    const places = G.DISTRICTS.filter(d => d.id !== s.loc && !G.locked(s, d));
    const tradable = G.DRUGS.filter(d => G.canTrade(s, d.id));
    const out = [];
    for (let i = 0; i < 3; i++) {
      const to = pick(places), type = weighted([['deliver', 1.2], ['smuggle', 0.9], ['hit', s.rep >= 8 && !s.beaten[to.faction] ? 0.8 : 0]]);
      const days = ri(2, 5) + (to.days || 0);
      if (type === 'deliver') {
        const d = pick(tradable), qty = Math.max(5, Math.round(ri(10, 40) * Math.sqrt(1 + s.rep / 8) * Math.min(1, 1500 / mid(d) + 0.3)));
        out.push({ id: 'k' + (s.nextId++), type, drug: d.id, qty, to: to.id, days, pay: nice(qty * d.hi * rnd(1.25, 1.5) * fixer), rep: 2,
          title: `${qty} ${d.name} to ${to.name}`, blurb: `Bring ${qty} ${d.name} to a buyer in ${to.name}. Pays well above street price.` });
      } else if (type === 'smuggle') {
        // you have to sit on it: the buyer only takes it after `hold` days, then you have `window` days to get it there
        const hot = s.rep >= 15 && chance(0.35);
        const size = ri(15, 45), hold = hot ? ri(10, 14) : ri(3, 6), window = (hot ? 4 : 3) + (to.days || 0);
        const pay = nice((10000 + s.rep * 2000) * rnd(0.8, 1.2) * G.scale(s) * fixer * (1 + hold * 0.1) * (hot ? 2.5 : 1));
        out.push({ id: 'k' + (s.nextId++), type, size, to: to.id, hold, hot, days: hold + window, pay, rep: hot ? 6 : 3,
          title: hot ? `🔥 A hot package for ${to.name}` : `A sealed package for ${to.name}`,
          blurb: hot
            ? `Takes ${size} space. Keep it for ${hold} days, then deliver it to ${to.name} within ${window} days. Everyone wants it: while you carry it, cops and gangs come at you more often, and you can't run, bribe or surrender. You fight. Getting busted loses it.`
            : `Takes ${size} space. Keep it hidden for ${hold} days, then deliver it to ${to.name} within ${window} days. Cops look harder while you carry it, and getting busted loses it.` });
      } else {
        const f = G.FACTIONS[to.faction];
        const target = `${pick(G.FIRST)} ${pick(['the Butcher', 'Scar', 'Big Lou', 'the Snake', 'Two-Guns'])}`;
        out.push({ id: 'k' + (s.nextId++), type, to: to.id, faction: to.faction, days, target, pay: nice((20000 + s.rep * 5000) * rnd(0.9, 1.3) * G.scale(s) * fixer), rep: 4,
          title: `Take out ${target} in ${to.name}`, blurb: `${target} runs a ${f.name} crew in ${to.name}. The job shows up there.` });
      }
    }
    return out;
  }
  G.offersHere = s => (s.offers[s.loc] ? s.offers[s.loc].list : []);
  G.accept = function (s, id) {
    const list = G.offersHere(s), o = list.find(x => x.id === id);
    if (!o) return { ok: false, msg: 'That offer is gone.' };
    if (s.contracts.length >= 3) return { ok: false, msg: 'You\'ve got three contracts already. Finish one first.' };
    if (o.type === 'smuggle' && G.space(s) < o.size) return { ok: false, msg: `You need ${o.size} free space for the package.` };
    list.splice(list.indexOf(o), 1);
    const c = { ...o, until: s.day + o.days, ready: o.type === 'smuggle' ? s.day + o.hold : s.day };
    s.contracts.push(c);
    if (c.type === 'hit') {
      // the hit shows up as a job in that district
      const jl = s.jobs[c.to] || (s.jobs[c.to] = { day: s.day, list: [] });
      jl.list.push({ id: 'j' + (s.nextId++), type: 'hit', contract: c.id, dist: c.to, faction: c.faction, foes: fixedFoes(s, c.faction, ri(4, 6) + Math.floor(s.rep / 25), 1.1, c.target),
        cash: c.pay, rep: c.rep, heat: 12, done: false, title: c.title, blurb: `The Fixer wants ${c.target} gone before day ${c.until + 1}. Pays ${G.money(c.pay)}.` });
    }
    return { ok: true, msg: c.type === 'smuggle' ? `Deal. Keep it hidden until day ${c.ready}, then get it to ${DIST[c.to].name} by day ${c.until}.` : `Deal. ${c.title}, by day ${c.until}.` };
  };
  // contracts you can finish right here
  G.contractsHere = s => s.contracts.filter(c => !c.done && c.to === s.loc && c.type !== 'hit');
  // arriving where a contract is due: a package pays at once; a delivery asks; a hit points you to the Jobs tab
  function contractArrival(s) {
    const c = s.contracts.find(x => !x.done && x.to === s.loc);
    if (!c) return false;
    if (c.type === 'smuggle') {
      if (c.ready && s.day < c.ready) {
        s.pending = { kind: 'event', id: 'contract', art: 'char_fixer', title: 'Too early', text: `The buyer isn't ready until day ${c.ready}. Keep the package hidden and come back between day ${c.ready} and day ${c.until}.`, data: {}, choices: [{ id: 'ok', label: 'Got it' }] };
        return true;
      }
      const r = G.complete(s, c.id);
      s.pending = { kind: 'event', id: 'contract', art: 'char_fixer', title: 'Package delivered', text: `A man in a parked car takes the package without a word. ${r.msg}`, data: {}, choices: [{ id: 'ok', label: 'Nice' }] };
    } else if (c.type === 'deliver') {
      const have = s.inv[c.drug] ? s.inv[c.drug].qty : 0;
      s.pending = { kind: 'event', id: 'contract', art: 'char_fixer', title: 'Your buyer is here',
        text: have >= c.qty ? `The Fixer's buyer wants ${c.qty} ${DRUG[c.drug].name} for ${G.money(c.pay)}.` : `The buyer wants ${c.qty} ${DRUG[c.drug].name} for ${G.money(c.pay)}, but you only have ${have}. Buy more here or come back before day ${c.until + 1}.`,
        data: { contract: c.id }, choices: have >= c.qty ? [{ id: 'deliver', label: `Hand over ${c.qty} (+${G.money(c.pay)})` }, { id: 'later', label: 'Not yet' }] : [{ id: 'later', label: 'OK' }] };
    } else {
      s.pending = { kind: 'event', id: 'contract', art: 'job_hit', title: 'Your target is here', text: `${c.target} is in ${DIST[s.loc].name}. The hit is on your Jobs tab, worth ${G.money(c.pay)}.`, data: {}, choices: [{ id: 'ok', label: 'Got it' }] };
    }
    return true;
  }
  G.complete = function (s, id) {
    const c = s.contracts.find(x => x.id === id);
    if (!c || c.to !== s.loc || c.type === 'hit') return { ok: false };
    if (c.type === 'smuggle' && c.ready && s.day < c.ready) return { ok: false, msg: `The buyer isn't ready until day ${c.ready}.` };
    if (c.type === 'deliver') {
      const h = s.inv[c.drug];
      if (!h || h.qty < c.qty) return { ok: false, msg: `You need ${c.qty} ${DRUG[c.drug].name} on you.` };
      takeInv(s.inv, c.drug, c.qty);
    }
    s.cash += c.pay; gainRep(s, c.rep); s.stats.contracts++;
    s.contracts = s.contracts.filter(x => x !== c);
    return { ok: true, msg: `Contract done: +${G.money(c.pay)}.` };
  };

  // ---------- crew ----------
  function genRecruits(s, n) {
    const roles = Object.keys(G.ROLES);
    return Array.from({ length: n }, () => {
      const role = pick(roles), r = G.ROLES[role];
      const hp = ri(r.hp[0], r.hp[1]);
      const wage = roundTo(ri(r.wage[0], r.wage[1]) * (1 + (G.scale(s) - 1) * 0.1) * (1 + s.rep / 120), 10);
      return { id: 'c' + (s.nextId++), name: `${pick(G.FIRST)} "${pick(G.NICK)}"`, role, hp, maxHp: hp,
               acc: Math.round(rnd(r.acc[0], r.acc[1]) * 100) / 100, wage, fee: wage * 3, wins: 0 };
    });
  }
  G.recruitsHere = s => (s.recruits[s.loc] ? s.recruits[s.loc].list : []);
  G.hire = function (s, id) {
    const list = G.recruitsHere(s), r = list.find(x => x.id === id);
    if (!r) return { ok: false, msg: 'They left.' };
    if (s.crew.length >= G.crewCap(s)) return { ok: false, msg: `A ${G.title(s).name} can only lead ${G.crewCap(s)}. Earn more rep.` };
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
    if (G.carried(s) > G.capacity(s) - (G.ROLES[c.role].carry || 0)) return { ok: false, msg: `${c.name} is carrying product. Sell or stash some first.` };
    s.crew = s.crew.filter(x => x !== c);
    return { ok: true, msg: `${c.name} is off the crew.` };
  };

  // ---------- shops ----------
  G.has = (s, svc) => svc === 'stash' || DIST[s.loc].services.includes(svc);
  function genShop(s) {
    const mult = rnd(0.9, 1.15);
    const guns = shuffle(G.WEAPONS.filter(w => w.where === 'shop')).slice(0, ri(4, 6)).sort((a, b) => a.price - b.price).map(w => w.id);
    const armor = shuffle(G.ARMOR.filter(a => a.where === 'shop')).slice(0, 2).sort((a, b) => a.price - b.price).map(a => a.id);
    const black = shuffle(G.WEAPONS.filter(w => w.where === 'black')).slice(0, ri(3, 4)).sort((a, b) => a.price - b.price).map(w => w.id);
    const blackArmor = G.ARMOR.filter(a => a.where === 'black').map(a => a.id);
    return { day: s.day, mult, guns, armor, black, blackArmor };
  }
  G.shopHere = s => s.shops[s.loc] || null;
  G.priceOf = (s, base, black) => { const sh = G.shopHere(s); return nice(base * (sh ? sh.mult : 1) * (black ? 1.1 : 1)); };
  G.BLACK_REP = 20;
  G.buyGear = function (s, kind, id, black) {
    if (!G.has(s, black ? 'blackmarket' : 'guns')) return { ok: false };
    if (black && s.rep < G.BLACK_REP) return { ok: false, msg: `The Black Market doesn't know you. Needs ${G.BLACK_REP} rep.` };
    const item = kind === 'weapon' ? WEAPON[id] : kind === 'armor' ? ARMOR[id] : ITEM[id];
    if (!item || !item.price) return { ok: false };
    if ((item.rep || 0) > s.rep) return { ok: false, msg: `They won't sell that to a ${G.title(s).name}. Needs ${item.rep} rep.` };
    if (kind === 'item' && (s.items[id] || 0) >= item.max) return { ok: false, msg: `You can carry ${item.max} at most.` };
    const price = G.priceOf(s, item.price, black);
    if (s.cash < price) return { ok: false, msg: 'Not enough cash.' };
    s.cash -= price;
    const bag = kind === 'weapon' ? s.weapons : kind === 'armor' ? s.armors : s.items;
    bag[id] = (bag[id] || 0) + 1;
    if (kind !== 'item') s.heat = clamp(s.heat + 1, 0, 100);
    return { ok: true, msg: `Bought: ${item.name}.` };
  };
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
    if ((v.rep || 0) > s.rep) return { ok: false, msg: `Nobody sells a ${v.name} to a ${G.title(s).name}. Needs ${v.rep} rep.` };
    const cost = v.price - G.tradeIn(s);
    if (s.cash < cost) return { ok: false, msg: `You need ${G.money(cost)} after trade-in.` };
    if (G.carried(s) > G.capacity(s, id)) return { ok: false, msg: 'Sell or stash some product first: it won\'t fit in that.' };
    s.cash -= cost; s.vehicle = id;
    return { ok: true, msg: `New wheels: ${v.name}.` };
  };
  G.cratePrice = (s, id) => nice(CRATE[id].price * Math.pow(G.CRATE_STEP, G.crateCount(s)));
  G.buyCrate = function (s, id) {
    if (!G.has(s, 'supply') || !CRATE[id]) return { ok: false };
    const price = G.cratePrice(s, id);
    if (s.cash < price) return { ok: false, msg: 'Not enough cash.' };
    s.cash -= price; s.crates[id]++;
    const c = G.cratesCarried(s);
    return { ok: true, msg: c.fit[id] === s.crates[id] ? `${CRATE[id].name}: +${CRATE[id].cap} space.` : `Bought it, but your ${VEHICLE[s.vehicle].name} has no room to strap it down. It waits in storage for a bigger ride.` };
  };
  G.buyFront = function (s, id) {
    const f = FRONT[id];
    if (!G.has(s, 'realty') || !f || s.fronts.includes(id)) return { ok: false };
    if (s.rep < f.rep) return { ok: false, msg: `You need ${f.rep} rep for the seller to take your call.` };
    if (s.cash < f.price) return { ok: false, msg: 'Not enough cash.' };
    s.cash -= f.price; s.fronts.push(id);
    gainRep(s, 2);
    return { ok: true, msg: `${f.name} is yours. It pays ${G.money(f.income)} a day into the bank.` };
  };
  G.buyLux = function (s, id) {
    const l = LUX[id];
    if (!G.has(s, 'luxury') || !l || s.lux.includes(id)) return { ok: false };
    if (s.rep < l.rep) return { ok: false, msg: `The broker doesn't return calls from a ${G.title(s).name}. Needs ${l.rep} rep.` };
    if (s.cash < l.price) return { ok: false, msg: 'Not enough cash.' };
    s.cash -= l.price; s.lux.push(id); gainRep(s, l.gain);
    return { ok: true, msg: `${l.name}: yours. ${l.perk}` };
  };

  // ---------- money ----------
  G.deposit = function (s, amt) { amt = Math.floor(Math.min(amt, s.cash)); if (!G.has(s, 'bank') || amt <= 0) return { ok: false }; s.cash -= amt; s.bank += amt; return { ok: true, msg: `Deposited ${G.money(amt)}.` }; };
  G.withdraw = function (s, amt) { amt = Math.floor(Math.min(amt, s.bank)); if (!G.has(s, 'bank') || amt <= 0) return { ok: false }; s.bank -= amt; s.cash += amt; return { ok: true, msg: `Withdrew ${G.money(amt)}.` }; };
  G.borrow = function (s, amt) {
    amt = Math.floor(amt);
    const room = G.sharkLimit(s) - s.debt;
    if (!G.has(s, 'shark') || amt <= 0) return { ok: false };
    if (amt > room) return { ok: false, msg: `Vinnie won't go past ${G.money(G.sharkLimit(s))} total.` };
    if (s.debt === 0) s.debtDue = s.day + G.SHARK.graceDays;
    s.debt += amt; s.cash += amt;
    return { ok: true, msg: `Borrowed ${G.money(amt)}. Clock's ticking.` };
  };
  // pay Vinnie: cash first, then the bank (he takes a transfer)
  G.repayRoom = s => Math.min(s.debt, s.cash + s.bank);
  G.repay = function (s, amt) {
    amt = Math.floor(Math.min(amt, G.repayRoom(s)));
    if (!G.has(s, 'shark') || amt <= 0) return { ok: false };
    const fromCash = Math.min(s.cash, amt); s.cash -= fromCash; s.bank -= amt - fromCash;
    s.debt -= amt;
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

  // ---------- the lawyer ----------
  G.LAWYER = { chief: { price: 25000000, rep: 50 }, judge: { price: 8000000, rep: 35 } };
  G.heatFixCost = s => nice((3000 + s.heat * s.heat * 90) * G.scale(s));
  G.fixHeat = function (s) {
    if (!G.has(s, 'lawyer')) return { ok: false };
    if (s.heat < 5) return { ok: false, msg: 'Nobody\'s looking for you right now.' };
    const cost = G.heatFixCost(s);
    if (s.cash < cost) return { ok: false, msg: 'Marty doesn\'t work for free.' };
    s.cash -= cost; s.heat = clamp(s.heat - 25, 0, 100); s.manhunt = 0;
    return { ok: true, msg: 'Files go missing. Witnesses forget. Heat -25.' };
  };
  G.buyOfficial = function (s, which) {
    const o = G.LAWYER[which];
    if (!G.has(s, 'lawyer') || !o || s[which]) return { ok: false };
    if (s.rep < o.rep) return { ok: false, msg: `Marty won't make that call for a ${G.title(s).name}. Needs ${o.rep} rep.` };
    if (s.cash < o.price) return { ok: false, msg: 'Not enough cash.' };
    s.cash -= o.price; s[which] = true;
    return { ok: true, msg: which === 'chief' ? 'The Chief of Police is on your payroll. Heat cools faster, bribes are cheaper, and nobody raids your safehouses.' : 'Judge Harlan owes you. Jail time and fines are halved.' };
  };

  // ---------- safehouses ----------
  G.stashPrice = d => G.STASH_PRICE[d];
  G.stashUpgradePrice = st => nice(G.STASH.upgradePrice * Math.pow(G.STASH.step, (st.cap - G.STASH.base) / G.STASH.upgrade));
  G.stashUsed = st => stashUnits(st);
  G.buyStash = function (s) {
    if (s.stashes[s.loc]) return { ok: false };
    const price = G.stashPrice(s.loc);
    if (s.cash < price) return { ok: false, msg: 'Not enough cash.' };
    s.cash -= price; s.stashes[s.loc] = { cap: G.STASH.base, inv: {} };
    return { ok: true, msg: `You own a safehouse in ${DIST[s.loc].name}.` };
  };
  G.upgradeStash = function (s) {
    const st = s.stashes[s.loc];
    if (!st) return { ok: false };
    const price = G.stashUpgradePrice(st);
    if (s.cash < price) return { ok: false, msg: 'Not enough cash.' };
    s.cash -= price; st.cap += G.STASH.upgrade;
    return { ok: true, msg: `Safehouse holds ${st.cap} now.` };
  };
  G.stashPut = function (s, id, qty) {
    const st = s.stashes[s.loc], h = s.inv[id];
    qty = Math.floor(Math.min(qty, h ? h.qty : 0, st ? st.cap - stashUnits(st) : 0));
    if (!st || qty <= 0) return { ok: false, msg: 'No room.' };
    const cost = takeInv(s.inv, id, qty); addInv(st.inv, id, qty, cost);
    return { ok: true, msg: `Stashed ${qty} ${DRUG[id].name}.` };
  };
  G.stashTake = function (s, id, qty) {
    const st = s.stashes[s.loc], h = st && st.inv[id];
    qty = Math.floor(Math.min(qty, h ? h.qty : 0, G.space(s)));
    if (!st || qty <= 0) return { ok: false, msg: 'No room to carry it.' };
    const cost = takeInv(st.inv, id, qty); addInv(s.inv, id, qty, cost);
    return { ok: true, msg: `Took ${qty} ${DRUG[id].name}.` };
  };

  // ---------- the casino ----------
  G.ROULETTE_RED = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  G.maxBet = s => Math.min(s.cash, 5000000 + s.rep * 500000);
  G.spin = function (s, bet, on) {
    bet = Math.floor(bet);
    if (!G.has(s, 'casino') || bet <= 0 || bet > G.maxBet(s) || !['red', 'black', 'green'].includes(on)) return { ok: false, msg: 'The table won\'t take that bet.' };
    const n = ri(0, 36);
    const color = n === 0 ? 'green' : G.ROULETTE_RED.includes(n) ? 'red' : 'black';
    const win = color === on ? (on === 'green' ? bet * 35 : bet) : -bet;
    s.cash += win; s.stats.gambled += bet;
    return { ok: true, n, color, win };
  };

  // ---------- the end of a run ----------
  function endRun(s, reason) {
    const net = G.netWorth(s);
    s.peak = Math.max(s.peak, net);
    s.over = { reason, day: s.day, net, peak: s.peak, turf: Object.keys(s.turf).length };
  }
  // how: 'retired', 'island' (needs the island) or 'king' (needs every district)
  G.retire = function (s, how) {
    if (s.pending || s.over) return { ok: false };
    if (how === 'island' && !s.lux.includes('island')) return { ok: false };
    if (how === 'king' && !s.king) return { ok: false };
    endRun(s, how || 'retired');
    return { ok: true };
  };
  G.record = function (meta, s) {
    meta.bestNet = Math.max(meta.bestNet, s.peak || 0, s.over ? s.over.net : 0);
    meta.bestDays = Math.max(meta.bestDays, s.day);
  };
  G.closeRun = function (meta, s) {
    G.record(meta, s);
    if (s.over && !s.over.counted) {
      s.over.counted = true;
      if (s.over.reason === 'dead') meta.deaths++; else meta.retired++;
      if (s.over.reason === 'king') meta.kings++;
    }
  };

  G.money = v => (v < 0 ? '-$' : '$') + Math.abs(Math.round(v)).toLocaleString('en-US');
  G.short = v => {
    const a = Math.abs(v), sign = v < 0 ? '-' : '';
    if (a >= 1e9) return `${sign}$${(a / 1e9).toFixed(a >= 1e10 ? 0 : 1)}B`;
    if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(a >= 1e7 ? 0 : 1)}M`;
    if (a >= 1e4) return `${sign}$${Math.round(a / 1e3)}K`;
    return G.money(v);
  };

  // ---------- saves ----------
  // A new season starts the records over (the old economy made them meaningless); old runs end.
  G.SAVE_VERSION = SAVE_VERSION;
  G.load = function (data) {
    if (!data || typeof data !== 'object') return null;
    let meta = { ...G.newMeta(), ...(data.meta || {}) };
    if ((meta.season || 1) < G.SEASON) {
      meta = { ...G.newMeta(), runs: meta.runs || 0, deaths: meta.deaths || 0, retired: meta.retired || 0,
               legacy: { season: meta.season || 1, bestNet: meta.bestNet || 0, bestDays: meta.bestDays || 0 } };
    }
    const run = data.run && data.run.v === SAVE_VERSION ? data.run : null;
    return { meta, run };
  };
})(window.DrugWars = window.DrugWars || {});
