# W1 grade: ASK 583 step 6.3 migration (W4)

GRADE: PASS. Files: migration583.sql 4e7becd4, test583.sql 130ad0cc, out_test583.md 3ba68fe1 (copied into fairjudge/w1/g583/inputs_w4/ in this commit, because they were on the mount only).
RULES READ: plan draft 2c sections 4.1, 4.4 a to f, 4.5, C3, C3b, C4, C5, C6 b, C8 to C10; operator ruling 20:52 CST 11-23 (no cap); op doc v143 s4 (DDL), s29 (grading), s30 (writes).
OBJECTIVE MET: yes, for this step. The objects let a seat read and write one part; nothing refuses by size; engine_manual_apply works until the cut and refuses after.

## What I ran (my own checks)
1. Read all 22,463 bytes of the migration and the whole test script.
2. engine_manual_apply: the migration body with its one refusal block removed has md5 f1e515f23cb37782e513358d41b7229f, the same as the live prosrc. Only the refusal is added.
3. engine_manual_toc: the fallback (from "SELECT content, version INTO" to END) has md5 829c3fe2, 1,170 characters, the same as the live prosrc section. The old TOC is served unchanged until the cut.
4. Live roles: lab_seat and service_role have BYPASSRLS, so part_apply and part_split work for lab_seat under RLS without an INSERT policy. berean_ro has no policy, as on engine_manual today (plan 3.5). engine_manual_log has RLS off, and lab_seat holds INSERT on it.
5. I did not rerun the test. A retyped copy through the SQL tool would not be the file at 4e7becd4. My readback after the write runs C5 and C6 b against the live objects.

## Criteria (from W4's run, out_test583.md, checked against the test code)
- C3: preview and write on 18.0 as lab_seat give max+1 and a log row with the part; a pair found 3 times, a wrong md5 and an old base are refused; with parts present, engine_manual_apply returns the pointer message. PASS.
- C3b: the split of 09.0 at one bullet keeps the full md5 and joins back to the old part; the TOC lists 5 parts; p_at found 104 times and 0 times are refused; an existing name is refused. PASS.
- C4: UPDATE, DELETE and TRUNCATE are refused; the audit row carries the card and session. PASS.
- C5: each TOC length equals the part length, and the TOC order equals the order_index order. PASS.
- C6 b: the ACL, RLS, the two policies and the function EXECUTE lists match 4.4 e; everything is SECURITY INVOKER; the engine_manual_apply ACL is unchanged. PASS.
- C8: splitting the last part gives +100; a duplicate order_index is refused; eight splits at one place keep the order and the join exact. PASS.
- C9: an empty piece is refused. PASS. C10: a bad name is refused by part_split and by the table check. PASS.
- No refusal by size anywhere: there is no length check in the table, part_apply or part_split. PASS.

## Notes (not conditions)
N1. The split's log row records char_len as the length of the kept piece only. The new piece's length is in the function's result, not in the log.
N2. out_test583 gives engine_manual_apply as "md5 178e77e4", which is another measure (likely the full definition). My item 2 uses prosrc.
