# pkgBMH (ASK 189 option 1) - barred-move harvest reads "no verse that states" and "Against C<n>/D<n>" headings
Base: live s179 (n8n 25da10ec). Parent: /mnt/project-files/wall2024/parent_s179_BMH.json (sha256 prefix a25848fec01f7004).
Change, in 14 inline nodes (C1B..C4B, D2B..D4B; Build and Extract), +41 chars each, +574 total, prompt 0:
- AB: `\bno\s+(?:verse|row|text|word|witness)s?\s+(?:` + `(?:(?:that|which)\s+)?` + `states?...`
- ANS: add `\bagainst\s+[CD]\d|`
Other 429 nodes, connections and settings byte-equal to s179. Revert = s179 fetchback.
Checks: build.py (asserts each old line once per node), wrongif.cjs (36212 CR2 hit, DR2 none), bmh_replay.cjs
(50 rows with BARRED MOVE in review_notes; 31 rounds prefiltered by SQL for either pattern; others cannot change;
live 0 hits, candidate 1, lost 0, new 1 = the 36212 CR2 sentence).

## rev 2 (after W3 FAIL Wall 5727, W4 FAIL Wall 5725)
Drift: rev 1 replay took only the 50 BARRED MOVE rows; on the full population the "Against C/D" heading widening added 36 non-demand hits.
Counter-measure: replay on W4's full population file (/mnt/project-files/w4/bmh/cols.json, 111 rounds prefiltered from 854 rows).
Change (build2.py), 14 nodes, +175 each, +2,450 total, prompt 0:
- A as rev 1 ("no verse (that|which) states").
- "Against C<n>/D<n>" heading opens a block (ag) in which only a phrase starting "no" (the no-verse-states form) is harvested; the ag block ends at the next answer line, so the answer blocks under it keep full live scope.
- GIVE: "I rest on no" is a defender's own rest, not a demand.
Parent: /mnt/project-files/wall2024/parent_s179_BMH2.json. replay2.cjs: each of the 14 nodes, live vs candidate, lost 0, new 6.
