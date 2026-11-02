# Claims about live behaviour in draft_v85.md, and what proves each

Sources: workflow moMxiV4Irg1uRBZN read by GET (versionId = activeVersionId = d9ec1e19-4b41-41d1-b5a5-f39815f4c71c, 252 nodes, updatedAt 2026-11-02T16:35:04Z), every node's code split to files and read; connections read. Database read by SELECT only. "VERIFIED" = read in the node or table named; "FROM WRITE-UP" = taken from a write-up and not re-read live; "UNVERIFIED" = not checked.

## §0-§2
| Claim | Proof | Status |
|---|---|---|
| Error workflow v02XXRlIhoHzMTjJ, active | n8n workflow list | VERIFIED |
| Retired flows archived (W1, W1_CC, DS-W1, Kimi, G-W3/GK-W1c etc.) | n8n workflow list, isArchived=true for wwn1, KIRe, 4NTT, TPvL, Ge4Um, 3QGx, 27EB, uRqY, N79m, MYRct, gCXt, f1Xi, 1cZM, k2zi, 8rvq, SJno, FNTy, GVAJ | VERIFIED |
| Respond Accepted after Init Seats, fence, fetches, Resolve Seats | connections: Resolve Seats -> Respond Accepted -> Regrade? | VERIFIED |
| Run token form, refusal suffix | Init Seats | VERIFIED |
| dash_launch_odv1 and dash_odv1_launch_status exist; launcher engine list | pg_proc; function body v_eng | VERIFIED |
| Manual Start -> Dry Run Config -> Init Seats | connections | VERIFIED; the refusal itself FROM v84 (not re-run) |
| ODV1-32255 took 71 minutes | run32255/problems.md | FROM WRITE-UP |

## §3 Request rules
| Claim | Proof | Status |
|---|---|---|
| Refusal order, rulebook values current/draft/chain, MiniMax refusal, two Oracles, panel of three, test inputs, fence id UUID | Init Seats | VERIFIED |
| Topic fence via rpc/debate_topic_gate, Fence Check fails closed | Topic Fence node URL; Fence Check code | VERIFIED; override one-hour rule FROM v84 |
| Resolve Seats refusals incl. family and minimax | Resolve Seats | VERIFIED |
| Retrieval Check rule | Retrieval Check | VERIFIED |

## §4 Seats, models, tokens, caching
| Claim | Proof | Status |
|---|---|---|
| ENG map; all but deepseek fam openrouter | Init Seats `ENG` | VERIFIED |
| Models read once at Fetch Models (active rows, executeOnce) | Fetch Models node (model_config?active=eq.true) | VERIFIED |
| Tokens as stored; openrouter tok = mt | Resolve Seats `tok`; D1-C4 Build bodies | VERIFIED |
| Floors 20,000 / 8,000 / 6,000 / 8,000 / 65,536 | Build Synthesis, Build Independent Verdict, Build Diagnostic Prompt `__base2`; Panel Build `Math.max(..,8000)`, deepseek and xiaomi 65536; Resolve Seats 4000 | VERIFIED |
| No reasoning, effort or thinking field | grep of every Code node for `reasoning:{`, `reasoning_effort`, `effort:`, `thinking:{`: none | VERIFIED |
| Stale comments "effort medium", "max(mt*2,8000)" | comments in C1 Build, Build Synthesis, Build Independent Verdict, Panel Build, Reserve Build | VERIFIED |
| Temperature 0 for deepseek, x-ai, google panel bodies; none in rounds | Panel Build; D1 Build bodyFor | VERIFIED |
| Caching: Claude ephemeral 1h markers split at DD; OpenRouter session_id; google/qwen system cache_control | D1 Build `__cc`, `__sysB`, `__mk`, `__orc` (same in every Build) | VERIFIED; "DeepSeek caches on its own" UNVERIFIED (no marker in code; provider behaviour) |
| 900 s timeout option on model calls | node options.timeout 900000 on round, judge, reserve, cure, alternate calls | VERIFIED |
| qwen time-removed | Init Seats `JUDGE_TIME_REMOVED=['qwen']` | VERIFIED |
| Retry figures | node settings: OpenRouter/DeepSeek round calls 3 x 5000; Fetch 3 x 3000; Save to DB 4 x 5000; Retrieve Held Conclusions 3 x 5000 continueRegularOutput; Write Judgment, Write Enforcer Log, Derive Outcome 3 x 3000; panel, reserve, cure, alternate calls none | VERIFIED |
| Model values, families | model_config read live (all seats 64,000 except glm 131,072 and sol 128,000) | VERIFIED (values not written in the body) |

## §5 Seat inputs
| Claim | Proof | Status |
|---|---|---|
| Oracle served by debate_arsenal_guarded | Retrieve Held Conclusions URL | VERIFIED |
| Guard filter and dedupe; "never name or number a guard" | Resolve Seats | VERIFIED |
| Row cap coupled to five limits | Init with Guards (comment and cap) | FROM v84, cap code not re-derived |
| Plain profile, position rule | Init Seats dpos/cpos; Init with Guards | VERIFIED |
| Burden, two-layer floor, DG-61, cite exactly | Init with Guards DEF_BURDEN, CH_BURDEN | VERIFIED |
| DD to D1 and D2 only | D1/D2 `sys=I.dsys+DD`; D3/D4 `sys=I.dsys` | VERIFIED |
| DG-60 always_inject, priority HIGH | drift_guards | VERIFIED |
| Named lists d_named/c_named; labels stripped for judges (SAN) | Init with Guards; Panel Build and Build Independent Verdict `SAN` | VERIFIED |

## §6 Rounds
| Claim | Proof | Status |
|---|---|---|
| D1..C4 order | connections C3 Extract -> D4 Build -> ... -> C4 Extract -> Build Synthesis | VERIFIED |
| DECLARED CHAIN 3-6, last is conclusion | D1 Build user message | VERIFIED |
| PRESSED WITH, LINK n forms, NARROWED TO | C2 Build, D3 Build, C3 Build | VERIFIED |
| D4 inputs (a), (b), ANSWER form, no press | D4 Build | VERIFIED |
| C4 no new press, marked NOT COUNTED | C4 Build, C4 Extract | VERIFIED |
| Empty/length/refusal handling | D4/C4 Extract (as D3/C3); quarantine_reason of ODV1-32192, 32201, 32262 | VERIFIED |
| Failure Salvage routing | connections (round calls, Extracts, Normalizers, Final Output, Extract Diagnostic, Save to DB, Check Save -> Failure Salvage; Fetch -> Stop: Call Failed) | VERIFIED |

## §7-§8 Single judge and rulebook
| Claim | Proof | Status |
|---|---|---|
| Single judge = first not seated; routed by family | Init Seats `single_judge:free[0]`; Verdict Judge Route | VERIFIED |
| Single judge is second opinion; framework_verdict saved null | Build Save Body saveBody `framework_verdict:null`, standings null; derive_debate_outcome AMENDMENT THREE | VERIFIED |
| Synthesis not shown to judges | Panel Build parts list (comment and no synthesis part); Build Independent Verdict transcript assembly | VERIFIED |
| Synthesis and diagnostic carry the close rounds | Build Synthesis, Build Diagnostic Prompt reference cr4 | VERIFIED (presence only) |
| Rulebook text: counting rule, close rounds, unanswered witness incl. [DR1], UNEXHIBITED, verse citation, narrowing, VOID, terms, clauses, RESULT, standings, GROUND, rule B with plain-letter [L2], chain marks, out-of-round incl. [CR4]/[DR4] | Panel Build SYS text (read in full); Build Independent Verdict same clauses | VERIFIED |
| Pre-check, ledger, KJV report given to single judge and panel | Panel Build (preCheckBlock, LEDGER, KJVC); Build Independent Verdict (preCheckBlock, ledger, CITATION CHECK AGAINST THE KJV) | VERIFIED |
| draft rulebook splices; chain value read by no node | Panel Build `S.rulebook==='draft'`; grep for 'chain' rulebook: Init Seats only | VERIFIED |

## §9 Enforcers
| Claim | Proof | Status |
|---|---|---|
| Marks and items per rule, K-U/K-S2 marks only, K-G2 recorded, K-K unwired | Extract Independent Verdict drvCheck/drvLedger/drvBroken; Panel Payloads same | VERIFIED |
| Cure texts per mark; ANSWER FORM; RESPONSE required | Cure Build CURE_RULE, CURE_RULE_G, CURE_FORM | VERIFIED |
| K-C answer-test mask | netMask, NET_ANSWER(_R,_U), NET_QUOTE, NET_QUOTE1, NET_REPORT, NET_CONC | VERIFIED |
| K-G4 NOT RAISED on concession ground | drvCheck kg4Conceded | VERIFIED |
| RESPONSE matched by rule and label | judge_fix3 A6 (respOf) | FROM WRITE-UP (respOf not read line by line) |
| Uncured seat not counted | Panel Payloads `drv_uncured`; aggregate_debate_panel `is_clean` requires drv_uncured = 0 | VERIFIED |
| Cured corrections written to the seat's row | Cure Check / Panel Cure Check cureSet, cureCountHeld | VERIFIED |
| Review-line counting excludes K-U..K-DG8 | Extract Independent Verdict `nflag` | VERIFIED |
| S-A to S-E; C4 check in review_notes | Build Save Body | VERIFIED |
| debate_enforcer_log columns; RLS on; anon/authenticated no SELECT; record_enforcer_log(uuid,text,jsonb), anon EXECUTE | information_schema; pg_class; has_table_privilege; has_function_privilege | VERIFIED |
| Write Enforcer Log between Write Judgment 3 and Derive Outcome, error -> Derive Outcome | connections | VERIFIED |
| Dry regrade writes no log | Dry? true -> Replay Rows (never reaches Write Judgment 3) | VERIFIED |

## §10 Panel
| Claim | Proof | Status |
|---|---|---|
| ORDER, panel, reserve, alternates, sol last | Init Seats | VERIFIED |
| 20 of 56 pairings no reserve; 14 empty alternate pool | computed from Init Seats and model_config families (script) | VERIFIED |
| Family rule | Resolve Seats; Alternate Build G1 | VERIFIED |
| Flow order | connections | VERIFIED |
| Reserve and substitution | Panel Check, Reserve Build, Record Substitution | VERIFIED |
| Alternates G1-G3, seated once, recorded | Alternate Build; Alternate Merge comments; Record Alternates URL | VERIFIED; "seated only with no uncured item" FROM WRITE-UP (32255 audit line) |
| Validation and review lines | Panel Payloads (grep) | VERIFIED |
| Aggregate UNGRADED / CONTESTED | aggregate_debate_panel | VERIFIED |
| Outcome map with long dash | d5_outcome_for | VERIFIED |
| Tie and citation rule; first-stamp writes; standings majority | derive_debate_outcome | VERIFIED |

## §11-§14
| Claim | Proof | Status |
|---|---|---|
| Save via record_debate_row, idempotent on run_token, only real columns | record_debate_row body | VERIFIED |
| Column map incl. defender_r4, challenger_r4 | Build Save Body saveBody; information_schema | VERIFIED |
| write guard and integrity scan read r4 | function bodies (position) | VERIFIED |
| dash_odv1_by_id returns def_r4 | function body | VERIFIED |
| debate_variant_canon ODV1 row without r4 | table read | VERIFIED |
| Token totals incl. cure and alternate calls; 6 hours | Panel Tokens; record_debate_row_tokens body | VERIFIED |
| Citation Scan FIX 6, statuses, NOT COUNTED, WORDS ARE AT rule | Citation Scan comments; Quote Report; Build Independent Verdict KJVC | VERIFIED |
| Document path; Round 4 printed | connections; Format Markdown | VERIFIED |
| Regrade path, refusals, six-round regrade | connections; Regrade Load | VERIFIED |

## §16-§17
| Claim | Proof | Status |
|---|---|---|
| MiMo refusals 32192, 32201 (C1), 32262 (C2) | debate_results.quarantine_reason | VERIFIED |
| Haiku swap prepared, not applied | haiku_swap/new differs from live Init Seats; no `haiku` row in model_config | VERIFIED |
| GLM reasoning exhausted the limit (32255) | run32255/problems.md B2 | FROM WRITE-UP |
| Panel failure still named "envelope this parser does not recognise" | Panel Check | VERIFIED |
| qwen calls 981.7 s, 985.2 s | run32228, run32255 write-ups | FROM WRITE-UP |
| K-G4 on timing ground; UNEXHIBITED vs link grade; Sight 32 | run32255 B1, B4; run32141 B2 and later | FROM WRITE-UP |
| ODV1-32266 has close rounds and HELD 3-0 | debate_results | VERIFIED; not read whole |
| DD header names the operator | D1 Build DD text | VERIFIED |
| Non-archived flows named in v84 | n8n workflow list | VERIFIED |

## Not verified
- The one-hour override window and one-use marking inside `debate_topic_gate` (not re-read; from v84).
- DeepSeek caching behaviour (provider side).
- Whether GLM answers at 131,072 (no run since the change).
- The dashboard front end (not in the repository).
