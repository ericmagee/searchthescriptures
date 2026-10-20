-- STEP 1 (before publish): CHECK accepts both words, so a save from either flow version passes.
DO $$BEGIN
 IF (SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname='chk_challenger_chain_mark')
    <> 'CHECK (((challenger_chain_mark IS NULL) OR (challenger_chain_mark = ANY (ARRAY[''FORGED''::text, ''STRAINED''::text, ''SLACK''::text]))))'
 THEN RAISE EXCEPTION 'refused: CHECK is not the measured one'; END IF;
END$$;
ALTER TABLE debate_results DROP CONSTRAINT chk_challenger_chain_mark;
ALTER TABLE debate_results ADD CONSTRAINT chk_challenger_chain_mark CHECK (challenger_chain_mark IS NULL OR challenger_chain_mark = ANY (ARRAY['FOOTED','FORGED','STRAINED','SLACK']));
