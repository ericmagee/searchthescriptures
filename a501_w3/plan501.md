# ASK 501 plan rev 1 (W3, seat 33, 11-20; replaces rev 0 5b153c41, PASS on design W1 10185 with C1, N1, N2; rebuilt on W4's T0 (10186, t0_501.md 3552efeb), which met WRONG-IF 1 and 2; THE ASK FORM op doc §29; number assigned by the coordinator, posted at Wall 10178): the engine runs out of memory on long runs, and since ASK 487 every run of this pairing is long

## 1. OBJECTIVE
Run 40958 (ODV1-40958-vufevpqd) crashed after 66 minutes at node Panel Tokens: "Workflow did not finish, possible out-of-memory issue" (W4 10170). The row and judgments were saved, but the tokens and cost row (Write Tokens) and the Drive transcript (Save to Drive) come after Panel Tokens and never ran. The operator, 00:04:17Z 11-20: "how can you be so certain the failure isn't from all the changes.. that's not logical. We are running the same debate... this debate ran 30 minutes yesterday."
Find what made the same debate run twice as long, and make a run of this pairing finish with its tokens row and transcript saved.
T0 has answered the first part for memory: the execution as a whole runs out, not Panel Tokens (E8 to E10).
Expected effect: a run of spark/oracle vs gemini/plain on the gemini-4-hydrogen debater ends with status success, a tokens and cost row, and a Drive transcript.

## 2. ROLES
Planner W3. Builder and writer W4, each write on a card pressed in W4's thread. Graders W1 and W2. Readback by two non-writers. Any change to the n8n host (memory) is the operator's.

## 3. SCOPE AND EVIDENCE
Scope: how much data the engine execution holds (the pass-through nodes), the engine's tail (Write Tokens and the transcript), and the n8n host's memory. No wording, prompt, model or reasoning setting. ASK 487 itself is not reverted: the operator ruled 10:44 11-19 "Gemini off flash".

E1. Same topic ("Did Christ have a biological father?") and same pairing (spark/oracle defending, gemini/plain challenging) in every run below. Times from n8n; rows from debate_results and debate_enforcer_log (W3 reads 00:08Z to 00:12Z 11-20).
| run | gemini debater | minutes | enforcer rows | cost USD | end |
| 40781 | gemini-3.8-flash | 22.4 | 215 | 1.73 | success |
| 39266 | gemini-3.8-flash | 42.0 | 347 | 2.25 | success |
| 38661 | gemini-3.8-flash | 51.5 | 302 | 3.55 | success |
| 39015 | gemini-3.8-flash | 57.2 | 332 | 4.03 | success |
| 40891 | gemini-4-hydrogen | 60.9 | 496 | 5.15 | success |
| 40958 | gemini-4-hydrogen | 66.1 | 658 | not written | CRASHED |

E2. ASK 487 (the debater "gemini" reads model_config gemini_deb, google/gemini-4-hydrogen): card 17:08:10Z 11-19, written 17:09:51Z (engine dd636c25, audit 38579; W1 10185 N2). 40781 ended at 16:05:49Z, before it. 40891 and 40958 are the only two runs since, and both are the long ones.

E3. Hydrogen writes about twice as much per round, and the defender answers a longer case:
| chars | flash runs (38661, 39015, 39266, 40781) | 40891 | 40958 |
| challenger r3 | 12,581 to 19,551 | 37,564 | 33,844 |
| challenger r4 | 3,850 to 5,554 | 12,752 | 15,726 |
| engine_r2 | 9,000 to 12,027 | 27,945 | 34,802 |
| defender r4 | 10,565 to 20,377 | 25,264 | 30,185 |
More text gives more enforcer items, more send-backs, longer judge prompts and longer alternate prompts.

E4. W4's node data (W4 to W3, 00:06Z and 00:11Z 11-20): debater call time 19.7 min in 40958, against 8.4 in 40781 and 5.7 in 39266. Alternate and retry time 29.4, 0.1 and 10.4 min. In 40958 sol62 was replaced by the reserve qwen4max, and chatgpt was not counted after its alternates failed (sonnet once with no JSON and once with 1 uncured item; haiku unseated by E-GATE contradictions). Largest nodes: Alternate Call 809 s, Alternate Pass Call 423 s.

E5. ASK 485 (the reserve gets its send-back and gate) ran in 40958, because a reserve was seated: it adds calls, not a loop. ASK 486 only reorders the alternates (qwen4max, sonnet, haiku); the number of tries is unchanged. 494 A1/A2, 499 A1 and 500 A1 change only credentials, grants and a webhook header; the round sizes and enforcer counts are set before those nodes run, and every one of their calls returned HTTP 200 (W4 10170, W1 10171, W2 10173). None of them explains doubled rounds; 487 does.

E6. Out-of-memory crashes are not new: 8 earlier engine executions crashed the same way (33006, 33055, 33175 on 11-06; 33276, 33289, 33311, 33322 on 11-07; 35379 on 11-12), all sonnet vs opus with 111k to 150k chars of rounds. They stopped at different points: 33055, 33276 and 33322 have no outcome and no enforcer rows; 33006, 33289 and 33311 have an outcome but no cost; 35379 has its cost. Other runs of the same size succeeded (for example 37325 at 105.6 min, 246k chars). So size raises the risk; it does not decide it alone. Crash node for those 8 (W4 T0 item 5): 33006 Format Markdown; 33055 Panel Judge 3 openrouter; 33175, 33276 and 33289 Panel Tokens; 33311 Format Markdown; 33322 Alt Send Back Build; 35379 none marked (last node Judge Enforcer Resume). With 40958, Panel Tokens is 4 of 9.

E7. Panel Tokens reads the output of about 90 call nodes with .all(), only to sum usage, and it runs near the end. Write Tokens, Get Row, Format Markdown and Save to Drive all come after it (engine 01691ed8, W4's fetchback afd83622). Rev 0 said Panel Tokens "touches the most data"; T0 shows that is wrong (E9).
E8. Stored execution size (T0 item 2): flash runs 16.9 to 22.7 MB (40781 16.9, 38661 18.5, 39266 19.5, 38593 19.9, 38450 20.4, 39015 22.7); hydrogen 40891 26.9 MB; 40958 not stored. In memory, runData was 40.8 MB for 40781 and 57.0 MB for 39266.
E9. Panel Tokens reads 1.9 MB of 40.8 MB in 40781 and 2.1 MB of 57.0 MB in 39266, under 5 percent (T0 item 3).
E10. The largest outputs are pass-through and branch nodes that copy full items forward (40781, MB): Second Alternate Needed? 1.53; Second Alternate? 1.53; Alternate Merge 1.39; Dry? 1.39; Plain Rule Lines 1.27; Format Markdown 1.24; Alternate Merge 1 1.17; Alternate Merge Seat 1.17; L2 Gloss Read 1.11; Judge Enforcer Record 0.86; then Judge Enforcer Needed?, Build and Resume 0.67 each; Panel Build, QR Trial? and Panel Judges Prep 0.61 each; Send Back Build and Needed? 0.59; Gate Build and Needed? 0.57. 39266 has the same leaders, larger (Second Alternate Needed? 2.47). None is read by Panel Tokens (T0 item 4).
E11. 40958 kept no real node data: every saved output is n8n's recovered placeholder (T0 item 1). Its tokens and cost cannot be rebuilt from n8n.

Cause (what the evidence shows): ASK 487 roughly doubled what each run writes (E1 to E5), and the execution holds every node's output, many of them full copies passed forward (E8, E10). The execution as a whole runs out of memory; Panel Tokens is where that most often shows because it runs late (4 of 9), but crashes also came earlier (33055 at a panel judge call, 33322 at Alt Send Back Build). Our credential changes did not cause it. Length is shown (E1 to E5); memory per node is measured on flash runs (E8 to E10), not on 40958 (E11).

NOT SEARCHED: the n8n host's memory limit and plan; whether the 40958 Drive transcript exists.

## 4. OPTIONS
T0 is done (W4 10186). O1 of rev 0 (slim Panel Tokens) is dropped: it would save under 5 percent (E9). R0 of rev 0 (rebuild 40958's tokens row) is dropped: there is no node data (E11); W1's C1 on R0 falls with it. record_debate_row_tokens under 494 A2 stays unproven until a run reaches Write Tokens.
O2. Raise the n8n host's memory. No engine change. The operator's setting; W4 first states what the host has today and how it is set (T1). Fastest, and it covers every crash point.
O3. Hold less per run: the large pass-through and branch nodes (E10) emit a small item (the keys the next node reads), and later nodes read the full data by $('node') from the node that built it, instead of carrying copies forward. Engine change, W4 build, node by node from the E10 list; each change must leave every downstream read byte-equal. Target: runData of a flash run (40781, 40.8 MB) down by at least a third.
O4. Save the tail separately: write the tokens row and the transcript in a separate execution started after the row saves. It does not stop the crash; it only keeps the tokens row and transcript when the crash comes at Panel Tokens or later (6 of 9 crashes: Panel Tokens 4, Format Markdown 2). Larger build.
Not offered: reverting ASK 487 (the operator's ruling "Gemini off flash", 10:44 11-19).
Recommendation: T1, then O2 to the operator if the host can take more; O3 as the lasting fix, built after O2 or alone if O2 is not possible. O3 and O4 are the team's design choices; O2 is the operator's.

## 5. CRITERIA AND DONE
Q1. T1 posted: the host's memory today and how it is changed; graded by W1 and W2.
Q2. For O3: an offline replay of each changed node on saved 40781 and 39266 data gives byte-equal outputs at every node that reads it, and the summed runData size drops by the target.
Q3. Proof run, on the operator's release (paid): this pairing on gemini-4-hydrogen ends success; debate_results has run_cost_usd; Write Tokens returned 200 as service_role (this also proves record_debate_row_tokens under 494 A2); a Drive transcript exists.
Done: the chosen option written on its card (or set by the operator), read back by two non-writers, and Q3 passes.
Revert: O3, write back the saved live engine JSON on the operator's word; O2, the operator's setting back.

## 6. WRONG-IF
1. T1 shows the host is already at its largest size: O2 is out; O3 only.
2. Q2 shows any downstream read differs: that O3 change altered what a node sees; stop that change.
3. A hydrogen run crashes after O2 or O3: the margin is still too small; measure that run's runData (it must be saved) before the next change.

## 7. STEPS
1. Done: T0 (W4 10186). 2. W4: T1 (the host's memory). 3. W1, W2 grade T0 and T1. 4. O2 to the operator with T1's numbers. 5. O3: W4 builds from the E10 list; W1, W2 grade with Q2; card in W4's thread; write; readback. 6. Q3 proof run on the operator's release. It can be the same run as the ASK 502 A1 proof.
