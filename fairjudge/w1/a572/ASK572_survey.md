# ASK 572 survey: code repeated across nodes, outside the L2C sheet (W1, draft 1)
Base: live engine f63b73de (the 563 write to d8292f62 changed Build Save Body only, by 381 characters) and child de9efc4e, both pulled 17:58 CST 11-23.
Read-only. Nothing is proposed for writing here; each group becomes its own plan.

## Method (two views; scripts in this folder)
1. top.cjs: parse every code node (acorn), take each top-level statement of 300+ characters (and those inside a top-level try), and group the statements by declared name across nodes. "texts" = the number of distinct texts among the copies.
2. dup2.js / fam.js: line-level. Group lines of 60+ characters by their declared name. This catches the same text sitting inside different blocks (for example, PART2 inside __R and inside POSTURE).
Saving = total of all copies minus the largest copy. It ignores the short loader line each node keeps (about 150 characters) and the work of reconciling differing texts. Figures are MEASURED on the base above, except where marked as estimates.

## Totals
- Engine code: 3,437,921 characters, of which the Shared Library is 1,146,022 and the 181 other code nodes 2,291,899. Child code: 1,198,296, of which the Shared Library is 1,145,843.
- Repeated top-level statements of 300+ characters (engine and child, library excluded): saving 1,279,934, of which L2C is 353,094 (W4's ASK 571).

## Groups, ranked by saving (L2C excluded)
0. The child's Shared Library. Its LIB (979,141 characters, 3,567 lines) is byte-identical to the engine's; only the MAP differs (166,256 against 166,435). Possible saving is up to 1.15 MB of stored code. This is a design question, not a dedupe: a child node cannot read the engine's node through $(). The options and their runtime costs (pass the text on each Execute Workflow call, or read it from a table at start) need the team's design before any plan.
1. __R (the judge prompt builder): Build Independent Verdict, Panel Build, Reserve Build. 3 texts, max 149,498, total 293,709, saving 144,211.
2. B-Extract layer blocks: __O423 in C2B, D3B and C3B Extract (3 texts, max 51,147, total 146,466, saving 95,319). The __X2 wrappers in C3G, C1B, D2B and D4B Extract (4 texts, max 45,390, total 156,054, saving 110,664) hold L2C inside them, so the L2C part is 571's; the boundary is for W4.
3. Judge prompt text PART2 (17,325 characters, 1 text) is in 7 nodes, inside __R and inside POSTURE. Line-level group (PART2, ANSWER, HEDGE, REFUSE, FORM, RULE_C, HEADS, PLACED): 8 nodes, 2 texts, total 131,633, saving 111,656. This overlaps groups 1 and 4.
4. POSTURE: Accept Build, Accept Check, Accept Return Build, Accept Final, Accept DS Return Build. 4 texts, max 21,357, total 99,588, saving 78,231.
5. __RL (the judge line parser, P.RESULT and the rest): Build Save Body, Format Markdown, Enforcer Build, Judge Enforcer Retry Build, Alt Judge Enforcer Retry Build, child R2 Alt Judge Enforcer Retry Build. 1 text, 16,453 each, total 98,718, saving 82,265. Identical, so it can be served as is.
6. The debater call path in the 8 debater Builds and 8 Extracts: SHEET, the verse sheet (15 nodes, 3 texts, saving 27,089); wn390 (8, 1 text, 16,254); readEnv (8, 8 texts, 14,756); msgs (7, 7 texts, 12,935); __PROVE9 (9, 1 text, 9,952); __RFX (8, 8 texts, 7,660); bodyFor (8, 2 texts, 7,256); RF (8, 1 text, 6,930); the empty-reply check (8 texts, 5,445); __orc (10, 1 text, 3,312). About 111,600 in all. A line-level view of the model reply reader gives 26 nodes and 14 texts, with a saving of about 117,000.
7. The barred-move check: IMP (11 B nodes, 3 texts, saving 50,677), BAR (11, 2 texts, 24,682), __RD (9, 6 texts, 5,347), LAY loader (9, 1 text, 4,368). About 85,000. ASK 559 (approved) rewrites BAR in 14 nodes, so this goes after 559 is written, or 559 is cut onto it.
8. C4P (the close checks): Build Synthesis, Format Markdown, D4 Build, D4 Extract, C4 Build, C4 Extract. 5 texts, total 59,124, saving 42,849. Line-level close and verdict readers (RENUM, fresh and others): 20 nodes, 13 texts, saving about 90,000; this overlaps C4P and __R.
9. PWL and the verse tables (CHL, BK): D3, C3, D4 and C4 Build, 4 texts, saving 27,174. Line-level with Build Independent Verdict and Panel Build: 8 nodes, 6 texts, about 37,900.
10. OGR: C4G and C4B Extract __X2 (2 texts, saving 24,442), plus OGR in D4 Build, C4 Build and C4 Extract (3 texts, 6,937). About 31,000.
11. Smaller groups: REFP loader (19, 2 texts, 9,828); __L loader (15, 15 texts, 8,996); PROMPT in Close Enforcer, Judge Contradiction and Assume Check Build (3 texts, 5,670); __SHA422 in Library Sha, Library Check and the child Library Check (1 text, 4,532); Reread Record and its Alt and R2 copies (2 texts, 4,360); __METHOD_TOP (1 text, 3,568).

## Reading
- Identical texts can be served from the library without reconciling: __RL (82k), PART2 (about 104k beyond one copy), wn390, __PROVE9, RF and __SHA422.
- Groups with several texts (__R, POSTURE, __O423, C4P, readEnv, msgs) need the 571 method: one stored copy per text, rebuilt byte for byte, with no merging of behaviour.
- Groups 1 to 11 overlap, so they are not added together here. The repeated-statement total outside L2C is about 927k (1,279,934 minus 353,094), and the library duplicate in the child is a further 1.15 MB.
