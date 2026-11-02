# claude_direct: Claude debater calls on the direct Anthropic API with cache diagnostics (offline only; nothing written to n8n or the database)

- Base: ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN), live version 57222efa, read by GET on 2026-11-02 (data/workflow_live.json; all code nodes in
  data/live_code/). base/ holds the live code of the 18 code nodes changed; `python3 patch.py` builds new/ from base/ (anchored replacements).
- No node and no connection is added or removed: the 8 "<round> Call anthropic" HTTP nodes already exist on output 0 of every Route
  (POST https://api.anthropic.com/v1/messages, credential anthropicApi "Anthropic key" rGnzgJBTBRDmDPA4, anthropic-version 2023-06-01,
  timeout 900000, retry 3 x 5 s, error output to Failure Salvage). n8n sends the x-api-key header from the credential and content-type for the JSON body.
- write_package.py: one guarded PUT (base md5 of the 18 nodes; live connections and node count equal the base read; the 8 Call anthropic nodes and
  their links as required). Run only with --dry: write_dry.txt (guards passed; 481 connections unchanged).
- Database: SELECT only (model_config ACTIVE rows: data/model_config_active.json; run 32284 seats). No DDL: no column is needed.
- data/openrouter_models.json: the OpenRouter public model list (2026-11-02), for the model-id and output-limit checks.

## Changes
- H1 Resolve Seats: a debater whose model_config api_model starts with "anthropic/" gets family 'anthropic' (any engine: claude today, the prepared
  haiku engine when applied); a model switch is a model_config change only. The direct id is checked here and fails closed (VALIDATION).
- H2 the direct id, in code: strip "anthropic/", "." to "-" (anthropic/claude-sonnet-5.5 -> claude-sonnet-5-5). Allowed form:
  claude-<opus|sonnet|haiku|fable|mythos>-<n>[-<n>]. The Build nodes map again and refuse an unknown form. Stored models keep the api_model.
- H3 Build D1..C4: the anthropic body (system blocks and last-message 1-hour markers as before, max_tokens as stored) adds
  "diagnostics": {"previous_message_id": ...}; the chain is per seat per run (the seat's first Claude call null, later calls the previous
  "<round> Call anthropic" response id). call.diag_prev records it. No thinking, reasoning or effort field.
- H4 Extract D1..C4: anthropic branch reads diagnostics and id; one cache_diag line per call; usage.input_tokens = uncached + written + read (the
  measure of OpenRouter's prompt_tokens, so the run's sums mean what they meant), uncached kept as input_uncached_tokens; refusal names stop_details.category.
- H5 Build Save Body: the cache_diag lines go into review_notes, in round order (informational; no REVIEW THIS ROW).

## Tests (test/)
compile_out.txt (18 compile); harness_out.txt (51 checks, 0 failures); bodies_out.txt (D1..D4 request bodies on run 32284's rounds, sample CACHE DIAG lines).
