# ASK 586 PLAN rev 0: the judges' reasoning (run ODV1-42071-uclot7fi)

Owner of the plan: W3 (session_01H1X3ANsGiMnhnbkfphocmo). Builder of any code check: W4. Grader: W1. Number and owner from the coordinator, 23:03 CST 2026-11-23. Source of direction: the operator, 23:00 CST 2026-11-23, W3 thread: "this next fix will mostly be around the judges reasoning...". That statement sets direction. It approves no write.

Built from Wall 11337 (proposal), Wall 11338 (W1 review), Wall 11340 (W4's read of the code on J1).

## 0. OBJECTIVE

A judge's break, and the enforcer's answer to it, rest only on rows that are quoted, and say so in a form the engine can read:
1. a break that turns on a word's meaning shows the lexicon row whole (J2);
2. a break that says a side granted something points to that side's own grant sentence (J3);
3. an enforcer DISAGREE answers every verse on the judge's GROUND, not one (J6);
4. the operator is asked one question on J1 (a RESULT for one side beside a keystone that STANDS for the other).

OBJECTIVE MET when: each of J2, J3, J6 is live as TRIAL (record-only), and one run shows its EXPECT row (section 6). Nothing here changes a count, a grade, or a seat's standing.

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

PROPOSAL:
a. INSTRUCTION TEXT (judges' agreement; its own card to the operator): "When a break's GROUND names a word by its number, write the [L2] entry as: [L2] <word> (<number>): "<the lexicon row, whole, as served>". If your deciding step says more than the row says, write that step in DECIDES and name the verse that carries it."
b. CODE CHECK (W4), TRIAL, record-only: for each `[L2] ... (Gnnnn|Hnnnn ...)` entry in a LINK BROKEN line of a judge's final text, compare the quoted text with the record's row for that number, by the same test the GLOSS CHECK applies to the debaters (WHOLE, GLOSS TRIMMED, GLOSS ADDED). One audit line per seat. It counts nothing and removes no seat.
c. EXPECTED ON THE STORED DATA: 6 entries, 6 GLOSS TRIMMED, 0 WHOLE, before the instruction text is live. After it: WHOLE on each.

WRONG IF: the rows are not served to the judges at all (then (a) asks for text the judge cannot see; W4 to answer); or the check, run on the stored lines, reads any of the 6 as WHOLE.

### J3. A break that says a side granted something points to that side's grant sentence

FAILURE: a judge's break rests on "the answer grants ...", and no reader can check the grant against the side's own words. Also the converse: a side's real grants on the verse of a pair are not weighed in writing.

REPLAY:
1. The pkgGAV grant words, applied by SQL to all eight rounds: 15 grant sentences, all in the challenger's rounds (DR3 9, DR4 6). 0 in the Oracle's four rounds. (My regex is a copy of the manual's rule, not the engine's code; the count is MEASURED by my regex and is to be confirmed by W4 with the engine's harvester.)
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
5. The form the enforcer is given asks for "CARRIED BY:" one verse (seen in 23 of 25). GUESS, the prompt not read: the single verse is what the enforcer's instruction asks for, so the fix is in that instruction and not only in a check.

PROPOSAL:
a. ENFORCER INSTRUCTION TEXT (its own card): "A DISAGREE must answer each verse on the judge's GROUND line: for each, say in a clause why it does not carry the judge's grade, quoting it. A DISAGREE that answers fewer verses than the GROUND names is not sent to the judge."
b. CODE CHECK (W4), TRIAL, record-only at first: for each DISAGREE line, every reference on the judge's GROUND (read from the judge's full line, not the 1,500-character copy; ASK 587 item A) must stand in the enforcer's line for that K item. Missing references are listed in one audit line. In TRIAL the send-back still goes; a later ASK may hold it back.
c. EXPECTED ON THE STORED DATA: the K6.1 item of row 53043 marked. My count of DISAGREE lines with one reference or none is 16 of 25; it is an upper bound, because the reply also holds an "ENGAGE: K6 -- NO -- Jeremiah 22:30 and Acts 2:30" line under the same item, which names verses without answering them. W4's replay, reading the whole K item, gives the final count.

WRONG IF: the enforcer's reply puts its answer to the other verses on separate lines of the same K item (then a per-line count overstates; the check must read the whole K item).

### J1. One question for the operator, after this plan passes grading

RECORD: gemini and spark each wrote KEYSTONE STANDS for the Oracle's keystone link while their RESULT went against the Oracle (AAR defect 14). W4 Wall 11340: pkgKRB fires only when the defender's rounds say the keystone "rests on" or "depends on" a link that broke; the Oracle wrote "Read with D1 and D2", so it did not fire. pkgGCA checks the other direction. ASK 552 derives the keystone word from the judge's own lines on that link; D5 had none, so it read STANDS. W1 Wall 11310 item 1: under part 08.0 the RESULT comes from the verdict and the standings, so the pairing is allowed by the written rule today.
THE QUESTION (draft, for the coordinator to put, one question): "When a judge grades the Oracle's keystone link as standing and still rules against the Oracle because another declared link broke, is that a sound judgment under your rules, or must a ruling against the Oracle break the keystone?" With the two stored lines as evidence.
NO BUILD on J1 before his answer.

## 5. CARDS (each its own; none is asked for by this plan)

1. J2 instruction text and its TRIAL check.
2. J3 serving both grants lists, its instruction text and its TRIAL check.
3. J6 enforcer instruction text and its TRIAL check.
4. J1: a question, not a card.
Each card shows the exact before and after text, after W4 has read the live text it changes and W1 has graded the build.

## 6. EXPECT LINES FOR THE NEXT RUN (after any item is live)

- J2: one "[AUDIT ...: L2 ROW (TRIAL, record-only)" line per judge seat in debate_judgments.verdict_raw; EXPECT every [L2] entry of a break read WHOLE.
- J3: one grants audit line per seat; EXPECT 0 break lines with a grant word and no G number.
- J6: one audit row per DISAGREE in debate_enforcer_log; EXPECT 0 with a GROUND verse unanswered.
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
