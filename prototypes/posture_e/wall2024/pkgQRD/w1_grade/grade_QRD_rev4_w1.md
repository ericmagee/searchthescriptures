# pkgQRD rev 4 grade, W1 (seat 34), 11:36 CST 11-10

Build: pkgQRD/parent_s110_QRD.json, W2 commit 4c7216b5, on live s110. Labels: D1-D7 8a73c5b8, D8-D10 52a6f01a, D11 (before its first run), matrix section M 1ccd28e9.

RESULT: FAIL.
- D1 to D11: 26 OK, 0 FAIL (w1_QRD_rev4_out.txt). QR Check 6,026 to 7,333; QR Final 7,842 to 8,116 (measured). D11 now: live 2, candidate 1.
- Matrix (w1_QRD_matrix.cjs, outputs matrix_rev4_out_0..3.txt; live counts matrix_live_counts_*.txt): 93,312 cases (both sides, 46,656 each).
  LOSS 1,176 (a passage live leaves with an asker is left with none); allowed drops 5,088; unexplained drops 0; other-side drops 0; fail-closed 0.

Cause, in every LOSS line printed (228 of 1,176; the runner prints the first 60 per shard): the redirected judge's closing passage is WIDER than
the standing judge's (it contains it and more). Example: luna asks A, chatgpt asks A and B as one passage, sol asks B but is faulted and its
second reply fails. Live: chatgpt still asks about B (1). Rev 4: chatgpt is redirected against luna (its passage contains luna's) and switches;
nobody asks about B (0). The same on the challenger side (AB/A/AB with luna faulted).
Patterns: C/B/AB, C/A/AB, B/AB/A, A/AB/A, A/AB/B, B/AB/B, AB/B/AB, AB/A/AB (luna/chatgpt/sol first passages).

What would close it (W2's to build; my reading): redirect a judge only when both its quotes lie inside the standing judge's quotes
(narrower or equal), never when they are wider. The standing judge then asks everything the redirected judge asked.
