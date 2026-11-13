-- pkgDFL (W3; ASK 168, the operator's card choice "Record them"): a confirmed closing contradiction is recorded
-- against the debater model. RECORD ONLY: nothing reads this table in a debate; it removes and blocks nothing.
-- Database only. n8n code 0, prompt 0. Run as one transaction. Revert: pkgDFL_revert.sql.
BEGIN;

CREATE TABLE public.debater_fault_ledger (
  id                bigserial PRIMARY KEY,
  log_id            bigint NOT NULL UNIQUE,          -- debate_enforcer_log.id of the enforcer row
  debate_id         uuid,
  run               integer NOT NULL,
  run_token         text NOT NULL,
  side              text NOT NULL CHECK (side IN ('DEFENDER','CHALLENGER')),
  debater_engine    text,
  debater_model     text,
  fault_kind        text NOT NULL,                   -- 'CLOSE-CONTRADICTION'
  source            text NOT NULL,                   -- 'close enforcer' or 'judge contradiction enforcer'
  item              text,                            -- e.g. 'X2 DEFENDER LINK 6'
  link              integer,
  closing_line      text,
  finding           text,                            -- the enforcer's CLOSE-CONTRADICTION line
  struck            boolean NOT NULL DEFAULT false,
  struck_reason     text,
  struck_grade_file text,
  struck_at         timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.debater_fault_ledger IS 'pkgDFL: confirmed closing contradictions per debater model. Record only; no debate reads it.';

CREATE OR REPLACE FUNCTION public.dfl_counted(k text, r text, tok text, it text, why text)
 RETURNS boolean LANGUAGE sql IMMUTABLE AS $f$
 SELECT coalesce(k = 'enforcer_check' AND r = 'E-CLOSECON' AND tok ~ '^ODV1-\d+-'
   AND it ~ '^[XJ]\d+ (DEFENDER|CHALLENGER) LINK \d+$' AND why ~ '^CONFIRMED( --|$)', false) $f$;

CREATE OR REPLACE FUNCTION public.dfl_put(l public.debate_enforcer_log)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $f$
DECLARE v_side text; v_eng text; v_model text;
BEGIN
 IF public.dfl_counted(l.kind, l.rule, l.run_token, l.item, l.cure_reason) THEN
  v_side := (regexp_match(l.item, '^[XJ]\d+ (DEFENDER|CHALLENGER) LINK'))[1];
  SELECT CASE v_side WHEN 'DEFENDER' THEN r.defender_engine ELSE r.challenger_engine END,
         CASE v_side WHEN 'DEFENDER' THEN r.defender_model  ELSE r.challenger_model  END
    INTO v_eng, v_model FROM public.debate_results r
   WHERE r.id = l.debate_id OR r.run_token = l.run_token ORDER BY (r.id = l.debate_id) DESC NULLS LAST LIMIT 1;
  INSERT INTO public.debater_fault_ledger(log_id, debate_id, run, run_token, side, debater_engine, debater_model, fault_kind, source, item, link, closing_line, finding)
  VALUES (l.id, l.debate_id, (regexp_match(l.run_token, '^ODV1-(\d+)-'))[1]::int, l.run_token, v_side, v_eng, v_model,
          'CLOSE-CONTRADICTION', l.seat, left(l.item, 200), (regexp_match(l.item, 'LINK (\d+)$'))[1]::int,
          left(l.flagged_line, 1500), left(coalesce(l.response_line, l.cure_reason), 2500))
  ON CONFLICT (log_id) DO UPDATE SET finding = EXCLUDED.finding, closing_line = EXCLUDED.closing_line,
     debater_engine = coalesce(public.debater_fault_ledger.debater_engine, EXCLUDED.debater_engine),
     debater_model  = coalesce(public.debater_fault_ledger.debater_model,  EXCLUDED.debater_model);
 ELSE
  DELETE FROM public.debater_fault_ledger WHERE log_id = l.id AND NOT struck;
 END IF;
END $f$;

CREATE OR REPLACE FUNCTION public.dfl_from_log()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $f$
BEGIN
 PERFORM public.dfl_put(NEW);
 RETURN NULL;
EXCEPTION WHEN OTHERS THEN
 RAISE WARNING 'dfl_from_log: log row % not put in the debater ledger: %', NEW.id, SQLERRM;
 RETURN NULL;
END $f$;

CREATE TRIGGER dfl_from_log AFTER INSERT OR UPDATE OF cure_reason, item ON public.debate_enforcer_log
 FOR EACH ROW WHEN (NEW.rule = 'E-CLOSECON') EXECUTE FUNCTION public.dfl_from_log();

CREATE OR REPLACE FUNCTION public.dfl_strike(p_run integer, p_side text, p_item_like text, p_reason text, p_grade_file text)
 RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $f$
DECLARE n int;
BEGIN
 IF coalesce(p_reason,'')='' OR coalesce(p_grade_file,'')='' THEN RAISE EXCEPTION 'dfl_strike: a strike names its reason and its grade file'; END IF;
 UPDATE public.debater_fault_ledger SET struck=true, struck_reason=p_reason, struck_grade_file=p_grade_file, struck_at=now()
  WHERE run=p_run AND side=p_side AND item LIKE p_item_like AND NOT struck;
 GET DIAGNOSTICS n=ROW_COUNT; RETURN n;
END $f$;

CREATE VIEW public.dfl_report AS
 SELECT debater_model, fault_kind,
        array_agg(DISTINCT run ORDER BY run) AS runs,
        count(DISTINCT run) AS n_runs,
        count(*) AS n_lines,
        count(DISTINCT (run, link)) AS n_links
   FROM public.debater_fault_ledger WHERE NOT struck GROUP BY debater_model, fault_kind;

ALTER TABLE public.debater_fault_ledger ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.debater_fault_ledger FROM anon, authenticated;
GRANT SELECT ON public.debater_fault_ledger, public.dfl_report TO berean_ro;
GRANT SELECT, INSERT, UPDATE ON public.debater_fault_ledger TO lab_seat;
GRANT USAGE, SELECT ON SEQUENCE public.debater_fault_ledger_id_seq TO lab_seat;
GRANT SELECT ON public.dfl_report TO lab_seat;
COMMIT;
