# pkgEAK: DeepSeek K-W check for a seated alternate's cure answers (W2, 11-08)

DeepSeek enforcer fix. W2 3107 item 3; verified W3 3109 / W1 3110; lane 1 (c).

## Fault
Enforcer Build (the DeepSeek K-W/K-S3 check) runs after Panel Cure Check, before any alternate is seated, and reads only Panel Cure Normalize 1-3.
A seated alternate's K-W and K-S3 cure answers never reach DeepSeek: 27 of 27 seated alternates in 4 days have 0 K-W enforcer_check rows (33617 sol: 20 K-W + 6 K-S3 cure answers, 0 checks).

## Change (3 nodes)
- Alt Judge Enforcer Build (on pkgEKD = s59 staged): `eakItems2024()` adds one more DeepSeek call item, last, when the alternate has K-W/K-S3 cure rows in Alternate Merge Seat's enforcer_log. The prompt is Enforcer Build's own K-W builder, cut from live s58 byte for byte (pkgEKG rule text, pkgEST statements, ruling 424 blocks), with ids relabelled W<k>.<n> and the STATEMENT lines read from Alternate Cure Normalize. Every existing call item is unchanged.
- Alt Judge Enforcer Record (live s58): the 5 reply-id letter classes take W; K-W and K-S3 get tallies. Rows are kind enforcer_check, seat_role alternate.
- Alt Judge Enforcer Retry Build (live s58): its id letter class takes W, so a short K-W reply splits in halves like any call.
- Alt Send Back Build already drops K-W rows (ruling 445). K-S3 DISAGREE rows are sent back as for the panel (same filter).

## Shas
Alt Judge Enforcer Build 79898dee1307 (pkgEKD) -> e80c75967029; Alt Judge Enforcer Record adffc9d2d5f8 -> 2dfe1e7fd7dd; Alt Judge Enforcer Retry Build 68c48b595ed0 -> fc8637baa2c0 (plan_EAK.json). Stacks on pkgEKD; write after or with it.

## Test (node pkgEAK/test_EAK.cjs): 13 OK, 0 FAIL
- 24 saved runs: every base call item unchanged; a K-W item exactly where the alternate has K-W/K-S3 rows (13 runs), one id per row.
- 33617: the alternate prompt equals live Enforcer Build's prompt for the same 26 rows apart from the W labels (127,284 chars); same system text.
- Retry Build splits a short K-W reply into 2 halves holding all 26 ids. Record maps each W id to its own verdict and writes 26 alternate rows; on the saved calls (no K-W call) Record output equals live apart from two empty tallies.

## Notes
- 33430 and 33497 had alternate K-W rows (13, 24) but the whole alternate enforcer skipped there (je_skip, existing behaviour); EAK adds nothing on a skip.
- Row text ends "(judge wrote <form>; RECORD-ONLY TRIAL, ruling 428)" (the Record's shared suffix), where panel K-W rows end "(judge cure CURED; TRIAL, ruling 421)". Queries on "ENFORCER DISAGREE%" read both.
- Cost: one more DeepSeek call per run that seats an alternate (33617: about 32k input tokens), in the same batch as the other alternate calls.

## Live bar
A seated alternate's K-W/K-S3 cure answers have enforcer_check rows (sol 33617 would have 26); NO VERDICT 0 on them.
