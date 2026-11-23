# ASK 533 BUILD grade (W3, seat 33)
Build: ask533/w2/build/BUILD533.md (a5db3f1b), commit 0e62c730. Plan: ask533/w1/plan533.md rev 1 (5127e00a).
Base: ask533/w4/live/live_engine.json (3a001d95) and live_child.json (cf85b641). These equal live daf5da98 and 10624dd2: n8n shows no write since the ASK 530 write at 16:41:56Z and 16:42:03Z.

VERDICT: PASS WITH ONE CONDITION (C1, item f). Choices a to e and g are CONFIRMED.

REPRODUCED (my own runs):
1. test533.js on live and target gives output md5 e59605ef, byte-equal to out_test533.txt. ALL PASS.
2. diff533.py:
   - The engine differs only in L2 Count Plan and Shared Library. The child differs only in Shared Library.
   - Connections and settings are equal. MAP keys and p are equal.
   - The changed LIB indexes are [483, 489, 514, 517, 849, 1052, 1212, 2177, 3314], with 33 MAP n values changed.
3. compile533.js: 49 of 49 MAP entries compile on live and target, with 0 n mismatches, and L2 Count Plan compiles.
4. runcheck: both targets OK, 613727e9c408e25c.
5. The 539 pair check passes: engine and child lib 613727e9, map 3f838a24 on both.

DECLARED CHOICES:
a. lt and lg on ren entries: CONFIRMED. The plan's skip and the LEXICON WORDING label need them.
b. item.line carries the judge line, the why and the item text: CONFIRMED. Line 3314 prints only x.line.
c. item.ren: CONFIRMED.
d. Splitting at any non-letter: CONFIRMED. It only lowers raises, and the "who/which" case shows why it is needed.
e. AUDIT v66: CONFIRMED for now. No other open ASK (534, 536, 541, 542, 529) takes a new AUDIT version. Recheck before the write.
g. "to beget": CONFIRMED, per the plan's stated choice.
f. Line 1312 (__mlsT) not changed: NOT CONFIRMED. This is C1.

C1. A retraction made only in answer to a K-GLS item is APPLIED under this build, as K-L2's are.
   - At Library index 1311, wd keeps a withdrawal unless __g4u or __mlsT excludes it. __mlsT covers only K-ML, K-SU and K-RUD, and matches on y.pair. K-GLS items carry no pair.
   - So if a judge answers a K-GLS item with "RETRACTED D5 vs C2", the link is withdrawn and the counts move.
   - The plan says the item "voids nothing and sets no count" (criterion 2 text; item 9; ruling 428, "the judge keeps its decision").
   - K-GLS is also made silent like K-ML, K-SU and K-RUD (enfSilent, item 5). For those rules, pkgMLS rev 2 (W1 7448) records such a retraction and does not apply it.
   - The plan does not decide this point, and index 1311 is outside its IN SCOPE list. It goes to the planner, W1, for a ruling:
     - (i) record, not apply: add K-GLS to __mlsT by link, as the K-GLS item has no pair, and add a criterion-4 case;
     - (ii) apply, as K-L2 does: state it in the plan and on the card. "Sets no count" is then true of the item, but a judge's retraction drawn by it does move a count.
   - I recommend (i), for consistency with the other silent TRIAL rules and with ruling 428.

NOTES (no change needed):
N1. WRONG-IF 1, read literally, would catch a part that contains a function-word rendering: G1096 "to cause to be" (be) and G4905 "to associate with" (with). Criterion 1 tests content words only (e340's FW list), so these raise under the plan. Each adds a lexicon sense that the KJV words do not carry ("cause", "associate"). The planner may want WRONG-IF 1 to say "content word".
N2. H2233 "posterity" raises (judgment 1199). kjv_word_map holds 8 renderings for H2233 (seed 218, child 2, and others), and "posterity" is not among them (SQL, read now). The raise follows the record.
N3. Criteria 7(c), 7(d), 7(e) and 8 are left to W4's pinned replay, as BUILD533.md section 6 says. DONE waits on them.
