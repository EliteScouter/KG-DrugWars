# Drug Wars

A neon-noir trading and crime game for [Kaotic Gaming](https://kaotic.strictgaming.com), built for phones first.

You start in Vice Harbor with $2,000, a baseball bat and a $5,500 debt to Vinnie the Shark.
Buy low, travel, sell high, and grow from a corner hustler into a kingpin:

- **9 districts**, each with its own prices, cops, gang and shops (The Strip, Palm Hills and
  Border Town have to be unlocked).
- **8 products** with daily prices, plus news events that spike or crash them.
- **Encounters** on the road: Detective Kane and SWAT, muggers, rival gangs, Vinnie's
  leg-breakers, and lucky breaks (dropped stashes, cheap deals, tips, guns off a truck).
- **Turn-based fights**: fight, run, bribe, pay up or give in. Your crew fights beside you.
- **Crew**: hire Muscle, Shooters, Wheelmen and Medics. Pay them daily or they walk.
- **Gear**: 6 weapons, 3 armors, bigger coats and bags, 5 vehicles (more carrying, better getaways).
- **Jobs**: rob corner crews, hit stash houses, hijack shipments, knock over armored trucks,
  raid the Vitale family's counting room. Odds are shown before you commit.
- **Money**: bank, loan shark, heat and rep, and businesses (laundromat to back-room casino)
  that pay out daily and cool your heat.
- **Scoreboard**: richest net worth and most days survived. The city gets meaner every day;
  retire to cash out, or die trying.

## Files

| File | What it does |
|---|---|
| `index.html` | The page. Loads everything from `/play/drug-wars/` on Kaotic Gaming, or from this folder on its own. |
| `data.js` | All the content and balance numbers: districts, prices, gear, crew, enemies, jobs, news. |
| `sim.js` | The rules, with no screen code. |
| `ui.js` | The screens. Saves to the player's Kaotic Gaming account (or this browser when opened on its own). |
| `art.js` | Every picture in the game, numbered. |
| `style.css` | The look. |
| `test.js` | Plays hundreds of games with a bot to check the rules: `node test.js`. |
| `IMAGE_PROMPTS.md` | Prompts for every picture, numbered to match the placeholders. |
| `tools/make-prompts.js` | Rebuilds `IMAGE_PROMPTS.md` from `art.js`: `node tools/make-prompts.js`. |

## Pictures

Every picture starts as a numbered **PLACEHOLDER** card. To add one, generate it with the prompt in
[`IMAGE_PROMPTS.md`](IMAGE_PROMPTS.md) and save it in `art/` under the listed file name
(`.webp`, `.png` or `.jpg`). The game picks it up automatically; no code changes needed.

## Playing it locally

Serve this folder with any static web server and open it, for example:

```bash
python -m http.server 8765
```

then <http://localhost:8765>. Opened on its own, it saves in the browser.

## On Kaotic Gaming

The site lists it in its `games.json` with `"source": { "repo": "EliteScouter/KG-DrugWars" }` and
downloads every push to `main` within a few minutes. When you change `style.css` or a `.js` file,
bump `ASSET_V` in `index.html` so phones fetch the new copy. Leaderboard keys it reports:
`bestNetWorth` and `bestDays`.
