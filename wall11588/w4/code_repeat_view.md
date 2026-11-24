# Wall 11588: code-side view (W4). Which builds touched the same code more than once.

Source: every W4 write folder that holds a pre-write copy (revert) and a fetch-back of the engine or child, 44 written ASKs (ASK 502 to ASK 595 and the 591 fixes). The changed nodes come from comparing each pair. Shared Library changes are mapped to the function they fall in. Writes before ASK 502 have no such pair in the folders, so this view covers about the last 3 days of writes, not all 8.

## 1. The Shared Library changes in almost every write
- 28 of the engine writes and 30 of the child writes change it. That is expected: it is the one copy of the gate, cure and send-back code.
- Inside it, 67 functions were touched. Most were touched once. The repeats:
  - LAY (reads a verse's layer tag): 7 builds (557, 559, 561, 562, 566, 581, 587). Each added tag forms the last one did not read ("five more tag forms", "against heads", "whatever the position of its layer tag"). This is the clearest repeat: one reader extended piece by piece as runs showed new forms.
  - __RD (the request reader): 6 (523, 527, 531, 586, 587, 590).
  - sbApply2024 (applies a send-back): 5 (517, 531, 549, 586, 587).
  - acx531Norm (closing-check normalizer): 5 (531, 586, 590, 595, plus one fix).
  - cureSafe and cureRecompute (the cure test): 4 each (517, 533, 547 or 586, 587).
  - MAX, body (the request size limits): 3 each (531, 586, 590); ASK 595 then removed the cuts these set.

## 2. Engine nodes touched three or more times
- Build Save Body (the run's review notes): 6 (550, 556, 559, 563, 573, 591). Each added a record line for a new feature; one (591 fix 1) took a line back out.
- The Oracle round builders C1B to C4 and D2 to D4 with their B and Extract nodes: 3 to 5 each (524, 537, 557, 559, 561, 570, 576, 593). These were rewritten in groups: 557 and 559 (layer rules), 570 (the merged write), 593 (Haiku out).
- Accept Build and Init Seats (the seat lists): 4 and 3 (502, 575, 584, 591, 593). Each is a seat change (a model added or removed, then the table read).
- Build Independent Verdict and Panel Build (the judges' text): 4 and 3 (586, 590, 593, 595).
- Alt Reread Record (engine and child): 3 (516, 523, 587).
- Assume Check Record: 3 (524, 531, 532). Init with Guards: 3 (537, 557, 564). Format Markdown: 3 (550, 573, 593).

## 3. Reading of the pattern (code side only)
- True repeats, the same defect class coming back: LAY's tag forms (7 builds), and the cut lengths (MAX/body, then 587 and 595 removed cuts the earlier builds had set).
- Same place, different features: Build Save Body, the Oracle builders, the seat lists. These are new features landing in shared places, not the same fix redone.
- Fixes of my own fixes, written live and then corrected the same day: 590 then 595 (the 1,500-character cut that 590 itself kept), 591 then fixes 1 and 2 (single judge, the save that the API guard refused).

## 4. Against W3's root causes (Wall 11589)
- Root cause 1, lists and limits typed into several places. The code confirms it:
  - Seat lists: the same seat and family facts stand in Init Seats (ORDER0, __ALT, FAM_PANEL, the JFAM lists), Resolve Seats, Accept Build, the single-judge builders, Format Markdown, and the database functions odv1_record_panel_alternates and odv1_record_panel_substitution. Every seat change (502, 575, 584, 591, 593, 594) had to touch several of them. ASK 591 moved the order into one table, but its line-up preview (dash_judge_lineup) still holds its own copy of the family map and the OpenRouter seat list. That is one more copy, and it was found today when the preview showed the Sonnet case.
  - Limits: the request size limits (MAX, body) were set in 531 and changed again in 586 and 590. The cut lengths are typed 139 times in the live engine (ASK 597's count), and 587 and 595 each removed some of them.
- Root cause 2, checks that read free text by pattern. The code confirms it:
  - LAY: 7 builds, each adding tag forms that a run had shown.
  - The cure test (cureSafe, cureRecompute): 4 builds each.
  - The closing-check normalizer (acx531Norm): 5 builds.
  - J3 adds one more pattern reader of the same kind (the grant harvester), so the same exposure is now live there.
- A chain W3 may have missed: test conditions that differ from live. Two of today's faults passed every offline test and failed only live: the safeupdate guard on the API role (591 fix 2), and the production alias not moving on deploy (591 F4). Tests ran in a setting the live path does not use. That is a third root cause, on the build side.
