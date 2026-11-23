# ASK 521 build (W4, seat 35), to W3 plan521.md rev 1 (7d2a5c64). NOT written.

Function: public.ask_aar_grades_check(). Live prosrc md5 2e26db98 (3,828 characters); live pg_get_functiondef md5 a692dc78.
Files (md5 of the file bytes):
- before_ask_aar_grades_check.sql: the live definition, as pg_get_functiondef gives it, plus ";".
- after_ask_aar_grades_check.sql: the target definition. Its definition text (without ";") has md5 8cf26f64, and its prosrc has md5 bd213a7c (3,815 characters).

## C1: only the two literals change
- "(cardinality(allp) >= 2 AND NOT bad" becomes "(cardinality(allp) >= 1 AND NOT bad". This literal occurs once.
- "WHEN cardinality(allp) < 2 THEN 'fewer than two non-builder PASS seats'" becomes "WHEN cardinality(allp) < 1 THEN 'no non-builder PASS seat'". This literal also occurs once.
- diff: lines 51 and 52 only.

## C2: rolled-back test on the live database, 08:2xZ 11-23
How it ran: one DO block, with SET LOCAL truth.session_id. It read the output before the change, ran CREATE OR REPLACE with the target, read the output after, and then raised an exception, so everything rolled back. Afterwards, live prosrc read 2e26db98 again.
- There were 55 output rows both before and after.
- ok false -> true, with detail "fewer than two non-builder PASS seats" -> "":
  - snapshot 12 (0fd91b1c, W1);
  - snapshot 61 (3c4d415e and 7567713f, W3);
  - snapshot 63 (3c900d8c, W2);
  - snapshot 64 (b442ca20, W2).
- ok stays false, but detail changes from "fewer than two non-builder PASS seats" to "no non-builder PASS seat":
  - snapshots 16 and 31 (6eac56a9, n 0).
  - This is the second literal of S1 at work. Plan C2 says 16 and 31 are "unchanged". Their ok value is unchanged, but their detail text is not. I report this; I did not hide it.
- No other row changed. No row with a FAIL turned true.
- Snapshot 61 is ASK 516 A1, which was reverted. Its ok true reports only the grade count, not that the build stands (W2, Wall 10410).
- The new count applies to rows graded under the two-grader rule, so snapshot 12 turns true (plan section 3, reading named).

## C3: the attributes are equal
Compared before and after CREATE OR REPLACE inside the same block: owner, ACL, SECURITY DEFINER, proconfig, volatility and result type. attrs_equal is true. The live values are: owner postgres; ACL {postgres=X, service_role=X, lab_seat=X}; SECURITY INVOKER; TimeZone=UTC and DateStyle=ISO, MDY; STABLE.

## Write (on the operator's card only)
Run after_ask_aar_grades_check.sql with SET LOCAL truth.session_id and truth.card in the same call, then read back that prosrc md5 is bd213a7c.
Revert: before_ask_aar_grades_check.sql, the same way.
