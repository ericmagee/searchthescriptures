# Card text: ASK 624.5 entry for the engine manual (parts 09.1, 11.0, 09.8)

Pairs file manual1123/w3/a6245/em_pairs_6245_draft2.json d03baf9f (grader PASS, Wall 11901). Part 09.1 v292 be585c34 (41,042) becomes 6018f13c (46,845). Part 11.0 v271 7b5e059a (37,965) becomes cd5663e8 (38,108). Part 09.8 v289 57b14a9c (28,664) becomes 604a01ec (28,911).

## Change 1 (part 09.1)

### BEFORE

```
 Limits: see section 17.
- THE ENFORCER (TRIAL; md_notes_rulings 421, 424; the enforcer model is luna):
```

### AFTER

```
 Limits: see section 17.
- A JUDGMENT'S OWN DISAGREEMENTS GO TO THE JUDGE AT THE LATE GATE (ASK 624.5; Shared Library entry SCK624, read by `P Late Gate Build` and `P Gate Record` on each path P, the panel, Alt and R2 Alt; the child takes the text in the call; no prompt and no instruction to a judge is changed):
  - What is checked: each counted judge's text as it stands after the send-back and gate changes are applied, with the engine's recomputed verdict word. Three kinds of item, each naming two of the judge's own lines:
    1. WHICH HOLDS AGREEMENT: WHICH HOLDS: CHALLENGER with a verdict other than BROKEN, or WHICH HOLDS: DEFENDER with BROKEN (the reading of WHL507). The item reads: "Your WHICH HOLDS line and your verdict do not agree. Your WHICH HOLDS line: "<line>". Your verdict after the gate: <word>, and your RESULT line: "<line>". WHICH HOLDS: CHALLENGER goes with BROKEN; WHICH HOLDS: DEFENDER goes with HELD or PARTIAL. CHANGE TO the one line you hold wrong, or KEEP with the words that decide it."
    2. RETRACTION LEFT STANDING: a line "RETRACTED: Dn vs Cm" stands, and another line still rests on that pair: a line that holds the grade "Dn vs Cm: DEFENDER LINK BROKEN" or "BROKEN" for it; a CONCEDED LINKS or CHALLENGER CONCEDED LINKS line that names a verse of that pair's line; or a line reading "Dn is broken" or "broken at Dn" when no other pair of Dn that is not retracted is graded broken against the defender. RESTATED, RETRACTED, STATEMENT, PRESSED, RULING and P<n> lines are never taken as the resting line. The item reads: "You retracted <Dn vs Cm>, and a line of yours still rests on it. Your retraction: "<line>". Your line: "<line>". CHANGE TO that line so it no longer rests on <Dn vs Cm>, or KEEP with the words that decide it."
    3. TWO GRADES: one pair carries two different grades in "Dn vs Cm (ref): GRADE" form (the first reading of pkgGCA); AUDIT and EXTRACTOR lines and STANDING, RETRACTED, STATEMENT and PRESSED lines are set aside. The item reads: "You give <Dn vs Cm> two different grades. Your line: "<line 1>". Your other line: "<line 2>". CHANGE TO the one line you hold wrong, or KEEP with the words that decide it."
    No item says which line, which reading or which side is right; the judge chooses which line changes (ruling 428).
  - What is sent: every item of kinds 1 and 3, and an item of kind 2 whose resting line begins with a pair label ("Dn vs Cm"), "CONCEDED LINKS:", "CHALLENGER CONCEDED LINKS:" or "KEYSTONE:". Each sent item ends "A KEEP does not cure this item." Every other kind 2 item is recorded and not sent, because the change-apply step cannot replace its line: a ruling line (the "is broken" or "broken at" reading) and any other line that holds the pair's grade, an APPLIED line among them. The late gate sends its message also when these items are the only late items. They take G numbers with the other late items and are shown "ITEM G<n> (SELF-CHECK; <kind>):". When they are present the message says: "Lines of your judgment disagree with each other (the item(s) marked SELF-CHECK below); you choose which line changes." and "A SELF-CHECK item left uncured counts against your seat once."
  - The change: a CHANGE TO a whole WHICH HOLDS line is a line form the engine reads and replaces the judge's WHICH HOLDS line. This holds at the gate, the late gate and the Alternate Merge apply, on every path; Send Back Build is not changed. When the text holds two WHICH HOLDS lines, a change that names one of them exactly replaces that one, and a change that names neither is NOT APPLIED ("the flagged line is not in the judge text"). RESULT and pair lines are applied as before.
  - The cure: the self-check items are kept out of the gate's cure reading. A CHANGE is applied with the other changes and the check is run again on the result: the item is CURED only if the change was made and the check no longer raises it. A KEEP, no answer, or a change that leaves the disagreement is UNCURED and adds 1 to `drv_uncured`, so it can remove the seat.
  - Records: one `debate_enforcer_log` row per sent item, kind send_back, rule E-SCK, item "SELF-CHECK G<n> <kind>", flagged_line the item's lines, `cure_status` CURED or UNCURED, and `cure_reason` "SELF-CHECK <answer>[ TO: <line>][ -- <reason>] | <why>[ (counted in drv_uncured)] (ASK 624.5)"; and the audit line "[AUDIT v60: SELF-CHECK (ASK 624.5) -- SEAT: <seat>; G<n> <kind>; ANSWER: <CHANGE|KEEP|NO REPLY|NOT READ>; <CURED | UNCURED, counted in drv_uncured>: <why>. REVIEW THIS ROW.]". An item not sent is written "[AUDIT v60: SELF-CHECK RECORD ONLY (ASK 624.5) -- SEAT: <seat>; <kind>: <item text> NOT SENT: no apply path for this line.]". A fault of the check itself is written "[AUDIT v60: SELF-CHECK FAULT (ASK 624.5) -- SEAT: <seat>; the self-check threw and was not run: <error>. REVIEW THIS ROW.]" and sends nothing; when it is the WHICH HOLDS reading that faults, the RECORD ONLY line ends "The WHICH HOLDS check was not run."
  - Unchanged: the E-WHL rows of Send Back Build stay a trial and are not sent there, because the gate may still change the text; the pkgGCA audit line of Alternate Merge is still written.
  - Shown offline: of the twelve stored judgments of runs 41736, 41822, 42071 and 42373 one has items, judgment 1276 (chatgpt, run 42373): three sent, one of each kind, and two recorded only (two APPLIED lines); the other eleven send none. A WHICH HOLDS change is applied and the second check clears it; a KEEP stays open; an applied change that still disagrees stays open. Not shown by a run. Limits: a judge that does not answer the item in form loses the count for it, so the check can cost a seat without changing a verdict. Marks: an E-SCK row that is sent and answered; no stored judgment whose engine word names one side beside a WHICH HOLDS line for the other.
- THE ENFORCER (TRIAL; md_notes_rulings 421, 424; the enforcer model is luna):
```

## Change 2 (part 11.0)

### BEFORE

```
A judge whose finding contradicts its own grades is not sent back, and nothing yet makes them agree (the send-back apply path reads no WHICH HOLDS line).
```

### AFTER

```
At this stage a judge whose finding contradicts its own grades is not sent back. A WHICH HOLDS line that disagrees with the verdict after the gate is sent at the late gate, and a CHANGE TO a WHICH HOLDS line is applied (A JUDGMENT'S OWN DISAGREEMENTS GO TO THE JUDGE AT THE LATE GATE, section 9).
```

## Change 3 (part 09.8)

### BEFORE

```
    - Size: Alternate Merge 6,003 to 8,445 (+2,442).

```

### AFTER

```
    - Size: Alternate Merge 6,003 to 8,445 (+2,442).
    - Its first finding, a pair with two grades, is also read at the late gate on every path, where it is sent to the judge and counts (A JUDGMENT'S OWN DISAGREEMENTS GO TO THE JUDGE AT THE LATE GATE, section 9). This audit line is still written.

```
