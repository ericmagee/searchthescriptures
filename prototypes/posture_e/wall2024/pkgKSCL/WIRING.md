# pkgKSCL: pkgKSC goes LIVE (W3 2671 (2))

**Trigger.** TRIAL run 33218 raised 0 E-KSC items, so it had 0 false items. That is checked three ways:
- the saved Send Back Build, Alt Send Back Build and Extract Independent Verdict outputs hold no E-KSC or AUDIT v48 text;
- debate_enforcer_log has no E-KSC row;
- KSC.items, run by hand on the three first verdicts (Panel Judge 1-3 outputs) and on the stored single judge, returns [] for each.

By hand: chatgpt counts Premise 4 and Premise 5 (the [DR2] map gives LINK 4 and LINK 5), and its keystone is D6. gemini writes "CONCEDED LINKS: 1" and names no premise. sol and the single judge count 0.

**Caveat.** With no items at all, the TRIAL tested the quiet path only. The send-back and cure paths are tested offline (pkgKSC test 47 OK) and not yet live.

**W3 HELD it (Wall 2693): zero items tested only the quiet path.** The dry replay below covers the firing path. The replay also found a reader miss, now edit 2.

**Dry replay** (`node pkgKSCL/replay_KSCL.cjs`, 22 OK; output in replay_KSCL.txt).
- Real nodes on 33218's saved inputs, as run: Send Back Build raises 0 E-KSC items (live and pkgKSCL), and its items equal the saved output.
- Fired: one true breach is written into gemini's first verdict ("CONCEDED LINKS: 1 -- LINK 6: UNEXHIBITED" under KEYSTONE D6 STANDS). Send Back Build then raises exactly one E-KSC item, S22, for gemini only. The other seats' items are unchanged. The message says TRIAL (live) or ENFORCED (pkgKSCL).
- Send Back Record, with gemini answering KEEP: TRIAL records AUDIT v48 and leaves drv_uncured unchanged; LIVE gives gemini drv_uncured +1 and leaves the others unchanged.
- Send Back Record, with gemini answering CHANGE TO KEYSTONE D6 WITHDRAWN: CURED in both, drv_uncured unchanged, no AUDIT v48 line.
- Library on all 12 verdicts of 33175, 33197 and 33218 (first verdicts where saved), checked against a hand rule written apart from the reader. Three fire, all true:
  - 33175 single: LINK 6 under D6.
  - 33175 gemini: Premise 6 = LINK 6 under D6.
  - 33197 single: Premise 6 = LINK 5 under D5.

  The 33175 single judge fires, as W3 asked.

**Edit 2, reader (found by the replay).** The live reader missed "Premise 6 is UNEXHIBITED" (33175 gemini, a true breach). It also missed "Premise 4, UNEXHIBITED" (33218 chatgpt; no breach there). The TAG reader now accepts a comma, and "is/was/stays/remains", between the number and the tag. Over the 260-verdict scan (scan_KSCL.txt) the hits go from 23 to 26. The 3 added are 31360 gemini (P6 = LINK 5 under D5), 32212 gemini (P6 = LINK 6 under D6) and 33175 gemini (P6 = LINK 6 under D6), each checked by hand. None is lost.

**Edit.** In each of the 5 KSC copies (Send Back Build, Alt Send Back Build, Send Back Record, Alt Send Back Record, Extract Independent Verdict), `const LIVE=false;` becomes `const LIVE=true;`, and the TAG reader gets edit 2.
- An uncured E-KSC item counts once in drv_uncured.
- AUDIT v48 reads "counted in drv_uncured".
- The note reads ENFORCED.
- The single judge stays record-only.

**Build and test.** Run `node pkgKSCL/build_KSCL.cjs [in] [out]` (default: fetchback_live_s12). Then run `node pkgKSCL/test_KSCL.cjs`, which gives 10 OK. The edit is text-exact, so W4 can run it on any fresh fetch-back.
