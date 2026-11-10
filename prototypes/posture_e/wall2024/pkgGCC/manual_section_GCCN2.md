# Engine manual section for pkgGCCN rev 3 (W1, for W3 as single writer). Offline; enter only when Eric approves a write.
Package: pkgGCCN rev 3 (narrow form only; the wide form pkgGCC is dropped). Size measured: +735 code on s110 (+7 over rev 2), Shared Library only; no prompt text.

## §9, GATE (add after "the gate's uncured LIVE items are counted in drv_uncured")
- A GATE CHANGE TAKES OFF THE SEND-BACK COUNT OF THE SAME ITEM (pkgGCCN): when the gate answer is CHANGE, the gate change was applied, the item was raised from a send-back change ("E-APPLY Sn"), and Send Back Record counted Sn in drv_uncured for that seat (a "[AUDIT v4x:" or "[AUDIT v51:" line: ... ITEMS: ... Sn (...) ...; counted in drv_uncured" line), drv_uncured drops by one for Sn, never below 0. One counted Sn comes off once, however many gate items name it. A line that reads "not counted in drv_uncured" is not a count. The E-GATE audit line of the first such item adds "; its send-back count comes off".
- Not affected: a gate KEEP; a cure because another change already wrote the line; a silence count; record-only and TRIAL lines; uncured gate items; other seats.
- Two forms are still forgiven (the count comes off): (a) a judge who refused the change at the send-back and yields at the gate with a change the engine applies; (b) a gate change that is applied although its new line would fail the send-back rule of the item it cures (the gate does not run that rule; W2 is building a separate closure for (b)).
- Also taken off, by the same words "was applied": a gate item cured because a later gate change of the same judge rewrote the same line and was applied ("the later gate change Gn ... rewrote the same line (the last change wins) and was applied"). Stored: 10 such items in 2 judgments, none with a counted send-back.

## Validation status (state as written)
- Rev 2 two passes: W2 (commit 2c1ce4ff), W4 (Wall 4280). Rev 3 (adds v51, Wall 4291) awaits regrade by W2 and W4.
- Stored judgment 1062 (gemini): 12 to 11. 34626: written rows unchanged. PLANTED round 2 (Haiku for luna): seated, drv_uncured 1 to 0.
- Unproven in a live run until two clean runs.
