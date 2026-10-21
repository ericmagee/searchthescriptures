-- BB-6904 revision 8 wrong-if (class 2 of operational_doc 27, stored fields only; no model call).
-- Run on a debate_results run_token. FIRES when any limb is true:
--   l0 the row's defense_standing or framework_verdict is NULL;
--   l1 the row is BROKEN while its stored defense standing is SELF-SUPPORTED with 0 links conceded;
--   l2 the row's review_notes carry an EXTRACTOR ... ILLEGAL flag;
--   l3 any judge returns BROKEN while its own defense standing is SELF-SUPPORTED with 0 links conceded.
-- Tested 2026-10-21: 27088 SILENT; 27433 FIRED (l1, l2, l3); 27191 FIRED (l3, gemini); NULL case FIRED (l0).
-- Usage: replace :tok with the run token.
WITH r AS (SELECT id, run_token, framework_verdict, defense_standing, conceded_links, review_notes
           FROM debate_results WHERE run_token = :'tok'),
j AS (SELECT j.judge_seat, j.verdict_tag, j.defense_standing, j.conceded_links
      FROM debate_judgments j JOIN r ON r.id = j.debate_id)
SELECT r.run_token,
  (r.defense_standing IS NULL OR r.framework_verdict IS NULL) AS l0_null,
  (r.framework_verdict = 'BROKEN' AND r.defense_standing = 'SELF-SUPPORTED' AND coalesce(r.conceded_links,0) = 0) AS l1_row,
  (coalesce(r.review_notes,'') ILIKE '%ILLEGAL%') AS l2_illegal,
  (SELECT count(*) FROM j WHERE verdict_tag = 'BROKEN' AND defense_standing = 'SELF-SUPPORTED' AND coalesce(conceded_links,0) = 0) AS l3_judges
FROM r;
