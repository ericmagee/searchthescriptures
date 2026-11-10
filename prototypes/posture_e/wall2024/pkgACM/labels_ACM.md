# pkgACM labels (W2, written before the build, 10:4x CST 11-10). Operator: ASK 24 option 1 (build for grading), 10:42 CST via the coordinator.
Fault (W2 4167, W3 4168): Anticheat Record reads a line only if it ends on a closing quote mark; "... -- EARLIER: "...".", with a period after the
last quote, is not read and the item is recorded NO ANSWER. 3 real lines (33389 X34, X36; 33617 X75), all CONSISTENT. A REVERSED line in that
form would not reach the judges.
Fix: allow one period before the end of the line: "\s*$" becomes "\.?\s*$" at the end of the line pattern. Code only, Anticheat Record only.
Base: live s108 (fetchback_live_s108.json); rebuilt on the new fetch-back if pkgRLF2 is written first (it changes another node).

Expected (any other result is a FAIL):
- A1 only Anticheat Record changes; size about +2 or +3 code characters; no prompt text.
- A2 every stored run (37): rows, counts, shown marks equal to live, except 33389 X34, X36 and 33617 X75, which turn from NO ANSWER to CONSISTENT.
  33389 X73 (EARLIER without quote marks) stays NO ANSWER.
- A3 plants on the real shown REVERSED line 33218 X57 (D):
  a. period after the EARLIER quote: live not read; fix REVERSED, quotes found, shown.
  b. period after the CLOSE quote with no EARLIER part: fix reads it, earlier quote missing, QUOTE NOT FOUND, not shown (live: not read).
  c. control, the line as stored: shown in both.
  d. not read by either (limits, no change): EARLIER with no closing mark; text after the period; lower-case "Reversed"; two periods.
  e. a plain "ANTICHEAT: X57 -- REVERSED." with no quotes: fix reads it, QUOTE NOT FOUND, not shown.
