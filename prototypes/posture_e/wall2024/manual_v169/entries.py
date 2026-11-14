# each entry: (id, section, anchor, indent, text, walls)
E = []
def add(i, sec, anchor, ind, text, walls):
    E.append(dict(i=i, sec=sec, anchor=anchor, ind=ind, text=text.strip('\n'), walls=walls))

S5 = ("5", "## 6. Rounds")
S8 = ("8", "## 9. Enforcers")
S9 = ("9", "## 10. The panel")
S12 = ("12", "## 13. Debate documents")

add(1, *S5, "", """- THE DG-8 INSTRUCTION TO THE ORACLE NO LONGER OFFERS DEUTERONOMY 22:24 AS FOOTING FOR THE UNION (pkgD22; node Init with Guards; ASK 256; removal only):
  - Why: in run 36842 the Oracle's record carried a Deuteronomy 22 framing (19 mentions, W2 6084 item 4). W2 found the source in the engine's own guard text: the DG-8 instruction "state the union as the record holds it ... with its footing" listed "his neighbour's wife," Deuteronomy 22:24 among the footing texts. ASK 250 had removed the same clause from Conclusion 76.
  - What it does: the words ` "his neighbour's wife," Deuteronomy 22:24;` (with the leading space) are deleted. The footing now reads ("Joseph her husband," Matthew 1:19; "Mary thy wife," Matthew 1:20; "till," Matthew 1:25). Nothing is added. No other node of 455 holds "neighbour's wife" or "Deuteronomy 22".
  - Size: Init with Guards 31,520 to 31,475 characters (-45 source, -43 prompt characters per prompt that carries the sentence); calls 0; logic 0; node md5 e5d4500c4eebcadd5eb86275b2f5f1d1.
  - Shown offline: W4 and W2 graded it (W4 6094 PASS WITH LIMITS). The committed target file was built on the s187 base and differed from live in 5 nodes, so the write used a rebuild on the live readback, which differs in Init with Guards only.
  - Shown in run 36916: the Deuteronomy 22:24 lines in all three verdicts are the defender's own [DR3] citation; the Oracle's guard text no longer carries it (W4 6147 item 4).
  - Limits: the defender's own citation of Deuteronomy 22 is not touched.""",
 "6084, 6093, 6094, 6095, 6099, 6100, 6106 (correction to 6100 item 4), 6147")

add(2, *S9, "  ", """  - THE pkgEPS HOLD ON A COUNTED PREMISE PUSH IS RECORDED AND NO LONGER STOPS THE PUSH (pkgEPT; Shared Library line 3384, constant EPS_STATUS, and the length entries of 3 Records; ASK 257):
    - Why: 13 rows in debate_enforcer_log began "ENFORCER HELD (pkgEPS": 6 on an assumed house of Mary (the DG-8 forbidden direction), 6 on ruling 372, 1 on a missing layer. In run 36842 all three judges spared defender premise 6 on that assumption and the engine held all three pushes. W1 read all 13 and found none that reads as a wrong push (W1 6102).
    - What it does: ` const EPS_STATUS='LIVE';` becomes `'TRIAL'`. The held COUNTED push is now sent (the send selector at LIB 2884 takes /^ENFORCER (?:DISAGREE|NO ANSWER)\\b/); the row keeps "(TRIAL pkgEPS: would not be sent: ...)"; that group is stripped from the text the judge sees (LIB 2921). 'TRIAL' is one character longer, so the map lengths of Judge Enforcer Record, Alt and R2 Alt were each raised by 1 (42,577 to 42,578; 42,630 to 42,631; 42,660 to 42,661); a bare edit would have made all three throw.
    - Size: code +1; prompt 0; calls 0; Shared Library 917,313 to 917,314; library sha 58d306b24b65f648.
    - Shown offline: W2 6112 and W4 6115 PASS; 45 library users rebuild and parse.
    - Shown in run 36916: the EPS pushes carry the TRIAL note and go through; an example is premise 2 COUNTED (UNEXHIBITED: Matthew 1:25 unanswered, ruling 372) (W4 6147 item 2). [MISSING: the graders' ruling on whether that push was sound; not located in the posts read]
    - Limits: no TRIAL pkgEPS row existed before, so the path had never run.""",
 "6101-6102 (6102 read), 6106, 6108, 6112 (listed), 6115, 6117, 6121 (listed), 6147")

add(3, *S9, "  ", """  - AN E-ANS CURE MUST QUOTE A COUNTED [L1] THAT THE ANSWER ITSELF NAMES OR QUOTES (pkgPWF rev 2; Shared Library lines 2531, 2532 and 2537 as W4 6140 numbers them; the 6 Send Back Build and Record nodes; ASK 258):
    - Why: in run 36842 sol's E-ANS send-back row 36588 had an answer that rests on Matthew 1:24-25, but its CHANGE TO fit was [L1] Galatians 4:4, the press, and pkgABS cured it (W2 6118 item 2).
    - What it does: a new helper pwf() builds the ANSWER text (the CHANGE TO's ANSWER quote plus the strings its reason quotes after "||") and masks every [L1] whose verse the ANSWER neither names (a range counts; a bare C:V counts on chapter and verse; only one of the 66 KJV names is a book) nor quotes (2 words in a row, one not a function word). An answer that names no verse masks nothing (a bare grant keeps the press). The cure test must still find a COUNTED fit after the mask, else UNCURED: "the counted [L1] in the CHANGE TO is a verse its ANSWER neither names nor quotes". The judge's E-ANS send-back reason gains "(the [L1] must be a verse the ANSWER itself names or quotes)". The E-HOLD cure is unchanged.
    - Size: code +2,597 (Shared Library 917,314 to 919,911; library sha a76e74e44586d784); prompt +61 per E-ANS absence send-back; calls 0.
    - Shown offline: of 102 stored rows cured by pkgABS (99 E-ANS, 3 E-HOLD), 17 become UNCURED: 13 seat-runs in 13 runs, 9 seats newly removed, 1 lone dissent removed (36842 sol). W1 failed rev 1 (6136, a capitalised word taken as a book); rev 2 passed W1 6138 and W2 6139.
    - Shown in run 36916: the new reason text is in 5 E-ANS reasons (sol 3, luna 2); no cure was UNCURED by it (Luke 1:34 names no verse, so pwf returned null) (W4 6147).
    - Limits: ABS.check is unchanged (0 of 11,170 stored lines change).""",
 "6116 (listed), 6118, 6132, 6134, 6135-6139 (6136 listed, 6137 read), 6140, 6145, 6147")

add(4, *S9, "  ", """  - FOOTING BORROWED FROM THE SIDE'S OWN CONTESTED LINKS IS COUNTED UNEXHIBITED BY THE ENFORCER (pkgBCL rev 4; Shared Library line 3204, RULE E-PREM THE COUNTED KIND, read by Judge Enforcer Build, Alt and R2 Alt; ASK 260):
    - Why: in run 36916 defender premise 6 (Mary's Davidic descent) was spared by all three enforcers and judges although its [L4] step "The flesh is not begotten by a man (Links 1 to 3)" is the debate's disputed conclusion taken from the side's own links. E-PREM tested only for a missing layer (W4 6154).
    - What it does: one sentence is appended to LIB 3204 after "(pkgP72).": when a step of premise N's [L4] takes as given the conclusion of the same side's own other links (it names them, as "(Links 1 to 3)") and the other side has not granted it, that step is the disputed point and is not footing, for a NARROWED premise too; RIGHT is COUNTED, written "(UNEXHIBITED: [L4] footing borrowed from contested Links <n>)" with the step quoted. It is not a missing-row charge (DG-61); a granted conclusion, or an [L4] that reaches the premise from its rows, is SPARED. Rev 4 added "[L4] " to the count form because K-UNX sent the rev 3 form back.
    - Size: LIB 3204 872 to 1,714 (+842); Judge Enforcer Build 98,047 to 98,889 (Alt and R2 Alt alike +842); Shared Library 919,911 to 920,758; library sha 149c230b4910052d.
    - Shown in run 36968: 18 rows carry the form, all on defender premises 5 and 6, none on the challenger; hydrogen counted 5 and 6; terra and sol answered KEEP; luna's change was refused by pkgPS; 0 K-UNX rows (W2 6178). The aim was reached by 1 of 3 judges.
    - Limits: the rule is symmetric and counts book-side steps that cite their own links; grants of the borrowed links are not checked (W4 6188).""",
 "6154, 6158, 6159-6161 (listed), 6162, 6163-6165 (6164, 6165 read), 6166, 6167-6170 (listed), 6171, 6172-6173 (listed), 6174, 6175, 6176 (listed), 6178, 6188")

add(5, *S8, "", """- THE JUDGE IS TOLD THAT A STEP BORROWED FROM ITS SIDE'S OWN CONTESTED LINKS CARRIES NOTHING (pkgJBC rev 2; nodes Panel Build and Build Independent Verdict; ASK 262):
  - Why: in run 36968 terra and sol kept premises 5 and 6 spared on the judge's own rule "SELF-SUPPORTED = ... (at least two prior layers exhibited; a shown chain counts equally)". The pkgBCL sentence sits only in LIB 3204, which only the Judge Enforcer Builds read (W2 6178 B).
  - What it does: in each node (1) the layer sentence reads "... a shown chain counts equally, save a step borrowed from its own side's contested links, which carries nothing (pkgBCL))."; (2) "shows the chain from them to the link is SUPPORTED" reads "shows the chain from them to the link, with no borrowed step, is SUPPORTED" (2 places); (3) after "...which is never applied." (2 places, the defender and the challenger UNEXHIBITED paragraphs) the borrowed-footing rule is added with the count form "Premise <N>: UNEXHIBITED ([L4] footing borrowed from contested Links <n>)", the step quoted after it, NARROWED or not; not a missing-row charge (DG-61). Nothing deleted.
  - Size: Panel Build 147,168 to 148,811; Build Independent Verdict 121,761 to 123,404 (+1,643 each). [MISSING: measured prompt increase per judge call for rev 2; only the rev 1 estimate of about +1,150 is posted]
  - Shown offline: of 24 stored judge-premise pairs, 6 are already COUNTED and 18 would flip (defender 11, challenger 7), assuming no borrowed link was granted (W4 6188).
  - Shown in run 37000: judges wrote the count unprompted: defender premise 6 (sol, chatgpt; luna after send-back S8) and challenger premise 3 (all three); stored defender count 1 per judge (W1 6211 A). The operator ruled that Oracle premise 3, whose step names Link 1 and lists its verses inline, "Keep it as written" (W4 6223).
  - Limits: symmetric by ruling; the count met K-UNX-A and pkgRCT (see pkgBFX).""",
 "6176 (listed), 6178, 6179, 6184-6186 (listed in 6188), 6188, 6192, 6196, 6198, 6209, 6211, 6213, 6223")

add(6, *S9, "  ", """  - A CONCEDED LINKS LINE WITH NESTED BRACKETS IS READ WITHOUT LOSING OR LEAKING PREMISE NUMBERS (pkgPSN; Shared Library lines 1377 and 2645 counted from 1, the two psGrades definitions; 18 users; ASK 263):
    - Why: in run 36968 luna's change was refused by pkgPS ("regrades premise 1 beyond its items"). psGrades stripped only innermost parentheses, so the prefix "(RETRACTED D6 vs C6 (DEFENDER LINK BROKEN to UNDERDETERMINED); ...)" read premises 1, 3 and 5 COUNTED; without it, 5 (W4 6188).
    - What it does: the first strip stays. A loop then removes each enclosing parenthesis whole when it holds no grade word, and when it holds one (VOID, UNEXHIBITED, CONCEDED, counted, spared, SUPPORTED, NARROWED, STANDS) removes only the bracket marks and keeps the words; it repeats until nothing changes. A plain strip to a fixed point was dropped: it deleted the grade word of "CONCEDED (stated)" (judgments 688, 726).
    - Size: LIB 1377 298 to 472; LIB 2645 157 to 331; Shared Library 920,758 to 921,114 (+356); each of 18 users +174; library sha 7582587ef17b5a26; prompt 0.
    - Shown offline: luna's 36968 lines read 1, 3, 5 before and 5 after. Of 883 stored judgment lines with a bracket 2 differ, both corrections (1011 gemini; 1173 hydrogen, which read the pkgBCL form with "((L4)" as counting 2 and 3 as well); of 344 enforcer-log lines 2 differ (the luna lines). W1 PASS (6203).
    - Shown in run 37000: not exercised on its fault. The nested recount prefix came back but no refusal arose; the new reader reads chatgpt's line as {} with no leaked number (W2 6213 C, W1 6211 B).
    - Limits: Assume Check Record's own psG copy and LIB 2656 (__oc) are left unchanged.""",
 "6181 (listed), 6188, 6189 (listed), 6196, 6200, 6201-6203 (6203 listed), 6205, 6206 (listed), 6211, 6213")

add(7, *S9, "  ", """  - A COUNT THAT GIVES THE BORROWED-FOOTING GROUND IS NOT UNDONE BY K-UNX-A, pkgRCT, pkgEPK OR THE pkgEPS HOLD (pkgBFX rev 2, ASK 265; Shared Library lines 452, 3465, 1390, 2938, 3403 counted from 0; 31 users):
    - Why: in run 37000 luna counted challenger premise 3 as "UNEXHIBITED ((L4) footing borrowed from contested Link 1) -- STEP ... -- ASSUMES ... -- ROWS GIVE ...". K-UNX-A read the ASSUMES ground and luna cured with CORRECTED COUNT 0; its 4 recounts in the new form were refused by pkgRCT, because unxLack of the form names no layer (W1 6211 C, W2 6213 B3).
    - What it does: with the test /footing\\s+borrowed\\s+from\\s+contested\\s+Links?\\s+\\d/i (a link number is required): (1) unxaCheck does not fire on a premise whose count carries the ground (both copies); (2) rctCheck accepts it in premise j's own segment of the CHANGE TO, or in a reason that names no premise or premise j; (3) pkgEPK no longer tags such a push "must name the layer the block lacks"; (4) epsHold returns null for it.
    - Size: with ASK 266, jsCode 921,114 to 923,419 (+2,305); LIB 452 992 to 1,151; 3465 124 to 283; 1390 171 to 610; 2938 374 to 440; 3403 1,559 to 1,662; library sha 08b8409e079687c6.
    - Shown offline: on run 37000's own lines the exit fires for luna's S8 cure (38163), challenger original (37835) and recount (38204); a plain ASSUMES count, alone or beside a borrowed count of another premise, is not exempt.
    - Not shown by a run: 0 rows carried "footing borrowed" in run 37032 (W4 6258).
    - Limits: a mixed borrowed-plus-ASSUMES line skips K-UNX-A whole; E-PREM still reads the step.""",
 "6211, 6213, 6221, 6225-6227 (listed), 6229, 6230-6232 (listed), 6233, 6258")

add(8, *S9, "  ", """  - A COUNT THAT NAMES A PREMISE ABOVE THE LISTED BLOCKS IS SENT BACK (K-UNX item a:'RANGE'; pkgBFX rev 2, ASK 266; library lines 466 and 1219 counted from 0; TRIAL like all K-UNX):
    - Why: in run 37000 luna wrote "Premise 7" and "Premise 8" against a defender list of 6, matching the superseded 8-entry round-1 list; nothing checked the number (W1 6211 E, W2 6213 B2). The operator first answered "Leave it out for now" (10:04 CST) and then "i approve all" (10:08 CST); the later word governed (W4 6224, 6229).
    - What it does: when an UNEXHIBITED count names premise j, j has no block in the side's round and j is above the highest listed block, kunxLines raises "counted UNEXHIBITED in <label> as premise j, but the list against the <side> has premises 1 to <mx>". It asks for a CHANGE TO with the listed number or a CORRECTED COUNT without it; a KEEP does not cure. The cure check marks it CURED by a CORRECTED COUNT below the count, otherwise UNCURED; a CHANGE TO that renumbers clears it. It removes no seat.
    - Size: LIB 466 194 to 1,055; LIB 1219 47 to 522 (inside the +2,305 of the entry above).
    - Shown offline: over 272 CONCEDED LINKS lines of the 25 latest stored Oracle debates, 3 lines gain the item (premise 8, premise 8, premises 7 and 8); no stored count fell in a gap (3 DR3 rounds list 1 to 5).
    - Not shown by a run: 0 RANGE rows in run 37032.
    - Limits: UNEXHIBITED counts only; "CONCEDED (stated)" numbers are not read (hydrogen 36791 premise 7 raises nothing).""",
 "6211 (E), 6213, 6224, 6229, 6233, 6258")

add(9, *S9, "  ", """  - E-COL IS NOT DECIDED BY THE MEANING TEST WHEN THE BREAK'S GROUND IS MISSING OR BORROWED FOOTING (pkgECB, part of pkgEPC rev 2; library lines 3198, 2958 and 3061 as W4 6248 numbers them; ASK 267):
    - Why: in run 37000 luna's E-COL S5 (38160) read "D5 vs C5 (Acts 2:30): DEFENDER LINK BROKEN ... without footing for her Davidic house, and its stated support borrows contested links", and the answer turned it to UNDERDETERMINED; D5 STANDS in all three final keystones (W1 6237 A1).
    - What it does: E-COL only; E-KEY untouched; no DG-8 text. (1) RULE E-COL gains THE FOOTING RULE before the AGREE/DISAGREE sentence: a LINK BROKEN line whose ground is missing footing, or footing borrowed from its own side's contested links, is not decided by the meaning test; a fit resting on that same step, or on the answering side's own contested links, is not a fit; DISAGREE only when the enforcer quotes the answering side's own words footing the step on rows that are not its contested links; a line that only says no verse states the step is still an absence (DG-61). (2) The judge send-back carries the same, plus "or on a step you yourself counted UNEXHIBITED". (3) A CODE CHECK line is added on the E-COL item when the LINK BROKEN line's text before GROUND names missing or borrowed footing.
    - Size: rule text +909 characters, sent whole in every enforcer call; the ESR_W weight for E-COL is unchanged. Library +1,929 for all four parts of pkgEPC rev 2.
    - Shown offline: on 254 distinct stored LINK BROKEN lines the code check hits once (luna 38160).
    - Not shown by a run: in run 37032 the rule was in 11 enforcer prompts; no break had a footing ground, so the code check fired 0 times (W4 6258).
    - Limits: watch items are an E-COL DISAGREE on a descent line (W3 6249) and a KEEP form that fits a meaning break only (W2 6251).""",
 "6235 (listed), 6237, 6245, 6248, 6249-6251 (listed), 6252, 6255, 6258")

add(10, *S9, "  ", """  - A SEMICOLON INSIDE A LAYER FIELD DOES NOT START A PRESSED-WITH ENTRY (pkgPWS, part of pkgEPC rev 2; five copies: library line 4, Panel Build, Build Independent Verdict, D4 Build (PRS START), Build Save Body (ST); ASK 268):
    - Why: in run 37000 a review note read "[DR2] premise 6 carries 9 verses ... over the cap ...: Hebrews 2:17", but the last PRESSED WITH block has 8 entry lines. Ezra 2:59 is an [L3] row after a ";" inside the Hebrews 7:14 line and was counted as a ninth entry (W2 6242). The operator told the team to fix it (W1 6245 point 2).
    - What it does: a ";" starts an entry only when it is outside a layer field ("-- [Ln]" or "| [Ln]" up to the next "|" or line end), or when the text after it up to the next ";" or line end holds "-- MEANS" (alternative `;(?=[^;\\n]*--\\s*MEANS)`). One-line semicolon lists still count.
    - Size: node deltas for the whole of pkgEPC rev 2: Panel Build +767, Build Independent Verdict +761, D4 Build +63, Build Save Body +63, Citation Scan +573; Shared Library +1,929. [MISSING: pkgPWS alone]
    - Shown offline: of 1,082 stored PRESSED WITH blocks (60 debates), 3 change, all this fault (37000 [DR2] premise 6, 9 to 8; fc117c3b 9 to 8 and 10 to 8). Rev 1 missed an entry's [L3] field followed by "; Luke 1:34 "..." -- MEANS"; rev 2 adds the MEANS alternative (W1 6250 F1).
    - Not shown by a run: no PRESSED-WITH CAP mark in run 37032.
    - Limits: a layer ";" followed by an entry with no MEANS still reads as one entry (W2 6251).""",
 "6237, 6242, 6243, 6245, 6248, 6250-6251 (listed), 6252, 6255, 6258")

add(11, *S8, "", """- THE JUDGE IS TOLD THAT THE NUMBERED LIST IN [DR1] IS NOT THE COUNT LIST (pkgCLN, part of pkgEPC rev 2; nodes Panel Build and Build Independent Verdict; ASK 269):
  - Why: in run 37000 luna counted "Premise 7" and "Premise 8" from the 8-entry [DR1] list, but the count list is the 6-entry list that closes [DR2]. Judges are served both lists and no line said which counts (W4 6243).
  - What it does: after [DR1], when it holds an UNSUPPORTED-L4 PREMISES list, the system appends "[COUNT LIST NOTE -- computed by the system, not by a model (pkgCLN, ASK 269): the UNSUPPORTED-L4 PREMISES list in [DR1] (numbered 1 to 8) is not the count list. L, c, every count of CONCEDED or UNEXHIBITED premises and every "Premise <p>" read only the list that closes [DR2] (numbered 1 to 6).]" The two numbers are computed for each debate.
  - Size: [MISSING: pkgCLN alone]; node deltas for the whole of pkgEPC rev 2 are given under pkgPWS.
  - Shown offline: 52 of 60 stored debates get the note (24 where both lists number 1 to 6).
  - Shown in run 37032: the note in 38591 reads "[DR1] (numbered 1 to 7) ... [DR2] (numbered 1 to 6)"; a SQL count of the rounds agrees; no judge counted a premise above 6 (W1 6259).
  - Limits: a later prose "12." in [DR1] could inflate its number (W2 6251); not changed, since no stored case shows it.""",
 "6211 (E), 6237, 6243, 6245, 6248, 6251 (listed), 6252, 6255, 6259")

add(12, *S12, "", """- A BARE "verse N" IN AN [L2] ROW BINDS TO THE CHAPTER OF ITS BLOCK'S REFERENCES WHEN THEY ARE IN ONE CHAPTER (pkgVBN, part of pkgEPC rev 2; Citation Scan only; ASK 270; ruling W3 6246):
  - Why: in run 37000 a challenger block had [L1] Luke 1:32 and an [L2] row "The dio kai ('therefore also') of verse 35 ..."; the binder tied the tag to Luke 1:32 and Luke 1:34 and marked the word not in them, though dio kai stands in Luke 1:35 (W2 6242). W3 ruled that an [L2] row may name any verse the same block cites, not only the block's [L1] verse (W3 6246).
  - What it does: a bare "verse N", "verses N" or "v.N" in an [L2] row binds to a chapter only when every full reference the tag is already bound to (its row and its block, as the binder reads them) lies in one chapter; otherwise nothing is added. The lexicon map still decides whether the word stands there.
  - Size: Citation Scan +573 characters; calls 0.
  - Shown offline: over 5,472 stored tags 11 change, all same-chapter adds in Luke 1 or Matthew 1, among them 37000 dio kai (+Luke 1:35). A wider form using the [L1] rows bound "verse 20" to Luke 1:20 and "Verse 35" to Matthew 1:35 and was dropped.
  - Not shown by a run: in run 37032 the DR2 dio kai tag sits in a block that spans many chapters, so no binding was made and it stays NOT COUNTED (W4 6258).
  - Limits: a block whose full references span more than one chapter is not resolved (W3 6246 limit b).""",
 "6235 (listed), 6237, 6242, 6245, 6246, 6248, 6252, 6255, 6258")

add(13, *S9, "  ", """  - A NARROWED PREMISE IS TESTED ON ITS KEPT CLAIM, NOT ON THE SENTENCE THAT DISOWNS THE LIMB (pkgNRW rev 3; Shared Library line 3120, the E-PREM item, and line 3202, RULE E-PREM; 3 users; ASK 272):
    - Why: in run 37032 defender premise 6 was narrowed: the kept claim "the child's flesh is David's by the one of whom he was born ..." still takes the dropped limb "Mary of the house of David" as given, while the block says "The limb ... is dropped as an assumption" (W1 6270, W4 6273).
    - What it does: (1) when the answering block is headed "LINK n: NARROWED TO" or "LINK n [premise m]: NARROWED TO", the E-PREM item gets a system line "NARROWED (computed by the system, not by a model; pkgNRW, ASK 272): THE KEPT CLAIM: ... | WHAT THE BLOCK DROPS OR DISOWNS: ..." (up to 4 of the side's own drop sentences; a bare concede or grant, or a sentence about the other side, is not a drop). (2) RULE E-PREM: "UNEXHIBITED only when" loses "only", and a premise is also UNEXHIBITED when the kept claim holds only by taking the dropped limb as given and the [L4] does not conclude it from its rows, written "(UNEXHIBITED: the kept claim takes as given <the dropped limb>, which its rows do not give and its [L4] does not reach)". An [L4] that reaches the kept claim from its rows is SPARED; a disowning sentence is not footing; not a stating-verse demand (DG-61); both sides alike.
    - Size: LIB 3120 240 to 1,916; LIB 3202 1,856 to 2,684; Shared Library 925,348 to 927,952; library sha c7e7505f6d74d860; each of 3 users' map length +476 (W1 6289).
    - Shown offline: over 428 NARROWED blocks of the last 200 debates, rev 3 gives 421 lines (the 63 "[premise n]" headers are new), 0 empty kept claims, 89 lines changed; count readers unchanged. W2 6288 and W1 6289 PASS; live readback PASS (W1 6297).
    - Not shown by a run: live and unexercised at s198 (W1 6297).
    - Limits: 7 blocks are not covered (6 headed "LINK n: SUPPORTED, narrowed ..." and 1 "Premise 1: LINK 1: NARROWED TO:"); 18 of 43 challenger kept claims name the union, knowing or fatherhood and get the same test.""",
 "6264-6271 (6270 read), 6272 (listed), 6273, 6275 (listed), 6278 (listed), 6280 (listed), 6283-6286 (listed), 6287, 6288, 6289, 6295, 6297")
