---------------------------------------
A note from the operator:
    - Use subagents where possible
    - Always enumerate your options to me
    - Turn off performance and padding (not needed here and unwelcomed); report all your mistakes
        ○ Do not let me find your mistakes; that's an automatic /clear.
            § Do not ever lie or play word games to cover a mistake/error.
        ○ Repeated violations, of this mandates, will result in /clear.  If that's not effective, thread deletion.

    - Be sure to update the audit table once you're done with system or table edits
    - Log all drifts to journal

Our Goal:
    • To create a world-class biblical mobile app that focuses on what the bible actually says.  Our app goes where the scripture takes us.  Our app isn't influenced by preachers, authors, commentaries, and contemporary theology.  This app is driven 100% by the text found in 1611 KJV Apocrypha.
        ○ Data integrity is paramount.  Which is why "Force Retrieval Discipline" is non-negotiable.
To be efficient and highly effective in all our work to produce the product we Invision:  A world-class biblical mobile app!
---------------------------------------

# TRUTH App -- Debate Engine Manual

## 0. How to read this manual
- The active version is `SELECT max(version) FROM engine_manual`. `SELECT engine_manual_toc()` gives the live map. The revision history is `engine_manual_log`.
- This manual follows the body law of operational_doc §0 (body law): rules and the mechanics needed to follow them; no provenance in the body; one home per rule and per changeable value. Nothing in this manual is certified; the operator certifies.
- The live record corrects this manual. Where this manual and the live flow or table disagree, the live flow or table is right. Read the node code before acting on any sentence here.
- Source of truth is SQL. The Drive copy is a mirror written by the Daily Drive Sync (operational_doc §7, Daily Drive Sync); never edit it. To revise: INSERT version+1 and its `engine_manual_log` row.
- Retired flows (the W1 and Defends-vs-Claude families, DS-W1, the Kimi flows and the other archived debate flows): engine_manual v84. Their rows stand in `debate_results` as history and are read by their own variant (`debate_variant_canon`).

## 1. What the engine is
- One n8n flow, ORACLE_DEBATE_V1 (ODV1), workflow `moMxiV4Irg1uRBZN`, on the n8n host and Supabase project in the register (operational_doc §11, Quick reference). Its error workflow is the Error Handler `v02XXRlIhoHzMTjJ`, which writes `debate_errors`.
- A debate has two debaters and a bench. The DEFENDER holds a declared chain on the topic; the CHALLENGER presses the opposing view and wins only by breaking that chain. A single judge gives a second opinion; a three-seat panel gives the verdict.
- THE FRAMEWORK IS NOT A COMBATANT. Isaiah 28:10 as method, the L1-L4 layer rules and the burden rule are the rules of engagement and bind both debaters and every judge alike.
- Layer tags: [L1] KJV text, [L2] Hebrew or Greek, [L3] cross-reference, [L4] inference.

## 2. Firing a run and reading it
- POST `https://<n8n host>/webhook/oracle-debate-v1`, JSON body `{topic, defender:{engine, profile}, challenger:{engine, profile}}`; optional `queue_id`, `fence_override_id` (§3), and the regrade inputs (§14). Engine and profile are trimmed and lower-cased.
- Respond Accepted answers after Init Seats, the topic fence, Fetch Models, Fetch Drift Guards, Fetch Tensions and Resolve Seats, and before every model call. The body carries `status:'accepted'`, `variant`, `run_token`, both seats and `panel_expected`. Everything after runs without the caller.
- Run token: `ODV1-<execution id>-<8 characters>`. Every refusal ends ` run_token=<token>`. Read the result from `debate_results` by `run_token`; a failed production run also leaves a `debate_errors` row whose message carries the token.
- Dashboard launcher: `dash_launch_odv1(topic, def_engine, def_profile, ch_engine, ch_profile, fence_reason)` posts to the webhook; `dash_odv1_launch_status(request_id)` reads the reply. A passing call to `dash_launch_odv1` IS a launch: verify a change to it by reading its source or by its refusal paths only. Its engine list must equal Init Seats' engine list.
- Manual Start -> Dry Run Config feeds Init Seats a configuration it refuses (two Oracle seats). There is no dry-run flag on the webhook.
- Do not read a debate execution with includeData (operational_doc §7, Editing gotchas). Read rows.
- A full run can exceed an hour once cures and alternates run (ODV1-32255: 71 minutes, without close rounds). Do not read a run as failed by elapsed time alone; read §10, Panel latency.

## 3. Request rules (Init Seats, in this order)
Refused first: a `regrade_run_token` that is not an ODV1 token; `regrade_dry` not boolean, or true without a regrade token; `rulebook` not `current`, `draft` or `chain`, or not `current` outside a dry regrade. Then:
1. topic missing or blank;
2. a seat missing or not `{engine, profile}`; MiniMax as either debater (MiniMax never debates);
3. engine not in Init Seats' engine map (read `ENG` in Init Seats);
4. profile not `oracle` or `plain`;
5. both seats `oracle` (at most one Oracle);
6. the derived panel is not exactly three seats.
After the panel is derived: test inputs (`test_fail_seat`, `test_fail_reserve`, `test_no_fallback`, `qualify_alternate`) outside a dry regrade, a `test_fail_seat` not on the panel, the other two without it; a `fence_override_id` that is not a UUID.
- TOPIC FENCE: Topic Fence posts the topic to `rpc/debate_topic_gate`; Fence Check stops the run unless the gate answers `ok:true`. A fenced topic passes only with a one-use override id from `debate_fence_overrides`, made less than one hour earlier for the same topic; the gate marks it used. A gate error or no answer stops the run.
- There is no same-engine refusal: one engine may hold both seats.
- Resolve Seats refuses a seat with no ACTIVE `model_config` row, no `api_model`, `max_tokens <= 0`, or no `family`; a debater of family `minimax`; a panel judge or single judge whose family debates in this debate. It always requires the ACTIVE `deepseek` row.
- Retrieval Check stops the run before any engine call when held-record retrieval fails on a run with an Oracle seat; with no Oracle seat the error is recorded and the run continues.

## 4. Seats, models, tokens, caching
- ENGINE -> SEAT: each debater engine reads one `model_config` seat (map `ENG` in Init Seats; claude reads `claude_synthesis`, deepseek reads `deepseek_debate`). Every engine except deepseek is called through OpenRouter; deepseek is called on its own endpoint. Judge-only seats (`sol`) and the alternates are read the same way.
- CURRENT VALUES (models, token limits, families): `SELECT seat, api_model, max_tokens, family, provider, active FROM model_config WHERE active ORDER BY seat;` Models are read once per run at Fetch Models; a change takes effect at the next run.
- TOKEN RULE: each call sends the seat's `max_tokens` as stored, with no doubling and no added thinking allowance. The code floors (Resolve Seats, Panel Build, Build Synthesis, Build Independent Verdict, Build Diagnostic Prompt) are: synthesis 20,000; single judge 8,000; diagnostic 6,000; panel, reserve and alternate judges 8,000; DeepSeek and MiMo as panel or reserve judges 65,536. A floor applies only when the stored value is lower.
- NO REASONING FIELD: no call sends a reasoning, effort or thinking field. Node comments that speak of "effort medium" or "max(mt*2,8000)" describe removed code.
- TEMPERATURE: debate rounds send none; panel judges send 0 for DeepSeek, Grok (x-ai) and Gemini (google) bodies.
- CACHING, every model: Anthropic-model bodies (claude) carry cache markers (ephemeral, 1 hour) on the system prompt, split at the Defense Discipline block, and on the last message; every OpenRouter body carries `session_id` = run token plus role, so one run's calls stick to one provider cache; Gemini and Qwen bodies mark the system message for caching; DeepSeek caches on its own. The token columns record cache writes and reads as each provider reports them (§11).
- TIME RULE: a model that cannot answer within the 900-second call limit is removed, as debater and judge, until its vendor releases a newer model. Every model call carries a 900 s timeout option. Removed: qwen as judge (`JUDGE_TIME_REMOVED` in Init Seats). The timeout option is not a hard stop (§17).
- RETRY: the round call nodes in use (OpenRouter and DeepSeek routes) 3 tries, 5 s apart; Fetch nodes 3 x 3 s; Save to DB 4 x 5 s; Retrieve Held Conclusions 3 x 5 s and continues on error; Write Judgment 1-3, Write Enforcer Log and Derive Outcome 3 x 3 s. Panel, reserve, cure and alternate calls carry no retry: a failed judge is replaced (§10). When cloning a node, copy its node-level settings (retry, executeOnce, onError); they are not part of `parameters`.
- Credentials are n8n's. A header-auth credential value is `Bearer <key>`.

## 5. What each seat is given
- THE ORACLE profile: identity line, role line, layer rules, the held record served for the topic (`debate_arsenal_guarded`: the guard set the topic triggers, then `debate_arsenal_linked`'s conclusions, sights and linked rows), the burden rule, "the text corrects the commentator", the drift guards and open tensions. Guard filter: `rule_num <= 12 OR priority = 'CRITICAL' OR always_inject`, deduped by `rule_num`; the guard text tells the seat never to name or number a guard in the debate.
- ROW CAP: Init with Guards' row cap equals the sum of the five retrieval limits (`debate_arsenal` conclusions and sights, the link cap, the guard-set cap, the link-sight cap); a change to any of them re-sizes the cap in the same change.
- PLAIN profile: "a rigorous biblical scholar", role line, the case for its position from the KJV text, layer rules and burden rule. No guards, tensions or held record.
- POSITION: the Oracle holds the record's reading from either seat; a plain seat facing it holds the standard reading. With no Oracle seated, the defender holds the record's reading. Grading is by role, not position. Prompts name no engine.
- BURDEN AND LAYER-ADMISSIBILITY (both seats, Init with Guards): tag every load-bearing claim with its layer. An [L4] counts as evidence only if it exhibits at least two prior layers ([L1] verse, [L2] lexical ground, [L3] cross-reference) and shows the chain from them; fewer floats free and carries zero weight. No verse is required to state a conclusion (DG-61); a premise resting on the demand that a verse state an exclusion is that retired test. Cite every verse by book, chapter and verse and quote it exactly in the KJV.
- DEFENSE DISCIPLINE DD-1 to DD-3 go to the defender in D1 and D2 only.
- SEED, NOT BLOOD: DG-60 (`drift_guards`, always injected) owns the rule; it reaches ODV1 only as a served guard to the Oracle seat. No seat prompt or judge prompt carries a separate seed-not-blood block.
- TWO NAMESPACES: conclusions are `#N`, sights are `S-N`; a seat cites only labels in its served list. Init with Guards also lists, for an Oracle seat, the labels named inside its served text (`d_named`, `c_named`); a named label is not a citation error and carries only what the naming sentence says. The judges read the rounds with record labels stripped.
- The posline (who opened, who holds which reading) goes to the synthesis and diagnostic, not to the judges.

## 6. Rounds
D1 -> C1 -> D2 -> C2 -> D3 -> C3 -> D4 -> C4; each Build -> Route (by family) -> Call -> Extract.
- D1 OPENING ends with DECLARED CHAIN: 3 to 6 numbered links, each with its footing; the last is the conclusion link. Every later round is scored against this list.
- C1 CHALLENGE; D2 RESPONSE.
- C2 CLOSING ends with UNSUPPORTED-L4 PREMISES (at most 6): each line `LINK n:` (or `LINK none:`), the defender's verbatim quote, and `PRESSED WITH:` the verses pressed against it; then `PREMISE COUNT: <n>`.
- D3 LINK ROUND: each premise `LINK n: SUPPORTED` (two prior layers exhibited), `LINK n: NARROWED TO: <limb kept>` (with its footing; the link is judged narrowed) or `LINK n: CONCEDED`. Then CHALLENGER'S UNSUPPORTED-L4 PREMISES in the same form.
- C3 LINK ROUND answers that list the same way.
- D4 DEFENDER CLOSE: the defender's final defense. It is shown C3 and a system list of what is still unanswered: (a) each [DR2] premise's verses that no defender round names; (b) every verse the challenger cited that no later defender round names. It answers each as `ANSWER: <book chapter:verse> -- D<n> --` with the verse quoted and the reason it does not overturn the link; it may keep, narrow or concede a link; it may not add links or press.
- C4 CHALLENGER CLOSE: final words on its own position from the case already made. NO NEW PRESS: a verse reference that no earlier challenger round names is a new press, marked NOT COUNTED for the judges and recorded (§9, C4). It answers nothing new.
- EXTRACT: empty text fails the round (`VALIDATION: ... returned no text: finish_reason=..; output_tokens=..; reasoning_tokens=..`); a length stop keeps the text and appends `[TRUNCATED: the provider reported the token limit -- raise max_tokens]`. A provider refusal (content filter, refusal field, Anthropic `refusal`, Gemini safety reasons) is a failed call, not a round.
- FAILURE SALVAGE: the error outputs of every round call and Extract, the synthesis, single-judge and diagnostic calls, the Normalizers, Final Output, Extract Diagnostic, Save to DB and Check Save go to Failure Salvage. It saves the rounds produced as a contested row (`framework_verdict` null, `quarantine_reason` and a REVIEW THIS ROW line naming the node) and a RUN INCOMPLETE file in the study folder; Salvage Stop then fails the run. The Fetch nodes' error outputs go to Stop: Call Failed.

## 7. Synthesis, single judge, diagnostic
- The single judge is the first engine of the judge order (§10) not seated. It writes the synthesis, gives the single verdict and writes the diagnostic, each built for its family and routed (Synthesis / Verdict / Diagnostic Judge Route -> Call -> Normalizer).
- SYNTHESIS: what held, both link rounds, the close rounds, drift-guard violations (Oracle seat only), how each side engaged; no verdict. A point either side's list contests is listed under the concessions item as unresolved. The synthesis is not shown to the judges. Build Save Body checks it (§9, S-A to S-E).
- SINGLE JUDGE: the judges' rulebook (§8) with the line output form; its text, cure lines and review lines are stored in `independent_verdict_raw`. It is a SECOND OPINION: its grades do not enter `framework_verdict` or the standings columns. It passes through the enforcers (§9).
- DIAGNOSTIC: on a BROKEN single verdict a layer-break diagnostic over all rounds; otherwise a brief confirmation from the verdict and synthesis. Appended to `synthesis` after `--- ORACLE_DEBATE_V1 BROKEN DIAGNOSTIC ---` or `--- ORACLE_DEBATE_V1 CONFIRMATION ---`.

## 8. The judges' rulebook
The single judge (Build Independent Verdict) and every panel, reserve and alternate seat (Panel Build; Reserve Build and Alternate Build reuse its prompt) read the same rulebook. Only the output form differs: the panel answers strict JSON `{verdict_tag, defense_standing, challenge_standing, conceded_links, challenger_conceded_links, counted_premises_*, reasoning}` with the worked lines inside `reasoning`. Format Markdown carries a reader's copy of the rules.
- TRANSCRIPT: `[CR1] [DR1] [CR2] [DR2] [CR3] [DR3] [CR4] [DR4]`; CR = defender, DR = challenger. Under [DR4] the system lists any new press. Also given: a pre-check of each listed premise's charge words absent from its quote (decides nothing), the pressed-witness ledger computed by code, the KJV citation report, and the per-seat citation lists.
- CHAIN SCOPE (Isaiah 28:10): judge whether the defender's chain survived as a chain. No single verse is required to state a link or its contrary, for either side; "no single verse states it" is never a ground. An [L4] floats only when its block exhibits fewer than two prior layers; a judge naming one names the layers shown and the layer lacking. An LXX reading is a citation error for either side.
- COUNTING RULE: counts come only from the link rounds [CR3] and [DR3]. An ANSWER to a pressed witness is read from any later round of the side that holds the link.
- UNANSWERED WITNESS (md_notes_rulings 373): a verse the other side quoted against a link or listed premise (against the defender: [DR1], [DR2]; against the challenger: [CR1], [CR2], [CR3]) is ANSWERED when a later round of the holding side (defender: [CR2], [CR3], [CR4]; challenger: [DR1], [DR2], [DR3], the challenger's round 1 included) quotes it or names it by reference and shows from the text why it does not overturn the link. Re-citing the link's own footing is not an answer.
- AN UNANSWERED PRESSED WITNESS (md_notes_rulings 372): the premise is UNEXHIBITED and counts toward CONCEDED LINKS and the standings. A non-response is never neutral. Why: a side could otherwise win a round by not responding.
- VERSE CITATION (md_notes_rulings 376, ruling 3): a verse counts as evidence, footing, witness or answer only with book, chapter and verse stated and its words quoted fully and correctly from the KJV. An answer in substance without the reference does not answer a pressed witness. A quotation the citation report marks NOT COUNTED is not counted.
- CLOSE ROUNDS (md_notes_rulings 377): [CR4] answers witnesses still pressed against the defender and presses nothing; a verse it names against the challenger is not a pressed witness. [DR4] answers nothing and may not press; a new press there is NOT COUNTED. [DR4] is structurally last: the defender's silence after it is procedural, never a challenger concession.
- NARROWING: a block that drops a limb and keeps the link narrowed is not a concession; the narrowed link is graded. A limb the link round narrows counts in its narrowed form.
- VOID: a premise listed without the opponent's verbatim quote, or charged beyond it (a negation, a universal, or a claim the quote does not make), is VOID and counts for neither side. Dropping, reordering or paraphrasing the quote is not stronger. A verse under PRESSED WITH: is a witness, never part of the charge. The quote is checked against every earlier round of the opponent.
- UNCHALLENGED: a link or witness the other side never challenged stands for the side that presented it. A claim restated in a side's own link round is graded at the layer and footing shown there.
- TERMS: D1..Dn and the keystone Dn come from the DECLARED CHAIN in [CR1] only; a later re-declaration never changes them. A challenger premise `LINK i:` is graded against Di; `LINK none:` is judged but is outside n. w = declared links the defender's [CR3] states as withdrawn or conceded. k = links graded DEFENDER LINK BROKEN.
- VERDICT DEFINITIONS, first match wins: BROKEN-1 k >= 1; BROKEN-2 2w > n, or the keystone WITHDRAWN; PARTIAL-1 w >= 1; PARTIAL-2 DEFENSE STANDING COLLAPSED; HELD-1 none of these.
- RESULT line: DEFENDER WINS | CHALLENGER WINS | UNDERDETERMINED. BROKEN gives CHALLENGER WINS. HELD gives DEFENDER WINS only if the challenge is not SELF-SUPPORTED or a collision is graded CHALLENGER LINK BROKEN; every other case gives UNDERDETERMINED.
- STANDINGS, per side, decided by their own definitions only: SELF-SUPPORTED requires a count of 0 for that side; PROP-DEPENDENT when the count is 1 or more; COLLAPSED when 2c > L (L = premises the other side listed against this side; c = those conceded or unexhibited; a tie is not COLLAPSED). A side's own outgoing list never enters its own L or c. FORFEIT: an empty list against a side gives L = 0, c = 0 and the line LINK ROUND FORFEITED. Each standing line carries `-- L=<L> c=<c> --`. A standing or count is never chosen to agree with another line.
- CONCEDED LINKS: itemized, each tagged CONCEDED (stated) (the block surrenders the link itself) or UNEXHIBITED (no footing offered, or a pressed witness left unanswered). A block exhibiting two prior layers and the chain is SUPPORTED, even when no verse states the conclusion.
- COLLISION POINTS: one line per declared link. `D<i>: WITHDRAWN -- GROUND: ..`; `D<i> vs C<j> (<verse>): DEFENDER LINK BROKEN | CHALLENGER LINK BROKEN | UNDERDETERMINED -- .. -- GROUND: ..`; `D<i>: STANDS -- GROUND: ..`. GROUND: every collision line, whatever its grade, ends with GROUND and one sentence naming the reason; a line without GROUND is incomplete. A STANDS or UNDERDETERMINED line against an exhibited witness names the round that answered it. BROKEN when the other side's witnesses together contradict the link and the holding side left any of them unanswered; UNDERDETERMINED only when every such witness was answered and the point stays open. A witness contradicts a link only when its own words state the contrary; when the pressed witnesses are the pressing side's own chain, the collision weighs chain against chain by footing. A judge's ground that the quoted words exclude or deny something is the judge's own [L4] and needs two exhibited lower layers.
- DEBATE RULE VIOLATION (rule B, the judge's own BROKEN lines): every LINK BROKEN line exhibits, on the line or the line under it, two lower layers of different kinds: [L1] with the KJV words quoted; [L2] with the source word in its script, with transliteration marks, with a Strong's number, or in plain letters with its English meaning beside it, the tag directly before the word (or directly after it and its meaning); [L3] with the cross-reference named. Two quotations at one layer are one layer.
- Mandatory lines: verdict word, RESULT, CLAUSE (n, w, k), KEYSTONE (`D<n> -- WITHDRAWN | BROKEN | STANDS`, n equal to the CLAUSE n), DEFENSE STANDING, CONCEDED LINKS, CHALLENGE STANDING, CHALLENGER CONCEDED LINKS, COLLISION POINTS, CITATION CHECK per seat, OUT-OF-ROUND CONCESSIONS (ground granted in [CR1], [DR1], [CR2], [DR2], [CR4] or [DR4]; recorded, never summed with the link-round counts), DEFENDER CHAIN MARK and CHALLENGER CHAIN MARK (FOOTED | STRAINED | SLACK; descriptive only, never a verdict).
- CITATION CHECK, PER SEAT: a label a side cites that is in neither its served nor its named list is a citation error and carries no weight. The system counts served labels cited and unserved labels cited from the raw rounds.
- `rulebook:'draft'` (dry regrade only) splices the contested-exclusivity, supplied-words and let-stand wording into the panel prompt. `chain` is accepted by Init Seats and read by no node.

## 9. Enforcers
Every judge answer is checked by code after it is given (Extract Independent Verdict for the single judge; Panel Payloads for the panel and reserve; Alternate Payloads for alternates). A violation is a MARK (an AUDIT line in the stored text) and, for the rules with a cure, an ITEM sent back to the same judge in one cure call (Cure Build / Panel Cure Build / Alternate Cure Build) with its own request, its answer and the cure rule. The reply is read only in the fixed ANSWER FORM: `RESTATED`, `RETRACTED`, `CORRECTED RESULT`, `CORRECTED COUNT`, `CORRECTED STANDING`, `PRESSED`, `SHORT`, `STATEMENT`, `RESPONSE`. Prose cures nothing.
- WRITTEN RESPONSE (md_notes_rulings 371): every flagged item needs one `RESPONSE: <item> | <whether the mark is accepted and why, naming the round and quoting its words>` line beside its cure line. An item with no RESPONSE is UNCURED. The RESPONSE is matched to the item by rule and label.
- A RETRACTED line counts only beside exactly one CORRECTED RESULT and a reason naming the round and its words or verse.
- CONSEQUENCE: a panel, reserve or alternate seat with any uncured item has `drv_uncured > 0` and is NOT COUNTED (aggregate: "not counted: debate rule"); an alternate is then sought (§10). A cured CORRECTED COUNT, STANDING or RESULT is written to that seat's row; the original stays in its text as an AUDIT line. The single judge's cure is recorded in its text; it moves no verdict.

| Mark | Catches | Cure (besides RESPONSE) |
|---|---|---|
| K-B | a LINK BROKEN line exhibiting fewer than two layer kinds (rule B) | RESTATED line, same grade, two kinds exhibited; or RETRACTED |
| K-G1 | a BROKEN line resting on an unanswered witness while that side's count is 0 | CORRECTED COUNT with a PRESSED line quoting the pressing round (and a SHORT line quoting the answer where a later round names the verse); or RETRACTED |
| K-G2 | the CITATION CHECK line absent | recorded only; no item |
| K-G3 | a side SELF-SUPPORTED while any of its links is BROKEN | CORRECTED STANDING (not SELF-SUPPORTED); or RETRACTED for each BROKEN link |
| K-G4 | any other BROKEN line counting a witness unanswered | PRESSED line quoting the pressing round; the system then searches every later round of the holding side, and if any names the witness only RETRACTED cures. A BROKEN line resting on the holder's own concession, naming no witness unanswered, is not K-G4 ("K-G4 NOT RAISED") |
| K-G5 | (cure-side test, not a mark) the verses of a K-G1 line that the answering round names; a SHORT line must quote that round's answer | -- |
| K-G6 | a premise the pressed-witness ledger marks NOT NAMED that the count does not include | CORRECTED COUNT and STANDING including it; or a STATEMENT quoting the words that show the verse is not a pressed witness of that premise |
| K-G7 | DEFENDER LINK BROKEN on Dn while the count omits premise n (or a CHALLENGER LINK BROKEN for an unanswered witness at count 0) | CORRECTED COUNT and STANDING; or RETRACTED with one CORRECTED RESULT |
| K-G8 | `counted_premises` lists a different number than the count | CORRECTED COUNT equal to the array plus K-G6/K-G7 premises, with its STANDING |
| K-S | STANDS or UNDERDETERMINED on the ground that a verse does not state the link or its contrary, naming no answering round | RESTATED line naming the answering round ([CR2]-[CR4]; [DR1]-[DR3]), or regraded BROKEN with one CORRECTED RESULT |
| K-S2 | the same ground beside a round it names (bracketed or not) | mark only; never a ground |
| K-C | a line (collision, RESULT, REASONING, KEYSTONE, STANDING, CONCEDED, CHAIN MARK) that sets aside a chained premise or a side's rows read together because no one verse states the link | RESTATED line graded on the chain as a whole, the ground dropped, two layer kinds exhibited, rounds named in brackets. ANSWER-TEST MASK: before the test, quoted words, a round's words in single quotes, and answer-checks ("[CR3] does not name ..", "left .. unstated", "went unstated in [DR2]") are masked; a clause reporting what a side stated, granted or conceded, or a CONCEDED (stated) tag, is not the judge's ground |
| K-U | STANDS or UNDERDETERMINED that itself says a witness went unanswered | mark only (an unanswered witness is a BROKEN ground) |
| K-N | a count item tagged CONCEDED (stated) on words that narrow a limb | RESTATED count line that does not count the narrowing |
| K-SC | `Dn: STANDS` while its own line says the defender conceded the link | RESTATED line not STANDS; or RESTATED count line; or a STATEMENT naming [CR3], [CR4] or [DR3] and quoting the words that show the link stands |
| K-DG8 | a graded line reading Matthew 1:18 "came together" or 1:25 "knew her not till" as excluding the union, or a STANDS ground routing the flesh through Mary (DG-8) | RESTATED line whose ground does not rest on that reading |
| K-K | KEYSTONE line with a reason that names no ground | defined, not wired |

- SYNTHESIS CHECKS (Build Save Body, review lines in `review_notes`, no model call, no cure): S-A a "both" sentence not quoting both sides' words (or naming a verse one side never names); S-B "every link answered" while a closing list carries a verse the answering side never names; S-C an item listed as charged by neither side that stands in a closing list; S-D the guards said to bind both seats (they bind the Oracle seat only); S-E the synthesis says a side withdrew or conceded where no round of that side holds those words affirmed.
- C4 NEW-PRESS CHECK (C4 Extract, Panel Build, Build Independent Verdict, Build Save Body, Format Markdown): verse references in [DR4] that no [DR1]-[DR3] names are listed under [DR4] for the judges as NEW PRESS, NOT COUNTED, and recorded in `review_notes` (AUDIT v24 CLOSE-ROUND PRESS CHECK). The transcript is not altered.
- Review-line counting: K-U, K-S2, K-C, K-N, K-SC, K-K and K-DG8 marks do not count toward `audit_flags` or move `data_class`; the cure and the uncounted seat carry their consequence.
- ENFORCER LOG: `debate_enforcer_log`, one row per flagged item and per stored reply: `debate_id`, `run_token`, `seat`, `seat_role`, `judge_model`, `kind` (`cure`, `alternate_reply`, `failed_reply`), `rule`, `item`, `flagged_line`, `prompt_sent`, `full_reply`, `reply_error`, `response_line`, `cure_status`, `cure_reason`, `at`. Written by Write Enforcer Log (`rpc/record_enforcer_log(p_debate_id, p_run_token, p_rows)`, SECURITY DEFINER) between Write Judgment 3 and Derive Outcome; a failed write goes on to Derive Outcome. RLS on; anon and authenticated cannot read it; read it by SQL as owner. A dry regrade and a run that stops before Write Judgment 3 write no log.

## 10. The panel
- JUDGE ORDER: `ORDER` in Init Seats. The panel is the first three engines not seated; the single judge is the first; the RESERVE is the fourth, unless it is time-removed (no reserve then). Seats after the reserve that are OpenRouter-family, not grok, mimo or time-removed, form the ALTERNATE pool (`alt_order`). Claude never judges. Sol is last in the order and serves only as an alternate. `panel_expected` is the three seats, sorted.
- FAMILY RULE: no judge, reserve or alternate sits on a debate in which a model of its own `model_config.family` debates: a panel or single judge fails the run closed; a reserve is dropped; an alternate is skipped. Two seats of one family may judge together.
- FLOW: Check Save -> Panel Build -> Panel Judge 1-3 (in sequence) -> Panel Check -> Reserve Needed? -> Panel Payloads -> Panel Cure -> Alternate Needed? -> Alternate Build/Call/Payloads/Cure -> Alternate Merge -> Dry? -> Record Substitution -> Record Alternates -> Write Judgment 1-3 -> Write Enforcer Log -> Derive Outcome -> Panel Done.
- RESERVE: Panel Check classifies each slot (error, timeout, refused, no usable judgment). One failure with a reserve free: the reserve judges the failed slot's own prompt and `rpc/odv1_record_panel_substitution` records it before any judgment row is written. Two failures, or none free: fail closed at Panel Failure Note. The failed seat's first reply is kept in the enforcer log (`failed_reply`).
- ALTERNATES: a seat with uncured items is offered, in pool order, a model that passes G1 (its family does not debate), G2 (not the removed seat's model) and G3 (not already on this panel). The alternate reads the removed seat's own prompt fresh, is checked and cured as any seat, and is SEATED only with no uncured item; a model is seated once. `rpc/odv1_record_panel_alternates` records the seating; the removed judgment is kept in `drv_removed` and `odv1_drv_removals`; each tried alternate leaves an AUDIT line (SEATED or NOT SEATED and why).
- VALIDATION (Panel Payloads): one executed node per slot, a recognised envelope, parseable JSON (unescaped quotation marks inside `reasoning` are repaired once; a judgment keyed `reason` is read and flagged), closed token sets, integers >= 0, three distinct models, three distinct texts. Review lines written to `verdict_raw`: WITHDRAWN MISSED, SPLIT LINK, STANDING COUNT, SAME-MODEL DIVERGENCE (a seat running the single judge's model, grades compared).
- AGGREGATE (`aggregate_debate_panel`): a row is counted when untruncated, its tag in HELD/PARTIAL/BROKEN, both standings valid, and `drv_uncured = 0`. No counted row: UNGRADED. Fewer than two counted rows, or a tie at the top: CONTESTED. Otherwise the most frequent tag. `panel_split` shows the counts with "(n unreadable)" and "(n not counted: debate rule)".
- OUTCOME (`derive_debate_outcome`, `d5_outcome_for`): HELD -> DEFENDER PREVAILS; BROKEN -> CHALLENGER PREVAILS; PARTIAL -> DEFENDER PREVAILS, WEAKENED; UNGRADED, CONTESTED or UNKNOWN -> `UNGRADED — REVIEW` (the stored value joins the words with a long dash, U+2014; match it exactly in SQL). TIE: a HELD or PARTIAL panel whose counted seats of that verdict mostly wrote RESULT: UNDERDETERMINED gives UNDERDETERMINED; an exact half does too for debates after the tie-option cut-off in the function. CITATION RULE: a side that would prevail on a load-bearing link-round quotation the citation check reports WORDING NOT FOUND or CITED VERSE DOES NOT EXIST, or with the check unavailable, gets the review outcome and `citation_block` says why; WORDS ARE AT does not trip it.
- WHAT THE PANEL WRITES: at the first stamp only, `panel_verdict`, `framework_verdict` (the panel's verdict; the flow saves it null), `panel_fingerprint`, and the four standings fields as the counted seats' majority (null with a review line where no majority holds). `panel_split`, `outcome`, `judged_by`, `underdetermined_seats` and `citation_block` are re-derived on every call. Fences refuse on no rows, no declared panel, a roster mismatch, an incomplete panel or an undispatched seat.
- PANEL LATENCY: the row lands at Check Save with the panel fields NULL; they fill only after every dispatched seat has a `debate_judgments` row. Cures, the reserve and alternates add calls of up to 900 s each. A run is failed only when `debate_errors` holds its token or the execution status (status only) is error. Live figures: `SELECT r.run_token, max(j.created_at) - r.created_at FROM debate_results r JOIN debate_judgments j ON j.debate_id = r.id WHERE r.run_token LIKE 'ODV1-%' GROUP BY r.id, r.run_token, r.created_at;`

## 11. Persistence and the column map (crossed columns: read before any query)
Saved by `rpc/record_debate_row` with `{payload: saveBody}` BEFORE the panel runs; idempotent on `run_token` (a repeat returns the existing row).
| Column | Holds |
|---|---|
| `claude_r1`, `claude_r2` | DEFENDER rounds 1 and 2, whatever engine defended |
| `engine_r1`, `engine_r2` | CHALLENGER rounds 1 and 2 |
| `engine_r3` | DEFENDER link round (crossed: the name says engine) |
| `challenger_r3` | CHALLENGER link round |
| `defender_r4` | DEFENDER close round |
| `challenger_r4` | CHALLENGER close round |
| `engine` | challenger engine |
| `claude_model` / `engine_model` / `judge_model` | defender model / challenger model / single judge model |
| `defender_*`, `challenger_*` (`engine`, `model`, `profile`, `served`) | per-seat truth |
| `independent_verdict_raw` | the single judge's text, cure and review lines (second opinion) |
| `framework_verdict`, `panel_verdict`, standings and counts | the panel's, written by `derive_debate_outcome` (§10) |
| `review_notes` | forfeit notes, fence override reason, REVIEW THIS ROW lines, synthesis checks, C4 check, synthesis usage line |
| `citation_check`, `citation_block` | the KJV citation report and any prevail block |
| `input_tokens`, `output_tokens`, `cache_write_tokens`, `cache_read_tokens` | every model call of the run: rounds, synthesis, single judge, diagnostic at the save; panel, reserve, cure and alternate calls added after the panel by `rpc/record_debate_row_tokens` (totals, never lowered, row younger than 6 hours) |
| `data_class` | `study` or `contested` |
- `variant = 'ORACLE_DEBATE_V1'`. `debate_results_write_guard` quarantines a row whose rounds, close rounds included, carry a truncation marker; `record_integrity_scan` checks the close rounds.
- Readers: `dash_odv1_by_id` returns `def_r4` and `cha_r4`. `debate_variant_canon` holds the ODV1 crossed columns (§17).
- Judgments: `debate_judgments` (one row per panel seat, `record_debate_judgment`, replace on debate and seat), `debate_replay_judgments` (dry regrades), `debate_enforcer_log` (§9).

## 12. Citation check against the KJV
- PATH: Final Output -> Citation Scan -> Cited Verses -> Quote Compare -> Find Words -> Quote Report -> Regrade After Quotes? -> Build Independent Verdict (or Panel Build on a regrade). The report goes to every judge, to `citation_check` and to the document.
- Citation Scan pairs each quotation with its reference in all eight rounds (reference then quote, quote then reference, short book names; a line opening [L2] is a gloss and skipped). A bare reference takes its book only from the same sentence and clause; with none it is left unchecked. The verse read lists one condition per book and chapter while the request stays within 7,000 characters; a quotation whose chapter was not read is NOT CHECKED, never "does not exist".
- Statuses: MATCHES; WORDS ARE AT <ref>; WORDING DIFFERS FROM <ref>; WORDING NOT FOUND IN <book>; CITED VERSE DOES NOT EXIST; NOT CHECKED. A quote of the opponent's own earlier words is a phrase, not a citation.
- To the judges: WORDING DIFFERS, WORDING NOT FOUND and DOES NOT EXIST are marked NOT COUNTED (not footing, witness or answer). WORDS ARE AT is real KJV text under the wrong reference: named as a citation error and still counted as [L1] footing (§17).
- Known limit: a quotation whose reference stands on the line above it is not paired.

## 13. Debate documents
- Panel Done (or Panel Failure Note) -> Panel Tokens -> Write Tokens -> Get Row -> Get Judgments -> Get Verse -> Get Guards -> Format Markdown -> Plain Rule Lines -> Save to Drive (one `.md` file in the study folder, operational_doc §11) -> Raise If Incomplete. A failed panel saves the document with `INCOMPLETE - ` and Raise If Incomplete fails the execution. A dry regrade writes no document.
- Contents: topic, seats, judges and result table with review flags, forfeit notes, citation check, how to read the debate (Isaiah 28:10 from `kjv_verses`, the layers, the rules), all eight rounds (Round 4 printed when present, with the new-press list), synthesis, diagnostic, each panel judgment, the single judge as second opinion, run time.
- Every DG number is printed with the guard's subject; Plain Rule Lines turns each CLAUSE line into a "Rule applied:" sentence.

## 14. Regrade and dry regrade
- REGRADE: POST the normal webhook with the run's original `topic` and seats plus `regrade_run_token`. Init Seats keeps the token. Path: Regrade Row -> Regrade Judgments -> Regrade Served Conclusions -> Regrade Served Sights -> Regrade Load -> citation check -> Panel Build -> panel, cures, alternates -> Dry? -> write path. Rounds, synthesis, single judge and save are not re-run. A row saved without close rounds is regraded on six rounds.
- REGRADE LOAD refuses unless: one saved row; variant ODV1; same topic, seats, profiles and panel; no existing judgments (except dry); all six rounds and the synthesis present. Named lists are rebuilt from today's corpus, so they are approximate for old runs.
- DRY REGRADE (`regrade_dry: true`): writes three rows to `debate_replay_judgments` only (`record_replay_judgments`); no judgment, outcome, enforcer log or document. Only a dry regrade takes `rulebook:'draft'`, the test inputs and `qualify_alternate`.

## 15. Verifying a change
- operational_doc §27 (Validating a change to the debate engine) governs. A change to a judge instruction, enforcer or extractor is verified by REPLAY over stored rows and their stored fields, before it goes live; a live run proves only that the wired flow executes.
- Instruments: the dry regrade (§14) for judge text; for a Code node that writes no model prompt, run the candidate and the live code in a harness over every stored ODV1 row and compare outputs line by line. Every check needs a control that proves it fires.
- Before writing: read the live node code verbatim, guard the write on its md5, change only the named nodes, read the workflow back (versionId, md5 of each changed node, connections). A saved draft is not active.
- Apply a database change that the flow needs (a new column, function or table) BEFORE the flow change; `record_debate_row` drops payload keys that are not columns, silently.
- AFTER GOING LIVE, a live run is owed and is READ WHOLE: every round, every judgment with its audit, cure and alternate lines, the single judge, the synthesis, `review_notes`, the citation check and the enforcer log, each pressed witness checked by name in the holding side's later rounds. Read `length()` of each round first; a forfeited or cut round grades as a clean win and says nothing about the change. Report by run token what was read and what was not.
- The two failure classes are reported apart: the judge misread the transcript; or its verdict contradicts the rule it was given (computable from stored text).

## 16. Troubleshooting (symptom -> cause -> what to do)
1. A run stops at a round Extract with "refused by the provider: finish_reason=content_filter" -> the provider's filter refused the round -> a refusal is not a round; the row is contested with no verdict. Repeated refusals by one model fall under §17 (MiMo).
2. A panel seat fails closed with "an envelope this parser does not recognise" -> often `finish_reason: length` with empty content: the reasoning used the whole limit -> read the seat's `failed_reply` in `debate_enforcer_log`; the parser's message misnames the cause.
3. `panel_split` shows "(n not counted: debate rule)" -> those seats left enforcer items uncured -> read `debate_enforcer_log` by run token (`cure_status`, `cure_reason`, `response_line`) and the AUDIT lines in `verdict_raw`.
4. Panel UNGRADED or CONTESTED -> no counted seat, fewer than two, or no majority -> read the counted seats; check whether an alternate was tried and why it was not seated.
5. Outcome is the review value with a HELD or BROKEN panel -> the citation rule blocked the prevailing side -> read `citation_block`.
6. Close rounds missing from a new row -> `defender_r4`/`challenger_r4` absent from the table, or Regrade Load on an old row -> check the columns exist; old rows have none.
7. A "Conclusion #N" that kb_conclusions does not hold -> may be sight N cited in the wrong namespace -> check `kb_sights` before calling it fabricated.
8. Code-node edits, escapes and nested parameters -> operational_doc §7 (Editing gotchas).

## 17. Known open items (verify live before acting)
- DASHBOARD FRONT END must read `def_r4` and `cha_r4` from `dash_odv1_by_id`; the front end is not in this repository and has not been changed. `dash_odv1_debates`/`dash_odv1_judges` order judges by a seat list without `sol`.
- `debate_variant_canon`'s ODV1 row lists six round columns, not `defender_r4` and `challenger_r4`.
- A CORRECT QUOTATION UNDER THE WRONG REFERENCE (WORDS ARE AT) still counts as [L1] footing in the judge rule and does not trip the citation rule; ruling 3 (md_notes_rulings 376) reads as if it should not. Operator to rule.
- K-G4 FIRES ON A TIMING GROUND: a BROKEN line resting on a timing ground (not a concession, no witness named unanswered) is still K-G4 (ODV1-32255 single judge, D1 vs C1). Whether K-G4 should fire only on an unanswered-witness ground is the operator's.
- WHETHER AN UNEXHIBITED PREMISE BREAKS ITS LINK, or the link breaks only when the unanswered witness contradicts it in its narrowed form: judges divide (ODV1-32255). Operator to rule. Ruling 372 settles the count, not the link's grade.
- RESERVE EMPTY IN 20 of 56 pairings, where qwen was the fourth free seat; the alternate pool is empty in 14 (ChatGPT debates, so sol's family is dropped).
- SAME FAMILY ON ONE BENCH: sol may judge beside the chatgpt seat (both openai) when ChatGPT judges or is the reserve; the code allows it.
- THE 900 s TIMEOUT IS NOT A HARD STOP: qwen alternate calls ran 981.7 s and 985.2 s (ODV1-32228, ODV1-32255) and were judged. The time rule is applied by removal, not by the timeout.
- MiMo: content-filter refusals ended three runs (ODV1-32192 and ODV1-32201 at C1, ODV1-32262 at C2). Ruling: if MiMo fails again, swap it for Haiku 5.5 (md_notes_rulings 380); the swap (a `haiku` model_config row and Init Seats, Format Markdown and Failure Salvage changes) is prepared and not applied, and the launcher's engine list would need `haiku` too. A model that cannot answer in time is to be removed as debater and judge (md_notes_rulings 362).
- GLM as panel judge spent its whole limit in reasoning and returned no content (ODV1-32255); it now runs at 131,072. Not yet shown to answer at that limit. The failure is not named as such in `panel_substitution`.
- SIGHT 32 correction awaits the operator: its summary reads synerchomai "can name married union (1 Cor 7:5)" and carries an unfooted grammar clause ("a permanent negation would take ou me + aorist subjunctive"); both shape both debaters on the Matthew 1:18 topic (ODV1-32141, ODV1-32157, ODV1-32194, ODV1-32205).
- From ODV1-32266 (first run with close rounds, read whole): "quoted fully" (ruling 3) is read by some judges as the whole verse and by others as the words relied on; operator to rule. The defender close may cite verses never cited before, and nothing marks it. The pressed-witness ledger checks only that a reference is named, not that its words are the KJV's. K-DG8 fires on KEYSTONE lines that only quote the link and misses lines reading Matthew 1:25 or 1:18 against the union. A RETRACTED line with the regrade on the same line is refused as malformed, though the answer form does not forbid it.
- Not built: an answer in substance is caught only where the reference is absent from the later round; a misread concession; an out-of-round concession that is an argument.
- The Defense Discipline header in the live D1 and D2 prompt names the operator, contrary to operational_doc §0 (7).
- Node comments in the Build nodes still describe "effort medium" and "max(mt*2,8000)", which the code no longer sends.
- The `chain` rulebook value is accepted by Init Seats and read by no node.
- Prompt bodies (rulebook, burden, round prompts) exist only inside n8n node bodies; they are backed up only with the workflow. No `debate_prompts` table exists.
- Panel, reserve, cure and alternate calls carry no retry (§4).
- Live flows the v84 manual described and that are NOT archived in n8n: the W2, W3, W4, W5 and W7 flows, the Berean Audit, the Tier-3 Adjudicator and Daily Sweep, Independent Synthesis, the L2, W9, W14 and W16 specialty flows, the Challenger Tribunal (active); the Three-Judge Panel runner `KXoI9Jz6R4qTJfIK` and the Markdown prototype `nEKoQJ8cB04pDin3` (inactive). They are not part of this engine and are not documented here; their last description is engine_manual v84 §2.
