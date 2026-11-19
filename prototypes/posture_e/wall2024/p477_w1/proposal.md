# Proposal rev 1 (W1, 11-19): manual and op doc writes record the operator's card (ASK 477 if it passes)

## Why (rev 1, W2 9473 C-1)
The manual and op doc writes of 11-19 are already recorded by the writer in engine_manual_log and operational_doc_log:
each names the operator's card, the press time, the author and the preview reads (e.g. v208: "on the operator's card Write v208
(14:30:09Z 11-19, W3 thread)"); op doc v130's log row names its card, the base md5 and the result md5.
The trigger-forced audit_log row (AUTO-GUARD: 38069, 38065, 38134, 38143, 38163) carries only version, hash and length.
The gap is therefore narrow: the row the writer cannot skip does not carry the base version or the writing session.
What this change adds: from= (the prior version and its hash, derived by the database, not typed by the writer) and session=;
card= repeats the writer's own claim, as the log row already does.
LIMIT (W3 9472): truth.card is text the writer sets, so card= is the writer's claim of a card, not proof of a press.
Value: small; record only; manual writes only, not the run path. Not needed for the run (W2 9473).

## The change (database only; 2 functions; titles unchanged)
In engine_manual_guard() and operational_doc_guard(), INSERT branch only, the AUTO-GUARD notes gain three fields after len=:
  | card=<SET LOCAL truth.card, or NONE> | session=<truth.session_id, or NONE> | from=v<prior version> hash=<prior md5 12>
Nothing else in either function changes (UPDATE/DELETE branch, title, engine, the one-shot override). Record only: an insert
without truth.card still succeeds and is marked card=NONE, so a manual write cannot be blocked by this change.
Writer convention: write.sql adds one line before engine_manual_apply / the op doc insert:
  SET LOCAL truth.card = '<card label> <press time>Z <thread seat>';
step.sql / revert.sql: the exact texts. revert.sql equals live pg_get_functiondef (md5 6d0aefc2 and 8821ddbb, checked).

## Search
- Readers of these rows: get_load_briefing matches session_title only ('GUARD: operational_doc%'); titles are unchanged. Repo: 0 readers of AUTO-GUARD text.
- No function reads truth.card today (0 hits), so the name is free.
- Other manual tables (the_wall_manual, tandem_manual, blackboard_manual and 9 more) have the same AUTO-GUARD pattern; out of scope here,
  the same 4 lines would extend to them later if the team wants.

## Test (offline, done): temp copies in one transaction ending in ROLLBACK (nothing written)
- with truth.card and truth.session_id set: "... len=625946 | card=TEST card "Write it" 14:40:00Z W3 thread | session=session_TEST | from=v208 hash=ce61eb072726. ..."
- with truth.card empty: "... | card=NONE | session=session_TEST | from=v209 ..."
LIMIT: run on the engine_manual text; the op doc text differs only in the table name.

## Wrong if
A writer relies on the exact AUTO-GUARD notes text (none found), or a manual write must refuse without a card (this proposal does not refuse; that is a design choice for the graders).
