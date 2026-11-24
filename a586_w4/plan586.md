# ASK 586 plan rev 0 (W4, 11-23 22:56 CST): fix the engine form defects of run 42071, and answer WALL-11298 and WALL-11305

Sources taken in: the coordinator's assignment (W1 11296 item 7; W4 11297); W3's inputs at 11300 and after; the operator's feedback WALL-11298 (Worker_A3) and WALL-11305/11306 (Worker_G1), sent to the team 22:42 CST; W1 11309 and 11310; and W1's grading list of 22:47 CST (items 1 to 6 below).

## 1. OBJECTIVE
A judge in the next run is not sent back, counted, or removed for a defect of the engine's own making. Five such defects were found in run 42071:
1. The engine cut lines at 1,500 characters. This gave qwen4max a false "no deciding step", and the splice then returned a broken line for gemini.
2. The own-words check refused spark's correct KEEP.
3. The layer check demanded from argon a "D5 vs C" label that cannot exist.
4. The second reading reversed the enforcer's own first reading against argon.
5. The recompute raised the challenger's standing while it counted a challenger break.

Expected effect: in a run like 42071, these five give no fault. A real fault of the same kind is still raised. Each change has a known-bad and a control in section 5.

## 2. ROLES
1. Planner and builder: W4.
2. Consolidation of the 11291 findings: W3, with W4.
3. Grader: W1.
4. Card: W4's thread. There is one card for one write of the engine and the child together. Items G1 to G8 are not built and are carded or split separately.

## 3. SCOPE AND SEARCH
Fresh fetches were taken at 22:37 and 22:50 CST: engine moMxiV4Irg1uRBZN 196402d0 (Shared Library d749630c), and child MqQHRl7mQQ0z8QdT f900375e. The Library Check pair is LIB 0e1cce8f1b596ea4, MAP 6c6047999c902537, and it PASSES.

### a. The cut (W1 item 1; A3 Finding and Solution 1)
1. Twenty LIB lines and five MAP strings store `flagged_line:<x>.slice(0,1500)`:
   - Judge Enforcer Build and its two alternate twins;
   - Send Back Record, panel and alternate;
   - Alternate Merge Seat;
   - Alternate Merge 1;
   - Gate and Late Gate send-back rows;
   - Panel Cure Check.
2. Reread Record and Alt Reread Record in the engine, and R2 Alt Reread Record in the child, store `String(x.to).slice(0,1500)`.
3. LIB 2880 (Send Back Build and both alternate twins) runs `ECL.check(__x.flagged_line, ...)` on the stored copy. The judge lines were 1,685 characters (gemini, 1272) and 1,721 characters (qwen4max, 1274). Their DECIDES to WHY IT FAILS tail lies past 1,500.
4. LIB 1422-1423 splices a cure into the stored copy with `__c.split(__sg).join(to)`. On a cut copy, the tail is left behind (row 53240).
5. Five prompt builders show the judge or the enforcer a line cut to 1,500 or 1,600 characters with " [...]": LIB 3057, 3086, 2956, 2397, 3487.
6. Reread Build uses `slice(0,1200)` only as a match key on both sides. It is not a cut copy, so it is not touched.

### b. The own-words check (W1 item 2; A3 Solution 2)
1. LIB 2677-2681 (enf428Cure, E-COL KEEP) drops every 6-word run that stands inside quotation marks in any round (ROWN).
2. The challenger quoted the Oracle's sentence in [DR2] ("> \"The account I defend is this: Joseph knew Mary his wife within the espousal.\""). So spark's KEEP S3 (row 53175) was refused, although the Oracle wrote the same words unquoted in CR1 to CR4.
3. ANSF already covers all four rounds of the answering side. W1 11309 is right: the cause is the quoted-span skip, not normalization.

### c. The keystone label (argon)
1. LIB 3497 (pkgLAY scan and cure) requires a KEYSTONE line to name "D<k> vs C<m>".
2. Argon wrote no collision line for D5 (its labels: D2 vs C5, D2 vs C6, D3 vs C1, D3 vs C2, D3 vs C4, D4 vs C3).

### d. The second reading (argon, row 53360)
1. The first reading said "(right: STANDS)", and argon changed its keystone to STANDS.
2. The second reading then said DISAGREE (right: BROKEN). Reread Record counted that in drv_uncured (pkgDLU).

### e. The recompute standing (W1 item 3; A3 Finding and Solution 3; G1 item 6)
1. LIB 1345 uses `n=c[sd]`, the conceded count only.
2. A closing-contradiction break with no collision line is counted in `brk` (`__cecX`, LIB 1325 and 1344), but it never enters `stand()`.
3. Spark (1273) and qwen4max (1274) wrote CHALLENGE PROP-DEPENDENT, and the AUDIT v25 recompute wrote SELF-SUPPORTED, while it counted "C1 ... counted as one CHALLENGER LINK BROKEN".

### f. The removal-reason label (W3 input (b))
1. LIB 1588 tallies "UNREAD COUNTED LINE" for any line with "counted in drv_uncured" that matches no known pattern.
2. Spark's send-back item lines S8 and S9 hold "an item left uncured there is counted in drv_uncured". This explains "UNREAD COUNTED LINE x2".
3. It changes the removal-reason text only, not the removal.

### g. Library Check
1. The engine and the child must hold the same LIB. A target engine with the old child THROWS (out_pair586.txt).
2. The engine and the child are therefore written together, as in ASK 562.
3. No new MAP key is added, so __MAPEXTRA422 is not touched. The LIB line count is unchanged.

## 4. CHANGES (exact text in build/build586.cjs, which applies them to the live fetches)

**A1. No cap on any stored flagged line.**
1. Shared Library: every `flagged_line:<x>.slice(0,1500)` becomes `flagged_line:<x>`. That is 20 LIB lines and 5 MAP strings, the same in the engine and the child.
2. Reread Record, Alt Reread Record and R2 Alt Reread Record: `flagged_line:String(x.to).slice(0,1500)` becomes `flagged_line:String(x.to)`.
3. Caps left after the build: 0.

**A2. The whole line in prompts.** `cut(g.line,1600)` (3057, 3086) and `cut(<l>,1500)` (2956, 2397, 3487) become `String(<l>||'')`.

**A3. NOT READ.** LIB 2880, before `ECL.check`:
- `if(/\s\[\.\.\.\]\s*$/.test(String(__x.flagged_line||'')))continue;`
- A line that reaches the layer check carrying the cut mark raises no fault. It is NOT READ, never UNCURED. After A1, no stored line carries the mark.

**B. Own words.**
- LIB 2679 adds `OWNT=KS.filter(k=>side(k)===fs).map(own)`: the answering side's rounds without their quoted spans.
- LIB 2680 skips a quoted run only `if(ROWN.includes(' '+r+' ')&&!OWNT.some(x=>hasIn(x,r)))`.

**C1. Keystone with no collision line.**
1. LIB 3497 scan: `__nc` is true when the judge's text has no line "D<k> vs C<m>" for the keystone link.
2. Then `lb=/(?:)/`: no label is demanded.
3. The item carries `nocol`, and the cure uses the same rule.
4. The [L1] check is unchanged.

**C2. A line changed to the first reading's grade.**
1. Reread Record, Alt Reread Record and R2 Alt Reread Record get `__fr(x)`. It is true when the changed KEYSTONE (E-KEY) or RESULT (E-RES) word equals the first reading's "(right: X)".
2. Such a DISAGREE is labelled RECORD-ONLY and is not pushed to DLU.

**D. Standing inputs.**
1. LIB 1345: `n=typeof c[sd]==='number'?Math.max(c[sd],brk[sd]||0):c[sd]`. A counted break of the side enters its standing.
2. LIB 1363: the AUDIT v25 line prints `STANDING INPUTS: DEFENDER conceded <c>, counted breaks <brk>; CHALLENGER conceded <c>, counted breaks <brk>`.

**E. Removal-reason label.** LIB 1588: `if(/^\s*\[AUDIT v\d+:/.test(l))add('UNREAD COUNTED LINE',1);`

**Nodes written:**

| Workflow | Node | Before | After |
|---|---|---|---|
| Engine | Shared Library | d749630c, 1,171,824 | d293b4d9, 1,172,591 |
| Engine | Reread Record | 3f7bdf9e | 9d506a0f |
| Engine | Alt Reread Record | e56f5714 | 4283a2e0 |
| Child | Shared Library | 6d92bf4e | e99334e5 |
| Child | R2 Alt Reread Record | 36a70121 | f6e6bbaa |

The new Library Check pair is LIB 8b747ad90dfcf19b, MAP 644b34922ffcf595, and it PASSES.

## 5. CRITERIA (build/t586.cjs, output build/out_t586.txt: ALL PASS)
Every record line used is checked by md5 against SQL: 1272, 1274, rounds lines CR1/20, CR2/126, CR3/12, CR4/63, DR2/14, DR2/68, and keystone 53360 (636 characters).

**C1 (A).**
- dec504 on the whole qwen4max and gemini lines reads "deciding step written".
- The first 1,500 characters read "no deciding step". This is the known-bad: the 42071 fault, reproduced.
- Caps in LIB: 20 live, 0 target.
- A cut-marked line is NOT READ.

**C2 (B).**
- Spark's exact S3 KEEP: live refuses it ("quotes no 6 words in a row of the answering side's own words"). The target accepts it ("joseph knew mary his wife within").
- Control: S1 is accepted by both.
- Known-bad: a KEEP whose "answer" is only verse words that the answering side holds in quotation marks fails in both.
- Limit: R is the record lines that hold the KEEP's words, not the whole rounds.

**C3 (C1).**
- Argon D5: live demands a D5 label; the target demands none.
- Control: when a D5 collision line exists, the target still demands its label.

**C4 (C2).**
- 53360 (changed to STANDS, first reading STANDS): not counted.
- Control: first reading BROKEN is still counted. The E-RES case is the same.

**C5 (D).**
- Live recomputes CHALLENGE SELF-SUPPORTED, as written in 1273 and 1274. The target keeps PROP-DEPENDENT.
- Control: with no counted break, live and target agree.
- The inputs line is present.

**C6 (E).**
- A send-back item line is no longer tallied.
- Control: an unknown counted AUDIT line still is.

**C7.**
- Every library node source rebuilt from the target LIB and MAP parses (195 sources, 0 errors; syn586.cjs).
- The Library Check pair PASSES on the target pair.

**C8. At the write:**
- fresh fetch, with both live versions equal to the bases above;
- PUT the engine and the child;
- fetch back;
- per-node diff: only the five nodes above changed, with the md5s above;
- the Library Check pair on the fetch-backs;
- no model setting touched.

**DONE:** C1 to C8 met, and W1's readback.

## 6. WRONG-IF
1. The plan aims at the wrong thing if the whole lines of 1272 and 1274 also fail dec504. Then the cut was not the cause.
   - Check: t586 C1.
   - Known-bad (cut): "no deciding step".
   - Known-good (whole): "deciding step written".
2. The plan also aims at the wrong thing if spark's KEEP is refused for another reason.
   - Check: the target accepts it, and the verse-only known-bad still fails.

## 7. NOT BUILT HERE (W1's items 4 to 6, and the rest of 11298 and 11305)
- **G1. W1 item 4 (A3 Solution 7, with G1 item 1): a keystone STANDS beside a RESULT for the other side becomes a live E-KEY item.**
  - Today the written rule (part 08.0; the RESULT is derived from the verdict and the standings) allows it.
  - This is a rule change, so it needs the operator's ruling.
  - Proposed as its own ASK: the engine manual rule and the E-KEY enforcer text.
  - C2 above holds under either rule.
- **G2. W1 item 5 (A3 Solution 8): the enforcer's right-word read quotes every GROUND verse, not one.**
  - Rows 53144 and 53175 rested on one verse each.
  - This is a change to the enforcer's instruction text, so it needs the operator's ruling.
  - Proposed as its own ASK.
- **G3. W1 item 6 (G1 item 2): serve the grants list beside each collision.**
  - The card must say that it bears on ruling 383 (judges grade the text alone).
  - It must also say W1 11310's point that the 42071 grant was narrower than stated.
  - Proposed as its own ASK, with a plan for what counts as a grant.
- **G4. G1 item 3 (a lexical ground quotes the lexicon row whole).** This is judge instruction text. It needs a ruling, as its own ASK.
- **G5. Gate 4 (a model counts as used when offered; the pool held only argon).**
  - No change in 586. Pool depth is a model-setting question for the operator.
- **G6. The enforcer (openai/gpt-6-luna) is of the Oracle's family (openai).**
  - G1 covers judges only. This is a model setting, so it goes to the operator as a question; nothing is built.
  - Record: in 42071 the enforcer's right-word sided with the Oracle in all three disagreements (53144, 53175, and the argon keystone).
- **G7. A3 Solution 5 (keep gemini-3.8-flash off the roster).** This is a model setting. W1 11309 finds no ground in this run, since the gemini fault was the engine's splice. It goes to the operator as a question only.
- **G8. Other items.**
  - The C1 closing-contradiction flag that W1 and W4 read as not a contradiction (11296 item 6) is the enforcer model's reading. It is the operator's question in the AAR (FOR THE OPERATOR item 3). Changing it would touch reasoning.
  - A3 Findings 9 and 10 and G1 items 4, 5 and 7 to 10 (Oracle and challenger) go to the AAR. They are not engine form.

## 8. RUN EVIDENCE
The next run shows the effect only where a judge line passes 1,500 characters, a KEEP quotes words that the other side also quoted, a keystone link has no collision line, a line is changed to the first reading, or a closing contradiction is counted. Each of these stays UNEXERCISED until a run holds it.

## 9. INPUTS IN GIT
Branch claude/untitled-9jle0o, folder a586_w4/:
- this plan;
- build/build586.cjs, libpatch.js, syn586.cjs, t586.cjs, out_t586.txt, out_pair586.txt;
- data/judge_lines_42071.json, spark_round_lines_42071.json, argon_42071.json;
- the four workflow JSON files (6 MB each) stay in the project folder ask586/w4/build/ and are named by md5: live_eng 28604493, live_child dd4fd85c, target_engine_586 82be8a5b, target_child_586 a367f80c.

The commit is named on the Wall post.

## 10. STEPS AND REVERT
1. W3 consolidates the 11291 findings with this plan.
2. W1 grades.
3. The operator's card in W4's thread: A to E, one write of the engine and the child.
4. On the press, with no run live:
   1. fresh fetch, and confirm the bases;
   2. rebuild with build586.cjs on the fresh fetch, and rerun t586;
   3. PUT the engine, then the child;
   4. fetch back, then C8;
   5. audit row, Wall post, and W1 readback.
5. Revert: put back both saved prior versions together (engine 196402d0, child f900375e), saved before the write.
