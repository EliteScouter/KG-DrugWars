# Drug Wars: image prompts

Every picture in the game, numbered to match the **PLACEHOLDER** cards you see in the game.
There are **141** images. Numbers 1–77 are from the first version; 78–141 were added in v2
(those alone are in [NEW_IMAGES_V2.md](NEW_IMAGES_V2.md)).

## How to use this

1. For each placeholder below, give ChatGPT (or any image generator) the **Prompt**, at the **Size** listed.
   Each prompt already includes the shared style, so the whole game looks like one set.
2. Save the image with the exact **File** name, in the repo's `art/` folder.
   `.webp` is best (smallest); `.png` or `.jpg` also work.
3. Push to GitHub. The game shows each picture in place of its placeholder. No code changes needed.

Tips:
- Keep a consistent look: when an image comes out great, ask ChatGPT to "match the style of the previous image" for the next ones.
- Icons (product, weapons, items, crates) read best with the object big and centered on a dark background.
- Portraits are shown small with rounded corners, so keep faces centered with some headroom.
- Shrink files before pushing (for example with squoosh.app): aim for under 300 KB each.

## The shared style (already included in every prompt)

> Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.

Icons add:

> Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon.

Portraits add:

> Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game.

---

## Title and you

### Placeholder 1: Title screen key art (behind the DRUG WARS logo)

- **File:** `art/01-title.webp`
- **Size:** Portrait, 1024 × 1536

**Prompt:**

```text
A lone figure in a long trench coat stands on a rain-soaked rooftop at night, back to the viewer, looking out over a sprawling neon city by the sea. Palm trees, a casino tower glowing magenta, cargo cranes at the harbor, police helicopter searchlight cutting through the haze. Leave the top third of the image darker and emptier so a logo can sit there. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 2: The player (you, the boss) in the HUD and fights

- **File:** `art/02-char-player.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A sharp, confident young street hustler in a dark trench coat over a loud 80s print shirt, gold chain, slight smirk, scar through one eyebrow, cigarette-free. Ambiguous ethnicity. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## Districts

### Placeholder 3: Downtown district banner

- **File:** `art/03-district-downtown.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
Downtown Vice Harbor at night: glass office towers, a wide avenue with police cruisers parked at the curb, red and blue light reflecting on wet asphalt, steam from manholes, a few pedestrians in suits. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 4: The Docks district banner

- **File:** `art/04-district-docks.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
An industrial harbor at midnight: stacked shipping containers, huge cranes, a cargo ship with lights on, fog rolling off black water, a forklift and a single sodium lamp lighting a shady handoff in the distance. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 5: Eastside Projects district banner

- **File:** `art/05-district-eastside.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
Run-down housing project towers at dusk, graffiti on brick walls, a burnt-out car, chain-link fences, kids on bikes, a group hanging out by a corner store with a flickering neon sign. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 6: University Heights district banner

- **File:** `art/06-district-campus.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A leafy college town street at night: old brick university buildings, a lively bar strip with string lights, students on the sidewalk, a record store, a dorm with a party in one window. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 7: Lantern Row district banner

- **File:** `art/07-district-lantern.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A narrow Chinatown-style alley lit by rows of red paper lanterns, steam from noodle shops, neon signs in abstract shapes (no readable text), a back door guarded by a man in a black suit, light rain. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 8: Rust Yards district banner

- **File:** `art/08-district-rust.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A rusted industrial yard: chop shop garage with an open bay, motorcycles parked outside a biker bar, burning oil barrels, scrap piles and a junked crane under an orange sky. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 9: The Strip district banner

- **File:** `art/09-district-strip.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A glamorous casino boulevard at night: towering casino with a giant glowing star, valets, limousines, palm trees wrapped in lights, crowds in evening wear, everything drenched in magenta and gold neon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 10: Palm Hills district banner

- **File:** `art/10-district-hills.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A gated mansion neighborhood in the hills at blue hour: white modernist villas with infinity pools, palm-lined driveway, a security gate and a private patrol car, the neon city glittering far below. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 11: Border Town district banner

- **File:** `art/11-district-border.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A dusty desert border town at sunset: adobe buildings, a cantina with a hand-painted sign shape (no letters), pickup trucks with armed men, a lone highway disappearing into red mesas. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## Product icons

### Placeholder 12: Ludes icon (market)

- **File:** `art/12-drug-ludes.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A small vintage orange pharmacy pill bottle tipped over with a few chalky white round pills spilling out. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 13: Speed icon (market)

- **File:** `art/13-drug-speed.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A small folded paper packet and a few bright yellow capsules on a scratched metal surface. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 14: Weed icon (market)

- **File:** `art/14-drug-weed.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A sealed clear zip bag of green cannabis buds next to a single fresh cannabis leaf. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 15: Ecstasy icon (market)

- **File:** `art/15-drug-ecstasy.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A handful of colorful pressed party pills in pastel pink, blue and green with simple star and smiley shapes stamped on them. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 16: Shrooms icon (market)

- **File:** `art/16-drug-shrooms.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A cluster of dried magic mushrooms with tan caps and pale stems, slightly glowing with an otherworldly purple light. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 17: Acid icon (market)

- **File:** `art/17-drug-acid.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A small sheet of perforated blotter paper printed with a psychedelic rainbow spiral pattern (no text). Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 18: Heroin icon (market)

- **File:** `art/18-drug-heroin.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A small brick wrapped in brown paper and tape, stamped with an abstract scorpion symbol (no letters). Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 19: Cocaine icon (market)

- **File:** `art/19-drug-cocaine.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A tightly wrapped white brick in clear plastic and packing tape, stamped with an abstract crown symbol (no letters). Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 78: Hash icon (market)

- **File:** `art/78-drug-hash.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A few dark brown pressed blocks of hashish wrapped partly in gold foil, one broken open. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 79: Peyote icon (market)

- **File:** `art/79-drug-peyote.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A small round spineless green cactus button with soft white tufts, plus a few dried slices beside it, on desert sand. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 80: Crystal icon (market)

- **File:** `art/80-drug-meth.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A small clear zip bag of glittering icy blue crystal shards catching the light. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 81: Opium icon (market)

- **File:** `art/81-drug-opium.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A dark sticky ball of raw opium on a small brass dish next to dried poppy seed pods. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## Places in the city

### Placeholder 20: Bank (deposit and withdraw)

- **File:** `art/20-svc-bank.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
The marble lobby of an old-money bank at closing time: brass teller windows, a huge vault door slightly open, a nervous banker in a bow tie behind the counter. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 21: Vinnie the loan shark

- **File:** `art/21-char-shark.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
Vinnie, a heavy-set middle-aged loan shark in a cream suit and open collar, pinky ring, slicked-back gray hair, counting a thick wad of cash, friendly smile with cold eyes. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 22: Mercy General hospital (healing)

- **File:** `art/22-svc-hospital.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A busy inner-city emergency room at night: harsh fluorescent light, gurneys, a tired nurse, rain on the windows and an ambulance outside flashing red. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 23: Doc Wu, the back-room clinic doctor

- **File:** `art/23-char-doc.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
Doc Wu, an elderly unlicensed surgeon with round glasses, rolled-up sleeves and a stained apron, a glass of whiskey beside a tray of instruments, kind but weary face. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 24: The gun runner (weapons shop)

- **File:** `art/24-char-gunrunner.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A grizzled gun runner with a gray beard, trucker cap and military jacket, standing in front of the open trunk of a car lined with rifles and pistols, arms crossed. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 25: The pool hall (hiring crew)

- **File:** `art/25-svc-poolhall.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A smoky dive pool hall: green felt tables under hanging lamps, tough-looking men and women leaning on cues and the bar, jukebox glow, everyone sizing you up. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 26: Sal's tailoring (coats and bags)

- **File:** `art/26-svc-tailor.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A cramped old tailor shop: racks of trench coats and suits, a measuring tape around the neck of an old tailor, a secret compartment opened in a coat lining. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 27: Chop shop (vehicles)

- **File:** `art/27-svc-cars.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A chop shop garage at night: a gleaming muscle car on a lift, sparks from a grinder, stolen plates on the wall, mechanics in grease-stained overalls. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 28: Harbor Realty (buying businesses)

- **File:** `art/28-svc-realty.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A slick 80s real estate office: a smooth agent in a pastel suit gesturing at a wall map of the city with pins in it, a scale model of a nightclub on the desk, palm view through blinds. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 82: The Black Market (custom and military weapons)

- **File:** `art/82-svc-blackmarket.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A hidden arms bazaar inside a shipping container lit by a bare bulb: crates of military rifles, a minigun on a stand, grenade crates, a scarred dealer in a balaclava counting cash. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 83: Harbor Supply Co. (buy crates)

- **File:** `art/83-svc-supply.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A dockside warehouse stacked to the ceiling with wooden and steel shipping crates of different sizes, a forklift, a foreman with a clipboard, harbor lights through the open bay door. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 84: Palm Hills Luxury Broker (luxuries)

- **File:** `art/84-svc-luxury.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
An ultra-luxury showroom: marble floors, a scale model of a private island, a yacht brochure and champagne on a glass desk, an elegant broker in a white suit, ocean view at sunset. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 85: Marty Kessler, the crooked lawyer

- **File:** `art/85-char-lawyer.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
Marty Kessler, a slick, fast-talking defense lawyer with a comb-over, a shiny gray suit, gold cufflinks and a briefcase stuffed with cash, grinning knowingly. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 86: The Golden Star Casino (roulette)

- **File:** `art/86-svc-casino.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
The glittering floor of a grand 80s casino: crystal chandeliers, a crowded roulette table in the center, high rollers in tuxedos and sequined dresses, gold and magenta neon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 87: The Fixer (contracts)

- **File:** `art/87-char-fixer.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
The Fixer, a calm, mysterious middle-aged woman in a dark trench coat and leather gloves, sitting in a booth at a diner at 3 AM with a manila envelope in front of her. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 88: Safehouse (store product)

- **File:** `art/88-svc-stash.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A secret safehouse apartment with the floorboards pulled up to reveal a hidden compartment full of packages, blackout curtains, a mattress, a gun on the table, a single lamp. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 140: Casino: the roulette wheel (shown while it spins)

- **File:** `art/140-casino-wheel.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A close-up of a spinning roulette wheel in motion blur, the ivory ball bouncing, chips stacked on the felt, gold and red reflections. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## Weapons and armor

### Placeholder 29: Baseball bat

- **File:** `art/29-gun-bat.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A worn wooden baseball bat wrapped with black tape at the grip, a few nails missing, leaning at an angle. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 30: Saturday Night Special revolver

- **File:** `art/30-gun-revolver.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A cheap small snub-nose revolver with a chipped grip. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 31: 9mm pistol

- **File:** `art/31-gun-pistol.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A sleek black semi-automatic 9mm pistol. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 32: Pump shotgun

- **File:** `art/32-gun-shotgun.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A pump-action shotgun with a wooden stock and a few red shells beside it. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 33: Uzi

- **File:** `art/33-gun-uzi.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A compact submachine gun in the style of an Uzi with a folding stock. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 34: AK-47

- **File:** `art/34-gun-ak.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
An assault rifle in the style of an AK-47 with a curved magazine and wooden furniture. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 35: Leather jacket (armor)

- **File:** `art/35-armor-leather.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A heavy black leather biker jacket with zippers, displayed as if on an invisible mannequin. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 36: Kevlar vest (armor)

- **File:** `art/36-armor-kevlar.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A dark navy concealable bulletproof vest with velcro straps. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 37: Tactical plate armor

- **File:** `art/37-armor-plate.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A heavy black tactical plate carrier with magazine pouches and a ballistic helmet beside it. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 89: .357 Magnum

- **File:** `art/89-gun-magnum.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A big chrome .357 Magnum revolver with a long barrel and wooden grip. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 90: MAC-10

- **File:** `art/90-gun-mac10.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A compact boxy machine pistol in the style of a MAC-10 with a long magazine. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 91: M16 rifle

- **File:** `art/91-gun-m16.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A black military assault rifle in the style of an M16 with a carry handle. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 92: Sawed-off shotgun (custom)

- **File:** `art/92-gun-sawedoff.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A double-barrel sawed-off shotgun with a cut-down wooden stock, wrapped grip and engraved receiver. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 93: Golden Desert Eagle (custom)

- **File:** `art/93-gun-deagle.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A huge semi-automatic pistol in the style of a Desert Eagle, entirely gold-plated with ornate engraving. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 94: Tommy gun (custom)

- **File:** `art/94-gun-tommy.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A classic prohibition-era Thompson-style submachine gun with a round drum magazine and walnut grips. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 95: Sniper rifle (military)

- **File:** `art/95-gun-sniper.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A long bolt-action sniper rifle with a big scope and bipod. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 96: Grenade launcher (military)

- **File:** `art/96-gun-gl.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A chunky six-shot revolver-style grenade launcher with a big rotating cylinder. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 97: Minigun (military)

- **File:** `art/97-gun-minigun.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A massive six-barrel rotary minigun with an ammo belt feeding into it. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 98: Riot gear (armor)

- **File:** `art/98-armor-riot.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A black riot police armor set: padded chest and shoulder guards and a helmet with a visor. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 99: Juggernaut suit (armor)

- **File:** `art/99-armor-jugg.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A massive bomb-disposal style full-body armor suit with a thick visored helmet, intimidating and bulky. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## Fight items

### Placeholder 100: Med kit (fight item)

- **File:** `art/100-item-medkit.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A battered red first-aid kit opened to show bandages, syringes and gauze. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 101: Molotov (fight item)

- **File:** `art/101-item-molotov.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A glass bottle with a burning rag stuffed in its neck, flames licking upward. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 102: Frag grenade (fight item)

- **File:** `art/102-item-grenade.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A single olive-green fragmentation grenade with its pin and ring. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 103: Smoke bomb (fight item)

- **File:** `art/103-item-smoke.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A cylindrical smoke grenade billowing thick purple smoke. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## Coats, bags and crates

### Placeholder 38: Trench coat (more carrying space)

- **File:** `art/38-gear-trench.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A long tan trench coat held open to show many hidden inside pockets. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 39: Hockey bag (more carrying space)

- **File:** `art/39-gear-bag.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A huge black hockey duffel bag, unzipped and stuffed full. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 40: Hidden-lining suit (more space, cops find less)

- **File:** `art/40-gear-suit.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
An immaculate white 80s double-breasted suit with the lining peeled back to reveal secret compartments. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 108: Small crate (+20 space)

- **File:** `art/108-crate-small.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A small wooden shipping crate with rope handles, lid nailed shut. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 109: Medium crate (+50 space)

- **File:** `art/109-crate-medium.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A medium military-green metal footlocker crate with latches. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 110: Large crate (+100 space)

- **File:** `art/110-crate-large.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A large reinforced steel shipping crate with stenciled abstract markings (no text) and forklift slots. Single object centered, shown three-quarter view, filling about 70% of the frame, on a dark smoky charcoal background with a soft magenta-and-cyan neon glow behind it, like a premium video game item icon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## Vehicles

### Placeholder 41: Rusty sedan

- **File:** `art/41-car-sedan.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A beat-up boxy 70s sedan with a primer-gray door and a bungee-corded trunk, parked under a flickering streetlight. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 42: Muscle car

- **File:** `art/42-car-muscle.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A black 70s muscle car with a hood scoop and chrome, tires smoking as it peels out on a neon-lit street. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 43: Cargo van

- **File:** `art/43-car-van.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
An unmarked white cargo van with tinted windows and fake plumbing company stripes (no text), back doors open showing a big empty cargo area. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 44: Armored SUV

- **File:** `art/44-car-suv.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A black armored SUV with dark tinted windows and run-flat tires, parked in front of a mansion gate, bodyguard beside it. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 45: Cigarette boat

- **File:** `art/45-car-boat.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A long sleek cigarette speedboat in hot pink and white racing across moonlit water toward the neon skyline, spray flying. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 104: Moped

- **File:** `art/104-car-moped.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A cheap beat-up 80s moped with a milk crate strapped to the back, parked against a graffiti wall. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 105: Box truck

- **File:** `art/105-car-truck.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A big unmarked white box truck with a rolling rear door half open, parked in a loading bay at night. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 106: Mega yacht

- **File:** `art/106-car-yacht.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A gigantic gleaming white mega yacht with a helipad, glowing deck lights and a party on board, anchored off the neon skyline at night. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 107: Cargo plane

- **File:** `art/107-car-plane.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A four-engine cargo plane with its rear ramp lowered on a desert airstrip at dusk, pallets being loaded by forklift. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## Businesses and luxuries

### Placeholder 46: Spin City Laundromat (front)

- **File:** `art/46-front-laundromat.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A 24-hour laundromat glowing at night, rows of washers, a bored attendant, and a back room door slightly open with stacks of cash inside. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 47: Sudsy's Car Wash (front)

- **File:** `art/47-front-carwash.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A retro drive-through car wash with colorful brushes and a giant inflatable mascot shape, a luxury car going through, palm trees, sunset. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 48: Club Inferno nightclub (front)

- **File:** `art/48-front-club.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A packed 80s nightclub with a flame-themed light show, dance floor, DJ booth and a VIP mezzanine where a boss watches the crowd. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 49: The Back-Room Casino (front)

- **File:** `art/49-front-casino.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A secret high-stakes casino hidden behind a restaurant kitchen: velvet walls, roulette and card tables, gangsters and rich gamblers, smoky golden light. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 111: Lucky's Pawn & Loan (front)

- **File:** `art/111-front-pawn.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A cluttered pawn shop: guitars on the walls, jewelry cases, a barred counter, a neon sign shape in the window (no text), night outside. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 112: Sunset Auto Mall (front)

- **File:** `art/112-front-dealership.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A glitzy 80s luxury car dealership with sports cars under spotlights, pennant flags and palm trees, sunset sky. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 113: Harbor Shipping Line (front)

- **File:** `art/113-front-shipping.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A huge container ship being loaded at a private terminal you own: cranes, a fleet of trucks, the company office tower lit up at night. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 114: Penthouse suite (luxury)

- **File:** `art/114-lux-penthouse.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A sprawling penthouse at the top of a skyscraper: sunken living room, white leather sofas, a rooftop pool and floor-to-ceiling windows over the neon city. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 115: Champion racehorse (luxury)

- **File:** `art/115-lux-horse.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A magnificent black thoroughbred racehorse crossing the finish line first under stadium lights, jockey in pink and cyan silks, crowd roaring. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 116: Private jet (luxury)

- **File:** `art/116-lux-jet.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A sleek private jet on a tarmac at sunset with its stairs down, a red carpet and a luxury car pulling up beside it. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 117: Private island (luxury)

- **File:** `art/117-lux-island.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
An aerial view of a private tropical island with a white villa, infinity pool, helipad and a yacht in a turquoise lagoon. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## Your crew

### Placeholder 50: Crew member: Muscle

- **File:** `art/50-crew-muscle.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A huge bald enforcer with a thick neck, tank top and gold tooth, knuckles taped, calm and intimidating. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 51: Crew member: Shooter

- **File:** `art/51-crew-shooter.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A cool, focused sharpshooter woman with a sleek bob haircut, aviator sunglasses pushed up, black turtleneck, a pistol holstered at the shoulder. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 52: Crew member: Wheelman

- **File:** `art/52-crew-wheelman.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A wiry getaway driver with a mullet, racing jacket and driving gloves, toothpick in mouth, car keys spinning on one finger. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 53: Crew member: Medic

- **File:** `art/53-crew-medic.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A former army medic with a buzz cut and a scar, wearing a field jacket with a red cross patch and carrying a battered medical bag. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 118: Crew member: Smuggler

- **File:** `art/118-crew-smuggler.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A sly smuggler in a fisherman's sweater and beanie with a weathered face and a knowing grin, a duffel bag over one shoulder. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 119: Crew member: Fixer

- **File:** `art/119-crew-fixer.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A smooth negotiator in a sharp double-breasted suit and tinted glasses, holding a thick envelope and a brick-sized 80s cell phone. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## Enemies

### Placeholder 54: Enemy: Harbor PD (Detective Kane and officers)

- **File:** `art/54-foe-cops.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
Detective Kane, a hard-nosed plainclothes detective with a mustache, loosened tie and badge on his belt, gun drawn, two uniformed officers behind him by a police cruiser. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 55: Enemy: SWAT team

- **File:** `art/55-foe-swat.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A heavily armored SWAT officer in a helmet and gas mask holding a rifle, team stacked up behind, floodlights. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 56: Enemy: street muggers

- **File:** `art/56-foe-muggers.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
Two scruffy street muggers in hoodies in a dark alley, one holding a switchblade, nervous and desperate. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 57: Enemy: Eastside Kings gang

- **File:** `art/57-foe-kings.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A young street gang leader in a purple and gold tracksuit with a crown-shaped pendant, his crew behind him in a project stairwell. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 58: Enemy: Dock Rats gang

- **File:** `art/58-foe-rats.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A rough longshoreman gang boss in a knit cap and peacoat holding a cargo hook, dock workers behind him among containers. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 59: Enemy: Lantern Triad

- **File:** `art/59-foe-triad.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
An elegant, dangerous triad lieutenant in a black silk shirt with a dragon tattoo on one forearm, red lantern light, henchmen in the shadows. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 60: Enemy: Rust Riders motorcycle club

- **File:** `art/60-foe-riders.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A massive bearded outlaw biker in a leather vest with an abstract skull-and-wheel patch (no text), standing beside a chopper motorcycle. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 61: Enemy: Vitale crime family

- **File:** `art/61-foe-vitale.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
Don Vitale, a silver-haired mafia boss in a three-piece pinstripe suit with a red carnation, seated in a leather chair, two bodyguards in fedoras behind him. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 62: Enemy: Los Cuervos cartel

- **File:** `art/62-foe-cartel.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
A cold-eyed cartel sicario in a black cowboy hat and embroidered shirt with crow motifs, gold rings, holding a rifle in the desert heat. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 63: Enemy: Vinnie's boys (debt collectors)

- **File:** `art/63-foe-vinnie.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
Two leg-breakers in cheap suits and fedoras, one tapping a baseball bat into his palm, standing under a buzzing streetlight. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 120: Enemy: Narcotics Squad

- **File:** `art/120-foe-narcs.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
Plainclothes narcotics detectives in windbreakers over bulletproof vests, badges on chains, shotguns raised beside an unmarked car with a dashboard light. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 121: Enemy: Federal Task Force

- **File:** `art/121-foe-feds.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
Federal agents in navy raid jackets and helmets with heavy rifles, a helicopter spotlight blazing down behind them. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## Family bosses

### Placeholder 122: Boss: King Malik (Eastside Kings)

- **File:** `art/122-boss-kings.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
King Malik, a towering, charismatic street king in a purple velvet tracksuit, gold crown pendant and rings, sitting on a throne made from a car seat in a project rooftop. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 123: Boss: Big Sully (Dock Rats)

- **File:** `art/123-boss-rats.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
Big Sully, an enormous bearded dockworker boss in a peacoat and knit cap, a cargo hook in one hand, standing on a pier with his crew behind him. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 124: Boss: Madam Lin (Lantern Triad)

- **File:** `art/124-boss-triad.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
Madam Lin, an elegant, ice-cold triad matriarch in a black qipao with a jade hairpin, holding a long cigarette holder (unlit), red lanterns and bodyguards behind her. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 125: Boss: Diesel (Rust Riders MC)

- **File:** `art/125-boss-riders.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
Diesel, a hulking outlaw biker president with a gray braided beard, a leather vest with an abstract skull patch (no text) and goggles, leaning on a custom chopper in a burning junkyard. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 126: Boss: Don Vitale (Vitale Family)

- **File:** `art/126-boss-vitale.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
Don Vitale, an aging mafia patriarch with slicked silver hair, a black tuxedo and a red carnation, behind a huge mahogany desk in a casino office, dangerous calm. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 127: Boss: El Cuervo (Los Cuervos Cartel)

- **File:** `art/127-boss-cartel.webp`
- **Size:** Square, 1024 × 1024

**Prompt:**

```text
El Cuervo, a feared cartel kingpin in a black embroidered shirt and silver-tipped cowboy boots, a live crow on his shoulder, gold-plated rifle across his lap, desert hacienda behind him. Head-and-shoulders character portrait, facing the viewer, dramatic neon side lighting, dark blurred city background, like a character select screen in a crime video game. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## Jobs

### Placeholder 64: Job: rob a corner crew

- **File:** `art/64-job-corner.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
Point of view from a car at night: a street corner with a few young dealers by a payphone and a bodega, unaware they are being watched. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 65: Job: hit a stash house

- **File:** `art/65-job-stash.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A boarded-up row house at night with a single lit window, a guard smoking on the stoop, and a crew in dark clothes creeping along the fence. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 66: Job: hijack a shipment

- **File:** `art/66-job-shipment.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A semi-truck stopped on a dark highway by a roadblock of cars with headlights blazing, armed crew in masks approaching, guards jumping out of the cab. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 67: Job: knock over an armored truck

- **File:** `art/67-job-armored.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
An armored cash truck rammed and smoking in a downtown intersection, money bags spilling, masked robbers taking cover behind cars. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 68: Job: raid the mob counting room

- **File:** `art/68-job-counting.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A mob counting room behind a casino: tables piled with stacks of cash and money counters, mobsters looking up in shock as the door is kicked open. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 128: Job: rob an underground card game

- **File:** `art/128-job-cardgame.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A smoky back-room poker game: rich men around a felt table piled with cash and chips, bodyguards by the wall, the door bursting open. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 129: Job: rob the First Harbor Bank

- **File:** `art/129-job-bank.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A daring bank heist: masked robbers in suits inside a marble vault stuffing cash into duffel bags, alarm lights flashing red. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 130: Job: turf war

- **File:** `art/130-job-turf.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
Two rival crews facing off across a rain-soaked street at night, cars as cover, guns drawn, neon signs buzzing overhead, a standoff about to explode. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 131: Job: a contract hit

- **File:** `art/131-job-hit.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A dark car with tinted windows idling across from a neon diner where a target sits in the window booth, seen through rain on the windshield. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## Big moments, events and screens

### Placeholder 69: Traveling between districts

- **File:** `art/69-scene-travel.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A car speeding along an elevated highway at night with the neon skyline streaking past, motion blur, rain on the windshield, seen from the back seat. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 70: Getting arrested

- **File:** `art/70-scene-busted.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A hustler spread against the hood of a police car, hands behind his head, officers searching his coat, red and blue lights, dramatic low angle. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 71: Game over (you died)

- **File:** `art/71-scene-wasted.webp`
- **Size:** Portrait, 1024 × 1536

**Prompt:**

```text
A chalk outline on a wet, neon-lit sidewalk with police tape fluttering, a fallen fedora and scattered playing cards, rain. Moody and somber, no body or blood visible. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 72: Retiring rich (end of a run)

- **File:** `art/72-scene-retire.webp`
- **Size:** Portrait, 1024 × 1536

**Prompt:**

```text
A retired kingpin relaxing on the deck of a yacht at sunset with a cocktail, the city skyline far behind, a briefcase of cash at his feet, total freedom. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 73: Winning a fight or job

- **File:** `art/73-scene-win.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A triumphant crew walking away from a burning car in slow motion, duffel bags of cash over their shoulders, sirens far away. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 74: Losing a fight or running away

- **File:** `art/74-scene-loss.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A battered hustler limping down a rain-soaked alley holding his side, bullet holes in a dumpster, distant police lights. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 75: Event: you find a stash

- **File:** `art/75-evt-stash.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A dropped sports bag under a park bench at night, unzipped, packages visible inside, a single streetlight spotlighting it. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 76: Event: someone offers you a deal

- **File:** `art/76-evt-deal.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A twitchy dealer in a long coat opening it in a doorway to show the goods, glancing over his shoulder, neon sign buzzing above. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 77: Event: an informant tips you off

- **File:** `art/77-evt-tip.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A close-up of a hand on a payphone in a rain-streaked booth at night, a folded note with an address in the other hand, city lights blurred behind. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 132: Taking over a district or beating a boss

- **File:** `art/132-scene-takeover.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
Your crew standing tall on a rooftop at dawn over a conquered district, the defeated rival gang's abstract banner (no text) burning on the ground, city waking up below. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 133: Ending: King of Vice Harbor

- **File:** `art/133-scene-king.webp`
- **Size:** Portrait, 1024 × 1536

**Prompt:**

```text
The new kingpin seated on a grand chair at the top of a casino tower, the whole neon city spread out below through the window, crew lined up on both sides, total power. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 134: Ending: retiring to your private island

- **File:** `art/134-scene-island.webp`
- **Size:** Portrait, 1024 × 1536

**Prompt:**

```text
A lone figure in a white linen suit walking barefoot along a perfect beach at sunset toward a villa, a seaplane on the water, completely free. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 135: Event: a traveling arms dealer

- **File:** `art/135-evt-arms.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A mysterious arms dealer in a long coat opening a velvet-lined case in an underground parking garage, showing a gleaming custom weapon, single overhead light. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 136: Event: police checkpoint

- **File:** `art/136-evt-checkpoint.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A police roadblock at night: traffic cones, road flares, two cruisers angled across the road and officers with flashlights searching car trunks. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 137: Event: a nosy reporter

- **File:** `art/137-evt-reporter.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A determined newspaper reporter with a camera and notepad stepping out of the shadows of an alley, flashbulb going off. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 138: Event: lucky find

- **File:** `art/138-evt-cash.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A fat leather wallet stuffed with cash lying in a rain puddle on a neon-lit sidewalk. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 139: Event: festival in town

- **File:** `art/139-evt-festival.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A huge outdoor music festival at night: a stage with lasers, a massive crowd with glow sticks, food trucks and palm trees. Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

### Placeholder 141: Empire tab header: your territory

- **File:** `art/141-empire-map.webp`
- **Size:** Landscape, 1536 × 1024

**Prompt:**

```text
A gangster's war room: a big illustrated map of a fictional coastal city on a table with pins, red string and stacks of cash, a hand placing a pin, lamp light from above (no readable text on the map). Gritty neon-noir crime illustration set in a fictional 1980s coastal city called Vice Harbor (Miami heat meets New York grime). Painterly graphic-novel style with confident ink lines, deep shadows, wet reflective streets, hazy humid air, and hot magenta, electric cyan and sodium-orange neon rim light. Cinematic, moody, rich detail, saturated but dark. Fictional characters only (no real people or celebrities), no gore, no visible drug use, no text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## Checklist

| # | File | Size | What |
|---|---|---|---|
| 1 | `art/01-title.webp` | tall | Title screen key art (behind the DRUG WARS logo) |
| 2 | `art/02-char-player.webp` | square | The player (you, the boss) in the HUD and fights |
| 3 | `art/03-district-downtown.webp` | wide | Downtown district banner |
| 4 | `art/04-district-docks.webp` | wide | The Docks district banner |
| 5 | `art/05-district-eastside.webp` | wide | Eastside Projects district banner |
| 6 | `art/06-district-campus.webp` | wide | University Heights district banner |
| 7 | `art/07-district-lantern.webp` | wide | Lantern Row district banner |
| 8 | `art/08-district-rust.webp` | wide | Rust Yards district banner |
| 9 | `art/09-district-strip.webp` | wide | The Strip district banner |
| 10 | `art/10-district-hills.webp` | wide | Palm Hills district banner |
| 11 | `art/11-district-border.webp` | wide | Border Town district banner |
| 12 | `art/12-drug-ludes.webp` | square | Ludes icon (market) |
| 13 | `art/13-drug-speed.webp` | square | Speed icon (market) |
| 14 | `art/14-drug-weed.webp` | square | Weed icon (market) |
| 15 | `art/15-drug-ecstasy.webp` | square | Ecstasy icon (market) |
| 16 | `art/16-drug-shrooms.webp` | square | Shrooms icon (market) |
| 17 | `art/17-drug-acid.webp` | square | Acid icon (market) |
| 18 | `art/18-drug-heroin.webp` | square | Heroin icon (market) |
| 19 | `art/19-drug-cocaine.webp` | square | Cocaine icon (market) |
| 20 | `art/20-svc-bank.webp` | wide | Bank (deposit and withdraw) |
| 21 | `art/21-char-shark.webp` | square | Vinnie the loan shark |
| 22 | `art/22-svc-hospital.webp` | wide | Mercy General hospital (healing) |
| 23 | `art/23-char-doc.webp` | square | Doc Wu, the back-room clinic doctor |
| 24 | `art/24-char-gunrunner.webp` | square | The gun runner (weapons shop) |
| 25 | `art/25-svc-poolhall.webp` | wide | The pool hall (hiring crew) |
| 26 | `art/26-svc-tailor.webp` | wide | Sal's tailoring (coats and bags) |
| 27 | `art/27-svc-cars.webp` | wide | Chop shop (vehicles) |
| 28 | `art/28-svc-realty.webp` | wide | Harbor Realty (buying businesses) |
| 29 | `art/29-gun-bat.webp` | square | Baseball bat |
| 30 | `art/30-gun-revolver.webp` | square | Saturday Night Special revolver |
| 31 | `art/31-gun-pistol.webp` | square | 9mm pistol |
| 32 | `art/32-gun-shotgun.webp` | square | Pump shotgun |
| 33 | `art/33-gun-uzi.webp` | square | Uzi |
| 34 | `art/34-gun-ak.webp` | square | AK-47 |
| 35 | `art/35-armor-leather.webp` | square | Leather jacket (armor) |
| 36 | `art/36-armor-kevlar.webp` | square | Kevlar vest (armor) |
| 37 | `art/37-armor-plate.webp` | square | Tactical plate armor |
| 38 | `art/38-gear-trench.webp` | square | Trench coat (more carrying space) |
| 39 | `art/39-gear-bag.webp` | square | Hockey bag (more carrying space) |
| 40 | `art/40-gear-suit.webp` | square | Hidden-lining suit (more space, cops find less) |
| 41 | `art/41-car-sedan.webp` | wide | Rusty sedan |
| 42 | `art/42-car-muscle.webp` | wide | Muscle car |
| 43 | `art/43-car-van.webp` | wide | Cargo van |
| 44 | `art/44-car-suv.webp` | wide | Armored SUV |
| 45 | `art/45-car-boat.webp` | wide | Cigarette boat |
| 46 | `art/46-front-laundromat.webp` | wide | Spin City Laundromat (front) |
| 47 | `art/47-front-carwash.webp` | wide | Sudsy's Car Wash (front) |
| 48 | `art/48-front-club.webp` | wide | Club Inferno nightclub (front) |
| 49 | `art/49-front-casino.webp` | wide | The Back-Room Casino (front) |
| 50 | `art/50-crew-muscle.webp` | square | Crew member: Muscle |
| 51 | `art/51-crew-shooter.webp` | square | Crew member: Shooter |
| 52 | `art/52-crew-wheelman.webp` | square | Crew member: Wheelman |
| 53 | `art/53-crew-medic.webp` | square | Crew member: Medic |
| 54 | `art/54-foe-cops.webp` | square | Enemy: Harbor PD (Detective Kane and officers) |
| 55 | `art/55-foe-swat.webp` | square | Enemy: SWAT team |
| 56 | `art/56-foe-muggers.webp` | square | Enemy: street muggers |
| 57 | `art/57-foe-kings.webp` | square | Enemy: Eastside Kings gang |
| 58 | `art/58-foe-rats.webp` | square | Enemy: Dock Rats gang |
| 59 | `art/59-foe-triad.webp` | square | Enemy: Lantern Triad |
| 60 | `art/60-foe-riders.webp` | square | Enemy: Rust Riders motorcycle club |
| 61 | `art/61-foe-vitale.webp` | square | Enemy: Vitale crime family |
| 62 | `art/62-foe-cartel.webp` | square | Enemy: Los Cuervos cartel |
| 63 | `art/63-foe-vinnie.webp` | square | Enemy: Vinnie's boys (debt collectors) |
| 64 | `art/64-job-corner.webp` | wide | Job: rob a corner crew |
| 65 | `art/65-job-stash.webp` | wide | Job: hit a stash house |
| 66 | `art/66-job-shipment.webp` | wide | Job: hijack a shipment |
| 67 | `art/67-job-armored.webp` | wide | Job: knock over an armored truck |
| 68 | `art/68-job-counting.webp` | wide | Job: raid the mob counting room |
| 69 | `art/69-scene-travel.webp` | wide | Traveling between districts |
| 70 | `art/70-scene-busted.webp` | wide | Getting arrested |
| 71 | `art/71-scene-wasted.webp` | tall | Game over (you died) |
| 72 | `art/72-scene-retire.webp` | tall | Retiring rich (end of a run) |
| 73 | `art/73-scene-win.webp` | wide | Winning a fight or job |
| 74 | `art/74-scene-loss.webp` | wide | Losing a fight or running away |
| 75 | `art/75-evt-stash.webp` | wide | Event: you find a stash |
| 76 | `art/76-evt-deal.webp` | wide | Event: someone offers you a deal |
| 77 | `art/77-evt-tip.webp` | wide | Event: an informant tips you off |
| 78 | `art/78-drug-hash.webp` | square | Hash icon (market) |
| 79 | `art/79-drug-peyote.webp` | square | Peyote icon (market) |
| 80 | `art/80-drug-meth.webp` | square | Crystal icon (market) |
| 81 | `art/81-drug-opium.webp` | square | Opium icon (market) |
| 82 | `art/82-svc-blackmarket.webp` | wide | The Black Market (custom and military weapons) |
| 83 | `art/83-svc-supply.webp` | wide | Harbor Supply Co. (buy crates) |
| 84 | `art/84-svc-luxury.webp` | wide | Palm Hills Luxury Broker (luxuries) |
| 85 | `art/85-char-lawyer.webp` | square | Marty Kessler, the crooked lawyer |
| 86 | `art/86-svc-casino.webp` | wide | The Golden Star Casino (roulette) |
| 87 | `art/87-char-fixer.webp` | square | The Fixer (contracts) |
| 88 | `art/88-svc-stash.webp` | wide | Safehouse (store product) |
| 89 | `art/89-gun-magnum.webp` | square | .357 Magnum |
| 90 | `art/90-gun-mac10.webp` | square | MAC-10 |
| 91 | `art/91-gun-m16.webp` | square | M16 rifle |
| 92 | `art/92-gun-sawedoff.webp` | square | Sawed-off shotgun (custom) |
| 93 | `art/93-gun-deagle.webp` | square | Golden Desert Eagle (custom) |
| 94 | `art/94-gun-tommy.webp` | square | Tommy gun (custom) |
| 95 | `art/95-gun-sniper.webp` | square | Sniper rifle (military) |
| 96 | `art/96-gun-gl.webp` | square | Grenade launcher (military) |
| 97 | `art/97-gun-minigun.webp` | square | Minigun (military) |
| 98 | `art/98-armor-riot.webp` | square | Riot gear (armor) |
| 99 | `art/99-armor-jugg.webp` | square | Juggernaut suit (armor) |
| 100 | `art/100-item-medkit.webp` | square | Med kit (fight item) |
| 101 | `art/101-item-molotov.webp` | square | Molotov (fight item) |
| 102 | `art/102-item-grenade.webp` | square | Frag grenade (fight item) |
| 103 | `art/103-item-smoke.webp` | square | Smoke bomb (fight item) |
| 104 | `art/104-car-moped.webp` | wide | Moped |
| 105 | `art/105-car-truck.webp` | wide | Box truck |
| 106 | `art/106-car-yacht.webp` | wide | Mega yacht |
| 107 | `art/107-car-plane.webp` | wide | Cargo plane |
| 108 | `art/108-crate-small.webp` | square | Small crate (+20 space) |
| 109 | `art/109-crate-medium.webp` | square | Medium crate (+50 space) |
| 110 | `art/110-crate-large.webp` | square | Large crate (+100 space) |
| 111 | `art/111-front-pawn.webp` | wide | Lucky's Pawn & Loan (front) |
| 112 | `art/112-front-dealership.webp` | wide | Sunset Auto Mall (front) |
| 113 | `art/113-front-shipping.webp` | wide | Harbor Shipping Line (front) |
| 114 | `art/114-lux-penthouse.webp` | wide | Penthouse suite (luxury) |
| 115 | `art/115-lux-horse.webp` | wide | Champion racehorse (luxury) |
| 116 | `art/116-lux-jet.webp` | wide | Private jet (luxury) |
| 117 | `art/117-lux-island.webp` | wide | Private island (luxury) |
| 118 | `art/118-crew-smuggler.webp` | square | Crew member: Smuggler |
| 119 | `art/119-crew-fixer.webp` | square | Crew member: Fixer |
| 120 | `art/120-foe-narcs.webp` | square | Enemy: Narcotics Squad |
| 121 | `art/121-foe-feds.webp` | square | Enemy: Federal Task Force |
| 122 | `art/122-boss-kings.webp` | square | Boss: King Malik (Eastside Kings) |
| 123 | `art/123-boss-rats.webp` | square | Boss: Big Sully (Dock Rats) |
| 124 | `art/124-boss-triad.webp` | square | Boss: Madam Lin (Lantern Triad) |
| 125 | `art/125-boss-riders.webp` | square | Boss: Diesel (Rust Riders MC) |
| 126 | `art/126-boss-vitale.webp` | square | Boss: Don Vitale (Vitale Family) |
| 127 | `art/127-boss-cartel.webp` | square | Boss: El Cuervo (Los Cuervos Cartel) |
| 128 | `art/128-job-cardgame.webp` | wide | Job: rob an underground card game |
| 129 | `art/129-job-bank.webp` | wide | Job: rob the First Harbor Bank |
| 130 | `art/130-job-turf.webp` | wide | Job: turf war |
| 131 | `art/131-job-hit.webp` | wide | Job: a contract hit |
| 132 | `art/132-scene-takeover.webp` | wide | Taking over a district or beating a boss |
| 133 | `art/133-scene-king.webp` | tall | Ending: King of Vice Harbor |
| 134 | `art/134-scene-island.webp` | tall | Ending: retiring to your private island |
| 135 | `art/135-evt-arms.webp` | wide | Event: a traveling arms dealer |
| 136 | `art/136-evt-checkpoint.webp` | wide | Event: police checkpoint |
| 137 | `art/137-evt-reporter.webp` | wide | Event: a nosy reporter |
| 138 | `art/138-evt-cash.webp` | wide | Event: lucky find |
| 139 | `art/139-evt-festival.webp` | wide | Event: festival in town |
| 140 | `art/140-casino-wheel.webp` | wide | Casino: the roulette wheel (shown while it spins) |
| 141 | `art/141-empire-map.webp` | wide | Empire tab header: your territory |
