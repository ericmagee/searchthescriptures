# Engine manual: entry for ASK 585 (a retried run sends Record Substitution the real debate)

Two changes. W1 passed both (Wall 11318).

## 1. Part 10.0: ADD this entry, before the line "- PARALLEL JUDGES:"

- A RETRIED RUN SENDS RECORD SUBSTITUTION THE REAL DEBATE (ASK 585; engine node Alternate Merge):
    - Why: when n8n retries a crashed execution, every node of the crashed run carries a placeholder item marked isArtificialRecoveredEventItem. Alternate Merge took the Pass Accumulate item whenever that node had executed, so it took the placeholder, and Record Substitution was called with no parameters ("odv1_record_panel_substitution without parameters").
    - What it does: Alternate Merge takes the Pass Accumulate item only when that item is not marked isArtificialRecoveredEventItem; otherwise it takes Alternate Merge 1's item. A normal run is unchanged. Record Substitution, Format Markdown and Panel Tokens are not changed; the child is not changed.
    - Limits: when Alternate Merge 1 also holds only a placeholder, the run fails to Panel Failure Note. Not shown by a run: only a retry of a crashed execution takes the path. Shown offline on three cases (normal; Pass Accumulate not run; placeholder).
    - Size: code +64; prompt 0.

## 2. Part 11.1: REMOVE one clause (it moves to the manual log, word for word)

NOW: `runs 41128 and 41155 crashed out of memory (41147 also failed on 516, at Record Substitution, a separate fault).`
NEW: `runs 41128 and 41155 crashed out of memory.`

Reason: the fault and its fix now stand in the new entry above.

## Result
Manual version 273 to 275; 705,967 to 706,945 characters.
