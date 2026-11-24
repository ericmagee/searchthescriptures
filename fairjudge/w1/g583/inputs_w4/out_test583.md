# ASK 583 test run, 21:00 CST 2026-11-23 (rolled back; checked after: no table, no log column, engine_manual_apply md5 178e77e4 as live, 0 audit rows)
migration583.sql 4e7becd4 + test583.sql 130ad0cc, one execute_sql call: BEGIN; SET LOCAL truth.session_id; migration; DO block ending in RAISE EXCEPTION.
Base: engine_manual v241 d0e9efda3280624ce987050bc9568197, 707,670. Scratch cut: 4 parts at version 242 (00.0@100, 09.0@200, 10.0@300, 18.0@400).
- Empty table: anon engine_manual_full() = v241, md5 d0e9efda, 707,670; engine_manual_apply preview works (md5 d0e9efda); old TOC served.
- C1-like: join of the 4 parts equals v241 (md5 and length): true; full version 242.
- C3: engine_manual_apply with parts present: "the engine manual is held in parts since version 242; use engine_manual_part_apply".
  part_apply as lab_seat on 18.0: preview then write, version 243 (= max + 1); log row version 243, part 18.0, title = p_title.
  pair occurring 3 times refused; wrong base md5 refused; stale base version refused.
- anon: reads engine_manual_full (version 243, 707,677) and engine_manual_part; part_apply "permission denied for function"; INSERT "permission denied for table".
- C4: UPDATE, DELETE, TRUNCATE refused by the guard; insert audit row carries card=TEST583 card and session.
- C3b: split 09.0 at a top-level bullet (p_at occurs once) -> 09.5 at order 250, version 244; full md5 unchanged; join of 09.0 + 09.5 = old part; TOC lists 5 parts.
  p_at 104 times refused; p_at 0 times refused; existing name 09.5 refused.
- C9: p_at at the start of the part refused ("the part would be left empty").
- C10: name 10.x refused by part_split; name 9.1 refused by the table check.
- C8: last part 18.0 split -> order_index 500; duplicate order_index 100 refused by the guard;
  eight splits in a row between 1000 and 1001 all succeed (1000.5 down to 1000.00390625), order right, join "a1 ... a9zz" exact; latest order_index unique: true.
- C5: TOC 15 lines, 15 distinct, every length equals length(engine_manual_part(part)); TOC order equals order_index order.
- C6b: table ACL {postgres=arwdDxtm, service_role=arwdDxtm, anon=r, authenticated=r, berean_ro=r, obsidian_ro=r, lab_seat=ar}; RLS on;
  policies anon_ro_engine_manual_parts {anon,authenticated} SELECT true, obsidian_ro_select {obsidian_ro} SELECT true;
  part_apply and part_split EXECUTE postgres, service_role, lab_seat only; engine_manual_part, _full, _toc EXECUTE PUBLIC, anon, authenticated, service_role, lab_seat; all SECURITY INVOKER;
  engine_manual_apply ACL unchanged; engine_manual_log.part text.
