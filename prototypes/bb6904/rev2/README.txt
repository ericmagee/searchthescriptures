Revision 2 wrong-if, limb 1: every {{ }} expression in every IF and Switch node is parsed by n8n's own engine.
Setup: cd prototypes/bb6904/rev2 && npm install (n8n-workflow 1.x pulls @n8n/tournament; versions in VERSIONS.txt).
Run: node allexpr.cjs <workflow json>   prints PARSE-FAIL lines and "expressions N parse failures F".
Cases run before posting (Worker_E, 2026-10-20 22:5x CDT):
  live db281705 (scratchpad a4/post.json): expressions 20, parse failures 0   (known good)
  composed 71bb32b6: expressions 29, parse failures 1, Alternate Needed? "Line 1: Unexpected end of input" (known bad: the R4 defect, execution 27357)
Limit: the local engine version may differ from the n8n cloud host's; the R4 re-run is the live check.
