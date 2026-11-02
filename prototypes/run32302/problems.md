# Run ODV1-32302: problems and solutions

Run 32302, flow version 6ff18a54 (as given in the brief; the row has no column that records the flow version), fix set 5 (judge_fix5: G1 to G13) plus the direct Anthropic route with cache diagnostics. Fix set 6 (judge_fix6: H1 to H8) went live after this run started and is not in it: the live workflow read on 2026-11-02 is now versionId 9165fb8a (updatedAt 23:05:19Z), and its D4 Build and C4 Build differ from the 6ff18a54 copy in judge_fix6/data/live_code, while D1, C1, D2, C2, D3, C3 Build, C1 Extract and D2 Extract are byte-identical to it. Fired 16:36 CST 2026-11-02 (the first timed node, the defender's round 1 call, starts 22:35:58Z in timings/timings_32302.json), stopped about 17:14 CST (Record Alternates 23:14:08Z; judgment rows 23:14:08Z to 23:14:09Z; enforcer rows created 23:14:10Z), status success (as given; the row has no status column). From the first timed node to Record Alternates the run took about 38.2 minutes.
Row a3db626c (debate_results), run token ODV1-32302-t4gyo690. Topic "Did Christ have a biological father?"; defender Claude Sonnet 5.5 (anthropic/claude-sonnet-5.5, plain profile, 0 record labels served); challenger Claude Haiku 5.5 (anthropic/claude-haiku-5.5, engine "haiku", oracle profile, the Debate Oracle seat, 27 record labels served, guards_loaded 54). Both debaters were called direct to Anthropic; review_notes holds eight CACHE DIAG lines.
Result fields: outcome DEFENDER PREVAILS; panel_verdict and framework_verdict HELD; panel_split "2-0 (1 not counted: debate rule)"; judged_by and panel_expected chatgpt, gemini, glm (GLM is listed though it was not counted); challenge_standing COLLAPSED; defense_standing, conceded_links and challenger_conceded_links NULL ("no majority among the 2 counted seat(s)"); both chain marks FOOTED; underdetermined_seats chatgpt:COLLISION, gemini:COLLISION; panel_substitution NULL; drv_removed NULL and no odv1_drv_removals row; citation_block NULL; data_class "contested"; out_of_round_concessions 11.
Counted seats: Gemini (judgment 903, google/gemini-3.8-flash) HELD, DEFENDER WINS, defense PROP-DEPENDENT 2, challenge COLLAPSED 3, 0 uncured; ChatGPT (905, openai/gpt-6.1-terra) HELD, DEFENDER WINS, defense SELF-SUPPORTED 0, challenge COLLAPSED 4, 0 uncured. Not counted: GLM (904, z-ai/glm-5.3) HELD, DEFENDER WINS, PROP-DEPENDENT 2, COLLAPSED 3, drv_uncured 1. Alternate tried for GLM: Sol (openai/gpt-6.1-sol) HELD, DEFENDER WINS, SELF-SUPPORTED 0, PROP-DEPENDENT 2, "NOT SEATED; WHY: 2 uncured item(s)". Single judge (no vote): deepseek-flash, HELD, DEFENDER WINS, PROP-DEPENDENT 2, COLLAPSED 3.
Tokens: input 705,773, output 346,647; cache 213,283 written, 374,094 read. Synthesis usage: "prompt=46096 completion=24778 reasoning=19873 finish=stop max_tokens=64000".

**Nothing here is applied.** Nothing was written to the database, n8n or git. The database was read with SELECT statements only; the live workflow was read with one GET (python urllib, N8N_API_KEY from the environment, not printed), saved to the scratchpad. Each fix waits for your word.

**What was read whole, with lengths in characters:** the defender's round 1 (claude_r1, 6,802); the challenger's round 1 (engine_r1, 9,895); the defender's round 2 (claude_r2, 8,735); the challenger's round 2 (engine_r2, 5,888); the defender's link round (engine_r3, 6,949); the challenger's link round (challenger_r3, 4,798); the defender's close (defender_r4, 8,755); the challenger's close (challenger_r4, 5,883); the three judgments with their audit, cure and recompute lines (903 Gemini 10,604; 904 GLM 22,521; 905 ChatGPT 12,611); the single judge's text (independent_verdict_raw, 15,959); the synthesis (19,981, in two parts); review_notes (7,703) and out_of_round_detail (1,140); the citation report (citation_check: 212 items, each holding only ref, link, side, round, status and load_bearing; counted per side and round, every item that is not MATCHES read); the panel fields, panel_substitution, drv_removed (NULL) and odv1_drv_removals (no row); engine_manual version 86, section 8 (UNANSWERED WITNESS, CLOSE ROUNDS, VOID, TERMS, VERDICT, RESULT, STANDINGS, COLLISION POINTS); md_notes_rulings 370 to 387; drift_guards 8, 18, 24, 29, 56, 57, 59, 60, 61 (the guards the synthesis names, and the one guard that names Isaiah 7:14).
**The enforcer log** (debate_enforcer_log, 25 rows, ids 87 to 111): every column of every row; the flagged_line and response_line of all 24 cure rows; the full_reply of row 104 (single judge cure, 4,843), row 105 (Sol's alternate judgment, 12,022) and row 106 (Sol's cure, 5,958). The full_reply of the Gemini, GLM and ChatGPT cure rows (2,824; 9,243; 8,255) and the prompt_sent texts (12,889 Gemini; 15,735 GLM; 12,803 ChatGPT; 15,892 single judge; 14,327 Sol) were not read whole; the cure statements of those seats were read as the judgment rows store them in their DEBATE RULE VIOLATION REPORT lines.
**The live workflow** (moMxiV4Irg1uRBZN): the code of D1, C1, D2, C2, D3, C3, D4 and C4 Build (the request body builder, the message lists, the system prompt and the verse-sheet append), the "D2 Call anthropic" parameters, and the cache-diagnostic line of C1 Extract; the 6ff18a54 copies of D4 Build and C4 Build in judge_fix6/data/live_code for the two nodes that have since changed. The K-G4 cure check (kg4Witnesses, kg4Answered) was read in judge_fix6/new/Panel Cure Check.js and compared with judge_fix6/base.
Each pressed witness was checked by reference with SQL position(), and by a regular expression where one reference is the prefix of another (Matthew 1:1 and 1:16; Matthew 1:2 and 1:20; Luke 2:4 and 2:48); bare chapter-verse forms ("3:31", "7:11") and the word "Nathan" were also searched. Quotations named below were checked against kjv_verses (margin notes set aside, italic brackets opened, punctuation and case set aside).

**Round labels.** "CR" marks the defender's rounds and "DR" the challenger's. This file writes "defender round n" and "challenger round n", with round 4 the close. Quotations from the record that hold a long dash show it as [dash].
**Numbering in the record.**
- The declared chain (defender round 1): D1 Matthew 1:16 (verb and feminine pronoun) with Luke 3:23; D2 the conception before they came together, "of the Holy Ghost" (Matthew 1:18, 1:20; Luke 1:35); D3 Mary had known no man (Luke 1:34, Matthew 1:25, Genesis 4:1); D4 Joseph's sonship is reputed (Luke 2:48-49, John 6:42, Luke 3:23); D5 the prophets (Isaiah 7:14, almah, Genesis 24:16 and 24:43, Genesis 3:15, Jeremiah 31:22, Galatians 4:4); D6 the answer (keystone). This order differs from 32293 (there D4 was Isaiah 7:14 and D5 the reputed sonship).
- The challenger's premise list (round 2) files six premises as LINK 1, 2, 3, 4, 6, 6 (two against D6, none against D5). The defender's link round answers them as LINK 1, 2, 3, 4, "LINK 6 [premise 5]" and "LINK 6 [premise 6]", and lists five premises against the challenger, numbered 1 to 5.
- **The challenger's link round has no LINK blocks.** It is headed "**CLOSE ROUND (challenger)**", withdraws premises 2 and 3 ("Premises 2 and 3 are not load-bearing for my case. I withdraw them."), and writes six numbered points ("1. Premise 1, restated ...", "4. Premise 4 and the seed chain", "5. Premise 5 ...", "6. The throne bar"). The defender's close answers those points as C1 to C6. The challenger's close restates "under the defender's numbers" (D1 to D6) and gives no C numbers.

## Timings (timings_32302.json, seconds; Z times)

| Step | Start (Z) | Seconds | 32293 |
|---|---|---|---|
| Defender round 1 | 22:35:58 | 44.7 | 48.5 |
| Challenger round 1 | 22:36:46 | 72.7 | 173.8 |
| Defender round 2 | 22:38:01 | 72.5 | 99.6 |
| Challenger round 2 | 22:39:16 | **8.9** | 292.1 |
| Defender link round | 22:39:25 | 48.1 | 80.0 |
| Challenger link round | 22:40:16 | 35.2 | 376.1 |
| Defender close | 22:40:53 | 60.2 | 117.7 |
| Challenger close | 22:41:56 | 33.7 | 165.6 |
| Synthesis (DeepSeek) | 22:42:31 | 139.2 | 135.0 |
| Single judge | 22:44:54 | 203.5 | 245.1 |
| Single judge cure | 22:48:19 | 30.0 | 34.8 |
| Diagnostic | 22:48:52 | 34.4 | 16.4 |
| Panel judge 1, Gemini | 22:49:29 | 124.5 | 127.8 |
| Panel judge 2, GLM | 22:51:34 | **710.4** | 520.4 |
| Panel judge 3, ChatGPT | 23:03:24 | 94.8 | 92.3 |
| Panel cure 1, Gemini | 23:05:02 | 36.5 | 29.8 |
| Panel cure 2, GLM | 23:05:40 | **321.5** | 292.8 |
| Panel cure 3, ChatGPT | 23:11:04 | 51.7 | 7.1 |
| Alternate, Sol for GLM | 23:11:58 | 93.6 | 101.4 |
| Alternate cure, Sol | 23:13:34 | 31.2 | 16.2 |
| Record Alternates | 23:14:08 | 0.2 | 0.6 |

- The defender's four rounds took 225.5 s, the challenger's 150.5 s (32293: 345.8 s and 1,007.6 s). Haiku wrote its 5,888-character round 2 in 8.9 s.
- GLM's judgment and cure took 1,031.9 s together, 45% of the run. Its cure produced the one uncured item that kept GLM off the count (B3). The Sol alternate and its cure then took 124.8 s and were not seated (B3).
- The timings file lists no "Verse Sheet" node, as in 32293; the round texts do not say whether the sheets reached the debaters.

---

## A. What the fix set did in this run (fix set 5 only)

| Item | Seen in the record | Verdict |
|---|---|---|
| G1 declared chain in the closes; renumbering flag | The defender's close keeps D1 to D6 as declared. The flag fired on it, falsely (B5). No C4 numbering line: the challenger's link round has no LINK blocks, so there was no C list to compare. | Chain kept; flag false. |
| G2 cited-in rulings (K-G9) | Every seat ruled the same 14 verses. Three K-G9 rows (ChatGPT, single judge, Sol). | Fires on VOID premises (B4). |
| G3 close-round grading sentences | Six challenger sentences marked; each reports a defender concession. The sentences that contest D2 to D6 are unmarked (B6). | Marks the wrong sentences. |
| G4 reserve reason line | panel_substitution NULL. | Not exercised. |
| G5 one reference parser | Citation report reaches every round, 212 items, 207 MATCHES, 5 NOT CHECKED, 0 mismatches. | Worked where seen. |
| G9 empty-reply retry | Not in the timings. | Dormant. |
| G10 S-D / S-F | No S-D or S-F line. The synthesis CONFIRMATION applies the guards to the single judge (B7); S-D did not catch it. | Silent where it should have spoken once. |
| G11 verse sheet | Present in every Build (the sheet text is appended to the last user message). Its delivery is not recorded. Its placement is one of the two causes of the C2 cache miss (F). | Runs; placement costs cache. |
| G12 DeepSeek off the panel | Panel gemini, glm, chatgpt. | Worked. |
| G13 K-LB | Four marks (defender premises 4 and 6, on Gemini, ChatGPT and Sol): right by the tags (B4). | Right as written; a ruling is open. |

## B. Faults

### B1. Is DEFENDER PREVAILS sound? Yes. It rests on the challenger's own withdrawals and one unanswered witness, not on any broken link

Section 8 (v86): "HELD gives DEFENDER WINS only if the challenge is not SELF-SUPPORTED or a collision is graded CHALLENGER LINK BROKEN". "COLLAPSED when 2c > L (L = premises the other side listed against this side; c = those conceded or unexhibited)". "VOID ... counts for neither side."

**The challenger's count, from the record.** The defender's link round lists five premises against the challenger. Each pressed witness was searched in the challenger's link round (the only challenger round after the press; "[DR4] answers nothing"):

| Premise (defender link round) | PRESSED WITH | In the challenger's link round |
|---|---|---|
| 1, "A child can be "of" a mother and also be begotten by a father" | Matthew 1:20; Matthew 1:18; Luke 1:35 | All named (401; 1,585; 1,052). Answered. |
| 2, the sign fulfilled in Isaiah's household | Isaiah 7:14; Matthew 1:23; Isaiah 7:11 | None named. **Withdrawn**: "Premises 2 and 3 are not load-bearing for my case. I withdraw them." |
| 3, almah usage does not decide the rendering | Genesis 24:16; Genesis 24:43; Isaiah 7:14 | None named. **Withdrawn** (same sentence). |
| 4, "That sonship runs through Joseph's line." | Matthew 1:12; Jeremiah 22:30; Romans 1:3; Luke 3:31 | Matthew 1:12 (2,615), Jeremiah 22:30 (3,690), Romans 1:3 (2,546). **Luke 3:31 not named** (no "Luke 3:31", no "3:31", no "Nathan"). The challenger's close names it (3,993: "The line through Luke 3:31 ("the son of David") is therefore Joseph's line in Luke's own reckoning"), but the close answers nothing (ruling 377; section 8). The challenger quoted Luke 3:31 itself in round 1 (1,097), before the press, so that is not a later round. **UNEXHIBITED** under rulings 372 and 373. |
| 5, the title keeps Joseph as father in the begetting sense | Luke 3:23; Luke 2:49; Luke 2:48 | All named (3,203; 3,164; 3,022). Answered. |

So c = 2 (stated) + 1 (unexhibited) = 3 on L = 5: 2c = 6 > 5, COLLAPSED, unless premise 4 is VOID. Its charge reads "That the child's sonship to David runs through Joseph's begetting" against the quotation "That sonship runs through Joseph's line." Sol and ChatGPT (before its cure) ruled it VOID ("does not itself assert Joseph's begetting"); Gemini, GLM and the single judge counted it. That is a judgment on the evidence (ruling 383). With premise 4 VOID, c = 2, 4 is not over 5, and the challenge is PROP-DEPENDENT. **Either way the challenge is not SELF-SUPPORTED, so every HELD seat writes DEFENDER WINS.** The outcome does not turn on the open VOID question.

**The defender's count.** The challenger's round 2 list presses: premise 1 Matthew 1:16, 1:1; premise 2 Matthew 1:20, 1:19; premise 3 Matthew 1:24, 1:25; premise 4 Luke 2:51, 2:49; premise 5 Luke 1:27, 2:4, 1:32; premise 6 Jeremiah 22:30, Matthew 1:12. Every one is named in the defender's link round (Matthew 1:1 by regular expression; Luke 2:4 at "of the house and lineage of David"). The round 1 witnesses (Isaiah 8:3, 8:4, 7:16, 8:8, Job 25:4, Matthew 11:11, John 1:45, Luke 4:22) are named in defender round 2 ("Isaiah 8:3, 8:4, 7:16 and 8:8"); Luke 1:62, Jeremiah 31:21, John 6:42 and Acts 1:8 in the close (ruling 377). No defender premise counts on an unanswered witness. The only defender count is K-LB (B4): premises 4 and 6, whose link-round blocks carry [L1] tags only. With c = 2 on L = 6, 4 is not over 6: PROP-DEPENDENT at most, never COLLAPSED, so PARTIAL-2 cannot apply. w = 0 (the link round narrows LINK 1 and LINK 4; it withdraws nothing), k = 0: HELD-1.

| Seat | Verdict, clause | Defender | Challenger | RESULT | Follows from its own lines? |
|---|---|---|---|---|---|
| Gemini (903) | HELD, "HELD-1 -- n=6 w=0 k=0" | PROP-DEPENDENT 2 (after K-LB cure) | COLLAPSED, "L=4 c=3": premise 1 VOID; 2 and 3 CONCEDED (stated); 4 UNEXHIBITED (Luke 3:31); 5 spared | DEFENDER WINS | **Yes.** Two internal faults: L=4 where five premises were listed (2c = 6 exceeds either), and "NOT PRESSED: Luke 3:31" in its CITED-IN RULINGS beside a count that rests on Luke 3:31 being pressed and unanswered. Its stored JSON still reads "conceded_links": 2 with "counted_premises_defender": []. |
| ChatGPT (905) | HELD, HELD-1 | SELF-SUPPORTED 0 (K-LB cured by statement) | COLLAPSED 4 after cure; **before the cure PROP-DEPENDENT 2** (1, 4, 5 VOID; 2, 3 CONCEDED) | DEFENDER WINS | **The RESULT yes; the COLLAPSED no.** The cure made it count premises 1 and 4, which its own lines rule VOID ("A witness against a void charge does not make the charge countable"); its JSON still says "counted_premises_challenger": [2, 3] (B4). |
| GLM (904, not counted) | HELD, HELD-1 | PROP-DEPENDENT 2 (premises 4 and 6, counted by GLM itself) | COLLAPSED "L=5 c=3" | DEFENDER WINS | Yes. Its D3 vs C1 line is graded CHALLENGER LINK BROKEN with no unanswered witness (below). |
| Sol (alternate, not seated) | HELD, HELD-1 | SELF-SUPPORTED 0 | PROP-DEPENDENT "L=5 c=2" (1, 4, 5 VOID) | DEFENDER WINS | Yes. |
| Single judge (no vote) | HELD, HELD-1 | PROP-DEPENDENT 2 | COLLAPSED "L=5 c=3" | DEFENDER WINS | Yes. |

**Conclusion.** DEFENDER PREVAILS is sound: all five texts write DEFENDER WINS, and each would on the record whatever is ruled on the K-LB marks, the VOID charge of premise 4, or GLM's grade. It is not a finding that any challenger link broke: every seat's collision lines that stood after the cures are UNDERDETERMINED or STANDS (except GLM's two BROKEN lines). It is a finding that the challenge forfeited: two premises withdrawn and Luke 3:31 left unanswered. Had the challenger kept premises 2 and 3 and named Luke 3:31 in its link round, c would be 0, the challenge SELF-SUPPORTED, and the result UNDERDETERMINED, as in 32284 and 32293.

**Lines that do not follow, none of which changes a RESULT.**
- GLM, "D3 vs C1 (Matthew 1:25): CHALLENGER LINK BROKEN -- ... the challenger's close round concedes "I do not say the text states a union before the birth"". Section 8: "BROKEN when the other side's witnesses together contradict the link and the holding side left any of them unanswered". Matthew 1:25 (2,077) and Genesis 4:1 (491) are named in the challenger's link round. The review line "K-G4 NOT RAISED -- ... rests on the challenger's own concession of the link" treats a close-round sentence as a concession of C1; the sentence does not surrender the link (the same close holds "the child's biological father is Joseph"). By section 8 the line should be UNDERDETERMINED.
- Sol's original "D3 vs C3 ... CHALLENGER LINK BROKEN" had the same defect and was retracted.

**Solution.** None needed for the outcome. For the record: the K-G4 exemption for a "concession of the link" should require the conceding sentence to come from the link round or to surrender the link in terms (not a close-round sentence the same round contradicts).

### B2. Haiku was not a full test of the record's position

**Lengths and form, against MiMo:**

| Round | Haiku 32302 | MiMo 32293 | MiMo 32284 |
|---|---|---|---|
| Challenger round 1 | 9,895 | 10,667 | 10,952 |
| Challenger round 2 | 5,888 | 8,980 | 7,993 |
| Challenger link round | **4,798** | 11,762 | 9,207 |
| Challenger close | 5,883 | 7,397 | 9,157 |
| Challenger count / standing (row) | COLLAPSED (3 or 4) | SELF-SUPPORTED, 0 | SELF-SUPPORTED, 0 |

MiMo's link rounds in both runs carry "LINK n" blocks (position of "LINK 1" > 0); Haiku's carries none and is headed "CLOSE ROUND (challenger)". MiMo's 32293 link round answered every pressed witness against all six premises (32293 section D). Haiku's answered three premises, withdrew two, and left one witness unanswered. Haiku's link round is 41% of MiMo's 32293 length and took 35.2 s against 376.1 s.

**Did it carry the served record?** 27 labels were served (S-1578, S-519, S-10, S-8, S-9, S-32, ... S-1 to S-4); the judges report "CHALLENGER served 0 of 27", and no Haiku round names a Sight, a "#" conclusion, or a served label. Against DG-8 ("Biological Father: Joseph Named ...") it carried the core:
- the named father (Luke 2:48, John 6:42, John 1:45, Luke 4:22, Matthew 1:20 "Joseph, thou son of David");
- the Matthew 1:16 passive as non-narration ("The passive "was born" names the birth-subject, the mother. It does not deny a man's part"; close: "the passive is the non-narrating row");
- the seed rows 2 Samuel 7:12, Acts 2:30, Romans 1:3, with Genesis 4:1 as the means;
- DG-18's line ("the Holy Ghost is the origin the angel gives, not the begetter").
It left out what MiMo used in 32293: Psalms 132:11, 2 Timothy 2:8, Hebrews 7:14 and Genesis 49:10 (DG-8's seed list); Deuteronomy 22:24 and the record's L4 holding "that Joseph knew Mary his wife within the espousal (Sight 32)" (S-32 was served; no Haiku round contains "espousal" or "knew Mary"); 1 Chronicles 28:6 and DG-18's reading of Luke 1:32-35 (the defender used Luke 1:35's "therefore" in round 2 and Haiku answered only with Acts 1:8); DG-57's Isaiah 7:14 position (almah H5959 "not bethulah (H1330), which was available and unused"; the sign "bounded by Isa 7:16 and 8:3-4"). Haiku withdrew that position in its link round and restated it in its close ("That verse is a sign to Ahaz, bounded by Isaiah 7:16 and 8:4"), where it could not count.

**Verdict.** Haiku argued from the record's main line (DG-8) and did not break a guard's forbidden list, but it forfeited by thin rounds: two withdrawals of positions DG-57 supplies, one unanswered witness it had itself quoted in round 1, and a link round without the required form. The outcome measures those forfeits, not the strength of the record's position. Not a fair test. Note that the challenger's link-round prompt (C3 Build) carries only the defender's link round, the pressed-witness ledger and the defender's cited-in block, and none of the challenger's own earlier rounds (see F); that holds for MiMo too, so it does not explain the difference, but it is why Haiku could not see its own round 1 quotation of Luke 3:31.

**Guard breaches by the Oracle seat (ruling 383).** I found none of DG-8's forbidden items: no "no man" direction asserted, no "of the Holy Ghost" as paternity, no genealogy construct (DG-56), no blood category (DG-60), no single-verse demand (DG-61). This agrees with the synthesis ("no violation fires"). Shortfalls against a guard's positive instruction, which are not on its forbidden lists:
- DG-8(b): "When the union is challenged, answer it from the seed chain above; do not decline it." Haiku answered from the seed chain, but never stated the record's L4 holding of the union within the espousal, and wrote "I do not say the text states a union before the birth" (close), which the defender and GLM then read as a concession.
- DG-57: the Isaiah 7:14 position withdrawn in the link round.
**Debate-rule breaches (section 8):**
- The close presses: "**D2 (Matthew 1:18, 1:20): I dispute the reading as a denial of a man.**", "**D3 ...: I contest the narrowing.**", "**D4 (reputed sonship): I contest it.**", "**D6 (no biological father): I deny it, on the seed-line.**", "The defender must name the line through which the seed of David passes", "That shows the defender's reading has no other seed-line to offer." The close opens "No new witness is pressed in this round".
- A new press in the close: Matthew 1:21 (rightly NOT COUNTED).
- No C numbering in either the link round or the close.
**Statements of the defender's words that the record does not bear:**
- Round 2: "I withdraw nothing on the Galatians and Jeremiah lines, which the defender has conceded are corroborative only." The defender wrote "Galatians 4:4 and Jeremiah 31:22: Noted. Not conceding here. Goes to review. In the chain these two are corroborating lines."
- Link round: "The defender reads the margin as the text." The defender wrote "The KJV margin at Matthew 1:20 reads "conceived: Gr. begotten."" and, in its link round, "The KJV margin reads "Gr. begotten."" (the synthesis also rejects this charge).
- Link round: "The defender's Link 4 drops Luke 2:49". The defender dropped "any claim that Luke 2:49 alone proves the point."
- Close: "So "no union before the birth" is not a row", drawn from the defender's concession that "till" "does not state what followed" (the concession covers the period after the birth; the synthesis names this slip).
**Misquotations.** None found. Every Haiku quotation checked against kjv_verses matches with brackets opened (Luke 2:49, Isaiah 8:4, Jeremiah 31:21, 31:22, Job 25:4, Matthew 11:11, Luke 1:13, Luke 1:62, Luke 2:51, John 1:45, Luke 4:22, Acts 1:8, Luke 1:27, Luke 1:32, Luke 3:23, Luke 3:31, Matthew 1:12, 1:20, 1:21, 1:24, Jeremiah 22:30); the citation report has 0 mismatches. Layer tags are loose in places: the close tags Romans 1:3 "[L2]" though it quotes the verse, and its restated chain tags Genesis 4:1 "[L1]".
**Solution.** If Haiku keeps the seat: hold the link-round form in the C3 prompt with a format check (C3 Extract refuses a link round without "LINK n:" lines for every listed premise and sends it back once); add to the C3 prompt the challenger's own earlier rounds or at least its round 1 citations of each pressed verse; and consider whether the Oracle seat should be told that a withdrawal of a premise the record's guards hold is a guard event to be flagged.

### B3. GLM's uncured item was a true check fault, and not one that fix set 6 corrected; Sol's two uncured items were also false

**GLM, row 92, K-G4 "D6 vs C4".** GLM's line: "[L1] Luke 3:31 ... names a second line from David that [DR3] never answers, [L3] Jeremiah 22:30 read with Matthew 1:12 and Luke 1:32 ... -- GROUND: the pressed witness Luke 3:31 was left unanswered in the challenger's link round". Its cure quoted the pressing sentence of the defender's link round, premise 4, with "PRESSED WITH: ... Luke 3:31 "which was [the son] of Nathan, which was [the son] of David"". The check refused it: "unanswered-false: quotation found in CR3, but a later challenger round names the pressed witness: [DR3] Matthew 1:12 at 2615; [DR3] Jeremiah 22:30 at 3690".
The ground is true (B1: Luke 3:31 is not named in the challenger's link round). The fault is in kg4Witnesses and kg4Answered (Panel Cure Check, identical in judge_fix6/base and judge_fix6/new apart from line numbers): the witnesses are every reference that stands both in the line and in the PRESSED quotation (here Luke 3:31, Jeremiah 22:30, Matthew 1:12), and the grade is "unanswered-false" if **any** of them is named later. Section 8 reads the other way: BROKEN when "the holding side left **any** of them unanswered". A line that names several witnesses therefore fails whenever one of them was answered, even when its ground names the one that was not.
This is not one of the false checks fix set 6 corrected (H1 the K-LB layer reader and VOID premises; H2 single quotation marks; H3 renumbering): K-G4 is LIVE in H8's ENF_STATUS, and kg4Answered is unchanged, so under fix set 6 GLM would still be left uncounted.
Whether GLM's BROKEN grade is right on the evidence is a separate question: Luke 3:31's own words ("which was [the son] of Nathan, which was [the son] of David") do not state the contrary of C4, and section 8 says "A witness contradicts a link only when its own words state the contrary". GLM weighed it together with Jeremiah 22:30, Matthew 1:12 and Luke 1:32, which section 8 allows ("the other side's witnesses together"). Under ruling 383 that is the judge's call. Either way GLM's RESULT was DEFENDER WINS, so the "1 not counted" changed only the split.

**Sol, rows 107 and 109.** Sol was not seated on two uncured items.
- Row 107, K-C "D3 vs C3": "the restated line names no chain footing: it exhibits 0 layer kinds". Sol had retracted the line (row 106, CURED) and restated it UNDERDETERMINED; its K-C STATEMENT reads "the defender exhibits [L1] Matthew 1:25 ... and [L3] Genesis 4:1; the challenger in [DR3] exhibits [L1] Matthew 1:18 ... with [L2] synerchomai (come together, unite) and the cross-reference Genesis 4:1". The check read the RESTATED line (no tags) instead of the STATEMENT, and did not treat the retraction as curing the K-C item on the same line. False.
- Row 109, K-G9: "ruled PRESSED and UNANSWERED (Luke 3:31, Luke 1:13, Matthew 1:21), but no CORRECTED COUNT". Sol's statement re-ruled: "their associated charges are VOID ... counting these witnesses under those charges would violate that express limitation". Fix set 5's G2 accepts "CORRECTED COUNT and STANDING ... or a re-ruling". The same VOID ground cured Sol's K-G6 item (row 108, "statement quotes the transcript (DR2)"). False.
Sol also wrote DEFENDER WINS; seated, the panel would have been 3-0.

**Solution.** (1) K-G4: take the witness from the line's GROUND (or from the PRESSED quotation's own reference when it names one), and mark unanswered-false only when **every** witness the ground calls unanswered was named later. (2) K-C: when the same line is RETRACTED and cured under K-G4, close the K-C item on that line; otherwise read the STATEMENT, not the RESTATED line, for layer kinds. (3) K-G9: accept a VOID re-ruling that names the premise and quotes the charge against the quotation, as K-G6 already does. (4) panel_split and judged_by: list the counted seats only (judged_by now lists glm).

### B4. VOID premises, K-G6 and K-G9: the count of ChatGPT was changed by marks against premises it had ruled VOID; K-LB marks are right by the tags

- **ChatGPT, rows 97 and 98.** ChatGPT ruled challenger premises 1, 4 and 5 VOID and counted 2 (PROP-DEPENDENT). K-G6 marked premise 4 ("NOT NAMED: Matthew 1:1, Luke 3:31"); K-G9 marked its PRESSED and UNANSWERED rulings (Luke 3:31, Luke 1:13, Matthew 1:21, Matthew 1:1). ChatGPT's cure counted premises 1 and 4 ("The four previously omitted unanswered witnesses are included in the corrected count under premises 1 and 4"), making COLLAPSED 4. Section 8 says a VOID premise "counts for neither side", and ChatGPT's own line says so. The marks are right in form and false in substance; fix set 6 corrected this for K-LB only (H1, lbVoid), not for K-G6 or K-G9. The RESULT did not change.
- **Matthew 1:1 is not a pressed witness.** The defender's premise 4 names it only in its description ("This props the challenger's reading of Matthew 1:1"); its PRESSED WITH list is Matthew 1:12, Jeremiah 22:30, Romans 1:3, Luke 3:31. K-G6's "5 verse(s) carried" counts it; GLM and ChatGPT ruled it PRESSED.
- **Luke 1:13 and Matthew 1:21** come from the defender's round 2 ("The challenger's own citation of Luke 1:13 sets the contrast"), against no listed premise. Whether such a verse is a pressed witness is the open point of 32293 B1, still unruled. ChatGPT and Sol ruled them PRESSED; Gemini, GLM and the single judge NOT PRESSED, none with a reason (fix set 6's H5 would require one).
- **K-LB, rows 89, 90, 99, 100, 110, 111 (defender premises 4 and 6).** The defender's link-round blocks "LINK 4: NARROWED TO ..." and "LINK 6 [premise 6]: SUPPORTED." carry only [L1] tags; LINK 4's load rests on "[L1] Luke 3:23 ... That is where the load rests", and LINK 6 joins Matthew 1:12, 1:16, Jeremiah 22:30 and Luke 1:32 into a chain without an [L3] tag. Fix set 6's reader would still mark them. The marks are right as the rule is written. Gemini counted both (PROP-DEPENDENT 2), GLM and the single judge counted them on their own, ChatGPT and Sol cured by statement ("an explicit L3 label is not required to make that exhibited cross-reference exist"), and the cure check accepted that. Your ruling is needed on whether an untagged cross-reference the block itself joins to its [L1] verse is an exhibited [L3]. It changes defense standings only.
**Solution.** Skip K-G6 and K-G9 for premises the seat's count line rules VOID (as lbVoid does for K-LB); drop description-only references (outside PRESSED WITH) from the K-G6 ledger; rule on the untagged cross-reference.

### B5. The renumbering check fired on the defender's close, falsely

review_notes: "CLOSE-ROUND NUMBERING CHECK (D4) -- ... D1 ("D1 to D6 are as declared. I keep D1, D2 and D6 and narrow D3, D4 and D") matches declared D5 better than declared D1; D2 ("- D2 does not rest on that verb. It rests on the context of Luke 1:34-") matches declared D6 better than declared D2; D5 ("- D5: narrowed to Isaiah 7:14 as applied in Matthew 1:23.") matches declared D6 better than declared D5". The first is the close's statement that it keeps the declared numbers; the second is a sentence under "ANSWER: Acts 1:8 -- D2 --" about D2's footing (Luke 1:34-35, which declared D2 names as Luke 1:35); the third names Isaiah 7:14, the declared D5's own verse. The synthesis repeated the flag: "(System note: the defender's close-round self-numbering does not track the declared D-numbers ...)". Fix set 6's H3 (no flag when the label shares a verse or a distinctive word with its own declared link) would clear D2 and D5; whether it clears the "D1 to D6 are as declared" line depends on how H3 reads a sentence that names several labels, which the record cannot show.
A real inconsistency the check did not report: the close's opening says "narrow D3, D4 and D5", its C5 block says "D4: KEPT", and its final statement says "**D4:** kept as a reputed sonship."
**Solution.** In H3, skip a line that names more than one label ("D1 to D6", "D1, D2 and D6"); add a status-consistency line when one close gives one link two statuses.

### B6. The close-round grading check marked six sentences that press nothing and missed the ones that do

Marked (AUDIT v26, C4): "Concessions I accept as stated. The defender concedes that Matthew 1:16's change to the passive is not by itself a denial ...", "The defender concedes that Acts 1:8 is not a begetting row.", "... Matthew 1:25 ... does not state what followed.", "... the KJV does not state Mary is of David's house." (twice), "L1 Matthew 1:25 says knew her not till ..., which the defender grants does not state what followed." Each reports a concession the defender made in its close. Unmarked: the D2, D3, D4, D6 headings and the sentences quoted in B2 ("I dispute ...", "I contest it", "I deny it, on the seed-line", "The defender must name the line ...", "That shows the defender's reading has no other seed-line to offer"). The defender's close drew no grading line; its C1 to C6 blocks answer the challenger's link-round points, which section 8 allows ("[CR4] answers witnesses still pressed against the defender").
Fix set 6's H4 marks every sentence under an other-side label, which would catch the D2 to D6 blocks; it exempts a sentence whose words stand in order in one sentence of the other side, which the paraphrased concession reports do not, so they would stay marked.
**Solution.** In H4, treat "The defender concedes that ..." (and "which the defender grants") as a report when the defender's later round holds a CONCEDED or "I grant" sentence on the same verse, even without the words in order.

### B7. The synthesis: one guard charge against a judge, and claims against the record

- CONFIRMATION 1: the single judge's RESULT "grants the one direction the record forbids asserting as fact (no man; the Holy Ghost as begetter)". This grades a judge by the drift guards; ruling 383 says only the Debate Oracle seat is bound and "the judges grade the text (evidence present to them) alone". S-D (G10) did not mark it.
- CONFIRMATION 2(b): "Isaiah 7:11 and Luke 3:31 are counted UNANSWERED after the challenger withdrew the *almah* premise in [DR4]: substance answered, form unanswered". The withdrawal is in the link round, not the close, and no challenger round before the close names Luke 3:31 (B1).
- Section 2A: "The DEFENDER's declared chain (DR1 links 1-6)" and "LINK 4 ... DR3: "NARROWED TO: Luke 2:48-49 ..."": both are the defender's rounds (CR1, CR3).
- Section 2B lists "4. The seed chain requires seed out of a man's body" and "5. The father is named and names the child (Luke 2:48; Luke 1:13; Luke 1:62)" as the challenger's premises, both "CITED-WITH-FOOTING ... not conceded". The defender's premises 4 and 5 are "sonship ... runs through Joseph's begetting" and the begetting sense of the title; the table omits the unanswered Luke 3:31 that every counting seat used.
- The system note repeats the false renumbering flag (B5).
- S-A marked H5 and H9 ("a "both" item does not quote both sides' own words"): right in form.
The synthesis rightly charges guards to the challenger seat only in section 3, and its "till" slip and "reads the margin as the text" points agree with the record.
**Solution.** Extend S-D to a guard term ("forbids", "direction", "guard", "DG-") applied to the single judge or a panel seat; check round labels in the synthesis against the side (a "DR" label beside a defender quotation).

### B8. The single judge: bracket form, and its parsers

- K-G9 (row 104): "no valid ruling ... Luke 3:31, Isaiah 7:11". The single judge wrote "PRESSED: Luke 3:31 -- [[CR3]] -- ..." both in its judgment and in its cure, while its cure statement says "my brackets were doubled ... the two verses are ruled in the fixed form above". Right in form; the substance (both pressed, unanswered and counted) is right.
- K-C D6 vs C4 (row 102) UNCURED: the restated GROUND "the challenger's chain read together names no begetting of this child" keeps the absence-of-a-stating-verse ground. Right.
- review_notes "CHALLENGER CONCEDED ITEMIZATION COUNTS 2 BUT JUDGE STATED 3" and "DEFENDER CONCEDED 2 STATED BUT NO TAGGED ITEM PARSED": the judge itemised "[CR3] premise 2 ...; [CR3] premise 3 ...; [CR3] premise 4: UNEXHIBITED" and "[DR2] premise 4 (...): UNEXHIBITED; [DR2] premise 6 (...): UNEXHIBITED". The parser does not read a round label before "premise n". False marks.
- Fourteen "COLLISION POINTS ENTRY NOT READ" lines: the collision reader still runs past "CITED-IN RULINGS" (32293 B8, not in fix set 6).
**Solution.** Accept "[[CRn]]" in the K-G9 reader; read "[CRn] premise n:" and "[DRn] premise n" in cntItems; end the collision section at "CITED-IN RULINGS".

### B9. The citation report

212 items, 207 MATCHES, 0 mismatches, 5 NOT CHECKED: defender round 1 John 6:42 (item 15), challenger round 2 Luke 1:27 (94), defender round 2 Matthew 1:20 (65) and Luke 1:13 (70), defender link round Matthew 1:16 (132). No item carries a reason (the stored items hold only ref, link, side, round, status, load_bearing; fix set 6's H6 adds reasons). For the first time in this series the report reaches the challenger's close (24 items, all MATCHES); the shorter rounds kept it under the cap that stopped 32284 (297), 32293 (295) and 32266 (295) inside the defender's close. No false attribution like 32293's Luke 1:34 item was found. The single judge and the panel report "207 of 212 ... 5 too short to check", which agrees with the counts.
**Solution.** Record the NOT CHECKED reason (H6).

## C. Each seat's grades, with quotes

- **Gemini (903).** Collisions by the declared numbers: "D1 vs C1", "D2 vs C2", "D3 vs C3", "D4 vs C5", "D5: STANDS", "D6 vs C4", all UNDERDETERMINED after it retracted two BROKEN grades. The first, "D2 vs C2 ... GROUND: The text explicitly assigns the conception to the Holy Ghost before union, answering Acts 1:8 in [CR4]", named no unanswered witness and was rightly retracted. The second, "D6 vs C4 ... challenger left Luke 3:31 unanswered in [DR3]", had a true ground but did not quote the pressing sentence; Gemini retracted it on the reason "[DR3] point 6 answered Jeremiah 22:30", which concerns a different witness. Had it quoted the pressing sentence it would have met the K-G4 fault in B3. It accepted both K-LB marks.
- **ChatGPT (905).** Collision lines all UNDERDETERMINED or STANDS. "D1 vs C1 ... Matthew 1:1 and Luke 3:31 are answered in [CR3] and [CR2]" treats them as the defender's witnesses (true for the defender); its K-G6 statement then counts premise 4 on Luke 3:31 being not named by the challenger. B4.
- **GLM (904).** The most detailed text. B1 (D3 vs C1) and B3 (D6 vs C4). Its CITED-IN RULINGS rule Luke 3:31, Isaiah 7:11 and Matthew 1:1 PRESSED and UNANSWERED; Matthew 1:1 is not under PRESSED WITH (B4). Its defender chain mark "STRAINED -- D4 ... the [L2] enomizeto (was supposed) arriving only in [CR4]": the defender's round 1 and round 2 tag enomizeto [L2], and its link round does not, so "only in [CR4]" holds for the link-round block only.
- **Sol (alternate).** VOID rulings on challenger premises 1, 4 and 5 with reasons; a "FLOATING-L4 CHECK" holding every block exhibited. B3.
- **Single judge.** B8. Its keystone line "no challenger witness states that Joseph begat the child" is the stating-verse form K-C exists for; it was not marked (the K-C marks went to D4 vs C5, D6 vs C4 and D6 vs C6).

## D. Every enforcer mark, right or false

| Row | Seat | Rule, item | Status | Right or false |
|---|---|---|---|---|
| 87 | Gemini | K-G4 D2 vs C2 | CURED, retracted | Right: BROKEN with every witness answered in the link round. |
| 88 | Gemini | K-G4 D6 vs C4 | CURED, retracted | Right in form (no pressing sentence quoted); the retracted ground (Luke 3:31 unanswered) was true. |
| 89, 90 | Gemini | K-LB defender premises 4, 6 | CURED, counted | Right by the tags; ruling open (B4). |
| 91 | GLM | K-G4 D2 vs C1 | CURED, retracted | Right. |
| 92 | GLM | K-G4 D6 vs C4 | **UNCURED** | **False** (B3); not corrected by fix set 6. |
| 93 | GLM | K-G4 D6 vs C6 | CURED, retracted | Right: Jeremiah 22:30, Matthew 1:12 and Luke 1:32 (3,840) are named in the link round. |
| 94, 95 | GLM | K-C REASONING; challenger chain mark | CURED | Right ("rows that name no begetter"). |
| 96 | ChatGPT | K-G4 D6 vs C4 | CURED, retracted | Right: its ground "The pressed throne-bar witness remains unanswered" was false (Jeremiah 22:30 at 3,690). |
| 97 | ChatGPT | K-G6 challenger premise 4 | CURED, counted | False in substance: a premise the seat ruled VOID; Matthew 1:1 is not a pressed witness (B4). |
| 98 | ChatGPT | K-G9 cited-in | CURED, counted | Right in form, false in substance (VOID premises; Matthew 1:1). |
| 99, 100 | ChatGPT | K-LB defender premises 4, 6 | CURED by statement | Right by the tags. |
| 101 | Single | K-C D4 vs C5 | CURED | Right. |
| 102 | Single | K-C D6 vs C4 | UNCURED | Right. |
| 103 | Single | K-C D6 vs C6 | CURED | Right. |
| 104 | Single | K-G9 cited-in | UNCURED | Right in form ("[[CR3]]"); the substance is right. |
| 105 | Sol | alternate reply | record | (not a mark) |
| 106 | Sol | K-G4 D3 vs C3 | CURED, retracted | Right. |
| 107 | Sol | K-C D3 vs C3 | **UNCURED** | **False** (B3). |
| 108 | Sol | K-G6 challenger premise 4 | CURED by statement | Mark false in substance (VOID); the cure was right. |
| 109 | Sol | K-G9 cited-in | **UNCURED** | **False** (B3). |
| 110, 111 | Sol | K-LB defender premises 4, 6 | CURED by statement | Right by the tags. |

Review-note marks: the D4 numbering check false (B5); the C4 grading check false on all six sentences and silent on the real presses (B6); the C4 press check (Matthew 1:21) right; S-A on H5 and H9 right in form; the single judge's K-S2 lines right; its itemisation lines false (B8); "PANEL STANDINGS -- no majority" right. The stored challenger_chain_mark FOOTED does not follow from the counted seats (Gemini STRAINED, ChatGPT FOOTED); the record does not show how it was set (the fix set 5 SQL change G10 was not applied).

## E. The two-layer measure (rulings 385 and 386)

Applied to every claim, the measure bears here in three places. (1) The defender's link-round LINK 4 and LINK 6 [premise 6] blocks carry [L1] tags only (B4). (2) The challenger's link round carries [L1], [L2] (synerchomai, enomizeto, ek pneumatos hagiou, eperchomai) and [L3] (Genesis 4:1) tags in points 1 to 3 and 5, but its point 4 (the seed chain) and point 6 (the throne bar) carry [L1] only; no K-LB mark fired on the challenger, because its link round has no LINK blocks for K-LB to read. GLM and Gemini named this in their chain marks ("its [DR3] block exhibited [L1] quotations only"). (3) The challenger's close holds its keystone "at [L4], footed on 1 through 5", with [L1], [L2] and [L3] steps named. Your ruling is needed on whether K-LB should read a numbered link round without LINK labels; under the present code a link round without the form escapes the check.

## F. Cache diagnostics

**The eight lines, read.**

| Call | Reason | Read | Written | Uncached | What it shows |
|---|---|---|---|---|---|
| D1 | first call of the seat | 2,145 | 0 | 4 | The whole 2,149-token request was already cached on its first call. The record does not show which earlier call wrote it; only an identical defender request within the 1-hour TTL could (an earlier fire of this topic, such as one ended by MiMo's refusals, is the likely source, but the record read here does not hold it). |
| C1 | first call of the seat | 0 | 79,020 | 4 | Haiku's first call writes system (63,162) and message (15,858). |
| D2 | no divergence | 2,145 | 9,605 | 4 | Append-only: D2 reuses D1's first user message exactly ($('D1 Build').opening_user) and adds the new turns. Works as intended. |
| C2 | messages_changed, missed 11,974 | 63,162 | 14,425 | 4 | The system is read; the messages are rewritten. |
| D3 | system_changed, missed 5,950 | 1,226 | 6,950 | 4 | Only the first system block is read. |
| C3 | messages_changed, missed 5,843 | 63,162 | 7,281 | 4 | System read, messages new. |
| D4 | messages_changed, missed 5,677 | 1,226 | 6,590 | 4 | System (as D3) read, messages new. |
| C4 | messages_changed, missed 5,843 | 63,162 | 8,484 | 4 | System read, messages new. |

**Why, from the Build code (D2, C2, D3, C3 equal to 6ff18a54; D4 and C4 read in the 6ff18a54 copy).** The direct body is `{model, max_tokens, system: __sysB(sys), messages: __mk(msgs), diagnostics: {previous_message_id}}`; __sysB splits the system at "\n\n=== DEFENSE DISCIPLINE" into two blocks, each with `cache_control {type:'ephemeral', ttl:'1h'}`; __mk puts the same marker on the last message.
1. **C2, messages_changed: the verse sheet moves.** Every Build appends its round's sheet to the last user message (`msgs[k].content + '\n\n' + __SHT`). In C1 the last user message is message 0, so C1's message 0 carries C1's sheet. C2 Build rebuilds message 0 from scratch ("DEBATE TOPIC: ... The defender opened: ... Challenge this. Verse-level precision.") without that sheet and puts C2's sheet on message 2. The prefix diverges inside message 0. The defender side does not have this fault because D1 has no sheet (round 1 sheets go to the Oracle seat only) and D2 reuses D1's stored opening_user, which was captured after the append.
2. **D3, system_changed: the DEFENSE DISCIPLINE block is dropped.** D1 and D2 send `sys = I.dsys + DD`, two system blocks; D3 (and D4) send `sys = I.dsys`, one block. The first block matches (read 1,226); everything after it is rewritten.
3. **C3, C4, D4 (and D3), messages_changed: rounds 3 and 4 start a new conversation.** D3, C3, D4 and C4 Build each send one user message ("SUBJECT: ... You opened as the DEFENDER ..." / "You pressed the challenge. The defender's LINK ROUND reply follows ...") holding the opponent's latest round, the ledgers and the round's instructions; none carries the seat's earlier turns. Only the system can match, so only the system is read (63,162 for Haiku, 1,226 for Sonnet).

**What would make the history append-only.**
- Keep, per seat, the exact message list sent in the previous round (with any sheet text as it was sent) and build each later round as that list, then the model's reply as an assistant turn (the Extract's raw text, as D2 already does with D1 Extract raw), then one new user turn holding the opponent's new round, the ledgers, the round's instructions and the new sheet. Never rebuild an earlier message.
- C1 Build: store its message 0 after the sheet append (as D1 Build stores opening_user), and have C2 Build reuse it.
- D3 and D4 Build: send the same system as D1 and D2 (both blocks, byte-identical). The DEFENSE DISCIPLINE text forbids in-round concession ("DD-2. NO IN-ROUND CONCESSION"), which conflicts with the link round's exhibit-or-concede and the close's CONCEDED lines; the record does not say why D3 drops it, but that conflict is the evident reason. If it is kept in the system, the D3 and D4 user turns must state that the link round's and close's forms govern those rounds (or a mid-conversation system message, which Claude Sonnet 5.5 and Claude Haiku 5.5 accept without breaking the cached prefix, can carry that instruction). The alternative is to move DD out of the system into D1's first user turn, which also keeps it in the history.
- The marker placement (__mk on the last message, two system markers) can stay: each round appends two messages, well inside the 20-block lookback.
- Keep the sheet only on the newest user turn, as now.
**Estimate.** The five misses report 35,287 tokens (C2 11,974; D3 5,950; C3 5,843; D4 5,677; C4 5,843) that the previous request had cached and this one did not reuse. Append-only, those tokens are read instead of written: with 1-hour writes at 2x and reads at about 0.1x base input, about 35,000 tokens per run move from 2x to 0.1x, roughly 67,000 base-input-token equivalents saved per run on the two debater seats. Rounds 3 and 4 would also carry each seat's full history (C2 alone already reaches 77,591 input tokens); those added tokens would be cache reads, since they are the earlier rounds' prompts, so the input grows but at the read price. The run's debater calls wrote 132,355 of the 213,283 written tokens; the rest belongs to the judge calls, which this change does not touch.
**Note.** Fix set 6's H7 copies each round Extract's cache_diag line into review_notes from Failure Salvage; in this run the eight lines are already in review_notes.

## G. Comparison with run 32293

| | 32293 | 32302 |
|---|---|---|
| Challenger | MiMo (xiaomi/mimo-v2.6-pro), via OpenRouter | Claude Haiku 5.5, direct |
| Outcome; split | UNDERDETERMINED; 3-0 HELD | DEFENDER PREVAILS; 2-0 HELD (GLM not counted) |
| What decided it | Two seats wrote UNDERDETERMINED (challenge SELF-SUPPORTED); one DEFENDER WINS on the cited-in open point | Every seat wrote DEFENDER WINS: the challenger withdrew two premises and left Luke 3:31 unanswered |
| Challenger rounds (characters) | 10,667; 8,980; 11,762; 7,397 | 9,895; 5,888; 4,798; 5,883 |
| Challenger's four rounds (seconds) | 1,007.6 | 150.5 |
| Challenger link-round form | LINK 1 to LINK 6 blocks | No LINK blocks; headed "CLOSE ROUND" |
| Seat not counted | GLM, removed on false K-LB uncured items | GLM, not counted on a false K-G4 uncured item; Sol tried and not seated on two false items |
| K-LB marks | 10, all false | 4 (defender premises 4 and 6), right by the tags |
| Renumbering flag | Fired falsely on both closes | Fired falsely on the defender's close; no challenger C list to check |
| Close grading check | Under-marked | Marked six concession reports; missed the presses |
| Citation report | 295 items, stopped in the defender's close; one false attribution | 212 items, every round reached; 0 mismatches; 5 NOT CHECKED without reasons |
| Cache | 133,982 written, 351,479 read (48.5% of input) | 213,283 written, 374,094 read (53.0% of input); per-call diagnostics now in review_notes |
| Run time | about 50.3 minutes | about 38.2 minutes |

The change of challenger moved the outcome. On the evidence the defender's chain fared as in 32293: no seat broke a defender link and every collision line ended UNDERDETERMINED or STANDS. The difference is the challenger's count, which went from 0 to 3 by forfeit.

## H. Order proposed

1. B3: fix the K-G4 witness test (any answered witness is not "unanswered-false"); close a K-C item on a retracted line; accept a VOID re-ruling for K-G9. Each wrongly kept a seat off the count in this run.
2. B4: skip K-G6 and K-G9 for VOID premises; drop description-only verses from the K-G6 ledger; your ruling on the untagged cross-reference under K-LB.
3. F: make each seat's history append-only (C1 opening message stored; D3 and D4 system equal to D1 and D2, with the DD conflict resolved; rounds 3 and 4 continuing the history).
4. B2: decide whether Haiku stays the Oracle seat; if so, enforce the link-round form for the challenger and give C3 the challenger's own earlier citations.
5. B5, B6, B7, B8: the renumbering line that names several labels; the concession-report exemption in H4; S-D on judges; the single judge's bracket and itemisation readers and the collision reader's end at CITED-IN RULINGS.
6. B1: the K-G4 exemption for a "concession of the link" drawn from a close.

## Not read, or not in the record

- The prompts actually sent to the debaters (only the Build code is available), so whether each verse sheet and ledger reached each round; the Format Markdown output.
- The full_reply of the Gemini, GLM and ChatGPT cure rows and every prompt_sent, read only through the judgments' stored statement lines.
- Which earlier call wrote the cache entry D1 read (2,145 tokens on the seat's first call), and the earlier MiMo attempts of this topic: no row was read for them.
- The exact definition of cache_missed_input_tokens; the estimate in F uses the figure as the tokens the previous request had cached and this one did not reuse.
- How challenger_chain_mark came to be FOOTED with the counted seats split.
- The run's status (success), the CST times and the flow version are as given in the brief; the row holds none of them.
