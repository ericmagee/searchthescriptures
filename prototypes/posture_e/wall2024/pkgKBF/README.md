# pkgKBF rev 1 (W1): bold verse label closed before its comma

Stacks on pkgKBN. RECORD-ONLY (enf428Cure, ruling 428). Changes the 3 Send Back Record nodes only (Send Back Record, Alt Send Back Record, R2 Alt Send Back Record).

**Limit (pkgKBN W1 grade, case K2).** `- **On Job 14:1**, I grant the phrase covers kings named by their fathers.` was not read as a grant: `__lm` takes the opening `**` off, but the verse-label pattern allowed emphasis marks only after the comma (`[.:,]?[*_]*`), so `On Job 14:1**, ` stayed. A KEEP quoting only that grant read CURED.

**Fix.** In the verse-label pattern of `__lm`, `[.:,]?[*_]*` becomes `[*_]*[.:,]?[*_]*`. Plus one marker comment. No other change.

**Build.** `node pkgKBF/build_KBF.cjs <base carrying pkgKBN> <out>` refuses unless each node has pkgKBN, lacks pkgKBF, and each edit hits once. Current output `parent_s100_KBN_KBF.json` is built on `pkgKBN/parent_s100_KBN.json`. When pkgKBN (and anything written before it) is live, rebuild on that fetch-back.

**Checks (labels fixed before the run, commit 2e3ecc32).**
- `cases.json` (13 cases B1-B13, bold forms plus 4 CURED controls): 13 of 13 as labeled; pkgKBN reads 6 of the 9 UNCURED cases CURED (B1, B3, B4, B5, B9). `run_cases.txt`.
- pkgKBN W1 cases (`cases_KBN.json`): 14 of 16, K2 now right; K10 and K14 remain (not lead-ins this fix touches). `run_cases_KBN.txt`.
- W2's pkgKBN plants, live against KBN+KBF: 25 OK, 0 FAIL. `plant_KBN_on_KBF.txt`.
- W3's pkgKBN plants: the same 2 known misses as pkgKBN, nothing new. `w3_plant_KBN_on_KBF.txt`.
- Replay of every stored run, KBN against KBN+KBF: 42 runs, 0 rows differ. `replay_KBF.txt`.
- Rolled-back insert (B1 UNCURED, B10 CURED rows): {"rows": 2, "recorded": true}. `rollback_KBF.sql`.

Run: `node pkgKBF/run_cases.cjs` (BASE, CAND, CASES env to override).
