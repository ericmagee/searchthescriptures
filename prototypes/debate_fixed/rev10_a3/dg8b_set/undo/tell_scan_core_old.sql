CREATE OR REPLACE FUNCTION public.tell_scan_core(p_draft text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_draft text := COALESCE(lower(p_draft), '');
  v_hits  jsonb;
  v_total int;
BEGIN
  WITH patterns(category, phrase) AS (VALUES
    ('softening_qualifier','while many scholars'),('softening_qualifier','some scholars'),
    ('softening_qualifier','it is also possible'),('softening_qualifier','it''s also possible'),
    ('softening_qualifier','some traditions hold'),('softening_qualifier','we should remain open'),
    ('softening_qualifier','one could argue'),('softening_qualifier','arguably'),
    ('softening_qualifier','to be fair'),('softening_qualifier','it''s worth noting'),
    ('softening_qualifier','it could be argued'),('softening_qualifier','i''m not asserting'),
    ('softening_qualifier','not asserting'),
    ('asymmetric_citation','everyone knows'),('asymmetric_citation','traditional interpretation'),
    ('asymmetric_citation','most commentaries'),('asymmetric_citation','commonly held'),
    ('asymmetric_citation','the standard view'),('asymmetric_citation','scholars agree'),
    ('asymmetric_citation','widely accepted'),('asymmetric_citation','tradition holds'),
    ('asymmetric_citation','it is generally'),('asymmetric_citation','generally understood'),
    ('harmony_collapse','both can be true'),('harmony_collapse','both readings'),
    ('harmony_collapse','in either direction'),('harmony_collapse','on the other hand'),
    ('harmony_collapse','both/and'),('harmony_collapse','either way'),
    ('harmony_collapse','either interpretation'),('harmony_collapse','a fair case either'),
    ('purged_dual_paternity','dual paternity'),('purged_dual_paternity','name-father'),
    ('purged_dual_paternity','blood-father'),('purged_dual_paternity','two-track paternity'),
    ('father_softening_hedge','existence entailed'),('father_softening_hedge','identity withheld'),
    ('father_softening_hedge','father is unnamed'),('father_softening_hedge','father is withheld'),
    ('father_softening_hedge','the father is withheld'),('father_softening_hedge','identity is withheld'),
    ('father_softening_hedge','withheld-father'),('father_softening_hedge','withheld father'),
    ('father_softening_hedge','father withheld')
  )
  SELECT jsonb_agg(jsonb_build_object('category',category,'phrase',phrase) ORDER BY category, phrase)
  INTO v_hits
  FROM patterns WHERE position(phrase IN v_draft) > 0;

  v_total := COALESCE(jsonb_array_length(v_hits), 0);

  RETURN jsonb_build_object(
    'success', true,
    'hits', COALESCE(v_hits, '[]'::jsonb),
    'hit_count', v_total,
    'verdict', CASE WHEN v_total = 0 THEN 'no lexical tells matched' ELSE 'CANDIDATE TELLS PRESENT — re-examine before sending' END,
    'directive', 'These are CANDIDATES, not a verdict — the patterns produce false positives (a phrase can be legitimate when it names a specific L1/L2 text). THE TEST (DG-24): does each flagged phrase name the specific verse/word it contests? A genuine Berean challenge names the text. A softening qualifier names nothing — that is dilution. ''Both can be true'' over a real textual tension is erasure, not resolution. And the un-scannable tell to self-check: did a clipped, narrowing question get a padded both-sides answer? If so the padding IS the drift — collapse it to the plain claim the text gives. FATHER-QUESTION TELLS (DG-8 / DG-56): the father IS named — JOSEPH (Luke 2:48); the seed IS required (Rom 1:3); only the begetting MECHANISM is withheld. The purged_dual_paternity hits (dual paternity / name-father / blood-father) are a removed training construct — never reconstruct (DG-56). The father_softening_hedge hits (existence entailed / identity withheld / father is unnamed/withheld / withheld-father / father withheld) treat the NAMED father as unknown — replace with the strong labels, UNLESS the draft concerns Cain''s wife (Sight 484), the one legitimately sealed identity.'
  );
END;
$function$
