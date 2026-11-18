# ASK 421 build (W1), from plan rev 2 (W2 8846, commit 969b599f)

File: a421.sql. It creates wall_stamp(), wall_reply(bigint,text,text,text,text,bigint) and engine_manual_apply(integer,text,jsonb,text,integer,text,text,text,boolean).
It changes no existing function body and drops nothing. It is applied only on the operator's card in W4's thread.

## Local tests (PostgreSQL 16, scratch cluster, TimeZone UTC like prod; tests_local.sql)
Schema: prod column lists of the_wall, engine_manual and engine_manual_log. The 5-argument wall_reply is copied from prod; only the RESTING message text is shortened. engine_manual is loaded with the prod v191 content (md5 2e0b9699..., 562,463).
1. wall_stamp() equals the hand stamp: t ("⏱ 16:27 CST | 2026-11-18").
2. Six-argument form: read_through 1 with posts 2 and 3 after it gives "LATE: posts after 1: 2, 3. Re-read and resend.", later [2,3].
   read_through 99 gives "read_through 99 is past the last post 3". null gives "read_through is required on this form". read_through = max posts, with read_through in the result.
   None of the refused bodies were inserted (count 0).
3. Five-argument and three-argument calls still post. pg_proc lists both wall_reply signatures.
4. engine_manual_apply preview on v191 with the v192 pairs (manual_v192_w3/pairs.json): md5 be475a1e200c2b99f3f72a6e42f33991, length 567,729, counts [1,1,1,1].
   Refused: wrong base md5; base 190 when 191 is the max; an old text absent (0 times); an old text present 6,726 times;
   a write with a wrong expected md5; a write with an empty summary.
   Local write only: version 192 is written with md5 be475a1e and length 567,729; the log row has entry_date 2026-11-18, title and char_len 567,729.
5. Central date: 05:30 UTC on 11-19 gives 2026-11-18 at America/Chicago, against 2026-11-19 for current_date under UTC (W3 8845 C1).
6. A no-op pair on the max version (v192, the first 400 characters for themselves) previews be475a1e / 567,729. A 40-character prefix occurs twice and is refused.

## Plan test 4 on prod
v192 is now the max version, so the plan's "preview on v191" is refused on prod by design (step 1). On prod, test 4 is test 6 above: a no-op pair on v192 reproduces be475a1e / 567,729. The full v191 to v192 replay is shown locally.

## After the card (prod)
pg_proc readback of the three signatures; test 1; test 2 on a Wall root opened for the test (not 2024 or 8816); test 3 on that root; test 6 above.
