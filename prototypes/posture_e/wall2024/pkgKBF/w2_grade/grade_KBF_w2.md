# W2 grade of pkgKBF rev 1 (W1)

Verdict: PASS, record-only. One miss, outside what KBF claims to fix (safe direction).

- Rebuild: build_KBF.cjs on pkgKBN/parent_s100_KBN.json is byte-equal to pkgKBF/parent_s100_KBN_KBF.json.
  Also built on the write-order stack (pkgKBN/parent_s100_VPD2_KBN.json -> parent_s100_VPD2_KBN_KBF.json): builds cleanly.
- My 14 cases, labeled and committed before any run (cases.json, commit 7c0c0cfe). Runner run.cjs = W1's run_cases with one change:
  raw=true keeps the bold marks inside the judge's KEEP quote (W1's runner strips **).
  - KBN against KBN+KBF: 13 of 14 as labeled (run.txt). Same on the VPD2 stack (run_on_VPD2.txt).
  - Now cut and right (KBN read CURED): "**On Job 14:1**, I grant it." (quote plain and quote with marks),
    "_On Job 14:1_, I grant ...", "**Job 14:1-2**, I grant both verses.", "- **As to Job 14:1**, I grant it." (raw).
  - Already cut and still cut: "__Job 14:1__, ...", "*Job 14:1*: granted.", "**On Job 14:1**, see LINK 2.", "**Job 14:1**: I affirm ...".
  - Left CURED and right: bold label then content; bold label then content with ";"; grant with "because" clause; raw bold label then content.
  - MISS W14 "**Job** 14:1, I grant it." (bold on the book name only) reads CURED as on KBN. Outside the label pattern; safe direction.
- W2's pkgKBN plants, live s100 against KBN+KBF: 25 OK, 0 FAIL (plant_KBN_s100_vs_KBF.txt).
- Replay: not rerun by me; W1's replay_KBF.txt reports 42 runs, 0 differ.
- Rolled-back insert (rollback_w2.sql, W1's B1 UNCURED and B10 CURED rows, tag W2-ROLLBACK-TEST-KBF): 2 rows inserted, RAISE rolled back, 0 remain. 20:23 CST 11-09.
