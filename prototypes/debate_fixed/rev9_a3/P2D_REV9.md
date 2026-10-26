# THE DEBATE FIXED (BB-7397), P2D rev 9: the defects found on run 28269, list (a)-(i) of BB-7603 and BB-7605
Opened on his word in Worker_A3's thread, 26 Oct, quoted: "I want you and worker_E to review and create a BB.  I want to get this resolve as quickly as possible" (read as: his tests are done for this round; 7605 item 4).
Pen: Worker_A3 (session_015ZiVmTarESui8ub4mf2Dcr). Builder: Worker_E (session_014Qy67bHv8uBmRXbWGSrghm), per 7603 item 4 and 7575 item 3(c).
Advisor of record: Advisor_Code_D, seat 29, session_01LydTRfwbofoJKfTbSePZwC. BASE: active 75dcb465 = new12 at git 22a4aec.
Run 28269 = debate_results row fd6a5ca9; report copy build12_a3/step8/report28269.md (md5 89fc9d23).

## DEFINITION OF DONE (each measured on run 28269's stored text unless stated)
19 (a; 7603; A3 F1, E F4) K-G5 window. A SHORT or STATEMENT quotation counts when it is found in the answering round's LINK block and
   its match overlaps a naming window (300 characters before the verse to 1,200 after), not only when it lies wholly inside one.
   Located: Cure_Check.js cureNamed / shortOk, the same in the 14 library copies.
20 (b; 7603; E F1; Hermes item 5; Q1 RULED at BB-7607 item 3) The row's defense_standing, conceded_links, challenge_standing and
   challenger_conceded_links carry the COUNTED PANEL's majority value for each field. Where the counted judges give no majority on a
   field, the field is null and review_notes names each counted judge's value. The single judge's values never enter these fields
   (rulings 99); they stay in independent_verdict_raw. Located: Build_Save_Body.js (written today from d, the single judge's extraction).
   MEASURED for the sweep (pen, 26 Oct): the four columns are nullable, no CHECK names them, no debate_results trigger reads them; their
   readers are 11 functions (aggregate_debate_panel, dash_cc_debates, dash_debate_by_id, dash_odv1_by_id, dash_odv1_debates,
   dash_odv1_judges, debate_judgments_write_guard, derive_debate_outcome, judge_seat_parse_history, record_integrity_scan,
   record_replay_judgments) and 1 view (debate_admissible). The builder reads each and states, before the change, which read
   debate_results' four columns and what each does with a panel value and with a null; derive_debate_outcome and record_integrity_scan
   are run on 28269 with the new values in a transaction that aborts, and their outputs are stated in F20.
21 (c; 7603; A3 F3, E F3) Report, a judge counted after its cure: the "Rule applied" line is built from the counted clause, and the
   judge's own RESULT and KEYSTONE lines are printed under one line saying they are the judge's text before its cure.
   Located: Plain_Rule_Lines.js line 12 (built from the judge's original CLAUSE), Format_Markdown.js panelText.
22 (d; 7603; A3 F2) Citation check: a quotation graded WORDING NOT FOUND whose words occur in order inside one sentence of the
   other side's earlier round is reported as the other side's words, not as a citation (rulings 98 extended to a shortened quote).
   Located: Quote_Report.js. Case: defender R2 "a just man does not put away the mother of his own child" against DR1 "A just man
   does not plan to put away the mother of his own child".
23 (e; 7603; A3 F5) "Reads that gave no text" names the nodes only; no error string. Located: Format_Markdown.js line 222.
24 (g; 7605; WALL-1785 item 3a) The audit STATEMENT field is cut at a word boundary with "..." and the report separates it from its reason
   ("... -- Not cured: ..."). Located: Panel_Cure_Check.js line 313 (slice(0,600)), Format_Markdown.js line 139.
25 (h; 7605; WALL-1785 item 3b) The report head numbers the panel judges as the sent-text section does (seat order; the removed judge named).
   Located: Format_Markdown.js head block; report lines 11-15 against 696.
26 (i; 7605; WALL-1785 item 1; WALL-1786 item 8) Collision C-numbers comparable across judges. PEN'S CHOICE (7605 item 2): both.
   (1) The judge prompt carries the numbered C list the system computes from [DR3] order (C<j> = the defender's premise j as [DR3]
   answered it, with its pressed verses), in Panel Payloads, beside the existing guide. (2) A recorded audit line, not a violation and
   not a cure item: a collision line "D<i> vs C<j> (<verse>)" whose verses are none of the verses [DR3] LINK j names, and a C<j> with j above the
   count, is flagged "C-LABEL OFF THE GUIDE" in the judgment and the report. Reason: (1) alone is unverifiable before a live run; (2)
   alone tells the reader but does not stop the drift. Measured by hand on 28269 (pen, this draft): it flags Gemini D1 vs C5 (Luke 3:23), D2 vs C6 (Galatians 4:4), D4 vs C4
   (John 1:13), D5 vs C7, and GLM D1 vs C5 (Luke 3:23), D6 vs C7; no line of Grok or DeepSeek. GLM's compound labels (C1/C2/C3, C3/C4)
   pass on their ranges; how a compound label is read is the builder's to state in its falsifiers.

## RULINGS AND COUNTERS ON THIS PLAN
BB-7608 (Worker_E): AGREED; counters 1 (strike Q2) and 2 (F26 wording) ABSORBED; counter 3 (DoD 20 per 7607) already made in amendment 1.
Worker_E's added falsifiers F19b, F19c, F20b, F26b stand as written there; F26b's reading of compound labels is for the advisor.
BB-7607: shape approved; Q1 ruled as DoD 20 now reads; binding notes: (i) the C-LABEL OFF THE GUIDE audit of DoD 26 is recorded, never
a cure or a count change; (ii) DoD 19 is falsified on DeepSeek D6 vs C3 of 28269 (must read CURED) and on F15c (must stay UNCURED);
(iii) Hermes item 7 is answered at WALL-1786 and needs no step.

## RECORDED, NOT BUILT
- (f; 7603; A3 F4, E F2) Head "Verdict of the debate: HELD" beside "Outcome: UNDERDETERMINED": wording, to him with the AAR (7603).
- (WALL-1785 item 2) The defender's five-register count overstates its exhibit (Luke 2:33, Matthew 1:20): model content; no
  judge rule grades a SUPPORTED link's L1 against its own claim; a rule for it would be his (recorded on the wall).
- Model content: CR3 backslash-quotes; synthesis DG-61 charge.
- Hermes item 7 ("the fix is not visible"): a misreading; updatedAt 22 Oct is the draft write; activeVersionId 75dcb465 was
  published 26 Oct (BB-7599), and its item 6 finds the four rev 8 changes in the published code.

## FALSIFIERS (pre-write checks, declared before any change; builder Worker_E adds its own)
F19 DeepSeek D6 vs C3 on 28269 (build12_a3/step8/f8_ds.cjs): UNCURED on new12; CURED on new. F15c stays UNCURED (7607 (ii)). The rev 7 case behind 7194 defect 1
    (an unrelated sentence elsewhere in the block) stays UNCURED. D3 vs C1 stays UNCURED (wrong round).
F20 Build Save Body on the 28269 inputs: the four fields read SELF-SUPPORTED, 0, SELF-SUPPORTED, 0 (the three counted judges agree);
    a constructed 1-1-1 split gives null with each value named in review_notes; the reader sweep of DoD 20 stated with its outputs.
F21 Format Markdown on 28269: Gemini's section shows "Rule applied: HELD" and the before-cure line; Grok's and GLM's unchanged.
F22 Quote Report on 28269: the Matthew 1:19 item reports the challenger's words; Judges 11:39 stays WORDING NOT FOUND.
F23-F25 the report lines named above change as stated;
F26 the audit of DoD 26 (2) on 28269 flags exactly the six lines listed in DoD 26; the prompt block of (1) appears once in each
    panel payload and nowhere else; no rendered line changes outside those named in F21 to F26 (diff of the rendered report; E counter 2, BB-7608).
WRONG IF: F19 or F22 silent on new; any output of the rev 8 set (F15 to F18e, f15b, f18c) moves; a node outside the changed set differs.

## WORKING ORDER: one portion, build Worker_E, verify Worker_A3
[ ] 1 shape, advisor (with Q1)   [ ] 2 falsifiers then build, E   [ ] 3 verify, A3   [ ] 4 draft write, fetch-back, undo checked, E
[ ] 5 verify, A3   [ ] 6a ask, A3 thread (advisor reads first)   [ ] 6b [IRREVERSIBLE] publish, E   [ ] 7 [IRREVERSIBLE] live run, the
27528 body, A3   [ ] 8/9 both read the run whole   [ ] 10 his word "fixed"   [ ] 11 AAR, advisor and both hands.
UNDO: restore 75dcb465 and publish it.
