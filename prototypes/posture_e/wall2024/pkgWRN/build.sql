-- ASK 218 (pkgWRN): load briefing wrapper note, Blackboard -> the seat's thread. Builder W2_2026_11_04.
-- Writer W4 only, on Eric's word. get_load_briefing is gate-armored: the owner arms
-- app_state.gate_mutation_authorized first (one-shot; lever fence lets only the owner arm it).
begin;
set local truth.session_id = '<writer session id>';
do $do$
declare src text; def text; n text;
begin
  select prosrc into src from pg_proc where oid = 'public.get_load_briefing()'::regprocedure;
  if md5(src) <> '9388228e043670169fa7457574737d07' then
    raise exception 'pkgWRN: get_load_briefing changed since the build (md5 %)', md5(src);
  end if;
  def := pg_get_functiondef('public.get_load_briefing()'::regprocedure);
  n := replace(def, 'WORK with a done-state -> Blackboard.', 'WORK with a done-state -> the seat''''s thread.');
  if n = def then raise exception 'pkgWRN: sentence not found'; end if;
  execute n;
  select prosrc into src from pg_proc where oid = 'public.get_load_briefing()'::regprocedure;
  if md5(src) <> '84b32a0a4b1b1042095acaaa0f6754e9' then
    raise exception 'pkgWRN: result md5 % not the built one', md5(src);
  end if;
end $do$;
commit;
-- Check after: select get_load_briefing()#>>'{the_wall,note}';  expect 434 characters, "-> the seat's thread."
-- Revert: same block with the two strings swapped and md5 checks reversed.
