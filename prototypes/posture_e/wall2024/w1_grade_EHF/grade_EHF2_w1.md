# Grade: pkgEHF rev 2 (W2, Wall 4688), grader W1

Verdict: PASS.

Files: parent_s120_EHF2.json (sha ce5c2054144543e2), joint_s120_VP1B_KWN_G4Mr2_EHF2.json (sha a4dc766fb276b70c).

E1 (e_r2.cjs): code -13 (measured, W1). Library lines 3047 and 3115 only; three stub length fields; connections equal.
E2: the inline FORCED form equals line 2033's form.
E5: runner check, 352 nodes, 0 fail.
E6: the EHF2 joint differs from the three-part joint only at lines 3047 and 3115; +1,270 code against s120.

E3 (e3_r2.cjs, stored 34852 Send Back Build, s120 vs EHF2 vs EHF2 joint):
- live output equals stored output for all three seats.
- "gate asks for it": chatgpt 11 -> 0, sol 10 -> 0, luna 0 -> 0. Joint the same.
- FORCED form present: chatgpt 0 -> 9, sol 0 -> 10.
- chatgpt and sol S7 read: "CHANGE TO the BROKEN line ... (on a witness the side answered: FORCED: <Dn vs Cm> -- MEANS ... -- FAILS ...)".
- Line 3115 now reads "CHANGE TO the BROKEN line that names the meaning the answer fails, with its FORCED line (K-G4, ruling 421)". The rev 1 fault (hold-back kept at 3115) is cured.
- joint output == EHF2 output for every seat.
- Prompt delta on 34852 (W1 measure, string characters): luna 0, chatgpt +17, sol +110, total +127. W2 measured +149; the two measures differ by 22 and neither is checked against the other.
