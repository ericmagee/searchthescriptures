# ASK 586: INSTRUCTION TEXTS FOR J2, J3, J6, draft 1

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST. For W1's grade, then W4's build, then the operator's cards. Nothing here is written to the engine.

- Plan: ask586/w3/plan586.md rev 6, section 4A (W1 PASS WITH C6 and C7, Wall 11381).
- BEFORE texts: copied from ask586/w4/live_texts_J2J3J6.md (2fc0ca71), which W4 read from engine 7536d7bf. I do not read n8n. Engine writes 588, D7, 588 R, 593 and 590 came after it. W4 RE-READS EVERY BEFORE TEXT ON THE LIVE ENGINE before the build; a library line number below is the 7536d7bf number and may have moved.
- LIVE, NOT TRIAL (ruling row 512). The first live run is the first test of each form.

## 0. RULES EVERY ONE OF THE THREE BUILDS KEEPS

1. ASK 587 item A and ASK 595: no judge line is cut where it is stored, read or shown. Each new item stores flagged_line and response_line WHOLE. Each check reads the judge's WHOLE line. W4's test for each item includes a judge line over 1,500 characters, and W1's grade checks it.
2. Ruling 428: the judge keeps the decision. Each send-back text below says so.
3. Rulings 382 and 383: the judges are shown the rounds only. The record's lexicon row is not shown and is not the standard (J2). The grants lists are the sides' own sentences from the rounds (J3).
4. No model setting is touched. Touched nodes only.

## 1. J2: THE [L2] ENTRY OF A BREAK QUOTES THE GLOSS A SIDE GAVE

### 1.1 The form, in every place it stands

BEFORE (J2.1 the FORCED form and J2.2 the collision line form, Panel Build and Build Independent Verdict):
`[L2] <word> (<Strong's number>, <gloss>), when the break turns on a word's meaning`
and in J2.2: `[L2] <word> (<Strong's number>, <gloss>) when it turns on a word's meaning`

AFTER (same places, the tail of each kept as it stands):
`[L2] <word> (<Strong's number>): "<the gloss as a side quoted it, word for word>" [<round>], when the break turns on a word's meaning`
and in J2.2: `[L2] <word> (<Strong's number>): "<the gloss as a side quoted it, word for word>" [<round>] when it turns on a word's meaning`

ADDED ONCE, as its own sentence, directly after the J2.1 sentence and directly after the J2.2 sentence:
`If the deciding step of a break says more than the quoted gloss says, say so in DECIDES and name the verse that carries it.`

CHANGE FROM REV 6, FOR W1: rev 6 put that clause inside the [L2] entry. The entry stands inside a list divided by " | ", and a clause with a semicolon inside it would read as part of the [L3] entry. So it is one sentence after the form. The words are the same.

NOT CHANGED: the pressed-witness form (J2.4, Panel Build 20718). The enforcer's CARRIED BY [L2] form (LIB 3194, 3196).

### 1.2 Shared Library LIB 2953

BEFORE: `[L2] <word> (<Strong's number>, <gloss>) when the break turns on a word's meaning (counted when the word stands in a verse the line cites);`

AFTER: `[L2] <word> (<Strong's number>): "<the gloss as a side quoted it, word for word>" [<round>] when the break turns on a word's meaning (counted when the word stands in a verse the line cites and the quoted gloss stands in the round named, beside that number);`

"BESIDE THAT NUMBER", for the code: the quoted gloss and the number stand in the same block of the round named (no blank line between them). W4 may name another window; whatever it is, the build notes state it and the test shows a known-bad and a control.

### 1.3 The send-back item (the text the judge is sent)

`ENFORCER DISAGREE: [L2] GLOSS NOT QUOTED (ASK 586 J2): the [L2] entry of your line on <pair> <FAULT>. Write the entry as [L2] <word> (<Strong's number>): "<the gloss as a side quoted it, word for word>" [<round>]. CHANGE the entry, or KEEP your line and give the quoted gloss and its round. If your deciding step says more than that gloss says, say so in DECIDES and name the verse that carries it. The judge keeps the decision (ruling 428).<COST>`

<FAULT> is one of:
- `gives no gloss quoted from a round`
- `quotes a gloss that does not stand word for word in [<round>] beside <number>`
- `names <number>, which no side quoted in the rounds`

<COST>, the operator's choice on the card (W1 C6):
- OPTION A, NOT COUNTED (W1's recommendation): ` This item is recorded and counts against no seat.` The build then needs the exception W1 named: the J2 fault makes its own record-only item and does NOT make the entry "not counted as an [L2]" under the live E-COL layer rule.
- OPTION B, COUNTED: no added sentence. The entry is not counted as an [L2], and the live E-COL layer rule sends the line back and counts an uncured item against the seat.

## 2. J3: A BREAK THAT SAYS A SIDE GRANTED SOMETHING NAMES THE GRANT

### 2.1 The judges' agreement

ADDED after `A shown chain is footing only through its rows and what the other side has granted (pkgBCL).` (Panel Build and Build Independent Verdict):

`THE GRANTS LISTS below give each side's own grant sentences, numbered G<n> with their round. If a break line says a side granted, conceded, dropped or withdrew something, name the grant by its number (G<n>). If the words are not in that side's list, write NOT A LISTED GRANT and quote the words with their round; they are then your reading.`

### 2.2 The block that is served

`[THE GRANTS LISTS -- each side's own grant sentences, gathered from its rounds by code, not by a judge. A sentence stands here because of its words; whether it bears on a link is the judge's to decide.`
`DEFENDER: G1 [<round>] "<the sentence, word for word>" | ... (or: DEFENDER: none)`
`CHALLENGER: G<k> [<round>] "<the sentence, word for word>" | ... (or: CHALLENGER: none)]`

1. One numbering runs through both lists, the defender's first, so a G number names one sentence of one side.
2. A bare grant ("I grant it.") is served with the line before it, inside the same quotation, so the judge can read what was granted.
3. The lists are built by the engine's own harvester (run 42071: defender 0, challenger 13). No sentence is cut.
4. Place: W4 names it. Proposed: directly above the COLLISION POINTS instructions, once per judge request.

### 2.3 The send-back item

`ENFORCER DISAGREE: GRANT NOT NAMED (ASK 586 J3): your line on <pair> says the <side> "<the grant word as you wrote it>" something, and <FAULT>. Name the grant by its number from THE GRANTS LISTS (G<n>), or write NOT A LISTED GRANT and quote the <side>'s words with their round; they are then your reading. CHANGE the line, or KEEP it with one of the two. The judge keeps the decision (ruling 428).<COST>`

<FAULT> is one of:
- `the line names no G number of the <side>'s list and does not say NOT A LISTED GRANT`
- `G<n> is not in the <side>'s list`
- `the words quoted after NOT A LISTED GRANT do not stand in the <side>'s rounds`

<COST>: the same two options as J2. OPTION A adds ` This item is recorded and counts against no seat.`; OPTION B adds nothing and an uncured item counts.

OWED BEFORE THE J3 CARD (W1 C7): W4's count, on the 9 stored judgments, of lines that would be sent back for a grant word used of something other than a side's grant, and the growth of the judges' request from the two lists.

## 3. J6: AN ENFORCER DISAGREE ANSWERS EVERY VERSE ON THE JUDGE'S GROUND

### 3.1 Shared Library LIB 3194 (E-COL)

ADDED after `Read the answer with every other verse either side quoted on the subject (Isaiah 28:10).`:

` A DISAGREE answers every verse on the judge's GROUND line: for each one, a clause that quotes it and says why it does not carry the judge's grade, or one CARRIED BY for each. A DISAGREE that leaves a verse of the GROUND unanswered is recorded and not sent back.`

### 3.2 Shared Library LIB 3196 (E-HOLD)

The E-HOLD text has no "Read the answer with every other verse" sentence. ADDED after `Without it the push is recorded and not sent back.`:

` A DISAGREE answers every verse on the judge's GROUND line: for each one, a clause that quotes it and says why it leaves the point open, or one CARRIED BY for each. A DISAGREE that leaves a verse of the GROUND unanswered is recorded and not sent back.`

FOR W1: rev 6 named LIB 3196 and gave one text. The E-HOLD case is RIGHT: UNDERDETERMINED, so "does not carry the judge's grade" becomes "leaves the point open" there. If W1 holds one text for both, 3.1's text is used in both.

### 3.3 The reader and the record

1. The reader (LIB 3496) reads every CARRIED BY of the K item, not only the last (W1's condition: the test holds a K item with two CARRIED BY lines).
2. The check reads the judge's GROUND from the judge's whole line, and the enforcer's whole K item (the DISAGREE line and its ENGAGE lines), not one line.
3. A DISAGREE with a GROUND verse unanswered is not sent to the judge. Its log row reads: `RECORDED, NOT SENT BACK (ASK 586 J6): the enforcer's DISAGREE does not answer <the references missing>, on the judge's GROUND.` It touches no seat and no count.
4. The pressed-verse rule stands: the line's own pressed verse is answered by a clause, never by a CARRIED BY.

## 4. WHAT W1 IS ASKED TO GRADE

1. Each AFTER text against plan rev 6 section 4A, and the two changes I made to it (1.1 the separate sentence; 3.2 the E-HOLD wording).
2. The three send-back and record texts (1.3, 2.3, 3.3 item 3), which rev 6 did not hold.
3. The single numbering of the grants lists (2.2 item 1).
4. Section 0 item 1 as a build condition for all three.

## 5. LIMITS

1. No code decides whether a deciding step goes beyond a gloss (J2) or whether a judge is right to read words as a grant (J3). The texts make the footing visible; the judge and the enforcer read it.
2. J6: a right correction by the enforcer that skips one verse does not reach the judge.
3. Not shown by a run. Every form is new to every judge.
