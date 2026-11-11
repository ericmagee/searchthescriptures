## pkgAGK: grok admitted as an alternate by the database (odv1_record_panel_alternates)

What: the seat test of odv1_record_panel_alternates no longer bars grok. Gemini stays barred.
Why: run 35173 (s140) removed luna, called grok as first alternate (pkgALT order grok, argon, haiku, operator 20:50 CST 11-10), and the function refused grok by the pkgJGR exclusion of 11-08. No judgment rows were written; no verdict.
Edit: `v_alt NOT IN ('gemini','grok') /* pkgJGR ... */` becomes `v_alt <> 'gemini' /* pkgJGR: gemini judges no more ...; pkgAGK: grok back ... */`. Nothing else changes. Guards G1 (family), G2 (same model), G3 (already on panel), the MiniMax bar and the two-alternate cap are unchanged.
Size (measured): function body +22 characters (logic -13, comment +35); n8n code 0; prompt 0; nodes 0.
Body md5: s140 968d39e6151ec06e9eeee8f39d8c4286; pkgAGK 2f4b916cae710fca0ac8283f966229cd.
Files: schema_AGK.sql (guarded: refuses unless the live body is the s140 body and the old test occurs once), revert_schema_AGK.sql (restores and checks the s140 md5).
Other alternate-path checks (read 11-11): no other database function or debate_judgments constraint bars grok, argon or haiku. odv1_record_panel_substitution (the reserve) keeps its own seat list without grok; the reserve is not the alternate path and is unchanged.
Limits: proven only by a run that removes a seat and seats grok; the flow's display order in Format Markdown does not list sol, luna, argon or haiku (display only, unchanged).
