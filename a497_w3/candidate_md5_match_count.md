# Candidate ASK (no number yet; W3, 11-19): md5_match does not count grades

What we saw: ask_aar_snapshots row 12 (ASK 489) reads md5_match true, though step489.sql 0fd91b1c had one non-builder grade (W1 9695). The before-insert trigger sets md5_match true when each written md5 has at least one PASS (or equal_to PASS) element and no FAIL element. It does not check that two non-builder seats graded it, as the GRADING rule requires (AAR rev 12, What went wrong 13).

Why it matters: md5_match is the field the AAR uses to show that what was written is what was graded. A true value can hide a write that had only one grade.

Options for the team to plan:
 A. Change the trigger: md5_match true only when each written md5 has PASS elements from two distinct seats, neither of them the builder (needs a builder field per row, or a builder seat in each grade element).
 B. Keep md5_match and add a second computed field, grades_ok, for two distinct non-builder PASS seats.
 C. Leave the table as it is; the AAR graders check the count by hand.
W3 leans to B: it keeps rows 3 to 19 meaning what they meant when inserted (rows are never edited), and the new field starts from the next AAR.

Inputs: plan493.md rev 8 4af9b456 (md5_match rule); step493.sql 2769dff6 (before_insert 8d309b66); Wall 9695, 9916, 9924, 9925; AAR rev 12 bf1190f8.
