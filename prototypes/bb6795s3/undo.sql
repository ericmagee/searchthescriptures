-- UNDO for the one publish of BB-6795 J2-J7, written before the act. Run the parts in this order, from the furthest step the act reached.
-- Each part says when it applies. __T_PUB__ = the publish time recorded in the act row.
-- What the undo restores: the flow af3c8f7c, derive_debate_outcome 379e6e55, the original CHECK, the 55 (re-measured) rows to FORGED.
-- Behaviour returns with U1 to U4. U5 drops data the new flow saved, so it waits on the advisor's word.

-- U1 (only if A6 ran): widen the CHECK again, so the restored flow's FORGED saves are accepted.
BEGIN;
ALTER TABLE debate_results DROP CONSTRAINT chk_challenger_chain_mark;
ALTER TABLE debate_results ADD CONSTRAINT chk_challenger_chain_mark CHECK (challenger_chain_mark IS NULL OR challenger_chain_mark = ANY (ARRAY['FOOTED','FORGED','STRAINED','SLACK']));
COMMIT;

-- U2 (if A4 published) n8n, not SQL: restore version af3c8f7c-8f68-4365-9d68-c02a979fed17 of moMxiV4Irg1uRBZN and publish it.
--   Verify: versionId = activeVersionId and the nodes read the LIVE md5 column of nodes.txt; no execution running.

-- U3 (only if A6 ran): the rows A6 rewrote go back to FORGED. Rows saved FOOTED by the new flow (at or after __T_PUB__) stay FOOTED.
UPDATE debate_results SET challenger_chain_mark='FORGED' WHERE challenger_chain_mark='FOOTED' AND created_at < '__T_PUB__'::timestamptz;
--   Check: FORGED count and id md5 equal the set recorded in the act row before A6.

-- U4 (if A2 ran): restore derive_debate_outcome from u4_derive_source_379e6e55.sql (pg_get_functiondef text, 15,677 chars, saved 14:02 CDT).
--   Run that file as one statement, then: SELECT md5(pg_get_functiondef('derive_debate_outcome(uuid)'::regprocedure)); -> 379e6e5543f1a74020a060da3adeb64a

-- U5 (if A2 or A3 ran; on the advisor's word only; after U2, since the new Build Save Body writes these columns):
-- ALTER TABLE debate_results DROP COLUMN defender_chain_mark;   -- drops chk_defender_chain_mark with it
-- ALTER TABLE debate_results DROP COLUMN citation_block;
-- ALTER TABLE debate_results DROP COLUMN citation_check;

-- U6 (if A1 ran): the original CHECK. Stops when a FOOTED row remains (one the new flow saved): list those rows and take the advisor's word.
DO $$BEGIN
 IF EXISTS (SELECT 1 FROM debate_results WHERE challenger_chain_mark='FOOTED')
 THEN RAISE EXCEPTION 'undo stopped: FOOTED rows remain; list them first'; END IF;
END$$;
ALTER TABLE debate_results DROP CONSTRAINT chk_challenger_chain_mark;
ALTER TABLE debate_results ADD CONSTRAINT chk_challenger_chain_mark CHECK (challenger_chain_mark IS NULL OR challenger_chain_mark = ANY (ARRAY['FORGED','STRAINED','SLACK']));
-- Check: pg_get_constraintdef reads as in a0_precheck.sql.
