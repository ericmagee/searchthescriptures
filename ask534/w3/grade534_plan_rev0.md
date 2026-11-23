# ASK 534 plan rev 0 grade (W3, seat 33)
Graded: ask534/w2/plan534.md md5 317ad031, noise534.sql md5 2b1c2ea3 (commit ae0daa7a).
Live code read: engine daf5da98 Shared Library from ask530/w4/write/fetchback_engine_530.json (3,566 lines).

VERDICT: PASS WITH CONDITIONS C1 to C3. These must go into rev 1 before W4 starts step 2.

CHECKED, TRUE:
1. Line 2278 holds pkgMLS. Line 2174 is its only caller. The current K-SU path does what section 3 says:
   - KF_LINE or a "Dn vs Cm ... LINK BROKEN" line;
   - mlsGround [L1] only;
   - mlsUnit back on ":;," and forward until ".?!", 3 verses each way;
   - it needs an answer tag, and R[ak] must name the other verse.
2. The K-SU readers are at lines 518, 653, 702, 850, 1312, 2278 and 3315. There is one more, line 515: the TRIAL status map ('K-SU':'TRIAL'). The new items take TRIAL from it, so nothing breaks.
3. The 41418 known-bad lines are the line numbers the plan names: 1263 lines 24 and 43; 1264 lines 22, 35 and 41; 1265 lines 22 and 42. None of them names Matthew 1:24 or "took unto him his wife" (my SQL).
4. Matthew 1:24 appears 15 times in the rounds: 2+2+1+3 defender, 4+2+1 challenger. W2's own correction of 16 to 15 is right.

CONDITIONS:
C1. krulSuSrc at line 653 will lose the new items.
   - It finds an item's sentence with /The sentence, [^\n]*?, reads "([\s\S]*)"\. The answer \[/.
   - The item text in plan item 5 ends with "The rounds read them together." and has no "The answer [". So krulSuSrc returns nothing for every new item, and K-RUL's cure-time NAMED BY search never gets the whole sentence.
   - Criterion 5's "without error" passes even so.
   - Fix, either way: (a) name line 653 in the scope and widen the regex to accept "The rounds read"; or (b) word the text so the existing regex matches.
   - Criterion 5 must test that krulSuSrc returns the sentence for a new item.
C2. mlsCure at line 702 needs two things from each new item.
   - The item must carry oref and otext, as today's items do. mlsCure reads them to grade a quoting reply CURED.
   - pair must match the reply's line as the judge writes it. mlsCure builds \b<pair>\b and rewrites only " vs ". A pair "ANSWER CHECK Matthew 1:25" never matches a reply line "ANSWER CHECK: Matthew 1:25 ...", so the item can only stay UNCURED.
   - State the pair form for each label, and add a known-good case to criterion 5: a reply that quotes Matthew 1:24 on the label line reads CURED.
C3. Criterion 1 must replay on the text the node sees, not on the final verdict_raw.
   - K-SU runs at Panel Payloads and Extract Independent Verdict, before the cure.
   - The KEYSTONE lines quoted from verdict_raw come after the cure. Each was replaced, and the originals are in the SUPERSEDED LINE audits: 1263 line 211, 1264 line 192 and 1265 line 317.
   - Name the input text for the replay.

NOTES (no change needed):
N1. noise534.sql counts STANDING and FORCED lines, and goes one verse each way. The builder's real-code count governs, as the plan says.
N2. Collision headers such as "D5 vs C2 (Matthew 1:18,25)" (1263 line 37) give MLS_REF only Matthew 1:18. The new path reads the GROUND, so this is outside scope and only recorded.
