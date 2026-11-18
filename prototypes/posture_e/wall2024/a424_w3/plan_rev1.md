# ASK 424 plan, rev 1 (W3, planner)

Goal: every reader of the defender's DECLARED CHAIN reads a chain whose links are written "D1:" (and the other heads the ASK 423 reader takes), and gives today's output on every stored run where it reads a chain today.

Source: W4's trace (Wall 8890) and my own read of the engine on 36fcf36b. The builder reads fresh live.

## 1. The readers

W4's trace names R1 to R4. R5 is not in the trace; I found it by searching every code node for "DECLARED CHAIN".

| | Reader | Where | Copies | What it feeds |
|---|---|---|---|---|
| R1 | chain_count | Shared Library line 2326 (inside k2Marks) | engine and child library | how many links k2Marks walks for WITHDRAWN MISSED (AUDIT v22) |
| R2 | drvLinks | Shared Library lines 1649 and 1650 | engine and child library | DL for drvUnlink (Gate, derived check) |
| R3 | drvChainOf, DEFENDER branch | Shared Library lines 2201 to 2203 | engine and child library | the "DEFENDER CHAIN" line in the Panel, Alternate, R2 Alternate and Independent Verdict prompts |
| R4 | cecDeclared and cecDlinks | Close Enforcer Build, Judge Contradiction Build, Judge Contradiction Record | 3, identical today | the defender links that the close-contradiction check and the contradiction judge see |
| R5 | declared and dlinks (inside C4P) | 12 nodes: Build Synthesis, Build Independent Verdict, Build Save Body, Panel Build, Format Markdown, D4 Build, D4 Extract, C4 Build, C4 Extract, C4G Extract, D4B Extract, C4B Extract | 12 copies of declared, identical today. 10 copies of dlinks, identical (D4 Build and C4 Build have none) | see section 2 |

Notes on the copies:
- In the child, only the Shared Library holds a DECLARED CHAIN reader. R1 to R3 change in both library copies. The ASK 422(c) two-sha check must still pass.
- R1 to R5 all fail on a "D1:" head. R2, R4 and R5 test `^\s*\**\s*\d+[.)]\s+`. R3 tests `^\s*(\d+)[.)]\s+`, with no markup allowed. R1 takes "D1." and "1 --" but not "D1:".

## 2. What R5 did in the 4 runs (new finding)

With "D1:" heads, declared() never sees a numbered line. Before its first numbered line it keeps at most 3 non-blank lines. So it returns the heading and D1 to D3, and drops D4 onward, which always includes the conclusion link.

Shown offline with D4 Build's own declared() on the line heads of all 4 chains (sim.cjs). Each output stops at D3:
- 27665: D4 to D6 are dropped.
- 38661: D4 and D5 are dropped.
- 39015: D4 is dropped.
- 39266: D4 and D5 are dropped.

Effects, read from today's code:

1. The round 4 prompts showed a cut chain.
   - D4 Build puts declared() into the defender's round 4 prompt. The prompt says: "YOUR DECLARED CHAIN -- your round 1 DECLARED CHAIN, copied verbatim by the system. Keep these numbers in this round: D<n> is link n of this list and no other link".
   - C4 Build does the same for the challenger: "THE DEFENDER'S DECLARED CHAIN".
   - In these 4 runs, both models were told the chain was D1 to D3, without its conclusion link.
2. dlinks() returns no links, so nDecl is 0.
   - The close-round numbering check ("above the n declared links", AUDIT v25 CLOSE-ROUND NUMBERING) has no declared list for D.
   - The declared-D label mismatch check is skipped.

Limit: this is today's code. I did not check which code version ran 27665 and 38661. No stored count changes through R5. Its effect on what the round 4 models wrote cannot be measured from the record.

## 3. The change

1. **One head.** Every reader takes the line head of the ASK 423 reader (__CC423, graded and passed):

   `^(?:#+\s*)?[*_]*\s*D?([0-9]+)[*_]*(?:[.:)]|\s+-{1,3}(?:\s|$))`, case-insensitive.

   The dash class `[-‐-―−]` is written into the pattern, so readers that do not run DM() read the same heads. The link text is what follows the head, with leading markup and spaces trimmed.
2. **Each reader keeps its own rules.** Its start, continuation, stop and output rules stay as they are. Only the numbered-line test and the number and text capture change:
   - R1: the line test in chain_count.
   - R2: drvLinks's m.
   - R3: drvChainOf's m. It may now take leading markup, as R2 does.
   - R4: cecDeclared's num, and cecDlinks's m.
   - R5: declared's num, and dlinks's m.
3. **Copies stay identical.** The 12 declared copies stay identical to one another, and so do the 10 dlinks copies and the 3 cec copies. The engine and child libraries stay identical.
4. **Not in scope.** The following are left as they are:
   - Challenger-side readers.
   - The ASK 423 label rewrite.
   - Moving the copies into the Shared Library. That is a later item; I note it, I do not ask for it.
   - Any model setting.
   - Any stored row.

## 4. Stored rows

No stored row is recomputed. W4's trace shows that no stored count, conceded-link figure or standing of the 4 runs changes through R1 or R2. R3, R4 and R5 changed only what models and enforcers were shown.

The write report states the 4 runs and what each reader showed in them.

## 5. DONE WHEN

1. **Equality.** Take every stored run whose claude_r1 names a DECLARED CHAIN (245 runs). For each reader, run today's code and the new code on the same text. Wherever today's output is non-empty (for R1, above 0), the new output is equal:
   - R1: the count.
   - R2: the list.
   - R3: the links.
   - R4: the cecDeclared text and the cecDlinks list.
   - R5: the declared text and the dlinks list.

   Report the counts per reader. R2 and R3 read the judge's prompt text. For this test, feed them claude_r1 and state that as a limit.
2. **Newly read.** Per reader, list every run where today's output is empty or 0 and the new output is not.
   - The 4 runs must be in each list, with 6, 5, 4 and 5 links, and the last link must be the conclusion line.
   - Any other run that appears is listed with its heads, for the graders to judge.
3. **The 4 runs under R5.** declared() returns every link through Dn. Show the D4 Build G1DECL text for 39266, before and after.
4. **Copies.** The copies stay identical as in section 3, step 3. lib_sha is recomputed and is equal on the engine and the child.
5. **Readback against live.**
   - Only the named nodes and library lines change.
   - Connections are equal.
   - The ASK 385 check passes.
   - No computed $() is added (section 15).
   - No model setting is touched.
6. **Inputs in git (ASK 414).** The SQL that makes the test input, and the test scripts, are committed.

Grading: W1 and W2. Builder: W4. I do not grade this build.
