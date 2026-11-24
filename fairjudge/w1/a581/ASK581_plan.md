# ASK 581 plan, draft 1 (W1): LAY's tag reader reads five more tag forms

DRAFT. Nothing is written. Plan grader: W3. Builder and writer: W4, on its own write card, after the operator approves the build.
Assigned by the coordinator (00:36 UTC relay, 18:36 CST): "LAY's tag reader misses five tag forms where the layers are present ... Plan it with a replay on run 41822 and the stored runs, plus negative controls, and W3 grades it." Order: ahead of ASK 562 draft 3.
Base for this evidence: the stacked base that W4 builds 573 on (live engine c188b3cf / child b4f662d4, plus 559+560, 549 and 561+569; I reproduced it myself, Wall 11130). LAY is LIB 3499-3557 (MAP LAY n 13,455 on that base).

## 1. OBJECTIVE
The layers check (LAY, rulings 397 to 400) asks each critical point for two verses, quoted with their references on [L1] or [L3] lines, with an [L1] among them. When a writer has given those verses but tagged them in a form LAY does not read, LAY says the layers are missing. That is a false item, and it is sent back to the debater as a STRUCTURE item.
The ASK 562 classing (fairjudge/w1/a562/CLASS562.md) found nine such forms in the 50 stored rounds. Eight of them are the five forms named by the coordinator; the ninth (#17) is reclassed in section 6.
After 581, LAY reads those forms. Every other item stays as it is.

## 2. ROLES
Planner W1. Plan grader W3. Builder W4, on a fresh live readback. Build grader: a non-builder seat (W1 or W3). Write card: W4's own.

## 3. SCOPE, with the SEARCH that set it
1. SEARCH, the forms. Each of the 10 FALSE items of the 562 replay (blocks562_replay_b.txt #2, 3, 4, 6, 7, 17, 18, 24, 26 and 10) was read in full against LAY's code (verses, inherit, canon566, paired). The forms:
   a. Combined tags "[L1-L3]", "[L1-L2]" and "[L1-L2-L3]" (#2, #3, #4). The segment reader splits on "[L<digit>]" only, so a combined tag opens no segment.
   b. A trailing tag after the quotation: the reference stands before the quotation, the tag stands after it, and only ".", ";", "," or the line end follow (#6, '... "Joseph the husband of Mary, of whom was born Jesus" **[L1]**.'). The reader reads forward from a tag, so it reads the words after the tag.
   c. Two verses under one trailing tag pair, "**[L1][L3]**." (#7: 2 Samuel 7:14 and 7:12). canon566 form 3 rewrites only the quotation directly before the tag, so 7:14 was not read.
   d. A lead-in tag over a list: "**[L1]** The order runs in three steps:" over a numbered list (#18), and "[L2] and [L3], verb by verb:" over bullets (#26). inherit() carries a tag only onto bullets, and only the first tag of the line.
   e. A short reference "24:16" after the book was named on the same line (#24). REFS needs a book name.
2. SEARCH, the code. Every place a layer tag is read in LAY: the tag split in verses(), the BK (quoted above) branch, the paren-tag branch, inherit(), canon566() and paired(). Only verses() (through its pre-pass) and inherit() change. structure(), words(), absent(), the CP heads, the Oracle [L2]/[L4] test and note() are unchanged.
3. SEARCH, the callers. LAY is served from the Shared Library through MAP LAY to every node that loads it (the B Builds and the nodes ASK 559 changed). No node text changes. The library is a shared copy, so both the engine and the child get the same LIB change, and the child Library Check stays the same on both sides.
4. OUT of scope:
   a. The Oracle test for an [L2] line and an [L4] line reads the raw block. It still reads only "[L2]" and "[L4]" as written, so a combined "[L1-L2]" does not satisfy it. This is deliberate: the Oracle's layer form orders each layer on its own line (__ORACLE9, ASK 557 Change A).
   b. ASK 562's own defect #10 (an empty title block) belongs to 562 draft 3.

## 4. THE CHANGE (file fairjudge/w1/a581/edits581.cjs; build build581.cjs)
Three LIB lines of LAY change: LIB 3534 and 3535 (inherit) and LIB 3536 (its last line, the head of verses()). No LIB line is added, so no other MAP entry moves.
1. tag581(l), run on every line before inherit(): a combined tag reads as [L1] if it holds 1, else as [L3] if it holds 3, else as its first layer.
2. inherit(): a tag line that ends in ":" is a lead-in.
   a. Its list may be a numbered list ("1." or "1)") as well as bullets.
   b. When the lead-in holds several tags, the list takes [L1] if one of them is [L1], else [L3] if one is [L3], else the first tag, as before.
   c. Every other tag line works exactly as before: bullets only, the first tag.
3. ref581(l): a bare "C:V" takes the book of the last full reference on the same line. With no full reference earlier on the line, nothing changes.
4. trail581(l): a tag cluster is trailing when:
   - only ".", ";", "," or the line end follow it (bold marks allowed);
   - it stands outside parentheses;
   - and the text before it ends in a closing quotation mark or a ")". It may also end in a word, but only when the tag ends the line and that word is not one of: no, not, nor, or, and, without, a, an, the, its, each, every.
   Its sentence runs from the last sentence boundary outside quotation marks, or from the previous tag, up to the tag. For each [L1] or [L3] in the cluster, one extra read line "[Lk] <sentence>" is added for verses() to read. The round text itself is not changed.
   Lines that begin with [L4] are skipped.
5. verses() order: tag581 on the lines, then inherit, then ref581, then trail581, then canon566.
6. The credit test is unchanged. A quotation is credited only when its words stand in that verse's row. Without rows the credit test is permissive, the same as in W4's replays.

## 5. EVIDENCE (scripts in fairjudge/w1/a581. Base: /mnt/project-files/ask573/w4/stack/base_*_559_549_561.json. Targets: /mnt/project-files/fairjudge/w1/a581/target_engine_581.json and target_child_581.json, built by build581.cjs. Run: BASE_E=<base engine> TARGET_E=<target engine> R41822=<r41822.json> node test581.cjs | replay581.cjs | replay581_562.cjs)
1. build581.cjs on the stacked base (engine 21155110, child 417a53f7):
   a. LIB 3534, 3535 and 3536 change in both copies. Library sha b2c059e0ea3a0e9a becomes 89d25eb67157df22; LIB has 3,582 lines, as before.
   b. MAP LAY n goes from 13,455 to 15,677, and no other MAP entry changes.
   c. The engine Library Sha fed to the child Library Check gives the same value on both sides (map 8dbe4aad6b92291c).
   d. Shared Library size: engine 1,157,501 to 1,159,784; child 1,157,322 to 1,159,605 (+2,283 each).
2. test581.cjs, 19 checks with stored KJV rows (rows.json, read from kjv_verses): ALL PASS.
   a. 7 positive checks: each form is flagged before and passes after.
   b. 10 negative controls stay flagged:
      - a trailing tag with no reference in its sentence;
      - a combined [L2-L4];
      - a bare C:V with no book on its line;
      - a book named without C:V;
      - a numbered list under a tag line that is not a lead-in;
      - a reference that stands in the previous sentence;
      - a prose mention "no [L1], [L2] or [L3] row";
      - an [L4] line;
      - a trailing-tagged quotation whose words are not in its row;
      - and one verse only.
   c. 2 unchanged forms pass before and after.
3. replay581.cjs, LAY as live (no 562), before against after: 117 checks, 761 items before and 761 after, none new and none gone. The checks are:
   a. the 50 stored rounds, each run plain and with the Oracle gate (rows=[] as in W4's replays);
   b. the Oracle first drafts of 41822 and 41418, with their stored rows and the Oracle gate;
   c. the 8 stored rounds of run 41822, with the 41822 rows (and the defender rounds also with the Oracle gate).
   So on the live heads, 581 changes no item today.
4. replay581_562.cjs, with the ASK 562 draft 2 heads, on the same 50 rounds:
   a. 562 alone adds 36 items; 562 with 581 adds 28.
   b. The 8 items 581 clears are exactly the 8 FALSE form items: 29820 D2; 32293 D2 and D6; 32373 D2 and D5; 33107 D4; 33389 CR2 D6; 36212 D3.
   c. The 28 kept are the 26 TRUE items plus #10 (562's own defect) and #17.
   d. No item is new under 562 with 581 that 562 alone did not give.
5. Run 41822's stored rounds (debate_results row f810b760, 8 columns, each md5 checked against SQL; saved as /mnt/project-files/fairjudge/w1/a581/r41822.json):
   a. Live LAY gives 4, 4, 0, 1, 0, 0, 0 and 0 items on claude_r1, engine_r1, claude_r2, engine_r2, engine_r3, challenger_r3, defender_r4 and challenger_r4.
   b. 581 changes none of them, and 562 with or without 581 adds none. 41822's rounds use none of the five forms under a block head.

## 6. CORRECTIONS TO MY 562 CLASSING (CLASS562.md)
1. #17 (32998 D1) is TRUE, not FALSE. Its [L1] line quotes "son of David" and "Mary thy wife" and states no reference. The note's rule is "write its reference and then quote its KJV words, on an [L1] or [L3] line", and LAY already tells the writer to "state the reference". So FALSE is 9, TRUE is 27.
2. CLASS562.md said that these form gaps "already apply to PRESS blocks today". The replay in 5.3 measures 0 changed items on the live heads in 106 checks. The forms exist, but in these rounds they stand only under the "against" heads that 562 would open. 581 matters for 562; today it changes nothing measured.

## 7. RISKS AND LIMITS
1. A trailing tag credits its whole sentence, so a writer who tags one verse at the end of a sentence that quotes two gets both read. The credit still requires each quotation in its own row.
2. ref581 could read a time such as "18:23" as a verse if a book reference stands earlier on the same line. The credit test then looks for the quotation in that verse's row and fails.
3. Cost: LAY grows by 2,222 characters in both libraries (2,283 with JSON escaping). Nothing else changes.

## 8. ORDER AND WRITE
1. After the 559+560 write (559 changes LIB 3547 and 3552 of LAY). It is independent of 573, 575 and 576, which do not touch LIB 3499-3557, but it is built on whatever is live at build time.
2. Then 562 draft 3 is re-run on top of 581.
3. The write script follows write573.sh c232934c: a fresh fetch, a version guard, the build, the pair check and test581 before the PUT, `|| code=000` on both PUTs, the engine revert on a child failure with `|| rc=000`, and a fetch-back compare.
