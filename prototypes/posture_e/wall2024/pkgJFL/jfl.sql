-- pkgJFL (W3 spec, Wall 2632, part 3; Eric approved 17:21 CST 2026-11-06): the cross-run judge fault ledger. Side-neutral, not a DG.
-- W4 applies this file in its write (revert: jfl_revert.sql). It creates no row in any existing table and changes no existing object.
--  * judge_fault_ledger: one row per counted UNCURED judge item (debate_enforcer_log kind cure or send_back, seat role panel, reserve or
--    alternate). Record-only and TRIAL rows (cure_reason says RECORD-ONLY, TRIAL, "removes no seat" or "not counted") are not faults of a seat.
--  * Filled by a trigger on debate_enforcer_log (insert, or a later change of cure_status or cure_reason); a row that turns CURED or
--    record-only leaves the ledger, unless it was struck (the strike is kept as the record).
--  * Engine faults found by W3 grading are struck with jfl_strike(...), naming the grade file. Struck rows never count.
--  * Counting is by runs, not items, per judge model and fault kind (the item code, e.g. K-V, K-W, E-UNG, E-MNP, E-IMP).
--      3 runs  -> EXAMPLES: the model's judge prompt carries up to 3 of its own past items of that kind (the latest 3 runs), labeled as its faults.
--      3 more runs after the examples start (6 in all) -> ALTERNATE: the model is moved from the panel to the alternates.
--  * model_config_jfl: model_config's rows plus jfl_move, jfl_block, jfl_counts. Accept Models and Fetch Models read it instead of
--    model_config (Init Seats reads jfl_move; Panel, Reserve and Alternate Build read jfl_block).
--  * jfl_report: per model and kind, the counts and state, for the run report.
BEGIN;
CREATE TABLE IF NOT EXISTS public.judge_fault_ledger(
 id bigserial PRIMARY KEY,
 log_id bigint NOT NULL UNIQUE,
 run integer NOT NULL, run_token text NOT NULL, seat text NOT NULL, seat_role text, judge_model text,
 fault_kind text NOT NULL, item text, flagged_line text, cure_reason text,
 struck boolean NOT NULL DEFAULT false, struck_reason text, struck_grade_file text, struck_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS judge_fault_ledger_mk ON public.judge_fault_ledger(judge_model, fault_kind, run);

-- a log row that is a counted judge fault
CREATE OR REPLACE FUNCTION public.jfl_counted(k text, st text, role text, tok text, why text) RETURNS boolean LANGUAGE sql IMMUTABLE AS $f$
 SELECT k IN ('cure','send_back') AND st='UNCURED' AND role IN ('panel','reserve','alternate') AND tok ~ '^ODV1-\d+-'
  AND coalesce(why,'') !~* '(record-only|\mTRIAL\M|removes no seat|not counted)' $f$;

-- the judge model of a seat in a run: the row's own model, else another row of that seat in the run, else model_config
CREATE OR REPLACE FUNCTION public.jfl_model(tok text, s text, m text) RETURNS text LANGUAGE sql STABLE AS $f$
 SELECT coalesce(nullif(nullif(m,''),'deepseek-flash'),
  (SELECT max(x.judge_model) FROM public.debate_enforcer_log x WHERE x.run_token=tok AND x.seat=s AND x.judge_model IS NOT NULL AND x.judge_model NOT IN ('','deepseek-flash')),
  (SELECT c.api_model FROM public.model_config c WHERE c.seat=s LIMIT 1)) $f$;

CREATE OR REPLACE FUNCTION public.jfl_from_log() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $f$
BEGIN
 IF public.jfl_counted(NEW.kind,NEW.cure_status,NEW.seat_role,NEW.run_token,NEW.cure_reason) THEN
  INSERT INTO public.judge_fault_ledger(log_id,run,run_token,seat,seat_role,judge_model,fault_kind,item,flagged_line,cure_reason)
  VALUES(NEW.id,(regexp_match(NEW.run_token,'^ODV1-(\d+)-'))[1]::int,NEW.run_token,NEW.seat,NEW.seat_role,public.jfl_model(NEW.run_token,NEW.seat,NEW.judge_model),
         NEW.rule,left(NEW.item,600),left(NEW.flagged_line,1500),left(NEW.cure_reason,1500))
  ON CONFLICT (log_id) DO UPDATE SET cure_reason=EXCLUDED.cure_reason,judge_model=coalesce(public.judge_fault_ledger.judge_model,EXCLUDED.judge_model);
 ELSE
  DELETE FROM public.judge_fault_ledger WHERE log_id=NEW.id AND NOT struck;
 END IF;
 RETURN NULL;
EXCEPTION WHEN OTHERS THEN
 -- a ledger error never fails a debate_enforcer_log write (W3 2636)
 RAISE WARNING 'jfl_from_log: log row % not put in the ledger: %', NEW.id, SQLERRM;
 RETURN NULL;
END $f$;
DROP TRIGGER IF EXISTS jfl_from_log ON public.debate_enforcer_log;
CREATE TRIGGER jfl_from_log AFTER INSERT OR UPDATE OF cure_status, cure_reason ON public.debate_enforcer_log FOR EACH ROW EXECUTE FUNCTION public.jfl_from_log();

-- strike an engine fault found by W3 grading (run, seat, fault kind, an item pattern); returns the rows struck
CREATE OR REPLACE FUNCTION public.jfl_strike(p_run int, p_seat text, p_kind text, p_item_like text, p_reason text, p_grade_file text) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $f$
DECLARE n int;
BEGIN
 IF coalesce(p_reason,'')='' OR coalesce(p_grade_file,'')='' THEN RAISE EXCEPTION 'jfl_strike: a strike names its reason and its grade file'; END IF;
 UPDATE public.judge_fault_ledger SET struck=true,struck_reason=p_reason,struck_grade_file=p_grade_file,struck_at=now()
  WHERE run=p_run AND seat=p_seat AND fault_kind=p_kind AND item LIKE p_item_like AND NOT struck;
 GET DIAGNOSTICS n=ROW_COUNT; RETURN n;
END $f$;

-- per model and kind: the runs (unstruck), and the state
CREATE OR REPLACE VIEW public.jfl_report AS
WITH r AS (SELECT judge_model, fault_kind, array_agg(DISTINCT run ORDER BY run) runs FROM public.judge_fault_ledger WHERE NOT struck AND judge_model IS NOT NULL GROUP BY 1,2)
SELECT judge_model, fault_kind, runs, cardinality(runs) n_runs,
 CASE WHEN cardinality(runs)>=3 THEN runs[3] END examples_from_run,
 greatest(cardinality(runs)-3,0) runs_after_examples,
 CASE WHEN cardinality(runs)>=6 THEN 'ALTERNATE' WHEN cardinality(runs)>=3 THEN 'EXAMPLES' ELSE 'COUNTING' END state
FROM r;

-- the prompt block of one model (SECURITY DEFINER: Accept Models and Fetch Models read model_config_jfl as anon, and anon has no
-- SELECT on the ledger; run 33195 failed on this. The ledger itself stays closed to anon): for each kind in EXAMPLES or ALTERNATE, up to 3 items, one from each of its latest 3 runs
CREATE OR REPLACE FUNCTION public.jfl_block(p_model text) RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $f$
WITH k AS (SELECT fault_kind, runs FROM public.jfl_report WHERE judge_model=p_model AND n_runs>=3),
 e AS (SELECT DISTINCT ON (l.fault_kind, l.run) l.fault_kind, l.run, l.item, l.flagged_line, l.cure_reason FROM public.judge_fault_ledger l JOIN k USING(fault_kind)
       WHERE l.judge_model=p_model AND NOT l.struck ORDER BY l.fault_kind, l.run, l.id),
 e3 AS (SELECT *, row_number() OVER (PARTITION BY fault_kind ORDER BY run DESC) rn FROM e),
 kinds AS (SELECT k.fault_kind, k.runs, string_agg(format(E'  %s. Run %s: %s\n     Your line: "%s"\n     Why it was left uncured: %s', e3.rn, e3.run, coalesce(e3.item,''), left(regexp_replace(coalesce(e3.flagged_line,''),'\s+',' ','g'),400), left(regexp_replace(coalesce(e3.cure_reason,''),'\s+',' ','g'),400)), E'\n' ORDER BY e3.rn) ex
   FROM k JOIN e3 ON e3.fault_kind=k.fault_kind AND e3.rn<=3 GROUP BY k.fault_kind, k.runs)
SELECT CASE WHEN count(*)=0 THEN NULL ELSE
 E'[[JUDGE FAULT LEDGER]]\nYOUR OWN PAST FAULTS. In earlier debates you (' || p_model || E') left these items uncured after the send-back. Each is your fault under the rules; repeat none of them. Repeated offenses will result in disqualification.\n'
 || string_agg(format(E'%s, in %s runs (%s):\n%s', fault_kind, cardinality(runs), array_to_string(runs,', '), ex), E'\n' ORDER BY fault_kind)
 || E'\n[[END JUDGE FAULT LEDGER]]\n\n' END FROM kinds $f$;

-- model_config's rows, with the ledger's move flag, prompt block and counts
CREATE OR REPLACE VIEW public.model_config_jfl AS
SELECT c.*, coalesce((SELECT bool_or(r.state='ALTERNATE') FROM public.jfl_report r WHERE r.judge_model=c.api_model),false) jfl_move,
 public.jfl_block(c.api_model) jfl_block,
 (SELECT jsonb_object_agg(r.fault_kind, jsonb_build_object('runs',r.runs,'state',r.state)) FROM public.jfl_report r WHERE r.judge_model=c.api_model) jfl_counts
FROM public.model_config c;
GRANT SELECT ON public.model_config_jfl, public.jfl_report TO anon, authenticated, service_role;
GRANT SELECT ON public.judge_fault_ledger TO authenticated, service_role;
COMMIT;
