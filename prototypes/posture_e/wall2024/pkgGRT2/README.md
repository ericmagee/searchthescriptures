# pkgGRT2 (D53): a reachable regrade for a FORCED retraction whose collision line is not asked (W1, 11-08)
Spec: W3 ruling 3143 on W2 observation 3141, route (a). W2 handed it over at Wall 3420.
Fault: a FORCED-line E-COL ask offers "CHANGE TO: RETRACTED: <pair>", but pkgRFL applies that only once the pair's collision line is no longer
LINK BROKEN. When no collision ask for the pair is in the same send-back, the judge cannot regrade that line, so the retraction is refused.
Change (base fetchback_live_s68; texts from pkgRTB/rule_table.cjs RXSB.companion / forcedPointer):
- Send Back Build x3: for such a FORCED ask, when the judge's text grades the pair's collision line LINK BROKEN (one such line), add one
  companion E-COL ask for that line (next S number, within the 60-item limit), with record-only text; the FORCED ask names it ("where it is
  asked (ITEM Sn)"). The companion gets no pkgECF rule text. Items carry grt2 {forced, pair} only on companions.
- Send Back Record x3: a companion is never silence, gets no E-ANS/E-PREM/E-COL cure reading, is never counted; answered -> CURED with a
  COMPANION ASK note.
- The gate apply (library sbApply2024) is unchanged: it already applies the regrade and then the RETRACTED in one map (pkgRFL checks after).
Tests (run from wall2024/): node pkgGRT2/test_GRT2.cjs (3 OK: 68 Build runs, 61 byte-equal, 7 send-backs get 12 companions = every stuck
case found by measure_GRT2.cjs; Record 67/67 byte-equal on saved runs). node pkgGRT2/test_GRT2_apply.cjs (7 OK: 33411 gemini S5/S11 through
the Record and the s68+KWI library sbApply2024: RETRACTED alone NOT APPLIED; with the companion regrade both apply).
Live bar: a run where a FORCED retraction has no collision ask; the companion is asked and a retraction with its regrade applies.
Not a DeepSeek fix.
