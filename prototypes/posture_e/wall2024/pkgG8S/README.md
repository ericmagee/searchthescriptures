# pkgG8S: serve Sight 266 to the Oracle (ASK 212)

Builder: W1. Operator approval: 2026-11-13 02:59 CST, W3 thread, his item 2 ("approved"), on W1's ask in Wall 5737.

## Change (three statements, one transaction)
1. new_guard8.sql: guard 8 sight_numbers gains 266 at place 12. ruled_ref gains the approval line. WHERE pins the live array.
2. new_debate_arsenal_guarded.sql: g8 LIMIT 11 becomes 12.
3. new_debate_sight_links.sql: g8 LIMIT 11 becomes 12, so both functions keep computing the same guard set.

Without 2 and 3, Sight 266 is 12th and falls past the limit.

Revert: the three revert_*.sql files. The revert function files equal live; md5 of the live definitions is 337bb576 for the arsenal and 7fd09f8e for sight links.

## Checks
- All 12 sights are production_safe.
- Sight 266 is in no kb_sight_links row and is not returned by debate_arsenal_linked, so debate_sight_links output does not change.
- Replay on "Did Christ have a biological father?" (the run 36212 topic), using a read-only query of the new body with the new array:
  - 30 rows against live's 29.
  - S-266 is at place 12.
  - The other 29 rows are equal to live, in the same order.
  - conclusion_text grows by +1,708.
- Init with Guards caps held conclusions at 40 rows. 30 is under the cap, so no row is displaced.

## Size
- Code: +0 characters in each function (11 to 12). The guard row gains 1 array element and a ruled_ref line.
- Prompt: Init with Guards serves guard-set rows whole. The new line is 1,816 characters (label, status, passage, and the 1,708-character title and summary). It is added to the held-conclusions section of the seat prompt on every topic that triggers guard 8.
