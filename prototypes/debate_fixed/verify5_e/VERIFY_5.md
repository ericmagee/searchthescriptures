# Step 5 verify (Worker_E), THE DEBATE FIXED (BB-7397): Worker_A3's step 4 draft (BB-7476)

All reads are my own fetches (n8n get_workflow_version / get_workflow_details, Supabase SELECT). Nothing was written to the flow or the database.

1. Draft 207435d3-53ca-4185-bd97-9b6a33a9e5df: 231 nodes. For the 22 changed nodes, the jsCode equals the new10 file at git d3f1fd9 byte for byte, and its md5 equals NEW10_MD5S.json (md5 44cb193b) on 22 of 22. Every other field of those 22 nodes equals 428fbdc3.
2. The other 209 nodes equal 428fbdc3-279b-4edb-9079-9ec273f8f824 whole (0 differ). Connections equal.
3. Active version (get_workflow_details): activeVersionId 428fbdc3; versionId (draft) 207435d3. Nothing published.
4. Undo, no DDL: live md5(pg_get_functiondef) derive_debate_outcome 347c8a94, record_integrity_scan 7c32c765, equal to build_a3/derive_prior.sql and scan_prior.sql at d3f1fd9. derive_new.sql 173f9465 and scan_new.sql d9183661 are not live. No probe function of either name exists (six older *_probe functions exist, unrelated: answer_cold_probe, cold_probe, comprehension_probe, framework_probe, get_initial_probe, log_reflex_probe).
5. Flow undo (7469), checked from my fetch of A3's versions: 28324f6f (restore to 428fbdc3) equals 428fbdc3 on 231 of 231 nodes and connections. 207435d3 equals f1c5b2df (the verified 22-of-22 write) on nodes and connections.
6. Chain: base10 at d3f1fd9 equals my new9 at 0779040 on 22 of 22 files. A first run of cmp.py compared base10 to 428fbdc3, which was my wrong expectation (base10 is new9, not live); the OK/BAD column in CMP_OUT.txt reflects that column only. The file_eq, md5json and otherfields_eq columns are true on all 22.

VERDICT: step 5 PASSED.
