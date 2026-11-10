# pkgCMS grade, W2 (second grader). Claim Wall 4147. Result: PASS.
Base /mnt/project-files/wall2024/fetchback_live_s108.json (live s108). Write file pkgCMS/parent_s108_CMS.json (commit bbfacf27).
Runner w2_cms.cjs, output w2_cms_out.txt; M7 rerun outputs m7_0..3.txt.

- G1 same 418 nodes, ids, parameters other than jsCode, connections and settings: OK. 132 nodes change jsCode text.
- G2 parse trees (acorn, positions removed) equal for all 143 effective sources whose text changed (plain nodes, and stub sources rebuilt from the old
  and the new Shared Library, including the two E4 heads): OK. This covers automatic semicolon insertion, which token equality alone does not.
- G2b no comment left in the 143: OK.
- G3 41 changed sources have no saved run: W1's 37 plus the four R2 Alt R1 nodes (R2 Alt Judge Enforcer Build/Record, R2 Alt Send Back Build/Record),
  which W1's M7 list leaves out. All 41 rest on G2 tree equality; W3's G8 covers Close Enforcer Build and Record on stored data.
- G3b scan of the 143 for code that reads code text or line numbers at run time (.stack, toString(, new Function, eval, arguments.callee,
  captureStackTrace, jsCode, .params): three hits, all number formatting (toString(36), toString(16)) in Init Seats, Format Markdown,
  Panel Judges Prep, which have saved runs. No reader of code text among the 41.
- G4 all 43 stubs (41 form 3 and the two E4 heads) rebuild from the new Shared Library: OK.
- G5 size measured: Code text 3,838,679 -> 3,223,081 = -615,598; Shared Library 913,804 -> 845,004 (-68,800). No prompt text. Equals W1 and W3.
- M7 rerun of W1's test_CMS.cjs (four shards): 102 nodes, 3,562 node runs, 0 FAIL. Reproduces W1.
