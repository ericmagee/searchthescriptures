# GRADE: ASK 624.5 BUILD (W4, Wall 11873, commit 11883f5c)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. 2026-11-24 CST.

GRADE: FAIL (one fix, F1)
COMMIT: 11883f5c graded. Files by sha256: b624.cjs b66ce931, t624.cjs dc9192de, sck624.js 0bee7a19, notes624_5.md 1de97d16, base_eng 3600fafb, base_child 29b7f676, target_engine 3f0c688c, target_child 29b7f676, write624.sh a9dda2f5, lib_repo.cjs 37a92d98. All equal W4's figures.
RULES READ: ASK 624 ruling 18:00 ("Reasoning is untouched"); operator 19:08 "Build; a KEEP is uncured"; ruling 428; plan rev 2 and my plan grade N1 to N4; build rule; ASK 599 standards599.md (rules 7 and 10).
OBJECTIVE MET: yes in behaviour; no on the standard (F1).
STANDARD (ASK 599): NOT MET, rule 7 (F1). Rule 10 (tags) met.

## Checked by me
- Base engine = live 578 fetch (912dd47a), node for node. Target differs from base in the Shared Library only; connections equal; child target = base child.
- Rebuild from base: byte-equal to both targets (3f0c688c, 29b7f676); fixhdr579 ALL PASS, header sha 1601a3145a021da8, 3859 lines.
- t624 on my copy: ALL PASS (C1 to C6 as W4 states).
- Plan N1: each fixed fragment of the three item texts (a), (b), (c) is in sck624.js, split at the placeholders.
- Plan N2: Late Gate Build passes the recomputed word (R1.fields.verdict_tag, else R1.tag, else p.verdict_tag) to SCK624.items; SCK624 calls WHL507.faults(text, word); LIB 2913 (Send Back Build) unchanged.
- Plan N4: every item on the 12 stored judgments, with its lines (list_items_624_5.cjs): only 1276 (42373 chatgpt, HELD) raises any: SENT WHICH HOLDS AGREEMENT (WHICH HOLDS: CHALLENGER under HELD), SENT RETRACTION LEFT STANDING (D1 vs C2 retracted, CONCEDED LINKS still rest on Jeremiah 22:30), SENT TWO GRADES (D1 vs C2), and two RECORDED retractions on APPLIED lines ("so D1 is broken"; "the chain ... is broken at D1"). Each is a real disagreement in the judge's own text. The other 11 raise none.
- Write script: refuses on a running execution, rebuild not byte-equal, t624, live Shared Library or connections not the base, live child not the base, standing, pair and one-copy (registry_578); PUTs the engine Shared Library only onto the live nodes; keeps revert_eng_624.json.

## F1 (required): three new catch blocks record nothing (ASK 599 rule 7: "each catch writes a record")
- LIB 3482 Late Gate Build: `catch(e){return [];}`. A fault in SCK624 sends no self-check item and leaves no trace, so the check can be off in a run with nothing to show it.
- LIB 3858 SCK624 whl(): `catch(e){f=[];}`. Same, for the WHICH HOLDS item.
- LIB 3471 Gate Record: `catch(e){R=null;}`. Fails closed (item uncured), but the fault is not recorded, so an uncured count from an engine fault reads as the judge's.
Fix: each catch records the fault (an AUDIT line or an E-SCK row naming "SCK624 fault: <message>"), and C6 gains a check that no added catch is without a record.

## Notes, not blocking
N1. Run 42283 has no stored judgments (debate_judgments 1260 to 1277 hold 41155, 41418, 41736, 41822, 42071, 42373). C2 used 41736 and 41822 in its place; state this in the notes.
N2. Deviation 1 (SB_FORM gains "WHICH HOLDS:") is needed for plan step 2, and I accept it. It also changes the first gate: a CHANGE TO a WHICH HOLDS line, NOT APPLIED and record-only since ASK 607, is now applied. The card must say so in those words.
N3. Deviation 2 (E-RTL hits on RULING or APPLIED lines recorded, not sent) is accepted; the two such hits on 1276 are listed above. The card must say so.
N4. The late gate now sends when only self-check items exist: one more judge call for such a seat. The card should say so (cost, op doc s30).
N5. write624.sh's checks after the PUT print their results but do not set the exit code. The readback is mine in any case; say in the script that it must be read.
N6. The new intro sentences are judge-facing and must be quoted on the card verbatim, as the notes do.
