# pkgQ4D: Qwen 4 Max as the defender (Eric 21:11 CST 11-16: "i want to replace GLM with Qwen 4 Max as the defender")
Base: live s234 25b8559b (fresh read; nodes equal to the s234 fetchback). Target node sha 4c3b514011bb.
A. model_config row qwen4max: openrouter, engine, qwen/qwen4-max, max_tokens 131072 (same as the glm defender row; OpenRouter max completion 131072), family qwen. No reasoning setting (the model reasons by default; nothing is sent).
B. Init Seats: one edit, ENG gains qwen4max:{fam:'openrouter',mc:'qwen4max'} after glm. No other node changes; connections unchanged.
Order: row first, then flow. Revert: flow first (s234), then revert_q4d.sql.
Test t348.cjs (run from the folder holding live.json and target_348.json): live refuses engine qwen4max; target resolves defender qwen/qwen4-max, tok 131072; panel and alternates unchanged; glm still resolves. Output: t348_out.txt.
The run body then names the defender {"engine":"qwen4max","profile":"plain"}.

REV 2 (after W1 7327): D3 Build and D4 Build __ZH test widened from /^z-ai\// to /^(?:z-ai|qwen)\//, so a qwen defender gets its earlier rounds as history turns in rounds 3 and 4, as GLM does today. C3/C4 (challenger side) unchanged. Test t348b.cjs: live gives history only to glm; rev 2 gives it to glm and qwen4max on the defender side; spark unchanged. Target target_q4d_r2.json.gz.
