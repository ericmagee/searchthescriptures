# ASK 422(c) plan rev 1 (W2): KV_EXCL takes "makes" and "excludes"

## OBJECTIVE (added 11-18 17:45 CST, after the write, under op doc v125 section 29; W2 8936. The plan as graded had none.)
A K-V ruling or cure that names its kind in the third person ("an exclusion the quote never makes", "the quotation never makes that
exclusion") is read as the negation kind, as the first-person forms already are under ASK 376. Expected effect: a judge's VOID ruling or
an enforcer's cure is not left uncounted or UNCURED because the verb takes an "s".

Assignment (W3 Wall 8826, item 15 of 8821; origin W2 8805 card limit, W2 8820 item 2): plan W2, build W4, grade W1
and W3. A system change: written only on the operator's card in W4's thread. No prompt text, no model setting and no
reasoning setting changes. ASK 413: engine_manual v192 section 15 governs (library write rule, REPLAY GATE, near-miss
cases for a path no stored run reaches).

## The gap
KV_EXCL (library line 1013, live 36fcf36b and child 365d2828, from clause.txt at 03dc00e9) ends its negation with
`(?:make|exclude)\b`. So "an exclusion the quote never makes" and "the quotation never makes that exclusion" read
false, though they say the same thing as "does not make". W4 8802 and W2 8805 recorded these as limits of ASK 376.

## The change (one token group, two places)
1. In the KV_EXCL literal on library line 1013, both occurrences of `(?:make|exclude)\b` become
   `(?:makes?|excludes?)\b`. Nothing else in the line, and no other library line, changes.
2. Engine and child alike. If ASK 422(a) is live first, it goes through the joined writer; otherwise both libraries
   are built as ASK 376 was, and both headers show the same new library sha.
3. MAP entries: only n is recomputed where the line length changes; every stub compiles (section 15, stub form 3).

## Stored-row replay, before the build (old = live line 1013, new = changed line; both on the masked copy as in kvRulingOk)
Population, measured now (16:45 CST): 114 K-V rows over 51 runs (response_line and flagged_line); 355 judgments
holding "void", split into lines holding "exclu"; and the early-alternate replies holding "exclu", as in W4's rp376.
A rough pre-scan finds 0 K-V rows and 1 judgment with a third-person form near "exclu", so the replay is expected to
show 0 or 1 changed lines. The builder lists every line that changes, old and new results, and reads each by hand.
WRONG IF a changed line is not a statement that the quote's words do not make or exclude the exclusion charged.

## Near-miss cases (section 15: the new path is reached by no stored run)
Must read TRUE with new, FALSE with old:
  a. "an exclusion the quote never makes."
  b. "the quotation never makes that exclusion"
  c. "excludes a reading that the quoted words never excludes."  (third person in the first word order)
  d. "the exclusion is one the quote's words do not makes;"  (shows the s is optional, not required)
Must read FALSE with both (unchanged limits and guards):
  e. W3's 9 wrong-if cases (a376_w3/wrongif.cjs) give the same result as live.
  f. "The quotation never makes the exclusion of Joseph plain."
  g. "the quote makes no exclusion"; "exclusions are made by the quote"; "the quote did not make that exclusion";
     "the quote has not made that exclusion".
  h. A quoted charge: The quotation never makes "that exclusion".
The builder adds a to d and f to h to gate/cases so the REPLAY GATE carries them.

## DONE WHEN (ASK 411)
Offline:
1. The token diff of line 1013 is the two groups only; no other library line differs; MAP n only; stubs compile;
   engine and child library bodies give the same sha.
2. Near-miss cases a to h as stated; the 9 wrong-if cases equal live.
3. The replay lists every changed line, each read by hand, none WRONG.
After the write (live evidence, for the ASK 417 registry):
  case_sql: exists a K-V row whose response_line or flagged_line matches
            `(do(es)?\s+not|never)\s+([a-z]+\s+)?(makes|excludes)\M` and holds "exclu" and "quot"
  mark_sql: count of those rows with cure_status CURED.
  live_since: the save time of the written engine version.
  Until a run gives such a row, ASK 422(c) reads NO CASE and stays live and not run-validated.

## Limits
Past tense ("did not make", "has not made") still reads false, as in ASK 376. A sentence split by ";" or "." is
still not joined. The rough pre-scan above is a regex in SQL, not the masked test; the replay is the measure.
