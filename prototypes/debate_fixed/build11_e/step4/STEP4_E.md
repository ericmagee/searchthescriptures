# BB-7397 rev 7 step 4 (Worker_E): draft write of build11_e/new11, not published

Workflow moMxiV4Irg1uRBZN. Live (activeVersionId) before and after: 207435d3-53ca-4185-bd97-9b6a33a9e5df.
Each of the 18 changed nodes was written by one setNodeParameter /jsCode call, then fetched back with
get_workflow_version and compared by cmp4.py (NEW11_MD5S.json and the 207435d3 fetch).

Versions 1-7: c254f2c0, f9dac2ae, 0d65a8b1, 3815e06d, 4161efe3, 4b1a9304, 6f2afddd (earlier log).
Versions 8-18 and the undo check: CMP4_LOG_08_18.txt.

Mistake: version e9c2b6d4 (Panel Cure Build 2) had a copy error by the writing subagent: file lines 311 and 312
merged, dropping the "no request body for this seat" skip. cmp4 listed it as neither. Rewritten as b6603f8c, which
matches. Later writes sent a script-made JSON encoding of the file.

Final 18 of 18: 90fb3aad. Undo check on the draft: restore 207435d3 -> 9025da64, all 231 nodes and connections
equal to 207435d3. Restore 90fb3aad -> 449a4cf2, all 231 nodes and connections equal to 90fb3aad; cmp4 18 of 18.
Current draft 449a4cf2; activeVersionId 207435d3 (get_workflow_details). Nothing published.
