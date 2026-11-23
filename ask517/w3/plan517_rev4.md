# ASK 517 plan (W3, seat 33), rev 4, 2026-11-23. Replaces rev 3 (3276053d, kept as plan517_rev3.md) on W2's C-c (Wall 10415): S5's parenthesis corrected, the 22:26 source named, the S6 site and the library base stated. Rev 3 replaced rev 2 (aacc4d22, kept as plan517_rev2.md) on W4's C-b and note (Wall 10403); changed: OBJECTIVE (outcome effect, S5, S6), CRITERIA, STEPS. Rev 2 replaced rev 1 (d0aff4e7, kept as plan517_rev1.md) on W2's C-a (Wall 10392). A PLAN ONLY; nothing is written.
Source: the operator's "Four Remaining Bugs in the Run (4) Debug Log", Bug 1 (13:10 CST 11-20, W4 thread), released for work by his "yes" at 02:02 CST 11-23 (Wall 10381).
Run (4) is run 41117 (ODV1-41117-2xbwme8t). This is my reading, and it rests on three facts: Terra's five K-UNX cures with "CORRECTED COUNT 0" (debate_enforcer_log 48749 to 48753), its five "RECOUNTED AFTER CURE (pkgRCT, W3 2819)" gate rows (49081 to 49085), and 36 K-W cure rows. His K-S3 figure (16) is one more than the log's 15.

## 1. OBJECTIVE
A side's standing is decided by its own definition only, as engine_manual section 8 says: "SELF-SUPPORTED requires a count of 0 for that side; PROP-DEPENDENT when the count is 1 or more; COLLAPSED when 2c > L ... A standing or count is never chosen to agree with another line." The operator, on 41117: "by rulebook definition, L=6, c=0 is SELF-SUPPORTED, never PROP-DEPENDENT."
Expected effect: no standing line reads PROP-DEPENDENT or COLLAPSED with c=0, and none reads SELF-SUPPORTED with c of 1 or more, on either side. One exception: where a collision line is UNREAD, the engine keeps the judge's own standing at c=0, as it does today.
Outcome effect (W4 C-b), and the operator's 22:26 CST 11-19 words in W4's thread, quoted in the ASK 505 plan (outcome_fix/w3/plan_outcome.md, line 6): "We can't have broken links and still win." The engine manual's gate cites his 22:29 words ("You can't with a PROP SUPPORTED by two or more judges"). Today the brk term in the standing is what stops a side at c=0 with a LINK BROKEN line of its own from winning: (i) rd386 gives CHALLENGER WINS on a BROKEN verdict only when the challenge is SELF-SUPPORTED; (ii) the ASK 505 STANDING GATE stops a side that is PROP-DEPENDENT or COLLAPSED on two or more counted seats. If the standing alone changed, both would let a side win with its own link graded broken (on meaning, ruling 421, nothing counted), against the 22:26 rule. So the win tests take the broken lines directly instead of through the standing word:
- S5. rd386: CHALLENGER WINS on BROKEN also needs no collision graded CHALLENGER LINK BROKEN on that seat The defender's own breaks are not read by rd386: HELD gives DEFENDER WINS when the challenge is not SELF-SUPPORTED or a collision is graded CHALLENGER LINK BROKEN. A defender with its own DEFENDER LINK BROKEN line is stopped only at the outcome, by the 505 gate (through the brk term today, through S6 after). That is unchanged; making the seat word read the defender's own breaks would be a separate ASK.
- S6. The ASK 505 STANDING GATE also counts, toward its two-or-more seats, a seat on which the named side has a LINK BROKEN line of its own. The gate is in the SQL function derive_debate_outcome (live prosrc md5 2a853df6), the only public function naming the STANDING GATE (W2 10415). It counts counted seats whose stored defense_standing or challenge_standing begins with PROP-DEPENDENT or COLLAPSED. S6 must read each seat's own LINK BROKEN grades from stored data; the build names the column it reads. This is a DB function write, on the operator's card in W4's thread.
Base: W1 builds on engine 0427ec91 and child 47df6892 (516b). 516b changed library lines 3191, 3246 and 3405 only, so the line targets above stand (W2 10415).
Expected outcome effect: none. The standing words change; no outcome on the five runs changes (C2b). On 41117, Terra's line becomes "DEFENSE STANDING: SELF-SUPPORTED -- L=6 c=0". Its RESULT stays UNDERDETERMINED, because D4 is still broken and the challenge is PROP-DEPENDENT.

CAUSE (read from live library 6f2ae36f19303a92, the same in engine and child):
- The engine derives the standing from the count AND from whether the side has any LINK BROKEN line. The definition has no second term.
- In 41117, Terra's cure set CONCEDED LINKS to 0, but D4 vs C1 stayed DEFENDER LINK BROKEN, and the closing contradiction broke D3. The recompute (line 1346) therefore kept PROP-DEPENDENT at c=0.
- A break can stand with c=0. Under ruling 421, a break of meaning (the witness was answered) does not count the premise.
- The same second term is the rule K-G3 ("a side SELF-SUPPORTED while any of its links is BROKEN"). It contradicts the STANDINGS definition in the same section.

## 2. ROLES
- Planner: W3 (seat 33).
- Builder: W1 (seat 34), per Wall 10381.
- Graders: W2 and W4, per Wall 10381. If the operator's one-grader op doc change is written first, one non-builder grade suffices.
- Write card: W4's thread. W4 writes to n8n on that card. The engine manual is written by W3 on the operator's card in W3's thread.

## 3. SCOPE, with SEARCH
SEARCH:
- Read: live engine moMxiV4Irg1uRBZN and child MqQHRl7mQQ0z8QdT. These are W4's 07:53Z fetches, ask516/w4/b/live_*.json. Their Shared Libraries are equal, 3560 lines.
- Also read: workflows SX4ZWtgHNs96uBOo and c7366RPLb8vdMQg6 (W4's fetches). Neither holds K-G3 or SELF-SUPPORTED.
- Searched for: lines with SELF-SUPPORTED together with brk, LINK BROKEN or K-G3, plus every non-library node.

HITS (each is a place where a broken link decides a standing):
- L790, the K-G3 detector. It raises K-G3 when a standing is SELF-SUPPORTED and the side has any LINK BROKEN line. MAP users: Panel Payloads, Alternate Payloads, R2 Alternate Payloads, Extract Independent Verdict, every Gate Build and Gate Record, the Late Gate Builds, and Alternate Merge Seat and R2 Alternate Merge Seat.
- L810 to L811, the K-G3 cure text in CURE_RULE_G.
- L1177, the cure check of a CORRECTED STANDING: "want = c 0 ? (brk ? PROP-DEPENDENT : SELF-SUPPORTED) : ...". MAP users: Cure Check, Panel Cure Check, all Cure Normalize nodes, and both Alternate Merge Seats.
- L1346, the stand() of the after-cure recompute: "if(n>=1||brk[sd]>0) ... PROP-DEPENDENT". MAP users: Cure Check, Panel Cure Check, both Alternate Merge Seats.
- L1488, the stand() of the gate recompute. It carries the same term. MAP users: every Gate Build and Gate Record, the Late Gate Builds, Alternate Merge 1, R2 Alternate Merge and both Alternate Merge Seats.
- Engine manual v231, the K-G3 row in the rules table: "a side SELF-SUPPORTED while any of its links is BROKEN | CORRECTED STANDING (not SELF-SUPPORTED); or RETRACTED for each BROKEN link".
- Not hits:
  - Build Save Body and Format Markdown only label K-G3 rows ("Standing (K-G3)"), and they stay.
  - L3144 checks "count 1 or more and SELF-SUPPORTED". That follows the definition and stays.

CHANGE:
- S1. L1346 and L1488, stand(): the standing follows the count only. n >= 1 is handled as today: PROP-DEPENDENT, or the judge's COLLAPSED kept. n = 0 gives SELF-SUPPORTED, unless a collision is UNREAD. FORFEIT is kept. The brk term is removed from the standing only. brk still decides the clause (k) and the RESULT as today.
- S2. L1177: "want" for c = 0 is SELF-SUPPORTED, with no brk term.
- S3. L790 and L810 to L811: K-G3 is retired. The detector raises nothing, and the cure text drops the K-G3 sentence.
- S4. Engine manual: the K-G3 row is marked retired by ASK 517, with the operator's words. The K-UNX row's "as for K-G1 and K-G3" drops K-G3. The STANDINGS definition is unchanged. This is W3's manual entry, with its own reads and card.
- Not changed:
  - KEYSTONE. The operator's note says D4 stayed BROKEN though D4 vs C3 and D4 vs C5 went to STANDS. In Terra's cure, D4 vs C1 stayed DEFENDER LINK BROKEN: the engine's trig reads "CLOSE-CONTRADICTION D4 vs C1 (CHALLENGER break not set: the line already carries the DEFENDER break)". One broken collision breaks the link, so KEYSTONE D4 BROKEN follows the lines. If a grader reads the rules otherwise, that is a separate ASK.
  - pkgRCT itself. It kept Terra's own CORRECTED COUNT 0, as built (W3 2819). The fault is the standing beside that count, not the count.

## 4. CRITERIA and DONE
- C1, replay of 41117: Terra's recomputed DEFENSE STANDING reads SELF-SUPPORTED with L=6 c=0. Its RESULT, clause and CONCEDED LINKS are unchanged. Sol 6.1 and Sol 6.2 lines are unchanged.
- C2: on 41117, 41102, 41090, 41043 and 41024 (every panel and alternate seat), the only fields that change are standings with c = 0 that read PROP-DEPENDENT or COLLAPSED and have no UNREAD collision. They change to SELF-SUPPORTED. A seat with an UNREAD collision keeps its standing, and is listed. No RESULT changes unless the challenge standing changed, and each RESULT change is listed with its rd386 reason.
- C2b (W4 C-b): the debate outcome is replayed on the same five runs, through Derive Outcome and the outcome function with the ASK 505 gate, live library against built. No outcome changes. Any outcome change fails C2b, and is listed with its seats.
- C2c (W4 note): at L1177, a judge's CORRECTED STANDING kept by stand() under an UNREAD collision is not marked UNCURED by the cure check; or each such case is listed.
- C3: no K-G3 item is raised on the five runs, and the K-G3 cure text is absent from every cure prompt.
- C4: the library stays at 3560 lines, and engine and child are equal. Only lines 790, 810, 811, 1177, 1346, 1488 and 1286 (rd386, S5) change, plus the S6 site W1 names (library line, node or SQL function), each shown. Node count and connections are unchanged.
- C5: one live run, on the operator's word. No standing line pairs c = 0 with PROP-DEPENDENT or COLLAPSED (except on a seat with an UNREAD collision, which is listed), or c >= 1 with SELF-SUPPORTED.
- DONE: C1 to C5 pass, and the manual entry is written and read back.

## 5. WRONG-IF
This plan is wrong if the replay shows a standing that the definition does not give. Two cases:
- Known-bad: the live library on 41117. It must show Terra's PROP-DEPENDENT at c=0.
- Known-good: the built library on 41117. It must show SELF-SUPPORTED at c=0.
It is also wrong if any RESULT changes for a reason other than a standing that changed by the definition. A K-G3 removal count changing is expected and is listed.

## 6. RUN EVIDENCE
NO PROBE in the ASK 417 registry for standings. W1 adds a case at build, mark "standing by count", if the registry takes one. Otherwise, C5 is read from the run's standing lines.

## 7. INPUTS IN GIT
This plan is commit-listed on the Wall post. W1 commits the base fetches, the replay script and its outputs at build, and names that commit.

## 8. STEPS
1. W2 and W4 grade this plan. Waits on: nothing.
2. W1 builds S1 to S3 and replays C1 to C4. Waits on: step 1.
3. Grades of the build. Waits on: step 2.
4. W4 writes on the operator's card in W4's thread. The card states that the standing word follows the count, that the win tests read the broken lines directly (S5, S6) so the 22:26 rule holds, and the C2b result. Waits on: step 3.
5. W3 writes the manual entry (S4), after one seat reads it, on the operator's card in W3's thread. Waits on: step 4.
6. A run on the operator's word (C5). Waits on: step 4.
