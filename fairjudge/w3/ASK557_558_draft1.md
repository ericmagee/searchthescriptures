# ASK 557 and ASK 558: the Oracle breaks every point down into the layers (W3, DRAFT 1)

DRAFT ONLY. Nothing is written. Each change needs the operator's approval of its exact text, after grading (W1) and the builder's anchor check (W4).

Basis, the operator's words, 16:51 to 16:52 CST 11-23: "check why the Oracle isn't breaking everything down into the layers ... that's it's armor"; "maybe the Oracle's prompts need to be updated. that's a huge failure of the Oracle"; "the Oracle should be breaking everything down with the layers...".
Failed runs as evidence (the standing rule for Oracle-facing text): run 41736 and run 41822, both CHALLENGER PREVAILS on Luke 1:34-35.

## 1. What the record shows (run 41822; fetch-back of engine 5bc57e2a)
1. Tag counts. Oracle: CR1 [L1] 31, [L2] 7, [L3] 19, [L4] 4; CR2 30, 5, 12, 10; CR3 57, 17, 24, 6; CR4 28, 0, 28, 0. Challenger: DR1 30, 16, 11, 19; DR2 25, 42, 43, 10; DR3 26, 15, 17, 17; DR4 15, 9, 13, 7. Distinct Strong's numbers: Oracle 7, 5, 5, 0; challenger 20, 23, 14, 7.
2. The close (CR4) answers each press with one [L1], one [L3] and one untagged sentence ("It fits D2: ..."). It holds no [L2] and no [L4].
3. The rule is already in the prompt. Init with Guards, D2 Build, D3 Build and D4 Build carry PROVEN STRUCTURE: "An answer to a press shows, with layers, how the witness's meaning fits your link". It gives no line form.
4. Two shorter forms stand beside it and were followed. D4 Build: "For each, write a line ANSWER: <book chapter:verse> -- D<n> -- then quote that verse exactly in the KJV and show from the text why it does not overturn that link." Init with Guards (ruling 421): "Write \"It fits the link\" only after the words that show the fit."
5. A sentence written for the Oracle is not in its prompt. Init with Guards defines `const __ORACLE9="Prove every position with the layers. A statement of your position is not proof of it.";` and uses it nowhere (one occurrence in the whole engine). The Oracle's system prompt is built as `TEXTAUTH + LAYER + __PROVE9 + rcSection + burden(role) + ...`.
6. The "therefore" of Luke 1:35. The Oracle's guard text (GUARD HOLD, loaded when guards are loaded; 54 were loaded) holds: "ANSWER LUKE 1:35 AT THE WORD (DG-18): when your opponent reads the \"therefore\" (dio kai) of Luke 1:35 as a begetting by the Holy Ghost, answer at that word: \"The dio kai ('therefore') in v.35 connects back to v.32, not forward to biological divine paternity\"". Run 41736 wrote it (CR2, CR3). Run 41822 gave the Luke 1:32 point in an [L4] (CR2 line 32) without the word "therefore" and without an [L2]. The judges ruled the "therefore" unanswered.
7. The word was not on the sheet. The [L2] SHEET leaves out function words; dio (G1352) carries morph CONJ on all 53 rows and was on no Lexicon Sheet of the run (W4, Wall 10969). The challenger, a plain model, cites dio (G1352) in DR1 line 39 and DR2 line 49.
Correction to my earlier statements (Wall 10944 P12, and to the operator at 16:31): I said the record holds no sentence on what the "therefore" joins. I had searched kb_sights summaries only. Items 6 and 7 show the guard text and the lexicon both hold it.

## 2. ASK 557. The Oracle's answer form requires each layer
Scope: the Oracle seat only (`profile==='oracle'`, the gate ASK 537 uses). No change for a plain defender or for the challenger. No corpus text, guard text or ruling text is changed.

Change A. Init with Guards, the Oracle branch of `build`. Anchor: `+LAYER+'\n\n'+__PROVE9+'\n\n'+rcSection+burden(role)` in the line that begins `if(seat.profile==='oracle')return 'You are the TRUTH App debate AI`.
Exact change: (1) the unused constant is given this text:
`const __ORACLE9="THE ORACLE'S LAYER FORM (binding on you in every round). Break every point down into the layers. Write each layer on its own line, beginning with its tag, in this order: [L1] the KJV verse, quoted with its book, chapter and verse; [L2] each Hebrew or Greek word the point turns on, by its Strong's number from the [L2] SHEET, with its meaning as the sheet gives it; [L3] a further verse, quoted with its reference; [L4] the inference from those layers. This holds for every link, every premise block, every press and every answer to a press. When your opponent presses a word of a verse, your answer gives an [L2] for that word and your [L4] names it. Write \"It fits the link\" only inside the [L4], after the layers. Prove every position with the layers. A statement of your position is not proof of it.";`
(2) the anchor becomes `+LAYER+'\n\n'+__PROVE9+'\n\n'+__ORACLE9+'\n\n'+rcSection+burden(role)`.

Change B. D4 Build, the close instruction. Anchor: `and show from the text why it does not overturn that link. A witness answered in substance,`.
Exact change: between those two sentences, for the Oracle seat only, insert: ` Under each ANSWER line write the four layers, each on its own line with its tag: [L1] the pressed verse; [L2] each word of that verse the challenger pressed, by its Strong's number from the [L2] SHEET, with its meaning; [L3] a further verse quoted with its reference; [L4] the inference from those layers that shows the fit with D<n>, naming the pressed word.` The sentence is added by the same test the GAPS text uses, `(($('Init Seats').first().json.defender||{}).profile==='oracle')`.

Change C (record-only). D4 Extract. One audit line in the run's review notes: `[AUDIT: ORACLE LAYERS (record-only) -- CLOSE ANSWERS: <n>; WITH [L2]: <a>; WITH [L4]: <b>]`, counted over the blocks that begin "ANSWER:". Nothing is sent back and nothing is counted. It lets the next run show whether the form was kept.

Not changed: PROVEN STRUCTURE, the ruling 421 sentence, DG-18, the challenger's prompts, model settings.
To confirm at the anchor check (W4): that `I.dsys` built in Init with Guards is the system prompt of every defender round (D4 Build reads `const sys=I.dsys`); whether the close's output limit leaves room for four lines per answer (21 pressed verses in run 41822). If it does not, that is reported and not changed here.
Revert: restore Init with Guards, D4 Build and D4 Extract from the pre-write export; compare md5 per node.
Test: (1) offline: build the Oracle system prompt and the close message with run 41822's inputs; expect the __ORACLE9 text once in the system prompt and the Change B sentence once in the close message; build the same for a plain defender profile and expect neither. (2) Change C on CR4 of run 41822: expect CLOSE ANSWERS equal to the number of "ANSWER:" lines, WITH [L2] 0, WITH [L4] 0. (3) the proof is a live run: the close's answers carry all four tags, and the answer on Luke 1:35 carries [L2] dio (G1352) and the word "therefore" in its [L4].

## 3. ASK 558. A function word that a round has cited is served on the [L2] SHEET
Targets: every copy of `L2C` (the D2, D3, D4, C2, C3, C4 Lexicon Plan nodes and the Build nodes that call `L2C.sheet`). The sheet is "served alike to both sides", so both sides' nodes change alike.
Anchors: in `lexUrls`, `const S=Object.keys(byN).filter(n=>!sheet||!byN[n].every(isFunc));`; in `sheet`, `if(byN[n].every(isFunc)){fw++;continue;}`.
Exact change: a set KEEP of Strong's numbers that stand as G or H followed by digits in any earlier round of either side. The two tests become `!byN[n].every(isFunc)||KEEP.has(n)` and `if(byN[n].every(isFunc)&&!KEEP.has(n)){fw++;continue;}`. `isFunc`, the cap of 26,000 characters and the sheet's wording are unchanged; the count of function words left out goes down by the rows kept.
To confirm at the anchor check (W4): the variable in each node that holds the earlier rounds' text, and whether the L2 Lexicon Plan node (the judges' path) holds a third copy.
Why by citation and not by removing the filter: scope. The filter drops articles, conjunctions, prepositions and pronouns for room; only a word a debater has put in dispute needs its row.
Revert: restore the touched nodes from the pre-write export.
Test: run 41822 inputs at D2 (DR1 cites "dio (G1352)"). Expect the sheet to hold "G1352 διό dió: from διά and ὅς; through which thing, i.e. consequently:--for which cause, therefore, wherefore." Controls: G3588, the article, cited by no round, stays off; a sheet built for a debate where no round cites a function word is byte-identical to today's.

## 4. Order
ASK 558 first or together with ASK 557: Change A tells the Oracle to take its [L2] from the sheet, so the pressed word must be on it.
