# pkgUNXL: K-UNX on a false lack inside an ASSUMES or ROWS GIVE count (W1, from run 33289)

## What happened (33289, grok, debate_judgments 1031): an Oracle concede
1. grok spared all six defender premises.
2. E-PREM (DeepSeek) pushed "(right: COUNTED)" on premise 6 with its own phrase "apart from David's loins". pkgEPK fired and added the K-UNX count rule.
3. grok adopted the push in send-back S1: "premise 6 UNEXHIBITED (the block exhibits [L1] Luke 1:32 and [L2] patēr and lacks [L1] for a gift apart from David's loins ...) ... ASSUMES: the throne's gift comes by a road apart from David's loins -- ROWS GIVE: \"the Lord God shall give unto him the throne of his father David\" ...".
4. The [CR3] LINK 6 block shows [L1] Luke 1:32, [L2] patēr, [L3] Jeremiah 22:30 and Matthew 1:12, and [L4]. It also answers Acts 2:30 under its pressed witnesses: "the flesh descent is David's ... through the woman".
5. The count says the block lacks [L1], which the block shows. Stored: defender conceded 1 (c=1), PROP-DEPENDENT.
6. No reader caught it:
   - The count has ASSUMES and ROWS GIVE, so K-UNX sends it to the K-UNX-A path (unxaCheck).
   - unxaCheck passes an ASSUMES ground whose clause quotes the block's [L1], and the ROWS GIVE quotes Luke 1:32.
   - The `continue` that follows skips the plain K-UNX lack test.

## Change (TRIAL, raise only; no change refused and no count written, per W3 2747)
- **Where:** in kunxLines, after the K-UNX-A test, for a premise whose count did not raise K-UNX-A.
- **Read:** each count segment of that premise with unxLack (the UNXW2 lack reader), against the block's layers (lbFoot, full block).
- **Raise** a plain K-UNX item when all three hold:
  - the block shows 2 or more layer kinds;
  - the count names at least one layer as lacking;
  - every layer it names as lacking is one the block shows. A named [L4] always reads as missing, as in UNXW.
- **Item line:** the plain K-UNX line ("Name the missing layer ... or write a CORRECTED COUNT ... grade its fit at the collision").
- **Cure:** the plain K-UNX cure (unxLack on the STATEMENT, UNXW2).
- **Nodes:** the 22 kunxLines nodes. The 3 raise-only nodes (Extract Independent Verdict, Panel Payloads, Alternate Payloads) had no unxLack, so it is copied byte for byte from Gate Build.
- **Base:** live s31 (fetchback_live_s31.json). Shas are in plan_UNXL.json.

## Tests: `npm ci --prefix pkgEPK` once, then `node pkgUNXL/test_UNXL.cjs` gives 22 OK
The U tests run kunxLines from patched Gate Build and Panel Payloads, against base:
- **U1:** grok's stored count raises nothing on base. On patched it raises one item: lack [L1], kinds L1, L2, L3.
- **U2:** "lacks [L4]": no item.
- **U3:** an ASSUMES ground that names no lacking layer: no item on either. K-UNX-A is unchanged.
- **U4:** a block of [L1] and [L2] only, with the count "lacks [L3]": no item.
- **U5:** "lacks [L3]" on the full block: one item.

Parity and identity:
- **P:** Panel Payloads on 33197, 33218, 33222, 33249 and 33261, and Panel Cure Check on 33218 and 33249, equal base.
- **G:** every base equals live s31, every final matches the plan, and the copied unxLack equals Gate Build's.

Stored screen (SQL over debate_judgments for the last 12 days): a count with 1 or more, a "lacks [L1-3]" phrase, and ASSUMES or ROWS GIVE. Only one judgment matches: 1031, this case. This is a pattern screen, not a full replay.

Fixture: fixture_33289_grok.json. It holds grok's final count lines and the [CR3] LINK 6 block from debate_results.engine_r3. Links 1-5 are stub headers.

## Write and revert
- Write: replace jsCode with patched/<node>.js.
- Revert: base/<node>.js.
