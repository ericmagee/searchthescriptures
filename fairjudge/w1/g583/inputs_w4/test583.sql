-- ASK 583 test: run AFTER migration583.sql in the same call. Ends in RAISE EXCEPTION, so everything rolls back.
DO $t$
DECLARE r jsonb := '{}'::jsonb; v241 text; v241md5 text; x jsonb; e text; f record; c text; toc text;
        p_at text; pos int; b boolean; n int; ok boolean; s text; aud text; lg record;
BEGIN
  PERFORM set_config('truth.card','TEST583 card',true);
  PERFORM set_config('truth.session_id','session_01H1X3AP1fjeQaEbxPP9UEZH',true);
  SELECT content, md5(content) INTO v241, v241md5 FROM engine_manual WHERE version=241;

  -- C6c (database side) and C3 first half: parts table empty
  EXECUTE 'SET LOCAL ROLE anon';
  SELECT * INTO f FROM engine_manual_full();
  r := r || jsonb_build_object('empty_full_anon', jsonb_build_object('version',f.version,'md5',md5(f.content),'len',length(f.content)));
  EXECUTE 'RESET ROLE';
  x := engine_manual_apply(241, v241md5, jsonb_build_array(jsonb_build_object('old','## 18. Write register','new','## 18. Write register')), null, null, null, null, null, false);
  r := r || jsonb_build_object('C3_apply_preview_empty', x->'success', 'C3_apply_preview_md5', x->'md5');
  r := r || jsonb_build_object('toc_empty_starts', left(engine_manual_toc(), 30));

  -- scratch cut: 4 parts at version 242, order 100..400
  INSERT INTO engine_manual_parts(part,order_index,title,version,content,summary) VALUES
   ('00.0',100,'Front and sections 0 to 8',242, left(v241, strpos(v241, E'\n## 9. Enforcers')),'scratch'),
   ('09.0',200,'Enforcers',242, substr(v241, strpos(v241, E'\n## 9. Enforcers')+1, strpos(v241, E'\n## 10. The panel')-strpos(v241, E'\n## 9. Enforcers')),'scratch'),
   ('10.0',300,'Sections 10 to 17',242, substr(v241, strpos(v241, E'\n## 10. The panel')+1, strpos(v241, E'\n## 18. Write register')-strpos(v241, E'\n## 10. The panel')),'scratch'),
   ('18.0',400,'Write register',242, substr(v241, strpos(v241, E'\n## 18. Write register')+1),'scratch');
  SELECT * INTO f FROM engine_manual_full();
  r := r || jsonb_build_object('C1_like_join_equals_v241', md5(f.content)=v241md5 AND length(f.content)=length(v241), 'full_version', f.version);

  -- C4 audit row with card and session
  SELECT notes INTO aud FROM audit_log WHERE session_title='GUARD: engine_manual_parts 18.0 v242 inserted' ORDER BY id DESC LIMIT 1;
  r := r || jsonb_build_object('C4_audit_has_card_session', aud LIKE '%card=TEST583 card%' AND aud LIKE '%session=session_01H1X3AP1fjeQaEbxPP9UEZH%');
  -- C4 update / delete / truncate refused
  BEGIN UPDATE engine_manual_parts SET title='x' WHERE part='18.0'; e:='NOT REFUSED'; EXCEPTION WHEN others THEN e:=SQLERRM; END;
  r := r || jsonb_build_object('C4_update', left(e,60));
  BEGIN DELETE FROM engine_manual_parts WHERE part='18.0'; e:='NOT REFUSED'; EXCEPTION WHEN others THEN e:=SQLERRM; END;
  r := r || jsonb_build_object('C4_delete', left(e,60));
  BEGIN TRUNCATE engine_manual_parts; e:='NOT REFUSED'; EXCEPTION WHEN others THEN e:=SQLERRM; END;
  r := r || jsonb_build_object('C4_truncate', left(e,60));

  -- C3: engine_manual_apply refuses with parts present
  x := engine_manual_apply(241, v241md5, jsonb_build_array(jsonb_build_object('old','## 18. Write register','new','## 18. Write register')), null, null, null, null, null, false);
  r := r || jsonb_build_object('C3_apply_with_parts', x->>'error');

  -- C3: part_apply on 18.0, as lab_seat
  SELECT content INTO c FROM engine_manual_parts WHERE part='18.0' AND version=242;
  EXECUTE 'SET LOCAL ROLE lab_seat';
  x := engine_manual_part_apply('18.0',242,md5(c), jsonb_build_array(jsonb_build_object('old','## 18. Write register','new','## 18. Write register (test)')), null,null,null,null,null,false);
  r := r || jsonb_build_object('C3_part_preview', x);
  x := engine_manual_part_apply('18.0',242,md5(c), jsonb_build_array(jsonb_build_object('old','## 18. Write register','new','## 18. Write register (test)')), x->>'md5',(x->>'length')::int,'log title test','summary test','log text test',true);
  r := r || jsonb_build_object('C3_part_write', x);
  EXECUTE 'RESET ROLE';
  SELECT version, part, title INTO lg FROM engine_manual_log ORDER BY id DESC LIMIT 1;
  r := r || jsonb_build_object('C3_log_row', jsonb_build_object('version',lg.version,'part',lg.part,'title',lg.title));
  SELECT content INTO c FROM engine_manual_parts WHERE part='18.0' ORDER BY version DESC LIMIT 1;
  x := engine_manual_part_apply('18.0',243,md5(c), jsonb_build_array(jsonb_build_object('old',E'\n- ','new',E'\n- ')), null,null,null,null,null,false);
  r := r || jsonb_build_object('C3_twice_refused', x->>'error');
  x := engine_manual_part_apply('18.0',243,'0000', jsonb_build_array(jsonb_build_object('old','## 18.','new','## 18.')), null,null,null,null,null,false);
  r := r || jsonb_build_object('C3_bad_md5_refused', left(x->>'error',40));
  x := engine_manual_part_apply('18.0',242,md5(c), jsonb_build_array(jsonb_build_object('old','## 18.','new','## 18.')), null,null,null,null,null,false);
  r := r || jsonb_build_object('C3_old_base_refused', x->>'error');

  -- anon: reads yes, writes no
  EXECUTE 'SET LOCAL ROLE anon';
  SELECT * INTO f FROM engine_manual_full();
  r := r || jsonb_build_object('anon_full_parts', jsonb_build_object('version',f.version,'len',length(f.content)));
  r := r || jsonb_build_object('anon_part', length(engine_manual_part('09.0')));
  BEGIN x := engine_manual_part_apply('18.0',243,md5(c), '[]'::jsonb, null,null,null,null,null,false); e:='NOT REFUSED'; EXCEPTION WHEN others THEN e:=SQLERRM; END;
  r := r || jsonb_build_object('anon_part_apply', left(e,60));
  BEGIN INSERT INTO engine_manual_parts(part,order_index,title,version,content) VALUES ('99.0',9900,'x',999,'x'); e:='NOT REFUSED'; EXCEPTION WHEN others THEN e:=SQLERRM; END;
  r := r || jsonb_build_object('anon_insert', left(e,60));
  EXECUTE 'RESET ROLE';

  -- C3b split of 09.0 at a top-level bullet
  SELECT content INTO c FROM engine_manual_parts WHERE part='09.0' ORDER BY version DESC LIMIT 1;
  pos := strpos(substr(c, length(c)/2), E'\n- **') + length(c)/2 - 1;
  p_at := substr(c, pos+1, 200);
  n := (length(c)-length(replace(c,p_at,'')))/length(p_at);
  r := r || jsonb_build_object('C3b_p_at_count', n, 'C3b_p_at_head', left(p_at,50));
  SELECT md5(content) INTO s FROM engine_manual_full();
  x := engine_manual_part_split('09.0','09.5','Enforcers (second half)',p_at,242,md5(c),null,null,null,null,null,false);
  r := r || jsonb_build_object('C3b_preview', x);
  x := engine_manual_part_split('09.0','09.5','Enforcers (second half)',p_at,242,md5(c),x->>'md5_old',x->>'md5_new','split log title','split summary','split log',true);
  r := r || jsonb_build_object('C3b_write', x);
  r := r || jsonb_build_object('C3b_full_unchanged', (SELECT md5(content) FROM engine_manual_full()) = s);
  r := r || jsonb_build_object('C3b_join_equals_old', engine_manual_part('09.0')||engine_manual_part('09.5') = c);
  SELECT count(*) INTO n FROM regexp_matches(engine_manual_toc(), E'\n[0-9]{2}\\.[0-9]+ \\|', 'g');
  r := r || jsonb_build_object('C3b_toc_parts', n);
  -- refusals
  SELECT content INTO c FROM engine_manual_parts WHERE part='10.0' ORDER BY version DESC LIMIT 1;
  x := engine_manual_part_split('10.0','10.5','t',E'\n- ',242,md5(c),null,null,null,null,null,false);
  r := r || jsonb_build_object('C3b_p_at_many', x->>'error');
  x := engine_manual_part_split('10.0','10.5','t','NO SUCH TEXT 583',242,md5(c),null,null,null,null,null,false);
  r := r || jsonb_build_object('C3b_p_at_none', x->>'error');
  x := engine_manual_part_split('10.0','09.5','t',left(c,40),242,md5(c),null,null,null,null,null,false);
  r := r || jsonb_build_object('C3b_name_exists', x->>'error');
  -- C9 empty piece
  x := engine_manual_part_split('10.0','10.5','t',left(c,60),242,md5(c),null,null,null,null,null,false);
  r := r || jsonb_build_object('C9_empty_piece', x->>'error');
  -- C10 name pattern
  x := engine_manual_part_split('10.0','10.x','t',substr(c,100,60),242,md5(c),null,null,null,null,null,false);
  r := r || jsonb_build_object('C10_bad_name_split', x->>'error');
  BEGIN INSERT INTO engine_manual_parts(part,order_index,title,version,content) VALUES ('9.1',9100,'x',999,'x'); e:='NOT REFUSED'; EXCEPTION WHEN others THEN e:=SQLERRM; END;
  r := r || jsonb_build_object('C10_bad_name_insert', left(e,80));
  -- C8 last part: 18.0 (order 400) split gives 500
  SELECT content INTO c FROM engine_manual_parts WHERE part='18.0' ORDER BY version DESC LIMIT 1;
  x := engine_manual_part_split('18.0','18.1','t',substr(c,200,80),243,md5(c),null,null,null,null,null,false);
  r := r || jsonb_build_object('C8_last_part_order', x->'order_index_new');
  -- C8 unique order_index
  BEGIN INSERT INTO engine_manual_parts(part,order_index,title,version,content) VALUES ('97.0',100,'x',999,'x'); e:='NOT REFUSED'; EXCEPTION WHEN others THEN e:=SQLERRM; END;
  r := r || jsonb_build_object('C8_dup_order', left(e,80));
  -- C3b / C8: eight splits in a row at the same place (between 98.0 at 1000 and 98.1 at 1001)
  INSERT INTO engine_manual_parts(part,order_index,title,version,content) VALUES ('98.0',1000,'x',999,'a1 a2 a3 a4 a5 a6 a7 a8 a9'),('98.1',1001,'y',999,'zz');
  FOR n IN 1..8 LOOP
    SELECT content, version INTO c, pos FROM engine_manual_parts WHERE part='98.0' ORDER BY version DESC LIMIT 1;
    x := engine_manual_part_split('98.0','98.'||(10+n),'t'||n,' a'||(10-n),pos,md5(c),null,null,null,null,null,false);
    x := engine_manual_part_split('98.0','98.'||(10+n),'t'||n,' a'||(10-n),pos,md5(c),x->>'md5_old',x->>'md5_new','split '||n,'s','l',true);
    IF NOT coalesce((x->>'success')::boolean,false) THEN r := r || jsonb_build_object('C8_eight_fail_at', n, 'C8_err', x); EXIT; END IF;
  END LOOP;
  r := r || jsonb_build_object('C8_eight_order', (SELECT string_agg(part||'@'||order_index, ',' ORDER BY order_index) FROM (SELECT DISTINCT ON (part) part, order_index FROM engine_manual_parts WHERE part LIKE '98.%' ORDER BY part, version DESC) l),
    'C8_eight_join', (SELECT string_agg(content,'' ORDER BY order_index) FROM (SELECT DISTINCT ON (part) part, order_index, content FROM engine_manual_parts WHERE part LIKE '98.%' ORDER BY part, version DESC) l));
  r := r || jsonb_build_object('C8_latest_unique', (SELECT count(*)=count(DISTINCT order_index) FROM (SELECT DISTINCT ON (part) part, order_index FROM engine_manual_parts ORDER BY part, version DESC) l));
  -- C5 map
  toc := engine_manual_toc();
  SELECT bool_and(t.len = length(engine_manual_part(t.part))), count(*), count(DISTINCT t.part),
         bool_and(t.oi_ok) INTO ok, n, pos, b
    FROM (SELECT m[1] part, m[2]::int len, true oi_ok FROM regexp_matches(toc, E'\n([0-9]{2}\\.[0-9]+) \\| [^|]*\\| v[0-9]+ \\| ([0-9]+) chars', 'g') m) t;
  r := r || jsonb_build_object('C5_len_equal', ok, 'C5_lines', n, 'C5_distinct', pos);
  r := r || jsonb_build_object('C5_order', (SELECT string_agg(m[1], ',') FROM regexp_matches(toc, E'\n([0-9]{2}\\.[0-9]+) \\|', 'g') m),
                               'C5_expected', (SELECT string_agg(part, ',' ORDER BY order_index) FROM (SELECT DISTINCT ON (part) part, order_index FROM engine_manual_parts ORDER BY part, version DESC) l));
  -- C6b catalog
  r := r || jsonb_build_object('C6b_table_acl', (SELECT relacl::text FROM pg_class WHERE oid='public.engine_manual_parts'::regclass),
    'C6b_rls', (SELECT relrowsecurity FROM pg_class WHERE oid='public.engine_manual_parts'::regclass),
    'C6b_policies', (SELECT json_agg(polname||' '||polroles::regrole[]::text||' '||polcmd::text||' '||pg_get_expr(polqual,polrelid) ORDER BY polname) FROM pg_policy WHERE polrelid='public.engine_manual_parts'::regclass),
    'C6b_fn_acl', (SELECT json_object_agg(proname, coalesce(proacl::text,'default')) FROM pg_proc WHERE pronamespace='public'::regnamespace AND proname IN ('engine_manual_part_apply','engine_manual_part_split','engine_manual_part','engine_manual_full','engine_manual_toc','engine_manual_apply','engine_manual_parts_guard')),
    'C6b_secdef', (SELECT json_object_agg(proname, prosecdef) FROM pg_proc WHERE pronamespace='public'::regnamespace AND proname IN ('engine_manual_part_apply','engine_manual_part_split','engine_manual_part','engine_manual_full','engine_manual_toc')),
    'log_part_column', (SELECT format_type(atttypid,atttypmod) FROM pg_attribute WHERE attrelid='public.engine_manual_log'::regclass AND attname='part'));
  RAISE EXCEPTION 'TEST583 RESULT %', r;
END $t$;
