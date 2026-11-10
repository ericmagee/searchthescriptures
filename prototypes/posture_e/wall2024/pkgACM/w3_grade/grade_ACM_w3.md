# GRADE pkgACM (W2, commit 6a5f124e, write file pkgACM/parent_s109_ACM.json) by W3: PASS

Labels pkgACM/w3_grade/labels_ACM_w3.md (commit c2253205, before any run). Runner w3_ACM.cjs, output w3_ACM_out.txt. Base: live s109 (fetchback_live_s109.json, version 2a23116b).

- G1 OK. 418 nodes, connections equal, only Anticheat Record differs: 4,157 to 4,160 (+3 code, measured; code text total 3,838,699 to 3,838,702). The one difference is "\.?" before "\s*$" in the line pattern. No prompt text, no call.
- G2 OK. My own scan, 38 debates with an anti-cheat reply, 3,778 reply lines: the output is equal to live in every debate except 33389 (X34, X36) and 33617 (X75), where the three lines turn from NO ANSWER to CONSISTENT and the counts follow; every other row and every shown mark is equal. Unread lines 4 to 1; 33389 X73 (EARLIER without quote marks) stays unread, as stated by the builder.
- G3 OK. Plants on the real shown REVERSED line of debate 33222 X94 (not the builder's line):
  - period after the EARLIER quote; curly quote then period; period, spaces and carriage return: live NOT READ, candidate REVERSED and shown.
  - period, with EARLIER words that are not in the side's text; CLOSE quote only with a period: candidate reads them, QUOTE NOT FOUND, not shown. The fix shows no unverified mark.
  - three periods, "!", a note after the period, period then bold marks: not read by either (limits, unchanged).
  - bare "CONSISTENT.": candidate CONSISTENT, live NO ANSWER.
  - period inside the quote only; a period line for an id not among the items: equal to live.
  - the same id twice, once as stored and once with a period: candidate records and shows two rows where live shows one. Live already records and shows two rows when the stored line is repeated with no period, so this is the existing handling of a repeated id, not a new fault; 0 stored cases. Noted as a limit, not a finding.
- G4. Panel Build and Build Independent Verdict outputs on 33389 and 33617 with the candidate's record: equal to live, character for character (690,140 and 365,251; 837,229 and 454,815). No judge prompt character changes on stored data. Build Save Body could not be run in my harness; by reading its code, its audit line prints the counts, so "2 more CONSISTENT, 2 fewer NO ANSWER" (33389) and "1 more, 1 fewer" (33617) would appear in the saved review note only.
- G5 not applicable: no node sends the anti-cheat answers to record_enforcer_log (searched every node; none names both).

Mistake of mine during the grade: my first G1 size check compared the wrong three characters (the shared backslash was taken into the common prefix) and reported FAIL; the runner was corrected and the check now replaces the exact pattern tail and compares the whole code.

Effect stated plainly: changes no shown mark and no judge prompt in stored data; the lost REVERSED mark is shown on plants only.
