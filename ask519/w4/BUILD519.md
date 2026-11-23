# ASK 519 build (W4, seat 35), to W3 plan519.md rev 2 (11628857). NOT written.

Base: W1's corrected ASK 517 targets, engine 8f2e7146 and child fc27892d (517 is written first).
Targets: target_engine_519.json (f62c817e) and target_child_519.json (6eb563eb). Library sha 41cc442e8fa215b5 -> 2b0e9f6717e2dadb, 3560 lines. Library Check OK on both. Patch: patch519.py (11fd3063).

## What changes
1. L2213 (K-W, in Panel Payloads, Alternate Payloads, R2 Alternate Payloads, Extract Independent Verdict). A grant-class sentence (grant, concede, admit, accept, agree) that names no link, premise or press is not raised. n still counts it.
   - Replaced: the old cap "if(pg && no id && gn++>=10) continue;", which raised the first 10 bare "I grant / I concede" sentences and skipped the rest without counting n.
2. L792 (K-S3, orcLines loop). A grant-class line that names no id and has no withdrawal-class verb is not raised. __k3 still counts it.
3. Nothing else. Only the Shared Library node changes, in engine and child. The node set, MAP p and connections are equal.

## Departures from the plan text (for the grader)
- D1. The id test also takes "[Ll]ink N", kept from the old cap.
- D2. S2's grant test skips the noun "grants" after my, his, her, their, our, its, the, these, those, of, no or any.
- D3. The old 10-grant cap is gone. Two effects show on the runs:
  - (a) Renumbering. Where a run had more than 10 bare grants, items after them take a higher #n under 519, because the old cap did not count the skipped ones. 41117: C1 "I do not claim the verb alone means 'beget'" was #12 and is #14. 41043: C4 and C5 items were renumbered the same way. In the replay, the recorded judge replies answer the old number, so these items show UNCURED, "no written response". A live judge answers the number it is given. This is a replay artifact, not a lost answer.
  - (b) One item is newly raised. In 41102, "[DR3] LINK 6: MEANS [CR3] P6.2: 'Joseph is of house and lineage of David' I grant it." names premise P6.2. The old cap skipped it as the 11th bare grant, because the old id test did not know P6.2. Under 519 it is raised, as the plan's "named grants stay raised" says. That is +3 on the panel seats and +2 on the alternate.

## C2: items per run (items519.js; sum519.py, with #n set aside; items519_4runs_summary.txt)
| run | node | K-W 517 -> 519 | K-S3 517 -> 519 | dropped | added | dropped that are withdrawal-class or name an id |
|---|---|---|---|---|---|---|
| 41024 | Panel Payloads | 36 -> 6 | 10 -> 4 | 36 | 0 | 0 |
| 41117 | Panel Payloads | 36 -> 12 | 15 -> 1 | 38 | 0 | 0 |
| 41102 | Panel Payloads | 33 -> 12 | 12 -> 3 | 33 | 3 (D3 b) | 0 |
| 41102 | Alternate Payloads | 22 -> 8 | 0 -> 0 | 16 | 2 (D3 b) | 0 |
| 41090 | Panel Payloads | 0 -> 0 | 8 -> 8 | 0 | 0 | 0 |
| 41090 | Alternate Payloads | 0 -> 0 | 2 -> 2 | 0 | 0 | 0 |
| 41043 | Panel Payloads | 45 -> 15 | 27 -> 8 | 49 | 0 | 0 |
Every dropped item is a grant-class sentence that names no link, premise or press. None is withdrawal-class.

## C2a: the readers (chain519.js: chain replay; each listed node runs on 517 and on 519; later nodes read the replayed output; model replies stay as recorded)
- Panel cure path, L2215, L1957, L1972 and L1270 (Panel Payloads -> Panel Check -> Panel Cure Build/Normalize 1-3 -> Panel Cure Check), all five runs, with the semantic compare (CMP=1) of every judge body field outside items, audit, drv and marks:
  - No difference in any verdict_raw field, standing, result or count. The only differences are AUDIT lines: the dropped items' lines, and the D3 lines. Files: chain519_<run>.txt (41024: 72 AUDIT lines; 41117: 88; 41102: 72; 41090: 0; 41043: 134).
- Alternate path, 41102 (Alternate Payloads -> Alternate Cure Build/Normalize -> Alternate Merge Seat -> Alternate Merge 1): no non-AUDIT difference. Gemini stays NOT SEATED for chatgpt, with the same REMOVED FOR line. Its uncured count reads 2 instead of 1, because the D3(b) P6.2 item has no recorded reply (chainA519_41102.txt). 41090 alternate path: no difference.
- L792 in Gate Build, Gate Record, Late Gate Build, Alt Gate Build, Alt Gate Record and Alternate Merge Seat: no output difference on any of the five runs where the node ran.
- L3208 (Alt Judge Enforcer Build) and L3401 (Alt Judge Enforcer Record): not replayed. Alt Judge Enforcer Build is not in the fetched node set. LIMIT.

## C3 (41117, known-good)
Still raised under 519, for each of the 3 seats:
- 2 withdrawal-class: "[DR3] LINK 6: I drop the clause 'and it names no man as sowing it'." and "[DR4] C1: I do not claim the verb alone means 'beget'."
- 2 named grants: "[DR3] LINK 1: MEANS [CR3] P1.1: ... I grant it." and "[DR3] LINK 4: MEANS [CR3] P4.2: ... I grant it."

That is 6 withdrawal-class and 6 named, as the plan says. K-S3 keeps "I keep that limb and nothing beyond it."

## Files (ask519/w4)
patch519.py, target_*_519.json, lib519.json, items519.js, sum519.py, items519_full_<run>.json, items519_4runs_summary.txt, chain519.js, chain519_<run>.txt, chainP_<run>.txt, chainA_<run>.txt, chainA519_41102.txt, libcheck/. Run data: ask517/w4/<run>_part1..8.json (fetch 2) and full_41024.json.
Write: after 517 is written, on the operator's card in W4's thread. Revert: the 517 targets.
