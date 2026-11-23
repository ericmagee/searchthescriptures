# ASK 565: words a debater has cited are served ahead of the [L2] SHEET cap (W1, PLAN draft 1a)

Draft 1a folds W3's notes on the PASS (Wall 11019): Test 2 prints the numbers each sheet loses at the cap; the lost-number effect W3 measured is stated. No code text changed.

DRAFT ONLY. Nothing is written. Grading by W3, anchor check by W4, then the operator's approval of exact text (coordinator 17:18 CST 11-23).
Basis: W4 Wall 11005, offline test of the live ASK 558 write: on run 41822's D2 inputs G1352 (dio) now passes the function-word filter but falls past the 26,000-character sheet cap, so "therefore" is still not served at D2. Operator policy 17:20 CST (ruling row 506): "leave nothing to chance".
Read: L2C.sheet in D2 Build of the live engine 215e327a (W4 fetch-back /mnt/project-files/ask557/w4/write/fetchback_engine_557.json).
Scope: the order in which the six Build nodes put rows on the sheet, and nothing else. The cap (26,000), isFunc, the KEEP set of ASK 558, the Lexicon Plan nodes, the sheet's wording and every other copy of L2C are unchanged.

## What the code does today (D2 Build, live)
`for(const k of order)for(const r of (IX.V[k]||[])){...if(byN[n].every(isFunc)&&!KEEP.has(n)){fw++;continue;}const L=IX.X[n];if(!L){...nolex...;continue;} const line=...;if(ch+line.length>CAPC){left.push(n);continue;}rows.push(line);ch+=line.length;}`
Rows go on in verse order (`order`: pressed verses first, then the rest), each Strong's number once, until the cap. A cited number kept by ASK 558 still waits its turn in that order, so a long sheet can push it past the cap. It is then named only in "numbers over the sheet cap".

## The change (six Build nodes: D2, D3, D4, C2, C3, C4 Build; served to both sides alike)
Anchor, one occurrence in each of the six: `for(const k of order)for(const r of (IX.V[k]||[])){const n=numOf(r.strongs_number);if(!n||seen.has(n))continue;seen.add(n);if(byN[n].every(isFunc)&&!KEEP.has(n)){fw++;continue;}`
Exact change: insert directly before the anchor one first pass over the same rows that takes only the kept numbers:
`for(const k of order)for(const r of (IX.V[k]||[])){const n=numOf(r.strongs_number);if(!n||seen.has(n)||!KEEP.has(n))continue;const L=IX.X[n];if(!L)continue;seen.add(n);const line=n+' '+String(L.original_script||'').trim()+' '+String(L.transliteration||'').trim()+': '+String(L.anchor_gloss||'');if(ch+line.length>CAPC){left.push(n);continue;}rows.push(line);ch+=line.length;}`
What it does: every Strong's number a debater has cited in an earlier round (ASK 558's KEEP, read from the earlier rounds' Extract nodes) that stands in a verse of this sheet is put on first, in verse order, under the same cap and in the same line form. The second pass (today's loop) then fills the rest; `seen` keeps each number once. A kept number the lexicon does not hold is left to the second pass, which names it under "numbers the lexicon does not hold" as today.
The other 21 copies of L2C (Lexicon Plans, Extract nodes, L2 Lexicon Plan, Shared Library) do not build the served sheet (W4 10978; W1 10979) and are not changed.

## Stated effect
1. The sheet's rows are reordered when a round cites any Strong's number: cited numbers first. The set of rows changes only at the cap's edge: a cited number moves on, and an uncited number at the end may move to "numbers over the sheet cap".
2. Both sides see the same sheet, as today.
3. If the cited numbers alone exceed 26,000 characters, the excess is still left off and named; the change does not raise the cap.
4. Measured by W3 offline on W4's D2 inputs (Wall 11019): 16 uncited numbers leave the sheet at the cap's edge, among them G2316 (theos, God), a content word of Luke 1:35 ("the Son of God"). The team should read the lost list of Test 2 before the operator is asked. If a lost number matters, the remedy is the cap or the order of uncited rows, which is a separate ASK; this ASK changes only the order of cited rows.

## Revert
Restore the six Build nodes from the pre-write export; compare md5 per node.

## Test (offline on the live code, W4's harness)
1. Run 41822 D2 inputs: G1352 is on the sheet with its whole gloss ("G1352 διό dió: from διά and ὅς; through which thing, i.e. consequently:--for which cause, therefore, wherefore. [source: ...]"), and G1537 too; the sheet stays at or under 26,000 characters of rows; every number cited in CR1 and DR1 that stands in a sheet verse is on it.
2. The same at D2, D3, D4, C2, C3, C4 for run 41822: list each cited number not served, with its reason (over the cap, no lexicon row, or not in a sheet verse); and list, per sheet, every uncited number that today's sheet serves and the changed sheet leaves over the cap (W3 N1).
3. Control: inputs with no cited numbers give a sheet byte-identical to today's.
4. Every other node: md5 unchanged.
5. The live proof: the next run's D2 and later sheets carry G1352, and the Oracle's Luke 1:35 answer has an [L2] for it (ASK 557 test 3).
