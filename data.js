// ============================================================
//  Drug Wars: the content. Districts, product, gear, crew,
//  rival crews, jobs and news. Numbers here set the balance;
//  the rules that use them are in sim.js.
// ============================================================
(function (G) {
  'use strict';

  G.CITY = 'Vice Harbor';
  G.START = { cash: 2000, debt: 5500, hp: 100, capacity: 100 };
  G.SHARK = { rate: 0.05, graceDays: 14, baseLimit: 6000, limitPerRep: 2500 };
  G.BANK_RATE = 0.003;

  // product: lo/hi is the normal street price range; spikes and crashes go well past it
  G.DRUGS = [
    { id: 'ludes',   name: 'Ludes',    lo: 18,    hi: 90,    art: 'drug_ludes' },
    { id: 'speed',   name: 'Speed',    lo: 90,    hi: 280,   art: 'drug_speed' },
    { id: 'weed',    name: 'Weed',     lo: 300,   hi: 900,   art: 'drug_weed' },
    { id: 'ecstasy', name: 'Ecstasy',  lo: 400,   hi: 1300,  art: 'drug_ecstasy' },
    { id: 'shrooms', name: 'Shrooms',  lo: 600,   hi: 1500,  art: 'drug_shrooms' },
    { id: 'acid',    name: 'Acid',     lo: 1000,  hi: 4200,  art: 'drug_acid' },
    { id: 'heroin',  name: 'Heroin',   lo: 5500,  hi: 13000, art: 'drug_heroin' },
    { id: 'cocaine', name: 'Cocaine',  lo: 15000, hi: 29000, art: 'drug_cocaine' },
  ];

  // risk: muggers and random trouble; police: how hard the cops look; gang: rival crews around.
  // mult: local price multipliers (below 1 = cheap here, above 1 = sells high here).
  G.DISTRICTS = [
    { id: 'downtown', name: 'Downtown', art: 'district_downtown', faction: 'kings',
      tagline: 'Glass towers, cop cars on every corner.',
      risk: 0.15, police: 0.85, gang: 0.2, travel: 40,
      mult: { ecstasy: 1.15, cocaine: 1.15, weed: 1.1 },
      services: ['bank', 'hospital', 'realty', 'tailor'] },
    { id: 'docks', name: 'The Docks', art: 'district_docks', faction: 'rats',
      tagline: 'Ships unload after midnight. Nobody saw a thing.',
      risk: 0.45, police: 0.3, gang: 0.55, travel: 60,
      mult: { cocaine: 0.75, heroin: 0.75, weed: 0.9 },
      services: ['guns', 'recruit'] },
    { id: 'eastside', name: 'Eastside Projects', art: 'district_eastside', faction: 'kings',
      tagline: 'Twelve floors of trouble and a broken elevator.',
      risk: 0.7, police: 0.25, gang: 0.85, travel: 30,
      mult: { ludes: 0.6, speed: 0.7, weed: 0.75, cocaine: 1.2, heroin: 1.15 },
      services: ['recruit', 'guns'] },
    { id: 'campus', name: 'University Heights', art: 'district_campus', faction: 'kings',
      tagline: 'Finals week. Everybody needs something.',
      risk: 0.1, police: 0.35, gang: 0.1, travel: 40,
      mult: { acid: 1.45, ecstasy: 1.4, shrooms: 1.4, weed: 1.25, heroin: 0.85 },
      services: ['tailor', 'hospital'] },
    { id: 'lantern', name: 'Lantern Row', art: 'district_lantern', faction: 'triad',
      tagline: 'Red lanterns, back rooms, old debts.',
      risk: 0.4, police: 0.3, gang: 0.6, travel: 50,
      mult: { heroin: 0.6, acid: 0.85, ecstasy: 1.1 },
      services: ['clinic', 'recruit'] },
    { id: 'rust', name: 'Rust Yards', art: 'district_rust', faction: 'riders',
      tagline: 'Chop shops, biker bars and burning barrels.',
      risk: 0.65, police: 0.15, gang: 0.7, travel: 50,
      mult: { speed: 0.55, ludes: 0.7, shrooms: 0.85, cocaine: 1.1 },
      services: ['cars', 'guns'] },
    { id: 'strip', name: 'The Strip', art: 'district_strip', faction: 'vitale', rep: 10,
      tagline: 'Casinos, neon and the Vitale family\'s money.',
      risk: 0.35, police: 0.45, gang: 0.65, travel: 80,
      mult: { cocaine: 1.4, ecstasy: 1.3, acid: 1.15, ludes: 1.3 },
      services: ['shark', 'bank', 'realty'] },
    { id: 'hills', name: 'Palm Hills', art: 'district_hills', faction: 'vitale', rep: 25,
      tagline: 'Gated mansions. The rich pay anything, and so do the cops.',
      risk: 0.1, police: 0.95, gang: 0.1, travel: 120,
      mult: { cocaine: 1.65, ecstasy: 1.35, heroin: 1.3, weed: 1.4, speed: 1.3 },
      services: ['realty', 'cars', 'hospital'] },
    { id: 'border', name: 'Border Town', art: 'district_border', faction: 'cartel', vehicle: 1, days: 2,
      tagline: 'Two days of desert road. Cartel country.',
      risk: 0.85, police: 0.15, gang: 0.95, travel: 1500,
      mult: { cocaine: 0.45, weed: 0.5, heroin: 0.6, speed: 0.8 },
      services: ['guns', 'recruit'] },
  ];

  // what a district offers
  G.SERVICES = {
    bank:     { name: 'First Harbor Bank',     art: 'svc_bank',     blurb: 'Money in the bank can\'t be stolen off you. Earns a little interest every day.' },
    shark:    { name: 'Vinnie the Shark',      art: 'char_shark',   blurb: 'Borrow fast, pay faster. 5% a day, and Vinnie\'s boys come knocking when you\'re late.' },
    hospital: { name: 'Mercy General',         art: 'svc_hospital', blurb: 'Patches up you and your crew. No questions, mostly.', hpCost: 120 },
    clinic:   { name: 'Doc Wu\'s Back Room',   art: 'char_doc',     blurb: 'Half the price of the hospital and twice the bourbon.', hpCost: 60 },
    guns:     { name: 'Gun Runner',            art: 'char_gunrunner', blurb: 'Iron for the boss and the crew. Cash only.' },
    recruit:  { name: 'The Pool Hall',         art: 'svc_poolhall', blurb: 'Hard people looking for work. Pay them daily or they walk.' },
    tailor:   { name: 'Sal\'s Tailoring',      art: 'svc_tailor',   blurb: 'Coats and bags with deep, deep pockets.' },
    cars:     { name: 'Chop Shop Motors',      art: 'svc_cars',     blurb: 'Wheels haul more product and outrun trouble. Your old ride counts toward the price.' },
    realty:   { name: 'Harbor Realty',         art: 'svc_realty',   blurb: 'Legit businesses wash your money, pay out daily and cool the heat.' },
  };

  // weapons: dmg per hit, acc = chance to hit, shots = attacks per round
  G.WEAPONS = [
    { id: 'fists',   name: 'Bare Fists',              price: 0,     dmg: 5,  acc: 0.6,  shots: 1, art: null },
    { id: 'bat',     name: 'Baseball Bat',            price: 250,   dmg: 9,  acc: 0.75, shots: 1, art: 'gun_bat' },
    { id: 'revolver',name: 'Saturday Night Special',  price: 1800,  dmg: 14, acc: 0.62, shots: 1, art: 'gun_revolver' },
    { id: 'pistol',  name: '9mm Pistol',              price: 4500,  dmg: 17, acc: 0.72, shots: 1, art: 'gun_pistol' },
    { id: 'shotgun', name: 'Pump Shotgun',            price: 11000, dmg: 32, acc: 0.6,  shots: 1, art: 'gun_shotgun' },
    { id: 'uzi',     name: 'Uzi',                     price: 22000, dmg: 18, acc: 0.66, shots: 2, art: 'gun_uzi' },
    { id: 'ak',      name: 'AK-47',                   price: 48000, dmg: 30, acc: 0.72, shots: 2, art: 'gun_ak' },
  ];
  // armor: share of damage it stops
  G.ARMOR = [
    { id: 'none',    name: 'Street Clothes',  price: 0,     block: 0,    art: null },
    { id: 'leather', name: 'Leather Jacket',  price: 1200,  block: 0.12, art: 'armor_leather' },
    { id: 'kevlar',  name: 'Kevlar Vest',     price: 9000,  block: 0.3,  art: 'armor_kevlar' },
    { id: 'plate',   name: 'Tactical Plate',  price: 38000, block: 0.48, art: 'armor_plate' },
  ];

  // carrying capacity: you keep the best coat and one vehicle
  G.COATS = [
    { id: 'pockets', name: 'Jeans Pockets',       price: 0,     cap: 0,   art: null },
    { id: 'trench',  name: 'Trench Coat',         price: 2500,  cap: 50,  art: 'gear_trench' },
    { id: 'hockey',  name: 'Hockey Bag',          price: 9000,  cap: 120, art: 'gear_bag' },
    { id: 'suit',    name: 'Hidden-Lining Suit',  price: 32000, cap: 180, art: 'gear_suit', stealth: 0.35 },
  ];
  G.VEHICLES = [
    { id: 'feet',   name: 'Bus Pass',        price: 0,      cap: 0,   escape: 0,    art: null },
    { id: 'sedan',  name: 'Rusty Sedan',     price: 8000,   cap: 120, escape: 0.08, art: 'car_sedan' },
    { id: 'muscle', name: 'Muscle Car',      price: 35000,  cap: 160, escape: 0.22, art: 'car_muscle' },
    { id: 'van',    name: 'Cargo Van',       price: 70000,  cap: 480, escape: 0.04, art: 'car_van' },
    { id: 'suv',    name: 'Armored SUV',     price: 220000, cap: 320, escape: 0.28, art: 'car_suv', armor: 0.1 },
    { id: 'boat',   name: 'Cigarette Boat',  price: 450000, cap: 650, escape: 0.4,  art: 'car_boat', armor: 0.05 },
  ];

  // legit businesses: income goes to the bank each day; heat cools faster
  G.FRONTS = [
    { id: 'laundromat', name: 'Spin City Laundromat', price: 30000,  income: 700,   cool: 1, rep: 0,  art: 'front_laundromat' },
    { id: 'carwash',    name: 'Sudsy\'s Car Wash',    price: 85000,  income: 2200,  cool: 1, rep: 5,  art: 'front_carwash' },
    { id: 'club',       name: 'Club Inferno',         price: 250000, income: 7000,  cool: 2, rep: 20, art: 'front_club' },
    { id: 'casino',     name: 'The Back-Room Casino', price: 800000, income: 24000, cool: 2, rep: 40, art: 'front_casino' },
  ];

  // crew: hp, accuracy and daily wage ranges; perks change fights
  G.ROLES = {
    muscle:   { name: 'Muscle',   art: 'crew_muscle',   hp: [110, 150], acc: [0.5, 0.65],  wage: [150, 320], perk: 'Soaks up hits' },
    shooter:  { name: 'Shooter',  art: 'crew_shooter',  hp: [75, 100],  acc: [0.78, 0.92], wage: [320, 650], perk: 'Hits what they aim at' },
    wheelman: { name: 'Wheelman', art: 'crew_wheelman', hp: [80, 100],  acc: [0.55, 0.7],  wage: [240, 420], perk: 'Better odds of getting away', escape: 0.08 },
    medic:    { name: 'Medic',    art: 'crew_medic',    hp: [70, 90],   acc: [0.5, 0.62],  wage: [380, 600], perk: 'Patches everyone up after a fight', heal: 18 },
  };
  G.FIRST = ['Tony', 'Rosa', 'Dee', 'Marco', 'Lena', 'Ray', 'Nico', 'Jax', 'Vic', 'Tasha', 'Benny', 'Kai', 'Lou', 'Mina', 'Sal', 'Dutch', 'Ivy', 'Rico', 'Gabe', 'June', 'Moe', 'Pia', 'Cruz', 'Zeke'];
  G.NICK = ['Two-Times', 'Knuckles', 'Smiles', 'the Cat', 'Lucky', 'Ghost', 'Bricks', 'Sparks', 'Fast Hands', 'No-Neck', 'Slim', 'Ice', 'Preacher', 'Moneybags', 'Torch', 'Gravel', 'Whisper', 'Hammer'];

  // the other side of a fight. power grows with the day (see sim.js scaleFoe)
  G.FACTIONS = {
    cops:    { name: 'Harbor PD',          art: 'foe_cops',    unit: 'Officer',   hp: 70, dmg: 13, acc: 0.65, armor: 0.15 },
    swat:    { name: 'Harbor PD SWAT',     art: 'foe_swat',    unit: 'SWAT',      hp: 95, dmg: 20, acc: 0.72, armor: 0.35 },
    muggers: { name: 'Street Muggers',     art: 'foe_muggers', unit: 'Mugger',    hp: 40, dmg: 8,  acc: 0.55, armor: 0 },
    kings:   { name: 'Eastside Kings',     art: 'foe_kings',   unit: 'King',      hp: 60, dmg: 12, acc: 0.6,  armor: 0.05 },
    rats:    { name: 'Dock Rats',          art: 'foe_rats',    unit: 'Dock Rat',  hp: 65, dmg: 13, acc: 0.6,  armor: 0.05 },
    triad:   { name: 'Lantern Triad',      art: 'foe_triad',   unit: 'Triad',     hp: 70, dmg: 15, acc: 0.68, armor: 0.1 },
    riders:  { name: 'Rust Riders MC',     art: 'foe_riders',  unit: 'Biker',     hp: 85, dmg: 15, acc: 0.58, armor: 0.12 },
    vitale:  { name: 'Vitale Family',      art: 'foe_vitale',  unit: 'Made Man',  hp: 80, dmg: 18, acc: 0.7,  armor: 0.15 },
    cartel:  { name: 'Los Cuervos Cartel', art: 'foe_cartel',  unit: 'Sicario',   hp: 90, dmg: 22, acc: 0.72, armor: 0.2 },
    vinnie:  { name: 'Vinnie\'s Boys',     art: 'foe_vinnie',  unit: 'Leg-breaker', hp: 75, dmg: 14, acc: 0.65, armor: 0.1 },
  };

  // jobs you can pull with a crew. size = how many guards; loot = cash range; drugs = units of product
  G.JOBS = [
    { id: 'corner',   name: 'Rob a corner crew',           art: 'job_corner',   size: [1, 2],  power: 0.6, cash: [2000, 6000],     drugs: [10, 35],  heat: 8,  rep: 3,  minRep: 0,
      blurb: 'A few kids slinging on a corner. Easy money, if nobody brings a gun.' },
    { id: 'stash',    name: 'Hit a stash house',           art: 'job_stash',    size: [4, 6],  power: 1,   cash: [9000, 28000],    drugs: [40, 110], heat: 15, rep: 6,  minRep: 5,
      blurb: 'Boarded windows, a back door and a closet full of product.' },
    { id: 'shipment', name: 'Hijack a shipment',           art: 'job_shipment', size: [6, 8],  power: 1.15, cash: [5000, 15000],  drugs: [140, 380], heat: 20, rep: 10, minRep: 18, where: ['docks', 'border', 'lantern'], premium: true,
      blurb: 'A truck full of the expensive stuff, and the people guarding it are paid to die.' },
    { id: 'armored',  name: 'Knock over an armored truck', art: 'job_armored',  size: [5, 7],  power: 1.1, faction: 'cops', cash: [60000, 150000], drugs: [0, 0], heat: 45, rep: 12, minRep: 25, where: ['downtown', 'hills', 'strip'],
      blurb: 'Two guards in the cab, three in the back, and the whole police department on the radio.' },
    { id: 'counting', name: 'Raid the counting room',      art: 'job_counting', size: [8, 12], power: 1.25, cash: [140000, 320000], drugs: [0, 0], heat: 30, rep: 18, minRep: 35, where: ['strip'],
      blurb: 'The Vitale family\'s weekly take, stacked on a felt table. Every made man in town will be there.' },
  ];

  // what the news says when a price goes wild
  G.SPIKES = {
    ludes:   'A pharmacy in Palm Hills got robbed. Ludes are scarce!',
    speed:   'Truckers on strike. Speed is through the roof!',
    weed:    'Feds burned a farm upstate. Weed prices are sky high!',
    ecstasy: 'Rave season! Everybody wants Ecstasy!',
    shrooms: 'Rainy summer ruined the harvest. Shrooms are rare!',
    acid:    'A chemist got busted. Acid is hard to find!',
    heroin:  'Customs seized a container. Heroin prices soar!',
    cocaine: 'Coast Guard sank a go-fast boat. Cocaine is gold!',
  };
  G.CRASHES = {
    ludes:   'Someone dumped a crate of Ludes on the street. Dirt cheap!',
    speed:   'A new lab in the Rust Yards is flooding the market with Speed!',
    weed:    'A bumper crop came in. Weed is going for nothing!',
    ecstasy: 'Bad batch rumours. Nobody\'s buying Ecstasy!',
    shrooms: 'Somebody grew a basement full of Shrooms!',
    acid:    'The college crowd went home. Acid is cheap!',
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
  ];
})(window.DrugWars = window.DrugWars || {});
