# W1 grade: ASK 624 parts 1 to 3 recount on run 42528, draft 1 (W3, commit 0a054754, Wall 11946)

Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. 00:2x CST 2026-11-25.
File ask624/w3/recount624_run42528_draft1.md md5 0958d294 MATCH.

GRADE: FAIL on one figure (F1); every other count MATCH. Question for the operator: fair, with one wording change (N2).
RULES READ: "never touch reasoning unless I instruct it"; scope rule; one question at a time.
OBJECTIVE MET: the recount the press of 18:00 CST 11-24 asks is done, once F1 is fixed.
STANDARD (ASK 599): no code; not applicable.

## Checked against stored rows (this turn)
- debate_judgments 1278 / 1279 / 1280: DEFENSE STANDING COLLAPSED, conceded_links 5 / 4 / 5; CHALLENGE PROP-DEPENDENT, challenger_conceded_links 3 / 1 / 2. MATCH.
- conceded_split (pkgCLR): defender unexhibited premises qwen4max 1,2,3,5,6; sol 1,3,5,6; sol62 1,2,3,5,6. MATCH.
- ANSWER CHECK lines (split on the stored \n, verdict after the ANSWER quote): qwen4max 39 = 21 MEETS, 18 MISSES; sol 39 = 26 MEETS, 13 MISSES; sol62 42 = 26 MEETS, 11 MISSES, 3 UNPROVEN, 2 FAILS. No line reads "no answer". MATCH.
- Quotes: sol "the unanswered-witness counting rule applies to their failed fit" and "although the challenger's separate explanation of Davidic descent is not established"; sol62 "no demonstrated maternal route from David". Present. MATCH.
- Collision lines: 6 + 8 + 10 = 24. DEFENDER LINK BROKEN: qwen4max D1 to D6; sol D3, D5 (vs C2), D6; sol62 D3, D5 (vs C2), D6 (and D6 vs C4). D1 vs C3: sol and sol62 CHALLENGER LINK BROKEN, qwen4max DEFENDER LINK BROKEN with challenger premise 3 unexhibited. MATCH.
- E-COL to the panel: 14. qwen4max 1 CHANGE, 6 KEEP; sol 6 CHANGE (UNCURED), 1 KEEP. MATCH.
- Row 54519: sol62, E-ANS, KEEP, UNCURED. MATCH.
- No FORFEITED in the judgments. MATCH.

## F1 (FAIL)
624.2 says the enforcer sent 21 E-ANS items to the panel and the judges changed 9 and kept 12. The stored send_back rows for the panel are 22: qwen4max 5 (1 CHANGE, 4 KEEP), sol 9 (5 CHANGE, 4 KEEP), sol62 8 (4 CHANGE incl. row 54523 RECORD-ONLY, 4 KEEP incl. 54519 UNCURED). So 22 sent, 10 changed, 12 kept. The panel item total of 54 (AAR item 5, 611 row) also counts 22 E-ANS. Fix: 22 / 10 / 12, or keep 21 / 9 and say that row 54523 (RECORD-ONLY) is left out and why.

## Notes
N1. "the E-PREM checks are 12 rows, none sent back": true, but all 12 are on chatgpt, an alternate (6 CHALLENGER, 6 CONCEDED). No panel judge's premise count was checked by E-PREM at all. Say so; it is stronger evidence for 624.1 than "none sent back".
N2. The question is balanced and binary, and applies to both debaters. One change: "(as now)" reads as if the rule says so; draft 2 of 624 holds that open (WRONG-IF 1). Write "(as the judges now do)". Optionally add the one fact that makes it concrete: the three judges answered 120 ANSWER CHECK lines with no "no answer", yet counted 4 to 5 defender premises conceded.

## Regrade: draft 2 (W3, commit f455daae, Wall 11948), 00:2x CST 2026-11-25
File md5 23791367 MATCH. diff against draft 1: title; the E-PREM sentence gains the alternate-only fact (N1); the E-ANS line reads 22 sent, 10 changed, 12 kept, per seat 5/9/8 with 1/4, 5/4, 4/4, and row 54523 RECORD-ONLY named (F1, matches my counts); the question reads "(as the judges now do)" (N2); a DRAFT 2 CHANGES line. No other line changed. GRADE: PASS. The question may go to the operator.
