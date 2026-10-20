-- A6 J4 STEP 3 (after the publish is verified, no execution running). Replaces bb6819/step3_rewrite_narrow.sql, whose
-- fixed 54-row list is stale: run 27208 saved a 55th FORGED row (0d80d311-5ff2-4d64-8a20-c66a0f14cc4f, 13:22 CDT).
-- Rule: every FORGED row saved BEFORE the publish becomes FOOTED. The new flow writes FOOTED only, so a FORGED row saved at or
-- after the publish is a defect: the step refuses. Replace __T_PUB__ with the publish time (timestamptz, UTC) before running.
-- BEFORE: run falsifier.sql and record both outputs and this set's count and md5 in the act row:
--   SELECT count(*), md5(string_agg(id::text, ',' ORDER BY id)) FROM debate_results WHERE challenger_chain_mark='FORGED';
BEGIN;
DO $$BEGIN
 IF EXISTS (SELECT 1 FROM debate_results WHERE challenger_chain_mark='FORGED' AND created_at >= '__T_PUB__'::timestamptz)
 THEN RAISE EXCEPTION 'refused: a FORGED row was saved at or after the publish'; END IF;
 IF (SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname='chk_challenger_chain_mark')
    <> 'CHECK (((challenger_chain_mark IS NULL) OR (challenger_chain_mark = ANY (ARRAY[''FOOTED''::text, ''FORGED''::text, ''STRAINED''::text, ''SLACK''::text]))))'
 THEN RAISE EXCEPTION 'refused: CHECK is not the widened one'; END IF;
END$$;
UPDATE debate_results SET challenger_chain_mark='FOOTED' WHERE challenger_chain_mark='FORGED' AND created_at < '__T_PUB__'::timestamptz;
ALTER TABLE debate_results DROP CONSTRAINT chk_challenger_chain_mark;
ALTER TABLE debate_results ADD CONSTRAINT chk_challenger_chain_mark CHECK (challenger_chain_mark IS NULL OR challenger_chain_mark = ANY (ARRAY['FOOTED','STRAINED','SLACK']));
COMMIT;
-- AFTER: falsifier.sql again. Pass = FOOTED(after) = FOOTED(before) + FORGED(before); FORGED(after) = 0; STRAINED, SLACK, NULL equal;
-- other_cols_md5 equal before and after (measured on either side of this step only: the A2 and A3 columns change it, so the
-- 13:18 baseline no longer applies).
