# pkgKSCL: pkgKSC goes LIVE (W3 2671 (2))

**Trigger.** TRIAL run 33218 raised 0 E-KSC items, so it had 0 false items. That is checked three ways:
- the saved Send Back Build, Alt Send Back Build and Extract Independent Verdict outputs hold no E-KSC or AUDIT v48 text;
- debate_enforcer_log has no E-KSC row;
- KSC.items, run by hand on the three first verdicts (Panel Judge 1-3 outputs) and on the stored single judge, returns [] for each.

By hand: chatgpt counts Premise 4 and Premise 5 (the [DR2] map gives LINK 4 and LINK 5), and its keystone is D6. gemini writes "CONCEDED LINKS: 1" and names no premise. sol and the single judge count 0.

**Caveat.** With no items at all, the TRIAL tested the quiet path only. The send-back and cure paths are tested offline (pkgKSC test 47 OK) and not yet live.

**Edit.** In each of the 5 KSC copies (Send Back Build, Alt Send Back Build, Send Back Record, Alt Send Back Record, Extract Independent Verdict), `const LIVE=false;` becomes `const LIVE=true;`.
- An uncured E-KSC item counts once in drv_uncured.
- AUDIT v48 reads "counted in drv_uncured".
- The note reads ENFORCED.
- The single judge stays record-only.

**Build and test.** Run `node pkgKSCL/build_KSCL.cjs [in] [out]` (default: fetchback_live_s12). Then run `node pkgKSCL/test_KSCL.cjs`, which gives 6 OK. The edit is text-exact, so W4 can run it on any fresh fetch-back.
