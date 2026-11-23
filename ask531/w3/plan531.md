# ASK 531 plan, rev 1b (W3). Rev 1b adds change 5 (the gate's K-UNX checks accept the cure this plan asks for; W4 10624, W1 note, W3 10627) and criterion 6. It replaces rev 1a (md5 de0e843c), which W2 passed at 10594/10599. Rev 1 replaced rev 0 (md5 947ad221), which W2 failed at Wall 10591: it sent the item to a judge that had already counted the same fact. A judge who spares a premise the assumption check finds unsupported is sent back, and counted if uncured. Plan only: nothing is built or written until the grade passes and the operator presses W4's write card. Times are CST.

## 1. OBJECTIVE
The operator chose "Yes, count it (ASK 531)" at 08:51 CST 11-23 on the card "Count a judge who lets an unsupported premise stand?": "If both readers find a premise's fact unsupported by any verse and the judge spares it, it is sent back. Left uncured, it counts against that judge's seat, like Mary's line in 41418."

Expected effect: in a run like 41418, the challenger's "Mary is of David's line" (charged by the defender in round 2; no quoted row gives Mary's line) is put to every judge. A judge who spares it must count it, or answer with the verse words that state it; otherwise the item counts in that judge's drv_uncured. What the counts then do to the seats and the outcome is the existing rules' result, not predicted here.

Findings (run 41418; Wall 10567, 10570, 10571):
1. The assumption check (E-ASSUME) is record-only: every item row ends "RECORD-ONLY TRIAL (VP4): nothing is sent back and no seat is removed" (rows 51140 to 51145).
2. Before 524/525 it checked defender premises only. Since 524/525 (live 08:46 CST, engine 0e05fc55) it also checks the defender's round 2 charges against the challenger, as premise 91 and up, but those are record-only too and get no judge grade: Assume Check Record sets `spared=p.r2?[]:...`, so no item is ever made for them.
3. Terra and qwen 4 max spared the challenger's Mary premise; only sol 6.2 counted it, under its own number: "CHALLENGER CONCEDED LINKS: 1 -- Premise 3 (C3): UNEXHIBITED. STEP: the flesh-seed reaches the child through the woman's line -- ASSUMES: the woman through whom it is said to pass is in David's bodily line" (judgment 1263). The 524 check numbers the round 2 charge 91 only because its quoted rows differ from the round 3 item (W2, Wall 10591).

SEATS AND MODELS in 41418 (debate_judgments 1263 to 1265; E-ASSUME rows 51134 to 51145):
- seat chatgpt = openai/gpt-6.1-terra (Terra); challenger count 0, premises 1 to 6 spared (1264).
- seat sol62 = openai/gpt-6.2-sol (sol 6.2); challenger count 1, premise 3 counted (1263).
- seat sol = sol 6.1; removed with drv_uncured 6 and replaced; it was on the panel when the assumption check ran, so the E-ASSUME rows name it. Its verdict is in debate_results drv_removed.
- seat qwen4max = qwen/qwen4-max (qwen 4 max), seated as the alternate for sol; challenger count 0 (1265).

## 2. ROLES
- Planner: W3.
- Builder: W4.
- Grader: W2 (not the builder).
- Card: W4's write card in W4's thread, pressed by the operator.

## 3. SCOPE
Base: the live engine 0e05fc55 (with 524/525) and its child, plus whatever of 526, 527 and 523 is live at build time (stacked, ASK 445).

1. ASSUME CHECK RECORD (engine node, and the child's node of the same name). Items are made as today, from facts that both readers find NOT STATED, with two changes:
   a. A round 2 charge (r2, premise 91 and up) that both readers find NOT STATED makes an item for each judge that does NOT already count the same fact, in place of no item.
      THE SAME-FACT TEST (code): the judge counts the same fact when its CONCEDED LINKS line for that side grades some premise k COUNTED (UNEXHIBITED, CONCEDED or COUNTED), and the text that line gives premise k (its STEP and ASSUMES, up to the next premise) shares with the fact at least two content words, one of them a proper name in the fact. Content words: the fact's words less the stop list Assume Check Record already uses (VP4_STOP, lower-cased) and the words of 3 letters or fewer; a possessive "'s" is dropped; comparison is lower-case, whole words.
      On 41418: fact "Mary is of David's line" gives {mary, david, line}, with names Mary and David. sol62 premise 3 gives {woman, through, whom, said, pass, david, bodily, line}: shared {david, line}, David a name, so sol62 counts it and gets NO item. chatgpt and qwen4max count no challenger premise, so each gets an item. sol: W4 reads its verdict from drv_removed and reports.
   b. GUARD (W2, Wall 10569): an item is made only when this run's E-ASSUME call carried the 524 scope (its prompt holds "EVERY VERSE THE"). So the old one-block reading, which is single verse doctrine, can never count. On a run without the marker, rows stay as today.
   c. The item rows say "ENFORCED (pkgACX, ASK 531): sent back to the seat" in place of "RECORD-ONLY TRIAL (VP4) ...". Fact rows with no item keep their text.
2. SEND BACK BUILD (Shared Library; the same in Alt Send Back Build and R2 Alt Send Back Build). Each seat's acx items join its send-back list as rule E-ASSUME. The item text to the judge:
   "THE ASSUMPTION RULE (E-ASSUME, ENFORCED, pkgACX): premise <n> of the <side> takes as given "<fact>". Neither the enforcer nor the code finds a verse the <side> quoted that states it. Either count it (CHANGE TO your <SIDE> CONCEDED LINKS line, grading premise <n> UNEXHIBITED), or KEEP and quote the verse words, from the <side>'s own rounds, that state it."
   For premise 91 and up, the text adds: "This fact stands in the defender's round 2 charges. If a premise of your own list already carries it, count that premise and name its number. If none does, write it as premise <n> on your CONCEDED LINKS line, and your count rises by one. Count it once."
   For alternates: the item is made from the same facts, with the alternate's own grade read from its CONCEDED LINKS line, exactly as Assume Check Record reads a panel judge's. W4 names where the alternate's items are made.
3. SEND-BACK BLOCK (Shared Library, the same in all three Send Back Record nodes): a new cure reading and count list, pkgACX.
   - CURED on CHANGE when the CHANGE TO is that side's CONCEDED LINKS line and grades COUNTED (UNEXHIBITED, CONCEDED or COUNTED), read by psGrades, either premise n, or (for 91 and up) a premise k of its own whose text on that line passes the same-fact test. ONE COUNT: if the line counts both 91 and a premise k that passes the same-fact test, the item is UNCURED with the reason "the same fact is counted twice" and the change is not applied. psGrades reads one digit today (`\b\d\b`); for this item it must read 91 and up. A CHANGE that also regrades other premises is refused as pkgPS refuses it today.
   - CURED on KEEP when the reason quotes verse words (at least 4 words in a row) found in that side's quoted verses, the same test the STATED reply passes in Assume Check Record (x.found).
   - Otherwise UNCURED. Uncured, not silent, not err, and not skipped by __oaSkip: the item goes in a new list ACXM and is counted in drv_uncured with an AUDIT line, as ECF is ("[AUDIT: ASSUMPTION UNCURED (pkgACX, ASK 531) -- SEAT: ...; ITEMS: ...; counted in drv_uncured.]"). A silent item counts by the silence rule, as today.
   - An applied CHANGE goes through the same apply path as an E-PREM change of the CONCEDED LINKS line. W4 shows that the count and standing then follow (ASK 526 if live).
5. GATE K-UNX (Shared Library, both copies; found by W4 at build, Wall 10624). Without this, the gate flags the very cure that change 3 accepts.
   a. RANGE check (line 467 on 0e05fc55, pkgBFX): a CHALLENGER premise j of 91 and up is not flagged when acx.facts holds a round 2 charge with n = j, side CHALLENGER and both_not_stated. Any other j beyond 1 to mx is flagged as today.
   b. pkgBKC (bkcKeep2024, line 462): besides a fact with the same premise number, it also accepts a both_not_stated acx fact of the same side that the same-fact test of change 1 ties to premise j's ASSUMES clause. Everything else in the pkgBKC test is unchanged. W1's option 2, which sends the cure line 472 names, is not used: line 471 says "a failure of fit is not a missing layer", and an unstated fact behind an exhibited block is a failure of fit.
   c. Both branches stay TRIAL: "it removes no seat; not counted in audit_flags" (line 473). This change moves no count.
6. LABEL: the line near the Library's label text ("an uncured item counts against the seat only under an enforced package its CURE note names") stays true: pkgACX is named on every counted row.

Not changed:
- What the enforcer and the code read (524/525), and pkgBNS (ruling 372 kept).
- Every other cure reading, the silence count, prompts other than the item text above, model settings and every other node.

SEARCH (my fetch of engine 0e05fc55 at 08:47 CST, saved as p531/engine_0e05fc55.json):
- "acx" in the Shared Library: lines 461, 1220, 1225 and 1530 read acx.facts (pkgBNS and the cure reading). Nothing reads acx.items: they are only logged.
- Assume Check Record: items from `both` facts where a judge grade is SPARED; `spared=p.r2?[]:...`; judges read from Panel Payloads bodies (panel only).
- Connections: Anticheat Build -> Assume Check Build -> ...; Judge Contradiction Record -> Assume Check Resume -> Assume Check Needed? -> call -> Assume Check Record -> Panel Cure Needed?. The send-back nodes run later, so acx is known when the send-back list is built.
- Child MqQHRl7mQQ0z8QdT (519 fetch-back): it has its own Assume Check Record node and Shared Library, both reading acx. Change 1 applies to the child's Assume Check Record as well, and changes 2 and 3 to its Library copy. W4 reads the live child at build time.
- NOT SEARCHED: SX4ZWtgHNs96uBOo, c7366RPLb8vdMQg6, Y1VIsNB6KBrs1znP. W4 searches them for "acx", "E-ASSUME" and "VP4" at build time and reports every hit.
- SQL: debate_enforcer_log rule E-ASSUME.

## 4. CRITERIA and DONE
Population: every stored E-ASSUME row. 65 item rows ("ITEM (TRIAL)") in 17 runs, and 34 facts BOTH NOT STATED, all before 524/525 (rows 28742 to 51145). None carries the 524 marker, so under the guard none of them makes an item. "Found nothing changed" is the legitimate result for them.

The criteria:
1. Stored rows: on 41418, 41117, 41102, 41090 and 41043, run as stored (no 524 marker), no item is made and every drv_uncured is unchanged.
2. 41418 under 524 (W1's replay, rec524_41418.txt: challenger premise 91 "Mary is of David's line" BOTH NOT STATED; defender premise 5 STATED): an E-ASSUME item for premise 91 goes to chatgpt (Terra) and to qwen4max as alternate, and to sol as the same-fact test reads its verdict (reported); to no seat for defender premise 5. With the stored send-back replies, which do not answer it, each item is silent and counts; report each seat's drv_uncured and what the removal tests then do.
2a. sol62 (sol 6.2) on 41418: NO item for premise 91, by the same-fact test on its premise 3; its drv_uncured is unchanged.
3. Synthetic cures, one each: a CHANGE that counts premise 91 (CURED); a CHANGE that counts Terra's premise 3 rewritten with "ASSUMES: Mary is in David's line" (CURED, same fact); a CHANGE that counts both 91 and that premise 3 (UNCURED, counted twice); a CHANGE that counts it but also regrades another premise (UNCURED, pkgPS); a KEEP that quotes 4 verse words found in the side's quoted verses (CURED); a KEEP that quotes none (UNCURED, counted).
4. psGrades reads "premise 91 UNEXHIBITED" and "premises 5 and 91 UNEXHIBITED", and still reads every one-digit form as today.
5. Only the named nodes and blocks differ. Both Library copies compile.
6. Gate K-UNX, synthetic:
   - RANGE, known good: "premise 91 UNEXHIBITED" with acx fact 91 is not flagged. Known bad: premise 92 with no acx fact 92 is flagged as today. A premise 7 against a list of 1 to 6 with no acx fact is flagged as today.
   - pkgBKC, known good: premise 3 counted on "ASSUMES: Mary is in David's line" with acx fact 91 "Mary is of David's line" is not flagged. Known bad: premise 3 on an ASSUMES that shares fewer than 2 content words with any acx fact is flagged as today.
   - 41418 as stored: report each K-UNX row before and after, including any on sol 6.2's premise 3 count.

DONE: criteria 1 to 6 shown offline on the build, the write on W4's card, W4's readback MATCH, and the run evidence in section 6.

## 5. WRONG-IF
The plan is wrong if the code's name test does not flag a real unsupported fact: if "Mary is of David's line" reads POSSIBLY STATED (both names found in the side's quoted verse words), no item is made and nothing counts.
- Known bad: W1's 524 replay on 41418 gives challenger premise 91 code NOT STATED and both NOT STATED (rec524_41418.txt). The wrong-if does not fire on the case it must fix.
- Known good: defender premise 5 ("the flesh runs from David to the child through Joseph") reads STATED in the same replay, so no item is made for it, as W2 requires (10569).
- Limit: the enforcer's reply in a run cannot be forced; the replay's enforcer replies are W1's.

The plan is also wrong if the same-fact test misses a counted premise that carries the fact in other words (W2 10591 (d)): then a judge that counted it is sent back. Measured on the one stored case, sol62 premise 3, it holds (shared david, line). A rewording that shares fewer than two content words, for example "the mother descends from Jesse", would miss it. Then the judge that counted it is sent back, and the cure reads it by the same test, so it misses again: the judge either leaves the item uncured, and it counts against its seat (a penalty for a correct grade), or counts the fact a second time as premise 91 (a double count). W2 at Wall 10594 corrected my rev 1 sentence here. W4 reports, over the stored judgments, every counted challenger or defender premise whose text shares one content word or more with a round 2 charge, so the misses are counted before the build passes.

## 6. RUN EVIDENCE
- Case: a released run whose defender charges an ASSUMES fact in round 2, or whose judge spares a premise both readers find NOT STATED.
- Mark: send_back rows with rule E-ASSUME; the seat's verdict_raw carries "ASSUMPTION UNCURED (pkgACX, ASK 531)" when an item is left uncured.
- NO PROBE: both readers' NOT STATED and the judge's SPARED are model outputs that a run cannot force. Until such a run, it is UNEXERCISED.

## 7. INPUTS IN GIT
- This plan, at ask531/w3/plan531.md on claude/untitled-9jle0o (commit given in the Wall post).
- The base: my fetch of engine 0e05fc55 (ask531/w3/engine_0e05fc55.json); W1's 524 replay files, ask524/w1/.
- W4 commits the build, the offline test scripts and their outputs under ask531/w4/.

## 8. STEPS
1. W2 grades this plan. No card.
2. W4 builds on the live engine and child at build time, stacked on whatever of 526, 527 and 523 is live, and runs criteria 1 to 6 offline. W2 grades the build. No card.
3. W4 writes in one write. This waits on the operator's card in W4's thread. The revert is the pre-write fetch.
4. W4 reads back. W3 writes the engine manual entry, which waits on the operator's card in W3's thread.
5. The run evidence is read at the next released run.
