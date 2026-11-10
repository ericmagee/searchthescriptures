# pkgEAD rev 2 (W1, offline candidate; nothing written): DeepSeek reads a deferral as the whole answer
Finding: W3 Wall 4332 and 4336. In 34703 the DeepSeek E-ANS item on Luke 1:34 [CR3] ("right: MISSES") called "I grant ... I answer it fully under LINK 4." the whole answer. The defender's [CR3] LINK 4 answers the press (W1 3798, W3 3799). luna and terra both regraded MISSES. luna then wrote a FORCED line that repeats the misreading, and terra's D1 vs C1 went to BROKEN and on to the gate K-G4 count that removed it.

## Fix
Send Back Build, Alt Send Back Build and R2 Alt Send Back Build do not send an E-ANS or E-HOLD DeepSeek item when both of these hold:
- (a) its reason reads a deferral: "under/at/in/see LINK n" or "premise n", "answered at/under/in", "answer it fully", "pointer", "defers";
- (b) the live pkgVP3 code (vp3Trial2024, the same rounds Send Back Record reads) finds an answer behind it ("code check does not agree").

The item is listed in sb_not_sent, as pkgECB does. An item that also carries an engine check (pkgUND, pkgUNA, pkgABS, pkgECL) is still sent. A seat whose items are all withheld sends no call, and the seat order is unchanged.

## Size
- Code: +1,574 (measured, s112 base, Shared Library only).
- Prompt: none.
- Build: node pkgEAD/build_EAD.cjs fetchback_live_s112.json out.json. The no-patch build (SET=NONE) is +0.

## Proof
- **Stored rows.** DeepSeek E-ANS or E-HOLD send-back rows whose reason reads a deferral: 27 rows in 12 runs.
  - 12 can be replayed (pkgEAD/defer_vp3_out.txt). In all 12 the code finds an answer behind the pointer.
  - In 7 of the 12 the judge took the misreading into its text (CHANGE TO MISSES).
  - In 34703 it happened twice (luna and terra).
- **Node replay.** test_EAD_s112_out.txt replays live Send Back Build and Alt Send Back Build against pkgEAD on every stored run and on 34703.
  - 58 node runs: 52 byte-equal; 6 withhold 11 items, and every other item is unchanged; 0 other differences.
  - 18 node runs cannot be replayed (older runs with no stored Judge Enforcer Record).
- **Plants** (plant_EAD_out.txt, on 34108, 5 OK):
  - P0: the real LINK 4 answer is withheld for all 3 seats.
  - P1: a grant plus a deferral to a LINK 4 of under 25 words is still sent.
  - P2: a bare grant is still sent.
  - P3: the layered LINK 4 moved into [CR4] is withheld.
  - P4: the same item, with the deferral words taken out of the reason, is still sent.
- **Chain replay of 34703** (chain_EAD_34703_out.txt, stored replies, a withheld item's reply lines removed):
  - The live baseline reproduces the live gate (9 items, terra 1 uncured, Haiku NOT SEATED).
  - With pkgEAD, luna's gate item "ANSWER OPEN Luke 1:34 D1" is gone.
  - NOT SHOWN: everything after the gate. The stored replies to the other items, terra's S4 included, were written after the judge had accepted the misreading, so the replay cannot show what terra does without it. terra's D1 vs C1 BROKEN comes from its stored S4 reply.

## Limits
- The code is a bareness test. It shows that an answer stands behind the pointer, not that the answer meets the press. A deferral to a full block that still misses would be withheld, and the judge's MEETS would stand. E-ANS and E-HOLD DeepSeek items are TRIAL, record-only (ruling 428), so no count is lost.
- "Redirect" readings ("I do not rest the link on the phrase alone"; 33311, 33682) are not covered, on purpose.
- W3's points 1 and 2 (the K-G4 item sentence names only one cure; the engine calls the same line "unanswered press" at send-back and "meaning" at the gate) are not addressed here.

## Joint with pkgK7C rev 2 (W2, commit af13e5d7)
- File: pkgEAD/joint_s112_EAD_K7C2.json, also at /mnt/project-files/wall2024/. It is W2's build_K7C2.cjs run on parent_s112_EAD.json.
- Size: +2,202 code measured against s112 (pkgEAD +1,574 plus pkgK7C rev 2 +628, no overlap). Only the Shared Library changes; 418 nodes; connections equal; prompt: none.
- Independent check: pkgEAD built on the pkgK7C rev 2 parent (BASESRC=K7C2) gives the same 42 node sources as the joint, all 42 equal. Packed that way it is 1 character larger.
- pkgEAD tests on the joint: node replay test_EAD_joint_out.txt gives 58 node runs, 52 equal, 11 withheld, 0 other. Plants 5 OK.
- pkgK7C tests on the joint: W2's t_rev2_real.cjs on 34703 and 34626 gives the same per-seat results as pkgK7C rev 2 alone (34703: haiku 2 to 1, terra 2 diffs; 34626: luna 2 diffs).

## Rev 2 (answers W3's first grade, Wall 4357)
- Change: an item is withheld only on a positive finding of the code. The findings are "names an answer of", "the answer defers to [round], which answers", "its own layer", "the answer runs n words", and "neither a grant nor a deferral". On "names the verse again", "no answer found" or any other result, the item is sent.
- Size: +1,683 code measured against s112 (rev 1 +1,574). Shared Library only; prompt none. Rev 1's write file is kept as parent_s112_EAD_rev1.json.
- W3's plants rerun on rev 2 (w3_grade_rerun_g5_rev2.txt, g8): 15 of 16 as labelled, and k is SENT.
  - a/b, c, f and f2 are now SENT.
  - h (E-HOLD) is now SENT, against W3's label of WITHHELD. The code's first finding there is "[CR1] names Luke 1:34 again", a footing quotation, so rev 2 sends it. That is the safe direction, and it is now a limit.
- My plants: 8 OK. P5, P6 and P7 are W3's a/b, c and k.
- Node replay: 58 node runs, 52 equal, the same 11 withheld, 0 other.
- Joint with pkgK7C rev 2 is rebuilt: +2,311 (1,683 + 628). The independent build gives the same 42 sources, and both packages' tests give the same results on the joint.
- Chain-replay note (W3 limit 5): in chain_EAD_34703_out.txt, the counts after the gate are replay artifacts. The stored gate replies were written for the old item numbers: luna 1, terra 4, and the extra alternate. They are not a result.

## Rev 3 (answers W3 Wall 4363 and W2 Wall 4364)
- Change: the finding is read only from the code's own words, at the start of the note after "TRIAL pkgVP3: code check does not agree, not an item -- ". A note without that prefix is sent. The one-hop form "the answer defers to [X], which answers V (...)" is positive only when the finding inside the parenthesis is positive. The pkgVPD form "which answers V without its exact reference" is positive.
- Size: +2,162 code measured against s112 (rev 2 +1,683). Shared Library only; prompt none. Rev 2's write file is kept as parent_s112_EAD_rev2.json.
- W3 plants (g5, g8, g9 on rev 3): n1 to n4 as labelled (all SENT); g5 15 of 16 as labelled, h is the accepted limit.
- W2 plants (plants_EAD_w2.cjs): N0 WITHHELD; F1 to F7 SENT; F9b and F11b SENT; F8 WITHHELD (accepted limit); F9, F10, F11 WITHHELD (the stored [CR2] answers in substance; same as W2's rev 2 output for F9 and F11).
- W2 node replay: 74 node runs, 68 byte-equal, 13 withheld, 1 run with other change (34016, two items sharing one name, W2 hand-checked). It covers 33299 (4 withholds: gemini Genesis 4:1; Job 14:1 for gemini, terra, sol), which my harness cannot replay.
- My plants 8 OK; my node replay 58 runs, 52 equal, 11 withheld, 0 other.
- Joint with pkgK7C rev 2: +2,790 (2,162 + 628). Independent build (BASESRC=K7C2): 42 of 42 sources equal. pkgEAD tests on the joint: same results. W2's t_rev2_real.cjs on the joint: output identical to pkgK7C rev 2 alone (k7c_on_joint_rev3.txt).
