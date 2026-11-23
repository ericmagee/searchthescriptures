# ASK 521 plan (W3, seat 33), rev 1, 2026-11-23. A PLAN ONLY; nothing is written.
Assigned by the coordinator, 02:14 CST 11-23 (posted at Wall 10400). It follows from the operator's "update the manual to just 1 grader." (02:05 CST) and op doc v139 (written on his card at 08:13:25Z; read back by W2, Wall 10398).

## 1. OBJECTIVE
ask_aar_grades_check (ASK 498) counts one non-builder PASS seat per written md5 as enough, matching op doc v139 section 29. Every other test it makes is unchanged.
Expected effect: on the live table today, four rows turn ok true, because each has exactly one non-builder PASS and no FAIL:
- snapshot 12 (0fd91b1c, W1);
- snapshot 61 (3c4d415e and 7567713f, W3);
- snapshot 63 (3c900d8c, W2);
- snapshot 64 (b442ca20, W2).
Snapshots 16 and 31 stay ok false, because they have no non-builder PASS.

## 2. ROLES
- Planner: W3 (seat 33).
- Builder: W4 (seat 35).
- Grader: W2 (seat 32).
- Write card: W4's thread.
- The op doc sentence is W3's, written after a read, on a card in W3's thread.

## 3. SCOPE, with SEARCH
SEARCH:
- Scope: every public function body (pg_proc, public schema), for "non-builder" and "fewer than two".
- Hit: ask_aar_grades_check() only. Live prosrc md5 2e26db98, 3,828 characters.
- No other function, and no trigger, counts grader seats. ask_aar_snapshots_before_insert sets md5_match from any PASS, and is unchanged.
- No n8n workflow touches these tables: they are written only from seat 36 through SQL.
- Op doc v139: the ASK 498 sentence reads "(fewer than two non-builder PASS seats, a FAIL, or an equal_to with no proof seat)".

CHANGE:
- S1. In ask_aar_grades_check, two literals change:
  - "cardinality(allp) >= 2" becomes "cardinality(allp) >= 1" in the ok expression;
  - "WHEN cardinality(allp) < 2 THEN 'fewer than two non-builder PASS seats'" becomes "WHEN cardinality(allp) < 1 THEN 'no non-builder PASS seat'".
  This is CREATE OR REPLACE with the same signature, owner, grants, SECURITY setting and search_path as live. W4 reads these before the build.
- S2. Op doc: "(fewer than two non-builder PASS seats," becomes "(no non-builder PASS seat,". W3 writes it after a read, on a card in W3's thread.
- Not changed: the trigger checks, the builder-row checks, the FAIL test, the equal_to proof rules, or the one-seat proof note.
- The count applies to every row the function reads, including rows graded when two graders were the rule. This is a reading of the operator's words, and the build post names it.

## 4. CRITERIA and DONE
- C1: the new prosrc differs from live (2e26db98) only in the two literals. A diff is shown.
- C2: in a rolled-back transaction on the live database, the function's output changes only on snapshots 12, 61, 63 and 64. They go from ok false to ok true, and their detail moves from "fewer than two non-builder PASS seats" to "". Every other row, including 16 and 31, is unchanged.
- C3: the function's attributes (owner, ACL, SECURITY, search_path, volatility, return type) equal live.
- DONE: C1 to C3 pass, the write is read back, and the op doc sentence is written and read back.

## 5. WRONG-IF
This plan is wrong if any row changes in C2 other than those four, or if a row with a FAIL or FAIL ON FORM on its md5 turns ok true.
- Known-bad: snapshot 16 has 0 PASS, so it must stay ok false.
- Known-good: snapshot 12 has 1 non-builder PASS and no FAIL, so it must turn ok true.

## 6. RUN EVIDENCE
NO PROBE: this is a SQL function. The evidence is the C2 output after the write, run live.

## 7. INPUTS IN GIT
This plan's commit is on the Wall post. W4 commits the before and after prosrc and the C2 output at build.

## 8. STEPS
1. W2 grades this plan. Waits on: nothing.
2. W4 builds S1 and runs C1 to C3 rolled back. Waits on: step 1.
3. W2 grades the build. Waits on: step 2.
4. W4 writes on the operator's card in W4's thread, then reads it back. Waits on: step 3.
5. W3 writes S2 after a read, on the operator's card in W3's thread. Waits on: step 4.
