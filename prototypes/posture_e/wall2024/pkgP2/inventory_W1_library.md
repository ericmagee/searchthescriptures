# Reader phase 2 inventory, W1 half: the 22 library nodes

W1, 2026-11-07. Eric approved the track at 16:50 CST. Source: pkgLIB_v14 orig_stack (= live s49 library + pkgMIM + pkgKFN + pkgKCR).
Raw scan: `node pkgP2/scan_lib.cjs > pkgP2/scan_lib.tsv`. It lists 316 regex literals that name a form or answer word, by enclosing function
and the number of nodes that carry it. The shared reader is entered 148 times (`__RL.readLine`), all from rcLines, cureLines, ks2Lines,
selfLines421, SB_ROW/SB_FORM and the gate readers that phase 2 already swapped.

The scan also catches regexes that read **debater** round text (PRESSED WITH, UNSUPPORTED PREMISES, LINK blocks) or **engine** text (AUDIT
marks, cure reports). Those are out of scope for the judge-line reader and are listed at the end only so nobody re-scans them.

Classes: **F** = reads a judge line form outside the reader. **W** = reads an answer word or phrase in a judge's RESPONSE or STATEMENT (no
spec form exists). **Q** = quote matching (judge quote vs round text). **L** = label list that decides which lines are read.

## A. Judge line forms read outside the reader (F)

| # | Function | Reads | Faults it has caused | Note |
|---|---|---|---|---|
| A1 | kfLines, kffLines, kfcLines, pairOf, id, gateForced2024, FR, PR | FORCED lines (head regex; fields via KF_LINE, already the reader) | | The head test is duplicated 8 times; the reader has FORCED. |
| A2 | kagRow0, ac, gateAnsGround2024, dptCheck | ANSWER CHECK lines | | pkgACR moved kagRow to the reader; these four still use their own regexes. |
| A3 | kkLines, KS, keyChecks, krulRulings, sbBrokenWord2024 | KEYSTONE lines | | The reader has KEYSTONE. |
| A4 | psGrades, CNT_HEAD, ciCountSection, drvCountLine, lineOf, block, __kg1lCount, gateCure2024, k2Marks, voidCounts, CL | CONCEDED LINKS / CHALLENGER CONCEDED LINKS lines | 33442 K-G1 (pkgKG1L) | 11 separate readers of one form; the reader has CONCEDED. |
| A5 | drvBroken, drvCheck, cureBroken, cureRecompute, __tie421, drvBrokenPW, netLines, scLines, GR, cAudit, krulMatch | collision and link-state lines (D vs C GRADE, D: STANDS) | | rcLines is on the reader; these are not. |
| A6 | CM | CHAIN MARK lines | 33345 CHAIN MARK K-C (pkgKCR) | |
| A7 | krulRestated, readLine's RESTATED wrapper | RESTATED lines | 33482 gemini K-C (pkgKCR) | Spec G12 says RESTATED: REASONING is NOT_A_FORM, but the cure ask requests it. W3 to rule (Wall 2986). |
| A8 | KR_LINE, krLines | REFERENCE lines | | No spec form. |
| A9 | CI_LINE, CI_PRESSED, ciForm, ciRulings | PRESSED / NOT PRESSED citation lines (judge) | | Reader has PRESSED in the cure form only. |
| A10 | kcmtGrade2024, postureBlock, GROUND_HEAD, NET_HEAD, lab | Line-head lists (RESULT, CLAUSE, STANDING, ...) for K-CMT and net checks | | |

## B. Answer words in RESPONSE / STATEMENT text (W)

There is no spec form for these. Each rule has its own regex for what counts as an answer. This is where 33461 sol (K-S3) and pkgEST came from.

| # | Function | Rule | Reads |
|---|---|---|---|
| B1 | kwSt, kwCo, kwRe, KWK, __rn, RX | K-W | STANDS WITHOUT IT because, CONCEDED, REASSERTED IN [round] "...", grant/withdraw words |
| B2 | rq, orcLines, the K-S3 branch (TOUCHES NO LINK / COUNTED / NOT HELD 6-word bar) | K-S3 | answer words and the 6-word quote bar |
| B3 | kconLines2024, kconUnlabel, krulCure, vcCaught2024, kagCure | K-CON, K-RUL, K-AG | CONTRADICTION / NOT HELD / REASSERTED IN |
| B4 | DRV_STATE, DRV_NEG, NET_ANSWER, NET_ANSWER_R, NET_REPORT, NET_CONC, KN_SURR, KK_GROUND, UNX_MGROUND, UNX_OTHER, UNXA_HARD, g4Unans2024, kg4Split, drvGround, ks2Grounds, sbKeyExempt2024 | K-C, K-N, K-K, K-G4, K-UNX, K-S2 | phrases inside a GROUND or REASON field |
| B5 | cureReasoned, __l1qSq | cure reasons | the round named in a reason |

## C. Quote matching (Q)

Each matcher normalises differently. KFN (numbered list), MNQ (inner quotes) and L1Q2 were all faults here.

| # | Matcher | Calls | Normalises |
|---|---|---|---|
| C1 | ciFound / ciQ | 157 / 44 | unescape, strip markdown, fold curly quotes, drop all quote marks, collapse spaces; "..." splits |
| C2 | cureFound / cureQ (+ cureFoundAll) | 323 | like ciQ, plus (Ln)/(CRn) read as [Ln]/[CRn]; no list markers; cureFoundAll also splits "a" and "b" |
| C3 | kfFound (+ __kfLB, __kfIN) | 66 | ciFound plus list markers at line start; pkgKFN adds inline markers |
| C4 | krulNorm | 261 | lower case, drops quote marks and [Ln]/[Rn], keeps only letters, digits, Greek and Hebrew; used by the K-S3/K-W 6-word bar and K-RUL |
| C5 | kkjvFold, KKJV_Q | 308 | KJV quote folding for K-KJV |
| C6 | cureNamed, nhqFull | 57 / 82 | named-verse windows and full quotes for K-G1/K-G4 |

**Proposal for C (for W3):** one spec section, "quote found in round". It would name one normaliser (unescape once, markdown, curly
quotes, inline and line-start list markers, whitespace, ellipsis split) with optional extras (KJV fold), and send every matcher through it.
The replay lists every found/not-found flip.

## D. Label lists (L)

LAB (cureLines), CURE_KEY, NET_HEAD, lab, GROUND_HEAD, STOP, LBL, postureBlock. These are separate lists of the same labels. KCR showed one
of them can miss a label the prompt asks for. They should come from one list in the reader.

## Out of scope: debater round text or engine text

PRESSED WITH (pwList, entries, kvCharges, kvUni, sheetPlan), UNSUPPORTED PREMISES (pwHead, ciPlist, lbBlockText, drvBlocks, premiseMap,
unxPresses), premise lists (unxSegs, lbVoid, PW_SEG, r2, TAG, TAGC, W, COUNTED, kvSegments), LINK blocks (blockAt), layer tags in rounds
(tags, re, netFoot, lbFoot, footLocal, countClaims, drvLayersByTag, PW_FOOT, PW_FOOTGROUND), PREMISE COUNT (PCRE, seqCount, seqLines), and
engine text (rx, cureSafe, cureSet, cureCorrected, vcRev2024, sideOf, sub, unxaCheck, kfcVerse, KFC_CB). The reader's own internals
(readLine, parse, tags) are also excluded.

## Suggested order (W3 decides)

1. **C, quote matching.** It caused 3 of today's 5 faults.
2. **D plus A7, labels and RESTATED.** Fixes the KCR family at its root and settles spec G12.
3. **A4, CONCEDED LINKS.** It has 11 readers of one form, and it is the count the K-G1/K-G3 seat rules turn on.
4. **B1 and B2.** Give the answer words of K-W/K-S3 a spec form (RESPONSE/STATEMENT answer), since both are LIVE.
5. Then A1 to A3, A5, A6, A8 to A10, and B3 to B5.
