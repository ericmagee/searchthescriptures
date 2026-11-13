# pkgG8S: serve Sight 266 to the Oracle (ASK 212)

Builder: W1. Operator approval: 2026-11-13 02:59 CST, W3 thread, his item 2 ("approved"), on W1's ask in Wall 5737.

## Change (five statements, one transaction, in this order; rev 2 added 4, rev 3 adds 0)
0. new_0_guard_check.sql (rev 3, ASK 213): the table CHECK guard_served_sets_sight_numbers_check goes from cardinality <= 11 to <= 12. The ASK 212 write was refused by this rule and rolled back.
1. new_guard8.sql: guard 8 sight_numbers gains 266 at place 12. ruled_ref gains the approval line. WHERE pins the live array.
2. new_debate_arsenal_guarded.sql: g8 LIMIT 11 becomes 12.
3. new_debate_sight_links.sql: g8 LIMIT 11 becomes 12, so both functions keep computing the same guard set.
4. new_sight266_passage.sql (rev 2, W3 finding): Sight 266 primary_passage, which is served as the passage anchor, goes from "Matt 1:18-20; Deut 19:15; Deut 22:23-24; Deut 24:1" to "Matt 1:18-20" (50 to 12 characters, -38). This is a removal only.

Without 2 and 3, Sight 266 is 12th and falls past the limit.

Revert: the five revert_*.sql files, in this order: revert_debate_arsenal_guarded.sql, revert_debate_sight_links.sql, revert_guard8.sql, revert_sight266_passage.sql, then revert_9_guard_check.sql last. The function files equal live (md5 337bb576 arsenal, 7fd09f8e sight links).

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
- Prompt: Init with Guards serves guard-set rows whole. Rev 2: the new line is 1,778 characters (rev 1 was 1,816; measured by SQL) (label, status, passage, and the 1,708-character title and summary). It is added to the held-conclusions section of the seat prompt on every topic that triggers guard 8.

## Rev 3: rules on the tables touched (read 2026-11-13)
- guard_served_sets has one CHECK on the sight count (now raised) and one CHECK requiring at least 1 trigger term (unchanged). It has no row triggers.
- The event triggers gate_armor_ddl and gate_armor_drop guard only the listed functions and event triggers. Neither the table nor its constraint is listed, so no flag is needed. ddl_audit_trigger and drop_audit_trigger log the ALTER.
- kb_sights row triggers on UPDATE, checked against Sight 266:
  - layer_status L1-L2-L3 is unchanged, so its check passes.
  - production_safe is recomputed and stays true (ESTABLISHED, L1-L2-L3).
  - The LXX fence: no LXX in the row.
  - The seed/blood fence: 0 seed and 0 blood, so no block and no flag.
  - The embedding fence: no-op, since production_safe is true.
  - flag_conclusions fires only on a status change, so it is a no-op.
  - snapshot_kb_sights and zz_notify_n8n_update fire, as on any update.
- Revert order: revert the functions, then revert_guard8.sql and revert_sight266_passage.sql, then revert_9_guard_check.sql last.
