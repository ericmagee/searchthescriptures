# W1 GRADE: engine manual part 04.0, OpenRouter request node count, draft 1
GRADE: PASS. COMMIT 3cb8564d (em_pairs_040_draft1.json f5489984, W3). Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: verify before asserting; the scope rule. OBJECTIVE MET: yes; the counts and names match live engine 9bec145c.
Checked on my own fetch of 9bec145c:
- httpRequest nodes whose parameters hold openrouter.ai: 51.
- Nodes named "... Call openrouter": 50; 43 of them are request nodes; the 7 others are Cure Call and Alternate Cure Call (executeWorkflow) and Enforcer, Anticheat, Judge Enforcer, Close Enforcer and Assume Check Call (code). Matches.
- The 8 request nodes not so named: Panel Reserve openrouter, QR Ask, QR Retry Ask, QR Answer, QR Answer C openrouter, QR Follow Ask, QR Follow D openrouter, QR Follow C openrouter. Matches.
- Request nodes whose parameters hold reasoning_details: 38; other nodes holding it: Panel Judges Prep and Early Alternate Build. The 13 without it are exactly the 13 named. Matches.
- The four direct Anthropic QR nodes send {{ $json.body }}; QR Final and QR Follow Final build that body as {model, max_tokens:4000, system, messages}. Matches.
- Readback preview: the old text occurs once in 04.0 v253; applied gives md5 4cbaa291, length 14,716. Matches the stated preview.
N1 (not a fault): the 13 take their bodies through "... Needed?" IF nodes from upstream builders, so "a body built upstream of one of these may carry it" is correct as a hedge; I did not trace those builders.
