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

    // ==================== v2: everything below is new (78 and up) ====================
    // ---- new product ----
    { key: 'drug_hash', size: 'square', icon: true, use: 'Hash icon (market)',
      prompt: 'A few dark brown pressed blocks of hashish wrapped partly in gold foil, one broken open.' },
    { key: 'drug_peyote', size: 'square', icon: true, use: 'Peyote icon (market)',
      prompt: 'A small round spineless green cactus button with soft white tufts, plus a few dried slices beside it, on desert sand.' },
    { key: 'drug_meth', size: 'square', icon: true, use: 'Crystal icon (market)',
      prompt: 'A small clear zip bag of glittering icy blue crystal shards catching the light.' },
    { key: 'drug_opium', size: 'square', icon: true, use: 'Opium icon (market)',
      prompt: 'A dark sticky ball of raw opium on a small brass dish next to dried poppy seed pods.' },

    // ---- new places ----
    { key: 'svc_blackmarket', size: 'wide', use: 'The Black Market (custom and military weapons)',
      prompt: 'A hidden arms bazaar inside a shipping container lit by a bare bulb: crates of military rifles, a minigun on a stand, grenade crates, a scarred dealer in a balaclava counting cash.' },
    { key: 'svc_supply', size: 'wide', use: 'Harbor Supply Co. (buy crates)',
      prompt: 'A dockside warehouse stacked to the ceiling with wooden and steel shipping crates of different sizes, a forklift, a foreman with a clipboard, harbor lights through the open bay door.' },
    { key: 'svc_luxury', size: 'wide', use: 'Palm Hills Luxury Broker (luxuries)',
      prompt: 'An ultra-luxury showroom: marble floors, a scale model of a private island, a yacht brochure and champagne on a glass desk, an elegant broker in a white suit, ocean view at sunset.' },
    { key: 'char_lawyer', size: 'square', portrait: true, use: 'Marty Kessler, the crooked lawyer',
      prompt: 'Marty Kessler, a slick, fast-talking defense lawyer with a comb-over, a shiny gray suit, gold cufflinks and a briefcase stuffed with cash, grinning knowingly.' },
    { key: 'svc_casino', size: 'wide', use: 'The Golden Star Casino (roulette)',
      prompt: 'The glittering floor of a grand 80s casino: crystal chandeliers, a crowded roulette table in the center, high rollers in tuxedos and sequined dresses, gold and magenta neon.' },
    { key: 'char_fixer', size: 'square', portrait: true, use: 'The Fixer (contracts)',
      prompt: 'The Fixer, a calm, mysterious middle-aged woman in a dark trench coat and leather gloves, sitting in a booth at a diner at 3 AM with a manila envelope in front of her.' },
    { key: 'svc_stash', size: 'wide', use: 'Safehouse (store product)',
      prompt: 'A secret safehouse apartment with the floorboards pulled up to reveal a hidden compartment full of packages, blackout curtains, a mattress, a gun on the table, a single lamp.' },

    // ---- new weapons ----
    { key: 'gun_magnum', size: 'square', icon: true, use: '.357 Magnum',
      prompt: 'A big chrome .357 Magnum revolver with a long barrel and wooden grip.' },
    { key: 'gun_mac10', size: 'square', icon: true, use: 'MAC-10',
      prompt: 'A compact boxy machine pistol in the style of a MAC-10 with a long magazine.' },
    { key: 'gun_m16', size: 'square', icon: true, use: 'M16 rifle',
      prompt: 'A black military assault rifle in the style of an M16 with a carry handle.' },
    { key: 'gun_sawedoff', size: 'square', icon: true, use: 'Sawed-off shotgun (custom)',
      prompt: 'A double-barrel sawed-off shotgun with a cut-down wooden stock, wrapped grip and engraved receiver.' },
    { key: 'gun_deagle', size: 'square', icon: true, use: 'Golden Desert Eagle (custom)',
      prompt: 'A huge semi-automatic pistol in the style of a Desert Eagle, entirely gold-plated with ornate engraving.' },
    { key: 'gun_tommy', size: 'square', icon: true, use: 'Tommy gun (custom)',
      prompt: 'A classic prohibition-era Thompson-style submachine gun with a round drum magazine and walnut grips.' },
    { key: 'gun_sniper', size: 'square', icon: true, use: 'Sniper rifle (military)',
      prompt: 'A long bolt-action sniper rifle with a big scope and bipod.' },
    { key: 'gun_gl', size: 'square', icon: true, use: 'Grenade launcher (military)',
      prompt: 'A chunky six-shot revolver-style grenade launcher with a big rotating cylinder.' },
    { key: 'gun_minigun', size: 'square', icon: true, use: 'Minigun (military)',
      prompt: 'A massive six-barrel rotary minigun with an ammo belt feeding into it.' },
    { key: 'armor_riot', size: 'square', icon: true, use: 'Riot gear (armor)',
      prompt: 'A black riot police armor set: padded chest and shoulder guards and a helmet with a visor.' },
    { key: 'armor_jugg', size: 'square', icon: true, use: 'Juggernaut suit (armor)',
      prompt: 'A massive bomb-disposal style full-body armor suit with a thick visored helmet, intimidating and bulky.' },

    // ---- fight items ----
    { key: 'item_medkit', size: 'square', icon: true, use: 'Med kit (fight item)',
      prompt: 'A battered red first-aid kit opened to show bandages, syringes and gauze.' },
    { key: 'item_molotov', size: 'square', icon: true, use: 'Molotov (fight item)',
      prompt: 'A glass bottle with a burning rag stuffed in its neck, flames licking upward.' },
    { key: 'item_grenade', size: 'square', icon: true, use: 'Frag grenade (fight item)',
      prompt: 'A single olive-green fragmentation grenade with its pin and ring.' },
    { key: 'item_smoke', size: 'square', icon: true, use: 'Smoke bomb (fight item)',
      prompt: 'A cylindrical smoke grenade billowing thick purple smoke.' },

    // ---- new vehicles and crates ----
    { key: 'car_moped', size: 'wide', use: 'Moped',
      prompt: 'A cheap beat-up 80s moped with a milk crate strapped to the back, parked against a graffiti wall.' },
    { key: 'car_truck', size: 'wide', use: 'Box truck',
      prompt: 'A big unmarked white box truck with a rolling rear door half open, parked in a loading bay at night.' },
    { key: 'car_yacht', size: 'wide', use: 'Mega yacht',
      prompt: 'A gigantic gleaming white mega yacht with a helipad, glowing deck lights and a party on board, anchored off the neon skyline at night.' },
    { key: 'car_plane', size: 'wide', use: 'Cargo plane',
      prompt: 'A four-engine cargo plane with its rear ramp lowered on a desert airstrip at dusk, pallets being loaded by forklift.' },
    { key: 'crate_small', size: 'square', icon: true, use: 'Small crate (+20 space)',
      prompt: 'A small wooden shipping crate with rope handles, lid nailed shut.' },
    { key: 'crate_medium', size: 'square', icon: true, use: 'Medium crate (+50 space)',
      prompt: 'A medium military-green metal footlocker crate with latches.' },
    { key: 'crate_large', size: 'square', icon: true, use: 'Large crate (+100 space)',
      prompt: 'A large reinforced steel shipping crate with stenciled abstract markings (no text) and forklift slots.' },

    // ---- new businesses and luxuries ----
    { key: 'front_pawn', size: 'wide', use: 'Lucky\'s Pawn & Loan (front)',
      prompt: 'A cluttered pawn shop: guitars on the walls, jewelry cases, a barred counter, a neon sign shape in the window (no text), night outside.' },
    { key: 'front_dealership', size: 'wide', use: 'Sunset Auto Mall (front)',
      prompt: 'A glitzy 80s luxury car dealership with sports cars under spotlights, pennant flags and palm trees, sunset sky.' },
    { key: 'front_shipping', size: 'wide', use: 'Harbor Shipping Line (front)',
      prompt: 'A huge container ship being loaded at a private terminal you own: cranes, a fleet of trucks, the company office tower lit up at night.' },
    { key: 'lux_penthouse', size: 'wide', use: 'Penthouse suite (luxury)',
      prompt: 'A sprawling penthouse at the top of a skyscraper: sunken living room, white leather sofas, a rooftop pool and floor-to-ceiling windows over the neon city.' },
    { key: 'lux_horse', size: 'wide', use: 'Champion racehorse (luxury)',
      prompt: 'A magnificent black thoroughbred racehorse crossing the finish line first under stadium lights, jockey in pink and cyan silks, crowd roaring.' },
    { key: 'lux_jet', size: 'wide', use: 'Private jet (luxury)',
      prompt: 'A sleek private jet on a tarmac at sunset with its stairs down, a red carpet and a luxury car pulling up beside it.' },
    { key: 'lux_island', size: 'wide', use: 'Private island (luxury)',
      prompt: 'An aerial view of a private tropical island with a white villa, infinity pool, helipad and a yacht in a turquoise lagoon.' },

    // ---- new crew ----
    { key: 'crew_smuggler', size: 'square', portrait: true, use: 'Crew member: Smuggler',
      prompt: 'A sly smuggler in a fisherman\'s sweater and beanie with a weathered face and a knowing grin, a duffel bag over one shoulder.' },
    { key: 'crew_fixer', size: 'square', portrait: true, use: 'Crew member: Fixer',
      prompt: 'A smooth negotiator in a sharp double-breasted suit and tinted glasses, holding a thick envelope and a brick-sized 80s cell phone.' },

    // ---- new cops and the faction bosses ----
    { key: 'foe_narcs', size: 'square', portrait: true, use: 'Enemy: Narcotics Squad',
      prompt: 'Plainclothes narcotics detectives in windbreakers over bulletproof vests, badges on chains, shotguns raised beside an unmarked car with a dashboard light.' },
    { key: 'foe_feds', size: 'square', portrait: true, use: 'Enemy: Federal Task Force',
      prompt: 'Federal agents in navy raid jackets and helmets with heavy rifles, a helicopter spotlight blazing down behind them.' },
    { key: 'boss_kings', size: 'square', portrait: true, use: 'Boss: King Malik (Eastside Kings)',
      prompt: 'King Malik, a towering, charismatic street king in a purple velvet tracksuit, gold crown pendant and rings, sitting on a throne made from a car seat in a project rooftop.' },
    { key: 'boss_rats', size: 'square', portrait: true, use: 'Boss: Big Sully (Dock Rats)',
      prompt: 'Big Sully, an enormous bearded dockworker boss in a peacoat and knit cap, a cargo hook in one hand, standing on a pier with his crew behind him.' },
    { key: 'boss_triad', size: 'square', portrait: true, use: 'Boss: Madam Lin (Lantern Triad)',
      prompt: 'Madam Lin, an elegant, ice-cold triad matriarch in a black qipao with a jade hairpin, holding a long cigarette holder (unlit), red lanterns and bodyguards behind her.' },
    { key: 'boss_riders', size: 'square', portrait: true, use: 'Boss: Diesel (Rust Riders MC)',
      prompt: 'Diesel, a hulking outlaw biker president with a gray braided beard, a leather vest with an abstract skull patch (no text) and goggles, leaning on a custom chopper in a burning junkyard.' },
    { key: 'boss_vitale', size: 'square', portrait: true, use: 'Boss: Don Vitale (Vitale Family)',
      prompt: 'Don Vitale, an aging mafia patriarch with slicked silver hair, a black tuxedo and a red carnation, behind a huge mahogany desk in a casino office, dangerous calm.' },
    { key: 'boss_cartel', size: 'square', portrait: true, use: 'Boss: El Cuervo (Los Cuervos Cartel)',
      prompt: 'El Cuervo, a feared cartel kingpin in a black embroidered shirt and silver-tipped cowboy boots, a live crow on his shoulder, gold-plated rifle across his lap, desert hacienda behind him.' },

    // ---- new jobs ----
    { key: 'job_cardgame', size: 'wide', use: 'Job: rob an underground card game',
      prompt: 'A smoky back-room poker game: rich men around a felt table piled with cash and chips, bodyguards by the wall, the door bursting open.' },
    { key: 'job_bank', size: 'wide', use: 'Job: rob the First Harbor Bank',
      prompt: 'A daring bank heist: masked robbers in suits inside a marble vault stuffing cash into duffel bags, alarm lights flashing red.' },
    { key: 'job_turf', size: 'wide', use: 'Job: turf war',
      prompt: 'Two rival crews facing off across a rain-soaked street at night, cars as cover, guns drawn, neon signs buzzing overhead, a standoff about to explode.' },
    { key: 'job_hit', size: 'wide', use: 'Job: a contract hit',
      prompt: 'A dark car with tinted windows idling across from a neon diner where a target sits in the window booth, seen through rain on the windshield.' },

    // ---- new moments ----
    { key: 'scene_takeover', size: 'wide', use: 'Taking over a district or beating a boss',
      prompt: 'Your crew standing tall on a rooftop at dawn over a conquered district, the defeated rival gang\'s abstract banner (no text) burning on the ground, city waking up below.' },
    { key: 'scene_king', size: 'tall', use: 'Ending: King of Vice Harbor',
      prompt: 'The new kingpin seated on a grand chair at the top of a casino tower, the whole neon city spread out below through the window, crew lined up on both sides, total power.' },
    { key: 'scene_island', size: 'tall', use: 'Ending: retiring to your private island',
      prompt: 'A lone figure in a white linen suit walking barefoot along a perfect beach at sunset toward a villa, a seaplane on the water, completely free.' },
    { key: 'evt_arms', size: 'wide', use: 'Event: a traveling arms dealer',
      prompt: 'A mysterious arms dealer in a long coat opening a velvet-lined case in an underground parking garage, showing a gleaming custom weapon, single overhead light.' },
    { key: 'evt_checkpoint', size: 'wide', use: 'Event: police checkpoint',
      prompt: 'A police roadblock at night: traffic cones, road flares, two cruisers angled across the road and officers with flashlights searching car trunks.' },
    { key: 'evt_reporter', size: 'wide', use: 'Event: a nosy reporter',
      prompt: 'A determined newspaper reporter with a camera and notepad stepping out of the shadows of an alley, flashbulb going off.' },
    { key: 'evt_cash', size: 'wide', use: 'Event: lucky find',
      prompt: 'A fat leather wallet stuffed with cash lying in a rain puddle on a neon-lit sidewalk.' },
    { key: 'evt_festival', size: 'wide', use: 'Event: festival in town',
      prompt: 'A huge outdoor music festival at night: a stage with lasers, a massive crowd with glow sticks, food trucks and palm trees.' },
    { key: 'casino_wheel', size: 'wide', use: 'Casino: the roulette wheel (shown while it spins)',
      prompt: 'A close-up of a spinning roulette wheel in motion blur, the ivory ball bouncing, chips stacked on the felt, gold and red reflections.' },
    { key: 'empire_map', size: 'wide', use: 'Empire tab header: your territory',
      prompt: 'A gangster\'s war room: a big illustrated map of a fictional coastal city on a table with pins, red string and stacks of cash, a hand placing a pin, lamp light from above (no readable text on the map).' },
  ];

  const pad = n => String(n).padStart(2, '0');
  G.ART = A.map((a, i) => ({ ...a, n: i + 1, file: `art/${pad(i + 1)}-${a.key.replace(/_/g, '-')}` }));
  const byKey = Object.fromEntries(G.ART.map(a => [a.key, a]));
  G.artOf = key => byKey[key] || null;
})(window.DrugWars = window.DrugWars || {});
