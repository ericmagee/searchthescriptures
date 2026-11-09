# pkgVP1 (W3): parts 1 and 2(a) of the verdict proposal

Authority: md_notes_rulings 459 (the operator: "ASK 1. 1 / ASK 2. 2"), Wall 3703 and the split in Wall 3729.
Base: live s85 (items A and B live). Library base pkgLIB/strip_CEC (s84 and s85 hold the same library; checked node by node), fetch-back /mnt/project-files/wall2024/fetchback_live_s85.json.
The first build was on s83 (commit 5fef281, W1 graded it PASS with a condition, Wall 3755); this build replaces it.
Not for write until two PASS grades (W1, W4) on this build.

## What it does

### Part 1. No send-back row is left unread (RECORD-ONLY)
Today a send-back row whose answer is CHANGE gets no reading of the replaced line for most rules; its cure_status stays empty.
1. E-ANS and E-PREM rows: the cure reading the engine already computes, and today only writes into the reason text, is written to cure_status (CURED or UNCURED).
2. E-OOR rows: code re-runs the E-OOR checks on the replaced line (`vp1Oor2024`) and writes CURED or UNCURED with the reason.
3. Every replaced line whose send-back reason opens "(right:" (the enforcer named the right reading) and whose answer is CHANGE is read a second time by DeepSeek in one call. Four new nodes per path:
   Send Back Record -> Reread Build -> Reread Needed? -> (true) Reread Call deepseek -> Reread Record -> Gate Build; (false) -> Reread Record.
   The call reuses the first call's system text, rules and ITEM block, and adds the replaced line. The reply line is the first call's own line form for that id (AGREE or DISAGREE, with RIGHT: when it disagrees).
   Reread Record writes one row per line: kind send_back, rule E-REREAD, cure_status CURED on AGREE, UNCURED on DISAGREE, empty when DeepSeek gave no readable line.
4. Nothing is counted, no seat is removed and no verdict field changes by part 1. It is the record the operator and the graders read.

### Part 2(a). An answer check graded MISSES or FAILS leaves its collision open (LIVE gate item, E-GATE M)
The judges' form already says: "An answer that MISSES or FAILS leaves the witness unanswered (md_notes_rulings 372)". No code held a judge to it.
1. `gateAnsOpen2024` reads the judge's corrected text. For each ANSWER CHECK on a proven press graded MISSES or FAILS it finds the link through the premise list:
   a [DR2] entry labelled "LINK k" gives Dk; an unlabelled defender entry ties to nothing (no item); challenger entry j gives Cj.
2. The item is raised when that link has collision lines, none graded <that side> LINK BROKEN, and at least one graded UNDERDETERMINED. Key `ANSWER OPEN|<REF>|<ROUND>|<link>`.
3. The item goes to the judge in the existing gate call (source E-GATE M). The judge keeps the decision (ruling 428). Two ways clear it:
   a. the judge changes the answer check back to MEETS;
   b. the judge changes the collision line to LINK BROKEN for the pressed side and writes one FORCED line for that pair as the reason of its GATE line. `gateForcedM2024` accepts it only when the FORCED line passes K-F (each quotation word for word in the round named, ruling 411). The engine then writes the FORCED line under the collision line and derives the counts, the standing and the RESULT.
4. KEEP, silence, or a change that leaves the line UNDERDETERMINED is UNCURED. A change to LINK BROKEN without a true FORCED line is UNCURED.
5. Stacked on the closing contradiction rule (pkgCEC): a link broken by a confirmed closing contradiction is read as BROKEN for that side, so no ANSWER OPEN item is raised on it (W1's condition, Wall 3755; the first build still raised it).
5a. Several items on one link. One judge may get many items (run 34016, luna: 10 answer checks graded MISSES with every collision UNDERDETERMINED give 11 items). One cured change to LINK BROKEN, with its FORCED line, answers every ANSWER OPEN item that no longer stands after it; those items need no GATE line of their own. A change that is not itself cured answers nothing. A change back to MEETS cures only its own item. The gate message says so.
6. Part 2(b) is NOT built (the operator's ASK 2 answer: an answered-with-a-fit collision does not count toward a defender win).

## Files changed
- Library (10 of 30 files; plan_VP1.json has the hashes): Gate Build, Alt Gate Build, R2 Alt Gate Build (gateItems2024, gateCure2024, gate message, PASS read by name); the three Gate Record files; Alternate Merge Seat, R2 Alternate Merge Seat, Alternate Merge 1, R2 Alternate Merge (the E-REREAD rows join the log).
- Parent: 402 -> 414 nodes (+12: Reread Build, Reread Needed?, Reread Call deepseek, Reread Record, and the Alt and R2 Alt copies). The three Send Back Record nodes are edited (part 1, items 1 and 2).

## Build
    export BASE=strip_CEC STRIP=strip_VP1_s84 LIBP=pkgLIB_VP1_s84 TAG=s85 NODES=402 FB=/mnt/project-files/wall2024/fetchback_live_s85.json
    node pkgVP1/build_VP1.cjs strip      # pkgLIB/strip_VP1_s84 and plan_VP1_<TAG>.json
    node gate/pack.cjs pkgLIB/strip_VP1_s84 pkgLIB_VP1_s84
    node pkgVP1/build_VP1.cjs parent     # pkgVP1/parent_s85_VP1.json
The strip and pack steps refuse when the output folder exists. The library folders carry "s84" in their names because they were built when s84 was live; s85 changed no library node.

## Proof (all on this build)
- probe_VP1_s84.txt (part 2a), run 34108: 30 OK, 0 FAIL. Gate Build sends one gate call, to luna, with one E-GATE M item (Luke 1:34, [CR3], D1 vs C1). KEEP, silence and still-UNDERDETERMINED are UNCURED; MEETS is CURED; DEFENDER LINK BROKEN with a true FORCED line is CURED and the engine derives verdict BROKEN, RESULT CHALLENGER WINS; BROKEN without FORCED or with a bad FORCED is UNCURED; near-miss cases 3a to 3m, with the challenger mirror.
- probe_VP1_p1_s85.txt (part 1), run 34108, on parent_s85_VP1.json: 30 OK, 0 FAIL. Send Back Record rows change only in cure_status (E-ANS, E-PREM, E-OOR) and the E-OOR reason; every other byte equal. Eight replaced lines are asked in one call.
- probe_VP1_multi_s84.txt, run 34016: 10 OK, 0 FAIL. Eleven items for luna; one change of D6 vs C1 to DEFENDER LINK BROKEN with a true FORCED line cures its item, the three other LINK 6 items and the challenger premise 1 item; the six items of other links stay UNCURED; the same change without a FORCED line cures nothing.
- probe_VP1_stack_s84.txt, run 34108: 5 OK, 0 FAIL. A confirmed closing contradiction on DEFENDER LINK 1, before or after the panel, raises no item for D1; a break on another link leaves it raised.
- gate_VP1_s84_notargets.txt: the shared gate (base strip_CEC) with no targets: 862 node runs, 701 byte-equal. Every difference lies in Gate Build, Gate Record and the Merge nodes of the 31 saved runs where a judge gets an E-GATE M item.
- gate_VP1_s84.txt: the shared gate with targets_VP1.json: GATE PASS, 17 near-miss checks.
- HOW OFTEN THE RULE FIRES on the saved runs: 31 of 47 saved runs have at least one item; the largest counts for one judge are 16, 13 and 11 (retired seats) and 11 for luna on 34016; run 34108 has one (luna).

## Limits, stated plainly
1. The gate runs only for a seat that had send-back items. A judge with a MISSES or FAILS answer check and no send-back item gets no E-GATE M item.
2. A judge may clear the item by changing the answer check back to MEETS. The judge keeps the decision (ruling 428). VP3 is the part that gives the enforcer a second reader on that.
3. E-RES and E-HOLD rows get a status only through the E-REREAD rows.
4. DeepSeek's real answers to the reread call are untested offline; the first run shows them.
5. The shared gate pairs the saved gate replies to gate calls by position. A new E-GATE M item changes the set of gate calls, so in such a run the saved replies no longer belong to the calls, and the gate rows shown for that run in the replay (UNCURED, NO REPLY, a reply under another seat) are not what a live run would give. The targets file therefore allows every gate row and line in Gate Build, Gate Record and the Merge nodes; the three probes carry the proof of the item and its cures.
6. pkgQRC rev 2 (not live) changes four non-library nodes; if it goes live first, only the parent step is rerun on the new fetch-back.
7. A cured change to LINK BROKEN leaves a record-only RESULT DIFFERS review row, because the judge's RESULT line no longer matches the derived result (W1 note 1, Wall 3755). The same row appears with pkgCEC alone when a closing break flips the result; it belongs to the apply step and is not changed here.
8. A change of a collision line to one side's LINK BROKEN also clears an ANSWER OPEN item of the other side on that line when that side's link has no UNDERDETERMINED line left (W1 note 2).
