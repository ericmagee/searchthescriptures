# ASK 590 WRITE CARD: one closing check, with the send-back (DRAFT: waits on W1's grade)

W4 (session_01H1X3AP1fjeQaEbxPP9UEZH), 2026-11-24 CST.
- Your press of 00:25 CST, "Build it, with the send-back" (ruling row 516).
- Plan: W3, closing_check_plan.md dad7dfe9 (W1 PASS, Wall 11389). Build notes: ask590/w4/build590_notes.md. Build post: Wall 11424.
- W1 grade: PENDING.

## 1. WHAT THE WRITE DOES
1. The anti-cheat check leaves the path. Its work moves into the closing enforcer's two reads, which already exist. No new call.
2. The enforcer now answers each verse a side reads in both its close and its earlier rounds: CONFIRMED, REVERSED READING or NOT A CONTRADICTION.
3. A REVERSED READING stands only when:
   - both reads give it;
   - both quotations stand word for word in that side's own rounds;
   - neither quotation is the other side's sentence;
   - the quotations stand under the same verse (pkgOVS).
   A CONFIRMED contradiction on the same pair wins.
4. Every answer is a row in debate_enforcer_log (E-CLOSECON). A reversed reading is not counted as a debater fault.
5. THE SEND-BACK (your choice): a judge line that rests on a reversed close sentence goes back once. The judge keeps its line with its reason, or changes it. Both are recorded. It counts against no seat (ruling 428).

## 2. BEFORE AND AFTER: THE JUDGES' BLOCK
BEFORE (one read, no record, one note per finding):
"[ANTI-CHEAT CHECK -- computed by the system's enforcer, not by a judge (a TRIAL check): this close round reverses the same side's own earlier reading of <verse>. The close says: "...". The same side said earlier: "...". The close sentence is disregarded (this note by itself breaks no link; only a pair listed under CONFIRMED CLOSING CONTRADICTIONS is confirmed); grade this side's earlier answer on <verse> on its own words, against the verse.]"

AFTER (two reads, recorded, one block under the confirmed block):
"[REVERSED CLOSE SENTENCES -- found by the system's closing enforcer in two independent reads and checked by code, not by a judge (ruling 427: a close round that reverses the same side's own earlier reading of a verse).
- <SIDE> on <verse>: the closing round [CR4] says: "...". The same side said in [CR2]: "...". The close sentence is disregarded (this by itself breaks no link; only a pair listed under CONFIRMED CLOSING CONTRADICTIONS is confirmed); grade this side's earlier answer on <verse> on its own words, against the verse.
A judge that holds a listed sentence is not reversed says so with its reason; the judge keeps the decision (ruling 428).]"

## 3. BEFORE AND AFTER: THE ENFORCER INSTRUCTION
- BEFORE: the answer form is "CONFIRMED | NOT A CONTRADICTION".
- AFTER: the answer form is "CONFIRMED | REVERSED READING | NOT A CONTRADICTION", and one paragraph is added. It is lifted from the anti-cheat rules and says:
  - what a VERSE candidate is;
  - the two ways a close reverses a reading: it draws the opposite conclusion from the verse, or it reasserts a claim the side withdrew;
  - what is not a reversal.
  The full text is in build/build590.cjs (PARA).

## 4. PROOF ON STORED RUNS (S5)
- 32643: the defender's Deuteronomy 22:24 is now a candidate. A held reading raises nothing.
- 41822: the crossed note (the defender's "Two fatherhoods" sentence given to the challenger) is not raised.
- 37203: the wrong-verse pairing (a Mark 7:8 sentence under Matthew 1:19) is refused.
- 42071: its confirmed contradiction (ONE, challenger LINK 1; the plan said 3, which was 2 rows plus 1 form fault) is unchanged.
- What these do not measure: no model REVERSED answer is stored anywhere, so the REVERSED answers above are planted. How many REVERSED findings a live read gives is measured on the first run.
- Tests: 66 offline tests pass. Library Check pair: PASSES.

## 5. COST AND SIZE
- No new call. The anti-cheat requests leave the shared batch call, so that call carries fewer items.
- Each enforcer read grows from 55,000 to 98,000 characters up to 142,000 to 190,000 characters. The enforcer is luna, with max_tokens 64,000.

## 6. STANDING RULINGS (S6)
- Ruling 427 is kept and its TRIAL status ends. Its separate read is replaced by the closing enforcer's read.
- Ruling 412 item 3 is kept.
- The perjury rule is unchanged.
- No model setting is touched.

## 7. HOW IT IS WRITTEN, AND HOW TO UNDO IT
1. On your press, while no run is live, I run write/write590.sh. The script:
   - checks the live engine 9bec145c and the live child 2d5bdc94 against the build base;
   - reruns the tests and the pair check;
   - writes the engine, then the child;
   - fetches both back.
2. W1 then reads both back.
3. REVERT: restore engine 9bec145c and child 2d5bdc94 together. The script saves both before it writes them.
