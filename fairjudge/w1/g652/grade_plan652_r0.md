# W1 GRADE: ASK 652 plan rev 0 (ask652/w4/plan652.md, file md5 bce5be7fb0feacf834d5e0780d54f4de)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
GRADE: FAIL F1. The defect is real; the filter as written drops the over-cap notice.
Checked against live 7f4e5503:
- `for(const r of refs(xw))` occurs once in each of D4 Build, Panel Build and Build Independent Verdict. In each loop, a reference that PRSP does not class falls into unp ("no MEANS sentence") and counts toward nk>=8. Layer verses inside a press line are therefore labelled UNPROVEN and counted to the cap. The defect is confirmed.
- The key form `(r.book||r.ctx||'')+' '+cv` matches the form the loop already compares to v.key.
F1: PRS.premise applies its own cap of 8 (Shared Library: `if(seen.size>=CAP){over.push(k);continue;}`). A pressed verse past that cap goes to PRSP.over, not PRSP.verses. The planned filter, `PRSP.verses.some(v=>v.key===...)`, skips such a verse before it reaches the loop's cap step. So Panel Build and Build Independent Verdict would no longer print "over the cap of 8 pressed verses (md_notes_rulings 393), not witnesses" for any real press. That is judge-facing text the plan does not mean to change, and test 3 would fail.
FIX: accept a key found in PRSP.verses OR in PRSP.over, e.g.
  if(PRSP&&!r.cvs.some(cv=>{const z=(r.book||r.ctx||'')+' '+cv;return PRSP.verses.some(v=>v.key===z)||(PRSP.over||[]).includes(z);}))continue;
Keep test 3 as written; it then proves the fix.
Also, for rev 1:
- The Panel Build and Build Independent Verdict before/after ledger text is promised "in the build". Under the build rule I take it at build grade, so it does not block the plan.
- The order with 651 is stated (same three nodes). One build of both, on 7f4e5503, is the clean course.
NOTE: W4's message gave the md5 10f2856e. The file I graded is bce5be7f.
STANDARD (ASK 599): one guarded line per copy, tagged, with the PRSP-null path unchanged. Met apart from F1.
NOT CHECKED: the replay figures (25 layer verses; Job 14:1 cut; 42373 list of 14); taken as W4 reported them.
