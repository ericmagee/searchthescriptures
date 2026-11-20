# ASK 506 plan rev 2 (W3, seat 33, 11-20; W4's live check 04:48Z taken in: forms listed, collLines guard added to C4; rev 1 6146f87d rebased on live after ASK 504 and ASK 505; rev 0 points_fix_w3/plan_points.md 0798969b): each judge states the points at issue first, then grades them in layers

Team: W3 plans, W4 checks against live and builds (the operator, 03:45:05Z: "Just you two."). The second non-builder grade is HELD.

## 0. LIVE BASE (to be confirmed by W4's fresh read)
- Engine moMxiV4Irg1uRBZN 6bb4647a and Alternate Pass child c2e4af89 (ASK 504 written, Wall 10231): every LINK BROKEN and FORCED line ends with DECIDES [L4] ... FROM ... MEETS ... WHY IT FAILS; dec504() in the Shared Library (both copies) checks its form on the E-COL path; Commitment 13 carries the DECIDES sentence in 8 nodes plus the 2 library copies.
- derive_debate_outcome 2a853df6 (ASK 505 written, Wall 10235; v_505_from 2026-11-20 04:44:38Z). 506 does not touch the outcome.

## 1. THE OPERATOR'S WORDS (W4's thread)
- 22:36 CST 11-19: "I have a question. Do you think each judge should first list out what were the key points they are judging for or against, and then break down their verdict using the layers. if it's already that way... tell me."
- 22:39 CST: "it also give the smarter enforcer something to flag"
- W4's answer to him: partly. COLLISION POINTS lists every graded link, but no plain-words statement of the points comes first.

## 2. OBJECTIVE
Before any grade, each judge states in plain words, for every pair it will grade, what each side claims and on which layer, and what the grade must settle. Every grade line and every DECIDES line (ASK 504) then answers a stated point, and the enforcer can flag a grade that answers a point never stated, or a stated point left ungraded. Expected effect: a reader of the judgment sees the points first and can follow each grade back to one; the enforcer has a fixed target.

## 3. THE CHANGE (W4 locates every copy from fresh live reads; touched text only; no model settings; reasoning untouched)
C1. A POINTS AT ISSUE section, the first section of every judgment. Judgment forms (W4, live): Panel Build, Build Independent Verdict, Reserve Build, the 5 Accept nodes, and the 2 library copies (Enforcer Build also carries Commitment 13). Send-back forms: Judge Enforcer Retry Build, Alt Judge Enforcer Retry Build, R2 Alt (child) and SJ Re-ask Build; Enforcer Retry Build (the enforcer's own retry) stays out. Format Markdown stays out (the transcript question). one entry per pair the judge grades, both sides alike (ruling 364):
   `P<n>: D<i> vs C<j> -- DEFENDER: "<the defender's claim, plain words>" ([L1|L2|L3] <reference or word>) -- CHALLENGER: "<the challenger's claim, plain words>" ([L1|L2|L3] <reference or word>) -- AT ISSUE: "<the one question the grade settles>"`
   The claims are stated, not graded; no grade word (BROKEN, STANDS, UNDERDETERMINED, FORCED) appears in the section.
C2. Each collision line and each FORCED line names its point: `D<i> vs C<j> [P<n>] ...`. Its DECIDES line (live since ASK 504) answers that point's AT ISSUE; dec504 is extended to read the [P<n>] and the section, not replaced.
C3. The Commitment that pairs with it (Commitment 13 beside the DECIDES sentence, or 11, whichever W4 finds is the right home; one text, byte-identical in every copy): "I state the points at issue before I grade, and every grade answers a stated point."
C4. The check, in two parts:
   - Code (form; on the existing E-COL send-back path): the library's collLines takes any line that begins "D<i> VS C<j>" anywhere in the reply, so a P entry that lost its "P<n>:" prefix would be read as a collision line; the check flags it. Every collision and FORCED line names a P present in the section; every P has a collision line; each P entry carries both claims with a layer tag and an AT ISSUE; no grade word in the section.
   - The enforcer (meaning; the operator's "smarter enforcer"): a grade or DECIDES line that does not answer its point's AT ISSUE, or answers a different question, is sent back once with the quoted reason; the judge keeps the decision and both are recorded (ruling 428).
   An uncured miss takes the same path as an uncured E-COL fault today (drv_uncured, alt_needed; ASK 504 R1).

## 4. QUESTIONS
None for the operator yet: he asked for the section and backed the enforcer check. Design choices (the Commitment's home, the exact form) are the team's. If B1 shows the section pushes judge replies past their token limits, that goes to him before any card (no model setting is changed without his word).

## 5. CHECKS
- B1 (W4, offline): sizes per changed node; the added prompt text; an estimate of the added reply length per judge from run 40995 (one entry per graded pair, about 16 pairs).
- B2 (W4, offline): "[P<n>]" after the label passes sbLabel, ECL.check, dec504 and the grade read; the code check on hand-written judgments: one conforming; one P entry without its "P<n>:" prefix (flagged, not read as a collision line); one with a grade naming no P; one with a P left ungraded; one with a grade word inside the section. Each flagged as planned; the conforming one passes.
- Q1 (the operator's release): each judgment opens with POINTS AT ISSUE; every collision line names a P; send-back counts for the new faults; the enforcer's meaning flags, quoted.

## 6. WRONG-IF
1. Judges restate the transcript at length in the section and replies truncate: tighten the form (one sentence per claim) before any limit change.
2. The enforcer grades the debate instead of checking that a grade answers its point: narrow its text ("You do not judge the debate").
3. A judge fills the section with points that differ from the pairs it then grades: C4's code check must catch it; if it does not, fix the check.

## 7. STEPS
1. W4 checks against live 6bb4647a / c2e4af89 (all judgment forms and copies, dec504 and the E-COL path, the enforcer nodes, sizes).
2. W4 builds; B1, B2; W3 grades; W4 tells him the second grade is held; his card; write; fetchback.
3. Q1 on his release. Manual entry (W3) on its own card after.
