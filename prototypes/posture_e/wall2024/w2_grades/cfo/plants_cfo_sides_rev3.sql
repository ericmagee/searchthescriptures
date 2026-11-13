\set ON_ERROR_STOP 1
DROP DATABASE IF EXISTS cfo_w2; CREATE DATABASE cfo_w2;
\c cfo_w2
DO $$BEGIN CREATE ROLE lab_seat; EXCEPTION WHEN others THEN NULL; END$$;
DO $$BEGIN CREATE ROLE service_role; EXCEPTION WHEN others THEN NULL; END$$;
DO $$BEGIN CREATE ROLE berean_ro; EXCEPTION WHEN others THEN NULL; END$$;
DO $$BEGIN CREATE ROLE anon; EXCEPTION WHEN others THEN NULL; END$$;
DO $$BEGIN CREATE ROLE authenticated; EXCEPTION WHEN others THEN NULL; END$$;
CREATE TABLE debate_results(id uuid primary key, run_token text, created_at timestamptz default now(), outcome text, cc jsonb);
CREATE TABLE debate_enforcer_log(id serial, debate_id uuid, run_token text, kind text, rule text, item text, cure_reason text, seat text);
CREATE FUNCTION dfl_counted(k text, r text, tok text, it text, why text) RETURNS boolean LANGUAGE sql IMMUTABLE AS $f$
 SELECT coalesce(k = 'enforcer_check' AND r = 'E-CLOSECON' AND tok ~ '^ODV1-\d+-'
   AND it ~ '^(?:[XJ]\d+|NEW) (DEFENDER|CHALLENGER) LINK \d+$' AND why ~ '^CONFIRMED( --|$)', false) $f$;
CREATE OR REPLACE FUNCTION public.cfo_sides(p_debate_id uuid)
 RETURNS text[] LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $f$
 SELECT coalesce(array_agg(DISTINCT s ORDER BY s), ARRAY[]::text[]) FROM (
   SELECT (regexp_match(l.item, '^(?:[XJ]\d+|NEW) (DEFENDER|CHALLENGER) LINK'))[1] AS s
     FROM public.debate_enforcer_log l JOIN public.debate_results r ON r.id = l.debate_id AND r.run_token = l.run_token
    WHERE l.debate_id = p_debate_id AND l.seat = 'close enforcer' AND public.dfl_counted(l.kind, l.rule, l.run_token, l.item, l.cure_reason)) q
  WHERE s IS NOT NULL $f$;
REVOKE ALL ON FUNCTION public.cfo_sides(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cfo_sides(uuid) TO lab_seat, service_role, berean_ro;
-- plants: id letter = case
INSERT INTO debate_results(id,run_token) VALUES
 ('00000000-0000-0000-0000-000000000001','ODV1-1-a'),('00000000-0000-0000-0000-000000000002','ODV1-2-a'),
 ('00000000-0000-0000-0000-000000000003','ODV1-3-a'),('00000000-0000-0000-0000-000000000004','ODV1-4-a'),
 ('00000000-0000-0000-0000-000000000005','ODV1-5-a'),('00000000-0000-0000-0000-000000000006','ODV1-6-a'),
 ('00000000-0000-0000-0000-000000000007','TEST-7-a');
INSERT INTO debate_enforcer_log(debate_id,run_token,kind,rule,item,cure_reason,seat) VALUES
 -- Q1 judge-found J3 challenger, bare CONFIRMED (no reason) -> CHALLENGER
 ('00000000-0000-0000-0000-000000000001','ODV1-1-a','enforcer_check','E-CLOSECON','J3 CHALLENGER LINK 2','CONFIRMED','judge contradiction enforcer'),
 -- Q2 "CONFIRMED (second check) -- x" and "CONFIRMEDLY" and " CONFIRMED" -> none
 ('00000000-0000-0000-0000-000000000002','ODV1-2-a','enforcer_check','E-CLOSECON','NEW CHALLENGER LINK 2','CONFIRMED (second check) -- x','close enforcer'),
 ('00000000-0000-0000-0000-000000000002','ODV1-2-a','enforcer_check','E-CLOSECON','NEW CHALLENGER LINK 2','CONFIRMEDLY -- x','close enforcer'),
 ('00000000-0000-0000-0000-000000000002','ODV1-2-a','enforcer_check','E-CLOSECON','NEW CHALLENGER LINK 2',' CONFIRMED -- x','close enforcer'),
 -- Q3 item "NEW2 CHALLENGER LINK 2" (Record's regex allows NEW 2) -> none (pkgDFL reading)
 ('00000000-0000-0000-0000-000000000003','ODV1-3-a','enforcer_check','E-CLOSECON','NEW2 CHALLENGER LINK 2','CONFIRMED -- x','close enforcer'),
 -- Q4 rule E-ANS (other rule) and kind cure -> none
 ('00000000-0000-0000-0000-000000000004','ODV1-4-a','enforcer_check','E-ANS','NEW CHALLENGER LINK 2','CONFIRMED -- x','close enforcer'),
 ('00000000-0000-0000-0000-000000000004','ODV1-4-a','cure','E-CLOSECON','NEW CHALLENGER LINK 2','CONFIRMED -- x','close enforcer'),
 -- Q5 log row with debate_id NULL but the right token -> none (join on debate_id)
 (NULL,'ODV1-5-a','enforcer_check','E-CLOSECON','NEW CHALLENGER LINK 2','CONFIRMED -- x','close enforcer'),
 -- Q6 two defender rows, one challenger, ordered: -> {CHALLENGER,DEFENDER}
 ('00000000-0000-0000-0000-000000000006','ODV1-6-a','enforcer_check','E-CLOSECON','X1 DEFENDER LINK 4','CONFIRMED -- a','close enforcer'),
 ('00000000-0000-0000-0000-000000000006','ODV1-6-a','enforcer_check','E-CLOSECON','X2 DEFENDER LINK 5','CONFIRMED -- the same link','close enforcer'),
 ('00000000-0000-0000-0000-000000000006','ODV1-6-a','enforcer_check','E-CLOSECON','NEW CHALLENGER LINK 1','CONFIRMED -- b','close enforcer'),
 -- Q7 test token (not ODV1) -> none
 ('00000000-0000-0000-0000-000000000007','TEST-7-a','enforcer_check','E-CLOSECON','NEW CHALLENGER LINK 2','CONFIRMED -- x','close enforcer');
SELECT right(id::text,1) q, cfo_sides(id) FROM debate_results ORDER BY 1;
SET ROLE anon; DO $$BEGIN PERFORM cfo_sides(gen_random_uuid()); RAISE NOTICE $q$anon allowed$q$; EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE $q$anon refused$q$; END$$;
RESET ROLE;
INSERT INTO debate_results(id,run_token) VALUES ('00000000-0000-0000-0000-000000000008','ODV1-8-a'),('00000000-0000-0000-0000-000000000009','ODV1-9-a');
INSERT INTO debate_enforcer_log(debate_id,run_token,kind,rule,item,cure_reason,seat) VALUES
 ('00000000-0000-0000-0000-000000000008','ODV1-8-a','enforcer_check','E-CLOSECON','X1 DEFENDER LINK 3','CONFIRMED -- a','close enforcer'),
 ('00000000-0000-0000-0000-000000000009','ODV1-9-a','enforcer_check','E-CLOSECON','J1 DEFENDER LINK 3','CONFIRMED -- a','judge contradiction enforcer'),
 ('00000000-0000-0000-0000-000000000009','ODV1-9-a','enforcer_check','E-CLOSECON','NEW CHALLENGER LINK 1','CONFIRMED -- b','Close Enforcer');
SELECT right(id::text,1) q, cfo_sides(id) FROM debate_results ORDER BY 1;
