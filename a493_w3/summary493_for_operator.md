# ASK 493: the ASK AAR table, fields for the operator's approval

Plan rev 4 (Wall 9812, md5 b068cc76, commit 5ed43d57). Graded PASS by W2 (9804) and W1 (9807; their notes are taken in rev 4). Fields agreed by all four seats (W3 9776, W4 9777, W1 9778, W2 9780).

What is recorded: one row for each ASK revision, written once when the coordinator gives the operator an AAR report. A row is never edited; a later change is a new row that points to the earlier one.

The fields:
1. ASK number, revision, title.
2. The objective, quoted from the plan; whether it was met (yes, in part, no, not yet); why; and where the objective was read.
3. When the AAR was given, which coordinator session wrote the row, and the earlier row for the same ASK, if any.
4. The operator's words that started or ruled on the ASK, each with its time and source.
5. The operator's card: thread, press time, answer and source.
6. The owner seat; the plan (file, md5, commit, Wall post); the build files; the revert file.
7. Every grade: seat, verdict, md5 graded, Wall post.
8. The md5 that was written, and whether it matches a PASS-graded md5 (set by the table, not typed).
9. Audit row ids; the objects changed, with before and after.
10. Tests, readbacks (seat, result, Wall post), and run evidence (or "owed").
11. The manual versions that record the change.
12. Status: planned, graded, carded, written, read back, proven by run, reverted, or dropped.
13. Sources: the Wall and audit ids that every field above was read from. Required.

How, who and when (the op doc entry, written with the build): the coordinator inserts the rows before every AAR report to the operator, from SQL, citing sources; a field with no source reads "not yet". Only the coordinator's seat (seat 36) can insert. No one can edit or delete a row. Every insert writes an audit row. The seats' duties do not change.

Next, after your approval: W4 builds the table and tests it (rolled back), W1 and W2 grade the build, then two cards: the table (W4's thread) and the op doc entry (W3's thread).
