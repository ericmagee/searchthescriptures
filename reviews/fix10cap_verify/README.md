# Verification of fix set 10, item 1 (eight-witness cap), commit 7e7d823

Run from `prototypes/posture_e/fix10cap` of commit 7e7d823. `row.json` is run 32404 (`debate_results` d0b583b4), built from the database.

- `node t_heads.js <dir with row.json> "new/Panel Payloads.js" DEFENDER|CHALLENGER`: prints each premise's press block and the verses counted.
- `node t_forms.js <fix10cap dir>`: runs seven press-line forms through the judges' list (Panel Payloads) and the save-body note (Build Save Body), base and new.

Results at the verifier's seat (2026-11-03):
- Builder's tests reproduce: base FAILS t_cap, t_over, t_bsb; new PASSES all three.
- Run 32404: challenger premises 1 and 3 count exactly their 8 head verses; the defender's lists count their head verses only.
- DEFECT 1 (save body): an entry whose `| [L3] ...` part wraps onto its own line is counted as a separate witness. 8 entries are reported as 16 with 8 over the cap; the judges' list counts 8 with none over.
- DEFECT 2 (both, disagreeing): a head written as a range (`Genesis 2:8-9`) counts as two verses in the judges' list and one in the save-body note; 9 range entries give "over 2:9, 2:10" in one and "over 2:9" in the other.
- Write script: reads `fix10cap/live.json`, which is not in the commit; the dry run cannot be repeated from the repository. It writes with PUT and does not publish.
