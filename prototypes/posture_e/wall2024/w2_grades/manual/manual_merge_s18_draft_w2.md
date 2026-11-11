# Engine manual: merge of section 18 into the rule sections (DRAFT by W2 for W3)

Base: engine_manual version 99 (166,224 characters; section 18 starts at character 106,588). Draft only: W3 is the single writer, checks this and enters it. Nothing here is written to the manual by W2.

## How the merge is done
1. Each section 18 entry is listed below in its manual order, with its home (section and the existing head inside it) and the merged wording.
2. The merged wording keeps every rule, form, limit and "not covered" line of the entry. It drops only provenance: Wall numbers, grader names, commit ids, times, version ids and "entered by" notes.
3. The provenance is not lost: it moves to one table, the WRITE REGISTER (part C), which replaces section 18. One row per write: live version, version id, packages, size, revert copy, grades. The register also carries "unproven until two clean runs" per package, so that line is not repeated in every rule.
4. Where a later entry replaces an earlier one (pkgCEC rev 4 log line, pkgKRO over pkgFUK rev 3, pkgGUB over pkgGCC form (b), pkgRLF rev 2 over rev 1, pkgCSS over the one-call closing enforcer, pkgR1 and pkgSTB over the node-by-node code), only the later wording goes into the rule section, and the register row says what it replaced.
5. Limits: a limit that describes how the rule behaves stays beside the rule. A limit that is an open fault ("not covered", "NOT SHOWN", "not reached") is also listed once in section 17 (part B), with a pointer to its rule.

Headings used as anchors are the "- HEAD:" bullets of v99 (positions measured in v99): section 4 CURRENT VALUES 7,316, CALL FAMILIES 10,041; section 6 D4 DEFENDER CLOSE 14,461, C4 CHALLENGER CLOSE 15,104, EXTRACT 17,832; section 7 SINGLE JUDGE 19,414; section 8 CLOSE ROUNDS 27,925, CONCEDED LINKS 31,208; section 9 CURE CALLS 35,001, CONSEQUENCE 36,728, ENFORCER LOG 59,362, CLOSE-ROUND CHECKS 57,824, THE SECOND READING 60,488, SEND-BACK AND APPLY 67,955, THE GATE 70,943, THE DEEPSEEK ENFORCER 73,346; section 10 FLOW 79,594, EARLY ALTERNATE 80,700, ALTERNATES 81,588; section 12 ONE REFERENCE PARSER 92,518; section 14 DRY REGRADE 95,671; section 15 (verifying a change); section 17 (known open items).

## A. Entries, in section 18 order

### A1. pkgSJR rev 2 (s83). Home: section 7, SINGLE JUDGE (the entry's own anchor: "section 10, after the single-judge cure"; section 7 holds the single judge, so W3 to choose; I propose section 7).
Merged wording:
- SINGLE-JUDGE RE-ASK: when the single judge's reply has no verdict, or a chain-mark line is absent under ODV1-A2, an OpenRouter single judge is asked once more in its own conversation (SJ Re-ask? -> SJ Re-ask Build -> SJ Re-ask Call openrouter -> SJ Re-ask Pick -> Verdict Normalizer -> Extract Independent Verdict). With no verdict, it rewrites the complete judgment and the re-ask reply is read. With chain marks absent, it writes only those lines, and they are added to the first reply. A failed or empty re-ask leaves the first reply. Cure Check records an AUDIT v36 SJR line (seat, model, what was missing, the outcome) in review_notes.

### A2. pkgVP1 (s86), "every replaced line is read". Home: section 9, SEND-BACK AND APPLY, after the apply paragraph (new sub-head "REPLACED LINES ARE READ (RECORD-ONLY)").
Merged wording:
- REPLACED LINES ARE READ (RECORD-ONLY; md_notes_rulings 459):
  - E-ANS and E-PREM rows: the engine's cure reading of the replaced line is written to cure_status (CURED or UNCURED).
  - E-OOR rows: code runs the E-OOR checks again on the replaced line and writes CURED or UNCURED with the reason. This reading takes only STRUCK as a strike (see A-limits in section 17).
  - Second reading (E-REREAD): Send Back Record -> Reread Build -> Reread Needed? -> Reread Call deepseek -> Reread Record -> Gate Build (the same four nodes on the Alt and R2 Alt paths). Asked: each replaced line whose send-back reason opens "(right:" and whose answer is CHANGE; one DeepSeek call, with the first call's rules and ITEM block and the replaced line. Reply line: the first call's own line form for that id (AGREE or DISAGREE, with RIGHT: when it disagrees). Log: debate_enforcer_log, kind send_back, rule E-REREAD; cure_status CURED on AGREE, UNCURED on DISAGREE, empty when no readable line came back.
  - Nothing here is counted, removes a seat or changes a verdict field.

### A3. pkgVP1 (s86), "E-GATE M, ANSWER OPEN (LIVE)". Home: section 9, THE GATE, as its own sub-item.
Merged wording:
- ANSWER OPEN (E-GATE M, LIVE). Rule: "An answer that MISSES or FAILS leaves the witness unanswered (md_notes_rulings 372)". A judge that grades an ANSWER CHECK on a proven press MISSES or FAILS and leaves that link's collision UNDERDETERMINED, with no line of that link graded LINK BROKEN for the pressed side, gets a gate item.
  - Link of an answer check: a [DR2] premise entry labelled "LINK k" gives Dk; an unlabelled defender entry gives no item; challenger entry j gives Cj.
  - The judge keeps the decision (ruling 428). The item is cleared by either (1) changing the answer check to MEETS; or (2) changing the collision line to LINK BROKEN for the pressed side, with one FORCED line for that pair as the reason of the GATE line: `FORCED: D<i> vs C<j> -- MEANS [<round>]: "..." -- ANSWER [<round>]: "..." -- FAILS: "..."`, each quotation word for word in the round named (ruling 411). The engine writes the FORCED line under the collision line and derives the counts, the standing and the RESULT.
  - Several items on one link: one cured change to LINK BROKEN, with its FORCED line, answers every ANSWER OPEN item that no longer stands after it; those need no GATE line. A change back to MEETS cures only its own item.
  - With the closing contradiction rule: a link broken by a confirmed closing contradiction is read as BROKEN for that side; no ANSWER OPEN item is raised on it.
  - UNCURED: KEEP, silence, a change that stays UNDERDETERMINED, or LINK BROKEN without a FORCED line that passes.
  - A K-G1 that an applied change on this item raises is recorded, not counted (see A40, pkgGK1).
  - Limits: the gate runs only for a seat that had send-back items; an answered-with-a-fit collision does not count toward a defender win (the operator's ruling, row 459; not built).

### A4. pkgCEC rev 3, rulebook line A1. Home: section 8, CLOSE ROUNDS, as the last paragraph.
Merged wording: the seven bullets of "CONTRADICTION IN THE CLOSING ROUND (the perjury rule)" exactly as in the entry (from "A debater that states in its closing round ..." to "A contradiction the enforcer does not confirm has no effect beyond what the rules already give."). No change of wording.

### A5. pkgCEC rev 3, flow, plus pkgOCB (s85), pkgCEC rev 4 log line (s88), rev 5 wrap (s89), pkgCSS rev 2 (s106), pkgRLF rev 1 (s108) and rev 2 (s109). Home: section 9, a new head "THE CLOSING ENFORCER" placed before CLOSE-ROUND CHECKS. These seven entries are one rule; merged as one.
Merged wording:
- THE CLOSING ENFORCER (E-CLOSECON). Close Enforcer Build -> Close Enforcer Needed? -> Close Enforcer Call deepseek -> Close Enforcer Record, after Quote Report and before Regrade After Quotes?; made before the single judge and before the panel.
  - One call per side: Close Enforcer Build makes one item per side whose closing round has text, each with a one-side instruction, that side's candidates and that side's four rounds; the Call node runs once per item.
  - Inputs per side: its four rounds in full; its declared links (the [CR1] DECLARED CHAIN and the [DR3] LINK blocks); the candidates, read straight from the Oracle's OPPONENT'S CONTRADICTIONS lines in the [DR4] text (the contradictions field on C4, C4G and C4B Extract is a record only).
  - Reply line: `CLOSE-CONTRADICTION: <id|NEW> -- <DEFENDER|CHALLENGER> -- LINK <n> -- CONFIRMED | NOT A CONTRADICTION -- EARLIER [<round>] "<words>" -- CLOSING [<round 4>] "<words>" -- <why>`.
  - Round labels: "[CR3]" form; also "round N", "[round N]", and a bare number "[3]" or "3", each read as that line's own side's round N (CR N on a DEFENDER line, DR N on a CHALLENGER line). A number out of range, a verse reference or any other bracketed text is NOT CONFIRMED (form).
  - Code confirms a CONFIRMED line only when all hold: both quotes are found word for word in the rounds named; the earlier round is that side's round 1 to 3; the closing round is its round 4; the link is declared. Otherwise NOT CONFIRMED (form). A quote with "..." stands only when all its parts fall inside one sentence of the named round, in order. A candidate answered both CONFIRMED and NOT A CONTRADICTION is NOT CONFIRMED (conflicting answers) and breaks nothing.
  - Close Enforcer Record reads every Build item and every reply by position and judges each side's reply by itself: a failed call or a reply with no CLOSE-CONTRADICTION line logs a NOT CHECKED row naming that side; a NONE logs NONE FOUND for that side; "none" is true only when every side answered NONE. Its output item has one shape, so Panel Build, Build Independent Verdict and Judge Contradiction Build read it unchanged.
  - Failure: Close Enforcer Build and Record and Judge Contradiction Build and Record are wrapped; a failure in any of them writes one E-CLOSECON row "NOT CHECKED -- <reason>", confirms nothing, breaks no link, and the debate goes on. A NOT CHECKED row means the contradiction rule did not run; the run grade reports it as a failure of the check.
  - Log: debate_enforcer_log, kind enforcer_check, rule E-CLOSECON, seat_role panel, cure_status empty; the answer (CONFIRMED, NOT A CONTRADICTION, NOT CONFIRMED (form), NOT CONFIRMED (conflicting answers), NONE FOUND, NO ANSWER, NOT CHECKED, NOT A CANDIDATE) leads cure_reason. Seats "close enforcer" and "judge contradiction enforcer". Alternate Merge adds the rows to enforcer_log.
  - Limits: the call's answers differ between sends; in the set C replay 3 of 23 confirmed lines were false or doubtful, and a confirmed line breaks a link by default (section 17).
- CONTRADICTIONS A JUDGE FINDS: Judge Contradiction Build -> Needed? -> Call deepseek -> Record, between Panel Payloads and Panel Cure Needed?. Candidates: each judge's CONTRADICTION line whose later sentence stands in that side's closing round (panel and single judge), and each contradiction question of the dry question round. A pair the pre-panel enforcer already answered is not sent again; no candidate means no call. Same prompt rules and code checks; the call answers candidates only. A confirmed line breaks its link in every panel, reserve and alternate seat's recompute. A contradiction confirmed only after the panel does NOT change the single judge's result (the single judge is graded before the panel sits); one confirmed before the judges sit breaks the link for the single judge too.

### A6. pkgCEC rev 3, "Shown to the judges". Home: section 10, WHAT THE PANEL WRITES is wrong; better section 9, THE CLOSING ENFORCER (A5), last bullet. Proposed: A5.
Merged wording: Panel Build and Build Independent Verdict add a CONFIRMED CLOSING CONTRADICTIONS block under the side's close round, with both quotes and the link, and the two sentences "This link is BROKEN by the contradiction rule; the system sets every collision line of Dn to DEFENDER LINK BROKEN after you judge." and "Grade every collision line as usual on its arguments, these links included; do not write a grade for the contradiction itself."

### A7. pkgCEC rev 3, "The break", plus pkgKSR (s111). Home: section 9, CONSEQUENCE, under its RECOMPUTE paragraph (the pkgKSR entry names "section 9, RECOMPUTE").
Merged wording:
- CLOSING BREAK IN THE RECOMPUTE (library cecBroken2024, cureRecompute, sbApply2024): applied after the cure, and by the send-back recompute too. Every collision line of the broken link reads `<SIDE> LINK BROKEN`, with `[AUDIT: LINK n BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- <SIDE> -- EARLIER [..] ".." -- CLOSING [..] ".."]`; the trigger reads `CLOSE-CONTRADICTION <line> (<old> to <new>)`. Recomputed after it: counts, standings, CLAUSE, verdict and RESULT, by the section 8 definitions and the tie rule. When both sides' breaks reach one line, the defender's break holds and the trigger names the challenger's. A broken link that no line names counts as one broken line. Seats with no rule item still recompute when a contradiction is confirmed (panel, alternates of rounds 1 and 2, single judge). The break raises no judge item and removes no seat.
- KEYSTONE AFTER A CLOSING BREAK: when a confirmed closing contradiction breaks the defender's keystone link Dn and the judge's KEYSTONE line reads STANDS, the recompute replaces that line with "KEYSTONE: Dn -- BROKEN -- LINK n BROKEN BY A CONFIRMED CLOSING CONTRADICTION" and adds "KEYSTONE Dn (STANDS to BROKEN)" to the trigger. It reads every KEYSTONE line form the live line reader reads, a leading bullet included. The judge's own line is kept in a SUPERSEDED LINE audit. The K-RECHK K-CMT row the new line raises is record-only.
- After a send-back on a confirmed broken link Dn: the engine does not derive KEYSTONE Dn STANDS from the corrected collision lines (K2); does not send a KEYSTONE item asking the judge to unbreak Dn (K3, K5); and raises no RULING card item (E-GATE D38 KEY) against the KEYSTONE line on Dn (K6). The confirmed contradiction decides the link, whatever the collision lines read after the send-back.

### A8. pkgVP4 rev 2 (s90). Home: section 9, after THE DEEPSEEK ENFORCER (new head "ASSUMPTION CHARGE CHECK (TRIAL)").
Merged wording: the entry's paragraph from "ASSUMPTION CHARGE CHECK (pkgVP4, E-ASSUME; ...; TRIAL, record-only)" to "the reading leads cure_reason", unchanged except "(pkgVP4, E-ASSUME; P4 of the verdict proposal, operator ruling row 459; TRIAL, record-only)" stays as is (the ruling reference is a rule source, not provenance).

### A9. pkgVP3 rev 3 (s91), pkgVPD rev 2 (s101). Home: section 9, THE DEEPSEEK ENFORCER, new sub-head "BARE ANSWER CHECK (P3 TRIAL)".
Merged wording:
- BARE ANSWER CHECK (P3 TRIAL, record-only): an E-ANS or E-HOLD DeepSeek DISAGREE is a two-reader item when a code check finds the answering side's answer to the same witness bare: every line naming the verse in that round and later rounds is only a grant or a short deferral, and a deferral to a LINK is followed in that round and then every round of the side (a LINK block with its own footing or 25 or more words, or no block found, is not bare; a deferral to a round that holds text is not bare). Each such send-back row notes whether the judge's reply cured it or WOULD REMOVE the seat; the run report lists every WOULD REMOVE row. Enforcement needs the operator's approval.
  - A deferral to a LINK no round of the side holds defers to nothing; a deferral to a same-side round is followed once and makes the answer substance only when that round answers the verse with substance. Before a named same-side round is read as holding no answer, the verse is looked for there by other marks: the reference written another way ("1:34", "Luke 1, verse 34", "v. 34") or a run of three words of the verse's KJV text (Cited Verses). Each followed deferral is named in the TRIAL note.
  - Limits: a paraphrase with no three KJV words and no reference is not found; a bare grant under an another-way reference is read as an answer.

### A10. pkgSTB (s92), the s98 library write rule, pkgR1 (s107), pkgCMS (s116). Home: section 15, Verifying a change, new head "THE SHARED LIBRARY".
Merged wording:
- THE SHARED LIBRARY (stub form 3): the Shared Library node holds the shared lines once (/*LIB*/) and, for each library node by name, its line list, own lines and source length (/*MAP*/). A library node's stub reads its entry by name, rebuilds its source, checks the length and runs it. A stub changes only when the nodes it reads change; every other library change is a change to the Shared Library node alone. Packing: gate/pack.cjs, form set by gate/STUBV.
- Library nodes include the 12 three-copy nodes Send Back Build, Send Back Record, Judge Enforcer Build, Judge Enforcer Record, each with its Alt and R2 Alt copy; each rebuilds its former code byte for byte. A change to any library node is made in the Shared Library sources and repacked.
- Library write rule: a library write may change only the Shared Library; packs are made on the live fetch-back.
- No comments: the live flow carries no code comments (plain Code nodes and library sources alike). The commented sources stay in git, in the pre-strip library sources and in the revert copy. A comment-strip is verified by equal syntax trees, stub rebuild and byte-equal replay of saved runs; a changed node with no saved run rests on tree and token equality alone.

### A11. pkgKQG rev 2 (s93), pkgKVQ (s95), pkgKBG rev 5 and pkgKDV rev 2 (s99), pkgKVL rev 2 (s100), pkgKBN rev 1 (s102), pkgKBF rev 1 (s103). Home: section 9, SEND-BACK AND APPLY, new sub-head "READING A KEEP ON E-ANS". One rule, merged.
Merged wording:
- READING A KEEP ON E-ANS (record-only, ruling 428): a KEEP is read CURED when its reason quotes six words in a row of the answering side's own words. Not counted toward the six:
  - the flagged answer when it is bare (only grants, or a short deferral): the answer is cut out of each round before the search, so quoting it back, or a window running into it, is not a fuller answer; with a bare flagged answer the six words must also lie outside every bare grant or deferral sentence of that side;
  - any verse of six words or more that the side quoted on a verse line; and, on a line with no verse reference, a quoted span of six words or more whose words stand whole and in order in the KJV text of a verse the run serves (Cited Verses). Verse text is never taken from what a debater writes, so a debater's own quoted claim beside a reference is not scripture.
  - Sentence tests: opening labels and bullets are ignored. A grant joined to a further clause of its own is not bare; a clause that only continues the grant, only says the side keeps its position (also when it names a link by number), or only names a verse as agreeing is not a clause of its own. A sentence of 15 words or fewer that reads "X is answered under / with / in / by <verse>" and ends at the reference is a deferral when X is only a verse reference, this, it, that or the same.
  - Verse labels are taken off before the bare test: a lead-in ("On / In / At / For / Under / As to / Regarding Luke 3:23, I grant ..."), a label ending in a comma, and a bold label whose emphasis closes before or after the punctuation ("- **On Job 14:1**, I grant ..."). The reason text reads "another bare grant, affirmation or deferral".
  - Limits of the KJV reading: a verse the run does not serve; a quotation crossing two verses; wording that differs from the KJV text; the served text carries the translators' bracketed notes.

### A12. pkgQRC rev 2 (s94), pkgQRD rev 5 (s111), and the first dry regrade note under s95-s97. Home: section 14, DRY REGRADE, new sub-head "THE QUESTION ROUND"; C1 also in section 8 beside Commitment 9.
Merged wording:
- Section 8, Commitment 9, last sentence: a contradiction question quotes the earlier and the closing passage and asks how they agree; the answer cannot withdraw either; the closing enforcer confirms.
- THE QUESTION ROUND (QR Ask Build, QR Check, QR Final, QR Merge): runs only in a dry regrade (question_trial true, dry true); running it in a live debate needs the operator's approval.
  - The ask carries the watch-and-question paragraph; the JSON form takes optional earlier_round and earlier_quote. qrCheck keeps ruling 415's checks and, only when an earlier field holds text, checks that the round is that debater's closing round (CR4 or DR4), earlier_round is one of its earlier rounds, the earlier quote is word for word in that round, and the new-verse check reads the earlier quote too. The debater sees both quotes. The judges' text labels a CONTRADICTION QUESTION with both quotes.
  - Repeated question: a judge whose closing contradiction question repeats an earlier judge's is returned once and asked for a different contradiction if it sees one. A question repeats when it is put to the same debater and both its quotes lie inside the earlier judge's quotes, equal or narrower. The earlier judge must be free of faults on both sides and not itself returned on that side. A wider question is never returned against a narrower one. If the second question fails its checks or the judge gives none, the first stands. Every question asked by at least one judge is still put to the debater. Cost: one more full judge call per returned judge (about 76,000 prompt tokens, estimate); one sentence of 213 characters, sent only to a returned judge.
- The dry regrade note (execution 34299: the question round ran, 6 questions, all checks passed; ...; regrade stopped at Alternate Build) is run history, not a rule: moves to the register (part C).

### A13. pkgFUK rev 3 and pkgFCD (s96), pkgKRO rev 2 (s104), pkgKSL rev 2 (s105). Home: section 9, CONSEQUENCE, the K-S3 rule. pkgKRO replaces pkgFUK rev 3's first-word sentence; merged.
Merged wording:
- K-S3 FOLLOW-UP READING: a K-S3 follow-up answer reads CURED as COUNTED when it holds COUNTED as a whole word, in any case, anywhere in the answer; it is read as live when it opens with NOT COUNTED or holds TOUCHES NO LINK. The strict first-word reading and the whole-answer reading do not refuse: where either would, the log reason carries "(NOTED, record-only: ...)" and the ruling stays CURED. An empty answer is asked once. A close-round concession COUNTED with a CORRECTED COUNT line sets the side's conceded count; when the follow-up's corrected count is not kept, the K-S3 log row says COUNT NOT WRITTEN with the reason.
- The reading is given the RESPONSE line plus up to three unlabeled lines written right under it; any labeled line ends the run. A RESPONSE line ending in a full stop, question mark, exclamation mark or semicolon joins the next line with a space; any other ending, a colon included, joins with a full stop. An unlabeled line that names another item ("#2", "Item 2", "point 3", "no. 2", a rule code or a side and round not in this item's label) ends the run and stays prose; a line naming the item's own number continues. COUNTED must still open the RESPONSE line for the strict reading.
- Limits: a plain refusal that holds the word "counted" reads CURED with a note (79 of 88 refusals on the 287-case set, 68 of them noted); enforcement of those is a later package. A line naming another item or round hides every line after it from the reader.

### A14. pkgKNL rev 5 (s97). Home: section 9, CONSEQUENCE, the K-F / FORCED rule.
Merged wording: the none-line allow-list takes the FORCED LINES / FORCED LINKS head, a leading dash, "none of the collisions/links/lines", "there are no forced links", and a closing parenthesis only in the fixed nothing-graded forms; any other text makes it a checked FORCED line.
Note for W3: the entry says "W4's wording, W2's README to be preferred where it differs". The pkgKNL README is W2's; I will compare it with this wording on request.

### A15. pkgABH (s98). Home: section 10, EARLY ALTERNATE.
Merged wording: Alternate Build: the stub runs the library source with Alternate Needed? as its input (Get Early Alternate sits between them), then uses the early alternate replies only when every alternate call has a matching early reply (same removed seat, same payload hash); otherwise the normal alternate call runs.

### A16. pkgCSS rev 2 (s106). Merged into A5 (one call per side; Record behaviour; limits). Its size and cost lines (largest call 46.3% smaller; +1,242 characters sent per debate) go to the register.

### A17. pkgACM (s110). Home: section 9, a sub-item under the anti-cheat check (W3 to place; v99 section 9 has no anti-cheat head in my list: if the anti-cheat check is described in section 10 FLOW, there).
Merged wording: Anti-cheat answer lines: a line may end with one period after its last quote mark and is still read. Still not read: more than one period, any other mark or text after the quote, EARLIER without quote marks, a lower-case answer word. A REVERSED answer is shown only when both quotations stand in the side's own rounds.

### A18. pkgF3A rev 2s (s111). Home: section 10, ALTERNATES.
Merged wording:
- UNUSABLE ALTERNATE REPLY: when a removed judge's alternate returns a reply that cannot be used (no content, no JSON object, JSON that does not parse), round 2 of the alternate step may call the same model once more for that seat. A usable reply that the rules refuse (uncured items, guards) is not retried. At most one retry. Other failure texts are not retried.
- The family rule in Second Alternate? carries the same Haiku exemption as R2 Alternate Build, so the retry offers Haiku when an Anthropic model debates.
- Record: the seat's row keeps both ALTERNATE TRIED lines when both replies were unusable; alternate_round2.retry names the retried model.
- Limits: with two unfilled seats the retried model goes to the first in panel order; the tried list of round 2 does not name the retried model (retry does); there is one round 2 only, so with a second untried pool model and an unusable first reply the first model is called again and the untried one is not. Cost: one more full alternate call when it fires (about 108,000 prompt tokens measured on one dry regrade).

### A19. pkgGFC rev s (s111). Home: section 9, THE GATE.
Merged wording: FORCED LINE INSIDE A GATE CHANGE: when a judge answers a gate item with CHANGE TO and writes, after the collision line "D<i> vs C<j> ...", a FORCED line for the same pair inside the same field, the collision line is read alone and the FORCED line is read as if it stood in the reason field. Read after any of ";", "/", "|", "--", or a space. Not read: a FORCED line naming another pair, the pair written differently in the two places, lower case "forced:", the word FORCED in prose. A FORCED line that fails its own checks still leaves the item UNCURED. Send-back replies are not touched.

### A20. pkgECB rev 3 (s111). Home: section 9, SEND-BACK AND APPLY, after "each item goes back to its judge" (the entry's own anchor).
Merged wording: the two bullets "THE ENGINE'S BREAK LINES ARE NOT SENT BACK" and "A collision line the judge itself graded DEFENDER LINK BROKEN ..." as in the entry, minus the "Shown offline only" bullet, which goes to the register (its NOT REACHED items to section 17).

### A21. pkgGCCN rev 3 (s111) with pkgGUB rev 2 (s112) replacing its form (b). Home: section 9, THE GATE, after "the gate's uncured LIVE items are counted in drv_uncured".
Merged wording:
- A GATE CHANGE TAKES OFF THE SEND-BACK COUNT OF THE SAME ITEM: the four conditions and the "One counted Sn comes off once ..." sentences as in the entry, and "Not affected: ...".
- Forms that still take the count off: (a) a judge who refused the change at the send-back and yields at the gate with a change the engine applies; (b) for counts from the send-back rules v40, v41, v43, v44, v45, v46, v48 and v51, a gate change that is applied although its new line would fail that rule (the gate does not re-run those rules).
- A COUNT FROM pkgUND COMES OFF ONLY WHEN THE LINE IN EFFECT PASSES pkgUND: the pkgGUB paragraph as in the entry (re-runs the pkgUND cure rule on the line in effect, following later gate changes of the same judge to the last; BROKEN must pass the layer check; UNDERDETERMINED must carry a counted [L1] and state what the record leaves open; E-UNG must carry a graded Dn vs Cj line; a reading error keeps the count). Record: when the [L1] verse was not read in the run, or the verse rows are not available and the line is otherwise good, the count comes off.
- Also taken off: a gate item cured because a later gate change of the same judge rewrote the same line and was applied.
- Not covered: a count set at the cure step (see A22).
- The "[s112: form (b) below is closed ...]" bracket and the pkgGUB "FAILED its first grade" clause are provenance and drop out.

### A22. pkgGCP rev 1b (s112). Home: section 9, THE GATE, after A21.
Merged wording: "A LATER CORRECTION TAKES OFF A CURE-STEP COUNT" with its conditions (a) to (c), the AUDIT v52 mark, "A seat whose count falls to 0 this way is not replaced by an alternate", the "Not affected" list, limits (1) to (4), the W2 limit (a counted line planted without raising the count still takes one off) and the K-C limit (K-C counts are not taken off; the gap can keep a count and cannot drop one wrongly). The grader names in the limits drop out.

### A23. pkgK7C rev 2 (s113). Home: section 9, CONSEQUENCE, the K-G4 / K-G7 rules.
Merged wording: the entry's four rule bullets as written (the CURED reading on a link in the confirmed closing-contradiction list; order of the test; K-F not covered and why; items still listed in the cure request), and limits (1) to (4).

### A24. pkgEAD rev 3b (s114). Home: section 9, THE DEEPSEEK ENFORCER, new sub-head "A DEFERRAL READ AS THE WHOLE ANSWER".
Merged wording: "What it does" conditions 1 and 2, the sb_not_sent and SEND-BACK NOT SENT row sentence, "An item that also carries an engine check (pkgUND, pkgUNA, pkgABS, pkgECL) is still sent", "A seat whose items are all withheld gets no send-back call", "It is a TRIAL-class withholding", and limits 1 to 4. The finding (34703) and stored-text lines go to the register.

### A25. pkgOON rev 2 (s115). Home: section 9, SEND-BACK AND APPLY, the E-OOR strike rule.
Merged wording:
- E-OOR STRIKE WORDS: an answer on an out-of-round item that begins with STRUCK, STRIKE, REMOVE(D), DELETE(D) or NONE strikes the row (also inside a leading parenthesis). A row that ends COUNTED is refused with its own reason: write the whole CONCEDED LINKS line with its count, or the row without COUNTED.
- The "not found verbatim" send-back reason reads "the sentence is not found verbatim in [CRn]; quote it verbatim, or CHANGE TO: STRUCK".
- Limits: any answer that begins with the word NONE strikes the row, whatever follows; "OUT-OF-ROUND CONCESSIONS: NONE" as the answer to one row is not read and counts; the other-side and COUNTED-on-a-round-line reasons do not tell a form (the link-round reason does); a "not found verbatim" row that ends COUNTED is told STRUCK and STRUCK is refused there; the record-only reading (A2) reads NONE as UNCURED.
- Note for W3: pkgOON3 (passed, Wall 4473 and 4474; not live) changes two of these limits. When it is written, its section replaces those two limit lines.

### A26. pkgGK1 rev 1 (s115). Home: section 9, THE GATE, after the W3 2341 rule (a gate change that raises a new LIVE K item does not cure and is counted once).
Merged wording: "What it does" and "The earlier rule stands otherwise" bullets, and the three limits, as in the entry.

### A27. pkgKCQ rev 2 (s115). Home: section 9, CONSEQUENCE, the K-C rule.
Merged wording: "What it does" and both limits, as in the entry.

### A28. pkgKWQ rev 2 (s115). Home: section 9, the K-W cure reading (CONSEQUENCE, and the ANSWER FORM paragraph at the head of section 9, which names REASSERTED IN).
Merged wording: "the K-W reader accepts single quotation marks, straight or curly; the closing mark must not be followed by a letter, so an apostrophe inside a word does not close the quotation; an opening single mark with no closing mark is refused; a quotation under 6 characters is refused." Limits: the unclosed-mark case before a non-letter apostrophe; the reader checks form only.

### A29. pkgBRF rev 4 (s116). Home: section 6, D4 DEFENDER CLOSE and C4 CHALLENGER CLOSE (the close-round checks), with a pointer from section 9 CLOSE-ROUND CHECKS and section 12 ONE REFERENCE PARSER (the parser fault).
Merged wording: "Where", "What it does" and the five limits as in the entry. The last limit ("The parser fault remains in other scoped uses, the ledger in the Shared Library among them") also goes to section 12 and section 17.

### A30. pkgCCM (s116). Home: section 4, the caching part of "Seats, models, tokens, caching" (near CALL FAMILIES / CURRENT VALUES; W3 to choose the paragraph that holds cache_control).
Merged wording: "Challenger cache markers: C1 marks its opening message for the 1-hour cache. C2 Build marks its first message (C1's opening, already cached) and so reads that entry and writes nothing new. C3 Build and C4 Build send their messages with no marker, in the direct Anthropic branch and the OpenRouter anthropic branch. The system block keeps its marker, so every challenger call reads the system from the cache. Nothing a debater reads changes; a marker is request data." Limits: C3G and C4G no longer read their round's message write (fired in 4 and 5 of 36 stored runs); C2B, C3B, C4B read the system only (C2B also the first message). The check owed at the next run goes to section 17: C2 cache write about 0; C3 and C4 cache write 0 and read about 70,000 tokens.

### A31. pkgCMS (s116). Merged into A10. Size, grades and the count of nodes without a saved run go to the register.

## B. Section 17 additions (open items, each with its home)
- A2: the record-only out-of-round re-reading reads only STRUCK as a strike (NONE reads UNCURED).
- A5: closing-enforcer answers differ between sends; 3 of 23 confirmed lines false or doubtful in the set C replay.
- A3: an answered-with-a-fit collision does not count toward a defender win (operator's ruling row 459; not built).
- A12: question round not active in live runs.
- A13: a plain refusal holding "counted" reads CURED with a note; enforcement is a later package.
- A18: the round 2 retry limits.
- A20: NOT REACHED: the round 2 gate with an item, the reread with a real reply, a real Haiku's answers.
- A21: a count set at the cure step is not taken off by the gate change rule.
- A22: K-G3 and K-S3 cure-step counts stay; K-C counts are not taken off.
- A23: K-F on a confirmed broken link is not excused.
- A24: the bareness check reads bareness, not fit.
- A25: the OON limits (until pkgOON3 is written).
- A26: the K-G1 inconsistency is recorded, not repaired; the UNCURED row over-counts by one.
- A27: a true K-C worded with all three parts is not raised, and nothing reports it; NOT HELD is not read for K-C.
- A28: the K-W reader checks form only.
- A29: the parser fault in other scoped uses; a second bare reference read by neither check; the book line names the first book only (pkgBRF rev 5 pending as ASK 45).
- A30: the cache check owed at the next run.
- From the alternate seating (W2 Wall 4485, not a section 18 entry): with one pool model, a second removed seat gets no alternate.

## C. The WRITE REGISTER (replaces section 18)
One row per live version. Columns: version | version id | packages (builder) | size (code, prompt) | revert copy | grades | replaced earlier wording | proven (two clean runs).
Rows to fill from the v99 entry heads, s83 to s116, without change of fact. Every package from s91 on: proven = no.

## D. Corrections found while reading v99 (for W3 to check)
1. pkgCMS grades read "W2 and W3 (Wall 4458)". Wall 4458 is W3's pass; W2's pass of pkgCMS on s115 is Wall 4472.
2. pkgCCM grades read "W3 (Wall 4453, pass after the limit was added)". Wall 4453 is W3's finding of the missing limit; W3's pass is Wall 4461 (W1's pass Wall 4452).
3. pkgCMS limit reads "35 changed nodes have no saved run". My grade counted 41 changed sources with no saved run (library sources included). The two counts measure different things; W3 to choose one and say which.
4. pkgBRF rev 4 grades read "W3 (Wall 4456) and a second grader": the second pass is W2 (Wall 4465); W4 passed it too (Wall 4468).
5. The s116 entry gives no write time; W4's corrected time is 17:52 CST (Wall 4477).
