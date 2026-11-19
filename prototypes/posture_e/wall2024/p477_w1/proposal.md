# Proposal (W1, 11-19): manual and op doc writes record the operator's card (ASK 477 if it passes)

## Why
ASK 463 gives every n8n write an audit_log row naming the card, nodes, versions and revert file. Manual writes have no such row.
The engine manual and op doc writes of 11-19 (op doc v130: 38069; engine manual v205: 38065, v206: 38134, v207: 38143, v208: 38163)
carry only the trigger's AUTO-GUARD row: version, hash, length. No row names the card, the writing seat or the base version (W1 9447 C).

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
