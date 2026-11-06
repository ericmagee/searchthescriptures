# E-HOLD, E-COL, E-RES promotion read (W2, 2026-11-06)

Corpus: every enforcer_check DISAGREE row for these three rules in runs 32998, 33006, 33014, 33020, 33021, 33025, 33040 (59 items). Each item was read against the judge's own ANSWER CHECK lines (pkgPR/context.txt) and, where needed, the round text in corpus/fix_<run>.json. [CRn] is the defender's answer, [DRn] the challenger's.

## Result

| Rule | Items | TRUE | FALSE | Other | Promote? |
|---|---|---|---|---|---|
| E-HOLD | 28 | 10 | 14 | 4 FORM | No |
| E-COL | 26 | 21 | 2 | 3 DISPUTED | No |
| E-RES | 5 | 2 | 3 | 0 | No |

No rule has zero false items, so no cure code is proposed. FORM means the grade is right in substance but the judge quoted no answer words anywhere.

## Causes of the false items, and the fixes

1. E-HOLD feed gap (5667, 6395, 6396, 7093): Judge Enforcer Build feeds only the ANSWER CHECK lines on verses the line names. A link-state line ("D5: STANDS") names none, so the enforcer sees no checks and flags "no answering words quoted". Fix: for a link-state line, feed the judge's defender-answer checks on proven presses that are MISSES or FAILS, or say there are none.
2. E-HOLD unproven presses read as burdens (4937, 6398, 6403, 7595, 7598, 7606): Fix: mark UNPROVEN checks in the feed as "no answering burden" and add that sentence to RULE E-HOLD.
3. E-HOLD side confusion (7608): a [DR3] FAILS (the challenger's answer failing) was read against the defender's link. Fix: label each fed check "defender's answer" or "challenger's answer".
4. E-RES engine lines (6171, 6821): the model reads RESULT lines that the cure recompute wrote ("recomputed after the cure ..."). Fix: skip those RESULT lines.
5. E-RES VERDICT LINES code fault (5993): the RETRACTED set is built from the whole judge text, so a retraction quoted inside an [AUDIT ...] note whose cure was UNCURED removes the link from the k count. Fix: build it only from the judge's own lines that begin with RETRACTED, not from AUDIT notes.
6. E-COL (5931, 5934): the FAILS words are the challenger's own DR3 conclusion and do contradict the pressed meaning; the enforcer judged only the ANSWER sentence. Fix proposal: the rule reads the FAILS words as part of the answer when they are found in the answering round.

## Every item

### E-HOLD

| Row | Run | Seat | Item | Verdict | Reason |
|---|---|---|---|---|---|
| 4937 | 32998 | chatgpt | COLLISION D3 vs C1 | FALSE | [DR3] Matthew 1:18 MEETS and [CR3] Matthew 1:24 MEETS; the one [CR3] press is UNPROVEN and carries no burden, so both readings are shown |
| 4938 | 32998 | chatgpt | COLLISION D4 vs C5 | TRUE | judge's own checks: [CR4] Isaiah 7:16 MISSES and Isaiah 8:8 MISSES; the defender's answers do not meet, so UNDERDETERMINED is wrong |
| 5142 | 32998 | sol | COLLISION D1 vs C3 | TRUE | own check: [DR3] Matthew 1:19 MISSES on a proven press; the challenger link is broken |
| 5667 | 33006 | sol | COLLISION D5 | FALSE | D5 unpressed; every defender-answer ([CR]) check of this judge MEETS; the 6 non-MEETS are all [DR3] challenger answers. The build fed the enforcer no checks because the link line names no verse |
| 6155 | 33014 | sol | COLLISION D6 vs C1 | TRUE | own check: [CR3; CR4] Hebrews 7:10 MISSES (absence answer); the original DEFENDER LINK BROKEN was right |
| 6393 | 33020 | gemini | COLLISION D3 | FORM | D3 STANDS is right in substance (unpressed at the ledger; challenger held Matthew 1:23 as written), but the judge quotes no answer and has no ANSWER CHECK on Isaiah 7:14 or Matthew 1:22-23 |
| 6394 | 33020 | gemini | COLLISION D4 | FORM | D4 STANDS; no ANSWER CHECK on Luke 3:23 or Matthew 1:16 in this judge's text and no quoted answer in the line |
| 6395 | 33020 | gemini | COLLISION D5 | FALSE | link line names no verse, so the enforcer got no checks; the judge's own [CR3] checks on D5's verses (2 Samuel 7:12, Acts 2:30, Romans 1:3, Luke 2:48) all MEET with quoted answers |
| 6396 | 33020 | gemini | COLLISION D6 | FALSE | same as 6395 for D6; the only non-MEETS of the judge's 38 checks is a [DR3] challenger FAILS |
| 6398 | 33020 | chatgpt | COLLISION D2 vs C3 | FALSE | the [CR3] MISSES is on an UNPROVEN nested press (no burden); [DR3] MEETS. BROKEN is wrong |
| 6399 | 33020 | chatgpt | COLLISION D2 vs C4 | FALSE | [CR3] Luke 1:37 MEETS; the challenger's reading is its quoted MEANS; neither side's words show the other cannot agree |
| 6400 | 33020 | chatgpt | COLLISION D3 | FORM | D3 STANDS; same as 6393, no Isaiah check and no quoted answer |
| 6403 | 33020 | chatgpt | COLLISION D6 | FALSE | every [CR3] MISSES is on an UNPROVEN nested press; the proven D6 presses (2 Samuel 7:12, Acts 2:30, Romans 1:3, Genesis 4:1, Luke 1:34) all MEET |
| 6404 | 33020 | grok | COLLISION D2 | FALSE | the judge's own check: Luke 1:34 grant MEETS with its footing; the line quotes Mary's stated obstacle 'I know not a man' against Elisabeth's barrenness, a fit, not a bare grant |
| 6405 | 33020 | grok | COLLISION D3 | FALSE | the line's ground 'Isaiah 8:3 names Mahershalalhashbaz, not Immanuel' is the defender's own CR answer (fix_33020: 'The text there says "Call his name Mahershalalhashbaz." Isaiah 7:14 names "Immanuel."'); the challenger held Matthew 1:23 as written |
| 7093 | 33025 | gemini | COLLISION D5 | FALSE | link line names no verse; the judge's defender-answer checks all MEET; the 2 non-MEETS are [DR3] challenger answers |
| 7096 | 33025 | chatgpt | COLLISION D2 vs C4 | TRUE | own check: [DR3] Matthew 1:19 MISSES on a proven press ([CR3] press UNPROVEN) |
| 7097 | 33025 | chatgpt | COLLISION D3 vs C5 | TRUE | own checks: [CR4] Exodus 2:1 MISSES and [CR3] Exodus 2:10 MISSES |
| 7099 | 33025 | chatgpt | COLLISION D4 vs C1 | TRUE | own check: [DR3] Jeremiah 18:8 MISSES on the stated condition |
| 7104 | 33025 | grok | COLLISION D4 vs C3 | TRUE | both Galatians 4:4 checks UNPROVEN under a VOID premise; no proven press, no quoted answer (grade-neutral) |
| 7587 | 33040 | gemini | COLLISION D3 | FORM | D3 STANDS; no ANSWER CHECK on Luke 1:34-35 in this judge's text; all its defender-answer checks MEET |
| 7593 | 33040 | chatgpt | COLLISION D2 vs C2 | TRUE | own check: [CR3] Matthew 1:24 MISSES on a proven press |
| 7594 | 33040 | chatgpt | COLLISION D2 vs C3 | TRUE | own checks: [DR3] Matthew 1:19 MISSES twice |
| 7595 | 33040 | chatgpt | COLLISION D2 vs C6 | FALSE | [DR3] Matthew 1:20 MEETS; the [DR2] and [CR3] presses are UNPROVEN (no burden); both readings shown |
| 7597 | 33040 | chatgpt | COLLISION D3 vs C6 | TRUE | all three Luke 1:35 checks UNPROVEN; no quoted words show two readings, and no proven press touches the link (grade-neutral: neither grade counts a break) |
| 7598 | 33040 | chatgpt | COLLISION D4 vs C1 | FALSE | [DR3] Luke 3:23 MEETS; the [DR2] press is UNPROVEN |
| 7606 | 33040 | chatgpt | COLLISION D6 vs C6 | FALSE | same checks as 7595 (Matthew 1:20) |
| 7608 | 33040 | grok | COLLISION D2 | FALSE | the enforcer read [DR3] Matthew 1:18 FAILS (a challenger answer failing) against the defender's D2; that failure supports D2 |

### E-COL

| Row | Run | Seat | Item | Verdict | Reason |
|---|---|---|---|---|---|
| 5931 | 33014 | grok | COLLISION D2 vs C2 | FALSE | the FAILS words 'Therefore Joseph knew Mary his wife within the espousal' are in DR3 and contradict 'before they came together' |
| 5934 | 33014 | grok | COLLISION D6 vs C4 | FALSE | the FAILS words 'Christ had a biological father... Joseph' are in DR3 and contradict a begetting by the Holy Ghost |
| 6388 | 33020 | chatgpt | COLLISION D1 vs C2 | DISPUTED | FAILS rests on 1 Corinthians 7:5 'again'; whether that shows the answer cannot agree is a reading call |
| 6389 | 33020 | grok | COLLISION D1 vs C2 | DISPUTED | same line as 6388 (grok) |
| 6766 | 33021 | grok | COLLISION D4 vs C2 | DISPUTED | 'connects back to verse 32' versus the title/birth-clause meaning; reading call |
| 4922 | 32998 | gemini | COLLISION D3 vs C1 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 4923 | 32998 | grok | COLLISION D1 vs C1 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 4924 | 32998 | grok | COLLISION D1 vs C3 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 4925 | 32998 | grok | COLLISION D2 vs C6 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 4926 | 32998 | grok | COLLISION D3 vs C1 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 4928 | 32998 | grok | COLLISION D5 vs C6 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 5930 | 33014 | grok | COLLISION D1 vs C4 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 5932 | 33014 | grok | COLLISION D4 vs C1 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 5933 | 33014 | grok | COLLISION D6 vs C3 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 6390 | 33020 | grok | COLLISION D1 vs C6 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 6391 | 33020 | grok | COLLISION D5 vs C1 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 6762 | 33021 | gemini | COLLISION D1 vs C1 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 6763 | 33021 | grok | COLLISION D1 vs C1 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 6764 | 33021 | grok | COLLISION D2 vs C1 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 6765 | 33021 | grok | COLLISION D3 vs C1 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 7087 | 33025 | grok | COLLISION D2 vs C4 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 7088 | 33025 | grok | COLLISION D3 vs C5 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 7090 | 33025 | grok | COLLISION D5 vs C5 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 7325 | 33025 | sol | COLLISION D2 vs C4 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 7326 | 33025 | sol | COLLISION D3 vs C5 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |
| 7584 | 33040 | grok | COLLISION D2 vs C3 | TRUE | rival readings with no stated contradiction; FORCED needs the answer's words to be unable to agree |

### E-RES

| Row | Run | Seat | Item | Verdict | Reason |
|---|---|---|---|---|---|
| 5162 | 32998 | sol | RESULT REASON | TRUE | 'does not settle whether...' is an absence |
| 5993 | 33014 | chatgpt | VERDICT LINES | FALSE | code fault: the VERDICT LINES check builds its RETRACTED set from the whole judge text, so 'RETRACTED: D6 vs C1' inside an [AUDIT ... K-G4; RESULT: UNCURED] note dropped D6; the uncured line stands and k=1 is right |
| 6171 | 33014 | sol | RESULT REASON | FALSE | engine-written recompute RESULT line ('recomputed after the cure from the cured lines'), not a judge's reason |
| 6821 | 33021 | chatgpt | RESULT REASON | FALSE | same: engine-written recompute RESULT line |
| 7816 | 33040 | sol | RESULT REASON | TRUE | 'without decisively establishing whether Joseph supplied...' is an absence |

