# Hermes review of run 28427: Worker_E check (26 Oct)

Source: transcript28427.md (md5 b8b3a185); live debate_judgments and debate_results (row cd8b6405); derive_debate_outcome (md5 450aebe1).

1. Grok K-G6 correction dropped: CONFIRMED. Table line 82 holds "The count moves from 0 to 1 ... PROP-DEPENDENT". The row stores grok SELF-SUPPORTED, 0. The row's standings fields are null. This is G1 (BB-7680).
2. Stale judge body, doubled note: CONFIRMED. Line 629 reads "(counted after its cure; the judge wrote SELF-SUPPORTED) (counted after its cure; the judge wrote 0)".
3. Outcome against the embedded rule: CONFIRMED, and the cause is deeper. The tie branch reads each HELD seat's RESULT line from verdict_raw. DeepSeek's line is the pre-cure "CHALLENGER WINS", so v_hu=1 and v_h=2, which gives DEFENDER PREVAILS. After its cure, DeepSeek is HELD with challenge SELF-SUPPORTED and no CHALLENGER LINK BROKEN line (the live query shows clb=false). By the rule at line 756, that gives UNDERDETERMINED. With that line read, v_hu=2 of v_h=2, and the outcome would be UNDERDETERMINED. This is a derivation by the rule, not words any judge wrote. It is advisor candidate (e). Hermes says "both standings"; the rule reads CHALLENGE STANDING alone.
4. Flat citation line: CONFIRMED. The top section reads "Challenger, round 1: cited Luke 1:35 ... this wording is not in Luke."
5. Luke 2:33 in the narrator register: CONFIRMED at lines 143 and 838. KJV: "And Joseph and his mother marvelled at those things which were spoken of him."
6. Grok statement printed twice: CONFIRMED at line 82.
DG-63 (Hermes did not read it): it is a method guard (SECOND CONSTRUCTION RULE: a claim that carries no check of its own must be built a second way or marked UNVERIFIED). The synthesis's use at line 553 fits its text. It has compaction_read=false and oracle_relevant=false.
