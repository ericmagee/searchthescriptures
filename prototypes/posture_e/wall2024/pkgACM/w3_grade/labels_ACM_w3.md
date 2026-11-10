# pkgACM (W2, commit 6a5f124e, write file pkgACM/parent_s109_ACM.json): W3 labels, committed before any run of the candidate

Before these labels I only compared the write file with the s109 fetch-back node by node and read the changed line (no code was run).

Any other result than the one stated is a FAIL.

- G1 Against fetchback_live_s109.json: 418 nodes, connections equal, only Anticheat Record differs, 4,157 to 4,160 (+3), the one difference is "\.?" before "\s*$" in the line pattern. No prompt text.
- G2 My own scan (study_reject_w3 harness, on s109): every stored run with an anti-cheat reply through live and candidate. The whole acx output is equal except the rows of 33389 X34, X36 and 33617 X75 (NO ANSWER to CONSISTENT, counts follow). Unread reply lines fall from 4 to 1 (33389 X73 stays). No shown mark changes in any stored run.
- G3 Plants of my own on a real shown REVERSED line (a different debate from W2's 33218 if one exists):
  a. period after the EARLIER quote: live NOT READ, candidate REVERSED and shown.
  b. curly closing quote then period: candidate read and shown.
  c. period then spaces and a carriage return: candidate read and shown.
  d. period after the quote where the quoted words are NOT in the side's text: candidate reads it, QUOTE NOT FOUND, NOT shown (the fix must not show an unverified mark).
  e. three periods after the quote, "!" after the quote, a note after the period: not read by either.
  f. the same id twice, once with the period and once without: state what both do; candidate must not show more marks than live shows for the line without the period.
  g. a period line for an id that is not in the build's items: ignored by both.
  h. "CONSISTENT." bare: candidate reads CONSISTENT (live NO ANSWER).
- G4 Every node that reads Anticheat Record: on 33389 and 33617 state what changes downstream (judge prompt text, log rows). No judge prompt character may change unless it is the no-answer count or list; state the measured prompt difference.
- G5 If enforcer_log rows are built from these answers: the changed rows through record_enforcer_log in a rolled-back insert.
