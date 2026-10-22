// Writes IMAGE_PROMPTS.md from art.js, so the numbers in the document always match the game.
// Run from the repo folder: node tools/make-prompts.js
'use strict';
const fs = require('fs');
const path = require('path');
global.window = {};
require('../art.js');
const G = window.DrugWars;

const sizeName = { square: 'Square, 1024 × 1024', wide: 'Landscape, 1536 × 1024', tall: 'Portrait, 1024 × 1536' };
const groups = [
  ['Title and you', a => ['title', 'char_player'].includes(a.key)],
  ['Districts', a => a.key.startsWith('district_')],
  ['Product icons', a => a.key.startsWith('drug_')],
  ['Places in the city', a => a.key.startsWith('svc_') || ['char_shark', 'char_doc', 'char_gunrunner'].includes(a.key)],
  ['Weapons and armor', a => a.key.startsWith('gun_') || a.key.startsWith('armor_')],
  ['Coats and bags', a => a.key.startsWith('gear_')],
  ['Vehicles', a => a.key.startsWith('car_')],
  ['Businesses', a => a.key.startsWith('front_')],
  ['Your crew', a => a.key.startsWith('crew_')],
  ['Enemies', a => a.key.startsWith('foe_')],
  ['Jobs', a => a.key.startsWith('job_')],
  ['Big moments and events', a => a.key.startsWith('scene_') || a.key.startsWith('evt_')],
];

const fullPrompt = a => [
  a.prompt.trim(),
  a.icon ? G.ICON_STYLE : a.portrait ? G.PORTRAIT_STYLE : '',
  G.ART_STYLE,
].filter(Boolean).join(' ');

let md = `# Drug Wars: image prompts

Every picture in the game, numbered to match the **PLACEHOLDER** cards you see in the game.
There are **${G.ART.length}** images.

## How to use this

1. For each placeholder below, give ChatGPT (or any image generator) the **Prompt**, at the **Size** listed.
   Each prompt already includes the shared style, so the whole game looks like one set.
2. Save the image with the exact **File** name, in the repo's \`art/\` folder.
   \`.webp\` is best (smallest); \`.png\` or \`.jpg\` also work. Example: \`art/03-district-downtown.webp\`.
3. Push to GitHub. The site picks up the new pictures within a few minutes, and each placeholder
   is replaced by its image. No code changes needed.

Tips:
- Generate the **district** and **title** images first: they're the biggest and set the look.
- Keep a consistent look: if one image comes out great, ask ChatGPT to "match the style of the previous image" for the next ones.
- Icons (products, weapons, gear) read best with the object big and centered on a dark background.
- Faces are shown small and round-cornered, so keep them centered with some headroom.
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
  const items = G.ART.filter(a => test(a) && !done.has(a.key));
  if (!items.length) continue;
  md += `---\n\n## ${title}\n\n`;
  for (const a of items) {
    done.add(a.key);
    md += `### Placeholder ${a.n}: ${a.use}\n\n`;
    md += `- **File:** \`${a.file}.webp\`\n- **Size:** ${sizeName[a.size]}\n\n`;
    md += '**Prompt:**\n\n```text\n' + fullPrompt(a) + '\n```\n\n';
  }
}
const missed = G.ART.filter(a => !done.has(a.key));
if (missed.length) throw new Error('Not in any group: ' + missed.map(a => a.key).join(', '));

md += `---\n\n## Checklist\n\n| # | File | Size | What |\n|---|---|---|---|\n`;
for (const a of G.ART) md += `| ${a.n} | \`${a.file}.webp\` | ${a.size} | ${a.use} |\n`;

fs.writeFileSync(path.join(__dirname, '..', 'IMAGE_PROMPTS.md'), md);
console.log(`IMAGE_PROMPTS.md written: ${G.ART.length} images`);
