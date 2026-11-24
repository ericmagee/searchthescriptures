# ASK 590 BUILD: one closing check, with the send-back. Build notes for grading, rev 0

W4 (session_01H1X3AP1fjeQaEbxPP9UEZH), 2026-11-24 CST.
- Plan: ask589/w3/closing_check_plan.md dad7dfe9 (W1 PASS, Wall 11389). Build approved with the send-back, ruling row 516 (Wall 11398).
- Base: live engine 9bec145c (base_eng.json), live child 2d5bdc94 (base_child.json).
- Targets: build/target_engine_590s.json and build/target_child_590s.json. LIB 7faddc0afce9b839, MAP 80ed449e96a14972 (was LIB 14d848a99adaf445, MAP 3675b0b63c7c05f7).
- Build scripts: build/build590.cjs (layer 1), then build/build590_l2.cjs (layer 2). No model setting is touched.

## 1. LAYER 1: THE CLOSING ENFORCER READS THE REVERSED SENTENCES (S1, S2, S3 a to c, S4)
Engine nodes changed: Close Enforcer Build, Close Enforcer Record, Panel Build, Build Independent Verdict, Close Group Batch Build. Wiring changed in three places.

1. Close Enforcer Build: the anti-cheat finder (keysOf, blocksOf, copied verbatim from the live Anticheat Build) adds VERSE candidates X1, X2, ... to the two reads of each side.
   - A VERSE candidate is one verse that the side reads in its close [CR4]/[DR4] and in its earlier rounds 1 to 3, with both texts.
   - A block is not the side's reading when it quotes six or more words that stand in the other side's rounds OUTSIDE quotation marks (the 41822 fault). A verse both sides quote does not count as the other side's words.
   - The instruction (lifted from the anti-cheat rules) and the answer form "CONFIRMED | REVERSED READING | NOT A CONTRADICTION".
   - Cap: 120,000 characters of VERSE items a side; any rest is listed as rev_not_checked. On the 4 stored runs nothing passes the cap.
2. Close Enforcer Record: REVERSED READING is parsed and checked:
   - the id is a VERSE candidate of that side; the earlier round is 1 to 3 and the closing round is 4; both quotations stand word for word in that side's rounds; pkgOVS (a quotation under another verse is refused).
   - the other side's words: a REVERSED earlier quotation that stands in the other side's rounds outside quotation marks is "NOT REVERSED (other side's words)". The CONFIRMED rule of pkgOSW is unchanged.
   - two reads: the other copy must give the same id REVERSED or CONFIRMED, or the row is "NOT REVERSED (one check of two)".
   - CONFIRMED wins: by id, or by side and closing sentence ("REVERSED (CONFIRMED stands)").
   - the reversed list is kept once per side and verse; it is cec.reversed.
   - Every answer is a row of debate_enforcer_log under E-CLOSECON. The log helper files a REVERSED status as cure_reason "REVERSED -- ...", and dfl_counted counts only "CONFIRMED", so a reversed reading is not a debater fault.
3. Panel Build and Build Independent Verdict: the block [REVERSED CLOSE SENTENCES ...] stands under the [CONFIRMED CLOSING CONTRADICTIONS ...] block on each close round, in place of the [ANTI-CHEAT CHECK] note.
4. The anti-cheat path leaves the flow: Close Enforcer Build goes to Assume Check Build; Check Save and Regrade After Quotes? (true) go to Panel Build. The six Anticheat nodes stay in the flow, reached by nothing. The batch call loses its "A" items.

## 2. LAYER 2: THE SEND-BACK (S3 d, the operator's choice)
1. A judge line that quotes 8 or more words in a row of a reversed close sentence (cec.reversed) goes back once as an E-REVCLOSE item, with both quotations and both rounds, in ruling 428's form: "KEEP your line with your reason, or CHANGE it. Either answer is accepted and recorded; the judge keeps the decision (ruling 428); this item counts against no seat."
2. Lines that are not sent back:
   - lines that say REVERSED, disregard or NOT HELD (the judge's NOT HELD line is recorded as it stands, S3 c);
   - IMPOSED, ANSWER CHECK, CONTRADICTION(S), CITATION CHECK and WITHDRAWAL CHECK lines;
   - AUDIT and EXTRACTOR lines.
   On the stored judgments of 37203 and 41822 (1185, 1186, 1187, 1269, 1271), every line that quotes the old notes' sentences is one of these, so none would be sent back (test L2.8).
3. BREADTH, said plainly: any other judge line with 8 words of the sentence is sent back. The code does not decide whether the line uses it "as that side's footing"; the judge answers that with KEEP and its reason.
4. One item per judge per side and verse. It runs in all three builders: Send Back Build (panel), Alt Send Back Build (alternates), R2 Alt Send Back Build (child, round-2 alternates).
5. Record-only, in all three records:
   - KEEP or CHANGE: the row is CURED; a CHANGE goes on to sb_apply like any send-back answer.
   - No answer, a reply that names the item without an answer, or a reply error: recorded, counted nowhere.
   - The item enters none of the 11 count lists and not the pkgVP3 trial, and the judges' bodies are unchanged (t590rec, run on the built record source, with a control item that IS counted).
6. Node code: the three builders now name Close Enforcer Record in their node list (if(false){...}), as they name Assume Check Record for pkgACX. Without this the library code could not read the node at run time.
7. LIB lines changed: 2784 (silence), 2789 (record-only line), 2929 and 2959 (the rvc flag rides to the reply), 3564 (the items).

## 3. CHECKS
- t590 (layer 1): 26 PASS. t590s (layer 2): 25 PASS. t590rec (record run): 6 PASS. t590r (replays): 9 PASS.
- Syntax: 379 code parts parse, 0 errors. Library Check pair: PASSES.
- Changed from live: engine 7 nodes (the 5 above, Send Back Build, Alt Send Back Build) plus Shared Library; child R2 Alt Send Back Build plus Shared Library.

## 4. S5 REPLAYS (offline, on stored rounds and replies; out_t590r.txt)
No REVERSED READING answer by the model is stored anywhere (the anti-cheat replies were never saved), so (a), (c) and (e) cannot be measured without live enforcer calls. Where a case needs an answer, it is planted and named so.
- (a) 32643: the defender's Deuteronomy 22:24 is a VERSE candidate (close CR4, earlier CR3). Its close block holds only verse quotations, so the planted close sentence is the defender's next line under ANSWER: Deuteronomy 22:24 in CR4. Planted REVERSED in both reads: listed once. Held (NOT A CONTRADICTION) in both reads: nothing.
- (b) and (g) 41822: no challenger candidate carries the defender's "Two fatherhoods" sentence. The note's own pairing, planted in both reads, is "NOT REVERSED (other side's words)". Why it appeared: see Wall 11400 item 3 (the anti-cheat finder had no other-side guard).
- (c) 37203: the finder still pairs the Mark 7:8 close sentence under Matthew 1:19 (X25); planted in both reads, pkgOVS refuses it.
- (d) 42071: the stored replies give the same record in the new node and the live node. Correction to the plan: the stored rows are 2 CONFIRMED (one per read) and 1 NOT CONFIRMED (form), which make ONE confirmed contradiction, CHALLENGER LINK 1, not 3. The replay also logs each never-asked VERSE candidate as NO ANSWER (63 rows); a live read is asked to answer each by its id.
- (e) candidates per run (D / C): 32643 39/58, 37203 44/44, 41822 33/18, 42071 39/24. Of the 33 NOT HELD lines, those of 37203 and 41822 are tested above; the rest need live reads.
- (f) sizes, request characters per read now (before): 32643 142,029 / 189,872 (55,463 / 54,501); 37203 170,566 / 171,135 (70,636 / 64,938); 41822 158,314 / 114,136 (66,653 / 58,878); 42071 182,209 / 119,718 (98,345 / 53,539). The enforcer seat is luna (openai/gpt-6-luna), max_tokens 64,000 (model_config). The anti-cheat read it replaces sent up to 8 calls of 60,000 characters.
- (h) CONFIRMED and REVERSED on one pair: CONFIRMED stands once, REVERSED is not listed (t590 T4.6, T4.7).
- (i) judge paths: every later judge turn takes the Panel Build bodies, so the block reaches the panel, the reserve, the alternates (engine) and round-2 alternates (child, through Alternate Pass Call), cures 1 to 3, the send-back, gate and late gate, and the panel check. Build Independent Verdict (single judge, not connected) carries it too. No node, child or LIB text holds "ANTI-CHEAT CHECK" (t590 T1.6).

## 5. LIMITS AND COST
- Up to about 190,000 characters per read, and up to 58 VERSE candidates a side to answer by id; no new call.
- The finder is the live anti-cheat finder, unchanged: a reading line under an ANSWER heading that does not name the verse itself is not tied to that verse (32643).
- E-REVCLOSE adds at most one send-back item per judge per reversed sentence.

## 6. WRITE AND REVERT
Write on the operator's press of the card: fresh fetch must equal base (9bec145c, 2d5bdc94); PUT engine then child; fetch back; per-node diff; pair check; W1 readback. Revert: restore engine 9bec145c and child 2d5bdc94 together.
