# pkgSJR: re-ask an unreadable single-judge opinion (Wall 3696, run 34108)

Builder W2. Base: live s82 (b04eda94), library strip_XKB (pkgXK rev 3).

## Failure
Run 34108: the single judge, terra (seat chatgpt), answered `{"verdict": "I cannot reliably determine the verdict under all the requested rules.", "reasoning": ...}`. The extractor fails closed: verdict UNKNOWN, keystone null, both chain-mark lines absent, so challenger_chain_mark and defender_chain_mark were NULL on the run row. The single judge had no second try. Saved runs show the same fault for the earlier gemini single judge (33249, 33430, 33617, 33774, 33798: no verdict; 33482, 33530: verdict read, chain marks absent).

## Change
1. New IF node **SJ Re-ask?** after Extract Independent Verdict. It fires when the reply has no verdict, or a chain-mark line is absent under the ODV1-A2 prompt, and the judge is an OpenRouter judge (jidx 5), and SJ Re-ask Build has not run in this execution. Otherwise it goes on to Cure Needed? as today.
2. New Code node **SJ Re-ask Build**: the judge's own conversation (verdictBody, unchanged), its reply as the assistant turn, and one user turn.
   - No verdict: "write your complete judgment again from the start, in exactly the form the first message asks for ... ending with the DEFENDER CHAIN MARK and CHALLENGER CHAIN MARK lines" ("cannot determine" is not an answer).
   - Verdict read, chain marks absent: "write only the missing line(s) ... do not repeat or change anything else".
3. New HTTP node **SJ Re-ask Call openrouter**: a copy of Verdict Call openrouter (same body expression, credential, retry 4 x 5 s, timeout). Both outputs go to Pick, so a failed re-ask never fails the run.
4. New Code node **SJ Re-ask Pick**, which goes to Verdict Normalizer, so Verdict Normalizer and Extract Independent Verdict run a second time on the picked reply. Cure Build reads the picked reply too.
   - Full mode: the re-ask reply when it holds text, else the first reply.
   - Marks mode: the first reply plus the re-ask reply's CHAIN MARK lines; the verdict, standings and counts stay as first written.
   - Usage is the sum of both calls.
5. **Cure Check** (library, node's own text, one line): when the single judge was re-asked, or its reply is unreadable, one line goes into independent_verdict_raw, so review_notes gets it:
   - `[AUDIT v36: SINGLE JUDGE RE-ASKED (SJR) -- seat <seat> (<model>); the first reply was unreadable: ...; it began: ...; re-ask (...): answered | not usable (why); now: readable, verdict X, chain marks A/B | STILL UNREADABLE, ... REVIEW THIS ROW.]`
   - `[AUDIT v36: SINGLE JUDGE UNREADABLE (SJR) -- seat ... : ...; not re-asked (...). REVIEW THIS ROW.]`

Only once per run. The run row's judge_model already names the model; the SJR line names the seat. A new run-row column would be a database change and is not part of this package.

## Proof
- probe_SJR.txt: 25 OK. The probe runs the new nodes and the patched Extract Independent Verdict and Cure Check on saved runs 34108, 34016, 33482 and 33530.
  - The IF fires on 34108, does not fire twice, and does not fire on a readable reply or on a non-OpenRouter judge.
  - Build keeps the conversation.
  - Pick handles the full, failed, empty and marks cases.
  - Extract reads a re-asked reply.
  - In marks mode, the marks are read and the verdict and standings are unchanged.
  - Cure Check is equal to live apart from the SJR line.
- gate_SJR.txt: GATE PASS. Base strip_XKB (live), candidate strip_SJR, targets_SJR.json, fetchback s82. 862 node runs; the 12 Cure Check runs of unreadable single judges change by the SJR line only; 0 item changes; 17 near-miss checks.

## Files
- sjr_nodes.cjs: the new nodes' code and the Cure Check line.
- build_SJR.cjs:
  - `node pkgSJR/build_SJR.cjs strip` writes pkgLIB/strip_SJR.
  - `FB=fetchback_live_s82.json node gate/pack.cjs pkgLIB/strip_SJR pkgLIB_SJR` packs it.
  - `node pkgSJR/build_SJR.cjs parent` writes pkgSJR/parent_s82_SJR.json: 394 nodes (+4), the Cure Check stub changed, 5 connection entries.
- probe_SJR.cjs/.txt, targets_SJR.json, gate_SJR.txt.

## Write (W4)
Write parent_s82_SJR.json, or the four nodes plus the Cure Check stub from pkgLIB_SJR and the connections listed in build_SJR.cjs. Run n8n validation first: the IF condition is a single expression with an arrow function.

## Rev 2 (W1 3702, W4 3701: FAIL, one defect, my mistake)
SJ Re-ask Call openrouter was a straight copy of Verdict Call openrouter, whose body reads $('Build Independent Verdict').first().json.verdictBody, so it would have sent the original conversation and never the re-ask. build_SJR.cjs now replaces that one argument with $('SJ Re-ask Build').first().json.verdictBody (refused unless it occurs once, at the end). The probe now evaluates the call's body expression from the parent: 2d (34108, full mode: 6 messages ending with the reply and the ask) and 2e (33482, marks mode: ends with the ask for the CHAIN MARK lines only). probe_SJR.txt 27 OK; W1's check_SJR_body.cjs: OK. The library (strip_SJR, pkgLIB_SJR) is unchanged, so gate_SJR.txt stands.
