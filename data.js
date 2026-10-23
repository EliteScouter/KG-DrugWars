// ============================================================
//  Drug Wars: the content. Districts, product, gear, vehicles,
//  crew, rival crews, jobs, events and news. Numbers here set
//  the balance; the rules that use them are in sim.js.
// ============================================================
(function (G) {
  'use strict';

  G.CITY = 'Vice Harbor';
  G.SEASON = 2;                   // records reset when this goes up (the old economy was too easy)
  G.START = { cash: 2000, debt: 5500, hp: 100, pockets: 40 };
  G.SHARK = { rate: 0.05, graceDays: 14, baseLimit: 6000, limitPerRep: 2500 };
  G.BANK_RATE = 0.002;

  // ---------- street rep: what it unlocks ----------
  G.TITLES = [
    { rep: 0,  name: 'Nobody' },
    { rep: 5,  name: 'Corner Boy' },
    { rep: 15, name: 'Hustler' },
    { rep: 25, name: 'Dealer' },
    { rep: 40, name: 'Supplier' },
    { rep: 55, name: 'Distributor' },
    { rep: 70, name: 'Kingpin' },
    { rep: 90, name: 'Legend' },
  ];

  // ---------- product ----------
  // lo/hi: normal street price; rep: who'll deal with you; depth: how much the street can take
  // before the price moves a lot (bigger = you can trade more at once)
  G.DRUGS = [
    { id: 'ludes',   name: 'Ludes',    lo: 15,    hi: 80,    rep: 0,  depth: 500, art: 'drug_ludes' },
    { id: 'speed',   name: 'Speed',    lo: 80,    hi: 260,   rep: 0,  depth: 350, art: 'drug_speed' },
    { id: 'weed',    name: 'Weed',     lo: 250,   hi: 800,   rep: 0,  depth: 220, art: 'drug_weed' },
    { id: 'hash',    name: 'Hash',     lo: 500,   hi: 1400,  rep: 4,  depth: 160, art: 'drug_hash' },
    { id: 'ecstasy', name: 'Ecstasy',  lo: 600,   hi: 1700,  rep: 8,  depth: 120, art: 'drug_ecstasy' },
    { id: 'shrooms', name: 'Shrooms',  lo: 700,   hi: 1800,  rep: 8,  depth: 110, art: 'drug_shrooms' },
    { id: 'peyote',  name: 'Peyote',   lo: 1200,  hi: 3000,  rep: 14, depth: 80,  art: 'drug_peyote' },
    { id: 'acid',    name: 'Acid',     lo: 1800,  hi: 5000,  rep: 18, depth: 70,  art: 'drug_acid' },
    { id: 'meth',    name: 'Crystal',  lo: 3500,  hi: 9000,  rep: 25, depth: 55,  art: 'drug_meth' },
    { id: 'opium',   name: 'Opium',    lo: 6000,  hi: 14000, rep: 32, depth: 45,  art: 'drug_opium' },
    { id: 'heroin',  name: 'Heroin',   lo: 9000,  hi: 20000, rep: 42, depth: 35,  art: 'drug_heroin' },
    { id: 'cocaine', name: 'Cocaine',  lo: 16000, hi: 34000, rep: 55, depth: 28,  art: 'drug_cocaine' },
  ];

  // risk: muggers and random trouble; police: how hard the cops look; gang: rival crews around.
  // mult: local price taste; size: how big the market is (depth); turfRep: rep to start a turf war;
  // tribute: what the district pays you each day once it's yours
  G.DISTRICTS = [
    { id: 'downtown', name: 'Downtown', art: 'district_downtown', faction: 'kings', size: 1.3, turfRep: 30, tribute: 15000,
      tagline: 'Glass towers, cop cars on every corner.', lieutenant: 'Smooth Eddie',
      risk: 0.15, police: 0.85, gang: 0.2, travel: 40,
      mult: { ecstasy: 1.15, cocaine: 1.15, weed: 1.1, acid: 0.9 },
      services: ['bank', 'shark', 'hospital', 'lawyer', 'realty', 'tailor', 'stash'] },
    { id: 'docks', name: 'The Docks', art: 'district_docks', faction: 'rats', size: 1.0, turfRep: 35, tribute: 22000,
      tagline: 'Ships unload after midnight. Nobody saw a thing.', lieutenant: 'Hooks Malone',
      risk: 0.45, police: 0.3, gang: 0.55, travel: 60,
      mult: { cocaine: 0.8, heroin: 0.78, opium: 0.85, weed: 0.9 },
      services: ['guns', 'supply', 'recruit', 'blackmarket', 'stash'] },
    { id: 'eastside', name: 'Eastside Projects', art: 'district_eastside', faction: 'kings', size: 1.1, turfRep: 20, tribute: 9000,
      tagline: 'Twelve floors of trouble and a broken elevator.', lieutenant: 'Lil Dre',
      risk: 0.7, police: 0.25, gang: 0.85, travel: 30,
      mult: { ludes: 0.7, speed: 0.75, weed: 0.8, meth: 0.85, cocaine: 1.2, heroin: 1.15 },
      services: ['recruit', 'guns', 'fixer', 'stash'] },
    { id: 'campus', name: 'University Heights', art: 'district_campus', faction: 'kings', size: 0.9, turfRep: 25, tribute: 11000,
      tagline: 'Finals week. Everybody needs something.', lieutenant: 'Professor Plum',
      risk: 0.1, police: 0.35, gang: 0.1, travel: 40,
      mult: { acid: 1.3, ecstasy: 1.3, shrooms: 1.3, peyote: 1.25, weed: 1.2, heroin: 0.85 },
      services: ['tailor', 'hospital', 'stash'] },
    { id: 'lantern', name: 'Lantern Row', art: 'district_lantern', faction: 'triad', size: 0.9, turfRep: 40, tribute: 25000,
      tagline: 'Red lanterns, back rooms, old debts.', lieutenant: 'Red Pole Chen',
      risk: 0.4, police: 0.3, gang: 0.6, travel: 50,
      mult: { opium: 0.65, heroin: 0.72, hash: 0.8, ecstasy: 1.15 },
      services: ['clinic', 'recruit', 'fixer', 'stash'] },
    { id: 'rust', name: 'Rust Yards', art: 'district_rust', faction: 'riders', size: 0.8, turfRep: 30, tribute: 14000,
      tagline: 'Chop shops, biker bars and burning barrels.', lieutenant: 'Tank',
      risk: 0.65, police: 0.15, gang: 0.7, travel: 50,
      mult: { meth: 0.65, speed: 0.6, ludes: 0.75, shrooms: 0.85, cocaine: 1.12 },
      services: ['cars', 'supply', 'guns', 'stash'] },
    { id: 'strip', name: 'The Strip', art: 'district_strip', faction: 'vitale', rep: 10, size: 1.3, turfRep: 55, tribute: 60000,
      tagline: 'Casinos, neon and the Vitale family\'s money.', lieutenant: 'Joey Two-Tone',
      risk: 0.35, police: 0.45, gang: 0.65, travel: 80,
      mult: { cocaine: 1.3, ecstasy: 1.25, acid: 1.15, ludes: 1.3, meth: 1.15 },
      services: ['shark', 'bank', 'casino', 'realty', 'fixer', 'stash'] },
    { id: 'hills', name: 'Palm Hills', art: 'district_hills', faction: 'vitale', rep: 25, size: 0.7, turfRep: 65, tribute: 80000,
      tagline: 'Gated mansions. The rich pay anything, and so do the cops.', lieutenant: 'Carmine Vitale',
      risk: 0.1, police: 0.95, gang: 0.1, travel: 120,
      mult: { cocaine: 1.35, ecstasy: 1.25, heroin: 1.2, opium: 1.25, weed: 1.3, acid: 1.2 },
      services: ['realty', 'cars', 'hospital', 'luxury', 'stash'] },
    { id: 'border', name: 'Border Town', art: 'district_border', faction: 'cartel', vehicle: 1, days: 2, size: 0.8, turfRep: 75, tribute: 120000,
      tagline: 'Two days of desert road. Cartel country.', lieutenant: 'El Zopilote',
      risk: 0.85, police: 0.15, gang: 0.95, travel: 1500,
      mult: { cocaine: 0.68, weed: 0.65, heroin: 0.75, meth: 0.8, peyote: 0.6 },
      services: ['guns', 'blackmarket', 'recruit', 'stash'] },
  ];

  // what a district offers
  G.SERVICES = {
    bank:        { name: 'First Harbor Bank',       art: 'svc_bank',        blurb: 'Money in the bank can\'t be stolen off you. Earns a little interest every day.' },
    shark:       { name: 'Vinnie the Shark',        art: 'char_shark',      blurb: 'Borrow fast, pay faster. 5% a day, and Vinnie\'s boys come knocking when you\'re late. Pay him back here.' },
    hospital:    { name: 'Mercy General',           art: 'svc_hospital',    blurb: 'Patches up you and your crew. No questions, mostly.', hpCost: 120 },
    clinic:      { name: 'Doc Wu\'s Back Room',     art: 'char_doc',        blurb: 'Half the price of the hospital and twice the bourbon.', hpCost: 60 },
    guns:        { name: 'Gun Runner',              art: 'char_gunrunner',  blurb: 'Iron for the boss and the crew. Stock changes every day. Cash only.' },
    blackmarket: { name: 'The Black Market',        art: 'svc_blackmarket', blurb: 'Custom pieces, military hardware and things that go boom. Only for people with a name.' },
    recruit:     { name: 'The Pool Hall',           art: 'svc_poolhall',    blurb: 'Hard people looking for work. Pay them daily or they walk.' },
    tailor:      { name: 'Sal\'s Tailoring',        art: 'svc_tailor',      blurb: 'Coats with deep, deep pockets.' },
    cars:        { name: 'Chop Shop Motors',        art: 'svc_cars',        blurb: 'Wheels carry crates and outrun trouble. Your old ride counts toward the price.' },
    supply:      { name: 'Harbor Supply Co.',       art: 'svc_supply',      blurb: 'Shipping crates. Each one adds space, if your ride has room to strap it down. Every crate costs a bit more than the last.' },
    realty:      { name: 'Harbor Realty',           art: 'svc_realty',      blurb: 'Legit businesses wash your money, pay out daily and cool the heat.' },
    luxury:      { name: 'Palm Hills Luxury Broker', art: 'svc_luxury',     blurb: 'For people who have everything: things nobody else can buy.' },
    lawyer:      { name: 'Marty Kessler, Esq.',     art: 'char_lawyer',     blurb: 'Makes problems go away. Paperwork, witnesses, whole investigations.' },
    casino:      { name: 'The Golden Star Casino',  art: 'svc_casino',      blurb: 'Roulette under the chandeliers. The house always wins. Mostly.' },
    fixer:       { name: 'The Fixer',               art: 'char_fixer',      blurb: 'Contracts for people who don\'t ask questions: deliveries, smuggling runs and problems that need solving.' },
    stash:       { name: 'Safehouse',               art: 'svc_stash',       blurb: 'Your own place in the district: store product off the street. Cops raid it if your heat gets too high.' },
  };

  // ---------- weapons ----------
  // dmg per hit, acc = chance to hit, shots = attacks per round, splash = also hits that many more targets.
  // where: 'shop' (gun runners, random daily stock), 'black' (black market and rare deals)
  G.WEAPONS = [
    { id: 'fists',    name: 'Bare Fists',              price: 0,        dmg: 5,  acc: 0.6,  shots: 1, art: null },
    { id: 'bat',      name: 'Baseball Bat',            price: 250,      dmg: 9,  acc: 0.75, shots: 1, where: 'shop', art: 'gun_bat' },
    { id: 'revolver', name: 'Saturday Night Special',  price: 1800,     dmg: 14, acc: 0.62, shots: 1, where: 'shop', art: 'gun_revolver' },
    { id: 'pistol',   name: '9mm Pistol',              price: 4500,     dmg: 17, acc: 0.72, shots: 1, where: 'shop', art: 'gun_pistol' },
    { id: 'magnum',   name: '.357 Magnum',             price: 9000,     dmg: 26, acc: 0.68, shots: 1, where: 'shop', rep: 8,  art: 'gun_magnum' },
    { id: 'shotgun',  name: 'Pump Shotgun',            price: 14000,    dmg: 34, acc: 0.6,  shots: 1, where: 'shop', rep: 10, art: 'gun_shotgun' },
    { id: 'uzi',      name: 'Uzi',                     price: 26000,    dmg: 18, acc: 0.64, shots: 2, where: 'shop', rep: 15, art: 'gun_uzi' },
    { id: 'mac10',    name: 'MAC-10',                  price: 32000,    dmg: 15, acc: 0.58, shots: 3, where: 'shop', rep: 20, art: 'gun_mac10' },
    { id: 'ak',       name: 'AK-47',                   price: 60000,    dmg: 30, acc: 0.72, shots: 2, where: 'shop', rep: 28, art: 'gun_ak' },
    { id: 'm16',      name: 'M16 Rifle',               price: 85000,    dmg: 28, acc: 0.82, shots: 2, where: 'shop', rep: 35, art: 'gun_m16' },
    // custom and military pieces
    { id: 'sawedoff', name: 'Sawed-Off Shotgun',       price: 22000,    dmg: 48, acc: 0.55, shots: 1, where: 'black', rep: 12, art: 'gun_sawedoff' },
    { id: 'deagle',   name: 'Golden Desert Eagle',     price: 75000,    dmg: 40, acc: 0.8,  shots: 1, where: 'black', rep: 25, art: 'gun_deagle' },
    { id: 'tommy',    name: 'Tommy Gun',               price: 110000,   dmg: 22, acc: 0.66, shots: 3, where: 'black', rep: 30, art: 'gun_tommy' },
    { id: 'sniper',   name: 'Sniper Rifle',            price: 160000,   dmg: 85, acc: 0.88, shots: 1, where: 'black', rep: 40, art: 'gun_sniper' },
    { id: 'gl',       name: 'Grenade Launcher',        price: 450000,   dmg: 55, acc: 0.7,  shots: 1, splash: 2, where: 'black', rep: 55, art: 'gun_gl' },
    { id: 'minigun',  name: 'Minigun',                 price: 2500000,  dmg: 26, acc: 0.6,  shots: 6, where: 'black', rep: 75, art: 'gun_minigun' },
  ];
  // armor: share of damage it stops
  G.ARMOR = [
    { id: 'none',    name: 'Street Clothes',    price: 0,       block: 0,    art: null },
    { id: 'leather', name: 'Leather Jacket',    price: 1200,    block: 0.12, where: 'shop', art: 'armor_leather' },
    { id: 'kevlar',  name: 'Kevlar Vest',       price: 12000,   block: 0.28, where: 'shop', rep: 10, art: 'armor_kevlar' },
    { id: 'riot',    name: 'Riot Gear',         price: 45000,   block: 0.38, where: 'shop', rep: 25, art: 'armor_riot' },
    { id: 'plate',   name: 'Tactical Plate',    price: 120000,  block: 0.48, where: 'black', rep: 35, art: 'armor_plate' },
    { id: 'jugg',    name: 'Juggernaut Suit',   price: 1500000, block: 0.62, where: 'black', rep: 65, art: 'armor_jugg' },
  ];
  // things you use in a fight (each use takes your turn)
  G.ITEMS = [
    { id: 'medkit',  name: 'Med Kit',      price: 2500,  max: 10, art: 'item_medkit',  blurb: 'Heals you and every crew member by 35.' },
    { id: 'molotov', name: 'Molotov',      price: 1500,  max: 10, art: 'item_molotov', blurb: 'Burns every enemy for 18.' },
    { id: 'grenade', name: 'Frag Grenade', price: 6000,  max: 10, rep: 15, art: 'item_grenade', blurb: 'Hits up to three enemies for 50.' },
    { id: 'smoke',   name: 'Smoke Bomb',   price: 4000,  max: 5,  rep: 10, art: 'item_smoke',   blurb: 'Your next getaway is far more likely to work.' },
  ];

  // ---------- carrying ----------
  // coat: personal pockets; vehicle: trunk space plus slots to strap crates into
  G.COATS = [
    { id: 'pockets', name: 'Jeans Pockets',       price: 0,      cap: 0,  art: null },
    { id: 'trench',  name: 'Trench Coat',         price: 2500,   cap: 25, art: 'gear_trench' },
    { id: 'hockey',  name: 'Hockey Bag',          price: 9000,   cap: 50, art: 'gear_bag' },
    { id: 'suit',    name: 'Hidden-Lining Suit',  price: 40000,  cap: 80, art: 'gear_suit', stealth: 0.35 },
  ];
  G.VEHICLES = [
    { id: 'feet',   name: 'Bus Pass',        price: 0,          trunk: 0,   slots: 0,   escape: 0,    art: null },
    { id: 'moped',  name: 'Moped',           price: 3500,       trunk: 15,  slots: 0,   escape: 0.08, art: 'car_moped' },
    { id: 'sedan',  name: 'Rusty Sedan',     price: 9000,       trunk: 40,  slots: 2,   escape: 0.05, art: 'car_sedan' },
    { id: 'muscle', name: 'Muscle Car',      price: 45000,      trunk: 30,  slots: 2,   escape: 0.14, rep: 10, art: 'car_muscle' },
    { id: 'van',    name: 'Cargo Van',       price: 90000,      trunk: 80,  slots: 8,   escape: 0.02, rep: 15, art: 'car_van' },
    { id: 'truck',  name: 'Box Truck',       price: 300000,     trunk: 150, slots: 16,  escape: 0,    rep: 25, art: 'car_truck' },
    { id: 'suv',    name: 'Armored SUV',     price: 400000,     trunk: 60,  slots: 5,   escape: 0.12, rep: 30, art: 'car_suv', armor: 0.12 },
    { id: 'boat',   name: 'Cigarette Boat',  price: 1200000,    trunk: 100, slots: 12,  escape: 0.16, rep: 40, art: 'car_boat', armor: 0.05 },
    { id: 'yacht',  name: 'Mega Yacht',      price: 500000000,  trunk: 400, slots: 60,  escape: 0.1,  rep: 70, art: 'car_yacht', armor: 0.15, heal: 15 },
    { id: 'plane',  name: 'Cargo Plane',     price: 1500000000, trunk: 600, slots: 150, escape: 0.2,  rep: 90, art: 'car_plane', armor: 0.1 },
  ];
  // crates: each takes slots in your vehicle; price goes up 5% for every crate you already own
  G.CRATES = [
    { id: 'small',  name: 'Small Crate',  price: 5000,  cap: 20,  slots: 1, art: 'crate_small' },
    { id: 'medium', name: 'Medium Crate', price: 15000, cap: 50,  slots: 2, art: 'crate_medium' },
    { id: 'large',  name: 'Large Crate',  price: 40000, cap: 100, slots: 3, art: 'crate_large' },
  ];
  G.CRATE_STEP = 1.05;
  G.STASH = { base: 200, upgrade: 200, upgradePrice: 60000, step: 1.15, raidHeat: 60, raidChance: 0.05 };
  G.STASH_PRICE = { downtown: 400000, docks: 150000, eastside: 60000, campus: 120000, lantern: 180000, rust: 80000, strip: 900000, hills: 2500000, border: 250000 };

  // ---------- businesses and luxuries ----------
  G.FRONTS = [
    { id: 'laundromat', name: 'Spin City Laundromat', price: 30000,     income: 600,    cool: 1, rep: 0,  art: 'front_laundromat' },
    { id: 'carwash',    name: 'Sudsy\'s Car Wash',    price: 120000,    income: 2200,   cool: 1, rep: 10, art: 'front_carwash' },
    { id: 'pawn',       name: 'Lucky\'s Pawn & Loan', price: 400000,    income: 7000,   cool: 1, rep: 20, art: 'front_pawn' },
    { id: 'club',       name: 'Club Inferno',         price: 1500000,   income: 25000,  cool: 2, rep: 35, art: 'front_club' },
    { id: 'dealership', name: 'Sunset Auto Mall',     price: 6000000,   income: 90000,  cool: 2, rep: 45, art: 'front_dealership' },
    { id: 'casino',     name: 'The Back-Room Casino', price: 25000000,  income: 350000, cool: 3, rep: 60, art: 'front_casino' },
    { id: 'shipping',   name: 'Harbor Shipping Line', price: 120000000, income: 1500000, cool: 3, rep: 75, art: 'front_shipping' },
  ];
  G.LUXURIES = [
    { id: 'penthouse', name: 'Penthouse Suite',  price: 8000000,    rep: 40, gain: 3,  art: 'lux_penthouse', perk: 'You heal 10 more HP every day.' },
    { id: 'horse',     name: 'Champion Racehorse', price: 40000000, rep: 50, gain: 4,  art: 'lux_horse',     perk: 'Wins you some prize money now and then.' },
    { id: 'jet',       name: 'Private Jet',      price: 300000000,  rep: 70, gain: 6,  art: 'lux_jet',       perk: 'Border Town in one day instead of two.' },
    { id: 'island',    name: 'Private Island',   price: 2000000000, rep: 85, gain: 10, art: 'lux_island',    perk: 'The ultimate way out: retire to your own island.' },
  ];

  // ---------- crew ----------
  G.ROLES = {
    muscle:   { name: 'Muscle',   art: 'crew_muscle',   hp: [110, 150], acc: [0.5, 0.65],  wage: [150, 320], perk: 'Soaks up hits' },
    shooter:  { name: 'Shooter',  art: 'crew_shooter',  hp: [75, 100],  acc: [0.78, 0.92], wage: [320, 650], perk: 'Hits what they aim at' },
    wheelman: { name: 'Wheelman', art: 'crew_wheelman', hp: [80, 100],  acc: [0.55, 0.7],  wage: [240, 420], perk: 'Better odds of getting away', escape: 0.06 },
    medic:    { name: 'Medic',    art: 'crew_medic',    hp: [70, 90],   acc: [0.5, 0.62],  wage: [380, 600], perk: 'Patches everyone up after a fight', heal: 18 },
    smuggler: { name: 'Smuggler', art: 'crew_smuggler', hp: [75, 95],   acc: [0.55, 0.68], wage: [300, 520], perk: 'Carries 30 more and hides it from the cops', carry: 30 },
    fixer:    { name: 'Fixer',    art: 'crew_fixer',    hp: [65, 85],   acc: [0.5, 0.6],   wage: [450, 800], perk: 'Bribes cost a third less; contracts pay more', bribe: 0.33 },
  };
  G.CREW_LEVELS = [0, 3, 8, 15, 25]; // wins needed for each star
  G.FIRST = ['Tony', 'Rosa', 'Dee', 'Marco', 'Lena', 'Ray', 'Nico', 'Jax', 'Vic', 'Tasha', 'Benny', 'Kai', 'Lou', 'Mina', 'Sal', 'Dutch', 'Ivy', 'Rico', 'Gabe', 'June', 'Moe', 'Pia', 'Cruz', 'Zeke', 'Frankie', 'Odessa', 'Hector', 'Wren'];
  G.NICK = ['Two-Times', 'Knuckles', 'Smiles', 'the Cat', 'Lucky', 'Ghost', 'Bricks', 'Sparks', 'Fast Hands', 'No-Neck', 'Slim', 'Ice', 'Preacher', 'Moneybags', 'Torch', 'Gravel', 'Whisper', 'Hammer', 'Lefty', 'Silk', 'Boomer', 'Doc'];

  // ---------- who you fight ----------
  // power grows with the day and with your crew (see sim.js)
  G.FACTIONS = {
    beat:    { name: 'Beat Cops',            art: 'foe_cops',    unit: 'Officer',      hp: 60,  dmg: 11, acc: 0.6,  armor: 0.1,  cop: true },
    cops:    { name: 'Detective Kane',       art: 'foe_cops',    unit: 'Detective',    hp: 75,  dmg: 14, acc: 0.66, armor: 0.18, cop: true },
    narcs:   { name: 'Narcotics Squad',      art: 'foe_narcs',   unit: 'Narc',         hp: 85,  dmg: 18, acc: 0.7,  armor: 0.28, cop: true },
    swat:    { name: 'Harbor PD SWAT',       art: 'foe_swat',    unit: 'SWAT',         hp: 120, dmg: 26, acc: 0.76, armor: 0.48, cop: true },
    feds:    { name: 'Federal Task Force',   art: 'foe_feds',    unit: 'Federal Agent', hp: 140, dmg: 32, acc: 0.8,  armor: 0.55, cop: true },
    muggers: { name: 'Street Muggers',       art: 'foe_muggers', unit: 'Mugger',       hp: 40,  dmg: 8,  acc: 0.55, armor: 0 },
    kings:   { name: 'Eastside Kings',       art: 'foe_kings',   unit: 'King',         hp: 60,  dmg: 12, acc: 0.6,  armor: 0.05, boss: 'King Malik',   bossArt: 'boss_kings' },
    rats:    { name: 'Dock Rats',            art: 'foe_rats',    unit: 'Dock Rat',     hp: 65,  dmg: 13, acc: 0.6,  armor: 0.08, boss: 'Big Sully',    bossArt: 'boss_rats' },
    triad:   { name: 'Lantern Triad',        art: 'foe_triad',   unit: 'Triad',        hp: 70,  dmg: 15, acc: 0.68, armor: 0.12, boss: 'Madam Lin',    bossArt: 'boss_triad' },
    riders:  { name: 'Rust Riders MC',       art: 'foe_riders',  unit: 'Biker',        hp: 85,  dmg: 15, acc: 0.58, armor: 0.15, boss: 'Diesel',       bossArt: 'boss_riders' },
    vitale:  { name: 'Vitale Family',        art: 'foe_vitale',  unit: 'Made Man',     hp: 80,  dmg: 18, acc: 0.7,  armor: 0.18, boss: 'Don Vitale',   bossArt: 'boss_vitale' },
    cartel:  { name: 'Los Cuervos Cartel',   art: 'foe_cartel',  unit: 'Sicario',      hp: 90,  dmg: 22, acc: 0.72, armor: 0.22, boss: 'El Cuervo',    bossArt: 'boss_cartel' },
    vinnie:  { name: 'Vinnie\'s Boys',       art: 'foe_vinnie',  unit: 'Leg-breaker',  hp: 75,  dmg: 14, acc: 0.65, armor: 0.1 },
  };
  // how hot you are decides which cops come
  G.HEAT_TIERS = [
    { min: 0,  faction: 'beat',  name: 'Cool',          escapeCap: 0.8,  bribe: 1 },
    { min: 30, faction: 'cops',  name: 'Wanted',        escapeCap: 0.7,  bribe: 1.4 },
    { min: 50, faction: 'narcs', name: 'Hunted',        escapeCap: 0.55, bribe: 2.2 },
    { min: 70, faction: 'swat',  name: 'Most Wanted',   escapeCap: 0.38, bribe: 4 },
    { min: 90, faction: 'feds',  name: 'Public Enemy',  escapeCap: 0.22, bribe: 0 }, // the Feds don't take bribes
  ];

  // ---------- jobs ----------
  // size: guards before scaling to your crew; power: how tough they are; loot: cash range; drugs: units
  G.JOBS = [
    { id: 'corner',   name: 'Rob a corner crew',           art: 'job_corner',   size: [1, 2],  power: 0.6,  cash: [2000, 6000],        drugs: [10, 35],  heat: 8,  rep: 2,  minRep: 0,
      blurb: 'A few kids slinging on a corner. Easy money, if nobody brings a gun.' },
    { id: 'stash',    name: 'Hit a stash house',           art: 'job_stash',    size: [3, 5],  power: 1,    cash: [12000, 30000],      drugs: [40, 110], heat: 15, rep: 4,  minRep: 8,
      blurb: 'Boarded windows, a back door and a closet full of product.' },
    { id: 'casino',   name: 'Rob an underground card game', art: 'job_cardgame', size: [4, 6], power: 1.05, cash: [40000, 90000],      drugs: [0, 0],    heat: 18, rep: 5,  minRep: 15, where: ['strip', 'lantern', 'downtown'],
      blurb: 'Six rich men, one table, a lot of cash and their bodyguards.' },
    { id: 'shipment', name: 'Hijack a shipment',           art: 'job_shipment', size: [5, 7],  power: 1.15, cash: [10000, 25000],      drugs: [80, 220], heat: 22, rep: 7,  minRep: 25, where: ['docks', 'border', 'lantern'], premium: true,
      blurb: 'A truck full of the expensive stuff, and the people guarding it are paid to die.' },
    { id: 'armored',  name: 'Knock over an armored truck', art: 'job_armored',  size: [5, 7],  power: 1.15, faction: 'narcs', cash: [150000, 350000], drugs: [0, 0], heat: 45, rep: 9, minRep: 30, where: ['downtown', 'hills', 'strip'],
      blurb: 'Two guards in the cab, three in the back, and the whole police department on the radio.' },
    { id: 'bank',     name: 'Rob the First Harbor Bank',   art: 'job_bank',     size: [7, 9],  power: 1.25, faction: 'swat', cash: [1500000, 4000000], drugs: [0, 0], heat: 70, rep: 14, minRep: 45, where: ['downtown', 'strip'],
      blurb: 'The vault, the guards, the alarm and three minutes before SWAT shows up. The big one.' },
    { id: 'counting', name: 'Raid the counting room',      art: 'job_counting', size: [8, 11], power: 1.3,  cash: [800000, 2000000],   drugs: [0, 0],    heat: 30, rep: 12, minRep: 40, where: ['strip'],
      blurb: 'The Vitale family\'s weekly take, stacked on a felt table. Every made man in town will be there.' },
  ];

  // ---------- random events ----------
  G.SPIKES = {
    ludes:   'A pharmacy in Palm Hills got robbed. Ludes are scarce!',
    speed:   'Truckers on strike. Speed is through the roof!',
    weed:    'Feds burned a farm upstate. Weed prices are sky high!',
    hash:    'Customs seized a shipment from overseas. Hash is rare!',
    ecstasy: 'Rave season! Everybody wants Ecstasy!',
    shrooms: 'Rainy summer ruined the harvest. Shrooms are rare!',
    peyote:  'Desert drought. Peyote is impossible to find!',
    acid:    'A chemist got busted. Acid is hard to find!',
    meth:    'A lab blew up in the Rust Yards. Crystal is scarce!',
    opium:   'Triad war cut off supply. Opium prices soar!',
    heroin:  'Customs seized a container. Heroin prices soar!',
    cocaine: 'Coast Guard sank a go-fast boat. Cocaine is gold!',
  };
  G.CRASHES = {
    ludes:   'Someone dumped a crate of Ludes on the street. Dirt cheap!',
    speed:   'A new lab is flooding the market with Speed!',
    weed:    'A bumper crop came in. Weed is going for nothing!',
    hash:    'A sailor is selling Hash by the brick. Cheap!',
    ecstasy: 'Bad batch rumours. Nobody\'s buying Ecstasy!',
    shrooms: 'Somebody grew a basement full of Shrooms!',
    peyote:  'A truck from the desert just unloaded. Peyote is cheap!',
    acid:    'The college crowd went home. Acid is cheap!',
    meth:    'Bikers are dumping Crystal to pay a debt!',
    opium:   'An old smuggling route reopened. Opium is cheap!',
    heroin:  'A ship got through at the Docks. Heroin is cheap!',
    cocaine: 'The cartel overproduced. Cocaine is cheap!',
  };
  G.HEADLINES = [
    'Mayor promises "war on crime" at ribbon cutting.',
    'Harbor PD gets new helicopters. Taxpayers grumble.',
    'Vitale family lawyer: "My client is a businessman."',
    'Triad and Kings sign truce in Lantern Row. Nobody believes it.',
    'Rust Riders hold charity bike rally. Three arrests.',
    'Tourists flock to The Strip despite shootout.',
    'Port strike enters second week.',
    'Detective Kane named Officer of the Year, again.',
    'Heat wave hits Vice Harbor. Tempers flare.',
    'Rumours of a cartel war down in Border Town.',
    'Federal task force "monitoring the situation" in Vice Harbor.',
    'Golden Star Casino reports record quarter.',
    'Hurricane season starts. Harbor Patrol on alert.',
    'Local man wins lottery, loses it at the Strip by morning.',
  ];
})(window.DrugWars = window.DrugWars || {});
