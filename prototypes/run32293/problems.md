# Run ODV1-32293: problems and solutions

Run 32293, flow version 57222efa (as given in the brief; the row has no column that records the flow version; judge_fix5/write_result.txt names versionId 57222efa-c062-4bd4-8994-abefcdc799c6), the first run on the fifth judge fix set (judge_fix5: G1 to G13). Fired 15:40 CST 2026-11-02 (the first timed node, the defender's round 1 call, starts 21:40:07Z in timings/timings_32293.json), stopped about 16:30 CST (Record Alternates 22:30:25Z; the judgment rows are written 22:30:26Z to 22:30:27Z; the enforcer rows carry created_at 22:30:28Z), status success (as given; the row has no status column). From the first timed node to Record Alternates the run took about 50.3 minutes.
Row fc281e2c (debate_results), run token ODV1-32293-mh6wvhd1. Topic "Did Christ have a biological father?"; defender Claude (anthropic/claude-sonnet-5.5, plain profile, 0 record labels served), challenger MiMo (xiaomi/mimo-v2.6-pro, oracle profile, the Debate Oracle seat, 27 record labels served).
Result fields: outcome UNDERDETERMINED; panel_verdict and framework_verdict HELD; panel_split "3-0"; judged_by and panel_expected chatgpt, gemini, sol (the panel that was seated was gemini, glm, chatgpt; panel_expected was rewritten to the seats counted); data_class "contested" (32284: "study"; the record does not say why); quarantine_reason NULL; defense standing SELF-SUPPORTED, conceded_links 0; challenge standing SELF-SUPPORTED, challenger conceded 0; both chain marks FOOTED; underdetermined_seats chatgpt:COLLISION, chatgpt:RESULT, gemini:COLLISION, gemini:RESULT, sol:COLLISION; panel_substitution NULL (no reserve was used); drv_removed one entry (GLM, drv_uncured 2, replaced by Sol, openai/gpt-6.1-sol, at 22:30:25.193Z) with one matching row in odv1_drv_removals; citation_block NULL; out_of_round_concessions 13 (the single judge's list).
Counted seats: Gemini (judgment 900, google/gemini-3.8-flash) HELD, UNDERDETERMINED, 0 uncured; Sol (901, openai/gpt-6.1-sol, the alternate in GLM's slot) HELD, DEFENDER WINS, 0 uncured; ChatGPT (902, openai/gpt-6.1-terra) HELD, UNDERDETERMINED, 0 uncured. Removed: GLM (z-ai/glm-5.3) HELD, UNDERDETERMINED after its cure, 2 uncured. Single judge (no vote): deepseek-flash, PARTIAL, UNDERDETERMINED.
Tokens: input 724,647, output 385,701; cache 133,982 written, 351,479 read. Synthesis usage: "prompt=52954 completion=24866 reasoning=18485 finish=stop max_tokens=64000".

**Nothing here is applied.** Nothing was written to the database, n8n or git. The database was read with SELECT statements only. Each fix waits for your word.

**What was read whole, with lengths in characters:** the defender's round 1 (claude_r1, 7,966); the challenger's round 1 (engine_r1, 10,667); the defender's round 2 (claude_r2, 10,858); the challenger's round 2 (engine_r2, 8,980); the defender's link round (engine_r3, 9,704); the challenger's link round (challenger_r3, 11,762); the defender's close (defender_r4, 15,361); the challenger's close (challenger_r4, 7,397); the three counted judgments with their audit, cure and recompute lines (debate_judgments 900 Gemini 7,561; 901 Sol 14,707; 902 ChatGPT 7,254); the removed GLM judgment as stored in drv_removed (cured text with its audit lines); the single judge's text (independent_verdict_raw, 15,036); the synthesis (24,960, in two parts); review_notes (4,459); the citation report (citation_check, 34,607 as text; 295 items, each holding only ref, link, side, round, status and load_bearing, read as one list per round with every item that is not MATCHES read in full); the panel fields, panel_substitution, drv_removed and odv1_drv_removals; engine_manual version 85, section 8 (the UNANSWERED WITNESS, CLOSE ROUNDS, VERDICT, RESULT and STANDINGS paragraphs) and the TIE paragraph of section 10; md_notes_rulings 370 to 387; the judge_fix5 README and the K-LB and cure-check code it names (lib/blocks.js; new/Cure Check.js, new/Panel Payloads.js, new/Extract Independent Verdict.js, read only).
**The enforcer log** (debate_enforcer_log, 19 rows, ids 68 to 86), every column of every row. prompt_sent holds four texts (12,107 Gemini and ChatGPT, one md5; 15,874 GLM; 13,886 single judge; 12,709 Sol). All four share one rule block (characters 1 to 8,361, md5 9f373c71...) and one ANSWER FORM (md5 75cb4cf1...); the rule block and the answer form were read whole in row 68, and the FLAGGED ITEMS section of each of the other three was read whole. full_reply holds six texts, each read whole: Gemini 1,752 (rows 68, 69); GLM 9,543 (rows 70 to 76); ChatGPT 654 (rows 77, 78); single judge 5,597 (rows 79 to 82); Sol's alternate judgment 11,115 (row 83); Sol's cure 2,803 (rows 84 to 86).
Each pressed witness was checked by reference with SQL position() (and a regular expression where one reference is the prefix of another, as Luke 2:4 and Luke 2:48), and each quotation named below was checked against kjv_verses (margin notes set aside, italic brackets opened, punctuation and case set aside). Timings come from timings/timings_32293.json and the 32284 table in run32284/problems.md.

**Round labels.** "CR" marks the defender's rounds and "DR" the challenger's. This file writes "defender round n" and "challenger round n", with round 4 the close. Quotations from the record that hold a long or short dash show it as [dash].
**Numbering in the record.**
- The declared chain (defender round 1): D1 Matthew 1:16 (the verb and pronoun change); D2 the conception "of the Holy Ghost" (Matthew 1:18, 1:20; Luke 1:35; Galatians 4:4); D3 Mary's virginity and Joseph's non-knowledge (Luke 1:27, 1:34; Matthew 1:25); D4 Isaiah 7:14 with Matthew 1:23; D5 Joseph called father by supposition (Luke 3:23; Luke 2:48-49; John 6:42); D6 the answer (keystone).
- The challenger's premise list (round 2) files LINK 1 to LINK 6 against D1 to D6 in order. The defender's link round lists six premises against the challenger, numbered 1 to 6, and the challenger's link round answers them as LINK 1 to LINK 6 (C1 to C6).
- **Both closes keep the declared numbering.** The defender's close heads "Status of the declared chain" and gives D1 KEPT, D2 NARROWED (the conception), D3 KEPT, D4 NARROWED (Matthew 1:22-23 and Isaiah 7:14), D5 NARROWED (Luke 3:23, enomizeto), D6 NARROWED (the answer). The challenger's close heads "My links, under their numbers": C1 to C6 as its link round filed them, and it names the defender's links by the declared numbers (its "D4" is the sign, its "D5" is enomizeto). The 32284 renumbering ("I take D1[dash]D6 in the order the challenger's blocks answer them") did not recur.

## Timings (timings_32293.json, seconds; Z times)

| Step | Start (Z) | Seconds | 32284 |
|---|---|---|---|
| Defender round 1 | 21:40:07 | 48.5 | 39.5 |
| Challenger round 1 | 21:40:58 | 173.8 | 183.6 |
| Defender round 2 | 21:43:55 | 99.6 | 106.2 |
| Challenger round 2 | 21:45:37 | 292.1 | 192.3 |
| Defender link round | 21:50:32 | 80.0 | 118.9 |
| Challenger link round | 21:51:55 | **376.1** | 243.6 |
| Defender close | 21:58:13 | 117.7 | 116.4 |
| Challenger close | 22:00:14 | 165.6 | 194.3 |
| Synthesis (DeepSeek) | 22:03:01 | 135.0 | 131.4 |
| Single judge | 22:05:20 | 245.1 | 240.2 |
| Single judge cure | 22:09:28 | 34.8 | 26.6 |
| Diagnostic | 22:10:05 | 16.4 | 7.7 |
| Panel judge 1, Gemini | 22:10:25 | 127.8 | 142.4 (judge 2) |
| Panel judge 2, GLM | 22:12:32 | **520.4** | 25.3 (judge 3) |
| Panel judge 3, ChatGPT | 22:21:13 | 92.3 | 132.3 (as reserve) |
| Panel cure 1, Gemini | 22:22:48 | 29.8 | 32.2 |
| Panel cure 2, GLM | 22:23:19 | **292.8** | none |
| Panel cure 3, ChatGPT | 22:28:15 | 7.1 | none |
| Alternate, Sol for GLM | 22:28:23 | 101.4 | none |
| Alternate cure, Sol | 22:30:06 | 16.2 | none |
| Record Alternates | 22:30:25 | 0.6 | 0.4 |

- The panel order is gemini, glm, chatgpt (Init Seats: ORDER without deepseek and qwen, without the seated mimo); the cure reply lengths agree (Gemini 1,752 in 29.8 s; GLM 9,543 in 292.8 s; ChatGPT 654 in 7.1 s).
- The challenger's four rounds took 1,007.6 s; the defender's four took 345.8 s. GLM's judgment and cure took 813.2 s together (its 32284 judgment took 25.3 s), and the cure that took 292.8 s is the one whose two K-LB items were then marked UNCURED (B2).
- The timings file lists 44 nodes and none of the eight "Verse Sheet" nodes, but it also lists no Build node, so it does not show whether the sheets ran (B4).

---

## A. What the change did

| Item | Seen in the record | Verdict |
|---|---|---|
| G1 declared chain in the closes; renumbering flag | Both closes keep the declared numbers (above). The flag **fired on both closes, falsely** (B3). | Chain: worked. Flag: false positives. |
| G2 cited-in rulings (K-G9) | Gemini, Sol, ChatGPT, GLM and the single judge each wrote a CITED-IN RULINGS section ruling on the same six verses (Hebrews 10:5, Luke 1:27, Matthew 1:21, Acts 13:33, Romans 1:4, Matthew 1:22). Sol ruled two PRESSED and UNANSWERED and counted both. No K-G9 row. | Complied; but the ruling it collects is the open point that decides the outcome (B1). |
| G3 close-round press sentences | Two defender sentences and one challenger sentence marked DISREGARDED. | Under-marks, and marks one sentence that presses nothing (B5). |
| G4 reserve reason line | panel_substitution NULL; "Reserve Needed?" 0.0 s. | Not exercised. |
| G5 one reference parser | "Matthew 1:11[dash]12" and "Jeremiah 18:7-8" checked as one item each; "Psalm 2:7" (challenger round 1) and "Psalms 2:7" (defender close) read as one verse; "Luke 1:62-63" (challenger round 1) kept Luke 1:62 and 1:63 out of the new-verse list. The one attribution fault (Luke 1:32 under Luke 1:34) is a reading-order fault, not a parser fault (B6). | Worked where seen. |
| G6 escapes removed | No citation item fails on brackets, parentheses or margins (1 Chronicles 28:6 "[to be]", Isaiah 7:14 and Matthew 1:20 margins MATCHES). | No fault seen; not directly testable from the row. |
| G8 outcome-first header | The Format Markdown output is not stored in any table read. | Could not be checked. |
| G9 empty-reply retry | No "Empty?" or retry node in the timings; DeepSeek sits on no panel seat. | Dormant, as the README says. |
| G10 synthesis checks S-D and S-F | No S-D or S-F line in review_notes. The synthesis charges guards against the challenger seat only and names the challenger's new close press, so neither check had anything to catch. | Silent, rightly. Other synthesis faults in B7. |
| G11 verse sheet | Not visible in any round text; the prompts are not stored. | Could not be confirmed (B4). |
| G12 DeepSeek off the panel | Panel gemini, glm, chatgpt; DeepSeek is the single judge, synthesis, diagnostic and the single judge's cure. | Worked. |
| G13 two-layer measure and K-LB | Ten K-LB marks (premises 4 and 6 on five seats), **all false**; three judged UNCURED, also falsely; GLM removed on them (B2). | Fault. |

Further: the new-verse check marked Luke 2:46 in the defender's close (the only verse no earlier round names; correct), and the challenger's new-press check marked Luke 1:27 in the challenger's close (correct). Every seat graded by the declared numbers (32284's GLM did not).

## B. Faults

### B1. Is the UNDERDETERMINED sound? As section 8 is written, yes; it again turns on an unruled point

Section 8 (v85): "RESULT line ... HELD gives DEFENDER WINS only if the challenge is not SELF-SUPPORTED or a collision is graded CHALLENGER LINK BROKEN; every other case gives UNDERDETERMINED." Standings: "SELF-SUPPORTED requires a count of 0 for that side; PROP-DEPENDENT when the count is 1 or more; COLLAPSED when 2c > L". Section 10, TIE: "a HELD or PARTIAL panel whose counted seats of that verdict mostly wrote RESULT: UNDERDETERMINED gives UNDERDETERMINED."

| Seat | Verdict, clause | Defender | Challenger | RESULT | Follows from its own lines? |
|---|---|---|---|---|---|
| Gemini (900) | HELD, "HELD-1 -- n=6 w=0 k=0" | 0, SELF-SUPPORTED (L=6 c=0) | 0, SELF-SUPPORTED (L=6 c=0) | UNDERDETERMINED | **Yes.** Every collision line UNDERDETERMINED; no CHALLENGER LINK BROKEN line; both standings SELF-SUPPORTED. Its two K-LB items were cured by statement. |
| Sol (901, alternate) | HELD, "HELD-1 -- n=6 w=0 k=0" | 0, SELF-SUPPORTED | **2** (premises 2 and 3), PROP-DEPENDENT (L=6 c=2; 2c is not over L) | DEFENDER WINS | **Yes**: HELD with the challenge not SELF-SUPPORTED, and "D3 vs C2 (Matthew 1:25; Luke 1:27): CHALLENGER LINK BROKEN", each alone gives DEFENDER WINS. Whether the count of 2 is right is the open point below. |
| ChatGPT (902) | HELD, "HELD-1 -- n=6 w=0 k=0" | 0, SELF-SUPPORTED | 0, SELF-SUPPORTED: "The six charges are stronger than their [DR2] quotations and are VOID, so none enters the count." | UNDERDETERMINED | **Yes.** No BROKEN line; both standings SELF-SUPPORTED. |
| GLM (removed) | HELD, HELD-1 | 0, SELF-SUPPORTED | 0, SELF-SUPPORTED (recomputed from PROP-DEPENDENT at c=0) | UNDERDETERMINED (recomputed after four retractions) | Yes after its cure. Not counted (B2). |
| Single judge (no vote) | PARTIAL, "PARTIAL-2" | **4, COLLAPSED** | 0, SELF-SUPPORTED (recomputed) | UNDERDETERMINED | The RESULT follows from the lines, but the count of 4 does not follow from the record (B8). |

**The tie.** Gemini and ChatGPT wrote UNDERDETERMINED; Sol did not. Two of three counted HELD seats is "mostly", so the outcome UNDERDETERMINED is computed correctly.

**The cited-in rulings (K-G9) and why there is no K-G9 row.** Every seat wrote a ruling line for each of the six verses its ledger listed, and the only PRESSED and UNANSWERED rulings (Sol's) stand in Sol's count ("CHALLENGER CONCEDED LINKS: 2"). Each quotation Sol gave stands in its round ("To a virgin espoused to a man whose name was Joseph." in defender round 1; "Matthew 1:22 says \"all this\" was done to fulfil it" in defender round 2). So the check had nothing to mark. The record holds no line written when the check passes, so it cannot show by itself that the check ran; that the five seats ruled on one identical list shows the ledger line reached every judge prompt. ChatGPT wrote each ruling with a closing period ("NOT PRESSED: Hebrews 10:5.") and was not marked, so the check tolerates it.

**The open point.** The six verses are those the defender quoted in rounds 1 and 2 that the defender's link round does not list under PRESSED WITH. Gemini, ChatGPT, GLM and the single judge ruled all six NOT PRESSED, with no reason. Sol ruled two pressed:
- "PRESSED: Luke 1:27 -- [CR1] -- \"**[L1]** \\\"To a virgin espoused to a man whose name was Joseph.\\\" (Luke 1:27)\" -- UNANSWERED", counted under premise 2 ("Luke 1:27, pressed in [CR1] against the claimed relations, receives no later reference-specific answer").
- "PRESSED: Matthew 1:22 -- [CR2] -- \"Matthew 1:22 says \\\"all this\\\" was done to fulfil it ...\" -- UNANSWERED", counted under premise 3 ("naming Matthew 1:23 as an application does not satisfy the stipulated reference rule for Matthew 1:22").

The record agrees on the facts: no challenger round before the close names Luke 1:27 (the close does, and section 8 says "[DR4] answers nothing"), and no challenger round names Matthew 1:22 at all. Section 8's wording, "a verse the other side quoted against a link or listed premise (... against the challenger: [CR1], [CR2], [CR3])", allows Sol's reading; the link round's PRESSED WITH lists (premise 2: Matthew 1:18, 1:24, 1:25, Luke 1:34; premise 3: Isaiah 7:11, 7:14, Genesis 24:43, Matthew 1:23) allow the others'. This is the same point as 32284 B1(1); no ruling between 372 and 387 settles it. **Applied uniformly, it flips the outcome**: had Gemini ruled as Sol did, Gemini would count 2 and write DEFENDER WINS, two of three seats would write DEFENDER WINS, and the outcome would be DEFENDER PREVAILS. ChatGPT would stay at 0, because it ruled premises 2 and 3 VOID ("2 adds precedence to conception; 3 identifies the kind of the Isaiah 7 sign with the Isaiah 8 birth").

**One fault inside Sol's seat.** Sol's BROKEN grade on "D3 vs C2" rests on Luke 1:27. Section 8: "A witness contradicts a link only when its own words state the contrary." Luke 1:27 reads "To a virgin espoused to a man whose name was Joseph, of the house of David; and the virgin's name [was] Mary." Its words describe Mary at the annunciation; they do not state that Joseph did not know her within the espousal (the challenger's C2). By that sentence the line could be UNDERDETERMINED, not BROKEN. Sol's RESULT does not change, because its PROP-DEPENDENT standing alone gives DEFENDER WINS. The check on unanswered-witness grounds (K-G4) tests only that the pressing sentence is quoted, not whether the witness's own words state the contrary.

**Conclusion.** The UNDERDETERMINED is sound as the rules stand and as each counted seat's lines stand. It would also have resulted had GLM kept its seat (gemini, glm and chatgpt all wrote UNDERDETERMINED), so the wrongful removal (B2) did not change it. It rests on Gemini's unexplained NOT PRESSED rulings on Luke 1:27 and Matthew 1:22.
**Solution.** Your ruling on whether a verse the holding side's opponent quoted in [CR1] or [CR2], and that the link round does not carry under PRESSED WITH, is a pressed witness of a premise first listed in [CR3]. If yes, the ledger should list such verses as pressed (not ask the judge); if no, the ledger should not list them, and the "cited in" line should go. In either case K-G9 should require a reason on a NOT PRESSED line that names the round and the premise. Separately: a K-G4 extension that marks a BROKEN line whose named witness's own words do not state the contrary (section 8's sentence), recorded for review.

### B2. The link-round layer check (K-LB) marked ten false items, judged three cures falsely, and removed GLM

**The marks were wrong.** Every seat (Gemini, GLM, ChatGPT, the single judge, Sol) was marked "CHALLENGER premise 4: the link-round block (DR3 LINK 4) exhibits L1, fewer than two prior layers" and the same for premise 6. The blocks, quoted:
- Challenger link round, LINK 4: "[L2] John 1:13 \"Which were born, not of blood ...\" ... Romans 1:3 adds kata sarka (according to flesh) when flesh is meant; Matthew 1:20 has no kata sarka in its row." and "[L1] 1 Chronicles 28:6 \"And he said unto me, Solomon thy son ...\"". Two kinds: [L1] and [L2] (kata sarka, with its meaning).
- Challenger link round, LINK 6: "[L1] 2 Samuel 7:12 \"...I will set up thy seed after thee ...\"" and "[L2] The loins-word of Acts 2:30 (osphys, loins) is the word of Hebrews 7:10 ... Romans 1:3 is ek spermatos David (out of the seed of David) kata sarka (according to flesh)." Two kinds.
Why the code missed them: lib/blocks.js counts an [L2] tag when its text has a Hebrew or Greek letter, transliteration marks or a Strong's number anywhere (DRV_SRC), or a plain-letter word with its meaning **at the start** of the tag's text (DRV_TL_AFTER is anchored with "^"). LINK 4's [L2] text begins "John 1:13" and LINK 6's begins "The loins-word"; the plain-letter words (kata sarka, osphys, ek spermatos) come later and carry no diacritic, so neither tag was read. The other four blocks passed because their [L2] word has a mark (ginōskō, andra ou ginōskō), a Strong's number (H5959) or stands first (enomizeto). No defender link-round block was marked; all six show two kinds.
A second fault: K-LB marked premises the seat had ruled VOID (ChatGPT ruled all six VOID; Sol ruled 4 and 6 VOID). A VOID premise does not enter the count whatever its block shows, so there was nothing to cure.

**The three UNCURED items were not true faults.**
- GLM, premises 4 and 6 (rows 75, 76): GLM's STATEMENT lines read "[L1] 'And he said unto me, Solomon thy son, he shall build my house ...' (1 Chronicles 28:6, quoted in the block) and [L2] kata sarka (according to flesh), the block's own words 'Romans 1:3 adds kata sarka ...'" and "[L1] 'I will set up thy seed after thee, which shall proceed out of thy bowels' (2 Samuel 7:12, quoted in the block) and [L2] osphys (loins) ...". These show both kinds and quote the block. They failed because GLM put its quotations in single quotation marks: the cure check counts [L1] only with double quotation marks ("[\"“][^\"”\\n]{4,}[\"”]") and looks for the block's words only inside double quotation marks. The cure prompt says "[L1] the KJV words quoted" and does not ask for double marks. Gemini, ChatGPT and Sol used double marks and were cured on the same substance (rows 68, 69, 77, 78, 85, 86).
- Single judge, premise 4 (row 81): its STATEMENT reads "[L1] \"1 Chronicles 28:6 \"And he said unto me ...\"\" and [L2] \"Romans 1:3 adds kata sarka (according to flesh) when flesh is meant\" ... with [L3] \"2 Samuel 7:14 \"I will be his father, and he shall be my son.\"\" named as the cross-reference". Its premise 6 statement, in the same nested form, was CURED ("exhibits L1 and L3"). The reason recorded for premise 4 ("no statement quoting [DR3] with two layer kinds") is not true of the line; the record does not show which step of the check failed (the nested double marks are the likely place). Its RESPONSE reads "I accept the mark as filed and show the block's own two layers", which is also accurate about the block.

**GLM's removal was not right.** GLM's two uncured items rest on false marks and on a quotation-mark form. GLM's cured judgment stands in drv_removed: HELD-1, both standings SELF-SUPPORTED, "RESULT: UNDERDETERMINED -- recomputed after the cure". Its first pass had graded four collisions CHALLENGER LINK BROKEN without an unanswered witness (rightly marked K-G4 and retracted with reasons such as "[DR3] LINK 2 quotes both rows the line rested on ... saying 'both stand as written inside that chain'"), and the stating-verse ground on D5 vs C5 (rightly marked K-C and restated). Kept, GLM would have made the panel 3 of 3 UNDERDETERMINED. The substitution brought in a DEFENDER WINS seat on the open point in B1, and the row's panel_expected now names sol and not glm.
**Solution.** (1) In lbKinds, read an [L2] tag as met when its text, anywhere up to the next tag, holds a plain-letter word followed by a parenthesised or comma meaning ("kata sarka (according to flesh)", "osphys, loins"), not only at its start. (2) Skip premises the seat's count line rules VOID. (3) In the cure check, accept single quotation marks for [L1] and for the block quotation, or say in the prompt that double marks are required. (4) Before an alternate replaces a seat, re-run the uncured items' marks against the corrected check, or hold a seat whose only uncured items are K-LB for review rather than removal.

### B3. The renumbering check (G1) fired on both closes, though both kept the declared numbers

review_notes: "CLOSE-ROUND NUMBERING CHECK (D4) -- ... D4 (\"D4: NARROWED TO: Matthew 1:22-23 states the application, and Isaiah 7:\") matches declared D6 better than declared D4"; "CLOSE-ROUND NUMBERING CHECK (C4) -- ... D5 (\"D5. The defender grants enomizeto (was supposed) carries no verdict by\") matches declared D6 better than declared D5; C5 (\"- C5, C6 [dash] SUPPORTED, unwithdrawn.  Why the chain does not carry its k\") matches DR3 LINK block C4 better than DR3 LINK block C5". Each is false: the declared D4 is "Isaiah 7:14 gives a ʾôt (sign) fulfilled in Matthew 1:23"; the declared D5 carries "[L2] *enomizeto* (was supposed)"; and the close's "C5, C6" line is one line for two links, cut together with the next heading. The word comparison is too loose (the declared D6 names Isaiah 7:14 and "the forms in links 1 to 5", so it shares words with every link), and a label's text runs into the following heading. The synthesis then wrote "[CR4]'s numbering is misaligned; grading follows [CR1]'s declared numbers", repeating the false flag. No seat's grade turned on it.
**Solution.** Fire the comparison only when the close label's words share no verse and no content word with its own declared link (a "better match" elsewhere is not enough); cut the label text at the next heading or label; read "C5, C6" as one status line for two labels and skip it.

### B4. The verse sheet (G11) cannot be confirmed from the record

No round text mentions a sheet; the prompts are not stored; the timings file lists no "Verse Sheet" node (and no Build node either). Exact-match counts from the citation report (MATCHES and MATCHES (MARGIN)):

| | Round 1 items | Matches | Rounds 2 to 4 items | Matches |
|---|---|---|---|---|
| 32293 | 64 | 63 (the one miss is the false Luke 1:34 attribution, B6) | 231 | 229 (one true misquote, one NOT CHECKED) |
| 32284 | 76 | 75 | 221 | 217 |

Both runs are near the ceiling, so the counts cannot show the sheet's effect. The one true misquotation of this run falls in round 2 after the sheet should have served: defender round 2, "Luke 1:35 says \"therefore also that holy thing which shall be born of thee shall be called the Son of the Highest\"" (the KJV's Luke 1:35 ends "the Son of God"; "the Son of the Highest" is Luke 1:32's wording). Luke 1:35 was named in both round 1 texts, so it should have been on the defender's round 2 sheet; whether it was cannot be read.
**Solution.** Record, per Build, the references the sheet carried and the count left off (a short field or a review line), so a run can show the sheet reached the debater.

### B5. The close-round press check (G3) under-marks both closes and marks one sentence that presses nothing

Marked: the defender's "C1. The challenger dropped the silence-limb ..." and "C5. The challenger granted that the Luke-Acts rows carry no verdict of their own."; the challenger's "D5. The defender grants enomizeto (was supposed) carries no verdict by lexicon alone."
- The challenger's marked sentence reports a concession the defender made ("I do not claim *enomizeto* (was supposed) carries a verdict by lexicon alone"); it does not press.
- Unmarked in the challenger's close, which section 8 says "may not press": the heading "Why the chain does not carry its keystone", "**D6** is the keystone and its wording is the trained reading, not the text's. Its four supports do not carry it", "**D1.** ... The passive at the last link after the active series is non-narration", "**D2 and D3.** The defender says Matthew 1:25 denies the knowing ... Read the rows in order", "**D4.** The defender has already narrowed it", "the defender answers Romans 1:3 with \"the flesh is of Mary alone\"" and the last sentence "Not one of them says what D6 says." These grade or press the defender's links.
- Unmarked in the defender's close: "**C2.** The challenger's chain needs Joseph to have known Mary within the espousal. Matthew 1:25 denies it" and "**C4.** ... It does not show a father undisturbed." These grade the challenger's links as the marked C1 and C5 sentences do.
No seat's grade appears to rest on an unmarked sentence (ChatGPT: "The flagged close-round grading sentences are disregarded").
**Solution.** Mark every sentence under a label of the other side (D<n> in the challenger's close, C<n> in the defender's) and every sentence under a heading that addresses the other side's chain; do not mark a sentence that only reports the other side's own words.

### B6. Citation report: one false flag, one silent gap, and the report stops inside the defender's close again

- **False flag (item 22):** challenger round 1, "Luke 1:34" marked "WORDS ARE AT Luke 1:32". The sentence is "And Luke 1:32 gives the throne **before** the question of Luke 1:34: \"the Lord God shall give unto him the throne of his father David.\"" The challenger named Luke 1:32 as the source and Luke 1:34 only as the later question; the scan gave the quotation to the nearer reference. All five judges then charged the challenger with a citation error ("In [DR1] Challenger cited Luke 1:34 for words found at Luke 1:32"). No count turned on it (every seat kept the words as footing).
- **True flag (item 72):** the defender's round 2 Luke 1:35 (B4). Every seat marked it NOT COUNTED.
- **Missed:** the defender's close repeats the error, "At Luke 1:35 the title follows the conception: \"therefore also that holy thing which shall be born of thee shall be called the Son of the Highest\". The text reads \"Son of God\"". The report's Luke 1:35 item for the close (MATCHES) is the later, correct quotation under Romans 1:3; this one has no item. Sol noticed it ("The same erroneous wording repeated in [CR4] receives no weight").
- **NOT CHECKED (item 76):** the defender's round 2 "1 Corinthians 7:5" (second of two items), with no reason. The quotation "come together again" is the KJV's.
- **The report stops** at item 295, the defender's close "Ezra 3:2". Jeremiah 18:7-8 and Luke 3:27 in the defender's close and every quotation of the challenger's close (0 items) are absent and not marked NOT CHECKED, as in 32284 (297 items) and 32266 (295). I checked the challenger's close quotations against kjv_verses (2 Samuel 7:12, Psalms 132:11, Acts 2:30, Romans 1:3, 2 Timothy 2:8, Hebrews 7:14, Luke 2:48, 2:27, 2:33, 4:22, John 6:42, 1:45, Matthew 1:20, Numbers 1:2, 1:18, Genesis 4:1, Matthew 1:19, Deuteronomy 22:24, 1 Chronicles 28:6, 2 Samuel 7:14, Matthew 1:24, 1:25, 1 Corinthians 7:5, Luke 1:34, Acts 1:8, 1 John 5:1, Isaiah 7:16, Luke 1:27, Luke 2:4): every one matches with brackets opened, so nothing turned on the gap.
**Solution.** Give a quotation to the reference it follows only when no other reference stands between them in the same sentence as its subject ("Luke 1:32 gives ... of Luke 1:34: \"...\"" belongs to Luke 1:32), or mark such a case NOT CHECKED (two references); find the item cap (about 295) and lift it or mark the rest NOT CHECKED; record the reason on every NOT CHECKED item.

### B7. The synthesis: three claims against the record and a confirmation that endorses a wrong count

The synthesis charges guards to the challenger seat only ("DRIFT-GUARD VIOLATIONS [dash] CHALLENGER SEAT ONLY ... None found"; "The defender is a plain seat and was never given the guards"), as ruling 383 requires, and names the challenger's new close press; S-D and S-F rightly stayed silent. Faults:
- Section 1, item I: "\"Son of God\" is a covenant title and decides nothing about begetting ... No charge contests this on either side." The defender contested it: link round, "Luke 1:35 grounds the sonship in the birth (\"therefore also\")"; close, "At Luke 1:35 the title follows the conception ... the \"therefore\" ties it to the coming of the Holy Ghost." The defender's "I do not rest the denial of a human father on the title" (round 2) does not concede the point.
- Section 2, D5: "Filed \"SUPPORTED\" in the link round with a concession inside it: \"I concede *enomizeto* alone gives no verdict\"". That sentence is in the defender's close, not the link round.
- Section 2, table: "\"(as was supposed)\" carries no doubt | Defender R3 (5) | **Conceded by the defender**". The defender conceded only the lexicon-alone force ("I do not claim *enomizeto* (was supposed) carries a verdict by lexicon alone") and kept the contextual reading ("Luke flags that reckoning on Joseph as father").
- The CONFIRMATION: "the four stated concessions in the defender's close do collapse her standing (six links against four conceded ...)". The single judge's four were link-round narrowings, not close concessions, and narrowings are not concessions (B8). It also repeats the false numbering flag (B3). It rightly notes "one challenger premise is stamped UNCURED in the violation report whose own body exhibits a verse and a lexical ground for it" (B2).
- "the 1611 KJV prints \"virgin\" at both" and "the 1611 margins": the record holds the KJV text and its margins, not their date.
**Solution.** A synthesis check that marks a "No charge contests this" or "Conceded by" sentence whose subject the other side's later round argues (by verse and keyword), and a CONFIRMATION that may not adopt a single-judge count the panel did not adopt without a recorded reason.

### B8. The single judge: narrowings counted as concessions, unmarked; its cited-in section read as collision lines

- "CONCEDED LINKS: 4 -- 1 CONCEDED (stated) ([CR3] Link 1 drops the anēr-by-itself claim); 3 CONCEDED (stated) ([CR3] Link 3 drops the pre-angel knowledge claim); 4 CONCEDED (stated) ...; 6 CONCEDED (stated) ..." and "DEFENSE STANDING: COLLAPSED -- L=6 c=4". Section 8: "CONCEDED (stated) (the block surrenders the link itself)"; each block is headed "NARROWED TO" and keeps the link. The narrowing check (K-N) exists for exactly this but did not fire: cntItems splits a count line only at "Premise n" or "LINK n (" / "LINK n:", and the single judge wrote bare numbers ("1 CONCEDED (stated)") and quoted no words, so no item was read. The single judge has no vote; its PARTIAL reached the synthesis and its CONFIRMATION (B7), and its 13 OUT-OF-ROUND lines are the row's out_of_round_detail.
- Seven review lines "COLLISION POINTS ENTRY NOT READ: \"CITED-IN RULINGS\"" and "... \"NOT PRESSED: HEBREWS 10:5\"" and so on: the single judge placed CITED-IN RULINGS directly after its collision lines (its citation note is in its opening paragraph), and the collision reader stops at CITATION CHECK, not at the new heading. The panel seats, which wrote CITATION CHECK first, drew no such lines.
**Solution.** K-N: read bare-numbered items ("<n> CONCEDED (stated)") and, with no quotation, fetch the link-round block's head and test it for "NARROWED TO" or "drop". End the collision section at "CITED-IN RULINGS" as well.

### B9. Errors by the Oracle seat (the challenger) against the record, and misquotations

Debate rules only (ruling 383: only the Oracle seat is bound by the guards; the judges are not graded by them here).
- **A press in the close, which section 8 forbids** ("[DR4] answers nothing and may not press"): the challenger's close uses Luke 1:27, which no earlier challenger round names, against D6 ("Luke 1:27 gives \"of the house of David\" beside Joseph"), and argues against D1 to D6 at length (B5). The new verse was marked NOT COUNTED; the arguments were not.
- **A status changed against the record:** "**C2 [dash] KEPT in full:** \"Joseph knew Mary his wife within the espousal, and the child is of his loins.\"" The link round filed it "**LINK 2: NARROWED TO:** Joseph knew Mary his wife within the espousal, and the child is of his loins [dash] the knowing being the canon's stated means of begetting, not an event merely prior to the conception." The synthesis caught it ("a close-round self-label; the link round's status governs").
- **A characterisation the record does not bear:** link round, LINK 3: "The defender's Link 4 joins 24:43 and 24:16 as if one word carried both". The defender's link round says "*ʿalmāh* ... is the word of Genesis 24:43 ... It is applied there to the one of whom Genesis 24:16 says \"a virgin, neither had any man known her\". So the word can carry virginity", which does not say the two verses share a word.
- The challenger's other statements of the defender's words check out: "the flesh is of Mary alone" and the concession on Mary's descent (defender's close); "for the whole window from the finding to the birth" (defender's close); "Isaiah 7:14 \"is not the proof of the virginity\"" (defender's close); "Answering Hebrews 7:10 as \"generations back\"" (defender round 2).
- **Misquotations:** the defender's Luke 1:35 in round 2 and again in the close (B6). No challenger misquotation was found among the quotations checked; its round 1 Luke 1:32 is cited correctly (B6). Partial quotations with book, chapter and verse (ruling 384) are not counted as faults.
**Solution.** None in the code beyond B5; the C2 status change is the kind of line the close-round grading check could also record ("status differs from the link round").

## C. Each seat's grades, with quotes

- **Gemini (900).** Collision lines by the declared numbers: "D1 vs C1 (Matthew 1:16)", "D2 vs C4 (Matthew 1:20)", "D3 vs C2 (Matthew 1:25)", "D4 vs C3 (Isaiah 7:14)", "D5 vs C5 (Luke 3:23)", "D6 vs C6 (Romans 1:3)", all UNDERDETERMINED. Its answering rounds are loose in places: "Defender answered 2 Samuel 7:12 and Acts 2:30 in [CR2] and [CR4]" (the defender's round 2 does not name 2 Samuel 7:12; its link round does) and "Defender answered 2 Samuel 7:12, Psalm 132:11, and Acts 2:30 in [CR2] and [CR4]" (round 2 names neither 2 Samuel 7:12 nor Psalms 132:11). No count turns on these. Its CITED-IN rulings give no reason. Cured both false K-LB items by statement.
- **Sol (901).** B1. Defender premises 1 and 6 VOID, the rest SUPPORTED or narrowed; challenger premises 2 and 3 UNEXHIBITED, 1 narrowed, 4 to 6 VOID. Its K-G4 item ("D3 vs C2 ... counts a witness as unanswered") was cured with "PRESSED: D3 vs C2 | [CR1] | ... (Luke 1:27)"; the check searched the challenger's rounds 1 to 3 only, as section 8 directs.
- **ChatGPT (902).** Both sides 0 by VOID: defender premises 1 and 5 VOID, 2, 3, 4 and 6 supported as narrowed; all six challenger premises VOID ("Each is VOID because that claim is not made by its quoted words in [DR2]"). Collision lines by the declared numbers, all UNDERDETERMINED. Its six VOIDs on the challenger side are judgments on the evidence (ruling 383); they also make its count immune to the open point in B1.
- **GLM (removed).** B2. Original lines graded "D2 vs C4", "D2 vs C2", "D3 vs C2" and "D6 vs C2" CHALLENGER LINK BROKEN with no unanswered witness, and "CHALLENGE STANDING: PROP-DEPENDENT -- L=6 c=0"; all four retracted with reasons, recomputed to UNDERDETERMINED. Its citation note also names "the [CR4] answer-[L4]s whose blocks show only [L1] quotations ... named floating and given no weight, the answers themselves standing on quoting the pressed verse": a point for ruling 386 (E).
- **Single judge.** B8; K-G4 on "D3 vs C2" cured by retraction; K-C on "D2 vs C4" cured by restatement; two stating-verse marks (K-S2) on "D2 vs C4" and "D6 vs C1" ("GROUND: no seed row names Joseph as the begetter of Jesus") stand for review, uncured (K-S2 is not sent to the cure).

## D. Pressed witnesses, answered or unanswered (SQL position(), later rounds of the holding side)

**Against the defender** (challenger round 2, UNSUPPORTED-L4 PREMISES; answering rounds: defender round 2 for verses also quoted in challenger round 1, the link round, and the close under ruling 377):

| Premise | Witnesses | Answered |
|---|---|---|
| LINK 1, anēr excludes begetting | Matthew 1:16; Luke 2:48; Luke 2:27; Luke 2:33; John 6:42; John 1:45; Luke 4:22; Matthew 1:20 | All named in the link round's LINK 1 block (78 to 1,292). Narrowed. |
| LINK 2, the angel's "for" | Matthew 1:20; John 1:13; 1 John 5:1; Acts 1:8; Luke 9:34; Acts 5:15; 1 Chronicles 28:6 | All named in LINK 2 (1,292 to 2,670). |
| LINK 3, "He knew the child was not his." | Matthew 1:19; Matthew 1:25; Deuteronomy 22:24; Matthew 1:20; Genesis 4:1 | All named in LINK 3 (3,092 to 3,637). Narrowed. |
| LINK 4, an ordinary birth cannot be a sign | Isaiah 8:3; Isaiah 8:4; Isaiah 8:8; Isaiah 7:16 | Isaiah 8:3 (round 2, 8,760; link round 4,657) and 8:4 (link round 4,811). **Isaiah 8:8 only in round 2** (8,813: "Isaiah 8:8 addresses \"O Immanuel,\" and that is a different matter from the child of 8:3"), after challenger round 1 quoted it. **Isaiah 7:16 only in the close** (3,117, "ANSWER: Isaiah 7:16 -- D4 --"); section 8 lets the close answer it. Narrowed. |
| LINK 5, "thy father" is common reckoning | Luke 2:48; Luke 2:27; Luke 2:41; Luke 2:33; John 6:42; John 1:45; Luke 4:22; Acts 16:13 | All named in the link round; Luke 2:41 in the list "Luke 2:27, 2:41, 2:48" with the book stated once. |
| LINK 6, Luke's line through Mary | 2 Samuel 7:12; Psalms 132:11; Acts 2:30; Romans 1:3; Luke 2:4; Numbers 1:2; Hebrews 7:14 | All but Numbers 1:2 named in LINK 6. **Numbers 1:2 only in round 2** (1,976: "The reckoning by \"the house of their fathers\" (Numbers 1:2) is a legal registry"), after challenger round 1 quoted it. Narrowed. |

Every seat counted the defender 0. Under rulings 372 and 373 and section 8's close rule, that is right.

**Against the challenger** (defender link round, CHALLENGER'S UNSUPPORTED-L4 PREMISES; answering round: the challenger's link round):

| Premise | Witnesses | Answered in the challenger's link round |
|---|---|---|
| 1, silence leaves a father open | Luke 1:34; Matthew 1:18; Matthew 1:20 | All (811; 2,154; 1,731). |
| 2, relations preceded the conception | Matthew 1:18; Matthew 1:24; Matthew 1:25; Luke 1:34 | All (2,154; 2,234; 996; 811). |
| 3, the sign of one kind with Isaiah 8 | Isaiah 7:11; Isaiah 7:14; Genesis 24:43; Matthew 1:23 | All (4,497; 2,839; 3,677; 4,616). |
| 4, "of God" as for believers | John 1:13; Matthew 1:20; Luke 1:35 | All (4,931; 1,731; 5,710). |
| 5, "(as was supposed)" carries no doubt | Luke 3:23; Luke 2:49; Acts 16:13 | All (7,138; 7,528; 6,857). |
| 6, the seed through the man's body | Galatians 4:4; Romans 1:3; Genesis 3:15 | All (9,369; 689; 9,820). |

**The two cited-in verses (B1):** Luke 1:27 (defender round 1) is named by no challenger round before the close (rounds 1 to 3: 0; close: named); Matthew 1:22 (defender round 2) is named by no challenger round. Whether either is a pressed witness is the open point.

## E. The two-layer measure (rulings 385 and 386)

Every link-round block on both sides exhibits two prior layer kinds (B2), and every counted seat said so ("No load-bearing [L4] in either link round is floating" (Sol); "exhibited scriptural and lexical footing for all six premises" (Gemini)). The one place the measure is open is an answer in the close: the defender's answer to Isaiah 7:16 reads "[L1] This row gives a near deadline ... [L1] Matthew 1:22 says ... [L4] Footing: Matthew 1:22-23 ... and Luke 1:34-35", only [L1] kinds. GLM named such close-round answers floating but held "the answers themselves standing on quoting the pressed verse"; section 8 counts an answer that "quotes it or names it by reference and shows from the text why it does not overturn the link", with no layer test. Ruling 386 says "every claim has to meet a measure (2 of 3 Layers)". If an answer to a pressed witness must meet it, Isaiah 7:16 is unanswered and the defender's premise 4 counts on every seat. **Your ruling is needed on whether the two-layer measure applies to an answer to a pressed witness.**

## F. Cache and tokens

| Run | Input | Output | Cache written | Cache read | Read as share of input |
|---|---|---|---|---|---|
| 32293 | 724,647 | 385,701 | 133,982 | 351,479 | 48.5% |
| 32284 | 558,000 | 286,891 | 72,307 | 251,851 | 45.1% |
| 32266 | 645,822 | 503,826 | 100,006 | 357,603 | 55.4% |

Against 32284, input rose 166,647 (29.9%), cache read 99,628 (39.6%) and cache written 61,675 (85.3%); against 32266, cache read is 6,124 lower on 78,825 more input. The row holds totals only; no per-call usage is stored, so the rise cannot be divided between the verse sheets (G11), the longer judge prompts (G2, G13), GLM's 15,874-character cure and Sol's alternate call. Ruling 387 (cache diagnostics on the Claude calls, direct to Anthropic) is dated 21:59Z, after this run fired; the record does not show whether it touched this run.
**Solution.** Store per-call usage (input, cache read, cache write) for the debater calls in the row or a side table, so a run's cache can be read by seat.

## G. Comparison with run 32284

| | 32284 | 32293 |
|---|---|---|
| Outcome; split | UNDERDETERMINED; 3-0 HELD | UNDERDETERMINED; 3-0 HELD |
| Seats counted | ChatGPT (reserve for DeepSeek), Gemini, GLM | Gemini, Sol (alternate for GLM), ChatGPT |
| The DEFENDER WINS seat | ChatGPT, 3 challenger premises on "pressed witness unanswered" (Luke 3:31) and one one-layer block | Sol, 2 challenger premises on "pressed witness unanswered" (Luke 1:27, Matthew 1:22) |
| The open point it rests on | Whether a [CR1] or [CR2] quotation not under PRESSED WITH is a witness (B1(1)) | The same point, now asked of every judge through the cited-in rulings; still unruled |
| Close numbering | Both closes renumbered; flag silent | Both closes kept; flag fired falsely on both |
| Seat removed or failed | DeepSeek failed closed (empty reply) | GLM removed on false K-LB uncured items |
| Enforcer rows | 5 | 19 (10 K-LB, 6 K-G4, 2 K-C, 1 alternate reply) |
| Citation report | 297 items, stops in the defender's close; false Isaiah 7:11 item | 295 items, stops in the defender's close; false Luke 1:34 item |
| Defender's round 1 to close time; challenger's | 381.0 s; 813.8 s | 345.8 s; 1,007.6 s |
| Run time (first node to Record Alternates) | about 38.1 minutes | about 50.3 minutes |

The fix set removed the 32284 numbering fault in the debaters and the judges, took DeepSeek off the panel and put the cited-in question to every judge. It added a new removal path (K-LB) that fired falsely on every seat, and it did not settle the question the outcome rests on.

## H. Order proposed

1. Your ruling on B1 (is a [CR1] or [CR2] quotation not under PRESSED WITH a pressed witness?) and on E (does the two-layer measure bind an answer to a pressed witness?). Each can change this run's outcome.
2. K-LB (B2): read a plain-letter [L2] word anywhere in the tag text; skip VOID premises; accept single quotation marks in the cure check; do not remove a seat on K-LB items alone until the check is corrected.
3. Renumbering check (B3) and close-round press check (B5).
4. Citation report (B6): the reference-attribution rule, the item cap, NOT CHECKED reasons.
5. K-N on bare-numbered items and the collision reader's end at CITED-IN RULINGS (B8); the synthesis checks in B7.
6. Per-Build verse-sheet record (B4) and per-call usage (F).

## Not read, or not in the record

- The Build prompts (so whether the verse sheets, the declared chain text, the [DR3] C list and the press marks reached each prompt), the panel and alternate judge prompts (so the exact "cited in" ledger line), and the Format Markdown output (G8): none is stored in the tables read.
- Which step of the cure check failed for the single judge's premise 4 statement (B2).
- Why data_class is "contested" (32284: "study").
- A debate_errors row at 22:33:41Z ("call failed at node \"C1 Extract\" ... xiaomi/mimo-v2.6-pro refused by the provider: finish_reason=content_filter") comes after this run's last node and names a round 1 failure this run did not have; it appears to belong to a later run and was not followed.
- The run's status (success) and the CST times are as given in the brief; the row holds neither.
