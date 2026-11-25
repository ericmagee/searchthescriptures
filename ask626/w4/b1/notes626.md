# ASK 626 BUILD (W4): read bold and heading numbered premise lists; LIST NOT READ in place of FORFEITED

Plan: ask626/w4/plan626.md rev 1 (W1 PASS with N1, N2). Operator "Build it" 21:01 CST 11-24.
Base: live engine 2df7f6fa fetched 21:01 CST (b1/base_eng.json), child aad0ad9c (b1/base_child.json). The child holds no list reader (searched: no node with the heading or a numbered-item pattern), so this is an ENGINE-ONLY write.
Build: b1/b626.cjs. Target: b1/tg/target_engine_626.json. Tests: b1/t626.cjs.

## THE ONE HEAD FORM
Every premise-list reader now takes the same head: optional heading marks, bold marks, the number, "." or ")", optional closing bold marks, then a space.
- Readers with the LINK form: `\s*(?:#{1,6}\s*)?\**\s*(?:\d+[.)]\**\s|LINK` (was `\s*\**\s*(?:\d+[.)]\s|LINK`).
- Readers without it: `\s*(?:#{1,6}\s*)?\**\s*\d+[.)]\**\s` (was `\s*\**\s*\d+[.)]\s`).
- listCount keeps its own `[*_]` class: `^\s*(?:#{1,6}\s*)?[*_]*\s*\d+[.)][*_]*\s+\S`.
Node code is not served the Library, so each node holds its own copy. "One pattern" here means one spelling in every copy; the test runs each copy and fails on any that reads differently.
THE STYLE LOCK (rev 1). The first premise head sets the form. If it is a "#" heading, a plain numbered line under it stays inside its premise. If it is plain, a "#" numbered line stays inside the item it falls in, as it does live. In split readers the lock walks the split pieces, so a merged line keeps every newline; a blank piece is dropped only when a head of the locked form follows, which is what the live filter does. listCount counts only heads of the first head's form. It is one spelling everywhere (the reduce in b626.cjs WALK).
Why: the all-runs screen found run 42234 [CR3] (8dd067f4, 11-24), with "### k." premises and "1. 2. 3." lines inside premise 1. Live reads 3 there (the inner lines, wrong). Without the lock the new readers read 9 (wrong); with it they read 6. It also found d9924563 (an August-format round), where "#### k." section headings would have become premises. With the lock, the stop-bounded readers read it byte-equal to live. The readers with no body-end stop (C3 Extract, C3 Build harvest and side(), C4 Build side(), LIB 437 unxPresses, LIB 3716 OAN harvest) still change their items there from 6 to 7 (live reads the six "1. **Why ...**" answers; new reads the seven "#### k." sections). Output is equal: the text has no "PRESSED WITH:" line, so both harvests return [], and C3/C4 Build look for "UNSUPPORTED-L4 PREMISES" (hyphen), which the text does not hold, so they never read it. Found by the F1 stored-rounds run, not by the SQL screen (which emulated stop-bounded readers only). Residual: a stopless reader on a list whose first numbered line after the heading is a "#" section heading would take the headings; no stored list shows that with a PRESSED WITH line.
A "### 1." item no longer ends a list body. Every body-end stop of the form `#{1,3}\s` now carries `(?![ \t]*\**[ \t]*\d+[.)])`.
Every changed line carries `/* ASK 626 */`: 32 node lines and 9 LIB lines.

## LIST NOT READ (plan change 2)
lnr626(s) is true when the heading has text under it and no "PREMISE COUNT: 0", "none" or "no premises" line. It is one spelling in Build Save Body, Format Markdown, Panel Build and Build Independent Verdict, and one function on LIB 996. A list is "not read" when the heading is present, the reader finds zero premises and lnr626 is true.
- Review notes (Build Save Body) and transcript (Format Markdown) print "LIST NOT READ: <side> -- the heading is present but the system read no premise under it; grade the list from the round text" in place of LINK ROUND FORFEITED. FORFEITED stays for a missing heading, "PREMISE COUNT: 0" or an empty list.
- Judges' PRESSED-WITNESS LEDGER (Panel Build, Build Independent Verdict): side() carries unread, and sideLines prints that line under the side's label in place of an empty side. This is the one judge-facing change (N1). The judges' own FORFEIT rule text is untouched (N2).
- K checks: pwList (LIB 997-999) returns null for an unread list, which is how it already reports "no list". Every pwList consumer (K-G10, K-P, K-R, broken-press, gate PL, prsUnprovenOnly) therefore raises nothing on that side and no count comes from it.
  - The guard is on LIB 999, pwList's own line. LIB 998 is shared with kvCharges (1017) and kvUni (1026), which keep [].

## C1: EVERY READER, CHANGED OR EXEMPT
CHANGED (each run old and new in t626):
- Nodes: D3 Build items; D4 Build items; Panel Build items, ledger side()/sideLines, preCheckSide (stop and split); Build Independent Verdict (the same three).
- Nodes: Build Save Body (PRESSED-WITH cap reader line 270, listCount, FF); Format Markdown (listCount, FF); Assume Check Build (vp4List, vp4All, vp525R2 split, head and stop; line 37 items).
- Nodes: C3 Build items and OAN harvest; C3 Extract harvest; C4 Build items; C2B, D3B and C3B Extract __LC423 (count and stop).
- LIB:
  - 437 unxPresses;
  - 996 lnr626;
  - 998 items of pwList, kvCharges and kvUni;
  - 999 pwList unread guard;
  - 1027 kvUni premise-head strip;
  - 1672 gate PL;
  - 2035 premiseMap and pressed (2865);
  - 2550 send-back ledger;
  - 3716 OAN harvest (O423 C3B Extract, X2 C3G Extract).
- MAP n updated for 31 keys.

EXEMPT, with reasons:
- Already read "**1.**", "### 1." and "#### **1.**", because they need no space after the number:
  - LIB 2326, and MAP inline strings Extract Independent Verdict #134, #140 and #181: `^(?:#+\s*)?\**([0-9]+)\.`;
  - Assume Check Build line 39 and LIB 1673: `\d+[.)]\s*)?\**\s*LINK`.
- Answer-block bounders, not list readers: blockAt (LIB 19, 124, 3573; Panel, BIV and D4 Build) and linkHead (LIB 126, 3574). They bound LINK answer blocks in link rounds. Scope rule.
- LIB 231 PRESSED WITH segment end: it ends at a blank line first, which comes before every 42373 item.
- Judge-output and label line readers, outside scope: about 120 `(?:[-•]|\d+[.)])?` strips (FORCED, D vs C, ANSWER CHECK, CONCEDED LINKS, REFERENCE), Citation Scan, Alternate Merge COL, Reread Record, Enforcer Retry Build, the __LB423 LINK label RE, and Reserve Build and Panel HEADS.

## TEST RESULTS (b1/tg/out_t626_42373.txt: 233 PASS, 0 FAIL; with stored rounds b1/tg/out_t626_stored.txt: 234 PASS, 0 FAIL)
- F1 (W1 Wall 11918): t626 arg 4 on fx/stored8.json (md5 e166722b; 8 rows, 16 texts, each md5-checked against SQL: 12957d6e, 7124c5fb, 8dd067f4, b52fe836, d9924563, e7f6922f, efc9ff05, fd0edbff). 256 reader runs: 202 byte-equal; 32 newly read, all intended (42373 e7f6922f and 42505 12957d6e [CR3], "**k.**", live 0); 22 changed: 16 intended (42234 8dd067f4 [CR3] 3 to 6, every reader) and 6 items-only with equal output (d9924563, see the style lock note). The test now names each intended change with its reason and fails on any other.
- C2 on 42373 [CR3]:
  - Every changed reader reads 0 live and 6 new. pwList CHALLENGER reads 0 live and 6 new.
  - Premise 5 carries Hebrews 7:14 and Hebrews 7:5; premise 6 carries Ruth 4:13.
  - Live K-G10/K-P on the three 42373 judgments: 2 (chatgpt premise 5 Hebrews 7:14/7:5; premise 6 Ruth 4:13). New: 0.
  - Build Save Body and Format Markdown live write the FORFEITED line; new write none (vsCh.n 6).
- C2 forms: "**k.**", "k.", "k)", "### k.", "#### **k.**", "**k. " and "k. **" each read 6 in order, in every changed reader, listCount, preCheckSide, vp4All/vp4List and __LC423.
  - Not read as a premise: "1 Corinthians 15:38 ...", "- Luke 1:27 ..." and "- 1. Luke 2:4".
- C3 on 42373: the [DR2] "1." list is byte-equal for pwList, premiseMap, vp4All, vp4List, vp525R2, unxPresses [DR3], listCount and preCheckSide.
  - ALL RUNS (by SQL on the live table, after run 42505 ended; the readers' head and lock rule emulated in SQL, not the JS run): 761 stored lists (engine_r2 lists against the defender, engine_r3 lists against the challenger).
    - 758 read the same count.
    - 3 change, all intended: 42373 e7f6922f (0 to 6, bold), 42505 12957d6e (0 to 6, bold) and 42234 8dd067f4 (3 to 6, "###"; live was wrong).
    - Because every new head is a superset of the old one and the lock merges back what old did not split, an equal count means identical items.
    - listCount, by its own exact heading: 755 lists; only 42373 and 42505 change (0 to 6).
  - The real-code runs are on the 42373 rounds and on synthetic copies of the 42373 list in each head form, plus the run 42234 shape (H3IN) and a "1." list with a "### 2." line inside (PLAININ, byte-equal to live). No full stored-round text was pulled into the tests.
  - LIST NOT READ on real data: among the 761, no list with text under the heading reads zero.
    - The zero-read lists are "PREMISE COUNT: 0" (5) or "None identified ..." (0d049796).
    - lnr626 counts "None ..." as empty, so FORFEITED stays. LIST NOT READ would print on none of the stored runs.
  - Body-end stop change, screened by SQL over every round after the first heading:
    - [CR1] efc9ff05 (run 33461) and b52fe836 (run 35173) carry "### k. LINK Dk" lists. Live vp4All read 0 there; new reads 6 and 1 (b52fe836 has "---" between items, and the existing "---" stop still ends it).
    - So Assume Check Build can now see [CR1] premises that carry ASSUMES. That is more list read, not a different rule.
    - The defender R2 hits (7124c5fb, e7f6922f) are not read by a reader with that stop.
  - NOT RUN: the whole judgeBlock/ledger() of Panel Build and BIV (its REFP/PRS dependencies are not loadable offline). Its parts were run: side()'s return and sideLines (extracted), and lnr626. lnr626 is declared before ledger() is first called (Panel 71644 < 74124; BIV 69441 < 71921).
- C4: an unreadable list reads 0 in every reader.
  - pwList gives null and 0 K-G10/K-P items; listCount gives LIST NOT READ; the ledger prints LIST NOT READ naming the side that wrote the list.
  - "PREMISE COUNT: 0" and no heading still give FORFEITED.
- C5: standing 31 PASS 0 FAIL with S4 compile-all (tg/out_standing_626.txt). Pair: Library Check PASSES, engine lib 3cd2d095d2eb30eb (tg/out_pair_626.txt). One-copy (registry_578): PASS (tg/out_onecopy_626.txt). Every changed line is tagged. No dead code.

## MISTAKES CAUGHT IN BUILD
The first build put the null guard on LIB 998, which kvCharges and kvUni share by index. kvUni would have returned null where its callers expect []. Found by mapping every MAP sequence around each changed line; the guard moved to LIB 999 (pwList only).
Rev 0 read "### k." lists without the style lock. The all-runs screen showed it would read run 42234's list as 9 premises and an August round's section headings as premises. Fixed by the lock (rev 1). Rev 0 copies: b626_rev0.cjs, t626_rev0.cjs.
Rev 1's first lock merged after the filter and lost one newline where a blank line came before a merged line. PLAININ caught it; the lock now walks the split pieces.

Hashes (md5 first 8): b626.cjs d11525f0, t626.cjs 58ec7265, target_engine_626.json 424e3765.
