-- ASK 423 (W2 8887 C2): the SQL that makes rows.json (read-only). Save the json_agg value as rows.json.
-- Superset: any stored run whose challenger list, defender link round or challenger link round has a line-head LINK...[D|C]<digit>.
select json_agg(json_build_object('id',id,'run',run_token,'d1',claude_r1,'gr2',engine_r2,'cr3',engine_r3,'dr3',challenger_r3,'notes',review_notes))
from debate_results
where coalesce(engine_r2,'') ~* E'(^|\\n)[^\\n]{0,24}LINK[^\\n]{0,6}[DC][ \\t]*[0-9]'
   or coalesce(engine_r3,'') ~* E'(^|\\n)[^\\n]{0,24}LINK[^\\n]{0,6}[DC][ \\t]*[0-9]'
   or coalesce(challenger_r3,'') ~* E'(^|\\n)[^\\n]{0,24}LINK[^\\n]{0,6}[DC][ \\t]*[0-9]';
-- d1_all.json for cc_eq.cjs (W3 8885 condition): [run_token, claude_r1] for every run whose round 1 names a DECLARED CHAIN.
-- select json_agg(json_build_array(run_token, claude_r1)) from debate_results where claude_r1 ilike '%DECLARED CHAIN%';
