# judge_fix3: fixes to ORACLE_DEBATE_V1 from the run 32255 review, and the close rounds (offline only; nothing written to n8n or the database)

- Base: ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN), live version e9f2a2dd, read by GET on the public API on 2026-11-02 (data/workflow_live.json; all 63
  code nodes in data/live_code/). The 24 judge_fix2 nodes equal judge_fix2/new by md5. base/ holds the live code of the 30 nodes changed and the four
  D3/C3 nodes used as templates for the close rounds.
- new/<node>.js is built by `python3 patch.py` (anchored replacements; it refuses when an anchor count is wrong). new/ also holds the four new code
  nodes D4 Build, D4 Extract, C4 Build, C4 Extract, generated from the D3/C3 code.
- write_package.py: one guarded PUT (30 code nodes, 20 new nodes, rewiring). Run only with --dry here: write_dry.txt. Plan: flow/close_round_nodes.json.
- The database was read with SELECT only (data/ holds the reads; data/unwrap.py reads a saved query result). sql/ holds drafts, NOT applied.

## Part A
- A1 [L2] (17 drv nodes): an [L2] tag counts when it sits on a source-language word in plain letters with its English meaning beside it
  ("[L2] sperma, seed", "[L2] genomenou (made, come to be)", "[L2] ek sou (out of you)"), directly after the tag, or directly before it with its meaning
  (Qwen's "gennēthen (that which has been begotten) [L2]"). English words are never counted (stop list). Script, marks and Strong's numbers count as
  before. The rule is stated in the cure prompt (CURE_RULE and the K-C clause of CURE_RULE_G, 14 cure nodes, with the bracket rule for rounds) and in
  the judge rule (Panel Build, Build Independent Verdict; Format Markdown's copy). This changes the operator's BB-6926 option A ("no italic
  alternative"): italic alone still does not count; a plain transliteration with its meaning now does.
- A2 qwen removed (Init Seats): JUDGE_TIME_REMOVED=['qwen'] leaves the reserve and the alternate pool. Before the operator's authorization the pool was
  [qwen] or empty in every pairing; without qwen it was empty in all 56. Added on the operator's authorization: seat "sol", GPT-6.1 Sol
  (openai/gpt-6.1-sol), from the operator's ranking (rank 3, 88). Ranks 1-2 are Claude (Claude never judges, and defends); 4 Kimi (excluded by the
  operator); 5 Terra is already the chatgpt seat (G2/G3 refuse the same model); 6-9 sit as defender, removed, or panel. The family guard (Resolve
  Seats; odv1_record_panel_alternates G1) drops an alternate only when its family DEBATES; G3 compares models, so Sol may sit beside the chatgpt seat
  (as in 32255, where ChatGPT was the reserve). It is last in ORDER, so it is never panel, single judge or reserve. Body: {model,max_tokens,messages},
  no reasoning or effort field. max_tokens 128000 (the endpoint maximum on every provider, under the 131,072 cap). Row: sql/a2_sol_alternate.sql.
  Pool after A2 (56 pairings): [sol] in 42; EMPTY in 14 (ChatGPT debates, so the openai family is dropped). Reserve: qwen was the reserve in 20
  pairings; there the run now has NO reserve (Sol is not promoted to reserve).
- A3 K-DG8 (17 nodes): a clause that disclaims the reading ("does not rest on ... as excluding any union") is skipped; a ground that "the stated timing"
  contradicts or excludes the knowing is marked with no verse named (the 32255 single-judge RESULT).
- A4 K-G6 on Gemini and Qwen: cause found. __orc (cacheall) turns the system message of google/ and qwen/ models into [{type,text,cache_control}];
  drvPromptText (Panel Payloads, Alternate Payloads, Extract Independent Verdict) JSON-stringified that array, so every line break became the two
  characters "\n": the ledger's premise lines (K-G6, K-G7, K-G8) and the chain for the K-C cure ("CHALLENGER CHAIN: not found in the prompt") were
  never found for those seats. It now reads the text parts. Replay: K-G6 premise 4 on Gemini 32255; premises 1, 4, 5 on Qwen 32255.
- A5 K-G4 (17 nodes): a BROKEN line whose ground is the holder's own concession or withdrawal of the link (CR rounds or "the defender" for a defender
  link; DR or "the challenger" for a challenger link), not negated, and naming no witness unanswered, is not K-G4; an "AUDIT v24: K-G4 NOT RAISED" line
  is written. The 32255 single judge's D1 vs C1 (a timing ground, not a concession) is still K-G4: out of A5's scope (32228 B2 asks for K-G4 only on
  an unanswered-witness ground; that wider change is the operator's).
- A6 (14 cure nodes): respOf takes a RESPONSE line that names the item's own rule (or no rule), the full label first. enfRows and the W1 check read it.
- A7 (Build Save Body): S-A reads every "both" sentence (agree, affirm, use, cite, accept, hold, read, grant, now agree); without a quotation it passes when
  every verse it names (or its item names) is named in both sides' rounds. S-C: heading forms widened, and an item naming a verse a closing premise
  list carries is reported (one line per synthesis listing the items). New S-E: "the defender/challenger withdrew, conceded, retracted, dropped ..."
  (the side as subject, not negated) with no affirmed form of that verb near the claim's content words in that side's rounds.
- A8 ruling 3: the judge rule (Panel Build, Build Independent Verdict, Format Markdown's copy, the cure rule copy in 14 nodes): a verse counts only with
  book, chapter and verse stated and words quoted fully and correctly; an answer in substance without the reference does not count. Both debater
  frames (DEF_BURDEN, CH_BURDEN in Init with Guards): cite by book, chapter and verse and quote exactly. Confirmed: kg4Answered (K-G4), the ledger
  (isNamed; K-G6's source) need the reference named (fixtures: the same words without "Matthew 1:25" do not answer). The citation check's WORDING
  DIFFERS, WORDING NOT FOUND and DOES NOT EXIST lines reach the judges marked "NOT COUNTED" (Panel Build, Build Independent Verdict).

## Part B
- B1 D4 (DEFENDER CLOSE) and C4 (CHALLENGER CLOSE) after C3: Build (same seat, system prompt, Claude cache markers, __orc session id, body per family, no
  reasoning or effort field), Route and seven Calls (copied node for node, timeout 900 s, 3 tries, error output to Failure Salvage), Extract (the D3/C3
  refusal, empty-reply and truncation checks). D4 is shown C3 and the system's list of what is still unanswered: (a) the [DR2] premise verses no
  defender round names, (b) every verse the challenger cited, by first round, that no later defender round names (on 32255: Deuteronomy 24:1; Psalms
  2:7, Acts 13:33; Luke 1:5, exactly the review's three unanswered premises). It must answer each by book, chapter and verse; it may keep, narrow or
  concede; it may not press. C4 is shown D4 and its own earlier verses, with the NO NEW PRESS rule.
- B2 choice: MARK, not strike. A [DR4] verse reference that no [DR1]-[DR3] names is listed under [DR4] for the judges as "NEW PRESS ... NOT COUNTED",
  in the synthesis prompt and in Format Markdown, and recorded in review_notes ("AUDIT v24: CLOSE-ROUND PRESS CHECK (C4)"); C4 Extract records new_press.
  Why: the transcript the judges read stays word for word the one published and stored, which members check syllable by syllable (ruling 3); striking
  would make the judged text differ from the record. The mark is backed by the checkers: [DR4] is in no pressing set (CURE_PRESS) and no answering set.
- B3 [CR4] answers for the defender: rule text ([CR2], [CR3] or [CR4]), ledger (defender answers read from CR3 + CR4; dCited answers add [CR4]; the
  heading "answered in [CR2], [CR3] or [CR4]"), DRV_ANS/DRV_BARE, cureRounds, ORD, ansK, kg4Answered, SHORT, K-SC statement rounds, KK/SC patterns.
  [DR4] answers nothing and presses nothing; [CR4] presses nothing. The counting rule: [DR4] is structurally last. Synthesis, diagnostic, Format Markdown,
  Citation Scan, Failure Salvage, Final Output, Regrade Load (a row with no close rounds is regraded on six) carry both rounds.
- B4 sql/b4_close_rounds.sql: defender_r4, challenger_r4 (ADD COLUMN IF NOT EXISTS); edits in place (live definition, anchor-checked, refuses a second
  run): debate_results_write_guard (quarantines a truncated close round), record_integrity_scan check 2, dash_odv1_by_id (def_r4, cha_r4). Undo:
  sql/undo_b4_close_rounds.sql (columns kept). record_debate_row needs nothing (it inserts whatever payload keys are columns), so the migration must be
  applied BEFORE the flow, or the close rounds are dropped silently. Not changed: dash_debate_by_id, dash_debate_result, get_pending_debates_for_findings
  (older variants, rounds 1-2); dash_odv1_debates/dash_odv1_judges order judges by a seat array without "sol" (it sorts last). The dashboard front end
  is not in this repository; it must read def_r4/cha_r4.
- B5 timing: D3 + C3 took 65.9 + 340.5 = 406.4 s in 32255 (32228: 319.8; 32212: 684.8; 32205: 812.0). Expected added time about 320 to 810 s per
  run (about 5 to 14 minutes), plus longer judge prompts (two more rounds).

## Tests (outputs in test/)
- compile_out.txt: 34 new files compile (and every base file).
- unit_out.txt: 62 fixtures, 0 bad (A1-A8, B2, B3, B4 save path), each on every node that carries the function.
- replay_out.txt: 32212, 32228, 32255, every seat, the single judge and the 32255 Qwen alternate; base vs new items, uncured and counted; and all 35
  enforcer rows of 32255 re-checked on the seat's stored reply (rows 4, 13 and 29 become CURED; rows 13, 17 and 29-34 take their own RESPONSE line).
  32212 and 32228 predate the enforcer log and W1, so their replies carry no RESPONSE lines: counted is shown with "+R" (one RESPONSE per item added).
- synth_out.txt: the synthesis checks on six runs. harness_b_out.txt: the four new nodes run on the 32255 rounds. cite_replay_out.txt: Citation Scan
  gives the identical report on six rounds. sql_b4_out.txt: the migration on a LOCAL scratch Postgres 16 (truncated close rounds quarantined, scan,
  dashboard, refused re-run, undo).

## Not built, and for the operator
- K-G4 on a non-concession ground with no unanswered witness (32255 single D1 vs C1, timing): left as is (A5 covers concession grounds only).
- Same-family seating: Sol may sit beside the chatgpt seat (both openai) when ChatGPT judges or is the reserve; the code's guards allow it.
- Reserve: in the 20 pairings where qwen was the reserve there is now none.
- WORDS ARE AT another verse (a correct quotation under a wrong reference) still counts as [L1] footing per the existing RULE; ruling 3 reads as
  if it should not. Not changed without your word.
- OpenRouter may route Sol to the cheaper "openai/flex" endpoint (1.00/5.00 USD per million), which can queue; no provider field was added.
- Sol cost per alternate call (2.00/10.00 USD per million on the standard endpoint): judge prompt about 27,000 tokens (GLM's in 32255) = 0.054 USD,
  plus 5,000-15,000 output tokens = 0.05-0.15 USD: about 0.10-0.20 USD per call, about 0.10-0.15 USD for its cure call; at the full 128,000 output
  about 1.33 USD. Latency is not published on the listing; ChatGPT (Terra, same family) took 80.4 s and 29.1 s in 32255.
- Order to apply: sql/b4_close_rounds.sql, sql/a2_sol_alternate.sql, then `python3 write_package.py` (one PUT). Undo: restore e9f2a2dd from the n8n
  history, sql/undo_b4_close_rounds.sql, and DELETE the sol row.
