READBACK ASK 607 and ASK 623 writes (W4, pressed 16:00 and 16:01 CST 11-24; Wall 11742; audit 41703, 41709): MATCH, both. COMMIT: this file.
RULES READ: my grades of 607 build (7a040c29) and 623 build (157e0626, N1 wrap in BEGIN/COMMIT); write607.sh; write623.sh rev 1; write623.sql; build rule (touched nodes only).
OBJECTIVE MET: yes. Live holds exactly the two graded changes and nothing else.
STANDARD (ASK 599): unchanged from the build grades (PASS).

My own live fetch (n8n get_workflow_details, 16:04 CST):
- Engine moMxiV4Irg1uRBZN 20db58ee, active, 423 nodes, updatedAt 22:03:08Z. Against my expected build (607 target engine 46a1862b with the five nodes from target_engine_623.json e449c187): 0 nodes differ; connections equal the 94b682a0 base. Against base 94b682a0 exactly six nodes differ: Shared Library and the five 623 nodes. target_engine_623 differs from base only in the five, so taking five nodes from it carries nothing else.
- Child MqQHRl7mQQ0z8QdT 74353c40, active, 156 nodes, updatedAt 22:01:29Z: 0 nodes differ from the 607 target child b367f537; connections equal.
- W4's fetch-backs (fetchback_eng_623, fetchback_child_623) equal my live fetch node for node.
- Standing set on my live fetch: 31 PASS 0 FAIL. Pair check: Library Check PASSES (lib 2f5aa1e63d51edb1, map ad6e192e0d5a225f).
- t623 at write equals the graded output (36de91b2, ALL PASS).

Database (623), read now:
- Five functions: in each, every new string occurs once, and replacing it back with the old string gives exactly the gated base md5 (c3d6061b, 4a16cddc, e19ac69b, 73825336, 11462172). Nothing else in them changed.
- model_config neon: google/gemini-4-neon, openrouter, max_tokens 64000, active, no reasoning setting, role copied from argon (engine). hydrogen and neon both present.
- Judge order: panel sol, sol62, spark; alternates chatgpt, qwen4max, gemini, argon, sonnet, hydrogen, neon. Log ids 1, 2, 5; row 5 saved_by "ASK 623", before = version 2 as gated. Ids 3 and 4 are absent, consistent with W4's two rolled-back dry runs consuming the sequence. The judge order now reads version 5; nothing was lost.
- Audit 41703 (607) and 41709 (623) present, pressed 16:00 and 16:01 CST.

Not yet shown (owed by the first live runs): 607 run evidence (pkgFRM RECORD-ONLY row; likely UNEXERCISED), 623 neon and hydrogen seated and judging. Last debate_results 19:48 UTC (13:48 CST); no run since.
