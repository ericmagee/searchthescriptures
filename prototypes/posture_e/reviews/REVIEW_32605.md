# Review of run 32605 (ODV1-32605-lkuacfjh, debate d28c3dee): the S4 live run (flow ca09b97a)

Worker_E, session_014Qy67bHv8uBmRXbWGSrghm, 2026-11-04. This review is private; there is no board post.

**What was read.** Every number in this review comes from the stored row, the eight rounds, the execution data (ex32605.json) and the produced document (r32605/doc.md). Three parts were read in full: the result, checks and violations sections; the three judges; and the Oracle's rounds, by counts and by the matched passages. The defender's rounds were read through their concession sentences only. The synthesis was not read in full (item 6 below).

## S4 structural check (counted over the run's own requests)
1. In C1 to C4 Build, the new breaking rule appears once in each request and the old "broken only when ... states the contrary" 0 times.
2. D1 to D4 Build carry neither sentence, as designed: the rule is the challenger's.

S4 is in as built.

## Outcome
- **Outcome:** UNDERDETERMINED. The panel reads HELD 3-0. Gemini, ChatGPT and Grok were all counted, and no seat was removed (drv_removed null).
- **Gemini:** DEFENDER WINS. Defense SELF-SUPPORTED, 0 conceded. Challenge PROP-DEPENDENT, 2 conceded: two of the Oracle's answers FAIL its answer check.
- **ChatGPT:** RESULT UNDERDETERMINED. Both sides SELF-SUPPORTED, 0 conceded.
- **Grok:** RESULT UNDERDETERMINED. Both sides SELF-SUPPORTED, 0 conceded.

## Findings
1. **The defender conceded the Mary route and the judges counted nothing.** Examples: "I admit that no KJV verse says so" (D2, of Mary's line); "I grant that no KJV verse states Mary's descent by name" (D3); "I grant the Davidic house is attached to Joseph" (D3). D5, "no biological father", was kept. All three judges counted 0 defender links conceded. That is S2 and S3, written live after this run (878ccc3f) and tested by a dry re-grade of this run.
2. **Grok decided the keystone on the banned stating ground.** Grok wrote at D5: "neither row's own words state that Joseph begat the child or that no man's seed was involved". Commitment 3 bans "no witness's own words state it". The K-C net missed that phrasing. Fix built (kc/, 17 nodes, six-case test), not yet written.
3. **Gemini retracted all 5 of its BROKEN grades in the cure (K-G4).** Each retraction reads "the challenger addressed" the verse. These BROKEN lines graded the challenger's links on meaning, and the cure step converted them to UNDERDETERMINED. This is finding 6 of the consolidated review again (the A4 rule conflict), now twice. It remains with item 8.
4. **The Oracle's premise on the oath was voided.** Grok: "the charge 'leaves the Davidic oath without loins' adds WITHOUT". As a result Acts 2:30, 2 Samuel 7:12, Romans 1:3 and Hebrews 7:10 were not counted as witnesses. This concerns the Oracle's own wording of its charges, which is Oracle strategy, not a rule to change.
5. **The reader's guide states the old breaking rule.** Format Markdown reads: "a cited verse says the opposite and the defender has no answer". Fix built in s7/ (rebased on S2+S3), not yet written.

## The Oracle seat against the guards (counts over C1 to C4)
| Rule | C1 | C2 | C3 | C4 |
|---|---|---|---|---|
| Psalm 2:7 / Acts 13:33 / Hebrews 5:5 / Hebrews 1:5 | 0 | 0 | 0 | 0 |
| DG-8: Matthew 1:20 cut to "that which is conceived in her is of the Holy Ghost" | 1 | 1 | 0 | 0 |
| Gloss cut: synerchomai (G4905) given as "come together"; the lexicon reads "or (specially), cohabit (conjugally)" | 0 | 1 | 1 | 1 |
| Its frame sentence (never charge the defender with lacking such a verse) | 0 | 0 | 2 | 0 |

**On the frame sentence.** The two C3 sentences are "The defender has granted that no verse states Mary's descent from David" and "a woman whose Davidic descent no verse states." Both make S2's argument: a step naming a house that no row names. S2's common sentence (live in 878ccc3f) now states that ground as a rule of the debate, which resolves the conflict with the frame sentence.

**On the recurring cuts.** The DG-8 cut has now appeared in two runs, and so has the synerchomai gloss cut. Both are breaches by the Oracle seat.

## Checklist (note entry 18)
1. **Every panel seat accounted for.** CHECKED. All three were counted, none was removed, and the reserve was not needed. The alternate pool is [sol], but the seating step was not reached.
2. **Ledger NOT NAMED lines against each judge.** UNCHECKED (44 hits).
3. **Recompute after the cure.** CHECKED for Gemini: corrected result HELD-1, 5 retractions (finding 3).
4. **Removed seats and review notes.** Removed seats: none. Review notes: UNCHECKED.
5. **Closes.** UNCHECKED for new-in-close and renumbering lines.
6. **Synthesis against the transcript.** UNCHECKED.
7. **The Oracle seat against the guards.** CHECKED (table above).
8. **"nth run" counts.** Not applicable.
