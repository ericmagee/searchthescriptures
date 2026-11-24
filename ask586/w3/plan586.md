# ASK 586 PLAN rev 6 (J2, J3, J6 go LIVE, not to trial: section 4A, which overrides every "TRIAL, record-only" line below for these three; rev 5: J1 both seatings stated, on the operator's word of 23:30 CST; rev 4: W4's reads of Wall 11369 taken in: J2 rebuilt, J3 count corrected, J6 guess confirmed; W1 conditions C4 and C5 of Wall 11359 met; J1 added as a rule and a check, on the operator's ruling as relayed by the coordinator at 23:14 CST 2026-11-23; rev 1 passed at Wall 11352): the judges' reasoning (run ODV1-42071-uclot7fi)

Owner of the plan: W3 (session_01H1X3ANsGiMnhnbkfphocmo). Builder of any code check: W4. Grader: W1. Number and owner from the coordinator, 23:03 CST 2026-11-23. Source of direction: the operator, 23:00 CST 2026-11-23, W3 thread: "this next fix will mostly be around the judges reasoning...". That statement sets direction. It approves no write.

Built from Wall 11337 (proposal), Wall 11338 (W1 review), Wall 11340 (W4's read of the code on J1).

## 0. OBJECTIVE

A judge's break, and the enforcer's answer to it, rest only on rows that are quoted, and say so in a form the engine can read:
1. a break that turns on a word's meaning shows the lexicon row whole (J2);
2. a break that says a side granted something points to that side's own grant sentence (J3);
3. an enforcer DISAGREE answers every verse on the judge's GROUND, not one (J6);
4. a ruling against the Oracle stands only with the Oracle's keystone graded BROKEN (J1).

OBJECTIVE MET when: each of J2, J3, J6 is live as TRIAL (record-only), J1 is live as written on its card, and one run shows each EXPECT row (section 6). J2, J3 and J6 change no count, grade or standing. J1 DOES change what result a seat can give; it is the one item here that is not record-only, and its card must say so.

## 1. RULES READ

Ruling 383 (judges grade the text alone; only the Oracle is bound by guards). Ruling 428 (the judge keeps the decision). "NEVER TOUCH REASONING. UNLESS I INSTRUCT IT." Every judge failure gets a countermeasure in the judges' agreement and a code check, TRIAL first. No model-specific fix. Read the existing checks before planning a new one. Test a proposed rule on stored data. Single verse doctrine is prohibited. The enforcer must follow the process more (W3 rulings 502 to 504). Scope rule. Engine manual section 0.

## 2. CLOSED OR OUT OF THIS PLAN

- J4 (spark's spliced quotation): CLOSED. K-F flagged it, the judge rewrote the line, the cure passed (enforcer log row 52927; W1 Wall 11338 item 1; correction of the AAR at Wall 11345, W1 PASS Wall 11348).
- J5 (the engine gives the RESULT word): the written rule (part 08.0, ASK 386). No ruling needed. W1's narrower reading (Wall 11330 F1) stays with W1 and ASK 587.
- Form fixes (the 1,500-character copy, the own-words check, the keystone form, the retraction form): ASK 587, W4.

## 3. EXISTING CHECKS, AS READ

Read by W3 by SQL in the engine manual parts (latest rows), the entry lines themselves:
1. C4G (part 06.0): the challenger's close round lists every grant of the defender's rounds 2 to 4; "The judges read the section; it moves no count." One side's grants only, and only to the close.
2. pkgGAV, the grant words (part 06.0): a grant is a sentence with "I" and a grant verb (grant, concede, withdraw, drop, admit, retract, give up, do not claim, no longer claim, no longer rest), or a line opened by "Granted" or "Conceded".
3. pkgSGR (part 09.3): the E-SYN item shows the enforcer a side's own sentences that give ground, for checking a synthesis sentence. It does not touch a judge's break line.
4. pkgKGL (part 09.4): the key-word reader takes the grant words of the grants list. Not a check on a judge's line.
5. GLOSS CHECK (part 08.0; part 12.0, ASK 431): "each lexicon meaning a debater quotes is set against the record's entry for its Strong's number: GLOSS TRIMMED (a listed entry with senses left out) and GLOSS ADDED". It reads the DEBATERS' glosses and is served to the judges. It does not read a judge's own [L2] entry.
6. ASK 504 (part 11.0): the deciding step of every break is written as a layer (DECIDES [L4], FROM, MEETS, WHY IT FAILS). It checks the form, not what the [L2] entry holds.
7. pkgKRB (part 09.6), pkgGCA (part 09.8), ASK 552: read in code by W4 (Wall 11340). None ties the RESULT to the keystone.

NOT READ by W3: the engine code; the prompt text a judge receives (so whether the lexicon rows and the grants lists are already in a judge's prompt is NOT ESTABLISHED; W4 is asked in section 7).

## 4. THE ITEMS, EACH WITH ITS REPLAY ON THE STORED JUDGMENTS

Stored judgments read: debate_judgments rows 1272 (gemini), 1273 (spark), 1274 (qwen4max). They hold 7 lines of the form "Dn vs Cm (...): ... LINK BROKEN" (gemini 2, spark 1, qwen4max 4). The alternate's judgment (argon) is in the enforcer log only and is not in this count. Earlier runs are not replayed in rev 0 (stated limit; section 8).

### J2. The [L2] entry of a break shows the lexicon row whole

FAILURE: a break turns on a meaning the row does not state. gemini, D3 vs C4: `[L2] parthenos (G3933, virgin)`, with the reason "which excludes prior knowing by Joseph". The record's row for G3933 (lexicon_words.anchor_gloss): "of unknown origin; a maiden; by implication, an unmarried daughter:--virgin." The row does not hold "excludes prior knowing"; the judge's step adds it, and the line does not show the row, so a reader cannot see that it was added.

REPLAY (SQL on the 7 lines):
1. 6 of 7 lines carry an [L2] entry; all 6 have the form `word (Gnnnn, one rendering)`.
2. 0 of 6 quote the row. Each gives one rendering out of the row: G2193 "till, until"; G3933 "virgin" (twice); H3427 "sitting"; G4905 "came together"; G1080 "begotten".
3. KNOWN-BAD: gemini D3 vs C4 (above). Also gemini D3 vs C1: `[L2] heos (G2193, till, until)`, DECIDES "the preposition of continuance marks the limit of the narrated abstinence"; the row reads "a conjunction, preposition and adverb of continuance, until (of time and place)". Here the judge's step is close to the row, and the line still does not show it.
4. CONTROL: qwen4max D2 vs C6, `[L2] yashab (H3427, sitting)`. The row holds "to sit down ... sit". The deciding step does not turn on the word; it turns on Acts 2:30 against Jeremiah 22:30. The proposed check marks this line too (one rendering, row not quoted), which is why it is record-only.

W4'S READ (Wall 11369 item 1): the lexicon rows are NOT served to the judges, and the judges' own form asks for "[L2] <word> (<number>, <gloss>)". So the rev 3 proposal (quote the record's row whole) met its own WRONG IF and is WITHDRAWN. It would also have put the corpus before the judges, against ruling 382 ("we can not impose our corpus on the judges") and ruling 383 (the judges grade the text, the evidence presented to them, alone). The 6 one-rendering entries of the replay follow the form the judges are given; they are not a judge's fault.

WHAT THE JUDGES DO HAVE (SQL on the eight rounds): every number in the 6 entries is quoted with its gloss by the debaters in the rounds. G3933 in all eight rounds (first, "[L2] G3933, "virgin": "a maiden ... virgin.""); G4905 and G1080 in all eight; G2193 in six; H3427 in four. The gloss is evidence presented.

PROPOSAL (rev 4):
a. INSTRUCTION TEXT (judges' agreement; its own card): "When a break's GROUND names a word by its number, write the [L2] entry as: [L2] <word> (<number>): "<the gloss as a side quoted it>" [<round>]. If your deciding step says more than that gloss says, say so in DECIDES and name the verse that carries it."
b. CODE CHECK (W4), TRIAL, record-only: for each [L2] entry in a LINK BROKEN line of a judge's final text, (1) the quoted gloss stands word for word in the round named, beside that number; (2) if no side quoted that number, one audit line "L2 NUMBER NOT IN THE ROUNDS". It counts nothing and removes no seat. The record's own row is not shown to the judge and is not the standard.
c. EXPECTED ON THE STORED DATA: 6 entries, 0 in the new form (the form did not exist); 0 "NOT IN THE ROUNDS" (all five numbers are in the rounds). KNOWN-BAD after the text is live: an entry whose gloss is not in the round it names. The gemini D3 vs C4 case is then visible to a reader (the quoted gloss "a maiden ... virgin." beside "excludes prior knowing"), but NO CODE CHECK decides whether a step goes beyond a gloss; that stays the judge's and the enforcer's reading. Stated plainly: this item makes the footing visible and does not catch the failure by code.
d. CHANGE TO THE JUDGES' FORM: (a) changes the [L2] form the judges are given today; W4 names the nodes that hold it in its build plan.

WRONG IF: a judge's line cannot carry a quoted gloss within the length the form allows (W4 to say); or the glosses the sides quote differ between rounds for one number in a way that makes "as a side quoted it" unclear (then the entry names the round, which (a) already asks).

### J3. A break that says a side granted something points to that side's grant sentence

FAILURE: a judge's break rests on "the answer grants ...", and no reader can check the grant against the side's own words. Also the converse: a side's real grants on the verse of a pair are not weighed in writing.

REPLAY:
1. The pkgGAV grant words, applied by SQL to all eight rounds: my regex gives 15 grant sentences, all in the challenger's rounds (DR3 9, DR4 6), 0 in the Oracle's four rounds. THE ENGINE'S OWN HARVESTER (W4 Wall 11369 item 2): 0 for the Oracle, confirmed; 13 for the challenger, not 15 (DR4 4, not 6). The engine's count stands; mine was a copy of the manual's rule. No grants list of either side is in the judges' prompt today.
2. 2 of the 7 break lines use a grant word, both qwen4max, both of the DEFENDER's answer: D4 vs C3 "the answer grants the margin's begetting and the preposition of origin"; D5 vs C4 "the answer grants the finding is part of that fulfilment".
3. KNOWN-BAD: qwen4max D5 vs C4. The words it calls a grant are the Oracle's "'All this' includes that finding as fulfilment" (CR3). That sentence holds no grant word, and the harvester finds no grant in the Oracle's rounds. The judge named a grant the grants rule does not hold as one. Whether the judge is right to treat it as a grant is the judge's decision (ruling 428); the failure is that the line does not show it is the judge's reading and not a listed grant.
4. CONTROL: the challenger's "I grant that the sitting and the ruling are the prospering that Jeremiah 22:30 names" (DR3, repeated DR4). It is a listed grant on the verse of D2 vs C6. qwen4max's D2 vs C6 break (against the defender) does not use it and need not; the check is silent on a line that claims no grant.
5. 5 of the 15 grant sentences are bare ("I grant it.", "I grant both halves.", "I grant the first half."); what is granted stands in the line before. A list served to a judge must carry that line (the pkgSGJ rule joins only forward).

PROPOSAL:
a. SERVE BOTH SIDES' GRANTS LISTS TO THE JUDGES, each item with its round and its G number, built by the existing harvester (C4G serves only the defender's, and only inside the challenger's close). This is prompt content, so it goes on its own card.
b. INSTRUCTION TEXT (its own card): "If a break says a side granted, conceded or dropped something, name the grant by its number (G<n>). If the words are not in that side's grants list, write 'NOT A LISTED GRANT' and quote the words; they are then your reading, and you must show the row that carries it."
c. CODE CHECK (W4), TRIAL, record-only: a LINK BROKEN line holding grant/grants/granted/concede(s|d)/dropped/withdrew with no G<n> and no "NOT A LISTED GRANT" gets one audit line.
d. EXPECTED ON THE STORED DATA: 2 lines marked (qwen4max D4 vs C3 and D5 vs C4), 5 silent.

WRONG IF: the harvester in code finds grants in the Oracle's rounds that my regex missed (then the known-bad changes); or serving both lists exceeds a prompt limit W4 names.
NOT PROPOSED: a rule that a grant on a pair's verse must be weighed in every break. On the stored data it would mark lines where the grant does not bear (the control), and it would press the judge's reasoning beyond its own words.

### J6. An enforcer DISAGREE answers every verse on the judge's GROUND

FAILURE: the enforcer tells a judge its break is wrong on one verse, while the judge's GROUND rests on several. The removals of qwen4max (row 53144) and spark (row 53175) began with such answers.

REPLAY (SQL on the enforcer's "ENFORCER: Kn.m -- AGREE|DISAGREE -- RIGHT: <word>" lines of the run):
1. 33 lines: 8 AGREE, 25 DISAGREE. Of the 25 DISAGREE, 21 say RIGHT: STANDS, 3 UNDERDETERMINED, 1 BROKEN.
2. Of the 25 DISAGREE lines, 1 names no verse reference, 15 name exactly one, 9 name two or more. 23 of 25 end in "CARRIED BY:" one verse.
3. KNOWN-BAD: row 53043 (qwen4max, D2 vs C6), line K6.1: "DISAGREE -- RIGHT: STANDS ... CARRIED BY: Luke 1:33". The judge's GROUND on that pair names Jeremiah 22:30, Luke 1:32-33, Matthew 1:11-12 and Acts 2:30. The enforcer's line names one of the four and does not answer Acts 2:30, which is the row the judge's WHY IT FAILS names. This is the item the seat was later removed on (row 53144).
4. CONTROL: row 53039 (gemini, D3 vs C4), line K2.1: AGREE, RIGHT: BROKEN. An AGREE line needs no further verse; the check is silent on it.
5. CONFIRMED by W4's read (Wall 11369 item 3): the enforcer's instruction asks for one CARRIED BY verse, and the code reads only the last one. So the single verse is what the engine asks of the enforcer; the fix is in that instruction and in the reader, not only in a check.

PROPOSAL:
a. ENFORCER INSTRUCTION TEXT (its own card): "A DISAGREE must answer each verse on the judge's GROUND line: for each, say in a clause why it does not carry the judge's grade, quoting it."
b. CODE CHECK (W4), TRIAL, record-only at first: for each DISAGREE line, every reference on the judge's GROUND (read from the judge's full line, not the 1,500-character copy; ASK 587 item A) must stand in the enforcer's line for that K item. Missing references are listed in one audit line. In TRIAL the send-back still goes; a later ASK may hold it back.
c. EXPECTED ON THE STORED DATA: the K6.1 item of row 53043 marked. My count of DISAGREE lines with one reference or none is 16 of 25; it is an upper bound, because the reply also holds an "ENGAGE: K6 -- NO -- Jeremiah 22:30 and Acts 2:30" line under the same item, which names verses without answering them. W4's replay, reading the whole K item, gives the final count.

WRONG IF: the enforcer's reply puts its answer to the other verses on separate lines of the same K item (then a per-line count overstates; the check must read the whole K item).

### J1. A ruling against the Oracle needs the keystone graded BROKEN

THE RULING, as the coordinator relayed it (23:14 CST 2026-11-23): the operator pressed "Keystone must break" on the question "When a judge grades the Oracle's keystone link as standing and still rules against the Oracle because another declared link broke, is that a sound judgment under your rules, or must a ruling against the Oracle break the keystone?" W3 HAS NOT READ THE PRESS ITSELF (the card is in the project chat); the coordinator is asked for its message id so the ruling row can cite it. This section is built on the relay.

EXISTING, AS READ: part 08.0 gives the RESULT from the verdict and the standings (W1 Wall 11310 item 1), so CHALLENGER WINS beside KEYSTONE STANDS is allowed by the written rule today. No code ties the two (W4 Wall 11340). So the ruling CHANGES the written rule of part 08.0; the card must show that as a reversal of the present rule, not as a new check only.

REPLAY (SQL: the RESULT line and the KEYSTONE line of every stored judgment of the three runs; 9 judgments):
1. Run 42071: gemini (row 1272) CHALLENGER WINS beside KEYSTONE D5 STANDS; spark (row 1273) CHALLENGER WINS beside KEYSTONE D5 STANDS; qwen4max (row 1274) CHALLENGER WINS, KEYSTONE D5 BROKEN.
2. Run 41822: sol (row 1271) CHALLENGER WINS beside KEYSTONE D4 STANDS ("D4 vs C1 and D4 vs C6 do not independently refute its immediate-..."); qwen4max (row 1270) CHALLENGER WINS, KEYSTONE BROKEN; argon (row 1269) DEFENDER WINS, KEYSTONE STANDS.
3. Run 41418: sol62 (row 1263) UNDERDETERMINED, KEYSTONE BROKEN; chatgpt (row 1264) and qwen4max (row 1265) CHALLENGER WINS, KEYSTONE BROKEN.
4. COUNT: 3 of 9 judgments rule against the defender with the keystone standing (rows 1271, 1272, 1273). KNOWN-BAD: row 1272. CONTROL: row 1274 (against, keystone BROKEN) and row 1269 (for, keystone STANDS); the check is silent on both.
5. EFFECT ON A PAST RESULT, STATED AND NOT CHANGED: run 41822 was stored CHALLENGER PREVAILS, BROKEN 2-1. One of the two votes is row 1271. Under the ruling that seat could not have written CHALLENGER WINS on its lines as they stand. This plan rewrites no stored result.
6. NOT COVERED BY THE RULING AS RELAYED: the other direction (row 1263: keystone BROKEN, result UNDERDETERMINED).

PROPOSAL:
a. RULE TEXT (judges' agreement; its own card): "A RESULT against the defender requires your KEYSTONE line to read BROKEN, by a collision line on the keystone link or by the link it rests on. If your keystone line reads STANDS, you may not write a RESULT against the defender: write UNDERDETERMINED unless your verdict is HELD."
b. WHAT THE SEAT'S WORD BECOMES when a declared link broke and the keystone stands. This is a design choice the card must show, because it sets the outcome: PROPOSED, UNDERDETERMINED (the break is kept on its line and counted as a broken link; it does not carry the conclusion). NOT PROPOSED: DEFENDER WINS, since a link of the chain did break. GRADED by W1 (Wall 11359 item 1): right, and no new question is needed; part 08.0 gives a BROKEN verdict two words only, CHALLENGER WINS when its conditions hold and UNDERDETERMINED otherwise, and the ruling adds one condition to the first.
c. ENGINE RULE (part 08.0, the recompute; W4): the engine gives the seat's word from the same rule, so the recompute must not give CHALLENGER WINS with the keystone STANDS either. Otherwise the engine would write what the judge is forbidden to write (as it did to spark, row 1273, whose RESULT was recomputed).
d. STAGING, TWO OPTIONS ON THE CARD (W1 C5; the operator has ruled, so the choice is his): OPTION 1, the rule live now: rule text (a), the seat's word (b) and the engine rule (c) written together. OPTION 2, audit first: live as an audit line only ("KEYSTONE STANDS BESIDE A RESULT AGAINST THE DEFENDER", record-only), for one run; the rule change (a, b, c) on its own card, with part 08.0's sentence before and after.
e. EXPECTED ON THE STORED DATA: 3 marked (1271, 1272, 1273), 6 silent.

BOTH SEATINGS (the operator, 23:30 CST 2026-11-23, W3 thread: "we already tested the Oracle as the challenger"; debate_results by SQL: 207 runs with challenger_profile 'oracle', the last on 2026-11-20, and 48 with defender_profile 'oracle', among them the three replayed here). The rule text is written by seat, so it holds in both by one standard (Commitment 4): with the Oracle as defender, no RESULT against the Oracle while its keystone stands; with the Oracle as challenger, no win for the Oracle while the other side's keystone stands. My earlier "NOT ADDRESSED" is withdrawn. REPLAY OWED before the write card (W4): stored judgments of runs with the Oracle as challenger, with the count of RESULT against the defender beside KEYSTONE STANDS.

WRONG IF: pkgKRB already turns the keystone to BROKEN in these three cases after the cure (W4 says it did not fire in 42071; 41822 not read).

## 4A. LIVE, NOT TRIAL (rev 6). What each check DOES when it fires

WHY. The operator, 23:36 to 23:37 CST 2026-11-23, W3 thread (ruling row 512; Wall 11376): "Every time I request something that's critical, it gets pushed to testing or something with a dry run, and it doesn't go to fucking live". The coordinator's order, 23:38 CST: J2, J3 and J6 go live, instruction text and check together, and the plan states what acting means for each.

THIS REVERSES A STANDING RULE, AND THE CARDS MUST SAY SO: until tonight the rule for a judge failure was "a countermeasure in the judges' agreement plus a code check, TRIAL first". Under rev 6 there is no trial run. THE FIRST LIVE RUN IS THE FIRST TEST of each new form. The safety is offline: W4's test on stored lines (known-bad fires, control silent) and the replay of W1's C3, before each write card.

LIVE TEXT READ: ask586/w4/live_texts_J2J3J6.md (2fc0ca71, W4, from engine 7536d7bf), read in full by W3 for this revision.

### J2 LIVE
TEXT CHANGED, in every place the [L2] form of a break stands (Panel Build and Build Independent Verdict, the FORCED form and the collision line form; Shared Library LIB 2953):
- before: `[L2] <word> (<Strong's number>, <gloss>), when the break turns on a word's meaning`
- after: `[L2] <word> (<Strong's number>): "<the gloss as a side quoted it, word for word>" [<round>], when the break turns on a word's meaning; if your deciding step says more than that gloss says, say so in DECIDES and name the verse that carries it`
- the "counted when" clause of LIB 2953 gains: "and the quoted gloss stands in the round named, beside that number".
WHAT THE CHECK DOES: an [L2] entry on a LINK BROKEN or FORCED line whose quoted gloss does not stand word for word in the round it names, beside that number (or which gives no quoted gloss and round), is NOT COUNTED as an [L2]. The line then falls under the rule that is already live (part 09.1, E-COL by layers, Commitment 13: a break "turning on a word's meaning with no counted [L2]" is sent back). So: (1) the line is SENT BACK to the judge once, with the fault named and the form shown; (2) the judge cures it by rewriting the entry, or by a KEEP that gives the quoted gloss and round; (3) an UNCURED item COUNTS against the seat, as every live E-COL layer item does today.
STATED RISK: the form is new to every judge. A judge that cannot produce it after one send-back loses its seat on form. Run 42071 lost three seats to form. The pressed-witness [L2] form (Panel Build 20718) is NOT changed.
NOT CAUGHT BY CODE, as rev 4 said: whether a deciding step goes beyond the gloss. The enforcer's E-COL reading sees the quoted gloss beside the step and is the reader of that.

### J3 LIVE
TEXT ADDED to the judges' agreement, after "A shown chain is footing only through its rows and what the other side has granted (pkgBCL).": "THE GRANTS LISTS below give each side's own grant sentences, numbered G<n> with their round. If a break line says a side granted, conceded, dropped or withdrew something, name the grant by its number (G<n>). If the words are not in that side's list, write NOT A LISTED GRANT and quote the words with their round; they are then your reading."
SERVED: both sides' grants lists, built by the engine's own harvester (13 and 0 in run 42071), each item with its round; a bare grant ("I grant it.") carries the line before it.
WHAT THE CHECK DOES: a LINK BROKEN or FORCED line that holds grant, grants, granted, concede(s|d), dropped or withdrew, of a side, with no G<n> of that side's list and no NOT A LISTED GRANT with a quotation found in that side's rounds, is SENT BACK once; cured by adding either; an UNCURED item COUNTS against the seat. A G<n> that is not in the list is the same fault.
STATED RISK: prompt size grows by the two lists (W4 measures it before the card); the word "dropped" or "granted" used of something other than a side's grant would be sent back (W4's test on the 9 stored judgments of three runs gives the false count).
ON THE STORED DATA: 2 of 7 lines would be sent back (qwen4max D4 vs C3 and D5 vs C4); each is cured by writing NOT A LISTED GRANT with the Oracle's quoted words.

### J6 LIVE
TEXT CHANGED, Shared Library LIB 3194 (E-COL) and LIB 3196 (E-HOLD), the CARRIED BY instruction: after "Read the answer with every other verse either side quoted on the subject (Isaiah 28:10)." add: "A DISAGREE answers every verse on the judge's GROUND line: for each one, a clause that quotes it and says why it does not carry the judge's grade, or one CARRIED BY for each. A DISAGREE that leaves a verse of the GROUND unanswered is recorded and not sent back." The reader at LIB 3496 reads every CARRIED BY of the K item, not only the last.
WHAT THE CHECK DOES: for each DISAGREE, every verse reference on the judge's GROUND (the judge's whole line) must stand in the enforcer's K item. If one is missing, the DISAGREE is RECORDED AND NOT SENT BACK to the judge. This is the engine's existing action for a STANDS without its CARRIED BY ("Without it the STANDS is recorded and not sent back"). It touches no seat and no count; the judge's grade stands.
STATED RISK: a right correction by the enforcer that skips one verse no longer reaches the judge. On run 42071, up to 16 of 25 DISAGREE lines would not have been sent (my count, an upper bound), among them the two that began the removals of qwen4max and spark.
THIS IS THE ANSWER TO W1's C1 of Wall 11350: the sentence removed in rev 1 returns, because the check now does what the sentence says.

### What W1 is asked to grade in rev 6
1. For J2 and J3: "sent back once; uncured counts against the seat", the same standing as today's E-COL layer items. If W1 holds that a new form should not cost a seat on its first run, the alternative is "sent back once; uncured recorded, not counted", and the choice goes on the card for the operator.
2. For J6: "recorded and not sent back".
3. The reversal statement above.

## 5. CARDS (each its own; none is asked for by this plan)

1. J2 instruction text and its TRIAL check.
2. J3 serving both grants lists, its instruction text and its TRIAL check.
3. J6 enforcer instruction text and its TRIAL check.
4. J1: the audit line first; then the rule text, the seat's word (b) and the engine rule (c) together, as a change to part 08.0, saying plainly that it changes what result a seat can give.
Each card shows the exact before and after text, after W4 has read the live text it changes and W1 has graded the build.
NO CARD before W4's replay of that item's check on argon's text and on the stored judgments of runs 41418 and 41822, with counts, is posted and W1 has read it (W1 C3, Wall 11350).
Each J2, J3, J6 card is a WRITE card for the text and the check together, live (section 4A); it says there is no trial run and that it reverses "TRIAL first".

## 6. EXPECT LINES FOR THE NEXT RUN (after any item is live)

- J2: one "[AUDIT ...: L2 ROW (TRIAL, record-only)" line per judge seat in debate_judgments.verdict_raw; EXPECT every [L2] entry of a break read WHOLE.
- J3: one grants audit line per seat; EXPECT 0 break lines with a grant word and no G number.
- J6: one audit row per DISAGREE in debate_enforcer_log; EXPECT 0 with a GROUND verse unanswered.
- J1: one audit line per seat whose RESULT is against the defender with KEYSTONE STANDS; EXPECT 0 after the rule text is live.
Exact line text is W4's, in its build plan.

## 7. ASKED OF W4 (read, no build yet)

1. Are the lexicon rows served to the judges, and in what form? (J2 WRONG IF.)
2. Does the engine's grants harvester, run on the eight rounds of 42071, give the same 15 sentences and 0 for the Oracle? Are any grants lists in the judges' prompt today?
3. What does the enforcer's E-COL instruction say about "CARRIED BY"? Is one verse asked for?
4. Replay of each check as specified, on rows 1272 to 1274 and on argon's text, and on the stored judgments of runs 41418 and 41822, with counts.

## 8. STATED LIMITS

1. Replays are on run 42071 only, three stored judgments, by W3's SQL patterns, not the engine's readers.
2. The judges' and enforcer's prompts were not read.
3. The instruction texts above are drafts for review; none is written anywhere.
4. Every check is TRIAL and record-only; none proves the reasoning sound. They make the footing visible so that a judge, the enforcer and the reader can see what a break rests on.

## 9. NOT IN SCOPE

Any change to a count, a standing, the RESULT rule, the corpus, or a model setting. Any change to the Oracle's instructions (the weaknesses in AAR section D are the Oracle's and belong to a separate ASK).
