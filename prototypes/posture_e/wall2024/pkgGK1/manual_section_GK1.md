# Manual section: pkgGK1 (W2), gate-raised K-G1 is record-only

Where: Shared Library line 1903 (Gate Record kby filter). The line is used by 10 nodes: Gate Build/Record, Alt Gate Build/Record, R2 Alt Gate Build/Record, Alternate Merge 1, Alternate Merge Seat, R2 Alternate Merge, R2 Alternate Merge Seat.

Rule:
- W3 2341 still applies: a gate change that raises a new LIVE K item does not cure and is counted once.
- One exception: the raised item is RULE K-G1 and the gate item is an E-GATE M CONTRADICTION.
  - That gate item offers two lines and the gate reply allows exactly one line per item. Grading the link BROKEN on the item's own unanswered witness (ruling 392) then raises K-G1 on the count line, which the judge had no way to change and no later turn to answer.
  - The change is not uncured for that K-G1. The K-G1 is still written as an "E-GATE NEW ITEM" row marked RECORD-ONLY, not counted.
- Not covered: K-G4, K-F, K-G7 or any other K item raised by a gate change. These stay counted. Example: replay 34626 luna, where the new BROKEN line lacked the quoted pressing sentence.

Limit:
- The verdict keeps DEFENDER LINK BROKEN with CONCEDED LINKS 0.
- That inconsistency is recorded, not repaired.

Size (measured): +97 code on s113, prompt 0.
Joint with pkgOON: +137 code. Both edit the same 10 nodes, so they are a joint file.
