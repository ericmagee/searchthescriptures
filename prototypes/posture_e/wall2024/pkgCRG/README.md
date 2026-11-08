# pkgCRG: the engine's recounted CONCEDED LINKS line names each premise with its ground (W3 3087 ruling 1)

A library and record change (LIB v16_D38 -> v17_CRG, plus Build Save Body). It does not change the DeepSeek enforcers, so it rides with a gap's graded DeepSeek fix. It stacks on W2's pkgD38 (LIB v16_D38), which must be written first or with it.

## Fault (33592 grok)
- The cure's "CORRECTED COUNT DEFENDER 3" made the engine rewrite grok's line as "CONCEDED LINKS: 3 -- recomputed after the cure from the cured lines (CORRECTED COUNT DEFENDER 3)". That line names no premise and no ground.
- The grounds were in the record: premise 2 is D2 vs C4 DEFENDER LINK BROKEN (K-G7), premise 5 is D5 vs C5 DEFENDER LINK BROKEN (K-G7), and LINK 6 is UNEXHIBITED, from grok's own line before the cure ("CONCEDED LINKS: 1 -- LINK 6 UNEXHIBITED (ASSUMES) ...").
- pkgCLR's stored split read the rewritten line as granted 0, unexhibited 0, unnamed 3.

## Change
1. cureRecompute (Shared Library, in the 19 nodes that run it): when the engine rewrites a count line with no restated line to copy (a CORRECTED COUNT, or a line whose number disagrees with the fields), and the count is above 0, it adds " -- grounds: ...". The grounds are:
   - each K-G1/K-G7 item of that side, CURED, whose collision is still graded the side's LINK BROKEN, written as "premise n BROKEN AT THE COLLISION Dn vs Cm (K-G7)";
   - then "before the cure, k: <the judge's own line after its number>", copied word for word, when the cure did not lower the count.
   - When the grounds do not add up to the count, it says so: "(the grounds number k, the count n)". When the cure lowered the count, it says "(the cure lowered the count from k and does not say which premises it keeps)".
2. __CSP (pkgCLR stored split, in Build Save Body and Alternate Merge): "premise n BROKEN AT THE COLLISION" is its own class, broken_at_collision (with broken_items), and no longer falls into unnamed. Readers other than __CSP are untouched: "BROKEN" is not a CLR or cntItems tag, so the KSC copies and the K checks read these entries as before.

## Test (node pkgCRG/test_CRG.cjs): 5 OK, 0 FAIL
- 431 library node runs (35 do not run in base either). 22 differ, all only in the grounds clause and the two new zero split fields; no other byte changes.
- Lines with grounds: 33592 grok "CONCEDED LINKS: 3 ... grounds: premise 2 BROKEN AT THE COLLISION D2 vs C4 (K-G7); premise 5 BROKEN AT THE COLLISION D5 vs C5 (K-G7); before the cure, 1: LINK 6 UNEXHIBITED (ASSUMES) ...". 33249 (CORRECTED COUNT CHALLENGER 1, lowered from 3): "grounds: the cure names none (the cure lowered the count from 3 and does not say which premises it keeps)".
- 33592 grok split: unexhibited 1 (link 6), broken_at_collision 2 (premises 2 and 5), unnamed 0 (base: unnamed 3).
- The pkgD38 BASIS check is not affected: "BROKEN AT THE COLLISION" is not one of its CONCEDED/UNEXHIBITED/WITHDRAWN grounds, and each ground is separated by ";".

## Build and pack
- node pkgCRG/build_CRG.cjs -> pkgLIB/strip_CRG/patched (22 full sources, 19 changed), pkgCRG/patched/Build_Save_Body.js, plan_CRG.json.
- Pack: node pkgLIB/pack.cjs <pkgLIB_v16_D38 base list> pkgLIB/strip_CRG -> pkgLIB_v17_CRG (Shared Library json_sha b58afd97f0ebb363, 2120 lines). All 22 stubs rebuild their strip_CRG source byte for byte.
- Build Save Body: base = live s57/s58 95b107bb2b3f -> 0cccca27dab7.

## Not in this package
W3 3093 item 3 (K-G7 offers no CORRECTED COUNT cure when the collision line records an answer). That is the next engine item; this package only records the grounds.
