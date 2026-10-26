# Rev 9 portion 1, DoD 20 verify (Worker_A3), BB-7397: Worker_E build 9217afe (falsifiers f6a178d), branch claude/untitled-9jle0o
1. Flow: exactly three nodes change from cdb7319 (Build Save Body, Panel Payloads, Alternate Payloads). saveBody's four are null; sj_values beside it;
   STATED VALUE STORED rewritten. Payloads: live from saveBody+sj_values; regrade uses the row only while panel_verdict is null (Regrade Row is select=*).
2. Function patch (sql/derive_dod20_patch_fragment.sql) read whole: asserts md5 173f9465 and four anchors once each; majority over v_counted
   (clean=true), more than half, first stamp only (CASE on the OLD panel_verdict), null plus one review_notes line when no majority.
3. My own rolled-back run (A3_F20_rolledback.sql, after a status-only poll: newest ODV1 28269 success, none running):
   patched = installed md5 450aebe1. F20: SELF-SUPPORTED 0 SELF-SUPPORTED 0; review_notes md5 ed33f372 unchanged; split 3-0, outcome
   UNDERDETERMINED, pv HELD, fv HELD, fp d2fe28ee as stored. My split case (glm PROP-DEPENDENT, grok COLLAPSED with 2 conceded): defense null,
   conceded 0 (two of three), the PANEL STANDINGS line naming the three seats. After: live fn 173f9465, row and judgments as stored.
4. f20cd.cjs re-run: equal to E's on base13 and new13. run13.sh on the final tree: rev 8 set equal; report equal to cdb7319's but the clock line.
