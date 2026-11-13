\set ON_ERROR_STOP 1
\c cfo_w2
DROP TABLE IF EXISTS plant; DROP FUNCTION IF EXISTS wd(uuid);
CREATE TABLE plant(k serial, id uuid, created timestamptz, outcome text, cite_bad_side text);
CREATE FUNCTION wd(p_k int) RETURNS text LANGUAGE plpgsql AS $f$
DECLARE v_review constant text := E'UNGRADED — REVIEW'; v_outcome text; v_created timestamptz; v_bad text; v_side text;
  v_cfo_from constant timestamptz := '2026-11-13 04:30:00+00'; v_cfo text[]; p_id uuid;
BEGIN
  SELECT outcome, created, cite_bad_side INTO v_outcome, v_created, v_bad FROM plant WHERE k=p_k; SELECT id INTO p_id FROM plant WHERE k=p_k;
  IF v_created >= v_cfo_from AND v_outcome IS NOT NULL AND v_outcome <> v_review THEN
    v_cfo := cfo_sides(p_id);
    IF v_cfo @> ARRAY['DEFENDER','CHALLENGER'] THEN v_outcome := 'UNDERDETERMINED';
    ELSIF v_cfo @> ARRAY['CHALLENGER'] THEN v_outcome := 'DEFENDER PREVAILS';
    END IF;
  END IF;
  v_side := CASE WHEN v_outcome IN ('DEFENDER PREVAILS', 'DEFENDER PREVAILS, WEAKENED') THEN 'DEFENDER' WHEN v_outcome = 'CHALLENGER PREVAILS' THEN 'CHALLENGER' END;
  IF v_side IS NOT NULL AND v_side = v_bad THEN v_outcome := v_review; END IF;
  RETURN v_outcome||' | '||coalesce(v_cfo::text,'null');
END $f$;
INSERT INTO plant(id,created,outcome,cite_bad_side) VALUES
 ('00000000-0000-0000-0000-000000000001','2026-11-14','UNDERDETERMINED',NULL),            -- R1 tie UD, challenger forfeits -> DEFENDER PREVAILS
 ('00000000-0000-0000-0000-000000000001','2026-11-14','DEFENDER PREVAILS, WEAKENED',NULL),-- R2 weakened -> DEFENDER PREVAILS (weakened dropped)
 ('00000000-0000-0000-0000-000000000001','2026-11-14','CHALLENGER PREVAILS','DEFENDER'),  -- R3 forfeit then defender citation fails -> review
 ('00000000-0000-0000-0000-000000000006','2026-11-14','UNDERDETERMINED','DEFENDER'),      -- R4 both -> UD, citation not applied
 ('00000000-0000-0000-0000-000000000006','2026-11-13 04:29:59+00','CHALLENGER PREVAILS',NULL), -- R5 one second before write -> unchanged
 ('00000000-0000-0000-0000-000000000006','2026-11-14',E'UNGRADED — REVIEW',NULL);          -- R6 review stays
SELECT k, wd(k) FROM plant ORDER BY k;
