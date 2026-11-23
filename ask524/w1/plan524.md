# ASK 524 with 525 (stacked): the assumption check reads the side's whole case, on both sides

Rev 0. Planner W1 (seat 34). Proposal: Wall 10519. Findings: Wall 10517. Rulings kept: 383, 372 (pkgBNS option 1, COUNT) and 364 (a rule applied to one side is considered for the other).

## 1. OBJECTIVE

The assumption enforcer (E-ASSUME) tests whether the verses a side quoted, read together, state a fact that one of its premises takes as given. It runs on the defender's charges against the challenger as well as on the challenger's charges against the defender.

Expected effect:

- A chained premise is no longer marked NOT STATED only because its other verses stand in another link or round. In 41418, defender premise 5, "the flesh runs from David to the child through Joseph", was marked NOT STATED (row 51138), because its LINK 1 block quotes no verse naming Joseph. John 6:42 ("the son of Joseph, whose father and mother we know") and Luke 2:48 ("thy father and I") stand in the defender's other rounds.
- A charge the defender made against the challenger in round 2 is checked. In 41418, "ASSUMES: Mary is of David's line" was never checked, and no challenger fact was checked at all (rows 51134 to 51139 are all defender).
- The defender is told to carry its round 2 charges into its round 3 list, which is the numbered list the judges count. This is the mirror of ASK 347, which told the challenger the same.

## 2. ROLES

| Role | Seat |
|---|---|
| Planner | W1 |
| Builder | W4 |
| Grader | W3 (not the builder) |
| Write card | W4's thread |

## 3. SCOPE

Three nodes of the engine (moMxiV4Irg1uRBZN), and nothing else:

| Node | Change |
|---|---|
| Assume Check Build | Code and the E-ASSUME prompt |
| Assume Check Record | Code |
| D3 Build | One sentence of the defender's round 3 prompt |

The child workflow, the judges' prompts, the Shared Library and model settings are not touched.

SEARCH: I read the 519 fetch-backs on disk (engine 290db075, child 47e23e82), node by node:

- Engine: nodes whose code holds "Assume", "E-ASSUME" or "NOT STATED". They are Assume Check Build, Assume Check Record and Assume Check Resume.
  - Extract Independent Verdict, Panel Payloads, Panel Tokens, Alternate Payloads, Alternate Merge, Close Group Batch Build, Alternate Pass Call and Pass Accumulate hit on the word "Assume" only. None of them builds or parses E-ASSUME rows.
- Shared Library: the readers of the E-ASSUME facts are the following. Each matches on side plus premise number (1 to 6), so the record-only numbers 91 and up added here never match.
  - bnsFacts2024 and bnsRefuse2024 (pkgBNS, ASKs 295 and 374).
  - nsgRefuse2024 (pkgNSG).
  - bkcKeep2024 (pkgBKC).
  - Library lines 1242 and 1247 (E-ASM and K-UNX-A), both "f.both_not_stated && f.side===x.side && +f.n===+x.premise".
- D3 Build: the CHALLENGER'S UNSUPPORTED-L4 PREMISES paragraph. The anchor sentence occurs once.
- Child workflow: no node holds "Assume Check". NOT SEARCHED: none.

## 4. CRITERIA and DONE

Replay population: 5 runs, read offline from stored node output, with no model call.

| Run | Source |
|---|---|
| 41418 | ask524/w4/41418_part1.json and part2.json, saved by W4 |
| 41117, 41102, 41090, 41043 | ask517/w4/<run>_part5.json and part8.json |

The base is the engine 519 fetch-back (290db075). For 41418, the replay of the base code reproduces the live Assume Check Build output exactly, both the premise list and the prompt (eqlive524.js: "prem equal: true | user prompt equal: true").

**C1. Every premise the base code builds is kept unchanged** (side, number, link, ASSUMES and block) in all 5 runs. MEASURED: true in all 5 (cmp524_*.json).

**C2. The defender's round 2 ASSUMES items are added as challenger premises.**

- An item that matches a round 3 premise by its quote takes that number.
- An item with no match is numbered 91 and up, marked r2, and is record-only: it gets no judge grade and no trial item.

MEASURED, added items:

| Run | Added | Items |
|---|---|---|
| 41418 | 2 | 91 "Mary is of David's line"; 92 "come upon and overshadow act as begetting at this row" |
| 41117 | 2 | 91 "Mary of the house of David"; 92 |
| 41102 | 2 | 91 "Mary's descent from David in Luke's line"; 92 "Joseph's line as the bar upon the throne for this child" |
| 41090 | 0 | no round 2 list with ASSUMES |
| 41043 | 3 | 91 to 93 |

None matched a round 3 item. This criterion can fail: a run whose round 2 list repeats a round 3 premise must not add a duplicate.

**C3. The E-ASSUME prompt shows, once per side, every verse that side quoted in rounds 1 to 3, read together.** One entry is kept per distinct quotation, and a quotation inside a longer one of the same verse is dropped. MEASURED for 41418: the defender's list holds John 6:42 and Luke 2:48 (prompt524_41418.txt).

Prompt size, measured:

| Run | Before (characters) | After (characters) |
|---|---|---|
| 41418 | 10,201 | 24,452 |
| 41117 | 15,617 | 35,327 |
| 41102 | 12,853 | 19,769 |
| 41090 | 19,319 | 37,765 |
| 41043 | 20,658 | 33,279 |

**C4. The STATED word check reads the side's listed verses.** The code's name test is NOT widened: it stays on the LINK block. Why: the code test only asks whether each proper name appears somewhere. Over a whole case every name appears, so BOTH NOT STATED would stop firing. 41043 row 47470 already reads "POSSIBLY STATED (names Mary, David)" on the block alone.

MEASURED with a fixed test reply, no model call (rec524_41418.txt):

| Test reply | Base | After |
|---|---|---|
| STATED quoting John 6:42 for defender premise 5 (known good) | "STATED (verse words not found in the block)" | "STATED" |
| STATED quoting invented words (known bad) | not found | stays not found |
| NOT STATED on challenger premise 91 | (not checked) | BOTH NOT STATED, with no judge grade read |

**C5. Only the three nodes change.** Connections, settings and node names are equal to the base. All three nodes compile. MEASURED: true.

**C6. Ruling 372 is kept.** pkgBNS still refuses on BOTH NOT STATED. The change only alters what the enforcer is shown.

DONE: C1 to C6 pass on the build, a write on W4's card, W4's readback MATCH, and the run evidence in section 6.

"Found nothing" is not a legitimate result for C2 on 41418, 41117, 41102 and 41043. It is legitimate on 41090.

## 5. WRONG-IF

The plan aims at the wrong thing if the verses the side quoted outside the LINK block do not carry what the block lacks. In that case widening the scope changes nothing.

- Known bad: 41418 defender premise 5, where the code's reason was "not in the block's quoted verse words: Joseph". CHECKED: the defender's listed verses hold John 6:42 "the son of Joseph". The wrong-if does not fire.
- Known good: 41090, which has no round 2 ASSUMES list. Nothing is added and every premise is unchanged. CHECKED.
- Empty case: 41090 defender premise 6, which has an empty block (block length 0). It is kept unchanged. CHECKED.

## 6. RUN EVIDENCE

- The first run after the write: the E-ASSUME prompt_sent row holds "EVERY VERSE THE".
- Where the defender's round 2 list carries ASSUMES, an E-ASSUME row with item "CHALLENGER PREMISE 9x" appears.
- The defender's round 3 list carries its round 2 charges with STEP/ASSUMES lines. This is a request to a model; the text cannot force it.
- NO PROBE for the enforcer's reading itself: whether it now finds a chained fact STATED depends on the model's reply.
  - A priced check (5 E-ASSUME calls, one per run above, on the new prompt) is possible, but only on the operator's release. It is not in these steps.

## 7. INPUTS IN GIT

ask524/w1/, for W3 to commit:

- plan524.md
- patch524.py (env SRC and OUT)
- target_engine_524_on519.json
- replay524.js, eqlive524.js, fo524.js, cmp524.js, rec524.js
- cmp524_{41418,41117,41102,41090,41043}.json, rec524_41418.txt, prompt524_41418.txt
- fo_*.json, the round texts as stored

## 8. STEPS

1. W3 reviews this plan. No card.
2. W4 rebuilds the target on the live engine at build time. Run patch524.py with SRC set to the live fetch-back. 520 may land first. It is graded by W3. No card.
3. W4 writes the engine (one stacked write, ASK 445). This waits on the operator's card in W4's thread. CANNOT BE UNDONE WITHOUT THE REVERT: the revert is the pre-write fetch-back.
4. W4 reads back. W3 updates the engine manual entry.
5. The run evidence is read at the next released run.

Limits:

- In 41043 the round 2 item "Mary alone is the bodily source and Mary is of David" is added as 91, beside round 3 challenger premise 5 ("Mary herself carries David lineage"), which is the same charge in other words. The quote match does not join them, so the fact is checked twice. Both copies are record-only or as before.
- The 41102 defender list is short: 12 quotations, cause not measured (a guess: quotes written in a form the reference-then-quote reader does not take).
