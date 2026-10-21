Revision 2 wrong-if, limb 1: every {{ }} expression in every IF and Switch node is parsed by n8n's own engine.
Setup: cd prototypes/bb6904/rev2 && npm install (n8n-workflow 1.x pulls @n8n/tournament; versions in VERSIONS.txt).
Run: node allexpr.cjs <workflow json>   prints PARSE-FAIL lines and "expressions N parse failures F".
Cases run before posting (Worker_E, 2026-10-20 22:5x CDT):
  live db281705 (scratchpad a4/post.json): expressions 20, parse failures 0   (known good)
  composed 71bb32b6: expressions 29, parse failures 1, Alternate Needed? "Line 1: Unexpected end of input" (known bad: the R4 defect, execution 27357)
Limit: the local engine version may differ from the n8n cloud host's; the R4 re-run is the live check.

allexpr2.cjs (per BB-7074): every {{ }} expression in every node of any type (jsCode excluded); with a base file, new or changed nodes only.
Cases run before posting (Worker_E, 2026-10-20 22:5x CDT):
  live db281705, all nodes: 124 nodes with expressions, 139 expressions, 0 parse failures (known good)
  composed 71bb32b6, all nodes: 160 nodes, 179 expressions, 1 failure, Alternate Needed? (known bad)
  composed 71bb32b6, new or changed vs live: 41 nodes, 45 expressions, 1 failure, Alternate Needed?
Setup: npm install in this directory (or a node_modules link to one holding n8n-workflow 1.120.33).
