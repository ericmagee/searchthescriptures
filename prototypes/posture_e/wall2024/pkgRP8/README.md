# pkgRP8: reader phase 2 item 8, STATEMENT / RESPONSE reads (W3, 11-08)

Tracker RP2-8 (taken from W1 by W3). Library change (30 nodes).

- kconUnlabel (K-CON and K-W contradiction cures: strips the RESPONSE/STATEMENT label so the NOT HELD / CONTRADICTION / REASSERTED IN test
  sees the answer) asks the shared reader first. A line read as STATEMENT (which RESPONSE or STATEMENT) gives f.text; any other line keeps the
  old regex (kconUnlabel0).
- respOf is not swapped: its labels already come from the reader (cureLines fills o.response and o.statement from R.form==='STATEMENT', f.item),
  so its .includes tests compare reader fields, not raw judge text.

Behaviour change: the old regex stripped "RESPONSE: <label> |" but only "STATEMENT:" from a STATEMENT line, leaving "<label> | <answer>", which
then failed the /^(CONTRADICTION|NOT HELD|REASSERTED IN)/ test. The reader gives the answer for both. Replay (w3_combined_replay strip_RI6 vs
strip_RP8): 1170 node runs, 1169 identical. The one difference is 33107 Panel Cure Check: gemini's K-CON item stays CURED with the same WHY;
the cure now finds the STATEMENT line (REASSERTED IN [CR4] ...) first, where before it found the RESPONSE line (CONTRADICTION -- ...), so the
reported STATEMENT text changes. No cure flips, no item added or removed.

Base: pkgLIB/strip_RI6 (W1, reader items 6+7, on strip_KWQ on strip_RI5C on strip_RCD). Restack: node pkgRP8/build_RP8.cjs <final base> pkgLIB/strip_RP8.
