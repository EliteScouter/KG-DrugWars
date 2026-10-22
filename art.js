// ============================================================
//  Drug Wars: every picture in the game, numbered.
//  Until an image exists the game shows "PLACEHOLDER n" in its place.
//  To add one: save it as art/<file>.webp (or .png / .jpg) and reload.
//  IMAGE_PROMPTS.md is generated from this list (node tools/make-prompts.js).
// ============================================================
(function (G) {
  'use strict';

  // sizes match what image generators make: square 1024x1024, wide 1536x1024, tall 1024x1536
  G.ART_SIZES = { square: [1024, 1024], wide: [1536, 1024], tall: [1024, 1536] };

  // the look every picture shares (the prompt document puts this in front of each prompt)
  G.ART_STYLE = 'Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor ' +
    '(Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, ' +
    'wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. ' +
    'Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), ' +
    'no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.';
  G.ICON_STYLE = 'Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark ' +
    'smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon.';
  G.PORTRAIT_STYLE = 'Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, ' +
    'dark blurred city background, like a character select screen in a crime video game.';

  const A = [
    // ---- big screens ----
    { key: 'title', size: 'tall', use: 'Title screen key art (behind the DRUG WARS logo)',
      prompt: 'A lone figure in a long trench coat stands on a rain-soaked rooftop at night, back to the viewer, looking out over a sprawling neon city by the sea. Palm trees, a casino tower glowing magenta, cargo cranes at the harbor, police helicopter searchlight cutting through the haze. Leave the top third of the image darker and emptier so a logo can sit there.' },
    { key: 'char_player', size: 'square', portrait: true, use: 'The player (you, the boss) in the HUD and fights',
      prompt: 'A sharp, confident young street hustler in a dark trench coat over a loud 80s print shirt, gold chain, slight smirk, scar through one eyebrow, cigarette-free. Ambiguous ethnicity. ' },

    // ---- districts (top banner of the main screen) ----
    { key: 'district_downtown', size: 'wide', use: 'Downtown district banner',
      prompt: 'Downtown Vice Harbor at night: glass office towers, a wide avenue with police cruisers parked at the curb, red and blue light reflecting on wet asphalt, steam from manholes, a few pedestrians in suits.' },
    { key: 'district_docks', size: 'wide', use: 'The Docks district banner',
      prompt: 'An industrial harbor at midnight: stacked shipping containers, huge cranes, a cargo ship with lights on, fog rolling off black water, a forklift and a single sodium lamp lighting a shady handoff in the distance.' },
    { key: 'district_eastside', size: 'wide', use: 'Eastside Projects district banner',
      prompt: 'Run-down housing project towers at dusk, graffiti on brick walls, a burnt-out car, chain-link fences, kids on bikes, a group hanging out by a corner store with a flickering neon sign.' },
    { key: 'district_campus', size: 'wide', use: 'University Heights district banner',
      prompt: 'A leafy college town street at night: old brick university buildings, a lively bar strip with string lights, students on the sidewalk, a record store, a dorm with a party in one window.' },
    { key: 'district_lantern', size: 'wide', use: 'Lantern Row district banner',
      prompt: 'A narrow Chinatown-style alley lit by rows of red paper lanterns, steam from noodle shops, neon signs in abstract shapes (no readable text), a back door guarded by a man in a black suit, light rain.' },
    { key: 'district_rust', size: 'wide', use: 'Rust Yards district banner',
      prompt: 'A rusted industrial yard: chop shop garage with an open bay, motorcycles parked outside a biker bar, burning oil barrels, scrap piles and a junked crane under an orange sky.' },
    { key: 'district_strip', size: 'wide', use: 'The Strip district banner',
      prompt: 'A glamorous casino boulevard at night: towering casino with a giant glowing star, valets, limousines, palm trees wrapped in lights, crowds in evening wear, everything drenched in magenta and gold neon.' },
    { key: 'district_hills', size: 'wide', use: 'Palm Hills district banner',
      prompt: 'A gated mansion neighborhood in the hills at blue hour: white modernist villas with infinity pools, palm-lined driveway, a security gate and a private patrol car, the neon city glittering far below.' },
    { key: 'district_border', size: 'wide', use: 'Border Town district banner',
      prompt: 'A dusty desert border town at sunset: adobe buildings, a cantina with a hand-painted sign shape (no letters), pickup trucks with armed men, a lone highway disappearing into red mesas.' },

    // ---- product icons (market list) ----
    { key: 'drug_ludes', size: 'square', icon: true, use: 'Ludes icon (market)',
      prompt: 'A small vintage orange pharmacy pill bottle tipped over with a few chalky white round pills spilling out.' },
    { key: 'drug_speed', size: 'square', icon: true, use: 'Speed icon (market)',
      prompt: 'A small folded paper packet and a few bright yellow capsules on a scratched metal surface.' },
    { key: 'drug_weed', size: 'square', icon: true, use: 'Weed icon (market)',
      prompt: 'A sealed clear zip bag of green cannabis buds next to a single fresh cannabis leaf.' },
    { key: 'drug_ecstasy', size: 'square', icon: true, use: 'Ecstasy icon (market)',
      prompt: 'A handful of colorful pressed party pills in pastel pink, blue and green with simple star and smiley shapes stamped on them.' },
    { key: 'drug_shrooms', size: 'square', icon: true, use: 'Shrooms icon (market)',
      prompt: 'A cluster of dried magic mushrooms with tan caps and pale stems, slightly glowing with an otherworldly purple light.' },
    { key: 'drug_acid', size: 'square', icon: true, use: 'Acid icon (market)',
      prompt: 'A small sheet of perforated blotter paper printed with a psychedelic rainbow spiral pattern (no text).' },
    { key: 'drug_heroin', size: 'square', icon: true, use: 'Heroin icon (market)',
      prompt: 'A small brick wrapped in brown paper and tape, stamped with an abstract scorpion symbol (no letters).' },
    { key: 'drug_cocaine', size: 'square', icon: true, use: 'Cocaine icon (market)',
      prompt: 'A tightly wrapped white brick in clear plastic and packing tape, stamped with an abstract crown symbol (no letters).' },

    // ---- places you can go in a district ----
    { key: 'svc_bank', size: 'wide', use: 'Bank (deposit and withdraw)',
      prompt: 'The marble lobby of an old-money bank at closing time: brass teller windows, a huge vault door slightly open, a nervous banker in a bow tie behind the counter.' },
    { key: 'char_shark', size: 'square', portrait: true, use: 'Vinnie the loan shark',
      prompt: 'Vinnie, a heavy-set middle-aged loan shark in a cream suit and open collar, pinky ring, slicked-back gray hair, counting a thick wad of cash, friendly smile with cold eyes.' },
    { key: 'svc_hospital', size: 'wide', use: 'Mercy General hospital (healing)',
      prompt: 'A busy inner-city emergency room at night: harsh fluorescent light, gurneys, a tired nurse, rain on the windows and an ambulance outside flashing red.' },
    { key: 'char_doc', size: 'square', portrait: true, use: 'Doc Wu, the back-room clinic doctor',
      prompt: 'Doc Wu, an elderly unlicensed surgeon with round glasses, rolled-up sleeves and a stained apron, a glass of whiskey beside a tray of instruments, kind but weary face.' },
    { key: 'char_gunrunner', size: 'square', portrait: true, use: 'The gun runner (weapons shop)',
      prompt: 'A grizzled gun runner with a gray beard, trucker cap and military jacket, standing in front of the open trunk of a car lined with rifles and pistols, arms crossed.' },
    { key: 'svc_poolhall', size: 'wide', use: 'The pool hall (hiring crew)',
      prompt: 'A smoky dive pool hall: green felt tables under hanging lamps, tough-looking men and women leaning on cues and the bar, jukebox glow, everyone sizing you up.' },
    { key: 'svc_tailor', size: 'wide', use: 'Sal\'s tailoring (coats and bags)',
      prompt: 'A cramped old tailor shop: racks of trench coats and suits, a measuring tape around the neck of an old tailor, a secret compartment opened in a coat lining.' },
    { key: 'svc_cars', size: 'wide', use: 'Chop shop (vehicles)',
      prompt: 'A chop shop garage at night: a gleaming muscle car on a lift, sparks from a grinder, stolen plates on the wall, mechanics in grease-stained overalls.' },
    { key: 'svc_realty', size: 'wide', use: 'Harbor Realty (buying businesses)',
      prompt: 'A slick 80s real estate office: a smooth agent in a pastel suit gesturing at a wall map of the city with pins in it, a scale model of a nightclub on the desk, palm view through blinds.' },

    // ---- weapons and armor ----
    { key: 'gun_bat', size: 'square', icon: true, use: 'Baseball bat',
      prompt: 'A worn wooden baseball bat wrapped with black tape at the grip, a few nails missing, leaning at an angle.' },
    { key: 'gun_revolver', size: 'square', icon: true, use: 'Saturday Night Special revolver',
      prompt: 'A cheap small snub-nose revolver with a chipped grip.' },
    { key: 'gun_pistol', size: 'square', icon: true, use: '9mm pistol',
      prompt: 'A sleek black semi-automatic 9mm pistol.' },
    { key: 'gun_shotgun', size: 'square', icon: true, use: 'Pump shotgun',
      prompt: 'A pump-action shotgun with a wooden stock and a few red shells beside it.' },
    { key: 'gun_uzi', size: 'square', icon: true, use: 'Uzi',
      prompt: 'A compact submachine gun in the style of an Uzi with a folding stock.' },
    { key: 'gun_ak', size: 'square', icon: true, use: 'AK-47',
      prompt: 'An assault rifle in the style of an AK-47 with a curved magazine and wooden furniture.' },
    { key: 'armor_leather', size: 'square', icon: true, use: 'Leather jacket (armor)',
      prompt: 'A heavy black leather biker jacket with zippers, displayed as if on an invisible mannequin.' },
    { key: 'armor_kevlar', size: 'square', icon: true, use: 'Kevlar vest (armor)',
      prompt: 'A dark navy concealable bulletproof vest with velcro straps.' },
    { key: 'armor_plate', size: 'square', icon: true, use: 'Tactical plate armor',
      prompt: 'A heavy black tactical plate carrier with magazine pouches and a ballistic helmet beside it.' },

    // ---- carrying gear ----
    { key: 'gear_trench', size: 'square', icon: true, use: 'Trench coat (more carrying space)',
      prompt: 'A long tan trench coat held open to show many hidden inside pockets.' },
    { key: 'gear_bag', size: 'square', icon: true, use: 'Hockey bag (more carrying space)',
      prompt: 'A huge black hockey duffel bag, unzipped and stuffed full.' },
    { key: 'gear_suit', size: 'square', icon: true, use: 'Hidden-lining suit (more space, cops find less)',
      prompt: 'An immaculate white 80s double-breasted suit with the lining peeled back to reveal secret compartments.' },

    // ---- vehicles ----
    { key: 'car_sedan', size: 'wide', use: 'Rusty sedan',
      prompt: 'A beat-up boxy 70s sedan with a primer-gray door and a bungee-corded trunk, parked under a flickering streetlight.' },
    { key: 'car_muscle', size: 'wide', use: 'Muscle car',
      prompt: 'A black 70s muscle car with a hood scoop and chrome, tires smoking as it peels out on a neon-lit street.' },
    { key: 'car_van', size: 'wide', use: 'Cargo van',
      prompt: 'An unmarked white cargo van with tinted windows and fake plumbing company stripes (no text), back doors open showing a big empty cargo area.' },
    { key: 'car_suv', size: 'wide', use: 'Armored SUV',
      prompt: 'A black armored SUV with dark tinted windows and run-flat tires, parked in front of a mansion gate, bodyguard beside it.' },
    { key: 'car_boat', size: 'wide', use: 'Cigarette boat',
      prompt: 'A long sleek cigarette speedboat in hot pink and white racing across moonlit water toward the neon skyline, spray flying.' },

    // ---- businesses (fronts) ----
    { key: 'front_laundromat', size: 'wide', use: 'Spin City Laundromat (front)',
      prompt: 'A 24-hour laundromat glowing at night, rows of washers, a bored attendant, and a back room door slightly open with stacks of cash inside.' },
    { key: 'front_carwash', size: 'wide', use: 'Sudsy\'s Car Wash (front)',
      prompt: 'A retro drive-through car wash with colorful brushes and a giant inflatable mascot shape, a luxury car going through, palm trees, sunset.' },
    { key: 'front_club', size: 'wide', use: 'Club Inferno nightclub (front)',
      prompt: 'A packed 80s nightclub with a flame-themed light show, dance floor, DJ booth and a VIP mezzanine where a boss watches the crowd.' },
    { key: 'front_casino', size: 'wide', use: 'The Back-Room Casino (front)',
      prompt: 'A secret high-stakes casino hidden behind a restaurant kitchen: velvet walls, roulette and card tables, gangsters and rich gamblers, smoky golden light.' },

    // ---- your crew ----
    { key: 'crew_muscle', size: 'square', portrait: true, use: 'Crew member: Muscle',
      prompt: 'A huge bald enforcer with a thick neck, tank top and gold tooth, knuckles taped, calm and intimidating.' },
    { key: 'crew_shooter', size: 'square', portrait: true, use: 'Crew member: Shooter',
      prompt: 'A cool, focused sharpshooter woman with a sleek bob haircut, aviator sunglasses pushed up, black turtleneck, a pistol holstered at the shoulder.' },
    { key: 'crew_wheelman', size: 'square', portrait: true, use: 'Crew member: Wheelman',
      prompt: 'A wiry getaway driver with a mullet, racing jacket and driving gloves, toothpick in mouth, car keys spinning on one finger.' },
    { key: 'crew_medic', size: 'square', portrait: true, use: 'Crew member: Medic',
      prompt: 'A former army medic with a buzz cut and a scar, wearing a field jacket with a red cross patch and carrying a battered medical bag.' },

    // ---- people who fight you ----
    { key: 'foe_cops', size: 'square', portrait: true, use: 'Enemy: Harbor PD (Detective Kane and officers)',
      prompt: 'Detective Kane, a hard-nosed plainclothes detective with a mustache, loosened tie and badge on his belt, gun drawn, two uniformed officers behind him by a police cruiser.' },
    { key: 'foe_swat', size: 'square', portrait: true, use: 'Enemy: SWAT team',
      prompt: 'A heavily armored SWAT officer in a helmet and gas mask holding a rifle, team stacked up behind, floodlights.' },
    { key: 'foe_muggers', size: 'square', portrait: true, use: 'Enemy: street muggers',
      prompt: 'Two scruffy street muggers in hoodies in a dark alley, one holding a switchblade, nervous and desperate.' },
    { key: 'foe_kings', size: 'square', portrait: true, use: 'Enemy: Eastside Kings gang',
      prompt: 'A young street gang leader in a purple and gold tracksuit with a crown-shaped pendant, his crew behind him in a project stairwell.' },
    { key: 'foe_rats', size: 'square', portrait: true, use: 'Enemy: Dock Rats gang',
      prompt: 'A rough longshoreman gang boss in a knit cap and peacoat holding a cargo hook, dock workers behind him among containers.' },
    { key: 'foe_triad', size: 'square', portrait: true, use: 'Enemy: Lantern Triad',
      prompt: 'An elegant, dangerous triad lieutenant in a black silk shirt with a dragon tattoo on one forearm, red lantern light, henchmen in the shadows.' },
    { key: 'foe_riders', size: 'square', portrait: true, use: 'Enemy: Rust Riders motorcycle club',
      prompt: 'A massive bearded outlaw biker in a leather vest with an abstract skull-and-wheel patch (no text), standing beside a chopper motorcycle.' },
    { key: 'foe_vitale', size: 'square', portrait: true, use: 'Enemy: Vitale crime family',
      prompt: 'Don Vitale, a silver-haired mafia boss in a three-piece pinstripe suit with a red carnation, seated in a leather chair, two bodyguards in fedoras behind him.' },
    { key: 'foe_cartel', size: 'square', portrait: true, use: 'Enemy: Los Cuervos cartel',
      prompt: 'A cold-eyed cartel sicario in a black cowboy hat and embroidered shirt with crow motifs, gold rings, holding a rifle in the desert heat.' },
    { key: 'foe_vinnie', size: 'square', portrait: true, use: 'Enemy: Vinnie\'s boys (debt collectors)',
      prompt: 'Two leg-breakers in cheap suits and fedoras, one tapping a baseball bat into his palm, standing under a buzzing streetlight.' },

    // ---- jobs ----
    { key: 'job_corner', size: 'wide', use: 'Job: rob a corner crew',
      prompt: 'Point of view from a car at night: a street corner with a few young dealers by a payphone and a bodega, unaware they are being watched.' },
    { key: 'job_stash', size: 'wide', use: 'Job: hit a stash house',
      prompt: 'A boarded-up row house at night with a single lit window, a guard smoking on the stoop, and a crew in dark clothes creeping along the fence.' },
    { key: 'job_shipment', size: 'wide', use: 'Job: hijack a shipment',
      prompt: 'A semi-truck stopped on a dark highway by a roadblock of cars with headlights blazing, armed crew in masks approaching, guards jumping out of the cab.' },
    { key: 'job_armored', size: 'wide', use: 'Job: knock over an armored truck',
      prompt: 'An armored cash truck rammed and smoking in a downtown intersection, money bags spilling, masked robbers taking cover behind cars.' },
    { key: 'job_counting', size: 'wide', use: 'Job: raid the mob counting room',
      prompt: 'A mob counting room behind a casino: tables piled with stacks of cash and money counters, mobsters looking up in shock as the door is kicked open.' },

    // ---- moments ----
    { key: 'scene_travel', size: 'wide', use: 'Traveling between districts',
      prompt: 'A car speeding along an elevated highway at night with the neon skyline streaking past, motion blur, rain on the windshield, seen from the back seat.' },
    { key: 'scene_busted', size: 'wide', use: 'Getting arrested',
      prompt: 'A hustler spread against the hood of a police car, hands behind his head, officers searching his coat, red and blue lights, dramatic low angle.' },
    { key: 'scene_wasted', size: 'tall', use: 'Game over (you died)',
      prompt: 'A chalk outline on a wet, neon-lit sidewalk with police tape fluttering, a fallen fedora and scattered playing cards, rain. Moody and somber, no body or blood visible.' },
    { key: 'scene_retire', size: 'tall', use: 'Retiring rich (end of a run)',
      prompt: 'A retired kingpin relaxing on the deck of a yacht at sunset with a cocktail, the city skyline far behind, a briefcase of cash at his feet, total freedom.' },
    { key: 'scene_win', size: 'wide', use: 'Winning a fight or job',
      prompt: 'A triumphant crew walking away from a burning car in slow motion, duffel bags of cash over their shoulders, sirens far away.' },
    { key: 'scene_loss', size: 'wide', use: 'Losing a fight or running away',
      prompt: 'A battered hustler limping down a rain-soaked alley holding his side, bullet holes in a dumpster, distant police lights.' },
    { key: 'evt_stash', size: 'wide', use: 'Event: you find a stash',
      prompt: 'A dropped sports bag under a park bench at night, unzipped, packages visible inside, a single streetlight spotlighting it.' },
    { key: 'evt_deal', size: 'wide', use: 'Event: someone offers you a deal',
      prompt: 'A twitchy dealer in a long coat opening it in a doorway to show the goods, glancing over his shoulder, neon sign buzzing above.' },
    { key: 'evt_tip', size: 'wide', use: 'Event: an informant tips you off',
      prompt: 'A close-up of a hand on a payphone in a rain-streaked booth at night, a folded note with an address in the other hand, city lights blurred behind.' },
  ];

  const pad = n => String(n).padStart(2, '0');
  G.ART = A.map((a, i) => ({ ...a, n: i + 1, file: `art/${pad(i + 1)}-${a.key.replace(/_/g, '-')}` }));
  const byKey = Object.fromEntries(G.ART.map(a => [a.key, a]));
  G.artOf = key => byKey[key] || null;
})(window.DrugWars = window.DrugWars || {});
