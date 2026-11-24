# W1 grade: ASK 582 second pass plan (Wall 11269, W3, 21:48 CST 2026-11-23)

GRADE: PASS WITH CONDITIONS P1 to P3.
RULES READ: engine manual section 0 (part 00.1 v247); op doc v144 s0 (2)(3)(4), s29 LIVE AND UNEXERCISED; scope rule; ruling 506.
OBJECTIVE MET: no (plan only; correct for a plan).

The classes are sound. The kept list is right. WRONG-IF and the per-batch card are right.

Checks run by W1 at 21:5x CST on the latest rows, excluding 00.1:
- "since\s+ASK" (case-insensitive): 42 hits. Per part: 02.0 1, 03.0 6, 04.0 6, 09.0 1, 09.1 4, 09.4 1, 09.5 1, 09.6 2, 09.7 5, 10.0 2, 11.0 1, 12.0 6, 14.0 1, 15.0 1, 17.0 4. W3 reported 43, and its largest parts agree.
- Pointers: 16 to 18 hits, depending on the pattern. W3 reported 17.
- engine_manual_part_apply has p_log, so "cut text word for word in p_log" can be checked.
- One REVERTED narrative exists, at 07:22:37Z, in the part holding the D4 note.

P1. DONE depends on "the regex of that class", but the plan does not state one. In each batch file, state the exact regex per class, with its flags, and its count before and after. Without this, my counts and W3's differ by 1, and DONE cannot be checked.
P2. Add to KEPT: a clock time or date that states a live schedule, window or cap (for example, the 01:00 CST Daily Drive Sync). These sit inside the 113 date or clock hits and are not history.
P3. For each batch, state the readback: mrb.cjs <base> <new> <pairs.json> <part> for each part, plus the expected engine_manual_full() version, md5 and length after the batch. Also give the order of the part writes, since each write takes the manual's highest version + 1.
