# pkgOON (W2, offline; nothing written): an out-of-round row answered "CHANGE TO: NONE" is struck
Finding: live run 34726 (s112). luna answered 11 E-OOR send-back items "CHANGE TO: NONE || <reason>" to strike rows whose quotation is not in the round named. The send-back applier reads a strike only as STRUCK, STRIKE, REMOVE(D) or DELETE(D) (pkgOOS), so each NONE became a NOT APPLIED gate item. luna answered "CHANGE TO: NONE" again at the gate, and each item was counted: 11 of luna's 12.
Fix: NONE is added to pkgOOS's word list (same rule otherwise: a row that ends COUNTED is still refused). Shared Library only, one line (the send-back applier, 10 nodes).
SIZE (measured, against live s113 71898965): +40 code (+5 for the word, +35 for its comment); prompt 0.
Build: node pkgOON/build_OON.cjs /mnt/project-files/wall2024/fetchback_live_s113.json pkgOON/parent_s113_OON.json
Chain replay of 34726 with stored replies (w2_grades/ead/chain_w2.cjs, gate replies renumbered): live s113 luna 12, terra 0, sol 1; pkgOON luna 1, terra 0, sol 1. luna's one remaining item is its own gate change on D3 vs C3 raising K-G1, so luna is still removed. Other seats' output is unchanged.
Stored scan (debate_enforcer_log): E-OOR send-back answers that strike a row: 11 "CHANGE TO: NONE" (all 34726, luna), 4 "STRUCK" forms (read already). No other delete form.
Limits: the E-OOR cure reading (pkgVP1, record-only) still reads NONE as UNCURED (counts nothing). At the gate, an E-OOR row that reaches a NOT APPLIED item is kept by KEEP and is not struck by a gate CHANGE TO: STRUCK (the applier tests rule E-OOR only); not reached in 34726 once pkgOON applies at the send-back.

## rev 2 (W3's limit: the judge is not told the strike form)
- A replacement, not an addition, on library line 3610 (the E-OOR "not found verbatim" reason). It is used by 3 nodes: Judge Enforcer Build, Alt Judge Enforcer Build and R2 Alt Judge Enforcer Build.
- Old: the sentence is not found verbatim in [CRn] ("the verbatim sentence in which the ground was granted")
- New: the sentence is not found verbatim in [CRn]; quote it verbatim, or CHANGE TO: STRUCK
- The quoted rule words are replaced by the two cures the engine reads: a verbatim quotation, or the strike form pkgOOS reads.
- Size, measured on library length: rev 2 is +21 code over s113 (+40 for the NONE reading, -17 here). Each "not found verbatim" send-back item is 17 characters shorter in the prompt.
- Node replay of Judge Enforcer Build on 34726: the 15 code rows carry the new reason, and nothing else changes in size beyond that.
- Joint with pkgGK1: parent_s113_OON2_GK1.json, +118 code.
- Not told: the other three E-OOR reasons (a link round named, the other side's round, COUNTED on a [round] line). Telling those needs added text.
