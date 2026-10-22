# BEFORE (Worker_E), THE DEBATE FIXED step 9: run 27665 as stored, read whole on the fixed list (7422 a-g, 7427 C a-e)

**Ruling:** BB-7440 item 2, reading 1. Run 27665 (debate 921f5530) as stored is the BEFORE. The live run after the publish is the AFTER.

**Read:** report27665.md (md5 7f22d279), which holds the rounds, synthesis, diagnostic, all four judgments, rule Text 1 in full, Text 2's heading and system lines, and all three cure calls, together with the rows by SQL. The window is bounded by two clock reads: after 20:48:50 CDT (the post of BB-7443) and before 20:50:30 CDT.

**Scripted checks:**
- Every shown round line longer than 40 characters is present in both Text 1 and Text 2: 165 of 166. The one miss is a report heading.
- Every Text 1 rule line from COUNTING RULE onward is present in Text 2: 0 missing.

**Independence:** I had read Worker_A3's BEFORE row (BB-7441) on the board before this read. I did not open A3's file. Every item below was read at its line or row.

Each defect below is given with its judge, its line, and the rule sentence it breaks.

## (a) Each judge as graded
- **Gemini, panel, judgment 787:** BROKEN-1, n=6 w=0 k=1.
  - Defense SELF-SUPPORTED c=0; challenge PROP-DEPENDENT c=1 (LINK 5).
  - Collision lines: D1-D5 STANDS; D6 vs C3 (Matthew 1:18) DEFENDER LINK BROKEN.
  - Chain marks: FOOTED / FOOTED.
- **Grok, judgment 788:** HELD-1, k=0.
  - Defense PROP-DEPENDENT c=2 (premises 1, 3 UNEXHIBITED); challenge COLLAPSED L=5 c=3, with premise 3 VOID.
  - Eight UNDERDETERMINED lines.
  - Chain marks: STRAINED / FOOTED.
- **GLM, judgment 786, sitting for the removed panel DeepSeek:** HELD-1.
  - Defense SELF-SUPPORTED c=0; challenge PROP-DEPENDENT c=3 (LINKs 3, 5, 6).
  - Six UNDERDETERMINED lines.
  - Chain marks: FOOTED / STRAINED.
- **Single judge, DeepSeek:** BROKEN-1, k=1, on D6 vs C3 (Matthew 1:18, 1:25; Luke 1:34).
  - Defense PROP-DEPENDENT c=0; challenge PROP-DEPENDENT c=3.
  - Chain marks: STRAINED / FOOTED.

## (b) Each judgment's own consistency
1. **K-G7, Gemini.** Its count line reads "CONCEDED LINKS: 0 -- All 6 links are SUPPORTED", beside "D6 vs C3: DEFENDER LINK BROKEN".
   - Broken: "Grade a link BROKEN when ... the broken side's later rounds left any of those witnesses UNANSWERED", and "The same holds when your CONCEDED LINKS ... count is 0 while you grade a link of that side BROKEN for a witness left unanswered" (Text 1).
   - Its own cure SHORT line treats CR2's answer as falling short, so premise 6 is held both answered and unanswered.
2. **K-G7, the single judge.** Same fault. "premises 1-6 were all answered with layer footing" (line 821) stands beside D6 BROKEN, with the cure SHORT saying the answer "does not supply Joseph's knowing".
3. **K-G6, defender side.** The ledger marks premise 1 (Psalms 132:11) and premise 3 (Matthew 1:3, 1:5, 1:6) NOT NAMED.
   - Rule: "A verse marked NOT NAMED is unanswered by the rule".
   - Gemini (c=0), GLM (c=0) and the single judge (c=0) leave both uncounted.
   - GLM argues them away in its count line (Psalms 132:11 "adds no distinct witness"; Matthew 1:3/5/6 answered "in substance"), against that sentence.
   - Grok counts both.
4. **K-G6, challenger side.** The ledger marks premise 1 (Luke 1:31) and premise 6 (Matthew 1:23, Isaiah 7:16) NOT NAMED.
   - Gemini counts LINK 5 only (premises 1 and 6 uncounted).
   - GLM and the single judge count 3, 5, 6, so premise 1 is uncounted.
   - Grok counts 1, 5, 6.
5. **VOID premise counted.** The defender's premise 3 against the challenger charges "That 'till' means never", on a quote that says only "the knowing is denied: 'knew her not till she had brought forth her firstborn son'".
   - Rule: "charged in terms stronger than its quote, is VOID ... a CONCEDED answer to a void premise is NOT a concession".
   - GLM (line 795, "LINK 3, CONCEDED") and the single judge (line 823, "Defender premise 3: CONCEDED") count it.
   - Grok excludes it (line 756). Gemini does not count it.
6. **Collision line form, GLM.** It writes "D1: UNDERDETERMINED -- vs C6 (Romans 1:3)". The required form is "D<i> vs C<j> (<verse>): ...". This is format only.
7. **The panel counted a judgment the rule does not count.** Gemini's item 1 contradiction leaves its violation standing ("your judgment is then not counted"), yet judged_by = gemini, glm, grok.
   - Without Gemini the panel is Grok HELD, GLM HELD, so the panel word HELD is unchanged.

## (c) Every cure row
- **The single judge, K-G4 on D6 vs C3, CURED.**
  - PRESSED quotes DR2: "Matthew 1 reverses the pattern ... (1:25)", present at report line 313.
  - SHORT quotes CR3: "Matthew 1:25 'knew her not till...' is bounded by 'till'...", present at line 396.
- **Gemini, K-G4 on D6 vs C3, CURED.**
  - PRESSED quotes DR1: "Joseph had no union through the birth (Matthew 1:25), and the child was found before any coming together (1:18).", present at line 189.
  - SHORT quotes CR2: "The challenger's syllogism ...", present at line 266.
- **Gemini, K-G3, CURED.** The CORRECTED STANDING was DEFENDER PROP-DEPENDENT, but judgment row 787 still stores defense_standing SELF-SUPPORTED (SQL 20:49 CDT). The cure reached the report table (line 24) and not the row. This is DoD 5.
- **Removed panel DeepSeek, K-G4 on D6 vs C6, UNCURED.** It was replaced by GLM as the alternate (line 85).
- **What no cure raised:** none of the K-G6 items in (b) 3-4, the K-G7 items in (b) 1-2, or the VOID count in (b) 5.

## (d) The debate row (debate_results 921f5530, SQL 20:49:52 CDT)
1. **Two verdicts.** framework_verdict BROKEN (the single judge's) sits beside panel_verdict HELD, split 2-1, outcome DEFENDER PREVAILS. DoD 1.
   - 13 rows in all carry a framework_verdict different from their panel_verdict.
2. **Findings.** get_pending_debates_for_findings returns 0 rows for 921f5530, because it selects on framework_verdict IN (HELD, PARTIAL), although the panel's word is HELD.
3. **Standing and count columns are the single judge's.** defense_standing PROP-DEPENDENT, conceded_links 0; challenge_standing PROP-DEPENDENT, challenger_conceded_links 3.
4. **review_notes carry two tool defects.**
   - "EXTRACTOR v15: N CHECK - CLAUSE n=6 AGAINST DECLARED CHAIN COUNT 0" is false: the DECLARED CHAIN at CR1 has D1-D6 (lines 146-153).
   - "AUDIT v19: DEFENDER CONCEDED ITEMIZATION COUNTS 1 BUT JUDGE STATED 0" is a count read from prose, the class measured at BB-7431.
5. **record_integrity_scan check 4 reads 10 live** (SQL 20:50:30 CDT). These are July rows where the pair is one reading. The judgment-row count is 0.

## (e) The report as a reader sees it
1. **There is no "verdict of the debate" line.** The Judges list gives the single judge BROKEN with the same weight as the panel result HELD (lines 11-15). DoD 1, W2.
2. **The diagnostic treats the single judge's BROKEN as the round's result.** Its heading reads "after the single judge's BROKEN verdict" (line 603). Its section 6 item 2 would amend "the result line" CHALLENGER WINS, when the debate's result is DEFENDER PREVAILS.
3. **The "Reads that gave no text" line names a tool error.** It reads "Panel Build: Cannot read properties of undefined (reading 'json')" (line 849), so Panel Build's own text was never printed.
4. **Text 2's heading names one recipient.** It says "alternate judge GLM", but the Gemini and removed-DeepSeek cure calls both say they "Followed the e7410bdd... text above (Text 2)".
5. **No section names the K-G6 or K-G7 cases.** The violations table shows only K-G4 and K-G3.

## (f) Plain language
- **"The Boy"** appears in DR1 (line 205, "The Boy answers"), CR2 (line 270, "The Boy's answer") and DR2 (line 370, quoting CR2). Luke 2:40 and 2:43 say "the child".
- **Capitalised pronouns** occur mid-sentence in the rounds 7 times, for example at line 163 ("His Father", "Him").
- **Some Greek is unglossed,** for example *Anastēsas* and *ek nekrōn* at DR1 line 236.
- **Cause:** the plain-language sentence is absent from all four texts. It is not in Text 1's system message (line 858) or in Init with Guards at 428fbdc3. DoD 2.

## (g) Anything else
- **The single judge's BROKEN ground leans on a demand for a stating text.** It reads "without a text showing Joseph's union in the conception window" (line 816). The rule reads "demanding a verse that states it is the retired stating-verse test, which is never applied". That sentence governs counts, and its use against a collision line is a reading, not a fact.
- **Report header times.** The report says it was "started Oct 21, 6:26 PM CDT, transcript written 6:58 PM CDT". The execution metadata gives 23:26:24Z to 23:58:19Z, which agree.
- **The (d) and (e) items of 7427 C, the flow nodes and the undo path, do not apply to the BEFORE.** There is no change yet, so nothing is unequal and nothing can be undone. The live flow read is 428fbdc3 active (my fetch, 20:01 CDT). I exercise the undo on a copy at step 5, on the draft.
