DO $x$ DECLARE m text; BEGIN
  EXECUTE $Q1$DO $p$
DECLARE d text; nd text; a1 text; r1 text; a2 text; r2 text; k1 int; k2 int; m text;
BEGIN
  IF EXISTS (SELECT 1 FROM blackboard WHERE id > 999999) THEN RAISE EXCEPTION 'S4 P REFUSED: board head moved past 999999'; END IF;
  d := pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure);
  IF md5(d) <> 'c69444dbba3e0d8be2611731c3639a0e' THEN RAISE EXCEPTION 'S4 P REFUSED: live md5 % is not c69444db', md5(d); END IF;
  a1 := E'  v_tie_from constant timestamptz := ''2026-10-14 01:45:00+00'';\n';
  r1 := a1 || E'  -- Tie option 1 (ruling 304, BB-8529): a debate created at or after this time resolves an exact tie of counted HELD seats to UNDERDETERMINED.\n  v_tie_ge_from constant timestamptz := ''2026-10-30 23:00:41+00'';\n';
  a2 := E'    IF v_hu * 2 > v_h THEN\n';
  r2 := E'    IF v_hu * 2 > v_h OR (v_created >= v_tie_ge_from AND v_h > 0 AND v_hu * 2 = v_h) THEN\n';
  k1 := (length(d) - length(replace(d, a1, ''))) / length(a1);
  k2 := (length(d) - length(replace(d, a2, ''))) / length(a2);
  IF k1 <> 1 OR k2 <> 1 THEN RAISE EXCEPTION 'S4 HARNESS: anchor counts % and %, each must be 1', k1, k2; END IF;
  nd := replace(replace(d, a1, r1), a2, r2);
  IF md5(nd) <> '0d9d31832738778f1c92716439540e57' THEN RAISE EXCEPTION 'S4 P REFUSED: built md5 % is not 0d9d3183', md5(nd); END IF;
  EXECUTE nd;
  m := md5(pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure));
  IF m <> '0d9d31832738778f1c92716439540e57' THEN RAISE EXCEPTION 'S4 P: after md5 % is not 0d9d3183 (rolled back)', m; END IF;
  RAISE NOTICE 'S4 P WRITTEN: before c69444dbba3e0d8be2611731c3639a0e after %', m;
END
$p$$Q1$;
  m := md5(pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure)); RAISE NOTICE 'after P %', m;
  EXECUTE $Q2$DO $u$
DECLARE d text; od text; a1 text; r1 text; a2 text; r2 text; m text;
BEGIN
  d := pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure);
  IF md5(d) <> '0d9d31832738778f1c92716439540e57' THEN RAISE EXCEPTION 'S4 U REFUSED: live md5 % is not 0d9d3183', md5(d); END IF;
  a1 := E'  v_tie_from constant timestamptz := ''2026-10-14 01:45:00+00'';\n';
  r1 := a1 || E'  -- Tie option 1 (ruling 304, BB-8529): a debate created at or after this time resolves an exact tie of counted HELD seats to UNDERDETERMINED.\n  v_tie_ge_from constant timestamptz := ''2026-10-30 23:00:41+00'';\n';
  a2 := E'    IF v_hu * 2 > v_h THEN\n';
  r2 := E'    IF v_hu * 2 > v_h OR (v_created >= v_tie_ge_from AND v_h > 0 AND v_hu * 2 = v_h) THEN\n';
  k1 := (length(d) - length(replace(d, a1, ''))) / length(a1);
  k2 := (length(d) - length(replace(d, a2, ''))) / length(a2);
  IF k1 <> 1 OR k2 <> 1 THEN RAISE EXCEPTION 'S4 HARNESS: anchor counts % and %, each must be 1', k1, k2; END IF;
  od := replace(replace(d, r2, a2), r1, a1);
  IF md5(od) <> 'c69444dbba3e0d8be2611731c3639a0e' THEN RAISE EXCEPTION 'S4 U REFUSED: restored md5 % is not c69444db', md5(od); END IF;
  EXECUTE od;
  m := md5(pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure));
  IF m <> 'c69444dbba3e0d8be2611731c3639a0e' THEN RAISE EXCEPTION 'S4 U: after md5 % is not c69444db (rolled back)', m; END IF;
  RAISE NOTICE 'S4 U RESTORED c69444db';
END
$u$$Q2$;
  m := md5(pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure));
  RAISE EXCEPTION 'A3 UNDO TEST (rolled back): after U md5 %', m;
END $x$;