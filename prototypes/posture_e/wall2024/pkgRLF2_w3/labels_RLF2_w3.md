# W3 labels for the grade of the bare round-label fix (W2, "round-label fix rev 2"), written before the package is posted

Base: live s108. Node expected to change: Close Enforcer Record only. I have not read W1's labels (pkgRLF2_w1/).

PASS needs every line as labeled.
- L1 Only Close Enforcer Record differs from live; no prompt text; measured size stated by me.
- L2 The two real replies (staged_w4/check34108_s108/, X sends 1 and 2, labels "[3]" and "[4]") are recorded CONFIRMED on the defender's link 6 as sent. Before the fix: UNREADABLE, NOT CONFIRMED (form).
- L3 No change on any other stored reply: every stored per-side reply (set A, set C, the pkgRAC replay, the control, the Y sends) gives the same Record output through live and through the fix, field for field.
- L4 A bare number is read as the line's OWN side's round only. Plants: a DEFENDER line "[3]"/"[4]" whose quotations stand only in the challenger's rounds 3 and 4: NOT CONFIRMED. A CHALLENGER line "[3]"/"[4]" true in its own rounds: CONFIRMED.
- L5 Round limits kept. Plants: EARLIER "[4]" (not rounds 1 to 3): NOT CONFIRMED; CLOSING "[3]": NOT CONFIRMED; "[0]", "[5]", "[34]", "[]": NOT CONFIRMED, logged, no throw.
- L6 A bracketed number inside a quotation is not taken for a label. Plants: quotation text holding "[3]" or "[L3]" with good "[CR3]"/"[CR4]" labels: same result as live. A line with good labels whose why-sentence holds "[4]": same as live.
- L7 Mixed forms in one line ("[3]" with "[CR4]"; "[round 3]" with "[4]"; "3" unbracketed if the fix accepts it): each read as the side's round, quotations checked in the rounds so read.
- L8 A verse reference is not a label: EARLIER "[Luke 1:35]" or "[1:35]": NOT CONFIRMED (form).
- L9 Rolled-back insert of the rows from L2 through record_enforcer_log: accepted.
- L10 Failure path: a reply with only bare-label lines that all fail the quotation check logs NOT CONFIRMED rows, never a silent drop and never NONE FOUND.
