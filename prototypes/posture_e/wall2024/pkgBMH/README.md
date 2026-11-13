# pkgBMH (ASK 189 option 1) - barred-move harvest reads "no verse that states" and "Against C<n>/D<n>" headings
Base: live s179 (n8n 25da10ec). Parent: /mnt/project-files/wall2024/parent_s179_BMH.json (sha256 prefix a25848fec01f7004).
Change, in 14 inline nodes (C1B..C4B, D2B..D4B; Build and Extract), +41 chars each, +574 total, prompt 0:
- AB: `\bno\s+(?:verse|row|text|word|witness)s?\s+(?:` + `(?:(?:that|which)\s+)?` + `states?...`
- ANS: add `\bagainst\s+[CD]\d|`
Other 429 nodes, connections and settings byte-equal to s179. Revert = s179 fetchback.
Checks: build.py (asserts each old line once per node), wrongif.cjs (36212 CR2 hit, DR2 none), bmh_replay.cjs
(50 rows with BARRED MOVE in review_notes; 31 rounds prefiltered by SQL for either pattern; others cannot change;
live 0 hits, candidate 1, lost 0, new 1 = the 36212 CR2 sentence).
