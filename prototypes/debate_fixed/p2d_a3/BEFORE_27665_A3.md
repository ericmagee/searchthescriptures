# THE DEBATE FIXED (BB-7397), step 9 BEFORE read, Worker_A3 (ruling BB-7440)

Run 27665 (debate 921f5530), as stored. Read whole: report27665.md (md5 7f22d279), all 1,761 lines, by Worker_A3 on 2026-10-21, 20:44 to 20:58 CDT.
Text 1 and Text 2 were checked line by line against the displayed rounds: every displayed line is in both texts, and nothing else is in them but the round headers and the rulebook.
The stored rows were read by SQL: debate_results 921f5530 and debate_judgments 786, 787 and 788. The live flow was read by tool: versionId and activeVersionId are both 428fbdc3.
Each item names the judge, the line and the rule sentence it breaks. Rule sentences are quoted from the rulebook as sent (Text 1 lines 1176-1228; Text 2 carries the same rule text).

## (a) Each judgment: verdict, clause, standings, counts, collision lines, chain marks

| Seat | Verdict / clause | Defense | Challenge | Collisions | Chain marks |
|---|---|---|---|---|---|
| Gemini (panel, counted) | BROKEN-1, n=6 w=0 k=1 | SELF-SUPPORTED, c=0 (cure: PROP-DEPENDENT) | PROP-DEPENDENT, c=1 (LINK 5) | D1-D5 STANDS; D6 vs C3 DEFENDER LINK BROKEN | FOOTED / FOOTED |
| Grok (panel, counted) | HELD-1, k=0 | PROP-DEPENDENT, c=2 (premises 1, 3 UNEXHIBITED) | COLLAPSED, L=5 c=3 (premise 3 VOID) | all UNDERDETERMINED or STANDS | STRAINED / FOOTED |
| GLM (alternate, seated for DeepSeek) | HELD-1, k=0 | SELF-SUPPORTED, c=0 | PROP-DEPENDENT, c=3 (3, 5, 6) | D1-D6 "D<i>: UNDERDETERMINED -- vs C<j>" | FOOTED / STRAINED |
| DeepSeek (panel, removed) | BROKEN-1, k=1 | PROP-DEPENDENT, c=2 (LINK 1, 3) | COLLAPSED, c=4 | D6 vs C6 DEFENDER LINK BROKEN | STRAINED / FOOTED |
| DeepSeek (single judge) | BROKEN-1, n=6 w=0 k=1 | PROP-DEPENDENT, c=0 | PROP-DEPENDENT, c=3 (3, 5, 6) | D6 vs C3 DEFENDER LINK BROKEN | STRAINED / FOOTED |

## (b) Each judgment's own consistency

1. **Gemini.** Its count is 0 ("CONCEDED LINKS: 0 -- All 6 links are SUPPORTED"), yet it grades D6 vs C3 BROKEN for unanswered witnesses. This breaks Text 2 line 1287: "The same holds when your CONCEDED LINKS ... count is 0 while you grade a link of that side BROKEN for a witness left unanswered." It is a K-G7 case (BB-7419, BB-7420), and no check fired. Ledger premise 6 reads "NOT NAMED: none".
2. **Gemini.** It is SELF-SUPPORTED beside a BROKEN link, against line 1285: "A side with any link graded BROKEN here cannot be SELF-SUPPORTED." This is K-G3, and the cure corrected it to PROP-DEPENDENT. The stored row 787 still reads SELF-SUPPORTED, because the cure's correction is not written to the row (DoD 5).
3. **Gemini.** Its defense count is 0 while the ledger marks premise 1 (Psalms 132:11) and premise 3 (Matthew 1:3, 1:5, 1:6) NOT NAMED. That breaks two rule sentences: "A verse marked NOT NAMED is unanswered by the rule" and "A premise whose pressed witness goes unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS". This is K-G6. On the challenger side its count is 1, while challenger premise 1 (Luke 1:31) and premise 6 (Matthew 1:23, Isaiah 7:16) are also NOT NAMED: K-G6 on C1 and C6 (BB-7412 set).
4. **Gemini, form.** Line 1 is the bare word "BROKEN", with none of the 2 to 4 tagged sentences the rule requires. The RESULT line has no sentence. The reasoning has no CITATION CHECK line, which the JSON form lists.
5. **GLM.** Its defense is SELF-SUPPORTED with c=0 while the ledger marks premises 1 and 3 NOT NAMED. Its own line names the ledger and then sets it aside ("note the ledger marks ... NOT NAMED, but Psalms 132:11 is the identical ... row"), against the rule sentences quoted in item 3. This is K-G6 on defender premises 1 and 3, and on challenger premise 1 (Luke 1:31 NOT NAMED, premise spared).
6. **GLM, form.** Its collision lines read "D1: UNDERDETERMINED -- vs C6 (Romans 1:3)". The required form is "D<i> vs C<j> (<verse>): UNDERDETERMINED". Line 1 opens "VERDICT: HELD." where the verdict word must come first.
7. **Single judge.** Its count is 0 ("premises 1-6 were all answered") beside D6 vs C3 BROKEN for an unanswered witness. This is the same sentence as item 1 (K-G7). It also has defender premises 1 and 3 NOT NAMED and uncounted (K-G6), and challenger premise 1 NOT NAMED and uncounted (K-G6 on C1).
8. **Single judge, out-of-round list.** It labels "Believers are born twice ..." as [DR2], but that sentence is in [DR1] (report line 178).
9. **Premise 3 against the challenger is VOID by the rule's text.** The charge is "That 'till' means never", and its quote is "the knowing is denied: 'knew her not till she had brought forth her firstborn son' (1:25)". That is "charged in terms stronger than its quote", so the premise is VOID and "a CONCEDED answer to a void premise is NOT a concession". Grok applied this. GLM, the single judge and the removed panel DeepSeek counted the premise as CONCEDED. The rule decides the case, so the rule itself is not divided. The judges' application of it is.
10. **Removed panel DeepSeek.** It counts LINK 1 and LINK 3 (c=2) beside D6 vs C6 BROKEN. Premise 6 is uncounted, the per-premise case design (B) exists for (BB-7436). Its out-of-round list includes "I affirm the WHO the text names ..." (CR1), which is not a concession.
11. **Grok.** Consistent: c=2 matches the ledger; L=5, c=3 and 2c=6>5 give COLLAPSED; premise 3 VOID. Its D3 vs C2 line cites Luke 3:23. No defect found.

## (c) Every cure

12. **Single judge, K-G4 D6 vs C3: CURED.** The PRESSED line quotes [DR2] and the SHORT line quotes [CR3] "bounded by 'till' within the sentence". The cure request listed only K-G4. The count-0-beside-BROKEN contradiction (item 7) was never put to it, because K-G1's word test found none of its words in the line (BB-7419, item 2).
13. **Gemini, K-G4 D6 vs C3: CURED** with PRESSED [DR1] and SHORT [CR2]. **Gemini, K-G3: CURED** ("CORRECTED STANDING: DEFENDER PROP-DEPENDENT"). The correction reached the report but not row 787 (item 2).
14. **Removed panel DeepSeek, K-G4 D6 vs C6: UNCURED.** The judgment was not counted and GLM sat in its place. The report gives the reason as "the later round (CR3) mat 1:23; no SHORT line quoting its answer". That reason text is garbled ("(CR3) mat 1:23").
15. **The report does not print the cure replies themselves.** Each cure section shows the judge's original and the cure request; the reply appears only in extracts in the violations table.

## (d) The debate row (921f5530)

16. **Two verdicts on one row.** framework_verdict is BROKEN (the single judge's word) and panel_verdict is HELD; the outcome is DEFENDER PREVAILS (DoD 1). Measured now across all rows: 13 carry two verdicts (W1). In 3 of them the findings pipeline sees the single judge's HELD or PARTIAL while the panel said BROKEN. In 6 it sees BROKEN while the panel said HELD or PARTIAL; 27665 is one of those 6, so it is left out of findings.
17. **The row's standing columns are the single judge's**: PROP-DEPENDENT with 0 conceded on the defense, PROP-DEPENDENT with 3 on the challenge. The report labels them "(single judge)", which is correct.
18. **review_notes carries three flags, and two are tool defects:**
    - "EXTRACTOR v15: N CHECK - CLAUSE n=6 AGAINST DECLARED CHAIN COUNT 0". The extractor counted zero declared links, but [CR1] declares D1 to D6 under "**DECLARED CHAIN**". This is the "CHAIN COUNT 0" the diagnostic names at its §1F item 3.
    - "AUDIT v19: DEFENDER CONCEDED ITEMIZATION COUNTS 1 BUT JUDGE STATED 0". This is a false count from prose. The single judge's line is "No ... premise was CONCEDED (stated) or UNEXHIBITED", which counts nothing. It is the same class as BB-7431.
    - The third flag, K-G4, is shown as "REVIEW THIS ROW" though its item was CURED.
19. **data_class is "contested".** Its basis, the flags, includes the two tool defects in item 18.

## (e) The report as a reader sees it

20. **The header puts the single judge's BROKEN beside the panel's HELD**, with no line naming the debate's verdict. The diagnostic is headed "after the single judge's BROKEN verdict". Its next action 2 asks to amend the result line "CHALLENGER WINS -- Christ had no human biological father". That line is the single judge's RESULT, not the debate's outcome, which is DEFENDER PREVAILS. So the diagnostic is built on the second opinion (DoD 1).
21. **"Reads that gave no text: Panel Build: Cannot read properties of undefined (reading 'json')".** The texts the counted panel judges Gemini and Grok received are not printed as theirs. Text 2's heading names only "alternate judge GLM ... seated for DeepSeek". The cure-call sections show that Gemini and the panel DeepSeek also received Text 2 (lines 1694, 1725). The heading does not name every seat that received the text, as the report's own preface says it must.
22. **The Result table shows review flags for items already CURED** (K-G4 and K-G3 on Gemini) as "REVIEW THIS ROW", with no cured mark beside them.
23. **The violations table says "4 violations: 3 cured, 1 not cured".** The table holds no K-G6 or K-G7 items, because no such check existed. Items 1, 3, 5 and 7 are not reported anywhere in the report.

## (f) Plain language (the plain-language sentence was not yet in the texts; listed as the BEFORE)

24. **"the Boy"**: the challenger [DR1] line 205, "The Boy answers"; the defender [CR2] line 270, "The Boy's answer is a covenant title"; and quoted again in [DR2] premise 2, line 370. The KJV says "the child": Luke 2:40, "And the child grew, and waxed strong in spirit"; Luke 2:43, "the child Jesus tarried behind in Jerusalem" (pulled from kjv_verses, 20:59 CDT).
25. **Capitalised pronouns for Christ ("His Father", "Him", "He") that the KJV does not use**: the challenger, throughout [DR1] and [DR2] (for example, lines 163, 205, 254), and the removed DeepSeek's RESULT line ("God is His Father").
26. **Greek words with no plain English meaning beside them**, for example *Anastēsas* (line 236), *mnēstheusa* (glossed only as "betrothed" in the following clause) and *klēthēsetai* (line 276), alongside many glossed ones. Neither seat was bound by such a rule in 27665.

## (g) Anything else wrong

27. **The challenger [DR2] line 307 says the defender's bracketed "[the son]" is "his own insertion".** The bracket is the KJV's own supplied words at Luke 3:23. kjv_verses reads "being (as was supposed) the son of Joseph, which was [the son] of Heli" (pulled, 20:59 CDT). This is a misstatement of fact by the challenger, and none of the four judgments named it.
28. **The synthesis and the diagnostic both name "Mary supplies the seed of David" as NO-FOOTING-EXHIBITED**, the challenger's load-bearing floating [L4]. Only Grok names floating [L4]s on both sides, as the rulebook orders ("Name every floating [L4] on either side before weighing it"). Gemini and GLM name none. The single judge names none in a CITATION CHECK line; its text has no such line.
29. **Row fact correcting BB-7440 item 1.** Report line 1699 is under "Cure call, DeepSeek (deepseek-flash)", which "Followed ... Text 2". It is the removed panel DeepSeek's original judgment (count 2, D6 vs C6 BROKEN), not the single judge's cure reply. The single judge's cure call is at line 1640 and follows Text 1.

## Known items, each answered

- 7419 (both BROKEN judgments contradict their own counts): present, items 1 and 7.
- 7409 and 7412 (the K-G6 set): present, items 3, 5 and 7, matching the 7412 set.
- 7389 (the step 16 reading split by part): the reason for this whole read.
- 7404 (Gemini's corrected standing not written to the row): present, items 2 and 13.
- The K-G7 cases: Gemini and the single judge on D6 vs C3 (items 1 and 7). The removed DeepSeek's D6 vs C6 with count 2 is the case for design (B) (item 10).

## Not checked by me, stated

- (e) of 7427 C, "the undo path exercised on a copy". There is no draft yet; it is owed at step 4 on the draft. The prior files are saved: derive_prior.sql (347c8a94), scan_prior.sql (7c32c765), and the live flow 428fbdc3.
- (c) of 7427 C. The three functions are read in their files, not run on the July rows: the new derive file runs only at 6b. scan_new.sql check 4 on live data gives 10, the July rows (RUN_SCAN.txt). get_pending_debates_for_findings reads framework_verdict, measured in item 16.
