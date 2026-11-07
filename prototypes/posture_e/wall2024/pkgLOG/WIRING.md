# pkgLOG: the enforcer log body sends each long text once

Infrastructure fix (asked by W4 after 33222). One node, one field: Write Enforcer Log `parameters.jsonBody`. No Code node, no wiring, no DB change.

Cause (33222). Write Enforcer Log sends the whole log in one call. The body was 7,659,938 bytes in 687 rows. anon's statement_timeout is
3 s (pg_roles.rolconfig), and the call failed on all 5 tries, 73.6 s in total. Its error output goes to Panel Failure Note, so no log rows
and no outcome were stored. 33218 (5,146,453 bytes) and 33197 (4,348,462 bytes) wrote in time.
The bulk is repeated text: 33222 has only 20 distinct prompt_sent and 20 distinct full_reply texts, and 4.33 MB + 1.75 MB of the
body is copies of them (each item of one call carries that call's whole prompt and reply).

Fix. In the body sent, a prompt_sent or full_reply of 2,000 characters or more that equals the same field of an earlier row is replaced by
`[SAME <field> AS row <n> of this run's log: seat <s>, kind <k>, rule <r>, item <i>]`. Here n counts the body's rows from 1 in sent order,
which is the insert order, so the text is the field of the run's n-th row by id. The first row with each text keeps it whole. Every other
field is sent unchanged. A body with no p_rows array is sent exactly as before. The flow's own enforcer_log (used by later nodes) is unchanged.

Result on saved inputs (test_LOG.cjs, 9 OK): 33222 7,659,938 -> 1,609,671 bytes (288 pointers); 33218 5,146,453 -> 1,104,379; 33197
4,348,462 -> 1,095,924. Every pointer resolves to an earlier row holding the same text, and no other field changes.
Not tested: the database write time itself. This seat has no anon connection, and a 1.6 MB body cannot be passed through the SQL tool.
The evidence is that every deduplicated body is smaller than 33197's body, which wrote in time.

Reading a row's prompt later: if prompt_sent starts with "[SAME prompt_sent AS row n", read row n of the same run_token ordered by id.

Build: `node pkgLOG/build_LOG.cjs` (in: fetchback_live_s16.json, the 7efcffc7 live flow; the base jsonBody is asserted exactly). Plan with both values: plan_LOG.json.
Revert: set jsonBody back to plan_LOG.json base_value.
