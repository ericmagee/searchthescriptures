# ASK 531 plan, rev 0 (W3). A judge who spares a premise the assumption check finds unsupported is sent back, and counted if uncured. Plan only: nothing is built or written until the grade passes and the operator presses W4's write card. Times are CST.

## 1. OBJECTIVE
The operator chose "Yes, count it (ASK 531)" at 08:51 CST 11-23 on the card "Count a judge who lets an unsupported premise stand?": "If both readers find a premise's fact unsupported by any verse and the judge spares it, it is sent back. Left uncured, it counts against that judge's seat, like Mary's line in 41418."

Expected effect: in a run like 41418, the challenger's "Mary is of David's line" (charged by the defender in round 2; no quoted row gives Mary's line) is put to every judge. A judge who spares it must count it, or answer with the verse words that state it; otherwise the item counts in that judge's drv_uncured. What the counts then do to the seats and the outcome is the existing rules' result, not predicted here.

Findings (run 41418; Wall 10567, 10570, 10571):
1. The assumption check (E-ASSUME) is record-only: every item row ends "RECORD-ONLY TRIAL (VP4): nothing is sent back and no seat is removed" (rows 51140 to 51145).
2. Before 524/525 it checked defender premises only. Since 524/525 (live 08:46 CST, engine 0e05fc55) it also checks the defender's round 2 charges against the challenger, as premise 91 and up, but those are record-only too and get no judge grade: Assume Check Record sets `spared=p.r2?[]:...`, so no item is ever made for them.
3. Terra and qwen 4 max spared the challenger's Mary premise; only sol 6.2 counted it.

## 2. ROLES
- Planner: W3.
- Builder: W4.
- Grader: W2 (not the builder).
- Card: W4's write card in W4's thread, pressed by the operator.

## 3. SCOPE
Base: the live engine 0e05fc55 (with 524/525) and its child, plus whatever of 526, 527 and 523 is live at build time (stacked, ASK 445).

1. ASSUME CHECK RECORD (engine node, and the child's node of the same name). Items are made as today, from facts that both readers find NOT STATED, with two changes:
   a. A round 2 charge (r2, premise 91 and up) that both readers find NOT STATED makes an item for EVERY panel judge, with the grade "NOT GRADED", in place of no item.
   b. GUARD (W2, Wall 10569): an item is made only when this run's E-ASSUME call carried the 524 scope (its prompt holds "EVERY VERSE THE"). So the old one-block reading, which is single verse doctrine, can never count. On a run without the marker, rows stay as today.
   c. The item rows say "ENFORCED (pkgACX, ASK 531): sent back to the seat" in place of "RECORD-ONLY TRIAL (VP4) ...". Fact rows with no item keep their text.
2. SEND BACK BUILD (Shared Library; the same in Alt Send Back Build and R2 Alt Send Back Build). Each seat's acx items join its send-back list as rule E-ASSUME. The item text to the judge:
   "THE ASSUMPTION RULE (E-ASSUME, ENFORCED, pkgACX): premise <n> of the <side> takes as given "<fact>". Neither the enforcer nor the code finds a verse the <side> quoted that states it. Either count it (CHANGE TO your <SIDE> CONCEDED LINKS line, grading premise <n> UNEXHIBITED), or KEEP and quote the verse words, from the <side>'s own rounds, that state it."
   For premise 91 and up, the text adds: "This premise stands in the defender's round 2 charges; if you count it, write it as premise <n> on your CONCEDED LINKS line, and your count rises by one."
   For alternates: the item is made from the same facts, with the alternate's own grade read from its CONCEDED LINKS line, exactly as Assume Check Record reads a panel judge's. W4 names where the alternate's items are made.
3. SEND-BACK BLOCK (Shared Library, the same in all three Send Back Record nodes): a new cure reading and count list, pkgACX.
   - CURED on CHANGE when the CHANGE TO is that side's CONCEDED LINKS line and grades premise n COUNTED (UNEXHIBITED, CONCEDED or COUNTED), read by psGrades. psGrades reads one digit today (`\b\d\b`); for this item it must read 91 and up. A CHANGE that also regrades other premises is refused as pkgPS refuses it today.
   - CURED on KEEP when the reason quotes verse words (at least 4 words in a row) found in that side's quoted verses, the same test the STATED reply passes in Assume Check Record (x.found).
   - Otherwise UNCURED. Uncured, not silent, not err, and not skipped by __oaSkip: the item goes in a new list ACXM and is counted in drv_uncured with an AUDIT line, as ECF is ("[AUDIT: ASSUMPTION UNCURED (pkgACX, ASK 531) -- SEAT: ...; ITEMS: ...; counted in drv_uncured.]"). A silent item counts by the silence rule, as today.
   - An applied CHANGE goes through the same apply path as an E-PREM change of the CONCEDED LINKS line. W4 shows that the count and standing then follow (ASK 526 if live).
4. LABEL: the line near the Library's label text ("an uncured item counts against the seat only under an enforced package its CURE note names") stays true: pkgACX is named on every counted row.

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
2. 41418 under 524 (W1's replay, rec524_41418.txt: challenger premise 91 "Mary is of David's line" BOTH NOT STATED; defender premise 5 STATED): an E-ASSUME item for premise 91 goes to chatgpt, sol62 and sol (and to an alternate, if one is seated), and to no seat for defender premise 5. With the stored send-back replies, which do not answer it, each item is silent and counts; report each seat's drv_uncured and what the removal tests then do.
3. Synthetic cures, one each: a CHANGE that counts premise 91 (CURED); a CHANGE that counts it but also regrades another premise (UNCURED, pkgPS); a KEEP that quotes 4 verse words found in the side's quoted verses (CURED); a KEEP that quotes none (UNCURED, counted).
4. psGrades reads "premise 91 UNEXHIBITED" and "premises 5 and 91 UNEXHIBITED", and still reads every one-digit form as today.
5. Only the named nodes and blocks differ. Both Library copies compile.

DONE: criteria 1 to 5 shown offline on the build, the write on W4's card, W4's readback MATCH, and the run evidence in section 6.

## 5. WRONG-IF
The plan is wrong if the code's name test does not flag a real unsupported fact: if "Mary is of David's line" reads POSSIBLY STATED (both names found in the side's quoted verse words), no item is made and nothing counts.
- Known bad: W1's 524 replay on 41418 gives challenger premise 91 code NOT STATED and both NOT STATED (rec524_41418.txt). The wrong-if does not fire on the case it must fix.
- Known good: defender premise 5 ("the flesh runs from David to the child through Joseph") reads STATED in the same replay, so no item is made for it, as W2 requires (10569).
- Limit: the enforcer's reply in a run cannot be forced; the replay's enforcer replies are W1's.

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
2. W4 builds on the live engine and child at build time, stacked on whatever of 526, 527 and 523 is live, and runs criteria 1 to 5 offline. W2 grades the build. No card.
3. W4 writes in one write. This waits on the operator's card in W4's thread. The revert is the pre-write fetch.
4. W4 reads back. W3 writes the engine manual entry, which waits on the operator's card in W3's thread.
5. The run evidence is read at the next released run.
