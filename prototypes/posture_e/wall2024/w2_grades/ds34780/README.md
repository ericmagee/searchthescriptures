# W2: DeepSeek enforcer items in the dry regrade 34780 (s115), hand reading; and the link 4 closing line
Source: /mnt/project-files/wall2024/ex34780_full.json. sb_items.json = Send Back Record sb_items; items_dump.txt = readable dump; round_*.txt = the rounds (Regrade Load f).

## F1 (code feeding DeepSeek, FALSE ITEMS): E-PREM block lookup uses the premise NUMBER as a LINK number
- Library line 3275 (s116), answerFor(sd,n): a block tagged "[premise n]" is taken; else an untagged block whose LINK number equals n. The list entry's own tag ("4. LINK 1: ...") is not used.
- 34780: [DR2] premise 4 is "LINK 1", premise 5 is "LINK 2". [CR3] answers them under "## LINK 1: SUPPORTED" and "## LINK 2: NARROWED TO ..." with [L1] [L2] [L3] footing (round_cr3.txt lines 84-127). The code found no LINK 4 block and the LINK 5 blocks carry [premise 1]/[premise 2] tags, so DeepSeek was shown "(no block answering this premise was found by its number or tag)" and wrote "(right: COUNTED) (UNEXHIBITED: lacks [L1], [L2], [L3])" for every seat: 6 items (luna S4 S5, sol S8 S9, terra S4 S5). Record-only trial (ruling 428).
- Effect: sol and terra KEEP. luna answered CHANGE TO "CONCEDED LINKS: 2 -- Premise 4: UNEXHIBITED ...; Premise 5: UNEXHIBITED ..."; S4/S5 are not in luna's applied list; luna's final line reads "CONCEDED LINKS: 0 -- None; premises 4 and 5 are exhibited in CR3 LINK 1 and LINK 2". No count changed.
- Stored: 20 "no block" E-PREM items in inputs/; in 19 the list entry tags a LINK other than its number (same fault); 1 has a bold head the tag reader may miss. Whether each named block exists in the answering round: not read by me (second seat to check).
- Fix sketch (not built): when no tagged block, take the LINK k of the list entry and find the untagged LINK k block. Changes DeepSeek's item text only when the case occurs.

## F2 (DeepSeek reading, FALSE ITEM, ENFORCED): sol S6, E-HOLD D3 vs C3
- DeepSeek "(right: BROKEN)" forces D3 vs C3 with the [CR3] Matthew 1:25 answer (a LINK 1 timing answer), calls it "graded MISSES", and writes MEANS [CR3] (the MEANS is [DR2]). In the same run it graded that same answer MEETS (sol S2) and the D1 vs C3 FORCED line on it STANDS (sol S4, S5).
- Enforced through pkgUND ("A KEEP does not cure this item"): sol rewrote the line and kept UNDERDETERMINED; CURED. No count.
- Covered by no package. One case; record.

## Items read as right (not faults)
- E-ANS luna S1 S2 (Hebrews 2:16, MEETS), luna S3 (Genesis 3:15, MEETS), terra S1 S2 (Matthew 1:20, Luke 2:48: the judge's ANSWER quoted only the verse; the side's real answer exists), sol S2 (Matthew 1:25 MEETS: the answer grants the bound; arguable).
- E-PREM luna S6 S7 (challenger premises 4 and 5 VOID: "only" added): right. sol S7, terra S3 (defender premise 2 VOID; ASSUMES "carried apart from the fathers" beyond the quote): right.
- E-COL D1 vs C3 (7): DeepSeek reads STANDS because the judges' break rests on the CR2/CR4 contradiction, not on answer words; consistent with the rule. The engine breaks D1 anyway. pkgECB withholds the engine-marked lines; a judge's own BROKEN line is still sent (stated pkgECB limit). Record only.
- K-W #4 (luna, terra; TRIAL): DeepSeek NEEDS YES: the CR4 words deny the CR2 grant; the judges' "REASSERTED IN CR4" cure passes by form (pkgKWQ limit: form only). The contradiction is the confirmed closing break.

## Link 4 closing line (for W3's ruling)
- Both runs put the same candidate J1 with the same quotations: EARLIER [CR2] "The 'her seed' of Genesis 3:15 fits and is not an independent proof." CLOSING [CR4] "Genesis 3:15 carries my D4 on its own words." 34726: CONFIRMED. 34780: NOT A CONTRADICTION. Same code path; the difference is the DeepSeek answer alone (the stated limit: answers differ between sends).
- Hand reading (W2): [CR2] narrows D4: "It supports the chain and does not carry it alone"; under it Genesis 3:15 "fits and is not an independent proof" (of the exclusion, as "D4 fits the exclusion and does not state it" for Galatians 4:4). [CR4] says Genesis 3:15 carries "my D4", the narrowed supporting link, on its own words. That does not assert again that it proves the exclusion independently. I read it NOT A CONTRADICTION; the 34726 confirmation doubtful. Borderline: "on its own words" can be read as independent proof.
