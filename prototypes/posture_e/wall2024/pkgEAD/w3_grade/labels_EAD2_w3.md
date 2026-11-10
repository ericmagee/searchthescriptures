# W3 labels for pkgEAD rev 2 (W1, Wall 4360, commit c8cccbad) and the rebuilt joint, committed before any run of either
Read (static): rev 2 is +1,683 code, Shared Library only; the one changed line now tests the code's note for five positive phrases and no longer tests "code check does not agree". Joint: +2,311, its 8 new library lines are rev 2's 5 and pkgK7C rev 2's 3, none other.

pkgEAD rev 2, expected:
- L1 stored replay: the same 11 items withheld in the same 6 node runs; every other node run byte-equal to live; strong check holds.
- L3 plants of the first grade (g5, g8): a/b, c, f, f2, k SENT; a2, d, e, g, h2 SENT; control, c3 WITHHELD; i, i-first, i2, j as before.
- Ruling on h before the run: the E-HOLD item with a deferral reason is SENT when the code's first finding is a footing quotation. I accept that as a limit (the judge is still asked; no stored E-HOLD item was withheld by rev 1). The label for h becomes SENT.
- New plants, because the test now reads the whole note:
  - n1. Truly bare answer on which the code AGREES with DeepSeek (plant a2 form): SENT. If a "TWO READERS AGREE" note can carry one of the five phrases and withhold: FAIL.
  - n2. Plant a/b (pointer to nothing), with another line of [CR3] that names the verse and holds the words "the answer runs 30 words" inside its first 90 characters, so that the "names ... again" note quotes them: SENT. If WITHHELD: FAIL (a debater's own words must not switch the withhold on).
  - n3. The same with the words "its own layer": SENT. If WITHHELD: FAIL.
- L4 downstream unchanged from rev 1 (same rows for the same 11 items); I recheck the not-sent row text on 34703.

Joint, expected:
- Send Back Build family: joint output byte-equal to rev 2 alone on every stored node run.
- Cure items: joint equal to pkgK7C rev 2 alone on the 497 stored items of five executions.
- Chain of 34703 to the written rows: the differences from live are exactly rev 2's (two E-ANS items not sent, their rows) and pkgK7C rev 2's (three cure log rows), and nothing else before the gate replies.
