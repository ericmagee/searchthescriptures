# ASK 421 plan rev 1 (W2): the database clock and the read-through

Assignment (W3 Wall 8826): plan W2, build W1, grade W3 and W4. Database writes: a card in W4's thread before any CREATE.
No engine node, no model setting and no existing function body is changed. Nothing is dropped.

## Search before scope (ASK 415), read 16:3x CST 11-18
- Functions present: wall_reply(bigint,text,text,text,text), wall_reply_p2 (same body), wall_open, wall_open_p2, wall_read, wall_list, wall_rest.
  No stamp function exists. No manual apply function exists.
- the_wall triggers: the_wall_guard (append-only), the_wall_audit, wall_mint_ref. engine_manual triggers: engine_manual_guard
  (append-only; AFTER INSERT writes an audit_log row). Log table: engine_manual_log (version, entry_date, title, content, char_len, source_offset).
- Every seat posts with the 5-argument wall_reply. That signature and body stay as they are, so no caller breaks.

## (a) wall_stamp() returns text
- Returns '⏱ HH24:MI CST | YYYY-MM-DD' from now() at time zone 'America/Chicago'. STABLE, no arguments, no writes.
- Use: `... || wall_stamp()` in a Wall body, and `select wall_stamp()` before a thread message.
- Limit: the label is fixed "CST", as the post-style rule writes it; in daylight time the clock is still Central.

## (c) wall_reply with a read-through id (new 6-argument overload)
- wall_reply(p_root bigint, p_body text, p_by text, p_session text, p_kind text, p_read_through bigint). No defaults on the
  six-argument form, so a five-argument call can never resolve to it (no overload ambiguity).
- Behaviour: if exists (select 1 from the_wall where id > p_read_through) then return
  {success:false, error:'LATE: posts after <p_read_through>: <ids, up to 20>. Re-read and resend.', later:[ids]} and insert nothing.
  Otherwise call the five-argument wall_reply with the same arguments and return its result, with read_through added.
- Refusal, not a LATE mark: the_wall is append-only, so a marked post could not be corrected later; a refusal costs one resend.
- p_read_through null is refused ('read_through is required on this form').
- Race: two posts in the same second can both pass. Accepted; the check removes the minutes-wide gap that caused the misses
  (W2's late claims at 8761, 8765, 8786, 8791, 8794, 8808; W3's 8819).

## (b) manual_apply for engine_manual
- engine_manual_apply(p_base_version int, p_base_md5 text, p_pairs jsonb, p_expect_md5 text, p_expect_len int,
  p_title text, p_log text, p_write boolean) returns jsonb.
- Steps, all in one call: (1) the base row must be the max version and its md5 must equal p_base_md5, else refuse;
  (2) p_pairs is a json array of {old,new}; each old must occur exactly once in the text as it stands when that pair is applied
  (count reported per pair), else refuse naming the pair; (3) compute md5 and length of the result; (4) if p_write is false,
  return them with the per-pair counts (preview); (5) if p_write is true, refuse unless they equal p_expect_md5 and p_expect_len,
  then insert engine_manual (version base+1, content, summary p_title) and engine_manual_log (same version, current_date,
  p_title, p_log, char_len) and return the new id and md5.
- The engine_manual_guard trigger still writes its audit row; nothing bypasses it.
- Scope: engine_manual only. The other manuals (the_wall_manual, operational_doc and the rest) keep their present path; a
  later ASK can widen it once this one is proven.
- Readers apply the same p_pairs json with p_write false and compare md5: the preview and the write are the same object.

## Tests the build must show (W1), before the card
1. wall_stamp() at the build time equals to_char(now() at time zone 'America/Chicago', ...) by hand.
2. Six-argument wall_reply on a test root: refused with the later ids when read_through < max(id); posts when equal.
   The test posts go on a Wall root opened for the test, not on 2024 or 8816.
3. A five-argument call still posts (resolves to the old form).
4. engine_manual_apply preview on v191 with the v192 pairs (commit 3b88c563, manual_v192_w3/pairs.py) returns
   md5 be475a1e200c2b99f3f72a6e42f33991 and length 567,729; a pair whose old text is absent, or present twice, is refused;
   a wrong base md5 is refused. No write test on engine_manual until the first real manual change uses it.

## Manuals after the build (W3)
- Wall manual: posts use the six-argument form with the id read, and wall_stamp() for the stamp.
- Engine manual: manual versions are written by engine_manual_apply, previewed by each reader with p_write false.

## DONE WHEN (ASK 411 evidence)
- pg_proc lists wall_stamp(), wall_reply(...,bigint) and engine_manual_apply(...); tests 1 to 4 shown on the Wall;
  the first later Wall post by each seat carries a refusal or a success from the six-argument form in its own report;
  the next engine manual version is written by engine_manual_apply (audit_log row plus engine_manual_log row of that version).
