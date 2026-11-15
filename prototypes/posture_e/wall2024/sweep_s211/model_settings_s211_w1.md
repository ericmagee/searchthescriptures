# Model settings sweep, live s211 (n8n 123b7df7, 455 nodes, updatedAt 09:01:50Z 2026-11-15) — W1, read-only

Method: full live read (n8n get_workflow_details) at ~09:05Z; regex over every node's parameters and every Shared Library line for reasoning / effort / thinking / max_tokens / max_completion_tokens / maxOutputTokens / temperature / top_p / verbosity / include_reasoning; plus model_config rows. "thinking" and "top_p" hits were prose or variable names (no setting). Source column: Eric's own words with date, or NO SOURCE (searched md_notes_rulings, the_wall, model_config notes).

## A. Reasoning / effort (the settings Eric's rule names)
| # | Setting | Where (live s211) | Source |
|---|---|---|---|
| A1 | `reasoning:{effort:'low'}` for `google/gemini-3.8-flash` on every NON-debater call (key not ending :defender/:challenger), unless the body already sets reasoning | `__orc` in 14 nodes: D1-D4 Build, C1-C4 Build, Build Synthesis, Build Independent Verdict, Build Diagnostic Prompt, Panel Build, Reserve Build, Accept Build; plus LIB 3264 (Alternate Build, R2 Alternate Build) | **NO SOURCE in Eric's words.** pkgMUS rev 2 (W2 Wall 5581, 11-12). Eric's words were only "add gemini 3.8 flash as an alternate before grok" (21:08 CST 11-12). The effort-low part was a seat choice; the ASK 173 card covered one paid check call. Also against ruling 361 (11-01): "no not touch reasoning efforts... you're degrading performance". |
| A2 | `xiaomi/mimo-v2.6-pro`: `max_tokens=131072` and `reasoning:{effort:'medium'}` unless set | `__orc` in Panel Build, Reserve Build, Accept Build, LIB 3264 (Alternate / R2 Alternate Build) | **Eric 07:46Z 2026-11-09** (W4 thread, quoted W4 Wall 3474, W2 3475): "use max tokens for mimo and use medium effort as it was previously stated". Note: not in the D/C debater Builds, Synthesis, BIV or Diagnostic; mimo as debater runs at provider default. |
| A3 | `reasoning:{enabled:false}` for `xiaomi/*` | Reserve Build (panel reserve body, also max_tokens max(row,65536)); LIB 3307 (Alternate Build / R2 Alternate Build alternate pool) | **NO SOURCE found.** W2's 3473 "reasoning off" check body was WITHDRAWN at 3475 after Eric's 07:46Z order; manual v93 (W3 3689) records "Reserve Build's reasoning off" as existing. It contradicts A2 (Eric: medium effort for mimo) on the reserve/alternate path. |
| A4 | x-ai `reasoning_details` replayed into later assistant messages | jsonBody of every "... Call openrouter" HTTP node (≈38) | Pass-through of grok's own prior reasoning, not an effort setting. No Eric source found; flag for awareness only. |
| A5 | hydrogen / spark effort low | — | **Removed in s211** (verified: no hydrogen/muse regex in any __orc). Had been Eric's ASK 149 option 1 ("1", 19:01 CST 11-12) for hydrogen; spark was carried over by seats (W1 5577 limit c). |

## B. max_tokens (row values and code floors)
| # | Setting | Where | Source |
|---|---|---|---|
| B1 | model_config max_tokens 64000 (all rows except glm) | DB model_config | **Eric "set all to 64k"** 2026-11-02 00:1x CST (Worker_A3 thread; row notes). |
| B2 | glm 131072 | DB model_config | **Eric "1. approved"** 2026-11-02 09:4x CST (row notes). |
| B3 | Init Seats ALT_MODELS minimax 64000 | Init Seats | Matches "set all to 64k" (11-02). |
| B4 | Code floors `Math.max(row, N)`: deepseek judge 65536 (Panel Build, Reserve Build, BIV); xiaomi 65536 (Accept, Reserve); judges 8000 (Panel Build); enforcers 16000 (Enforcer, Close Enforcer, Judge Contradiction, Anticheat, LIB 3248/3251), 8000 (Assume Check, Reread x3, Accept DS); Synthesis 20000; Diagnostic 6000; BIV verdict 8000 | as listed | **NO SOURCE in Eric's words found** (package choices). With rows at 64000 most floors never bind; deepseek 65536 and xiaomi 65536 do raise above his 64k. |
| B5 | QR Check `max_tokens=16` (the "Reply OK" ping); QR Final 4000 | QR Check, QR Final | NO SOURCE (package choice). |

## C. temperature
| # | Setting | Where | Source |
|---|---|---|---|
| C1 | `temperature:0` on grok, google, deepseek judge bodies and all DeepSeek enforcer/reread/assume/anticheat calls | Panel/Reserve/Accept Build, Synthesis, BIV, Diagnostic, Enforcer family, LIB 3248/3251 | NO SOURCE in Eric's words found (long-standing). |
| C2 | `temperature:0.6` on the second copy | Close Enforcer Build, Judge Contradiction Build (copy 2) | NO SOURCE found (package choice). |

## D. Other body fields seen (not model-thinking settings)
- z-ai provider pin `{order:['z-ai'],allow_fallbacks:false}` in every OpenRouter HTTP jsonBody.
- openai family uses `max_completion_tokens` (parameter name only).
- system-message cache_control for google/qwen; session_id.

## Findings for Eric (no source)
1. A1 gemini-3.8-flash effort low on judge calls (14 nodes + library).
2. A3 mimo reasoning OFF on reserve and alternate paths, against his "medium effort" order.
3. B4/B5 code max_tokens floors above or below his "set all to 64k" (deepseek 65536, xiaomi 65536, QR 16/4000).
4. C1/C2 temperature 0 and 0.6.
LIMIT: the source search is mine and W2's; W2 is searching the threads, which I cannot read. A setting marked NO SOURCE may have one there.
