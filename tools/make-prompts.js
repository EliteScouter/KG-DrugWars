// Writes the image prompt documents from art.js, so their numbers always match the game.
//   IMAGE_PROMPTS.md   every picture
//   NEW_IMAGES_V2.md   only the pictures added in v2 (78 and up)
// Run from the repo folder: node tools/make-prompts.js
'use strict';
const fs = require('fs');
const path = require('path');
global.window = {};
require('../art.js');
const G = window.DrugWars;
const FIRST_V2 = 78;

const sizeName = { square: 'Square, 1024 × 1024', wide: 'Landscape, 1536 × 1024', tall: 'Portrait, 1024 × 1536' };
const starts = (...p) => a => p.some(x => a.key.startsWith(x));
const groups = [
  ['Title and you', a => ['title', 'char_player'].includes(a.key)],
  ['Districts', starts('district_')],
  ['Product icons', starts('drug_')],
  ['Places in the city', a => starts('svc_')(a) || ['char_shark', 'char_doc', 'char_gunrunner', 'char_lawyer', 'char_fixer', 'casino_wheel'].includes(a.key)],
  ['Weapons and armor', starts('gun_', 'armor_')],
  ['Fight items', starts('item_')],
  ['Coats, bags and crates', starts('gear_', 'crate_')],
  ['Vehicles', starts('car_')],
  ['Businesses and luxuries', starts('front_', 'lux_')],
  ['Your crew', starts('crew_')],
  ['Enemies', starts('foe_')],
  ['Family bosses', starts('boss_')],
  ['Jobs', starts('job_')],
  ['Big moments, events and screens', a => starts('scene_', 'evt_')(a) || a.key === 'empire_map'],
];

const fullPrompt = a => [a.prompt.trim(), a.icon ? G.ICON_STYLE : a.portrait ? G.PORTRAIT_STYLE : '', G.ART_STYLE].filter(Boolean).join(' ');

function doc(list, intro) {
  let md = intro + `
## How to use this

1. For each placeholder below, give ChatGPT (or any image generator) the **Prompt**, at the **Size** listed.
   Each prompt already includes the shared style, so the whole game looks like one set.
2. Save the image with the exact **File** name, in the repo's \`art/\` folder.
   \`.webp\` is best (smallest); \`.png\` or \`.jpg\` also work.
3. Push to GitHub. The game shows each picture in place of its placeholder. No code changes needed.

Tips:
- Keep a consistent look: when an image comes out great, ask ChatGPT to "match the style of the previous image" for the next ones.
- Icons (product, weapons, items, crates) read best with the object big and centered on a dark background.
- Portraits are shown small with rounded corners, so keep faces centered with some headroom.
- Shrink files before pushing (for example with squoosh.app): aim for under 300 KB each.

## The shared style (already included in every prompt)

> ${G.ART_STYLE}

Icons add:

> ${G.ICON_STYLE}

Portraits add:

> ${G.PORTRAIT_STYLE}

`;
  const done = new Set();
  for (const [title, test] of groups) {
    const items = list.filter(a => test(a) && !done.has(a.key));
    if (!items.length) continue;
    md += `---\n\n## ${title}\n\n`;
    for (const a of items) {
      done.add(a.key);
      md += `### Placeholder ${a.n}: ${a.use}\n\n`;
      md += `- **File:** \`${a.file}.webp\`\n- **Size:** ${sizeName[a.size]}\n\n`;
      md += '**Prompt:**\n\n```text\n' + fullPrompt(a) + '\n```\n\n';
    }
  }
  const missed = list.filter(a => !done.has(a.key));
  if (missed.length) throw new Error('Not in any group: ' + missed.map(a => a.key).join(', '));
  md += `---\n\n## Checklist\n\n| # | File | Size | What |\n|---|---|---|---|\n`;
  for (const a of list) md += `| ${a.n} | \`${a.file}.webp\` | ${a.size} | ${a.use} |\n`;
  return md;
}

const all = G.ART, fresh = G.ART.filter(a => a.n >= FIRST_V2);
fs.writeFileSync(path.join(__dirname, '..', 'IMAGE_PROMPTS.md'), doc(all, `# Drug Wars: image prompts

Every picture in the game, numbered to match the **PLACEHOLDER** cards you see in the game.
There are **${all.length}** images. Numbers 1–${FIRST_V2 - 1} are from the first version; ${FIRST_V2}–${all.length} were added in v2
(those alone are in [NEW_IMAGES_V2.md](NEW_IMAGES_V2.md)).
`));
fs.writeFileSync(path.join(__dirname, '..', 'NEW_IMAGES_V2.md'), doc(fresh, `# Drug Wars v2: the new images

Only the **${fresh.length}** pictures added in v2: placeholders **${FIRST_V2}–${all.length}**.
The first ${FIRST_V2 - 1} pictures are already done and keep their numbers and files.
`));
console.log(`IMAGE_PROMPTS.md: ${all.length} images; NEW_IMAGES_V2.md: ${fresh.length} images (${FIRST_V2}-${all.length})`);
