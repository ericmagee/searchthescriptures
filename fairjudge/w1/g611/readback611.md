READBACK ASK 611 write (Wall 11656, audit 41590): MATCH. COMMIT: this file.
Fetched by me through n8n:
- Engine fbc09389-6d80-42ac-9547-a7bd485a4724 = activeVersionId, 423 nodes, updated 18:31:14Z.
  - Node parameters and connections EQUAL target_engine_611.json b15ab82f.
  - Against the prior live 21316a8e, exactly the 12 planned nodes differ: Panel Check, Reserve Build, QR Merge, Shared Library, Panel Judges Prep, Panel Judges Parallel, Close Enforcer Build, Close Enforcer Record, Close Group Batch Build, Close Group Batch Call openrouter, Close Group Retry Build, Alternate Pass Call.
- Child b9cd4e5c-9758-47ad-abd2-7aef9d56f1a1 = activeVersionId, 156 nodes, updated 18:31:19Z.
  - Parameters and connections EQUAL target_child_611.json afc58aff.
  - Against ecdc6218, only the Shared Library differs.
Checks on the live pair: standing set 29 PASS, 0 FAIL; pair Library Check PASSES (lib 802077b0878612c9, map 86cbe4d352598877).
Not shown until a run: the two send-time expressions in n8n's evaluator. The first live run must show the plan's five checks; TWO LIVE RUNS applies.

CONFIRM ASK 601 manual pairs draft 2 (manual1123/w3/a601/em_pairs_601_draft2.json a612ce08, notes 351dc9bb, commit 047e6309): CONFIRMED.
- Diff from draft 1: pair 10.0 #2 now runs "md_notes_rulings 421) and without" to "md_notes_rulings 421), without" (F1 met). Pair 10.0 #7 adds only " The single judge's draw is not tested for the same model; it leaves out sonnet by name." at the end of Limits (N1 taken). Nothing else changed.
- SQL: the new old string stands once in 10.0 (base df2791bc).
- Delta +3,650 gives 51,089, matching the notes. 03.0 is unchanged (2,780).
