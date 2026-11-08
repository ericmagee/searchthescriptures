# pkgFCW: the FORCED line that cures a K-G4 item in the cure is written into the judge's text (D32 part 1)

W3 3174, W2 (a); the fault is W3 3067 (grok 33506 E-APPLY S9-S11, false NOT APPLIED). Library layer on pkgLIB/strip_RI2. It is not a DeepSeek fix, so it rides with one.

## Fault (reproduced on the harness, 33506)
- In the cure, K-G4 on D2, D3 and D6 vs C5 is CURED with "forced link: a FORCED line for Dn vs C5 (ruling 411)", read from grok's cure reply.
- cureLines files a FORCED line as prose, because CURE_KEY has no FORCED. So the line never enters the judge's text. It survives only inside "[AUDIT v21: ... prose recorded, not read for a cure: ...]".
- Send-back S9-S11 flag that FORCED line, with CHANGE TO "RETRACTED: Dn vs C5". sbApply2024 finds no such line, so the result is NOT APPLIED, "the flagged line is not in the judge text".
- The gate already writes its own curing FORCED line after the collision line (gateForced2024 forced_add, ruling 411). The cure path had nothing like it.

## Change
- cureForcedAdd2024 is added to the library (19 nodes carry the definition).
- In the three cure merges (Panel Cure Check, Alternate Merge Seat and Cure Check), before the recompute, it writes each such FORCED line into the judge's text right after its collision line.
- It writes each line once. It skips a line the text already holds, and a collision line that is not found exactly once.

## Behaviour (test_FCW.txt, 4 OK)
- Replay over every saved run (8 old runs are skipped because the base node itself fails on their saved inputs). 14 seat texts change.
- Every change is FORCED lines inserted. Nothing is removed, and no other output field changes.
  - Panel: 33060 sol 1, 33083 gemini 5, 33083 chatgpt 1, 33149 chatgpt 1, 33149 sol 1, 33222 gemini 5, 33261 gemini 5, 33506 grok 3, 33592 gemini 3.
  - Alternate: 33461 grok 2.
  - Single: 33222 5, 33261 4, 33371 5, 33644 5.
- 33506, downstream: Gate Build fed the FCW texts. The grok S9-S11 "not in the judge text" refusals go from 12 to 0.
- Not yet replayed: the downstream effect in the other 13 texts. The FORCED lines are now visible to the gate's K-F read, to Send Back and to the DeepSeek E-COL item. That is intended (ruling 411: the FORCED line stands beside its collision line), but it is unmeasured.

## Write
- pkgLIB_v21_FCW = v20_RI2 + strip_FCW. All 22 stubs rebuild. Shared Library b23f6a8053ce -> 966ddb6aef6f.
- Revert: pkgLIB_v20_RI2 (or v19_GDA if RI2 is not written).

## v2 (W3 hold: 33592 gemini D6 vs C4)
- Cause: pkgRFL keeps a FORCED line while its pair's collision line is still LINK BROKEN, but it runs before the keystone and contradiction checks. In 33592 gemini, S6 regraded D6 vs C4 (Hebrews 7:14) to UNDERDETERMINED and S9 retracted its FORCED line. The keystone check then refused S6, so the line was BROKEN again, but S9 stayed applied. The gate re-read raised a new K-G4.
- Fix: sbApply2024 runs the RFL check again after those refusals (6 gate nodes). S9 now reads NOT APPLIED, "the collision line of D6 vs C4 is still graded CHALLENGER LINK BROKEN (its change was not applied), and a broken link keeps its FORCED line".
- W3's gate replay (gate_replay_v2.txt): there is no new K-G4 anywhere. 33592 gemini S9 is NOT APPLIED with the true reason; base gave the false "not in the judge text". test_FCW gives 4 OK.
- LIB v21_FCW is repacked. Shared Library 966ddb6aef6f -> f7b5a48fe7f1. 22/22 stubs rebuild.
