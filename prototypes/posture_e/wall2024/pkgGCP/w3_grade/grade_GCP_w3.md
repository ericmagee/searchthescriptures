# W3 grade of pkgGCP rev 1b (W1; Wall 4298 and commit 7e67b74a; path 2 of my sweep: a cure-step count that is never revisited)

## RESULT: PASS, with four limits that must be written in the manual section
Graded file: /mnt/project-files/wall2024/parent_s111_GCP.json, sha256 starting 97adac84c60b4d13, equal to pkgGCP/parent_s111_GCP.json at commit 7e67b74a. W1 replaced rev 1 (f2a098b2, +2,470) with rev 1b before my first run; every run below is on rev 1b. Labels: pkgGCP/w3_grade/labels_GCP_w3.md, committed before any run (fde7c6bb), addendum committed before the second round.

## Size (measured by me against the s111 fetch-back)
+1,965 code, Shared Library only (917,020 to 918,985). 418 nodes, connections equal, every other node field equal. No prompt text.

## Method
My chain replay of execution 34626 on s111 (code nodes Panel Cure Check to Replay Rows), stored replies remapped to the s111 item numbers, one run per process, read at the written rows and at Gate Record. Control on s111: luna 1, terra 0, sol 0. W1's own runs use the stored replies without remapping (control luna 11); mine do not depend on that. Plants: a BROKEN collision line with one layer kind written into the judge text before the send-back record is read (so the engine's re-read raises K-B and K-G4 on it), a counted cure report line in the real stored form, and changes to the send-back items. Then Gate Record of live and of the candidate alone on the stored inputs of runs 33371 and 33490 (W4's exports, Wall 4302), which hold the real cases.

## Cases (live s111 count, candidate count; label; verdict). Output: pkgGCP/w3_grade/w3_gcp_out.txt
- L0 no plant: rows equal. PASS.
- P1 line replaced by an applied send-back change, raised before, not after: 2, 1, one mark. Label off. PASS.
- P2 the applied change's new line still breaks the rule: 2, 2. Label stays. PASS.
- P3 silence ("WHY: no written response"): 2, 2. PASS.
- P4 K-RUL trial silence form: 2, 2. PASS.
- P5 K-C NOT COUNTED: 1, 1. PASS.
- P6r report names a line no change replaced: 2, 2. PASS. (P6 as first planted named a line a gate change does replace; my plant fault; it came off, which is right for that plant.)
- P7r both changes to the line answered KEEP: 2, 2. PASS. (P7 as first planted left another applied change on the line; my plant fault.)
- P8 line replaced by an applied GATE change: 2, 1. Label off. PASS.
- P9 the report line written inside the judge's own text: 1, 1. PASS; a judge cannot take a count off by writing the line.
- P10c the change renames the pair: the engine does not apply it (the existing rule against dropping a collision); 3, 3. PASS. A destroyed line cannot be applied, so it cannot be forgiven.
- P11 two rules on one pair, both cleared: 3, 1, two marks. PASS.
- P12 one pair cleared, one still broken: 4, 3, one mark. PASS.
- P13 gate skipped: 2, 1, one mark. PASS.
- P14a the seat's only count is the planted cure count: 1, 0; live builds an alternate for luna, the candidate builds none and writes luna's row with count 0 and no ALTERNATE TRIED line. This is the intended effect on a removal. PASS. (P14 and P14r on sol: my plant did not raise the rule; not counted as a case.)
- P17 with a counted send-back line that pkgGCC narrow takes off at the gate: 2, 1; each count comes off once; no double. Record.
- P18 the same item reported twice: 3, 2, one off. Record.
- P19 K-S3 last number, line replaced without a cure while another K-S3 line is cured: 2, 2. PASS.
- Gate rows and send-back rows are equal to live in every case; no log row changes, so no rolled-back insert is owed. The only row difference is the count, the v52 mark and, where a removal changes, the ALTERNATE TRIED line.

## Real stored cases (pkgGCP/w3_grade/stored_gate_out.txt and the two diag files)
- Run 33490, seat gemini (the stored run counted 12; live s111 on the stored inputs counts 8; candidate 2). Six cure counts come off: K-G4 and K-F on D1 vs C1, D2 vs C2 and D4 vs C6. I read each by hand: the judge's CHALLENGER LINK BROKEN line and its FORCED line were replaced by an applied gate change with an UNDERDETERMINED line that states what the record leaves open and quotes an [L1]; the re-read raises neither rule on the pair afterwards. All six are true corrections. K-G4 on D3 vs C3 stays (still raised; right). The seat is still removed (2). No stored removal changes.
- Run 33371, seat terra (seat key chatgpt): the K-G4 count on D5 vs C4 STAYS, 6 and 6. The applied send-back line reads "The timing press was left unanswered" with no quoted pressing sentence and round, and the re-read still raises K-G4. This is right, and it corrects my sweep, which said the line was rewritten with the pressing sentence (I took that from the send-back row's CURED status, not from the line).
- Alt Gate Record on the stored inputs of both runs, and Gate Record on 34626 and 34299 stored inputs: candidate output equal to live.

## Limits (not failures; live behaviour is unchanged for each; they must be in the manual section)
1. The count comes off only for rules whose item is a collision pair and whose report LINE is the judge's own line: K-B, K-G1, K-G4, and K-F when the FORCED line itself is replaced. 
2. K-G3 (standing) is cleared by a field change and has no LINE: it stays counted although the re-read no longer raises it (run 33490, gemini, 1 count).
3. K-S3 stays counted even when an applied change ends the judge's line with COUNTED (P20: 2, 2). Two causes: the report LINE is written "DEFENDER CR4: ..." while the judge's line is "DEFENDER | CR4 | ..."; and the engine numbers K-S3 items by position, so after one is cured the numbers shift. The second cause means K-S3 must NOT be opened by loosening the line match alone: P19 would then come off wrongly.
4. A K-F count stays when the collision line is changed but an orphan FORCED line is left and still raises K-F (P16b: 2, 2). Rules the re-read does not produce (K-W, K-V, K-CON, K-CMT, K-RUL and others) never come off, as W1 states.
Notes, no action asked: the report line's SEAT is not compared with the seat (P15; cannot occur in a real row). The alternate copies are inert in practice, because an alternate with a cure count is not seated.

## Would a smaller form do
No. Rev 1b (+1,965) is already rev 1 less 505. What is left is the function (about 1,750) and its two call sites. Each guard is needed by a case above: the line match (P6r, P19), the before and after re-read (P2, P12, 33371), the silence and NOT COUNTED filters (P3, P5), the gate-skip call (P13). Shortening the mark text would save under 100 characters.

## Not reached by me
A real alternate or round 2 alternate reply carrying a cure count; a live run. The rule itself (a count comes off once a later applied change corrects the line; silence stays counted) is the operator's to approve; this grade says only that the code does what W1's rule says.
