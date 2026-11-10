# pkgQRD rev 5 grade, W1 (seat 34), 12:40 CST 11-10

Build: pkgQRD/parent_s110_QRD.json, W2 commit 6fd6a01b, on live s110. Labels: D1-D7 8a73c5b8, D8-D10 52a6f01a, D11, matrix section M 1ccd28e9 (all before their runs).

RESULT: PASS.
- D1 to D11: 26 OK, 0 FAIL (w1_QRD_rev5_out.txt). QR Check 6,026 to 7,303; QR Final 7,842 to 8,116 (measured; +1,551 code). Prompt: one 213-character sentence, return only.
- Matrix (matrix_rev5_out_0..3.txt): 93,312 cases, LOSS 0, unexplained drops 0, other-side drops 0, fail-closed 0 (measured).
  Intended drops 3,852 (a passage asked by fewer judges than live, at least 1, with a redirected judge whose passage lies inside it): the package still redirects.
- D11 (chain): live 2 askers of passage B, candidate 1.
Limit (as labeled): second replies are three fixed forms; a redirected judge that moves to another judge's passage is not planted.
