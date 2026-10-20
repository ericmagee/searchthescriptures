-- J6 SQL DRAFT (BB-6839). Before the one publish (Build Save Body writes defender_chain_mark). Stored rows NULL.
ALTER TABLE debate_results ADD COLUMN defender_chain_mark text;
ALTER TABLE debate_results ADD CONSTRAINT chk_defender_chain_mark CHECK (defender_chain_mark IS NULL OR defender_chain_mark = ANY (ARRAY['FOOTED','STRAINED','SLACK']));
COMMENT ON COLUMN debate_results.defender_chain_mark IS 'The judge''s mark on the defender''s own chain, one definition with challenger_chain_mark (BB-6795 J6, text approved at BB-6839). NULL = run before J6.';
-- UNDO: ALTER TABLE debate_results DROP COLUMN defender_chain_mark;  (drops the CHECK with it)
-- ORDER WITH J4: J4 step 1 widens chk_challenger_chain_mark before publish; this column is added in the same pre-publish step.
