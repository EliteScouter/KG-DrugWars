# Drug Wars

A neon-noir trading and crime game for [Kaotic Gaming](https://kaotic.strictgaming.com), built for phones first.

You start in Vice Harbor with $2,000, a baseball bat and a $5,500 debt to Vinnie the Shark.
Buy low, travel, sell high, and grow from a corner hustler into the King of Vice Harbor:

- **9 districts**, each with its own prices, cops, gang and shops.
- **12 products**. Better product needs more **rep**: nobody deals Cocaine with a Nobody.
- **Real markets**: big orders move the price, and it recovers over a few days. Spread your loads
  across districts, sell where it's your turf, and watch the news for spikes and crashes.
- **Carrying**: coats, 9 vehicles (moped to cargo plane) with crate slots, crates that get pricier
  the more you own, and **safehouses** in every district (raided when your heat is high).
- **Heat** that matters: beat cops, Detective Kane, the Narcotics Squad, SWAT, then the Feds.
  Each tier is harder to beat, harder to outrun and pricier (or impossible) to bribe. Beat the cops
  and a manhunt follows. A crooked lawyer, a judge and the Chief of Police can be bought.
- **Fights** sized to give you a real fight whatever your crew: fight, run, bribe, pay up, give in,
  or use med kits, molotovs, grenades and smoke. You only die if your whole side goes down.
- **Crew**: Muscle, Shooters, Wheelmen, Medics, Smugglers and Fixers who earn stars as they win.
- **16 weapons** (daily gun-runner stock, plus custom and military pieces on the Black Market) and 5 armors.
- **Jobs** with fixed, visible odds: corner crews up to the First Harbor Bank and the mob's counting room.
- **Turf wars**: take districts from six families, collect daily tribute, defend them, then take
  down each family's boss. Own all nine and take the throne.
- **The Fixer**: delivery, smuggling and hit contracts.
- **The Strip's casino** (roulette), businesses up to a shipping line, and luxuries: a penthouse,
  a racehorse, a private jet and a private island.
- **Scoreboard**: richest net worth and most days survived (season 2 started the records over).

## Files

| File | What it does |
|---|---|
| `index.html` | The page. Loads everything from `/play/drug-wars/` on Kaotic Gaming, or from this folder on its own. |
| `data.js` | All the content and balance numbers. |
| `sim.js` | The rules, with no screen code. |
| `ui.js` | The screens. Saves to the player's Kaotic Gaming account (or this browser when opened on its own). |
| `art.js` | Every picture in the game, numbered. |
| `style.css` | The look. |
| `test.js` | Plays hundreds of games with a bot to check the rules and measure the balance: `node test.js [games] [days]`. |
| `IMAGE_PROMPTS.md` | Prompts for every picture, numbered to match the placeholders. |
| `NEW_IMAGES_V2.md` | Just the pictures added in v2 (78 and up). |
| `tools/make-prompts.js` | Rebuilds both prompt documents from `art.js`: `node tools/make-prompts.js`. |

## Pictures

Every picture starts as a numbered **PLACEHOLDER** card. To add one, generate it with its prompt and
save it in `art/` under the listed file name (`.webp`, `.png` or `.jpg`). The game picks it up
automatically; no code changes needed. New pictures are always added at the end of `art.js`, so
existing numbers and files never change.

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
`richest` and `mostDays` (season 2; the season 1 keys were `bestNetWorth` and `bestDays`).
