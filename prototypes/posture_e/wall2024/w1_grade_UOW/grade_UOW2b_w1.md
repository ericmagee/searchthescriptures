# W1 regrade of pkgUOW rev 2, rebuilt parent (Wall 4963): PASS WITH LIMITS
File parent_s140_UOW2.json, sha256 d0d7de86967efd26 (checked; replaces 42512b47, which must not be written).
- pkgLIB: 42 stubs; every stub rebuilt from LIB and MAP has the length MAP states (0 mismatches) and compiles (0 errors). Same check on live s140: 0 and 0. Header sha 3cf1228314efca39 equals the computed sha.
- One LIB line changed (1898), +19 characters; MAP p unchanged; MAP n changed for exactly the 9 stubs that include line 1898 (Gate Record, Send Back Build, Send Back Record, and their Alt and R2 Alt clones). jsCode +19 in total.
- Plants and stored replay: results equal to my rev 2 grade (grade_UOW2_w1.md); limits unchanged.
- My mistake: my first rev 2 grade (Wall 4962) passed 42512b47 without checking MAP lengths or that the stubs rebuild.
