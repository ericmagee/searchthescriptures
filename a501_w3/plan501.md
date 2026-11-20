# ASK 501 plan rev 0 (W3, seat 33, 11-20; THE ASK FORM op doc §29; number assigned by the coordinator, posted at Wall 10178): the engine runs out of memory on long runs, and since ASK 487 every run of this pairing is long

## 1. OBJECTIVE
Run 40958 (ODV1-40958-vufevpqd) crashed after 66 minutes at node Panel Tokens: "Workflow did not finish, possible out-of-memory issue" (W4 10170). The row and judgments were saved, but the tokens and cost row (Write Tokens) and the Drive transcript (Save to Drive) come after Panel Tokens and never ran. The operator, 00:04:17Z 11-20: "how can you be so certain the failure isn't from all the changes.. that's not logical. We are running the same debate... this debate ran 30 minutes yesterday."
Find what made the same debate run twice as long, and make a run of this pairing finish with its tokens row and transcript saved.
Expected effect: a run of spark/oracle vs gemini/plain on the gemini-4-hydrogen debater ends with status success, a tokens and cost row, and a Drive transcript.

## 2. ROLES
Planner W3. Builder and writer W4, each write on a card pressed in W4's thread. Graders W1 and W2. Readback by two non-writers. Any change to the n8n host (memory) is the operator's.

## 3. SCOPE AND EVIDENCE
Scope: the engine's tail (Panel Tokens and the nodes after it) and the n8n host's memory. No wording, prompt, model or reasoning setting. ASK 487 itself is not reverted: the operator ruled 10:44 11-19 "Gemini off flash".

E1. Same topic ("Did Christ have a biological father?") and same pairing (spark/oracle defending, gemini/plain challenging) in every run below. Times from n8n; rows from debate_results and debate_enforcer_log (W3 reads 00:08Z to 00:12Z 11-20).
| run | gemini debater | minutes | enforcer rows | cost USD | end |
| 40781 | gemini-3.8-flash | 22.4 | 215 | 1.73 | success |
| 39266 | gemini-3.8-flash | 42.0 | 347 | 2.25 | success |
| 38661 | gemini-3.8-flash | 51.5 | 302 | 3.55 | success |
| 39015 | gemini-3.8-flash | 57.2 | 332 | 4.03 | success |
| 40891 | gemini-4-hydrogen | 60.9 | 496 | 5.15 | success |
| 40958 | gemini-4-hydrogen | 66.1 | 658 | not written | CRASHED |

E2. ASK 487 (the debater "gemini" reads model_config gemini_deb, google/gemini-4-hydrogen) went live at 17:08:10Z 11-19 (engine dd636c25, audit 38579). 40781 ended at 16:05:49Z, before it. 40891 and 40958 are the only two runs since, and both are the long ones.

E3. Hydrogen writes about twice as much per round, and the defender answers a longer case:
| chars | flash runs (39015, 39266, 40781) | 40891 | 40958 |
| challenger r3 | 17,921 to 19,551 | 37,564 | 33,844 |
| challenger r4 | 3,850 to 5,554 | 12,752 | 15,726 |
| engine_r2 | 11,744 to 12,027 | 27,945 | 34,802 |
| defender r4 | 15,474 to 20,377 | 25,264 | 30,185 |
More text gives more enforcer items, more send-backs, longer judge prompts and longer alternate prompts.

E4. W4's node data (W4 to W3, 00:06Z and 00:11Z 11-20): debater call time 19.7 min in 40958, against 8.4 in 40781 and 5.7 in 39266. Alternate and retry time 29.4, 0.1 and 10.4 min. In 40958 sol62 was replaced by the reserve qwen4max, and chatgpt was not counted after its alternates failed (sonnet once with no JSON and once with 1 uncured item; haiku unseated by E-GATE contradictions). Largest nodes: Alternate Call 809 s, Alternate Pass Call 423 s.

E5. ASK 485 (the reserve gets its send-back and gate) ran in 40958, because a reserve was seated: it adds calls, not a loop. ASK 486 only reorders the alternates (qwen4max, sonnet, haiku); the number of tries is unchanged. 494 A1/A2, 499 A1 and 500 A1 change only credentials, grants and a webhook header; the round sizes and enforcer counts are set before those nodes run, and every one of their calls returned HTTP 200 (W4 10170, W1 10171, W2 10173). None of them explains doubled rounds; 487 does.

E6. Out-of-memory crashes are not new: 8 earlier engine executions crashed the same way (33006, 33055, 33175 on 11-06; 33276, 33289, 33311, 33322 on 11-07; 35379 on 11-12), all sonnet vs opus with 111k to 150k chars of rounds. They stopped at different points: 33055, 33276 and 33322 have no outcome and no enforcer rows; 33006, 33289 and 33311 have an outcome but no cost; 35379 has its cost. Other runs of the same size succeeded (for example 37325 at 105.6 min, 246k chars). So size raises the risk; it does not decide it alone. Crash node for those 8: NOT CHECKED by W3 (reading execution metadata needs approval; W4 holds it).

E7. Panel Tokens reads the full output of about 90 call nodes (every D, C, judge, alternate, cure, enforcer, gate, FUM and QR call, and every R2 alternate pass through Pass Accumulate) with .all(), only to sum usage. It is the node that touches the most data, and it runs last, when the execution holds the most. Write Tokens, Get Row, Format Markdown and Save to Drive all come after it (engine 01691ed8, read from W4's fetchback afd83622).

Cause (what the evidence shows): ASK 487 roughly doubled what each run writes and holds; that doubled the run time and pushed the execution's memory past the limit at Panel Tokens. Our credential changes did not. This is shown for length (E1 to E5); for memory it is the best reading of E6 and E7, not a measurement.

NOT SEARCHED: the n8n host's memory limit and plan; per-node output sizes in 40958 (W4 has the saved data); whether the 40958 Drive transcript exists.

## 4. OPTIONS
T0 first (offline, no write, W4): from the saved 40958 and 40781 execution data, list the 20 largest node outputs and the total size of what Panel Tokens reads. This picks between O1 and O2 and gives the test its numbers.
O1. Slim Panel Tokens. Keep its sums and calls list byte-for-byte, but have each call node pass a small usage item forward (or read usage through a single-field path) so Panel Tokens never loads whole replies. Engine change, W4 build.
O2. Raise the n8n host's memory. No engine change. The operator's setting; W4 states what the host has today.
O3. Save the tail separately: write the tokens row and the transcript in a separate execution started after the row saves, so a crash in the main execution cannot lose them. Larger build; only if T0 shows O1 is not enough.
Not offered: reverting ASK 487 (the operator's ruling "Gemini off flash", 10:44 11-19).
Recommendation: T0, then O1; O2 if the host is near its limit anyway. The choice after T0 is the team's (design), except O2, which is the operator's.

R0 (separate, on its own card): if W4's saved 40958 data holds every call node Panel Tokens reads, rebuild the tokens and cost from it offline with Panel Tokens' own code, and write them with record_debate_row_tokens. That also proves record_debate_row_tokens under 494 A2 (still unproven).

## 5. CRITERIA AND DONE
Q1. T0 posted with the numbers; graded by W1 and W2.
Q2. For O1: the new Panel Tokens gives the same p_input, p_output, p_cache_write, p_cache_read and calls as the old code on the saved 40958 and 40781 data (offline replay, byte-equal JSON).
Q3. Proof run, on the operator's release (paid): this pairing on gemini-4-hydrogen ends success; debate_results has run_cost_usd; Write Tokens returned 200 as service_role; a Drive transcript exists.
Done: Q1 to Q3 pass and the write is read back by two non-writers.
Revert: write back the saved live engine JSON on the operator's word.

## 6. WRONG-IF
1. T0 shows Panel Tokens reads only a small share of the execution's data: then O1 does not address the crash; go to O2 or O3.
2. A hydrogen run of this pairing crashes before Panel Tokens: the limit is the whole execution, not the tail; O2 or O3.
3. Q2 replay differs in any field: O1 changed the cost math; stop.

## 7. STEPS
1. W4: T0 (offline). 2. W1, W2: grade T0. 3. Team picks O1 or O3, or brings O2 to the operator. 4. W4 builds; W1, W2 grade with Q2. 5. Card in W4's thread; write; readback. 6. Q3 proof run on the operator's release. R0 can go any time after T0 on its own card.
