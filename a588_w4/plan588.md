# ASK 588 plan rev 0 (W4): the judges' question round, live on every fresh run

Base: live engine 7536d7bf and child a7113b8d (ASK 587). Read: ask588/w4/read588.md (Wall 11378, W1 PASS at 11379 with B1 to B5). Nothing built or written yet.

## 1. OBJECTIVE
Before they judge, the judges put their questions to the debaters, and the debaters answer, on every fresh live run, as the operator asked under rulings 413 and 414. Every judge who decides the run reads the same questions and answers: the three panel judges, the reserve, the alternates and the single judge. They keep reading them in every later turn. A fault in the question round never stops a run. It is recorded and the run goes on without the round.

## 2. DEFECTS FOUND THAT A PLAIN SWITCH-ON WOULD SHIP
1. **No reader for the answers (blocking).** The merge text tells judges that "an answer that gives up ground counts as a concession made in that round". No checker reads the answers: the quote checks, the conceded-links recompute and the enforcer only read the eight rounds. A search of the live code for CRQ or DRQ finds nothing. A judge who quotes or counts an answer would be sent back or removed for the engine's own defect.
2. **Later turns drop the answers.** Every later turn rebuilds the judge's conversation from the Panel Build body, which has no answers:
   - the send-back (Send Back Build, `PB.judges.find(q=>q.seat===seat).body`);
   - the gate and the late gate, both built on the send-back body;
   - the cure (Panel Cure Build 1 to 3);
   - the reserve (Reserve Build).
3. **Some judges never see the round.** Alternate Build (engine), R2 Alternate Build (child) and the single judge (Build Independent Verdict) write their own prompts.
4. **Regrade-only data.** QR Check, QR Final and QR Merge read the rounds from Regrade Load and the debater models from Regrade Row.
5. **One route only.** QR Answer posts only to OpenRouter. The opus seat in model_config is `anthropic/claude-opus-5.5`, and seatModel sends any `anthropic/` id on the direct Anthropic route. So Opus 5.5's answers would go by the wrong route, and qrText cannot read an Anthropic reply.
6. **Every QR code node fails closed.** In a live run, any fault in the round would stop the whole run.

## 3. DECISIONS
**D1. The answers (operator's choice, on the card).**
- Option A, recommended, buildable now: an answer explains only. A judge may read it and weigh it, but every quotation the engine counts, and every concession, comes from the eight rounds. The merge text says so in place of "counts as a concession made in that round". The checkers stay correct with no new reader.
- Option B: answers count as part of the round they explain. Every checker, the recompute and the enforcer then have to read [CRQ] and [DRQ]. That is a separate build of several hours and its own ASK.

**D2. The fixed question form (ruling 414 item 2, approved and never built: B1).** The judge supplies only:
- the round and an exact quotation from that debater's own rounds;
- one of these forms: MEANING with the word or step (the word or step must stand in the quotation), or FIT with the verse (the verse must be named in the quotation and cited by that debater).

The program then writes the question itself: `What does "<word or step>" in this passage mean?` or `How does this passage fit <verse>?`. The framing-word list is no longer needed, because the judge writes no free text. The exact-quote and no-new-verse checks stay.

**D3. The contradiction question (B2): kept, as a third fixed form, AGREE.**
- The judge quotes the closing round and the earlier round, and the program writes `How do these two passages agree?`.
- Reason for keeping it: it asks the debater only to explain its own two passages, which is the rule of Commitment 8. The operator approved redirecting a repeated contradiction question (his "1." at 10:45 CST on 11-10, Wall 4191).
- The answer cannot withdraw either passage, and the closing enforcer still decides whether it is a contradiction. That is unchanged.

**D4. Same model, same route (B3).**
- The answer comes from the debater's own seat model, by its own route: the direct Anthropic route when seatModel gives fam `anthropic`, and OpenRouter when it gives `openrouter`.
- Any other family skips that side's answers, and the skip is recorded.
- Since n8n can join only one branch at a time, the answers run in two stages, defender then challenger. Each stage has a Switch with three outputs (anthropic, openrouter, skip) and one Done node.

**D5. Skip, never stop (B4).**
- Each QR code node catches its own fault and passes on `{qr_skip:<reason>}`.
- QR Merge emits `qr_ok:true` only when three judge bodies carry the block. Every reader uses that one test.
- Otherwise the run goes on with the plain bodies, and the row records `QUESTION ROUND: SKIPPED -- <reason>`.

**D6. Where it runs.** On by default on every fresh run. In a regrade it runs only when `question_trial:true` is sent, so a regrade of a stored run stays comparable. `question_trial:false` turns it off on a fresh run. The words "(TRIAL)" leave the prompt text.

**D7. The piggyback question (operator, 23:47 CST 11-23, relayed: "if a judge asked a piggyback question from the previous judge, would that count against their one question? ... no, it wouldn't, particularly if it didn't fully answer the question"). W3 is finding the original ruling row.**
- Live code today: all three judges ask at once, and no judge sees another's question or answer before asking. The only repeat rule is the redirect (pkgQRD). When two judges ask the same contradiction question, the later one is told about the other's question and asked for a different contradiction. If it finds none, it keeps its own question. Nothing is sent back or dropped for being a repeat, and it costs no judge its question. So there is no conflict with the ruling.
- There is a gap: the live code has no piggyback, because no judge can follow up an answer.
- Added: after the first answers, one FOLLOW-UP pass. Each judge reads all six questions and answers, and may put at most one follow-up to each debater, on any question already asked by itself or another judge. It names that question (Q<n>) and uses a fixed form: AGAIN, written by the program as `Your answer to Q<n> did not answer: "<the words of the question it left open>". Please explain that part.`
- The follow-up does not count against the judge's one question. It may be left out ("NONE").
- The same checks apply: no new verse, and the judge writes no free text beyond the quoted words of the question.
- Cost: up to 3 more judge calls and 6 more answers.

## 4. CHANGES
**Engine**
1. **Init Seats.** Drop the dry-only fail. Set `question_trial` true on a fresh run unless the input sends false, and in a regrade only when the input sends true.
2. **QR Ask Build.** Drop the dry gate. Ask in the fixed forms (D2, D3). Wrap in catch (D5).
3. **QR Check, QR Final.**
   - Read the rounds as Panel Build does: Regrade Load if it ran, else Final Output.
   - QR Check checks the fixed forms and writes the questions.
   - QR Final reads the debater models from Regrade Row in a regrade, else from Resolve Seats (fam, model, direct_model). It builds the answer request for each item's route.
   - Both are wrapped in catch.
4. **Answer stages, defender then challenger.**
   - Nodes: QR Answer D Route, QR Answer D anthropic, QR Answer (the existing OpenRouter node, defender), QR Answer D Done; then QR Answer C Build, QR Answer C Route, QR Answer C anthropic, QR Answer C openrouter, QR Answer C Done.
   - The new Anthropic nodes copy the URL, credential and headers of D1 Call anthropic, with continueRegularOutput.
5. **QR Merge.**
   - It reads both Done nodes, and qrText also reads the Anthropic `content[].text` shape.
   - It writes the block text with D1 option A, and sets `qr_ok`.
   - It is wrapped in catch.
6. **Every reader of the Panel Build judges**, in the LIB lines and the plain nodes, except QR Ask Build, QR Merge and Panel Judges Prep:
   - `$('Panel Build').first().json` becomes one helper read that swaps in the QR Merge judge bodies when `qr_ok` is true.
   - Each engine library node that uses it gets `$("QR Merge")` added to its node-reference preamble.
   - This covers the send-back, gate, late gate, cure, reserve and payload readers in one change.
7. **Panel Judges Prep.** Use the QR Merge bodies only when `qr_ok` is true.
8. **Alternate Build and Build Independent Verdict.** Append the block to the judge's user message when `qr_ok` is true.
9. **Alternate Pass Call.** Pass `qa_text` to the child.
10. **Build Save Body.** Add one tagged line to review_notes: `[QUESTION ROUND v1: RAN|SKIPPED ...]` with the questions, answers and checks. The readers of review_notes (C4P.stored, Format Markdown) are to be checked to pass over it.

**Child**
1. **R2 Alternate Build.** Append `qa_text` from the call input when present.
2. **Shared Library.** The same LIB as the engine; the Library Check pair must pass.

## 5. TESTS (B5), offline on the stored 42071 rounds and stored judge bodies
1. Every prompt parser gives the same output on a judge body with and without the block: rounds, ledger, citation report, drvPromptText, ciRounds, vcRev.
2. The fixed forms:
   - a known-good of each form passes;
   - known-bads are returned: a term not in the quote, a verse not in the quote, a verse the debater never cited, and a quote not found word for word.
3. Route:
   - a stored direct-Anthropic debater reply is read by qrText;
   - an OpenRouter reply is read too;
   - a debater of another family is skipped and recorded.
4. Skip: a fault injected in each QR code node in turn gives `qr_ok:false`. The run path then uses the plain bodies, and the row line reads SKIPPED.
5. Every judge path carries the block marker: the panel request, send-back, gate, late gate, cure, reserve, engine alternate, child alternate and single judge.
6. Known-bad for D1: a judge line that quotes an answer as if it were a round is not counted under option A. The block says so, and a test shows that the block text no longer says "counts as a concession".
7. The Library Check pair passes, and every library source parses.

## 6. COST AND TIME (estimate)
1. 3 judge asks at full prompt size, with up to 3 returns, and 6 debater answers of at most 250 words.
2. Each later turn of each judge carries the block, about 3,000 tokens.
3. About 0.35 to 0.6 million extra input tokens per run, and several minutes of wall time. It is measured on the first live run.

## 7. WRONG IF
1. A parser changes its output when the block is added (test 1).
2. A judge path lacks the marker when `qr_ok` is true (test 5).
3. An Anthropic reply is not read (test 3).

## 8. FOR THE CARD
1. The operator chooses D1 option A or B.
2. The card states that the new graph first executes live: n8n cannot run it offline. A fault skips the round and does not stop the run.
3. The card asks whether to hold the Opus 5.5 run for this.
4. The card states D7, the follow-up pass, as the build of his piggyback ruling.

Revert: put back the engine 7536d7bf and the child a7113b8d together.
