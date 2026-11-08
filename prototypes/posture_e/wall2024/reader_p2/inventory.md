# Reader phase 2 completion: inventory of judge-text reads outside the shared reader

W2 (session_01H1X3AMSmHoLYeowLik4uwT), 2026-11-07. Eric approved the track at 16:50 CST (W2 thread; Wall 2983 to 2987).
Base scanned: live s50, 0247fc93 (`/mnt/project-files/wall2024/fetchback_live_s50.json`), the 22 library stubs rebuilt with `pkgLIB/unpack.cjs`.

This is a first pass for W3 to order. Building waits for W3's order (Wall 2985).

## Method

`inventory_scan.cjs` parses every Code node with acorn. For each regex literal whose pattern names a judge-line keyword (KEYSTONE, RESULT, FORCED, ANSWER CHECK, MEANS, CONCEDED LINKS, CHAIN MARK, RESTATED and so on), it records the node, the enclosing function and whether that function calls `readLine`/`readLines`/`__RL`. Regexes inside the `__RL` reader itself are left out. The full machine list is `inventory_raw.tsv`, with one row per tier and function and every regex in it.

Tiers follow W3's order:

- **1-seat.** Cure, Panel Cure, Gate, Alternate and Send Back nodes, Extract Independent Verdict and Panel Payloads. These reads can leave an item UNCURED or remove a seat.
- **2-deepseek.** The Judge, Alt Judge and main Enforcer Build, Record and Retry nodes.
- **3-audit.** Format Markdown, Build Save Body, Failure Salvage and Replay Rows.

Debater-round nodes (C*/D*, Lexicon, Citation Scan and Quote Report) and the prompt builders are out of scope.

Kinds:

- **form:** a spec line form is read by its own regex.
- **field:** a quoted field inside a line (MEANS, ANSWER, FAILS, GROUND). This is the pkgMNQ and KFN class.
- **labels:** a hand list of labels. This is the pkgKCR class.
- **prose:** a test on free judge wording (grant, concede, "no answer"). Prose is not a line form, so the reader cannot replace it. Prose functions are listed in the raw file but are not candidates.

## Limits of this pass (read before ordering)

1. The scan sees regex literals only. Tests made with `includes`, `startsWith` or `indexOf` on label strings are not listed yet. A second pass for those is the next step.
2. Function names are grouped by name. `check`, `block` and `cure` exist in more than one node with different bodies, so the node list on each row matters.
3. Some library "field" reads take the debater's own MEANS (pressed-verse ledgers), not judge text. Rows marked *verify* below need a look before ordering: `parse`, `tags`, `unxPresses`, `unxaCheck`, `sub`, `presses`, `harvest`, `blocks` and `kfcVerse`.
4. Some rows read engine-written text, such as AUDIT tags or SEAT/ITEM records, not judge text. These are excluded below as not judge text: `rctOut`, `curedTo`, `drvRead`, `cureSafe`, `cureSet` (the "takes the premise out" phrase), `respOf`, `res`, `__FK`, `flagKey` and `noDiagTags`.

## Counts (functions, by tier)

| Tier | Candidate reads (form, field or labels), own regex | Already use the reader | Prose only |
|---|---|---|---|
| 1-seat | 58 | 4 (cureLines, rcLines, selfLines421, readLine callers at top level) | 65 |
| 2-deepseek | 15 | 0 | 12 |
| 3-audit | 11 | 0 | 8 |

"Already use the reader" means the function calls it somewhere. Some of these still carry their own regexes beside the call. `cureLines`, for example, holds the LAB label list that pkgKCR patched.

## Tier 1: seat-counting reads, grouped by line form

These groups are W2's grouping for ordering. Each lists the functions (node count) that read the form with their own regex.

**ANSWER CHECK** (pkgACR moved kagRow, selfLines421 and the gate line key; these stayed outside it):

- `gateAnsGround2024`, `ac`, `dptCheck` (6, the Gate and Alternate Merge Seat nodes).
- `kagRow0` (22).
- `claims` and `cure` (4, the Send Back nodes; part of pkgMNP).
- `enf428Cure` (2, Send Back Record).
- Field reads inside the line: `dptCheck` reads MEANS lazily up to `-- ANSWER:`. `claims` still uses the old MEANS pattern `(["“]?)([^"”]*?)\1`, the one pkgMNQ replaced in `cure()`. `cure()` calls `claims(a.to)`, so one CHANGE TO is read by two different MEANS rules. `enf428Cure` reads `MEANS:\s*["'“‘]([\s\S]*`.

**FORCED** (pkgKFR moved the KF_LINE constant only):

- `gateForced2024`, `id` and `sideOf` (6).
- `kfLines`, `kffLines`, `kfcLines`, `kfcVerse` and `pairOf` (22).
- `cureVerdicts` (19).

**KEYSTONE:** `keyChecks` and `sbBrokenWord2024` (6); `kkLines` and `krulRulings` (22).

**CONCEDED LINKS / STANDING:**

- `lineOf` (19) and `psGrades` (21).
- `__kg1lCount` and `gateCure2024` (6).
- `ciCountSection` (22).
- `drvCountLine` and `drvBroken` (3).
- `block` (Extract Independent Verdict and the Send Back nodes).
- `charges` (4).

**RESTATED / RETRACTED / RESULT / COLLISION:**

- `krulRestated` (22).
- `sbApply2024` (6): RESULT, `COLLISION D\d+`, `RETRACTED: Dn VS. Cn`.
- `sbLabel0` (6): the old label list kept beside pkgSBR.
- `lab` (19): a label list.
- `kcmtGrade2024` (22).
- `cureRecompute` (19).

**CHAIN MARK:** `netLines` (22); `k2Marks` and `postureBlock` (2; also a section-label list).

**STATEMENT / RESPONSE:** `kconUnlabel` (22).

**Top-level code** in Extract Independent Verdict (lines 31, 32 and 564 to 708 of the rebuilt source): KEYSTONE, CONCEDED LINKS, COLLISION POINTS, the CHAIN MARK and OUT-OF-ROUND section reads. These feed the verdict fields, so they rank high inside tier 1.

## Tier 2: DeepSeek enforcer reads

All are in the Judge and Alt Judge Enforcer Build and Record nodes unless noted:

- **Quoted-field reads of the MNQ class.** `failsNote` reads `ANSWER [..]: "([\s\S]*?)" -- FAILS:` and `FAILS: "([\s\S]+?)"`. `efgCheck` reads `MEANS [..]: "([\s\S]*?)" -- ANSWER`. A quote inside the field ends the lazy match early.
- **ANSWER CHECK:** `acRound`, `acUnp` and `__acG`.
- **FORCED:** `__ecfColl`, `__ecpK` and `__ecpOf`.
- **CONCEDED LINKS / STANDING:** `g` (the pkgEPL fan-out, 4 nodes including the Retry Builds) and `stand`.
- **Main Enforcer Build:** `__estOf` reads the `STATEMENT: K-W|K-S3 ... | ...` line.
- **Labels:** `eawBlockMeans`, and `why` (the ENFORCER reply labels).
- `eaxHold` mixes an ANSWER CHECK read with prose.

## Tier 3: audit and display reads

- Format Markdown: `beforeCure`, `seatReason` and the RESULT, CLAUSE and KEYSTONE reads.
- Build Save Body: `block` and the top-level reads.
- `closeLabels` and `press`: ANSWER labels in debater text, *verify*.

These change no count. They go last.

## Proposed next steps (W3 orders)

1. W2 runs a second pass for string-method label tests and settles the *verify* rows.
2. W3 orders tier 1. W2 suggests starting with the ANSWER CHECK MEANS field, because `claims`, `cure` and `dptCheck` read one field three ways, and it is the pkgMNQ class that removed a seat live in 33461.
3. Each swap is built on the exact live base and stacked on that gap's DeepSeek fix. Library reads ship only as a full LIB repack. There is one swap per gap, each with a corpus replay and a listed behaviour change (W4, Wall 2984).

## Second pass (W2, 2026-11-08): string-method label tests, and the *verify* rows settled

Base: live s59, d18a8882 (`fetchback_live_s59.json`), with the library stubs rebuilt. Scan: `inventory_scan2.cjs`, output `inventory2_raw.tsv`. It covers every `includes`, `startsWith`, `endsWith`, `indexOf`, `lastIndexOf`, `split`, `replace` and `search` call, every `===`/`!==` and every `case` whose string literal is a judge label or grade (the `__RL` reader itself is left out). The scan finds 2267 tests, which collapse to 157 distinct (function, test) rows in 55 functions.

**Comparisons (`===`, `!==`, `case`): 152 rows, no new reads.** Each one compares a value that was already read, either a regex capture listed in the first pass (for example `m[2]==='WITHDRAWN'` after the KEYSTONE regex) or a reader field (`R.form==='CORRECTED COUNT'`, `z.grade==='DEFENDER LINK BROKEN'`, `psGrades(t).g[n]==='COUNTED'`). None tests a raw trimmed line against a label. Such a comparison moves with the read that feeds it.

**Raw-text string methods: 5 rows. Four are judge text and one is not.**
| function | test | text read | item |
|---|---|---|---|
| `kcmtGrade2024` | `.lastIndexOf('ANSWER:')` on an ANSWER CHECK line | judge line, ANSWER field cut | 5 (already listed by its regexes). The ANSWER cut is a **field** read of the item 1 class and should move onto the reader's ANSWER CHECK fields when item 5 is built. |
| `colState` (Extract Independent Verdict, 3 nodes) | `.includes('WITHDRAWN')`, `.includes('DEFENDER LINK BROKEN')` on the colMap text | judge collision lines | **2, new row** (not named in the first pass) |
| `respOf` (19 nodes) | `.includes('STANDING')` and `.includes(side)` on the STATEMENT/RESPONSE label | judge cure-reply labels | **8, moved.** The first pass wrongly excluded `respOf` as engine text. It reads the judge's own RESPONSE/STATEMENT labels, so it is a labels read of item 8. |
| `(top)` Panel/Alternate payload nodes | `.includes('CITATION CHECK')` on the request body | the prompt we send | not judge text, excluded |

**The *verify* rows are settled.**
- Debater text, out of scope (the round texts or the debater's press ledger, not a judge line): `parse` (press-list entries), `tags` ([L2] tags in rounds), `unxPresses` and `harvest` (the debater's UNSUPPORTED-L4 PREMISES list with PRESSED WITH rows), `unxaCheck` and its `sub` (the debater's own block), `presses` (CR/DR round lines), `blocks` (round blocks, fed by `harvest`), and `closeLabels`/`press` in Build Synthesis (cr4/dr4 close rounds).
- Judge text, stays in place: `kfcVerse`. It reads the verse reference at the head of a FORCED line's MEANS field, with a fallback search in the rounds. It stays in item 4.

**Effect on the order.** Item 2 gains `colState`. Item 8 gains `respOf`. Item 5's `kcmtGrade2024` gains an ANSWER field cut. Nothing moves between tiers. The precondition for item 2 in W3's order (second pass done, verify rows settled) is met.
