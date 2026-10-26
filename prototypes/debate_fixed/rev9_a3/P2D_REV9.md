# THE DEBATE FIXED (BB-7397), P2D rev 9: the defects found on run 28269 (BB-7601, BB-7602, BB-7603; WALL-1785 and its reply)
Pen: Worker_A3 (session_015ZiVmTarESui8ub4mf2Dcr). Builder: Worker_E (session_014Qy67bHv8uBmRXbWGSrghm), per 7603 item 4 and 7575 item 3(c).
Advisor of record: Advisor_Code_D, seat 29, session_01LydTRfwbofoJKfTbSePZwC. BASE: active 75dcb465 = new12 at git 22a4aec.
Run 28269 = debate_results row fd6a5ca9; report copy build12_a3/step8/report28269.md (md5 89fc9d23).

## DEFINITION OF DONE (each measured on run 28269's stored text unless stated)
19 (7603 a; A3 F1, E F4) K-G5 window. A SHORT or STATEMENT quotation counts when it is found in the answering round's LINK block and
   its match overlaps a naming window (300 characters before the verse to 1,200 after), not only when it lies wholly inside one.
   Located: Cure_Check.js cureNamed / shortOk, the same in the 14 library copies.
20 (7603 b; E F1; Hermes item 5) The row's defense_standing, conceded_links, challenge_standing and challenger_conceded_links carry
   the counted panel's values, not the single judge's. Located: Build_Save_Body.js (written from d, the single judge's extraction).
   QUESTION 1 for the advisor, below.
21 (7603 c; A3 F3, E F3) Report, a judge counted after its cure: the "Rule applied" line is built from the counted clause, and the
   judge's own RESULT and KEYSTONE lines are printed under one line saying they are the judge's text before its cure.
   Located: Plain_Rule_Lines.js line 12 (built from the judge's original CLAUSE), Format_Markdown.js panelText.
22 (7603 d; A3 F2) Citation check: a quotation graded WORDING NOT FOUND whose words occur in order inside one sentence of the
   other side's earlier round is reported as the other side's words, not as a citation (rulings 98 extended to a shortened quote).
   Located: Quote_Report.js. Case: defender R2 "a just man does not put away the mother of his own child" against DR1 "A just man
   does not plan to put away the mother of his own child".
23 (7603 e; A3 F5) "Reads that gave no text" names the nodes only; no error string. Located: Format_Markdown.js line 222.
24 (WALL-1785 item 3a) The audit STATEMENT field is cut at a word boundary with "..." and the report separates it from its reason
   ("... -- Not cured: ..."). Located: Panel_Cure_Check.js line 313 (slice(0,600)), Format_Markdown.js line 139.
25 (WALL-1785 item 3b) The report head numbers the panel judges as the sent-text section does (seat order; the removed judge named).
   Located: Format_Markdown.js head block; report lines 11-15 against 696.
26 (WALL-1785 item 1; Hermes item 8) Collision C-numbers comparable across judges. QUESTION 2 for the advisor, below.

## QUESTIONS FOR THE ADVISOR (design, tandem 11.2)
Q1 (DoD 20) Which counted-panel value fills each row field when the counted judges differ?
   1. The majority of the counted judges; with no majority, the single judge's value stays and a review note says so (recommended).
   2. Leave the fields as the single judge's and label them so in the report and the dashboard.
Q2 (DoD 26) How the C-numbers are made comparable.
   1. The judge prompt carries the numbered C list the system computes from [DR3] order (one added block in Panel Payloads); checked
      by the live run only, since it changes model input (recommended).
   2. The report states under COLLISION POINTS that C-numbers are as each judge wrote them; no prompt change.

## RECORDED, NOT BUILT
- (7603 f; A3 F4, E F2) Head "Verdict of the debate: HELD" beside "Outcome: UNDERDETERMINED": wording, to him with the AAR (7603).
- (WALL-1785 item 2) The defender's five-register count overstates its exhibit (Luke 2:33, Matthew 1:20): model content; no
  judge rule grades a SUPPORTED link's L1 against its own claim; a rule for it would be his (recorded on the wall).
- Model content: CR3 backslash-quotes; synthesis DG-61 charge.
- Hermes item 7 ("the fix is not visible"): a misreading; updatedAt 22 Oct is the draft write; activeVersionId 75dcb465 was
  published 26 Oct (BB-7599), and its item 6 finds the four rev 8 changes in the published code.

## FALSIFIERS (pre-write checks, declared before any change; builder Worker_E adds its own)
F19 DeepSeek D6 vs C3 on 28269 (build12_a3/step8/f8_ds.cjs): UNCURED on new12; CURED on new. The rev 7 case behind 7194 defect 1
    (an unrelated sentence elsewhere in the block) stays UNCURED. D3 vs C1 stays UNCURED (wrong round).
F20 Build Save Body on the 28269 inputs: row fields equal the counted panel's per Q1.
F21 Format Markdown on 28269: Gemini's section shows "Rule applied: HELD" and the before-cure line; Grok's and GLM's unchanged.
F22 Quote Report on 28269: the Matthew 1:19 item reports the challenger's words; Judges 11:39 stays WORDING NOT FOUND.
F23-F25 the report lines named above change as stated; nothing else in the report changes (diff of the rendered report).
WRONG IF: F19 or F22 silent on new; any output of the rev 8 set (F15 to F18e, f15b, f18c) moves; a node outside the changed set differs.

## WORKING ORDER: one portion, build Worker_E, verify Worker_A3
[ ] 1 shape, advisor (with Q1, Q2)   [ ] 2 falsifiers then build, E   [ ] 3 verify, A3   [ ] 4 draft write, fetch-back, undo checked, E
[ ] 5 verify, A3   [ ] 6a ask, A3 thread (advisor reads first)   [ ] 6b [IRREVERSIBLE] publish, E   [ ] 7 [IRREVERSIBLE] live run, the
27528 body, A3   [ ] 8/9 both read the run whole   [ ] 10 his word "fixed"   [ ] 11 AAR, advisor and both hands.
UNDO: restore 75dcb465 and publish it.
